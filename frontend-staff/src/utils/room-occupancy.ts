/**
 * Room occupancy / double-booking prevention utilities.
 *
 * Invariant: No two bookings for the same room may have overlapping date ranges
 * when both are in a confirmed or checked-in state.
 */

export type BookingStatus = 'confirmed' | 'checked_in' | 'checked_out' | 'cancelled'

export interface DateRange {
  checkIn: Date
  checkOut: Date
}

export interface RoomBookingSlot {
  roomId: string
  checkIn: Date
  checkOut: Date
  status: BookingStatus
}

/** Active statuses that block a room from being re-booked */
const BLOCKING_STATUSES: BookingStatus[] = ['confirmed', 'checked_in']

/**
 * Returns true if two date ranges overlap.
 * Uses half-open interval semantics: [checkIn, checkOut).
 * Two bookings that share only a boundary date (e.g. one checks out the day
 * another checks in) are NOT considered overlapping.
 */
export function dateRangesOverlap(a: DateRange, b: DateRange): boolean {
  return a.checkIn < b.checkOut && b.checkIn < a.checkOut
}

/**
 * Returns true if adding `newBooking` would cause a double-booking conflict
 * against the existing bookings for the same room.
 */
export function wouldCauseDoubleBooking(
  newBooking: DateRange & { roomId: string },
  existingBookings: RoomBookingSlot[],
): boolean {
  return existingBookings.some(
    (existing) =>
      existing.roomId === newBooking.roomId &&
      BLOCKING_STATUSES.includes(existing.status) &&
      dateRangesOverlap(
        { checkIn: newBooking.checkIn, checkOut: newBooking.checkOut },
        { checkIn: existing.checkIn, checkOut: existing.checkOut },
      ),
  )
}

/**
 * Returns the number of nights between checkIn and checkOut.
 * Throws if checkOut is not after checkIn.
 */
export function calculateNights(checkIn: Date, checkOut: Date): number {
  if (checkOut <= checkIn) {
    throw new Error('checkOut must be after checkIn')
  }
  const msPerDay = 1000 * 60 * 60 * 24
  return Math.ceil((checkOut.getTime() - checkIn.getTime()) / msPerDay)
}
