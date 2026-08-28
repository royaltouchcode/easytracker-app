# Customer Types & Commercial Model Specification

**Status:** APPROVED  
**Version:** 1.0  
**Approved Date:** 2026-08-28  
**Product:** Vehicle Tracking Standalone Launch  
**Product Name:** TBD  
**Temporary Working Name:** EasyTracker  
**Authoritative Upstream:** `docs/03_specs/PRODUCT_REQUIREMENTS.md` v1.0 (Commit `abef605`), `docs/03_specs/MODULE_SERVICE_ENTITLEMENT_SPEC.md` v1.0 (Commit `a962a2a`), `docs/03_specs/USER_ROLES_PERMISSIONS_ACCESS_SPEC.md` v1.0 (Commit `25e7834`), `docs/03_specs/TENANT_ISOLATION_SECURITY_BOUNDARY_SPEC.md` v1.0 (Commit `93d7a4e`)  
**Upstream Commits:** `abef605`, `a962a2a`, `25e7834`, `93d7a4e`  
**Approval Basis:** Independent senior review completed, focused corrections and residual corrections applied, and focused final re-review passed with zero blocking findings and complete upstream traceability.  
**Authority Status:** APPROVED DOWNSTREAM SPECIFICATION  
**Purpose:** Define authoritative Customer archetypes, Tenant/Customer commercial relationships, Direct/Fleet/B2B business models, managed-service commercial boundaries, Device/SIM/service relationships and commercial lifecycle without resolving exact pricing/payment/accounting decisions that remain open.

---

## 1. DOCUMENT CONTROL

| Property | Specification |
| :--- | :--- |
| **Document Title** | Customer Types & Commercial Model Specification |
| **Document Identifier** | `docs/03_specs/CUSTOMER_TYPES_COMMERCIAL_MODEL_SPEC.md` |
| **Version** | `1.0` |
| **Status** | APPROVED |
| **Approved Date** | `2026-08-28` |
| **Product Brand** | TBD (Temporary Working Name: EasyTracker) |
| **Project Context** | Standalone Vehicle Tracking Launch (with future Agency SaaS vertical alignment) |
| **Active Development Branch** | `vehicle-tracking-launch-v1` |
| **Authoritative Upstream PRD** | `docs/03_specs/PRODUCT_REQUIREMENTS.md` v1.0 (Commit `abef605`) |
| **Authoritative Entitlement Spec** | `docs/03_specs/MODULE_SERVICE_ENTITLEMENT_SPEC.md` v1.0 (Commit `a962a2a`) |
| **Authoritative Roles & Access Spec**| `docs/03_specs/USER_ROLES_PERMISSIONS_ACCESS_SPEC.md` v1.0 (Commit `25e7834`) |
| **Authoritative Tenant Boundary Spec**| `docs/03_specs/TENANT_ISOLATION_SECURITY_BOUNDARY_SPEC.md` v1.0 (Commit `93d7a4e`) |
| **Upstream Commits** | `abef605`, `a962a2a`, `25e7834`, `93d7a4e` |
| **Approval Basis** | Independent senior review completed, focused corrections and residual corrections applied, and focused final re-review passed with zero blocking findings and complete upstream traceability. |
| **Authority Status** | APPROVED DOWNSTREAM SPECIFICATION |
| **Authority Precedence Index** | `docs/DOCUMENT_AUTHORITY_INDEX.md` |

---

## 2. PURPOSE

- **CTCM-GEN-001 (Purpose Statement):** This specification defines the authoritative customer archetypes, B2B wholesale vs. retail structures, commercial actor relationships, hardware/SIM/service bundling rules, managed service models, and commercial lifecycle governance across the standalone Vehicle Tracking SaaS platform without implementing concrete billing engines or prematurely deciding pricing rate cards.

---

## 3. SCOPE

- **CTCM-GEN-002 (In-Scope Commercial Dimensions):** This specification defines:
  - Supported customer archetypes (Individual, Fleet, B2B GPS/VTS Business) and commercial channel participants (Dealer/Channel).
  - Multi-tenant SaaS boundary vs. Customer Account commercial boundary.
  - Commercial actor definitions (Contracting Customer, Payer, Subscriber, Vehicle Owner, Fleet Operator, Service Beneficiary).
  - Agency Direct-to-Customer, Direct-to-Fleet, and B2B GPS/VTS SaaS wholesale models.
  - Multi-Provider commercial coexistence and independence from SaaS tenant contracts.
  - Managed service modes (Disabled, Tenant Managed, SaaS Managed, Hybrid).
  - Hardware procurement, ownership, warranty, compatibility, and SIM/M2M commercial responsibilities.
  - Subscription hierarchy, base/add-on structures, and candidate fleet pack boundaries.
  - White-label commercial arrangements across branding, domains, and app packaging without code forks.
  - Sales journeys, referral programs, commission ledgers, and dealer margins.
  - Conceptual commercial lifecycle domains (Lead, Order, Payment, Device, Verification, Subscription, Operational, Offboarding).
  - Commercial status vs. operational authorization and provider status segregation.
  - Future main-SaaS ERP alignment and 6 comprehensive commercial matrices.

---

## 4. OUT OF SCOPE

- **CTCM-GEN-003 (Explicit Exclusions):** This specification SHALL NOT define:
  - Concrete pricing rate cards, package fee amounts, or discount percentages (governed by `DEC-004`).
  - Database schemas, SQL DDL, tables, or ORM models.
  - REST API contracts, payment gateway webhooks, or checkout endpoint implementations.
  - Double-entry accounting ledger entries, tax invoice PDF formats, or revenue recognition engines.
  - Payment gateway merchant provider selections (governed by `DEC-008`).
  - Physical warehouse inventory management software or hardware assembly schematics.

---

## 5. AUTHORITY & SOURCE BASIS

- **CTCM-GEN-004 (Governing Precedence):** In accordance with `docs/DOCUMENT_AUTHORITY_INDEX.md`, this specification adheres strictly to:
  1. Approved `docs/03_specs/PRODUCT_REQUIREMENTS.md` v1.0 (Commit `abef605`).
  2. Approved `docs/03_specs/MODULE_SERVICE_ENTITLEMENT_SPEC.md` v1.0 (Commit `a962a2a`).
  3. Approved `docs/03_specs/USER_ROLES_PERMISSIONS_ACCESS_SPEC.md` v1.0 (Commit `25e7834`).
  4. Approved `docs/03_specs/TENANT_ISOLATION_SECURITY_BOUNDARY_SPEC.md` v1.0 (Commit `93d7a4e`).
  5. Approved Reconciliation Audit v1.0 (`docs/02_audit/VEHICLE_TRACKING_REQUIREMENT_RECONCILIATION_AUDIT_V0_1.md`).
  6. Working Requirements Baseline V0.4 (`docs/01_working_requirements/`).
  7. Legacy authority documents (`PRODUCT_MASTER_INSTRUCTION.md`, `PRODUCT_REQUIREMENTS_DOCUMENT.md`).
  8. Implementation code (strictly as evidence, never authority).

---

## 6. DEFINITIONS

- **Customer Archetype:** A primary market profile with distinct commercial requirements, procurement models, and operational relationships.
- **Contracting Customer:** The legal person or corporate entity entering into a binding commercial agreement with the SaaS platform or B2B Tenant.
- **Payer:** The entity legally responsible for settling invoices and subscription charges.
- **Subscriber:** The entity holding an active commercial subscription for one or more vehicle tracking services.
- **Service Beneficiary:** The end user, fleet operator, or vehicle driver directly utilizing operational tracking services.
- **B2B GPS/VTS Business:** A business entity operating as a SaaS Tenant that provides tracking services to its own downstream customers.
- **Dealer / Channel Partner:** An authorized commercial participant (retail stockist, auto dealership, sales partner) referring customers or distributing hardware within an assigned territory.
- **Wholesale Billing Dimension:** A measurable commercial metric (e.g., active devices, enabled modules) used by the SaaS platform to charge a B2B Tenant.

---

## 7. COMMERCIAL MODEL PRINCIPLES

