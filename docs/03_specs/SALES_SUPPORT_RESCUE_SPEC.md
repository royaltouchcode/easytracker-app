# Sales, Support & Rescue Operations Specification

**Status:** APPROVED  
**Version:** 1.0  
**Approved Date:** 2026-09-03  
**Product:** Vehicle Tracking Standalone Launch  
**Product Name:** TBD  
**Temporary Working Name:** EasyTracker  
**Authoritative Upstream:**
1. `docs/03_specs/PRODUCT_REQUIREMENTS.md` v1.0 (Commit `abef605`)
2. `docs/03_specs/MODULE_SERVICE_ENTITLEMENT_SPEC.md` v1.0 (Commit `a962a2a`)
3. `docs/03_specs/USER_ROLES_PERMISSIONS_ACCESS_SPEC.md` v1.0 (Commit `25e7834`)
4. `docs/03_specs/TENANT_ISOLATION_SECURITY_BOUNDARY_SPEC.md` v1.0 (Commit `93d7a4e`)
5. `docs/03_specs/CUSTOMER_TYPES_COMMERCIAL_MODEL_SPEC.md` v1.0 (Commit `4014141`)
6. `docs/03_specs/TRACKING_PROVIDER_ARCHITECTURE_SPEC.md` v1.0 (Commit `88bcd53`)
7. `docs/03_specs/DEVICE_CAPABILITY_REGISTRY_SPEC.md` v1.0 (Commit `5c9fe52`)
8. `docs/03_specs/VEHICLE_KNOWLEDGE_REGISTRY_SPEC.md` v1.0 (Commit `0e60ce3`)
9. `docs/03_specs/REGULATORY_KNOWLEDGE_SERVICE_SPEC.md` v1.0 (Commit `d26153b`)
10. `docs/03_specs/COMMAND_SAFETY_EXECUTION_SPEC.md` v1.0 (Commit `ebccd29`)
11. `docs/03_specs/FLEET_PACK_SPEC.md` v1.0 (Commit `220ac0d`)  
**Upstream Commits:** `abef605`, `a962a2a`, `25e7834`, `93d7a4e`, `4014141`, `88bcd53`, `5c9fe52`, `0e60ce3`, `d26153b`, `ebccd29`, `220ac0d`  
**Purpose:** Establish the authoritative architectural framework for Sales Operations, Dealer/Channel/B2B Reseller boundaries, Customer Onboarding Handoff, Technical Support Operations, Support Managed Modes (`Disabled`, `Tenant Managed`, `SaaS Managed`, `Hybrid`), Ticket-Scoped Diagnostic Access Governance, Emergency Rescue Operations, Incident-Scoped Location Tracking, Responder Dispatch Boundaries, Command Safety Subordination, Multi-Tenant Privacy Isolation, and AI/Regulatory Guardrails without code forks, security bypasses, or implementation technology lock-in.

---

## 1. DOCUMENT CONTROL

| Property | Specification |
| :--- | :--- |
| **Document Title** | Sales, Support & Rescue Operations Specification |
| **Document Identifier** | `docs/03_specs/SALES_SUPPORT_RESCUE_SPEC.md` |
| **Version** | `1.0` |
| **Status** | APPROVED |
| **Approved Date** | `2026-09-03` |
| **Product Brand** | TBD (Temporary Working Name: EasyTracker) |
| **Authority Status** | APPROVED DOWNSTREAM SPECIFICATION |
| **Project Context** | Standalone Vehicle Tracking Launch (with future Agency SaaS vertical alignment) |
| **Active Development Branch** | `vehicle-tracking-launch-v1` |
| **Authoritative Upstream PRD** | `docs/03_specs/PRODUCT_REQUIREMENTS.md` v1.0 (Commit `abef605`) |
| **Authoritative Entitlement Spec** | `docs/03_specs/MODULE_SERVICE_ENTITLEMENT_SPEC.md` v1.0 (Commit `a962a2a`) |
| **Authoritative Roles & Access Spec**| `docs/03_specs/USER_ROLES_PERMISSIONS_ACCESS_SPEC.md` v1.0 (Commit `25e7834`) |
| **Authoritative Tenant Boundary Spec**| `docs/03_specs/TENANT_ISOLATION_SECURITY_BOUNDARY_SPEC.md` v1.0 (Commit `93d7a4e`) |
| **Authoritative Commercial Model Spec**| `docs/03_specs/CUSTOMER_TYPES_COMMERCIAL_MODEL_SPEC.md` v1.0 (Commit `4014141`) |
| **Authoritative Tracking Provider Spec**| `docs/03_specs/TRACKING_PROVIDER_ARCHITECTURE_SPEC.md` v1.0 (Commit `88bcd53`) |
| **Authoritative Device Capability Spec**| `docs/03_specs/DEVICE_CAPABILITY_REGISTRY_SPEC.md` v1.0 (Commit `5c9fe52`) |
| **Authoritative Vehicle Knowledge Spec**| `docs/03_specs/VEHICLE_KNOWLEDGE_REGISTRY_SPEC.md` v1.0 (Commit `0e60ce3`) |
| **Authoritative Regulatory Spec** | `docs/03_specs/REGULATORY_KNOWLEDGE_SERVICE_SPEC.md` v1.0 (Commit `d26153b`) |
| **Authoritative Command Safety Spec** | `docs/03_specs/COMMAND_SAFETY_EXECUTION_SPEC.md` v1.0 (Commit `ebccd29`) |
| **Authoritative Fleet Pack Spec** | `docs/03_specs/FLEET_PACK_SPEC.md` v1.0 (Commit `220ac0d`) |
| **Authority Precedence Index** | `docs/DOCUMENT_AUTHORITY_INDEX.md` |

---

## 2. EXECUTIVE SUMMARY

The Sales, Support & Rescue Operations Specification establishes the operational governance, lifecycle states, delegated access controls, and safety perimeters governing pre-sales commercial relationships, ongoing technical assistance, and critical incident emergency response.

### Core Architectural Mandates:
1. **Commercial vs Operational Decoupling:** Strict preservation of `Tenant != Customer != Account != Vehicle Owner != Driver`. Holding a Sales, Dealer, Channel Partner, or B2B VTS reseller relationship NEVER confers automatic operational tracking visibility, location history, command rights, customer PII access, or provider secret exposure (`CTCM-FLT-001`, `URPA-TEN-001`).
2. **Support Operating Model & Managed Modes:** Support operations execute under four exact managed modes: **`Disabled`**, **`Tenant Managed`**, **`SaaS Managed`**, and **`Hybrid`**. Platform Support and Technical Support personnel receive diagnostic telemetry visibility (`support.diagnostics.view`) only within active customer support tickets, and CANNOT view live tracking maps without an explicit, time-bound customer grant (`support.location.grant_temp`) governed by `DEC-005` (`PRD-ISO-001`, `CSE-SUP-001`).
3. **Emergency Rescue Incident Scoping:** Emergency Rescue actors operate strictly within active assigned incident contexts (`PRD-GEN-001`, `URPA-ROLE-006`, `CSE-RSC-001`). Holding a rescue role confers zero automatic fleet visibility or command authority. Rescue location tracking (`rescue.location.track`) is strictly scoped to the specific distressed asset for the active duration of the emergency incident. `DEC-006` (Rescue field operating model) remains an open business parameter.
4. **Command Safety Subordination:** Support and Rescue workflows SHALL NEVER bypass `COMMAND_SAFETY_EXECUTION_SPEC.md` v1.0 (`ebccd29`). Emergency labels, critical alarms, or support tickets do not grant unilateral or mass `Engine Disable` authority. Canonical nomenclature strictly utilizes **`Engine Disable`** and **`Engine Restore`** (`commands.engine_disable.request`, `commands.engine_restore.request`). Provider ACKs never equal physical immobilization (`CSE-ACK-002`).
5. **Applicable Multi-Factor Access Model:** Access to all operational capabilities adheres to the established formula:
   $$\text{Feature Accessible} \iff \text{Platform Capability} \land \text{Tenant Entitlement} \land \text{Customer Subscription} \land \text{User Permission} \land \text{Device Capability} \land \text{Safety / Workflow Policy}\quad (\text{where applicable})$$
