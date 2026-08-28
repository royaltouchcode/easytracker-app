# 📋 Vehicle Tracking Requirement Reconciliation Audit

**Title:** Vehicle Tracking Requirement Reconciliation Audit  
**Status:** APPROVED  
**Version:** 1.0  
**Approved Date:** 2026-08-28  
**Project:** Vehicle Tracking Standalone Launch  
**Development Branch:** `vehicle-tracking-launch-v1`  
**Protected Pre-Refactor Baseline:** Commit `9df8a3f` | Tag `pre-refactor-migrated-baseline-2026-08-28`  
**Documentation Authority Checkpoint:** Commit `f6cf6df`  
**Approval Basis:** Focused final re-review passed with zero blocking findings.  

---

## 1. DOCUMENT CONTROL

| Property | Specification |
| :--- | :--- |
| **Document Title** | Vehicle Tracking Requirement Reconciliation Audit |
| **Document Identifier** | `docs/02_audit/VEHICLE_TRACKING_REQUIREMENT_RECONCILIATION_AUDIT_V0_1.md` |
| **Version** | `1.0` |
| **Status** | APPROVED |
| **Approved Date** | `2026-08-28` |
| **Project** | Vehicle Tracking Standalone Launch |
| **Target Branch** | `vehicle-tracking-launch-v1` |
| **Authority Context** | `docs/DOCUMENT_AUTHORITY_INDEX.md` |
| **Approval Basis** | Focused final re-review passed with zero blocking findings. |
| **Author** | Antigravity AI (Pair Programming Safety Audit) |

---

## 2. EXECUTIVE RECONCILIATION SUMMARY

This audit performs a systematic reconciliation between the **Legacy Master & PRD Authority Documents** (`docs/00_current_authority/`) and the **New Vehicle Tracking Launch Working Baseline V0.4** (`docs/01_working_requirements/`).

### Key Audit Findings:
1. **Zero Irreconcilable Technical Conflicts:** No blocking contradictions exist between approved launch goals and legacy core features.
2. **Flexible Telematics Control Plane:** Replaces single-Traccar dependency with a multi-provider Tracking Provider Control Plane supporting licensed 3rd-party VTS push/pull integrations at launch, tenant-owned tracking servers, and future SaaS-managed Traccar infrastructure.
3. **Enterprise Architecture Expansion:** Formalizes mandatory registries and services: **Device Knowledge & Capability Registry**, **Vehicle Knowledge Registry**, **Regulatory Knowledge & Update Service**, **AI Orchestration & Privacy Guardrails**, **Customer Store & Referral Funnels**, and **Isolated Product Demo Architecture**.
4. **Security & Regulatory Guardrails:** Identifies legacy prototype behaviors (role heuristics, client credentials, BroadcastChannel inter-tab sync, mock government endpoints) for requirement-level security corrections and regulatory verification.

---

## 3. SOURCES REVIEWED

1. `C:\EasyTracker\docs\DOCUMENT_AUTHORITY_INDEX.md` (Authority hierarchy and governance principles).
2. `C:\EasyTracker\docs\00_current_authority\PRODUCT_MASTER_INSTRUCTION.md` (Legacy master architecture and review standards).
3. `C:\EasyTracker\docs\00_current_authority\PRODUCT_REQUIREMENTS_DOCUMENT.md` (Legacy PRD covering 3-Tier topology, Fleet Transit Hub, Driver Cockpit, Supervisor Stepper, SOS, GovTech Gateway, and Inventory ERP).
4. `C:\EasyTracker\docs\01_working_requirements\VEHICLE_TRACKING_LAUNCH_REQUIREMENTS_WORKING_BASELINE_V0_4.md` (Complete 2,181-line launch requirements baseline).
5. Existing codebase implementation in `src/`, `server/`, `android/`, and `database_scripts/` (Reviewed strictly as implementation evidence, not as authority).

---

## 4. AUTHORITY ORDER

As mandated in `DOCUMENT_AUTHORITY_INDEX.md`, requirement reconciliation adheres strictly to the following precedence hierarchy:

```
┌────────────────────────────────────────────────────────────────────────┐
│ 1. Latest explicit user-approved requirements                          │
├────────────────────────────────────────────────────────────────────────┤
│ 2. Vehicle Tracking Launch Working Baseline V0.4                       │
├────────────────────────────────────────────────────────────────────────┤
│ 3. Existing Legacy PRODUCT_MASTER_INSTRUCTION.md                       │
├────────────────────────────────────────────────────────────────────────┤
│ 4. Existing Legacy PRODUCT_REQUIREMENTS_DOCUMENT.md                    │
├────────────────────────────────────────────────────────────────────────┤
│ 5. Existing codebase behavior (Implementation evidence only;           │
│    NEVER authority over approved requirements)                         │
├────────────────────────────────────────────────────────────────────────┤
│ 6. Assistant recommendations (Only when no authority source decides)   │
└────────────────────────────────────────────────────────────────────────┘
```

---

## 5. LATEST CONFIRMED REQUIREMENTS

