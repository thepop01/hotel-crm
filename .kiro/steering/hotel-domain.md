---
inclusion: always
---

# Hotel Domain Model — Steering Reference

This file is the authoritative source for all domain concepts, state machines, lifecycle rules,
and privilege boundaries used across both frontend apps and the backend. When any code or spec
contradicts this document, this document wins.

---

## 1. Room Lifecycle

### States

| State | Meaning |
|-------|---------|
| `available` | Room is clean, unoccupied, and bookable |
| `occupied` | A guest has checked in and is currently staying |
| `cleaning` | Guest has checked out; housekeeping task is pending or in progress |

### Transition Rules (strictly enforced)

```
available ──[check-in confirmed]──► occupied
occupied  ──[check-out processed]──► cleaning
cleaning  ──[housekeeping task complete]──► available
```

**Prohibited transitions** (system must throw / reject):
- `available → cleaning` (no guest ever occupied it)
- `cleaning → occupied` (must be cleaned before next guest)
- `occupied → available` (must pass through cleaning)
- Any backward transition (e.g. `occupied → confirmed`)

A room can only be booked when its current status is `available` **and** the requested date range
does not overlap any existing `confirmed` or `checked_in` booking.

---

## 2. Order States

### States

| State | Meaning |
|-------|---------|
| `placed` | Guest submitted order; awaiting kitchen acknowledgment |
| `in-kitchen` | Kitchen staff claimed and is preparing the order |
| `out-for-delivery` | Order dispatched to guest room |
| `delivered` | Order handed to guest; folio charge confirmed |
| `cancelled` | Order cancelled before preparation started |

### Transition Rules

```
placed ──[kitchen claims]──► in-kitchen
in-kitchen ──[marked ready]──► out-for-delivery
out-for-delivery ──[delivery confirmed]──► delivered
placed ──[cancelled before claim]──► cancelled
```

**Prohibited transitions**:
- `delivered → *` (terminal state; no reversal)
- `cancelled → *` (terminal state)
- `in-kitchen → placed` (no rollback after claiming)
- `out-for-delivery → in-kitchen` (no rollback after dispatch)
- Any transition that skips a stage (e.g. `placed → delivered`)

### Pricing Invariant

For every completed order the following must hold:

```
total_amount = subtotal + tax_amount + service_charge - discount
total_amount ≥ 0
subtotal = Σ(item.quantity × item.unit_price)  for all items
tax_amount = Σ(item.subtotal × item.tax_rate)  for all items
discount ≤ subtotal + tax_amount + service_charge
```

No order total may be negative. Discounts may reduce total to zero but no further.

---

## 3. Service Request States

| State | Meaning |
|-------|---------|
| `submitted` | Guest submitted the request |
| `acknowledged` | Staff has seen and confirmed the request |
| `in_progress` | Staff is actively working on it |
| `completed` | Request fulfilled; guest notified |

Transition rules: linear `submitted → acknowledged → in_progress → completed`.
Only `completed` is terminal; no backward transitions.

---

## 4. Booking Status Lifecycle

| Status | Meaning |
|--------|---------|
| `confirmed` | Reservation accepted and secured |
| `checked_in` | Guest physically arrived; room `occupied` |
| `checked_out` | Guest departed; room enters `cleaning` |
| `cancelled` | Reservation voided |

Transition: `confirmed → checked_in → checked_out`.
`cancelled` is reachable only from `confirmed` (not from `checked_in`).

---

## 5. Folio Status

| Status | Meaning |
|--------|---------|
| `open` | Charges are accumulating during the stay |
| `settled` | Final invoice generated; no further charges permitted |

A folio becomes `settled` only when:
1. Guest has checked out, **and**
2. Payment gateway confirms `paid` status for the outstanding balance.

Once `settled`, `FolioCharge` records for this folio are immutable.

---

## 6. Purchase Approval Workflow

```
draft ──[buyer submits]──► pending_approval
pending_approval ──[manager approves]──► approved   (inventory updated)
pending_approval ──[manager rejects]──► rejected    (inventory unchanged)
approved ──[never reverts]──► (immutable)
```

