# Requirements Document — Room Booking Service

## Introduction

The Room Booking Service governs the complete lifecycle of hotel room reservations: from public
availability search and direct booking, through check-in/check-out, to housekeeping turnover and
folio settlement. It integrates with the OTA channel manager, the guest portal, and the staff
dashboard, ensuring single-source-of-truth availability and preventing double-bookings across all
channels.

All acceptance criteria are written in **EARS** (Easy Approach to Requirements Syntax) notation.

---

## Glossary

| Term | Definition |
|------|-----------|
| Room | A physical hotel room with a type, price, capacity, and lifecycle status |
| RoomBooking | A confirmed reservation linking a guest to a specific room and date range |
| RoomFolio | A running bill accumulating all charges for a guest during their stay |
| RoomStatus | Current lifecycle state of a room: `available` → `occupied` → `cleaning` |
| OTA | Online Travel Agency (Booking.com, Expedia, Airbnb) |
| Guest | A visitor who holds or seeks a confirmed RoomBooking |
| Staff | Hotel employee with one of: `admin`, `manager`, `housekeeping`, `receptionist` |
| CheckIn | The act of a guest arriving and activating their RoomBooking |
| CheckOut | The act of a guest departing, triggering folio settlement and room cleaning |
| DoubleBooking | Two overlapping confirmed RoomBookings for the same Room — a prohibited state |

---

## Requirements

### REQ-RB-01: Room Availability Search

**User Story:** As a prospective guest, I want to search available rooms by date range so that I
can choose a room that suits my stay.

#### Acceptance Criteria

| ID | EARS Statement |
|----|---------------|
| RB-01-1 | WHEN a guest submits a search with a check-in date and check-out date, THE SYSTEM SHALL return only rooms whose `status` is `available` for the entire requested date range. |
| RB-01-2 | WHEN the check-in date is equal to or after the check-out date, THE SYSTEM SHALL reject the search and display a validation error message. |
| RB-01-3 | WHEN the check-in date is in the past, THE SYSTEM SHALL reject the search and display a validation error message. |
| RB-01-4 | THE SYSTEM SHALL display each available room with its type, capacity, price per night, description, and at least one photo. |
| RB-01-5 | WHILE a rate plan is active for a room type on the requested dates, THE SYSTEM SHALL display the rate plan price instead of the base `price_per_night`. |

---

### REQ-RB-02: Direct Room Booking

**User Story:** As a guest, I want to book a room directly on the hotel website so that I can
confirm a reservation without using a third-party platform.

#### Acceptance Criteria

| ID | EARS Statement |
|----|---------------|
| RB-02-1 | WHEN a guest submits a booking with valid guest name, phone, room selection, check-in, and check-out, THE SYSTEM SHALL create a `RoomBooking` record with status `confirmed`. |
| RB-02-2 | WHEN a booking is confirmed, THE SYSTEM SHALL send a confirmation notification to the guest via WhatsApp and email within 30 seconds. |
| RB-02-3 | WHEN a booking is confirmed, THE SYSTEM SHALL update the room's availability to blocked for the reserved date range. |
| RB-02-4 | IF a room already has a confirmed booking overlapping the requested dates, THEN THE SYSTEM SHALL reject the new booking and return a `409 Conflict` error. |
| RB-02-5 | THE SYSTEM SHALL calculate and display the total price as `nights × effectivePricePerNight` before the guest confirms. |
| RB-02-6 | WHEN a booking is confirmed, THE SYSTEM SHALL propagate the updated availability to all connected OTA platforms within 60 seconds. |

---

### REQ-RB-03: OTA Reservation Ingestion

**User Story:** As a hotel owner, I want reservations from Booking.com, Expedia, and Airbnb to
appear automatically in the system so that all bookings are managed in one place.

#### Acceptance Criteria

| ID | EARS Statement |
|----|---------------|
| RB-03-1 | WHEN an OTA platform sends a reservation webhook, THE SYSTEM SHALL create a corresponding `RoomBooking` with `source: 'ota'` and the platform's reservation ID within 10 seconds. |
| RB-03-2 | WHEN an OTA reservation is received for a room that is already booked for the overlapping dates, THE SYSTEM SHALL reject the reservation and alert the owner via WhatsApp and email. |
| RB-03-3 | IF an OTA sync attempt fails, THEN THE SYSTEM SHALL retry up to 3 times with exponential back-off (1 s, 2 s, 4 s) and alert the owner if all retries fail. |
| RB-03-4 | THE SYSTEM SHALL display the OTA platform name and last-successful-sync timestamp for each connected platform in the admin dashboard. |

---

### REQ-RB-04: Check-In Process

**User Story:** As a receptionist, I want to check a guest in so that their room is marked
occupied and their folio is opened.

#### Acceptance Criteria

| ID | EARS Statement |
|----|---------------|
| RB-04-1 | WHEN a receptionist initiates check-in for a confirmed booking, THE SYSTEM SHALL transition the `RoomBooking` status from `confirmed` to `checked_in` and the `Room.status` from `available` to `occupied`. |
| RB-04-2 | WHEN a guest checks in, THE SYSTEM SHALL automatically create a `Customer` profile if one does not already exist, matched by phone number. |
| RB-04-3 | WHEN a guest checks in, THE SYSTEM SHALL create an open `RoomFolio` for the booking and add the room-charge line item. |
| RB-04-4 | WHEN a guest checks in, THE SYSTEM SHALL generate a `Registration_Card` PDF containing guest identity, stay dates, and room number. |
| RB-04-5 | IF the guest is a foreign national, THEN THE SYSTEM SHALL generate a `C_Form` in addition to the standard Registration Card. |
| RB-04-6 | THE SYSTEM SHALL generate a unique QR code for the guest's room and associate it with the current stay. |