The following 21 fundamental business and technical decisions are treated as fully confirmed:
1. **Temporary Product Brand:** “EasyTracker” is a temporary working name only; final brand is TBD.
2. **Fast Standalone Launch:** Launch as a standalone vertical now; integrate into main Agency SaaS later without full rewrite.
3. **Multi-Provider Telematics:** Ingest live telemetry from licensed 3rd-party VTS providers (via push/pull Webhooks) at launch.
4. **Future Self-Hosted Traccar:** Architecture supports future migration to self-hosted Traccar when legally/commercially appropriate.
5. **Multi-Provider Assignment:** Support assignment of tracking providers by tenant, account, fleet group, or device.
6. **Decoupled Media Layer:** Event video clips, cabin voice recordings, and snapshots store directly into private S3-compatible object storage with cryptographic integrity hashing.
7. **Distinct Voice Capabilities:** Separately model `voice_call_monitoring`, `audio_recording`, `live_audio_stream`, and `two_way_audio`.
8. **Multi-Tier Entitlement Formula:** `Feature Available = Platform Capability AND Tenant Entitlement AND Customer Subscription AND User Role/Permission AND Device Capability AND Safety Policy`.
9. **Public Transport & Fleet Packs:** Modular subscription packs (Fleet Core, Public Transport, Cargo/Logistics, Courier/Delivery).
10. **Device Knowledge & Capability Registry:** Registry-driven feature resolution; no manual feature guessing by sellers or AI models.
11. **Vehicle Knowledge Registry:** Comprehensive database of legacy, current, and officially announced vehicles (fuel, battery, tyre, oil, maintenance intervals, and tracker compatibility).
12. **Regulatory Knowledge & Update Service:** Controlled knowledge tracking for BRTA, BTRC, Bangladesh Police, and Traffic authorities with human verification before production rule activation.
13. **Deterministic Core Intelligence:** Core tracking, safety, commands, and rules must run deterministically without cloud AI dependency.
14. **Provider-Agnostic External AI:** External AI (Gemini initial provider) is abstracted via an AI Orchestrator and restricted from receiving sensitive PII, live location, or private media.
15. **Governing Intelligence Principle:** *“AI assists: find, extract, compare, explain, recommend and automate safe workflows. Verified data and deterministic policy decide.”*
16. **Bilingual Localization:** Bangla (বাংলা) and English as first-class launch languages with plain-language customer UX.
17. **Built-in Product Demo:** Fully integrated web and mobile demo with isolated sample data; public demo must never control real customer vehicles.
18. **Customer Acquisition & Referral Funnel:** App install-to-purchase flow, direct store ordering, installer dispatch, and server-side referral reward ledger.
19. **Strict Financial Separation:** Separate ledgers for customer referral rewards, staff sales commissions, and B2B dealer margins.
20. **Command State Lifecycle:** Strict multi-stage command state tracking (`REQUESTED` -> `AUTHORIZED` -> `SENT` -> `QUEUED/DELIVERED` -> `DEVICE_ACKNOWLEDGED` / `FAILED`).
21. **Strict Tenant & Role Isolation:** Absolute server-side data isolation (`tenant_id`); seller/support/rescue roles have scoped, temporary, and audited access.

---

## 6. LEGACY MASTER RECONCILIATION

| Audit ID | Legacy Master Topic | Requirement Summary | V0.4 Counterpart | Classification | Reconciled Direction |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **MASTER-001** | Telematics Architecture | Push Webhooks from 3rd parties with future self-hosted Traccar support | V0.4 Sec 3.1, 3.2, 20 | `EXPANDED` | Adopt Tracking Provider Control Plane supporting 3rd-party push/pull, tenant Traccar, and SaaS Traccar. Port/protocol details belong to provider/device profiles. |
| **MASTER-002** | Media Vault | Private S3/R2/MinIO storage with SHA-256 cryptographic seal for event video & voice | V0.4 Sec 15, 16, 28.3 | `EXPANDED` | Preserve independent media ingest into private S3-compatible vault with cryptographic hashing and chain of custody logs. Legal admissibility is subject to legal verification. |
| **MASTER-003** | Multi-Role RBAC | Super Admin, Company Manager, Counter Incharge, Bus Supervisor, Driver | V0.4 Sec 11.1, 11.2 | `EXPANDED` | Expand platform roles to include Tenant Admin, Sales, Customer Service, Tech Support, Installer, Rescue Dispatcher, and Rescue Member with strict server-side scoping. |
| **MASTER-004** | Technical Stack | React, TypeScript, Vite, Tailwind CSS, Lucide Icons, Leaflet | V0.4 Sec 25, 26 | `IMPLEMENTATION_ONLY_LEGACY_BEHAVIOR` | Record existing React/Vite/Leaflet stack as current implementation baseline; future PRD requires maintainable, responsive, provider-abstracted web and mobile interfaces. |
| **MASTER-005** | Inter-Tab Sync & Audio | BroadcastChannel sync + Web Audio tone synthesizer | V0.4 Sec 10.2, 27 | `SECURITY_CORRECTION_REQUIRED` | Replace client-side BroadcastChannel with server-side WebSockets/SSE for multi-user sync. Reclassify exact audio frequencies as downstream UI design details while preserving general audible alerts. |
| **MASTER-006** | GovTech Checklist | BRTA/BTRC compliance checklist and highway police scanner | V0.4 Sec 21, 21.3, 30 | `LEGAL_REGULATORY_VERIFICATION_REQUIRED` | Subject all specific regulatory claims (e.g. AIS-140 applicability, police engine cut) to official Regulatory Knowledge Service verification. |

