import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ payload, req }: MigrateUpArgs): Promise<void> {
  await payload.db.drizzle.execute(sql`
    -- 1. Create the master media asset storage table first
    CREATE TABLE IF NOT EXISTS "media" (
      "id" serial PRIMARY KEY NOT NULL,
      "alt" varchar NOT NULL,
      "updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
      "created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
      "url" varchar,
      "filename" varchar,
      "mime_type" varchar,
      "filesize" numeric,
      "width" numeric,
      "height" numeric,
      "sizes_thumbnail_url" varchar,
      "sizes_thumbnail_filename" varchar,
      "sizes_thumbnail_mime_type" varchar,
      "sizes_thumbnail_filesize" numeric,
      "sizes_thumbnail_width" numeric,
      "sizes_thumbnail_height" numeric,
      "sizes_thumbnail_sizes_hero_url" varchar,
      "sizes_thumbnail_sizes_hero_filename" varchar,
      "sizes_thumbnail_sizes_hero_mime_type" varchar,
      "sizes_thumbnail_sizes_hero_filesize" numeric,
      "sizes_thumbnail_sizes_hero_width" numeric,
      "sizes_thumbnail_sizes_hero_height" numeric
    );

    -- 2. Create the sub-table that maps the array collection for itinerary galleries
    CREATE TABLE IF NOT EXISTS "itineraries_gallery_images" (
      "_order" integer NOT NULL,
      "_parent_id" integer NOT NULL,
      "id" varchar PRIMARY KEY NOT NULL,
      "image_id" integer NOT NULL
    );

    -- 3. Inject the new featuredImage relational column into your existing itineraries table
    ALTER TABLE "itineraries" ADD COLUMN IF NOT EXISTS "featured_image_id" integer;

    -- 4. Secure the network foreign key constraints smoothly
    ALTER TABLE "itineraries_gallery_images" ADD CONSTRAINT "itineraries_gallery_images_parent_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."itineraries"("id") ON DELETE cascade ON UPDATE no action;
    ALTER TABLE "itineraries_gallery_images" ADD CONSTRAINT "itineraries_gallery_images_image_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE cascade ON UPDATE no action;
    ALTER TABLE "itineraries" ADD CONSTRAINT "itineraries_featured_image_fk" FOREIGN KEY ("featured_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;

    -- 5. Establish modern indexes to optimize data queries across the web
    CREATE INDEX IF NOT EXISTS "media_updated_at_idx" ON "media" USING btree ("updated_at");
    CREATE INDEX IF NOT EXISTS "media_created_at_idx" ON "media" USING btree ("created_at");
    CREATE INDEX IF NOT EXISTS "itineraries_gallery_images_order_idx" ON "itineraries_gallery_images" USING btree ("_order");
    CREATE INDEX IF NOT EXISTS "itineraries_gallery_images_parent_idx" ON "itineraries_gallery_images" USING btree ("_parent_id");
    CREATE INDEX IF NOT EXISTS "itineraries_gallery_images_image_idx" ON "itineraries_gallery_images" USING btree ("image_id");
    CREATE INDEX IF NOT EXISTS "itineraries_featured_image_idx" ON "itineraries" USING btree ("featured_image_id");
  `)
}

export async function down({ payload, req }: MigrateDownArgs): Promise<void> {
  // Safe cleanup parameters
  await payload.db.drizzle.execute(sql`
    DROP TABLE IF EXISTS "itineraries_gallery_images" CASCADE;
    DROP TABLE IF EXISTS "media" CASCADE;
    ALTER TABLE "itineraries" DROP COLUMN IF EXISTS "featured_image_id";
  `)
}