- **CTCM-GEN-005 (Decoupled Commercial Architecture):** Commercial agreements, subscriptions, and payment statuses SHALL NOT substitute for security authorization, device capability truth, or command safety validation.
- **CTCM-GEN-006 (Zero Code Forks for Commercial Customization):** B2B, Fleet, and Individual commercial variations MUST be achieved entirely through configuration, branding, entitlements, and subscriptions on a shared multi-tenant codebase (`PRD-WHT-001`).

---

## 8. CUSTOMER ARCHETYPES

- **CTCM-CUS-001 (Supported Customer Archetypes & Commercial Participants):** The platform formally supports three primary SaaS customer archetypes and one commercial channel participant model:
  1. **Individual / Personal Vehicle Customer:** Private owners of single or multiple vehicles (motorcycles, private cars, CNGs, light trucks).
  2. **Fleet / Organizational Customer:** Commercial organizations operating multiple vehicles (corporate fleets, logistics, couriers, transit).
  3. **B2B GPS / VTS Business:** Independent vehicle tracking service companies operating as SaaS Tenants with their own downstream customer rosters.
  4. **Dealer / Channel Partner:** Commercial sales partners, retail shops, or auto dealerships referring customers or stocking devices. *Dealer/Channel status does not automatically make the entity a SaaS Tenant, downstream Customer, or tracking-data authority.*

---

## 9. TENANT VS CUSTOMER / ACCOUNT

- **CTCM-TEN-001 (Commercial Hierarchy vs Security Perimeter):** In accordance with `TISB-TEN-002`, the commercial hierarchy operates within the logical security structure:
  - *Direct Customers:* Direct individual and fleet customers MUST be represented within an authoritative Tenant/Customer commercial context consistent with the approved Tenant Isolation model. The exact technical tenancy representation remains a downstream architecture and configuration responsibility.
  - *B2B GPS/VTS Company:* Operates as an independent SaaS Tenant containing multiple downstream Customer Accounts.
  - *Customer Account:* A commercial subscription unit within a Tenant that SHALL NEVER be treated as an independent SaaS Tenant unless explicitly provisioned as one.

---

## 10. COMMERCIAL ACTOR CONCEPTS

- **CTCM-CUS-002 (Separation of Commercial Identities):** Commercial actor roles are independent and may be held by distinct entities:
  - **Payer** $
eq$ **Subscriber** $
eq$ **Vehicle Owner** $
eq$ **Driver** $
eq$ **Service Beneficiary**.
  - Example: A corporate employer (Contracting Customer & Payer) subscribes for tracking on a company-owned vehicle operated by an employee (Driver & Service Beneficiary).

---

## 11. COMMERCIAL RELATIONSHIP VS AUTHORIZATION

- **CTCM-CUS-003 (Commercial Status != Security Authority):** Being a Payer, Sales Agent, Dealer, Referrer, or Device Seller SHALL NEVER grant operational tracking permissions, live location visibility, historical route access, or vehicle command authority (`PRD-SLS-002`, `URPA-ROLE-007`, `TISB-ACT-002`).

---

## 12. INDIVIDUAL CUSTOMER MODEL

- **CTCM-CUS-004 (Personal Vehicle Commercial Lifecycle):** Individual customers may purchase tracker hardware, activate bundled or separate SIM/M2M data plans, subscribe to configurable commercial tracking offerings, purchase compatible add-ons (relays, assistance services), and manage multiple personal vehicles under one customer profile.

---

## 13. FLEET CUSTOMER MODEL

- **CTCM-FLT-001 (Fleet Commercial Aggregation):** Fleet customers contract for tracking across multiple vehicles under unified organizational billing, while operational permissions, feature entitlements, and device capabilities remain evaluated per vehicle and fleet group (`URPA-ROLE-006`, `TISB-ACT-004`).

---

## 14. B2B GPS / VTS TENANT MODEL

- **CTCM-B2B-001 (B2B SaaS Tenant Model):** B2B GPS/VTS companies operate as independent SaaS Tenants with the capability to:
  - Procure and register their own hardware devices.
  - Contract and integrate their own Tracking Provider gateways (or utilize SaaS-managed gateways).
  - Manage their own downstream customer accounts and fleet hierarchies.
  - Subscribe to modular SaaS capabilities (Tracking Core, Fleet Dispatch, Sales CRM, Support Desk, Rescue Coordination).
  - Apply custom white-label branding, domains, and app packaging without code forks (`PRD-WHT-001`).

---

## 15. B2B WHOLESALE VS RETAIL

- **CTCM-B2B-002 (Wholesale vs Retail Price Segregation):** The SaaS platform maintains strict separation between:
  - **SaaS Wholesale Charges:** Billed by the SaaS platform to the B2B Tenant (e.g., per active device, per module).
  - **B2B Downstream Retail Pricing:** Billed independently by the B2B Tenant to its end customers.
  The SaaS platform SHALL NOT mandate retail margins, price floors, or price ceilings, and SHALL NOT expose SaaS wholesale rate cards to B2B end customers.

---

## 16. TRACKING PROVIDER COMMERCIAL INDEPENDENCE

- **CTCM-B2B-003 (Provider Contractual Independence):** Commercial agreements with Tracking Providers (licensed third-party VTS gateways, Tenant-owned tracking servers, or SaaS-managed Traccar clusters later where approved) are independent of SaaS Tenant subscriptions (`MSE-PRV-001`, `DEC-002`). Tracking Providers MUST NOT be conflated with cellular SIM/M2M operators. A B2B Tenant may bring its own licensed provider account without altering SaaS platform tenancy.

---

## 17. MANAGED SERVICE MODES

- **CTCM-SVC-001 (Commercial Managed Service Modes):** The platform supports four operational/commercial modes:
  1. **Disabled:** Service module inactive.
  2. **Tenant Managed:** B2B Tenant operates its own staff (e.g., own technicians, own support desk).
  3. **SaaS Managed:** Agency provides operational services (e.g., outsourced technical support or dispatch).
  4. **Hybrid:** Shared operational responsibilities defined by commercial contract.
  *SaaS Managed mode SHALL NOT grant permanent, unrestricted customer tracking access to platform staff* (`URPA-SUP-001`, `TISB-SUP-001`).

---

## 18. SUPPORT COMMERCIAL BOUNDARY

- **CTCM-SUP-001 (Support Commercial Separation):** Commercial purchase of premium Support or Helpdesk packages grants access to diagnostic workflows, but DOES NOT grant unrestricted live vehicle location. Sensitive location tracking requires an active ticket, verified purpose, and time-limited grant under `DEC-005` (`MSE-SUP-002`, `URPA-SUP-001`).

---

## 19. RESCUE COMMERCIAL BOUNDARY

- **CTCM-RSC-001 (Rescue Assistance Commercial Model):** Rescue assistance is an optional, commercially enabled add-on service. The platform does not represent itself as an official statutory emergency authority. Subscribing to Rescue DOES NOT grant permanent vehicle tracking access; access is restricted strictly to active incident dispatches and is promptly auto-revoked upon incident closure (`DEC-006`, `MSE-RSC-002`, `URPA-RSC-001`).

---

## 20. DEVICE COMMERCIAL MODEL

- **CTCM-DEV-001 (Device Commercial States):** Tracking hardware units move through distinct commercial states:
  $$\text{Procured / In Stock} \longrightarrow \text{Sold / Assigned} \longrightarrow \text{Installed} \longrightarrow \text{Active / Subscribed} \longrightarrow \text{Warranty / RMA} \longrightarrow \text{Decommissioned}$$
  Selling a device does not automatically activate a subscription or self-declare unsupported device capabilities (`PRD-DKR-002`).

---

## 21. DEVICE OWNERSHIP VS SERVICE ENTITLEMENT

- **CTCM-DEV-002 (Physical Ownership != Software Entitlement):** Physical ownership of a GPS tracker hardware unit does not grant software service entitlements. Conversely, an active SaaS subscription does not transfer hardware ownership.

---

## 22. DEVICE COMPATIBILITY

- **CTCM-DEV-003 (Compatibility Precondition):** Commercial sales catalogues SHALL only offer features that are verified as supported by the target Device Model in the Device Knowledge Registry. Unknown or unverified capabilities cannot be promised as guaranteed commercial deliverables (`PRD-DKR-002`, `MSE-DEV-001`).

---

## 23. SIM / M2M COMMERCIAL MODEL