6. **Data Privacy & AI Non-Authority:** Support and rescue diagnostics adhere to least-privilege data minimization. AI systems remain strictly non-authoritative (`SSR-AI-001`); in compliance with `DEC-014`, zero customer PII or live operational telemetry is shared with free cloud AI models (`PRD-DEC-014`). Zero unverified statutory claims; unresolved legal interfaces are marked `LEGAL / REGULATORY VERIFICATION REQUIRED`.

---

## 3. PURPOSE

- **SSR-GEN-001 (Specification Purpose):** This specification establishes the authoritative operational architecture for Sales, Technical Support, and Emergency Rescue operations across the EasyTracker platform. It defines lifecycle states, temporary access delegations, provider credential boundaries, and multi-tenant security controls, ensuring secure, auditable, and fail-closed operational workflows (`PRD-GEN-004`, `MSE-SUP-13`, `MSE-RSC-14`, `CTCM-GEN-001`).

---

## 4. SCOPE

- **SSR-GEN-002 (In-Scope Operational Dimensions):**
  - Sales operational models, Dealer/Channel partner boundaries, and customer onboarding handoffs (`CTCM-CUS-001`).
  - Pre-sales commercial catalog presentation and Device/Vehicle compatibility representation boundaries.
  - Support operating models, support managed modes (`Disabled`, `Tenant Managed`, `SaaS Managed`, `Hybrid`), and support case lifecycle (`MSE-SUP-13`).
  - Ticket-scoped diagnostic access, temporary live-location grants (`DEC-005`), and provider credential protection.
  - Emergency rescue operational models, incident lifecycles, responder dispatch boundaries, and incident-scoped location tracking (`MSE-RSC-14`, `DEC-006`).
  - Integration with IAM roles (`SUPPORT_AGENT`, `TECHNICAL_SUPPORT`, `RESCUE_DISPATCHER`, `RESCUE_MEMBER`, `DEALER_CHANNEL`), permissions, and tenant isolation boundaries (`URPA-CMD-001`, `TISB-TEN-001`).
  - Subordination to Command Safety & Execution Engine (`COMMAND_SAFETY_EXECUTION_SPEC.md` v1.0, commit `ebccd29`).
  - Data sensitivity classifications, PII protection, AI guardrails (`DEC-014`), and regulatory neutrality.
  - Public demo, controlled trial, and production environment segregation (`PRD-GEN-001`).
  - 10 architecture-level matrices, non-functional requirements, acceptance criteria, and complete upstream traceability.

---

## 5. OUT OF SCOPE

- **SSR-GEN-003 (Explicit Architectural Exclusions):** This specification SHALL NOT define:
  - Full Customer Relationship Management (CRM) lead tracking, opportunity scoring, or commission accounting software.
  - Concrete database table schemas, SQL migration scripts, or ORM entity models.
  - REST API endpoint controller code, JSON request/response serializers, or GraphQL resolvers.
  - Hardware inventory warehouse ledgers, SIM/M2M subscription provisioning APIs, or RMA logistics workflows (governed by downstream Inventory and Service specifications).
  - Voice/video call recording streaming infrastructure or audio processing codecs (governed by Media specification).
  - External billing payment gateway integrations or automated invoice tax calculations (governed by Billing specification).
  - Selection of commercial subscription pricing, rate cards, or promotional discounts (`DEC-004`).

---

## 6. UPSTREAM AUTHORITY & SOURCE BASIS

- **SSR-GEN-004 (Governing Upstream Precedence):** In accordance with `docs/DOCUMENT_AUTHORITY_INDEX.md`, this specification adheres strictly to:
  1. Approved `docs/03_specs/PRODUCT_REQUIREMENTS.md` v1.0 (Commit `abef605`).
  2. Approved `docs/03_specs/MODULE_SERVICE_ENTITLEMENT_SPEC.md` v1.0 (Commit `a962a2a`).
  3. Approved `docs/03_specs/USER_ROLES_PERMISSIONS_ACCESS_SPEC.md` v1.0 (Commit `25e7834`).
  4. Approved `docs/03_specs/TENANT_ISOLATION_SECURITY_BOUNDARY_SPEC.md` v1.0 (Commit `93d7a4e`).
  5. Approved `docs/03_specs/CUSTOMER_TYPES_COMMERCIAL_MODEL_SPEC.md` v1.0 (Commit `4014141`).
  6. Approved `docs/03_specs/TRACKING_PROVIDER_ARCHITECTURE_SPEC.md` v1.0 (Commit `88bcd53`).
  7. Approved `docs/03_specs/DEVICE_CAPABILITY_REGISTRY_SPEC.md` v1.0 (Commit `5c9fe52`).
  8. Approved `docs/03_specs/VEHICLE_KNOWLEDGE_REGISTRY_SPEC.md` v1.0 (Commit `0e60ce3`).
  9. Approved `docs/03_specs/REGULATORY_KNOWLEDGE_SERVICE_SPEC.md` v1.0 (Commit `d26153b`).
  10. Approved `docs/03_specs/COMMAND_SAFETY_EXECUTION_SPEC.md` v1.0 (Commit `ebccd29`).
  11. Approved `docs/03_specs/FLEET_PACK_SPEC.md` v1.0 (Commit `220ac0d`).
  12. Historical reconciliation audits (`docs/02_audit/`) as context only.

---

## 7. DEFINITIONS & CORE CONCEPTS

- **Sales Channel Boundary:** The governance rules separating commercial pre-sales interactions from operational tenant telemetry, customer PII, and command execution rights.
- **Support Managed Mode:** The operational configuration governing whether a customer's telematics deployment is managed independently by the tenant, delegated to the SaaS platform provider, operated in hybrid mode, or disabled.
- **Temporary Diagnostic Grant:** An explicit, auditable, ticket-scoped permission delegation allowing support personnel to inspect device health or live location for a bounded duration.
- **Emergency Rescue Incident:** A time-bound, auditable operational event initiated by a panic SOS alarm, crash detection, or authorized distress call, scoping responder visibility strictly to the affected asset.
- **Responder Dispatch Scope:** The restricted operational boundary restricting emergency personnel visibility strictly to active incident telemetry and emergency routing.

---

## 8. ARCHITECTURAL PRINCIPLES

- **SSR-GEN-005 (Least Privilege & Explicit Scoping):** Operational access for sales, support, and rescue personnel MUST adhere strictly to least-privilege principles. No actor receives global or permanent operational tracking authority (`URPA-TEN-001`, `TISB-ACT-004`).
- **SSR-GEN-006 (Zero Safety & Isolation Compromise):** Emergency distress events, support troubleshooting escalations, or sales demonstration workflows SHALL NEVER bypass multi-tenant boundaries, command safety evaluations, or driver privacy safeguards (`TISB-CMD-001`, `CSE-GEN-005`).

---

## 9. SALES OPERATIONS & CHANNEL BOUNDARIES

- **SSR-SAL-001 (Sales Operational Boundaries):**
  - Sales personnel represent platform capabilities, commercial subscription tiers (`MOD-001`), and vertical Fleet Packs (`MOD-TRN-07`, `MOD-CRG-08`, `MOD-DEL-09`) to prospective customers without receiving operational access to existing customer tenant data.
  - *Zero Operational Tracking Authority:* Sales users (`DEALER_CHANNEL` or pre-sales reps) SHALL NOT receive live map tracking, location history, remote command execution, or driver PII access (`URPA-TEN-001`, `CTCM-CUS-001`).
  - *Compatibility Representation:* Sales representatives consume verified device capabilities from DCR and vehicle specifications from VKR; sales actors CANNOT independently certify hardware compatibility or override fitment constraints (`SSR-DEV-001`, `SSR-VEH-001`).