---

## 7. LEGACY PRD RECONCILIATION

| Audit ID | Legacy PRD Topic | Requirement Summary | V0.4 Counterpart | Classification | Reconciled Direction |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **PRD-001** | 3-Tier Decoupled Architecture | Tier 1 Ingest, Tier 2 SaaS Core, Tier 3 Private Media Vault | V0.4 Sec 3, 4, 16 | `EXPANDED` | Formally establish 3-Tier topology as the foundational architecture for standalone launch and future Agency SaaS integration. |
| **PRD-002** | Counter Incharge Portal | Schedule dispatch, gatepass approval, seat occupancy, quick intercom broadcast | V0.4 Sec 10.2 | `PRESERVE` | Preserve as a dedicated operational profile within the Public Transportation Pack. |
| **PRD-003** | Vehicle Supervisor Portal | Big-touch passenger stepper (➕/➖), capacity capping, GPS boarding logs, SOS trigger | V0.4 Sec 10.2 | `PRESERVE` | Preserve big-touch mobile stepper and boarding log within the Public Transportation Pack. |
| **PRD-004** | Driver Digital Cockpit | Overspeed governor HUD, highway radar, 2-way driver SOS trigger | V0.4 Sec 9, 10.2 | `PRESERVE` | Preserve driver cockpit HUD and connect SOS triggers to server-side emergency rescue workflows. |
| **PRD-005** | Company Manager Station Hub | Station setup, routes/fares, counter incharges, supervisors, PIN access | V0.4 Sec 10.2, 11 | `PRESERVE` | Preserve fleet transit configuration hub and integrate with tenant role manager. |
| **PRD-006** | Real-Time Sync Engine | BroadcastChannel with storage fallback | V0.4 Sec 27 | `SECURITY_CORRECTION_REQUIRED` | Migrate multi-user communication to server-side WebSockets/SSE; retain client-side tab sync for local UI state only. |
| **PRD-007** | Audio Alert Frequencies | Hardcoded frequencies (950Hz/1350Hz chirp, 1175Hz/880Hz siren) | V0.4 Sec 10.2 | `IMPLEMENTATION_ONLY_LEGACY_BEHAVIOR` | Reclassify hardcoded frequencies as downstream UI/audio design details; preserve general audible alert capabilities. |
| **PRD-008** | AIS-140 / BRTA Logging | Mandatory AIS-140 standard with 5-10s logging and 90-day archive | V0.4 Sec 8, 28.2, 30 | `LEGAL_REGULATORY_VERIFICATION_REQUIRED` | Correct AIS-140 claim; preserve generic configurable telemetry logging and retention capabilities pending official BRTA regulatory confirmation. |
| **PRD-009** | Highway Police Terminal | Plate QR inspection, live speed verification, remote stolen vehicle lockdown | V0.4 Sec 21.1, 30.3 | `LEGAL_REGULATORY_VERIFICATION_REQUIRED` | Redesign police terminal to require official law-enforcement integration credentials and lawful authorization before engine lockdown. |
| **PRD-010** | BRTA 2-Way IS Sync | Automated fitness certificate and tax token verification | V0.4 Sec 21.1, 21.2 | `LEGAL_REGULATORY_VERIFICATION_REQUIRED` | Mark BRTA sync as `PLANNED` in Integration Registry until official BRTA IS API documentation and contracts are confirmed. |
| **PRD-011** | BTRC Spectrum Audit | Mandatory spectrum audit and government M2M whitelist | V0.4 Sec 17.2, 21 | `LEGAL_REGULATORY_VERIFICATION_REQUIRED` | Reclassify government spectrum/whitelist claims as verification required; preserve operational SIM/M2M lifecycle ERP features. |
| **PRD-012** | 999 Police Engine Cut | Remote vehicle immobilizer dispatch with speed < 5 km/h constraint | V0.4 Sec 9.3, 30.3 | `SECURITY_CORRECTION_REQUIRED` | Enforce server-side safety checks and command lifecycle; exact speed/stationary thresholds are configurable by safety policy. |
| **PRD-013** | Multi-Server Cluster Hub | Connect multiple Traccar/GPS nodes with master failover | V0.4 Sec 3.3, 20 | `EXPANDED` | Formally incorporate into Tracking Provider Control Plane with multi-tenant provider routing. |
| **PRD-014** | Device & SIM Binder | 1-click unassigned SIM filtering and feature-based hardware pairing | V0.4 Sec 7, 17.1, 17.2 | `EXPANDED` | Expand into Device ERP and SIM ERP with automatic capability inheritance from Device Capability Registry. |
| **PRD-015** | Enterprise Inventory & RMA | Serialized inventory, warranty ledger, return custody, and scrap logs | V0.4 Sec 17.1, 18 | `PRESERVE` | Preserve serialized RMA lifecycle and ensure device replacement maintains vehicle service history. |
| **PRD-016** | Service Rate Cards & Quotas | Billing slabs, seller allowances, and commission ledgers | V0.4 Sec 19.1.8, 22 | `EXPANDED` | Separate customer referral rewards, staff sales commissions, and B2B dealer margins into dedicated ledgers. |
| **PRD-017** | Staff Credential Sharing | WhatsApp and clipboard plaintext staff login PIN template | V0.4 Sec 27 | `SECURITY_CORRECTION_REQUIRED` | Eliminate plaintext credential sharing over WhatsApp/clipboard; replace with secure server-side onboarding invitations. |

