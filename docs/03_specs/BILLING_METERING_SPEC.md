# Billing & Metering Operations Specification

**Document Title:** Billing & Metering Operations Specification  
**Canonical Document Identifier:** `docs/03_specs/BILLING_METERING_SPEC.md`  
**Status:** APPROVED  
**Version:** v1.0  
**Draft Date:** 2026-09-19  
**Approval Date:** 2026-09-21  
**Requirement Namespace:** `BMS-*`  
**Acceptance Gate Namespace:** `GATE-BMS-##`  
**Approval State:** APPROVED (v1.0 Canonical Specification)

---

## 1. Document Control & Authority Precedence

- **BMS-GEN-001 (Governing Authority Precedence & Specification Scope):**
  - In strict compliance with `docs/03_specs/PRODUCT_REQUIREMENTS.md` (`PRD-GEN-001`, `PRD-BIL-001`, `PRD-LCH-001`, `PRD-LCH-002`) and approved downstream architecture specifications, this specification establishes the normative commercial charge calculation, subscription lifecycle management, meter classification, usage-event intake, commercial invoicing, payment abstraction, and ledger accounting boundaries for the standalone Vehicle Tracking product.
  - Authority Precedence Order:
    1. Latest explicit approved user directives.
    2. Approved downstream specifications (`MODULE_SERVICE_ENTITLEMENT_SPEC.md`, `USER_ROLES_PERMISSIONS_ACCESS_SPEC.md`, `TENANT_ISOLATION_SECURITY_BOUNDARY_SPEC.md`, `CUSTOMER_TYPES_COMMERCIAL_MODEL_SPEC.md`, `TRACKING_PROVIDER_ARCHITECTURE_SPEC.md`, `DEVICE_CAPABILITY_REGISTRY_SPEC.md`, `VEHICLE_KNOWLEDGE_REGISTRY_SPEC.md`, `REGULATORY_KNOWLEDGE_SERVICE_SPEC.md`, `COMMAND_SAFETY_EXECUTION_SPEC.md`, `FLEET_PACK_SPEC.md`, `SALES_SUPPORT_RESCUE_SPEC.md`, `SIM_M2M_DEVICE_INVENTORY_SPEC.md`, `SERVICE_WARRANTY_RMA_SPEC.md`, `MEDIA_VOICE_VIDEO_SPEC.md`, `INTEGRATION_REGISTRY_API_SYNC_SPEC.md`).
    3. Approved `docs/03_specs/PRODUCT_REQUIREMENTS.md`.
    4. Approved upstream architecture documents.
    5. Actual repository evidence.
    6. Downstream architectural composition only where required and not prohibited.
    7. Unresolved upstream decisions remain unresolved.
  - Contaminated prior discovery reports, conversational summaries, and scratch files possess zero normative authority.
  - *Authority Classification:* DIRECT UPSTREAM (`PRD-GEN-001`, `PRD-BIL-001`, `PRD-LCH-001`, `PRD-LCH-002`).

---

## 2. Canonical Approved Commit Baseline

This specification derives exclusively from the approved canonical Git commit baseline:

| Specification Document | Approved Canonical Commit | Commit Subject Summary |
| :--- | :--- | :--- |
| `docs/03_specs/PRODUCT_REQUIREMENTS.md` | `abef60593db6a34c144341f9c70503c5bda7faa6` | `docs: approve vehicle tracking product requirements v1.0` |
| `docs/03_specs/MODULE_SERVICE_ENTITLEMENT_SPEC.md` | `a962a2a22a55060aea6d4efd630b2f209943adba` | `docs: approve module service entitlement spec v1.0` |
| `docs/03_specs/USER_ROLES_PERMISSIONS_ACCESS_SPEC.md` | `25e783447c96d3128f8ebaa51c78e8c0f6ec85de` | `docs: approve user roles permissions access spec v1.0` |
| `docs/03_specs/TENANT_ISOLATION_SECURITY_BOUNDARY_SPEC.md` | `93d7a4eb11d37d229844f86fec2b05434c309fc3` | `docs: approve tenant isolation security boundary spec v1.0` |
| `docs/03_specs/CUSTOMER_TYPES_COMMERCIAL_MODEL_SPEC.md` | `401414171edd1612394980ef9a734a859fed21b6` | `docs: approve customer types commercial model spec v1.0` |
| `docs/03_specs/TRACKING_PROVIDER_ARCHITECTURE_SPEC.md` | `88bcd536cd252c1419d49887370be1993738ba91` | `docs: approve tracking provider architecture spec v1.0` |
| `docs/03_specs/DEVICE_CAPABILITY_REGISTRY_SPEC.md` | `5c9fe52c8350167a880fcea38d3654a2c00dcb31` | `docs: approve device capability registry spec v1.0` |
| `docs/03_specs/VEHICLE_KNOWLEDGE_REGISTRY_SPEC.md` | `0e60ce3484c307b0451c46c120711ef0cef3acca` | `docs: approve vehicle knowledge registry spec v1.0` |
| `docs/03_specs/REGULATORY_KNOWLEDGE_SERVICE_SPEC.md` | `d26153bce8b6eab21fbf0b50fd8c176aeb8feb40` | `docs: approve regulatory knowledge service spec v1.0` |
| `docs/03_specs/COMMAND_SAFETY_EXECUTION_SPEC.md` | `ebccd291d8d14152b30c7591c10b4b6eab20afa5` | `docs: approve command safety execution spec v1.0` |
| `docs/03_specs/FLEET_PACK_SPEC.md` | `220ac0d90d76db36d5e03b117bc0e8bcb2264651` | `docs: approve fleet pack spec v1.0` |
| `docs/03_specs/SALES_SUPPORT_RESCUE_SPEC.md` | `97cd0704454b87c4a9474c2675a533ec2cb67f76` | `docs: approve sales support rescue specification v1.0` |
| `docs/03_specs/SIM_M2M_DEVICE_INVENTORY_SPEC.md` | `4542f84b0a9b2fd78c49376fb916bc41c4761c91` | `docs: approve sim m2m device inventory specification v1.0` |
| `docs/03_specs/SERVICE_WARRANTY_RMA_SPEC.md` | `c8d8dbdbb1d67e0691c311993890b1f228dd01b5` | `docs: approve service warranty rma specification v1.0` |
| `docs/03_specs/MEDIA_VOICE_VIDEO_SPEC.md` | `20037e34a2396ea03fb65f1eff7f7427761038c3` | `docs: approve media voice video specification v1.0` |
| `docs/03_specs/INTEGRATION_REGISTRY_API_SYNC_SPEC.md` | `1d56517dab3f23c5ce282620a1f4efada6728942` | `docs: approve integration registry api sync specification v1.0` |

---

## 3. Purpose, Scope & Non-Goals

### Purpose
Define the architectural foundations of billing, metering, invoicing, payment abstraction, and operational financial ledger boundaries for the Vehicle Tracking standalone launch, guaranteeing clean domain decoupling (`PRD-LCH-002`) and multi-tenant security (`TISB-SEC-002`).

### In-Scope
1. Commercial subscription state set management (`PRD-SUB-001`).
2. Multi-tier charge calculation and invoice structuring (`PRD-BIL-001`, `CTCM-PAY-006`).
3. Five-tier meter classification and operational vs billable metric separation.
4. Usage event ingestion interfaces from entitlement (`MSE-BIL-001`) and media (`MVV-ENT-003`).
5. Payment gateway abstraction (`PRD-COM-003`, `CTCM-PAY-003`, `DEC-008`).
6. Authoritative backend payment confirmation rules (`MSE-PAY-001`).
7. Commercial refund policy governance (`CTCM-PAY-008`).
8. Three independent operational financial ledgers (`PRD-REF-004`).
9. Statutory tax/fiscal readiness (`CTCM-PAY-005`, `LEGAL / FINANCIAL VERIFICATION REQUIRED`).
10. Immutable audit trail logging for billing adjustments (`PRD-AUD-002`).

### Explicit Non-Goals
1. Constructing a double-entry General Ledger or corporate accounting ERP.
2. Hardcoding specific retail prices, currency rates, volume slab bands, or discount curves (`DEC-004`).
3. Selecting or locking in specific payment gateway vendors or merchant accounts (`DEC-008`).
4. Mandating physical database schemas, SQL DDL, tables, ORM entities, or RLS policies.
5. Inventing specific messaging brokers (Kafka, RabbitMQ, SQS) or PDF rendering engines.
6. Calculating wholesale cellular data overage costs (`CARRIER API NOT ESTABLISHED UPSTREAM`).
7. Calculating wholesale tracking provider socket gateway fees (`TPA-COM-002`).

---

## 4. Core Entity & Commercial Separation

- **BMS-GEN-002 (Core Entity & Commercial Actor Separation):**
  - In strict compliance with `CUSTOMER_TYPES_COMMERCIAL_MODEL_SPEC.md` (`CTCM-CUS-001`, `CTCM-CUS-005`, `CTCM-PAY-002`, `CTCM-GEN-002`) and `TENANT_ISOLATION_SECURITY_BOUNDARY_SPEC.md` (`TISB-TEN-001`, `TISB-ACT-003`), the platform strictly maintains the independent identity and isolation of commercial actors:
    $$\text{Tenant} \neq \text{Customer} \neq \text{Customer Account} \neq \text{Contracting Customer} \neq \text{Subscriber} \neq \text{Payer} \neq \text{Vehicle Owner} \neq \text{Driver}$$
  - Contracting Customer carries legal and contractual obligations for subscription agreements and billing compliance (`CTCM-CUS-005`).
  - Subscriber holds the active commercial service plan.
  - Payer is a commercial actor responsible for invoice settlement. In accordance with `CTCM-PAY-002`, Payer status confers ZERO operational tracking, location viewing, or vehicle command authority over assets operated by separate users.
  - Vehicle Owner holds legal vehicle asset title. Ownership of Vehicle A grants zero rights over Vehicle B.
  - Driver is an operational vehicle operator holding zero commercial, administrative, or billing authority.
  - Tracking Provider is an external telematics gateway entity, distinct from SaaS Tenant and Customer.
  - SIM/M2M Carrier is a telecommunication connectivity supplier, distinct from Tracking Provider and SaaS Tenant.
  - *Authority Classification:* DIRECT UPSTREAM (`CTCM-CUS-001`, `CTCM-CUS-005`, `CTCM-PAY-002`, `CTCM-GEN-002`, `TISB-TEN-001`, `TISB-ACT-003`).

