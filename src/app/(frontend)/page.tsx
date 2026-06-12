export const dynamic = 'force-dynamic'

import { getPayload } from 'payload'
import config from '@/payload.config'
import BookingForm from '@/components/BookingForm'
import Link from 'next/link'
import { headers as getNextHeaders } from 'next/headers'
import Image from 'next/image'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ArrowUpRight } from 'lucide-react'

export default async function HomePage() {
  const clientHeaders = await getNextHeaders()
  const payloadConfig = await config
  const payload = await getPayload({ config: payloadConfig })

  // Extract the current authenticated user account
  const { user } = await payload.auth({ headers: clientHeaders })

  // 1. Fetch our active Mexican itineraries from Supabase
  const itinerariesData = await payload.find({
    collection: 'itineraries',
    depth: 1,
  })

  // 2. Fetch all confirmed bookings to discover busy slots
  const confirmedBookings = await payload.find({
    collection: 'bookings',
    where: {
      status: { equals: 'CONFIRMED' },
    },
    limit: 200,
  })

  // 3. Fetch manual maintenance or personal block dates
  const blockedDatesData = await payload.find({
    collection: 'blocked-dates',
    limit: 100,
  })

  // Standardize dates into simple 'YYYY-MM-DD' strings for parsing
  const bookedDatesStrings = confirmedBookings.docs.map(
    (b) => new Date(b.bookingDate).toISOString().split('T')[0],
  )

  const manualBlockedStrings = blockedDatesData.docs.map(
    (b) => new Date(b.date).toISOString().split('T')[0],
  )

  const masterUnavailableDates = [...bookedDatesStrings, ...manualBlockedStrings]

  // Create clean mappings for our interactive selector fields
  const simplifiedItineraries = itinerariesData.docs.map((i) => ({
    id: i.id,
    title: i.title,
    price: i.price,
  }))

  return (
    <div className="px-6 md:px-10 py-10 font-sans max-w-7xl mx-auto min-h-screen">
      {/* 
        Master Layout: 12-Column Responsive Flex-Grid 
        - Stacks vertically on mobile/tablet (grid-cols-1)
        - Breaks into Sidebar + Main Content layout on desktops (lg:grid-cols-12)
        - Use this line to force a refresh of the git repository
      */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        {/* 
          PANE 1: Floating Sticky Booking Form Sidebar (4 Columns out of 12)
          - lg:sticky & lg:top-6 forces this box to remain pinned as the user scrolls
          - order-last lg:order-first keeps form beneath content on mobile but pins it to the left on desktop
        */}
        <aside className="grid-cols-1 lg:col-span-4 order-last lg:order-first lg:sticky lg:top-6 pr-4 border-r">
          <BookingForm
            itineraries={simplifiedItineraries}
            unavailableDates={masterUnavailableDates}
          />
        </aside>

        {/* 
          PANE 2: Main Dynamic Excursion Brochure Grid (8 Columns out of 12)
        */}
        <main className="grid-cols-1 lg:col-span-8 space-y-6">
          <h2 className="text-2xl font-bold text-foreground tracking-tight">
            Our Daily Excursions
          </h2>

          {/* Flexible Internal Grid for the Excursion Itinerary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {itinerariesData.docs.map((trip) => {
              const hasImage = trip.featuredImage && typeof trip.featuredImage === 'object'
              const imageUrl = hasImage ? (trip.featuredImage as any).url : null
              const imageAlt = hasImage ? (trip.featuredImage as any).alt : trip.title

              return (
                <Link
                  href={`/excursions/${trip.id}`}
                  key={trip.id}
                  className="group block no-underline focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded-xl transition-all hover:scale-[1.02] active:scale-[0.98]"
                >
                  <Card className="relative h-full min-h-95 flex flex-col justify-between border-border bg-slate-900 text-white shadow-sm hover:shadow-xl hover:border-primary/50 group-hover:border-primary/30 transition-all cursor-pointer overflow-hidden">
                    {/* Absolute Background Image Asset Wrapper */}
                    {imageUrl ? (
                      <>
                        <Image
                          src={imageUrl}
                          alt={imageAlt || trip.title}
                          fill
                          className="object-cover transition-transform duration-500 group-hover:scale-105"
                          sizes="(max-width: 768px) 100vw, 33vw"
                          priority
                        />
                        {/* Dark Gradient Scrim Overlay Layer */}
                        <div className="absolute inset-0 bg-linear-to-t from-black/95 via-black/50 to-black/20 z-10 transition-opacity duration-300 group-hover:opacity-90" />
                      </>
                    ) : (
                      <div className="absolute inset-0 bg-slate-800 z-10" />
                    )}

                    {/* Core Content Containers raised to z-20 over backdrop */}
                    <CardHeader className="p-6 pb-3 relative z-20">
                      <CardTitle className="text-2xl font-black tracking-tight text-white group-hover:text-primary transition-colors drop-shadow-md">
                        {trip.title}
                      </CardTitle>
                      <div className="pt-2">
                        <Badge
                          variant="outline"
                          className="-translate-y-4 opacity-0 bg-white/10 text-white border-white/20 backdrop-blur-sm group-hover:bg-card group-hover:text-white group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300"
                        >
                          View Itinerary
                          <ArrowUpRight className="ml-1 h-3 w-3" />
                        </Badge>
                      </div>
                    </CardHeader>

                    <CardContent className="p-6 pt-0 pb-6 relative z-20 mt-auto">
                      <CardDescription className="text-slate-200 text-sm font-normal leading-relaxed line-clamp-3">
                        {trip.description}
                      </CardDescription>
                    </CardContent>

                    <CardFooter className="p-6 pt-4 relative z-20 border-t border-white/10 bg-black/40 backdrop-blur-md flex justify-between text-xs font-semibold text-white">
                      <Badge variant="outline" className="text-white border-white/20">
                        <strong>Duration:</strong>&nbsp;{trip.duration} Hours
                      </Badge>
                      <Badge
                        variant="outline"
                        className="text-white border-white/20 px-2.5 py-1 text-sm font-bold"
                      >
                        ${trip.price} USD
                      </Badge>
                    </CardFooter>
                  </Card>
                </Link>
              )
            })}
          </div>
        </main>
      </div>
    </div>
  )
}
