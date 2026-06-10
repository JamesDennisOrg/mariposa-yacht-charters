import { CollectionConfig } from 'payload'

export const BlockedDates: CollectionConfig = {
  slug: 'blocked-dates',
  admin: {
    useAsTitle: 'date',
  },
  access: {
    read: () => true, // Public calendar needs to see what dates are blocked
  },
  fields: [
    {
      name: 'date',
      type: 'date',
      required: true,
      unique: true,
      admin: {
        date: {
          pickerAppearance: 'dayOnly',
        },
      },
    },
    {
      name: 'reason',
      type: 'text',
      admin: {
        placeholder: 'e.g., Engine maintenance or private use',
      },
    },
  ],
}
