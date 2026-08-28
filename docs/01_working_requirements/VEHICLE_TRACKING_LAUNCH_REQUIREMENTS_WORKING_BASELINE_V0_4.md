# VEHICLE TRACKING APPLICATION — LAUNCH REQUIREMENTS WORKING BASELINE

**Working Product Name:** TBD (do not treat “EasyTracker” as final brand)  
**Document Status:** WORKING REQUIREMENT BASELINE — NOT YET APPROVED  
**Version:** 0.4  
**Date:** 2026-08-28  

---

## 1. Purpose

This document defines the launch-focused requirements for a standalone Vehicle Tracking, Vehicle Security, Fleet Management, Device/SIM Operations, Support and Rescue application that can enter the market quickly now, while remaining architecturally ready to become the GPS / Vehicle Tracking vertical of the wider Agency multi-business SaaS platform later.

The launch product must not depend on the full Agency SaaS being completed first.

The application must be built as a modular, multi-tenant, API-first product so that later migration/inclusion into the main SaaS does not require a full rewrite.

---

## 2. Source-of-Truth Precedence for This Launch Product

For this standalone launch product, use the following order when requirements conflict:

1. Latest explicit user-approved requirement in the Vehicle Tracking planning conversation.
2. This approved launch requirement document once approved.
3. Existing Vehicle Tracking Product Master / PRD where not superseded.
4. Reusable architecture principles from the wider Agency SaaS authority packs where they do not block fast launch.
5. Existing codebase only as reusable implementation/UI reference; existing code is not authoritative where it conflicts with approved requirements or security policy.

No existing mock/fallback behavior may override an approved business, security or regulatory rule.

---

## 3. Launch Strategy

### 3.1 Immediate market approach

The first commercial version will launch using **licensed third-party VTS/tracking providers** for GPS telemetry where required.

Initial flow:

```text
GPS / Telematics Device
        ↓
Licensed Third-Party Tracking/VTS Provider
        ↓ API Push / API Pull / Webhook / Approved Integration
Vehicle Tracking Application Server
        ↓
Customer / Fleet / B2B Apps and Web Portals
```

### 3.2 Future self-hosted tracking

The architecture must preserve a future migration path to:

```text
SaaS-owned BTRC-authorized/licensed operating model
        ↓
Self-hosted Traccar tracking cells/clusters
```

The future self-hosted Traccar mode is **a tracking-provider option**, not the only architecture.

### 3.3 Multiple tracking providers

A single B2B tenant may use multiple tracking providers at the same time.

Provider assignment must be possible at least by:

- tenant;
- customer/account;
- fleet/group;
- device.

Example:

```text
Tenant ABC
├── Group 1 → Third-Party Provider A
├── Group 2 → Tenant-owned Traccar
└── Group 3 → SaaS-managed Traccar (future)
```

The customer UI must remain consistent regardless of which provider supplies the telemetry.

---

## 4. MASTER ARCHITECTURE IMPACT — Future Agency SaaS Inclusion

The existing wider Agency SaaS baseline currently states self-hosted Traccar as the GPS tracking baseline.

This launch requirement introduces a broader shared concept:

### Proposed shared capability

**Tracking Provider Control Plane** supporting:

- licensed third-party VTS provider;
- tenant-owned tracking server;
- SaaS-managed Traccar;
- future approved tracking provider adapters.

### Affected verticals/products

- Vehicle Tracking vertical;
- Fleet Management;
- future Courier/Delivery integrations where vehicle telemetry is reused;
- Support/Rescue shared services;
- Mobile App Factory / role packs;
- Integration Registry.

### Existing-rule impact

The future main SaaS should replace “one self-hosted Traccar baseline” with a provider-agnostic tracking control plane while preserving Traccar as the primary self-hosted engine.

### Security impact

Provider credentials must remain server-side in an encrypted credential vault. Mobile/web clients must never receive provider administrator credentials.

### Migration/backward compatibility

Existing Traccar-based devices remain valid as one provider type. No customer/fleet UI should require a rewrite when a device moves from one provider to another.

### Recommendation

Adopt this as a formal master-architecture amendment when the Vehicle Tracking vertical is later merged into the wider Agency SaaS.

---

## 5. Customer / Business Types

The platform must support four primary commercial patterns.

### 5.1 Individual / small customer

Examples:

- motorcycle owner;
- CNG owner;
- private car owner;
- pickup/truck owner;
- customer with one or multiple vehicles.

The customer purchases/uses a compatible device and receives only the features allowed by:

```text
Customer Subscription
AND Device Capability
AND User Permission
AND Safety Policy
```

### 5.2 Fleet customer

Examples:

- public transportation company;
- bus operator;
- cargo transportation company;
- logistics company;
- courier company;
- corporate vehicle fleet.

Fleet customers may subscribe to Tracking only or Tracking + Fleet Management packs.

Fleet customers can create their own internal users/roles and manage access according to tenant policy.

### 5.3 B2B GPS / VTS business customer

A B2B company may provide any combination of:

- its own devices;
- devices with SIM;
- devices without SIM;
- M2M SIM;
- voice M2M SIM;
- its own tracking server;
- third-party tracking server.

It may purchase any combination of platform services such as:

- application access;
- managed tracking server in future;
- sales service;
- technical service;
- support service;
- rescue service;
- voice service;
- video service;
- inventory/device/SIM operations;
- service/warranty operations.

### 5.4 SaaS owner direct business

The platform owner may independently source devices from third parties and provide service to its own customers.

The third party may provide telemetry through API push/pull while the application, media, customer experience, support, rescue and operational records remain in the platform.

The SaaS owner's direct business data must still be logically separated as its own business/tenant context rather than mixed with platform-super-admin configuration records.

---

## 6. Entitlement and Feature Availability Rule

No feature is shown merely because the application supports it.

The authoritative formula is:

```text
Feature Available =
Platform Capability
AND Tenant/Business Entitlement
AND Customer Subscription/Package
AND User Role/Permission
AND Device Capability
AND Safety/Workflow Policy
```

If any required factor is false, the feature must be hidden or explicitly unavailable according to UX policy.

Examples:

- Customer package includes engine control, but the device has no relay → Engine Control hidden.
- Customer package includes video, but device has no camera capability → Video hidden.
- Rescue team has incident permission, but no active incident exists → Location/control access denied.

---

## 7. Device Capability Registry

Seller/operator must **not manually select device features**.

Required device onboarding inputs:

- manufacturer/brand where known;
- device model;
- IMEI and/or serial number;
- SIM/M2M assignment where applicable;
- provider/server assignment;
- installation information.

The system resolves supported capabilities through the **Device Capability Registry**.

### 7.1 Capability examples

```text
supports_live_tracking
supports_ignition
supports_engine_relay
supports_gps_wakeup
supports_battery
supports_external_voltage
supports_fuel
supports_temperature
supports_geofence_device_side
supports_sos
supports_voice_call_monitoring
supports_audio_recording
supports_live_audio_stream
supports_two_way_audio
supports_camera
supports_live_video
supports_video_playback
supports_snapshot
supports_media_upload
supports_crash_event
supports_remote_configuration
supports_ussd
```

### 7.2 Unknown device

Unknown devices must not receive AI-guessed capabilities.

Status:

```text
UNKNOWN / UNVERIFIED DEVICE PROFILE
→ Technical/Admin verification required
```

Once a device model profile is verified, future devices of the same verified hardware/firmware family can inherit the profile automatically, subject to connection-time validation.

