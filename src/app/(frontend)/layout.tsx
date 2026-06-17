import React from 'react'
import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import { headers as getHeaders } from 'next/headers'
import { getPayload } from 'payload'
import config from '@/payload.config'
import Header from '@/components/Header'
import './styles.css'

import 'sharp'
import MotionReveal from '@/components/motion/MotionReveal'

export const dynamic = 'force-dynamic'

const geistSans = Geist({
  variable: '--font-sans',
  subsets: ['latin'],
})

const geistMono = Geist_Mono({
  variable: '--font-mono',
  subsets: ['latin'],
})

export const metadata: Metadata = {
  title: 'Mariposa Yacht Charters',
  description: 'Luxury private day trips along the Mexican coastline.',
}

export default async function RootLayout(props: { children: React.ReactNode }) {
  const clientHeaders = await getHeaders()
  const payloadConfig = await config
  const payload = await getPayload({ config: payloadConfig })
  const { user } = await payload.auth({ headers: clientHeaders })
  const { children } = props

  return (
    <html lang="en" suppressHydrationWarning data-scroll-behavior="smooth">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased font-sans`}>
        <Header user={user} />
        <main className="flex-1">{children}</main>
      </body>
    </html>
  )
}
