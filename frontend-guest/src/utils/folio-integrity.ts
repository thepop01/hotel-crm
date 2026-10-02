/**
 * Room Folio integrity utilities.
 *
 * Invariants (from hotel-domain steering):
 *   - folio.total = Σ charges.amount
 *   - A settled folio rejects new charges
 *   - Charge amounts are always ≥ 0
 */

export type FolioStatus = 'open' | 'settled'

export type ChargeType = 'room' | 'food' | 'service' | 'amenity' | 'minibar' | 'misc'

export interface FolioCharge {
  id: string
  type: ChargeType
  description: string
  amount: number     // ≥ 0
  timestamp: Date
}

export interface RoomFolio {
  id: string
  status: FolioStatus
  charges: FolioCharge[]
  total: number       // must equal Σ charges.amount
}

/**
 * Creates a new open folio with no charges.
 */
export function createFolio(id: string): RoomFolio {
  return { id, status: 'open', charges: [], total: 0 }
}

/**
 * Adds a charge to an open folio. Returns the updated folio.
 * Throws if the folio is settled.
 */
export function addCharge(folio: RoomFolio, charge: FolioCharge): RoomFolio {
  if (folio.status === 'settled') {
    throw new Error(`Cannot add charge to a settled folio (id: ${folio.id})`)
  }
  if (charge.amount < 0) {
    throw new Error(`Charge amount must be ≥ 0, got ${charge.amount}`)
  }
  const updatedCharges = [...folio.charges, charge]
  const updatedTotal = updatedCharges.reduce((sum, c) => sum + c.amount, 0)
  return { ...folio, charges: updatedCharges, total: updatedTotal }
}

/**
 * Settles a folio. Returns the settled folio.
 * Throws if already settled.
 */
export function settleFolio(folio: RoomFolio): RoomFolio {
  if (folio.status === 'settled') {
    throw new Error(`Folio ${folio.id} is already settled`)
  }
  return { ...folio, status: 'settled' }
}

/**
 * Recomputes and verifies that folio.total equals the sum of all charge amounts.
 * Returns true if consistent.
 */
export function isFolioTotalConsistent(folio: RoomFolio): boolean {
  const computed = folio.charges.reduce((sum, c) => sum + c.amount, 0)
  return Math.abs(folio.total - computed) < 0.001
}
