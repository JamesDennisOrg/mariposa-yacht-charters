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
        const resolvedConfig = await config
        const payload = await getPayload({ config: resolvedConfig })

        // Handle Stripe's lower-case conversion fallback automatically
        const bookingDateValue = metadata.bookingDate || metadata.bookingdate
        const itineraryIdValue = metadata.itineraryId || metadata.itineraryid
        const customerNameValue = metadata.customerName || metadata.customername
        const customerEmailValue = metadata.customerEmail || metadata.customeremail
        const customerPhoneValue = metadata.customerPhone || metadata.customerphone
        const guestCountValue = metadata.guestCount || metadata.guestcount

        await payload.create({
          collection: 'bookings',
          data: {
            // Write the variables using the verified fallback keys matching your exact Bookings.ts schema fields
            bookingDate: bookingDateValue,
            status: 'CONFIRMED',
            itinerary: Number(itineraryIdValue),
            customerName: customerNameValue,
            customerEmail: customerEmailValue,
            customerPhone: customerPhoneValue,
            guestCount: parseInt(guestCountValue || '2', 10),
            stripeSessionId: session.id,
          },
        })

        console.log(`🎉 Success! Booking recorded directly to Supabase for ${customerNameValue}`)
      } catch (dbErr: any) {
        console.error('❌ Webhook data processing crash:', dbErr.message || dbErr)
        return NextResponse.json(
          { error: `Database write exception: ${dbErr.message}` },
          { status: 500 },
        )
      }
    }
  }

  return NextResponse.json({ received: true }, { status: 200 })
}