- **SSR-CHN-001 (Dealer & B2B VTS Channel Governance):**
  - Dealer/Channel partners and B2B VTS resellers manage customer accounts, billing quotas, and device provisioning within their commercial resale scope (`CTCM-FLT-001`).
  - *No Implicit Operational Access:* Reselling a telematics subscription does NOT grant the dealer or channel partner visibility into the customer's fleet maps, driver trip histories, or remote immobilization controls.
  - *Customer-Owned Privacy:* Enterprise tenants maintain sovereign control over their fleet data; channel partners cannot inspect customer operational telemetry without explicit delegated customer consent (`TISB-ACT-004`).

---

## 10. CUSTOMER & TENANT ONBOARDING HANDOFF

- **SSR-SAL-002 (Onboarding Handoff Lifecycle):**
  - The commercial sales lifecycle concludes with tenant provisioning (`platform.tenant.create`) and entitlement assignment (`platform.entitlement.grant`).
  - *Separation of Commercial Order from Device Activation:* Creating a customer billing account DOES NOT automatically bind or actuate telematics hardware. Telematics binding requires physical device installation, DKR capability verification, and fail-closed provider route assignment (`TPA-PRV-001`, `DCR-CMD-001`).
  - *Handover Auditability:* All onboarding transitions—from prospect creation to production tenant handover—produce durable audit log entries recording the authorizing actor, commercial tier, and assigned module entitlements (`SSR-AUD-001`).

---

## 11. TECHNICAL SUPPORT OPERATING MODEL & MANAGED MODES

- **SSR-SUP-001 (Support Managed Modes):** In accordance with approved PRD and tenant architecture, platform support operates across four exact managed modes:
  1. **`Disabled`**: Support access is completely deactivated; platform support personnel cannot view any tenant configurations, diagnostics, or telemetry under any circumstance.
  2. **`Tenant Managed`**: The tenant self-manages all user provisioning, fleet grouping, and troubleshooting. Platform support access requires an explicit, customer-initiated support ticket and temporary grant (`support.location.grant_temp`).
  3. **`SaaS Managed`**: The tenant delegates day-to-day platform administration and technical monitoring to the SaaS provider. Support agents maintain continuous access to configuration diagnostics, but live map tracking remains ticket-scoped.
  4. **`Hybrid`**: The tenant manages operational users and vehicle groups internally, while delegating hardware health monitoring and tracking provider sync to the SaaS technical support team.
- **SSR-SUP-002 (Support Case / Ticket Lifecycle):**
  - Technical assistance is strictly mediated through structured support cases governed by the following formal state transitions:

```
+---------------+     Ticket Created      +-------------+
|   SUBMITTED   | ----------------------> |   TRIAGED   |
+---------------+                         +-------------+
        |                                        |
        | Ticket Cancelled                       | Grant Assigned
        v                                        v
+---------------+    Grant Expired/Revoked  +-------------+
|   CANCELLED   | <------------------------ | IN_PROGRESS |
+---------------+                           +-------------+
                                                 |
                                                 | Issue Fixed
                                                 v
+---------------+      Ticket Closed       +-------------+
|    CLOSED     | <----------------------- |  RESOLVED   |
+---------------+                          +-------------+
```

  - `SUBMITTED`: Customer or tenant administrator submits a technical issue report.
  - `TRIAGED`: Support triage evaluates the issue and assigns support personnel (`SUPPORT_AGENT` or `TECHNICAL_SUPPORT`).
  - `IN_PROGRESS`: Support personnel investigate configuration logs and telemetry diagnostics within active ticket scope. If live location is required, a temporary grant must be active.
  - `RESOLVED`: Technical remediation applied and confirmed by support personnel.
  - `CLOSED`: Customer or support supervisor formally closes the ticket, immediately terminating all associated temporary diagnostic grants.
  - `CANCELLED`: Support case terminated prior to resolution; all active grants fail closed immediately.

---

## 12. SUPPORT DIAGNOSTIC ACCESS GOVERNANCE

- **SSR-SUP-003 (Diagnostic Telemetry vs Live Location Distinction):**
  - Holding the `SUPPORT_AGENT` or `TECHNICAL_SUPPORT` role and an active ticket assignment grants `support.diagnostics.view` authority to inspect:
    - Cellular signal quality (CSQ), battery voltage, GNSS satellite count, and firmware version.
    - Tracking provider connection status, message ingestion timestamps, and protocol parsing error logs.
    - Configuration parameter states (APN settings, heartbeat report intervals).
  - *Live Location Non-Inclusion:* `support.diagnostics.view` DOES NOT grant access to live map coordinates, real-time vehicle movement feeds, or historical route replay (`URPA-TEN-001`).
- **SSR-SUP-004 (Temporary Sensitive Live-Location Grants):**
  - Real-time location tracking for troubleshooting purposes requires an explicit temporary grant (`support.location.grant_temp`) authorized by the tenant administrator or vehicle owner (`PRD-ISO-001`).
  - *DEC-005 Duration Governance:* In accordance with `DEC-005`, the exact duration of temporary live-location grants is configurable per tenant policy with automated fail-closed expiration.
  - *Revocation & Customer Visibility:* Customers maintain real-time visibility over active support location grants and may revoke support access instantly with a single action.
  - *No Command Authority:* Support ticket authorization NEVER confers authority to issue `Engine Disable` commands (`CSE-SUP-001`). Diagnostic reboot and status queries execute through CSE under normal verification rules.

---

## 13. PROVIDER DIAGNOSTIC & CREDENTIAL BOUNDARIES

- **SSR-TRK-001 (Credential Isolation & Zero Plaintext Exposure):**
  - Technical support personnel diagnosing provider ingestion issues interact exclusively through mediated diagnostic logs and abstraction layers (`TPA-PRV-001`).
  - *Zero Plaintext Credential Exposure:* Support personnel SHALL NEVER have access to raw provider API tokens, client secrets, basic auth credentials, or private certificate keys.
  - *Prohibition of Insecure Sharing:* Transmission of provider secrets via clipboard copying, messaging applications (e.g., WhatsApp), or unsecured email is strictly prohibited.
  - *Fail-Closed Provider Diagnosis:* If a tracking provider endpoint fails, support diagnostics report provider unavailability without falling back to demo or mock telemetry streams.

---

## 14. EMERGENCY RESCUE OPERATIONS & INCIDENT LIFECYCLE

- **SSR-RSC-001 (Rescue Operational Architecture):**
  - Emergency rescue operations provide rapid-response coordination during verified vehicle distress events (SOS panic button press, critical crash telemetry, vehicle theft report) (`PRD-GEN-001`, `MSE-RSC-14`).
  - *No Automatic Fleet Authority:* The `RESCUE_DISPATCHER` and `RESCUE_MEMBER` roles confer zero baseline authority to view general fleet maps, inspect customer profiles, or access trip history (`URPA-ROLE-006`).
  - *Incident-Scoped Location Access:* Holding an active incident assignment grants `rescue.location.track` authority strictly scoped to the specific vehicle associated with the active emergency incident.
- **SSR-RSC-002 (Emergency Incident Lifecycle):**
  - Emergency rescue workflows execute under formal incident state transitions:

```
+---------------+     Distress Trigger     +-------------+
|   DETECTED    | -----------------------> |  INITIATED  |
+---------------+                          +-------------+
        |                                         |
        | False Alarm Cancelled                   | Dispatch Assigned
        v                                         v
+---------------+    Incident Concluded     +-------------+
|   CANCELLED   | <-----------------------  | ASSIGNED /  |
+---------------+                           | RESPONDING  |
                                            +-------------+
                                                  |
                                                  | Threat Neutralized
                                                  v
+---------------+     Incident Finalized    +-------------+
|    CLOSED     | <------------------------ |  RESOLVED   |
+---------------+                           +-------------+
```

  - `DETECTED`: System receives SOS trigger, crash accelerometer breach, or emergency call.
  - `INITIATED`: Incident record created, timestamped, and queued for dispatcher review.
  - `ASSIGNED / RESPONDING`: Incident assigned to designated rescue team or field responder; `rescue.location.track` activated for the affected asset.
  - `RESOLVED`: Distress condition resolved, vehicle secured, and passenger safety confirmed.
  - `CLOSED`: Formal debrief complete; incident locked and all temporary rescue location access instantly revoked.
  - `CANCELLED`: Confirmed false alarm or duplicate trigger; access revoked immediately.
