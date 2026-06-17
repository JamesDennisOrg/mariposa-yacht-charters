'use client'

import React from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { LogIn } from 'lucide-react'
import { motion, useScroll, useMotionValueEvent } from 'motion/react'
import { cn } from '@/lib/utils'

interface HeaderProps {
  user: {
    email: string
    [key: string]: any
  } | null
}

export default function Header({ user }: HeaderProps) {
  const [isScrolled, setIsScrolled] = React.useState(false)
  const { scrollY } = useScroll()

  useMotionValueEvent(scrollY, 'change', (latest) => {
    setIsScrolled(latest > 100)
  })

  return (
    <motion.header
      className="fixed w-full z-50"
      initial={false}
      animate={{
        top: isScrolled ? '0' : '1.5rem',
        left: isScrolled ? '0' : '50%',
        x: isScrolled ? '0' : '-50%',
        borderRadius: isScrolled ? '0px' : '12px',
        maxWidth: isScrolled ? '100%' : '80rem',
        paddingLeft: isScrolled ? '1rem' : '2rem',
        paddingRight: isScrolled ? '1rem' : '2rem',
        paddingTop: isScrolled ? '0.375rem' : '0.5rem',
        paddingBottom: isScrolled ? '0.375rem' : '0.5rem',
        backgroundColor: isScrolled ? 'rgba(15, 118, 110, 0.95)' : 'rgba(15, 118, 110, 0.6)',
        backdropFilter: isScrolled ? 'blur(12px)' : 'blur(8px)',
        boxShadow: isScrolled
          ? '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
          : '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
      }}
      transition={{
        type: 'tween',
        stiffness: 300,
        damping: 30,
      }}
    >
      <nav
        className={cn(
          'flex justify-between items-center max-w-7xl mx-auto transition-all duration-300',
          isScrolled ? 'h-14' : 'h-auto',
        )}
      >
        <div className="flex flex-col">
          <Link href="/" className="block">
            <motion.h1
              className="font-extrabold tracking-tight m-0 bg-linear-to-r from-teal-400 via-cyan-400 to-blue-500 bg-clip-text text-transparent drop-shadow-sm drop-shadow-black"
              animate={{
                fontSize: isScrolled ? 'clamp(1.25rem, 1.8vw, 2rem)' : 'clamp(1.5rem, 3vw, 2.5rem)',
              }}
              transition={{
                type: 'tween',
                stiffness: 400,
                damping: 25,
              }}
            >
              Mariposa Yacht Charters
            </motion.h1>
          </Link>
          {!isScrolled && (
            <motion.p
              className="hidden lg:block text-white/65 font-sans text-sm -mt-1 lg:-mt-3"
              initial={{ opacity: 1, height: 'auto' }}
              animate={{ opacity: isScrolled ? 0 : 1, height: isScrolled ? 0 : 'auto' }}
              transition={{ duration: 0.2 }}
            >
              Premium daily hire along the breathtaking Mexican coastline.
            </motion.p>
          )}
        </div>

        <div className="flex items-center">
          {user ? (
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Link
                href="/admin"
                className={cn(
                  'px-4 py-2 rounded-lg text-sm font-semibold shadow-sm transition-colors',
                  'bg-slate-900 hover:bg-slate-800 dark:bg-slate-100 dark:hover:bg-slate-200',
                  'text-white dark:text-slate-900',
                  isScrolled ? 'px-3 py-1.5 text-xs' : 'px-4 py-2',
                )}
              >
                Admin Dashboard ({user.email})
              </Link>
            </motion.div>
          ) : (
            <Link href="/admin/login">
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button
                  variant="link"
                  className={cn(
                    'cursor-pointer text-cyan-500 hover:text-primary transition-all duration-300 hover:no-underline gap-2',
                    isScrolled ? 'text-sm' : 'text-base',
                  )}
                >
                  Staff Login
                  <LogIn className={cn('h-4 w-4', isScrolled && 'h-3.5 w-3.5')} />
                </Button>
              </motion.div>
            </Link>
          )}
        </div>
      </nav>
    </motion.header>
  )
}
