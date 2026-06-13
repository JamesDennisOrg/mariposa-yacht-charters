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
        process.env.MYC_POSTGRES_PRISMA_URL ||
        process.env.DATABASE_URL ||
        process.env.MYC_POSTGRES_URL ||
        '',
      max: 5,
      idleTimeoutMillis: 10000,
      connectionTimeoutMillis: 5000,
    },
    push: true,
  }),

  plugins:
    process.env.NODE_ENV === 'production'
      ? [
          s3Storage({
            collections: {
              media: true,
            },
            bucket: 'media',
            config: {
              endpoint: `${process.env.NEXT_PUBLIC_MYC_SUPABASE_URL}/storage/v1/s3`,
              region: 'us-east-1',
              // Enforces direct database role verification to authorize S3 signature validation handshakes
              credentials:
                typeof window === 'undefined'
                  ? {
                      accessKeyId: process.env.MYC_POSTGRES_USER || 'postgres',
                      secretAccessKey: process.env.MYC_POSTGRES_PASSWORD || '',
                    }
                  : {
                      accessKeyId: 'mock',
                      secretAccessKey: 'mock',
                    },
              forcePathStyle: true, // Mandated configuration property rule for Supabase instances
            },
          }),
        ]
      : [],
})