### 7.3 Command preset registry

Each supported model/protocol should map to approved command presets for:

- engine disable/restore;
- GPS wakeup;
- status request;
- reporting interval where legally/technically appropriate;
- APN/server configuration;
- USSD/balance requests where supported;
- device reboot/diagnostic commands;
- model-specific commands.

Users must not be required to type raw protocol commands for normal operations.

### 7.4 Device Knowledge Registry — Mandatory

The Device Capability Registry must be backed by a richer **Device Knowledge Registry**. A device profile must not be only a list of UI feature flags. Where verified information exists, it should be able to store:

- manufacturer/brand;
- model and hardware revision;
- firmware family/version;
- protocol and protocol variant;
- supported network technology (for example 2G/3G/4G/LTE/NB-IoT/Cat-M where applicable);
- SIM/M2M requirements;
- APN/server configuration rules;
- TCP/UDP support and provider compatibility;
- GPS/GNSS capability;
- heartbeat/reporting/static/sleep behavior;
- ACC/ignition support;
- relay/immobilization capability;
- internal battery and external-voltage capability;
- SOS, vibration, tamper and crash capabilities;
- supported sensors and accessories;
- voice/audio capabilities;
- camera/video/media capabilities;
- storage capability;
- supported command presets;
- known firmware-specific differences;
- installation notes and safety constraints;
- source/reference and verification status.

AI may extract a preliminary profile from a manufacturer manual or other approved source, but the resulting profile must be marked, for example:

```text
AI_EXTRACTED / UNVERIFIED
```

until a technical/admin verification step approves it.

A device must never receive safety-critical capabilities or commands solely because an AI model guessed them.

### 7.5 Connection-time capability validation

When a device first connects, reported protocol/firmware/model information should be compared with the approved registry profile. Material mismatches must be flagged for technical review rather than silently inheriting the wrong capability profile.

---

## 8. Core Tracking Features

The core tracking application must support, where provider/device data is available:

- live location;
- last valid location;
- last communication time;
- GPS fix time;
- online/offline;
- speed;
- ignition/ACC;
- motion/stopped/idle;
- heading/direction;
- odometer/distance;
- trip history;
- route replay;
- stops;
- idle analysis;
- geofence;
- overspeed;
- device power/battery/external voltage;
- SOS and alarm events;
- power cut/reconnect;
- tamper/vibration where supported;
- GPS signal and GSM/GPRS diagnostics where supported;
- device and SIM technical status;
- event timeline;
- configurable history/report retention.

The system must clearly distinguish:

- current communication time;
- current valid GPS fix time;
- last known position;
- invalid/zero GPS position.

The UI must never present an old last-known position as a fresh live GPS fix without showing the fix timestamp/status.

---

## 9. Device Commands and Safety

### 9.1 Core commands

Supported device/protocol combinations may expose:

- engine OFF/immobilize;
- engine ON/restore;
- GPS wakeup;
- status query;
- approved diagnostic commands;
- SIM/USSD balance/data checks where supported;
- device-specific approved preset commands.

### 9.2 Command state model

Never show success before authoritative confirmation.

Minimum state model:

```text
REQUESTED
→ AUTHORIZED
→ SENT
→ QUEUED / DELIVERED
→ DEVICE ACKNOWLEDGED
```

Failure states:

```text
REJECTED
UNSUPPORTED
DEVICE OFFLINE
FAILED
TIMEOUT
NO ACKNOWLEDGEMENT
```

### 9.3 Engine immobilization safety

Engine disable is a high-risk action.

Required controls:

- device capability validation;
- user authorization;
- subscription entitlement;
- safety policy;
- speed/stationary validation where data is sufficiently fresh;
- hold-to-confirm;
- PIN/biometric/step-up authentication for customer control;
- server-side command authorization;
- command acknowledgement/result;
- immutable/auditable log.

Default policy must prevent unsafe immobilization of a moving vehicle unless a separately approved lawful emergency policy explicitly permits otherwise.

### 9.4 Rescue engine control

Rescue teams may receive approved control permission only for an assigned active incident and under tenant/platform policy.

High-risk rescue commands may require dispatcher or two-person approval.

---

## 10. Fleet Management Packs

Fleet functionality must be modular. A fleet customer should not receive irrelevant features.

### 10.1 Fleet Core

- fleet/group hierarchy;
- vehicles/drivers;
- live fleet map;
- assignment;
- driver/device status;
- trip/stops/idle;
- utilization;
- overspeed;
- route adherence;
- geofences;
- alerts;
- scheduled reports;
- maintenance reminders;
- role/user manager.

### 10.2 Public Transportation Pack

Preserve applicable existing features such as:

- route/station/counter setup;
- schedule/departure;
- route/fare configuration;
- counter incharge;
- onboard supervisor;
- driver cockpit;
- gatepass/departure workflow;
- passenger/seat occupancy where subscribed;
- GPS-tagged boarding logs;
- intercom/dispatch messaging;
- SOS/emergency workflow.

### 10.3 Cargo/Logistics Pack

- vehicle/driver assignment;
- dispatch;
- route adherence;
- stoppage/idle;
- cargo job reference;
- delivery/arrival checkpoints;
- geofence entry/exit;
- proof/status integrations where subscribed;
- exception alerts.

### 10.4 Courier/Delivery Pack

Where the future wider SaaS shared Delivery/Field Mobility Engine is available, reuse it rather than duplicating it.

Standalone launch may support adapter-ready interfaces for:

- pickup;
- dispatch;
- rider/driver assignment;
- delivery status;
- COD/POD references;
- returns;
- route tracking.

---

## 11. User and Role Management

### 11.1 Platform roles

At minimum:

- SaaS Super Admin;
- SaaS Operations Admin;
- Tenant/B2B Admin;
- Fleet Company Admin/Manager;
- Sales;
- Seller/Dealer/Reseller;
- Customer Service;
- Technical Support;
- Technician/Installer;
- Rescue Dispatcher;
- Rescue Team Member;
- Fleet Supervisor;
- Counter Incharge;
- Driver;
- Customer/Vehicle Owner;
- custom tenant roles.

### 11.2 Fleet/B2B role manager

Authorized fleet/B2B tenants may create custom roles from approved permission atoms.

They must not create permissions beyond their tenant entitlement or platform authority ceiling.

### 11.3 Seller privacy rule

Seller/Dealer default access:

- customer onboarding data;
- vehicle basic data;
- device model/IMEI/serial;
- SIM/install information;
- approval/status;
- warranty/service/sales records in assigned scope.

Default denied:

- live location;
- route history;
- engine control;
- voice monitoring;
- video monitoring.

---

## 12. Support Module

Support must be a first-class module.

### 12.1 Ticket features

- category;
- priority;
- SLA;
- device/customer/vehicle linkage;
- assignment;
- notes;
- attachment;
- escalation;
- status lifecycle;
- customer communication;
- audit.

### 12.2 Automatic diagnostic snapshot

When a device-related ticket is created, the system should automatically attach available diagnostics such as:

- device model;
- IMEI/serial;
- provider;
- protocol;
- firmware where available;
- online/offline;
- last communication;
- last valid GPS fix;
- GPS/GSM/GPRS status;
- battery/voltage;
- ignition;
- recent device events;
- recent command results;
- API/provider health signals.

### 12.3 Support access policy

Default Support may access technical diagnostics but **not unrestricted live location/history**.

When location is necessary:

```text
Support Ticket
→ Temporary Access Grant
→ reason + scope + expiry
→ automatic revoke
```

