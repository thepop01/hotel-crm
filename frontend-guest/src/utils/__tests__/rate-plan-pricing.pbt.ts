/**
 * Property-Based Tests — Rate Plan Pricing Invariants
 *
 * Invariants under test (from hotel-domain steering / specs/room-booking-service):
 *   1. Effective nightly price is always ≥ 0
 *   2. When multiple plans match, the most-specific (narrowest date range) wins
 *   3. Falls back to basePricePerNight when no plan matches
 *   4. Total booking cost = sum of per-night effective prices (always ≥ 0)
 *
 * NOTE: fc.float in fast-check v4 requires bounds to be 32-bit floats.
 * We use Math.fround() on all float min/max values.
 */

import { describe, it } from 'vitest'
import * as fc from 'fast-check'
import {
  getEffectiveNightlyRate,
  getActivePlanForDate,
  calculateBookingTotal,
  type RatePlan,
} from '../rate-plan'

const MIN_DATE = new Date('2024-01-01')
const MAX_DATE = new Date('2030-12-31')

const dateArb = fc.date({ min: MIN_DATE, max: MAX_DATE })
const priceArb = fc.float({ min: 0, max: Math.fround(50_000), noNaN: true })

const ratePlanArb = fc
  .tuple(dateArb, dateArb)
  .filter(([a, b]) => b > a)
  .chain(([validFrom, validUntil]) =>
    fc.record({
      id: fc.uuid(),
      roomType: fc.constantFrom('Standard', 'Deluxe', 'Suite') as fc.Arbitrary<string>,
      pricePerNight: priceArb,
      validFrom: fc.constant(validFrom),
      validUntil: fc.constant(validUntil),
      daysOfWeek: fc.oneof(
        fc.constant<number[]>([]),
        fc.array(fc.integer({ min: 0, max: 6 }), { minLength: 1, maxLength: 7 }),
      ),
    }) as fc.Arbitrary<RatePlan>,
  )

describe('Rate plan pricing invariants', () => {
  it('effective nightly rate is always ≥ 0', () => {
    fc.assert(
      fc.property(
        fc.constantFrom('Standard', 'Deluxe', 'Suite'),
        dateArb,
        fc.array(ratePlanArb, { maxLength: 10 }),
        priceArb,
        (roomType, date, plans, basePrice) => {
          const rate = getEffectiveNightlyRate(roomType, date, plans, basePrice)
          return rate >= 0
        },
      ),
      { numRuns: 1000 },
    )
  })

  it('when no plan matches the date, falls back to basePricePerNight', () => {
    fc.assert(
      fc.property(
        fc.constantFrom('Standard', 'Deluxe', 'Suite'),
        dateArb,
        priceArb,
        (roomType, date, basePrice) => {
          const rate = getEffectiveNightlyRate(roomType, date, [], basePrice)
          return Math.abs(rate - Math.max(0, basePrice)) < 0.1
        },
      ),
      { numRuns: 500 },
    )
  })

  it('a matching plan always overrides the base price', () => {
    fc.assert(
      fc.property(
        fc.tuple(dateArb, dateArb).filter(([a, b]) => b > a),
        fc.float({ min: Math.fround(100), max: Math.fround(10_000), noNaN: true }),
        fc.float({ min: Math.fround(200), max: Math.fround(20_000), noNaN: true }),
        fc.uuid(),
        ([validFrom, validUntil], planPrice, basePrice, id) => {
          const msInRange = validUntil.getTime() - validFrom.getTime()
          const testDate = new Date(validFrom.getTime() + msInRange / 2)

          const plans: RatePlan[] = [
            {
              id,
              roomType: 'Standard',
              pricePerNight: planPrice,
              validFrom,
              validUntil,
              daysOfWeek: [],
            },
          ]

          const rate = getEffectiveNightlyRate('Standard', testDate, plans, basePrice)
          return Math.abs(rate - planPrice) < 0.1
        },
      ),
      { numRuns: 500 },
    )
  })

  it('most-specific (narrowest) plan wins when multiple plans overlap', () => {
    fc.assert(
      fc.property(
        fc.tuple(dateArb, dateArb).filter(([a, b]) => b > a),
        fc.uuid(),
        fc.uuid(),
        ([outerFrom, outerUntil], id1, id2) => {
          fc.pre(id1 !== id2)
          const innerMs = (outerUntil.getTime() - outerFrom.getTime()) / 4
          const innerFrom = new Date(outerFrom.getTime() + innerMs)
          const innerUntil = new Date(outerUntil.getTime() - innerMs)
          if (innerFrom >= innerUntil) return true

          const testDate = new Date(innerFrom.getTime() + (innerUntil.getTime() - innerFrom.getTime()) / 2)

          const outerPlan: RatePlan = {
            id: id1, roomType: 'Deluxe', pricePerNight: 1000,
            validFrom: outerFrom, validUntil: outerUntil, daysOfWeek: [],
          }
          const innerPlan: RatePlan = {
            id: id2, roomType: 'Deluxe', pricePerNight: 2000,
            validFrom: innerFrom, validUntil: innerUntil, daysOfWeek: [],
          }

          const winner = getActivePlanForDate('Deluxe', testDate, [outerPlan, innerPlan])
          return winner !== null && winner.id === id2
        },
      ),
      { numRuns: 300 },
    )
  })

  it('total booking cost is always ≥ 0', () => {
    fc.assert(
      fc.property(
        fc.tuple(dateArb, dateArb).filter(([a, b]) => {
          const nights = Math.ceil((b.getTime() - a.getTime()) / (1000 * 60 * 60 * 24))
          return nights >= 1 && nights <= 30
        }),
        fc.array(ratePlanArb, { maxLength: 5 }),
        priceArb,
        ([checkIn, checkOut], plans, basePrice) => {
          const total = calculateBookingTotal('Standard', checkIn, checkOut, plans, basePrice)
          return total >= 0
        },
      ),
      { numRuns: 500 },
    )
  })
})
