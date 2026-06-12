'use client'

import { CollectionConfig } from 'payload'

export const Itineraries: CollectionConfig = {
  slug: 'itineraries',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'price', 'duration'],
  },
  access: {
    read: () => true, // Publicly available for the website
  },
  fields: [
    { name: 'title', type: 'text', required: true },
    { name: 'description', type: 'textarea', required: true },
    { name: 'duration', type: 'number', required: true, label: 'Duration (Hours)' },
    { name: 'price', type: 'number', required: true, label: 'Price (USD)' },
    {
      name: 'featuredImage',
      type: 'relationship',
      relationTo: 'media', // Binds this target pointer to items uploaded in your new Media collection
      required: false, // Safe fallback padding
      label: 'Featured Itinerary Brochure Image',
    },
    {
      name: 'galleryImages',
      type: 'array',
      label: 'Excursion Detail Gallery Photos',
      labels: {
        singular: 'Gallery Photo',
        plural: 'Gallery Photos',
      },
      admin: {
        description:
          'Add multiple high-resolution photos of the yacht and destinations for the detail page gallery.',
      },
      fields: [
        {
          name: 'image',
          type: 'relationship',
          relationTo: 'media',
          required: true,
          label: 'Select Photo Asset',
        },
      ],
    },
  ],
}
