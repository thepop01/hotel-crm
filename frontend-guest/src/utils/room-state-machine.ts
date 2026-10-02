/**
 * Room status state machine.
 *
 * Valid lifecycle (from hotel-domain steering):
 *   available → occupied → cleaning → available
 *
 * No other transitions are permitted.
 */

export type RoomStatus = 'available' | 'occupied' | 'cleaning'

const VALID_ROOM_TRANSITIONS: Record<RoomStatus, RoomStatus[]> = {
  available: ['occupied'],
  occupied: ['cleaning'],
  cleaning: ['available'],
}

/**
 * Returns true if `from` → `to` is a permitted room status transition.
 */
export function isValidRoomTransition(from: RoomStatus, to: RoomStatus): boolean {
  return VALID_ROOM_TRANSITIONS[from].includes(to)
}

/**
 * Applies the transition, throwing on an illegal move.
 */
export function transitionRoomStatus(from: RoomStatus, to: RoomStatus): RoomStatus {
  if (!isValidRoomTransition(from, to)) {
    throw new Error(
      `Invalid room status transition: "${from}" → "${to}". ` +
        `Allowed from "${from}": [${VALID_ROOM_TRANSITIONS[from].join(', ')}]`,
    )
  }
  return to
}

/** All room statuses in lifecycle order */
export const ROOM_STATUS_CYCLE: RoomStatus[] = ['available', 'occupied', 'cleaning']
