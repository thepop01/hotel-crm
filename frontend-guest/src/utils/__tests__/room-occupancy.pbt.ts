/**
 * Property-Based Tests — Room Occupancy / Double-Booking Invariants
 *
 * Invariants under test (from hotel-domain steering):
 *   1. Two confirmed/checked-in bookings for the same room must never overlap
 *   2. A booking whose dates share only a boundary with an existing booking
 *      does NOT constitute a conflict (half-open interval semantics)
 *   3. Cancelled/checked-out bookings do not block new bookings
 *   4. calculateNights is always a positive integer when checkOut > checkIn
 */

import { describe, it } from 'vitest'
import * as fc from 'fast-check'
import {
  dateRangesOverlap,
  wouldCauseDoubleBooking,
  calculateNights,
  type RoomBookingSlot,
} from '../room-occupancy'

const dateArb = fc.date({
  min: new Date('2024-01-01'),
  max: new Date('2030-12-31'),
})

/** Generates a valid date range (checkOut strictly after checkIn) */
const dateRangeArb = fc
  .tuple(dateArb, dateArb)
  .filter(([a, b]) => b > a)
  .map(([a, b]) => ({ checkIn: a, checkOut: b }))

describe('Room occupancy invariants', () => {
  it('dateRangesOverlap is commutative', () => {
    fc.assert(
      fc.property(dateRangeArb, dateRangeArb, (a, b) => {
        return dateRangesOverlap(a, b) === dateRangesOverlap(b, a)
      }),
      { numRuns: 1000 },
    )
  })

  it('non-overlapping same-room confirmed bookings do not cause a conflict', () => {
    fc.assert(
      fc.property(
        // Two non-overlapping ranges: first ends before second starts
        fc.tuple(dateArb, dateArb, dateArb).filter(([a, b, c]) => a < b && b <= c),
        fc.uuid(),
        ([start, mid, end], roomId) => {
          const existing: RoomBookingSlot[] = [
            { roomId, checkIn: start, checkOut: mid, status: 'confirmed' },
          ]
          const newBooking = { roomId, checkIn: mid, checkOut: end }
          // Boundary-sharing (checkOut === checkIn) should NOT conflict
          return !wouldCauseDoubleBooking(newBooking, existing)
        },
      ),
      { numRuns: 500 },
    )
  })

  it('overlapping same-room confirmed bookings always cause a conflict', () => {
    fc.assert(
      fc.property(
        // Two ranges that definitely overlap: new booking starts before existing ends
        fc.tuple(dateArb, dateArb, dateArb).filter(([a, b, c]) => a < b && a < c && b < c),
        fc.uuid(),
        ([sharedStart, existingEnd, newEnd], roomId) => {
          // existing: [sharedStart, existingEnd), new: [sharedStart, newEnd)
          // They share sharedStart so they definitely overlap
          const existing: RoomBookingSlot[] = [
            { roomId, checkIn: sharedStart, checkOut: existingEnd, status: 'confirmed' },
          ]
          const newBooking = { roomId, checkIn: sharedStart, checkOut: newEnd }
          return wouldCauseDoubleBooking(newBooking, existing)
        },
      ),
      { numRuns: 500 },
    )
  })

  it('cancelled and checked-out bookings never block new bookings', () => {
    fc.assert(
      fc.property(
        dateRangeArb,
        dateRangeArb,
        fc.uuid(),
        fc.constantFrom<'checked_out' | 'cancelled'>('checked_out', 'cancelled'),
        (existing, newRange, roomId, inactiveStatus) => {
          const existingBookings: RoomBookingSlot[] = [
            { roomId, ...existing, status: inactiveStatus },
          ]
          return !wouldCauseDoubleBooking({ roomId, ...newRange }, existingBookings)
        },
      ),
      { numRuns: 500 },
    )
  })

  it('different rooms never conflict regardless of dates', () => {
    fc.assert(
      fc.property(dateRangeArb, dateRangeArb, fc.uuid(), fc.uuid(), (r1, r2, roomA, roomB) => {
        fc.pre(roomA !== roomB)
        const existing: RoomBookingSlot[] = [
          { roomId: roomA, ...r1, status: 'confirmed' },
        ]
        return !wouldCauseDoubleBooking({ roomId: roomB, ...r2 }, existing)
      }),
      { numRuns: 500 },
    )
  })

  it('calculateNights returns a positive integer when checkOut > checkIn', () => {
    fc.assert(
      fc.property(
        fc.tuple(dateArb, dateArb).filter(([a, b]) => b > a),
        ([checkIn, checkOut]) => {
          const nights = calculateNights(checkIn, checkOut)
          return nights >= 1 && Number.isInteger(nights)
        },
      ),
      { numRuns: 1000 },
    )
  })

  it('calculateNights throws when checkOut ≤ checkIn', () => {
    fc.assert(
      fc.property(
        fc.tuple(dateArb, dateArb).filter(([a, b]) => b <= a),
        ([checkIn, checkOut]) => {
          let threw = false
          try {
            calculateNights(checkIn, checkOut)
          } catch {
            threw = true
          }
          return threw
        },
      ),
      { numRuns: 300 },
    )
  })
})
