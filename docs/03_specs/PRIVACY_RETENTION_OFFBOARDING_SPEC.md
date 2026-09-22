# Privacy, Retention & Offboarding Specification

**Document ID:** PRO-SPEC-001  
**Version:** v1.0  
**Status:** APPROVED  
**Draft Date:** 2026-09-21  
**Approval Date:** 2026-09-22  
**Classification:** Internal Architectural Specification  
**Requirement Namespace:** `PRO-*`  
**Acceptance Gate Namespace:** `GATE-PRO-##`

---

## 1. Document Control & Governance

### 1.1 Purpose & Authority
This specification establishes architectural governance, data lifecycles, retention policies, privacy controls, and offboarding workflows for the EasyTracker Vehicle Tracking Standalone Launch platform. It provides the canonical working specification for:
1. Data classification and sensitivity boundaries across platform information assets.
2. Configurable retention schedules and tiered purge procedures.
3. Decoupling operational access revocation from statutory data preservation.
4. Offboarding state machines spanning twelve distinct platform entity lifecycles.
5. Customer data portability, export boundary controls, and multi-tenant isolation.
6. Server-side credential invalidation upon offboarding.
7. Architectural boundaries between append-only audit trails, commercial ledgers, and privacy deletion requests.

- **PRO-DOC-001 (Specification Authority & Precedence Hierarchy):** In accordance with project governance, this specification is strictly governed by the following precedence hierarchy:
  1. *Latest explicit approved user directive.*
  2. *Approved downstream specifications in `docs/03_specs/`.*
  3. *Approved `PRODUCT_REQUIREMENTS.md` (`abef60593db6a34c144341f9c70503c5bda7faa6`).*
  4. *Approved upstream architecture specifications.*
  5. *Actual repository/code evidence.*
  6. *Engineering recommendations only where upstream authority genuinely does not exist.*

### 1.2 Non-Goals & Architectural Boundaries
- **PRO-DOC-002 (Explicit Non-Goals):** This specification defines software architecture and engineering invariants. It explicitly disclaims the following non-goals:
  1. A localized legal handbook or jurisdiction-specific compliance manual.
  2. A statutory taxation, commercial accounting, or company bookkeeping code.
  3. Physical database table schemas, DDL scripts, or index optimization parameters.
  4. Low-level storage engine implementations, file system block allocations, or disk partitioning.
  5. Commercial backup product purchase evaluations or backup software vendor contracts.
  6. An overhaul or re-architecture of the platform IAM role taxonomy (`URPA`).
  7. Ingestion protocol wire formats or external tracking provider hardware API contracts (`TPA`, `IRAS`).

### 1.3 Implementation Neutrality
- **PRO-DOC-003 (Implementation Neutrality Invariant):** This specification mandates architectural capabilities, state machines, and invariants without dictating proprietary technologies, cloud-vendor services, or database engines. Specifically, the system design MUST NOT depend on or mandate:
  1. Specific database row-level security implementations or database-specific stored procedures/triggers.
  2. Database-per-tenant or schema-per-tenant physical isolation topologies.
  3. Cloud object storage lifecycle configurations or vendor-specific storage tiers.
  4. Specific messaging brokers or distributed log engines.
  5. Specific container orchestration schedulers or deletion queue frameworks.
  6. Proprietary Data Loss Prevention tools, hardware security modules, or commercial backup products.

---

## 2. Executive Summary & Core Architectural Boundaries

The EasyTracker platform processes high-velocity telematics, real-time spatial positioning, sensitive in-cabin audio recordings, dual-facing dashcam video, commercial financial transactions, and mission-critical emergency rescue coordinates. Protecting user privacy, adhering to statutory preservation mandates, and safely deprovisioning entities without causing collateral data loss or multi-tenant boundary breaches requires strict architectural boundaries.

### 2.1 Foundational Architectural Invariants
1. **Access Revocation Decoupled from Data Deletion:** Disabling access for an expired, suspended, or offboarded entity MUST NOT trigger immediate destructive data purges. Data enters statutory retention schedules (`MSE-DNG-001`, `TISB-PRVY-001`, `URPA-USER-005`).
2. **Immutable Audit Preservation:** Platform audit logs are append-only and cryptographically sealed; they cannot be modified or deleted by any user or administrator (`PRD-AUD-002`, `URPA-USER-004`). Privacy deletions and account deprovisioning MUST NEVER modify or delete historical audit entries.
3. **Commercial Ledger Preservation:** Past invoices, completed orders, and historical payment records remain immutable (`CTCM-AUD-005`, `PRD-REF-004`, `BMS-GEN-002`). Account offboarding terminates recurring billing without modifying or purging existing financial ledgers.
4. **Fail-Closed Surveillance & Deletion Gates:** Real-time spatial tracking, cabin audio listening, and dashcam video streaming require active entitlement and verified operational purpose (`TISB-PRVY-003`). Manual media deletion requests fail closed (`MVV-IAM-005` Gap 3).
5. **Multi-Tenant Export & Purge Isolation:** Batch purge and export routines operate strictly within verified tenant and customer scopes (`TISB-PRVY-002`, `TISB-PRVY-004`). Shared system metadata and cross-tenant data MUST NEVER leak during data portability exports.

---

## 3. Approved Upstream Baseline & Reconciliation

- **PRO-DOC-004 (Approved Upstream Baseline Alignment):** This specification is verified against and builds directly upon all 17 approved specifications in `docs/03_specs/` at their canonical Git-verified approval commit hashes:

| # | Specification Title | Canonical Path | Canonical Approved Commit Hash |
| :--- | :--- | :--- | :--- |
| 1 | `PRODUCT_REQUIREMENTS.md` | `docs/03_specs/PRODUCT_REQUIREMENTS.md` | `abef60593db6a34c144341f9c70503c5bda7faa6` |
| 2 | `MODULE_SERVICE_ENTITLEMENT_SPEC.md` | `docs/03_specs/MODULE_SERVICE_ENTITLEMENT_SPEC.md` | `a962a2a22a55060aea6d4efd630b2f209943adba` |
| 3 | `USER_ROLES_PERMISSIONS_ACCESS_SPEC.md` | `docs/03_specs/USER_ROLES_PERMISSIONS_ACCESS_SPEC.md` | `25e783447c96d3128f8ebaa51c78e8c0f6ec85de` |
| 4 | `TENANT_ISOLATION_SECURITY_BOUNDARY_SPEC.md` | `docs/03_specs/TENANT_ISOLATION_SECURITY_BOUNDARY_SPEC.md` | `93d7a4eb11d37d229844f86fec2b05434c309fc3` |
| 5 | `CUSTOMER_TYPES_COMMERCIAL_MODEL_SPEC.md` | `docs/03_specs/CUSTOMER_TYPES_COMMERCIAL_MODEL_SPEC.md` | `401414171edd1612394980ef9a734a859fed21b6` |
| 6 | `TRACKING_PROVIDER_ARCHITECTURE_SPEC.md` | `docs/03_specs/TRACKING_PROVIDER_ARCHITECTURE_SPEC.md` | `88bcd536cd252c1419d49887370be1993738ba91` |
| 7 | `DEVICE_CAPABILITY_REGISTRY_SPEC.md` | `docs/03_specs/DEVICE_CAPABILITY_REGISTRY_SPEC.md` | `5c9fe52c8350167a880fcea38d3654a2c00dcb31` |
| 8 | `VEHICLE_KNOWLEDGE_REGISTRY_SPEC.md` | `docs/03_specs/VEHICLE_KNOWLEDGE_REGISTRY_SPEC.md` | `0e60ce3484c307b0451c46c120711ef0cef3acca` |
| 9 | `REGULATORY_KNOWLEDGE_SERVICE_SPEC.md` | `docs/03_specs/REGULATORY_KNOWLEDGE_SERVICE_SPEC.md` | `d26153bce8b6eab21fbf0b50fd8c176aeb8feb40` |
| 10 | `COMMAND_SAFETY_EXECUTION_SPEC.md` | `docs/03_specs/COMMAND_SAFETY_EXECUTION_SPEC.md` | `ebccd291d8d14152b30c7591c10b4b6eab20afa5` |
| 11 | `FLEET_PACK_SPEC.md` | `docs/03_specs/FLEET_PACK_SPEC.md` | `220ac0d90d76db36d5e03b117bc0e8bcb2264651` |
| 12 | `SALES_SUPPORT_RESCUE_SPEC.md` | `docs/03_specs/SALES_SUPPORT_RESCUE_SPEC.md` | `97cd0704454b87c4a9474c2675a533ec2cb67f76` |
| 13 | `SIM_M2M_DEVICE_INVENTORY_SPEC.md` | `docs/03_specs/SIM_M2M_DEVICE_INVENTORY_SPEC.md` | `4542f84b0a9b2fd78c49376fb916bc41c4761c91` |
| 14 | `SERVICE_WARRANTY_RMA_SPEC.md` | `docs/03_specs/SERVICE_WARRANTY_RMA_SPEC.md` | `c8d8dbdbb1d67e0691c311993890b1f228dd01b5` |
| 15 | `MEDIA_VOICE_VIDEO_SPEC.md` | `docs/03_specs/MEDIA_VOICE_VIDEO_SPEC.md` | `20037e34a2396ea03fb65f1eff7f7427761038c3` |
| 16 | `INTEGRATION_REGISTRY_API_SYNC_SPEC.md` | `docs/03_specs/INTEGRATION_REGISTRY_API_SYNC_SPEC.md` | `1d56517dab3f23c5ce282620a1f4efada6728942` |
| 17 | `BILLING_METERING_SPEC.md` | `docs/03_specs/BILLING_METERING_SPEC.md` | `87b8ec12764ad563444cfbcb3a969f69d5901f0d` |