- **CTCM-SIM-001 (SIM/M2M Commercial Responsibilities):** Cellular telematics connectivity (SIM/M2M data packages) may be:
  - *Agency Bundled:* Included in the direct SaaS subscription.
  - *B2B Tenant Provided:* Managed by the B2B company under its own telco contract.
  - *Customer Provided:* Customer inserts an authorized, compatible cellular SIM.
  SIM commercial arrangements are independent of software module entitlements, with exact regulatory obligations subject to legal verification where applicable.

---

## 24. INSTALLATION

- **CTCM-SVC-002 (Installation Commercial Relationships):** Tracker installation may be billed as an upfront service fee, bundled into promotional offerings, or arranged through certified third-party installer networks. Purchasing installation triggers a technician work order but grants zero permanent tracking authority (`URPA-TECH-001`, `TISB-TECH-001`).

---

## 25. ACCESSORIES / ADD-ONS

- **CTCM-DEV-004 (Hardware Add-On Commercialization):** Compatible hardware accessories (immobilizer relays, SOS panic buttons, fuel level sensors, dashcam cameras, cabin microphones) may be commercially offered subject to device hardware capability verification (`MSE-DEV-001`).

---

## 26. CUSTOMER SUBSCRIPTION

- **CTCM-SUB-001 (Subscription Governance):** Customer Subscriptions operate within active Tenant Entitlements and are governed by the approved 6-layer feature availability formula (`MSE-ENT-001`). Subscriptions cannot unlock features disabled at the tenant level or unsupported by hardware.

---

## 27. BASE / ADD-ON STRUCTURE

- **CTCM-SUB-002 (Modular Commercial Packaging Framework):** Commercial offerings are structured conceptually into:
  - **Base / Core Commercial Offering:** Core telematics, live map viewing, trip playback, and basic alerts.
  - **Modular Add-Ons:** Engine Disable and Engine Restore commands, geofence suites, maintenance reminders, voice/audio monitoring, dashcam streaming, and specialized fleet packs.
  - **Service Add-Ons:** Rescue coordination, VIP Support, and white-label branding.
  *Exact package names, counts, tier structures, and pricing rate cards remain configurable and governed by `DEC-004`.*

---

## 28. FEATURE MODULE COMMERCIAL RELATIONSHIP

- **CTCM-SUB-003 (Module Mapping to Entitlements & Permissions):** Every commercial package maps deterministically to underlying technical module keys and canonical request permission tokens (e.g., `tracking.core`, `commands.engine_disable.request`, `commands.engine_restore.request`, `voice.monitoring`, `media.dashcam`, `rescue.dispatch`) defined in `MODULE_SERVICE_ENTITLEMENT_SPEC.md` and `USER_ROLES_PERMISSIONS_ACCESS_SPEC.md`.

---

## 29. FLEET PACK COMMERCIAL BOUNDARY

- **CTCM-FLT-002 (Specialized Fleet Packs):** Specialized commercial fleet modules (Public Transport, Cargo & Logistics, Courier & Delivery) represent modular business extensions on the unified telematics core (`PRD-FLT-001`). Launch priority remains governed by `DEC-007`.

---

## 30. WHITE-LABEL COMMERCIAL MODEL

- **CTCM-WHT-001 (White-Label Packaging):** White-label capabilities (custom domains, logos, brand themes, notification templates, support identity, and dedicated mobile app packaging where approved) are available as an enterprise commercial add-on for B2B Tenants without creating software code forks or security bypasses (`PRD-WHT-001`, `TISB-DMO-003`).

---

## 31. DIRECT SALES

- **CTCM-SLS-001 (Sales Commercial Lifecycle):** The direct sales pipeline manages customer acquisition through defined commercial milestones:
  $$\text{Lead / Inquiry} \longrightarrow \text{Device & Plan Selection} \longrightarrow \text{Order Placement} \longrightarrow \text{Payment Settlement} \longrightarrow \text{Installation} \longrightarrow \text{Active Service}$$

---

## 32. NEW CUSTOMER PURCHASE JOURNEY

- **CTCM-SLS-002 (End-to-End Customer Purchase Journey):** The direct customer purchase journey encompasses:
  1. *Browse & Select:* Vehicle type selection, compatible device selection, and commercial plan choice.
  2. *Add-Ons & SIM:* Selection of accessories (relay, audio) and SIM connectivity preference.
  3. *Checkout & Scheduling:* Promo code application, delivery/installation address entry, and payment processing.
  4. *Fulfillment & Verification:* Work order dispatch, technician installation, Device Registry verification, and service activation (`PRD-DKR-002`).

---

## 33. EXISTING CUSTOMER JOURNEY

- **CTCM-SLS-003 (Existing Customer Account Expansion):** Active customers may seamlessly add new vehicles, upgrade commercial plans, purchase add-on modules, renew expiring plans, or request technician maintenance through self-service workflows.

---

## 34. DEMO / TRIAL COMMERCIAL MODEL

- **CTCM-SLS-004 (Demo & Trial Segmentation):**
  - **Public Demo:** Free, unauthenticated demonstration sandbox with simulated vehicle telematics.
  - **Controlled Device Demo:** Supervised demonstration utilizing physical demo trackers.
  - **Real-Device Trial Tenant:** Fully isolated, time-limited trial subscription on live customer hardware (`MSE-DMO-001`, `TISB-DMO-002`).

---

## 35. DEMO-TO-COMMERCIAL CONVERSION

- **CTCM-SLS-005 (Safe Trial Conversion):** Converting from a demo or trial to a paid commercial subscription requires explicit customer checkout confirmation and account provisioning without carrying simulated demo artifacts into production databases (`TISB-DMO-001`).

---

## 36. REFERRAL

- **CTCM-REF-001 (Customer Referral Framework):** Existing customers may generate personalized referral codes and shareable links (and later QR codes where approved) to invite new users, earning configurable Referral Rewards upon successful referee order activation and validation (`PRD-REF-001`).

---

## 37. REFERRAL VS COMMISSION VS MARGIN

- **CTCM-REF-002 (Commercial Incentive Separation):** The platform maintains strict accounting and operational separation between:
  - **Customer Referral Rewards:** Configurable commercial incentives earned by end users, with reward type, amount/value, settlement method, and redemption rules remaining OPEN / TBD / CONFIGURABLE in accordance with approved upstream decisions.
  - **Sales Commissions:** Direct sales performance incentives earned by internal sales agents (`URPA-ROLE-007`).
  - **Dealer / Channel Margins:** Wholesale discount spreads earned by authorized channel partners (`URPA-ROLE-014`).
  *These commercial tracking records are operational ledgers and do NOT constitute double-entry accounting General Ledgers.*

---

## 38. SALES COMMISSION

- **CTCM-CHN-001 (Sales Commission Perimeter):** Sales commissions are calculated based on verified commercial order activations. Earning a sales commission confers zero ongoing access to customer tracking data or live locations (`PRD-SLS-002`).

---

## 39. DEALER / CHANNEL

- **CTCM-CHN-002 (Dealer Commercial Framework):** Authorized dealers receive wholesale pricing on hardware inventory and revenue-share margins on referred subscriptions, bounded strictly to their commercial territory without cross-tenant tracking visibility (`URPA-ROLE-014`).

---

## 40. PROMO / DISCOUNT

- **CTCM-PAY-001 (Promotions & Commercial Discounts):** Configurable promotional codes, seasonal discounts, and volume rebates may be applied during checkout. Discounts modify invoice totals without altering technical entitlements or security policies.

---

## 41. PAYER VS SERVICE USER

- **CTCM-PAY-002 (Payer vs Operator Boundary):** Settlement of invoices by a third-party Payer (e.g., corporate fleet sponsor, family head) does not grant operational tracking permissions over vehicles operated by separate service users.

---

## 42. CONTRACTING PARTY

- **CTCM-CUS-005 (Contracting Party Obligations):** The Contracting Customer holds legal responsibility for subscription terms, service renewals, and billing compliance, while operational vehicle access remains bounded by role assignments.

---

## 43. COMMERCIAL DATA RIGHTS BOUNDARY

- **CTCM-AUD-001 (Commercial Data Privacy):** Commercial transactions, invoice histories, and payment records are private tenant assets governed by strict multi-tenant isolation and the approved TISB data classification model (`TISB-TEN-008`).

