import { getPayload } from 'payload'
import config from '@/payload.config'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { Clock4, LucideCheckCircle, LucideDollarSign } from 'lucide-react'

interface ExcursionPageProps {
  params: Promise<{ id: string }>
}

export default async function ExcursionDetailPage({ params }: ExcursionPageProps) {
  const { id } = await params
  const payloadConfig = await config
  const payload = await getPayload({ config: payloadConfig })

  let excursion
  try {
    excursion = await payload.findByID({
      collection: 'itineraries',
      id: Number(id),
      depth: 1, // Hydrates both featuredImage and the galleryImages media arrays completely
    })
  } catch (error) {
    return notFound()
  }

  // Safely extract the primary featured image fallback banner
  const hasFeaturedImage = excursion.featuredImage && typeof excursion.featuredImage === 'object'
  const featuredImageUrl = hasFeaturedImage ? (excursion.featuredImage as any).url : null
  const featuredImageAlt = hasFeaturedImage ? (excursion.featuredImage as any).alt : excursion.title

  // Extract the multi-image gallery rows array safely
  const gallery = excursion.galleryImages || []

  return (
    <div className="p-6 md:p-12 font-sans max-w-5xl mx-auto min-h-screen bg-background text-foreground transition-colors duration-200">
      {/* Upper Navigation Action Bar */}
      <div className="mb-8">
        <Link
          href="/"
          className="text-sm font-semibold text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 flex items-center gap-1 transition-colors"
        >
          ← Back to All Yacht Charters
        </Link>
      </div>

      {/* Main Structural Detail Card Display */}
      <main className="border border-border rounded-3xl overflow-hidden shadow-lg bg-card text-card-foreground">
        {/* Full-Bleed Top Featured Banner Image */}
        {featuredImageUrl && (
          <div className="relative h-75 md:h-112.5 w-full bg-slate-900">
            <Image
              src={featuredImageUrl}
              alt={featuredImageAlt}
              fill
              className="object-cover"
              priority
              sizes="100vw"
            />
            <div className="absolute inset-0 bg-linear-to-t from-black/60 to-transparent" />
          </div>
        )}

        <div className="p-6 md:p-10">
          <span className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/40 px-3 py-1 rounded-full">
            Private Daily Yacht Hire
          </span>

          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight mt-4 mb-6">
            {excursion.title}
          </h1>

          {/* Highlight Banner Metrics Layout */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-6 my-8 p-6 bg-slate-50 dark:bg-background/50 border border-border rounded-xl">
            <div className="block place-items-center">
              <span className="block text-xs font-medium text-muted-foreground uppercase tracking-wide">
                Charter Window
              </span>
              <span className="flex items-center gap-2 text-base md:text-lg font-bold mt-1">
                <Clock4 className="text-blue-400" />
                {excursion.duration} Hours
              </span>
            </div>
            <div className="block place-items-center">
              <span className="block text-xs font-medium text-muted-foreground uppercase tracking-wide">
                Fixed Price Tier
              </span>
              <span className="flex items-center gap-2 text-base md:text-lg font-bold mt-1">
                <LucideDollarSign className="text-blue-400" />${excursion.price} USD
              </span>
            </div>
            <div className="block place-items-center">
              <span className="block text-xs font-medium text-muted-foreground uppercase tracking-wide">
                Inclusions Profile
              </span>
              <span className="flex items-center gap-2 text-base md:text-lg font-bold mt-1">
                <LucideCheckCircle className="text-blue-400" />
                All-Inclusive
              </span>
            </div>
          </div>

          {/* Detailed Description blueprint block */}
          <div className="mt-8 mb-12">
            <h3 className="text-lg font-bold mb-3">Expedition Blueprint & Route Details</h3>
            <p className="text-muted-foreground leading-relaxed text-base md:text-lg whitespace-pre-line">
              {excursion.description}
            </p>
          </div>

          {/* Dynamic Grid Photo Gallery Section */}
          {gallery.length > 0 && (
            <div className="mt-12 pt-8 border-t border-border">
              <h3 className="text-xl font-extrabold tracking-tight text-slate-800 dark:text-slate-100 mb-6">
                Vessel Amenities & Expedition Gallery
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {gallery.map((item: any, idx: number) => {
                  const mediaObj = item.image
                  if (!mediaObj || typeof mediaObj !== 'object') return null

                  return (
                    <div
                      key={item.id || idx}
                      className="relative h-48 md:h-56 rounded-2xl overflow-hidden border border-border group bg-muted shadow-sm hover:shadow-md transition-all duration-300"
                    >
                      <Image
                        src={mediaObj.url}
                        alt={mediaObj.alt || `Gallery Image ${idx + 1}`}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      />
                    </div>
                  )
                })}
              </div>
            </div>
          )}

          {/* Lower Core Action Footnote */}
          <div className="mt-12 pt-8 border-t border-border text-center">
            <p className="text-sm text-muted-foreground mb-4">
              Ready to secure this custom package for your private voyage?
            </p>
            <Link
              href="/#book-now"
              className="inline-block px-8 py-4 bg-primary text-primary-foreground hover:opacity-90 rounded-xl font-bold transition-all shadow-md"
            >
              Check Real-Time Date Availability
            </Link>
          </div>
        </div>
      </main>
    </div>
  )
}