---

## 4. Privacy Architecture & Purpose Limitation Boundary

- **PRO-PRV-001 (Purpose Limitation & Authorization Gates):** In accordance with `PRD-PRV-005` and `TISB-PRVY-003`, real-time location telemetry, live video streaming, and cabin audio monitoring MUST be strictly gated by verified purpose limitation. The platform MUST verify mandatory authorization conditions before streaming or exposing real-time vehicle spatial or surveillance data:
  1. An active customer subscription entitlement covering the requested capability (`MSE-ACC-001`, `CTCM-LCY-004`).
  2. An authenticated user session possessing appropriate granular role permissions (`URPA-ROLE-007..010`).
  3. Device capability truth (`DCR-CAP-001`) and purpose/legal consent validation where mandated (`PRD-PRV-005`, `TISB-PRVY-003`).
  Special operational context elevation constraints (such as valid customer support ticket `SSR-SUP-002` or verified emergency rescue incident `SSR-RSC-001`) govern temporary diagnostic and emergency rescue tracking overrides, and MUST NOT be imposed as a universal fleet tracking prerequisite. Unconsented or contextless continuous background surveillance by administrators is strictly prohibited.

- **PRO-PRV-002 (Surveillance Privacy Notice & Operational Disclosures):** Vehicle hardware capable of in-cabin audio recording or interior dashcam streaming MUST support visual or audible recording indicators where mandated by transport regulations (`PRD-REG-001`, `MVV-PRI-001`). Specific statutory legal requirements regarding passenger consent, driver notification, and surveillance compliance remain external to software architecture (`MVV-PRI-002`, `LEGAL / REGULATORY VERIFICATION REQUIRED`).

- **PRO-PRV-003 (Third-Party AI/ML Data Isolation Invariant):** Under `DEC-014` and `PRD-SEC-003`, zero customer PII, live vehicle spatial telemetry, trip history logs, cabin voice recordings, or dashcam video clips MAY be transmitted to public third-party foundation AI models or unverified cloud analytics APIs. All privacy-sensitive machine inference MUST occur within contractually isolated and tenant-bound processing pipelines.

---

## 5. Data Classification & Sensitivity Tiering

- **PRO-DAT-001 (Evidence-Based Data Classification Taxonomy):** The platform defines twenty-seven canonical data classes. Each data class is classified strictly according to approved upstream evidence:

| # | Data Class | Tenant Scoped? | Sensitivity Classification Status | Retention Classification | Export Eligible? | Upstream Authority IDs |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| 1 | **Tenant Account Data** | Yes (Root) | SENSITIVITY CLASSIFICATION NOT FORMALLY ESTABLISHED UPSTREAM | Class B | Yes | `PRD-TEN-001`, `TISB-PRVY-001`, `CTCM-B2B-009` |
| 2 | **Customer Account Data** | Yes | EXPLICIT SENSITIVITY CLASSIFICATION ESTABLISHED | Class B | Yes | `PRD-CUST-001`, `CTCM-LCY-004`, `PRD-PRV-005` |
| 3 | **User Identity / Profile Data** | Yes | EXPLICIT SENSITIVITY CLASSIFICATION ESTABLISHED | Class B | Yes | `PRD-ID-001`, `URPA-USER-004`, `PRD-PRV-005` |
| 4 | **Vehicle Master Records** | Yes | SENSITIVITY CLASSIFICATION NOT FORMALLY ESTABLISHED UPSTREAM | Class B | Yes | `PRD-VKR-001`, `TISB-SEC-007`, `CTCM-DEV-010` |
| 5 | **Driver Profile & License Data** | Yes | EXPLICIT SENSITIVITY CLASSIFICATION ESTABLISHED | Class B | Yes | `PRD-FLT-001`, `URPA-ROLE-010` |
| 6 | **Live Spatial Telemetry (GPS)** | Yes | EXPLICIT SENSITIVITY CLASSIFICATION ESTABLISHED | Class D | No (Historical only) | `PRD-PRV-005`, `TISB-PRVY-003`, `DEC-005` |
| 7 | **Historical Location Breadcrumbs**| Yes | EXPLICIT SENSITIVITY CLASSIFICATION ESTABLISHED | Class B | Yes | `PRD-HST-001`, `PRD-RET-001`, `PRD-PRV-005` |
| 8 | **Normalized Trip Summaries** | Yes | SENSITIVITY CLASSIFICATION NOT FORMALLY ESTABLISHED UPSTREAM | Class B | Yes | `PRD-TRP-001`, `PRD-RET-001`, `MSE-DNG-001` |
| 9 | **Geofences & Spatial Corridors** | Yes | SENSITIVITY CLASSIFICATION NOT FORMALLY ESTABLISHED UPSTREAM | Class B | Yes | `PRD-GEO-001`, `MSE-LFC-001` |
| 10 | **Hardware Identifiers (IMEI)** | Yes | SENSITIVITY CLASSIFICATION NOT FORMALLY ESTABLISHED UPSTREAM | Class B | Yes | `SMDI-GEN-002`, `TISB-SEC-007`, `DCR-CAP-001` |
| 11 | **SIM Identifiers (ICCID/MSISDN)** | Yes | EXPLICIT SENSITIVITY CLASSIFICATION ESTABLISHED | Class B | Yes | `SMDI-SIM-003`, `PRD-SIM-001` |
| 12 | **Tracking Provider Credentials** | Yes / System | EXPLICIT SENSITIVITY CLASSIFICATION ESTABLISHED | Class C | No (Secret) | `TISB-SEC-011`, `TPA-OFF-001` |
| 13 | **Integration API Keys & Secrets** | Yes / System | EXPLICIT SENSITIVITY CLASSIFICATION ESTABLISHED | Class D | No (Secret) | `IRAS-SEC-001..003`, `TISB-SEC-011` |
| 14 | **Customer Support Tickets** | Yes | SENSITIVITY CLASSIFICATION NOT FORMALLY ESTABLISHED UPSTREAM | Class B | Yes | `SSR-SUP-001..003`, `PRD-RET-001` |
| 15 | **Support Diagnostic Access** | Yes | EXPLICIT SENSITIVITY CLASSIFICATION ESTABLISHED | Class D | No (Ephemeral) | `SSR-SUP-002`, `DEC-005` |
| 16 | **Emergency Rescue Records** | Yes | EXPLICIT SENSITIVITY CLASSIFICATION ESTABLISHED | Class B | Yes | `SSR-RSC-001`, `DEC-006`, `PRD-RET-001` |
| 17 | **Cabin Audio Recordings** | Yes | EXPLICIT SENSITIVITY CLASSIFICATION ESTABLISHED | Class B | Yes | `PRD-RET-001`, `MVV-PRI-001..004`, `DEC-011` |
| 18 | **Dashcam Video Recordings** | Yes | EXPLICIT SENSITIVITY CLASSIFICATION ESTABLISHED | Class B | Yes | `PRD-RET-001`, `MVV-PRI-001..004`, `DEC-010` |
| 19 | **Locked Media Evidence** | Yes | EXPLICIT SENSITIVITY CLASSIFICATION ESTABLISHED | Class B | Yes | `MVV-EVD-001..005`, `URPA-EXP-001` |
| 20 | **Commercial Billing Invoices** | Yes | SENSITIVITY CLASSIFICATION NOT FORMALLY ESTABLISHED UPSTREAM | Class B | Yes | `CTCM-AUD-005`, `BMS-GEN-002`, `PRD-BIL-001` |
| 21 | **Completed Payment Records** | Yes | SENSITIVITY CLASSIFICATION NOT FORMALLY ESTABLISHED UPSTREAM | Class B | Yes | `CTCM-AUD-005`, `BMS-GEN-003` |
| 22 | **Partner Commission Ledgers** | Yes | SENSITIVITY CLASSIFICATION NOT FORMALLY ESTABLISHED UPSTREAM | Class B | Yes | `PRD-REF-004`, `CTCM-AUD-004` |
| 23 | **Security & System Audit Logs** | Yes / System | SENSITIVITY CLASSIFICATION NOT FORMALLY ESTABLISHED UPSTREAM | Class B | Yes | `PRD-AUD-002`, `URPA-AUD-001`, `TISB-AUD-003` |
| 24 | **Demo & Synthetic Telematics** | Yes (Sandbox) | SENSITIVITY CLASSIFICATION NOT FORMALLY ESTABLISHED UPSTREAM | Class E | No | `PRD-DMO-001`, `MSE-CONV-001`, `MVV-DMO-001` |
| 25 | **Regulatory Catalog Records** | Global / Tenant | SENSITIVITY CLASSIFICATION NOT FORMALLY ESTABLISHED UPSTREAM | Class B | Yes | `PRD-REG-001`, `RKS-REG-001` |
| 26 | **Service, Warranty & RMA Records**| Yes | SENSITIVITY CLASSIFICATION NOT FORMALLY ESTABLISHED UPSTREAM | Class B | Yes | `SWR-BIL-001`, `PRD-WAR-001`, `SMDI-GEN-002` |
| 27 | **Safety Command History** | Yes | EXPLICIT SENSITIVITY CLASSIFICATION ESTABLISHED | Class B | Yes | `PRD-RET-001`, `CSE-SAF-001`, `PRD-CMD-001` |

