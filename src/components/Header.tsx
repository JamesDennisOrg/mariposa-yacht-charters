import React from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button' // Adjust this path if your Shadcn layout sits elsewhere
import { LogIn } from 'lucide-react'

// Define the type structure for Payload's authenticated user object
interface HeaderProps {
  user: {
    email: string
    [key: string]: any
  } | null
}

export default function Header({ user }: HeaderProps) {
  return (
    <header className="w-full max-w-7xl mx-auto px-6 py-6">
      <nav className="flex justify-between items-center pb-4 border-b border-border">
        <div>
          <Link
            href="/"
            className="hover:opacity-90 transition-opacity block no-underline text-foreground"
          >
            <h1 className="text-3xl font-extrabold tracking-tight m-0">Mariposa Yacht Charters</h1>
          </Link>
          <p className="text-sm text-muted-foreground mt-1">
            Premium daily hire along the breathtaking Mexican coastline.
          </p>
        </div>

        <div>
          {user ? (
            <Link
              href="/admin"
              className="px-4 py-2 bg-slate-900 hover:bg-slate-800 dark:bg-slate-100 dark:hover:bg-slate-200 text-white dark:text-slate-900 rounded-lg text-sm font-semibold shadow-sm transition-all"
            >
              Admin Dashboard ({user.email})
            </Link>
          ) : (
            <Link href="/admin/login">
              <Button
                variant="link"
                className="cursor-pointer text-muted-foreground hover:text-primary transition-all duration-300 hover:no-underline gap-2"
              >
                Staff Login
                <LogIn className="h-4 w-4" />
              </Button>
            </Link>
          )}
        </div>
      </nav>
    </header>
  )
}
