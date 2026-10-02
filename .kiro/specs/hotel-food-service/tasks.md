# Implementation Plan: Hotel Food Service System

## Overview

A full-stack TypeScript implementation (Node.js/Express backend, React frontend, PostgreSQL) covering all 44 requirements of the hotel operations platform. The build follows a modular, incremental approach: project scaffolding and data models first, then authentication and core configuration, followed by feature modules (food ordering, room booking, billing, guest services, staff operations, analytics), and finally cross-cutting concerns (GST/tax compliance, accounting, KYC, KDS, multi-property support, multi-language, notifications, security, performance). Each task builds on the previous, ending with full system integration.

## Tasks

- [ ] 1. Project setup and monorepo scaffolding
  - Initialize monorepo with `packages/backend` (Node.js/Express/TypeScript), `packages/frontend-guest` (React/TypeScript — Guest & POS Website), and `packages/frontend-staff` (React/TypeScript — Staff Dashboard)
  - Configure TypeScript (`tsconfig.json`) for all packages with strict mode
  - Set up ESLint, Prettier, and shared lint config
  - Configure Jest with `ts-jest` for backend and React Testing Library for both frontends
  - Install and configure `fast-check` for property-based testing
  - Set up `pg`/`pg-pool` PostgreSQL client with connection pooling
  - Install `ws` or `socket.io` for WebSocket server
  - Install `node-cron` for meal plan scheduler
  - Install `i18next` and `i18next-http-middleware` for multi-language support
  - Install `qrcode`, `multer`, `sharp`, and AWS S3 SDK for file handling
  - Install Razorpay SDK and/or Stripe SDK for payment processing
  - Configure environment variable management (`dotenv`, `.env.example`)
  - _Requirements: 8.1, 8.3_


- [x] 1.5 Frontend 1 — Guest & POS Website structure
  - Set up React Router in `packages/frontend-guest` with routes: `/` (landing), `/book` (direct booking), `/guest` (guest portal), `/pos` (POS interface), `/login` (unified login)
  - Implement unified login page with toggle: Guest Access (phone + room) and Staff Login (username + password)
  - Guest Access tab shown by default; Staff Login tab for POS staff
  - On staff login with role `pos` or `kitchen`: redirect to `/pos`; on guest login: redirect to `/guest`
  - Scaffold placeholder pages for: LandingPage, BookingPage, GuestPortal, POSInterface, LoginPage
  - _Requirements: 1.3, 8.2_

- [x] 1.6 Frontend 2 — Staff Dashboard structure
  - Set up React Router in `packages/frontend-staff` with routes: `/` (dashboard home), `/bookings`, `/orders`, `/rooms`, `/inventory`, `/reports`, `/staff`, `/settings`
  - Implement staff-only login page (username + password); redirect to `/` on success
  - Scaffold sidebar navigation with sections: Bookings, Orders & POS Activity, Rooms & Housekeeping, Inventory, Reports, Staff, Settings
  - Scaffold placeholder pages for each route
  - Protect all routes with auth guard (redirect to login if no valid staff JWT)
  - _Requirements: 8.2, 15.1_

- [x] 1.7 POS Interface — real-time order management
  - Build POS interface at `/pos` in `frontend-guest`
  - Display live order queue for the logged-in staff's station (restaurant/spa/activity) via WebSocket
  - Actions per order: update status (preparing → ready → delivered), charge item to room folio
  - Show guest name, room number, items ordered, and current status per order card
  - Charge-to-room button opens a confirmation modal with folio summary before posting charge
  - _Requirements: 7.1, 7.2, 7.4, 23.3_

- [x] 1.8 Staff Dashboard — Bookings Overview page
  - Build `/bookings` page in `frontend-staff`
  - Table of all bookings: guest name, room, check-in/out dates, source (direct/OTA), status
  - Actions: check-in, check-out, cancel, modify booking
  - Filter by status (confirmed/checked_in/checked_out/cancelled) and date range
  - OTA sync status indicator per booking
  - _Requirements: 15.7, 20.6, 21.6_

- [x] 1.9 Staff Dashboard — Orders & POS Activity page
  - Build `/orders` page in `frontend-staff`
  - Real-time feed of all orders across all stations with status, guest, room, items, and folio charge status
  - Filter by station, status, and date
  - Show POS charge log: which staff charged what to which room folio
  - _Requirements: 7.1, 7.2, 23.2_

- [x] 1.10 Staff Dashboard — Rooms & Housekeeping page
  - Build `/rooms` page in `frontend-staff`
  - Room status grid: color-coded cards per room (available=green, occupied=amber, cleaning=blue)
  - Housekeeping task queue: rooms pending cleaning sorted by checkout time
  - Mark room cleaned action
  - Maintenance requests panel: open requests with priority and assigned staff
  - _Requirements: 30.2, 30.3, 30.5, 31.3_

- [x] 1.11 Staff Dashboard — Inventory Management page
  - Build `/inventory` page in `frontend-staff`
  - Tabbed view: Food / Housekeeping / Maintenance inventory categories
  - Stock levels with low-stock alerts highlighted
  - Procurement entries table with approval status; approve/reject actions for managers
  - Supplier directory panel
  - Price anomaly alerts panel
  - _Requirements: 4.1, 4.3, 24.1, 26.1, 17.4_

- [x] 1.12 Staff Dashboard — Management Reports page
  - Build `/reports` page in `frontend-staff`
  - Revenue metrics cards (daily/weekly/monthly)
  - Expense analytics charts (category breakdown, supplier comparison)
  - Payroll summary table
  - GST report download buttons (GSTR-1, GSTR-3B)
  - Staff attendance summary
  - Top guests report
  - Export buttons (PDF/CSV) for each report type
  - _Requirements: 15.2, 15.3, 15.5, 15.6, 27.1, 32.5_


- [ ] 2. Core data models, Zod schemas, and database migrations
  - [ ] 2.1 Define TypeScript interfaces for all domain models
    - Write interfaces: `Room`, `Customer`, `RoomBooking`, `RoomFolio`, `FolioCharge`, `FoodItem`, `Order`, `OrderItem`, `ServiceRequest`, `MealPlan`, `MealPlanSubscription`
    - Write interfaces: `InventoryItem`, `Supplier`, `PurchaseRecord`, `KitchenConsumption`, `StaffMember`, `StaffTask`, `AttendanceRecord`, `OTAPlatformConfig`, `PriceAnomalyAlert`, `NotificationLog`, `HotelConfig`
    - Write interfaces: `GuestRating`, `PaymentTransaction`, `MaintenanceRequest`, `PayrollRecord`, `GuestMessage`, `Amenity`, `AmenitySlot`, `AmenityBooking`, `MinibarItem`, `MinibarCharge`, `RatePlan`, `LostFoundItem`, `StaffSalaryConfig`
    - _Requirements: 1.1, 4.1, 5.1, 20.2, 23.1, 24.1, 25.1, 28.1, 29.3, 30.1, 31.1, 32.1, 35.1, 36.2, 37.2, 38.1, 39.1_
  - [ ] 2.2 Write Zod validation schemas for all domain models
    - Create Zod schemas matching each TypeScript interface for runtime validation
    - Export inferred types from Zod schemas where applicable
    - _Requirements: 8.1, 8.4_
  - [ ] 2.3 Write PostgreSQL migration scripts for all tables
    - Migrations for: `rooms`, `customers`, `room_bookings`, `room_folios`, `folio_charges`, `food_items`, `orders`, `order_items`, `service_requests`
    - Migrations for: `meal_plans`, `meal_plan_subscriptions`, `inventory_items`, `suppliers`, `purchase_records`, `kitchen_consumption`, `staff_members`, `staff_tasks`, `attendance_records`
    - Migrations for: `ota_platform_configs`, `price_anomaly_alerts`, `notification_logs`, `hotel_config`
    - Migrations for: `guest_ratings`, `payment_transactions`, `maintenance_requests`, `payroll_records`, `guest_messages`
    - Migrations for: `amenities`, `amenity_slots`, `amenity_bookings`, `minibar_items`, `minibar_charges`, `rate_plans`, `lost_found_items`, `staff_salary_configs`
    - Add proper indexes, foreign key constraints, and `CHECK` constraints (e.g. `stars BETWEEN 1 AND 5`, non-negative stock)
    - _Requirements: 8.1, 4.1, 24.1, 32.6, 37.2_
  - [ ]* 2.4 Write property test for inventory stock non-negativity
    - **Property 4: Inventory Consistency**
    - **Validates: Requirements 2.4, 4.1, 4.2, 4.5, 5.3, 18.2, 24.6**


