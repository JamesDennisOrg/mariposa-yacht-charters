import { getPayload } from 'payload'
import config from '@/payload.config'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { Clock4, LucideCheckCircle, LucideDollarSign } from 'lucide-react'
import BookingForm from '@/components/BookingForm'

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
      depth: 1,
    })
  } catch (error) {
    return notFound()
  }

  // 1. Fetch confirmed bookings to calculate the unavailable dates matching your home page setup
  const confirmedBookings = await payload.find({
    collection: 'bookings',
    where: {
      status: { equals: 'CONFIRMED' },
    },
    limit: 200,
  })

  // 2. Fetch maintenance block dates matching your home page setup
  const blockedDatesData = await payload.find({
    collection: 'blocked-dates',
    limit: 100,
  })

  // Standardize your dates into simple YYYY-MM-DD strings to satisfy your calendar checks
  const bookedDatesStrings = confirmedBookings.docs.map(
    (b) => new Date(b.bookingDate).toISOString().split('T')[0],
  )

  const manualBlockedStrings = blockedDatesData.docs.map(
    (b) => new Date(b.date).toISOString().split('T')[0],
  )

  const masterUnavailableDates = [...bookedDatesStrings, ...manualBlockedStrings]

  // 3. Map this specific itinerary into the option wrapper layout array expected by your select fields
  const currentItineraryOption = [
    {
      id: excursion.id,
      title: excursion.title,
      price: excursion.price,
    },
  ]

  const hasFeaturedImage = excursion.featuredImage && typeof excursion.featuredImage === 'object'
  const featuredImageUrl = hasFeaturedImage ? (excursion.featuredImage as any).url : null
  const featuredImageAlt = hasFeaturedImage ? (excursion.featuredImage as any).alt : excursion.title

  const gallery = excursion.galleryImages || []

  return (
    <div className="p-4 md:p-8 font-sans max-w-7xl mx-auto min-h-screen bg-background text-foreground transition-colors duration-200">
      {/* Upper Navigation Action Bar */}
      <div className="mb-6">
        <Link
          href="/"
          className="text-sm font-semibold text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 flex items-center gap-1 transition-colors"
        >
          ← Back to All Yacht Charters
        </Link>
      </div>

      {/* Full-Bleed Top Featured Banner Image */}
      {featuredImageUrl && (
        <div className="relative h-64 md:h-96 w-full bg-slate-900 rounded-3xl overflow-hidden shadow-lg mb-8">
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

      {/* Main Responsive Split Grid Layout Container */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        {/* Left Side: Detailed Descriptions, Metrics Banners, and Galleries (8 Columns out of 12) */}
        <main className="lg:col-span-8 border border-border rounded-3xl overflow-hidden shadow-lg bg-card text-card-foreground p-6 md:p-10 h-full">
          <span className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/40 px-3 py-1 rounded-full">
            Private Daily Yacht Hire
          </span>

          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight mt-4 mb-6">
            {excursion.title}
          </h1>

          {/* Highlight Banner Metrics Layout */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 my-6 p-4 bg-slate-50 dark:bg-background/50 border border-border rounded-xl">
            <div className="block place-items-center text-center">
              <span className="block text-xs font-medium text-muted-foreground uppercase tracking-wide">
                Charter Window
              </span>
              <span className="flex items-center justify-center gap-2 text-base font-bold mt-1">
                <Clock4 className="w-4 h-4 text-blue-400" />
                {excursion.duration} Hours
              </span>
            </div>
            <div className="block place-items-center text-center">
              <span className="block text-xs font-medium text-muted-foreground uppercase tracking-wide">
                Fixed Price Tier
              </span>
              <span className="flex items-center justify-center gap-2 text-base font-bold mt-1">
                <LucideDollarSign className="w-4 h-4 text-blue-400" />${excursion.price} USD
              </span>
            </div>
            <div className="block place-items-center text-center col-span-2 sm:col-span-1">
              <span className="block text-xs font-medium text-muted-foreground uppercase tracking-wide">
                Inclusions Profile
              </span>
              <span className="flex items-center justify-center gap-2 text-base font-bold mt-1">
                <LucideCheckCircle className="w-4 h-4 text-blue-400" />
                All-Inclusive
              </span>
            </div>
          </div>

          {/* Detailed Description blueprint block */}
          <div className="my-6">
            <h3 className="text-lg font-bold mb-2">Expedition Blueprint & Route Details</h3>
            <p className="text-muted-foreground leading-relaxed text-base whitespace-pre-line">
              {excursion.description}
            </p>
          </div>

          {/* Dynamic Grid Photo Gallery Section */}
          {gallery.length > 0 && (
            <div className="mt-8 pt-6 border-t border-border">
              <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 mb-4">
                Vessel Amenities & Expedition Gallery
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                {gallery.map((item: any, idx: number) => {
                  const mediaObj = item.image
                  if (!mediaObj || typeof mediaObj !== 'object') return null

                  return (
                    <div
                      key={item.id || idx}
                      className="relative h-40 md:h-44 rounded-xl overflow-hidden border border-border group bg-muted shadow-sm hover:shadow-md transition-all duration-300"
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
        </main>

        {/* Right Side: Floating Sticky Booking Form Sidebar Container (4 Columns out of 12) */}
        <aside className="lg:col-span-4 lg:sticky lg:top-6 border border-border rounded-3xl p-6 shadow-lg bg-card text-card-foreground">
          <div className="mb-4">
            <h2 className="text-xl font-extrabold tracking-tight">Reserve This Voyage</h2>
            <p className="text-xs text-muted-foreground mt-1">
              Your chosen charter package is pre-loaded below. Select an available cruise date to
              book.
            </p>
          </div>

          {/* Instantiates your exact BookingForm passing the clean mapped properties */}
          <BookingForm
            itineraries={currentItineraryOption}
            unavailableDates={masterUnavailableDates}
          />
        </aside>
      </div>
    </div>
  )
}