- **SSR-RSC-003 (DEC-006 Operating Model Independence):**
  - In accordance with `DEC-006`, the field operating model for emergency rescue (e.g., in-house rapid response teams, third-party security partnerships, or self-managed customer dispatch) remains configurable per tenant operational policy.
  - *No Government Authority Assumption:* The EasyTracker rescue module is a private commercial telematics coordination tool. It DOES NOT possess statutory police powers, national emergency 999 integration, or legal authority to seize assets without statutory verification (`LEGAL / REGULATORY VERIFICATION REQUIRED`).

---

## 15. COMMAND SAFETY INTERACTION & RESCUE GOVERNANCE

- **SSR-CMD-001 (Strict Subordination to CSE Engine):**
  - Emergency rescue situations and technical support troubleshooting sessions SHALL NEVER bypass the Command Safety & Execution Engine (`COMMAND_SAFETY_EXECUTION_SPEC.md` v1.0, commit `ebccd29`).
  - *No Emergency Immobilization Bypass:* An active SOS alarm, crash detection, or rescue incident DOES NOT allow single-click engine disablement without passing full 9-term authorization, device capability verification, vehicle compatibility checks, and applicable CSE safe-state evaluation (`CSE-AUT-001`, `CSE-SAF-001`).
  - *Support Command Constraints:* Support agents are restricted to diagnostic status queries (`commands.status.query`, `commands.gps_wakeup.request`). Only authorized tenant administrators holding `commands.engine_disable.request` or `commands.engine_restore.request` may initiate high-risk vehicle immobilization.
  - *Evidence Truth:* Transport protocol ACKs from providers never prove physical relay actuation or physical vehicle immobilization (`CSE-ACK-002`).

---

## 16. IAM ROLES, PERMISSIONS & ACCESS GATING

- **SSR-IAM-001 (Role Mapping & Operational Privileges):**
  - All sales, support, and rescue operations integrate strictly with approved URPA roles and permission tokens (`URPA-CMD-001`, `URPA-TEN-001`, `URPA-ROLE-006`):
    - `SUPPORT_AGENT`: Handles customer technical cases; holds `support.diagnostics.view`; holds `support.location.grant_temp` only when explicitly granted by customer.
    - `TECHNICAL_SUPPORT`: Handles hardware configuration, APN diagnostics, and device registry validation; holds `devices.registry.verify`, `commands.status.query`, `commands.reboot.request`.
    - `RESCUE_DISPATCHER`: Coordinates emergency response; holds `rescue.incident.dispatch`, `rescue.location.track` (incident-scoped).
    - `RESCUE_MEMBER`: Field responder; holds `rescue.location.track` (assigned incident only).
    - `DEALER_CHANNEL`: Reseller partner; manages commercial account billing and device provisioning; holds zero operational tracking or command permissions.
  - *No Invented Tokens:* Every permission token utilized across sales, support, and rescue workflows matches exact canonical URPA strings.

---

## 17. TENANT ISOLATION & DATA PERIMETERS

- **SSR-TEN-001 (Multi-Tenant Execution Perimeter):**
  - All support tickets, diagnostic logs, temporary access grants, rescue incidents, and responder dispatches are strictly isolated within the target customer's tenant context (`TISB-TEN-001`).
  - *Cross-Tenant Isolation:* A support agent or rescue dispatcher working on Tenant A's incident CANNOT view, query, or aggregate telemetry from Tenant B (`TISB-ACT-004`).
  - *Cryptographic & Logical Integrity:* Tenant data partitioning is enforced through server-side authorization boundaries, preventing URL manipulation or parameter tampering.

---

## 18. DATA PRIVACY, SENSITIVE LOCATION & PII BOUNDARIES

- **SSR-PRI-001 (Sensitive Telemetry & PII Protection):**
  - Driver personal information (phone numbers, national identification, home locations) and vehicle real-time coordinates are classified as sensitive PII (`PRD-AUD-002`).
  - *Information Minimization:* Support diagnostics display only technical device metrics (battery, signal, GPS fix) by default. Customer PII and live coordinates are masked unless explicitly authorized.
  - *Off-Duty & Personal Data Protection:* Driver location history and sensitive trip records are protected under tenant privacy policies and statutory labor regulations (`RKS-SEC-001`).

---

## 19. ARTIFICIAL INTELLIGENCE & AUTOMATION GUARDRAILS

- **SSR-AI-001 (AI Advisory Role & Data Guard):**
  - AI systems MAY provide diagnostic root-cause suggestions (e.g., detecting low battery trends, antenna disconnection patterns) or incident dispatch route recommendations (`PRD-AUT-001`).
  - *Zero Operational Authority:* AI systems SHALL NEVER possess authority to open/close support tickets, assign rescue responders, modify user permissions, or dispatch remote commands (`CSE-AI-001`).
  - *DEC-014 Protection:* In strict accordance with `DEC-014`, zero customer PII, driver identities, live vehicle coordinates, or provider diagnostic secrets SHALL be sent to free cloud AI models (`PRD-DEC-014`, `TISB-SEC-001`).

---

## 20. REGULATORY KNOWLEDGE & GOVERNMENT BOUNDARIES

- **SSR-REG-001 (Statutory Compliance & Legal Flags):**
  - Support and rescue operations consume verified regulatory knowledge from the Regulatory Knowledge Service (`REGULATORY_KNOWLEDGE_SERVICE_SPEC.md` v1.0, commit `d26153b`).
  - *No Assumed Government APIs:* The platform DOES NOT assume or claim real-time integration with BRTA, BTRC, Police, or national emergency 999 systems.
  - *Mandatory Verification Flags:* Any workflow depending on local statutory emergency response mandates is designated as `LEGAL / REGULATORY VERIFICATION REQUIRED`.

---

## 21. DEMO, TRIAL & PRODUCTION SEGREGATION

- **SSR-DEM-001 (Sales Demo vs Production Safety):**
  - `Public Demo Environment`: Sales demonstrations operate strictly on synthetic vehicle fleets and simulated route progress; zero real device commands, zero access to production customer records (`PRD-GEN-001`, `CSE-ENV-001`).
  - `Controlled Test Hardware`: Dedicated bench-test units and trial vehicles isolated from commercial production data.
  - `Production Operations`: Real-world sales, support, and rescue operations executing under full multi-gate authorization and safe-state evaluation.
  *Production workflows SHALL NEVER fall back to simulated execution upon network or provider failure.*

---

## 22. WHITE-LABEL BRANDING BOUNDARIES

- **SSR-WL-001 (White-Label Customization without Security Forks):**
  - Channel partners and enterprise tenants MAY customize support portal branding (logos, brand color themes, support contact URLs) within approved platform boundaries (`PRD-GEN-004`, `CTCM-CUS-001`).
  - White-label customization is strictly superficial; it SHALL NEVER fork platform security perimeters, IAM permission models, support ticket authorization logic, or rescue safety pipelines.

---

## 23. AUDITABILITY & DURABLE EVIDENCE

- **SSR-AUD-001 (Operational Audit Requirements):**
  - 100% of sales provisioning actions, support case lifecycle transitions, temporary diagnostic grant approvals/revocations, live-location accesses, rescue incident triggers, responder dispatches, and remote command requests MUST produce durable, tamper-evident audit logs (`PRD-AUD-001`, `CSE-AUD-001`).
  - Audit log entries MUST record the authenticated actor ID, target tenant ID, asset ID, timestamp, granted permission scope, and operational justification.

---

## 24. CONCURRENCY, REASSIGNMENT & STALE-GRANT HANDLING