- [ ] 3. Authentication and RBAC middleware
  - [ ] 3.1 Implement staff authentication (JWT RS256, login endpoint)
    - `POST /auth/staff/login` — validate credentials, issue access token (15 min) + refresh token
    - Implement refresh token endpoint `POST /auth/staff/refresh`
    - Store `password_hash` using bcrypt; enforce rate limiting (max 5 attempts per 15 min)
    - _Requirements: 8.2, 8.5_
  - [ ] 3.2 Implement guest authentication (phone + room number)
    - `POST /auth/guest/login` — validate phone + room number against `customers` table, issue guest JWT
    - Pre-fill room number from QR code URL parameter on frontend
    - _Requirements: 1.3, 11.2_
  - [ ] 3.3 Implement RBAC middleware
    - Create `requireRole(...roles)` Express middleware enforcing roles: `admin`, `manager`, `kitchen`, `buyer`, `housekeeping`, `maintenance`
    - Apply middleware to all protected routes
    - Return HTTP 403 with role requirement message on unauthorized access
    - _Requirements: 8.2, 10.4, 15.1_
  - [ ]* 3.4 Write property test for authentication consistency
    - **Property 2: Authentication Consistency**
    - **Validates: Requirements 1.3, 8.2**

- [ ] 4. Customer profile management
  - [ ] 4.1 Implement customer profile creation and retrieval endpoints
    - `POST /customers` — create profile with phone, room number, name; generate UUID; enforce unique phone
    - `GET /customers/:id` — retrieve profile (authenticated guest or staff)
    - `PATCH /customers/:id/language` — persist language preference
    - _Requirements: 1.1, 1.2, 1.4, 33.3_
  - [ ]* 4.2 Write property test for customer profile creation completeness
    - **Property 1: Customer Profile Creation Completeness**
    - **Validates: Requirements 1.1, 1.2**

- [ ] 5. Hotel branding and configuration
  - [ ] 5.1 Implement hotel config endpoints
    - `GET /config` — return `HotelConfig` (hotel name, logo, cover photo, operating hours, notification contacts)
    - `PATCH /config` — update config (admin/manager only); support logo and cover photo upload via multer → S3
    - _Requirements: 9.1, 9.2, 9.3, 9.4, 9.5, 3.1_
  - [ ] 5.2 Render hotel branding on all customer-facing frontend pages
    - Fetch `HotelConfig` on app load; display hotel name and logo in header across guest portal and direct booking engine
    - _Requirements: 9.1, 9.2, 9.4, 9.5, 22.6_
  - [ ]* 5.3 Write property test for branding consistency
    - **Property 13: Branding Consistency**
    - **Validates: Requirements 9.1, 9.2, 9.4, 9.5, 22.6**

- [ ] 6. QR code generation per room
  - [ ] 6.1 Implement QR code generation service and endpoints
    - `POST /rooms/:id/qr` — generate QR encoding `https://{host}/guest?room={roomNumber}`; store image in S3; return signed URL
    - `POST /rooms/:id/qr/regenerate` — regenerate and overwrite existing QR
    - `GET /rooms/:id/qr/download` — return QR image blob for printing
    - Use `qrcode` npm library; ensure page loads within 3 seconds on mobile (optimize image size)
    - _Requirements: 11.1, 11.2, 11.3, 11.4, 11.5_

- [ ] 7. Checkpoint 1 — Ensure all tests pass, ask the user if questions arise.


- [ ] 8. Food menu management
  - [ ] 8.1 Implement food item CRUD endpoints
    - `GET /menu` — list all food items (guests see only `is_available=true AND current_stock>0`)
    - `POST /menu` — create food item (admin/manager); support photo upload via multer → S3
    - `PATCH /menu/:id` — update item details, photo, price, availability (admin/manager)
    - `DELETE /menu/:id` — remove item (admin/manager)
    - `PATCH /menu/:id/toggle` — toggle `is_available` without deleting (admin/manager)
    - _Requirements: 6.1, 6.2, 6.3, 6.4, 6.5_
  - [ ]* 8.2 Write property test for menu display accuracy
    - **Property 3: Menu Display Accuracy**
    - **Validates: Requirements 2.1, 2.5**
  - [ ]* 8.3 Write property test for menu management authorization
    - **Property 10: Menu Management Authorization**
    - **Validates: Requirements 6.1, 6.5**
  - [ ]* 8.4 Write unit tests for food item data integrity
    - **Property 11: Food Item Data Integrity**
    - **Validates: Requirements 6.2, 6.3, 6.4**

- [ ] 9. Inventory management
  - [ ] 9.1 Implement multi-category inventory CRUD endpoints
    - `GET /inventory` — list items, filterable by `category` (food/housekeeping/maintenance)
    - `POST /inventory` — create item with category assignment (admin/manager)
    - `PATCH /inventory/:id` — update item, manual stock adjustment with authorization check; log audit entry
    - `DELETE /inventory/:id` — remove item (admin/manager)
    - _Requirements: 4.1, 4.4, 24.1, 24.2_
  - [ ] 9.2 Implement low stock alert generation
    - After every stock-decreasing operation, check `current_stock < minimum_threshold`; if true, insert alert record and trigger notification
    - _Requirements: 4.3, 24.3_
  - [ ] 9.3 Implement inventory audit trail
    - On every stock change, insert row into `inventory_audit_log` with: item_id, category, quantity_delta, new_stock, actor_id, reason, timestamp
    - _Requirements: 4.5, 24.6_
  - [ ]* 9.4 Write property test for inventory consistency
    - **Property 4: Inventory Consistency**
    - **Validates: Requirements 2.4, 4.1, 4.2, 4.5, 5.3, 18.2, 24.6**
  - [ ]* 9.5 Write unit tests for low stock alert generation
    - **Property 8: Low Stock Alert Generation**
    - **Validates: Requirements 4.3, 24.3**

