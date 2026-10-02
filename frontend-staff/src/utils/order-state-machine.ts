/**
 * Order status state machine.
 *
 * Valid transitions (from hotel-domain steering):
 *   placed → in-kitchen → out-for-delivery → delivered
 *   placed → cancelled
 *
 * Terminal states: delivered, cancelled (no outgoing transitions)
 */

export type OrderStatus =
  | 'placed'
  | 'in-kitchen'
  | 'out-for-delivery'
  | 'delivered'
  | 'cancelled'

/** All valid forward transitions as a map from current → allowed next states */
const VALID_TRANSITIONS: Record<OrderStatus, OrderStatus[]> = {
  placed: ['in-kitchen', 'cancelled'],
  'in-kitchen': ['out-for-delivery'],
  'out-for-delivery': ['delivered'],
  delivered: [],
  cancelled: [],
}

/**
 * Returns true if the transition from `from` → `to` is permitted.
 */
export function isValidOrderTransition(from: OrderStatus, to: OrderStatus): boolean {
  return VALID_TRANSITIONS[from].includes(to)
}

/**
 * Applies a status transition. Throws if the transition is invalid.
 */
export function transitionOrderStatus(from: OrderStatus, to: OrderStatus): OrderStatus {
  if (!isValidOrderTransition(from, to)) {
    throw new Error(
      `Invalid order status transition: "${from}" → "${to}". ` +
        `Allowed next states from "${from}": [${VALID_TRANSITIONS[from].join(', ') || 'none (terminal)'}]`,
    )
  }
  return to
}

/** Returns true if the given status is a terminal state */
export function isTerminalOrderStatus(status: OrderStatus): boolean {
  return VALID_TRANSITIONS[status].length === 0
}

/** Ordered list of forward stages (excluding cancelled) */
export const ORDER_STAGE_SEQUENCE: OrderStatus[] = [
  'placed',
  'in-kitchen',
  'out-for-delivery',
  'delivered',
]

/**
 * Returns the numeric index of a status in the forward stage sequence.
 * `cancelled` returns -1 (not in the forward path).
 */
export function orderStatusIndex(status: OrderStatus): number {
  return ORDER_STAGE_SEQUENCE.indexOf(status)
}
