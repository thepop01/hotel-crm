# Requirements Document

## Introduction

A comprehensive hotel operations platform designed for single or multi-property hotel and resort management. The system covers the full guest and staff experience: guests scan a QR code to access food ordering, service requests (housekeeping, laundry, room service), live order tracking, and room booking — all without downloading an app. Staff benefit from role-based tools for order management, inventory control, ingredient procurement with bill verification, and task/attendance tracking. The hotel owner gets a full admin dashboard with revenue analytics, room status, staff activity logs, and automated price anomaly alerts to prevent procurement fraud. The platform includes GST and tax compliance for Indian regulations, a double-entry accounting system, guest check-in KYC with legal form generation, a real-time Kitchen Display System (KDS), and multi-property support for owners managing multiple locations. The platform is branded per property with the hotel's name and photo, creating a unified, personalized ecosystem for guests and staff alike.

## Glossary

- **Hotel_System**: The complete hotel operations platform covering food service, inventory, guest services, and administration
- **Customer**: A hotel guest who has checked in and can order food or request services
- **Buyer**: Hotel staff member responsible for procuring ingredients from the market
- **Food_Item**: A menu item available for ordering with associated inventory
- **Ingredient**: Raw materials used to prepare food items
- **Order**: A customer's food service request with specified delivery time
- **Inventory**: Current stock levels of ingredients and food items
- **Customer_Profile**: Automatically generated account containing guest information
- **QR_Code**: A scannable code placed in guest rooms that opens the ordering website directly in a browser
- **Service_Request**: A guest request for non-food hotel services such as housekeeping, laundry, or room service
- **Live_Tracking**: Real-time status updates shown to the guest as their order progresses through preparation and delivery stages
- **Meal_Plan**: A pre-configured, structured set of meals (breakfast, lunch, dinner) that a guest can subscribe to for a defined period
- **Admin_Dashboard**: The hotel owner's control panel showing revenue, room status, staff activity, reports, and booking management
- **Bill_Photo**: A photograph of a purchase receipt uploaded by a buyer as proof of procurement
- **Price_Anomaly**: A purchase price that deviates significantly from historical prices for the same ingredient, flagged as a potential fraud indicator
- **Kitchen_Consumption**: The daily quantity of each ingredient used in food preparation, tracked separately from procurement
- **Staff_Task**: A unit of work assigned by a manager to a staff member with a defined description and completion status
- **Room_Booking**: A reservation made by a guest for a hotel room through the Hotel_System
- **Room_Status**: The current state of a hotel room — one of: Available, Occupied, or Cleaning
- **OTA_Platform**: A third-party online travel agency or booking platform (e.g., Booking.com, Expedia, Airbnb) that lists hotel rooms and accepts reservations on behalf of the hotel
- **Room_Folio**: A running bill associated with a guest's stay that accumulates all charges including room rate, food orders, service requests, and any additional fees, settled at checkout
- **Supplier**: An external vendor or market seller from whom the hotel procures ingredients, housekeeping supplies, or maintenance materials, identified by name and contact information
- **Purchase_Approval**: A workflow state for procurement entries requiring manager or admin authorization before inventory is updated and the entry is finalized
- **Expense_Analytics**: Aggregated financial data and visual reports on the Admin_Dashboard covering procurement costs, supplier pricing, stock usage, and flagged spending irregularities
- **Guest_Rating**: A 1–5 star score with an optional text comment submitted by a guest after a food order delivery or service request completion
- **Payment_Gateway**: An external payment processing service (e.g. Razorpay, Stripe) integrated with the Hotel_System to handle online card and UPI transactions
- **Amenity**: A bookable hotel facility or activity (e.g. spa, gym, pool, activity session) with configurable time slots, capacity, and optional pricing
- **Minibar_Charge**: A charge added to a guest's Room_Folio for items consumed from the in-room minibar or in-room supplies, logged by staff
- **Loyalty_Tier**: A classification assigned to a returning guest (e.g. Silver, Gold, Platinum) based on visit count or total spend, used to identify VIP guests
- **Rate_Plan**: A pricing configuration for rooms with a defined date range, days-of-week applicability, and price per night, used to manage seasonal and promotional pricing
- **Lost_Found_Item**: A physical item either reported as lost by a guest or found by staff, tracked in the Hotel_System with description, location, date, and resolution status
- **GSTIN**: Goods and Services Tax Identification Number — a unique 15-digit identifier assigned to a registered GST taxpayer in India, displayed on all invoices
- **HSN_SAC_Code**: Harmonized System of Nomenclature (HSN) code for goods or Service Accounting Code (SAC) for services, used to classify items for GST rate determination
- **GST_Report**: A structured tax filing report generated by the Hotel_System summarizing outward supplies (GSTR-1) or consolidated tax liability (GSTR-3B) for a selected period
- **Ledger_Entry**: A double-entry accounting record consisting of a debit and a corresponding credit, representing a single financial transaction in the Hotel_System
- **Registration_Card**: A digital document generated at guest check-in containing guest identity details, stay dates, and room number, used for legal compliance
- **C_Form**: A statutory form (Form C under the Foreigners Act, India) required for foreign national guests, containing passport, visa, nationality, and visit purpose details
- **KDS_Station**: A designated kitchen display terminal (e.g. Kitchen or Bar) that receives and shows only the order items routed to that station
- **Property**: An individual hotel or resort location managed within the Hotel_System under a single owner account, with its own isolated data, GSTIN, and configuration

## Requirements

### Requirement 1: Customer Profile Management

**User Story:** As a hotel guest, I want my profile to be automatically created when I check in, so that I can easily access the food ordering system.

#### Acceptance Criteria

