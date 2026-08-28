# Vehicle Tracking Product Requirements

**Status:** APPROVED  
**Version:** 1.0  
**Approved Date:** 2026-08-28  
**Product Name:** TBD  
**Temporary Working Name:** EasyTracker  
**Project:** Vehicle Tracking Standalone Launch  
**Development Branch:** `vehicle-tracking-launch-v1`  
**Protected Pre-Refactor Baseline:** `9df8a3f`  
**Documentation Authority Checkpoint:** `f6cf6df`  
**Approved Reconciliation Audit:** `a50486b` / Vehicle Tracking Requirement Reconciliation Audit v1.0  
**Approval Basis:** Independent senior review passed with zero critical findings.  
**Authority Status:** AUTHORITATIVE PRODUCT REQUIREMENTS BASELINE  
**Purpose:** Define the complete launch-ready business, functional, security, integration, AI, operational, customer, fleet and non-functional requirements for the standalone Vehicle Tracking product while preserving clean future integration into the main Agency multi-business SaaS platform.

---

## 1. DOCUMENT CONTROL

| Property | Specification |
| :--- | :--- |
| **Document Title** | Vehicle Tracking Product Requirements Document (PRD) |
| **Document Identifier** | `docs/03_specs/PRODUCT_REQUIREMENTS.md` |
| **Version** | `1.0` |
| **Status** | APPROVED |
| **Approved Date** | `2026-08-28` |
| **Product Brand** | TBD (Temporary Working Name: EasyTracker) |
| **Project Context** | Standalone Vehicle Tracking Launch (with future Agency SaaS vertical alignment) |
| **Active Development Branch** | `vehicle-tracking-launch-v1` |
| **Baseline Protected Tag** | `pre-refactor-migrated-baseline-2026-08-28` (Commit `9df8a3f`) |
| **Documentation Authority Checkpoint**| Commit `f6cf6df` |
| **Approved Reconciliation Audit**| `a50486b` / Vehicle Tracking Requirement Reconciliation Audit v1.0 |
| **Approval Basis** | Independent senior review passed with zero critical findings. |
| **Authority Status** | AUTHORITATIVE PRODUCT REQUIREMENTS BASELINE |
| **Authority Precedence Index** | `docs/DOCUMENT_AUTHORITY_INDEX.md` |

---

## 2. AUTHORITY & SOURCE BASIS

- **PRD-GEN-001 (Authority Precedence):** The requirements in this document SHALL be governed strictly by the authority order defined in `docs/DOCUMENT_AUTHORITY_INDEX.md` and the approved reconciliation audit `docs/02_audit/VEHICLE_TRACKING_REQUIREMENT_RECONCILIATION_AUDIT_V0_1.md`:
  1. Latest explicit user-approved requirements in the reconciliation audit and V0.4.
  2. Approved Vehicle Tracking Requirement Reconciliation Audit v1.0 (`docs/02_audit/`).
  3. Vehicle Tracking Launch Working Baseline V0.4 (`docs/01_working_requirements/`).
  4. Legacy `PRODUCT_MASTER_INSTRUCTION.md` (`docs/00_current_authority/`).
  5. Legacy `PRODUCT_REQUIREMENTS_DOCUMENT.md` (`docs/00_current_authority/`).
  6. Existing codebase implementation in `src/`, `server/`, `android/`, and `database_scripts/` (Implementation evidence only; NEVER authority over approved requirements).
  7. Recommendations only where no upstream authority decides.
- **PRD-GEN-002 (Preserved Audit Classifications):** All requirement classifications (PRESERVE, SUPERSEDED, EXPANDED, SECURITY_CORRECTION_REQUIRED, LEGAL_REGULATORY_VERIFICATION_REQUIRED, IMPLEMENTATION_ONLY_LEGACY_BEHAVIOR) approved in commit `a50486b` MUST control the functional scope of this PRD without reintroducing rejected or unverified assumptions.

---

## 3. EXECUTIVE SUMMARY

- **PRD-GEN-003 (Executive Overview):** The Vehicle Tracking product MUST provide a comprehensive, multi-tenant telematics, security, fleet management, and operational ERP platform tailored for individual vehicle owners, commercial transport fleets, corporate fleets, and B2B GPS tracking companies in Bangladesh and international emerging markets.
- **PRD-GEN-004 (Modular Telematics Platform):** The platform MUST decouple live telemetry ingestion, media storage, operational ERP, customer acquisition, and specialized fleet packs, allowing modular service delivery across diverse hardware devices and third-party tracking providers.

---

## 4. PRODUCT IDENTITY

- **PRD-ID-001 (Temporary Brand Name):** The working name "EasyTracker" MUST be treated strictly as a temporary development identifier.
- **PRD-ID-002 (Configurable Commercial Brand):** The final commercial product name remains `TBD` and the application architecture MUST support complete white-label brand configuration (application title, logos, themes, domain names, and notification sender IDs) without code refactoring.

---

## 5. PRODUCT VISION

- **PRD-VIS-001 (Core Vision Statement):** To deliver an intuitive, safety-critical, enterprise-grade vehicle intelligence and IoT tracking ecosystem that empowers individual owners with peace-of-mind security and equips commercial fleet operators with real-time operational control, cost optimization, and compliance management.
- **PRD-VIS-002 (AI-Assisted Operational Intelligence):** To blend deterministic, reliable core tracking with privacy-safe, provider-abstracted AI assistance to simplify diagnostics, maintenance planning, customer onboarding, and fleet intelligence.

---

## 6. GOALS

- **PRD-GOL-001 (Fast Standalone Market Entry):** Enable rapid standalone commercial launch of the Vehicle Tracking vertical without waiting for the completion of the broader Agency SaaS suite.
- **PRD-GOL-002 (Multi-Provider Telematics Ingest):** Ingest telematics data via push webhooks and pull APIs from licensed 3rd-party VTS providers at launch, while maintaining native readiness for self-hosted Traccar clusters.
- **PRD-GOL-003 (Deterministic Safety & Command Control):** Provide reliable, multi-stage, safety-governed remote vehicle commands (including engine immobilization and GPS wakeup) with verifiable device acknowledgements.
- **PRD-GOL-004 (Modular Fleet & B2B Enablement):** Support specialized vertical packs (Public Transport, Cargo, Courier) and modular B2B service subscriptions (own devices, own SIMs, own tracking servers, or SaaS-managed operations).
- **PRD-GOL-005 (Comprehensive Registries):** Provide authoritative, registry-driven resolution of device capabilities, vehicle specifications, and regulatory compliance rules without guessing.
- **PRD-GOL-006 (Bilingual Customer Experience):** Deliver first-class Bangla and English user experiences designed for non-technical users and vehicle owners.

---

## 7. NON-GOALS

- **PRD-NGOL-001 (No Low-Level Protocol Manual):** This document SHALL NOT serve as a low-level binary protocol parser manual or hardware firmware specification.
- **PRD-NGOL-002 (No Hardcoded Single-Provider Dependency):** The product SHALL NOT be tightly coupled to a single specific tracking server or single telecom operator.
- **PRD-NGOL-003 (No Replacement for Legal Verification):** This document SHALL NOT resolve statutory legal questions (such as court admissibility of video or BRTA IS API availability) without official government confirmation.
- **PRD-NGOL-004 (No Immediate Upstream SaaS Refactor):** This document SHALL NOT alter the upstream architecture or codebase of external Agency SaaS modules prior to planned integration milestones.

---

## 8. LAUNCH STRATEGY

- **PRD-LCH-001 (Standalone Launch Execution):** The product MUST launch as an independent, fully operational vertical application with dedicated authentication, telemetry ingestion, billing, store, and fleet management workflows.
- **PRD-LCH-002 (Clean Domain Boundaries):** The standalone product MUST enforce clean modular domain boundaries (Identity, Billing, Telematics, ERP, CRM) that prevent monolithic coupling and allow seamless migration to shared platform engines.
- **PRD-LCH-003 (Zero Tenant Code Forks):** The product MUST serve all customer types, tenant variations, and B2B branding configurations through a single multi-tenant codebase without creating customer-specific code forks.

