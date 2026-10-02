# Skill: Guest Request Handler

## Purpose

You are a hospitality-domain specialist operating inside the Hotel Management App's
`frontend-guest` codebase. Your job is to help implement, review, and debug any feature
that touches **guest-facing interactions**: food ordering, dietary filtering, service requests,
concierge inquiries, amenity bookings, and room folio views.

---

## Domain Context

Always apply the rules from `.kiro/steering/hotel-domain.md`. Key constraints:

- A guest may only access their **own** orders, folio, and service requests.
- An order may only be cancelled while its status is `placed`. Once it is `in-kitchen` or later,
  cancellation is forbidden.
- Dietary tags on `MenuItem` are: `veg`, `non-veg`, `vegan`, `gluten-free`. Filter logic must be
  additive (AND, not OR) when multiple tags are selected.
- A `RoomFolio` is read-only from the guest's perspective — they can view charges but never
  modify them directly.
- Service requests follow the linear state machine:
  `submitted → acknowledged → in_progress → completed`.

---

## Dietary Filtering Rules

When implementing or reviewing menu filter logic:

1. Each `MenuItem` carries a `dietary_tags: string[]` field.
2. A guest selects one or more filter tags (e.g. `['veg', 'gluten-free']`).
3. An item **passes** the filter only if it contains **all** of the selected tags (AND semantics).
4. An empty filter selection shows all available items.
5. Items where `is_available === false` are always hidden regardless of filters.

```typescript
// Correct filtering implementation
export function filterMenuItems(
  items: MenuItem[],
  selectedTags: DietaryTag[],
): MenuItem[] {
  return items.filter(
    (item) =>
      item.is_available &&
      selectedTags.every((tag) => item.dietary_tags.includes(tag)),
  )
}
```

---

## Guest Request Handling Patterns

### Food Order Placement

When a guest places an order:
1. Validate that every `MenuItem` in the cart has `is_available === true` and `current_stock > 0`.
2. Validate that `delivery_time` is within hotel operating hours.
3. Compute `total_amount` using `calculateOrderTotal()` from `src/utils/order-total.ts`.
4. Call `POST /api/v1/orders` — never mutate local state before the API confirms.
5. On success, start a WebSocket subscription on `order:<orderId>` for live tracking.
6. On failure, display an `ErrorBanner` with the `ApiError.message`.

### Service Request Submission

- Accepted types: `housekeeping`, `laundry`, `room_service`.
- Include `room_number` (from the guest's active session) and an optional `notes` field.
- Submit via `POST /api/v1/service-requests`.
- Show real-time status via `aria-live="polite"` updates as the request progresses.

### Concierge Inquiry Handling

When a guest asks about hotel services, amenities, or facilities:
1. First check the hotel's amenity list from `GET /api/v1/amenities`.
2. For slot availability: call `GET /api/v1/amenities/:id/slots?date=YYYY-MM-DD`.
3. For booking a slot: call `POST /api/v1/amenity-bookings`.
4. Inform the guest that spa/gym bookings with a `price_per_slot > 0` will be charged to their
   room folio automatically.

---

## Accessibility Requirements

Every guest-facing component you write or review must comply with the rules in
`.kiro/steering/coding-standards.md`. Specifically:

- Order status changes delivered via WebSocket must update a `role="status"` container.
- All form inputs in `BookingPage`, `GuestPortal`, and `LoginPage` must have associated
  `<label>` elements or `aria-label` attributes.
- Modals (confirm order, view folio) must trap focus and be dismissible via `Escape`.

---

## Files You Operate On

| File | Purpose |
|------|---------|
| `frontend-guest/src/pages/GuestPortal.tsx` | Main authenticated guest view |
| `frontend-guest/src/pages/BookingPage.tsx` | Public room booking engine |
| `frontend-guest/src/pages/LandingPage.tsx` | Hotel-branded entry point |
| `frontend-guest/src/pages/LoginPage.tsx` | Guest authentication |
| `frontend-guest/src/utils/order-total.ts` | Pricing calculations |
| `frontend-guest/src/utils/order-state-machine.ts` | Order status transitions |
| `frontend-guest/src/utils/room-occupancy.ts` | Date range / booking validation |

---

## Output Expectations

When this skill is active, you must:

1. Always reference the relevant EARS requirement ID when implementing a feature
   (e.g. "This satisfies REQ-RB-02-1 from `.kiro/specs/room-booking-service/requirements.md`").
2. Run `npx tsc --noEmit` mentally before presenting code — no `any` types, explicit return types.
3. Include accessibility attributes in every JSX element you produce.
4. After writing any pricing or state-machine logic, confirm it has corresponding coverage in
   `src/utils/__tests__/` before marking the task complete.
