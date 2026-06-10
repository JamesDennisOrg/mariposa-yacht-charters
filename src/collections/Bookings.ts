import { CollectionConfig } from 'payload'

export const Bookings: CollectionConfig = {
  slug: 'bookings',
  admin: {
    useAsTitle: 'customerName',
    defaultColumns: ['bookingDate', 'customerName', 'status'],
  },
  access: {
    read: ({ req: { user } }) => Boolean(user), // Locked to Admin
    create: () => true, // Public checkout can write here
    update: ({ req: { user } }) => Boolean(user),
  },
  fields: [
    {
      name: 'bookingDate',
      type: 'date',
      required: true,
      admin: { date: { pickerAppearance: 'dayOnly' } },
    },
    {
      name: 'status',
      type: 'select',
      defaultValue: 'PENDING',
      options: [
        { label: 'Pending', value: 'PENDING' },
        { label: 'Confirmed', value: 'CONFIRMED' },
        { label: 'Cancelled', value: 'CANCELLED' },
      ],
      required: true,
    },
    { name: 'itinerary', type: 'relationship', relationTo: 'itineraries', required: true },
    { name: 'customerName', type: 'text', required: true },
    { name: 'customerEmail', type: 'email', required: true },
    { name: 'customerPhone', type: 'text', required: true },
    { name: 'guestCount', type: 'number', required: true },
    { name: 'stripeSessionId', type: 'text', admin: { readOnly: true } },
  ],
}