- **BMS-GEN-003 (Fundamental Commercial Invariants):**
  - In accordance with `CTCM-GEN-008`, `CTCM-GEN-009`, `MSE-ENT-001`, `CSE-ACK-001`, and `DCR-CAP-001`, the system enforces absolute domain decoupling:
    1. $\text{PAID} \neq \text{AUTHORIZED}$
    2. $\text{ACTIVE SUBSCRIPTION} \neq \text{DEVICE CAPABLE}$
    3. $\text{CUSTOMER SUBSCRIPTION} \neq \text{TENANT ENTITLEMENT}$
    4. $\text{CUSTOMER SUBSCRIPTION} \neq \text{PROVIDER ACTIVE}$
    5. $\text{ENTITLEMENT} \neq \text{PERMISSION}$
    6. $\text{PAYER} \neq \text{OPERATOR}$
    7. $\text{TRACKING PROVIDER} \neq \text{SAAS TENANT}$
    8. $\text{SIM CARRIER} \neq \text{TRACKING PROVIDER}$
  - Commercial payment, positive invoice settlement, or active subscription plan status SHALL NEVER manufacture:
    - Hardware device capability in the Device Capability Registry (DCR).
    - Vehicle mechanical or CAN compatibility in the Vehicle Knowledge Registry (VKR).
    - Live-location diagnostic access in Customer Support (`SSR-SUP-003`).
    - Emergency rescue operational access without assigned active incident (`CSE-RSC-001`).
    - High-risk `Engine Disable` or sensitive `Engine Restore` command execution authority without satisfying all Command Safety Execution (CSE) interlocks.
  - *Authority Classification:* DIRECT UPSTREAM (`CTCM-GEN-008`, `CTCM-GEN-009`, `MSE-ENT-001`, `CSE-ACK-001`, `DCR-CAP-001`).

- **BMS-GEN-004 (Billing Account Entity Prohibition & Deferral):**
  - The repository authority baseline defines zero canonical domain entity named `Billing Account` or `billing_account`.
  - All commercial billing accounts, invoice histories, and payment records MUST attach strictly to the canonical `Tenant`, `Customer`, and `Customer Account` entities established in `CTCM-CUS-001` and `TISB-TEN-001`.
  - The platform SHALL NOT fabricate an unapproved intermediate `Billing Account` relational schema or service boundary:
    `BILLING ACCOUNT ENTITY NOT ESTABLISHED UPSTREAM`.
  - *Authority Classification:* DOWNSTREAM ARCHITECTURAL COMPOSITION (Preserving `CTCM-CUS-001`, `TISB-TEN-001`).

- **BMS-GEN-005 (Technology & Implementation Neutrality):**
  - In accordance with `PRD-DAT-001`, `PRD-SCL-001`, and `TISB-NFR-001`, the billing and metering architecture specifies logical boundaries and SHALL NOT mandate:
    - Specific cloud payment platforms or vendor APIs (e.g. Stripe).
    - Distributed messaging middleware (Kafka, RabbitMQ, SQS, Redis Streams).
    - Physical database engines, schema DDL, foreign keys, or ORM entities.
    - Specific PDF template engines, cron job expressions, or background scheduler technologies.
  - *Authority Classification:* DOWNSTREAM ARCHITECTURAL COMPOSITION (`PRD-DAT-001`, `PRD-SCL-001`).

---

## 5. Customer Subscription Lifecycle & Renewal

- **BMS-SUB-001 (Canonical Customer Subscription State Set):**
  - In strict accordance with `PRD-SUB-001`, the platform manages customer subscription lifecycles across exactly 6 canonical states:
    1. `TRIAL`
    2. `ACTIVE`
    3. `GRACE_PERIOD`
    4. `SUSPENDED`
    5. `EXPIRED`
    6. `CANCELLED`
  - *State Set Preservation Invariant:* `PRD-SUB-001` establishes the authoritative state set. It does NOT establish a complete, mandatory, single-path transition graph. The billing engine MUST NOT enforce an unapproved rigid linear arrow sequence (e.g. mandating `TRIAL` before `ACTIVE` or forbidding direct transitions to `CANCELLED` or `SUSPENDED`).
  - *Authority Classification:* DIRECT UPSTREAM (`PRD-SUB-001`).

- **BMS-SUB-002 (Multi-Channel Renewal Notification Lifecycle):**
  - In accordance with `PRD-SUB-002` and `CTCM-PAY-004`, the system SHOULD issue automated multi-channel renewal reminders (in-app notifications, SMS, email) prior to subscription expiration.
  - Upon subscription expiration without renewal, the system automatically evaluates configurable grace period rules (`GRACE_PERIOD`) before transitioning the account to commercial suspension (`SUSPENDED`) or feature downgrade (`PRD-SUB-002`, `CTCM-LCY-002`).
  - Transition to `EXPIRED` or `SUSPENDED` terminates active vehicle tracking displays but MUST NOT trigger deletion of historical telemetry logs (`MSE-DNG-001`, `CTCM-LCY-001`).
  - *Authority Classification:* DIRECT UPSTREAM (`PRD-SUB-002`, `CTCM-PAY-004`, `MSE-DNG-001`).

- **BMS-SUB-003 (Multi-Vehicle Heterogeneous Packaging):**
  - In accordance with `MSE-SUB-002` and `CTCM-CUS-006`, a single customer account managing multiple vehicles MUST be permitted to assign distinct commercial subscription packages (e.g. Basic Tracking for Bike A, Advanced Security + Video for Car B) to different vehicles within the same account.
  - Each vehicle subscription calculates its renewal date, rate-card tier, and add-on modules independently while aggregating into a unified customer billing statement.
  - *Authority Classification:* DIRECT UPSTREAM (`MSE-SUB-002`, `CTCM-CUS-006`).

---

## 6. Entitlement / Subscription Boundary

- **BMS-ENT-001 (Subscription Subordination to Tenant Entitlement):**
  - In accordance with `MODULE_SERVICE_ENTITLEMENT_SPEC.md` (`MSE-SUB-001`, `MSE-ENT-001`), a customer account's active subscription MUST be a strict subset of the parent tenant's active entitlement.
  - If a parent tenant's entitlement to a module (e.g. `MOD-VID-12` Dashcam Video) is disabled, suspended, or not licensed, no customer subscription within that tenant can activate that feature, regardless of payment.
  - Governing 6-Layer Availability Formula (`MSE-ENT-001`):
    $$\text{Feature Available} = \text{Platform Capability} \land \text{Tenant Entitlement} \land \text{Customer Subscription} \land \text{User Permission / Scope} \land \text{Device Capability} \land \text{Safety / Workflow Policy}$$
  - Billing evaluations confirm commercial payment eligibility for Term 3 (`Customer Subscription`), but cannot override or substitute for any other term.
  - *Authority Classification:* DIRECT UPSTREAM (`MSE-SUB-001`, `MSE-ENT-001`).

- **BMS-ENT-002 (Entitlement vs Customer Subscription Lifecycle Separation):**
  - Entitlement lifecycle states defined in `MSE-LFC-001`:
    $$\text{PROVISIONED} \longrightarrow \text{ACTIVE} \longleftrightarrow \text{SUSPENDED} \longrightarrow \text{EXPIRED} \longrightarrow \text{REVOKED}$$
  - Entitlement lifecycle operates at the SaaS Tenant licensing boundary.
  - Customer Subscription lifecycle operates at the commercial customer account boundary across the 6 states of `PRD-SUB-001`.
  - The billing engine MUST NOT conflate or merge tenant entitlement state transitions with end-customer subscription state transitions.
  - *Authority Classification:* DOWNSTREAM ARCHITECTURAL COMPOSITION (Preserving `MSE-LFC-001` and `PRD-SUB-001`).

- **BMS-ENT-003 (Clean Conversion Boundary from Demo / Trial):**
  - In accordance with `MSE-CONV-001` and `PRD-PUR-001`, converting a customer from Demo (`MOD-DMO-20`) or Trial (`PRD-SUB-001`) to an active paid subscription MUST create fresh production identity, billing, and device records.
  - Simulated demo telemetry, synthetic trips, or mock device configurations SHALL NEVER be imported or converted into production billing or tracking databases.
  - *Authority Classification:* DIRECT UPSTREAM (`MSE-CONV-001`, `PRD-PUR-001`).

---

## 7. Pricing, Rate Cards & Commercial Discounts

- **BMS-PRC-001 (Subscription Package Tiers & Configurable Rate Cards):**
  - In accordance with `PRD-COM-001`, `PRD-COM-002`, and `PRD-BIL-001`, the commercial billing engine supports:
    1. Configurable subscription tiers (e.g. Basic Tracking, Advanced Security, Enterprise Fleet, Specialized Packs).
    2. Tenant-configurable rate cards and volume discount slabs across active device counts.
    3. Multi-tenant white-label markup capability for B2B GPS tracking companies (`PRD-CUST-008`).
  - Open Decision Preservation (`DEC-004`): Subscription package pricing, currency figures, and rate cards remain `TBD / Configurable per tenant and market policy`. The billing engine SHALL NOT hardcode specific prices (e.g. BDT or USD figures), fixed tier thresholds, or currency conversion algorithms:
    `AUTHORITY GAP — SUBSCRIPTION PRICING AND RATE CARDS UNRESOLVED (DEC-004)`.
  - *Authority Classification:* DIRECT UPSTREAM (`PRD-COM-001`, `PRD-COM-002`, `PRD-BIL-001`, `DEC-004`).

- **BMS-PRC-002 (Commercial Discounts, Promotions & Volume Rebates):**
  - In accordance with `CTCM-PAY-001`, promotional codes, seasonal discounts, and corporate volume rebates MAY be applied during customer checkout or invoice calculation.
  - Promotional discounts adjust invoice totals and commercial billing calculations, but SHALL NOT modify technical entitlements, IAM role permissions, device capabilities, or command safety policies.
  - *Authority Classification:* DIRECT UPSTREAM (`CTCM-PAY-001`).

---

## 8. Meter Classification Model

- **BMS-MTR-001 (Five-Tier Meter Classification Model):**
  - To prevent architectural corruption where operational technical counters are improperly monetized or continuous meters are invented without authority, the billing engine classifies all measurable platform dimensions into exactly 5 distinct classes:
    1. **Class A: DIRECTLY ESTABLISHED BILLING BASIS:** Approved primary unit of commercial subscription pricing.
    2. **Class B: USAGE EVENT EMITTED TO BILLING:** Structured event emitted by an operational engine into the billing pipeline for future rating. Emitted usage events do NOT constitute billable meters until rated.
    3. **Class C: OPERATIONAL METRIC ONLY:** Technical counter, pipeline volume, or safety guardrail. Strictly prohibited from direct commercial billing or customer invoicing.
    4. **Class D: COMMERCIAL CHARGE CONCEPT BUT NO METER:** Approved commercial fee line item on an invoice, but evaluated on an event or contract basis rather than continuous usage metering.
    5. **Class E: NOT ESTABLISHED:** Dimension having zero approved usage, metering, or billing authority upstream.
  - *Authority Classification:* DOWNSTREAM ARCHITECTURAL COMPOSITION (`PRD-BIL-001`, `MSE-BIL-001`, `MVV-ENT-003`).

- **BMS-MTR-002 (Authoritative Classification of Platform Dimensions):**
  - Every measurable dimension in the Vehicle Tracking standalone launch baseline is mapped to its verified classification:

| Measurable Dimension | Upstream Authority Citation | Authoritative Meter Classification | Normative Operational & Billing Rule |
| :--- | :--- | :--- | :--- |
| **Vehicle / device subscription count** | `PRD-BIL-001`, `PRD-COM-001` | **Class A: DIRECTLY ESTABLISHED BILLING BASIS** | Primary billable unit for recurring vehicle subscription billing. |
| **Active vehicle count** | `MSE-BIL-001` | **Class B: USAGE EVENT EMITTED TO BILLING** | Emitted by entitlement engine for automated monthly invoice rating. |
| **Tenant platform fee** | `PRD-BIL-001` | **Class D: COMMERCIAL CHARGE CONCEPT BUT NO METER** | Invoiced platform fee component; slab formulas unestablished. |
| **SIM charge** | `CTCM-PAY-006`, `PRD-BIL-001` | **Class D: COMMERCIAL CHARGE CONCEPT BUT NO METER** | Invoiced SIM retail charge line; carrier wholesale cost separate. |
| **SIM data usage (MB/GB)** | `PRD-SIM-002`, `SMDI-SIM-001` | **Class C: OPERATIONAL METRIC ONLY** | Tracked for recharge alerts; cellular data consumption billing unestablished. |
| **Telemetry volume** | `PRD-DAT-001`, `PRD-SCL-001` | **Class C: OPERATIONAL METRIC ONLY** | Telemetry ingestion pipeline volume; zero per-packet or per-point billing. |
| **API calls** | `PRD-API-001`, `PRD-SEC-003` | **Class C: OPERATIONAL METRIC ONLY** | Technical rate-limiting guardrail; zero monetized API metering. |
| **Media storage** | `PRD-BIL-001`, `MSE-BIL-001`, `MVV-ENT-003` | **Class B: USAGE EVENT EMITTED TO BILLING** | Emitted as storage bytes committed; rate cards deferred to `DEC-004`. |
| **Live stream minutes** | `MVV-ENT-003` | **Class B: USAGE EVENT EMITTED TO BILLING** | Emitted as stream minutes consumed; rate cards deferred to `DEC-004`. |
| **Voice minutes** | `PRD-VOC-001`, `MVV-VOC-001` | **Class C: OPERATIONAL METRIC ONLY** | Audio monitoring capability; per-minute voice billing unestablished. |
| **SMS dispatches** | `MSE-BIL-001` | **Class B: USAGE EVENT EMITTED TO BILLING** | Emitted as SMS dispatch events; rate cards deferred to `DEC-004`. |
| **Evidence exports** | `MVV-ENT-003` | **Class B: USAGE EVENT EMITTED TO BILLING** | Emitted as evidence export events; fee schedules deferred to `DEC-004`. |
| **AI usage** | `PRD-VIS-002`, `MOD-AI-18` | **Class E: NOT ESTABLISHED** | Zero AI usage events, meters, or billing charges exist upstream. |
| **Rescue incident** | `PRD-ALT-001`, `CSE-RSC-001` | **Class C: OPERATIONAL METRIC ONLY** | Emergency workflow dispatch trigger; per-incident fee unestablished. |
| **Installation** | `PRD-BIL-001`, `PRD-PUR-001` | **Class D: COMMERCIAL CHARGE CONCEPT BUT NO METER** | One-off event-based installation fee line item; not a continuous meter. |
| **Service work order** | `SWR-BIL-001`, `GATE-SWR-16` | **Class D: COMMERCIAL CHARGE CONCEPT BUT NO METER** | Repair labor/parts invoicing deferred to Billing; not a continuous meter. |

  - *Authority Classification:* DIRECT UPSTREAM (`PRD-BIL-001`, `MSE-BIL-001`, `MVV-ENT-003`, `CTCM-PAY-006`, `SMDI-SIM-001`, `SWR-BIL-001`).

---

## 9. Usage Event Ingestion & Rating Authority Boundary

- **BMS-USG-001 (Structured Usage Event Ingestion Linkage):**
  - In accordance with `MSE-BIL-001` and `MVV-ENT-003`, the billing ingestion boundary receives structured usage events emitted by upstream domain engines:
    1. Active vehicle counts emitted by the entitlement engine (`MSE-BIL-001`).
    2. Video storage consumption bytes emitted by the media vault (`MSE-BIL-001`, `MVV-ENT-003`).
    3. SMS alert dispatches emitted by the notification gateway (`MSE-BIL-001`).
    4. Live video stream minutes consumed emitted by the media streaming service (`MVV-ENT-003`).
    5. Tamper-evident evidence export operations emitted by the evidence vault (`MVV-ENT-003`).
  - Ingestion of usage events MUST be idempotent, tenant-isolated (`TISB-SEC-002`), and bounded to verified machine service authority (`URPA-SYS-001`).
  - *Authority Classification:* DIRECT UPSTREAM (`MSE-BIL-001`, `MVV-ENT-003`, `TISB-SEC-002`, `URPA-SYS-001`).

- **BMS-USG-002 (Usage-to-Billing Rating Model Deferral):**
  - Upstream authority defines the emission of usage events, but defines ZERO event aggregation algorithms, cutoff dates, rating calculation formulas, volume tier thresholds, or deduplication window rules.
  - The platform SHALL NOT invent speculative event rating algorithms, distributed streaming pipelines, or time-series rollup engines:
    `AUTHORITY GAP — USAGE-TO-BILLING RATING MODEL NOT ESTABLISHED UPSTREAM`.
  - Concrete rating formulas remain deferred to downstream implementation specifications under open decision `DEC-004`.
  - *Authority Classification:* AUTHORITY GAP / DEFERRED (`MSE-BIL-001`, `DEC-004`).

- **BMS-API-001 (API Rate-Limiting Non-Monetization Boundary):**
  - In accordance with `PRD-API-001` and `PRD-SEC-003`, API key authentication, request rate limiting, and replay protection are enforced as technical infrastructure security guardrails.
  - Upstream authority defines ZERO fixed numeric request rates (no "100 req/min" or similar limit).
  - The billing engine SHALL NOT monetize, meter, or invoice external API calls or webhook transmissions as billable consumption.
  - *Authority Classification:* DOWNSTREAM ARCHITECTURAL COMPOSITION (`PRD-API-001`, `PRD-SEC-003`).

---

## 10. Commercial Invoicing

- **BMS-INV-001 (Structured Commercial Invoicing Content):**
  - In accordance with `PRD-BIL-001` and `CTCM-PAY-006`, the platform generates structured commercial invoices detailing:
    1. Tenant platform fees (`PRD-BIL-001`).
    2. Per-vehicle subscription fees across active tracking packages (`PRD-BIL-001`, `CTCM-PAY-006`).
    3. Hardware device charges and accessories (`CTCM-PAY-006`, `PRD-PUR-001`).
    4. Cellular SIM charges and data plan options (`CTCM-PAY-006`, `PRD-BIL-001`).
    5. Add-on storage and video fees (`PRD-BIL-001`).
    6. Installation charges (`PRD-BIL-001`).
    7. Applied promotional discounts and volume rebates (`CTCM-PAY-001`, `CTCM-PAY-006`).
    8. Applicable statutory taxes and regulatory compliance fees (`CTCM-PAY-005`, `CTCM-PAY-006`).
  - *Authority Classification:* DIRECT UPSTREAM (`PRD-BIL-001`, `CTCM-PAY-006`, `CTCM-PAY-001`, `CTCM-PAY-005`).

- **BMS-INV-002 (Automated Invoice Generation & Lifecycle State Gap):**
  - In accordance with `PRD-BIL-001`, the billing engine supports automated invoice generation.
  - Upstream authority defines ZERO formal invoice lifecycle states (such as `DRAFT`, `ISSUED`, `PAID`, `VOID`), invoice sequence numbering algorithms, credit note schemas, debit note schemas, or PDF template technologies:
    `AUTHORITY GAP — INVOICE AND PAYMENT LIFECYCLE STATES NOT ESTABLISHED UPSTREAM`.
  - The platform SHALL NOT invent unapproved invoice state machines or accounting documents.
  - *Authority Classification:* AUTHORITY GAP / DEFERRED (`PRD-BIL-001`, `CTCM-PAY-006`).

---

## 11. Payment Processing & Gateway Abstraction

- **BMS-PAY-001 (Payment Gateway Abstraction & Provider Selection):**
  - In accordance with `PRD-COM-003` and `CTCM-PAY-003`, the commercial engine supports a unified payment gateway abstraction layer accommodating digital payments (mobile financial services, credit/debit cards, bank transfers) and manual corporate billing workflows.
  - Upstream Candidate Gateways (`PRD-COM-003`, `IRAS-BIL-001`):
    - `bKash`, `Nagad`, `SSLCommerz`, `Bank Transfer`, and `Cash-on-Delivery` (`COD`) are illustrative candidate options only.
    - Zero payment gateways are approved production integrations or mandatory lock-ins.
  - Open Decision Preservation (`DEC-008`): Payment gateway provider selection remains `TBD / Integration candidate selection`. The platform SHALL NOT hardcode merchant IDs, merchant credentials, gateway API keys, webhook callback paths, signature algorithms, or gateway fee percentages:
    `AUTHORITY GAP — PAYMENT GATEWAY PROVIDER SELECTION UNRESOLVED (DEC-008)`.
  - *Authority Classification:* DIRECT UPSTREAM (`PRD-COM-003`, `CTCM-PAY-003`, `IRAS-BIL-001`, `DEC-008`).

- **BMS-PAY-002 (Authoritative Backend Payment Confirmation):**
  - In strict accordance with `MODULE_SERVICE_ENTITLEMENT_SPEC.md` (`MSE-PAY-001`) and `CTCM-PAY-003`, customer subscription activation or renewal MUST occur ONLY upon authoritative server-side backend payment confirmation.
  - Frontend client-side payment gateway callbacks, browser redirects, or unverified mobile payment receipts SHALL NEVER directly activate subscriptions or grant module entitlements without authoritative backend verification.
  - *Authority Classification:* DIRECT UPSTREAM (`MSE-PAY-001`, `CTCM-PAY-003`).

- **BMS-PAY-003 (Prepaid Retail and Postpaid Corporate Support):**
  - In accordance with `CUSTOMER_TYPES_COMMERCIAL_MODEL_SPEC.md` (`CTCM-PAY-007`), the commercial architecture supports:
    1. Prepaid retail billing: Upfront payment required before subscription activation.
    2. Postpaid enterprise billing: Invoicing on commercial credit terms for qualified corporate fleets where configured.
  - The platform SHALL NOT invent credit scoring models, credit limit formulas, invoice payment due day constants, or automated late fee penalties.
  - *Authority Classification:* DIRECT UPSTREAM (`CTCM-PAY-007`).

- **BMS-PAY-004 (Authority Conflict on Postpaid Activation vs Backend Confirmation):**
  - Tension Identification: `MSE-PAY-001` states that activation or renewal MUST occur ONLY upon authoritative backend payment confirmation. Simultaneously, `CTCM-PAY-007` mandates support for postpaid corporate fleet billing on credit terms, where payment settlement legally and commercially occurs after activation and invoicing.
  - Upstream Reconciliation Invariant: The platform SHALL NOT invent an unauthorized bypass or ad-hoc architectural exception. This tension is formally recorded:
    `AUTHORITY CONFLICT — POSTPAID ACTIVATION CONDITION VS BACKEND PAYMENT CONFIRMATION REQUIRES UPSTREAM POLICY RECONCILIATION`.
  - Pending explicit upstream policy reconciliation, postpaid activation eligibility requires administrative authorization or verified enterprise credit contract assignment without violating auditability.
  - *Authority Classification:* AUTHORITY GAP / DEFERRED (`MSE-PAY-001`, `CTCM-PAY-007`).

