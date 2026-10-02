---
inclusion: always
---

# Testing Strategy — Hotel Management App

## Overview

Tests live alongside the code they verify. Every `src/` directory may contain a `__tests__/`
subdirectory or co-located `*.test.ts` / `*.pbt.ts` files. The test runner is **Vitest** (matches
the Vite build pipeline; no separate Babel config needed).

---

## Test Pyramid

```
         ▲
        /E2E\          (future — Playwright, not in scope yet)
       /──────\
      / Integr \       service ↔ repository ↔ in-memory DB
     /──────────\
    /    Unit    \     pure functions, hooks, state machines
   /──────────────\
  /  Property-Based\   fast-check; domain invariants
 /──────────────────\
```

Property-based tests sit beneath the unit layer because they validate the **invariants** that
unit tests are written against.

---

## 1. Unit Tests (`*.test.ts`)

### What to unit-test

- All utility functions in `utils/`
- All service-layer methods that can be tested with dependency injection (mock repositories)
- React hooks — use `@testing-library/react` `renderHook`
- State machine transition functions (room status, order status)
- Pricing calculation helpers (`calculateOrderTotal`, `getEffectiveNightlyRate`)

### Rules

- One `describe` block per module/class. One `it` per logical case.
- Arrange–Act–Assert structure inside every `it` block.
- No real network calls, real DB connections, or real timers in unit tests. Mock all I/O.
- Use `vi.fn()` and `vi.spyOn()` — never a real implementation of an external dependency.
- Test file must import only from the module under test and test utilities. No cross-module
  side effects.
- Aim for ≥ 80% branch coverage on `utils/` and `services/` directories.

### Example

```typescript
// src/utils/__tests__/order-total.test.ts
import { describe, it, expect } from 'vitest'
import { calculateOrderTotal } from '../order-total'

describe('calculateOrderTotal', () => {
  it('returns subtotal + tax + service charge - discount', () => {
    const result = calculateOrderTotal({
      items: [{ quantity: 2, unit_price: 100, tax_rate: 0.05 }],
      service_charge_rate: 0.1,
      discount: 20,
    })
    expect(result.subtotal).toBe(200)
    expect(result.tax_amount).toBe(10)
    expect(result.service_charge).toBe(20)
    expect(result.total_amount).toBe(210)   // 200 + 10 + 20 - 20
  })

  it('total is never negative even with large discount', () => {
    const result = calculateOrderTotal({
      items: [{ quantity: 1, unit_price: 50, tax_rate: 0 }],
      service_charge_rate: 0,
      discount: 999,
    })
    expect(result.total_amount).toBeGreaterThanOrEqual(0)
  })
})
```

---

## 2. Property-Based Tests (`*.pbt.ts`)

### Framework

**`fast-check`** — install as a dev dependency in both `frontend-guest/` and `frontend-staff/`.

```bash
npm install --save-dev fast-check
```

### When to write PBTs

Write a PBT whenever a function has an invariant that must hold for **all valid inputs**, not just
the hand-picked examples in unit tests. Required PBTs for this project:

| File | Invariant |
|------|-----------|
| `order-pricing.pbt.ts` | `total = subtotal + tax + service - discount`, `total ≥ 0` |
| `order-state-machine.pbt.ts` | No order can reach `delivered` from `cancelled`; no backward transitions |
| `room-occupancy.pbt.ts` | Two bookings for the same room never overlap in confirmed/checked-in states |
| `room-state-machine.pbt.ts` | Room status only follows the defined DAG; no illegal jumps |
| `rate-plan-pricing.pbt.ts` | Effective price ≥ 0; most-specific rate plan always wins |
| `folio-integrity.pbt.ts` | `folio.total = Σ charges.amount`; settled folio rejects new charges |

### Rules

- PBT files use Vitest as the test runner (`describe`/`it` from `vitest`).
- Each `it` contains exactly one `fc.assert(fc.property(...))` call.
- Arbitraries must be constrained to **valid domain ranges**:
  - Prices: `fc.float({ min: 0.01, max: 1_000_000, noNaN: true })`
  - Quantities: `fc.integer({ min: 1, max: 999 })`
  - Tax rates: `fc.float({ min: 0, max: 0.28, noNaN: true })` (max 28% GST)
  - Dates: `fc.date({ min: new Date('2020-01-01'), max: new Date('2030-12-31') })`
