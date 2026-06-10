import Link from 'next/link'

export default async function BookingSuccessPage() {
  return (
    <div className="p-6 md:p-12 font-sans max-w-xl mx-auto min-h-screen flex items-center justify-center bg-background text-foreground">
      <main className="border border-border rounded-3xl p-8 shadow-xl bg-card text-center space-y-6">
        <div className="w-16 h-16 bg-emerald-50 dark:bg-emerald-950/40 rounded-full flex items-center justify-center mx-auto text-3xl">
          ⛵
        </div>

        <h1 className="text-3xl font-extrabold tracking-tight">Voyage Secured!</h1>

        <p className="text-muted-foreground leading-relaxed">
          Your reservation request has been processed and logged inside our charter ledger. A
          receipt and itinerary brief has been transmitted to your email.
        </p>

        <div className="pt-4 border-t border-border">
          <Link
            href="/"
            className="inline-block px-6 py-3 bg-primary text-primary-foreground hover:opacity-90 rounded-xl font-bold transition-all text-sm"
          >
            Return to Homepage
          </Link>
        </div>
      </main>
    </div>
  )
}