---

### REQ-RB-05: Check-Out Process

**User Story:** As a receptionist, I want to check a guest out so that their folio is settled,
a final invoice is generated, and the room enters the cleaning queue.

#### Acceptance Criteria

| ID | EARS Statement |
|----|---------------|
| RB-05-1 | WHEN a receptionist initiates check-out, THE SYSTEM SHALL transition the `RoomBooking` to `checked_out`, settle the `RoomFolio`, and generate a final invoice. |
| RB-05-2 | WHEN check-out is completed, THE SYSTEM SHALL transition the `Room.status` from `occupied` to `cleaning`. |
| RB-05-3 | WHEN check-out is completed, THE SYSTEM SHALL automatically create a housekeeping `StaffTask` for the vacated room. |
| RB-05-4 | IF the `RoomFolio` has an unsettled balance, THEN THE SYSTEM SHALL prevent check-out and display the outstanding amount. |
| RB-05-5 | WHEN a final invoice is generated, THE SYSTEM SHALL include GSTIN, HSN/SAC codes, and a GST line-item breakdown in accordance with Requirement REQ-GST. |

---

### REQ-RB-06: Room Status Lifecycle

**User Story:** As hotel staff, I want the room status to be kept accurate at all times so that
front-desk and housekeeping are always in sync.

#### Acceptance Criteria

| ID | EARS Statement |
|----|---------------|
| RB-06-1 | THE SYSTEM SHALL enforce the state machine: `available` → `occupied` (on check-in) → `cleaning` (on check-out) → `available` (on housekeeping completion). No other transitions are permitted. |
| RB-06-2 | WHILE a room is in `cleaning` status, THE SYSTEM SHALL prevent any new booking from being confirmed for that room. |
| RB-06-3 | WHEN a housekeeping task for a room is marked complete, THE SYSTEM SHALL transition the `Room.status` from `cleaning` to `available`. |
| RB-06-4 | THE SYSTEM SHALL display a real-time room status grid on the staff dashboard, updated within 5 seconds of any status change. |

---

### REQ-RB-07: Double-Booking Prevention

**User Story:** As a hotel owner, I want the system to make double-booking structurally
impossible so that guests never arrive to find their room taken.

#### Acceptance Criteria

| ID | EARS Statement |
|----|---------------|
| RB-07-1 | THE SYSTEM SHALL enforce a database-level unique constraint that prevents two `confirmed` or `checked_in` bookings from overlapping on the same `room_id`. |
| RB-07-2 | WHEN a booking confirmation is attempted that would overlap an existing booking, THE SYSTEM SHALL return an error before any write to the database. |
| RB-07-3 | WHEN concurrent booking requests for the same room and date range arrive simultaneously, THE SYSTEM SHALL guarantee that only one booking is confirmed via optimistic locking or a serializable transaction. |

---

### REQ-RB-08: Booking Modification and Cancellation

**User Story:** As hotel staff, I want to modify or cancel bookings so that I can accommodate
guest changes and re-open rooms quickly.

#### Acceptance Criteria

| ID | EARS Statement |
|----|---------------|
| RB-08-1 | WHEN a booking is cancelled, THE SYSTEM SHALL transition its status to `cancelled`, release the room availability, and notify the guest via WhatsApp and email. |
| RB-08-2 | WHEN a booking's check-out date is modified to a later date, THE SYSTEM SHALL verify that no other booking occupies the room for the extended period before confirming the change. |
| RB-08-3 | IF a booking has status `checked_in`, THEN THE SYSTEM SHALL prevent cancellation and display a message directing staff to perform check-out instead. |
| RB-08-4 | WHEN a booking is cancelled or modified, THE SYSTEM SHALL propagate the updated availability to all connected OTA platforms within 60 seconds. |

---

### REQ-RB-09: Folio and Billing Integrity

**User Story:** As a guest, I want my folio to always reflect every charge accurately so that
I am never surprised at checkout.

#### Acceptance Criteria

| ID | EARS Statement |
|----|---------------|
| RB-09-1 | WHEN any chargeable event occurs (food order, service request, amenity booking, minibar log), THE SYSTEM SHALL add a `FolioCharge` record atomically in the same database transaction. |
| RB-09-2 | THE SYSTEM SHALL compute the `RoomFolio.total` as the sum of all associated `FolioCharge.amount` values and keep it consistent with charges at all times. |
| RB-09-3 | WHEN a guest requests their folio, THE SYSTEM SHALL return all charges sorted by timestamp with descriptions. |
| RB-09-4 | IF a payment gateway confirms a `paid` status for a transaction, THEN THE SYSTEM SHALL mark the `RoomFolio` as `settled` and prevent further charges. |

---

### REQ-RB-10: Rate Plan Pricing

**User Story:** As a hotel owner, I want to configure seasonal and promotional pricing so that
room rates adjust automatically during high-demand periods.

#### Acceptance Criteria

| ID | EARS Statement |
|----|---------------|
| RB-10-1 | THE SYSTEM SHALL allow admin and manager roles to create `RatePlan` records with a room type, date range, days-of-week applicability, and a price-per-night override. |
| RB-10-2 | WHEN computing booking total, THE SYSTEM SHALL apply the most specific (narrowest date range) active rate plan for each night in the stay. |
| RB-10-3 | WHILE no rate plan matches a given night, THE SYSTEM SHALL fall back to the `Room.price_per_night` base price. |
| RB-10-4 | THE SYSTEM SHALL expose a pricing calendar API that returns the effective price for each day in a requested month per room type. |
