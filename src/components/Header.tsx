'use client'

import React from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { LogIn } from 'lucide-react'
import { motion, useScroll, useMotionValueEvent } from 'motion/react'
import { cn } from '@/lib/utils'
import { useState, useEffect } from 'react'

interface HeaderProps {
  user: {
    email: string
    [key: string]: any
  } | null
}

export default function Header({ user }: HeaderProps) {
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkWidth = () => {
      setIsMobile(window.innerWidth < 768) // Matches standard Tailwind 'md' break rule
    }
    checkWidth()
    window.addEventListener('resize', checkWidth)
    return () => window.removeEventListener('resize', checkWidth)
  }, [])

  const [isScrolled, setIsScrolled] = React.useState(false)
  const { scrollY } = useScroll()

  useMotionValueEvent(scrollY, 'change', (latest) => {
    setIsScrolled(latest > 200)
  })

  return (
    // Fixed header wrapper - always full width, fixed to top
    <header className="fixed top-0 left-0 w-full z-50 pointer-events-none h-20 md:h-24">
      {/* Animated nav container */}
      <motion.div
        className={cn('flex justify-between items-center mx-auto pointer-events-auto')}
        initial={{
          width: 'calc(100% - 4rem)',
          maxWidth: '80rem',
          borderRadius: '12px',
          paddingLeft: '2rem',
          paddingRight: '2rem',
          paddingTop: '0.5rem',
          paddingBottom: '0.5rem',
          marginTop: '1.5rem',
          backgroundColor: 'rgba(15, 118, 110, 0.6)',
          backdropFilter: 'blur(8px)',
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
          height: 'auto',
          minHeight: '3.5rem',
        }}
        animate={{
          width: isScrolled ? '100%' : 'calc(100% - 4rem)',
          maxWidth: isScrolled ? '100%' : '80rem',
          borderRadius: isScrolled ? '0px' : '12px',
          paddingLeft: isScrolled ? '1rem' : '2rem',
          paddingRight: isScrolled ? '1rem' : '2rem',
          paddingTop: isScrolled ? '0.375rem' : '0.5rem',
          paddingBottom: isScrolled ? '0.375rem' : '0.5rem',
          marginTop: isScrolled ? '0' : '1.5rem',
          backgroundColor: isScrolled ? 'rgba(15, 118, 110, 0.95)' : 'rgba(15, 118, 110, 0.6)',
          backdropFilter: isScrolled ? 'blur(12px)' : 'blur(8px)',
          boxShadow: isScrolled
            ? '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
            : '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
          height: isScrolled ? '3.5rem' : 'auto',
          minHeight: isScrolled ? '3.5rem' : '3.5rem',
        }}
        transition={{
          type: 'tween',
          duration: 0.5,
          ease: 'linear',
        }}
      >
        {/* Logo and subtitle */}
        <div className="flex flex-col shrink-0 justify-center">
          <Link href="/" className="block">
            <motion.h1
              className="font-extrabold tracking-tight m-0 bg-linear-to-r from-teal-400 via-cyan-400 to-blue-500 bg-clip-text text-transparent drop-shadow-sm drop-shadow-black whitespace-nowrap leading-none"
              animate={{
                // Pass explicit, single string conditions that the keyframes block won't swallow
                fontSize: isMobile
                  ? isScrolled
                    ? '0.95rem'
                    : '1.2rem' // Mobile target sizes
                  : isScrolled
                    ? '1.5rem'
                    : '2.5rem', // Desktop target sizes
              }}
              transition={{
                type: 'tween',
                duration: 0.5,
                ease: 'easeInOut',
              }}
            >
              Mariposa Yacht Charters
            </motion.h1>
          </Link>
          <motion.div
            className="overflow-hidden"
            animate={{
              height: isScrolled ? 0 : 'auto',
              opacity: isScrolled ? 0 : 1,
            }}
            transition={{
              type: 'tween',
              duration: 0.3,
              ease: 'linear',
              // Slight delay on opacity to prevent subtitle from showing during height transition
              height: { duration: 0.3, delay: isScrolled ? 0 : 0.1 },
            }}
          >
            <p className="hidden lg:block text-white/65 font-sans text-sm -mt-1 whitespace-nowrap">
              Premium daily hire along the breathtaking Mexican coastline.
            </p>
          </motion.div>
        </div>

        {/* Navigation items */}
        <motion.div
          className="flex items-center shrink-0"
          animate={{
            scale: isScrolled ? 0.92 : 1,
          }}
          transition={{
            type: 'tween',
            duration: 0.4,
            ease: 'easeInOut',
          }}
        >
          {user ? (
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Link
                href="/admin"
                className={cn(
                  'rounded-lg font-semibold shadow-sm transition-all duration-300 block text-center',
                  'bg-slate-900 hover:bg-slate-800 dark:bg-slate-100 dark:hover:bg-slate-200',
                  'text-white dark:text-slate-900',
                  isScrolled ? 'px-2 py-1 text-xs max-w-[120px] truncate' : 'px-4 py-2 text-sm',
                )}
              >
                {/* Hide email string metadata on small panels to protect formatting arrays */}
                <span className="hidden sm:inline">Admin ({user.email})</span>
                <span className="inline sm:hidden">Admin</span>
              </Link>
            </motion.div>
          ) : (
            <Link href="/admin/login" className="block">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center"
              >
                {/* DESKTOP VIEWPORT LAYOUT VIEW: Standard text layout format */}
                <Button
                  variant="link"
                  className={cn(
                    'hidden md:flex cursor-pointer text-cyan-500 hover:text-primary transition-all duration-300 hover:no-underline gap-2 items-center',
                    isScrolled ? 'text-sm px-2' : 'text-base px-4',
                  )}
                >
                  Staff Login
                  <LogIn className={isScrolled ? 'h-3.5 w-3.5' : 'h-4 w-4'} />
                </Button>

                {/* MOBILE VIEWPORT LAYOUT VIEW: Compact button format */}
                <Button
                  variant="ghost"
                  size="icon"
                  className={cn(
                    'flex md:hidden cursor-pointer text-cyan-500 hover:text-primary transition-all duration-300 rounded-full items-center justify-center',
                    isScrolled ? 'h-8 w-8' : 'h-10 w-10',
                  )}
                  aria-label="Staff Login"
                >
                  <LogIn className={isScrolled ? 'h-4 w-4' : 'h-5 w-5'} />
                </Button>
              </motion.div>
            </Link>
          )}
        </motion.div>
      </motion.div>
    </header>
  )
}