- **PRO-DAT-002 (Access Gating by Established Sensitivity):** Where explicit sensitivity classifications are established upstream, access to data assets MUST be gated by verified role permissions, active subscription entitlements, and operational context (`TISB-PRVY-003`, `PRD-SEC-003`). General tenant membership alone does not grant access to surveillance audio, video, or secret credentials.

---

## 6. Configurable Retention Schedules & Tiered Purge Models

- **PRO-RET-001 (Configurable Retention Class Schedules):** Pursuant to `PRD-RET-001`, the platform MUST support independent, tenant-configurable retention policies for the nine canonical retention classes:
  1. *Raw Telemetry Packets* (high-frequency NMEA frames and binary sensor samples).
  2. *Normalized Position Coordinates & Trip Summaries*.
  3. *Device Command & Execution Audit History*.
  4. *High-Alert Incidents & Panic SOS Logs*.
  5. *Customer Support & Diagnostic Service Records*.
  6. *Emergency Rescue Mission Operations Records*.
  7. *Cabin Voice Recordings*.
  8. *Dashcam Video Clips & Incident Snapshots*.
  9. *System Security & Access Audit Logs*.

- **PRO-RET-002 (Statutory Retention Duration Non-Invention):** Pursuant to `PRD-RET-002` and open decisions `DEC-009`, `DEC-010`, and `DEC-011`, exact retention durations are explicitly designated as `TBD + Statutory legal/privacy verification required`. Platform engineering MUST NOT hardcode or invent retention periods in code or schema defaults. Schedulers MUST accept tenant policy configuration parameters constrained only by statutory regulatory verification (`PRD-REG-001`).

- **PRO-RET-003 (Tenant-Scoped Data Tier Purge Isolation):** Under `TISB-PRVY-004`, purge and retention workflows MUST operate strictly per data tier and tenant scope. Automated purge routines MUST guarantee that:
  1. Records are evaluated strictly within the verified tenant scope and data classification.
  2. Records flagged under an active evidence lock (`MVV-EVD-001`) are excluded from automated purge.
  3. Purge operations in one tenant scope never impact or corrupt records belonging to another tenant scope.
  4. An audit event is emitted recording purge execution metadata (`PRD-AUD-002`).

---

## 7. Offboarding Scopes & Multi-Tier Lifecycle State Machines

- **PRO-OFF-001 (Distinct Offboarding Lifecycles Invariant):** The platform recognizes twelve independent offboarding scopes. Software architecture and orchestration workers MUST NOT collapse, conflate, or merge these lifecycles.

- **PRO-OFF-002 (Comprehensive Offboarding Scope Matrix):**

