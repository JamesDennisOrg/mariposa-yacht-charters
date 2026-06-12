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

import { cloudStoragePlugin } from '@payloadcms/plugin-cloud-storage'
import { s3Storage } from '@payloadcms/storage-s3'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfig({
  admin: {
    user: Users.slug,
    meta: {
      titleSuffix: '- Mariposa Charters Admin',
    },
  },
  collections: [Users, Itineraries, Bookings, BlockedDates, Media],
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

  // 2. Add the dynamic plugins array block underneath your database adapter configurations
  plugins:
    process.env.NODE_ENV === 'production'
      ? [
          s3Storage({
            collections: {
              media: true,
            },
            bucket: 'media',
            config: {
              endpoint: `https://${process.env.MYC_POSTGRES_HOST?.replace('db.', '')}.supabase.co/storage/v1/s3`,
              region: 'us-east-1',
              credentials: {
                accessKeyId: process.env.NEXT_PUBLIC_MYC_SUPABASE_PUBLISHABLE_KEY || '',
                secretAccessKey: process.env.MYC_SUPABASE_SECRET_KEY || '',
              },
              forcePathStyle: true,
            },
          }),
        ]
      : [],
})