---

## 9. FUTURE MAIN SAAS INTEGRATION

- **PRD-INT-001 (Architecture Alignment Principle):** The platform MUST adhere to the governing architecture principle: *“Build for current launch, design the domain boundaries for future scale and platform integration.”*
- **PRD-INT-002 (Shared Engine Mapping):** The standalone product domains MUST map cleanly to future shared Agency SaaS engines:
  - Device & SIM Operations ➔ Shared Asset & Inventory Management.
  - Customer Store & Referrals ➔ Shared CRM & Growth Engine.
  - Installation & Maintenance ➔ Shared Field Service & Technician Dispatch.
  - Billing & Invoicing ➔ Shared Core Financial Ledger.
  - Notifications & Alerts ➔ Shared Omni-channel Communication Gateway.
  - Courier / Delivery Pack ➔ Shared Delivery & Field Mobility Engine.
- **PRD-INT-003 (Modular Registration):** Future integration into the main Agency SaaS platform SHOULD occur via modular vertical registration without requiring a ground-up application rewrite.

---

## 10. PRODUCT PRINCIPLES

- **PRD-PRN-001 (Deterministic Core Authority):** Core safety, tracking, command authorization, role enforcement, and emergency alerting MUST operate deterministically on verified data without depending on cloud AI inference.
- **PRD-PRN-002 (AI Assistance Boundary):** External AI MUST assist in data extraction, anomaly explanation, and workflow recommendations, but deterministic business rules and authorized human operators MUST decide.
- **PRD-PRN-003 (Fail-Closed Security):** Every unauthorized access attempt, invalid permission, broken session, or unverified command MUST fail closed (deny access).
- **PRD-PRN-004 (Zero Cross-Tenant Leakage):** Tenant data boundaries MUST be absolute; empty datasets MUST display clean empty states and NEVER fall back to mock data or other tenants' records.

---

## 11. CUSTOMER TYPES

- **PRD-CUST-001 (Individual Vehicle Owner):** The system MUST support individual owners managing 1 to 3 personal vehicles (motorcycle, car, CNG, pickup) with simple mobile tracking, anti-theft controls, and maintenance reminders.
- **PRD-CUST-002 (Multi-Vehicle Owner):** The system MUST support individual or small-business owners managing 4 to 20 vehicles with unified group maps, aggregated alerts, and multi-vehicle status overviews.
- **PRD-CUST-003 (Commercial Fleet Customer):** The system MUST support enterprise fleet operators managing mixed fleets with driver assignments, trip logs, fuel monitoring, maintenance scheduling, and geofence tracking.
- **PRD-CUST-004 (Public Transportation Operator):** The system MUST support bus/transit companies with counter dispatch, route scheduling, gatepass clearance, onboard passenger counting, and digital driver cockpits.
- **PRD-CUST-005 (Cargo & Logistics Operator):** The system MUST support long-haul cargo and freight fleets with waypoint tracking, trip milestones, delivery exception logging, and driver duty management.
- **PRD-CUST-006 (Courier & Delivery Operator):** The system MUST support last-mile delivery fleets with rider tracking, route compliance, delivery task linking, and cash-on-delivery tracking readiness.
- **PRD-CUST-007 (Corporate Fleet):** The system MUST support corporate pool vehicle operations with department allocation, vehicle booking, mileage tracking, and authorized driver whitelists.
- **PRD-CUST-008 (B2B GPS / VTS Company):** The system MUST support independent GPS tracking companies operating under their own brand, managing their own customer accounts, pricing slabs, device inventory, and telemetry providers.
- **PRD-CUST-009 (Dealer & Channel Partner):** The system MAY support authorized sales dealers and installation partners with sales attribution, stock allocation, and installation commission tracking where enabled by tenant policy.

---

## 12. TENANT / B2B MODEL

- **PRD-TEN-001 (Multi-Tenant Isolation):** The platform MUST enforce strict server-side multi-tenancy where all customer, vehicle, device, and telemetry data are scoped by an immutable `tenant_id`.
- **PRD-TEN-002 (Modular B2B Service Combinations):** B2B GPS/VTS tenants MAY independently configure their operational model by choosing any combination of:
  - *Own Hardware Inventory* OR *SaaS-Supplied Hardware*.
  - *Own Telecom M2M SIMs* OR *SaaS-Managed SIMs*.
  - *Own Dedicated Tracking Server / Traccar Node* OR *SaaS-Managed Tracking Ingestion*.
  - *Own Sales Team* OR *SaaS Sales Channel*.
  - *Own Support & Helpdesk Team* OR *SaaS-Managed Tier-1 Support*.
  - *Own Emergency Rescue Field Team* OR *SaaS Rescue Dispatch Network*.
- **PRD-TEN-003 (Tenant Service Entitlement):** A tenant's accessible modules, feature limits, and active packages MUST be dynamically governed by server-side tenant entitlement records.

---

## 13. COMMERCIAL MODEL

- **PRD-COM-001 (Flexible Subscription Packages):** The platform MUST support configurable subscription tiers (e.g. Basic Tracking, Advanced Security, Enterprise Fleet, Specialized Packs) with customizable billing cycles (monthly, quarterly, annual, lifetime hardware).
- **PRD-COM-002 (Custom Billing Slabs & Rate Cards):** B2B tenants MUST be able to define custom retail rate cards, wholesale margins, add-on feature pricing, and customer billing rules.
- **PRD-COM-003 (Payment Gateway Abstraction):** The commercial engine SHOULD support integration candidate gateways in Bangladesh (bKash, Nagad, SSLCommerz, Bank Transfer, Cash-on-Delivery) via a unified payment abstraction layer.

---

## 14. SALES

- **PRD-SLS-001 (Direct Store & Lead Ingestion):** The platform MUST support self-service customer purchase funnels, sales staff lead entries, B2B wholesale orders, and dealer consignment requests.
- **PRD-SLS-002 (Sales Role Location Restriction):** Sales staff and sales managers SHALL NOT receive live vehicle tracking access merely by virtue of selling a device or package. Sales access MUST be restricted to customer CRM, order status, commission ledgers, and billing information.

---

## 15. REFERRAL

- **PRD-REF-001 (Refer-and-Earn Engine):** The system MUST provide an automated customer referral engine allowing registered vehicle owners to generate unique referral codes and deep-links.
- **PRD-REF-002 (Multi-Channel Sharing):** The referral engine SHOULD support 1-click sharing via SMS, WhatsApp, social platforms, and QR code scanning.
- **PRD-REF-003 (Qualification & Anti-Fraud Rules):** Referral rewards MUST be credited only after verified trigger events (e.g. successful device installation, payment verification, and active subscription threshold) with automated anti-fraud checks preventing self-referral and artificial device churn.
- **PRD-REF-004 (Strict Financial Ledger Separation):** The platform MUST maintain three strictly independent, auditable financial ledgers:
  1. *Customer Referral Reward / Cashback Ledger*.
  2. *Internal Sales Staff Commission Ledger*.
  3. *B2B Dealer / Channel Partner Margin Ledger*.

---

## 16. CUSTOMER PURCHASE JOURNEY

- **PRD-PUR-001 (End-to-End Onboarding Funnel):** The platform MUST support a frictionless customer onboarding journey:
  `App Install / Web Visit` ➔ `Explore Interactive Demo` ➔ `Select Vehicle Model` ➔ `Select Compatible Device & Accessories` ➔ `Select Subscription Package & SIM Option` ➔ `Apply Referral / Promo Code` ➔ `OTP / Account Verification` ➔ `Select Installation Method (Doorstep / Service Center)` ➔ `Enter Address / Select Center on Map` ➔ `Make Payment / Order Confirmation` ➔ `Installer Assignment` ➔ `Physical Installation & Device Test` ➔ `Authoritative Activation` ➔ `Instant Live Tracking Access`.
- **PRD-PUR-002 (Existing Customer Add-on Purchases):** Existing customers MUST be able to purchase additional vehicle trackers, subscription renewals, plan upgrades, replacement SIMs, accessory sensors, and maintenance service visits directly within their authenticated portal.

---

## 17. SUBSCRIPTION