- [ ] 10. Ingredient procurement system
  - [ ] 10.1 Implement procurement entry submission with bill photo upload
    - `POST /purchases` — accept multipart form with procurement fields + bill photo; validate file type (JPEG/PNG/PDF) and size (≤10 MB) using magic bytes; store photo in private S3 bucket; set `approval_status: pending_approval`
    - Reject submission without bill photo with descriptive error (HTTP 400)
    - _Requirements: 5.1, 5.2, 16.1, 16.2, 16.3, 16.5, 24.5_
  - [ ] 10.2 Implement price anomaly detection on submission
    - After creating `PurchaseRecord`, query last 30 days of approved prices for same ingredient
    - If ≥3 records exist and submitted price > 150% of average: create `PriceAnomalyAlert`, trigger owner notification within 60 seconds
    - If <3 records: skip detection, record entry without flagging
    - _Requirements: 17.1, 17.2, 17.3, 17.6_
  - [ ] 10.3 Implement purchase history and pricing trend endpoints
    - `GET /purchases` — list purchase history with filters (supplier, ingredient, date range, status)
    - `GET /purchases/:id` — detail view including signed S3 URL for bill photo (admin/owner only)
    - _Requirements: 5.5, 16.4, 25.3_
  - [ ]* 10.4 Write property test for price anomaly detection accuracy
    - **Property 19: Price Anomaly Detection Accuracy**
    - **Validates: Requirements 17.1, 17.2, 17.3, 17.6**
  - [ ]* 10.5 Write unit tests for bill photo upload validation
    - Test JPEG/PNG/PDF acceptance, size limit enforcement, missing photo rejection
    - _Requirements: 16.1, 16.2, 16.5_

- [ ] 11. Supplier management
  - [ ] 11.1 Implement supplier directory CRUD endpoints
    - `POST /suppliers` — create supplier (admin/manager); assign unique ID, record creator and timestamp
    - `GET /suppliers` — list suppliers, filterable by category and active status
    - `PATCH /suppliers/:id` — update supplier details
    - `PATCH /suppliers/:id/deactivate` — soft-delete supplier
    - _Requirements: 25.1, 25.5_
  - [ ] 11.2 Implement supplier price comparison view
    - `GET /suppliers/price-comparison?itemId=` — return price history for an inventory item grouped by supplier
    - _Requirements: 25.4_
  - [ ]* 11.3 Write unit tests for supplier traceability
    - **Property 20: Supplier Traceability**
    - **Validates: Requirements 25.2, 25.5**

- [ ] 12. Purchase approval workflow
  - [ ] 12.1 Implement approval and rejection endpoints
    - `POST /purchases/:id/approve` — manager/admin only; update status → approved; update inventory stock atomically in single transaction; record approver + timestamp; lock entry (no further edits)
    - `POST /purchases/:id/reject` — manager/admin only; update status → rejected; notify buyer with reason; leave inventory unchanged
    - `GET /purchases/pending` — list pending approvals sorted by submission time (manager/admin)
    - _Requirements: 26.1, 26.2, 26.3, 26.4, 26.5, 26.6_
  - [ ]* 12.2 Write property test for purchase approval integrity
    - **Property 18: Purchase Approval Integrity**
    - **Validates: Requirements 26.2, 26.3, 26.4**

- [ ] 13. Checkpoint 2 — Ensure all tests pass, ask the user if questions arise.


- [ ] 14. Room management
  - [ ] 14.1 Implement room CRUD endpoints
    - `POST /rooms` — create room with type, capacity, price, floor, photo (admin/manager)
    - `GET /rooms` — list all rooms with current status
    - `PATCH /rooms/:id` — update room details and photo
    - `DELETE /rooms/:id` — remove room (admin only)
    - _Requirements: 20.1, 22.1_
  - [ ] 14.2 Implement rate plan management
    - `POST /rate-plans` — create rate plan with name, room type, date range, days-of-week, price (admin)
    - `GET /rate-plans` — list all rate plans
    - `PATCH /rate-plans/:id` — update rate plan
    - `GET /rate-plans/calendar?roomType=&month=` — return pricing calendar for a room type and month
    - Implement `getActivePlanForDate(roomType, date)`: match by room type + date range + day-of-week; most specific (narrowest range) wins; fall back to `Room.price_per_night`
    - _Requirements: 38.1, 38.2, 38.3, 38.4, 38.5_
  - [ ]* 14.3 Write property test for rate plan price application
    - **Property 30: Rate Plan Price Application**
    - **Validates: Requirements 38.2, 38.5**

- [ ] 15. Room booking
  - [ ] 15.1 Implement direct booking engine endpoints
    - `GET /booking/rooms?checkIn=&checkOut=` — return available rooms with effective rate plan price for the requested dates (live inventory check)
    - `POST /booking` — create direct booking; prevent overlap with existing confirmed bookings (row-level lock); update `Room.status` to `occupied`; send WhatsApp + email confirmation; trigger OTA availability sync
    - _Requirements: 20.1, 20.2, 20.3, 20.4, 20.5, 22.1, 22.2, 22.3, 22.4, 22.5_
  - [ ] 15.2 Implement OTA integration and channel manager
    - `POST /webhooks/ota-reservation` — receive OTA reservation payload; create `RoomBooking`; update room status; sync availability to all other connected OTAs within 60 seconds
    - `POST /ota-platforms` — configure OTA platform (admin); store encrypted API key
    - Implement retry logic: up to 3 attempts with exponential backoff on sync failure; alert owner on persistent failure
    - `GET /ota-platforms/status` — return connection status and last sync timestamp per platform
    - _Requirements: 21.1, 21.2, 21.3, 21.4, 21.5, 21.6_
  - [ ] 15.3 Implement booking management endpoints
    - `GET /bookings` — list all bookings with guest details (admin/manager)
    - `PATCH /bookings/:id` — modify booking (staff); notify guest of change
    - `DELETE /bookings/:id` — cancel booking (staff); notify guest
    - `POST /bookings/:id/checkin` — check in guest; auto-create `Customer` profile if not exists
    - _Requirements: 20.6, 20.7, 15.7_
  - [ ]* 15.4 Write property test for OTA sync consistency
    - **Property 16: OTA Sync Consistency**
    - **Validates: Requirements 21.2, 21.3, 22.4**

- [ ] 16. Room folio and billing
  - [ ] 16.1 Implement folio service
    - `GET /folios/:id` — return folio with itemized charges (staff/guest)
    - `POST /folios/:id/charges` — manually add miscellaneous charge (admin/manager)
    - Auto-add food order charge to folio on order placement (call from order creation handler)
    - Auto-add service request charge to folio on service completion (call from service request handler)
    - _Requirements: 23.1, 23.2, 23.3, 23.4, 23.7_
  - [ ] 16.2 Implement checkout invoice generation and folio settlement
    - `POST /folios/:id/invoice` — generate consolidated invoice PDF; mark folio settled; update `Room.status` to `available`; update `RoomBooking.status` to `checked_out`
    - _Requirements: 23.5, 23.6_
  - [ ] 16.3 Implement payment gateway integration
    - `POST /payments/initiate` — create payment order via Razorpay/Stripe for folio amount; return client secret/order ID
    - `POST /payments/verify` — verify gateway callback; update `PaymentTransaction.status`; settle folio only on confirmed `paid` status
    - `POST /payments/:id/refund` — initiate refund (admin only); create `refunded` transaction record
    - `GET /folios/:id/transactions` — list all payment transactions for a folio
    - _Requirements: 29.1, 29.2, 29.3, 29.4, 29.5, 29.6_
  - [ ]* 16.4 Write property test for folio accuracy
    - **Property 17: Room Folio Accuracy**
    - **Validates: Requirements 23.1, 23.2, 23.4, 23.5**
  - [ ]* 16.5 Write property test for payment transaction integrity
    - **Property 24: Payment Transaction Integrity**
    - **Validates: Requirements 29.1, 29.3, 29.4**