- **SSR-CON-001 (Grant Invalidation & Concurrency Safety):**
  - If a support case is closed or re-assigned to another agent, all active temporary location grants bound to the previous agent are automatically and immediately revoked.
  - If a rescue incident is closed or marked resolved, responder location tracking authority terminates instantly.
  - Distributed token or session caches MUST validate grant active status on every location stream request, preventing stale grant reuse.

---

## 25. NON-FUNCTIONAL REQUIREMENTS

- **SSR-NFR-001 (Support Diagnostic Latency):** Support diagnostic telemetry metrics (voltage, signal, satellite count) MUST render within 1.5 seconds of request across all managed modes.
- **SSR-NFR-002 (Emergency Rescue Dispatch Latency):** Emergency distress alarm ingestion and responder incident dispatch routing MUST process within 500 milliseconds of trigger reception.
- **SSR-NFR-003 (Fail-Closed Access Revocation):** Temporary support location grants and rescue incident scopes MUST fail closed instantly upon expiration, ticket closure, or explicit revocation.
- **SSR-NFR-004 (Audit Trail Durability):** Operational audit logs MUST be persisted to append-protected storage with zero data loss.
- **SSR-NFR-005 (Implementation Neutrality):** The sales, support, and rescue architecture SHALL NOT mandate specific message brokers (Kafka, RabbitMQ), cloud queues (SQS), or container orchestrators (Kubernetes).
- **SSR-NFR-006 (Multi-Tenant Isolation Integrity):** Zero support diagnostics, customer tickets, or rescue telemetry SHALL leak across tenant boundaries under any failure or failover condition.

---

## 26. ARCHITECTURE MATRICES

The following 10 architecture matrices (Sections 27–36) define the operational boundaries of the Sales, Support, and Rescue systems.

---

## 27. OPERATIONAL ACTOR & DELEGATED AUTHORITY MATRIX

| Operational Actor | Primary Function | View Live Map | View History | Access Diagnostics | Grant Temp Location | Dispatch Rescue | Execute Commands |
| :--- | :--- | :---: | :---: | :---: | :---: | :---: | :---: |
| **Sales Representative** | Prospecting & Onboarding | **NO** | **NO** | **NO** | **NO** | **NO** | **NO** |
| **Dealer / Channel Partner** | Account Resale & Billing | **NO** | **NO** | **NO** | **NO** | **NO** | **NO** |
| **Support Agent** | Case Troubleshooting | Ticket Scope Grant (DEC-005 Duration)| Ticket Scope | **YES (Ticket Scoped)**| **NO** | **NO** | **NO** |
| **Technical Support** | Hardware & APN Diagnosis | Ticket Scope Grant (DEC-005 Duration)| Ticket Scope | **YES (Ticket Scoped)**| **NO** | **NO** | Diagnostics Only |
| **Rescue Dispatcher** | Emergency Coordination | Incident Scope Only | Incident Scope | Incident Telemetry | **NO** | **YES** | Emergency Queries Only|
| **Rescue Field Member** | Field Response & Rescue | Assigned Incident Only | Assigned Incident | **NO** | **NO** | **NO** | **NO** |
| **Tenant Administrator** | Tenant Governance | **Full Tenant Scope** | **Full Tenant Scope**| **Full Tenant Scope** | **YES** | **YES** | Full (via CSE Gates) |

---

## 28. SUPPORT MANAGED MODES MATRIX

| Managed Mode | Tenant Role | SaaS Provider Role | Configuration Authority | Diagnostic Telemetry Access | Live Location Access Rule |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **`Disabled`** | Full Self-Management | Zero Access | Tenant Only | **Completely Blocked** | **Completely Blocked** |
| **`Tenant Managed`** | Full Self-Management | On-Demand Assistance | Tenant Only | Active Support Ticket Only | Explicit Customer Grant (`support.location.grant_temp`) |
| **`SaaS Managed`** | Strategic Oversight | Full Administration | Delegated SaaS Team | Continuous Health Diagnostics | Ticket-Scoped Explicit Grant (`DEC-005`) |
| **`Hybrid`** | Operational Users/Fleet | Technical/Provider Sync| Shared Operational Boundary| Hardware/Provider Diagnostics | Ticket-Scoped Explicit Grant (`DEC-005`) |

---

## 29. SUPPORT CASE & DIAGNOSTIC GRANT LIFECYCLE MATRIX

| Case State | Initiator / Actor | Permitted Support Actions | Diagnostic Telemetry Scope | Live Location Access Status | Grant Revocation Trigger |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **`SUBMITTED`** | Customer / Tenant Admin | Triage & Assignment | None | Inactive | Ticket Cancellation |
| **`TRIAGED`** | Support Supervisor | Assign Agent & Review Issue | Configuration Logs Only | Inactive | Ticket Cancellation |
| **`IN_PROGRESS`** | Assigned Support Agent | Diagnostic Testing & Analysis| Technical Telemetry Metrics | **Active (If Explicit Grant Present)**| Grant Expiry / Customer Revoke |
| **`RESOLVED`** | Support Agent | Verification of Remediation | Technical Telemetry Metrics | Inactive | Remediation Completed |
| **`CLOSED`** | Customer / Supervisor | None (Case Archived) | Read-Only Audit History | **Instantly Terminated** | Case Formal Closure |
| **`CANCELLED`**| Customer / Supervisor | None (Case Terminated) | Read-Only Audit History | **Instantly Terminated** | Case Cancellation |

---

## 30. RESCUE INCIDENT & LOCATION ACCESS LIFECYCLE MATRIX

| Incident State | Trigger Event | Dispatcher Authority | Field Responder Visibility | Location Access Boundary | Automatic Command Action |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **`DETECTED`** | SOS Alarm / Crash Breach | Queue Review & Validation | None | Restricted to Alarm Timestamp | **NONE (Zero Auto-Disable)** |
| **`INITIATED`** | Dispatcher Confirmation | Route Assignment & Alerting | None | Alarm Origin Telemetry | **NONE (Zero Auto-Disable)** |
| **`ASSIGNED`** | Team Dispatch Assignment | Real-Time Incident Tracking | Assigned Target Real-Time Stream | **Strictly Scoped to Distressed Vehicle**| **NONE (Zero Auto-Disable)** |
| **`RESPONDING`** | Responder En Route | Incident Coordination | Live Navigation & Asset Coordinates| **Strictly Scoped to Distressed Vehicle**| **NONE (Zero Auto-Disable)** |
| **`RESOLVED`** | Threat Neutralized | Finalize Incident Report | Read-Only Summary | **Terminated (No Live Tracking)**| **NONE** |
| **`CLOSED`** | Dispatcher Formal Sign-Off | None (Incident Archived) | None | **Terminated & Locked** | **NONE** |

---

## 31. DATA SENSITIVITY & ACCESS CLASSIFICATION MATRIX

| Data Category | Specific Data Elements | Sales Access | Support Agent Access | Rescue Dispatcher Access | Tenant Admin Access |
| :--- | :--- | :---: | :---: | :---: | :---: |
| **Commercial Account Data** | Plan tier, device count, billing address | Full (Pre-Sales) | Read-Only (Context) | **NO** | Full Authority |
| **Customer / Driver PII** | Phone, National ID, home address | **NO** | Masked (Ticket Scope) | Emergency Contact Only | Full Tenant Scope |
| **Technical Telemetry** | Battery voltage, CSQ, satellite count | **NO** | **YES (Active Ticket)** | **YES (Active Incident)** | Full Tenant Scope |
| **Real-Time Coordinates** | Live latitude, longitude, speed, heading | **NO** | **Ticket Grant Only (DEC-005)**| **Incident Scoped Only** | Full Tenant Scope |
| **Historical Route Data** | Past trip coordinates, playback replay | **NO** | Ticket Grant Only | Incident Context Only | Full Tenant Scope |
| **Provider Secrets / Keys** | API tokens, server private keys | **STRICTLY PROHIBITED**| **STRICTLY PROHIBITED** | **STRICTLY PROHIBITED** | **STRICTLY PROHIBITED** |