- **PRD-SUB-001 (Subscription State Lifecycle):** The platform MUST manage subscription states: `TRIAL`, `ACTIVE`, `GRACE_PERIOD`, `SUSPENDED`, `EXPIRED`, and `CANCELLED`.
- **PRD-SUB-002 (Automated Renewal Reminders):** The system SHOULD issue multi-channel renewal reminders (in-app notifications, SMS, email) prior to expiration and automatically apply grace period rules before downgrading or suspending tracking service.

---

## 18. ENTITLEMENT

- **PRD-ENT-001 (Governing Entitlement Formula):** Every request to access a feature, view telemetry, or execute a device command MUST evaluate the governing availability formula:
  $$	ext{Feature Available} = 	ext{Platform Capability} \land 	ext{Tenant Entitlement} \land 	ext{Customer Subscription} \land 	ext{User Permission / Scope} \land 	ext{Device Capability} \land 	ext{Safety / Workflow Policy}$$
- **PRD-ENT-002 (Dynamic Feature Resolution):** If any term in the entitlement formula evaluates to false, the system MUST fail closed and gracefully hide or disable the corresponding UI controls with clear customer explanations.

---

## 19. USER ROLES

- **PRD-ROL-001 (Core Role Taxonomy):** The platform MUST support at minimum the following distinct user roles:
  - `SaaS / Platform Owner`: Global infrastructure, tenant provisioning, system audits.
  - `Platform Admin`: Platform-level operations, provider configs, regulatory registries.
  - `Tenant Admin`: Full administrative control over a specific tenant organization.
  - `Company Manager`: Fleet transit configuration, branch management, master routes.
  - `Fleet Manager`: Day-to-day fleet scheduling, vehicle assignments, driver oversight.
  - `Sales Staff / Manager`: Customer CRM, leads, orders, sales commission tracking.
  - `Customer Service Agent`: Ticket handling, basic diagnostics, customer onboarding.
  - `Technical Support Specialist`: In-depth device telemetry troubleshooting, protocol diagnostics.
  - `Technician / Installer`: Field installation verification, device mounting, sensor calibration.
  - `Rescue Dispatcher`: Emergency SOS routing, rescue mission coordination.
  - `Rescue Team Member`: Field assistance, roadside emergency response.
  - `Dealer / Channel Partner`: Consignment tracking, wholesale orders, dealer margin ledger.
  - `Customer / Vehicle Owner`: Personal/business vehicle monitoring, alerts, geofences.
  - `Driver`: Digital cockpit, assigned vehicle HUD, duty status, driver SOS.
  - `Counter Incharge`: Bus station departure approval, gatepass generation, ticket logs.
  - `Onboard Supervisor`: Bus passenger counter stepper, seat occupancy, boarding log.

---

## 20. AUTHORITY / PERMISSION / SCOPE PRINCIPLES

- **PRD-AUT-001 (Least Privilege Enforcement):** Users MUST receive the minimum permissions necessary to execute their operational duties.
- **PRD-AUT-002 (No Username Role Inference):** User roles and permissions MUST be loaded strictly from verified server-side claims and database access tokens; determining roles from username prefixes (e.g. `supervisor_`, `driver_`) is STRICTLY PROHIBITED.
- **PRD-AUT-003 (Hierarchical Scoping):** Permissions MAY be scoped by `tenant_id`, `branch_id`, `fleet_group_id`, `vehicle_id`, and `ticket_id` where applicable to the operational workflow.

---

## 21. TENANT ISOLATION

- **PRD-ISO-001 (Zero Data Bleed):** Tenant A MUST NEVER be able to query, view, modify, or receive telemetry belonging to Tenant B.
- **PRD-ISO-002 (Fail-Closed Empty States):** Queries returning no records for a tenant MUST render an intentional, professional empty state and MUST NEVER fall back to demo data, sample vehicles, or records from another tenant.

---

## 22. TRACKING PROVIDER MODEL

- **PRD-PRV-001 (Tracking Provider Control Plane):** The platform MUST provide a unified telematics abstraction layer (Tracking Provider Control Plane) that decouples front-end applications from underlying GPS server implementations.
- **PRD-PRV-002 (Multi-Provider Support):** The Control Plane MUST support concurrent operation of:
  - Licensed 3rd-Party VTS Push Webhooks (`POST /api/v1/telemetry/push`).
  - Licensed 3rd-Party VTS REST/JSON Pull Adapters.
  - Tenant-Owned Self-Hosted Traccar / GPS Servers.
  - Future SaaS-Managed High-Throughput Traccar Clusters.
- **PRD-PRV-003 (Granular Provider Assignment):** Tracking providers MUST be assignable at the Tenant level, Account level, Fleet Group level, or Individual Device level.
- **PRD-PRV-004 (Credential Isolation):** Tracking provider administrative credentials, Traccar master tokens, and backend API keys MUST remain in encrypted server-side vaults and MUST NEVER be exposed to browser or mobile clients.

---

## 23. TELEMETRY INGESTION

- **PRD-ING-001 (Standardized Ingestion Pipeline):** Ingested telematics packets MUST be parsed, validated, normalized into a unified telemetry schema, and routed to the real-time event pipeline and persistent storage.
- **PRD-ING-002 (Configurable Reporting Intervals):** Telemetry reporting intervals (e.g. periodic motion updates, heartbeat in static mode, emergency high-frequency reporting) MUST be configurable per device profile, tracking provider, and subscription policy.
- **PRD-ING-003 (Out-of-Order & Duplicate Handling):** The ingestion pipeline SHOULD handle packet deduplication and out-of-order timestamp re-sequencing based on hardware GPS timestamps.

---

## 24. LIVE TRACKING

- **PRD-TRK-001 (Real-Time Map Telemetry):** The live tracking interface MUST display vehicle location, smooth heading rotation, real-time speed, ignition status (ACC ON/OFF), motion state (Moving, Stopped, Idle), external power voltage, internal battery level, and GPS/GSM signal health.
- **PRD-TRK-002 (Provider-Agnostic Map UI):** The mapping interface MUST remain provider-abstracted, supporting OpenStreetMap, Mapbox, Google Maps, or specialized regional map tiles via standard mapping interfaces.

---

## 25. POSITION HISTORY

- **PRD-HST-001 (Historical Breadcrumb Logs):** The system MUST record chronological position points, speeds, headings, and sensor states for each vehicle according to tenant retention policies.
- **PRD-HST-002 (Configurable History Querying):** Authorized users MUST be able to query historical location trails by date, time range, and specific trip segments.

---

## 26. TRIPS

- **PRD-TRP-001 (Automated Trip Segmentation):** The platform MUST automatically segment continuous telemetry into discrete trips based on configurable ignition-off duration and stationary dwell thresholds.
- **PRD-TRP-002 (Trip Summary Metrics):** For each completed trip, the system MUST calculate start/end time, start/end address, total distance travelled, max speed, average speed, idle duration, and fuel consumption estimates where supported.
- **PRD-TRP-003 (Interactive Route Replay):** The UI MUST provide interactive trip playback with play, pause, seek, speed controls ($1	imes, 2	imes, 5	imes, 10	imes$), stop point inspection, and speed-graph overlay.

---

## 27. GEOFENCE

- **PRD-GEO-001 (Multi-Geometry Geofencing):** The system MUST support Circular, Polygonal, and Linear (Corridor/Route) geofences.
- **PRD-GEO-002 (Geofence Event Rules):** The system MUST trigger real-time alerts upon Entry, Exit, Dwell-time violation, and Route Deviation with configurable vehicle/fleet assignments.

---

## 28. ALERTS

- **PRD-ALT-001 (Comprehensive Alert Taxonomy):** The system MUST process and dispatch real-time alerts for:
  - Emergency SOS Button Triggers.
  - Crash / High-G Impact Detection.
  - Overspeed Threshold Violations.
  - Geofence Entry, Exit, and Route Deviation.
  - Unauthorized Ignition (ACC ON during armed hours).
  - Vibration / Towing / Motion while parked.
  - Main Power Disconnection / Battery Tamper.
  - Device Low Internal Battery.
  - Device Offline / Signal Loss.
  - Custom Sensor Alerts (Door Open, Temperature, Fuel Drop).