- [ ] 17. Checkpoint 3 — Ensure all tests pass, ask the user if questions arise.


- [ ] 18. Food ordering system
  - [ ] 18.1 Implement operating hours management
    - `PATCH /config/hours` — set opening/closing times (admin/manager)
    - Validate delivery time against operating hours on order placement; reject with operating hours display if outside window
    - `GET /config/status` — return current open/closed status to guests
    - _Requirements: 3.1, 3.2, 3.3, 3.4_
  - [ ] 18.2 Implement order placement endpoint
    - `POST /orders` — validate stock availability, operating hours, and delivery time; create `Order` + `OrderItem` records; decrement `FoodItem.current_stock`; add charge to `RoomFolio`; trigger staff notifications
    - Prevent order if any item has `current_stock = 0` or `is_available = false`
    - Use `SELECT FOR UPDATE` on food items to prevent concurrent overselling
    - _Requirements: 2.1, 2.2, 2.3, 2.4, 2.5_
  - [ ] 18.3 Build guest menu and cart UI (React)
    - Display food items with photos, prices, and availability; add-to-cart with quantity selector; delivery time picker constrained to operating hours; order confirmation screen
    - _Requirements: 2.1, 2.2, 3.4_
  - [ ]* 18.4 Write property test for operating hours validation
    - **Property 5: Operating Hours Validation**
    - **Validates: Requirements 2.3, 3.2, 3.3**

- [ ] 19. Live order tracking (WebSocket)
  - [ ] 19.1 Implement WebSocket server for order status broadcasting
    - On client connect: authenticate JWT, subscribe to `orderId` channel, send current status immediately
    - On staff status update: broadcast `{orderId, status, estimatedDelivery}` to all subscribed guests within 5 seconds
    - Implement client-side exponential backoff reconnect (1s → 2s → 4s → max 30s); re-subscribe and receive current status on reconnect
    - Clean up stale server-side subscriptions after 5 minutes of inactivity
    - _Requirements: 13.1, 13.3, 13.4, 13.5_
  - [ ] 19.2 Build live tracking UI (React)
    - Display order status stages: Order Placed → Preparing → Out for Delivery → Delivered
    - Show estimated delivery time; auto-close tracking session on `delivered`
    - _Requirements: 13.1, 13.2, 13.5_
  - [ ]* 19.3 Write property test for live tracking latency
    - **Property 21: Live Tracking Latency**
    - **Validates: Requirements 13.1, 13.3**

- [ ] 20. Order processing workflow (kitchen dashboard)
  - [ ] 20.1 Implement order management endpoints
    - `GET /orders` — list orders sorted by delivery time (kitchen/staff); support status filter
    - `PATCH /orders/:id/claim` — mark order as `preparing`, record `claimed_by` and `claimed_at`
    - `PATCH /orders/:id/status` — update status through progression; record `delivered_at` on delivery; broadcast via WebSocket
    - _Requirements: 7.1, 7.2, 7.4, 7.5, 7.6_
  - [ ] 20.2 Build kitchen dashboard UI (React)
    - Display pending orders sorted by delivery time; claim and complete actions; real-time updates via WebSocket
    - _Requirements: 7.1, 7.2, 7.4, 7.5_
  - [ ]* 20.3 Write property test for order status progression
    - **Property 6: Order Status Progression**
    - **Validates: Requirements 7.4, 7.5, 7.6, 13.2**

- [ ] 21. Meal plan management
  - [ ] 21.1 Implement meal plan CRUD and subscription endpoints
    - `POST /meal-plans` — create plan with breakfast/lunch/dinner food item IDs and dietary preference (admin/manager)
    - `GET /meal-plans` — list available plans
    - `POST /meal-plans/:id/subscribe` — subscribe guest with start/end dates; record subscription
    - `DELETE /meal-plans/subscriptions/:id` — cancel subscription; record `cancelled_at`; stop future order generation
    - `GET /meal-plans/subscriptions/active` — return active subscription for authenticated guest
    - _Requirements: 14.1, 14.2, 14.4, 14.5, 14.6_
  - [ ] 21.2 Implement cron-based auto-order generation
    - Configure `node-cron` jobs at meal times (e.g. 07:30, 12:30, 19:00)
    - For each active subscription on the current day: generate `Order` records with `source: meal_plan`; skip if subscription cancelled or past `end_date`
    - Generated orders enter the same processing pipeline as manual orders
    - _Requirements: 14.3, 14.5_
  - [ ]* 21.3 Write property test for meal plan auto-order generation
    - **Property 22: Meal Plan Auto-Order Generation**
    - **Validates: Requirements 14.3, 14.5**

- [ ] 22. Checkpoint 4 — Ensure all tests pass, ask the user if questions arise.


- [ ] 23. Guest service requests
  - [ ] 23.1 Implement service request endpoints
    - `POST /service-requests` — create request (type: housekeeping/laundry/room_service); record room number and timestamp; notify relevant staff via WhatsApp + dashboard
    - `PATCH /service-requests/:id/status` — update status (staff); notify guest on status change
    - `GET /service-requests` — list requests (staff); filter by status and type
    - `GET /service-requests/my` — list active requests for authenticated guest
    - _Requirements: 12.1, 12.2, 12.3, 12.4, 12.5, 12.6_
  - [ ] 23.2 Build service request UI on guest portal (React)
    - Service request form accessible from same portal as food ordering; display active requests with current status
    - _Requirements: 12.1, 12.6_

- [ ] 24. Housekeeping workflow
  - [ ] 24.1 Implement housekeeping auto-trigger on checkout
    - On `POST /folios/:id/invoice` (checkout): auto-create `StaffTask` of type `housekeeping`; transition `Room.status` from `occupied` to `cleaning`
    - _Requirements: 30.1_
  - [ ] 24.2 Implement cleaning queue and task completion
    - `GET /housekeeping/queue` — return rooms pending cleaning sorted by checkout time ascending (housekeeping staff)
    - `PATCH /housekeeping/tasks/:id/cleaned` — mark task cleaned; transition `Room.status` from `cleaning` to `available`
    - `PATCH /housekeeping/tasks/:id/assign` — assign specific housekeeping staff member (manager/admin)
    - _Requirements: 30.2, 30.3, 30.4, 30.5_
  - [ ]* 24.3 Write property test for housekeeping auto-trigger
    - **Property 25: Housekeeping Auto-Trigger**
    - **Validates: Requirements 30.1, 30.3**

- [ ] 25. Maintenance request management
  - [ ] 25.1 Implement maintenance request endpoints
    - `POST /maintenance` — submit request (guest or staff); record location, category, description, priority
    - `PATCH /maintenance/:id/assign` — assign to maintenance staff (manager/admin)
    - `PATCH /maintenance/:id/status` — update status through sequence: acknowledged → in_progress → resolved; notify guest via portal + WhatsApp on `resolved`
    - `GET /maintenance/open` — list open requests with age in hours, assigned staff, priority (manager/admin)
    - _Requirements: 31.1, 31.2, 31.3, 31.4, 31.5, 31.6_
  - [ ]* 25.2 Write property test for maintenance request lifecycle
    - **Property 26: Maintenance Request Lifecycle**
    - **Validates: Requirements 31.4, 31.5**