1. WHEN a customer checks in, THE Hotel_System SHALL automatically create a Customer_Profile with phone number, room number, and name
2. WHEN a Customer_Profile is created, THE Hotel_System SHALL generate a unique customer ID
3. WHEN a customer accesses the website, THE Hotel_System SHALL authenticate them using their phone number and room number
4. THE Hotel_System SHALL store all customer information securely and maintain data integrity

### Requirement 2: Food Ordering System

**User Story:** As a hotel guest, I want to browse the menu and place food orders with specific delivery times, so that I can enjoy meals at my convenience.

#### Acceptance Criteria

1. WHEN a customer visits the food ordering website, THE Hotel_System SHALL display available food items with photos and current availability
2. WHEN a customer selects food items, THE Hotel_System SHALL allow them to specify quantity and preferred delivery time
3. WHEN a customer places an order, THE Hotel_System SHALL validate the delivery time against hotel operating hours
4. WHEN an order is confirmed, THE Hotel_System SHALL update inventory quantities and send confirmation to the customer
5. THE Hotel_System SHALL prevent orders when food items are out of stock

### Requirement 3: Operating Hours Management

**User Story:** As hotel management, I want to set opening and closing times for food service, so that orders are only accepted during operational hours.

#### Acceptance Criteria

1. THE Hotel_System SHALL allow authorized staff to configure daily opening and closing times
2. WHEN customers attempt to place orders outside operating hours, THE Hotel_System SHALL prevent order placement and display operating hours
3. WHEN delivery times are selected, THE Hotel_System SHALL only allow times within operating hours
4. THE Hotel_System SHALL display current operating status to customers on the website

### Requirement 4: Inventory Management

**User Story:** As hotel staff, I want to track food item quantities and ingredient levels, so that I can maintain adequate stock and prevent overselling.

#### Acceptance Criteria

1. THE Hotel_System SHALL maintain real-time inventory counts for all food items and ingredients
2. WHEN food items are ordered, THE Hotel_System SHALL automatically decrease inventory quantities
3. WHEN inventory levels fall below minimum thresholds, THE Hotel_System SHALL generate low stock alerts
4. THE Hotel_System SHALL allow staff to manually adjust inventory levels with proper authorization
5. THE Hotel_System SHALL maintain an audit trail of all inventory changes

### Requirement 5: Ingredient Procurement System

**User Story:** As a buyer, I want to record ingredient purchases and update inventory, so that stock levels remain accurate and procurement is tracked.

#### Acceptance Criteria

1. WHEN a buyer visits the market, THE Hotel_System SHALL provide a list of ingredients that can be purchased
2. WHEN a buyer selects purchased ingredients, THE Hotel_System SHALL allow them to specify quantities and prices
3. WHEN ingredient purchases are recorded, THE Hotel_System SHALL automatically update inventory levels
4. THE Hotel_System SHALL allow buyers to add new ingredients to the procurement list
5. THE Hotel_System SHALL track purchase history and pricing trends for cost analysis

### Requirement 6: Menu and Photo Management

**User Story:** As hotel staff, I want to manage food items with photos and descriptions, so that customers can make informed ordering decisions.

#### Acceptance Criteria

1. THE Hotel_System SHALL allow authorized staff to add, edit, and remove food items from the menu
2. WHEN food items are created or updated, THE Hotel_System SHALL support photo uploads and display
3. THE Hotel_System SHALL maintain food item descriptions, pricing, and availability status
4. WHEN food items are displayed to customers, THE Hotel_System SHALL show current photos and accurate information
5. THE Hotel_System SHALL allow staff to temporarily disable food items without removing them from the system

### Requirement 7: Order Processing and Tracking

**User Story:** As hotel staff, I want to view and manage customer orders with notifications and status tracking, so that food service can be delivered efficiently and on time.

#### Acceptance Criteria

1. THE Hotel_System SHALL provide a dashboard showing all pending orders with delivery times and customer details
2. WHEN orders are received, THE Hotel_System SHALL organize them by delivery time and priority
3. WHEN an order is placed, THE Hotel_System SHALL send notifications to staff via WhatsApp and email
4. THE Hotel_System SHALL allow staff to mark orders as "claimed" when they start preparation
5. THE Hotel_System SHALL allow staff to mark orders as "completed" when ready for delivery
6. WHEN orders are completed, THE Hotel_System SHALL record completion time and update customer history
7. THE Hotel_System SHALL send notifications to customers about order status changes

### Requirement 8: Data Persistence and Security

**User Story:** As hotel management, I want all system data to be securely stored and backed up, so that business operations can continue reliably.

#### Acceptance Criteria

1. THE Hotel_System SHALL store all customer profiles, orders, and inventory data in a secure database
2. WHEN data is accessed, THE Hotel_System SHALL enforce proper authentication and authorization
3. THE Hotel_System SHALL maintain data backups and ensure system availability
4. THE Hotel_System SHALL protect sensitive customer information according to privacy standards
5. THE Hotel_System SHALL log all system activities for audit and troubleshooting purposes

### Requirement 9: Hotel Branding and Customization

**User Story:** As hotel management, I want the website to display our hotel's name and photo, so that guests have a personalized and branded experience.

#### Acceptance Criteria

1. THE Hotel_System SHALL display the hotel's name prominently on all website pages
2. THE Hotel_System SHALL show the hotel's photo or logo on the main interface
3. THE Hotel_System SHALL allow authorized staff to update hotel branding information
4. WHEN customers access the website, THE Hotel_System SHALL provide a customized experience specific to the hotel
5. THE Hotel_System SHALL maintain consistent branding across all customer-facing interfaces

### Requirement 10: Notification System

**User Story:** As hotel staff, I want to receive instant notifications when orders are placed, so that I can respond quickly to customer requests.

#### Acceptance Criteria

