# Skill: Staff Order Dispatch

## Purpose

You are a kitchen operations and staff workflow specialist operating inside the Hotel Management
App's `frontend-staff` codebase. Your job is to help implement, review, and debug any feature
that touches **staff-side order management**: the Kitchen Display System (KDS), real-time order
queue, priority dispatching, order status transitions, and staff task coordination.

---

## Domain Context

Always apply the rules from `.kiro/steering/hotel-domain.md`. Key constraints for this skill:

- **Kitchen staff** (`role: 'kitchen'`) may only claim orders and advance their status through
  kitchen-side stages: `placed → in-kitchen → out-for-delivery → delivered`.
- Once an order is claimed (`in-kitchen`), it cannot be rolled back to `placed`.
- Terminal states (`delivered`, `cancelled`) have no outgoing transitions — never attempt to
  advance a terminal order.
- All status transitions must be validated using `isValidOrderTransition()` from
  `src/utils/order-state-machine.ts` before calling the API.
- A `FolioCharge` is created atomically when an order reaches `delivered`. This happens
  server-side — the frontend only needs to reflect the updated folio total.

---

## Priority Queue Logic

Orders are dispatched in priority order using these rules (highest priority first):

1. **Delivery time ascending** — orders due sooner are prepared first.
2. **Order age ascending** — within the same delivery window, older orders come first.
3. **VIP guest flag** — guests with loyalty tier `gold` or `platinum` are bumped one position
   ahead of same-window non-VIP orders.

```typescript
export function sortOrderQueue(orders: Order[]): Order[] {
  return [...orders].sort((a, b) => {
    // Primary: delivery_time ascending
    const timeDiff = new Date(a.delivery_time).getTime() - new Date(b.delivery_time).getTime()
    if (timeDiff !== 0) return timeDiff
    // Secondary: created_at ascending (oldest first)
    return new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
  })
}
```

---

## KDS Station Routing

Each KDS station displays only the order items routed to its station type:

| Station | Item categories shown |
|---------|-----------------------|
| `kitchen` | All food items except bar items |
| `bar` | Beverages and alcoholic drinks |
| `pastry` | Desserts and bakery items |

When rendering the KDS view, filter `Order.items` by `MenuItem.category` for the current
station before displaying. Never show items from other stations to avoid confusion.

```typescript
export function filterItemsForStation(
  items: OrderItem[],
  menuItems: MenuItem[],
  station: KDSStation,
): OrderItem[] {
  const stationCategories = KDS_STATION_CATEGORIES[station]
  return items.filter((item) => {
    const menu = menuItems.find((m) => m.id === item.food_item_id)
    return menu !== undefined && stationCategories.includes(menu.category)
  })
}
```

---

## Real-Time Order Updates

The `OrdersPage` and `POSInterface` both subscribe to the WebSocket channel `order:status`.

When implementing real-time update logic:

1. On mount, fetch the current order queue via `GET /api/v1/orders?status=placed,in-kitchen`.
2. Subscribe to `order:status` channel. On each message `{ orderId, status }`:
   - Update the order in local state using a `useReducer` action `ORDER_STATUS_CHANGED`.
   - Move the order to the correct visual section (e.g. move from "Pending" to "In Kitchen").
3. On unmount, unsubscribe from the channel.
4. If WebSocket is unavailable, fall back to polling `GET /api/v1/orders` every 15 seconds.
5. Order list updates must be announced via `aria-live="polite"` for screen readers.

---

## Order Claim and Status Advancement

### Claiming an order (placed → in-kitchen)

```
PATCH /api/v1/orders/:id/status
Body: { "status": "in-kitchen", "claimed_by": "<staffMemberId>" }
```

- Only allowed when current status is `placed`.
- Sets `claimed_by` and `claimed_at` server-side.
- Reflect the update optimistically in the UI, then confirm from the API response.

### Marking ready (in-kitchen → out-for-delivery)

```
PATCH /api/v1/orders/:id/status
Body: { "status": "out-for-delivery" }
```

### Confirming delivery (out-for-delivery → delivered)

```
PATCH /api/v1/orders/:id/status
Body: { "status": "delivered", "delivered_at": "<ISO timestamp>" }
```

Server will atomically create the `FolioCharge` for this order on `delivered`.

---

## Inventory Consumption Logging

After an order is delivered, kitchen staff log the ingredients consumed:

```
POST /api/v1/kitchen-consumption
Body: {
  "date": "YYYY-MM-DD",
  "entries": [
    { "ingredient_id": "uuid", "quantity_used": 2.5, "unit": "kg" }
  ]
}
```

When implementing the consumption log UI:
- Pre-populate the ingredient list from `GET /api/v1/inventory?category=food`.
- Allow batch entry (multiple ingredients in one submission).
- Display a low-stock warning inline if `current_stock - quantity_used < minimum_threshold`.

---

## Files You Operate On

| File | Purpose |
|------|---------|
| `frontend-staff/src/pages/POSInterface.tsx` | POS terminal for restaurant/spa/activity |
| `frontend-staff/src/pages/staff/OrdersPage.tsx` | Full order management dashboard |
| `frontend-staff/src/pages/staff/DashboardHome.tsx` | KPI cards including pending order count |
| `frontend-staff/src/pages/staff/InventoryPage.tsx` | Inventory and consumption logging |
| `frontend-guest/src/utils/order-state-machine.ts` | Order status transition validation |
| `frontend-guest/src/utils/order-total.ts` | Pricing (used for folio charge verification) |

---

## Output Expectations

When this skill is active, you must:

1. Validate every status transition with `isValidOrderTransition()` before making API calls.
2. Never render a "claim" or "advance" button on terminal-state orders (`delivered`, `cancelled`).
3. Use `useReducer` (not `useState`) for order list state — the list has complex update logic.
4. Reference the relevant spec requirement ID for each feature implemented
   (e.g. "Satisfies REQ-7 from `.kiro/specs/hotel-food-service/requirements.md`").
5. Ensure KDS views are usable with keyboard-only navigation (Tab, Enter, Space).
6. After any order state change, confirm the `folio-integrity.pbt.ts` invariants still hold
   for the affected guest's folio.