- **PRD-ALT-002 (Multi-Channel Dispatch):** Alerts SHOULD be dispatchable across In-App UI notifications, Audio sirens, Push Notifications, SMS, Email, and WhatsApp where integrated.

---

## 29. DEVICE KNOWLEDGE & CAPABILITY REGISTRY

- **PRD-DKR-001 (Authoritative Registry Architecture):** The system MUST maintain a centralized, authoritative Device Knowledge & Capability Registry storing verified hardware specifications:
  - Manufacturer, Model, Hardware Revision, Supported Protocols & Firmware Revisions.
  - Network Bands (2G, 4G LTE-Cat1, NB-IoT), GNSS Constellations, Supported APNs.
  - External Voltage Operating Range, Internal Battery Capacity, Sleep/Power Modes.
  - ACC Ignition Input, Digital Inputs/Outputs, Analog Inputs (Fuel, Temp).
  - Relay / Engine Cut Capability (Ground Cut, Power Cut, Pulse, Latched).
  - Built-in Sensors (Accelerometer, Gyroscope, Microphone, Speaker, Camera).
  - Voice Capabilities (`voice_call_monitoring`, `audio_recording`, `live_audio_stream`, `two_way_audio`).
  - Video Capabilities (Snapshot, Event Clip, Live RTSP/WebRTC Stream, Multi-Camera).
  - Standard Command Presets (Engine Cut, Restore, GPS Wakeup, Status Query, Reboot, APN Set).
- **PRD-DKR-002 (Prohibition of Manual Technical Guessing):** Technical capabilities MUST resolve deterministically from the verified registry profile; sales staff, operators, and AI models SHALL NOT manually guess or assign hardware capabilities.
- **PRD-DKR-003 (Unknown Device Handling):** Any device with an unrecognized model or firmware MUST be assigned an `UNKNOWN / UNVERIFIED` status, restricting its functionality to basic location reporting until verified by a technical administrator.

---

## 30. VEHICLE KNOWLEDGE REGISTRY

- **PRD-VKR-001 (Comprehensive Vehicle Database):** The platform MUST maintain an authoritative Vehicle Knowledge Registry covering:
  - Discontinued / Legacy Vehicles (e.g. older popular motorcycles, CNGs, vintage cars).
  - Current Market Vehicles.
  - Officially Announced / Upcoming Vehicles with confirmed manufacturer specifications.
- **PRD-VKR-002 (Vehicle Specification Data Model):** The registry MUST store structured technical specifications:
  - Make, Brand, Model, Generation, Trim/Variant, Model Years, Vehicle Category.
  - Engine Type, Fuel Type (Petrol, Octane, Diesel, CNG, Hybrid, EV), Engine Displacement.
  - Fuel Tank Capacity, Battery Voltage (12V / 24V / 48V / 72V) and Chemistry.
  - Recommended Engine Oil Grade (e.g. 10W-30, 20W-50) and Oil Sump Capacity.
  - Recommended Coolant Specification, Tyre Sizes (Front/Rear), Recommended Tyre Pressures (Unladen/Laden).
  - Standard Service & Maintenance Intervals (Oil Change, Spark Plug, Brake Pads, Filter).
  - Electrical Architecture and Recommended Tracker Installation Points / Wiring Guidelines.
- **PRD-VKR-003 (Authoritative Source & Verification):** Every vehicle specification MUST record its authoritative source and verification status; AI-predicted values SHALL NOT be marked as authoritative without manual verification.

---

## 31. VEHICLE ↔ DEVICE COMPATIBILITY

- **PRD-CMP-001 (Deterministic Compatibility Evaluation):** The platform MUST evaluate vehicle-to-device compatibility using the rule:
  $$	ext{Compatible} = 	ext{Vehicle Electrical/Voltage Compatibility} \land 	ext{Device Voltage Range} \land 	ext{Relay Match} \land 	ext{Sensor Requirements} \land 	ext{Subscription Policy}$$
- **PRD-CMP-002 (Store Compatibility Recommendations):** During the customer purchase journey, the system MUST recommend only verified compatible tracker models for the customer's selected vehicle make, model, and year.

---

## 32. DEVICE LIFECYCLE

- **PRD-DEV-001 (End-to-End Lifecycle Stages):** The platform MUST manage the complete device lifecycle states:
  `IN_SUPPLIER_BATCH` ➔ `IN_WAREHOUSE_STOCK` ➔ `ASSIGNED_TO_TECHNICIAN` ➔ `INSTALLED_IN_VEHICLE` ➔ `ACTIVE_TRACKING` ➔ `MAINTENANCE_RMA` ➔ `SCRAPPED_RETIRED`.
- **PRD-DEV-002 (Vehicle Replacement Mapping):** When replacing a faulty tracker under warranty/RMA, the system MUST automatically remap the new device IMEI to the vehicle while preserving the vehicle's historical trip and maintenance records.

---

## 33. DEVICE COMMANDS

- **PRD-CMD-001 (Supported Command Set):** For devices supporting corresponding hardware capabilities, the system MUST support execution of:
  - Engine Immobilization (Relay Cut).
  - Engine Restoration (Relay Restore).
  - Instant GPS Wakeup / Polling.
  - Hardware Status Query (Voltage, Battery, Satellites, GSM, APN).
  - Remote Device Reboot.
  - Server IP/Port and APN Configuration Updates.
  - USSD Balance / Data Query (where supported by device and telecom).
  - SOS Phone Number / Emergency Contact Whitelisting.
- **PRD-CMD-002 (Preset Validation):** Commands MUST be formatted strictly according to the verified protocol profile in the Device Knowledge Registry.

---

## 34. COMMAND LIFECYCLE

- **PRD-CMD-003 (Authoritative Command State Lifecycle):** Every transmitted command MUST be tracked through an immutable, multi-stage state machine:
  $$	ext{REQUESTED} \longrightarrow 	ext{AUTHORIZED} \longrightarrow 	ext{SENT} \longrightarrow egin{cases} 	ext{QUEUED} \longrightarrow 	ext{DELIVERED} \longrightarrow 	ext{DEVICE\_ACKNOWLEDGED} \ 	ext{FAILED} / 	ext{TIMEOUT} / 	ext{OFFLINE} / 	ext{UNSUPPORTED} / 	ext{REJECTED} \end{cases}$$
- **PRD-CMD-004 (Prohibition of False Success):** The UI MUST NEVER indicate that a physical command succeeded merely because it was sent to the server or network; only an authoritative `DEVICE_ACKNOWLEDGED` signal constitutes successful execution.

---

## 35. COMMAND SAFETY

- **PRD-SAF-001 (High-Risk Command Safety Guardrails):** High-risk commands (such as remote engine immobilization) MUST satisfy all of the following conditions before transmission:
  1. *Hardware Capability Verified*: Device supports safe relay control.
  2. *Tenant Entitlement & Subscription*: Tenant and user plan permit remote immobilization.
  3. *User Role & Scope*: User holds explicit command permission for the specific vehicle.
  4. *Safe-State Evaluation*: Speed and motion evaluation governed by configurable safety policy.
  5. *UI Confirmation & Intent Hold*: User must complete a deliberate hold-to-confirm action.
  6. *Step-Up Authentication*: User must enter an authorized master PIN or biometric verification.
  7. *Server-Side Authorization & Audit*: Server evaluates safety rules and records an immutable audit log.
- **PRD-SAF-002 (Configurable Speed & Motion Thresholds):** The exact speed threshold (e.g. stationary or speed $< V_{	ext{safe}}$) and motion conditions for engine cut MUST remain configurable by downstream safety policy and device capability.

---

## 36. SOS

- **PRD-SOS-001 (Emergency SOS Pipeline):** Upon receipt of an emergency SOS trigger (via physical panic button, driver cockpit trigger, or mobile app SOS), the system MUST:
  - Immediately elevate vehicle status to `EMERGENCY_SOS` with highest processing priority.
  - Trigger prominent visual alarms and audible siren tones on authorized dispatcher screens.
  - Dispatch real-time emergency push notifications and SMS alerts to whitelisted emergency contacts.
  - Switch device reporting to high-frequency emergency tracking mode where supported.
  - Open an auditable Emergency Rescue Incident record.