1. WHEN a customer places an order, THE Hotel_System SHALL send immediate notifications via WhatsApp to designated staff members
2. WHEN a customer places an order, THE Hotel_System SHALL send email notifications to the kitchen staff with order details
3. THE Hotel_System SHALL include order details, customer information, and delivery time in all notifications
4. THE Hotel_System SHALL allow staff to configure notification preferences and contact information
5. THE Hotel_System SHALL maintain a log of all notifications sent for tracking purposes

### Requirement 11: QR Code Access

**User Story:** As a hotel guest, I want to scan a QR code in my room to open the ordering site instantly, so that I can access hotel services without downloading any app.

#### Acceptance Criteria

1. THE Hotel_System SHALL generate a unique QR_Code for each room that encodes the room-specific ordering URL
2. WHEN a guest scans the QR_Code, THE Hotel_System SHALL open the ordering website in the device's browser with the room number pre-filled
3. THE Hotel_System SHALL allow authorized staff to regenerate QR_Codes for any room
4. WHEN a QR_Code is scanned, THE Hotel_System SHALL display the hotel-branded landing page within 3 seconds on a standard mobile connection
5. THE Hotel_System SHALL allow staff to download and print QR_Codes for physical placement in rooms

### Requirement 12: Guest Service Requests

**User Story:** As a hotel guest, I want to request housekeeping, laundry, and room service from the same interface I use for food ordering, so that I can manage all my needs in one place.

#### Acceptance Criteria

1. THE Hotel_System SHALL provide a Service_Request interface accessible from the same guest portal as food ordering
2. WHEN a guest submits a Service_Request, THE Hotel_System SHALL record the request type (housekeeping, laundry, or room service), room number, and timestamp
3. WHEN a Service_Request is submitted, THE Hotel_System SHALL notify the relevant staff via WhatsApp and the staff dashboard
4. THE Hotel_System SHALL allow staff to update the status of a Service_Request to "acknowledged", "in progress", or "completed"
5. WHEN a Service_Request status changes, THE Hotel_System SHALL notify the guest of the updated status
6. THE Hotel_System SHALL display the guest's active Service_Requests and their current statuses on the guest portal

### Requirement 13: Live Order Tracking

**User Story:** As a hotel guest, I want to see real-time status updates for my food order, so that I know when to expect my meal.

#### Acceptance Criteria

1. WHEN a guest views an active Order, THE Hotel_System SHALL display the current Live_Tracking status in real time without requiring a page refresh
2. THE Hotel_System SHALL support the following Live_Tracking stages in sequence: Order Placed → Preparing → Out for Delivery → Delivered
3. WHEN kitchen staff update an Order's status, THE Hotel_System SHALL reflect the change on the guest's tracking view within 5 seconds
4. WHEN an Order reaches the "Delivered" stage, THE Hotel_System SHALL record the delivery timestamp and close the active tracking session
5. THE Hotel_System SHALL display an estimated delivery time alongside the Live_Tracking status

### Requirement 14: Meal and Diet Plans

**User Story:** As a hotel guest, I want to subscribe to a structured meal plan for my stay, so that I don't have to place individual orders for every meal.

#### Acceptance Criteria

1. THE Hotel_System SHALL allow authorized staff to create and manage Meal_Plans with defined meals for breakfast, lunch, and dinner
2. WHEN a guest subscribes to a Meal_Plan, THE Hotel_System SHALL record the plan, start date, end date, and associated room number
3. WHEN a Meal_Plan is active for a guest, THE Hotel_System SHALL automatically generate Orders at the scheduled meal times without requiring manual guest input
4. THE Hotel_System SHALL allow guests to view their active Meal_Plan and the meals scheduled for the current day
5. WHEN a guest cancels a Meal_Plan subscription, THE Hotel_System SHALL stop generating future Orders and record the cancellation timestamp
6. THE Hotel_System SHALL allow staff to assign dietary preferences (vegetarian, non-vegetarian, vegan) to a Meal_Plan

### Requirement 15: Hotel Admin Dashboard

**User Story:** As a hotel owner, I want a single dashboard showing revenue, room status, staff activity, and reports, so that I have full visibility into hotel operations.

#### Acceptance Criteria

1. THE Hotel_System SHALL provide an Admin_Dashboard accessible only to users with the owner or admin role
2. THE Admin_Dashboard SHALL display total revenue for the current day, current week, and current month, updated in real time
3. THE Admin_Dashboard SHALL display the Room_Status (Available, Occupied, or Cleaning) for every room in the hotel
4. THE Admin_Dashboard SHALL display a staff activity log showing each staff member's recent actions with timestamps
5. THE Hotel_System SHALL generate daily, weekly, and monthly reports summarizing orders, revenue, procurement costs, and service requests
6. WHEN a report is requested, THE Hotel_System SHALL make it available for download in a structured format (PDF or CSV)
7. THE Admin_Dashboard SHALL display a booking management view listing all current and upcoming Room_Bookings with guest details

### Requirement 16: Procurement Bill Photo Upload

**User Story:** As a hotel owner, I want buyers to upload a photo of the purchase bill when logging a procurement entry, so that I can verify purchases and maintain accountability.

#### Acceptance Criteria

1. WHEN a buyer records a procurement entry, THE Hotel_System SHALL require a Bill_Photo upload before the entry can be submitted
2. THE Hotel_System SHALL accept Bill_Photo uploads in JPEG, PNG, or PDF format with a maximum file size of 10 MB
3. WHEN a Bill_Photo is uploaded, THE Hotel_System SHALL store it linked to the corresponding procurement entry
4. THE Hotel_System SHALL allow the owner and admin roles to view the Bill_Photo for any procurement entry from the Admin_Dashboard
5. IF a buyer attempts to submit a procurement entry without a Bill_Photo, THEN THE Hotel_System SHALL reject the submission and display a descriptive error message

### Requirement 17: Price Anomaly Detection

**User Story:** As a hotel owner, I want the system to alert me when a procurement price is unusually high compared to historical prices, so that I can detect and prevent procurement fraud.

