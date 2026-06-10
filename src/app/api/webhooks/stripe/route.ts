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
      const payload = await getPayload({ config: await config })

      // Create an official reservation document row inside Supabase via Payload Local API
      await payload.create({
        collection: 'bookings',
        data: {
          bookingDate: metadata.bookingDate,
          status: 'CONFIRMED',
          itinerary: Number(metadata.itineraryId), // Pass relation link token target numerical index
          customerName: metadata.customerName,
          customerEmail: metadata.customerEmail,
          customerPhone: metadata.customerPhone,
          guestCount: parseInt(metadata.guestCount, 10),
          stripeSessionId: session.id,
        },
      })

      console.log(
        `🎉 Charter secured successfully for ${metadata.customerName} on ${metadata.bookingDate}`,
      )
    }
  }

  return NextResponse.json({ received: true }, { status: 200 })
}
