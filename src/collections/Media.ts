// src/collections/Media.ts
import { CollectionConfig } from 'payload'

export const Media: CollectionConfig = {
  slug: 'media',
  access: {
    read: () => true, // Publicly readable so your frontend can render the images
    create: ({ req: { user } }) => Boolean(user), // Restrict uploads to logged-in Admin profiles
    update: ({ req: { user } }) => Boolean(user),
    delete: ({ req: { user } }) => Boolean(user),
  },
  admin: {
    useAsTitle: 'filename',
  },
  // Enables Payload's native upload engine logic for this collection
  upload: {
    staticDir: 'public/media', // Saves physical files into your local public folder
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
    mimeTypes: ['image/*'], // Limit collection strictly to graphic image assets
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