---

## 37. ACCIDENT / HIGH ALERT

- **PRD-ACC-001 (Crash & Impact Incident Processing):** Upon receipt of a crash packet, high-G impact alert, or rollover sensor trigger, the system MUST automatically record an accident event, capture pre/post telemetry snapshots, trigger emergency notifications, and preserve associated dashcam video clips where installed.

---

## 38. THEFT / SECURITY INCIDENTS

- **PRD-SEC-002 (Theft & Tamper Incident Workflow):** When unauthorized towing, power disconnection, or geofence escape occurs while a vehicle is armed, the system MUST initiate high-alert tracking, notify the owner, and present guided recovery workflows.

---

## 39. SUPPORT

- **PRD-SUP-001 (Default Diagnostic Access):** Support agents and helpdesk technicians MUST receive read-only diagnostic information by default (IMEI, device model, online status, battery voltage, signal strength, protocol errors, last heartbeat).
- **PRD-SUP-002 (Temporary Scoped Location Grants):** Support agents SHALL NOT have default access to live vehicle location maps. When live location is required to troubleshoot a customer issue:
  - Access MUST be tied to an active, valid support ticket.
  - Customer or Tenant Admin MUST grant explicit authorization.
  - Access MUST be time-limited and automatically expire upon ticket closure or timeout.
  - Access MUST record the operational reason and an immutable audit log.

---

## 40. RESCUE

- **PRD-RSC-001 (Incident-Scoped Rescue Access):** Emergency rescue dispatchers and field response members MUST receive access to a vehicle's live location, emergency diagnostics, and authorized rescue controls ONLY during an active, assigned rescue incident.
- **PRD-RSC-002 (Automatic Revocation upon Closure):** When the rescue incident is closed or resolved, all live tracking and media access for the rescue team MUST be automatically revoked.

---

## 41. FLEET CORE

- **PRD-FLT-001 (Fleet Hierarchy & Grouping):** The system MUST support multi-level fleet hierarchies: Organization ➔ Branch / Division ➔ Fleet Group ➔ Vehicle ➔ Assigned Driver.
- **PRD-FLT-002 (Driver Management & Duty Rosters):** The system MUST support driver profiles, license tracking, duty assignment rosters, RFID/iButton driver identification, and driving behavior scoring (harsh acceleration, harsh braking, harsh cornering, overspeeding).
- **PRD-FLT-003 (Vehicle Maintenance Schedules):** The system SHOULD track vehicle mileage and engine hours, generating automated maintenance alerts based on the Vehicle Knowledge Registry's recommended service intervals.

---

## 42. PUBLIC TRANSPORT

- **PRD-TRN-001 (Transit Stations, Routes & Fares):** The Public Transport pack MUST support station configuration, route mapping, stage-wise fare matrices, and scheduled bus dispatching.
- **PRD-TRN-002 (Station Counter Incharge Hub):** Counter incharges MUST be able to manage bus departure schedules, record passenger seat occupancy, issue verified gatepasses, and view real-time incoming bus ETAs.
- **PRD-TRN-003 (Onboard Supervisor Big-Touch Stepper):** Onboard bus conductors/supervisors MUST have access to an ergonomic, high-contrast mobile interface with large touch buttons (`➕ ১ জন উঠল` / `➖ ১ জন নামল`), real-time passenger capacity capping, and GPS-tagged boarding location logs.
- **PRD-TRN-004 (Driver Digital Cockpit):** Bus drivers MUST have a simplified digital cockpit HUD displaying current speed against route speed limits, upcoming station distances, schedule adherence, and a 2-way emergency SOS trigger.
- **PRD-TRN-005 (Secure Staff Onboarding):** Counter incharges and bus staff MUST be onboarded via secure server-side role invitations; plaintext password or PIN sharing via WhatsApp or clipboard is STRICTLY PROHIBITED.

---

## 43. CARGO / LOGISTICS

- **PRD-CRG-001 (Long-Haul Freight & Trip Milestones):** The Cargo pack MUST support long-haul trip dispatch, waypoint logging, delivery milestone tracking, e-lock / container sensor monitoring, and proof-of-delivery attachments.

---

## 44. COURIER / DELIVERY

- **PRD-DEL-001 (Last-Mile Mobility & Task Tracking):** The Courier pack MUST support delivery rider tracking, route adherence, cash-on-delivery (COD) collection tracking readiness, and delivery task status linking.

---

## 45. CORPORATE FLEET

- **PRD-COR-001 (Corporate Pool Vehicle Management):** The Corporate Fleet module MUST support internal vehicle booking requests, department cost-center allocation, authorized driver whitelisting, and personal vs. business trip classification.

---

## 46. SIM / M2M

- **PRD-SIM-001 (SIM / M2M Lifecycle ERP):** The system MUST manage telecom SIM cards: Operator, MSISDN, ICCID, IMSI, APN, Voice/Data capability, Monthly Data Plan, Activation Date, Expiry Date, Recharge History, and Assigned Device IMEI.
- **PRD-SIM-002 (Recharge Reminders & USSD Ingestion):** The system SHOULD track data usage and generate automated recharge reminders prior to SIM expiration; USSD balance queries MAY be supported where enabled by hardware and telecom APIs.

---

## 47. INVENTORY

- **PRD-INV-001 (Serialized Hardware Inventory ERP):** The system MUST track serialized hardware inventory with unique IMEI numbers, supplier batch records, purchase dates, warranty periods, warehouse locations, and stock allocation to field technicians.

---

## 48. SPARE PARTS

- **PRD-SPR-001 (Installation Consumables & Spare Parts):** The inventory module MUST track non-serialized installation accessories and spare parts (automotive relays, wiring harnesses, inline fuses, external GPS/GSM antennas, SOS buttons, temperature probes, and fuel sensors).

---

## 49. INSTALLATION

- **PRD-INS-001 (Installation Service Management):** The platform MUST support installation bookings (Doorstep Service or Authorized Service Center Network), automated technician dispatch based on geo-location and skill profile, pre-installation vehicle inspection checklists, device wiring verification, and activation testing.

---

## 50. SERVICE

- **PRD-SRV-001 (Field Service & Ticket Management):** Customers and fleet managers MUST be able to submit service requests (e.g. device relocation, wiring check, sensor recalibration) with ticket status tracking, technician assignment, and customer sign-off.

---

## 51. MAINTENANCE

- **PRD-MNT-001 (Preventive Maintenance Ledger):** The system MUST maintain vehicle maintenance ledgers tracking engine oil changes, tyre rotations, brake pad replacements, fitness renewals, tax token payments, and route permit validity.

---

## 52. WARRANTY

- **PRD-WAR-001 (Warranty Tracking & Verification):** The platform MUST track hardware warranty coverage periods from supplier purchase date and customer activation date, automatically validating warranty status during RMA and service requests.

---

## 53. RMA

- **PRD-RMA-001 (Return Merchandise Authorization Workflow):** The system MUST support serialized RMA workflows: `FAULT_REPORTED` ➔ `TECHNICIAN_INSPECTED` ➔ `RETURNED_TO_WAREHOUSE` ➔ `SUPPLIER_RMA_DISPATCHED` ➔ `REPAIRED / REPLACED` ➔ `RESTOCKED / SCRAPPED`.

---

## 54. VOICE

- **PRD-VOC-001 (Four Distinct Voice Capabilities):** The platform MUST model and manage four distinct voice capabilities:
  1. `voice_call_monitoring` (One-way silent audio call from authorized number to tracker microphone).
  2. `audio_recording` (Device records audio clips upon trigger events and uploads to media vault).
  3. `live_audio_stream` (Real-time live audio streaming over data channel).
  4. `two_way_audio` (Two-way intercom communication between vehicle cabin and dispatcher).
- **PRD-VOC-002 (Voice Entitlement & Legal Basis):** Voice features MUST be activated only when supported by hardware, allowed by tenant subscription, authorized by user role, and compliant with applicable privacy laws.

