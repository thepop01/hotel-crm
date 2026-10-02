/**
 * Order pricing utilities.
 *
 * Invariant (from hotel-domain steering):
 *   total_amount = subtotal + tax_amount + service_charge - discount
 *   total_amount ≥ 0
 */

export interface OrderItemInput {
  quantity: number    // ≥ 1
  unit_price: number  // ≥ 0
  tax_rate: number    // 0–0.28
}

export interface OrderTotalInput {
  items: OrderItemInput[]
  service_charge_rate: number  // 0–0.20
  discount: number             // ≥ 0; capped at subtotal+tax+service
}

export interface OrderTotalResult {
  subtotal: number
  tax_amount: number
  service_charge: number
  discount_applied: number
  total_amount: number
}

/**
 * Calculates the full order total from line items, service charge, and discount.
 * Guarantees total_amount is never negative.
 */
export function calculateOrderTotal(input: OrderTotalInput): OrderTotalResult {
  const subtotal = input.items.reduce(
    (acc, item) => acc + item.quantity * item.unit_price,
    0,
  )

  const tax_amount = input.items.reduce(
    (acc, item) => acc + item.quantity * item.unit_price * item.tax_rate,
    0,
  )

  const service_charge = subtotal * input.service_charge_rate

  const grossTotal = subtotal + tax_amount + service_charge
  // Discount may not reduce total below zero
  const discount_applied = Math.min(input.discount, grossTotal)
  const total_amount = Math.max(0, grossTotal - discount_applied)

  return {
    subtotal,
    tax_amount,
    service_charge,
    discount_applied,
    total_amount,
  }
}