---

## 32. COMMAND SAFETY & OPERATIONAL INTERVENTION MATRIX

| Command Request | Requesting Actor | URPA Token Check | CSE Safe-State Evaluation | Outcome Evidence Verification | Emergency Bypass Allowed? |
| :--- | :--- | :---: | :---: | :---: | :---: |
| **`Engine Disable`** | Tenant Admin / Fleet Manager | `commands.engine_disable.request` | **Full CSE Safe-State Evaluation** | Verified Sensor Evidence | **STRICTLY PROHIBITED** |
| **`Engine Restore`** | Tenant Admin / Fleet Manager | `commands.engine_restore.request` | **Full CSE Safe-State Evaluation** | Verified Sensor Evidence | **STRICTLY PROHIBITED** |
| **`Diagnostic Query`** | Technical Support / Dispatcher| `commands.status.query` | Safe Context Evaluation | Protocol Response ACK | Permitted (Non-Actuating) |
| **`GPS Wakeup`** | Technical Support / Dispatcher| `commands.gps_wakeup.request` | Safe Context Evaluation | Protocol Response ACK | Permitted (Non-Actuating) |
| **`Device Reboot`** | Technical Support | `commands.reboot.request` | Safe Context Evaluation | Protocol Response ACK | Permitted (Non-Actuating) |

---

## 33. PROVIDER & CREDENTIAL PROTECTION MATRIX

| Subsystem Component | Credential Ingestion | Operational Access Model | Diagnostics Access Pattern | Failure Handling |
| :--- | :--- | :--- | :--- | :--- |
| **Licensed 3rd-Party VTS** | Secure System Secret Store | Multi-Provider Router (`TPA-PRV-001`)| Abstracted Diagnostic Error Logs| Fail Closed (`503 Provider Down`) |
| **Tenant-Owned Server** | Tenant Admin Configuration | Isolated Tenant Context | Sanitized Connection Telemetry | Fail Closed (`503 Connection Lost`)|
| **Direct Hardware Gateway** | Secure Gateway Config | Protocol Parser Ingestion Engine | Raw Hex Error Logs (Masked Keys) | Fail Closed (`502 Bad Gateway`) |

---

## 34. CHANNEL / DEALER / RESELLER BOUNDARY MATRIX

| Resale Interaction | Commercial Authorization | Operational Telemetry Access | Remote Command Rights | Driver PII Access |
| :--- | :--- | :---: | :---: | :---: |
| **Prospect Quoting** | Allowed (Commercial Catalog) | **PROHIBITED** | **PROHIBITED** | **PROHIBITED** |
| **Account Provisioning** | Allowed (`platform.tenant.create`)| **PROHIBITED** | **PROHIBITED** | **PROHIBITED** |
| **Subscription Renewal** | Allowed (Billing Module) | **PROHIBITED** | **PROHIBITED** | **PROHIBITED** |
| **Customer Fleet Tracking**| **PROHIBITED** | **PROHIBITED** | **PROHIBITED** | **PROHIBITED** |

---

## 35. DEMO / TRIAL / PRODUCTION OPERATIONAL MATRIX

| Operational Dimension | Public Demo Environment | Controlled Hardware Trial | Production Commercial SaaS |
| :--- | :--- | :--- | :--- |
| **Telemetry Source** | Synthetic / Replay Telemetry | Dedicated Physical Test Units | Real-World Customer Fleets |
| **Support Case Handling** | Mock Ticket Workflows | Active Pilot Support Cases | Full Multi-Mode Support SLAs |
| **Emergency Rescue Alarms** | Simulated Trigger Animations | Bench-Test Distress Events | Real Operational Dispatch Workflows |
| **Remote Immobilization** | **Simulated (Zero Real Command)**| Controlled Test Units Only | Governed Strictly by CSE v1.0 |
| **Tenant Data Boundary** | Public Demo Sandbox Tenant | Isolated Trial Tenant | Strict Multi-Tenant Logical Partitioning |

---

## 36. DOMAIN AUTHORITY SEPARATION MATRIX

| Domain / Subsystem | Governing Specification | Sole Authority | SSR Interaction |
| :--- | :--- | :--- | :--- |
| **Sales, Support & Rescue** | `SALES_SUPPORT_RESCUE_SPEC.md` | **Operational Support & Rescue Models** | Defines case lifecycles, grants, and incident states. |
| **Command Safety Engine** | `COMMAND_SAFETY_EXECUTION_SPEC.md` | **Sole Authority for Command Gating** | Enforces 9-term auth, safe state, and execution truth. |
| **Module & Service Entitlement**| `MODULE_SERVICE_ENTITLEMENT_SPEC.md`| **Sole Authority for Feature Gating** | Enforces commercial pack and support/rescue module licensing. |
| **User Roles & Access (IAM)** | `USER_ROLES_PERMISSIONS_ACCESS_SPEC.md`| **Sole Authority for User IAM** | Validates actor roles, tokens, and delegated scope. |
| **Tenant Isolation & Security** | `TENANT_ISOLATION_SECURITY_BOUNDARY_SPEC.md`| **Sole Authority for Tenant Boundary** | Guarantees zero cross-tenant data leakage. |
| **Tracking Provider Architecture**| `TRACKING_PROVIDER_ARCHITECTURE_SPEC.md`| **Sole Authority for Ingestion Routes** | Routes device telemetry through active providers. |
| **Device Capability Registry** | `DEVICE_CAPABILITY_REGISTRY_SPEC.md` | **Sole Authority for Hardware Facts** | Verifies device sensor/relay support. |
| **Vehicle Knowledge Registry** | `VEHICLE_KNOWLEDGE_REGISTRY_SPEC.md` | **Sole Authority for Vehicle Facts** | Verifies vehicle electrical fitment & specs. |
| **Regulatory Knowledge Service**| `REGULATORY_KNOWLEDGE_SERVICE_SPEC.md`| **Sole Authority for Legal Rules** | Enforces statutory transport regulations. |
| **Fleet Pack Specification** | `FLEET_PACK_SPEC.md` | **Sole Authority for Fleet Operations** | Defines shared Fleet Core and vertical packs. |

---

## 37. ACCEPTANCE CRITERIA

