import { NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@/payload.config'
import Stripe from 'stripe'

// Initialize Stripe with your environment key
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2026-05-27.dahlia',
})

export async function POST(req: Request) {
  try {
    // Parse the native HTML standard incoming form data body values
    const formData = await req.formData()

    const itineraryId = formData.get('itineraryId') as string
    const bookingDateStr = formData.get('bookingDate') as string
    const customerName = formData.get('customerName') as string
    const customerEmail = formData.get('customerEmail') as string
    const customerPhone = formData.get('customerPhone') as string
    const guestCount = formData.get('guestCount') as string

    if (!itineraryId || !bookingDateStr || !customerEmail) {
      return NextResponse.json({ error: 'Missing mandatory manifest data fields' }, { status: 400 })
    }

    // Connect to Payload Local API to look up the authentic item details
    const payload = await getPayload({ config: await config })
    const excursion = await payload.findByID({
      collection: 'itineraries',
      id: Number(itineraryId),
    })

    if (!excursion) {
      return NextResponse.json({ error: 'Excursion package blueprint not found' }, { status: 404 })
    }

    // Instantiate a secure checkout landing platform session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: `${excursion.title} - Day Charter Voyage`,
              description: `Date Reserved: ${bookingDateStr} | Passengers: ${guestCount}`,
            },
            unit_amount: excursion.price * 100, // Stripe expects currency amounts in cents
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      customer_email: customerEmail,
      success_url: `${process.env.NEXT_PUBLIC_SERVER_URL}/booking-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_SERVER_URL}/`,

      // Crucial: Metadata bridges your customer selection arrays over to the webhook
      metadata: {
        itineraryId: excursion.id.toString(),
        bookingDate: bookingDateStr,
        customerName,
        customerEmail,
        customerPhone,
        guestCount,
      },
    })

    // Securely forward the client browser layer out to the premium hosted layout interface
    if (session.url) {
      return NextResponse.json({ url: session.url }, { status: 200 })
    }

    return NextResponse.json(
      { error: 'Failed to establish Stripe runtime link token' },
      { status: 500 },
    )
  } catch (error: any) {
    console.error('Checkout processing anomaly:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
