import { getPayload } from 'payload'
import config from '@/payload.config'
import { notFound } from 'next/navigation'
import Link from 'next/link'

interface ExcursionPageProps {
  params: Promise<{ id: string }>
}

export default async function ExcursionDetailPage({ params }: ExcursionPageProps) {
  const { id } = await params
  const payloadConfig = await config
  const payload = await getPayload({ config: payloadConfig })

  let excursion
  try {
    // Safely look up the target document inside your itineraries collection
    excursion = await payload.findByID({
      collection: 'itineraries',
      id: Number(id), // Payload Postgres utilizes numerical auto-increment targets
    })
  } catch (error) {
    // Fall back to a standard Next.js 404 page if an invalid ID is inputted into the URL
    return notFound()
  }

  return (
    <div className="p-6 md:p-12 font-sans max-w-4xl mx-auto min-h-screen bg-background text-foreground transition-colors duration-200">
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
      <main className="border border-border rounded-3xl p-6 md:p-10 shadow-lg bg-card text-card-foreground">
        <span className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/40 px-3 py-1 rounded-full">
          Private Daily Yacht Hire
        </span>

        <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight mt-4 mb-6">
          {excursion.title}
        </h1>

        {/* Highlight Banner Metrics Layout */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-6 my-8 p-6 bg-slate-50 dark:bg-slate-900 border border-border rounded-xl">
          <div>
            <span className="block text-xs font-medium text-muted-foreground uppercase tracking-wide">
              Charter Window
            </span>
            <span className="text-base md:text-lg font-bold mt-1 block">
              ⏱️ {excursion.duration} Hours
            </span>
          </div>
          <div>
            <span className="block text-xs font-medium text-muted-foreground uppercase tracking-wide">
              Fixed Price Tier
            </span>
            <span className="text-base md:text-lg font-bold mt-1 block">
              💰 ${excursion.price} USD
            </span>
          </div>
          <div className="col-span-2 sm:col-span-1">
            <span className="block text-xs font-medium text-muted-foreground uppercase tracking-wide">
              Inclusions Profile
            </span>
            <span className="text-base md:text-lg font-bold text-emerald-600 dark:text-emerald-400 mt-1 block">
              ⚓ All-Inclusive
            </span>
          </div>
        </div>

        {/* Detailed Description blueprint block */}
        <div className="mt-8">
          <h3 className="text-lg font-bold mb-3">Expedition Blueprint & Route Details</h3>
          <p className="text-muted-foreground leading-relaxed text-base md:text-lg whitespace-pre-line">
            {excursion.description}
          </p>
        </div>

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
      </main>
    </div>
  )
}