- [ ] 26. Guest feedback and ratings
  - [ ] 26.1 Implement guest rating submission and aggregation endpoints
    - `POST /ratings` — accept rating (1–5 stars + optional comment) for delivered order or completed service request belonging to authenticated guest; reject invalid targets
    - `GET /ratings/summary?foodItemId=` — return `RatingsSummary` (average, count, distribution) per food item
    - `GET /ratings/summary?staffId=` — return summary per staff member
    - `GET /ratings/summary?serviceType=` — return summary per service type
    - On rating ≤2 stars: trigger manager alert via WhatsApp within 60 seconds
    - _Requirements: 28.1, 28.2, 28.3, 28.4_
  - [ ] 26.2 Build rating UI on guest portal (React)
    - Show rating prompt after order reaches `delivered` or service request reaches `completed`
    - _Requirements: 28.1, 28.2_
  - [ ]* 26.3 Write property test for guest rating submission completeness
    - **Property 23: Guest Rating Submission Completeness**
    - **Validates: Requirements 28.1, 28.2, 28.4**

- [ ] 27. In-app guest messaging
  - [ ] 27.1 Implement guest messaging endpoints
    - `POST /messages` — guest sends message to reception; store with `sender_type: guest`
    - `POST /messages/:id/reply` — staff replies; store with `sender_type: staff`
    - `GET /messages/inbox` — staff inbox: all unread messages across all rooms sorted by recency
    - `GET /messages/conversation/:customerId` — full conversation history for a guest
    - `PATCH /messages/:id/read` — mark as read; update `is_read`; broadcast read receipt to guest via WebSocket
    - _Requirements: 34.1, 34.2, 34.3, 34.4, 34.5_
  - [ ] 27.2 Build messaging UI (React)
    - Guest portal: message compose and conversation thread; Staff portal: unified inbox with unread badge; real-time delivery via WebSocket with polling fallback
    - _Requirements: 34.1, 34.2, 34.3, 34.4_

- [ ] 28. Checkpoint 5 — Ensure all tests pass, ask the user if questions arise.


- [ ] 29. Amenity booking
  - [ ] 29.1 Implement amenity and slot management endpoints
    - `POST /amenities` — create amenity with name, description, slot duration, capacity, optional price (admin)
    - `PATCH /amenities/:id` — update amenity details, pricing, and slot availability (admin)
    - `DELETE /amenities/:id` — remove amenity (admin)
    - `POST /amenities/:id/slots` — create time slots for a date (admin)
    - `GET /amenities/:id/slots?date=` — return slots with remaining capacity > 0 (guests)
    - _Requirements: 35.1, 35.6_
  - [ ] 29.2 Implement amenity booking with capacity enforcement and folio charge
    - `POST /amenity-bookings` — book slot; enforce capacity with row-level lock (`SELECT FOR UPDATE`); reject if `booked_count >= capacity`; increment `booked_count`; if amenity has `price_per_slot`, auto-add `FolioCharge` to guest folio; confirm booking to guest
    - `DELETE /amenity-bookings/:id` — cancel booking; decrement `booked_count`; reverse folio charge if folio not yet settled
    - `GET /amenity-bookings/today` — list all bookings for current day grouped by amenity and slot (staff)
    - _Requirements: 35.2, 35.3, 35.4, 35.5_
  - [ ]* 29.3 Write property test for amenity slot capacity enforcement
    - **Property 28: Amenity Slot Capacity Enforcement**
    - **Validates: Requirements 35.2, 35.3**

- [ ] 30. Minibar and in-room consumption tracking
  - [ ] 30.1 Implement minibar item catalogue management
    - `POST /minibar/items` — create minibar item with name and price (admin)
    - `PATCH /minibar/items/:id` — update item details and price (admin)
    - `DELETE /minibar/items/:id` — deactivate item (admin)
    - `GET /minibar/items` — list active items (staff)
    - _Requirements: 36.2, 36.4_
  - [ ] 30.2 Implement minibar consumption logging with auto folio charge
    - `POST /minibar/charges` — log consumption (room, item, quantity, staff); calculate `total = quantity × unit_price`; atomically create `MinibarCharge` + `FolioCharge` on active room folio; update folio total
    - `GET /folios/:id` response must include minibar charges with item name, quantity, and amount (guest-visible)
    - _Requirements: 36.1, 36.3, 36.5_
  - [ ]* 30.3 Write property test for minibar folio charge consistency
    - **Property 29: Minibar Folio Charge Consistency**
    - **Validates: Requirements 36.1, 36.3**

- [ ] 31. Lost and found management
  - [ ] 31.1 Implement lost and found endpoints
    - `POST /lost-found/found` — staff logs found item with description, location, date, optional photo (multer → S3)
    - `POST /lost-found/lost` — guest reports lost item with description and date of loss
    - `GET /lost-found` — list items filterable by status: found/lost/claimed/archived (admin/manager)
    - `POST /lost-found/match` — staff matches found item to lost report; transition both to `matched`; notify guest via portal + WhatsApp with item details
    - `POST /lost-found/:id/archive` — close case with resolution notes; record resolving staff member
    - _Requirements: 39.1, 39.2, 39.3, 39.4, 39.5_

- [ ] 32. Loyalty and repeat guest tracking
  - [ ] 32.1 Implement loyalty profile linking and visit history
    - On `POST /booking`: query `customers` by phone number; if match found, link booking to existing profile
    - `GET /customers/:id/visits` — return visit history: all past stays, total nights, total spend
    - _Requirements: 37.1, 37.2_
  - [ ] 32.2 Implement loyalty tier management and top guests report
    - `PATCH /customers/:id/loyalty-tier` — assign tier: bronze/silver/gold/platinum (admin)
    - On check-in: display guest's loyalty tier and visit history summary to staff on staff portal
    - `GET /reports/top-guests?sortBy=spend|visits&from=&to=` — return top guests ranked by spend or visit frequency (admin)
    - _Requirements: 37.3, 37.4, 37.5_

- [ ] 33. Staff task assignment and attendance tracking
  - [ ] 33.1 Implement staff task management endpoints
    - `POST /tasks` — create task with title, description, assigned staff, due time (manager/admin); notify assigned staff via portal + WhatsApp
    - `PATCH /tasks/:id/status` — staff updates task to `in_progress` or `completed`
    - `GET /tasks/today` — list all open and completed tasks for current day (manager view)
    - _Requirements: 19.1, 19.2, 19.3, 19.4_
  - [ ] 33.2 Implement attendance tracking endpoints
    - `POST /attendance/checkin` — log check-in time for authenticated staff member
    - `POST /attendance/checkout` — log check-out time; calculate total hours
    - `GET /attendance?date=&staffId=` — return attendance records per staff per day (admin/manager)
    - _Requirements: 19.5, 19.6_

