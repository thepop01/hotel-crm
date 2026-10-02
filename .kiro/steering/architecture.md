---
inclusion: always
---

# Architecture Steering — Hotel Management App

## Multi-App Overview

This project ships as **two independent Vite + React + TypeScript SPAs** that share zero runtime
code but operate against the same backend API.

| App | Directory | Port | Audience |
|-----|-----------|------|---------|
| Guest & POS | `frontend-guest/` | 5173 | Hotel guests (QR scan), POS staff |
| Staff Dashboard | `frontend-staff/` | 5174 | Receptionists, managers, kitchen, admin |

Neither app imports from the other. Shared TypeScript types are duplicated intentionally to keep
build graphs isolated; a future `packages/shared-types/` workspace can consolidate them if the
project migrates to a monorepo.

---

## Directory Layout

```
hotel management app/
├── frontend-guest/          # Guest & POS SPA
│   ├── src/
│   │   ├── pages/           # Route-level components
│   │   ├── components/      # Reusable UI pieces
│   │   ├── hooks/           # Custom React hooks
│   │   ├── services/        # API call wrappers (fetch)
│   │   ├── types/           # TypeScript interfaces
│   │   └── utils/           # Pure helpers
│   └── ...
├── frontend-staff/          # Staff Dashboard SPA
│   ├── src/
│   │   ├── pages/
│   │   │   └── staff/       # Dashboard sub-pages
│   │   ├── components/
│   │   ├── hooks/
│   │   ├── services/
│   │   ├── types/
│   │   └── utils/
│   └── ...
├── .kiro/
│   ├── specs/               # Spec-driven development artefacts
│   ├── steering/            # These steering files
│   ├── hooks/               # Automated workflow hooks
│   ├── agents/              # Custom sub-agent definitions
│   ├── powers/              # Custom domain powers
│   └── settings/            # mcp.json, cloud.json
└── daily/                   # Daily session notes
```

---

## Backend Architecture (Target)

```
backend/
├── src/
│   ├── routes/              # Express route handlers
│   ├── services/            # Domain service classes
│   ├── repositories/        # DB query layer (no raw SQL in services)
│   ├── middleware/          # auth, validation, error handling
│   ├── websocket/           # WebSocket server and channels
│   ├── jobs/                # Cron jobs (meal plan scheduler)
│   ├── integrations/        # OTA, WhatsApp, payment gateway
│   └── types/               # Shared domain interfaces
└── ...
```

All API routes are prefixed `/api/v1/`. WebSocket events use the channel pattern
`<resource>:<event>` (e.g. `order:status-changed`, `room:status-changed`).

---

## State Flow

### Guest Journey (frontend-guest)

```
LandingPage
  └─ QR scan or manual → LoginPage (phone + room)
       └─ authenticated → GuestPortal
            ├─ FoodOrdering → PlaceOrder → LiveTracking
            ├─ ServiceRequests → TrackRequest
            ├─ RoomFolio → ViewCharges
            └─ AmenityBooking → BookSlot

BookingPage (public, no auth)
  └─ SearchRooms → SelectRoom → ConfirmBooking → ConfirmationPage
```

### Staff Journey (frontend-staff)

```
LoginPage → StaffDashboard (layout)
  ├─ /             → DashboardHome    (KPI cards, alerts)
  ├─ /bookings     → BookingsPage     (reservations, check-in/out)
  ├─ /orders       → OrdersPage       (food & service order queue)
  ├─ /rooms        → RoomsPage        (room status grid, housekeeping)
  ├─ /inventory    → InventoryPage    (stock, procurement)
  ├─ /reports      → ReportsPage      (revenue, GST, expense analytics)
  ├─ /staff-mgmt   → StaffMgmtPage   (tasks, attendance, payroll)
  └─ /settings     → SettingsPage     (hotel config, OTA, branding)

/pos → POSInterface  (restaurant/spa/activity desk, separate from dashboard)
```

---

## Shared Domain Models

Both apps reference these core domain objects. Keep field names and types consistent.

| Model | Key Fields | Defined In |
|-------|-----------|-----------|
| Room | id, room_number, room_type, status, price_per_night | `types/room.ts` in each app |
| RoomBooking | id, room_id, check_in, check_out, status, total_price | `types/booking.ts` |
| Customer | id, phone_number, room_number, loyalty_tier | `types/customer.ts` |
| Order | id, customer_id, status, items[], total_amount | `types/order.ts` |
| OrderItem | id, order_id, food_item_id, quantity, unit_price | (nested in Order) |
| MenuItem | id, name, price, tax_rate, is_available | `types/menu.ts` |
| RoomFolio | id, booking_id, total, status, charges[] | `types/folio.ts` |
| StaffMember | id, name, role, email | `types/staff.ts` |

---

## Separation of Concerns

| Layer | Responsibility | What it must NOT do |
|-------|---------------|---------------------|
| Pages | Compose components, manage route-level state | Direct API calls; business logic |
| Components | Render UI, emit events upward | Fetch data; mutate global state directly |
| Hooks | Encapsulate data fetching, WebSocket subscriptions | Render JSX |
| Services | Wrap `fetch` calls, transform API responses | Hold component state |
| Types | Define domain interfaces and enums | Contain runtime logic |
| Utils | Pure, side-effect-free helper functions | Import React or services |

---

## Authentication & Authorization

- **Guest auth**: Phone number + room number → short-lived JWT (`exp: 8h`), stored in
  `sessionStorage` (not `localStorage`) to auto-expire on tab close.
- **Staff auth**: Username + password → JWT with `role` claim, stored in `sessionStorage`.
- Role hierarchy: `admin > manager > receptionist > kitchen > buyer > housekeeping > maintenance`.
- Frontend route guards live in a `<PrivateRoute>` wrapper component in each app.
- Every API call includes `Authorization: Bearer <token>` header via a shared `apiClient` wrapper.

---

## Real-Time Strategy

- WebSocket connection established on authenticated page load; reconnects with exponential
  back-off (1 s → 2 s → 4 s → … → 30 s cap).
- Channels: `order:status`, `room:status`, `notification:alert`, `kds:<station>`.
- Guests subscribe only to their own order channel (`order:<orderId>`).
- Staff subscribe to all room and order channels relevant to their role.
- Fallback: if WebSocket is unavailable, components poll every 15 seconds.

---

## Build & Dev Commands

```bash
# Guest app
cd frontend-guest && npm install && npm run dev   # http://localhost:5173

# Staff app
cd frontend-staff && npm install && npm run dev   # http://localhost:5174

# Type check (both apps)
cd frontend-guest && npx tsc --noEmit
cd frontend-staff && npx tsc --noEmit
```