---

## 8. V0.4 COVERAGE REVIEW

The V0.4 Working Baseline introduces comprehensive requirements covering previously unformalized areas:
1. **Device Knowledge & Capability Registry (Sec 7):** Comprehensive registry holding manufacturer, firmware, protocol, voltage, sensors, command presets, and connection validation.
2. **Vehicle Knowledge Registry (Sec 23.4, 23.5):** Deep vehicle database with fuel, oil grade, tyre pressure, electrical system, and tracker installation compatibility.
3. **Regulatory Knowledge & Update Service (Sec 21.3):** Versioned official source tracker for BRTA, BTRC, Police, and Traffic rules with human verification workflows.
4. **AI Orchestration & Privacy Guardrails (Sec 23):** Built-in deterministic intelligence + provider-abstracted external AI with strict sensitive data boundaries.
5. **Customer Acquisition & Direct Store Funnel (Sec 19.1):** Mobile/web store browsing, vehicle compatibility picker, checkout, installation booking, and referral attribution.
6. **Referral / Refer-and-Earn Engine (Sec 19.1.4 - 19.1.7):** Code/link generation, multi-channel sharing, qualification triggers, anti-fraud rules, and wallet ledgers.
7. **Built-in Isolated Product Demo (Sec 25.3):** Full mobile and web demo persona testing with safe command simulation and zero production data leakage.
8. **Bilingual Localization (Sec 25.2A):** First-class Bangla + English resource strings with plain-language terminology for vehicle owners.
9. **Support & Rescue Modules (Sec 12, 13):** Diagnostic snapshot auto-attachment, temporary scoped location access, and map-based task assignment.
10. **Command Safety State Model (Sec 9.2):** Explicit 6-stage lifecycle preventing false positive command success.

---

## 9. REQUIREMENT TRACEABILITY MATRIX