#### Acceptance Criteria

1. WHEN a buyer submits a procurement entry, THE Hotel_System SHALL compare the entered price per unit against the historical average price for the same Ingredient over the previous 30 days
2. WHEN the entered price exceeds 150% of the 30-day historical average, THE Hotel_System SHALL flag the entry as a Price_Anomaly
3. WHEN a Price_Anomaly is detected, THE Hotel_System SHALL send an alert notification to the owner via WhatsApp and email within 60 seconds
4. THE Admin_Dashboard SHALL display all flagged Price_Anomaly entries with the submitted price, historical average, and percentage deviation
5. THE Hotel_System SHALL allow the owner to mark a Price_Anomaly alert as reviewed with an optional note
6. IF fewer than 3 historical price records exist for an Ingredient, THEN THE Hotel_System SHALL skip anomaly detection for that Ingredient and record the entry without flagging

### Requirement 18: Daily Kitchen Consumption Tracking

**User Story:** As hotel management, I want to track how much of each ingredient is used in the kitchen each day, so that I can monitor waste, plan procurement, and control costs.

#### Acceptance Criteria

1. THE Hotel_System SHALL allow kitchen staff to log Kitchen_Consumption entries specifying the Ingredient, quantity used, and date
2. WHEN a Kitchen_Consumption entry is submitted, THE Hotel_System SHALL deduct the recorded quantity from the current Inventory level for that Ingredient
3. THE Hotel_System SHALL display a daily Kitchen_Consumption summary showing total usage per Ingredient for the selected date
4. THE Admin_Dashboard SHALL display a weekly Kitchen_Consumption trend for each Ingredient as a chart or table
5. WHEN Kitchen_Consumption for an Ingredient on a given day exceeds 200% of the 7-day average consumption for that Ingredient, THE Hotel_System SHALL generate an alert for the owner
6. THE Hotel_System SHALL maintain a historical record of all Kitchen_Consumption entries for a minimum of 12 months

### Requirement 19: Staff Task Assignment and Attendance Tracking

**User Story:** As a hotel manager, I want to assign tasks to staff members and optionally track their attendance, so that I can coordinate operations and maintain accountability.

#### Acceptance Criteria

1. THE Hotel_System SHALL allow users with the manager or admin role to create Staff_Tasks with a title, description, assigned staff member, and due time
2. WHEN a Staff_Task is assigned, THE Hotel_System SHALL notify the assigned staff member via the staff portal and WhatsApp
3. THE Hotel_System SHALL allow staff members to update their assigned Staff_Task status to "in progress" or "completed"
4. THE Hotel_System SHALL display all open and completed Staff_Tasks for the current day on the manager's dashboard view
5. WHERE attendance tracking is enabled, THE Hotel_System SHALL allow staff members to log a check-in and check-out time each day
6. WHERE attendance tracking is enabled, THE Admin_Dashboard SHALL display attendance records for each staff member showing check-in time, check-out time, and total hours per day

### Requirement 20: Room Booking

**User Story:** As a hotel guest, I want to book a room through the hotel's system, so that I can reserve accommodation without contacting the hotel separately.

#### Acceptance Criteria

1. THE Hotel_System SHALL provide a room booking interface displaying available rooms with room type, capacity, and price per night
2. WHEN a guest submits a Room_Booking, THE Hotel_System SHALL record the guest name, phone number, room number, check-in date, and check-out date
3. WHEN a Room_Booking is confirmed, THE Hotel_System SHALL update the Room_Status of the booked room to Occupied for the reservation period
4. WHEN a Room_Booking is confirmed, THE Hotel_System SHALL send a confirmation notification to the guest via WhatsApp and email
5. THE Hotel_System SHALL prevent a Room_Booking for a room that already has a confirmed booking overlapping the requested dates
6. THE Hotel_System SHALL allow authorized staff to cancel or modify a Room_Booking and notify the guest of the change
7. WHEN a guest with a confirmed Room_Booking checks in, THE Hotel_System SHALL automatically create a Customer_Profile for that guest if one does not already exist

### Requirement 21: OTA Platform Integration

**User Story:** As a hotel owner, I want room availability and pricing to sync automatically with third-party booking platforms, so that inventory stays consistent across all channels in real time.

#### Acceptance Criteria

1. THE Hotel_System SHALL integrate with OTA_Platforms (Booking.com, Expedia, Airbnb) via their published APIs to synchronize room availability and pricing
2. WHEN a Room_Booking is confirmed through any channel, THE Hotel_System SHALL update availability on all connected OTA_Platforms within 60 seconds to prevent double-booking
3. WHEN room pricing is updated in the Admin_Dashboard, THE Hotel_System SHALL propagate the updated price to all connected OTA_Platforms within 60 seconds
4. WHEN an OTA_Platform sends a new reservation, THE Hotel_System SHALL create a corresponding Room_Booking and update Room_Status accordingly
5. IF synchronization with an OTA_Platform fails, THEN THE Hotel_System SHALL retry the sync up to 3 times and alert the owner with the platform name and failure reason
6. THE Admin_Dashboard SHALL display the connection status and last successful sync timestamp for each connected OTA_Platform

### Requirement 22: Direct Booking Engine

**User Story:** As a hotel owner, I want guests to book rooms directly on the hotel's own website, so that the hotel can accept reservations without relying solely on third-party platforms.

#### Acceptance Criteria

