/**
 * Rate plan pricing utilities.
 *
 * Invariants:
 *   - Effective nightly price is always ≥ 0
 *   - Most-specific (narrowest date range) rate plan wins
 *   - Falls back to basePricePerNight when no plan matches
 */

export interface RatePlan {
  id: string
  roomType: string
  pricePerNight: number   // ≥ 0
  validFrom: Date
  validUntil: Date        // exclusive upper bound
  daysOfWeek: number[]    // 0=Sun…6=Sat; empty = all days
}

/**
 * Returns the most-specific active rate plan for a given room type and date,
 * or null if none match.
 *
 * "Most specific" = narrowest date range (fewest days between validFrom and validUntil).
 */
export function getActivePlanForDate(
  roomType: string,
  date: Date,
  plans: RatePlan[],
): RatePlan | null {
  const dayOfWeek = date.getDay()

  const matching = plans.filter(
    (p) =>
      p.roomType === roomType &&
      date >= p.validFrom &&
      date < p.validUntil &&
      (p.daysOfWeek.length === 0 || p.daysOfWeek.includes(dayOfWeek)),
  )

  if (matching.length === 0) return null

  // Narrowest range wins (smallest validUntil - validFrom)
  return matching.reduce((best, plan) => {
    const bestRange = best.validUntil.getTime() - best.validFrom.getTime()
    const planRange = plan.validUntil.getTime() - plan.validFrom.getTime()
    return planRange < bestRange ? plan : best
  })
}

/**
 * Returns the effective nightly price for a room type on a given date.
 * Falls back to basePricePerNight when no rate plan matches.
 * Result is always ≥ 0.
 */
export function getEffectiveNightlyRate(
  roomType: string,
  date: Date,
  plans: RatePlan[],
  basePricePerNight: number,
): number {
  const plan = getActivePlanForDate(roomType, date, plans)
  const price = plan !== null ? plan.pricePerNight : basePricePerNight
  return Math.max(0, price)
}

/**
 * Calculates the total booking price across all nights.
 * Each night uses the most-specific rate plan active on that date.
 */
export function calculateBookingTotal(
  roomType: string,
  checkIn: Date,
  checkOut: Date,
  plans: RatePlan[],
  basePricePerNight: number,
): number {
  const msPerDay = 1000 * 60 * 60 * 24
  const nights = Math.round((checkOut.getTime() - checkIn.getTime()) / msPerDay)
  if (nights <= 0) return 0

  let total = 0
  for (let i = 0; i < nights; i++) {
    const night = new Date(checkIn.getTime() + i * msPerDay)
    total += getEffectiveNightlyRate(roomType, night, plans, basePricePerNight)
  }
  return total
}
