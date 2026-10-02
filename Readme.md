# 🏨 Aurum Luxury Resort — Hotel CRM

A full-stack hotel management system for **Aurum Luxury Resort**, Goa. Built with two separate React + Vite frontends — one for guests and one for staff.

---

## What Was Built

### Guest Frontend (`frontend-guest`) — Port 5173
The public-facing experience for hotel guests.

- **Landing Page** — Hero section with parallax scroll, room listings (Deluxe Ocean Suite, Royal Penthouse, Garden Villa), amenities grid, testimonials carousel, and CTA
- **Booking Page** — Room reservation flow
- **Guest Portal** — In-room experience panel with three tabs:
  - **Dining** — Browse the full menu (Starters, Mains, Sides, Desserts), add to cart, set delivery time, and place room-service orders
  - **Services** — Request housekeeping, laundry, room service, or maintenance with optional notes
  - **My Orders** — Live order tracking with step-by-step status (Placed → Preparing → Out for Delivery → Delivered)
- **Login Page** — Guest authentication

### Staff Frontend (`frontend-staff`) — Port 5174
The internal operations dashboard for hotel staff and management.

- **Dashboard Home** — Overview and key metrics
- **Bookings** — Manage guest reservations
- **Orders & POS** — View incoming orders; dedicated POS interface for taking orders at the counter
- **Rooms & Housekeeping** — Room status and housekeeping assignments
- **Inventory** — Stock and supplies management
- **Reports** — Analytics and reporting
- **Staff Management** — Staff accounts and scheduling
- **Settings** — System configuration

---

## Tech Stack

| | |
|---|---|
| Framework | React 19 + TypeScript |
| Build Tool | Vite 8 |
| Routing | React Router v7 |
| Icons | Lucide React |
| Styling | Inline styles with CSS variables (dark luxury theme) |
| Testing | Vitest + fast-check (property-based tests) |
| Font | Cormorant Garamond + Montserrat |

---

## Getting Started

### Prerequisites
- Node.js 18+
- npm

### Install dependencies

```bash
# Guest frontend
cd frontend-guest
npm install

# Staff frontend
cd frontend-staff
npm install
```

### Run both dev servers

```bash
# Terminal 1 — Guest (http://localhost:5173)
cd frontend-guest
npm run dev

# Terminal 2 — Staff (http://localhost:5174)
cd frontend-staff
npm run dev
```

### Staff Login

| Field    | Value      |
|----------|------------|
| Username | `staff`    |
| Password | `aurum123` |

---

## Project Structure

```
hotel-crm/
├── frontend-guest/         # Guest-facing app (booking, dining, services)
│   └── src/
│       ├── pages/          # LandingPage, BookingPage, GuestPortal, LoginPage
│       ├── components/     # Navbar, Footer
│       └── utils/          # Business logic (rate plans, room state, order totals)
│
├── frontend-staff/         # Staff dashboard (bookings, POS, rooms, reports)
│   └── src/
│       ├── pages/
│       │   └── staff/      # DashboardHome, BookingsPage, OrdersPage, RoomsPage, etc.
│       └── utils/          # Shared business logic utilities
│
├── .kiro/                  # Kiro AI specs and agents
├── knowledge/              # Session knowledge base and logs
└── daily/                  # Daily session logs
```

---

## Running Tests

```bash
# Inside either frontend directory
npm run test:run
```

Property-based tests live in `src/utils/__tests__/` and cover rate plan pricing, order state machines, room occupancy, and folio integrity.
