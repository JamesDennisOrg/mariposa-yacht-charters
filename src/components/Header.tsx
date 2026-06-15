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
    // <header className="w-full mx-auto px-6 py-2 fixed top-0 z-9999 bg-black/5 backdrop-blur-md">
    <header className="fixed lg:top-6 lg:left-[50%] lg:translate-x-[-50%] lg:rounded-full px-8 w-full lg:w-7xl mx-auto bg-teal-700/60 backdrop-blur-sm shadow-md z-9999">
      <nav className="flex justify-between items-center py-2">
        <div className="">
          <Link href="/" className="">
            <h1 className="text-[5vw] lg:text-[2vw] font-extrabold tracking-tight m-0 bg-linear-to-r from-teal-400 via-cyan-400 to-blue-500 bg-clip-text text-transparent drop-shadow-sm drop-shadow-black">
              Mariposa Yacht Charters
            </h1>
          </Link>
          <p className="hidden lg:block text-sm text-white/65 -mt-1 lg:-mt-3 font-sans">
            Premium daily hire along the breathtaking Mexican coastline.
          </p>
        </div>

        <div className="">
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
                className="cursor-pointer text-cyan-500 hover:text-primary transition-all duration-300 hover:no-underline gap-2"
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