Suggested configurable durations:

- 30 minutes;
- 1 hour;
- ticket-session duration.

All sensitive access must be audited.

---

## 13. Rescue Module

Rescue must support:

- SOS;
- stolen vehicle;
- accident;
- breakdown;
- medical emergency;
- safety threat;
- configurable incident categories.

Workflow:

```text
Incident Created
→ Validate / Triage
→ Dispatcher
→ Team Assignment
→ En Route
→ On Scene
→ Resolved / Closed
```

### 13.1 Rescue access

Only assigned active incidents grant access to:

- live location;
- relevant location history;
- customer emergency contact;
- vehicle information;
- device diagnostics;
- approved commands;
- voice/video when legally allowed, subscribed and device-supported.

Incident closure must automatically revoke incident-scoped access.

### 13.2 Task assignment automation

Assignment may use Google Maps/approved map routing plus policy scoring:

- distance/ETA;
- service territory;
- team availability;
- skills;
- device/model expertise;
- incident priority;
- working hours;
- workload;
- required spare parts/tools;
- SLA.

AI may recommend or auto-assign only within approved workflow policy.

---

## 14. Accident and High-Alert System

Accident/high-alert may originate from:

- device crash/alarm packet;
- accelerometer/harsh-impact signal;
- provider event;
- server-side rule/anomaly;
- manual SOS;
- supported camera/ADAS event.

The system should:

- classify severity;
- de-duplicate repeated events;
- notify appropriate roles;
- create rescue/support workflows where policy permits;
- capture associated position, speed, ignition, device status and media references;
- preserve an event timeline.

AI may assist triage and prioritization, but AI inference alone must not trigger irreversible high-risk action such as police dispatch, engine cut or evidence deletion without approved policy/workflow.

---

## 15. Voice and Audio Features

Voice capabilities must be modeled separately:

- `voice_call_monitoring`;
- `audio_recording`;
- `live_audio_stream`;
- `two_way_audio`.

They must not be treated as the same feature.

Availability requires:

```text
Subscription/Entitlement
AND Device Capability
AND Role Permission
AND Legal/Privacy Policy
```

The system must support provider/device-specific implementation while exposing a consistent application experience.

---

## 16. Video / Camera / Media Features

Architecture must support, where device/provider permits:

- live video;
- multi-camera view;
- event-triggered clip;
- crash/high-alert clip;
- manual snapshot;
- playback;
- media timeline;
- evidence export;
- configurable retention;
- watermark;
- integrity hash/metadata;
- access audit.

### 16.1 Independent media layer

Media should be able to flow independently from GPS telemetry when device/provider architecture allows:

```text
Camera/Audio Device
→ Media Gateway / Provider
→ Application Media Service
→ S3-compatible Private Object Storage
```

### 16.2 Watermark and evidence integrity

Watermark may include policy-approved metadata such as:

- timestamp;
- device/vehicle reference;
- incident reference;
- tenant/brand;
- integrity reference.

Cryptographic hashing supports integrity verification but must not be marketed as automatically guaranteeing court admissibility. Evidence handling should preserve metadata, chain of custody, access logs and retention policy.

---

## 17. Device ERP / SIM & M2M ERP / Spare Parts

The standalone launch product may implement vertical-specific operational modules now, but they must remain modular and later map cleanly to the wider Agency SaaS shared Inventory/Procurement/Service engines.

### 17.1 Device ERP

Track serialized devices by:

- model;
- IMEI;
- serial;
- supplier/source;
- purchase batch;
- cost;
- stock status;
- assigned SIM;
- assigned provider;
- assigned customer/vehicle;
- install date;
- firmware/profile;
- warranty;
- service/RMA/replacement;
- retired/scrap status.

### 17.2 SIM/M2M ERP

Support fields such as:

- provider/operator;
- MSISDN;
- ICCID;
- IMSI where legitimately available;
- APN;
- plan;
- data/voice capability;
- M2M/voice M2M classification;
- activation;
- expiry/renewal;
- balance/data usage when obtainable;
- recharge;
- pooled plan;
- assigned device;
- suspension/replacement;
- provider invoice/cost;
- API status.

### 17.3 Spare parts

Track:

- relay;
- wiring harness;
- fuse;
- connectors;
- antenna;
- camera accessories;
- sensors;
- other model-specific spare parts.

Service jobs should deduct used parts from inventory under controlled workflow.

---

## 18. Service, Maintenance and Warranty

Required features:

- installation job;
- technician assignment;
- scheduled maintenance;
- repair;
- diagnostic visit;
- device replacement;
- SIM replacement;
- relay/wiring service;
- service center;
- parts usage;
- service history;
- customer acknowledgement/signature where applicable;
- warranty period;
- warranty claim;
- inspection;
- RMA;
- replacement mapping;
- old/new IMEI linkage;
- warranty expiry notification.

Replacing a device must not destroy the customer's vehicle/service history.

---

## 19. Sales / B2B / Dealer Operations

Sales functions may include:

- lead;
- prospect/customer;
- quotation;
- package/device offer;
- installation request;
- seller/dealer assignment;
- order/service activation;
- sales follow-up;
- renewal;
- B2B partner account;
- per-device commercial terms;
- commissions/allowances where applicable.

Sales users must not gain live tracking access merely because they own the customer relationship.

---

## 19.1 Customer Acquisition, App-Install Purchase, Referral and Rewards — Mandatory

The final product must preserve and formalize the existing customer-acquisition, direct-purchase, referral/cashback and sales-attribution concepts. These are commercial product requirements, not demo-only UI.

### 19.1.1 Mobile/Web purchase entry points

Both the customer mobile application and public/customer web application must provide clear conversion paths such as:

- Explore Demo;
- View Devices / Plans;
- Buy a Device;
- Add Another Vehicle / Device;
- Renew / Upgrade Subscription;
- Request Installation;
- Contact Sales where assisted purchase is required.

A newly installed mobile app must allow a prospective user to explore the public demo and commercially available devices/plans before having a fully activated tracking account. Sensitive/paid actions must require verified onboarding/authentication.

### 19.1.2 New-user install-to-purchase journey

The architecture must support a clean funnel similar to:

```text
Install / Open App or Web
→ Explore Demo or Browse Store
→ Choose Vehicle/Use Case
→ Choose Compatible Device
→ Choose Subscription/Feature Package
→ Choose SIM/M2M option where applicable
→ Choose Accessories where applicable
→ Apply Referral/Promo if eligible
→ Verify Mobile/Email / Create Customer Account
→ Select Installation Mode
→ Address / Map Pin / Service Center / Preferred Schedule
→ Review Price, Discount and Terms
→ Select Approved Payment Method
→ Create Order
→ Sales/Verification Workflow if required
→ Technician/Installer Assignment
→ Installation
→ Device Verification / Activation
→ Subscription Activation
→ Customer App Access
```

The exact commercial/payment steps must be configurable by product policy and payment-provider availability.

### 19.1.3 Existing-user purchase journey

An existing customer must be able, subject to policy, to purchase or request:

- another tracking device;
- another vehicle activation;
- subscription renewal;
- subscription upgrade/downgrade where allowed;
- supported add-on services;
- SIM/M2M service;
- accessories/spare items exposed for customer purchase;
- installation/service appointment.

Purchased devices/services must be linked to the correct customer, vehicle, order, installation, subscription and tracking-provider records after verification.

### 19.1.4 Referral / Refer-and-Earn

Each eligible customer may receive a unique referral identity consisting of one or more of:

- referral code;
- dynamic referral link;
- QR code later if required;
- campaign/source attribution metadata.

The platform must support referral attribution from mobile/web entry where technically available. Referral attribution must not be based only on client-side state; the authoritative referral record must be server-side.

The referred prospect may receive a configurable benefit such as:

- purchase discount;
- cashback/credit;
- installation benefit;
- subscription benefit;
- campaign-specific offer.

The referrer may receive a configurable reward only after the defined qualification event, for example:

```text
Order Verified
AND Required Payment Satisfied
AND Installation Completed
AND Device Activated
AND Minimum Fraud/Return/Cancellation Conditions Passed
→ Referral Reward Eligible
```

Reward amounts and qualification rules must be admin-configurable. Existing prototype amounts such as fixed BDT 100/500 values are not authoritative production pricing.

### 19.1.5 Referral sharing

Where supported by the device/platform, the customer experience should provide easy sharing options such as:

- copy referral code;
- copy dynamic link;
- WhatsApp share;
- Facebook/share-sheet integration;
- other approved share channels.

No privileged credentials or sensitive customer information may be embedded in referral URLs.

### 19.1.6 Referral wallet and redemption

The architecture should support a customer reward wallet/ledger with configurable redemption modes, including where commercially enabled:

- subscription renewal credit;
- device/accessory purchase credit;
- service/installation credit;
- approved cash-out/payment-channel settlement.

Cash-out is optional and must be enabled only where finance, tax, fraud, payment-provider and legal policy permit it.

Every reward transaction must have an immutable business ledger/audit reference rather than being maintained only in browser local storage.

### 19.1.7 Anti-fraud controls

Mandatory referral protections include at minimum:

- no self-referral where prohibited by campaign policy;
- duplicate account/device/phone/payment pattern checks;
- cancelled/refunded/failed-install orders do not earn final rewards;
- one qualifying attribution according to campaign policy;
- configurable referral expiry/attribution window;
- manual review/hold for suspicious rewards;
- audit of referral creation, attribution, qualification, reversal and payout.

AI may flag suspicious referral patterns but must not silently confiscate or pay money without deterministic policy/workflow authorization.

### 19.1.8 Sales staff / dealer / partner attribution and commissions

Customer referral rewards, staff sales commissions and B2B/dealer commercial margins are separate concepts and must use separate ledgers/rules.

The platform must support, where enabled:

- salesperson attribution;
- dealer/partner attribution;
- lead/source attribution;
- sale/device activation commission;
- commission approval state;
- commission payout state;
- reversals on cancellation/refund according to policy;
- configurable rate cards/allowances;
- audit history.

A Sales user does not gain tracking/location permission because they earned commission on the sale.

### 19.1.9 Payment and installation modes

The architecture must support configurable payment/fulfilment choices rather than hard-code a single method. Depending on launch policy these may include:

- advance online payment;
- online payment after verified installation;
- cash/payment on installation where allowed;
- sales-assisted payment;
- B2B credit/invoice terms.

Installation options may include:

- doorstep/mobile installation;
- approved service center;
- dealer/partner installation;
- fleet/bulk installation.

Location/map-based installer assignment may use the approved task-assignment policy described elsewhere in this requirement baseline.

### 19.1.10 Conversion analytics

The platform should measure privacy-safe acquisition/conversion stages such as:

```text
App/Web Visit
→ Demo Started
→ Store/Plan Viewed
→ Referral Attributed
→ Registration/OTP Verified
→ Order Started
→ Order Submitted
→ Payment/Verification
→ Installation Scheduled
→ Installation Completed
→ Device Activated
→ Subscription Active
```

These metrics must support campaign, referral, seller/dealer and product-conversion analysis without exposing tracking/location data to sales users.

### 19.1.11 Demo-to-purchase conversion

The mandatory full demo defined later in this document must provide a clear but non-intrusive conversion path to:

- create/request a real account;
- purchase/request a compatible device;
- request a fleet/B2B trial;
- contact sales;
- retain eligible referral/campaign attribution.

A demo session must never become a privileged production account without normal verified onboarding.

---

## 20. Tracking Provider Integration Layer

A provider-neutral adapter layer is mandatory.

Conceptual interface:

```text
TrackingProviderAdapter
├── ThirdPartyLicensedVTSAdapter
├── TenantTraccarAdapter
├── SaaSManagedTraccarAdapter (future)
└── FutureApprovedProviderAdapter
```

Standardized outputs should include:

- device identity mapping;
- current position;
- position history;
- device status;
- events;
- supported commands;
- command execution/result;
- media references when applicable;
- provider health/error state.

Provider-specific raw payloads should not leak into customer UI models.

---

## 21. Government / Telecom / Third-Party Integrations

Architecture must support **two-way integration** where an official API, contract or lawful connection exists.

Integration categories may include:

- BTRC;
- BRTA;
- Police / authorized law-enforcement systems;
- Traffic authority;
- telecom/M2M provider;
- voice M2M provider;
- B2B partners;
- third-party VTS providers;
- payment/notification providers;
- maps/routing.

### 21.1 Integration Registry

Every integration must have an explicit lifecycle status:

```text
PLANNED
DOCUMENTATION_PENDING
SANDBOX
APPROVED
ACTIVE
DEGRADED
SUSPENDED
RETIRED
```

No fabricated or guessed government API endpoint may be presented as production-ready.

### 21.2 Two-way sync safety

Inbound and outbound synchronization must define:

- authoritative source;
- field mapping;
- conflict policy;
- retry/idempotency;
- audit;
- authorization;
- data minimization;
- legal/contractual basis.

### 21.3 Regulatory Knowledge & Update Service — Mandatory

The product must include an architecture for a versioned **Regulatory Knowledge & Update Service** covering public, officially published information from relevant authorities such as:

- BRTA;
- BTRC;
- Bangladesh Police / authorized law-enforcement sources;
- Traffic authority / DMP or other applicable traffic authorities;
- other government authorities relevant to vehicle, road, telematics, privacy, safety or transport operations.

The service may use scheduled source checks and external AI to detect, extract, compare and summarize changes, but an AI result is not itself an authoritative rule.

Recommended lifecycle:

```text
Official Source Check
→ New/Changed Document Detected
→ Source Archived / Referenced
→ AI Extraction + Difference Summary
→ Human/Admin Compliance Review
→ Effective-Date / Scope Verification
→ APPROVED
→ Knowledge Base Updated
→ Relevant Users/Tenants Notified
```

Each approved regulatory knowledge item should support, where applicable:

- issuing authority;
- official document/title;
- official source/reference;
- publication date;
- effective date;
- version/revision;
- superseded rule/document;
- geographic scope;
- applicable vehicle/customer/business category;
- operational impact;
- AI summary;
- human verification status;
- last checked date;
- status such as `UNDER_REVIEW`, `APPROVED`, `SUPERSEDED` or `RETIRED`.

No production speed threshold, legal workflow, VTS licensing rule, enforcement action, Police/Traffic dispatch, customer restriction or other consequential rule may be changed solely from an AI-generated interpretation.

The user-facing product must distinguish:

```text
Official / Verified Rule
Under Review
Informational Guidance
AI Summary
```

so that an AI summary is never presented as an official government order unless the underlying official source has been verified.

---

## 22. Subscription / Commercial Model

The launch product must support modular subscriptions.

A customer/tenant may subscribe to only what it needs.

Examples:

- Tracking only;
- Tracking + Security;
- Tracking + Fleet;
- Tracking + Video;
- Tracking + Voice;
- Application only with own tracking server;
- Application + Sales;
- Application + Support;
- Application + Rescue;
- Full managed service.

Future B2B per-device fee models must be supported separately from the B2B company's retail customer pricing.

Platform wholesale price and tenant/customer retail price are distinct commercial layers.

---

## 23. AI, Built-in Intelligence and Automation

The product must include two distinct intelligence layers. Core tracking, security, entitlement and safety behavior must not depend on a cloud AI model being available.

### 23.1 Built-in Application Intelligence — Mandatory

Deterministic/rule-based intelligence must continue to work even when Gemini or any external AI provider is unavailable. It should handle or assist with:

- device capability resolution from approved registry data;
- vehicle/device compatibility rules;
- entitlement and feature filtering;
- safe command eligibility;
- stale GPS/GPRS/power detection;
- overspeed/geofence/event rules;
- accident/high-alert workflow rules;
- SIM expiry/recharge alerts;
- service/warranty reminders;
- maintenance interval calculations;
- technician/support/rescue assignment scoring;
- deterministic notification and escalation rules;
- subscription and renewal rules;
- provider health/failover status.

### 23.2 External AI Orchestration

The initial external AI provider may use the **Gemini API**, including a free-tier integration where commercially/contractually appropriate, but the application must use an AI Provider/Orchestrator abstraction so Gemini can later be replaced or supplemented without rewriting business modules.

Conceptual architecture:

```text
Application Services
      ↓
AI Orchestrator
      ├── Gemini Provider
      ├── Future AI Provider
      └── Deterministic / No-AI Fallback
```

Suitable external-AI functions include:

- public regulatory-document extraction and summarization;
- manufacturer/manual specification extraction;
- device-manual interpretation;
- vehicle knowledge enrichment;
- natural-language support assistant;
- technical troubleshooting assistance;
- support ticket classification and summarization;
- anomaly explanation;
- report explanation/narrative;
- fleet exception summary;
- predictive-maintenance suggestion;
- inventory reorder suggestion;
- customer renewal/churn-risk suggestion;
- role-aware recommendations and search.

### 23.3 External AI privacy boundary

A free/public AI API must not be treated as a private operational data store. Sensitive production data must not be sent to a free external AI provider unless a later approved privacy/security policy explicitly permits the exact use case.

Default prohibition includes:

- customer name/phone or direct identifiers;
- customer-linked IMEI/serial numbers;
- live location or location history;
- voice/audio recordings;
- camera/video/media;
- rescue-incident personal data;
- payment/financial secrets;
- private B2B data;
- authentication credentials, API keys or provider secrets.

Public documents, public vehicle specifications and public device manuals may be processed through an approved external-AI workflow subject to source and provider policy.

### 23.4 Vehicle Knowledge Registry — Mandatory

The product must include a source-aware Vehicle Knowledge Registry capable of representing **legacy/discontinued, current, and officially announced/upcoming vehicles**. `Future/upcoming` must mean officially announced or otherwise source-supported; it must not mean an AI prediction.

The registry should support, where available and verified:

**Identity and market context**
- manufacturer;
- brand;
- model;
- generation/version;
- variant/trim;
- model year or production range;
- vehicle category;
- country/market;
- Bangladesh availability/status where known;
- fuel/energy type;
- transmission;
- engine/powertrain variant.

**Technical and maintenance data**
- engine displacement/code where verified;
- fuel tank capacity;
- recommended fuel/energy type;
- battery specification where relevant;
- recommended engine-oil grade;
- engine-oil capacity where available;
- coolant specification where available;
- tyre size;
- recommended front/rear tyre pressure;
- load-specific tyre pressure where applicable;
- wheel size;
- maintenance/service interval;
- other verified service specifications useful to customers/fleets.

**Tracking/install compatibility**
- electrical system class (for example 12V/24V where known);
- ACC/ignition-detection suitability;
- relay/immobilization suitability;
- CAN/OBD compatibility where supported;
- recommended tracker class;
- camera installation compatibility;
- fuel-sensor/TPMS/add-on compatibility where relevant.

### 23.5 Vehicle data verification and safety

AI may find/extract a specification, but the product must not silently save an uncertain technical value as confirmed. This is especially important for safety/maintenance values such as tyre pressure, oil grade/capacity, electrical system and installation compatibility.

Vehicle-specification records should support:

- source;
- verification status;
- exact model/year/variant applicability;
- last verified date;
- confidence/review state.

Example user states:

```text
✓ Manufacturer Verified
⚠ Exact Variant Not Confirmed — Check Vehicle Placard/Owner Manual
AI Extracted — Technical Review Required
```

Recommended source priority:

1. manufacturer owner/service manual or official specification;
2. official distributor/importer;
3. verified government/approved source where available;
4. authoritative service documentation;
5. trusted structured automotive-data provider;
6. AI-assisted extraction from approved sources;
7. community/secondary sources only with verification warning.

### 23.6 Vehicle ↔ Device Compatibility Intelligence

The application should combine the Vehicle Knowledge Registry, Device Knowledge Registry and approved installation policy to recommend compatible devices and expose only realistic capabilities.

Example:

```text
Selected Vehicle
→ Vehicle electrical/feature profile
→ Candidate Device Profiles
→ Protocol / Relay / Camera / Voice / Sensor Compatibility
→ Installation Constraints
→ Subscription Options
→ Recommended Compatible Devices
```

Recommendations must be registry-driven. External AI may explain the recommendation but must not invent device compatibility.

The Store/Purchase flow should be able to use this intelligence:

```text
Vehicle Manufacturer
→ Model
→ Year / Version / Variant
→ Compatible Devices
→ Compare Features
→ Select Subscription
→ Purchase / Trial / Installation
```

### 23.7 Role-aware AI experience

AI explanations should adapt to role and language without changing the underlying authoritative facts. Examples:

- General customer: simple explanation and action guidance;
- Technician: protocol, voltage, GPS/GPRS, firmware and installation details;
- Support: diagnostic summary and recommended troubleshooting steps;
- Fleet manager: exceptions, operational risk and fleet summary;
- Rescue: incident-focused summary and approved actions;
- Management: business/operational analytics.

### 23.8 AI automation functions

Recommended AI/automation capabilities include:

- automatic filtering and intelligent search;
- device-profile suggestion after verified model matching;
- vehicle-specification enrichment;
- regulatory change detection/summarization;
- technical anomaly grouping;
- support ticket classification;
- ticket priority suggestion;
- support diagnostic summary;
- rescue incident triage assistance;
- technician/rescue-team assignment recommendation;
- inventory reorder suggestion;
- SIM expiry/recharge alerting;
- service/warranty reminder;
- device failure pattern detection;
- predictive maintenance recommendation;
- fleet exception summary;
- automatic report filtering/grouping;
- report narrative/summary;
- customer churn/renewal risk indicators;
- provider health anomaly detection;
- subscription/feature explanation;
- role-aware suggested actions.

### 23.9 Automation boundaries — Mandatory

AI must not autonomously:

- increase its own permission;
- access another tenant;
- invent a vehicle/device capability;
- silently approve an unverified technical specification;
- change a legal/regulatory rule solely from AI interpretation;
- immobilize a moving vehicle outside an explicitly approved lawful safety policy;
- activate voice/video surveillance without entitlement/permission/legal basis;
- dispatch Police/Traffic/other external authority solely on AI inference;
- delete evidence/media;
- change subscription price or billing terms;
- create hidden production credentials;
- bypass approval workflows.