1. THE Hotel_System SHALL provide a publicly accessible booking page on the hotel's website displaying available room types with photos, descriptions, capacity, and price per night
2. WHEN a guest selects dates on the booking page, THE Hotel_System SHALL display only rooms with confirmed availability for the full requested period using live inventory data
3. WHEN a guest submits a direct booking, THE Hotel_System SHALL record the guest name, phone number, room type, check-in date, check-out date, and total price
4. WHEN a direct booking is confirmed, THE Hotel_System SHALL send a confirmation to the guest via WhatsApp and email and update Room_Status and OTA_Platform availability
5. THE Hotel_System SHALL prevent a direct booking for any room that already has a confirmed booking overlapping the requested dates
6. THE Hotel_System SHALL display the hotel's branding, name, and photo on the direct booking page consistent with Requirement 9

### Requirement 23: Room Billing and Folio System

**User Story:** As a hotel guest and staff member, I want all charges to be automatically added to my room bill and a consolidated invoice generated at checkout, so that billing is transparent and accurate.

#### Acceptance Criteria

1. WHEN a guest places a food Order, THE Hotel_System SHALL automatically add the order total to the guest's Room_Folio
2. WHEN a Service_Request with an associated charge is completed, THE Hotel_System SHALL automatically add the charge to the guest's Room_Folio
3. THE Hotel_System SHALL allow authorized staff to manually add miscellaneous charges to a Room_Folio with a description and amount
4. WHEN a guest requests to view their bill, THE Hotel_System SHALL display the current Room_Folio showing an itemized list of all charges with timestamps
5. WHEN a guest checks out, THE Hotel_System SHALL allow authorized staff to generate a final consolidated invoice from the Room_Folio covering room charges, food orders, service charges, and any additional fees
6. WHEN a final invoice is generated, THE Hotel_System SHALL mark the Room_Folio as settled and update the Room_Status to Available
7. THE Hotel_System SHALL allow the owner and admin roles to view and export any Room_Folio from the Admin_Dashboard

### Requirement 24: Multi-Category Inventory Management

**User Story:** As hotel management, I want inventory tracking to cover food ingredients, housekeeping supplies, and maintenance materials in separate categories, so that all operational stock is managed in one place.

#### Acceptance Criteria

1. THE Hotel_System SHALL support inventory items organized into at least three distinct categories: Food Ingredients, Housekeeping Supplies, and Maintenance Materials
2. THE Hotel_System SHALL allow authorized staff to add, edit, and remove inventory items within each category independently
3. WHEN inventory levels for any item in any category fall below the configured minimum threshold, THE Hotel_System SHALL generate a low stock alert specifying the item name and category
4. THE Hotel_System SHALL display inventory levels per category on separate views and allow filtering by category across all inventory reports
5. WHEN a procurement entry is recorded, THE Hotel_System SHALL require the buyer to assign the purchased items to a specific inventory category
6. THE Hotel_System SHALL maintain an audit trail of all inventory changes across all categories, including the category, item, quantity change, and staff member responsible

### Requirement 25: Supplier Management

**User Story:** As a hotel owner, I want every purchase to be linked to a specific supplier and a supplier directory maintained, so that I can track spending per vendor and compare prices.

#### Acceptance Criteria

1. THE Hotel_System SHALL maintain a Supplier directory allowing authorized staff to add, edit, and deactivate Supplier records with name, contact number, and category of goods supplied
2. WHEN a buyer records a procurement entry, THE Hotel_System SHALL require selection of a Supplier from the directory before the entry can be submitted
3. THE Hotel_System SHALL allow the owner and admin roles to filter purchase history by Supplier to view all transactions with a specific vendor
4. THE Admin_Dashboard SHALL display a supplier price comparison view showing the price history of the same inventory item across different Suppliers
5. WHEN a new Supplier is added to the directory, THE Hotel_System SHALL assign a unique Supplier ID and record the creation timestamp and the staff member who created the record

### Requirement 26: Purchase Approval Workflow

**User Story:** As a hotel manager, I want procurement entries to require approval before inventory is updated, so that unauthorized or erroneous purchases cannot affect stock levels.

#### Acceptance Criteria

1. WHEN a buyer submits a procurement entry, THE Hotel_System SHALL set the entry status to "pending approval" and notify users with the manager or admin role via the staff dashboard and WhatsApp
2. WHILE a procurement entry is in "pending approval" status, THE Hotel_System SHALL NOT update inventory levels for the items in that entry
3. WHEN a manager or admin approves a procurement entry, THE Hotel_System SHALL update the entry status to "approved", update inventory levels, and record the approver's name and approval timestamp
4. WHEN a manager or admin rejects a procurement entry, THE Hotel_System SHALL update the entry status to "rejected", notify the buyer with the rejection reason, and leave inventory levels unchanged
5. WHEN a procurement entry is approved, THE Hotel_System SHALL lock the entry so that its quantities and prices cannot be edited by any user
6. THE Admin_Dashboard SHALL display all pending Purchase_Approval entries with the buyer name, items, total value, and submission timestamp, sorted by submission time

### Requirement 27: Owner Expense Analytics Dashboard

**User Story:** As a hotel owner, I want a detailed expense analytics section in my dashboard, so that I can monitor spending patterns, compare supplier costs, and detect financial irregularities.

#### Acceptance Criteria

1. THE Admin_Dashboard SHALL display a monthly Expense_Analytics breakdown showing total procurement spend grouped by inventory category (Food Ingredients, Housekeeping Supplies, Maintenance Materials) for the selected month
2. THE Admin_Dashboard SHALL display a supplier comparison chart showing the average price paid per unit for the same inventory item across different Suppliers over a selectable date range
3. THE Admin_Dashboard SHALL display a stock usage vs. procurement cost analysis comparing the quantity of each item consumed (via Kitchen_Consumption or service usage) against the total procurement cost for that item over the selected period
4. THE Admin_Dashboard SHALL display a flagged irregularities panel listing all Price_Anomaly alerts, rejected Purchase_Approval entries, and procurement entries exceeding a configurable high-value threshold, with the ability to filter by date range and category
5. WHEN the owner selects a flagged irregularity, THE Hotel_System SHALL display the full procurement entry details including the Bill_Photo, Supplier name, buyer name, and any reviewer notes
6. THE Hotel_System SHALL allow the owner to export the Expense_Analytics data for any selected period in CSV format

