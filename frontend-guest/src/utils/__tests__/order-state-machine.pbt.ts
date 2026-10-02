/**
 * Property-Based Tests — Order State Machine Invariants
 *
 * Invariants under test (from hotel-domain steering):
 *   1. An order in 'delivered' state cannot transition to any other state
 *   2. An order in 'cancelled' state cannot transition to any other state
 *   3. No transition can skip a stage in the forward path
 *   4. 'cancelled' is only reachable from 'placed'
 *   5. isValidOrderTransition is consistent with transitionOrderStatus (throws ↔ returns false)
 */

import { describe, it, expect } from 'vitest'
import * as fc from 'fast-check'
import {
  type OrderStatus,
  isValidOrderTransition,
  transitionOrderStatus,
  orderStatusIndex,
  ORDER_STAGE_SEQUENCE,
} from '../order-state-machine'

const ALL_STATUSES: OrderStatus[] = [
  'placed',
  'in-kitchen',
  'out-for-delivery',
  'delivered',
  'cancelled',
]

const statusArb = fc.constantFrom(...ALL_STATUSES)

describe('Order state machine invariants', () => {
  it('"delivered" is a terminal state — no outgoing transitions', () => {
    fc.assert(
      fc.property(statusArb, (to) => {
        return !isValidOrderTransition('delivered', to)
      }),
      { numRuns: ALL_STATUSES.length * 10 },
    )
  })

  it('"cancelled" is a terminal state — no outgoing transitions', () => {
    fc.assert(
      fc.property(statusArb, (to) => {
        return !isValidOrderTransition('cancelled', to)
      }),
      { numRuns: ALL_STATUSES.length * 10 },
    )
  })

  it('transitionOrderStatus throws exactly when isValidOrderTransition returns false', () => {
    fc.assert(
      fc.property(statusArb, statusArb, (from, to) => {
        const valid = isValidOrderTransition(from, to)
        if (valid) {
          // Should not throw
          const result = transitionOrderStatus(from, to)
          return result === to
        } else {
          // Should throw
          let threw = false
          try {
            transitionOrderStatus(from, to)
          } catch {
            threw = true
          }
          return threw
        }
      }),
      { numRuns: 500 },
    )
  })

  it('no forward stage transition can skip an intermediate stage', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 0, max: ORDER_STAGE_SEQUENCE.length - 1 }),
        fc.integer({ min: 0, max: ORDER_STAGE_SEQUENCE.length - 1 }),
        (fromIdx, toIdx) => {
          if (toIdx <= fromIdx) return true // backward / same — not a skip test
          if (toIdx - fromIdx === 1) return true // direct next step — allowed
          // Skipping at least one stage in the forward path must be invalid
          const from = ORDER_STAGE_SEQUENCE[fromIdx]
          const to = ORDER_STAGE_SEQUENCE[toIdx]
          return !isValidOrderTransition(from, to)
        },
      ),
      { numRuns: 500 },
    )
  })

  it('no backward transition is valid in the forward stage sequence', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 1, max: ORDER_STAGE_SEQUENCE.length - 1 }),
        (toIdx) => {
          const fromIdx = toIdx // from a later stage
          // Pick any to that is earlier
          const earlierIdx = fc.sample(fc.integer({ min: 0, max: toIdx - 1 }), 1)[0]
          const from = ORDER_STAGE_SEQUENCE[fromIdx]
          const to = ORDER_STAGE_SEQUENCE[earlierIdx]
          return !isValidOrderTransition(from, to)
        },
      ),
      { numRuns: 300 },
    )
  })

  it('"cancelled" is only reachable from "placed"', () => {
    fc.assert(
      fc.property(statusArb, (from) => {
        const canCancel = isValidOrderTransition(from, 'cancelled')
        return canCancel === (from === 'placed')
      }),
      { numRuns: 500 },
    )
  })

  it('orderStatusIndex is strictly increasing along the valid forward path', () => {
    for (let i = 0; i < ORDER_STAGE_SEQUENCE.length - 1; i++) {
      const current = ORDER_STAGE_SEQUENCE[i]
      const next = ORDER_STAGE_SEQUENCE[i + 1]
      expect(orderStatusIndex(next)).toBeGreaterThan(orderStatusIndex(current))
    }
  })
})
