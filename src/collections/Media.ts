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
    // Keeps only the public CDN url formatter active for production environments
    afterRead: [
      ({ doc }) => {
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
          disableLocalStorage: true, // Prevents serverless disk-write compilation crashes
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
