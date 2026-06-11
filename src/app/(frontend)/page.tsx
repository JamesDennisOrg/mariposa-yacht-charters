export const dynamic = 'force-dynamic'

import { getPayload } from 'payload'
import config from '@/payload.config'
import BookingForm from '@/components/BookingForm'
import Link from 'next/link'
import { headers as getNextHeaders } from 'next/headers'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { LogIn } from 'lucide-react'

export default async function HomePage() {
  // Call the native Next.js headers function
  const clientHeaders = await getNextHeaders()

  const payloadConfig = await config
  const payload = await getPayload({ config: payloadConfig })

  // Pass the headers into the auth client to extract the current user account row
  const { user } = await payload.auth({ headers: clientHeaders })

  // 1. Fetch our active Mexican itineraries from Supabase
  const itinerariesData = await payload.find({
    collection: 'itineraries',
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

  // Standardize dates into simple 'YYYY-MM-DD' strings for html parsing
  const bookedDatesStrings = confirmedBookings.docs.map(
    (b) => new Date(b.bookingDate).toISOString().split('T')[0],
  )

  const manualBlockedStrings = blockedDatesData.docs.map(
    (b) => new Date(b.date).toISOString().split('T')[0],
  )

  const masterUnavailableDates = [...bookedDatesStrings, ...manualBlockedStrings]

  // Create clean, lightweight mappings for our interactive selector fields
  const simplifiedItineraries = itinerariesData.docs.map((i) => ({
    id: i.id, // Safely maps as a number compiled out of Supabase
    title: i.title,
    price: i.price,
  }))

  return (
    <div className="p-10 font-sans max-w-6xl mx-auto min-h-screen">
      <header style={{ marginBottom: '2.5rem' }}>
        <nav className="flex justify-between items-center pb-6 mb-10 border-b">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight m-0">Mariposa Yacht Charters</h1>
            <p className="text-sm mt-1">
              Premium daily hire along the breathtaking Mexican coastline.
            </p>
          </div>

          {/* Dynamic Admin Action Button */}
          <div>
            {user ? (
              <Link
                href="/admin"
                className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-sm font-semibold shadow-sm transition-all"
              >
                Admin Dashboard ({user.email})
              </Link>
            ) : (
              <Link href="/admin/login">
                <Button
                  variant={'link'}
                  className="cursor-pointer text-muted-foreground hover:text-primary transition-all duration-300 hover:no-underline"
                >
                  Staff Login
                  <LogIn />
                </Button>
              </Link>
            )}
          </div>
        </nav>
      </header>

      <section className="mb-16">
        <h2 className="text-2xl font-bold mb-6 text-foreground tracking-tight">
          Our Daily Excursions
        </h2>

        {/* Fluid 2-Column CSS Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {itinerariesData.docs.map((trip) => (
            <Link
              href={`/excursions/${trip.id}`}
              key={trip.id}
              className="group block no-underline focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded-xl transition-all hover:scale-102 active:scale-98"
            >
              <Card className="h-full flex flex-col justify-between border-border bg-card text-card-foreground shadow-sm hover:shadow-md hover:border-primary/50 group-hover:border-primary/30 transition-all cursor-pointer overflow-hidden">
                <CardHeader className="p-6 pb-3">
                  <CardTitle className="text-xl font-bold tracking-tight text-slate-800 dark:text-slate-100 group-hover:text-primary transition-colors">
                    {trip.title}
                  </CardTitle>
                  <Badge
                    variant={'outline'}
                    className="group-hover:bg-muted-foreground group-hover:text-background transition-all"
                  >
                    View Route
                  </Badge>
                </CardHeader>
                <CardContent className="p-6 pt-0 pb-6">
                  <CardDescription className="text-muted-foreground text-sm leading-relaxed line-clamp-3">
                    {trip.description}
                  </CardDescription>
                </CardContent>
                <CardFooter className="p-6 pt-4 border-t border-border bg-slate-50/50 dark:bg-slate-900/30 flex justify-between text-xs font-medium text-muted-foreground">
                  <Badge variant={'secondary'}>
                    <strong>Duration:</strong> {trip.duration} Hours
                  </Badge>
                  <Badge variant={'outline'}>${trip.price} usd</Badge>
                </CardFooter>
              </Card>
            </Link>
          ))}
        </div>
      </section>

      {/* Section 2: Full Width Booking Form Area underneath */}
      <section>
        <div className="max-w-200 my-8 mx-auto">
          <h2 className="text-3xl mb-4 text-center">Secure Your Dates</h2>
          <p className="text-center mb-4">
            Select an excursion package and check real-time availability below.
          </p>

          <BookingForm
            itineraries={simplifiedItineraries}
            unavailableDates={masterUnavailableDates}
          />
        </div>
      </section>
    </div>
  )
}
