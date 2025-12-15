'use client'

import { useState, useEffect } from 'react'

interface BookedDate {
  checkIn: string
  checkOut: string
  status: string
}

interface AvailabilityData {
  bookings: BookedDate[]
  blockedDates: string[]
}

interface AvailabilityCalendarProps {
  listingId: string
  checkIn: string
  checkOut: string
  onCheckInChange: (date: string) => void
  onCheckOutChange: (date: string) => void
  minimumStay?: number
}

export default function AvailabilityCalendar({
  listingId,
  checkIn,
  checkOut,
  onCheckInChange,
  onCheckOutChange,
  minimumStay = 1,
}: AvailabilityCalendarProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date())
  const [bookedDates, setBookedDates] = useState<BookedDate[]>([])
  const [blockedDates, setBlockedDates] = useState<string[]>([])
  const [selecting, setSelecting] = useState<'checkIn' | 'checkOut'>('checkIn')

  useEffect(() => {
    fetchAvailability()
  }, [listingId])

  const fetchAvailability = async () => {
    try {
      const response = await fetch(`/api/listings/${listingId}/availability`)
      if (response.ok) {
        const data: AvailabilityData = await response.json()
        setBookedDates(data.bookings || [])
        setBlockedDates(data.blockedDates || [])
      }
    } catch (error) {
      console.error('Failed to fetch availability:', error)
    }
  }

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear()
    const month = date.getMonth()
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
    const daysInMonth = lastDay.getDate()
    const startingDay = firstDay.getDay()
    return { daysInMonth, startingDay }
  }

  const isDateBooked = (date: Date) => {
    const dateStr = date.toISOString().split('T')[0]

    // Check if date is blocked by host
    if (blockedDates.includes(dateStr)) return true

    // Check if date falls within a booking
    return bookedDates.some((booking) => {
      if (!['PENDING', 'CONFIRMED'].includes(booking.status)) return false
      const start = new Date(booking.checkIn)
      const end = new Date(booking.checkOut)
      const check = new Date(dateStr)
      return check >= start && check < end
    })
  }

  const isDatePast = (date: Date) => {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    return date < today
  }

  const isDateSelected = (date: Date) => {
    const dateStr = date.toISOString().split('T')[0]
    return dateStr === checkIn || dateStr === checkOut
  }

  const isDateInRange = (date: Date) => {
    if (!checkIn || !checkOut) return false
    const dateStr = date.toISOString().split('T')[0]
    return dateStr > checkIn && dateStr < checkOut
  }

  const handleDateClick = (date: Date) => {
    if (isDatePast(date) || isDateBooked(date)) return

    const dateStr = date.toISOString().split('T')[0]

    if (selecting === 'checkIn') {
      onCheckInChange(dateStr)
      onCheckOutChange('')
      setSelecting('checkOut')
    } else {
      if (dateStr <= checkIn) {
        // If selected date is before check-in, reset
        onCheckInChange(dateStr)
        onCheckOutChange('')
      } else {
        // Check if any dates in range are booked
        const start = new Date(checkIn)
        const end = new Date(dateStr)
        let hasBookedDate = false
        for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
          if (isDateBooked(d)) {
            hasBookedDate = true
            break
          }
        }
        if (hasBookedDate) {
          // Reset and start over
          onCheckInChange(dateStr)
          onCheckOutChange('')
        } else {
          onCheckOutChange(dateStr)
          setSelecting('checkIn')
        }
      }
    }
  }

  const { daysInMonth, startingDay } = getDaysInMonth(currentMonth)
  const monthName = currentMonth.toLocaleDateString('en-AU', { month: 'long', year: 'numeric' })

  const prevMonth = () => {
    const today = new Date()
    const newMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1)
    if (newMonth >= new Date(today.getFullYear(), today.getMonth(), 1)) {
      setCurrentMonth(newMonth)
    }
  }

  const nextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1))
  }

  const canGoPrev = () => {
    const today = new Date()
    const prevMonthDate = new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1)
    return prevMonthDate >= new Date(today.getFullYear(), today.getMonth(), 1)
  }

  return (
    <div className="bg-white dark:bg-[var(--muted)] rounded-lg p-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={prevMonth}
          disabled={!canGoPrev()}
          className="p-2 hover:bg-[var(--muted)] rounded-lg transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <h3 className="font-semibold">{monthName}</h3>
        <button
          onClick={nextMonth}
          className="p-2 hover:bg-[var(--muted)] rounded-lg transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      {/* Day names */}
      <div className="grid grid-cols-7 gap-1 mb-2">
        {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map((day) => (
          <div key={day} className="text-center text-xs font-medium text-[var(--foreground)]/60 py-2">
            {day}
          </div>
        ))}
      </div>

      {/* Calendar grid */}
      <div className="grid grid-cols-7 gap-1">
        {/* Empty cells for days before the first of the month */}
        {Array.from({ length: startingDay }).map((_, i) => (
          <div key={`empty-${i}`} className="aspect-square" />
        ))}

        {/* Days of the month */}
        {Array.from({ length: daysInMonth }).map((_, i) => {
          const day = i + 1
          const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day)
          const isPast = isDatePast(date)
          const isBooked = isDateBooked(date)
          const isSelected = isDateSelected(date)
          const isInRange = isDateInRange(date)
          const isDisabled = isPast || isBooked

          return (
            <button
              key={day}
              onClick={() => handleDateClick(date)}
              disabled={isDisabled}
              className={`aspect-square flex items-center justify-center text-sm rounded-lg transition-colors ${
                isSelected
                  ? 'bg-[var(--primary)] text-white font-medium'
                  : isInRange
                  ? 'bg-[var(--primary)]/10 text-[var(--primary)]'
                  : isDisabled
                  ? 'text-[var(--foreground)]/30 cursor-not-allowed line-through'
                  : 'hover:bg-[var(--muted)] text-[var(--foreground)]'
              }`}
            >
              {day}
            </button>
          )
        })}
      </div>

      {/* Legend */}
      <div className="mt-4 pt-4 border-t border-[var(--border)] flex flex-wrap gap-4 text-xs">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-[var(--primary)] rounded" />
          <span>Selected</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-[var(--primary)]/10 rounded" />
          <span>Your stay</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-[var(--muted)] rounded relative">
            <span className="absolute inset-0 flex items-center justify-center line-through text-[var(--foreground)]/30">-</span>
          </div>
          <span>Unavailable</span>
        </div>
      </div>

      {/* Selection hint */}
      <p className="mt-3 text-xs text-[var(--foreground)]/60 text-center">
        {!checkIn
          ? 'Select check-in date'
          : !checkOut
          ? 'Select check-out date'
          : `${Math.ceil((new Date(checkOut).getTime() - new Date(checkIn).getTime()) / (1000 * 60 * 60 * 24))} nights selected`}
      </p>
    </div>
  )
}