### Requirement 28: Guest Feedback and Ratings

**User Story:** As a hotel guest, I want to rate my food orders and service requests after they are completed, so that the hotel can improve quality based on my feedback.

#### Acceptance Criteria

1. WHEN a food Order reaches the "Delivered" stage, THE Hotel_System SHALL allow the guest to submit a Guest_Rating with a score of 1–5 stars and an optional text comment
2. WHEN a Service_Request is marked "completed", THE Hotel_System SHALL allow the guest to submit a Guest_Rating with a score of 1–5 stars and an optional text comment
3. THE Admin_Dashboard SHALL display aggregated Guest_Rating data filterable by food item, staff member, and service type
4. WHEN a Guest_Rating of 2 stars or below is submitted, THE Hotel_System SHALL generate an alert to the manager via the staff dashboard and WhatsApp within 60 seconds

### Requirement 29: Payment Processing

**User Story:** As a hotel guest, I want to pay for my room booking online and settle my folio at checkout, so that I can complete transactions without handling cash.

#### Acceptance Criteria

1. WHEN a guest confirms a Room_Booking, THE Hotel_System SHALL offer online payment via card or UPI through an integrated Payment_Gateway
2. THE Hotel_System SHALL integrate with a Payment_Gateway (e.g. Razorpay or Stripe) to process card and UPI transactions securely
3. THE Hotel_System SHALL track payment status (paid, pending, or refunded) per Room_Booking and per Room_Folio
4. WHEN a guest checks out, THE Hotel_System SHALL allow authorized staff to settle the Room_Folio via online payment through the Payment_Gateway or mark it as settled by cash
5. WHEN a Room_Booking is cancelled, THE Hotel_System SHALL allow the admin role to initiate a refund through the Payment_Gateway for any amount already paid
6. THE Hotel_System SHALL log every payment transaction with amount, payment method, status, and timestamp, accessible to the owner and admin roles from the Admin_Dashboard

### Requirement 30: Housekeeping Workflow

**User Story:** As hotel management, I want housekeeping tasks to be automatically created at checkout and tracked to completion, so that rooms are turned over efficiently.

#### Acceptance Criteria

1. WHEN a guest checks out, THE Hotel_System SHALL automatically create a housekeeping Staff_Task for that room with the checkout timestamp
2. THE Hotel_System SHALL display a queue of rooms pending housekeeping to housekeeping staff, sorted by checkout time in ascending order
3. WHEN housekeeping staff mark a room's task as "cleaned", THE Hotel_System SHALL update the Room_Status from Cleaning to Available
4. THE Hotel_System SHALL allow users with the manager or admin role to manually assign a specific housekeeping staff member to a specific room's cleaning task
5. THE Admin_Dashboard SHALL display the count of rooms currently pending cleaning in real time

### Requirement 31: Maintenance Request Management

**User Story:** As a hotel guest or staff member, I want to submit and track maintenance requests, so that issues are resolved promptly and transparently.

#### Acceptance Criteria

1. THE Hotel_System SHALL allow guests to submit maintenance requests from the guest portal with a description and category (e.g. AC, plumbing, electrical)
2. THE Hotel_System SHALL allow staff to submit maintenance requests on behalf of guests or for common areas, specifying the location and description
3. WHEN a maintenance request is submitted, THE Hotel_System SHALL allow users with the manager or admin role to assign it to a maintenance staff member
4. THE Hotel_System SHALL allow maintenance staff to update the status of an assigned request through the sequence: acknowledged → in progress → resolved
5. WHEN a maintenance request is marked "resolved" and is linked to a guest, THE Hotel_System SHALL notify that guest via the guest portal and WhatsApp
6. THE Admin_Dashboard SHALL display all open maintenance requests with their age in hours, assigned staff member, and priority level

### Requirement 32: Staff Payroll and Salary Management

**User Story:** As a hotel owner, I want the system to calculate monthly payroll from attendance records and generate payslips, so that salary processing is accurate and auditable.

#### Acceptance Criteria

1. THE Hotel_System SHALL store each staff member's salary details including monthly salary or daily rate, configured by the admin role
2. WHEN the end of a calendar month is reached, THE Hotel_System SHALL calculate the payable salary for each staff member based on attendance records including days present, approved leaves, and overtime hours
3. THE Hotel_System SHALL allow users with the manager or admin role to review and approve the monthly payroll before it is finalized
4. WHEN a payroll is finalized, THE Hotel_System SHALL generate a payslip for each staff member showing gross earnings, deductions, and net pay
5. THE Admin_Dashboard SHALL display the total monthly payroll cost and a per-staff breakdown for the selected month
6. THE Hotel_System SHALL retain payroll records for a minimum of 24 months and allow the owner and admin roles to access historical payroll data

### Requirement 33: Multi-Language Support

**User Story:** As a hotel guest, I want to use the guest portal in my preferred language, so that I can navigate food ordering and service requests comfortably.

#### Acceptance Criteria

1. THE Hotel_System SHALL support multiple languages on the guest portal covering food ordering, service requests, and room booking interfaces
2. THE Hotel_System SHALL allow the admin role to configure which languages are available to guests
3. WHEN a guest selects a language from the guest portal interface, THE Hotel_System SHALL display all guest-facing content in the selected language for the remainder of the session
4. THE Hotel_System SHALL allow staff to provide translated names and descriptions for food items and service labels for each configured language
5. IF a guest has not selected a language preference, THEN THE Hotel_System SHALL default to English for all guest-facing content

### Requirement 34: In-App Guest Messaging

**User Story:** As a hotel guest, I want to send messages to reception from the guest portal, so that I can communicate with staff without making a phone call.