---

## 55. AUDIO

- **PRD-AUD-001 (Audible UI Alerts & Sirens):** The web and mobile applications MUST provide distinct, accessible audible alert patterns for counter dispatch events, incoming intercom calls, and emergency SOS alarms. Specific audio oscillator frequencies SHALL remain flexible UI/audio design details.

---

## 56. VIDEO

- **PRD-VID-001 (Capability-Driven Video Services):** For vehicles equipped with dashcams or MDVRs, the platform MUST support:
  - Live Video Streaming (RTSP / WebRTC / HLS).
  - High-Resolution Snapshot Capture on Demand.
  - Event / Crash Video Clips with configurable pre-buffer and post-buffer duration.
  - Historical Video Playback from device SD card / MDVR storage.
  - Multi-Camera Layouts (Road-facing, Driver-facing, Cabin, Rear, Cargo).

---

## 57. CAMERA

- **PRD-CAM-001 (Camera Health & Configuration):** The system SHOULD monitor camera online status, video signal loss, lens occlusion, and storage media health for connected camera peripherals.

---

## 58. MEDIA / EVIDENCE HANDLING

- **PRD-MED-001 (Autonomous Private Media Vault):** Video clips, cabin audio recordings, and incident snapshots MUST be uploaded directly into private, access-controlled S3-compatible object storage (e.g. Cloudflare R2, MinIO, AWS S3) decoupled from raw telemetry databases.
- **PRD-MED-002 (Cryptographic Integrity & Watermarking):** Media files MUST be sealed with SHA-256 cryptographic hashes upon ingestion and stamped with visible watermarks (Vehicle Plate, Timestamp, Speed, GPS Coordinates).
- **PRD-MED-003 (Controlled Evidence Export & Audit):** Exporting media for insurance or legal workflows MUST require explicit administrative authorization, generating an immutable chain-of-custody audit log.

---

## 59. REPORTS

- **PRD-REP-001 (Standardized Telematics & Business Reports):** The system MUST generate exportable (PDF, Excel, CSV) reports covering:
  - Daily Vehicle & Fleet Activity Summaries.
  - Trip & Mileage Logs with Route Maps.
  - Overspeed, Geofence, and Idle Exception Reports.
  - Fuel Consumption & Mileage Efficiency Reports.
  - Driver Behavior & Safety Scorecards.
  - Emergency SOS & Incident History.
  - Vehicle Maintenance & Service Cost Logs.
  - Sales Commission, Referral Rewards, and Dealer Margin Ledgers.

---

## 60. ANALYTICS

- **PRD-ANL-001 (Fleet & Operational Dashboards):** The platform MUST provide interactive visual dashboards displaying fleet utilization rates, active vs. offline vehicle counts, aggregate mileage, fuel spend trends, and top safety alert hotspots.

---

## 61. MOBILE APPLICATION

- **PRD-MOB-001 (Native & Hybrid Mobile Readiness):** The platform MUST provide responsive, high-performance mobile applications (Android and iOS) supporting vehicle owners, drivers, supervisors, technicians, and rescue members with native push notifications, biometric login, and background location awareness where authorized.

---

## 62. WEB APPLICATION

- **PRD-WEB-001 (Enterprise Responsive Web Portal):** The web application MUST provide an information-dense, highly responsive, professional desktop portal optimized for fleet dispatchers, company managers, and tenant administrators.
- **PRD-WEB-002 (UI Layout Integrity):** The web application MUST adhere to the principle of zero accidental blank space (no broken layouts, dead routes, unfinished panels, or missing state handlers) while maintaining intentional, professional whitespace for readability.

---

## 63. FULL CUSTOMER DEMO

- **PRD-DMO-001 (Interactive Product Demo Environment):** The platform MUST provide an integrated Web and Mobile demo environment allowing prospective customers to experience representative tracking scenarios:
  - Personal Vehicle Tracking (Motorcycle / Car).
  - Multi-Vehicle Commercial Fleet.
  - Public Transport Bus Route with Counter Dispatch.
  - Long-Haul Cargo & Logistics Trip.
  - B2B Tracking Company Tenant Portal.
- **PRD-DMO-002 (Strict Demo Isolation):** Demo data MUST be strictly simulated or replayed, clearly labeled as `DEMO / SIMULATED`, and completely isolated from production databases. Public demo mode SHALL NEVER control real customer vehicles and SHALL NEVER act as a silent fallback during live server outages.

---

## 64. BANGLA / ENGLISH LOCALIZATION

- **PRD-LOC-001 (First-Class Bilingual Architecture):** Bangla (বাংলা) and English MUST be supported as first-class languages throughout all web and mobile interfaces using an externalized localization resource architecture.
- **PRD-LOC-002 (Plain-Language Customer Terminology):** Customer-facing text MUST use clear, everyday language (e.g. `লাইভ অবস্থান`, `গাড়ি বন্ধ করুন`, `জরুরি এলার্ট`) avoiding confusing technical jargon.

---

## 65. UX / RESPONSIVE DESIGN

- **PRD-UX-001 (Responsive Multi-Device UX):** The UI MUST adapt fluidly across mobile screens (360px+), tablets, laptops, and large desktop multi-monitor dispatch setups with accessible color contrast and intuitive touch targets.

---

## 66. REGULATORY KNOWLEDGE SERVICE

- **PRD-REG-001 (Official Regulatory Tracking):** The platform MUST maintain a controlled Regulatory Knowledge Service tracking official circulars, vehicle standards, and licensing rules from:
  - Bangladesh Road Transport Authority (BRTA).
  - Bangladesh Telecommunication Regulatory Commission (BTRC).
  - Bangladesh Police & Highway Police.
  - Relevant Municipal & Traffic Authorities.
- **PRD-REG-002 (Human-Verified Rule Updates):** The regulatory service MUST follow the workflow:
  `Official Source Published` ➔ `Detect Change` ➔ `Preserve Source URL & Reference` ➔ `AI Extraction & Comparison` ➔ `Authorized Legal / Human Verification` ➔ `Formal Approval` ➔ `Effective-Date Rule Activation` ➔ `Admin Notification`.
  Unverified AI legal inferences SHALL NEVER automatically become active production rules.

---

## 67. INTEGRATION REGISTRY

- **PRD-ITG-001 (Lifecycle Status for External Integrations):** Every external integration (Telematics providers, Government gateways, Telecom M2M APIs, Payment gateways, AI engines) MUST be tracked in an Integration Registry with explicit lifecycle states:
  `PLANNED`, `DOCUMENTATION_PENDING`, `SANDBOX`, `APPROVED`, `ACTIVE`, `DEGRADED`, `SUSPENDED`, or `RETIRED`.
- **PRD-ITG-002 (Prohibition of Mock Endpoints as Proof):** Hardcoded prototype endpoints or mock URLs in legacy code SHALL NOT be treated as proof of live government or telecom integration availability.

---

## 68. GOVERNMENT / TELECOM INTEGRATION READINESS

- **PRD-GOV-001 (BRTA IS API Readiness):** The platform MUST maintain data model readiness for automated vehicle registration, fitness certificate, and tax token verification pending official BRTA IS API availability.
- **PRD-GOV-002 (Law Enforcement & 999 Police Gateway):** The platform MUST maintain secure integration readiness for lawful law enforcement queries and emergency 999 dispatch subject to formal government authorization.

---

## 69. APIs / WEBHOOK REQUIREMENTS

- **PRD-API-001 (REST & Webhook Telematics Gateway):** The platform MUST provide secure, authenticated REST APIs and signed Webhook endpoints (`POST /api/v1/telemetry/push`) with API key authentication, rate limiting, and replay protection.

---

## 70. AI / APPLICATION INTELLIGENCE