| Audit ID | Source Document | Section / Topic | Classification | User Decision | Legal Check | Security Redesign | Target Future PRD Section |
| :--- | :--- | :--- | :--- | :---: | :---: | :---: | :--- |
| **TRC-001** | Master Instruction | 1.1 Ingest Webhooks | `EXPANDED` | NO | YES | NO | `18. Tracking Provider Model` |
| **TRC-002** | Master Instruction | 1.2 Private Media Vault | `EXPANDED` | NO | YES | NO | `54. Media / Evidence Handling` |
| **TRC-003** | Master Instruction | 1.3 RBAC Roles | `EXPANDED` | NO | NO | YES | `14. User Roles & Permissions` |
| **TRC-004** | Master Instruction | 2.0 Technical Stack | `IMPLEMENTATION_ONLY_LEGACY_BEHAVIOR` | NO | NO | NO | `74. Telemetry / Data Architecture` |
| **TRC-005** | Master Instruction | 2.0 Inter-Tab Realtime | `SECURITY_CORRECTION_REQUIRED` | NO | NO | YES | `72. Security & Tenant Isolation` |
| **TRC-006** | Master Instruction | 3.0 Compliance Checklist | `LEGAL_REGULATORY_VERIFICATION_REQUIRED`| NO | YES | NO | `62. Regulatory Knowledge` |
| **TRC-007** | Legacy PRD | 2.0 3-Tier Architecture | `EXPANDED` | NO | YES | NO | `04. Launch Strategy & Topology` |
| **TRC-008** | Legacy PRD | 3.A.1 Counter Incharge | `PRESERVE` | NO | NO | NO | `34. Public Transport Pack` |
| **TRC-009** | Legacy PRD | 3.A.2 Supervisor Stepper| `PRESERVE` | NO | NO | NO | `34. Public Transport Pack` |
| **TRC-010** | Legacy PRD | 3.A.3 Driver Cockpit | `PRESERVE` | NO | NO | NO | `34. Public Transport Pack` |
| **TRC-011** | Legacy PRD | 3.A.4 Station Hub | `PRESERVE` | NO | NO | NO | `34. Public Transport Pack` |
| **TRC-012** | Legacy PRD | 3.B Real-Time Web Audio | `IMPLEMENTATION_ONLY_LEGACY_BEHAVIOR` | NO | NO | NO | `61. UX / Responsive Design` |
| **TRC-013** | Legacy PRD | 3.C.1 AIS-140 Logging | `LEGAL_REGULATORY_VERIFICATION_REQUIRED`| NO | YES | NO | `19. Telemetry Ingestion` |
| **TRC-014** | Legacy PRD | 3.C.2 Police Terminal | `LEGAL_REGULATORY_VERIFICATION_REQUIRED`| NO | YES | YES | `64. Government Integrations` |
| **TRC-015** | Legacy PRD | 3.C.3 BRTA 2-Way Sync | `LEGAL_REGULATORY_VERIFICATION_REQUIRED`| NO | YES | NO | `64. Government Integrations` |
| **TRC-016** | Legacy PRD | 3.C.4 BTRC SIM Audit | `LEGAL_REGULATORY_VERIFICATION_REQUIRED`| NO | YES | NO | `42. SIM / M2M Operations` |
| **TRC-017** | Legacy PRD | 3.C.5 999 Police Cut | `SECURITY_CORRECTION_REQUIRED` | NO | YES | YES | `27. Command Safety Policy` |
| **TRC-018** | Legacy PRD | 3.D.1 Cluster Manager | `EXPANDED` | NO | NO | NO | `18. Tracking Provider Model` |
| **TRC-019** | Legacy PRD | 3.D.2 SIM Binder | `EXPANDED` | NO | NO | NO | `38. Device Knowledge Registry` |
| **TRC-020** | Legacy PRD | 3.D.3 Inventory & RMA | `PRESERVE` | NO | NO | NO | `43. Inventory & RMA Ledger` |
| **TRC-021** | Legacy PRD | 3.D.4 Rate Cards | `EXPANDED` | NO | NO | NO | `08. Commercial Model & Ledgers` |
| **TRC-022** | Legacy PRD | WhatsApp Staff PIN Share| `SECURITY_CORRECTION_REQUIRED` | NO | NO | YES | `72. Security & Credentials` |
| **TRC-023** | V0.4 Baseline | Sec 7 Device Registry | `EXPANDED` | NO | NO | NO | `38. Device Knowledge Registry` |
| **TRC-024** | V0.4 Baseline | Sec 9 Command Lifecycle | `EXPANDED` | NO | NO | YES | `26. Command Lifecycle` |
| **TRC-025** | V0.4 Baseline | Sec 12 Support Access | `EXPANDED` | YES | NO | YES | `31. Support Subsystem` |
| **TRC-026** | V0.4 Baseline | Sec 13 Rescue Incidents | `EXPANDED` | YES | NO | YES | `32. Rescue Incident Management` |
| **TRC-027** | V0.4 Baseline | Sec 15 Voice Modeling | `EXPANDED` | NO | YES | NO | `50. Voice Capabilities` |
| **TRC-028** | V0.4 Baseline | Sec 16 Video Vault | `EXPANDED` | NO | YES | NO | `52. Video & Dashcam Media` |
| **TRC-029** | V0.4 Baseline | Sec 19.1 Store & Refer | `EXPANDED` | NO | NO | NO | `10. Referral & Store Funnels` |
| **TRC-030** | V0.4 Baseline | Sec 21.3 Reg Knowledge | `EXPANDED` | NO | YES | NO | `62. Regulatory Knowledge` |
| **TRC-031** | V0.4 Baseline | Sec 23 AI Orchestrator | `EXPANDED` | NO | NO | YES | `67. AI & Automation Guardrails` |
| **TRC-032** | V0.4 Baseline | Sec 23.4 Vehicle DB | `EXPANDED` | NO | NO | NO | `39. Vehicle Knowledge Registry` |
| **TRC-033** | V0.4 Baseline | Sec 25.2A Bilingual UX | `EXPANDED` | NO | NO | NO | `60. Bangla / English Localization` |
| **TRC-034** | V0.4 Baseline | Sec 25.3 Isolated Demo | `EXPANDED` | NO | NO | YES | `59. Full Customer Demo` |
| **TRC-035** | V0.4 Baseline | Sec 27 Strict RBAC | `SECURITY_CORRECTION_REQUIRED` | NO | NO | YES | `17. Tenant Isolation` |
| **TRC-036** | V0.4 Baseline | Sec 33 SaaS Migration | `EXPANDED` | NO | NO | NO | `05. Future Main SaaS Integration` |

---

## 10. PRESERVE LIST

The following 10 core legacy functional capabilities are fully preserved:
1. **Transit Counter Hub & Gatepass Control:** Station scheduling, gatepass issuance, departure clearance, seat occupancy tracking.
2. **Onboard Supervisor Stepper:** Big-touch passenger counter (`➕/➖`), passenger capacity capping, GPS-tagged boarding history.
3. **Driver Digital Cockpit:** Overspeed governor HUD, highway radar, 2-way SOS emergency trigger.
4. **Autonomous Private Media Vault Concept:** Independent object storage for video clips and cabin audio with cryptographic integrity hashing.
5. **Serialized Device ERP & RMA:** IMEI tracking, supplier batch ledger, warranty claim workflows, replacement mapping.
6. **SIM / M2M Lifecycle:** APN tracking, MSISDN/ICCID records, recharge reminders, operator classification.
7. **Spare Parts Inventory:** Stock tracking for relays, wiring harnesses, fuses, antennas, and sensors.
8. **Core Telematics Data Model:** Speed, ignition, motion/stopped/idle, heading, odometer, geofence, overspeed, battery voltage.
9. **Emergency SOS & Crash Incident Workflow:** Multi-channel alerting, crash packet ingestion, incident timeline recording.
10. **Bilingual UI Framework:** Full Bengali and English UI labels and customer-facing plain-language terminology.

