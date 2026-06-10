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
  ],
}