---

## 12. Refund Governance

- **BMS-REF-001 (Commercial Refund Governance & Ledger Adjustments):**
  - In accordance with `CTCM-PAY-008` and `PRD-AUD-002`, commercial cancellations, order terminations, and hardware returns follow defined refund policies, adjusting operational billing balances without compromising immutable audit trails.
  - Support agents have ZERO authority to approve commercial warranty liability, issue customer credit refunds, or execute hardware asset write-offs (`SWR-GEN-002`, `URPA-ROLE-009`).
  - Refund processing SHALL NOT alter, delete, or rewrite historical telemetry records, past invoice line items, or prior audit entries (`CTCM-AUD-001`).
  - Upstream authority defines ZERO specific refund percentages, partial-refund algorithms, chargeback workflows, or gateway refund API integrations.
  - *Authority Classification:* DIRECT UPSTREAM (`CTCM-PAY-008`, `PRD-AUD-002`, `SWR-GEN-002`).

---

## 13. Tax & Financial Compliance

- **BMS-TAX-001 (Statutory Tax & Regulatory Compliance Support Readiness):**
  - In accordance with `CTCM-PAY-005` and `CTCM-PAY-006`, invoices and commercial billing records must maintain data readiness to support applicable statutory taxes (Value Added Tax, withholding tax) and telematics regulatory compliance fees where legally verified and applicable in Bangladesh:
    `LEGAL / FINANCIAL VERIFICATION REQUIRED`.
  - Invoices must support itemized recording of tax charges alongside device, subscription, and SIM fees (`CTCM-PAY-006`).
  - Maintenance ledger records of government vehicle tax tokens (`PRD-MNT-001`) and BRTA vehicle tax status verification (`PRD-GOV-001`) are operational compliance attributes and SHALL NOT be conflated with SaaS platform billing revenue.
  - *Authority Classification:* DIRECT UPSTREAM (`CTCM-PAY-005`, `CTCM-PAY-006`, `PRD-MNT-001`, `PRD-GOV-001`).

- **BMS-TAX-002 (Fiscal Rule Verification & Tax Engine Deferral):**
  - Upstream specifications establish data model support readiness, but define ZERO verified Bangladesh tax rates (e.g. 5%, 15%), withholding brackets, tax invoice numbering rules, or automated revenue recognition logic:
    `AUTHORITY GAP — TAX / FISCAL BILLING RULES NOT ESTABLISHED UPSTREAM`.
  - The billing engine SHALL NOT invent hardcoded tax percentages or premature fiscal accounting algorithms.
  - *Authority Classification:* AUTHORITY GAP / DEFERRED (`CTCM-PAY-005`).

---

## 14. Operational Financial Ledgers

- **BMS-LED-001 (Strict Separation of Three Operational Incentive Ledgers):**
  - In strict compliance with `PRODUCT_REQUIREMENTS.md` (`PRD-REF-004`) and `CUSTOMER_TYPES_COMMERCIAL_MODEL_SPEC.md` (`CTCM-REF-003`, `CTCM-CHN-003`), the platform maintains three strictly independent, auditable operational financial ledgers:
    1. **Customer Referral Reward / Cashback Ledger:** Tracks referral credits accrued under verified qualification triggers (`PRD-REF-003`), redeemable according to approved program rules (`CTCM-REF-003`).
    2. **Internal Sales Staff Commission Ledger:** Tracks sales performance commissions for administrative approval and disbursement (`CTCM-CHN-003`, `URPA-ROLE-007`).
    3. **B2B Dealer / Channel Partner Margin Ledger:** Tracks wholesale-to-retail margin accruals and resale quotas for channel partners (`CTCM-CHN-001`).
  - Balances, accruals, and disbursements across these three ledgers MUST remain strictly isolated from one another.
  - *Authority Classification:* DIRECT UPSTREAM (`PRD-REF-004`, `CTCM-REF-003`, `CTCM-CHN-003`).

- **BMS-LED-002 (Double-Entry General Ledger Exclusion):**
  - In accordance with `CTCM-REF-002` (line 335) and `CUSTOMER_TYPES_COMMERCIAL_MODEL_SPEC.md` (line 71), the three commercial ledgers are operational business tracking records and **DO NOT** constitute a double-entry General Ledger (GL) or ERP chart of accounts:
    `AUTHORITY GAP — DOUBLE-ENTRY ACCOUNTING LEDGER NOT ESTABLISHED UPSTREAM`.
  - The platform SHALL NOT construct debit/credit journal entries, fiscal year closing engines, or balance sheet reporting modules. Integration with enterprise financial systems is deferred to future shared SaaS ERP engine integration (`PRD-INT-002`).
  - *Authority Classification:* DOWNSTREAM ARCHITECTURAL COMPOSITION (`CTCM-REF-002`, `PRD-INT-002`).

---

## 15. Multi-Tenant Isolation & Webhook Boundaries

- **BMS-TEN-001 (Multi-Tenant Metering & Commercial Record Isolation):**
  - In strict accordance with `TENANT_ISOLATION_SECURITY_BOUNDARY_SPEC.md` (`TISB-SEC-002`, `TISB-TEN-005`, `CTCM-AUD-001`), telematics message counts, device usage meters, commercial invoices, and payment histories belonging to Tenant A MUST NEVER be accessible to, modified by, or aggregated into Tenant B.
  - Commercial module entitlements granted to Tenant A operate strictly within Tenant A and cannot activate features for Tenant B (`TISB-TEN-005`).
  - Multi-tenant boundary integrity is enforced semantically across all billing queries, usage aggregations, and reporting pipelines. Physical database-per-tenant, schema-per-tenant, or SQL RLS implementations are not mandated.
  - *Authority Classification:* DIRECT UPSTREAM (`TISB-SEC-002`, `TISB-TEN-005`, `CTCM-AUD-001`).

- **BMS-TEN-002 (Payment Gateway Inbound Webhook Trust Boundary):**
  - In accordance with `TISB-INT-002` and `IRAS-BIL-001`, inbound payment gateway callbacks, IPN webhooks, and asynchronous payment notices are untrusted external network inputs.
  - Inbound payment webhooks MUST undergo source verification, payload validation, and authoritative tenant mapping before mutating any subscription, invoice, or ledger state.
  - The platform does not mandate specific HMAC signature header names or verification algorithms for unselected gateway providers.
  - *Authority Classification:* DIRECT UPSTREAM (`TISB-INT-002`, `IRAS-BIL-001`).

---

## 16. IAM & Machine Authority

- **BMS-IAM-001 (Role Persona Authority & Machine Scoping):**
  - In accordance with `USER_ROLES_PERMISSIONS_ACCESS_SPEC.md` (`URPA-ROLE-001`, `URPA-SYS-001`) and `TENANT_ISOLATION_SECURITY_BOUNDARY_SPEC.md` (`TISB-ACT-008`, `TISB-JOB-001`):
    1. Operational roles align strictly with approved URPA personas: `PLATFORM_OWNER`, `PLATFORM_ADMIN`, `TENANT_ADMIN`, `FLEET_MANAGER`, `SALES_AGENT`, `CUSTOMER_SERVICE`, `CUSTOMER_OWNER`, `DRIVER`.
    2. Nonexistent role personas (`PLATFORM_SUPER_ADMIN`, `FLEET_SUPERVISOR`, `SUBSCRIBER_OWNER`) are strictly prohibited.
    3. Automated background billing services (usage aggregators, invoice generators, dunning evaluators) MUST operate under authenticated machine authority bounded strictly to target tenant execution contexts (`URPA-SYS-001`, `TISB-ACT-008`, `TISB-JOB-001`).
  - *Authority Classification:* DIRECT UPSTREAM (`URPA-ROLE-001`, `URPA-SYS-001`, `TISB-ACT-008`, `TISB-JOB-001`).

- **BMS-IAM-002 (Absence of Granular Billing Mutation Permission Tokens):**
  - A complete audit of `USER_ROLES_PERMISSIONS_ACCESS_SPEC.md` confirms that URPA defines zero granular machine-enforceable billing permission tokens:
    - Tokens such as `billing.view`, `billing.manage`, `billing.adjust`, `invoice.create`, `invoice.manage`, `payment.record`, `payment.refund`, `subscription.manage`, `subscription.cancel`, `subscription.renew`, `pricing.manage`, `ratecard.manage`, `discount.apply`, and `credit.manage` **DO NOT EXIST** in approved authority.
  - URPA Section 5 explicitly excludes commercial retail pricing and fee structures from its scope.
  - Gaps formally recorded:
    `AUTHORITY GAP — BILLING IAM PERMISSION TOKENS NOT DEFINED UPSTREAM`
    `AUTHORITY GAP — BILLING MUTATION PERMISSIONS NOT DEFINED UPSTREAM`.
  - *Authority Classification:* AUTHORITY GAP / DEFERRED (`URPA-ROLE-001`).

---

## 17. External Domain Commercial Boundaries

- **BMS-SIM-001 (SIM Commercial Charging & Carrier Wholesale Decoupling):**
  - In accordance with `SIM_M2M_DEVICE_INVENTORY_SPEC.md` (`SMDI-GEN-002`, `SMDI-SIM-002`, `SMDI-AST-001`) and `CUSTOMER_TYPES_COMMERCIAL_MODEL_SPEC.md` (`CTCM-PAY-006`):
    1. Cellular SIM card operational inventory lifecycle (`RECEIVED`, `TESTED`, `AVAILABLE`, `RESERVED`, `ACTIVATION_PENDING`, `ACTIVE`, `SUSPENDED`, `DEACTIVATED`, `RETIRED`) is decoupled from customer retail subscription billing.
    2. SIM retail fees are invoiced to customers as commercial add-ons (`CTCM-PAY-006`).
    3. Wholesale carrier data overage billing, carrier invoice ingestion, and telco wholesale reconciliation are unestablished: `CARRIER API NOT ESTABLISHED UPSTREAM`.
  - The billing engine SHALL NOT calculate wholesale telecom data overage costs or invent carrier billing APIs:
    `AUTHORITY GAP — CARRIER BILLING AND COST PASS-THROUGH NOT ESTABLISHED UPSTREAM`.
  - *Authority Classification:* DIRECT UPSTREAM (`SMDI-GEN-002`, `CTCM-PAY-006`, `SMDI-AST-001`).

