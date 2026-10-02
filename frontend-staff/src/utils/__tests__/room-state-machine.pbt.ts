/**
 * Property-Based Tests — Room Status State Machine Invariants
 *
 * Invariants under test (from hotel-domain steering):
 *   1. Only available → occupied, occupied → cleaning, cleaning → available are valid
 *   2. All other transitions throw / return false
 *   3. The cycle available → occupied → cleaning → available is self-consistent
 */

import { describe, it } from 'vitest'
import * as fc from 'fast-check'
import {
  type RoomStatus,
  isValidRoomTransition,
  transitionRoomStatus,
  ROOM_STATUS_CYCLE,
} from '../room-state-machine'

const ALL_ROOM_STATUSES: RoomStatus[] = ['available', 'occupied', 'cleaning']
const statusArb = fc.constantFrom(...ALL_ROOM_STATUSES)

describe('Room state machine invariants', () => {
  it('the only valid transitions are available→occupied, occupied→cleaning, cleaning→available', () => {
    const VALID_PAIRS = new Set([
      'available→occupied',
      'occupied→cleaning',
      'cleaning→available',
    ])

    fc.assert(
      fc.property(statusArb, statusArb, (from, to) => {
        const key = `${from}→${to}`
        const expected = VALID_PAIRS.has(key)
        return isValidRoomTransition(from, to) === expected
      }),
      { numRuns: ALL_ROOM_STATUSES.length ** 2 * 50 },
    )
  })

  it('transitionRoomStatus throws exactly when isValidRoomTransition returns false', () => {
    fc.assert(
      fc.property(statusArb, statusArb, (from, to) => {
        const valid = isValidRoomTransition(from, to)
        if (valid) {
          const result = transitionRoomStatus(from, to)
          return result === to
        } else {
          let threw = false
          try {
            transitionRoomStatus(from, to)
          } catch {
            threw = true
          }
          return threw
        }
      }),
      { numRuns: 500 },
    )
  })

  it('no self-loop is valid (a room cannot transition to its own current status)', () => {
    fc.assert(
      fc.property(statusArb, (status) => {
        return !isValidRoomTransition(status, status)
      }),
      { numRuns: 200 },
    )
  })

  it('cycling available→occupied→cleaning→available is always valid', () => {
    // Walk the full cycle 100 times and verify each step is accepted
    fc.assert(
      fc.property(fc.integer({ min: 1, max: 100 }), (cycles) => {
        let current: RoomStatus = 'available'
        for (let i = 0; i < cycles * ROOM_STATUS_CYCLE.length; i++) {
          const nextIdx = (ROOM_STATUS_CYCLE.indexOf(current) + 1) % ROOM_STATUS_CYCLE.length
          const next = ROOM_STATUS_CYCLE[nextIdx]
          if (!isValidRoomTransition(current, next)) return false
          current = transitionRoomStatus(current, next)
        }
        return true
      }),
      { numRuns: 100 },
    )
  })

  it('reverse cycle (available←occupied, etc.) is never valid', () => {
    fc.assert(
      fc.property(fc.integer({ min: 0, max: ROOM_STATUS_CYCLE.length - 1 }), (idx) => {
        const from = ROOM_STATUS_CYCLE[idx]
        const prevIdx = (idx - 1 + ROOM_STATUS_CYCLE.length) % ROOM_STATUS_CYCLE.length
        const to = ROOM_STATUS_CYCLE[prevIdx]
        return !isValidRoomTransition(from, to)
      }),
      { numRuns: 300 },
    )
  })
})
