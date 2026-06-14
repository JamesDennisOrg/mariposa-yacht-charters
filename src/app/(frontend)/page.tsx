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
import { Button } from '@/components/ui/button'

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
    <div className="font-sans mx-auto min-h-screen">
      {/* Hero Section  */}
      <section className="relative w-full overflow-hidden min-h-screen flex items-center justify-center p-6 md:p-12 mb-12">
        {/* Multi-Layer Ambient Mesh Backdrop Flow Effect */}
        {/* <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-40 mix-blend-screen z-0"> */}
        {/* <div className="absolute top-[-25%] left-[-10%] w-[65vw] h-[65vw] bg-cyan-400/25 blur-[130px]" /> */}
        {/* <div className="absolute bottom-[-30%] right-[-10%] w-[60vw] h-[60vw] bg-teal-500/20 blur-[150px]" /> */}
        {/* </div> */}

        {/* Full-Bleed High-Definition Yachting Backdrop Video Component Layer */}
        <div className="absolute inset-0 w-full h-full object-cover z-10 transition-transform">
          <video autoPlay loop muted playsInline className="w-full h-full object-cover">
            <source src="/hero-video-loop.mp4" type="video/mp4" />
          </video>
          {/* Subtle overlay gradient to mesh with dark/light background variants */}
          {/* <div className="absolute inset-0 z-20" /> */}
        </div>

        {/* Floating Typography Context Layout Matrix Container */}
        <div className="relative z-30 text-center max-w-3xl mx-auto space-y-6 px-4">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-primary/20 backdrop-blur-md shadow-sm">
            <span className="w-2 h-2 rounded-full bg-teal-400 animate-pulse" />
            <span className="text-xs font-bold uppercase tracking-widest text-foreground/90">
              Premium Yacht Charter
            </span>
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tighter leading-[1.1] text-foreground">
            Experience the Sea in
            <br />
            <span className="ml-1 bg-linear-to-r from-teal-400 via-cyan-400 to-blue-500 bg-clip-text text-transparent drop-shadow-md">
              Absolute Luxury
            </span>
          </h1>

          <p className="text-base sm:text-lg text-muted-foreground font-medium max-w-xl mx-auto leading-relaxed">
            Secure your private daily voyage, bespoke inclusions, and premium crew manifests across
            Mexico's most exclusive coastal routes.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 items-center justify-center pt-2">
            <Link href={'#book-now'}>
              <Button className="cursor-pointer w-full h-10 px-6 py-4 border border-cyan-800">
                Book Private Charter
              </Button>
            </Link>
            <Link href={'#book-now'}>
              <Button className="cursor-pointer w-full h-10 px-6 py-4 bg-transparent border border-cyan-800">
                Explore Itineraries
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Main Content  */}
      <div
        className="grid grid-cols-1 lg:grid-cols-12 lg:max-w-7xl mx-auto gap-10 py-10 scroll-mt-20"
        id="book-now"
      >
        <aside className="grid-cols-1 lg:col-span-4 order-last lg:order-first pr-6 border-r">
          <BookingForm
            itineraries={simplifiedItineraries}
            unavailableDates={masterUnavailableDates}
          />
        </aside>

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