- [ ] 34. Staff payroll and salary management
  - [ ] 34.1 Implement salary configuration endpoints
    - `POST /payroll/config` — create/update `StaffSalaryConfig` for a staff member (admin); set salary type (monthly/daily) and base amount
    - `GET /payroll/config/:staffId` — retrieve salary config (admin)
    - _Requirements: 32.1_
  - [ ] 34.2 Implement monthly payroll calculation and approval
    - `POST /payroll/calculate?month=` — calculate payroll for all staff from attendance records + salary config; create `PayrollRecord` entries with `status: draft`
    - `POST /payroll/approve?month=` — manager/admin reviews and approves; transition records to `approved` then `finalized`; finalized records are immutable
    - _Requirements: 32.2, 32.3, 32.4_
  - [ ] 34.3 Implement payslip generation and payroll history
    - `GET /payroll/payslip/:staffId?month=` — generate payslip showing gross earnings, deductions, net pay
    - `GET /payroll/history/:staffId` — return payroll records (minimum 24 months retained)
    - `GET /payroll/summary?month=` — return total monthly payroll cost and per-staff breakdown (admin dashboard)
    - _Requirements: 32.4, 32.5, 32.6_
  - [ ]* 34.4 Write property test for payroll calculation accuracy
    - **Property 27: Payroll Calculation Accuracy**
    - **Validates: Requirements 32.2, 32.4**

- [ ] 35. Checkpoint 6 — Ensure all tests pass, ask the user if questions arise.


- [ ] 36. Multi-language support
  - [ ] 36.1 Configure i18next on backend and frontend
    - Set up `i18next` with `i18next-http-middleware` on Express; load translation JSON files at startup; cache translations; invalidate cache on `updateTranslation`
    - Set up `i18next` on React frontend with language detection from guest JWT claim
    - Default to English if no preference set
    - _Requirements: 33.1, 33.5_
  - [ ] 36.2 Implement language management endpoints
    - `GET /i18n/languages` — return list of configured languages
    - `GET /i18n/translations/:lang` — return full translation map for a language
    - `PATCH /i18n/translations/:lang` — update a translation key (admin); invalidate cache
    - `POST /i18n/languages` — add new language (admin)
    - _Requirements: 33.2, 33.4_
  - [ ] 36.3 Build language switcher UI on guest portal (React)
    - Language selector in guest portal header; persist selection to `Customer.language_preference` via `PATCH /customers/:id/language`; apply immediately to all guest-facing content
    - _Requirements: 33.3_
  - [ ] 36.4 Add translatable fields for food items and service labels
    - Extend `FoodItem` with `translations: Record<lang, {name, description}>` JSONB column
    - `PATCH /menu/:id/translations` — update translations for a food item (admin/manager)
    - Serve translated name/description based on guest language preference
    - _Requirements: 33.4_

- [ ] 37. Notification system
  - [ ] 37.1 Implement notification service with WhatsApp and email dispatch
    - Implement `NotificationService` with `sendWhatsApp` and `sendEmail` methods; log every attempt to `notification_logs`
    - On failure: WhatsApp falls back to email; email retried with exponential backoff (1s, 2s, 4s, max 3 retries)
    - _Requirements: 10.1, 10.2, 10.3, 10.5_
  - [ ] 37.2 Wire notifications to all system events
    - Order placed → notify kitchen staff (WhatsApp + email)
    - Service request submitted → notify relevant staff (WhatsApp + dashboard)
    - Price anomaly detected → notify owner (WhatsApp + email, within 60 seconds)
    - OTA sync failure → notify owner (WhatsApp + email, after 3 retries)
    - Low rating (≤2 stars) → notify manager (WhatsApp, within 60 seconds)
    - Maintenance request resolved → notify guest (portal + WhatsApp)
    - Staff task assigned → notify staff member (portal + WhatsApp)
    - Lost item matched → notify guest (portal + WhatsApp)
    - Room booking confirmed → notify guest (WhatsApp + email)
    - _Requirements: 7.3, 10.1, 10.2, 10.3, 12.3, 12.5, 17.3, 19.2, 20.4, 21.5, 22.4, 28.4, 31.5, 39.4_
  - [ ]* 37.3 Write property test for notification dispatch completeness
    - **Property 7: Notification Dispatch Completeness**
    - **Validates: Requirements 7.3, 10.1, 10.2, 10.3, 10.5**

- [ ] 38. Admin dashboard
  - [ ] 38.1 Implement revenue metrics and room status endpoints
    - `GET /dashboard/revenue?period=day|week|month` — return total revenue updated in real time
    - `GET /dashboard/rooms` — return `Room.status` for every room
    - `GET /dashboard/rooms/cleaning-count` — return count of rooms pending cleaning
    - _Requirements: 15.2, 15.3, 30.5_
  - [ ] 38.2 Implement staff activity log and booking management view
    - `GET /dashboard/activity` — return recent staff actions with timestamps (audit log)
    - `GET /dashboard/bookings` — list current and upcoming bookings with guest details
    - _Requirements: 15.4, 15.7_
  - [ ] 38.3 Implement report generation (PDF and CSV)
    - `GET /reports/daily|weekly|monthly?format=pdf|csv` — generate report summarizing orders, revenue, procurement costs, and service requests
    - _Requirements: 15.5, 15.6_
  - [ ] 38.4 Implement expense analytics endpoints
    - `GET /analytics/expenses?month=` — monthly breakdown by inventory category
    - `GET /analytics/supplier-comparison?itemId=&from=&to=` — price history per supplier
    - `GET /analytics/usage-vs-cost?from=&to=` — usage vs. procurement cost analysis
    - `GET /analytics/irregularities?from=&to=&category=` — flagged anomalies, rejected purchases, high-value entries; drill-down to full entry with bill photo signed URL
    - `GET /analytics/expenses/export?from=&to=` — export expense analytics as CSV
    - _Requirements: 27.1, 27.2, 27.3, 27.4, 27.5, 27.6_
  - [ ] 38.5 Implement price anomaly panel and OTA sync status on dashboard
    - `GET /dashboard/anomalies` — list all flagged price anomaly alerts with submitted price, historical average, deviation %
    - `PATCH /dashboard/anomalies/:id/review` — mark alert as reviewed with optional note (owner)
    - `GET /dashboard/ota-status` — return OTA platform connection status and last sync timestamp
    - _Requirements: 17.4, 17.5, 21.6_
  - [ ] 38.6 Implement payroll summary and guest ratings on dashboard
    - `GET /dashboard/payroll?month=` — total payroll cost and per-staff breakdown
    - `GET /dashboard/ratings` — aggregated guest ratings filterable by food item, staff, service type
    - _Requirements: 28.3, 32.5_
  - [ ] 38.7 Build admin dashboard UI (React)
    - Revenue metrics cards, room status grid, staff activity log, booking management table, expense analytics charts, price anomaly panel, OTA sync status, top guests report, payroll summary
    - _Requirements: 15.1, 15.2, 15.3, 15.4, 15.5, 15.6, 15.7_

- [ ] 39. Checkpoint 7 — Full system integration. Ensure all tests pass, ask the user if questions arise.


- [ ] 40. Security hardening
  - [ ] 40.1 Implement rate limiting and input sanitization
    - Apply `express-rate-limit` to auth endpoints (max 5 attempts per 15 min) and public booking page
    - Sanitize all user inputs; use parameterized queries exclusively (no raw string interpolation) to prevent SQL injection
    - Validate file upload content-type using magic bytes (not just file extension) in multer middleware
    - _Requirements: 8.2, 8.4, 16.2_
  - [ ] 40.2 Implement signed URLs for private file access
    - All bill photos and private uploads served via S3 signed URLs with 1-hour expiry
    - OTA platform API keys encrypted at rest (AES-256) in `ota_platform_configs`
    - _Requirements: 8.4, 16.4_
  - [ ] 40.3 Implement audit trail for all data-modifying operations
    - Ensure every route that modifies data writes to the audit log with: timestamp, actor ID, operation, affected resource
    - _Requirements: 8.5, 15.4_
  - [ ]* 40.4 Write unit tests for security controls
    - Test rate limiting enforcement, SQL injection prevention via parameterized queries, file content-type validation, signed URL expiry
    - **Property 15: Audit Trail Completeness**
    - **Validates: Requirements 8.5, 4.5, 24.6**

