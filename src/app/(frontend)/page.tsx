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
import { ArrowUpRight, CalendarDays, CalendarSearch } from 'lucide-react'
import { Button } from '@/components/ui/button'
import MotionReveal from '@/components/motion/MotionReveal'
import MotionGridStagger from '@/components/motion/MotionGridStagger'
import MotionStackStagger from '@/components/motion/MotionStackStagger'

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
    <div className="">
      {/* Hero Section  */}
      <section className="relative h-auto min-h-180 max-h-500 w-full overflow-hidden place-content-center">
        {/* Background Container - Absolute positioned */}
        <MotionReveal distance={0} className="absolute inset-0 w-full h-full">
          {/* Video for medium screens and up */}
          <video
            autoPlay
            loop
            muted
            playsInline
            className="hidden md:block w-full h-full object-cover"
          >
            <source src="/hero-video-loop.mp4" type="video/mp4" />
            Your browser does not support Video...
          </video>

          {/* Image for small screens */}
          <div
            className="md:hidden w-full h-full bg-cover bg-center bg-no-repeat"
            style={{ backgroundImage: 'url(/media/yacht-with-backdrop.webp)' }}
          />

          {/* Optional overlay for better text readability */}
          <div className="absolute inset-0 bg-black/20" />
        </MotionReveal>

        {/* Content Container - On top of background */}
        <div className="relative z-10 flex flex-col items-center justify-center max-w-7xl space-y-20 mx-auto h-full mt-8 px-4 py-12 text-center">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tighter leading-[1.1] text-white">
            Experience Mexico In
            <br />
            <span className="ml-1 bg-linear-to-r from-teal-400 via-cyan-400 to-blue-500 bg-clip-text text-transparent drop-shadow-sm drop-shadow-black">
              Absolute Luxury
            </span>
          </h1>
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-center pt-2 w-full sm:w-auto">
            <Link
              href="#book-now"
              className="w-full sm:w-auto hover:-translate-y-1 transition-transform"
            >
              <Button className="cursor-pointer h-10 px-6 py-4 border border-cyan-800 bg-cyan-600 hover:bg-cyan-700 text-white">
                Book Private Charter
                <CalendarDays />
              </Button>
            </Link>
            <Link
              href="#book-now"
              className="w-full sm:w-auto hover:-translate-y-1 transition-transform"
            >
              <Button className="text-white cursor-pointer h-10 px-6 py-4 bg-transparent border border-cyan-800 backdrop-blur-md hover:bg-white/10">
                Explore Itineraries
                <CalendarSearch />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <div className="pt-36 space-y-6 py-10 relative overflow-hidden" id="book-now">
        {/* Watermark Background Image */}
        <div
          className="absolute inset-0 w-full h-full opacity-15 dark:opacity-10 pointer-events-none select-none"
          style={{
            backgroundImage: 'url(/yacht-with-backdrop.webp)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
          }}
        />

        {/* Content - relative to sit above the background */}
        <div className="relative z-10">
          <MotionStackStagger staggerDelay={0.15}>
            <h2 className="text-4xl text-center">Luxury Yacht Excursions, Tailored to You</h2>
            <p className="text-lg max-w-[60ch] text-center text-balance mx-auto leading-relaxed">
              Secure your private daily voyage, bespoke inclusions, and premium crew manifests
              across Mexico's most exclusive coastal routes.
            </p>
          </MotionStackStagger>

          <MotionReveal className="grid grid-cols-1 lg:grid-cols-12 lg:max-w-7xl mx-auto gap-2 px-4 py-10">
            <aside className="sticky top-60 grid-cols-1 lg:col-span-4 order-last lg:order-first lg:pr-6">
              <BookingForm
                itineraries={simplifiedItineraries}
                unavailableDates={masterUnavailableDates}
              />
            </aside>

            <div className="grid-cols-1 lg:col-span-8 space-y-6">
              <MotionGridStagger
                baseDelay={0.3}
                staggerFactor={0.15}
                className="grid grid-cols-1 md:grid-cols-2 gap-6"
              >
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
                      <Card className="relative h-full min-h-95 flex flex-col justify-between border-border bg-slate-900/90 backdrop-blur-sm text-white shadow-sm hover:shadow-xl hover:border-primary/50 group-hover:border-primary/30 transition-all cursor-pointer overflow-hidden">
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
                            <div className="absolute inset-0 bg-linear-to-t from-black/95 via-black/50 to-black/20 transition-opacity duration-300 group-hover:opacity-90" />
                          </>
                        ) : (
                          <div className="absolute inset-0 bg-slate-800 z-10" />
                        )}

                        <CardHeader className="p-6 pb-3 relative z-20">
                          <CardTitle className="text-2xl font-black tracking-tight text-white transition-all drop-shadow-md">
                            {trip.title}
                          </CardTitle>
                          <div className="pt-2">
                            <Badge
                              variant="outline"
                              className="-translate-y-4 opacity-0 bg-linear-to-r from-cyan-500 to-teal-500 border-white/20 backdrop-blur-sm group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300"
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
              </MotionGridStagger>
            </div>
          </MotionReveal>
        </div>
      </div>
    </div>
  )
}