High-impact actions require deterministic authorization, verified data and audit.

**Mandatory product principle:**

> **AI assists: find, extract, compare, explain, recommend and automate safe workflows. Verified data and deterministic policy decide.**

---

## 24. Reports and Analytics

### 24.1 Individual customer reports

- daily summary;
- trip report;
- stops;
- idle;
- route history;
- speed/overspeed;
- ignition;
- geofence;
- alerts/events;
- engine command history;
- device health;
- subscription/service/warranty status.

### 24.2 Fleet reports

- fleet summary;
- vehicle utilization;
- driver behavior;
- route adherence;
- trip/stoppage/idle;
- overspeed;
- geofence;
- maintenance due;
- fleet exceptions;
- public-transport-specific reports where subscribed;
- cargo/courier-specific reports where subscribed.

### 24.3 Operations reports

- device inventory;
- SIM/M2M;
- supplier/source;
- service/maintenance;
- warranty/RMA;
- support SLA;
- rescue incidents;
- sales/activation;
- B2B usage;
- provider uptime/health;
- command success/failure;
- media/storage usage;
- subscription/renewal.

Reports must have useful date/vehicle/group/customer filters and export capability according to permissions.

AI-assisted filtering and summaries should be available, but raw/source values remain authoritative.

---

## 25. Mobile Application Requirements

Mobile must be designed for Android first and remain iOS-ready.

### 25.1 Customer mobile app

Primary navigation should stay simple, for example:

```text
Home | Map | Alerts | Reports | More
```

Core screens:

- login/verification;
- vehicle/device switcher;
- home/status;
- live map;
- vehicle details;
- alerts;
- reports/history;
- engine control where allowed;
- geofence where allowed;
- subscription/features;
- support;
- SOS/rescue;
- warranty/service;
- voice/audio where supported;
- video/media where supported;
- settings/profile.

### 25.2 Fleet mobile profiles

Role-aware mobile experience may include:

- management/supervisor;
- driver;
- counter incharge;
- onboard supervisor;
- technician;
- support;
- rescue;
- sales/customer service.

Role does not require a separate codebase.

### 25.2A Bangla + English Localization and Plain-Language UX — Mandatory

The mobile application and web application must be designed as bilingual products from the beginning.

Supported launch languages:

```text
বাংলা
English
```

The language system must use localization resources; user-facing labels and messages must not be scattered as hard-coded strings throughout application code.

Language setting should support, where technically appropriate:

- বাংলা;
- English;
- Follow device/browser language.

Menus, buttons, alerts, reports and command names must be understandable to non-technical vehicle owners. Technical terms may be shown in bilingual form when that improves comprehension, for example:

```text
জিপিএস ফিক্স (GPS Fix)
ইঞ্জিন/ইগনিশন (Ignition)
লাইভ অবস্থান (Live Location)
অতিরিক্ত গতি (Overspeed)
নির্ধারিত এলাকা (Geofence)
```

General-customer screens should prefer plain language. Technician, Support and Fleet operational profiles may expose deeper technical terminology when permitted.

Translation must preserve the meaning and risk level of safety-critical controls. Engine-control, emergency, privacy and voice/video actions must not use ambiguous labels.

AI assistant output should follow the user's selected language. Where a Bangla translation could make a technical term ambiguous, the English technical term should be shown alongside it.

---

### 25.3 Built-in Full Product Demo — Mandatory Final Product Feature

The final production product must include a **fully integrated demo experience in both the mobile application and the web application** so prospective customers, fleet operators and B2B GPS/VTS businesses can test the product before purchase.

The demo is a deliberate product feature. It must **never be implemented as a production fallback** when real data, authentication, APIs or provider connections fail.

#### 25.3.1 Demo entry points

Mobile login/onboarding should provide a clear option such as:

```text
Explore Demo
```

The public/product web application should provide a clear demo entry point from the landing/login experience.

Demo access must create a server-controlled demo session. Do not expose reusable production credentials or hard-code privileged demo passwords in the client.

#### 25.3.2 Demo personas and scenarios

The demo environment should allow a prospective customer to experience representative product modes, for example:

- Individual vehicle owner;
- multi-vehicle owner;
- Fleet Core customer;
- Public Transport fleet;
- Cargo / Logistics fleet;
- Courier / Delivery fleet;
- B2B GPS/VTS business customer;
- Support workflow;
- Rescue workflow.

The demo should include representative device capability profiles so customers can understand conditional features, for example:

- basic GPS device;
- ignition-capable device;
- relay/engine-control device;
- battery/external-voltage capable device;
- voice-capable device;
- camera/video-capable device.

Unsupported features must still follow the real capability/entitlement rules. The demo must not teach customers that every device supports every feature.

#### 25.3.3 Demo feature coverage

The demo should provide realistic coverage of the final product features that are commercially available, including where applicable:

- vehicle/device list;
- live-map experience using clearly labelled demo/simulated telemetry or controlled demo hardware;
- current status, speed, ignition and last update;
- history/route/trips/stops;
- alerts and high-alert examples;
- geofence and overspeed examples;
- engine OFF/restore workflow demonstration;
- GPS wakeup/device-command workflow demonstration;
- SIM/USSD workflow demonstration where relevant;
- reports and filters;
- subscription/feature visibility;
- support ticket flow;
- rescue/SOS incident flow;
- fleet-management features for subscribed demo personas;
- voice-call monitoring UI where supported by the demo profile;
- audio-recording/live-audio/two-way-audio UI where supported;
- video/live-camera/event-media/playback UI where supported;
- warranty/service/device/SIM operational views where commercially exposed to the relevant persona.

#### 25.3.4 Safe command simulation

A public demo must not control a real customer's vehicle.

High-risk commands such as engine immobilization must run against either:

- a dedicated controlled demo device; or
- an explicit command simulator that follows the same authorization/state machine as production.

The UI must clearly indicate `DEMO / SIMULATED` when a command is simulated. It must still demonstrate:

```text
Capability Check
→ Permission Check
→ Safety Check
→ Hold/Confirm
→ PIN/Biometric simulation where appropriate
→ Requested
→ Sent/Queued/Acknowledged/Failed simulated state
→ Audit entry
```

The demo must never show a false production-style success from an actual failed external command.

#### 25.3.5 Demo data isolation and reset

Demo data must be strictly isolated from production tenant/customer data.

Mandatory rules:

- no production PII in public demo datasets;
- no production tracking-provider admin credentials;
- no cross-tenant access;
- no real customer voice/video/media exposure;
- no real emergency dispatch, Police/Traffic action or irreversible operational action from a public demo;
- demo uploads/changes use an isolated demo store;
- demo state is automatically reset on a configurable schedule or at session expiry;
- demo accounts cannot be upgraded into privileged production accounts without a normal verified onboarding process.

#### 25.3.6 Demo telemetry

Demo telemetry may use:

1. clearly labelled simulated/replayed routes and events; or
2. dedicated controlled demo devices.

Simulated data is permitted **only inside the isolated Demo environment** and must be visibly identified as demo/simulated data.

Production tenants must never silently fall back to simulated telemetry when a provider is unavailable.

#### 25.3.7 Trial with a real customer device

In addition to the public demo, the architecture should support an optional time-limited **real-device trial tenant** for qualified prospects.

A real-device trial must use normal tenant isolation, real authentication, explicit provider/device onboarding, real permission rules and complete audit. It is not the same as the public demo environment.

#### 25.3.8 Demo UX quality