| Lifecycle Scope | Literal Upstream Authority | Access Effect | Entitlement Effect | Routing / Technical Effect | Historical Data Effect | Credential Effect | Commercial Effect | Audit Effect | Authority Gap |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **1. Tenant Offboarding** | `CTCM-B2B-009`, `TISB-PRVY-001`, `URPA-USER-005` | [DIRECT UPSTREAM] Immediate access revocation for all associated tenant users (`URPA-USER-005`, `TISB-PRVY-001`). | [DOWNSTREAM ARCHITECTURAL COMPOSITION] Tenant master subscription modules suspended or terminated (`MSE-LFC-001`). | [DOWNSTREAM ARCHITECTURAL COMPOSITION] Operational ingestion and webhook delivery unlinked for offboarded tenant. | [DIRECT UPSTREAM] Data enters statutory retention and eventual purge lifecycle (`TISB-PRVY-001`, `URPA-USER-005`). | [DIRECT UPSTREAM] Invalidation of tenant user access sessions (`URPA-USER-005`). | [DIRECT UPSTREAM] Ceases billing per commercial model (`CTCM-LCY-004`). | [DIRECT UPSTREAM] Audit trails for the tenant MUST be retained for statutory compliance (`URPA-USER-005`). | [NOT ESTABLISHED UPSTREAM] Automated purge SLA and grace period not established upstream (`GAP-17`). |
| **2. Customer Closure** | `CTCM-LCY-004`, `PRD-PRV-005` | [DIRECT UPSTREAM] Customer portal and mobile application access disabled. | [DOWNSTREAM ARCHITECTURAL COMPOSITION] Customer vehicle tracking subscriptions terminated. | [DOWNSTREAM ARCHITECTURAL COMPOSITION] Customer vehicle associations unbound from active tracking views. | [DIRECT UPSTREAM] Telemetry archived according to statutory retention schedules (`PRD-RET-001`, `CTCM-LCY-004`). | [DIRECT UPSTREAM] Customer user sessions invalidated (`URPA-USER-004`). | [DIRECT UPSTREAM] Ceases billing; past invoices and orders remain immutable (`CTCM-LCY-004`, `CTCM-AUD-005`). | [DIRECT UPSTREAM] Account closure logged; historical audit trail preserved (`PRD-AUD-002`). | [NOT ESTABLISHED UPSTREAM] Privacy deletion precedence over statutory preservation not established upstream (`GAP-15`). |
| **3. Subscription Expiry** | `MSE-DNG-001`, `MSE-ACC-001`, `BMS-SUB-001` | [DIRECT UPSTREAM] High-risk commands and premium features disabled immediately (`MSE-DNG-001`). | [DIRECT UPSTREAM] Subscription transitions to expired or base entitlement tier (`MSE-LFC-001`, `BMS-SUB-001`). | [DOWNSTREAM ARCHITECTURAL COMPOSITION] Command gateway rejects restricted command executions. | [DIRECT UPSTREAM] Historical data (trips, alerts, reports) MUST NOT be deleted (`MSE-DNG-001`, `MSE-ACC-001` item 14). | [DOWNSTREAM ARCHITECTURAL COMPOSITION] User credentials remain active for non-restricted operations. | [DIRECT UPSTREAM] Recurring usage metering ceases (`BMS-GEN-002`). | [DIRECT UPSTREAM] Subscription lifecycle transition logged to audit stream (`BMS-GEN-002`). | [NOT ESTABLISHED UPSTREAM] Commercial subscription grace period duration not established upstream. |
| **4. User Deactivation** | `URPA-USER-004` | [DIRECT UPSTREAM] Active sessions and refresh tokens invalidated; temporary access grants revoked immediately (`URPA-USER-004`). | [DIRECT UPSTREAM] User role assignments deprovisioned (`URPA-USER-004`). | [DOWNSTREAM ARCHITECTURAL COMPOSITION] Authentication gate rejects requests from deprovisioned user identifier. | [DIRECT UPSTREAM] User profile deactivated; historical records created by user retained (`URPA-USER-004`). | [DIRECT UPSTREAM] User authentication credentials and active tokens invalidated (`URPA-USER-004`). | [NOT ESTABLISHED UPSTREAM] User seat quota adjustment governed by tenant commercial tier. | [DIRECT UPSTREAM] Historical audit trail records MUST retain attribution to deprovisioned user; deprovisioning MUST NOT modify or delete audit log entries (`URPA-USER-004`). | [NOT ESTABLISHED UPSTREAM] User personal data redaction or pseudonymization policy not established upstream (`GAP-15`). |
| **5. Vehicle Removal** | `CTCM-DEV-010`, `TISB-SEC-007` | [DOWNSTREAM ARCHITECTURAL COMPOSITION] User/driver tracking access unlinked from removed vehicle. | [DOWNSTREAM ARCHITECTURAL COMPOSITION] Vehicle tracking slot quota released. | [DIRECT UPSTREAM] Tracking ingestion unbinds vehicle association (`CTCM-DEV-010`). | [DIRECT UPSTREAM] Historical telemetry preserved and isolated from subsequent vehicle assignments (`CTCM-DEV-010`, `TISB-SEC-007`). | [NOT ESTABLISHED UPSTREAM] No dedicated vehicle credentials established upstream. | [DOWNSTREAM ARCHITECTURAL COMPOSITION] Vehicle count in commercial billing quota updated. | [DIRECT UPSTREAM] Vehicle unassignment and reassignment events logged to audit stream. | [NOT ESTABLISHED UPSTREAM] Split-trip boundary on vehicle reassignment not established upstream. |
| **6. Device Retirement** | `SMDI-GEN-002`, `TISB-SEC-007` | [DOWNSTREAM ARCHITECTURAL COMPOSITION] Control operations on retired hardware disabled. | [DOWNSTREAM ARCHITECTURAL COMPOSITION] Hardware slot updated in inventory registry. | [DIRECT UPSTREAM] Hardware replacement transfers tracking identity while preserving historical telemetry associations (`TISB-SEC-007`). | [DIRECT UPSTREAM] Historical vehicle telematics remain intact and associated with the vehicle (`TISB-SEC-007`). | [DOWNSTREAM ARCHITECTURAL COMPOSITION] Hardware-bound device identifiers unlinked from active ingestion. | [DIRECT UPSTREAM] Service and RMA warranty tracking applied (`SWR-BIL-001`). | [DIRECT UPSTREAM] Hardware status transition to `RETIRED` logged (`SMDI-GEN-002`). | [NOT ESTABLISHED UPSTREAM] Retired hardware on-board diagnostic cache clearing not established upstream. |
| **7. SIM Deactivation** | `SMDI-SIM-003` | [DOWNSTREAM ARCHITECTURAL COMPOSITION] SIM operational management access disabled. | [DOWNSTREAM ARCHITECTURAL COMPOSITION] Cellular data connection entitlement terminated. | [DIRECT UPSTREAM] Cellular data connectivity halted by carrier network state transition (`SMDI-SIM-003`). | [DIRECT UPSTREAM] Historical data usage ledger preserved (`SMDI-SIM-003`). | [DOWNSTREAM ARCHITECTURAL COMPOSITION] Carrier network provisioning unlinked from active profile. | [DIRECT UPSTREAM] Cellular carrier line usage charges cease. | [DIRECT UPSTREAM] SIM state transition to `DEACTIVATED` or `TERMINATED` logged (`SMDI-SIM-003`). | [NOT ESTABLISHED UPSTREAM] External carrier-side metadata retention policy not established upstream. |
| **8. Provider Retirement** | `TPA-OFF-001..004` | [DIRECT UPSTREAM] Provider ingestion gateway disabled (`TPA-OFF-001`). | [DIRECT UPSTREAM] Provider capability routing disabled (`TPA-OFF-002`). | [DIRECT UPSTREAM] New device registrations blocked; active devices migrated (`TPA-OFF-001`, `TPA-OFF-002`). | [DIRECT UPSTREAM] Ingested telemetry preserved with retired provider provenance binding (`TPA-OFF-004`). | [DIRECT UPSTREAM] Provider API keys, access secrets, and webhook credentials revoked from secret storage (`TISB-SEC-011`, `TPA-OFF-001`). | [DOWNSTREAM ARCHITECTURAL COMPOSITION] Third-party provider partner routing charges cease. | [DIRECT UPSTREAM] Provider state transition to `SUSPENDED` and `RETIRED` logged (`TPA-OFF-003`). | [NOT ESTABLISHED UPSTREAM] Third-party provider-side data deletion obligations not established upstream (`GAP-12`). |
| **9. Integration Retire** | `IRAS-LCY-001..002`, `IRAS-SEC-001`, `TPA-OFF-003` | [DIRECT UPSTREAM] External integration API client access revoked (`IRAS-LCY-002`). | [DIRECT UPSTREAM] Outbound synchronization entitlements disabled (`IRAS-LCY-002`). | [DOWNSTREAM ARCHITECTURAL COMPOSITION] Gateway disabled from live production dispatch (`IRAS-LCY-002`). | [DIRECT UPSTREAM] Historical configuration and transaction logs retained strictly for immutable audit provenance (`IRAS-LCY-002`, `TPA-OFF-003`). | [DIRECT UPSTREAM] Integration API secrets and tokens decommissioned from active gateway routing (`IRAS-SEC-001`). | [DOWNSTREAM ARCHITECTURAL COMPOSITION] Integration sync usage metering stops. | [DIRECT UPSTREAM] Integration state transition to `RETIRED` logged (`IRAS-LCY-002`). | [NOT ESTABLISHED UPSTREAM] External third-party application data purge verification not established upstream. |
| **10. Support Expiration** | `SSR-SUP-001..003`, `DEC-005` | [DIRECT UPSTREAM] Support specialist diagnostic access terminates automatically upon expiration (`SSR-SUP-002`, `DEC-005`). | [DIRECT UPSTREAM] Support ticket-scoped diagnostic elevation entitlement cleared (`SSR-SUP-002`). | [DOWNSTREAM ARCHITECTURAL COMPOSITION] Live diagnostic streams closed. | [DIRECT UPSTREAM] Historical vehicle telemetry unaffected; diagnostic session history retained (`SSR-SUP-003`). | [DOWNSTREAM ARCHITECTURAL COMPOSITION] Temporary support access authorization grant revoked / expired. | [NOT ESTABLISHED UPSTREAM] Support operational overhead governed by support tier. | [DIRECT UPSTREAM] Diagnostic grant authorization, duration, and expiration logged to audit stream (`SSR-SUP-002`). | [NOT ESTABLISHED UPSTREAM] Support live-location grant exact duration is configurable (`DEC-005`). |
| **11. Rescue Closure** | `SSR-RSC-001`, `DEC-006` | [DIRECT UPSTREAM] Emergency rescue field team live tracking override terminates upon incident closure (`SSR-RSC-001`). | [DIRECT UPSTREAM] Emergency rescue tracking override entitlement cleared (`SSR-RSC-001`). | [DOWNSTREAM ARCHITECTURAL COMPOSITION] Emergency dispatch routing deactivated. | [DIRECT UPSTREAM] Incident telemetry, panic SOS events, and dispatch records preserved as evidence records (`SSR-RSC-001`). | [DOWNSTREAM ARCHITECTURAL COMPOSITION] Field responder incident-scoped authorization cleared. | [NOT ESTABLISHED UPSTREAM] Emergency rescue dispatch billing models subject to tenant policy (`DEC-006`). | [DIRECT UPSTREAM] Complete rescue mission lifecycle from dispatch to closure logged to audit stream (`SSR-RSC-001`). | [NOT ESTABLISHED UPSTREAM] Emergency rescue field operating model is configurable (`DEC-006`). |
| **12. Demo Conversion** | `MSE-CONV-001`, `PRD-DMO-001`, `MVV-DMO-001` | [DIRECT UPSTREAM] Demo sandbox login terminated; fresh production credentials provisioned (`MSE-CONV-001`). | [DIRECT UPSTREAM] Demo entitlement converted to paid subscription with fresh identity (`MSE-CONV-001`). | [DIRECT UPSTREAM] Simulated telematic generation halted; fresh device/vehicle ingestion configured (`MSE-CONV-001`). | [DIRECT UPSTREAM] Simulated demo data SHALL NEVER be imported into production databases (`MSE-CONV-001`). | [DIRECT UPSTREAM] Demo sandbox credentials revoked; fresh production credentials created (`MSE-CONV-001`). | [DIRECT UPSTREAM] Fresh commercial billing records initiated (`MSE-CONV-001`). | [DIRECT UPSTREAM] Clean conversion boundary logged; simulated demo data SHALL NEVER be imported into production databases (`MSE-CONV-001`). | [NOT ESTABLISHED UPSTREAM] Demo sandbox data retention/deletion schedule not established upstream. |

---

## 8. Access Revocation vs. Data Preservation Separation (Axioms)

- **PRO-AXM-001 (Separation Axioms of the Architecture):** The platform enforces seven axiomatic separations between operational access states and data preservation:
  1. *Access Revoked $
eq$ Data Deleted:* Depriving an actor of operational platform access MUST NOT trigger the deletion of the actor's historical records.
  2. *Subscription Expired $
eq$ Telemetry Deleted:* Under `MSE-DNG-001` and `MSE-ACC-001` (item 14), expired subscriptions disable operational vehicle tracking and command execution, but historical trips, coordinates, and alerts MUST NOT be deleted.
  3. *Tenant Entitlement Revoked $
