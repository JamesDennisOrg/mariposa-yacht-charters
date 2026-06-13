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
    beforeOperation: [
      async ({ args, operation }) => {
        // Intercept file payloads natively at the beginning of form submissions in production
        if (process.env.NODE_ENV === 'production' && operation === 'create' && args.req?.file) {
          try {
            const supabaseUrl = process.env.NEXT_PUBLIC_MYC_SUPABASE_URL
            const serviceKey =
              process.env.MYC_SUPABASE_SECRET_KEY || process.env.MYC_SUPABASE_SERVICE_ROLE_KEY

            const fileObj = args.req.file as any

            if (supabaseUrl && serviceKey && fileObj) {
              const filename = args.data?.filename || fileObj.name || fileObj.filename
              const uploadUrl = `${supabaseUrl}/storage/v1/object/media/${filename}`

              // Pack the raw file data using standard web Blob parameters to safely handle serverless stream pipes
              const fileBlob = new Blob([fileObj.buffer || fileObj], {
                type: fileObj.mimetype || 'image/jpeg',
              })

              // Stream the data securely over HTTP using standard web protocols
              const response = await fetch(uploadUrl, {
                method: 'POST',
                headers: {
                  Authorization: `Bearer ${serviceKey}`,
                  apiKey: serviceKey, // Crucial: Satisfies Supabase's native REST JWT gateway token checks
                  'Content-Type': fileObj.mimetype || 'image/jpeg',
                },
                body: fileBlob,
              })

              if (!response.ok) {
                const errText = await response.text()
                console.error('Supabase storage write rejected:', errText)
              }
            }
          } catch (err) {
            console.error('Fatal serverless storage upload stream failure:', err)
          }
        }
        return args
      },
    ],
    afterRead: [
      ({ doc }) => {
        // Force fully format ALL visual asset paths to read directly from your public Supabase bucket CDN
        if (process.env.NODE_ENV === 'production' && doc.filename) {
          const publicCdnUrl = `${process.env.NEXT_PUBLIC_MYC_SUPABASE_URL}/storage/v1/object/public/media/${doc.filename}`

          doc.url = publicCdnUrl
          doc.thumbnailURL = publicCdnUrl
          doc.thumbnail_u_r_l = publicCdnUrl
          doc.sizes = {}
        }
        return doc
      },
    ],
  },

  upload:
    process.env.NODE_ENV === 'production'
      ? {
          disableLocalStorage: true, // Safeguards Vercel's read-only file system
          mimeTypes: ['image/*'],
        }
      : {
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
