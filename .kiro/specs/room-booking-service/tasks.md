# Tasks — Room Booking Service

Each task maps to one or more EARS requirement IDs from `requirements.md`. Complete tasks in the
order listed; later tasks depend on earlier ones.

---

## Milestone 1 — Data Layer & API Foundation

- [ ] **T-01** · Create `rooms` table migration with columns from `Room` schema, including the
  `status` CHECK constraint (`available`, `occupied`, `cleaning`).
  → *REQ-RB-06-1*

- [ ] **T-02** · Create `room_bookings` table migration with `tsrange` exclusion constraint for
  double-booking prevention.
  → *REQ-RB-07-1, REQ-RB-07-3*

- [ ] **T-03** · Create `room_folios` and `folio_charges` table migrations.
  → *REQ-RB-09-1, REQ-RB-09-2*

- [ ] **T-04** · Create `rate_plans` table migration with composite index on
  `(room_type, valid_from, valid_until)`.
  → *REQ-RB-10-1*

- [ ] **T-05** · Implement `RoomBookingService` with methods:
  `createBooking`, `cancelBooking`, `modifyCheckout`, `getByRoom`, `getById`.
  → *REQ-RB-02-1, REQ-RB-08-1, REQ-RB-08-2*

- [ ] **T-06** · Implement `RoomStatusService` with state machine enforcement; throw if an
  illegal transition is attempted.
  → *REQ-RB-06-1*

- [ ] **T-07** · Implement `RatePlanService` with `getActivePlanForDate` and
  `getPricingCalendar`.
  → *REQ-RB-10-2, REQ-RB-10-3, REQ-RB-10-4*

- [ ] **T-08** · Implement `FolioService` with `getOrCreate`, `addCharge`, `settle`,
  `generateInvoice`.
  → *REQ-RB-09-1, REQ-RB-09-2, REQ-RB-09-4*

---

## Milestone 2 — Booking API Endpoints

- [ ] **T-09** · `POST /api/bookings` — validate dates, compute total via `RatePlanService`,
  write booking, propagate to OTA.
  → *REQ-RB-02-1 … RB-02-6*

- [ ] **T-10** · `GET /api/rooms/availability` — filter rooms by date range, attach effective
  price per night.
  → *REQ-RB-01-1, REQ-RB-01-4, REQ-RB-01-5*

- [ ] **T-11** · `POST /api/bookings/:id/checkin` — transition booking + room status, create
  folio, generate QR, create/link Customer, generate KYC docs.
  → *REQ-RB-04-1 … RB-04-6*

- [ ] **T-12** · `POST /api/bookings/:id/checkout` — validate folio balance, settle folio,
  transition room to `cleaning`, create housekeeping task.
  → *REQ-RB-05-1 … RB-05-5*

- [ ] **T-13** · `PATCH /api/bookings/:id/cancel` — cancel booking, release availability,
  notify guest, sync OTA.
  → *REQ-RB-08-1, REQ-RB-08-3, REQ-RB-08-4*

- [ ] **T-14** · `GET /api/rate-plans/calendar` — return per-day effective price for a given
  month and room type.
  → *REQ-RB-10-4*

- [ ] **T-15** · `POST /api/ota/reservations` — ingest OTA webhook, create booking, handle
  overlap error, notify owner on failure.
  → *REQ-RB-03-1, REQ-RB-03-2, REQ-RB-03-3*

---

## Milestone 3 — Frontend: Guest Booking Engine (frontend-guest)

- [ ] **T-16** · Build `RoomSearchForm` component with date pickers and validation (dates in
  future, check-out > check-in).
  → *REQ-RB-01-2, REQ-RB-01-3*

- [ ] **T-17** · Build `RoomResultsList` and `RoomCard` components displaying type, capacity,
  description, photo, and effective nightly rate with rate-plan badge.
  → *REQ-RB-01-4, REQ-RB-01-5*

- [ ] **T-18** · Build `BookingConfirmModal` with guest details form, total price preview, and
  submit handler calling `POST /api/bookings`.
  → *REQ-RB-02-1, REQ-RB-02-5*

- [ ] **T-19** · Add `BookingConfirmationPage` showing booking ID and confirmation code after
  successful booking.
  → *REQ-RB-02-2*

---

## Milestone 4 — Frontend: Staff Booking Management (frontend-staff)

- [ ] **T-20** · Extend `BookingsPage` with `BookingTable` that shows status badges and
  action buttons (Check-In, Check-Out, Cancel).
  → *REQ-RB-04-1, REQ-RB-05-1, REQ-RB-08-1*

- [ ] **T-21** · Build `CheckInModal` that calls `POST /api/bookings/:id/checkin` and
  displays the generated QR code and KYC document download link.
  → *REQ-RB-04-4, REQ-RB-04-6*

- [ ] **T-22** · Build `CheckOutModal` that calls `POST /api/bookings/:id/checkout`, shows
  outstanding folio balance, and links to the final invoice PDF.
  → *REQ-RB-05-1, REQ-RB-05-4*

- [ ] **T-23** · Build `RoomStatusGrid` in `RoomsPage` with WebSocket subscription for
  real-time status updates and color-coded tiles.
  → *REQ-RB-06-4*

- [ ] **T-24** · Build `HousekeepingQueue` component displaying pending cleaning tasks sorted
  by checkout time.
  → *REQ-RB-05-3, REQ-RB-06-3*

---

## Milestone 5 — Rate Plans (frontend-staff)

- [ ] **T-25** · Add `RatePlansSection` to `SettingsPage` with a `PricingCalendar` view and
  a form for creating/editing rate plans.
  → *REQ-RB-10-1*

- [ ] **T-26** · Wire `PricingCalendar` to `GET /api/rate-plans/calendar` with month
  navigation.
  → *REQ-RB-10-4*

---

## Milestone 6 — Notifications & OTA Sync

- [ ] **T-27** · Integrate `NotificationService` calls on booking confirmation, check-in,
  check-out, and cancellation.
  → *REQ-RB-02-2, REQ-RB-05-1, REQ-RB-08-1*

- [ ] **T-28** · Implement OTA retry logic (3 attempts, exponential back-off) and owner alert
  on persistent failure.
  → *REQ-RB-03-3*

- [ ] **T-29** · Add OTA sync status panel to `SettingsPage` showing platform name, status,
  and last-sync timestamp.
  → *REQ-RB-03-4*

---

## Milestone 7 — Property-Based Tests

- [ ] **T-30** · Write PBT suite for double-booking invariant using `fast-check`.
  → *REQ-RB-07-1, REQ-RB-07-3*

- [ ] **T-31** · Write PBT suite for room status state machine — no illegal transitions.
  → *REQ-RB-06-1*

- [ ] **T-32** · Write PBT suite for rate plan pricing — effective price never negative,
  most-specific plan always wins.
  → *REQ-RB-10-2, REQ-RB-10-3*