- **PRD-AI-001 (Deterministic Core vs. AI Assistance):** The platform MUST maintain strict separation between deterministic business logic and external AI services. Core tracking, safety rules, and permissions MUST NOT fail if external AI is unavailable.
- **PRD-AI-002 (Provider-Agnostic AI Orchestrator):** External AI MUST be abstracted through a multi-provider AI Orchestrator (with Google Gemini as an initial provider option).
- **PRD-AI-003 (Governing AI Intelligence Principle):** *“AI assists: find, extract, compare, explain, recommend and automate safe workflows. Verified data and deterministic policy decide.”*
- **PRD-AI-004 (Strict AI Data Privacy Boundaries):** Customer PII, live vehicle locations, historical coordinates, customer-linked IMEIs, cabin voice logs, dashcam videos, and credentials MUST NEVER be sent to free or unapproved public cloud AI models.

---

## 71. NOTIFICATIONS

- **PRD-NOT-001 (Omni-Channel Notification Engine):** The system MUST support template-driven notification dispatch across In-App, Mobile Push (FCM/APNS), SMS, Email, and WhatsApp channels, governed by tenant preferences, user notification settings, and alert severity.

---

## 72. BILLING / METERING

- **PRD-BIL-001 (Multi-Tier Usage & Subscription Billing):** The billing engine MUST support automated calculation of tenant platform fees, per-vehicle subscription fees, add-on storage/video fees, and installation charges with automated invoice generation.

---

## 73. PRIVACY

- **PRD-PRV-005 (Location Privacy & Consent Controls):** The platform MUST enforce location privacy policies, purpose limitation, sensitive media access controls, and transparent customer data export and account deletion mechanisms.

---

## 74. RETENTION

- **PRD-RET-001 (Configurable Retention Classes):** The system MUST support independent, configurable retention periods for:
  - Raw Telemetry Packets.
  - Normalized Position Coordinates & Trip Summaries.
  - Device Command & Execution History.
  - High-Alert Incidents & SOS Logs.
  - Support & Customer Service Records.
  - Emergency Rescue Mission Records.
  - Cabin Voice Recordings.
  - Dashcam Video Clips & Incident Snapshots.
  - System Security & Access Audit Logs.
- **PRD-RET-002 (Verification of Legal Retention Mandates):** Exact retention durations remain `TBD` subject to statutory legal and business verification.

---

## 75. SECURITY

- **PRD-SEC-003 (Mandatory Security Guardrails):** The platform MUST enforce:
  - Strict server-side JWT / OIDC session validation.
  - Absolute fail-closed authentication and authorization.
  - Encrypted server-side secret vaults for all provider and database credentials.
  - Multi-factor authentication (MFA) and step-up PIN for administrative and high-risk command actions.
  - Rate limiting on authentication, telemetry push, and command endpoints.
  - HTTPS / TLS 1.3 encryption in transit and AES-256 encryption at rest.

---

## 76. AUDIT

- **PRD-AUD-002 (Immutable System Audit Trail):** The system MUST record tamper-resistant audit logs capturing the User ID, Tenant ID, IP Address, Timestamp, Action, Target Entity, and Outcome for all sensitive operations (role changes, location grants, engine cut commands, media exports, and billing adjustments).

---

## 77. DATA / TELEMETRY ARCHITECTURE

- **PRD-DAT-001 (Decoupled Workload Architecture):** High-throughput real-time telemetry ingestion and heavy media storage MUST be decoupled from transactional ERP and billing databases to prevent telemetry traffic spikes from impacting business operations.

---

## 78. WHITE-LABEL / B2B BRAND READINESS

- **PRD-WHT-001 (B2B Brand Customization):** The platform MUST support tenant-level white-labeling (custom logo, brand colors, favicon, portal title, custom domain mapping, and branded notification templates) without altering shared codebase assets.

---

## 79. SCALABILITY

- **PRD-SCL-001 (High-Scale Architectural Target):** The platform architecture MUST be designed to scale gracefully from initial deployment to a long-term target capacity of approximately 2,000,000 connected devices via horizontal scaling of ingestion nodes, provider adapters, and storage clusters.

---

## 80. NON-FUNCTIONAL REQUIREMENTS

- **PRD-NFR-001 (Availability):** Telemetry ingestion and live map endpoints SHALL target 99.9% uptime.
- **PRD-NFR-002 (Telemetry Latency):** Ingested push telemetry SHOULD be processed, normalized, and made available to connected web/mobile clients within $\le 2000	ext{ ms}$ under normal network conditions.
- **PRD-NFR-003 (Mobile Offline Resilience):** Mobile apps SHOULD cache recent trip summaries and vehicle metadata locally, maintaining graceful offline UI states during cellular network loss.
- **PRD-NFR-004 (Graceful External Provider Failure):** If a third-party tracking provider or external AI service experiences downtime, the system SHALL isolate the failure, display informative degraded status badges, and maintain uninterrupted access to all unaffected modules.

---

## 81. FAILURE / DEGRADATION BEHAVIOR

- **PRD-FAL-001 (Deterministic Failure Handling):** The system MUST explicitly handle external failures without crashing:
  - *Tracking Provider Offline*: Display `TELEMETRY STALE / PROVIDER DISCONNECTED` badge; preserve last known location.
  - *Device Offline / No GPS Fix*: Display `OFFLINE` status with last valid coordinate timestamp.
  - *Command Transmission Timeout*: Automatically mark command state as `TIMEOUT / FAILED` and inform the user.
  - *External AI Outage*: Fall back to standard deterministic search, diagnostic rules, and manual forms without error popups.
  - *Zero Silent Fallbacks*: The system SHALL NEVER silently substitute simulated demo data for real customer vehicles during an outage.

---

## 82. TESTING / ACCEPTANCE PRINCIPLES

- **PRD-ACC-002 (Product Acceptance Criteria):**
  1. *Tenant Isolation*: Querying with an invalid or cross-tenant ID MUST fail closed with zero data leakage.
  2. *Device Capabilities*: Any feature not supported in the Device Knowledge Registry MUST be hidden or disabled in the UI.
  3. *Command State*: Engine cut commands MUST NOT indicate success until an authoritative `DEVICE_ACKNOWLEDGED` packet is received.
  4. *Demo Isolation*: Public demo sessions MUST NOT connect to real GPS devices or expose production customer records.
  5. *Role Permissions*: Sales users MUST NOT receive live map access; Support location grants MUST auto-expire.
  6. *Localization*: All screens MUST render cleanly and responsively in both Bangla and English.

---

## 83. OPEN ITEMS

The following 14 business and commercial decisions are formally recorded as open items. All items are confirmed non-blocking for PRD drafting and will be finalized prior to production implementation:

| Decision ID | Subject / Question | Recommended Default / Working Basis | Blocks PRD? | Blocks Impl? | Configurable / TBD? |
| :--- | :--- | :--- | :---: | :---: | :---: |
| **DEC-001** | Final commercial product & brand name | TBD (EasyTracker is temporary working name only) | **NO** | **NO** | **YES** |
| **DEC-002** | Initial 3rd-party licensed VTS provider(s) | TBD (Candidate examples: GP IoT, Robi, Bondstein) | **NO** | **YES** | **YES** |
| **DEC-003** | Initial production hardware device catalogue | TBD (S102A is pilot evidence; production catalogue requires registry verification) | **NO** | **YES** | **YES** |
| **DEC-004** | Subscription package pricing & rate cards | TBD / Configurable per tenant and market policy | **NO** | **NO** | **YES** |
| **DEC-005** | Support live-location grant exact duration | Configurable (Ticket-scoped, explicit grant, auto-expiry) | **NO** | **NO** | **YES** |
| **DEC-006** | Emergency rescue field operating model | TBD / Configurable by tenant operational policy | **NO** | **NO** | **YES** |
| **DEC-007** | Specialized fleet pack launch rollout order | TBD based on initial anchor customer demand | **NO** | **NO** | **YES** |
| **DEC-008** | Payment gateway provider selection | TBD / Integration candidate selection | **NO** | **NO** | **YES** |
| **DEC-009** | Telemetry raw data retention duration | TBD + Statutory legal/privacy verification required | **NO** | **NO** | **YES** |
| **DEC-010** | Crash video clip retention duration | TBD + Statutory legal/privacy verification required | **NO** | **NO** | **YES** |
| **DEC-011** | Cabin voice recording retention duration | TBD + Statutory legal/privacy verification required | **NO** | **NO** | **YES** |
| **DEC-012** | Regulatory source monitoring scan cadence | Configurable (Periodic automated scan + event trigger) | **NO** | **NO** | **YES** |
| **DEC-013** | Initial vehicle seed catalogue scope | TBD based on initial target customer segments | **NO** | **NO** | **YES** |
| **DEC-014** | Production AI sensitive data class approval | Zero PII / live telemetry sent to free cloud AI models | **NO** | **NO** | **YES** |