- **BMS-PRV-001 (Tracking Provider Commercial Contract Independence):**
  - In accordance with `TRACKING_PROVIDER_ARCHITECTURE_SPEC.md` (`TPA-COM-001`, `TPA-COM-002`) and `CUSTOMER_TYPES_COMMERCIAL_MODEL_SPEC.md` (`CTCM-B2B-003`):
    1. Commercial agreements with Tracking Providers (gateway fees, device licensing) are contractually independent of customer SaaS subscriptions.
    2. Technical provider architecture specifies socket/HTTP ingestion and does NOT calculate gateway fees or billing allocations (`TPA-COM-002`).
    3. Tracking Provider cost allocation, wholesale provider fees, and retail markup pass-through are unestablished:
       `AUTHORITY GAP — TRACKING PROVIDER COST ALLOCATION NOT ESTABLISHED UPSTREAM`.
  - *Authority Classification:* DIRECT UPSTREAM (`TPA-COM-001`, `TPA-COM-002`, `CTCM-B2B-003`).

- **BMS-SWR-001 (Service & Warranty Repair Billing Classification Intake):**
  - In accordance with `SERVICE_WARRANTY_RMA_SPEC.md` (`SWR-BIL-001`, `GATE-SWR-16`):
    1. SWR determines technical fault classification and warranty eligibility, emitting tokens: `BILLABLE_REPAIR`, `WARRANTY_COVERED`, `CUSTOMER_LIABLE`, or `SUPPLIER_REIMBURSED`.
    2. The billing engine consumes these technical tokens to generate out-of-warranty customer repair invoices based on commercial pricing plans (`DEC-004`).
    3. SWR work orders and warranty intake cases are operational maintenance records, NOT automated billable meters.
    4. Labor hourly rates, technician billing ledgers, parts markup percentages, and warranty deductibles are unestablished:
       `AUTHORITY GAP — REPAIR LABOR AND PARTS FEE SCHEDULES NOT ESTABLISHED UPSTREAM`.
  - *Authority Classification:* DIRECT UPSTREAM (`SWR-BIL-001`, `GATE-SWR-16`, `DEC-004`).

- **BMS-MED-001 (Media & Voice Usage Emission Intake Boundary):**
  - In accordance with `MEDIA_VOICE_VIDEO_SPEC.md` (`MVV-ENT-003`, `MVV-SCL-001`, `MVV-DEF-001`):
    1. Media operations emit structured usage events (live stream minutes consumed, video storage bytes committed, evidence exports executed) to the metering ingestion pipeline.
    2. Emitted usage events do NOT automatically imply rateable billing meters.
    3. Per-GB storage fees, streaming minute fees, per-camera pricing tiers, and evidence export fees are unestablished upstream:
       `AUTHORITY GAP — MEDIA AND VOICE USAGE PRICING NOT ESTABLISHED UPSTREAM`.
  - *Authority Classification:* DIRECT UPSTREAM (`MVV-ENT-003`, `MVV-SCL-001`, `MVV-DEF-001`).

- **BMS-OPS-001 (Sales, Support and Rescue Commercial Context Boundaries):**
  - In accordance with `SALES_SUPPORT_RESCUE_SPEC.md` (`SSR-SAL-001`, `SSR-SUP-001`, `SSR-RSC-001`) and `USER_ROLES_PERMISSIONS_ACCESS_SPEC.md` (`URPA-ROLE-007`, `URPA-ROLE-008`, `URPA-ROLE-010`):
    1. Sales agents access customer CRM, order status, commission ledgers, and billing context, with zero access to live vehicle locations (`URPA-ROLE-007`).
    2. Customer support personnel access read-only commercial context (plan tier, device count, billing address) for ticketing verification. Support agents possess ZERO authority to modify rate cards, apply unauthorized discounts, waive charges, or issue refunds.
    3. Emergency rescue actors operate strictly within active assigned emergency incident scope under `DEC-006` and possess ZERO commercial, billing, or financial authority (`CSE-RSC-001`, `SSR-RSC-001`).
  - *Authority Classification:* DIRECT UPSTREAM (`SSR-SAL-001`, `SSR-SUP-001`, `SSR-RSC-001`, `URPA-ROLE-007`, `URPA-ROLE-008`, `CSE-RSC-001`).

- **BMS-CMD-001 (Canonical Command Terminology & Command Safety Purity):**
  - In strict compliance with `COMMAND_SAFETY_EXECUTION_SPEC.md` (`CSE-SAF-001`, `CSE-ACK-001`, `CSE-AUT-003`) and `CUSTOMER_TYPES_COMMERCIAL_MODEL_SPEC.md` (`CTCM-GEN-008`):
    1. All billing and commercial references to vehicle immobilization MUST use canonical downstream terminology: **`Engine Disable`** and **`Engine Restore`**. Raw legacy PRD phrasing (`engine cut`) is historical context only.
    2. Active commercial subscription, positive payment confirmation, or invoice settlement SHALL NEVER bypass Command Safety Execution (CSE) interlocks, speed evaluation, safe-state checks, or step-up authentication.
    3. Provider gateway acknowledgment (`Provider ACK`) confirms only transport receipt and does NOT equal device acknowledgment (`DEVICE_ACKNOWLEDGED`) or command success.
  - *Authority Classification:* DIRECT UPSTREAM (`CSE-SAF-001`, `CSE-ACK-001`, `CTCM-GEN-008`).

- **BMS-DEV-001 (Technical Hardware Capability & Compatibility Subordination):**
  - In accordance with `DEVICE_CAPABILITY_REGISTRY_SPEC.md` (`DCR-CAP-001`) and `VEHICLE_KNOWLEDGE_REGISTRY_SPEC.md` (`VKR-CMP-001`):
    1. The commercial billing engine consumes device capabilities and vehicle compatibility from DCR and VKR, but possesses zero authority to manufacture or assert technical capabilities.
    2. A paid subscription or commercial package bundle cannot activate a feature (e.g. BLE temperature tracking, fuel sensor monitoring, cabin audio recording) on a vehicle or device lacking verified hardware capability.
  - *Authority Classification:* DIRECT UPSTREAM (`DCR-CAP-001`, `VKR-CMP-001`, `CTCM-GEN-008`).

---

## 18. Audit & Scale Mandates

- **BMS-AUD-001 (Immutable Audit Logging for Sensitive Billing Operations):**
  - In strict accordance with `PRODUCT_REQUIREMENTS.md` (`PRD-AUD-002`) and `USER_ROLES_PERMISSIONS_ACCESS_SPEC.md` (`URPA-AUD-003`), the system MUST record tamper-resistant audit logs capturing:
    - `User ID` (Actor)
    - `Tenant ID`
    - `IP Address`
    - `Timestamp`
    - `Action`
    - `Target Entity`
    - `Outcome`
    for all sensitive operations, explicitly including **billing adjustments**, invoice modifications, refund disbursements, and subscription state changes.
  - Distinction from UI Alerts: `PRD-AUD-001` specifies audible alert sirens in web/mobile UI for sirens and intercoms. It has zero relationship to system audit trails.
  - The specification specifies audit attributes and log requirements without mandating physical SQL tables, cryptographic hash chains, or WORM storage technologies.
  - *Authority Classification:* DIRECT UPSTREAM (`PRD-AUD-002`, `URPA-AUD-003`).

- **BMS-SCL-001 (High-Scale Capacity & Workload Decoupling):**
  - In accordance with `PRODUCT_REQUIREMENTS.md` (`PRD-SCL-001`, `PRD-DAT-001`), the platform architecture must scale gracefully to a long-term target capacity of approximately 2,000,000 connected devices via horizontal scaling.
  - Workload Decoupling (`PRD-DAT-001`): High-throughput real-time telemetry ingestion and heavy media storage MUST be decoupled from transactional ERP and billing databases to prevent telemetry traffic spikes from impacting commercial billing operations.
  - *Authority Classification:* DIRECT UPSTREAM (`PRD-SCL-001`, `PRD-DAT-001`).

- **BMS-SCL-002 (Billing Throughput Target Deferral):**
  - Upstream authority establishes the 2,000,000 device long-term platform capacity target (`PRD-SCL-001`), but defines ZERO billing transaction throughput targets (invoice generation TPS), meter ingestion events/second, queue depth limits, or batch billing run duration SLAs.
  - The specification SHALL NOT invent arbitrary numeric throughput targets:
    `AUTHORITY GAP — BILLING / METERING THROUGHPUT TARGET NOT ESTABLISHED UPSTREAM`.
  - *Authority Classification:* AUTHORITY GAP / DEFERRED (`PRD-SCL-001`).

---

## 19. Open Decision Register

| Decision Identifier | Strategic Decision Subject | Approved Upstream Status | Authoritative Impact on Billing & Metering Specification |
| :--- | :--- | :--- | :--- |
| **`DEC-001`** | Final commercial product & brand name | `TBD (EasyTracker is temporary working name only)` | Preserved as configurable white-label branding markup. |
| **`DEC-002`** | Initial 3rd-party licensed VTS provider(s) | `TBD (Candidate examples: GP IoT, Robi, Bondstein)` | Tracking provider wholesale costs unestablished. |
| **`DEC-003`** | Initial production hardware device catalogue | `TBD (S102A is pilot evidence; registry required)` | Hardware retail prices and procurement costs unestablished. |
| **`DEC-004`** | Subscription package pricing & rate cards | **`TBD / Configurable per tenant and market policy`** | **Direct Authority Invariant: Zero prices, rates, or slabs hardcoded.** |
| **`DEC-005`** | Support live-location grant exact duration | `Configurable (Ticket-scoped, explicit grant, auto-expiry)` | Zero billing impact; location access strictly non-commercial. |
| **`DEC-006`** | Emergency rescue field operating model | `TBD / Configurable by tenant operational policy` | Rescue dispatch operations unbilled. |
| **`DEC-007`** | Specialized fleet pack launch rollout order | `TBD based on initial anchor customer demand` | Preserved as modular add-on packs. |
| **`DEC-008`** | Payment gateway provider selection | **`TBD / Integration candidate selection`** | **Direct Authority Invariant: Unified abstraction; zero provider lock-in.** |
| **`DEC-009`** | Telemetry raw data retention duration | `TBD + Statutory legal/privacy verification required` | Telemetry storage retention billing unestablished. |
| **`DEC-010`** | Crash video clip retention duration | `TBD + Statutory legal/privacy verification required` | Video storage retention billing tiers unestablished. |
| **`DEC-011`** | Cabin voice recording retention duration | `TBD + Statutory legal/privacy verification required` | Audio voice retention billing tiers unestablished. |
| **`DEC-012`** | Regulatory source monitoring scan cadence | `Configurable (Periodic automated scan + event trigger)` | Regulatory compliance fees unestablished. |
| **`DEC-013`** | Initial vehicle seed catalogue scope | `TBD based on initial target customer segments` | Vehicle catalogue integration non-commercial. |
| **`DEC-014`** | Production AI sensitive data class approval | `Zero PII / live telemetry sent to free cloud AI models` | AI diagnostic assistance unbilled. |

---

## 20. Authority Gap Register

The following gaps represent genuine absences of approved upstream authority and are preserved without speculative invention:

1. `AUTHORITY GAP — SUBSCRIPTION PRICING AND RATE CARDS UNRESOLVED (DEC-004)`: Zero fixed retail prices, volume slab bands, currency units, or discount percentages exist.
2. `AUTHORITY GAP — PAYMENT GATEWAY PROVIDER SELECTION UNRESOLVED (DEC-008)`: Gateways are illustrative candidates; zero production gateway contracts or merchant accounts exist.
3. `AUTHORITY GAP — BILLING IAM PERMISSION TOKENS NOT DEFINED UPSTREAM`: URPA contains zero granular permission tokens for billing, invoicing, payments, or pricing.
4. `AUTHORITY GAP — BILLING MUTATION PERMISSIONS NOT DEFINED UPSTREAM`: No approved permission token permits any role to create, adjust, or void invoices, or issue customer refunds.
5. `AUTHORITY GAP — TAX / FISCAL BILLING RULES NOT ESTABLISHED UPSTREAM`: CTCM-PAY-005 establishes data model readiness (`LEGAL / FINANCIAL VERIFICATION REQUIRED`); zero Bangladesh tax rates exist.
6. `AUTHORITY GAP — USAGE-TO-BILLING RATING MODEL NOT ESTABLISHED UPSTREAM`: Usage events emitted by upstream engines lack rating formulas, aggregation windows, and billing cutoff rules.
7. `AUTHORITY GAP — INVOICE AND PAYMENT LIFECYCLE STATES NOT ESTABLISHED UPSTREAM`: Zero formal state machines exist for invoices or payment transactions.
8. `AUTHORITY GAP — DOUBLE-ENTRY ACCOUNTING LEDGER NOT ESTABLISHED UPSTREAM`: General Ledger double-entry accounting is explicitly disclaimed; only operational tracking ledgers exist.
9. `AUTHORITY GAP — CARRIER BILLING AND COST PASS-THROUGH NOT ESTABLISHED UPSTREAM`: SMDI preserves `CARRIER API NOT ESTABLISHED UPSTREAM`; wholesale carrier data overage billing is unestablished.
10. `AUTHORITY GAP — TRACKING PROVIDER COST ALLOCATION NOT ESTABLISHED UPSTREAM`: Wholesale tracking gateway fees and tenant pass-through allocations are unestablished.
11. `AUTHORITY GAP — REPAIR LABOR AND PARTS FEE SCHEDULES NOT ESTABLISHED UPSTREAM`: SWR defers repair fees, labor rates, and parts markups to Billing without defining fee schedules.
12. `AUTHORITY GAP — MEDIA AND VOICE USAGE PRICING NOT ESTABLISHED UPSTREAM`: MVV-SCL-001 and MVV-DEF-001 confirm zero per-GB, per-minute, or per-camera pricing rate cards exist upstream.
13. `AUTHORITY GAP — BILLING / METERING THROUGHPUT TARGET NOT ESTABLISHED UPSTREAM`: Platform device scale is established (`PRD-SCL-001`), but zero billing TPS or batch run duration targets exist.
14. `AUTHORITY GAP — BILLING ACCOUNT ENTITY NOT ESTABLISHED UPSTREAM`: The repository authority baseline defines zero canonical `Billing Account` entity.
15. `AUTHORITY CONFLICT — POSTPAID ACTIVATION CONDITION VS BACKEND PAYMENT CONFIRMATION REQUIRES UPSTREAM POLICY RECONCILIATION`: Strict tension between `MSE-PAY-001` backend payment confirmation before activation and `CTCM-PAY-007` postpaid billing on credit terms.

---

## 21. Traceability Matrix

| BMS Requirement ID | Requirement Summary | Upstream Authority Citation | Authority Classification | Functional Domain |
| :--- | :--- | :--- | :--- | :--- |
| **`BMS-GEN-001`** | Authority Precedence & Scope | `PRD-GEN-001`, `PRD-BIL-001`, `PRD-LCH-001`, `PRD-LCH-002` | DIRECT UPSTREAM | Governance & Scope |
| **`BMS-GEN-002`** | Core Entity Separation | `CTCM-CUS-001`, `CTCM-CUS-005`, `CTCM-PAY-002`, `CTCM-GEN-002` | DIRECT UPSTREAM | Commercial Architecture |
| **`BMS-GEN-003`** | Fundamental Commercial Invariants | `CTCM-GEN-008`, `CTCM-GEN-009`, `MSE-ENT-001`, `CSE-ACK-001` | DIRECT UPSTREAM | Security & Boundaries |
| **`BMS-GEN-004`** | Billing Account Prohibition | `CTCM-CUS-001`, `TISB-TEN-001` | DOWNSTREAM ARCHITECTURAL COMPOSITION | Entity Governance |
| **`BMS-GEN-005`** | Implementation Neutrality | `PRD-DAT-001`, `PRD-SCL-001` | DOWNSTREAM ARCHITECTURAL COMPOSITION | System Architecture |
| **`BMS-SUB-001`** | 6-State Subscription Set | `PRD-SUB-001` | DIRECT UPSTREAM | Subscription Lifecycle |
| **`BMS-SUB-002`** | Renewal Reminders & Grace Period | `PRD-SUB-002`, `CTCM-PAY-004`, `MSE-DNG-001` | DIRECT UPSTREAM | Subscription Lifecycle |
| **`BMS-SUB-003`** | Multi-Vehicle Heterogeneous Packaging | `MSE-SUB-002`, `CTCM-CUS-006` | DIRECT UPSTREAM | Commercial Packaging |
| **`BMS-ENT-001`** | Entitlement Subordination | `MSE-SUB-001`, `MSE-ENT-001` | DIRECT UPSTREAM | Entitlement Governance |
| **`BMS-ENT-002`** | Lifecycle Separation | `MSE-LFC-001`, `PRD-SUB-001` | DOWNSTREAM ARCHITECTURAL COMPOSITION | Entitlement Governance |
| **`BMS-ENT-003`** | Demo/Trial Conversion Boundary | `MSE-CONV-001`, `PRD-PUR-001` | DIRECT UPSTREAM | Data Integrity |
| **`BMS-PRC-001`** | Subscription Packages & Rate Cards | `PRD-COM-001`, `PRD-COM-002`, `PRD-BIL-001`, `DEC-004` | DIRECT UPSTREAM | Pricing & Rate Cards |
| **`BMS-PRC-002`** | Discounts & Promotions | `CTCM-PAY-001` | DIRECT UPSTREAM | Pricing & Promotions |
| **`BMS-MTR-001`** | 5-Tier Meter Classification | `PRD-BIL-001`, `MSE-BIL-001`, `MVV-ENT-003` | DOWNSTREAM ARCHITECTURAL COMPOSITION | Metering Architecture |
| **`BMS-MTR-002`** | Dimension Mapping | `PRD-BIL-001`, `MSE-BIL-001`, `MVV-ENT-003`, `CTCM-PAY-006` | DIRECT UPSTREAM | Metering Architecture |
| **`BMS-USG-001`** | Usage Event Ingestion Linkage | `MSE-BIL-001`, `MVV-ENT-003`, `TISB-SEC-002` | DIRECT UPSTREAM | Usage & Ingestion |
| **`BMS-USG-002`** | Rating Model Deferral | `MSE-BIL-001`, `DEC-004` | AUTHORITY GAP / DEFERRED | Usage & Rating |
| **`BMS-API-001`** | API Non-Monetization Boundary | `PRD-API-001`, `PRD-SEC-003` | DOWNSTREAM ARCHITECTURAL COMPOSITION | API & Security |
| **`BMS-INV-001`** | Commercial Invoicing Content | `PRD-BIL-001`, `CTCM-PAY-006` | DIRECT UPSTREAM | Invoicing |
| **`BMS-INV-002`** | Invoice Lifecycle State Gap | `PRD-BIL-001`, `CTCM-PAY-006` | AUTHORITY GAP / DEFERRED | Invoicing |
| **`BMS-PAY-001`** | Payment Gateway Abstraction | `PRD-COM-003`, `CTCM-PAY-003`, `IRAS-BIL-001`, `DEC-008` | DIRECT UPSTREAM | Payment Processing |
| **`BMS-PAY-002`** | Backend Payment Confirmation | `MSE-PAY-001`, `CTCM-PAY-003` | DIRECT UPSTREAM | Payment Processing |
| **`BMS-PAY-003`** | Prepaid & Postpaid Support | `CTCM-PAY-007` | DIRECT UPSTREAM | Payment Processing |
| **`BMS-PAY-004`** | Postpaid Activation Conflict | `MSE-PAY-001`, `CTCM-PAY-007` | AUTHORITY GAP / DEFERRED | Payment Processing |
| **`BMS-REF-001`** | Commercial Refund Governance | `CTCM-PAY-008`, `PRD-AUD-002`, `SWR-GEN-002` | DIRECT UPSTREAM | Financial Governance |
| **`BMS-TAX-001`** | Statutory Tax Readiness | `CTCM-PAY-005`, `CTCM-PAY-006` | DIRECT UPSTREAM | Tax & Compliance |
| **`BMS-TAX-002`** | Tax Rule Deferral | `CTCM-PAY-005` | AUTHORITY GAP / DEFERRED | Tax & Compliance |
| **`BMS-LED-001`** | Three Operational Ledgers | `PRD-REF-004`, `CTCM-REF-003`, `CTCM-CHN-003` | DIRECT UPSTREAM | Financial Ledgers |
| **`BMS-LED-002`** | General Ledger Exclusion | `CTCM-REF-002`, `PRD-INT-002` | DOWNSTREAM ARCHITECTURAL COMPOSITION | Financial Ledgers |
| **`BMS-TEN-001`** | Multi-Tenant Record Isolation | `TISB-SEC-002`, `TISB-TEN-005`, `CTCM-AUD-001` | DIRECT UPSTREAM | Tenant Isolation |
| **`BMS-TEN-002`** | Webhook Trust Boundary | `TISB-INT-002`, `IRAS-BIL-001` | DIRECT UPSTREAM | Security & Trust |
| **`BMS-IAM-001`** | Role Persona & Machine Authority | `URPA-ROLE-001`, `URPA-SYS-001`, `TISB-ACT-008` | DIRECT UPSTREAM | IAM & Security |
| **`BMS-IAM-002`** | Billing Mutation Token Gap | `URPA-ROLE-001` | AUTHORITY GAP / DEFERRED | IAM & Security |
| **`BMS-SIM-001`** | SIM Charging & Carrier Decoupling | `SMDI-GEN-002`, `CTCM-PAY-006`, `SMDI-AST-001` | DIRECT UPSTREAM | Telco & SIM |
| **`BMS-PRV-001`** | Tracking Provider Independence | `TPA-COM-001`, `TPA-COM-002`, `CTCM-B2B-003` | DIRECT UPSTREAM | Provider Architecture |
| **`BMS-SWR-001`** | SWR Repair Billing Intake | `SWR-BIL-001`, `GATE-SWR-16`, `DEC-004` | DIRECT UPSTREAM | Warranty & Service |
| **`BMS-MED-001`** | Media Usage Emission Intake | `MVV-ENT-003`, `MVV-SCL-001`, `MVV-DEF-001` | DIRECT UPSTREAM | Media & Storage |
| **`BMS-OPS-001`** | Sales/Support/Rescue Boundaries | `SSR-SAL-001`, `SSR-SUP-001`, `SSR-RSC-001`, `URPA-ROLE-007` | DIRECT UPSTREAM | Operations & CRM |
| **`BMS-CMD-001`** | Canonical Engine Commands | `CSE-SAF-001`, `CSE-ACK-001`, `CTCM-GEN-008` | DIRECT UPSTREAM | Command Safety |
| **`BMS-DEV-001`** | Hardware Capability Subordination | `DCR-CAP-001`, `VKR-CMP-001`, `CTCM-GEN-008` | DIRECT UPSTREAM | Hardware & Vehicle |
| **`BMS-AUD-001`** | Immutable Audit Trail Logging | `PRD-AUD-002`, `URPA-AUD-003` | DIRECT UPSTREAM | Audit & Compliance |
| **`BMS-SCL-001`** | High-Scale Target & Decoupling | `PRD-SCL-001`, `PRD-DAT-001` | DIRECT UPSTREAM | Scale & Architecture |
| **`BMS-SCL-002`** | Throughput Target Deferral | `PRD-SCL-001` | AUTHORITY GAP / DEFERRED | Scale & Architecture |