The demo must be presentation-ready because it is a sales tool.

Required behavior:

- no blank/black pages;
- no dead navigation;
- no accidental large empty panels;
- clear sample data on all intentionally demonstrated screens;
- responsive mobile/web layouts;
- clear `Demo` indicator so users do not mistake simulated data for real monitoring;
- guided hints/tooltips may be provided without blocking normal navigation;
- demo scenarios should reset cleanly and remain deterministic enough for sales demonstrations.

#### 25.3.9 Demo analytics

The platform may record privacy-safe demo engagement metrics such as:

- demo started/completed;
- screens/features explored;
- trial request;
- sales-contact request.

Do not collect sensitive location/audio/video information from a prospective user merely because they entered the public demo.

---

## 26. Web Application Requirements

The web application must be responsive from common laptop/desktop widths down through tablet/mobile-web breakpoints.

### 26.1 UX principles

- clean;
- professional;
- dense enough for operations without clutter;
- clear hierarchy;
- responsive cards/tables/panels;
- high-contrast status;
- large touch targets where operational;
- consistent navigation;
- fast device/customer search;
- strong empty/loading/error states.

### 26.2 “No blank space” requirement

This means **no accidental large unused areas, broken panels, empty routes or visually unfinished pages**.

It does **not** mean removing healthy whitespace.

Required behavior:

- desktop uses adaptive multi-column layouts;
- cards stretch/wrap appropriately;
- tables use available width;
- map/report/dashboard panels fill intended workspace;
- sidebar/main-content widths adapt;
- mobile collapses to stacked content/bottom navigation;
- empty datasets show intentional empty-state guidance, not blank screens;
- every navigation item has a real implemented page or is hidden until implemented.

### 26.3 Responsive target

At minimum test:

- ~360–430px mobile;
- ~768–1024px tablet;
- ~1280–1440px laptop/desktop;
- larger desktop screens.

No horizontal overflow should exist except where a dense table intentionally uses a controlled local scroller.

### 26.4 Language-aware responsive design

Bangla and English strings can differ materially in width/height. Responsive layouts must be tested in both languages. Buttons, menus, tables, map overlays, report filters, dialogs and alert cards must not clip, overflow or create large accidental blank areas when language changes.

The web application should use available desktop space productively while preserving professional whitespace. Dense operational roles may use multi-column/filter/table layouts; general customers should receive a simpler layout.

---

## 27. Security and Tenant Isolation

Mandatory:

- real server-side authentication;
- OIDC-compatible future-ready identity architecture;
- server-side RBAC/ABAC/scope checks;
- strict `tenant_id` isolation;
- no cross-tenant fallback;
- no role inference from username prefixes;
- no fail-open login;
- no admin credentials in browser/mobile storage;
- encrypted provider credentials;
- step-up authentication for high-risk commands;
- append-oriented/audited critical actions;
- support/rescue temporary access expiry;
- rate limiting;
- brute-force protection;
- secure session/token lifecycle;
- CSRF/CORS policy as applicable;
- input validation;
- dependency/security scanning;
- secure media URLs/access;
- deletion/export audit.

The application must never show another tenant's devices when the current tenant has zero matching devices.

---

## 28. Data Architecture

Use a modular application architecture with separation between business data and high-volume tracking/media data.

### 28.1 Business data

Examples:

- tenant;
- user/role;
- customer;
- vehicle;
- device registry;
- SIM/M2M;
- subscription;
- support;
- rescue;
- inventory;
- service;
- warranty;
- sales;
- provider configuration;
- audit.

### 28.2 Tracking data

Examples:

- current position;
- telemetry;
- historical positions;
- events;
- command results;
- trips/stops/idle derivations.

### 28.3 Media data

Large video/audio/image files belong in private object storage, not the normal relational transactional database.

Metadata and access/audit records remain in the application database.

### 28.4 Knowledge and reference data

The business/application data architecture must also support separately governed reference/knowledge domains for:

- Vehicle Knowledge Registry;
- Device Knowledge & Capability Registry;
- Regulatory Knowledge & Version Registry;
- source/reference metadata;
- verification status;
- last-verified date;
- AI-extraction review status;
- compatibility mappings between vehicle, device, provider and feature.

These registries are authoritative application reference data only after the applicable verification workflow. AI-generated drafts must remain distinguishable from approved records.

---

## 29. Scalability

Initial launch infrastructure should be sized for real pilot demand, not for the long-term ceiling.

Logical architecture must preserve the wider target of up to **2,000,000 devices** without assuming a single Traccar/provider server.

Use future-ready identifiers such as:

- `tracking_provider_id`;
- `tracking_cluster_id` / routing target;
- `tenant_id`;
- internal device UUID separate from IMEI.

Principle:

> Design for large scale. Build small. Scale infrastructure only when measured load and revenue justify it.

Do not introduce Kubernetes, sharding or complex distributed infrastructure at launch unless actual capacity requires it.

---

## 30. Regulatory and Privacy Requirements

### 30.1 Initial regulatory strategy

Initial service must be structured around licensed/authorized third-party VTS providers where required while the platform acts as the application/business/service layer.

Future self-hosted direct tracking must only be enabled under the legally appropriate licensing/authorization structure.

The exact regulatory classification must be validated against current BTRC/BRTA requirements and, where necessary, qualified legal/regulatory advice before commercial claims are made.

### 30.2 Voice/video privacy

Voice monitoring, recording, live audio, two-way audio, camera/video and location history require explicit privacy and access policies.

Requirements should include as applicable:

- lawful basis/consent/notice;
- role and purpose limitation;
- retention;
- customer/employee/driver policy;
- incident-based access;
- audit;
- export restrictions;
- deletion/legal-hold rules.

### 30.3 Government/law-enforcement access

No generic “police can control any vehicle” design should exist.

Any law-enforcement integration or engine-control access requires an official integration, lawful authority, contractual/policy scope and complete audit.

### 30.4 AI-derived legal and technical information

AI-generated summaries of laws, regulatory notices, vehicle specifications or device capabilities are advisory until the underlying official/approved source and applicability have been verified.

The product must record provenance and verification status and must not market an AI interpretation as a confirmed BRTA/BTRC/Police/Traffic rule.

---

## 31. Launch MVP — Build Now

To reach market quickly, first release should prioritize:

### Customer / individual

- secure login;
- device/vehicle list;
- live/last-known tracking;
- history/trips/stops;
- alerts;
- reports;
- engine ON/OFF where supported;
- GPS wakeup/status command where supported;
- device/SIM status;
- support;
- SOS/rescue request;
- subscription-aware feature visibility;
- voice/video shell for supported subscribed devices.

### Fleet

- Fleet Core;
- role/user manager;
- live fleet map;
- trip/stop/idle/overspeed/geofence;
- core fleet reports;
- selected public-transport functions already validated in existing requirements/code, where commercially needed for launch customers.

### Operations

- tenant/customer/vehicle/device management;
- tracking provider mapping;
- device capability registry;
- command preset registry;
- subscription/entitlement;
- basic device/SIM inventory;
- support portal;
- rescue portal;
- sales/customer onboarding;
- installation/service/warranty basics;
- integration registry;
- audit logs.

### Media

- media metadata/service architecture;
- secure storage integration;
- supported video/audio playback/monitoring as soon as an actual device/provider integration is available.

---

## 32. Architecture-Ready but May Be Phased After Initial Launch

The design must leave clean extension points for:

- full SaaS-managed Traccar cells;
- direct BTRC-authorized operation;
- advanced public-transport pack;
- advanced cargo/courier workflow;
- full device procurement/supplier ERP;
- advanced SIM pooled-billing reconciliation;
- predictive maintenance;
- central sales-as-a-service;
- central support-as-a-service;
- hybrid support levels;
- advanced rescue dispatch network;
- white-label app factory;
- dedicated tenant mobile apps;
- advanced video/ADAS/DMS;
- evidence/legal-hold workflows;
- large-scale analytics;
- multi-region tracking cells;
- main Agency SaaS shared-engine migration.

---

## 33. Migration Path into the Main Agency SaaS

The standalone product must later map into the wider SaaS as follows:

```text
Standalone Vehicle Tracking App
        ↓
Vertical Registration
        ↓
Shared Auth / Entitlement / Brand / Billing / Workflow / Notification
        ↓
Shared Inventory / Procurement / CRM / Service Engines
        ↓
Vehicle Tracking Vertical Pack
        ↓
Tracking Provider Control Plane + Telemetry Platform
```

Avoid permanent tenant-specific forks.

Use stable APIs/events/contracts so modules can later be replaced by shared Agency SaaS engines without rewriting tracking/mobile experiences.

---

## 34. Required QA / Acceptance Rules

Before production launch:

- zero known authentication bypasses;
- zero known tenant-data leakage paths;
- engine command never reports false success;
- every visible navigation item renders a real page;
- no accidental blank/black screens;
- no production tenant silently falls back to demo/fake data; the isolated, clearly labelled product Demo environment is allowed and required;
- no hardcoded localhost links;
- no unverified government API shown as live;
- no GPS TCP port mixed with web API base URL;
- build/type-check/lint pass;
- critical flows have automated tests;
- responsive layouts tested at mobile/tablet/desktop targets;
- provider outage/reconnect tested;
- stale GPS fix clearly differentiated from live fix;
- role/permission tests include Seller, Support and Rescue restrictions;
- support/rescue temporary access expiration tested;
- voice/video access tested against entitlement + capability + permission;
- security logging and audit verified;
- backup/restore tested for production data stores.

---

## 35. Decisions Already Treated as Confirmed in This Baseline

1. Product brand/name is **not final**; “EasyTracker” is temporary only.
2. Launch fast as a standalone tracking application before the wider Agency SaaS is complete.
3. Initial telemetry uses **licensed third-party VTS/tracking providers** where required.
4. Future **self-hosted Traccar** remains planned when licensing/operating conditions allow.
5. Future SaaS-owned BTRC VTS licensing path remains architecturally supported.
6. One tenant/device estate may use **multiple tracking providers**.
7. Third-party devices may send tracking data through provider API while the platform owns the customer application layer and may separately own video/audio storage/services.
8. Voice architecture includes:
   - voice call monitoring;
   - audio recording;
   - live audio stream;
   - two-way audio.
9. Feature visibility is subscription + role + device-capability + safety-policy aware.
10. Fleet customers receive fleet features only when subscribed.
11. Mobile and web must be clean, professional, responsive and free of broken/blank screens or accidental unused layout areas.
12. Existing engine commands, GPS wakeup, SIM/USSD, device presets, accident/high-alert, media watermark/integrity, M2M, SIM ERP, Device ERP, spare parts, support, rescue and location-based auto-task assignment remain part of the requirement unless later explicitly removed.
13. The final mobile and web products include a full, isolated, clearly labelled customer-facing Demo environment; Demo/simulated data must never be used as a silent fallback for production tenants.
14. Bangla and English are mandatory launch languages, and customer-facing menu/action terminology must be understandable to non-technical users.
15. Core product intelligence must work without cloud AI; external AI is an assistive layer, not a dependency for tracking/safety/permission logic.
16. Gemini may be used as an initial external AI provider, but the application must use a provider-agnostic AI Orchestrator and enforce a strict sensitive-data boundary.
17. Vehicle Knowledge, Device Knowledge/Capability and Regulatory Knowledge services are mandatory architecture components.
18. Vehicle/device/regulatory facts extracted by AI require provenance and verification status; AI must not silently approve safety-critical technical data or legal rules.
19. Legacy/current/officially announced upcoming vehicle records are supported; speculative AI-predicted future vehicles are not treated as authoritative catalogue entries.
20. Vehicle-to-device compatibility and purchase recommendations must be registry-driven and can be explained by AI, but not invented by AI.
21. The governing intelligence principle is: **AI assists; verified data and deterministic policy decide.**

---

## 36. Remaining Decisions to Confirm Before Final Approval

These can be finalized without blocking architecture drafting:

1. Final product/brand name.
2. Exact first-launch third-party VTS provider(s) and their official API contracts.
3. Exact first-launch device models/protocols and verified capability profiles.
4. Exact subscription package names/prices and retention durations.
5. Whether support location grants require customer approval, tenant-admin approval, or policy-based automatic grant for defined ticket categories.
6. Rescue operating area, partner model and commercial pricing.
7. Exact legal/privacy wording for voice monitoring, recording and camera services.
8. Exact first-launch fleet pack priority: Public Transport vs Cargo/Logistics vs Courier.
9. Exact payment/renewal method for individual and B2B customers.
10. Exact data retention/archive periods for telemetry, media, audit and evidence.
11. Exact official/regulatory source catalogue and update frequency for BRTA, BTRC, Police and Traffic knowledge monitoring.
12. Exact first-release vehicle manufacturers/markets/years to seed into the Vehicle Knowledge Registry.
13. Exact first-release device manufacturers/models/manuals to seed and technically verify in the Device Knowledge Registry.
14. Whether any production AI use involving sensitive/private operational data will be permitted, and under which paid/privacy-approved AI provider policy.

---

## 37. Recommended Next Specification Sequence

After this requirement baseline is approved, create and approve in order:

1. `PRODUCT_REQUIREMENTS.md`
2. `TRACKING_PROVIDER_ARCHITECTURE.md`
3. `MODULE_FEATURE_ENTITLEMENT_SPEC.md`
4. `DEVICE_KNOWLEDGE_AND_CAPABILITY_REGISTRY.md`
5. `VEHICLE_KNOWLEDGE_REGISTRY_SPEC.md`
6. `REGULATORY_KNOWLEDGE_UPDATE_SPEC.md`
7. `AI_ORCHESTRATION_AND_GUARDRAILS.md`
8. `LOCALIZATION_AND_TERMINOLOGY_STANDARD.md`
9. `USER_ROLES.md`
10. `PERMISSION_MATRIX.md`
11. `COMMAND_AND_SAFETY_POLICY.md`
12. `SUPPORT_ACCESS_POLICY.md`
13. `RESCUE_INCIDENT_POLICY.md`
14. `MEDIA_VOICE_VIDEO_SPEC.md`
15. `FLEET_PACK_ARCHITECTURE.md`
16. `DEVICE_SIM_SERVICE_WARRANTY_SPEC.md`
17. `INTEGRATION_REGISTRY.md`
18. `DATA_PRIVACY_RETENTION_POLICY.md`
19. `SCREEN_LIST_UX_SPEC.md`
20. `DATABASE_SCHEMA.md`
21. `API_CONTRACT.md`
22. `SECURITY_ARCHITECTURE.md`
23. `QA_ACCEPTANCE_PLAN.md`
24. `MIGRATION_TO_AGENCY_SAAS_PLAN.md`

Only after the critical architecture/security specs are approved should Antigravity perform production implementation/refactoring.