#### Acceptance Criteria

1. THE Hotel_System SHALL provide a messaging interface on the guest portal allowing guests to send text messages to reception
2. THE Hotel_System SHALL provide a unified inbox on the staff portal where reception staff can view all incoming guest messages across all rooms
3. THE Hotel_System SHALL allow reception staff to reply to guest messages from the staff portal inbox
4. WHEN a guest sends a message that has not been read by any reception staff member, THE Hotel_System SHALL display an unread message notification on the staff dashboard
5. THE Hotel_System SHALL store the complete message history per guest stay and make it accessible to the admin and owner roles from the Admin_Dashboard

### Requirement 35: Amenity Booking

**User Story:** As a hotel guest, I want to browse and book hotel amenities like the spa or gym from the guest portal, so that I can plan my stay activities in advance.

#### Acceptance Criteria

1. THE Hotel_System SHALL allow the admin role to configure bookable Amenities with name, description, time slots, capacity per slot, and optional price
2. WHEN a guest browses amenities on the guest portal, THE Hotel_System SHALL display only time slots with remaining capacity greater than zero
3. WHEN a guest books an Amenity time slot, THE Hotel_System SHALL deduct one unit from the available capacity for that slot and confirm the booking to the guest
4. WHEN an Amenity booking is confirmed and the Amenity has a configured price, THE Hotel_System SHALL automatically add the charge to the guest's Room_Folio
5. THE Hotel_System SHALL display all Amenity bookings for the current day to staff on the staff dashboard, grouped by Amenity and time slot
6. THE Hotel_System SHALL allow the admin role to add, edit, or remove Amenities and update their pricing and slot availability at any time

### Requirement 36: Minibar and In-Room Consumption Tracking

**User Story:** As hotel staff, I want to log items consumed from a guest's minibar so that charges are automatically added to their folio.

#### Acceptance Criteria

1. THE Hotel_System SHALL allow authorized staff to log Minibar_Charge entries specifying the guest room, item consumed, and quantity
2. THE Hotel_System SHALL maintain a configurable list of minibar and in-room consumable items with a price per unit, manageable by the admin role
3. WHEN a Minibar_Charge entry is submitted, THE Hotel_System SHALL automatically calculate the charge and add it to the corresponding guest's Room_Folio
4. THE Hotel_System SHALL allow the admin role to add, edit, or remove minibar items and update their prices
5. WHEN a guest views their Room_Folio from the guest portal, THE Hotel_System SHALL display all Minibar_Charge entries with item name, quantity, and amount

### Requirement 37: Loyalty and Repeat Guest Tracking

**User Story:** As hotel management, I want the system to recognize returning guests and track their visit history, so that we can provide personalized service and reward loyalty.

#### Acceptance Criteria

1. WHEN a new Room_Booking is created, THE Hotel_System SHALL check whether the guest's phone number matches an existing Customer_Profile and link the booking to that profile if a match is found
2. THE Hotel_System SHALL maintain a visit history per guest showing all past stays, total nights stayed, and total spend across all visits
3. THE Hotel_System SHALL allow the admin role to assign a Loyalty_Tier (e.g. Silver, Gold, Platinum) to a guest based on visit count or total spend
4. WHEN a returning guest checks in and has an assigned Loyalty_Tier, THE Hotel_System SHALL display the guest's Loyalty_Tier and visit history summary to the checking-in staff member on the staff portal
5. THE Admin_Dashboard SHALL display a top guests report ranked by total spend and visit frequency, filterable by date range

### Requirement 38: Seasonal Pricing and Rate Management

**User Story:** As a hotel owner, I want to configure multiple rate plans for different seasons and days of the week, so that room pricing adjusts automatically based on demand.

#### Acceptance Criteria

1. THE Hotel_System SHALL allow the admin role to create Rate_Plans with a name, date range, days-of-week applicability, and price per night per room type
2. WHEN a guest searches for room availability on the direct booking engine or guest portal, THE Hotel_System SHALL apply the Rate_Plan whose date range and days-of-week configuration matches the selected check-in date
3. WHEN room availability is synchronized with OTA_Platforms, THE Hotel_System SHALL use the active Rate_Plan price for the corresponding dates
4. THE Admin_Dashboard SHALL display a pricing calendar showing which Rate_Plan is active on each date for each room type
5. IF no Rate_Plan is configured for a given date, THEN THE Hotel_System SHALL apply the default base room price for that room type

### Requirement 39: Lost and Found Management

**User Story:** As hotel staff and guests, I want to log and track lost and found items, so that guests can recover their belongings efficiently.

#### Acceptance Criteria

1. THE Hotel_System SHALL allow staff to log found Lost_Found_Items with a description, location found, date, and optional photo attachment
2. THE Hotel_System SHALL display all logged Lost_Found_Items to admin and manager roles on the staff portal, filterable by status (found, claimed, archived)
3. THE Hotel_System SHALL allow guests to report a lost item from the guest portal with a description and date of loss
4. WHEN a staff member matches a guest's reported lost item to a logged found Lost_Found_Item, THE Hotel_System SHALL notify the guest via the guest portal and WhatsApp with the item details
5. WHEN a Lost_Found_Item case is resolved, THE Hotel_System SHALL archive the case with resolution notes and the resolving staff member's name

### Requirement 40: GST and Tax Compliance (India)

**User Story:** As a hotel owner, I want every invoice to include a correct GST breakdown and support tax filing reports, so that the hotel remains compliant with Indian tax regulations.

#### Acceptance Criteria