---

## 22. Acceptance Gates

- **`GATE-BMS-01` (Authority Precedence & Scope Enforcement):**
  - Verify that billing calculations, subscription policies, and ledger records strictly obey the approved authority hierarchy and preserve clean modular domain boundaries. Tests `BMS-GEN-001`.
- **`GATE-BMS-02` (Core Entity Separation Enforcement):**
  - Verify that the system strictly preserves the entity separation $Tenant \neq Customer \neq Customer Account \neq Contracting Customer \neq Subscriber \neq Payer \neq Vehicle Owner \neq Driver$, and confirms that Payer status confers zero vehicle tracking permissions. Tests `BMS-GEN-002`.
- **`GATE-BMS-03` (Fundamental Commercial Invariants Enforcement):**
  - Verify that commercial payment, invoice settlement, or subscription status cannot override security policy, manufacture device capability, grant media access, or bypass command safety interlocks. Tests `BMS-GEN-003`.
- **`GATE-BMS-04` (Billing Account Entity Prohibition Enforcement):**
  - Verify that the repository contains zero canonical `Billing Account` entity and that commercial billing data attaches directly to `Tenant`, `Customer`, and `Customer Account`. Tests `BMS-GEN-004`.
- **`GATE-BMS-05` (Implementation Neutrality Enforcement):**
  - Verify that the specification mandates zero proprietary payment SDKs, specific message brokers, physical SQL tables, or PDF engines. Tests `BMS-GEN-005`.
- **`GATE-BMS-06` (Customer Subscription State Set Enforcement):**
  - Verify that customer subscription management enforces exactly the 6 canonical states (`TRIAL`, `ACTIVE`, `GRACE_PERIOD`, `SUSPENDED`, `EXPIRED`, `CANCELLED`) without mandating an unapproved rigid transition graph. Tests `BMS-SUB-001`.
- **`GATE-BMS-07` (Renewal Reminders & Grace Period Enforcement):**
  - Verify that multi-channel renewal notifications trigger prior to expiration, grace period rules evaluate upon expiration, and subscription suspension preserves historical telemetry logs without deletion. Tests `BMS-SUB-002`.
- **`GATE-BMS-08` (Multi-Vehicle Heterogeneous Packaging Enforcement):**
  - Verify that a single customer account can assign distinct subscription packages to different vehicles while aggregating them into a unified billing statement. Tests `BMS-SUB-003`.
- **`GATE-BMS-09` (Entitlement Subordination Enforcement):**
  - Verify that a customer subscription is strictly subordinate to tenant entitlement, and that disabling a tenant entitlement immediately blocks access to that module across all child customer subscriptions. Tests `BMS-ENT-001`.
- **`GATE-BMS-10` (Lifecycle Separation Enforcement):**
  - Verify that the tenant entitlement lifecycle (`MSE-LFC-001`) and the customer subscription lifecycle (`PRD-SUB-001`) operate as distinct state machines without cross-model conflation. Tests `BMS-ENT-002`.
- **`GATE-BMS-11` (Clean Conversion Boundary Enforcement):**
  - Verify that converting from demo/trial creates fresh production identity and billing records, and that synthetic demo data is never imported into production databases. Tests `BMS-ENT-003`.
- **`GATE-BMS-12` (Subscription Packages & Rate Cards Enforcement):**
  - Verify that subscription package tiers, custom rate cards, and volume discount slabs are supported as tenant-configurable parameters, while preserving `DEC-004` without hardcoding fixed prices. Tests `BMS-PRC-001`.
- **`GATE-BMS-13` (Discounts & Promotions Enforcement):**
  - Verify that promotional codes, seasonal discounts, and volume rebates adjust invoice totals without altering technical entitlements or security policies. Tests `BMS-PRC-002`.
- **`GATE-BMS-14` (Five-Tier Meter Classification Enforcement):**
  - Verify that all measurable platform dimensions are strictly partitioned into the 5 mutually exclusive classes (A, B, C, D, E) without silent conversion between classes. Tests `BMS-MTR-001`.
- **`GATE-BMS-15` (Dimension Mapping Enforcement):**
  - Verify that vehicle subscription count is classified as Class A, usage events as Class B, operational metrics as Class C, commercial charge line items as Class D, and AI usage as Class E. Tests `BMS-MTR-002`.
- **`GATE-BMS-16` (Usage Event Ingestion Linkage Enforcement):**
  - Verify that the billing ingestion boundary receives structured usage events (active vehicle counts, storage bytes, stream minutes, SMS dispatches, evidence exports) with strict tenant context validation. Tests `BMS-USG-001`.
- **`GATE-BMS-17` (Rating Model Deferral Enforcement):**
  - Verify that the specification defers concrete usage event rating formulas, aggregation windows, and billing cutoff algorithms without inventing unapproved rating engines. Tests `BMS-USG-002`.
- **`GATE-BMS-18` (API Rate-Limiting Non-Monetization Enforcement):**
  - Verify that API rate limiting is enforced strictly as a security guardrail without inventing fixed numeric limits (e.g. 100 req/min) or treating API calls as billable meters. Tests `BMS-API-001`.
- **`GATE-BMS-19` (Commercial Invoicing Content Enforcement):**
  - Verify that commercial invoices itemize tenant platform fees, per-vehicle subscriptions, hardware charges, SIM fees, storage/video add-ons, installation charges, discounts, and applied taxes. Tests `BMS-INV-001`.
- **`GATE-BMS-20` (Invoice Lifecycle State Gap Enforcement):**
  - Verify that invoice generation is automated while formal invoice lifecycle state machines (such as DRAFT, ISSUED, PAID) are deferred as unestablished upstream. Tests `BMS-INV-002`.
- **`GATE-BMS-21` (Payment Gateway Abstraction Enforcement):**
  - Verify that candidate payment gateways (bKash, Nagad, SSLCommerz, Bank Transfer, COD) are treated as illustrative candidates under `DEC-008` without hardcoding provider credentials or lock-ins. Tests `BMS-PAY-001`.
- **`GATE-BMS-22` (Backend Payment Confirmation Enforcement):**
  - Verify that subscription activation or renewal requires authoritative server-side backend payment confirmation, and that frontend callbacks alone cannot activate entitlements. Tests `BMS-PAY-002`.
- **`GATE-BMS-23` (Prepaid & Postpaid Support Enforcement):**
  - Verify that the billing engine supports prepaid retail billing and postpaid corporate fleet billing on credit terms without inventing credit scoring or late fee algorithms. Tests `BMS-PAY-003`.
- **`GATE-BMS-24` (Postpaid Activation Conflict Enforcement):**
  - Verify that the specification explicitly records the authority conflict between `MSE-PAY-001` backend payment confirmation and `CTCM-PAY-007` postpaid billing on credit terms, preserving it for upstream policy resolution. Tests `BMS-PAY-004`.
- **`GATE-BMS-25` (Commercial Refund Governance Enforcement):**
  - Verify that refunds adjust billing ledgers under defined commercial policies while preserving immutable audit logs and preventing customer support agents from issuing unauthorized refunds. Tests `BMS-REF-001`.
- **`GATE-BMS-26` (Statutory Tax Readiness Enforcement):**
  - Verify that commercial invoices maintain data model readiness to support statutory VAT and withholding taxes under `LEGAL / FINANCIAL VERIFICATION REQUIRED` without conflating vehicle tax tokens with platform revenue. Tests `BMS-TAX-001`.
- **`GATE-BMS-27` (Tax Rule Deferral Enforcement):**
  - Verify that the specification defers specific Bangladesh VAT percentages and withholding tax brackets without hardcoding unverified tax numbers. Tests `BMS-TAX-002`.
- **`GATE-BMS-28` (Three Operational Ledgers Enforcement):**
  - Verify that Customer Referral Rewards, Sales Staff Commissions, and Dealer Margins are maintained as three strictly independent, auditable operational ledgers. Tests `BMS-LED-001`.
- **`GATE-BMS-29` (General Ledger Exclusion Enforcement):**
  - Verify that the three operational ledgers are not converted into a double-entry General Ledger chart of accounts or corporate accounting engine. Tests `BMS-LED-002`.
- **`GATE-BMS-30` (Multi-Tenant Record Isolation Enforcement):**
  - Verify that telematics message counts, device usage meters, invoices, and payments belonging to Tenant A are never accessible to or aggregated into Tenant B. Tests `BMS-TEN-001`.
- **`GATE-BMS-31` (Webhook Trust Boundary Enforcement):**
  - Verify that inbound payment gateway webhooks are treated as untrusted external inputs requiring source verification and authoritative tenant mapping before mutating state. Tests `BMS-TEN-002`.
- **`GATE-BMS-32` (Role Persona & Machine Authority Enforcement):**
  - Verify that operational personas align strictly with approved URPA roles, nonexistent roles (`PLATFORM_SUPER_ADMIN`, `FLEET_SUPERVISOR`, `SUBSCRIBER_OWNER`) are prohibited, and background billing workers operate under scoped machine credentials. Tests `BMS-IAM-001`.
- **`GATE-BMS-33` (Billing Mutation Token Gap Enforcement):**
  - Verify that the specification records the absence of granular billing IAM permission tokens and mutation rights in URPA without fabricating unauthorized permissions. Tests `BMS-IAM-002`.
- **`GATE-BMS-34` (SIM Charging & Carrier Decoupling Enforcement):**
  - Verify that customer SIM charges are billed as commercial line items while wholesale carrier billing APIs and data overage pass-through are deferred under `CARRIER API NOT ESTABLISHED UPSTREAM`. Tests `BMS-SIM-001`.
- **`GATE-BMS-35` (Tracking Provider Independence Enforcement):**
  - Verify that Tracking Provider gateway contracts are independent of customer SaaS subscriptions, and that provider cost pass-through formulas are not hardcoded. Tests `BMS-PRV-001`.
- **`GATE-BMS-36` (SWR Repair Billing Intake Enforcement):**
  - Verify that SWR technical fault classifications are consumed by billing to generate out-of-warranty repair invoices, while labor rates and parts markup schedules remain deferred. Tests `BMS-SWR-001`.
