import { postgresAdapter } from '@payloadcms/db-postgres'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import path from 'path'
import { buildConfig } from 'payload'
import { fileURLToPath } from 'url'
import { Media } from './collections/Media'

import { Users } from './collections/Users'
import { Itineraries } from './collections/Itineraries'
import { Bookings } from './collections/Bookings'
import { BlockedDates } from './collections/BlockedDates'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfig({
  admin: {
    user: Users.slug,
    meta: {
      titleSuffix: '- Mariposa Charters Admin',
    },
  },
  collections: [
    Users,
    Itineraries, // Registered Itineraries
    Bookings, // Registered Bookings
    BlockedDates, // Admin usage for boat maintenence etc
    Media,
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
      max: 5,
      idleTimeoutMillis: 10000,
      connectionTimeoutMillis: 5000,
    },
    push: true,
  }),
})