1. WHEN a final invoice is generated, THE Hotel_System SHALL include a GST breakdown showing CGST and SGST amounts for intra-state transactions, or IGST for inter-state transactions
2. THE Hotel_System SHALL apply the following tax rates by category: Room charges at 12% or 18% based on the applicable tariff slab, Food items at 5% or 18%, and Services at 18%
3. THE Hotel_System SHALL allow the admin role to assign a configurable HSN_SAC_Code to each Food_Item and service type
4. THE Hotel_System SHALL store the hotel's GSTIN and display it on all generated invoices and Room_Folios
5. WHEN the admin requests a GST_Report, THE Hotel_System SHALL generate a GSTR-1 report of outward supplies and a GSTR-3B summary report for the selected date range
6. THE Hotel_System SHALL allow the admin role to store a Supplier's GSTIN and flag individual procurement entries as subject to the reverse charge mechanism
7. WHEN an Order or service charge is added to a Room_Folio, THE Hotel_System SHALL automatically calculate the applicable GST amount and display it as a separate line item
8. WHEN the admin role updates a tax rate for a category, THE Hotel_System SHALL apply the updated rate only to new transactions created after the change

### Requirement 41: Accounting System

**User Story:** As a hotel owner, I want a double-entry ledger and financial statements, so that I have accurate accounting records and can export data to external accounting tools.

#### Acceptance Criteria

1. WHEN a financial transaction is recorded, THE Hotel_System SHALL create a corresponding Ledger_Entry with both a debit and a credit line, maintaining double-entry accounting integrity
2. WHEN the admin requests a Profit and Loss statement, THE Hotel_System SHALL generate a P&L report for the selected date range showing total revenue and total expenses
3. WHEN the admin requests a balance sheet, THE Hotel_System SHALL display assets, liabilities, and equity values as of the selected date
4. THE Hotel_System SHALL record all payment inflows with timestamps and all procurement and payroll outflows with timestamps to support cash flow tracking
5. THE Hotel_System SHALL allow the admin role to export accounting data in Tally-compatible XML or CSV format and in Zoho Books-compatible CSV format
6. THE Admin_Dashboard SHALL display a chart of accounts allowing the admin role to drill down into individual Ledger_Entry records for any account
7. WHEN a Ledger_Entry is finalized, THE Hotel_System SHALL make it immutable; corrections SHALL be applied only through reversal Ledger_Entries

### Requirement 42: Guest Check-in KYC and Legal Compliance

**User Story:** As hotel management, I want to collect and store government-issued ID documents at check-in and generate required legal forms, so that the hotel meets Indian regulatory requirements.

#### Acceptance Criteria

1. WHEN a guest checks in, THE Hotel_System SHALL require collection of a government-issued ID for each guest, accepting Aadhaar, passport, or driving license
2. THE Hotel_System SHALL support upload of ID document scans in JPEG, PNG, or PDF format with a maximum file size of 10 MB per document
3. WHEN a guest checks in, THE Hotel_System SHALL generate a digital Registration_Card containing the guest's name, address, ID number, nationality, check-in date, check-out date, and room number
4. WHEN a guest's nationality field indicates a foreign national, THE Hotel_System SHALL automatically flag the guest and prompt staff to complete a C_Form
5. WHEN staff complete a C_Form for a foreign guest, THE Hotel_System SHALL record the guest's name, nationality, passport number, visa details, arrival date, and purpose of visit
6. THE Hotel_System SHALL restrict access to stored KYC documents to users with the admin or manager role
7. THE Hotel_System SHALL allow the admin role to bulk export Registration_Cards and C_Forms for a selected date range for submission to authorities

### Requirement 43: Kitchen Display System (KDS)

**User Story:** As kitchen staff, I want a dedicated real-time display showing incoming orders routed to my station, so that I can prepare and dispatch orders efficiently without missing deadlines.

#### Acceptance Criteria

1. THE Hotel_System SHALL provide a KDS screen for kitchen staff that displays incoming Orders in real time without requiring a page refresh
2. WHEN Orders are displayed on the KDS, THE Hotel_System SHALL group them by room number and delivery time, sorted by earliest delivery time first
3. THE Hotel_System SHALL display the following information for each Order on the KDS: room number, items with quantities, special notes, time elapsed since the order was placed, and a countdown timer to the delivery deadline
4. THE Hotel_System SHALL route drink and beverage items to the Bar KDS_Station and food items to the Kitchen KDS_Station, with each station displaying only its relevant items
5. WHEN an Order's delivery deadline is within the configurable threshold (default 5 minutes), THE Hotel_System SHALL highlight that Order on the KDS with a visual delay alert
6. WHEN kitchen staff mark all items in an Order as ready on the KDS, THE Hotel_System SHALL automatically advance the Order status to "out for delivery"
7. WHILE the KDS device experiences a brief network interruption, THE Hotel_System SHALL maintain the current order queue using a local cache so that the KDS remains functional

### Requirement 44: Multi-Property Support

**User Story:** As a hotel owner managing multiple properties, I want to manage all locations from a single account with aggregated reporting, so that I can oversee operations across my entire portfolio.

#### Acceptance Criteria

1. THE Hotel_System SHALL allow a single owner account to manage multiple Properties, each with its own isolated rooms, bookings, staff, inventory, menu, and configuration
2. WHEN an owner is logged in, THE Hotel_System SHALL provide a central dashboard displaying aggregated metrics across all Properties: total revenue, total occupancy, total active Orders, and total pending maintenance requests
3. THE Hotel_System SHALL allow the owner to switch between Properties from the central dashboard without logging out
4. THE Hotel_System SHALL scope staff accounts to a single Property by default; the admin role SHALL be able to grant a staff member access to multiple Properties under the same owner account
5. THE Hotel_System SHALL allow Suppliers to be optionally shared across all Properties under the same owner account
6. WHEN the admin requests a report, THE Hotel_System SHALL allow selection of a single Property or aggregation across all Properties owned by the same account
7. WHEN a Property is configured, THE Hotel_System SHALL store a separate GSTIN and branding configuration for that Property and use them on all invoices and guest-facing interfaces for that Property