- **SSR-ACC-001 (Sales, Support & Rescue Acceptance Gates):**
  1. *Sales Boundary Enforcement:* Sales and dealer actors receive zero operational live map tracking, history playback, or command execution authority (`SSR-SAL-001`).
  2. *Channel Reseller Isolation:* B2B resellers and dealer channels cannot inspect customer fleet telemetry without explicit customer delegation (`SSR-CHN-001`).
  3. *Four Support Managed Modes:* Preserves exactly `Disabled`, `Tenant Managed`, `SaaS Managed`, and `Hybrid` modes without omissions or invented modes (`SSR-SUP-001`).
  4. *Support Case Lifecycle Integrity:* Technical troubleshooting enforces formal state transitions (`SUBMITTED` -> `TRIAGED` -> `IN_PROGRESS` -> `RESOLVED` -> `CLOSED`) (`SSR-SUP-002`).
  5. *Diagnostic Telemetry Gating:* `support.diagnostics.view` allows technical telemetry diagnosis (battery, signal, GPS fix) but blocks live map tracking (`SSR-SUP-003`).
  6. *Temporary Location Grant Gating:* Live tracking requires an active support case and an explicit temporary grant (`support.location.grant_temp`) governed by `DEC-005` (`SSR-SUP-004`).
  7. *DEC-005 Non-Resolution Preservation:* `DEC-005` (Support live-location duration) remains open and configurable per tenant policy without hardcoded durations.
  8. *Support Command Restriction:* Support personnel cannot execute `Engine Disable` commands under any circumstance (`SSR-CMD-001`).
  9. *Provider Credential Isolation:* Support diagnostics operate through abstraction layers; zero plaintext secret or API token exposure (`SSR-TRK-001`).
  10. *Rescue Role Authority Scoping:* `RESCUE_DISPATCHER` and `RESCUE_MEMBER` roles grant zero baseline fleet visibility outside of active assigned incidents (`SSR-RSC-001`).
  11. *Rescue Incident Lifecycle Integrity:* Rescue operations enforce formal incident states (`DETECTED` -> `INITIATED` -> `ASSIGNED/RESPONDING` -> `RESOLVED` -> `CLOSED`) (`SSR-RSC-002`).
  12. *DEC-006 Non-Resolution Preservation:* `DEC-006` (Emergency rescue field operating model) remains open and configurable per tenant operational policy.
  13. *No Assumed Government Authority:* Rescue module makes zero unverified claims of Police, BRTA, BTRC, or national 999 integration (`SSR-RSC-003`).
  14. *Command Safety Subordination:* Support and rescue workflows execute strictly through CSE v1.0 (`ebccd29`); zero emergency bypass for `Engine Disable` (`SSR-CMD-001`).
  15. *Canonical Command Terminology:* Strictly utilizes **`Engine Disable`** and **`Engine Restore`** (`commands.engine_disable.request`, `commands.engine_restore.request`); zero unapproved cut terms.
  16. *Applicable Multi-Factor Entitlement:* Feature access enforces Platform $\land$ Tenant $\land$ Subscription $\land$ Permission $\land$ Device $\land$ Safety/Workflow Policy where applicable (`SSR-GEN-005`).
  17. *Canonical Role & Permission Exactness:* All roles and permission tokens match approved URPA definitions; zero invented IAM tokens (`SSR-IAM-001`).
  18. *Multi-Tenant Data Isolation:* Support cases, diagnostic logs, and rescue incidents are strictly partitioned per tenant (`SSR-TEN-001`).
  19. *Sensitive PII Protection:* Customer and driver personal information is masked by default during technical support diagnosis (`SSR-PRI-001`).
  20. *AI Non-Authority:* AI systems cannot dispatch commands, modify permissions, or assign rescue responders (`SSR-AI-001`).
  21. *AI DEC-014 Data Guard:* Zero customer PII or live telemetry sent to free cloud AI models (`SSR-AI-001`).
  22. *Demo / Production Segregation:* Public demo never executes real high-risk commands; production never falls back to simulation (`SSR-DEM-001`).
  23. *White-Label Branding Integrity:* Custom branding operates within approved boundaries without code, security, IAM, or safety forks (`SSR-WL-001`).
  24. *Durable Audit Logging:* 100% of support case transitions, temporary grants, rescue dispatches, and command requests generate tamper-evident audit logs (`SSR-AUD-001`).
  25. *Concurrency & Stale Grant Invalidation:* Support case or rescue incident closure immediately invalidates all associated temporary location access tokens (`SSR-CON-001`).
  26. *Requirement ID Stability:* All requirements maintain unique, stable, accountable requirement IDs.
  27. *Complete Upstream Traceability:* 100% of requirements map to approved upstream specifications.

---

## 38. UPSTREAM TRACEABILITY

| Specification Requirement ID | Upstream PRD ID(s) | Upstream Entitlement ID(s) | Upstream Roles & Access ID(s) | Upstream Tenant Boundary ID(s) | Upstream Commercial Model ID(s) | Upstream Provider Arch ID(s) | Upstream Device Cap ID(s) | Upstream Vehicle Know ID(s) | Upstream Regulatory ID(s) | Upstream Command Safety ID(s) | Primary Subject Covered |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **SSR-GEN-001 to SSR-GEN-006** | `PRD-GEN-004`, `PRD-GOL-004` | `MSE-SYS-001`, `MSE-GEN-001` | `URPA-GEN-001` | `TISB-GEN-001` | `CTCM-GEN-001` | `TPA-GEN-001` | `DCR-GEN-001` | `VKR-GEN-001` | `RKS-GEN-001` | `CSE-GEN-001` | Purpose, Scope & Principles |
| **SSR-SAL-001, SSR-SAL-002** | `PRD-GEN-004`, `PRD-CUST-001`| `MSE-GEN-001` | `URPA-TEN-001` | `TISB-ACT-004` | `CTCM-CUS-001`, `CTCM-CUS-002`| `TPA-CAP-001` | `DCR-GEN-001` | `VKR-GEN-001` | `RKS-GEN-001` | `CSE-AUT-001` | Sales & Onboarding Handoff |
| **SSR-CHN-001** | `PRD-CUST-007` | `MSE-GEN-001` | `URPA-TEN-001` | `TISB-TEN-001` | `CTCM-FLT-001`, `CTCM-DEV-003`| `TPA-PRV-001` | `DCR-TEN-001` | `VKR-TEN-001` | `RKS-GEN-001` | `CSE-AUT-001` | Dealer & Channel Boundaries |
| **SSR-SUP-001 to SSR-SUP-004** | `PRD-ISO-001`, `PRD-GEN-001`| `MSE-SUP-13` | `URPA-TEN-001`, `URPA-CMD-001` | `TISB-TEN-001` | `CTCM-SUB-002` | `TPA-TEL-003` | `DCR-CMD-003` | `VKR-GEN-001` | `RKS-SEC-002` | `CSE-SUP-001` | Support Modes & Diagnostics |
| **SSR-TRK-001** | `PRD-PRV-001` | `MSE-SYS-001` | `URPA-DEV-001` | `TISB-INT-001` | `CTCM-DEV-003` | `TPA-PRV-001`, `TPA-PRV-002` | `DCR-INT-001` | `VKR-GEN-006` | `RKS-PRV-001` | `CSE-ROU-001` | Provider Credential Isolation |
| **SSR-RSC-001 to SSR-RSC-003** | `PRD-GEN-001` | `MSE-RSC-14` | `URPA-ROLE-006`, `URPA-CMD-001`| `TISB-TEN-001` | `CTCM-SUB-002` | `TPA-TEL-003` | `DCR-CMD-003` | `VKR-GEN-001` | `RKS-SEC-002` | `CSE-RSC-001` | Rescue Operations & Incidents |
| **SSR-CMD-001** | `PRD-CMD-001` | `MSE-CMD-05` | `URPA-CMD-001` | `TISB-CMD-001` | `CTCM-CMD-001` | `TPA-CAP-001` | `DCR-CMD-003` | `VKR-CMD-001` | `RKS-CMD-001` | `CSE-AUT-001` to `CSE-ACC-001` | Command Safety Subordination |
| **SSR-IAM-001** | `PRD-AUT-001` | `MSE-SYS-001` | `URPA-ROLE-001` to `URPA-ROLE-006`| `TISB-ACT-004`| `CTCM-CUS-001` | `TPA-GEN-001` | `DCR-GEN-001` | `VKR-GEN-001` | `RKS-GEN-001` | `CSE-AUT-001` | Role & Permission Integration |
| **SSR-TEN-001** | `PRD-ISO-001` | `MSE-GEN-001` | `URPA-TEN-001` | `TISB-TEN-001` | `CTCM-TEN-001` | `TPA-PRV-002` | `DCR-TEN-001` | `VKR-TEN-001` | `RKS-TEN-001` | `CSE-TEN-001` | Multi-Tenant Data Perimeters |
| **SSR-PRI-001** | `PRD-AUD-002` | `MSE-SYS-001` | `URPA-ROLE-006` | `TISB-SEC-001` | `CTCM-CUS-001` | `TPA-AUD-001` | `DCR-GEN-001` | `VKR-GEN-001` | `RKS-SEC-001` | `CSE-AUD-001` | Sensitive Data & PII Guard |
| **SSR-AI-001** | `PRD-AUT-001` | `MSE-AI-18` | `URPA-AUTH-001` | `TISB-SEC-001` | `CTCM-AUD-001` | `TPA-AI-001` | `DCR-AI-001` | `VKR-AI-001` | `RKS-AI-001`, `RKS-AI-002` | `CSE-AI-001`, `CSE-AI-002` | AI Advisory & DEC-014 Guard |
| **SSR-REG-001** | `PRD-GEN-001` | `MSE-REG-19` | `URPA-GEN-001` | `TISB-GEN-001` | `CTCM-GEN-001` | `TPA-GEN-001` | `DCR-GEN-001` | `VKR-GEN-001` | `RKS-REG-001` to `RKS-ACC-001` | `CSE-SAF-001` | Regulatory Verification |
| **SSR-DEM-001** | `PRD-GEN-001` | `MSE-DMO-20` | `URPA-GEN-001` | `TISB-GEN-001` | `CTCM-GEN-001` | `TPA-GEN-001` | `DCR-GEN-001` | `VKR-GEN-001` | `RKS-GOV-002` | `CSE-ENV-001` | Demo vs Prod Segregation |
| **SSR-WL-001** | `PRD-GEN-004` | `MSE-SYS-001` | `URPA-GEN-001` | `TISB-TEN-001` | `CTCM-CUS-001` | `TPA-GEN-001` | `DCR-GEN-001` | `VKR-GEN-001` | `RKS-GEN-001` | `CSE-GEN-001` | White-Label Branding Bounds |
| **SSR-AUD-001** | `PRD-AUD-001` | `MSE-SYS-001` | `URPA-CMD-001` | `TISB-ACT-004` | `CTCM-AUD-001` | `TPA-AUD-001` | `DCR-GEN-001` | `VKR-GEN-001` | `RKS-GEN-001` | `CSE-AUD-001` | Durable Audit Logging |
| **SSR-CON-001** | `PRD-ISO-001` | `MSE-SUP-13` | `URPA-TEN-001` | `TISB-TEN-001` | `CTCM-SUB-002` | `TPA-TEL-003` | `DCR-CMD-003` | `VKR-GEN-001` | `RKS-SEC-002` | `CSE-SUP-001` | Concurrency & Invalidation |
| **SSR-DEV-001** | `PRD-GEN-004` | `MSE-SYS-001` | `URPA-DEV-001` | `TISB-CMD-001` | `CTCM-DEV-001` | `TPA-CAP-001` | `DCR-CMD-003` | `VKR-CMP-001` | `RKS-GEN-001` | `CSE-AUT-001` | Device Capability Decoupling |
| **SSR-VEH-001** | `PRD-GEN-004` | `MSE-SYS-001` | `URPA-CMD-001` | `TISB-CMD-001` | `CTCM-FLT-001` | `TPA-CAP-001` | `DCR-CMD-003` | `VKR-GEN-001` | `RKS-REG-001` | `CSE-AUT-003` | Vehicle Knowledge Decoupling |
| **SSR-NFR-001 to SSR-NFR-006** | `PRD-NFR-001` to `PRD-NFR-004`| `MSE-NFR-001` to `MSE-NFR-004`| `URPA-NFR-001` to `URPA-NFR-004`| `TISB-NFR-001` to `TISB-NFR-004`| `CTCM-NFR-001` to `CTCM-NFR-004`| `TPA-NFR-001` to `TPA-NFR-008`| `DCR-NFR-001` to `DCR-NFR-008`| `VKR-NFR-001` to `VKR-NFR-008`| `RKS-NFR-001` to `RKS-NFR-008`| `CSE-NFR-001` to `CSE-NFR-008`| Non-Functional Standards |
| **SSR-ACC-001** | `PRD-GEN-004` | `MSE-SUP-13` | `URPA-CMD-001` | `TISB-ACC-001` | `CTCM-ACC-001` | `TPA-ACC-001` | `DCR-ACC-001` | `VKR-ACC-001` | `RKS-ACC-001` | `CSE-ACC-001` | Acceptance Criteria Gates |