- **`GATE-BMS-37` (Media Usage Emission Intake Enforcement):**
  - Verify that media operations emit structured usage events to the metering pipeline without treating each event as an established billable meter or hardcoding per-GB/per-minute prices. Tests `BMS-MED-001`.
- **`GATE-BMS-38` (Sales/Support/Rescue Boundaries Enforcement):**
  - Verify that Sales and Support access only approved commercial context without vehicle tracking access, Support cannot issue refunds or alter rate cards, and Rescue holds zero commercial authority. Tests `BMS-OPS-001`.
- **`GATE-BMS-39` (Canonical Engine Commands Enforcement):**
  - Verify that immobilization references strictly enforce canonical terms `Engine Disable` and `Engine Restore`, and that commercial status never bypasses CSE safety interlocks. Tests `BMS-CMD-001`.
- **`GATE-BMS-40` (Hardware Capability Subordination Enforcement):**
  - Verify that billing consumes device capabilities and vehicle compatibility from DCR and VKR without manufacturing technical capabilities, and confirms that commercial subscriptions cannot unlock unsupported hardware features. Tests `BMS-DEV-001`.
- **`GATE-BMS-41` (Immutable Audit Trail Logging Enforcement):**
  - Verify that tamper-resistant audit logs capture User ID, Tenant ID, IP Address, Timestamp, Action, Target Entity, and Outcome for all billing adjustments and sensitive operations. Tests `BMS-AUD-001`.
- **`GATE-BMS-42` (High-Scale Target & Decoupling Enforcement):**
  - Verify that the architecture targets approximately 2,000,000 connected devices and strictly decouples real-time telemetry ingestion and media storage from transactional billing databases. Tests `BMS-SCL-001`.
- **`GATE-BMS-43` (Throughput Target Deferral Enforcement):**
  - Verify that the specification defers specific billing TPS, meter events/second, and invoice batch run duration targets without inventing unsupported scale SLAs. Tests `BMS-SCL-002`.

---

## 23. Built-In Static Audit (Categories A–T)

### Category A: Source Integrity & Upstream Reference Validation
- **Audit Evaluation:** Verified that all 16 approved specifications are cited with their exact canonical commit hashes (including `abef605`, `a962a2a`, `25e7834`, `93d7a4e`, `4014141`, `88bcd53`, `5c9fe52`, `0e60ce3`, `d26153b`, `ebccd29`, `220ac0d`, `97cd070`, `4542f84`, `c8d8dbd`, `20037e3`, `1d56517`). Zero phantom short hashes exist.
- **Audit Verdict:** **PASS**

### Category B: Commercial Entity Separation
- **Audit Evaluation:** Verified that the core separation invariant $Tenant \neq Customer \neq Customer Account \neq Contracting Customer \neq Subscriber \neq Payer \neq Vehicle Owner \neq Driver$ is strictly preserved (`BMS-GEN-002`). Payer status grants zero vehicle tracking permissions (`CTCM-PAY-002`). `Billing Account` is prohibited as an unapproved canonical entity (`BMS-GEN-004`).
- **Audit Verdict:** **PASS**

### Category C: Subscription / Entitlement Separation
- **Audit Evaluation:** Verified that customer subscription is subordinate to tenant entitlement (`MSE-SUB-001`, `BMS-ENT-001`). Entitlement lifecycle (`MSE-LFC-001`) and customer subscription state set (`PRD-SUB-001`) remain strictly separate without cross-model conflation (`BMS-ENT-002`).
- **Audit Verdict:** **PASS**

### Category D: IAM Role / Permission Authority Purity
- **Audit Evaluation:** Verified that operational roles align with authentic URPA personas (`PLATFORM_OWNER`, `PLATFORM_ADMIN`, `TENANT_ADMIN`, `FLEET_MANAGER`, `SALES_AGENT`, `CUSTOMER_SERVICE`, `CUSTOMER_OWNER`, `DRIVER`). Nonexistent personas (`PLATFORM_SUPER_ADMIN`, `FLEET_SUPERVISOR`, `SUBSCRIBER_OWNER`) are strictly prohibited (`BMS-IAM-001`). Confirms absence of granular billing IAM tokens (`BMS-IAM-002`).
- **Audit Verdict:** **PASS**

### Category E: Pricing / Rate-Card / Open-Decision Fidelity
- **Audit Evaluation:** Preserves `DEC-004` (package pricing & rate cards: `TBD / Configurable per tenant and market policy`) and `DEC-008` (payment gateway provider selection: `TBD / Integration candidate selection`) as open decisions without premature resolution. Zero hardcoded numeric prices, currencies, or volume band numbers exist.
- **Audit Verdict:** **PASS**

### Category F: Meter Classification Purity
- **Audit Evaluation:** Enforces the 5-tier meter classification model (Classes A, B, C, D, E) in `BMS-MTR-001` and maps platform dimensions with zero silent conversions. Operational technical metrics (API calls, telemetry volume, voice minutes) are not converted into billable meters (`BMS-MTR-002`).
- **Audit Verdict:** **PASS**

### Category G: Usage Event / Rating Separation
- **Audit Evaluation:** Distinguishes usage events emitted by upstream domain engines (`MSE-BIL-001`, `MVV-ENT-003`) from rated billable quantities (`BMS-USG-001`). Defers rating formulas, aggregation algorithms, and billing cutoffs under `AUTHORITY GAP — USAGE-TO-BILLING RATING MODEL NOT ESTABLISHED UPSTREAM` (`BMS-USG-002`).
- **Audit Verdict:** **PASS**

### Category H: Invoice / Payment Lifecycle Non-Invention
- **Audit Evaluation:** Enforces automated structured invoicing content (`PRD-BIL-001`, `CTCM-PAY-006`) in `BMS-INV-001`. Defers invoice lifecycle states (`DRAFT`, `ISSUED`, `PAID`, `VOID`) and payment states (`PENDING`, `SETTLED`, `FAILED`) as unestablished upstream (`BMS-INV-002`).
- **Audit Verdict:** **PASS**

### Category I: Payment Gateway Abstraction Purity
- **Audit Evaluation:** Preserves candidate gateways (`bKash`, `Nagad`, `SSLCommerz`, `Bank Transfer`, `COD`) as illustrative candidate options under `DEC-008` (`BMS-PAY-001`). Enforces authoritative backend payment confirmation before entitlement activation (`MSE-PAY-001`, `BMS-PAY-002`).
- **Audit Verdict:** **PASS**

### Category J: Tax / Legal / Financial Verification Purity
- **Audit Evaluation:** Enforces data model readiness for statutory taxes under `LEGAL / FINANCIAL VERIFICATION REQUIRED` (`CTCM-PAY-005`, `BMS-TAX-001`). Preserves `TAX / FISCAL BILLING RULES NOT ESTABLISHED UPSTREAM` without inventing Bangladesh VAT or withholding rates (`BMS-TAX-002`).
- **Audit Verdict:** **PASS**

### Category K: Tenant Isolation & Machine Authority
- **Audit Evaluation:** Enforces semantic multi-tenant isolation of billing records, meters, invoices, and payments (`TISB-SEC-002`, `BMS-TEN-001`). Enforces inbound payment webhook trust boundary (`TISB-INT-002`, `BMS-TEN-002`) and machine worker authority scoping (`URPA-SYS-001`, `TISB-ACT-008`, `BMS-IAM-001`).
- **Audit Verdict:** **PASS**

### Category L: SIM / Carrier Commercial Boundary
- **Audit Evaluation:** Decouples SIM operational inventory lifecycle from customer retail billing (`SMDI-GEN-002`, `BMS-SIM-001`). Preserves `CARRIER API NOT ESTABLISHED UPSTREAM` and excludes wholesale carrier data overage billing pass-through.
- **Audit Verdict:** **PASS**

### Category M: Tracking Provider Commercial Boundary
- **Audit Evaluation:** Enforces tracking provider contractual independence from customer SaaS subscriptions (`TPA-COM-001`, `CTCM-B2B-003`, `BMS-PRV-001`). Excludes gateway fee calculation and wholesale cost pass-through (`TPA-COM-002`).
- **Audit Verdict:** **PASS**

### Category N: Service / Warranty / RMA Commercial Boundary
- **Audit Evaluation:** Enforces intake of SWR technical classification tokens (`BILLABLE_REPAIR`, `WARRANTY_COVERED`) for customer repair invoicing (`SWR-BIL-001`, `GATE-SWR-16`, `BMS-SWR-001`). Confirms labor rates and parts markup schedules are deferred to Billing.
- **Audit Verdict:** **PASS**

### Category O: Media / Voice Metering Boundary
- **Audit Evaluation:** Validates media usage event emission intake (`MVV-ENT-003`, `BMS-MED-001`). Preserves `MEDIA AND VOICE USAGE PRICING NOT ESTABLISHED UPSTREAM` without inventing per-GB storage or per-minute streaming fees (`MVV-SCL-001`, `MVV-DEF-001`).
- **Audit Verdict:** **PASS**

### Category P: Command / Device / Vehicle Technical Authority Purity
- **Audit Evaluation:** Strictly enforces canonical command names **`Engine Disable`** and **`Engine Restore`** (`CSE-SAF-001`, `BMS-CMD-001`). Commercial status never overrides command safety interlocks (`CTCM-GEN-008`, `CSE-ACK-001`). Billing is strictly subordinate to DCR device capabilities and VKR compatibility (`BMS-DEV-001`).
- **Audit Verdict:** **PASS**

### Category Q: Audit & Financial Ledger Boundary
- **Audit Evaluation:** Enforces immutable audit logging for sensitive billing adjustments capturing the 7 mandatory attributes (`PRD-AUD-002`, `URPA-AUD-003`, `BMS-AUD-001`). Preserves strict separation of the 3 operational ledgers (`PRD-REF-004`, `BMS-LED-001`) and excludes double-entry General Ledgers (`CTCM-REF-002`, `BMS-LED-002`).
- **Audit Verdict:** **PASS**

### Category R: Requirement / Traceability Integrity
- **Audit Evaluation:** Exactly 43 formal BMS requirements defined (`BMS-GEN-001` through `BMS-SCL-002`). Exactly 43 physical rows in the Traceability Matrix matching requirements 1:1. Zero duplicate, malformed, orphan, or missing IDs.
- **Audit Verdict:** **PASS**

### Category S: Acceptance Coverage / Scale / Implementation Neutrality
- **Audit Evaluation:** Exactly 43 acceptance gates (`GATE-BMS-01` through `GATE-BMS-43`), each testing exactly one BMS requirement (`Tests BMS-...`). Enforces 2,000,000 device target and workload decoupling (`PRD-SCL-001`, `PRD-DAT-001`, `BMS-SCL-001`) while deferring numeric throughput SLAs (`BMS-SCL-002`). Mandates zero proprietary infrastructure or frameworks (`BMS-GEN-005`).
- **Audit Verdict:** **PASS**

### Category T: Git Working Tree / Application-Code Integrity
- **Audit Evaluation:** Verification confirms that exactly one repository file (`docs/03_specs/BILLING_METERING_SPEC.md`) is drafted in the working tree. Zero application code modified. Zero staged or committed changes.
- **Audit Verdict:** **PASS**
