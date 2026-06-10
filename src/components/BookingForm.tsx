'use client'

import * as React from 'react'
import { useState } from 'react'
import { format, isSameDay } from 'date-fns'
import { Calendar as CalendarIcon } from 'lucide-react'

// Shadcn UI Component Primitives
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
  unavailableDates: string[] // Array of YYYY-MM-DD strings from Supabase/Payload
}

export default function BookingForm({ itineraries, unavailableDates }: BookingFormProps) {
  const [selectedItinerary, setSelectedItinerary] = useState<string>('')
  const [date, setDate] = useState<Date | undefined>(undefined)

  // Map the YYYY-MM-DD strings back into JavaScript Date objects for calendar integration
  const disabledDates = unavailableDates.map((dStr) => {
    const [year, month, day] = dStr.split('-').map(Number)
    return new Date(year, month - 1, day)
  })

  // Calculate dynamic threshold rules (e.g. locking out past windows)
  const tomorrow = new Date()
  tomorrow.setDate(tomorrow.getDate() + 1)

  return (
    <form
      method="POST"
      action="/api/checkout"
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

      {/* HIDDEN PASS-THROUGH INPUTS FOR NATIVE HTML POST FORMS */}
      <input type="hidden" name="itineraryId" value={selectedItinerary} required />
      <input
        type="hidden"
        name="bookingDate"
        value={date ? format(date, 'yyyy-MM-dd') : ''}
        required
      />

      {/* FIELD 1: EXCURSION PICKER */}
      <div className="space-y-2">
        <Label htmlFor="itinerary-select" className="text-sm font-semibold tracking-wide">
          Select Your Excursion:
        </Label>
        <Select value={selectedItinerary} onValueChange={setSelectedItinerary} required>
          <SelectTrigger id="itinerary-select" className="w-full bg-background border-input">
            <SelectValue placeholder="Choose a coastline blueprint trip..." />
          </SelectTrigger>
          <SelectContent className="bg-popover border-border font-sans p-1">
            {itineraries.map((trip) => (
              <SelectItem key={trip.id} value={trip.id.toString()}>
                {trip.title} (${trip.price} USD)
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* FIELD 2: SHADCN MODERN DATE PICKER */}
      <div className="space-y-2">
        <Label className="text-sm font-semibold tracking-wide block">
          Choose an Available Date:
        </Label>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              type="button"
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
              disabled={[
                { before: tomorrow }, // Lock out past dates and today for preparation lead time
                ...disabledDates, // Directly disables pre-existing reservations or maintenance blocks
              ]}
            />
          </PopoverContent>
        </Popover>
        <small className="text-xs text-muted-foreground block mt-1">
          * Some dates are already booked or reserved for scheduled vessel maintenance.
        </small>
      </div>

      {/* FIELD 3: LEAD PASSENGER CUSTOMER NAME */}
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
          className="bg-background border-input placeholder:text-muted-foreground/60"
        />
      </div>

      {/* FIELD 4 & 5: DUAL COLUMN MANIFEST CONTACT DESK */}
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
            className="bg-background border-input placeholder:text-muted-foreground/60"
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
            className="bg-background border-input placeholder:text-muted-foreground/60"
          />
        </div>
      </div>

      {/* FIELD 6: PASSENGER CAPACITY ENFORCEMENT COUNTER */}
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
          className="bg-background border-input w-full"
        />
        <small className="text-xs text-muted-foreground block mt-1">
          Vessel physical restriction threshold limit: 12 passengers total.
        </small>
      </div>

      {/* SUBMIT TRANSACTION ACTION TRIGGER */}
      <Button
        type="submit"
        disabled={!date || !selectedItinerary}
        className="w-full text-base font-bold h-12 transition-all mt-4 shadow-sm cursor-pointer"
      >
        Continue to Secure Checkout
      </Button>
    </form>
  )
}
