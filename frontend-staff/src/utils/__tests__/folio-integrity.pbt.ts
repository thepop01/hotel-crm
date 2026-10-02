/**
 * Property-Based Tests — Room Folio Integrity Invariants
 *
 * Invariants under test (from hotel-domain steering):
 *   1. folio.total always equals Σ charges.amount after every addCharge
 *   2. A settled folio rejects addCharge with an error
 *   3. All charge amounts must be ≥ 0
 *   4. total is always ≥ 0
 */

import { describe, it, expect } from 'vitest'
import * as fc from 'fast-check'
import {
  createFolio,
  addCharge,
  settleFolio,
  isFolioTotalConsistent,
  type FolioCharge,
  type ChargeType,
} from '../folio-integrity'

const CHARGE_TYPES: ChargeType[] = ['room', 'food', 'service', 'amenity', 'minibar', 'misc']

const chargeArb = fc.record<FolioCharge>({
  id: fc.uuid(),
  type: fc.constantFrom(...CHARGE_TYPES),
  description: fc.string({ minLength: 1, maxLength: 50 }),
  amount: fc.float({ min: 0, max: Math.fround(100_000), noNaN: true }),
  timestamp: fc.date({ min: new Date('2024-01-01'), max: new Date('2030-12-31') }),
})

describe('Folio integrity invariants', () => {
  it('folio.total is always consistent with sum of charges after each addCharge', () => {
    fc.assert(
      fc.property(
        fc.array(chargeArb, { minLength: 0, maxLength: 30 }),
        fc.uuid(),
        (charges, folioId) => {
          let folio = createFolio(folioId)
          for (const charge of charges) {
            folio = addCharge(folio, charge)
            if (!isFolioTotalConsistent(folio)) return false
          }
          return true
        },
      ),
      { numRuns: 500 },
    )
  })

  it('folio.total is always ≥ 0', () => {
    fc.assert(
      fc.property(
        fc.array(chargeArb, { minLength: 0, maxLength: 30 }),
        fc.uuid(),
        (charges, folioId) => {
          let folio = createFolio(folioId)
          for (const charge of charges) {
            folio = addCharge(folio, charge)
          }
          return folio.total >= 0
        },
      ),
      { numRuns: 500 },
    )
  })

  it('adding a charge to a settled folio always throws', () => {
    fc.assert(
      fc.property(chargeArb, fc.uuid(), (charge, folioId) => {
        const folio = settleFolio(createFolio(folioId))
        let threw = false
        try {
          addCharge(folio, charge)
        } catch {
          threw = true
        }
        return threw
      }),
      { numRuns: 500 },
    )
  })

  it('settling an already-settled folio always throws', () => {
    fc.assert(
      fc.property(fc.uuid(), (folioId) => {
        const settled = settleFolio(createFolio(folioId))
        let threw = false
        try {
          settleFolio(settled)
        } catch {
          threw = true
        }
        return threw
      }),
      { numRuns: 300 },
    )
  })

  it('addCharge with a negative amount throws', () => {
    fc.assert(
      fc.property(
        fc.float({ min: Math.fround(-100_000), max: Math.fround(-0.01), noNaN: true }),
        fc.uuid(),
        fc.uuid(),
        (negativeAmount, folioId, chargeId) => {
          const folio = createFolio(folioId)
          let threw = false
          try {
            addCharge(folio, {
              id: chargeId,
              type: 'misc',
              description: 'test',
              amount: negativeAmount,
              timestamp: new Date(),
            })
          } catch {
            threw = true
          }
          return threw
        },
      ),
      { numRuns: 300 },
    )
  })

  it('folio total after N charges equals sum of all N charge amounts', () => {
    fc.assert(
      fc.property(
        fc.array(chargeArb, { minLength: 1, maxLength: 50 }),
        fc.uuid(),
        (charges, folioId) => {
          let folio = createFolio(folioId)
          for (const charge of charges) {
            folio = addCharge(folio, charge)
          }
          const expectedTotal = charges.reduce((s, c) => s + c.amount, 0)
          return Math.abs(folio.total - expectedTotal) < 0.01
        },
      ),
      { numRuns: 500 },
    )
  })
})

// ── Regression unit tests for any fast-check shrunk counter-examples ──────────

describe('Folio integrity regressions', () => {
  it('empty folio has total 0 and is consistent', () => {
    const folio = createFolio('test-id')
    expect(folio.total).toBe(0)
    expect(isFolioTotalConsistent(folio)).toBe(true)
  })

  it('single charge of 0 is accepted and total remains 0', () => {
    let folio = createFolio('test-id')
    folio = addCharge(folio, {
      id: 'c1',
      type: 'misc',
      description: 'complimentary',
      amount: 0,
      timestamp: new Date(),
    })
    expect(folio.total).toBe(0)
    expect(isFolioTotalConsistent(folio)).toBe(true)
  })
})