eq$ Customer History Deleted:* Terminating a B2B tenant's master subscription halts tenant billing and user logins (`URPA-USER-005`), but customer vehicle telematics enter statutory preservation lifecycles (`TISB-PRVY-001`).
  4. *Tracking Provider Suspended $
eq$ Provider Data Erased:* Under `TPA-OFF-004`, decommissioning or retiring a third-party tracking provider revokes provider credentials, but previously ingested telematics remain intact with provenance binding.
  5. *Integration Retired $
eq$ Sync Audit Erased:* Under `IRAS-LCY-002` and `TPA-OFF-003`, retiring an external API integration decommissions live dispatch routing, but historical configuration records and transaction logs remain preserved for immutable audit provenance.
  6. *User Deactivated $
eq$ Audit Erased:* Under `URPA-USER-004`, deprovisioning a user terminates sessions, but audit trails retain indelible attribution to the user identifier.
  7. *Device Replaced $
eq$ Vehicle History Deleted:* Under `TISB-SEC-007`, swapping tracking hardware transfers tracking identity to the replacement unit while preserving all past telemetry associated with the vehicle.

---

## 9. Customer Data Portability & Transparent Export

- **PRO-EXP-001 (Customer Data Portability):** In accordance with `PRD-PRV-005` and `TISB-PRVY-002`, customers possess the right to export their complete tracking and account data. Data portability export routines MUST extract data strictly associated with the requesting customer account and authorized vehicle fleet without exposing shared platform infrastructure metadata (`TISB-PRVY-002`). Domain-specific export permissions govern specific export operations, while generic portability IAM tokens remain undefined (`GAP-16`).
- **PRO-EXP-002 (Cross-Tenant and System Metadata Scrubbing):** Pursuant to `TISB-PRVY-002`, exported customer data MUST be strictly sanitized to eliminate internal infrastructure metadata. Data portability exports MUST NEVER contain cross-tenant records, internal system identifiers, or cryptographic credentials.

---

## 10. Credential Invalidation & Secret Revocation

- **PRO-SEC-001 (Server-Side Credential Storage):** Pursuant to `PRD-SEC-003` and `TISB-SEC-011`, all external provider API tokens, customer webhook secrets, database credentials, and integration signing keys MUST reside in server-side encrypted secret storage.
- **PRO-SEC-002 (Immediate Credential Revocation on Offboarding):** Secret storage MUST enforce immediate credential invalidation upon the occurrence of offboarding triggers, including user deprovisioning (`URPA-USER-004`), tenant termination (`URPA-USER-005`, `TISB-PRVY-001`), tracking provider decommissioning (`TPA-OFF-001`), and integration retirement (`IRAS-SEC-001`).

---

## 11. Location Privacy & Telemetry Decoupling

- **PRO-LOC-001 (Raw Telemetry vs. Trip Summary Lifecycle Separation):** Under `PRD-RET-001`, the system enforces a strict lifecycle boundary between high-frequency raw packet streams and normalized trip summaries. High-volume raw telematics frames are governed by configurable retention (`DEC-009`), distinct from operational trip summary records.

---

## 12. Cabin Voice & Dashcam Surveillance Privacy

- **PRO-MED-001 (Cryptographic Provenance of Vault Media):** Under `PRD-MED-001..003` and `MVV-PRI-001..004`, all recorded audio and video streams stored in platform vaults MUST be cryptographically bound to vehicle telemetry, timestamp, and tenant scope (`TISB-MED-002`). Cryptographic provenance guarantees evidence integrity, but does NOT mandate indefinite retention.
- **PRO-MED-002 (Evidence Locking Retention Override):** Pursuant to `MVV-EVD-001` through `MVV-EVD-005`, media recordings flagged as evidence MUST be locked. Locked evidence recordings are strictly immune to automated retention purge routines until the lock is cleared by authorized operational personnel.
- **PRO-MED-003 (Fail-Closed Manual Media Deletion):** In accordance with `MVV-IAM-005` (Gap 3), manual media deletion requests initiated by Tenant Administrators or Platform Administrators MUST fail closed. Because manual media deletion tokens and workflows are intentionally unestablished upstream, no user role possesses authority to delete individual media recordings.

---

## 13. Support Session & Emergency Rescue Privacy

- **PRO-SSR-001 (Support Diagnostic Time-Bound Grant Governance):** Pursuant to `SSR-SUP-001` through `SSR-SUP-003` and open decision `DEC-005`, customer support agent access to live vehicle location or telematics diagnostics MUST require explicit customer ticket authorization, be strictly bounded in time with auto-expiration (`DEC-005`), and prohibit standing administrative surveillance privileges.
- **PRO-SSR-002 (Emergency Rescue Incident Override Governance):** Under `SSR-RSC-001..002` and `DEC-006`, emergency rescue live tracking overrides MUST operate strictly within active assigned emergency incidents (`rescue.location.track`). Upon incident closure, emergency tracking overrides MUST terminate immediately (`SSR-RSC-001`), and incident logs and SOS events enter statutory retention schedules (`PRD-RET-001`), with media evidence protected under evidence locking where triggered (`MVV-EVD-001`).

---

## 14. SIM, Hardware & RMA Offboarding Lifecycle

- **PRO-SMD-001 (Device Retirement Hardware Decoupling):** In accordance with `SMDI-DEV-002` and `TISB-SEC-007`, retiring a physical tracking unit transitions its inventory governance state to `RETIRED_DECOMMISSIONED` (`SMDI-DEV-002`) and unbinds it from live telemetry ingestion. Historical telematics recorded during its installation remain associated with the vehicle and customer account (`TISB-SEC-007`).
- **PRO-SMD-002 (SIM Deactivation Ledger Preservation):** Pursuant to `SMDI-SIM-003`, deactivating or retiring an M2M SIM terminates cellular connectivity while preserving historical data consumption ledgers and SIM audit history (`SMDI-SIM-003`).

---

## 15. Tracking Provider & Integration Offboarding Lifecycle

- **PRO-TPA-001 (Tracking Provider Decommissioning Credential Revocation):** Under `TPA-OFF-001` through `TPA-OFF-004`, decommissioning an external tracking provider halts new device registrations, migrates active devices, transitions provider state through `SUSPENDED` and `RETIRED`, revokes and deletes server-side API credentials (`TPA-OFF-001`, `TISB-SEC-011`), and preserves historical telemetry with provider provenance attribution (`TPA-OFF-003`, `TPA-OFF-004`).
- **PRO-IRA-001 (Integration Retirement & Audit Provenance Preservation):** Pursuant to `IRAS-LCY-001..002` and `TPA-OFF-003`, retiring an external enterprise integration transitions its governance state to `RETIRED`, permanently decommissioning the gateway from production traffic dispatch while retaining historical integration configuration and transaction records strictly for immutable audit provenance (`TPA-OFF-003`).

---

## 16. Commercial Billing & Financial Record Boundaries

- **PRO-BIL-001 (Commercial Financial Ledger & Audit Immutability):** In accordance with `CTCM-AUD-005`, `CTCM-AUD-004`, `PRD-REF-004`, and `BMS-GEN-002..003`, past commercial invoices, completed customer payments, and partner commission ledgers remain immutable in audit history and financial ledgers (`CTCM-AUD-005`). Offboarding and account cancellation workflows MUST NOT rewrite or purge historical commercial ledgers and audit records (`CTCM-LCY-004`).
- **PRO-BIL-002 (Commercial Record Preservation Over Customer Closure):** When a customer account is offboarded, historical billing records and payment logs remain retained in audit history (`CTCM-AUD-005`, `LEGAL / FINANCIAL VERIFICATION REQUIRED`). Customer account closure terminates recurring billing without modifying or purging existing commercial ledgers (`CTCM-LCY-004`).

---

## 17. System Audit Trail & Deletion Boundaries

- **PRO-AUD-001 (System Audit Trail Append-Only Immutability):** Pursuant to `PRD-AUD-002`, `URPA-AUD-001`, `CTCM-AUD-004`, and `TISB-AUD-003`, platform security and operational audit logs are append-only and cryptographically sealed. They cannot be modified or deleted by any user or administrator.
- **PRO-AUD-002 (Erasure Action Event Logging Without Historical Modification):** In accordance with `PRD-AUD-002`, `URPA-USER-004`, and `PRD-PRV-005`, executing account deprovisioning terminates active sessions and revokes temporary grants while emitting an audit event without modifying or deleting past audit log entries. Historical audit entries MUST retain indelible attribution to the deprovisioned user identifier (`URPA-USER-004`), while personal data deletion and operational data disposition remain subject to legal/regulatory verification (`GAP-15`).

---

## 18. Demo & Synthetic Sandbox Boundaries

- **PRO-DMO-001 (Demo Data Clean Production Separation):** In accordance with `MSE-CONV-001`, converting from Demo or Trial to a paid subscription MUST create fresh production identity, billing, and device records; simulated demo data SHALL NEVER be imported into production databases.