- Run with at least 1,000 samples: `{ numRuns: 1000 }`.
- On failure, `fast-check` will print the minimal shrunk counter-example. Add it as a regression
  unit test.

### Example

```typescript
// src/utils/__tests__/order-pricing.pbt.ts
import { describe, it } from 'vitest'
import * as fc from 'fast-check'
import { calculateOrderTotal } from '../order-total'

const itemArb = fc.record({
  quantity: fc.integer({ min: 1, max: 99 }),
  unit_price: fc.float({ min: 0.01, max: 10_000, noNaN: true }),
  tax_rate: fc.float({ min: 0, max: 0.28, noNaN: true }),
})

describe('Order pricing invariants', () => {
  it('total = subtotal + tax + service_charge - discount', () => {
    fc.assert(
      fc.property(
        fc.array(itemArb, { minLength: 1, maxLength: 20 }),
        fc.float({ min: 0, max: 0.2, noNaN: true }),  // service charge rate
        fc.float({ min: 0, max: 500, noNaN: true }),   // discount
        (items, serviceChargeRate, discount) => {
          const result = calculateOrderTotal({ items, service_charge_rate: serviceChargeRate, discount })
          const expected = result.subtotal + result.tax_amount + result.service_charge - discount
          return Math.abs(result.total_amount - Math.max(0, expected)) < 0.001
        },
      ),
      { numRuns: 1000 },
    )
  })

  it('total is never negative', () => {
    fc.assert(
      fc.property(
        fc.array(itemArb, { minLength: 1, maxLength: 20 }),
        fc.float({ min: 0, max: 0.2, noNaN: true }),
        fc.float({ min: 0, max: 1_000_000, noNaN: true }),
        (items, serviceChargeRate, discount) => {
          const result = calculateOrderTotal({ items, service_charge_rate: serviceChargeRate, discount })
          return result.total_amount >= 0
        },
      ),
      { numRuns: 1000 },
    )
  })
})
```

---

## 3. Integration Tests (`*.integration.test.ts`)

### What to integration-test

- Service ↔ repository interactions using an in-memory SQLite database (via `better-sqlite3`).
- Critical flows end-to-end at the service layer: create booking → check-in → check-out →
  housekeeping complete; place order → update status through all stages.
- OTA sync retry logic with a mocked HTTP client.

### Rules

- Spin up a fresh in-memory DB in `beforeEach`; tear it down in `afterEach`.
- No mocked repositories in integration tests — use the real repo against the test DB.
- Network calls (OTA APIs, WhatsApp, payment gateway) are **always** mocked at the HTTP level
  (e.g. `vi.mock` wrapping `fetch` or using `msw`).
- Integration tests live in `src/__integration__/` to prevent accidental inclusion in unit runs.

---

## 4. Running Tests

```bash
# Run all tests once (unit + PBT)
npm test -- --run

# Run with coverage report
npm test -- --run --coverage

# Run only PBT files
npm test -- --run --reporter=verbose "pbt"

# Run only unit tests
npm test -- --run --reporter=verbose "test.ts"

# Type-check before testing
npx tsc --noEmit && npm test -- --run
```

### CI Pipeline Order

1. `npx tsc --noEmit` — type correctness
2. `npm test -- --run` — all unit + PBT tests
3. `npm run build` — production bundle builds without error

All three steps must pass before a task is marked complete.

---

## 5. Test Configuration (vitest.config.ts)

Add this file to each app that has tests:

```typescript
// vitest.config.ts (at frontend-guest/ or frontend-staff/ root)
import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    globals: true,
    environment: 'jsdom',
    include: ['src/**/*.{test,pbt,spec}.ts', 'src/**/*.{test,pbt,spec}.tsx'],
    coverage: {
      reporter: ['text', 'json', 'html'],
      include: ['src/utils/**', 'src/services/**'],
      thresholds: {
        branches: 80,
        functions: 80,
        lines: 80,
      },
    },
  },
})
```

---

## 6. What NOT to Test

- Third-party library internals (React, react-router-dom, lucide-react).
- Snapshots of full page renders — they are brittle and add no invariant value.
- Implementation details: internal state variable names, intermediate variable values.
- CSS class names or styling details — test behaviour, not presentation.
