import { CollectionConfig } from 'payload'

export const Media: CollectionConfig = {
  slug: 'media',
  access: {
    read: () => true,
    create: ({ req: { user } }) => Boolean(user),
    update: ({ req: { user } }) => Boolean(user),
    delete: ({ req: { user } }) => Boolean(user),
  },
  admin: {
    useAsTitle: 'filename',
  },

  hooks: {
    beforeChange: [
      async ({ data, req, operation }) => {
        // Intercept new file uploads strictly on live production (Vercel serverless threads)
        if (process.env.NODE_ENV === 'production' && operation === 'create' && req.file) {
          try {
            const supabaseUrl = process.env.NEXT_PUBLIC_MYC_SUPABASE_URL
            const serviceKey =
              process.env.MYC_SUPABASE_SECRET_KEY || process.env.MYC_SUPABASE_SERVICE_ROLE_KEY

            if (supabaseUrl && serviceKey) {
              // The secure authenticated object endpoint route inside your public 'media' bucket
              const uploadUrl = `${supabaseUrl}/storage/v1/object/media/${data.filename}`

              // Cast req.file to any to access the direct internal data buffer payload safely
              const fileObj = req.file as any
              const fileBuffer = fileObj.buffer

              if (fileBuffer) {
                // Post the raw file data binary stream straight over HTTP to Supabase Storage
                const response = await fetch(uploadUrl, {
                  method: 'POST',
                  headers: {
                    Authorization: `Bearer ${serviceKey}`,
                    'Content-Type': fileObj.mimetype || 'image/jpeg',
                  },
                  body: fileBuffer,
                })

                if (!response.ok) {
                  const errText = await response.text()
                  console.error('Supabase storage write rejected:', errText)
                }
              }
            }
          } catch (err) {
            console.error('Fatal stream interception failure:', err)
          }
        }
        return data
      },
    ],
    afterRead: [
      ({ doc }) => {
        // Completely format all visual path targets for the browser bundle in production
        if (process.env.NODE_ENV === 'production' && doc.filename) {
          const publicCdnBase = `${process.env.NEXT_PUBLIC_MYC_SUPABASE_URL}/storage/v1/object/public/media/${doc.filename}`

          // 1. Rewrite primary asset URL string target
          doc.url = publicCdnBase

          // 2. Rewrite row thumbnail preview image path targets expected by Payload admin lists
          doc.thumbnailURL = publicCdnBase
          doc.thumbnail_u_r_l = publicCdnBase

          // 3. Clear out missing internal serverless responsive sub-sizes mappings smoothly
          doc.sizes = {}
        }
        return doc
      },
    ],
  },

  // Use a conditional assignment to satisfy Vercel's read-only compilation requirements
  upload:
    process.env.NODE_ENV === 'production'
      ? {
          // Production mode settings (Prevents Vercel disk-writer compilation crashes)
          disableLocalStorage: true,
          mimeTypes: ['image/*'],
        }
      : {
          // Your working local development configuration
          staticDir: 'public/media',
          imageSizes: [
            {
              name: 'thumbnail',
              width: 400,
              height: 300,
              position: 'centre',
            },
            {
              name: 'hero',
              width: 1920,
              height: 1080,
              position: 'centre',
            },
          ],
          mimeTypes: ['image/*'],
        },
  fields: [
    {
      name: 'alt',
      type: 'text',
      required: true,
      label: 'Alternative Text (For Screen Readers / SEO)',
    },
  ],
}