---

## 84. 79-SUBJECT AUDIT COVERAGE CHECKLIST

The following checklist verifies that all 79 requirement subjects mapped in the approved reconciliation audit (`docs/02_audit/VEHICLE_TRACKING_REQUIREMENT_RECONCILIATION_AUDIT_V0_1.md`) are explicitly covered in this PRD:

| # | Audit Coverage Subject | Addressed in PRD Section(s) | Coverage Status |
| :---: | :--- | :--- | :---: |
| 1 | Document Control | Section 1 (Document Control) | **COVERED** |
| 2 | Product Identity / Temporary Brand | Section 4 (Product Identity) | **COVERED** |
| 3 | Product Vision | Section 5 (Product Vision) | **COVERED** |
| 4 | Launch Strategy | Section 8 (Launch Strategy) | **COVERED** |
| 5 | Future Main SaaS Integration | Section 9 (Future Main SaaS Integration) | **COVERED** |
| 6 | Customer Types | Section 11 (Customer Types) | **COVERED** |
| 7 | Tenant / B2B Model | Section 12 (Tenant / B2B Model) | **COVERED** |
| 8 | Commercial Model | Section 13 (Commercial Model) | **COVERED** |
| 9 | Sales | Section 14 (Sales) | **COVERED** |
| 10 | Referral | Section 15 (Referral) | **COVERED** |
| 11 | Customer Purchase Journey | Section 16 (Customer Purchase Journey) | **COVERED** |
| 12 | Subscription | Section 17 (Subscription) | **COVERED** |
| 13 | Entitlement | Section 18 (Entitlement) | **COVERED** |
| 14 | User Roles | Section 19 (User Roles) | **COVERED** |
| 15 | Permissions | Section 20 (Authority / Permission / Scope) | **COVERED** |
| 16 | Authority / Scope | Section 20 (Authority / Permission / Scope) | **COVERED** |
| 17 | Tenant Isolation | Section 21 (Tenant Isolation) | **COVERED** |
| 18 | Tracking Provider Model | Section 22 (Tracking Provider Model) | **COVERED** |
| 19 | Telemetry Ingestion | Section 23 (Telemetry Ingestion) | **COVERED** |
| 20 | Live Tracking | Section 24 (Live Tracking) | **COVERED** |
| 21 | Position History | Section 25 (Position History) | **COVERED** |
| 22 | Trips | Section 26 (Trips) | **COVERED** |
| 23 | Geofence | Section 27 (Geofence) | **COVERED** |
| 24 | Alerts | Section 28 (Alerts) | **COVERED** |
| 25 | Device Commands | Section 33 (Device Commands) | **COVERED** |
| 26 | Command Lifecycle | Section 34 (Command Lifecycle) | **COVERED** |
| 27 | Command Safety | Section 35 (Command Safety) | **COVERED** |
| 28 | SOS | Section 36 (SOS) | **COVERED** |
| 29 | Accident | Section 37 (Accident / High Alert) | **COVERED** |
| 30 | Theft | Section 38 (Theft / Security Incidents) | **COVERED** |
| 31 | Support | Section 39 (Support) | **COVERED** |
| 32 | Rescue | Section 40 (Rescue) | **COVERED** |
| 33 | Fleet Core | Section 41 (Fleet Core) | **COVERED** |
| 34 | Public Transport | Section 42 (Public Transport) | **COVERED** |
| 35 | Cargo / Logistics | Section 43 (Cargo / Logistics) | **COVERED** |
| 36 | Courier / Delivery | Section 44 (Courier / Delivery) | **COVERED** |
| 37 | Corporate Fleet | Section 45 (Corporate Fleet) | **COVERED** |
| 38 | Device Knowledge Registry | Section 29 (Device Knowledge Registry) | **COVERED** |
| 39 | Vehicle Knowledge Registry | Section 30 (Vehicle Knowledge Registry) | **COVERED** |
| 40 | Vehicle ↔ Device Compatibility | Section 31 (Vehicle-Device Compatibility) | **COVERED** |
| 41 | Device Lifecycle | Section 32 (Device Lifecycle) | **COVERED** |
| 42 | SIM / M2M | Section 46 (SIM / M2M) | **COVERED** |
| 43 | Inventory | Section 47 (Inventory) | **COVERED** |
| 44 | Spare Parts | Section 48 (Spare Parts) | **COVERED** |
| 45 | Installation | Section 49 (Installation) | **COVERED** |
| 46 | Service | Section 50 (Service) | **COVERED** |
| 47 | Maintenance | Section 51 (Maintenance) | **COVERED** |
| 48 | Warranty | Section 52 (Warranty) | **COVERED** |
| 49 | RMA | Section 53 (RMA) | **COVERED** |
| 50 | Voice | Section 54 (Voice) | **COVERED** |
| 51 | Audio | Section 55 (Audio) | **COVERED** |
| 52 | Video | Section 56 (Video) | **COVERED** |
| 53 | Camera | Section 57 (Camera) | **COVERED** |
| 54 | Media / Evidence Handling | Section 58 (Media / Evidence Handling) | **COVERED** |
| 55 | Reports | Section 59 (Reports) | **COVERED** |
| 56 | Analytics | Section 60 (Analytics) | **COVERED** |
| 57 | Mobile Application | Section 61 (Mobile Application) | **COVERED** |
| 58 | Web Application | Section 62 (Web Application) | **COVERED** |
| 59 | Full Customer Demo | Section 63 (Full Customer Demo) | **COVERED** |
| 60 | Bangla / English Localization | Section 64 (Bangla / English Localization) | **COVERED** |
| 61 | UX / Responsive Design | Section 65 (UX / Responsive Design) | **COVERED** |
| 62 | Regulatory Knowledge | Section 66 (Regulatory Knowledge Service) | **COVERED** |
| 63 | Integration Registry | Section 67 (Integration Registry) | **COVERED** |
| 64 | Government / Telecom Integrations | Section 68 (Government & Telecom Integrations) | **COVERED** |
| 65 | APIs | Section 69 (APIs / Webhook Requirements) | **COVERED** |
| 66 | Webhooks | Section 69 (APIs / Webhook Requirements) | **COVERED** |
| 67 | AI / Automation | Section 70 (AI / Application Intelligence) | **COVERED** |
| 68 | Notifications | Section 71 (Notifications) | **COVERED** |
| 69 | Billing / Metering | Section 72 (Billing / Metering) | **COVERED** |
| 70 | Privacy | Section 73 (Privacy) | **COVERED** |
| 71 | Retention | Section 74 (Retention) | **COVERED** |
| 72 | Security | Section 75 (Security) | **COVERED** |
| 73 | Audit | Section 76 (Audit) | **COVERED** |
| 74 | Telemetry / Data Architecture | Section 77 (Data / Telemetry Architecture) | **COVERED** |
| 75 | White-Label / B2B Branding Readiness | Section 78 (White-Label / B2B Brand Readiness) | **COVERED** |
| 76 | Scalability | Section 79 (Scalability) | **COVERED** |
| 77 | Non-Functional Requirements | Section 80 (Non-Functional Requirements) | **COVERED** |
| 78 | Testing / Acceptance | Section 82 (Testing / Acceptance Principles) | **COVERED** |
| 79 | Open Items | Section 83 (Open Items) | **COVERED** |

---

## 85. PRODUCT REQUIREMENTS VERDICT

> # **PRODUCT REQUIREMENTS APPROVED — AUTHORITATIVE BASELINE**

This authoritative Product Requirements Document is fully reconciled against all authority baselines, covers all 79 audit subjects, enforces deterministic safety and security guardrails, and is formally approved as the authoritative product requirements baseline for the Vehicle Tracking Standalone Launch.