---

## 44. PAYMENT CONCEPT

- **CTCM-PAY-003 (Payment Processing Framework):** The commercial model accommodates digital payments (mobile financial services, cards, bank transfers) and manual corporate billing workflows (`DEC-008`). Payment success triggers subscription activation workflows without hardcoding specific payment gateways or billing intervals.

---

## 45. RENEWAL

- **CTCM-PAY-004 (Subscription Renewal Lifecycle):** Subscriptions operate on configurable recurring billing cycles. The platform issues renewal notices prior to expiration, enabling seamless continuation of service according to approved renewal policy.

---

## 46. UPGRADE / DOWNGRADE

- **CTCM-SUB-004 (Subscription Plan Modifications):** Customers may upgrade or downgrade commercial plans. Plan upgrades immediately enable new module entitlements; plan downgrades disable non-renewed entitlements at the end of the current billing period according to downstream billing policy.

---

## 47. CANCELLATION

- **CTCM-LCY-001 (Commercial Cancellation Lifecycle):** Subscription cancellation terminates recurring billing and schedules feature deactivation at the conclusion of the paid term. Historical telemetry remains preserved in accordance with statutory retention policies (`PRD-RET-001`).

---

## 48. SUSPENSION

- **CTCM-LCY-002 (Commercial Delinquency & Suspension):** Commercial delinquency MAY affect subscription and service states in accordance with future approved payment, renewal, grace period, and suspension policies (`TISB-TEN-006`), while preserving account configurations and historical audit records.

---

## 49. SERVICE ACTIVATION

- **CTCM-LCY-003 (Scenario-Dependent Activation Prerequisites):** Tracking and service operational availability requires all APPLICABLE approved commercial, entitlement, Device, Provider, authorization and activation prerequisites for that specific scenario. Applicable prerequisites may include valid Customer/Account relationship, applicable Order/Payment readiness, Device assignment, installation completion where required, Device verification, authoritative Provider mapping, Tenant Entitlement, and Customer Subscription readiness. This is a scenario-dependent governance rule, NOT a single rigid universal state machine.

---

## 50. DEVICE VS SUBSCRIPTION ACTIVATION

- **CTCM-DEV-005 (Technical vs Commercial Activation Separation):** A GPS device may achieve technical communication with a tracking gateway before commercial subscription activation, or a subscription may be active while a device is temporarily offline or pending installation. Telematics data enters customer operational visibility only when all applicable technical and commercial prerequisites are satisfied.

---

## 51. MULTIPLE VEHICLES / SUBSCRIPTIONS

- **CTCM-CUS-006 (Multi-Vehicle Subscription Heterogeneity):** A single customer account may manage multiple vehicles with distinct device models, hardware capabilities, tracking commercial plans, and renewal dates.

---

## 52. FLEET COMMERCIAL AGGREGATION

- **CTCM-FLT-003 (Consolidated Fleet Invoicing):** Organizations operating fleets can aggregate billing across multiple vehicles into consolidated corporate invoices while maintaining per-vehicle device capability validation.

---

## 53. B2B DOWNSTREAM CUSTOMER MANAGEMENT

- **CTCM-B2B-004 (Downstream Customer Administration):** B2B Tenants configure, provision, and manage their downstream customer accounts within their own tenant perimeter, setting user quotas and feature bundles within active tenant entitlements.

---

## 54. B2B RETAIL PRICE CONTROL

- **CTCM-B2B-005 (Independent Retail Pricing Control):** B2B Tenants possess full commercial autonomy to establish retail pricing, service packaging, and billing terms for their downstream end customers.

---

## 55. B2B COMMERCIAL DATA ISOLATION

- **CTCM-B2B-006 (Commercial Confidentiality):** Downstream customer orders, retail pricing matrices, sales commissions, and billing ledgers belonging to B2B Tenant A are strictly isolated from Tenant B and general platform view under the approved TISB data classification model (`TISB-TEN-008`).

---

## 56. WHOLESALE BILLING DIMENSIONS

- **CTCM-B2B-007 (Configurable Wholesale Metrics):** The SaaS platform bills B2B Tenants based on configurable wholesale dimensions:
  - *Base Tenant Subscription:* Fixed monthly platform fee.
  - *Per-Device Metering:* Volume fee per registered or active device.
  - *Module Add-On Fees:* Charges for premium features (Dashcam, Analytics, Voice).
  - *White-Label Licensing:* Branding, custom domain, and packaging fee.

---

## 57. DEVICE PURCHASE / BUNDLE

- **CTCM-DEV-006 (Flexible Hardware Commercialization):** The platform supports both standalone hardware sales (customer pays device upfront) and bundled subscription packages (hardware cost subsidized across subscription commitments).

---

## 58. SIM PURCHASE / BUNDLE

- **CTCM-SIM-002 (SIM Commercial Packaging):** SIM/M2M connectivity may be sold as an unbundled monthly fee or incorporated directly into all-inclusive tracking plans.

---

## 59. INSTALLATION FEE RELATIONSHIP

- **CTCM-SVC-003 (Installation Commercial Models):** Installation fees may be charged upfront during purchase, included in promotional hardware bundles, or settled directly with certified service centers.

---

## 60. SERVICE / MAINTENANCE

- **CTCM-SVC-004 (Service & Field Maintenance):** Field maintenance visits (tracker re-wiring, sensor calibration, antenna adjustments) may be billed per incident or covered under premium maintenance service agreements.

---

## 61. WARRANTY

- **CTCM-DEV-007 (Hardware Warranty Perimeter):** Physical hardware is backed by manufacturer warranties against hardware defects. Warranty coverage is independent of software subscription status.

---

## 62. REPLACEMENT / RMA

- **CTCM-DEV-008 (Device Replacement Commercial Workflow):** Replacing a defective device under RMA executes an authorized re-association workflow without creating new unearned entitlements or silently rewriting historical commercial records (`TISB-SEC-007`). Physical device identity, provider device identity, and vehicle association remain distinct concepts.

---

## 63. ADD-ON COMPATIBILITY

- **CTCM-DEV-009 (Compatibility Pre-Check):** The commercial checkout engine validates hardware compatibility before accepting orders for advanced add-ons (e.g., fuel sensors, camera peripherals).

---

## 64. VOICE / VIDEO COMMERCIAL MODEL

- **CTCM-SUB-005 (Multimedia Commercial Add-Ons):** Dashcam video streaming and cabin voice monitoring represent premium commercial add-ons requiring compatible hardware, network bandwidth provisioning, and applicable legal basis, consent, and privacy controls where verified and applicable (`PRD-VOC-001`, `PRD-VID-001`).

---

## 65. HIGH-RISK COMMAND COMMERCIAL BOUNDARY

- **CTCM-CMD-001 (Command Safety Independence from Commercial Status):** Purchasing a commercial package or add-on DOES NOT bypass Engine Disable / Engine Restore safety policies, safe-state requirements, step-up authentication where required by policy, verified relay capability, or 9-term authorization gates (`MSE-CMD-001`, `URPA-CMD-001`, `TISB-CMD-001`). No fixed numeric speed threshold is mandated as a universal requirement.

---

## 66. PURCHASED VS OPERATIONALLY AVAILABLE

- **CTCM-GEN-007 (Commercial Purchase != Operational Availability):** A purchased feature may be temporarily unavailable due to hardware offline status, provider outages, or lack of GPS fix. Commercial purchasing establishes entitlement, not instantaneous operational availability.

---

## 67. TAX / REGULATORY COMMERCIAL BOUNDARY

- **CTCM-PAY-005 (Tax & Regulatory Compliance):** Invoices and commercial billing records must support applicable statutory taxes (VAT, withholding) and telematics regulatory compliance fees where legally verified and applicable in Bangladesh (LEGAL / FINANCIAL VERIFICATION REQUIRED).

---

## 68. INVOICE CONCEPT

- **CTCM-PAY-006 (Commercial Invoicing):** The platform generates structured commercial invoices detailing device charges, subscription fees, SIM charges, discounts, and applied taxes.

---

## 69. CREDIT / POSTPAID

