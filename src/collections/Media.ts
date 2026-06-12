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
    afterRead: [
      ({ doc }) => {
        if (process.env.NODE_ENV === 'production' && doc.filename) {
          // Replaces the broken local /media/ path with your live, public Supabase asset endpoint URL!
          doc.url = `${process.env.NEXT_PUBLIC_MYC_SUPABASE_URL}/storage/v1/object/public/media/${doc.filename}`
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