Price anomaly detection fires at the `draft → pending_approval` transition.

---

## 7. Maintenance Request States

```
submitted → acknowledged → in_progress → resolved
```

Guest is notified only on `resolved`. Staff and managers see all states.

---

## 8. Guest Privilege Boundaries

### Authenticated Guest (`role: 'guest'`)

**Allowed**:
- Browse menu, place orders for their own room
- Submit service requests for their own room
- View and track their own orders and service requests
- View their own room folio (read-only)
- Submit ratings for their own completed orders and service requests
- Book amenity slots; view their bookings
- Send messages to reception
- View active meal plan; cancel their own meal plan subscription

**Prohibited**:
- Access any other guest's orders, folio, or profile
- Modify order after status advances past `placed`
- Cancel an order that is `in-kitchen` or later
- Access staff or admin routes
- View pricing analytics, staff attendance, or procurement data

### POS Staff (`role: 'pos'`)

**Allowed**:
- View and update orders for their assigned station
- Charge items to a guest's folio
- View active guest folios (for charge-to-room)

**Prohibited**:
- Access bookings management or room status grid
- Modify inventory or procurement records

### Receptionist (`role: 'receptionist'`)

**Allowed**:
- Check guests in and out
- Create, modify, and cancel bookings
- View and print room folios and invoices
- Generate QR codes for rooms
- View room status grid (read-only for housekeeping)

**Prohibited**:
- Approve procurement entries
- View payroll or expense analytics
- Modify staff roles

### Kitchen Staff (`role: 'kitchen'`)

**Allowed**:
- View and claim orders in their KDS station
- Update order status through all kitchen-side stages
- Log kitchen consumption entries

**Prohibited**:
- View guest folios, booking data, or financial reports

### Buyer (`role: 'buyer'`)

**Allowed**:
- Submit procurement entries with bill photos
- View ingredient and inventory lists
- Add suppliers

**Prohibited**:
- Approve their own procurement entries
- View guest data or order history

### Manager (`role: 'manager'`)

**Allowed**: All of receptionist + buyer + kitchen, plus:
- Approve and reject procurement entries
- Assign and view staff tasks
- View attendance records and daily reports
- Set rate plans
- View expense analytics

**Prohibited**:
- Access payroll finalization (admin only)
- Delete core domain records (rooms, staff members)

### Admin / Owner (`role: 'admin'`)

Full access to all features. Additional exclusives:
- View and export all financial reports, GST reports, payroll
- Configure hotel branding, OTA connections, GST settings
- Review price anomaly alerts
- Manage multi-property settings

---

## 9. Key Business Rules

1. **No double-booking**: Two bookings for the same room may not overlap. Enforced at both
   application layer and database constraint level.

2. **Inventory never goes negative**: An order that would reduce a food item's `current_stock`
   below 0 must be rejected. The item is automatically marked `is_available: false` when stock
   hits 0.

3. **Price anomaly threshold**: A procurement price > 150% of the 30-day historical average for
   the same ingredient triggers an owner alert. Skipped when fewer than 3 historical records exist.

4. **Meal plan auto-orders**: Generated at scheduled meal times by a cron job. Auto-generated
   orders are treated identically to manually placed orders for all downstream flows.

5. **OTA sync SLA**: Availability and pricing changes must propagate to all connected OTA
   platforms within 60 seconds. Failure triggers a retry sequence (×3, exponential back-off)
   then an owner alert.

6. **Folio atomicity**: Every chargeable event (order placed, service completed, amenity booked)
   must write its `FolioCharge` in the same database transaction as the event itself.

7. **KYC compliance**: Every check-in generates a Registration Card. Foreign nationals also
   require a C-Form. Both documents are stored in file storage and linked to the booking record.

8. **Loyalty tiers**:
   - Bronze: 2–4 completed stays
   - Silver: 5–9 completed stays
   - Gold: 10–19 completed stays
   - Platinum: 20+ completed stays or ≥ ₹5,00,000 lifetime spend