- **CTCM-PAY-007 (Prepaid and Postpaid Billing Support):** The commercial architecture supports prepaid retail billing (upfront payment required before activation) and postpaid enterprise billing (invoicing on credit terms for qualified corporate fleets) where configured.

---

## 70. REFUND

- **CTCM-PAY-008 (Commercial Refund Governance):** Commercial cancellations and returns follow defined refund policies, adjusting billing ledgers without compromising immutable audit trails.

---

## 71. REWARD LEDGER

- **CTCM-REF-003 (Referral Reward Ledger):** Referral rewards accrue in an operational commercial reward ledger where authorized upstream, redeemable according to approved program terms without prescribing fixed reward forms or values.

---

## 72. COMMISSION LEDGER

- **CTCM-CHN-003 (Sales Commission Operational Records):** Sales performance commissions are tracked in an operational commission ledger for administrative approval and disbursement, distinct from accounting General Ledgers.

---

## 73. COMMERCIAL VS AUTHORIZATION STATUS

- **CTCM-GEN-008 (Commercial Status != Authorization Status):**
  - $	ext{PAID} 
eq 	ext{AUTHORIZED}$
  - $	ext{ACTIVE SUBSCRIPTION} 
eq 	ext{DEVICE CAPABLE}$
  - $	ext{DEALER} 
eq 	ext{LIVE TRACKING ACCESS}$
  - $	ext{RESCUE SUBSCRIBED} 
eq 	ext{PERMANENT LOCATION ACCESS}$

---

## 74. COMMERCIAL VS PROVIDER STATUS

- **CTCM-GEN-009 (Commercial Status != Provider Operational Status):** An active commercial subscription remains valid during temporary upstream Tracking Provider outages without triggering billing errors or fallback to demo states (`TISB-PRV-004`).

---

## 75. COMMERCIAL VS INTEGRATION STATUS

- **CTCM-GEN-010 (Commercial Entitlement != Integration State):** Purchasing an integration add-on does not automatically activate external government gateways (BRTA/BTRC); gateways require verified operational state and `platform.integration.activate` (`TISB-INT-001`).

---

## 76. COMMERCIAL VS DEVICE CAPABILITY

- **CTCM-GEN-011 (Commercial Package Cannot Override Hardware Truth):** A commercial package cannot force an unsupported hardware unit to execute advanced telematics commands.

---

## 77. MULTI-PROVIDER B2B COMMERCIAL MODEL

- **CTCM-B2B-008 (Multi-Gateway Commercial Routing):** B2B Tenants can route distinct fleets across multiple tracking provider gateways under differentiated commercial terms (`MSE-PRV-001`, `TISB-PRV-002`).

---

## 78. WHITE-LABEL CUSTOMER RELATIONSHIP

- **CTCM-WHT-002 (Downstream White-Label Experience):** Downstream customers of a white-label B2B Tenant interact under the B2B company's brand, domain, and support identity while running on the secure shared core platform (`PRD-WHT-001`).

---

## 79. FUTURE DEDICATED APP

- **CTCM-WHT-003 (White-Label App Commercialization):** Standalone branded mobile application builds (iOS / Android) represent optional enterprise white-label add-ons operating on shared core APIs without source code forks.

---

## 80. COMMERCIAL CONFIGURATION OWNERSHIP

- **CTCM-AUD-002 (Commercial Administration Authority):** Platform administrators manage global wholesale rate cards and module entitlements; Tenant administrators configure their own downstream customer packages and retail price lists subject to approved URPA (`URPA-ADM-001`). Fine-grained commercial permission mapping is a downstream IAM specification responsibility.

---

## 81. COMMERCIAL DATA SENSITIVITY

- **CTCM-AUD-003 (Confidentiality of Financial Records):** Commercial wholesale pricing, sales commission rates, customer credit limits, and dealer discount margins are classified under the approved TISB data classification model (`TISB-TEN-008`).

---

## 82. COMMERCIAL AUDITABILITY

- **CTCM-AUD-004 (Commercial Audit Trail):** All subscription activations, plan changes, manual discount overrides, reward approvals, and refund issuances MUST be recorded in immutable audit logs (`PRD-AUD-002`, `URPA-AUD-001`).

---

## 83. EFFECTIVE DATING

- **CTCM-PAY-009 (Effective Dating on Commercial Changes):** Commercial price adjustments, module activations, and subscription renewals execute with precise timestamped effective dates.

---

## 84. COMMERCIAL HISTORY

- **CTCM-AUD-005 (Historical Order Immutability):** Past invoices, completed orders, and historical payment transactions remain permanently immutable, explaining the exact commercial offer active at the time of purchase.

---

## 85. B2B OFFBOARDING

- **CTCM-B2B-009 (B2B Tenant Offboarding):** Terminating a B2B SaaS agreement triggers structured offboarding: disabling new customer provisioning, initiating data export workflows, and managing downstream customer transition in accordance with contractual terms (`TISB-PRVY-001`).

---

## 86. INDIVIDUAL OFFBOARDING

- **CTCM-LCY-004 (Customer Account Offboarding):** Account cancellation ceases billing and archives customer telemetry according to statutory retention schedules, preserving customer hardware ownership (`PRD-RET-001`).

---

## 87. DEVICE / VEHICLE TRANSFER

- **CTCM-DEV-010 (Commercial Transfer Boundaries):** Transferring vehicle ownership to a new party transfers hardware tracking identity but DOES NOT automatically transfer existing subscription balances or expose historical trip records to the new owner (`TISB-SEC-006`).

---

## 88. DEMO / TRIAL DATA

- **CTCM-SLS-006 (Simulated Commercial Data in Demo):** Any pricing, orders, or transactions displayed within the Public Demo environment are strictly simulated and cannot generate real financial liabilities.

---

## 89. PUBLIC COMMERCIAL FRONT-END

- **CTCM-SLS-007 (Public Commercial Presentation):** The public web and mobile portal presents marketing catalogues, hardware device showcases, commercial plan comparisons, and B2B partnership inquiry forms without exposing tenant-private wholesale pricing.

---

## 90. BANGLA + ENGLISH READINESS

- **CTCM-GEN-012 (Bilingual Commercial Presentation):** All commercial catalogues, checkout screens, invoice summaries, and subscription terms MUST fully support both Bangla and English localization (`PRD-GEN-002`).

---

## 91. FUTURE MAIN-SAAS ALIGNMENT

- **CTCM-INT-001 (Main-SaaS ERP Engine Reusability):** The Vehicle Tracking commercial architecture is designed for future integration and reuse with the shared multi-business SaaS ecosystem (CRM, Payment Gateway, Invoicing, Tax, General Ledger) without duplicative code development or creating mandatory standalone launch dependencies.

---

## 92. NO TENANT CODE FORKS

- **CTCM-INT-002 (Configuration-Driven Business Logic):** Commercial differentiation across customer types (Direct B2C, Corporate Fleet, B2B VTS Reseller) is driven strictly via configuration tables, module entitlements, and role permissions without custom code branches (`PRD-WHT-001`).

---

## 93. COMMERCIAL MODEL MATRIX

| Customer Archetype / Commercial Participant | Typical Tenant Relationship | Typical Payer | Typical Service User | Downstream Customers? | Own Provider Allowed? | Multi-Provider Allowed? | Own Retail Pricing? | White-Label Eligible? | Managed Service Eligible? | Notes |
| :--- | :--- | :--- | :--- | :---: | :---: | :---: | :---: | :---: | :---: | :--- |
| **Individual Vehicle Owner** | Authoritative Customer Account Context | Vehicle Owner / Family | Vehicle Owner / Driver | NO | NO | NO | NO | NO | YES | Personal tracking, anti-theft, single/multi-vehicle. |
| **Fleet Organization** | Tenant / Fleet Account Context | Corporate Business | Fleet Drivers / Operators | NO | Configurable | YES | NO | WHERE ENTITLED | YES | Logistics, corporate fleets, transit, public transport. |
| **B2B GPS / VTS Business** | Independent SaaS Tenant | B2B Company | Downstream End Customers | **YES** | **YES** | **YES** | **YES** | **YES** | **YES** | Independent tracking service provider operating as SaaS tenant. |
| **Dealer / Channel Partner** | Commercial Channel Participant | Dealer / Direct Customer | Direct Customer | NO | NO | NO | Margin Spreads | NO | NO | Hardware inventory stockist, subscription referral partner. |