---

## 11. SUPERSEDED LIST

The following legacy concepts are formally superseded:

| Legacy Item | Replaced By | Reason |
| :--- | :--- | :--- |
| Single Self-Hosted Traccar as sole baseline | **Tracking Provider Control Plane** (V0.4 Sec 3.3, 20) | BTRC regulatory constraints require launching with 3rd-party licensed providers while supporting multi-provider routing. |
| Hardcoded Mock Secret Tokens in initial state | **Encrypted Server-Side Credential Vault** (V0.4 Sec 4, 27) | Security requirement prevents credentials from ever being delivered to browser/mobile clients. |
| Client-side BroadcastChannel for fleet sync | **Server-Side WebSocket / SSE Gateway** (V0.4 Sec 27) | BroadcastChannel is restricted to local browser tabs; production multi-user fleet sync requires server-backed sockets. |
| Single Generic "Voice Monitoring" flag | **4 Distinct Voice Capabilities** (V0.4 Sec 15) | Differentiates voice call monitoring, audio recording, live audio streaming, and two-way audio. |
| Manual Feature Selection for Devices by Sellers | **Device Knowledge & Capability Registry** (V0.4 Sec 7) | Technical capabilities must be resolved deterministically from manufacturer/firmware specs, not guessed by sellers. |
| Prototype Fixed BDT 100/500 Referral Values | **Configurable Multi-Tier Ledgers** (V0.4 Sec 19.1.4, 19.1.8) | Financial rules require configurable rate cards and strict separation between customer rewards, sales commissions, and dealer margins. |
| "1-Click Traccar Migration Switch" | **Multi-Provider Control Plane Routing** (V0.4 Sec 3.3) | Provider routing is managed per tenant/device/group without hardcoded socket ports. |
| Fixed 10-Second Crash Video | **Configurable Event Video Clips** (V0.4 Sec 16) | Clip duration depends on device capability, pre/post buffer, and storage policy. |

---

## 12. EXPANDED REQUIREMENTS

1. **Tracking Provider Control Plane:** Enterprise adapter layer supporting 3rd-party push webhooks, 3rd-party API pull, tenant Traccar servers, and SaaS Traccar clusters.
2. **Device Capability & Knowledge Registry:** Rich database tracking hardware revisions, firmware versions, protocols, voltage, sensors, command presets, and connection validation.
3. **Vehicle Knowledge Registry:** Comprehensive database storing specifications for legacy, current, and upcoming vehicles (fuel, battery, tyre pressure, oil grade, and tracker compatibility).
4. **Regulatory Knowledge & Update Service:** Automated official source monitoring for BRTA, BTRC, Police, and Traffic rules with human verification.
5. **AI Orchestration & Privacy Guardrails:** Provider-abstracted AI layer (Gemini initial) isolated from sensitive PII, live locations, and private media.
6. **Customer Acquisition & Direct Store Funnel:** Integrated web/mobile store, compatibility picker, checkout, and installer dispatch.
7. **Referral Engine & Anti-Fraud:** Server-side attribution, qualification events, fraud detection, and immutable reward ledgers.
8. **Command Safety Engine:** 6-stage lifecycle tracking (`REQUESTED` -> `AUTHORIZED` -> `SENT` -> `QUEUED/DELIVERED` -> `DEVICE_ACKNOWLEDGED` / `FAILED`) with configurable safety policies.
9. **Support & Rescue Subsystems:** Diagnostic snapshots, temporary scoped location grants, and territory/skill-based dispatching.
10. **Isolated Product Demo:** Full web and mobile demo with simulated routes, persona switching, and strict production isolation.
11. **Bilingual Localization:** Bangla (বাংলা) and English as first-class launch languages with plain-language customer UX.

---

## 13. VALID LEGACY REQUIREMENTS MISSING FROM V0.4

The following 3 verified legacy functional requirements are explicitly preserved for inclusion in the unified PRD:
1. **Onboard Supervisor Big-Touch Passenger Stepper Button:** Detailed big-touch UI specifications for conductors on rough roads (`➕ ১ জন উঠল` / `➖ ১ জন নামল`).
2. **Gatepass Station Verification Workflow:** Counter-to-driver gatepass issuance and station verification clearance steps.
3. **General Audible Dispatch & Alert Signals:** Requirement for audible notifications on counter dispatch and SOS events (without hardcoding raw oscillator frequencies).

---

## 14. TRUE CONFLICTS

**Zero Irreconcilable Technical Conflicts Found.**  
All differences between legacy documents and V0.4 represent positive, non-contradictory architectural expansions and safety enhancements.

---

## 15. SECURITY CORRECTIONS REQUIRED

