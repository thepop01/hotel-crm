/**
 * Property-Based Tests — Order Pricing Invariants
 *
 * Invariants under test (from hotel-domain steering):
 *   1. total_amount = subtotal + tax_amount + service_charge - discount_applied
 *   2. total_amount ≥ 0 for all valid inputs
 *   3. discount_applied ≤ (subtotal + tax_amount + service_charge)
 *   4. subtotal = Σ(quantity × unit_price)
 *
 * NOTE: fc.float in fast-check v4 requires bounds to be 32-bit floats.
 * We use Math.fround() on all float min/max values.
 */

import { describe, it } from 'vitest'
import * as fc from 'fast-check'
import { calculateOrderTotal } from '../order-total'

const itemArb = fc.record({
  quantity: fc.integer({ min: 1, max: 99 }),
  unit_price: fc.float({ min: Math.fround(0.01), max: Math.fround(10_000), noNaN: true }),
  tax_rate: fc.float({ min: 0, max: Math.fround(0.28), noNaN: true }),
})

const serviceChargeRateArb = fc.float({ min: 0, max: Math.fround(0.2), noNaN: true })
const discountArb = fc.float({ min: 0, max: Math.fround(1_000_000), noNaN: true })

describe('Order pricing invariants', () => {
  it('subtotal equals sum of (quantity × unit_price) for all items', () => {
    fc.assert(
      fc.property(
        fc.array(itemArb, { minLength: 1, maxLength: 20 }),
        serviceChargeRateArb,
        discountArb,
        (items, serviceChargeRate, discount) => {
          const result = calculateOrderTotal({ items, service_charge_rate: serviceChargeRate, discount })
          const expectedSubtotal = items.reduce((s, i) => s + i.quantity * i.unit_price, 0)
          return Math.abs(result.subtotal - expectedSubtotal) < 0.1
        },
      ),
      { numRuns: 1000 },
    )
  })

  it('total_amount = subtotal + tax_amount + service_charge - discount_applied', () => {
    fc.assert(
      fc.property(
        fc.array(itemArb, { minLength: 1, maxLength: 20 }),
        serviceChargeRateArb,
        discountArb,
        (items, serviceChargeRate, discount) => {
          const r = calculateOrderTotal({ items, service_charge_rate: serviceChargeRate, discount })
          const recomputed = r.subtotal + r.tax_amount + r.service_charge - r.discount_applied
          return Math.abs(r.total_amount - recomputed) < 0.1
        },
      ),
      { numRuns: 1000 },
    )
  })

  it('total_amount is never negative regardless of discount size', () => {
    fc.assert(
      fc.property(
        fc.array(itemArb, { minLength: 1, maxLength: 20 }),
        serviceChargeRateArb,
        discountArb,
        (items, serviceChargeRate, discount) => {
          const result = calculateOrderTotal({ items, service_charge_rate: serviceChargeRate, discount })
          return result.total_amount >= 0
        },
      ),
      { numRuns: 1000 },
    )
  })

  it('discount_applied never exceeds gross total (subtotal + tax + service)', () => {
    fc.assert(
      fc.property(
        fc.array(itemArb, { minLength: 1, maxLength: 20 }),
        serviceChargeRateArb,
        discountArb,
        (items, serviceChargeRate, discount) => {
          const r = calculateOrderTotal({ items, service_charge_rate: serviceChargeRate, discount })
          const gross = r.subtotal + r.tax_amount + r.service_charge
          return r.discount_applied <= gross + 0.1
        },
      ),
      { numRuns: 1000 },
    )
  })

  it('zero-discount order total equals subtotal + tax + service', () => {
    fc.assert(
      fc.property(
        fc.array(itemArb, { minLength: 1, maxLength: 20 }),
        serviceChargeRateArb,
        (items, serviceChargeRate) => {
          const r = calculateOrderTotal({ items, service_charge_rate: serviceChargeRate, discount: 0 })
          const expected = r.subtotal + r.tax_amount + r.service_charge
          return Math.abs(r.total_amount - expected) < 0.1
        },
      ),
      { numRuns: 1000 },
    )
  })
})