---

## 94. COMMERCIAL COMPONENT MATRIX

| Commercial Component | Separate Component? | May Be Bundled? | Capability Dependency? | Authorization Dependency? | Exact Price Status | Notes |
| :--- | :---: | :---: | :---: | :---: | :---: | :--- |
| **GPS Tracker Hardware** | YES | YES | YES (Device Registry) | NO | Configurable / TBD | Sold standalone or bundled into subscription plans. |
| **Core Tracking Offering** | YES | YES | YES (GPS Engine) | YES (Permissions) | Configurable / TBD | Base telematics platform offering. |
| **SIM / M2M Cellular Data** | YES | YES | YES (Cellular Modem) | NO | Configurable / TBD | Agency bundled, B2B provided, or customer SIM. |
| **Installation Service** | YES | YES | NO | YES (Work Order) | Configurable / TBD | Upfront fee, bundled promo, or service center visit. |
| **Maintenance / Warranty** | YES | YES | NO | YES (Work Order) | Configurable / TBD | Hardware warranty vs paid field maintenance. |
| **Support Package** | YES | YES | NO | YES (Ticket Grant) | Configurable / TBD | Diagnostic default; location requires ticket grant (`DEC-005`). |
| **Rescue Add-On** | YES | YES | NO | YES (Incident Scope)| Configurable / TBD | Optional assistance; auto-revoked on closure (`DEC-006`). |
| **Voice / Cabin Audio** | YES | YES | YES (Microphone) | YES (Audio Perm) | Configurable / TBD | Hardware capability + verified legal basis required (`PRD-VOC-001`). |
| **Dashcam Video Stream** | YES | YES | YES (Camera Peripheral)| YES (Video Perm) | Configurable / TBD | Camera capability + verified legal basis required (`PRD-VID-001`). |
| **White-Label Capabilities** | YES | NO | NO | YES (Tenant Entitle)| Configurable / TBD | Custom domain, logo, theme, notification packaging. |
| **Specialized Fleet Packs** | YES | YES | YES (Sensors/Modules) | YES (Fleet Scope) | Configurable / TBD | Transit, Logistics, Courier packs (`DEC-007`). |

---

## 95. COMMERCIAL ACTOR MATRIX

| Commercial Actor | Commercial Authority | Tracking Data Access Automatically Granted? | Can Set Retail Price? | Can Receive Incentive/Commission? | Tenant Relationship | Notes |
| :--- | :--- | :---: | :---: | :---: | :--- | :--- |
| **Contracting Customer** | Contract signatory & plan holder | **NO** (Requires Role Assignment) | NO | NO | Account / Tenant Context | Legal contracting counterparty. |
| **Payer** | Settles invoices & fees | **NO** | NO | NO | Commercial Contact | Financial sponsor; zero automatic location access. |
| **Subscriber** | Holds active subscription | **NO** (Requires Role Assignment) | NO | NO | Customer Account | Service subscription holder. |
| **Vehicle Owner** | Physical asset owner | YES (for owned vehicles) | NO | NO | Customer Owner | Access bounded to owned vehicles (`URPA-ROLE-015`). |
| **Fleet Operator** | Operational fleet manager | YES (for assigned fleet) | NO | NO | Fleet Manager | Access bounded to fleet group (`URPA-ROLE-006`). |
| **Driver / User** | Vehicle operator | YES (for assigned trip/vehicle) | NO | NO | Driver | Access bounded to assigned vehicle (`URPA-ROLE-016`). |
| **B2B SaaS Tenant** | SaaS platform subscriber | YES (within tenant boundary) | **YES** | NO | SaaS Tenant | Operates independent tracking business on platform. |
| **B2B End Customer** | Retail customer of B2B company | YES (for subscribed vehicles) | NO | NO | B2B Customer Account | Governed by B2B retail agreement. |
| **Dealer / Channel** | Hardware stockist & referrer | **NO** | YES (Margin Spread) | **YES (Dealer Margin)** | Commercial Channel | Territory bounded; zero tracking access (`URPA-ROLE-014`). |
| **Referrer** | Referral code sharer | **NO** | NO | **YES (Referral Reward)**| End Customer | Earns Referral Reward on referee activation (`PRD-REF-001`). |
| **Sales Agent** | Acquisition & order intake | **NO** | NO | **YES (Sales Commission)**| Internal Staff | Commercial order intake; zero tracking access (`URPA-ROLE-007`). |

---

## 96. COMMERCIAL LIFECYCLE MATRIX

*(Note: The following stages represent conceptual examples across separable lifecycle dimensions, NOT a single rigid state machine).*

| Lifecycle Stage | Order Lifecycle State | Device Lifecycle State | Subscription Lifecycle State | Telematics Operational State | Customer Experience |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **1. Prospect / Demo** | None | In Stock / Virtual | None | Public Demo Sandbox | Exploring features, simulated tracking. |
| **2. Ordered** | `ORDERED` | `ASSIGNED` | `PENDING_ACTIVATION` | Isolated / Inactive | Checkout complete, awaiting fulfillment. |
| **3. Paid / Confirmed** | `PAID` | `ASSIGNED` | `PENDING_ACTIVATION` | Isolated / Inactive | Payment settled, installer scheduled. |
| **4. Installed** | `PAID` | `INSTALLED` | `PENDING_ACTIVATION` | Verification Mode | Hardware fitted, technician testing. |
| **5. Verified** | `PAID` | `VERIFIED` | `ACTIVATING` | Gateway Mapped | Registry verified, mapping confirmed. |
| **6. Active Service** | `COMPLETED` | `OPERATIONAL` | `ACTIVE` | **Fully Operational** | Live tracking, alerts, playback active. |
| **7. Renewal Due** | `RENEWAL_PENDING` | `OPERATIONAL` | `ACTIVE` (Grace Mode) | Fully Operational | Renewal notice issued, service continuous. |
| **8. Suspended** | `OVERDUE` | `OPERATIONAL` | `SUSPENDED` | **Fail-Closed / Blocked** | Overdue balance; live tracking disabled. |
| **9. Cancelled** | `CANCELLED` | `DECOMMISSIONED` | `TERMINATED` | Deactivated | Service ended; data archived (`PRD-RET-001`). |
| **10. Offboarded** | `CLOSED` | `TRANSFERRED / PURGED` | `ARCHIVED` | Purged / Ported | Statutory retention & account closed. |

---

## 97. B2B WHOLESALE / RETAIL MATRIX

| Commercial Dimension | Platform / SaaS $\longrightarrow$ B2B Tenant (Wholesale) | B2B Tenant $\longrightarrow$ End Customer (Retail) | Governance Boundary |
| :--- | :--- | :--- | :--- |
| **Contractual Agreement** | SaaS Master Subscription Agreement | Retail Vehicle Tracking Service Agreement | Completely separate legal contracts. |
| **Pricing Model** | Wholesale rate card (per device, per module, base fee) | Retail pricing (monthly fee, bundled plans, upfront) | B2B Tenant sets retail prices autonomously (`CTCM-B2B-005`). |
| **Billing Frequency** | Monthly consolidated enterprise invoice | Monthly, quarterly, or annual retail billing | Distinct invoicing schedules and terms. |
| **Customer Support** | Tier-3 Platform & Infrastructure Support | Tier-1 & Tier-2 Direct Customer Care | B2B manages own customer inquiries. |
| **Tracking Gateway** | Licensed Provider gateway / Traccar cluster | Ingested telematics mapped to B2B vehicles | Multi-provider support preserved (`MSE-PRV-001`). |
| **Hardware Supply** | Agency supplied or B2B procured | B2B supplied to end customer | Verified via Device Knowledge Registry. |
| **SIM / M2M Connectivity** | Agency pool or B2B direct telco contract | Bundled or unbundled retail data plan | Configurable operational responsibility. |
| **Branding & Presentation**| Core Multi-Tenant Platform | Custom White-Label Brand, Domain & Logo | White-label applied without code forks (`PRD-WHT-001`). |

---

## 98. COMMERCIAL DECISION MATRIX

