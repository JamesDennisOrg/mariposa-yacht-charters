'use client'

import * as React from 'react'
import { useState } from 'react'
import { format } from 'date-fns'
import { Calendar as CalendarIcon, Loader2 } from 'lucide-react' // Added a loader icon for premium UX feedback

import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

interface Itinerary {
  id: number
  title: string
  price: number
}

interface BookingFormProps {
  itineraries: Itinerary[]
  unavailableDates: string[]
}

export default function BookingForm({ itineraries, unavailableDates }: BookingFormProps) {
  const [selectedItinerary, setSelectedItinerary] = useState<string>('')
  const [date, setDate] = useState<Date | undefined>(undefined)
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false) // Track checkout transition state

  const disabledDates = unavailableDates.map((dStr) => {
    const [year, month, day] = dStr.split('-').map(Number)
    return new Date(year, month - 1, day)
  })

  const tomorrow = new Date()
  tomorrow.setDate(tomorrow.getDate() + 1)

  // Modern Client-Side Submit Interceptor
  const handleClientSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!date || !selectedItinerary) return

    setIsSubmitting(true)

    try {
      // Gather inputs into a native FormData wrapper
      const formData = new FormData(e.currentTarget)
      formData.append('itineraryId', selectedItinerary)
      formData.append('bookingDate', format(date, 'yyyy-MM-dd'))

      // Send the standard asynchronous fetch request to our Next.js API endpoint
      const response = await fetch('/api/checkout', {
        method: 'POST',
        body: formData,
      })

      const data = await response.json()

      if (response.ok && data.url) {
        // Safe, top-level browser relocation to Stripe Checkout
        window.location.assign(data.url)
      } else {
        alert(data.error || 'An unexpected error occurred during checkout initialization.')
        setIsSubmitting(false)
      }
    } catch (err) {
      console.error('Checkout routing exception:', err)
      alert('Network failure connecting to payment engine.')
      setIsSubmitting(false)
    }
  }

  return (
    // Form action stripped and replaced with onSubmit interceptor
    <form
      onSubmit={handleClientSubmit}
      className="w-full bg-card text-card-foreground p-8 rounded-2xl border border-border shadow-xl space-y-6 max-w-4xl mx-auto transition-colors duration-200"
    >
      <div>
        <h3 className="text-2xl font-bold tracking-tight text-foreground">
          Instantly Book Your Charter
        </h3>
        <p className="text-sm text-muted-foreground mt-1">
          Provide your details below to check availability and proceed to checkout.
        </p>
      </div>

      {/* Field 1: Excursion */}
      <div className="space-y-2">
        <Label htmlFor="itinerary-select" className="text-sm font-semibold tracking-wide">
          Select Your Excursion:
        </Label>
        <Select
          value={selectedItinerary}
          onValueChange={setSelectedItinerary}
          required
          disabled={isSubmitting}
        >
          <SelectTrigger id="itinerary-select" className="w-full bg-background border-input">
            <SelectValue placeholder="Choose a coastline blueprint trip..." />
          </SelectTrigger>
          <SelectContent className="bg-popover border-border">
            {itineraries.map((trip) => (
              <SelectItem key={trip.id} value={trip.id.toString()}>
                {trip.title} (${trip.price} USD)
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Field 2: Date Picker */}
      <div className="space-y-2">
        <Label className="text-sm font-semibold tracking-wide block">
          Choose an Available Date:
        </Label>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              type="button"
              disabled={isSubmitting}
              className={`w-full justify-start text-left font-normal border-input bg-background h-10 px-3 ${!date && 'text-muted-foreground'}`}
            >
              <CalendarIcon className="mr-2 h-4 w-4 text-muted-foreground shrink-0" />
              {date ? format(date, 'PPP') : <span>Pick a calendar date...</span>}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0 border-border bg-popover" align="start">
            <Calendar
              mode="single"
              selected={date}
              onSelect={setDate}
              disabled={[{ before: tomorrow }, ...disabledDates]}
            />
          </PopoverContent>
        </Popover>
      </div>

      {/* Passenger Input Fields */}
      <div className="space-y-2">
        <Label htmlFor="customerName" className="text-sm font-semibold tracking-wide">
          Full Name:
        </Label>
        <Input
          type="text"
          id="customerName"
          name="customerName"
          required
          placeholder="Lead Passenger Name"
          disabled={isSubmitting}
          className="bg-background border-input"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="customerEmail" className="text-sm font-semibold tracking-wide">
            Email Address:
          </Label>
          <Input
            type="email"
            id="customerEmail"
            name="customerEmail"
            required
            placeholder="name@domain.com"
            disabled={isSubmitting}
            className="bg-background border-input"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="customerPhone" className="text-sm font-semibold tracking-wide">
            Phone Contact:
          </Label>
          <Input
            type="tel"
            id="customerPhone"
            name="customerPhone"
            required
            placeholder="+1 555-000-0000"
            disabled={isSubmitting}
            className="bg-background border-input"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="guestCount" className="text-sm font-semibold tracking-wide">
          Total Guest Count:
        </Label>
        <Input
          type="number"
          id="guestCount"
          name="guestCount"
          min={1}
          max={12}
          defaultValue={2}
          required
          disabled={isSubmitting}
          className="bg-background border-input w-full"
        />
      </div>

      {/* Button with dynamic loading state mapping */}
      <Button
        type="submit"
        disabled={!date || !selectedItinerary || isSubmitting}
        className="w-full text-base font-bold h-12 transition-all mt-4 shadow-sm"
      >
        {isSubmitting ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Connecting to Secure Payments...
          </>
        ) : (
          'Continue to Secure Checkout'
        )}
      </Button>
    </form>
  )
}