---

## 39. OPEN ITEMS

The following open decisions from approved upstream baselines are carried forward as direct dependencies of this specification:

| Decision ID | Subject / Topic | Upstream Baseline Status | Sales, Support & Rescue Dependency / Why Carried |
| :--- | :--- | :--- | :--- |
| **DEC-005** | Support live-location grant exact duration | Configurable (Ticket-scoped, explicit grant, auto-expiry) | **Direct Support Dependency:** Governs the exact automated expiration duration for temporary support live-location grants (`support.location.grant_temp`). Retained as open and configurable per tenant operational policy. |
| **DEC-006** | Emergency rescue field operating model | TBD / Configurable by tenant operational policy | **Direct Rescue Dependency:** Governs the operational model for field response deployment (in-house, third-party security, or self-managed). Retained as open and configurable per tenant operational policy. |

*Note on Operational Parameters:* `DEC-001` (Brand Name), `DEC-002` (Provider Selection), `DEC-003` (Device Catalogue), `DEC-004` (Subscription Pricing), `DEC-007` (Fleet Pack Rollout Order), `DEC-008` (Payment Gateways), `DEC-009` (Raw Data Retention), and `DEC-014` (AI Data Classification) are external operational parameters. This specification accommodates them without premature resolution.

---

## 40. BLOCKING QUESTIONS

> **Zero Blocking Questions.**  
The Sales, Support & Rescue Operations Specification, Sales boundaries, customer onboarding handoffs, Support operating models (`Disabled`, `Tenant Managed`, `SaaS Managed`, `Hybrid`), support ticket diagnostic access governance, temporary location grants (`DEC-005`), emergency rescue incident lifecycles (`DEC-006`), responder dispatch boundaries, command safety subordination, and multi-tenant data isolation are fully specified based on approved upstream baselines (`PRODUCT_REQUIREMENTS.md` v1.0, `MODULE_SERVICE_ENTITLEMENT_SPEC.md` v1.0, `USER_ROLES_PERMISSIONS_ACCESS_SPEC.md` v1.0, `TENANT_ISOLATION_SECURITY_BOUNDARY_SPEC.md` v1.0, `CUSTOMER_TYPES_COMMERCIAL_MODEL_SPEC.md` v1.0, `TRACKING_PROVIDER_ARCHITECTURE_SPEC.md` v1.0, `DEVICE_CAPABILITY_REGISTRY_SPEC.md` v1.0, `VEHICLE_KNOWLEDGE_REGISTRY_SPEC.md` v1.0, `REGULATORY_KNOWLEDGE_SERVICE_SPEC.md` v1.0, `COMMAND_SAFETY_EXECUTION_SPEC.md` v1.0, and `FLEET_PACK_SPEC.md` v1.0). Strategic open items—including `DEC-005` and `DEC-006`—are intentional upstream decisions safely accommodated by the configurable architecture.

---

## 41. SPECIFICATION VERDICT

> # **SALES, SUPPORT & RESCUE APPROVED — AUTHORITATIVE BASELINE**

This authoritative downstream specification strictly adheres to approved Product Requirements Document v1.0 (`abef605`), Module & Service Entitlement Specification v1.0 (`a962a2a`), User Roles, Permissions, Authority & Access Specification v1.0 (`25e7834`), Tenant Isolation & Security Boundary Specification v1.0 (`93d7a4e`), Customer Types & Commercial Model Specification v1.0 (`4014141`), Tracking Provider Architecture Specification v1.0 (`88bcd53`), Device Capability Registry Specification v1.0 (`5c9fe52`), Vehicle Knowledge Registry Specification v1.0 (`0e60ce3`), Regulatory Knowledge Service Specification v1.0 (`d26153b`), Command Safety & Execution Specification v1.0 (`ebccd29`), and Fleet Pack Specification v1.0 (`220ac0d`), establishes the complete architectural and operational framework for sales operations, channel reseller boundaries, customer onboarding handoffs, technical support operating models, support managed modes, ticket-scoped diagnostic access governance, emergency rescue operations, incident-scoped location tracking, responder dispatch boundaries, command safety subordination, multi-tenant data isolation, and AI/regulatory guardrails, preserves all upstream safety, IAM, tenant, provider, and commercial invariants, and stands formally approved as an authoritative downstream specification.