- [ ] 41. Performance and integration testing
  - [ ]* 41.1 Write integration test for full order lifecycle
    - Test: place order → claim → deliver → folio charge → verify folio total
    - _Requirements: 2.4, 7.4, 7.5, 7.6, 23.1_
  - [ ]* 41.2 Write integration test for full booking lifecycle
    - Test: direct booking → OTA sync → check-in → folio accumulation → checkout → housekeeping trigger
    - _Requirements: 20.3, 21.2, 23.5, 23.6, 30.1_
  - [ ]* 41.3 Write integration test for purchase approval flow
    - Test: submit procurement → notify manager → approve → inventory updated; reject → inventory unchanged
    - _Requirements: 26.1, 26.2, 26.3, 26.4_
  - [ ]* 41.4 Write performance tests for concurrent operations
    - Concurrent order placement: 50 simultaneous orders for same food item — verify no overselling
    - WebSocket broadcast latency under load: 100 connected guests — verify <5 second delivery
    - OTA sync throughput: multiple rapid bookings — verify all OTAs updated within 60 seconds
    - Report generation: 12 months of data — verify acceptable response time
    - _Requirements: 13.3, 21.2_

- [ ] 42. GST and tax compliance
  - [ ] 42.1 Implement GST configuration endpoints
    - `GET /gst/config` — return hotel GSTIN, tax rates, and tariff thresholds (admin)
    - `PATCH /gst/config` — update GSTIN, tax rates, tariff threshold, inter-state flag (admin)
    - `PATCH /menu/:id/hsn-sac` — assign HSN/SAC code to a food item (admin)
    - `PATCH /service-types/:type/hsn-sac` — assign SAC code to a service type (admin)
    - _Requirements: 40.3, 40.4_
  - [ ] 42.2 Implement GST calculation on folio charges
    - On every `FolioCharge` creation (food order, service, room charge): call `GSTService.calculateGST`; create `GSTLineItem` record; add GST as a separate line item on the folio
    - Apply CGST+SGST for intra-state, IGST for inter-state; use tariff slab logic for room charges
    - Tax rate changes apply only to new transactions
    - _Requirements: 40.1, 40.2, 40.7, 40.8_
  - [ ] 42.3 Implement GST report generation
    - `GET /gst/reports/gstr1?from=&to=` — generate GSTR-1 outward supplies report (admin)
    - `GET /gst/reports/gstr3b?from=&to=` — generate GSTR-3B summary report (admin)
    - `PATCH /purchases/:id/reverse-charge` — flag procurement entry as reverse charge; store supplier GSTIN (admin)
    - _Requirements: 40.5, 40.6_
  - [ ] 42.4 Display GST breakdown on invoices
    - Update invoice PDF generation to include GSTIN, HSN/SAC codes, CGST/SGST/IGST line items, and total tax
    - _Requirements: 40.1, 40.4_
  - [ ]* 42.5 Write property test for GST calculation accuracy
    - **Property 31: GST Calculation Accuracy**
    - **Validates: Requirements 40.1, 40.2, 40.7**

- [ ] 43. Accounting system
  - [ ] 43.1 Implement chart of accounts and ledger entry endpoints
    - `POST /accounting/accounts` — create account node with code, name, type, optional parent (admin)
    - `GET /accounting/accounts` — return full chart of accounts hierarchy (admin)
    - `GET /accounting/accounts/:id/entries?from=&to=` — return ledger entries for an account (admin)
    - _Requirements: 41.6_
  - [ ] 43.2 Implement double-entry transaction recording
    - On every financial event (payment received, procurement approved, payroll finalized): call `AccountingService.recordTransaction` with balanced debit + credit lines
    - Finalized entries are immutable; expose `POST /accounting/entries/:id/reverse` for corrections (admin)
    - _Requirements: 41.1, 41.4, 41.7_
  - [ ] 43.3 Implement financial statement endpoints
    - `GET /accounting/pnl?from=&to=` — P&L report: total revenue vs total expenses (admin)
    - `GET /accounting/balance-sheet?asOf=` — assets, liabilities, equity as of date (admin)
    - `GET /accounting/cash-flow?from=&to=` — inflows and outflows with timestamps (admin)
    - _Requirements: 41.2, 41.3, 41.4_
  - [ ] 43.4 Implement accounting data export
    - `GET /accounting/export/tally?from=&to=` — export Tally-compatible XML
    - `GET /accounting/export/zoho?from=&to=` — export Zoho Books-compatible CSV
    - _Requirements: 41.5_
  - [ ]* 43.5 Write property test for double-entry ledger integrity
    - **Property 32: Double-Entry Ledger Integrity**
    - **Validates: Requirements 41.1, 41.7**

- [ ] 44. Guest check-in KYC and legal compliance
  - [ ] 44.1 Implement KYC document upload and storage
    - `POST /kyc/:customerId/documents` — upload ID document (JPEG/PNG/PDF, max 10 MB); validate with magic bytes; store in private S3 bucket; record id_type and uploader (admin/manager)
    - `GET /kyc/:customerId/documents` — list KYC documents for a guest (admin/manager only; return 403 for other roles)
    - _Requirements: 42.1, 42.2, 42.6_
  - [ ] 44.2 Implement registration card generation
    - `POST /kyc/:customerId/registration-card` — generate `RegistrationCard` with guest details, stay dates, room number; store record; return PDF (admin/manager)
    - `GET /kyc/registration-cards/export?from=&to=` — bulk export registration cards as ZIP of PDFs (admin)
    - _Requirements: 42.3, 42.7_
  - [ ] 44.3 Implement C-Form for foreign guests
    - On check-in: if `Customer.nationality` is non-Indian, auto-flag guest and display C-Form prompt on staff portal
    - `POST /kyc/:customerId/c-form` — complete C-Form with passport, visa, nationality, arrival date, purpose (admin/manager)
    - `GET /kyc/c-forms/export?from=&to=` — bulk export C-Forms as ZIP of PDFs (admin)
    - _Requirements: 42.4, 42.5, 42.7_
  - [ ]* 44.4 Write property test for KYC document access control
    - **Property 33: KYC Document Access Control**
    - **Validates: Requirements 42.1, 42.6**