The future PRD and refactor specifications must mandate the following requirement-level security corrections:
1. **Server-Side Authentication & Session Validation:** Enforce real JWT/OIDC sessions with server-side RBAC validation.
2. **Eliminate Role Inference Heuristics:** Prohibit determining user roles from username prefixes (e.g. `supervisor_`, `driver_`, `admin_`).
3. **Eliminate Fail-Open Authorization:** Unauthenticated or unauthorized actions must fail closed.
4. **Prevent Cross-Tenant Data Fallbacks:** Empty tenant queries must display clean empty states, never falling back to sample or other tenants' data.
5. **Server-Side Credential Vault:** Securely store all third-party provider tokens and API keys on the server; never expose admin credentials to client browsers.
6. **Command Confirmation Integrity:** Prohibit reporting command success before authoritative device acknowledgement.
7. **Real-time Gateway Refactor:** Migrate multi-user transit hub updates from `BroadcastChannel` to server WebSockets/SSE.
8. **Isolate Demo Telemetry:** Strictly isolate simulated demo data to demo sessions.
9. **Eliminate Plaintext Credential Sharing:** Prohibit generating WhatsApp/clipboard messages containing user passwords or master PINs.

---

## 16. LEGAL / REGULATORY VERIFICATION REQUIRED

The following legal and regulatory items require verification against official sources before final commercial release:
1. **Applicability of AIS-140 in Bangladesh:** Verify whether AIS-140 or a different telematics standard is officially mandated by BRTA.
2. **BTRC VTS Licensing & Push API Operating Model:** Regulatory compliance verification of 3rd-party push ingest.
3. **BRTA Telematics & IS Integration:** Technical availability and documentation verification for BRTA IS vehicle fitness and tax token APIs.
4. **Voice Monitoring & Audio Recording Consent:** Legal notice and consent requirements under Bangladesh privacy laws for cabin audio.
5. **Dashcam & Video Evidence Admissibility:** Watermark, metadata, and chain-of-custody requirements for legal/insurance evidence.
6. **Remote Engine Immobilization Policy:** Verification of vehicle immobilization safety rules and road safety liability.
7. **Law Enforcement / Police Gateway Integration:** Protocols and lawful authorization frameworks for Police / 999 emergency services.
8. **M2M Telecom Regulations:** Compliance verification for telecom APNs and M2M SIM registration rules.
9. **Data Retention Mandates:** Official verification of statutory retention requirements for GPS telemetry, emergency logs, and media files.

---

## 17. IMPLEMENTATION-ONLY LEGACY BEHAVIOR

The following behaviors discovered in the existing codebase/legacy PRD are classified as implementation-only details and carry **NO authority over approved requirements**:
- Hardcoded audio tone frequencies (`950Hz -> 1350Hz` chirp, `1175Hz <-> 880Hz` siren) in `audioAlertService.ts`.
- Specific frontend libraries (`React 19`, `Vite`, `Tailwind CSS`, `Capacitor`) recorded as current implementation baseline rather than business requirements.
- Specific mapping library (`Leaflet / OpenStreetMap`) recorded as implementation evidence rather than an immutable product rule.
- Role evaluation heuristics in `Header.tsx` based on license plate substring matching.
- Hardcoded mock telecom credentials in `TelecomM2MConnector.tsx` initial state.
- Hardcoded localhost links in `TransitCounterManager.tsx` clipboard text.
- Client-side PIN verification modals storing hashes in local component state.

---

## 18. CODEBASE IMPLEMENTATION EVIDENCE

The existing codebase in `C:\EasyTracker` provides valuable, reusable UI components and technical assets:
- **`FleetTransitHubView.tsx`:** Rich UI layouts for Transit Counters, Driver Cockpit, and Supervisor Stepper.
- **`GovTechPoliceGateway.tsx`:** Interactive 3-Tier architecture visualizer, simulator, and compliance checklist.
- **`EnterpriseInventoryManager.tsx`:** Complete serialized RMA, device, and spare parts UI.
- **`PublicDeviceStore.tsx`:** Direct-to-consumer store, package selector, and installation booking forms.
- **`audioAlertService.ts`:** Web Audio API sound synthesizer algorithms (useful as UI sound reference).
- **`bangladeshGeoData.ts`:** Comprehensive divisions, districts, and upazilas dataset for Bangladesh.

---

## 19. MASTER ARCHITECTURE IMPACT

| Architectural Domain | Classification | Strategic Impact |
| :--- | :--- | :--- |
| **Standalone Launch vs Main SaaS** | `INHERITED` | Builds as a standalone modular vertical now; cleanly registers into main Agency SaaS later. |
| **Tracking Provider Control Plane** | `SUPERSEDING` | Replaces single Traccar baseline with a multi-provider adapter layer. |
| **Autonomous Media Vault** | `INHERITED` | Direct S3/R2/MinIO object storage with cryptographic integrity seals. |
| **Device Knowledge & Capability Registry**| `NEW` | Authoritative database resolving device capabilities. |
| **Vehicle Knowledge Registry** | `NEW` | Authoritative vehicle database supporting legacy, current, and upcoming models. |
| **Regulatory Knowledge & Update Service** | `NEW` | Versioned official regulatory tracking with AI comparison and human verification. |
| **AI Orchestration & Guardrails** | `EXPANDED` | Provider-abstracted AI layer (Gemini initial) isolated from sensitive PII. |
| **Shared SaaS Engine Alignment** | `FUTURE_SHARED_PLATFORM_ALIGNMENT_REQUIRED` | Prepares Device ERP, SIM ERP, CRM, and Billing to map cleanly to shared Agency SaaS engines. |

