import { NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@/payload.config'
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2026-05-27.dahlia',
})

export async function POST(req: Request) {
  const body = await req.text()
  const signature = req.headers.get('stripe-signature')!
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!

  let event: Stripe.Event

  try {
    // Verify the incoming data stream actually came from Stripe
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret)
  } catch (err: any) {
    console.error(`Webhook crypt authentication crash: ${err.message}`)
    return NextResponse.json({ error: `Webhook Verification Error` }, { status: 400 })
  }

  // Intercept the checkout completion signal block
  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session
    const metadata = session.metadata

    if (metadata) {
      try {
        // 1. Force the asynchronous payload runtime configuration layout object to resolve completely first
        const resolvedConfig = await config
        const payload = await getPayload({ config: resolvedConfig })

        console.log('⚡ Serverless Payload instance initialized successfully over Vercel.')

        // 2. Execute the database insert using pure, clean camelCase schema keys matching Bookings.ts
        const newBooking = await payload.create({
          collection: 'bookings',
          data: {
            bookingDate: metadata.bookingDate,
            status: 'CONFIRMED',
            itinerary: Number(metadata.itineraryId),
            customerName: metadata.customerName,
            customerEmail: metadata.customerEmail,
            customerPhone: metadata.customerPhone,
            guestCount: parseInt(metadata.guestCount, 10),
            stripeSessionId: session.id,
          },
        })

        console.log(
          `🎉 Success! Booking ${newBooking.id} recorded directly to Supabase for ${metadata.customerName}`,
        )
      } catch (dbErr: any) {
        // This will capture and output any internal or relational schema errors straight to your Vercel logs stream
        console.error('❌ Production webhook database write crash:', dbErr.message || dbErr)
        return NextResponse.json(
          { error: `Database write exception: ${dbErr.message}` },
          { status: 500 },
        )
      }
    }
  }

  return NextResponse.json({ received: true }, { status: 200 })
}