- [ ] 45. Kitchen Display System (KDS)
  - [ ] 45.1 Implement KDS WebSocket server and station routing
    - Extend WebSocket server with KDS channels: `kds:kitchen` and `kds:bar`
    - On new order: route drink/beverage items to `kds:bar`; food items to `kds:kitchen`; broadcast to respective channel
    - `GET /kds/orders?station=kitchen|bar` — return current order queue for a station (kitchen staff)
    - _Requirements: 43.1, 43.4_
  - [ ] 45.2 Implement KDS order display logic
    - Orders grouped by room number and delivery time, sorted by earliest delivery time first
    - Include: room number, items with quantities, special notes, elapsed time since placement, countdown to delivery deadline
    - When elapsed time exceeds `(delivery_deadline - threshold)`: flag order with visual delay alert (default threshold: 5 min, configurable)
    - _Requirements: 43.2, 43.3, 43.5_
  - [ ] 45.3 Implement KDS item-ready and auto-status-advance
    - `PATCH /kds/orders/:orderId/items/:itemId/ready` — mark individual item as ready (kitchen staff); when all items in order are ready, auto-advance order status to `out_for_delivery` and broadcast via main order WebSocket
    - _Requirements: 43.6_
  - [ ] 45.4 Implement KDS offline resilience
    - KDS frontend maintains a local in-memory cache of the current order queue; on WebSocket reconnect, re-fetches full queue from `GET /kds/orders?station=`; display remains functional during brief disconnections
    - _Requirements: 43.7_
  - [ ] 45.5 Build KDS screen UI (React)
    - Dedicated full-screen KDS view for kitchen and bar stations; real-time order cards with countdown timers; delay alerts highlighted in red; mark-ready buttons per item
    - _Requirements: 43.1, 43.2, 43.3, 43.5, 43.6_
  - [ ]* 45.6 Write property test for KDS order routing accuracy
    - **Property 34: KDS Order Routing Accuracy**
    - **Validates: Requirements 43.4, 43.6**

- [ ] 46. Multi-property support
  - [ ] 46.1 Implement property management endpoints
    - `POST /properties` — create new property with name, address, GSTIN, branding (owner)
    - `GET /properties` — list all properties for the authenticated owner
    - `PATCH /properties/:id` — update property details, GSTIN, branding (owner/admin)
    - Add `property_id` FK to all data tables: rooms, bookings, staff, inventory, menu, config, folios, orders, etc.
    - _Requirements: 44.1, 44.7_
  - [ ] 46.2 Implement property context switching
    - `POST /properties/:id/switch` — set active property context in JWT claims; all subsequent requests scoped to that property
    - Middleware: extract `property_id` from JWT and inject into all DB queries as a filter
    - _Requirements: 44.3_
  - [ ] 46.3 Implement aggregated owner dashboard
    - `GET /dashboard/aggregated` — return `AggregatedMetrics`: total revenue, occupancy %, active orders, pending maintenance across all owner properties
    - `GET /reports/cross-property?propertyIds=&type=` — generate report for selected properties or all (owner)
    - _Requirements: 44.2, 44.6_
  - [ ] 46.4 Implement multi-property staff access and supplier sharing
    - `POST /staff/:id/properties` — grant staff member access to additional properties (admin)
    - `POST /suppliers/:id/share` — share supplier across all properties under the same owner (admin)
    - _Requirements: 44.4, 44.5_
  - [ ]* 46.5 Write property test for multi-property data isolation
    - **Property 35: Multi-Property Data Isolation**
    - **Validates: Requirements 44.1, 44.4**

- [ ] 47. Checkpoint 8 — Ensure all tests pass, ask the user if questions arise.

## Notes

- Tasks marked with `*` are optional and can be skipped for a faster MVP
- Each task references specific requirements for traceability
- Checkpoints ensure incremental validation at logical milestones
- Property tests validate universal correctness properties using `fast-check` (minimum 100 iterations each)
- Unit tests validate specific examples, edge cases, and error conditions
- All property tests must be tagged: `// Feature: hotel-food-service, Property {N}: {property_text}`
- Tasks 42–46 cover Requirements 40–44 (GST compliance, accounting, KYC, KDS, multi-property)


## Task Dependency Graph

The implementation follows a logical flow with clear dependencies. Below is the task execution dependency structure:

```json
{
  "waves": [
    {
      "wave": 1,
      "tasks": ["1", "2", "3"],
      "description": "Foundation: Project Setup, Data Models, Authentication"
    },
    {
      "wave": 2,
      "tasks": ["4", "5", "6", "14"],
      "dependencies": ["1", "2", "3"],
      "description": "Customer & Infrastructure: Profiles, Config, QR Codes, Rooms"
    },
    {
      "wave": 3,
      "tasks": ["8", "9", "10", "11", "12", "15"],
      "dependencies": ["2", "3"],
      "description": "Food Inventory & Booking: Menu, Inventory, Procurement, Suppliers, Purchase Approval, Room Booking"
    },
    {
      "wave": 4,
      "tasks": ["16", "18", "20"],
      "dependencies": ["3", "14", "15", "8"],
      "description": "Food Ordering Pipeline: Folio & Billing, Food Orders, Kitchen Dashboard"
    },
    {
      "wave": 5,
      "tasks": ["19", "21", "23", "24", "25", "26"],
      "dependencies": ["16", "18"],
      "description": "Guest Experience: Live Tracking, Meal Plans, Service Requests, Housekeeping, Maintenance, Ratings"
    },
    {
      "wave": 6,
      "tasks": ["27", "28", "29", "30", "31", "32", "33", "34", "35", "36", "37", "38", "39", "40"],
      "dependencies": ["3", "16", "18"],
      "description": "Cross-Cutting Concerns: Messaging, Notifications, Minibar, Amenities, KYC, Analytics, Reports, Optimization"
    },
    {
      "wave": 7,
      "tasks": ["41", "42", "43", "44", "45", "46"],
      "dependencies": ["3", "16", "18", "20"],
      "description": "Advanced Features: Multi-Language, GST, Accounting, Legal Compliance, KDS, Multi-Property"
    },
    {
      "wave": 8,
      "tasks": ["47"],
      "dependencies": ["1", "2", "3", "4", "5", "6", "8", "9", "10", "11", "12", "14", "15", "16", "18", "20"],
      "description": "Checkpoint 8: Final Integration & System Validation"
    }
  ],
  "critical_path": {
    "tasks": ["1", "2", "3", "14", "15", "8", "18", "20", "16", "42"],
    "estimated_days": "12-16",
    "description": "Fastest path to operational hotel + food ordering system"
  }
}
```

### Critical Path (MVP Delivery)

The fastest path to an operational system:

1. **Task 1** → Project Setup (1-2 days)
2. **Task 2** → Data Models (1-2 days)
3. **Task 3** → Auth & RBAC (1 day)
4. **Task 14** → Room Management (0.5-1 day)
5. **Task 15** → Room Booking (1-2 days)
6. **Task 8** → Menu Management (0.5 day)
7. **Task 18** → Food Ordering (1-2 days)
8. **Task 20** → Kitchen Dashboard (1-2 days)
9. **Task 16** → Folio & Billing (1-2 days)
10. **Task 42** → GST Compliance (1 day)

**Total Critical Path: ~12-16 days** for a functional hotel + food ordering system

### Dependency Rules

- **No task can start** until its prerequisites are complete
- **Checkpoints (1, 2, 3, 8)** are validation gates; all dependent tests must pass before proceeding
- **Frontend tasks (1.5-1.12)** can run in parallel with backend tasks (2-43) once Task 1 scaffolding is done
- **Optional tasks** (marked with `*` containing property tests) can be deferred without blocking downstream tasks
- **Multi-property & advanced features (41-46)** should wait until core system is stable

### Parallel Execution Opportunities

The following task groups can run in parallel:

- **Frontend UI pages** (1.5-1.12, 18.3, 19.2, 20.2, 23.2) → parallel with backend services
- **Inventory & Procurement** (9, 10, 11, 12) → can start once Task 3 auth is complete
- **Guest Services** (23, 24, 25, 26) → independent of food ordering
- **Reporting & Analytics** (32, 33, 37) → can begin once core data models exist
- **Compliance layers** (31, 42, 43, 44) → can be implemented once transaction recording works