---

## 20. OPEN DECISIONS BEFORE FINAL PRD

The following 14 business and commercial decisions are recorded for user determination. All items are explicitly marked as TBD / Configurable / Verification Required and do **NOT** block drafting the core PRD:

| Decision ID | Question / Topic | Recommended Default | Blocks PRD? | Blocks Impl? | Configurable/TBD? |
| :--- | :--- | :--- | :---: | :---: | :---: |
| **DEC-001** | Final commercial product & brand name | TBD (EasyTracker is TEMPORARY WORKING NAME ONLY) | **NO** | **NO** | **YES** |
| **DEC-002** | Initial 3rd-party licensed VTS provider(s) | TBD (GP IoT / Robi M2M / Bondstein are unverified candidate examples) | **NO** | **YES** | **YES** |
| **DEC-003** | Initial supported hardware device models | TBD (S102A is pilot evidence; production catalogue requires registry verification) | **NO** | **YES** | **YES** |
| **DEC-004** | Subscription package pricing & tiers | TBD / Configurable by tenant and market policy | **NO** | **NO** | **YES** |
| **DEC-005** | Support live-location approval workflow | Configurable duration (ticket/purpose scoped + reason + audit + auto-expiry) | **NO** | **NO** | **YES** |
| **DEC-006** | Rescue operating model & partner network | TBD / Configurable by tenant policy | **NO** | **NO** | **YES** |
| **DEC-007** | Launch fleet pack priority | TBD by commercial customer demand | **NO** | **NO** | **YES** |
| **DEC-008** | Payment gateway providers for Bangladesh | TBD / Integration candidate selection | **NO** | **NO** | **YES** |
| **DEC-009** | Telemetry raw data retention period | TBD + Legal/Privacy/Business verification required | **NO** | **NO** | **YES** |
| **DEC-010** | Crash video clip retention period | TBD + Legal/Privacy/Business verification required | **NO** | **NO** | **YES** |
| **DEC-011** | Cabin voice recording retention period | TBD + Legal/Privacy/Business verification required | **NO** | **NO** | **YES** |
| **DEC-012** | Regulatory source monitoring frequency | Configurable (e.g. periodic automated scan + manual event trigger) | **NO** | **NO** | **YES** |
| **DEC-013** | Vehicle seed catalogue scope | TBD based on initial target customer segments | **NO** | **NO** | **YES** |
| **DEC-014** | Production AI sensitive data policy | Zero PII sent to free cloud AI models | **NO** | **NO** | **YES** |

---

## 21. FUTURE PRD COVERAGE MAP

The forthcoming `docs/PRODUCT_REQUIREMENTS.md` will explicitly represent all 79 required subject areas:

1. Document Control
2. Product Identity / Temporary Brand
3. Product Vision
4. Launch Strategy
5. Future Main SaaS Integration
6. Customer Types
7. Tenant / B2B Model
8. Commercial Model
9. Sales
10. Referral
11. Customer Purchase Journey
12. Subscription
13. Entitlement
14. User Roles
15. Permissions
16. Authority / Scope
17. Tenant Isolation
18. Tracking Provider Model
19. Telemetry Ingestion
20. Live Tracking
21. Position History
22. Trips
23. Geofence
24. Alerts
25. Device Commands
26. Command Lifecycle
27. Command Safety
28. SOS
29. Accident
30. Theft
31. Support
32. Rescue
33. Fleet Core
34. Public Transport
35. Cargo / Logistics
36. Courier / Delivery
37. Corporate Fleet
38. Device Knowledge Registry
39. Vehicle Knowledge Registry
40. Vehicle ↔ Device Compatibility
41. Device Lifecycle
42. SIM / M2M
43. Inventory
44. Spare Parts
45. Installation
46. Service
47. Maintenance
48. Warranty
49. RMA
50. Voice
51. Audio
52. Video
53. Camera
54. Media / Evidence Handling
55. Reports
56. Analytics
57. Mobile Application
58. Web Application
59. Full Customer Demo
60. Bangla / English Localization
61. UX / Responsive Design
62. Regulatory Knowledge
63. Integration Registry
64. Government / Telecom Integrations
65. APIs
66. Webhooks
67. AI / Automation
68. Notifications
69. Billing / Metering
70. Privacy
71. Retention
72. Security
73. Audit
74. Telemetry / Data Architecture
75. White-Label / B2B Branding Readiness
76. Scalability
77. Non-Functional Requirements
78. Testing / Acceptance
79. Open Items

---

## 22. BLOCKING FINDINGS

**Zero Blocking Findings.**
- All legacy authority features have been mapped, preserved, or properly reclassified.
- All new V0.4 capabilities have been integrated into the architecture.
- All open commercial questions are safely categorized as TBD / configurable defaults.

---

## 23. RECONCILIATION VERDICT

> # **READY TO DRAFT RECONCILED PRODUCT_REQUIREMENTS.md**

The documentation workspace is fully reconciled, approved at version 1.0, and ready for authoring the unified, launch-ready `docs/PRODUCT_REQUIREMENTS.md`.
