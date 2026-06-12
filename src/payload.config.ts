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
      // 1. Force Vercel to check the transaction pooler URL first to stop EMAXCONNSESSION errors
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
              credentials:
                typeof window === 'undefined'
                  ? {
                      // Strips the "sb_" tokens so the AWS SDK reads the raw cryptographic keys smoothly
                      accessKeyId: (
                        process.env.NEXT_PUBLIC_MYC_SUPABASE_PUBLISHABLE_KEY || ''
                      ).replace('sb_publishable_', ''),
                      secretAccessKey: (process.env.MYC_SUPABASE_SECRET_KEY || '').replace(
                        'sb_secret_',
                        '',
                      ),
                    }
                  : {
                      accessKeyId: 'mock',
                      secretAccessKey: 'mock',
                    },
              forcePathStyle: true,
            },
            // Crucial: Overwrites Payload's default local directory routing
            // and forces the admin dashboard to fetch thumbnails directly from your public Supabase Storage CDN!
            prefix: `${process.env.NEXT_PUBLIC_MYC_SUPABASE_URL}/storage/v1/object/public/media`,
          }),
        ]
      : [],
})
