import { postgresAdapter } from '@payloadcms/db-postgres'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import path from 'path'
import { buildConfig } from 'payload'
import { fileURLToPath } from 'url'

import { Users } from './collections/Users'
import { Itineraries } from './collections/Itineraries'
import { Bookings } from './collections/Bookings'
import { BlockedDates } from './collections/BlockedDates'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfig({
  admin: {
    user: Users.slug,
    // Forces Next.js/Vercel to bundle the entire generated admin area dynamically
    // bundler: 'vite',
    meta: {
      titleSuffix: '- Mariposa Charters Admin',
    },
  },
  collections: [
    Users,
    Itineraries, // Registered Itineraries
    Bookings, // Registered Bookings
    BlockedDates, // Admin usage for boat maintenence etc
  ],
  editor: lexicalEditor({}),
  secret: process.env.PAYLOAD_SECRET || '',
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  db: postgresAdapter({
    pool: {
      connectionString:
        process.env.DATABASE_URL ||
        process.env.MYC_POSTGRES_URL_NON_POOLING ||
        process.env.MYC_POSTGRES_URL ||
        '',
    },
    push: true,
  }),
})