| Commercial Topic | Current Upstream Authority Status | Specification Treatment | Governing Reference |
| :--- | :--- | :--- | :--- |
| **Customer Archetypes** | **DECIDED UPSTREAM** | Formally defined: Individual, Fleet, B2B, Dealer. | `PRD-ROL-001`, `CTCM-CUS-001` |
| **B2B SaaS Model & Separation** | **DECIDED UPSTREAM** | Wholesale vs retail segregation enforced. | `PRD-B2B-001`, `CTCM-B2B-002` |
| **Multi-Provider Architecture** | **DECIDED UPSTREAM** | Fully supported across tenants and fleets. | `MSE-PRV-001`, `TISB-PRV-002` |
| **Managed Service Modes** | **DECIDED UPSTREAM** | Disabled, Tenant Managed, SaaS Managed, Hybrid. | `PRD-SRV-001`, `CTCM-SVC-001` |
| **Exact Price Rates & Cards** | **OPEN DECISION (`DEC-004`)** | Configurable; zero fixed price values hardcoded. | `DEC-004` |
| **Initial Tracking Provider(s)**| **OPEN DECISION (`DEC-002`)** | Configurable multi-provider mapping. | `DEC-002` |
| **Payment Gateway Selection** | **OPEN DECISION (`DEC-008`)** | Configurable digital payment hub framework. | `DEC-008` |
| **Support Location Grant Duration**| **OPEN DECISION (`DEC-005`)**| Ticket-scoped, configurable duration, auto-expiry. | `DEC-005`, `MSE-SUP-002` |
| **Rescue Field Operating Model**|**OPEN DECISION (`DEC-006`)**| Incident-scoped, configurable partner dispatch. | `DEC-006`, `MSE-RSC-002` |
| **Specialized Fleet Pack Launch Order**|**OPEN DECISION (`DEC-007`)**| Modular fleet packs; launch priority configurable. | `DEC-007`, `PRD-FLT-001` |
| **Referral Reward Exact Value** | **CONFIGURABLE** | Reward ledger framework; zero fixed values hardcoded. | `PRD-REF-001`, `CTCM-REF-003` |
| **Sales Commission Percentage** | **CONFIGURABLE** | Commission ledger framework; zero percentages hardcoded.| `URPA-ROLE-007`, `CTCM-CHN-003` |
| **Dealer Margin Spreads** | **CONFIGURABLE** | Wholesale discount spreads; configurable per partner. | `URPA-ROLE-014`, `CTCM-CHN-002` |
| **White-Label Package Pricing** | **CONFIGURABLE** | Commercial add-on framework without code forks. | `PRD-WHT-001`, `CTCM-WHT-001` |
| **Telemetry & Media Retention** | **LEGAL VERIFICATION (`DEC-009/010/011`)**| Statutory retention tiers preserved. | `DEC-009`, `DEC-010`, `DEC-011` |
| **Commercial Product Name** | **OPEN DECISION (`DEC-001`)** | TBD (Temporary Working Name: EasyTracker). | `DEC-001` |

---

## 99. NON-FUNCTIONAL REQUIREMENTS

- **CTCM-NFR-001 (Commercial Configurability):** Package compositions, module bundles, wholesale rates, and promotional discounts MUST be 100% configurable without software redeployment.
- **CTCM-NFR-002 (Financial Auditability):** 100% of subscription state transitions, plan modifications, discount applications, and reward approvals MUST be recorded in immutable audit logs.
- **CTCM-NFR-003 (Tenant Commercial Isolation):** Commercial data belonging to Tenant A (pricing, customer lists, order volumes) SHALL NEVER be accessible or aggregated into Tenant B (`TISB-TEN-008`).
- **CTCM-NFR-004 (Bilingual Experience):** All customer-facing commercial touchpoints MUST support dynamic switching between Bangla and English without string truncation (`PRD-GEN-002`).

---

## 100. ACCEPTANCE CRITERIA

- **CTCM-ACC-001 (Commercial Model Acceptance Gates):**
  1. *Individual Customer Support:* Single-vehicle and multi-vehicle personal tracking accounts operate seamlessly.
  2. *Fleet Organizational Invoicing:* Corporate fleets aggregate billing across multiple vehicles while preserving per-vehicle capability checks.
  3. *B2B SaaS Tenancy:* B2B GPS companies operate as isolated SaaS Tenants managing downstream customer rosters.
  4. *Wholesale / Retail Segregation:* B2B wholesale rates are completely isolated from downstream retail invoices.
  5. *Provider Independence:* B2B Tenants can connect distinct tracking provider gateways without altering tenancy.
  6. *Payer Access Boundary:* Settling a customer invoice grants zero automatic live vehicle tracking permissions.
  7. *Sales Tracking Boundary:* Sales agents receive order commissions with zero access to customer tracking maps.
  8. *Support Commercial Gate:* Purchasing support packages defaults to diagnostics; location requires ticket grants (`DEC-005`).
  9. *Rescue Commercial Gate:* Subscribing to emergency rescue grants zero permanent tracking authority (`DEC-006`).
  10. *Device Ownership Separation:* Hardware ownership does not create software service entitlements without active subscriptions.
  11. *Device Compatibility Truth:* Commercial packages cannot override unverified hardware capabilities (`PRD-DKR-002`).
  12. *SIM Flexibility:* Platform supports Agency-bundled, B2B-provided, and customer-provided SIM/M2M data plans.
  13. *Installation Work Orders:* Installation purchases trigger technician workflows without permanent tracking access.
  14. *Subscription Hierarchy:* Subscriptions are strictly subordinate to Tenant Entitlements and 6-layer availability.
  15. *White-Label Isolation:* White-label customization operates across branding, themes, domains, and app packaging without creating source-code forks or security bypasses.
  16. *Referral vs Commission:* Customer referral rewards and sales agent commissions operate on separate ledgers.
  17. *Prepaid & Postpaid:* Commercial architecture supports prepaid consumer checkout and postpaid corporate billing.
  18. *Command Safety Boundary:* Commercial packages cannot bypass Engine Disable / Engine Restore safety policies, safe-state rules, or 9-term authorization gates (`MSE-CMD-001`, `URPA-CMD-001`).
  19. *Zero Hardcoded Pricing:* Zero mandatory retail prices, discount percentages, or tax rates are hardcoded.
  20. *Future ERP Compatibility:* Commercial model interfaces with shared SaaS CRM, Billing, and Accounting engines without duplicate code.

---

## 101. UPSTREAM TRACEABILITY

