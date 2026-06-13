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
      max: process.env.NODE_ENV === 'production' ? 5 : 20, //Set to 5 for vercel connection limits / 20 for local dev
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
              // Enforces direct cryptographic S3 validation handshake routing
              credentials:
                typeof window === 'undefined'
                  ? {
                      // 1. Paste your exact uppercase "Access Key ID" string from Supabase here:
                      accessKeyId: '4008e9573075c4df51dfa6bcc43c7559',

                      // 2. Paste your exact "Secret Access Key" string from Supabase here:
                      secretAccessKey:
                        'd22bc47ac2a2b586ab5b3db750ad66e29adf59ab8426d14a1d5428dd0d08e2a7',
                    }
                  : {
                      accessKeyId: 'mock',
                      secretAccessKey: 'mock',
                    },
              forcePathStyle: true,
            },
          }),
        ]
      : [],
})