---

## 19. Scale, Performance & Asynchronous Lifecycle Workers

- **PRO-SCL-001 (Retention Purge Non-Interference with Ingest):** Large-scale retention purge routines and data portability exports MUST execute asynchronously without degrading real-time telematics ingestion or live emergency rescue response streams (`PRD-NFR-001`, `PRD-NFR-002`).

---

## 20. Formal PRO Authority Gap Register

The following eighteen gaps represent genuine absences of approved upstream authority and are preserved without speculative invention:

| Gap # | Topic / Area | Authority Gap Description | Governing Upstream Authority | Invariant / Preservation Rule |
| :--- | :--- | :--- | :--- | :--- |
| **GAP-01** | Raw Telemetry Retention Duration | Raw packet retention duration is unresolved (`DEC-009`) | `PRD-RET-002`, `DEC-009` | Remains configurable; zero invented defaults |
| **GAP-02** | Crash Video Clip Retention Duration | Dashcam collision clip retention duration is unresolved (`DEC-010`) | `PRD-RET-002`, `DEC-010` | Remains configurable; zero invented defaults |
| **GAP-03** | Cabin Voice Retention Duration | Cabin voice recording duration is unresolved (`DEC-011`) | `PRD-RET-002`, `DEC-011` | Remains configurable; zero invented defaults |
| **GAP-04** | Trip Summary Retention Duration | Normalized trip summary statutory duration undefined | `PRD-RET-001`, `PRD-RET-002` | Preserved until statutory verification |
| **GAP-05** | Panic SOS Log Retention Duration | High-alert and SOS incident duration undefined | `PRD-RET-001`, `PRD-RET-002` | Preserved until statutory verification |
| **GAP-06** | Support Record Retention Duration | Customer support ticket retention duration undefined | `PRD-RET-001`, `PRD-RET-002` | Preserved until statutory verification |
| **GAP-07** | Rescue Mission Retention Duration | Emergency rescue record retention duration undefined | `PRD-RET-001`, `PRD-RET-002`, `DEC-006` | Preserved until statutory verification |
| **GAP-08** | Security Audit Retention Duration | System security audit log retention duration undefined | `PRD-RET-002`, `PRD-AUD-002` | Strictly append-only; zero purge invented |
| **GAP-09** | Privacy Deletion IAM Permissions | Machine tokens for deletion requests/approvals undefined | `URPA` IAM Token Audit | Gaps recorded; zero unapproved tokens |
| **GAP-10** | Retention Configuration IAM Tokens | Machine tokens for configuring retention undefined | `URPA` IAM Token Audit | Gaps recorded; zero unapproved tokens |
| **GAP-11** | Manual Media Deletion Authority | Manual media deletion tokens intentionally undefined | `MVV-IAM-005` Gap 3 | Fails closed; manual deletion forbidden |
| **GAP-12** | Provider-Side Deletion Obligations | Upstream authority lacks power to force 3rd-party purges | `TPA-OFF-004` | External contractual boundary only |
| **GAP-13** | Backup Data-Disposition Policy | Backup retention, purge, and restore data-disposition policy not established upstream | `TISB-PRVY-004` | Preserved as gap; zero invented mechanics |
| **GAP-14** | Formal Legal Hold Workflow Tokens | Granular IAM permissions and formal workflow for legal hold undefined | `PRD-RET-002` | Preserved as gap; zero invented workflows |
| **GAP-15** | Privacy Deletion vs Audit Precedence | Deletion precedence over statutory preservation and redaction standards undefined | `PRD-PRV-005`, `PRD-AUD-002`, `URPA-USER-004` | Preserved as gap; zero invented precedence |
| **GAP-16** | Generic Portability IAM Tokens | Granular machine permissions for generic data portability export undefined | `URPA`, `PRD-PRV-005`, `TISB-PRVY-002` | Preserved as gap; domain exports used |
| **GAP-17** | Tenant Offboarding Grace Periods | Exact B2B contract transition timelines undefined | `CTCM-B2B-009` | Commercial contract boundary |
| **GAP-18** | Throughput SLA Targets | Specific throughput SLA targets for purge/export routines undefined | `PRD-NFR-001`, `PRD-NFR-002` | Preserved as gap; non-interference enforced |

---

## 21. Open Decision Register

The following open decisions materially touch Privacy, Retention, and Offboarding and are preserved without unauthorized resolution:

| Decision ID | Summary Description | Upstream Status & Disposition | Stage Relevance |
| :--- | :--- | :--- | :--- |
| **DEC-005** | Support live-location grant exact duration | Configurable (Ticket-scoped, explicit grant, auto-expiry) | Governs maximum window for support diagnostic access. |
| **DEC-006** | Emergency rescue field operating model | TBD / Configurable by tenant operational policy | Governs emergency rescue override lifecycles and records. |
| **DEC-009** | Telemetry raw data retention duration | TBD + Statutory legal/privacy verification required | Governs high-frequency raw telematics retention schedule. |
| **DEC-010** | Crash video clip retention duration | TBD + Statutory legal/privacy verification required | Governs dashcam collision video clip retention schedule. |
| **DEC-011** | Cabin voice recording retention duration | TBD + Statutory legal/privacy verification required | Governs cabin voice recording retention schedule. |
| **DEC-014** | Production AI sensitive data class approval | Zero PII / live telemetry sent to free cloud AI models | Mandates strict telematics isolation from public AI models. |

---

## 22. Comprehensive Traceability Matrix

The following table provides 1:1 bidirectional requirement traceability for all 35 formal PRO requirements:

| # | PRO Requirement ID | Requirement Summary | Authority Classification | Exact Upstream Source Token(s) | Authority Gap Marker |
| :--- | :--- | :--- | :--- | :--- | :--- |
| 1 | `PRO-DOC-001` | Precedence Hierarchy | DIRECT UPSTREAM | Precedence Governance Rule | None |
| 2 | `PRO-DOC-002` | Non-Goals Definition | DOWNSTREAM ARCHITECTURAL COMPOSITION | Section Boundary Rule | None |
| 3 | `PRO-DOC-003` | Implementation Neutrality | DOWNSTREAM ARCHITECTURAL COMPOSITION | Implementation Neutrality Invariant | None |
| 4 | `PRO-DOC-004` | Approved Commit Baseline | DIRECT UPSTREAM | 17 Approved Specs Baseline | None |
| 5 | `PRO-PRV-001` | Purpose Limitation & Consent Gates | DIRECT UPSTREAM | `PRD-PRV-005`, `TISB-PRVY-003`, `URPA-ROLE-007..010` | None |
| 6 | `PRO-PRV-002` | Surveillance Privacy Notice | DOWNSTREAM ARCHITECTURAL COMPOSITION | `PRD-REG-001`, `MVV-PRI-001` | None |
| 7 | `PRO-PRV-003` | Third-Party AI Data Isolation | DIRECT UPSTREAM | `DEC-014`, `PRD-SEC-003` | None |
| 8 | `PRO-DAT-001` | Data Classification Taxonomy | DOWNSTREAM ARCHITECTURAL COMPOSITION | `PRD-PRV-005`, `PRD-RET-001` | None |
| 9 | `PRO-DAT-002` | Sensitivity Access Gating | DIRECT UPSTREAM | `TISB-PRVY-003`, `PRD-SEC-003` | None |
| 10 | `PRO-RET-001` | Configurable Retention Classes | DIRECT UPSTREAM | `PRD-RET-001` | None |
| 11 | `PRO-RET-002` | Retention Duration Non-Invention | DIRECT UPSTREAM | `PRD-RET-002`, `DEC-009`, `DEC-010`, `DEC-011` | `GAP-01`, `GAP-02`, `GAP-03` |
| 12 | `PRO-RET-003` | Tenant-Scoped Purge Isolation | DIRECT UPSTREAM | `TISB-PRVY-004`, `PRD-RET-001` | None |
| 13 | `PRO-OFF-001` | Distinct Lifecycles Invariant | DOWNSTREAM ARCHITECTURAL COMPOSITION | Offboarding Scope Discovery Rule | None |
| 14 | `PRO-OFF-002` | Offboarding Matrix Governance | DOWNSTREAM ARCHITECTURAL COMPOSITION | 12 Lifecycles Discovery Matrix | `GAP-12`, `GAP-15`, `GAP-17` |
| 15 | `PRO-AXM-001` | Seven Separation Axioms | DIRECT UPSTREAM | `MSE-DNG-001`, `URPA-USER-004..005`, `TISB-SEC-007`, `TPA-OFF-004`, `IRAS-LCY-001..002`, `TPA-OFF-003` | None |
| 16 | `PRO-EXP-001` | Customer Data Portability | DIRECT UPSTREAM | `PRD-PRV-005`, `TISB-PRVY-002` | `GAP-16` |
| 17 | `PRO-EXP-002` | Cross-Tenant Metadata Scrubbing | DIRECT UPSTREAM | `TISB-PRVY-002` | None |
| 18 | `PRO-SEC-001` | Server-Side Credential Storage | DIRECT UPSTREAM | `PRD-SEC-003`, `TISB-SEC-011` | None |
| 19 | `PRO-SEC-002` | Immediate Credential Revocation | DIRECT UPSTREAM | `URPA-USER-004..005`, `TPA-OFF-001`, `IRAS-SEC-001` | None |
| 20 | `PRO-LOC-001` | Raw vs Trip Lifecycle Separation | DIRECT UPSTREAM | `PRD-RET-001`, `DEC-009`, `PRD-TRP-001` | `GAP-01`, `GAP-04` |
| 21 | `PRO-MED-001` | Media Vault Provenance | DIRECT UPSTREAM | `PRD-MED-001..003`, `MVV-PRI-001..004`, `TISB-MED-002` | None |
| 22 | `PRO-MED-002` | Evidence Locking Purge Immunity | DIRECT UPSTREAM | `MVV-EVD-001..005` | None |
| 23 | `PRO-MED-003` | Manual Media Deletion Fail-Closed | DIRECT UPSTREAM | `MVV-IAM-005` Gap 3 | `GAP-11` |
| 24 | `PRO-SSR-001` | Support Diagnostic Time-Bound Grant| DIRECT UPSTREAM | `SSR-SUP-001..003`, `DEC-005` | `GAP-06` |
| 25 | `PRO-SSR-002` | Rescue Incident Tracking Override | DIRECT UPSTREAM | `SSR-RSC-001`, `DEC-006` | `GAP-07` |
| 26 | `PRO-SMD-001` | Hardware Retirement Decoupling | DIRECT UPSTREAM | `SMDI-DEV-002`, `TISB-SEC-007` | None |
| 27 | `PRO-SMD-002` | SIM Deactivation Ledger Presv | DIRECT UPSTREAM | `SMDI-SIM-003` | None |
| 28 | `PRO-TPA-001` | Provider Decommissioning Sequence | DIRECT UPSTREAM | `TPA-OFF-001..004` | `GAP-12` |
| 29 | `PRO-IRA-001` | Integration Retirement & Audit | DIRECT UPSTREAM | `IRAS-LCY-001..002`, `TPA-OFF-003` | None |
| 30 | `PRO-BIL-001` | Commercial Ledger Immutability | DIRECT UPSTREAM | `CTCM-AUD-005`, `CTCM-AUD-004`, `PRD-REF-004`, `BMS-GEN-002..003` | None |
| 31 | `PRO-BIL-002` | Financial Record Preservation | DIRECT UPSTREAM | `CTCM-LCY-004`, `CTCM-AUD-005` | None |
| 32 | `PRO-AUD-001` | System Audit Trail Immutability | DIRECT UPSTREAM | `PRD-AUD-002`, `URPA-AUD-001`, `TISB-AUD-003` | `GAP-08` |
| 33 | `PRO-AUD-002` | Deletion Logging Without Mutation | DOWNSTREAM ARCHITECTURAL COMPOSITION | `PRD-AUD-002`, `URPA-USER-004`, `PRD-PRV-005` | `GAP-15` |
| 34 | `PRO-DMO-001` | Demo Clean Production Separation | DIRECT UPSTREAM | `MSE-CONV-001` | None |
| 35 | `PRO-SCL-001` | Purge Ingestion Non-Interference | DIRECT UPSTREAM | `PRD-NFR-001`, `PRD-NFR-002` | `GAP-18` |

---

## 23. Acceptance Gates

The following thirty-five acceptance gates provide 1:1 coverage for all formal PRO requirements:

- **GATE-PRO-01 (Precedence Verification):** Verifies that specification interpretation strictly adheres to the established hierarchy.  
  *Tests: `PRO-DOC-001`*
- **GATE-PRO-02 (Non-Goals Boundary Verification):** Verifies that the implementation does not embed localized legal, tax, physical database, or backup vendor specifications.  
  *Tests: `PRO-DOC-002`*
- **GATE-PRO-03 (Implementation Neutrality Verification):** Verifies that the design contains zero hard dependencies on proprietary row security, specific messaging brokers, or cloud vendor storage tiers.  
  *Tests: `PRO-DOC-003`*
- **GATE-PRO-04 (Approved Commit Baseline Verification):** Verifies that all 17 approved specifications match their canonical commit hashes.  
  *Tests: `PRO-DOC-004`*
- **GATE-PRO-05 (Purpose Limitation & Access Gate Test):** Verifies that access to live spatial tracking or surveillance media is denied when customer subscription entitlement, user role permission, device capability, or mandated purpose/consent is missing, and that temporary support or rescue tracking requires an active ticket or incident.  
  *Tests: `PRO-PRV-001`*
- **GATE-PRO-06 (Surveillance Notice Verification):** Verifies that recording notice indicators are supported on capable hardware where mandated by transport regulations, and that surveillance activation requires verified consent and notice policy configuration.  
  *Tests: `PRO-PRV-002`*
- **GATE-PRO-07 (AI Telematics Isolation Test):** Verifies that zero customer PII or raw telematics are transmitted to public third-party AI APIs.  
  *Tests: `PRO-PRV-003`*
- **GATE-PRO-08 (Data Classification Coverage Verification):** Verifies that all twenty-seven platform data classes are classified according to upstream evidence.  
  *Tests: `PRO-DAT-001`*
- **GATE-PRO-09 (Sensitivity Access Gating Test):** Verifies that surveillance audio/video and secret storage data require specific authorization beyond basic tenant membership.  
  *Tests: `PRO-DAT-002`*
- **GATE-PRO-10 (Configurable Retention Schedule Test):** Verifies that retention schedulers support independent configuration for the nine canonical retention classes.  
  *Tests: `PRO-RET-001`*
- **GATE-PRO-11 (Retention Duration Non-Invention Test):** Verifies that zero hardcoded retention durations are embedded for `DEC-009`, `DEC-010`, `DEC-011`, or `PRD-RET-002`.  
  *Tests: `PRO-RET-002`*
- **GATE-PRO-12 (Tenant Purge Isolation Test):** Verifies that an automated purge execution within Tenant A deletes zero records belonging to Tenant B.  
  *Tests: `PRO-RET-003`*
- **GATE-PRO-13 (Distinct Offboarding Scopes Verification):** Verifies that software orchestration maintains independent handling for all twelve offboarding scopes.  
  *Tests: `PRO-OFF-001`*
- **GATE-PRO-14 (Offboarding Matrix Consistency Verification):** Verifies that offboarding transitions execute according to the codified 9-dimension lifecycle matrix.  
  *Tests: `PRO-OFF-002`*
- **GATE-PRO-15 (Separation Axioms Enforcement Test):** Verifies that operational access revocation does not cause premature deletion of historical telematics, audit, or commercial records.  
  *Tests: `PRO-AXM-001`*
- **GATE-PRO-16 (Data Portability Export Test):** Verifies that customer data portability exports extract complete customer tracking and account records strictly within authorized customer scope without leaking system infrastructure metadata.  
  *Tests: `PRO-EXP-001`*
- **GATE-PRO-17 (Metadata Scrubbing Test):** Verifies that customer portability export payloads contain zero cross-tenant data or internal system credentials.  
  *Tests: `PRO-EXP-002`*
- **GATE-PRO-18 (Credential Storage Verification):** Verifies that all provider keys, database credentials, and integration secrets reside in encrypted secret storage.  
  *Tests: `PRO-SEC-001`*
- **GATE-PRO-19 (Credential Invalidation Test):** Verifies that offboarding events trigger immediate invalidation of associated credentials and session tokens.  
  *Tests: `PRO-SEC-002`*
- **GATE-PRO-20 (Telemetry Lifecycle Separation Test):** Verifies that raw telemetry ingest packets and normalized trip summaries maintain separate retention configurations.  
  *Tests: `PRO-LOC-001`*
- **GATE-PRO-21 (Media Cryptographic Provenance Test):** Verifies that vault audio and video assets are cryptographically bound to vehicle telemetry and tenant scope.  
  *Tests: `PRO-MED-001`*
- **GATE-PRO-22 (Evidence Lock Purge Immunity Test):** Verifies that automated retention purge routines skip all media assets flagged with an active evidence lock.  
  *Tests: `PRO-MED-002`*
- **GATE-PRO-23 (Manual Media Deletion Fail-Closed Test):** Verifies that manual administrative requests to delete media recordings are denied (fail closed).  
  *Tests: `PRO-MED-003`*
- **GATE-PRO-24 (Support Time-Bound Expiration Test):** Verifies that support diagnostic access terminates automatically upon session expiration.  
  *Tests: `PRO-SSR-001`*