| Specification Requirement ID | Upstream PRD ID(s) | Upstream Entitlement Spec ID(s) | Upstream Roles & Access Spec ID(s) | Upstream Tenant Boundary ID(s) | Primary Subject Covered |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **CTCM-GEN-001 to CTCM-GEN-012** | `PRD-GEN-001`, `PRD-GEN-002` | `MSE-GEN-001` to `MSE-GEN-004` | `URPA-GEN-001` to `URPA-GEN-004` | `TISB-GEN-001` to `TISB-GEN-006` | Commercial Scope, Precedence & Principles |
| **CTCM-CUS-001 to CTCM-CUS-006** | `PRD-ROL-001`, `PRD-SLS-002` | `MSE-USR-001` | `URPA-ROLE-015` | `TISB-ACT-003` | Customer Archetypes & Commercial Actors |
| **CTCM-TEN-001** | `PRD-ISO-001`, `PRD-ISO-002` | `MSE-TEN-001`, `MSE-TEN-002` | `URPA-TEN-001`, `URPA-TEN-002` | `TISB-TEN-002` | Tenant vs Customer Account Boundary |
| **CTCM-B2B-001 to CTCM-B2B-009** | `PRD-B2B-001`, `PRD-WHT-001` | `MSE-ADM-001`, `MSE-PRV-001` | `URPA-ROLE-003`, `URPA-ROLE-014` | `TISB-PRV-002`, `TISB-TEN-008` | B2B Model, Wholesale vs Retail, Isolation |
| **CTCM-FLT-001 to CTCM-FLT-003** | `PRD-FLT-001` | `MSE-FLT-001` | `URPA-ROLE-006` | `TISB-ACT-004` | Fleet Customer Model & Fleet Packs |
| **CTCM-DEV-001 to CTCM-DEV-010** | `PRD-DKR-001`, `PRD-DKR-002` | `MSE-DEV-001` | `URPA-DEV-001` | `TISB-TEL-001`, `TISB-SEC-007` | Device Commercial Model, RMA & Compatibility |
| **CTCM-SIM-001, CTCM-SIM-002** | `PRD-TRK-001` | `MSE-TRK-001` | `URPA-PERM-001` | `TISB-TEL-001` | SIM / M2M Commercial Model |
| **CTCM-SUB-001 to CTCM-SUB-005** | `PRD-AUT-001`, `PRD-VOC-001` | `MSE-ENT-001`, `MSE-VOC-001` | `URPA-AUTH-001`, `URPA-MED-001` | `TISB-TEN-001`, `TISB-MED-001` | Subscription Governance & Add-On Modules |
| **CTCM-SVC-001 to CTCM-SVC-004** | `PRD-SRV-001`, `PRD-INS-001` | `MSE-INS-001` | `URPA-ROLE-011`, `URPA-TECH-001` | `TISB-TECH-001` | Managed Service Modes & Installation |
| **CTCM-SUP-001** | `PRD-SUP-001`, `PRD-SUP-002` | `MSE-SUP-002` | `URPA-ROLE-009`, `URPA-SUP-001` | `TISB-SUP-001` | Support Commercial Boundary (`DEC-005`) |
| **CTCM-RSC-001** | `PRD-RSC-001`, `PRD-RSC-002` | `MSE-RSC-002` | `URPA-ROLE-013`, `URPA-RSC-001` | `TISB-RSC-001` | Rescue Commercial Boundary (`DEC-006`) |
| **CTCM-WHT-001 to CTCM-WHT-003** | `PRD-WHT-001` | `MSE-WHT-001` | `URPA-WHT-001` | `TISB-DMO-003` | White-Label Commercial Packaging |
| **CTCM-SLS-001 to CTCM-SLS-007** | `PRD-SLS-001`, `PRD-DMO-001` | `MSE-DMO-001` | `URPA-ROLE-007`, `URPA-DMO-001` | `TISB-DMO-001` | Sales Journeys & Demo Conversions |
| **CTCM-REF-001 to CTCM-REF-003** | `PRD-REF-001` | `MSE-REF-001` | `URPA-PERM-001` | `TISB-TEN-008` | Referral Framework & Reward Ledger |
| **CTCM-CHN-001 to CTCM-CHN-003** | `PRD-SLS-002` | `MSE-ADM-001` | `URPA-ROLE-014` | `TISB-ACT-006` | Sales Commission & Dealer Margins |
| **CTCM-PAY-001 to CTCM-PAY-009** | `PRD-PAY-001` | `MSE-ENT-001` | `URPA-PERM-001` | `TISB-TEN-008` | Payments, Renewals, Invoicing & Taxes |
| **CTCM-LCY-001 to CTCM-LCY-004** | `PRD-RET-001` | `MSE-SYS-001` | `URPA-USER-005` | `TISB-TEN-006`, `TISB-PRVY-001` | Commercial Activation, Suspension & Exit |
| **CTCM-CMD-001** | `PRD-CMD-003`, `PRD-SAF-001` | `MSE-CMD-001` | `URPA-CMD-001` | `TISB-CMD-001` | Command Safety Commercial Independence |
| **CTCM-AUD-001 to CTCM-AUD-005** | `PRD-AUD-002` | `MSE-AUD-001` | `URPA-AUD-001` | `TISB-AUD-001` | Commercial Auditability & History |
| **CTCM-INT-001, CTCM-INT-002** | `PRD-GEN-001` | `MSE-GEN-003` | `URPA-GEN-003` | `TISB-GEN-005` | Main-SaaS Alignment & Zero Code Forks |
| **CTCM-NFR-001 to CTCM-NFR-004** | `PRD-NFR-001` to `PRD-NFR-004`| `MSE-NFR-001` to `MSE-NFR-004`| `URPA-NFR-001` to `URPA-NFR-004`| `TISB-NFR-001` to `TISB-NFR-004`| Non-Functional Commercial Performance |
| **CTCM-ACC-001** | `PRD-GEN-001` | `MSE-GEN-001` | `URPA-GEN-001` | `TISB-ACC-001` | Commercial Acceptance Criteria Gates |

---

## 102. OPEN ITEMS

The following open decisions from approved upstream baselines are carried forward without premature resolution:

| Decision ID | Subject / Topic | Upstream Baseline Status | Status in this Specification |
| :--- | :--- | :--- | :--- |
| **DEC-001** | Final Commercial Product & Brand Name | TBD (Temporary Working Name: EasyTracker) | Supported under neutral multi-brand framework. |
| **DEC-002** | Initial 3rd-Party Licensed VTS Provider(s) | TBD (Candidate examples: GP IoT, Robi, Bondstein) | Supported via multi-provider commercial routing. |
| **DEC-004** | Subscription Package Pricing & Rate Cards | TBD / Configurable per tenant and market policy | Enforced as configurable pricing framework. |
| **DEC-005** | Support Live-Location Grant Exact Duration | Configurable (Ticket-scoped, explicit grant, auto-expiry) | Enforced as diagnostic default + ticket grant. |
| **DEC-006** | Rescue Field Operating Model | TBD / Configurable by tenant operational policy | Enforced as optional add-on + prompt revocation. |
| **DEC-007** | Specialized Fleet Pack Launch Rollout Order | TBD based on initial anchor customer demand | Preserved as modular commercial add-ons. |
| **DEC-008** | Payment Gateway Provider Selection | TBD / Integration candidate selection | Preserved as digital payment gateway framework. |
| **DEC-009** | Telemetry Raw Data Retention Duration | TBD + Statutory legal/privacy verification required | Commercial model preserves statutory tiers. |
| **DEC-010** | Crash Video Clip Retention Duration | TBD + Statutory legal/privacy verification required | Commercial model preserves statutory tiers. |
| **DEC-011** | Cabin Voice Recording Retention Duration | TBD + Statutory legal/privacy verification required | Commercial model preserves statutory tiers. |
| **DEC-014** | Production AI Sensitive Data Class Approval | Zero PII / live telemetry sent to free cloud AI models | Strict commercial data privacy perimeter enforced. |

---

## 103. LEGAL / FINANCIAL VERIFICATION ITEMS

- **B2B Retail Terms & Reseller Compliance:** B2B commercial agreements and downstream retail pricing models must comply with applicable telematics reseller regulations and commercial trade laws where legally verified and applicable in Bangladesh.
- **Taxation & Invoicing Regulations:** Commercial invoice structures, VAT calculations, and withholding tax treatments remain subject to statutory financial verification in Bangladesh (LEGAL / FINANCIAL VERIFICATION REQUIRED).
- **M2M Connectivity & Telco Licensing:** Commercial SIM/M2M data bundling and telco partnerships operate in accordance with applicable telematics data communication guidelines where legally verified and applicable.
- **Consumer Protection & Refund Policies:** Retail subscription cancellation and refund workflows must align with statutory consumer rights and trade practices where legally verified and applicable.

---

## 104. BLOCKING QUESTIONS

> **Zero Blocking Questions.**  
All customer archetypes, B2B wholesale vs. retail models, commercial actor relationships, hardware/SIM bundling rules, and commercial lifecycle states are fully specified based on approved `PRODUCT_REQUIREMENTS.md` v1.0, `MODULE_SERVICE_ENTITLEMENT_SPEC.md` v1.0, `USER_ROLES_PERMISSIONS_ACCESS_SPEC.md` v1.0, and `TENANT_ISOLATION_SECURITY_BOUNDARY_SPEC.md` v1.0.

---

## 105. SPECIFICATION VERDICT

> # **CUSTOMER TYPES & COMMERCIAL MODEL APPROVED — AUTHORITATIVE BASELINE**

This authoritative downstream specification strictly adheres to approved Product Requirements Document v1.0 (`abef605`), Module & Service Entitlement Specification v1.0 (`a962a2a`), User Roles, Permissions, Authority & Access Specification v1.0 (`25e7834`), and Tenant Isolation & Security Boundary Specification v1.0 (`93d7a4e`), formalizes the complete commercial domain architecture for the multi-tenant SaaS platform, and is formally approved as the authoritative downstream specification baseline for Customer Types & Commercial Model architecture.