- **GATE-PRO-25 (Rescue Override Termination Test):** Verifies that emergency tracking overrides terminate immediately upon incident closure.  
  *Tests: `PRO-SSR-002`*
- **GATE-PRO-26 (Device Retirement Continuity Test):** Verifies that retiring a hardware unit transitions its state to `RETIRED_DECOMMISSIONED` and unbinds it from live ingestion while preserving historical vehicle telematics.  
  *Tests: `PRO-SMD-001`*
- **GATE-PRO-27 (SIM Deactivation Ledger Test):** Verifies that deactivating an M2M SIM suspends carrier data connectivity without altering historical usage ledgers.  
  *Tests: `PRO-SMD-002`*
- **GATE-PRO-28 (Provider Decommissioning Test):** Verifies that decommissioning a tracking provider revokes and deletes credentials while preserving ingested telematics with provider provenance.  
  *Tests: `PRO-TPA-001`*
- **GATE-PRO-29 (Integration Retirement Test):** Verifies that retiring an integration permanently decommissions the gateway from production traffic dispatch while retaining historical configuration for immutable audit provenance.  
  *Tests: `PRO-IRA-001`*
- **GATE-PRO-30 (Commercial Ledger Immutability Test):** Verifies that customer account offboarding does not modify or rewrite past commercial invoices, payments, or commission ledgers in audit history.  
  *Tests: `PRO-BIL-001`*
- **GATE-PRO-31 (Financial Preservation Test):** Verifies that customer account closure ceases recurring billing while preserving historical commercial ledgers.  
  *Tests: `PRO-BIL-002`*
- **GATE-PRO-32 (Audit Trail Immutability Test):** Verifies that system audit log entries cannot be modified or deleted by any user or administrator action.  
  *Tests: `PRO-AUD-001`*
- **GATE-PRO-33 (Deletion Audit Logging Test):** Verifies that executing account deprovisioning terminates active sessions and emits an audit event without modifying or deleting past audit log entries.  
  *Tests: `PRO-AUD-002`*
- **GATE-PRO-34 (Demo Data Separation Test):** Verifies that converting a demo account to paid production creates fresh records and never imports simulated demo data into production.  
  *Tests: `PRO-DMO-001`*
- **GATE-PRO-35 (Purge Non-Interference Test):** Verifies that background retention purge routines execute without degrading real-time telematics ingestion performance.  
  *Tests: `PRO-SCL-001`*

---

## 24. Built-In Static Audit (Categories A–T)

### A. Source / Commit Integrity
- Machine-verified all 17 approved upstream specifications in `docs/03_specs/` at their canonical Git approval commit hashes.
- Zero hash expansions, truncations, or invented commit references.
- Status: **PASS**

### B. Privacy / Purpose / Legal-Marker Purity
- Location privacy and purpose limitation strictly enforce `PRD-PRV-005` and `TISB-PRVY-003`. Normal authorized fleet tracking decoupled from emergency/support operational context overrides.
- Surveillance recording notice indicators enforce transport regulation requirements (`PRD-REG-001`, `MVV-PRI-001`) with zero invented consent metadata storage schemas.
- Exact upstream markers `LEGAL / REGULATORY VERIFICATION REQUIRED` and `LEGAL / FINANCIAL VERIFICATION REQUIRED` preserved. Zero invented legal rules.
- Status: **PASS**

### C. Retention Duration Non-Invention
- Zero invented retention durations (no 30/90/180/365 days, 5/7 years, permanent, or cold storage).
- `PRD-RET-002`, `DEC-009`, `DEC-010`, and `DEC-011` preserved as configurable parameters.
- Status: **PASS**

### D. Retention Classification Purity
- Uses strictly authority classifications A, B, C, D, and E.
- Retention Class C strictly restricted to Tracking Provider Credentials where upstream literally requires deletion (`TPA-OFF-001` item 4). Integration secrets classified as Class D (access revocation established, disposition undefined). Demo sandbox telematics classified as Class E (retention/deletion schedule not established upstream).
- Zero invented classification classes (no Transient, Permanent, Purgeable, Hold Locked, Carrier, Ledger, Ephemeral).
- Status: **PASS**

### E. IAM / Mutation Authority Purity
- Audited against `URPA`. Zero invented machine permission tokens (`privacy.deletion.request`, `retention.configure`, etc. registered as gaps).
- Status: **PASS**

### F. Access Revocation / Data-Deletion Separation
- Enforces seven core separation axioms (`PRO-AXM-001`). Access revocation does not delete data.
- Status: **PASS**

### G. Audit Preservation / Privacy-Deletion Boundary
- Preserves append-only immutable audit trail (`PRD-AUD-002`, `URPA-USER-004`). Deletion operations emit audit events without modifying history.
- Zero claims of automatic operational record removal upon deprovisioning; precedence and redaction gaps formally registered (`GAP-15`).
- Status: **PASS**

### H. Billing / Financial-Record Boundary
- Commercial ledgers, invoices, and completed payments remain immutable in audit history and financial ledgers (`CTCM-AUD-005`, `CTCM-AUD-004`, `PRD-REF-004`, `BMS-GEN-002`).
- Zero unapproved invoice adjustments, permanent statutory retention claims, or double-entry accounting inventions.
- Status: **PASS**

### I. Media / Evidence / Manual-Deletion Boundary
- Preserves fail-closed manual media deletion under `MVV-IAM-005` Gap 3 (`PRO-MED-003`).
- Evidence locks protect media from retention purge (`MVV-EVD-001..005`). Zero unapproved hold expiration workflows.
- Status: **PASS**

### J. Support / Rescue Scope Purity
- Support diagnostic access is ticket-scoped, time-bounded, and auto-expires (`SSR-SUP-001..003`, `DEC-005`).
- Emergency rescue overrides are strictly incident-scoped (`SSR-RSC-001`, `DEC-006`). Zero invented dispatch billing ledgers.
- Status: **PASS**

### K. Tenant Isolation / Export / Purge Boundary
- Enforces semantic tenant isolation and metadata scrubbing during portability exports (`TISB-PRVY-002`, `TISB-PRVY-004`).
- Zero format mandates (no standardized machine-readable format invention); generic portability IAM tokens registered as gap (`GAP-16`).
- Zero physical database schema assumptions (no SQL RLS, database-per-tenant, or tenant_id column mandates).
- Status: **PASS**

### L. Provider / Integration Offboarding Boundary
- Provider decommissioning revokes and deletes credentials while preserving ingested telematics (`TPA-OFF-001..004`).
- Integration retirement transitions governance state to `RETIRED` and retains configuration for immutable audit provenance (`IRAS-LCY-001..002`, `TPA-OFF-003`). Zero invented worker shutdown mechanics.
- Status: **PASS**

### M. Device / SIM / RMA Offboarding Boundary
- Hardware retirement transitions inventory governance to `RETIRED_DECOMMISSIONED` while preserving vehicle telematics (`SMDI-DEV-002`, `TISB-SEC-007`).
- SIM deactivation suspends carrier connectivity without erasing data ledgers (`SMDI-SIM-003`). Zero certificate revocation inventions.
- Status: **PASS**

### N. Demo / Trial Production-Separation Integrity
- Strictly adheres to clean conversion boundary in `MSE-CONV-001`. Simulated demo data SHALL NEVER be imported into production databases.
- Demo sandbox data retention/deletion schedule recognized as unestablished upstream (Class E) with zero auto-purge inventions.
- Status: **PASS**

### O. Backup / Legal-Hold / Purge Non-Invention
- Zero unapproved backup tombstone or key destruction mechanics.
- Gaps formally registered (`GAP-13`, `GAP-14`).
- Status: **PASS**

### P. Open-Decision Integrity
- Preserved `DEC-005`, `DEC-006`, `DEC-009`, `DEC-010`, `DEC-011`, and `DEC-014` in exact upstream status without unauthorized resolution.
- Status: **PASS**

### Q. Implementation Neutrality / Scale
- Zero mandates for specific message queues, databases, or container schedulers.
- Asynchronous non-interference with ingestion enforced (`PRO-SCL-001`).
- Status: **PASS**

### R. Requirement / Traceability Integrity
- Exactly 35 formal PRO requirements defined.
- Traceability matrix contains exactly 35 rows with 1:1 bidirectional mapping.
- Status: **PASS**

### S. Acceptance Coverage
- Exactly 35 acceptance gates (`GATE-PRO-01` through `GATE-PRO-35`) providing 1:1 coverage for all 35 formal requirements.
- Zero orphan gates, zero dangling references.
- Status: **PASS**

### T. Git Working Tree / Application-Code Integrity
- Working tree contains only the target working draft `docs/03_specs/PRIVACY_RETENTION_OFFBOARDING_SPEC.md`.
- Zero staged files, zero tracked modified files, zero application code changes.
- Status: **PASS**
