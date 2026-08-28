# Tenant Isolation & Security Boundary Specification

**Status:** APPROVED  
**Version:** 1.0  
**Approved Date:** 2026-08-28  
**Product:** Vehicle Tracking Standalone Launch  
**Product Name:** TBD  
**Temporary Working Name:** EasyTracker  
**Authoritative Upstream:** `docs/03_specs/PRODUCT_REQUIREMENTS.md` v1.0 (Commit `abef605`), `docs/03_specs/MODULE_SERVICE_ENTITLEMENT_SPEC.md` v1.0 (Commit `a962a2a`), `docs/03_specs/USER_ROLES_PERMISSIONS_ACCESS_SPEC.md` v1.0 (Commit `25e7834`)  
**Upstream Commits:** `abef605`, `a962a2a`, `25e7834`  
**Approval Basis:** Independent senior review completed, focused corrections applied, and focused final re-review passed with zero blocking findings.  
**Authority Status:** APPROVED DOWNSTREAM SPECIFICATION  
**Purpose:** Define authoritative logical Tenant isolation, cross-tenant operational access, machine-actor, provider-ingestion and sensitive-data security boundaries without prescribing database, API or infrastructure implementation.

---

## 1. DOCUMENT CONTROL

| Property | Specification |
| :--- | :--- |
| **Document Title** | Tenant Isolation & Security Boundary Specification |
| **Document Identifier** | `docs/03_specs/TENANT_ISOLATION_SECURITY_BOUNDARY_SPEC.md` |
| **Version** | `1.0` |
| **Status** | APPROVED |
| **Approved Date** | `2026-08-28` |
| **Product Brand** | TBD (Temporary Working Name: EasyTracker) |
| **Project Context** | Standalone Vehicle Tracking Launch (with future Agency SaaS vertical alignment) |
| **Active Development Branch** | `vehicle-tracking-launch-v1` |
| **Authoritative Upstream PRD** | `docs/03_specs/PRODUCT_REQUIREMENTS.md` v1.0 (Commit `abef605`) |
| **Authoritative Entitlement Spec** | `docs/03_specs/MODULE_SERVICE_ENTITLEMENT_SPEC.md` v1.0 (Commit `a962a2a`) |
| **Authoritative Roles & Access Spec**| `docs/03_specs/USER_ROLES_PERMISSIONS_ACCESS_SPEC.md` v1.0 (Commit `25e7834`) |
| **Upstream Commits** | `abef605`, `a962a2a`, `25e7834` |
| **Approval Basis** | Independent senior review completed, focused corrections applied, and focused final re-review passed with zero blocking findings. |
| **Authority Status** | APPROVED DOWNSTREAM SPECIFICATION |
| **Authority Precedence Index** | `docs/DOCUMENT_AUTHORITY_INDEX.md` |

---

## 2. PURPOSE

- **TISB-GEN-001 (Purpose Statement):** This specification establishes the authoritative logical security boundaries governing all data, actors, telematics ingestion, commands, media assets, background jobs, external integrations, and cross-tenant workflows across the Vehicle Tracking SaaS platform.

---

## 3. SCOPE

- **TISB-GEN-002 (In-Scope Boundary Dimensions):** This specification defines:
  - Logical Tenant ownership, resource association, and historical provenance models.
  - Active tenant context resolution and server-authoritative fail-closed context enforcement.
  - Cross-tenant platform operational boundaries (Support, Rescue, Technical Support, Platform Admin).
  - Machine and service actor trust boundaries.
  - Tracking Provider multi-tenant ingestion, mapping, and credential protection.
  - Telemetry, command, alert, geofence, and media security perimeters.
  - Asynchronous background job, event stream, scheduled task, and notification isolation.
  - Demo, real-device trial tenant, and white-label isolation perimeters.
  - External AI, regulatory knowledge, and government integration trust boundaries.
  - Shared platform master data classification and 4 comprehensive boundary matrices.

---

## 4. OUT OF SCOPE

- **TISB-GEN-003 (Explicit Exclusions):** This specification SHALL NOT define:
  - Concrete database schemas, SQL DDL, tables, or database column types.
  - Specific database Row-Level Security (RLS) policies or vendor-specific SQL functions.
  - Low-level REST API endpoints, HTTP header syntax, or JWT/OIDC token claims.
  - Physical network topologies, VPC peering, firewall configurations, or Kubernetes manifests.
  - Specific secret vault software, caching technology, or message broker systems.
  - Commercial retail pricing or package billing calculations.

---

## 5. AUTHORITY & SOURCE BASIS

- **TISB-GEN-004 (Governing Precedence):** In accordance with `docs/DOCUMENT_AUTHORITY_INDEX.md`, this specification adheres strictly to:
  1. Approved `docs/03_specs/PRODUCT_REQUIREMENTS.md` v1.0 (Commit `abef605`).
  2. Approved `docs/03_specs/MODULE_SERVICE_ENTITLEMENT_SPEC.md` v1.0 (Commit `a962a2a`).
  3. Approved `docs/03_specs/USER_ROLES_PERMISSIONS_ACCESS_SPEC.md` v1.0 (Commit `25e7834`).
  4. Approved Reconciliation Audit v1.0 (`docs/02_audit/VEHICLE_TRACKING_REQUIREMENT_RECONCILIATION_AUDIT_V0_1.md`).
  5. Working Requirements Baseline V0.4 (`docs/01_working_requirements/`).
  6. Legacy authority documents (`PRODUCT_MASTER_INSTRUCTION.md`, `PRODUCT_REQUIREMENTS_DOCUMENT.md`).
  7. Existing code (strictly as implementation evidence, never authority).

---

## 6. DEFINITIONS

- **Tenant:** The primary organizational and logical security boundary in the multi-tenant SaaS platform.
- **Tenant Boundary:** The logical perimeter enclosing all configurations, devices, users, operational workflows, and data belonging to a tenant.
- **Customer Account:** A commercial/business account unit within a Tenant (does not constitute an independent SaaS tenant).
- **Active Tenant Context:** The validated, server-authoritative tenant identity under which an authenticated request or machine job executes.
- **Resource Ownership & Association:** The authoritative logical relationship linking a resource to its owning Tenant or assigned operational entity.
- **Historical Provenance:** The immutable audit and telemetry context originating from a specific device/vehicle/tenant at the time of event generation.
- **Cross-Tenant Access:** An operation bridging multiple tenants, permitted strictly under explicit platform governance workflows.
- **Trust Boundary:** A perimeter across which external data, webhooks, or commands must be authenticated, mapped, and validated.

---

## 7. SECURITY BOUNDARY MODEL

- **TISB-TEN-001 (Core Boundary Predicate & Upstream Model Harmony):** No resource, telemetry record, command, or media object may become visible, mutable, executable, or exportable merely because its identifier is known. Every access request MUST satisfy the core security-boundary predicate:
  $$\text{Boundary Permitted} = \text{Authenticated Actor} \land \text{Valid Membership} \land \text{Active Context Match} \land \text{Authoritative Resource Association} \land \text{Entitlement} \land \text{Permission} \land \text{Scope}$$
  
  > [!IMPORTANT]
  > **THIS BOUNDARY PREDICATE DOES NOT REPLACE THE COMPLETE FEATURE-AVAILABILITY OR COMMAND-AUTHORIZATION FORMULAS.**  
  > In accordance with `MSE-ENT-001` and `URPA-AUTH-001`, product feature availability remains strictly governed by the approved 6-layer formula:
  > $$\text{Feature Available} = \text{Platform Capability} \land \text{Tenant Entitlement} \land \text{Customer Subscription} \land \text{User Permission / Scope} \land \text{Device Capability} \land \text{Safety Policy}$$
  > Applicable Customer Subscription, Device Capability, Purpose/Temporary Grant, Safety Policy, confirmation, and step-up authentication where required by policy remain mandatory upstream gates.

---

## 8. TENANT DEFINITION

- **TISB-TEN-002 (Organizational Hierarchy):** The SaaS platform strictly enforces the logical hierarchy:
  $$\text{Platform} \longrightarrow \text{Tenant} \longrightarrow \text{Company / Business} \longrightarrow \text{Customer Account} \longrightarrow \text{Fleet / Fleet Group} \longrightarrow \text{Vehicle / Device}$$
  A Customer Account inside a B2B Tenant operates within that tenant's perimeter and is never confused with a SaaS tenant.

---

## 9. RESOURCE OWNERSHIP / ASSOCIATION

- **TISB-TEN-003 (Authoritative Resource Binding & Classification):** Every protected platform resource MUST retain sufficient authoritative ownership, association, provenance, and security context to determine permitted access and action:
  - For **Tenant-bound resources** (vehicles, devices, fleet structures, geofences, alerts, work orders), current Tenant association MUST be server-authoritative.
  - For **Historical records** (telemetry history, audit trails, event logs), historical provenance MUST remain preserved.
  - For **Shared/Platform resources** (`PLATFORM_SHARED_REFERENCE`, `PLATFORM_CONFIDENTIAL`), data classification defines the boundary without requiring an arbitrary parent tenant.

---

## 10. ACTIVE TENANT CONTEXT

- **TISB-CTX-001 (Server-Authoritative Context Resolution):** For every tenant-scoped operation, the active Tenant context MUST be resolved server-side from validated actor membership. Client-supplied tenant identifiers are treated strictly as unverified input until verified against the actor's active membership.

---

## 11. MULTI-TENANT MEMBERSHIP

- **TISB-ACT-001 (Context Isolation for Multi-Tenant Users):** When a human actor holds legitimate memberships across multiple tenants, each membership operates in complete isolation. Switching tenant context MUST establish a clean authorization state; **authority from Tenant A SHALL NEVER union into Tenant B** (`URPA-ROLE-021`).

---

## 12. IDENTIFIER SECURITY

- **TISB-SEC-001 (Knowledge != Access):** Possession or knowledge of resource identifiers (UUID, IMEI, Plate Number, Ticket ID, SIM ICCID, File URL) SHALL NEVER bypass tenant boundary validation (`URPA-SEC-007`).

---

## 13. NON-DISCLOSURE / FAIL-CLOSED

- **TISB-CTX-002 (Fail-Closed Non-Disclosure):** Any request referencing a resource outside the actor's active Tenant context MUST fail closed and disclose zero metadata, returning a non-disclosing denial response (`PRD-ISO-002`).

---

## 14. PLATFORM OWNER / ADMIN BOUNDARY

- **TISB-PLT-001 (Platform Role Boundaries):** Platform Owner and Platform Admin roles govern global SaaS infrastructure and tenant lifecycle. **Platform roles SHALL NOT possess universal, unrestricted access to customer telemetry or live maps by default** (`URPA-ROLE-002`, `URPA-ADM-001`).

---

## 15. CROSS-TENANT PLATFORM OPERATIONS

- **TISB-PLT-002 (Authorized Cross-Tenant Workflows):** Cross-tenant platform operations are permitted strictly within structured, audited workflows:
  1. *Tenant Provisioning & Entitlement Granting* (Platform-reserved).
  2. *Tracking Provider Gateway Maintenance* (Platform-reserved).
  3. *Global Device Knowledge Verification* (`devices.registry.verify`).
  4. *Regulatory Rule Administration* (`platform.regulatory.approve`).
  5. *Escalated Support Troubleshooting* (Subject to ticket-scoped temporary grant).
  6. *Emergency Rescue Coordination* (Subject to active incident assignment).

---

## 16. SUPPORT BOUNDARY

- **TISB-SUP-001 (Diagnostic Default & Temporary Grant Boundary):** Support agents default strictly to technical diagnostics (battery voltage, GSM signal, packet timestamps). Live location access requires:
  - Active support ticket.
  - Verified diagnostic purpose.
  - Explicit authorization through the configured workflow under applicable consent/legal basis (`DEC-005`).
  - Time-limited grant with automatic revocation upon expiration (`MSE-SUP-002`, `URPA-SUP-001`).

---

## 17. TECHNICIAN BOUNDARY

- **TISB-TECH-001 (Work-Order Bounded Perimeter):** Field installers and service technicians receive diagnostic telemetry access strictly within the scope of assigned `WORK_ORDER_SCOPE`. Access terminates automatically upon work order completion (`URPA-TECH-001`).

---

## 18. RESCUE BOUNDARY

- **TISB-RSC-001 (Emergency Incident Boundary):** Rescue dispatchers and response members receive vehicle tracking access strictly within the scope of an assigned `RESCUE_INCIDENT_SCOPE`. Access is **automatically and promptly revoked upon incident closure** (`MSE-RSC-002`, `DEC-006`, `URPA-RSC-001`).

---

## 19. SALES / CUSTOMER SERVICE

- **TISB-ACT-002 (No Default Sensitive Tracking Access):** Sales and Customer Service roles have **NO DEFAULT SENSITIVE TRACKING ACCESS**. Commercial relationships, order intake, or customer inquiries grant zero automatic visibility into live vehicle locations or historical trip routes (`PRD-SLS-002`, `URPA-ROLE-007`).

---

## 20. CUSTOMER / VEHICLE OWNER

- **TISB-ACT-003 (Vehicle Ownership vs Subscription):** Customer account authority derives from authoritative vehicle ownership, assignment, or approved delegation. Owning Vehicle A grants zero authority over Vehicle B (`URPA-ROLE-015`). Customer Subscription determines available commercial features inside that authorized boundary without redefining ownership.

---

## 21. FLEET / DRIVER

- **TISB-ACT-004 (Fleet & Driver Scoping):** Fleet Managers operate strictly within assigned `FLEET` or `FLEET_GROUP` perimeters. Drivers operate strictly within assigned `VEHICLE_SCOPE`, assigned Route, Trip, or operational assignment (`URPA-ROLE-006`, `URPA-ROLE-016`).

---

## 22. PUBLIC TRANSPORT

- **TISB-ACT-005 (Transit Station & Trip Boundaries):** Counter Incharge authority is bounded strictly to assigned `TRANSIT_STATION_SCOPE` and routes. Onboard Supervisors operate strictly within assigned `TRANSIT_TRIP_SCOPE` (`URPA-ROLE-017`, `URPA-ROLE-018`).

---

## 23. DEALER / CHANNEL

- **TISB-ACT-006 (Dealer Boundary):** Dealer and channel partners operate strictly within assigned dealer branch inventory and referred customer accounts without tenant crossover (`URPA-ROLE-014`).

---

## 24. CUSTOM ROLE / DIRECT GRANT

- **TISB-ACT-007 (Tenant Boundary Ceiling on Delegation):** Custom tenant roles and direct grants cannot bypass tenant boundaries, grant un-entitled features, or delegate platform-reserved permissions (`URPA-ROLE-019`, `URPA-ROLE-022`).

---

## 25. MACHINE / SERVICE ACTORS

- **TISB-ACT-008 (Machine Actor Authority):** Automated background services (telemetry ingestion, alert processors, billing meters) MUST operate under explicit, authenticated machine identity and least-privilege authority bounded to specific tenant processing tasks (`URPA-SYS-001`).

---

## 26. TRACKING PROVIDER INGESTION

- **TISB-PRV-001 (Ingestion Mapping Trust Boundary):** Ingested telematics packets arriving from Tracking Providers (such as Traccar or licensed provider gateways) MUST be authoritatively mapped from external provider device identities to internal Device, Tenant, and Vehicle associations before entering customer visibility pipelines. Unmapped or ambiguous packets fail closed (`MSE-TRK-001`, `URPA-PRV-002`).

---

## 27. MULTI-PROVIDER BOUNDARY

- **TISB-PRV-002 (Multi-Provider Coexistence):** Multiple Tracking Providers may operate within a single Tenant across different fleets or device models. Multi-provider routing SHALL NEVER weaken tenant or device isolation (`MSE-PRV-001`).

---

## 28. PROVIDER CREDENTIALS

- **TISB-PRV-003 (Provider Secret Protection):** Tracking provider master tokens, webhook signing secrets, and cluster credentials are privileged server assets and **SHALL NEVER be exposed to customer-facing clients** (`MSE-PRV-002`, `URPA-PRV-001`).

---

## 29. PROVIDER DEGRADED STATE

- **TISB-PRV-004 (Isolation During Outage):** Provider connectivity failures or third-party outages SHALL NOT alter tenant authorization, expand data access, or trigger fallback to public demo states (`MSE-FMC-001`, `URPA-DEP-001`).

---

## 30. TELEMETRY BOUNDARY

- **TISB-TEL-001 (Authoritative Telemetry Provenance):** Raw, normalized, and cached telemetry points MUST maintain immutable association to their historical provenance (generating Tenant, Device, and Vehicle).

---

## 31. HIGH-VOLUME TELEMETRY PRINCIPLE

- **TISB-TEL-002 (Logical Isolation at Scale):** High-volume telematics pipelines MUST logically enforce tenant and vehicle boundaries regardless of downstream data ingestion rates or future platform scale.

---

## 32. COMMAND BOUNDARY

- **TISB-CMD-001 (Command Targeting Security & Safety Gates):** Downlink device commands (engine disable, restore, reboot) MUST validate the complete authoritative chain in accordance with `MSE-CMD-001` and `URPA-CMD-001`:
  $$\text{Actor} \land \text{Active Context} \land \text{Vehicle Ownership} \land \text{Entitlement} \land \text{Permission} \land \text{Verified Device Capability} \land \text{Safety Policy} \land \text{Step-Up Auth} \land \text{Confirmation}$$
  Target device IMEI knowledge alone SHALL NEVER authorize command execution. Zero fixed speed thresholds exist.

---

## 33. COMMAND RESULT BOUNDARY

- **TISB-CMD-002 (Command Result Isolation):** Command acknowledgements, delivery statuses, and execution error logs are strictly isolated to the requesting tenant and authorized vehicle scope.

---

## 34. ALERT / EVENT BOUNDARY

- **TISB-EVT-001 (Alert Perimeter):** Real-time alerts (geofence breaches, SOS triggers, overspeed events) inherit the tenant and scope boundaries of the triggering vehicle.

---

## 35. GEOFENCE BOUNDARY

- **TISB-TEN-004 (Geofence Perimeter):** Geofences, virtual boundaries, and landmark coordinates are strictly private to the creating Tenant and authorized fleet scope. Shared map coordinates do not grant cross-tenant read access.

---

## 36. VOICE / VIDEO / MEDIA

- **TISB-MED-001 (Sensitive Media Perimeter):** Dashcam video streams, historical playback clips, audio recordings, and two-way intercom sessions are private tenant assets requiring explicit permissions (`URPA-MED-001`, `URPA-MED-002`) and device capability verification.

---

## 37. MEDIA OBJECT ASSOCIATION

- **TISB-MED-002 (Immutable Media Provenance):** Media files, incident recordings, and evidence snapshots MUST maintain immutable association to their historical provenance (Tenant, Vehicle, and Incident). Media URLs or object identifiers alone grant zero access.

---

## 38. MEDIA EXPORT

- **TISB-MED-003 (Controlled Evidence Export):** Exporting cryptographic evidence clips requires explicit `media.evidence.export` permission, mandatory purpose logging, and audit tracking. Technical cryptographic seals do NOT automatically establish legal court admissibility (`URPA-MED-002`).

---

## 39. FILE / OBJECT BOUNDARY

- **TISB-FILE-001 (Object Storage Isolation):** Customer documents, installation photos, inspection logs, and warranty certificates must be accessed through server-authoritative context verification. Possession of a direct link or storage key grants zero access.

---

## 40. SEARCH

- **TISB-REP-001 (Search Perimeter):** Global search bars, autocomplete inputs, and keyword lookups MUST filter results by active tenant context and authorized scope, revealing zero cross-tenant suggestions or record counts (`URPA-SEC-006`).

---

## 41. DASHBOARD

- **TISB-REP-002 (Aggregations Isolation):** Operational dashboards, fleet metrics, and status charts MUST aggregate data strictly from resources within the actor's authorized tenant and scope.

---

## 42. REPORT

- **TISB-REP-003 (Report Authorization Parity):** Scheduled and on-demand reports inherit the exact authorization and scope filters of underlying telemetry data (`URPA-REP-001`).

---

## 43. EXPORT

- **TISB-REP-004 (Bulk Export Boundary):** Bulk telemetry downloads, trip sheets, and customer roster exports execute within the actor's authorized scope and cannot broaden resource boundaries (`URPA-EXP-001`).

---

## 44. ASYNCHRONOUS JOBS

- **TISB-JOB-001 (Asynchronous Context Propagation):** Background workers (report generators, billing aggregators, alert evaluators) MUST execute within explicitly preserved authoritative tenant context rather than generic un-scoped worker privileges.

---

## 45. EVENTS / MESSAGES

- **TISB-JOB-002 (Event Message Context Binding):** Internal event messages MUST encapsulate authoritative tenant and resource context metadata. Event consumers MUST validate context before mutating protected state.

---

## 46. SCHEDULED TASKS

- **TISB-JOB-003 (Tenant-Iterating Task Isolation):** Scheduled maintenance tasks that iterate across multiple tenants MUST partition processing into distinct, isolated per-tenant execution contexts.

---

## 47. NOTIFICATIONS

- **TISB-EVT-002 (Notification Delivery Perimeter):** Push notifications, SMS alerts, and email dispatches MUST be routed strictly to recipients authorized to receive data for the specific triggering vehicle and tenant.

---

## 48. AUDIT

- **TISB-AUD-001 (Audit Trail Scoping):** Tenant audit logs are viewable strictly by authorized tenant administrators (`audit.log.view`). Audit records are immutable, append-only, and strictly isolated per tenant (`URPA-AUD-001`).

---

## 49. BILLING / METERING

- **TISB-SEC-002 (Metering Isolation):** Telematics message counts, device usage meters, and billing records belonging to Tenant A MUST NEVER be accessible or aggregated into Tenant B.

---

## 50. ENTITLEMENT

- **TISB-TEN-005 (Entitlement Boundary):** Commercial module entitlements granted to Tenant A operate strictly within Tenant A and cannot activate features for Tenant B (`MSE-ENT-001`).

---

## 51. TENANT SUSPENSION

- **TISB-TEN-006 (Suspended Tenant Fail-Closed):** When a Tenant is suspended, all operational data access, command execution, and live telemetry streaming MUST fail closed. Historical records remain preserved for statutory retention (`PRD-RET-001`).

---

## 52. USER SUSPENSION

- **TISB-ACT-009 (Suspended User Lockdown):** Suspended user accounts fail closed across all API and operational requests (`URPA-USER-001`).

---

## 53. TEMPORARY ACCESS GRANTS

- **TISB-CTX-003 (Scoped Grant Perimeter):** Temporary access grants (Support, Rescue, Technician) are strictly bound to Tenant, resource, and purpose. A grant for Vehicle A under Ticket X grants zero authority over Vehicle B (`URPA-SUP-001`).

---

## 54. REVOCATION

- **TISB-CTX-004 (Prompt Revocation Propagation):** Revocation of user memberships, roles, permissions, or temporary grants MUST propagate promptly and reliably across active sessions according to authoritative revocation policy (exact measurable target: TBD / downstream measurable NFR) (`MSE-NFR-004`, `URPA-SEC-004`).

---

## 55. CLIENT / OFFLINE

- **TISB-SEC-003 (Client Cache Non-Authority):** Web and mobile client caches are non-authoritative. Offline client state SHALL NEVER authorize high-risk commands or bypass expired permissions (`URPA-SEC-005`).

---

## 56. CACHE PRINCIPLE

- **TISB-SEC-004 (Server Cache Tenant Partitioning):** Server-side caching layers MUST partition keys by Tenant context and invalidate promptly upon permission or entitlement revocation.

---

## 57. DEMO / PRODUCTION

- **TISB-DMO-001 (Demo Sandbox Boundary):** Public Demo and Controlled Device Demo environments operate in strictly isolated sandboxes with synthetic data; demo tokens CANNOT query production protected data or issue real device commands (`PRD-DMO-002`, `URPA-DMO-001`).

---

## 58. TRIAL TENANT

- **TISB-DMO-002 (Trial Tenant Full Isolation):** Real-Device Trial Tenants operate under full, standard multi-tenant security boundaries with zero security exceptions (`MSE-DMO-001`).

---

## 59. WHITE-LABEL

- **TISB-DMO-003 (White-Label Perimeter):** Custom branding, themes, domain aliases, support identities, and notifications apply without creating independent security forks or code branches (`PRD-WHT-001`, `URPA-WHT-001`).

---

## 60. DOMAIN / HOSTNAME

- **TISB-DMO-004 (Domain Context Resolution):** Hostnames or subdomains assist in identifying candidate tenant context but do not substitute for server-authoritative authentication and permission validation.

---

## 61. AI SECURITY BOUNDARY

- **TISB-AI-001 (AI Boundary Isolation):** External AI Orchestrators operate strictly within the tenant context of the authorized requesting user. AI models CANNOT bridge tenant boundaries or elevate privileges (`PRD-AI-004`, `URPA-AI-001`).

---

## 62. AI SENSITIVE DATA

- **TISB-AI-002 (AI Data Protection Perimeter):** Customer PII, raw coordinates, private cabin audio, and provider secrets SHALL NOT be transmitted to unapproved external AI services (`DEC-014`).

---

## 63. REGULATORY KNOWLEDGE

- **TISB-REG-001 (Regulatory Knowledge Perimeter):** Only verified, officially published regulatory reference content is classified as `PLATFORM_SHARED_REFERENCE`. Candidate, AI-extracted, or draft regulatory records remain restricted internal assets until approved via `platform.regulatory.approve` (`PRD-REG-002`, `URPA-REG-001`).

---

## 64. GOVERNMENT / EXTERNAL INTEGRATIONS

- **TISB-INT-001 (External Integration Boundary):** Government integrations (BRTA, BTRC, 999 Police) operate through verified gateways requiring `platform.integration.activate`, verified operational state, and regulatory approval. Commercial entitlement does not make an integration active (`MSE-ITG-001`, `URPA-INT-001`).

---

## 65. WEBHOOK / CALLBACK TRUST

- **TISB-INT-002 (External Webhook Trust Boundary):** Inbound webhooks from payment gateways or tracking providers are untrusted external inputs requiring source verification and authoritative tenant mapping before mutating state.

---

## 66. IMPORT / BULK OPERATIONS

- **TISB-SEC-005 (Bulk Operation Boundaries):** Bulk device uploads, customer roster imports, and fleet reassignments MUST validate that 100% of affected records belong strictly to the target Tenant.

---

## 67. RESOURCE REASSIGNMENT

- **TISB-SEC-006 (Controlled Resource Transfer & Provenance):** Reassigning a vehicle or device between fleets or accounts requires explicit administrative authority, updates current operational associations, and preserves historical provenance without data bleed.

---

## 68. DEVICE REPLACEMENT

- **TISB-SEC-007 (Device Replacement Boundary):** Replacing a tracker hardware unit transfers current tracking identity while preserving historical telemetry associations and preventing credential leakage.

---

## 69. TENANT OFFBOARDING

- **TISB-PRVY-001 (Offboarding Perimeter):** Terminated tenant operational access MUST be revoked promptly and reliably according to authoritative offboarding policy, while data enters the statutory retention and eventual purge lifecycle (`PRD-RET-001`, `URPA-USER-005`).

---

## 70. DATA PORTABILITY

- **TISB-PRVY-002 (Portability Export Boundary):** Authorized data portability exports extract data strictly belonging to the requesting customer account without exposing shared platform infrastructure metadata.

---

## 71. SHARED PLATFORM MASTER DATA

- **TISB-TEN-007 (Shared Reference Knowledge):** Global reference catalogues (Device Knowledge Registry, Vehicle Seed Models, Approved Regulatory Circulars) are classified as `PLATFORM_SHARED_REFERENCE` and accessible read-only across tenants without exposing tenant-specific telemetry.

---

## 72. GLOBAL VS TENANT DATA CLASSIFICATION

- **TISB-TEN-008 (Data Classification Schema):** Platform data is categorized into 6 logical security tiers:
  1. `PLATFORM_SHARED_REFERENCE` (Device/Vehicle catalogues, published approved circulars).
  2. `PLATFORM_CONFIDENTIAL` (Provider master tokens, platform secrets, unverified draft regulations).
  3. `TENANT_OPERATIONAL` (Fleet structures, geofences, user rosters).
  4. `TENANT_SENSITIVE` (Live coordinates, historical route dumps, billing usage).
  5. `CUSTOMER_SENSITIVE` (Customer PII, private cabin audio, dashcam video).
  6. `TEMPORARY_INCIDENT_ACCESS` (Active Support tickets, Rescue emergency dispatches).

---

## 73. PROVIDER-SHARED DATA

- **TISB-PRV-005 (Provider Technical Metadata):** Provider protocol definitions and firmware specifications are platform-managed reference data, whereas device-specific telemetry is strictly tenant-scoped.

---

## 74. SECURITY BOUNDARY MATRIX

| Resource Class | Primary Boundary | Typical Authorized Scope | Sensitive? | Cross-Tenant Platform Access? | Additional Security Conditions | Audit Required? |
| :--- | :--- | :--- | :---: | :---: | :--- | :---: |
| **Tenant Configuration** | Tenant | `TENANT_SCOPE` | NO | Platform Provisioning Only | Platform Admin permission | YES |
| **User Membership** | Tenant | `TENANT_SCOPE` | NO | NO | Valid Tenant Context | YES |
| **Customer Account** | Tenant | `CUSTOMER_ACCOUNT` | YES | NO | Active Membership Match | YES |
| **Fleet / Fleet Group** | Tenant | `FLEET` / `FLEET_GROUP` | NO | NO | Assigned Fleet Scope | YES |
| **Vehicle / Device** | Tenant | `VEHICLE_SCOPE` / `DEVICE` | NO | Diagnostic Support Only | Registry Match | YES |
| **Live Telemetry** | Tenant | `VEHICLE_SCOPE` | **YES** | Temporary Support / Rescue | Active Ticket / Incident | **YES** |
| **Location History** | Tenant | `VEHICLE_SCOPE` | **YES** | NO | Subscription + Permission | **YES** |
| **Downlink Commands** | Tenant | `DEVICE_SCOPE` | **YES** | NO | Verified Relay + Safe-State | **YES** |
| **Cabin Audio / Voice** | Tenant | `VEHICLE_SCOPE` | **YES** | NO | Microphone Cap + Consent | **YES** |
| **Dashcam Video Stream**| Tenant | `VEHICLE_SCOPE` | **YES** | NO | Camera Cap + Bandwidth | **YES** |
| **Cryptographic Evidence**|Tenant| `VEHICLE_SCOPE` | **YES** | NO | Export Permission + Chain | **YES** |
| **Provider Master Vault**| Platform | `GLOBAL_PLATFORM` | **YES** | Platform Reserved | Platform Admin Vault Rule | **YES** |
| **Integration Gateway** | Platform | `GLOBAL_PLATFORM` | **YES** | Platform Reserved | `platform.integration.activate` | **YES** |
| **Shared Device Registry**| Platform | `PLATFORM_SHARED_REF` | NO | Shared Read-Only | Technical Verification | YES |

*(Note: Table groups standard operational entities into 14 primary resource perimeters; every individual resource strictly inherits its category's security rules).*

---

## 75. ACTOR-BOUNDARY MATRIX

| Actor Family / Persona | Default Security Boundary | Cross-Tenant Access Allowed? | Temporary Grant / Purpose Required? | Sensitive Data Constraints |
| :--- | :--- | :---: | :---: | :--- |
| **Platform Owner** | `GLOBAL_PLATFORM` | YES (Governance only) | Purpose-logged where sensitive | Bound by command safety & privacy rules. |
| **Platform Admin** | `GLOBAL_PLATFORM` | YES (Assigned operations) | Purpose-logged where sensitive | Zero default live location access. |
| **Tenant Admin** | `TENANT_SCOPE` | **NO** | NO | Confined strictly to own tenant. |
| **Company Manager** | `COMPANY_SCOPE` | **NO** | NO | Confined to company organization. |
| **Fleet Manager** | `FLEET_GROUP` / `VEHICLE` | **NO** | NO | Confined to assigned fleets. |
| **Sales Agent** | `ORDER_SERVICE_REQUEST` | **NO** | NO | **No default sensitive tracking access.** |
| **Customer Service** | `CUSTOMER_ACCOUNT` | **NO** | NO | **No default sensitive tracking access.** |
| **Support Agent** | `DEVICE_SCOPE` (Diagnostics)| YES (Diagnostic only) | **YES (Ticket + Grant for Location)** | Diagnostics default; time-limited location. |
| **Technical Support** | `DEVICE_SCOPE` (Diagnostics)| YES (Diagnostic only) | **YES (Ticket + Grant for Location)** | Diagnostics default; advanced telemetry. |
| **Technician Installer**| `WORK_ORDER_SCOPE` | **NO** | **YES (Active Work Order)** | Time-bounded to active service job. |
| **Rescue Dispatcher** | `RESCUE_INCIDENT_SCOPE` | YES (Emergency only) | **YES (Active Incident Assign)** | Prompt auto-revocation on closure. |
| **Rescue Member** | `RESCUE_INCIDENT_SCOPE` | YES (Emergency only) | **YES (Active Incident Assign)** | Prompt auto-revocation on closure. |
| **Dealer Channel** | `DEALER_BRANCH_SCOPE` | **NO** | NO | Confined to assigned dealer branch. |
| **Customer Owner** | `CUSTOMER_ACCOUNT` | **NO** | NO | Confined to owned/delegated vehicles. |
| **Driver** | `VEHICLE_SCOPE` / `TRIP` | **NO** | NO | Confined to assigned vehicle/trip. |
| **Counter Incharge** | `TRANSIT_STATION_SCOPE` | **NO** | NO | Confined to assigned counter/route. |
| **Onboard Supervisor** | `TRANSIT_TRIP_SCOPE` | **NO** | NO | Confined to assigned transit vehicle/trip. |
| **Service Machine Actor**| Explicit Job Scope | YES (Multi-tenant pipeline) | Authenticated Machine Identity | Operates under explicit machine identity. |
| **AI Orchestrator** | Requesting User Scope | **NO** | In-Context Request Only | Zero customer PII or raw coordinates. |

*(Note: Explicitly represents all 17 standard operational role personas plus machine and AI actors).*

---

## 76. CROSS-TENANT ACCESS MATRIX

| Cross-Tenant Access Scenario | Classification | Authorization Condition & Governing Boundary |
| :--- | :--- | :--- |
| **Tenant User $\longrightarrow$ Other Tenant** | **NOT ALLOWED** | Absolute fail-closed denial with zero disclosure. |
| **Platform Admin $\longrightarrow$ Tenant Operations** | **PLATFORM WORKFLOW ONLY** | Requires explicit platform permission + audit logging. |
| **Support Agent $\longrightarrow$ Live Vehicle Location**| **TEMPORARY AUTHORIZED** | Active Support Ticket $\land$ Configured Authorization $\land$ Time-Limited Grant (`DEC-005`). |
| **Rescue Member $\longrightarrow$ Emergency Location** | **INCIDENT ASSIGNMENT ONLY** | Active Emergency Incident $\land$ Assigned Team $\land$ Prompt Revocation on Closure (`DEC-006`). |
| **Machine Actor $\longrightarrow$ Provider Ingest Pipeline**| **MACHINE PIPELINE ONLY** | Validated Mapping from Provider ID to Internal Device, Tenant, and Vehicle. |
| **All Tenants $\longrightarrow$ Shared Device Registry** | **SHARED REFERENCE DATA** | Read-only access to verified hardware capabilities (`PLATFORM_SHARED_REFERENCE`). |

---

## 77. DATA-FLOW BOUNDARY MATRIX

```
[ GPS Tracker Hardware ]
       │ (Encrypted Cellular Telemetry)
       ▼
[ Tracking Provider Gateway (Licensed Gateway / Protocol Ingestion) ]
       │ (Raw Provider Packets / Webhooks)
   ────┼──────────────────────────────────────────────────────── Trust Boundary 1
       ▼
[ Platform Ingestion & Association Pipeline ]
       │ ──► Validate Provider Credentials & Parse Protocol
       │ ──► Authoritative Mapping: (Provider Device ID) ──► (Internal Device, Tenant, Vehicle)
   ────┼──────────────────────────────────────────────────────── Trust Boundary 2
       ▼
[ Tenant-Isolated Telematics & Event Engine ]
       │ ──► Enforce Entitlements, Geofences & Alerts
       │ ──► Authoritative State Persistence (Tenant Context Stamped)
   ────┼──────────────────────────────────────────────────────── Trust Boundary 3
       ▼
[ Server-Authoritative Authorization Engine ]
       │ ──► Validate Actor, Membership, Context, Permission, Scope & Safety Policy
   ────┼──────────────────────────────────────────────────────── Trust Boundary 4
       ▼
[ Authenticated Client Application (Web / Mobile / HUD) ]
```

---

## 78. FAIL-CLOSED BOUNDARY CONDITIONS

- **TISB-SEC-008 (Mandatory Fail-Closed Triggers):** Authorization MUST deny access and return a non-disclosing error when:
  1. Tenant context is missing, invalid, or mismatched.
  2. Resource ownership is unmapped or ambiguous.
  3. User membership is suspended, disabled, or removed.
  4. Required permission token is absent or revoked.
  5. Target resource falls outside active authorized scope.
  6. Temporary access grant is expired or revoked.
  7. Module entitlement is inactive at the tenant level.
  8. Device capability is unverified in the Device Registry.
  9. Command safety engine rejects high-risk execution.
  10. Demo token attempts production data access.

---

## 79. SECURITY EVENTS

- **TISB-AUD-002 (Boundary Violation Auditing):** Repeated cross-tenant access attempts, invalid scope executions, provider mapping anomalies, and denied sensitive export requests MUST trigger structured security audit events.

---

## 80. ADMINISTRATIVE OVERRIDES

- **TISB-SEC-009 (No Universal Bypass):** Hidden administrative bypasses, developer backdoors, or emergency overrides that bypass tenant isolation or command safety are **STRICTLY PROHIBITED** (`URPA-ADM-001`).

---

## 81. DEVELOPMENT / TEST ENVIRONMENT PRINCIPLE

- **TISB-SEC-010 (Test Environment Data Isolation):** Production tenant data SHALL NEVER be copied into development, staging, or public demo environments without cryptographic anonymization.

---

## 82. SECRETS BOUNDARY

- **TISB-SEC-011 (Privileged Secrets Perimeter):** Tracking provider tokens, integration API keys, webhook signing secrets, and database credentials remain strictly within server-side security protection.

---

## 83. SECURITY LOGGING

- **TISB-AUD-003 (Safe Audit Logging):** Security audit logs capture actor identity, tenant context, target resource, action performed, and timestamp, while strictly omitting raw passwords, provider secrets, and private media payloads.

---

## 84. PRIVACY

- **TISB-PRVY-003 (Privacy Boundary Layering):** Live GPS coordinates, cabin audio recordings, and dashcam videos require explicit purpose validation, active subscription, device capability truth, and legal consent beyond basic tenant membership.

---

## 85. RETENTION

- **TISB-PRVY-004 (Retention Lifecycle Scoping):** Data purge and statutory retention workflows operate strictly per data tier and tenant scope in accordance with approved policy (`PRD-RET-001`).

---

## 86. FUTURE MAIN-SAAS ALIGNMENT

- **TISB-GEN-005 (Ecosystem Compatibility):** The standalone Vehicle Tracking boundary architecture is fully compatible with future multi-business Agency SaaS integration, maintaining clean separation between core multi-tenant IAM and vertical domain engines.

---

## 87. NO TENANT CODE FORKS

- **TISB-GEN-006 (Zero Code Forks):** Tenant customization is achieved exclusively through configuration, branding, entitlements, and permissions on a shared codebase (`PRD-WHT-001`).

---

## 88. BOUNDARY EXPLAINABILITY

- **TISB-SEC-012 (Non-Leaking Error Guidance):** Denied cross-boundary requests return standardized, non-leaking error responses (`NOT_AUTHORIZED`, `OUT_OF_SCOPE`, `ENTITLEMENT_REQUIRED`, `POLICY_BLOCKED`).

---

## 89. NON-FUNCTIONAL REQUIREMENTS

- **TISB-NFR-001 (Boundary Evaluation Overhead):** Logical tenant context validation and scope checking SHALL add $\le 10\text{ ms}$ overhead to request processing.
- **TISB-NFR-002 (Fail-Closed Integrity):** 100% of boundary validation failures MUST fail closed with zero cross-tenant data disclosure.
- **TISB-NFR-003 (Audit Completeness):** 100% of cross-tenant platform access, temporary grants, and provider mapping modifications MUST be logged to immutable audit trails.
- **TISB-NFR-004 (Prompt Revocation Propagation):** Revocations and grant expirations MUST propagate promptly and reliably across active sessions according to authoritative policy (exact measurable target: TBD / downstream measurable NFR).

---

## 90. ACCEPTANCE CRITERIA

- **TISB-ACC-001 (Boundary Verification Acceptance):**
  1. *Identifier Guessing*: Requesting Tenant B vehicle from Tenant A context fails closed.
  2. *IMEI Querying*: Direct API queries using IMEI without authorized tenant context return zero records.
  3. *Multi-Tenant Switching*: Switching from Tenant A to Tenant B cleanly clears Tenant A permissions.
  4. *Platform Admin Boundary*: Platform Admin has zero default access to live vehicle maps without diagnostic workflow.
  5. *Support Live Location*: Support agent viewing device telemetry sees zero live coordinates without active ticket grant.
  6. *Support Auto-Expiry*: Expired support location grant immediately terminates coordinate access.
  7. *Technician Isolation*: Technician assigned to Work Order A cannot view telemetry for Vehicle B.
  8. *Rescue Prompt Revocation*: Closing a rescue incident promptly terminates tracking access for rescue members.
  9. *Sales Tracking Isolation*: Sales agent attempting to view live tracking maps receives Access Denied.
  10. *Fleet Group Scoping*: Fleet Manager assigned to Fleet North receives zero records for Fleet South.
  11. *Provider Ingestion Mapping*: Telemetry arriving with unmapped device identifiers is isolated from customer visibility.
  12. *Multi-Provider Coexistence*: Managing multiple tracking providers in one tenant causes zero device data cross-talk.
  13. *Provider Secret Protection*: Client API requests cannot retrieve tracking provider master tokens.
  14. *Command Targeting Security*: Injecting unauthorized device IMEIs into engine cut requests fails closed.
  15. *Search Bar Isolation*: Global search autocomplete reveals zero suggestions for other tenants' vehicles.
  16. *Dashboard Isolation*: Fleet dashboard counts aggregate strictly from authorized tenant vehicles.
  17. *Async Job Context*: Background report generators execute strictly within the requesting tenant's context.
  18. *Demo Sandbox Barrier*: Public demo tokens attempting production API access fail closed.
  19. *AI Privacy Barrier*: External AI models receive zero customer PII or raw tracking coordinates.
  20. *No Universal Bypass*: Special administrative headers or query flags cannot bypass tenant isolation.

---

## 91. UPSTREAM TRACEABILITY

| Specification Requirement ID | Upstream PRD ID(s) | Upstream Entitlement Spec ID(s) | Upstream Roles & Access Spec ID(s) | Primary Subject Covered |
| :--- | :--- | :--- | :--- | :--- |
| **TISB-GEN-001 to TISB-GEN-006** | `PRD-GEN-001`, `PRD-ISO-001` | `MSE-GEN-001` to `MSE-GEN-004` | `URPA-GEN-001` to `URPA-GEN-004` | Scope, Precedence & Zero Code Forks |
| **TISB-TEN-001 to TISB-TEN-008** | `PRD-ISO-001`, `PRD-ISO-002` | `MSE-TEN-001`, `MSE-TEN-002` | `URPA-TEN-001`, `URPA-TEN-002` | Tenant Ownership & Data Classification |
| **TISB-CTX-001 to TISB-CTX-004** | `PRD-AUT-001`, `PRD-AUT-002` | `MSE-ENT-001`, `MSE-ENT-002` | `URPA-AUTH-001`, `URPA-AUTH-002` | Context Resolution & Fail-Closed |
| **TISB-ACT-001 to TISB-ACT-009** | `PRD-ROL-001`, `PRD-SLS-002` | `MSE-USR-001`, `MSE-FMC-001` | `URPA-ROLE-001` to `URPA-ROLE-022` | Multi-Tenant Membership & Actor Scopes |
| **TISB-PLT-001, TISB-PLT-002** | `PRD-ROL-001` | `MSE-ADM-001` | `URPA-ROLE-002`, `URPA-ROLE-003` | Platform Cross-Tenant Operations |
| **TISB-SUP-001** | `PRD-SUP-001`, `PRD-SUP-002` | `MSE-SUP-001`, `MSE-SUP-002` | `URPA-ROLE-009`, `URPA-SUP-001` | Support Diagnostic Default & Grants |
| **TISB-RSC-001** | `PRD-RSC-001`, `PRD-RSC-002` | `MSE-RSC-001`, `MSE-RSC-002` | `URPA-ROLE-013`, `URPA-RSC-001` | Rescue Incident Scope & Revocation |
| **TISB-TECH-001** | `PRD-INS-001`, `PRD-SRV-001` | `MSE-INS-001` | `URPA-ROLE-011`, `URPA-TECH-001` | Technician Work-Order Bounded Access |
| **TISB-PRV-001 to TISB-PRV-005** | `PRD-PRV-001`, `PRD-PRV-002` | `MSE-PRV-001`, `MSE-PRV-002` | `URPA-PRV-001`, `URPA-PRV-002` | Ingestion Mapping & Secret Protection |
| **TISB-TEL-001, TISB-TEL-002** | `PRD-TRK-001`, `PRD-TRK-002` | `MSE-TRK-001` | `URPA-PERM-001` | Telemetry Provenance & Scale |
| **TISB-CMD-001, TISB-CMD-002** | `PRD-CMD-003`, `PRD-SAF-001` | `MSE-CMD-001` | `URPA-CMD-001`, `URPA-CMD-002` | Command & Result Security Perimeter |
| **TISB-MED-001 to TISB-MED-003** | `PRD-VOC-001`, `PRD-VID-001` | `MSE-VOC-001`, `MSE-VID-001` | `URPA-MED-001`, `URPA-MED-002` | Voice, Video & Evidence Boundaries |
| **TISB-FILE-001** | `PRD-SEC-001` | `MSE-SEC-001` | `URPA-PERM-001` | Object & File Storage Boundaries |
| **TISB-REP-001 to TISB-REP-004** | `PRD-REP-001`, `PRD-EXP-001` | `MSE-REP-001` | `URPA-REP-001`, `URPA-EXP-001` | Search, Dashboard, Report & Export |
| **TISB-JOB-001 to TISB-JOB-003** | `PRD-SYS-001` | `MSE-SYS-001` | `URPA-SYS-001` | Async Jobs, Events & Scheduled Tasks |
| **TISB-EVT-001, TISB-EVT-002** | `PRD-ALT-001`, `PRD-NOT-001` | `MSE-ALT-001` | `URPA-PERM-001` | Alert & Notification Boundaries |
| **TISB-INT-001, TISB-INT-002** | `PRD-REG-001`, `PRD-ITG-001` | `MSE-REG-001`, `MSE-ITG-001` | `URPA-REG-001`, `URPA-INT-001` | External Integration & Webhook Trust |
| **TISB-AI-001, TISB-AI-002** | `PRD-AI-004` | `MSE-AI-001`, `MSE-AI-002` | `URPA-AI-001` | AI Context Isolation & Privacy |
| **TISB-DMO-001 to TISB-DMO-004** | `PRD-DMO-001`, `PRD-DMO-002` | `MSE-DMO-001` | `URPA-DMO-001` | Demo, Trial & White-Label Isolation |
| **TISB-SEC-001 to TISB-SEC-012** | `PRD-SEC-003`, `PRD-AUT-002` | `MSE-SEC-001` to `MSE-SEC-003` | `URPA-SEC-001` to `URPA-SEC-007` | Core Security, Secrets & No Bypasses |
| **TISB-AUD-001 to TISB-AUD-003** | `PRD-AUD-002` | `MSE-AUD-001` | `URPA-AUD-001` to `URPA-AUD-003` | Audit Scoping & Violation Logging |
| **TISB-PRVY-001 to TISB-PRVY-004**| `PRD-RET-001`, `PRD-PRV-001` | `MSE-PRV-001` | `URPA-USER-005` | Privacy, Offboarding & Retention |
| **TISB-NFR-001 to TISB-NFR-004** | `PRD-NFR-001` to `PRD-NFR-004`| `MSE-NFR-001` to `MSE-NFR-004`| `URPA-NFR-001` to `URPA-NFR-004`| Non-Functional Security & Performance |

---

## 92. OPEN ITEMS

The following open decisions from approved upstream baselines are carried forward without premature resolution:

| Decision ID | Subject / Topic | Upstream Baseline Status | Status in this Specification |
| :--- | :--- | :--- | :--- |
| **DEC-002** | Initial 3rd-party licensed VTS provider(s) | TBD (Candidate examples: GP IoT, Robi, Bondstein) | Supported via multi-provider ingestion mapping. |
| **DEC-005** | Support live-location grant exact duration | Configurable (Ticket-scoped, explicit grant, auto-expiry) | Enforced as time-limited + configurable workflow. |
| **DEC-006** | Emergency rescue field operating model | TBD / Configurable by tenant operational policy | Enforced as active-incident scoped + prompt revocation. |
| **DEC-009** | Telemetry raw data retention duration | TBD + Statutory legal/privacy verification required | Preserves logical tenant isolation at scale. |
| **DEC-010** | Crash video clip retention duration | TBD + Statutory legal/privacy verification required | Preserves tenant-scoped query boundaries. |
| **DEC-011** | Cabin voice recording retention duration | TBD + Statutory legal/privacy verification required | Preserves immutable tenant audit scoping. |
| **DEC-014** | Production AI sensitive data class approval | Zero PII / live telemetry sent to free cloud AI models | Strict AI data protection perimeter enforced. |

---

## 93. LEGAL / PRIVACY VERIFICATION ITEMS

- **Location & Cabin Privacy:** Telematics coordinate viewing and cabin audio streaming are strictly subject to applicable legal consent and privacy regulations in Bangladesh where verified and applicable.
- **Evidence Admissibility:** Cryptographic media sealing supports technical data integrity; official legal evidentiary admissibility depends on verified statutory chain-of-custody procedures where legally verified and applicable.
- **Government Gateways:** Integrations with BRTA, BTRC, or National Emergency (999) services operate strictly through verified statutory protocols once officially approved.

---

## 94. BLOCKING QUESTIONS

> **Zero Blocking Questions.**  
All logical security boundaries, resource associations, multi-tenant perimeters, and cross-tenant platform workflows are fully specified based on approved `PRODUCT_REQUIREMENTS.md` v1.0, `MODULE_SERVICE_ENTITLEMENT_SPEC.md` v1.0, and `USER_ROLES_PERMISSIONS_ACCESS_SPEC.md` v1.0.

---

## 95. SPECIFICATION VERDICT

> # **TENANT ISOLATION & SECURITY BOUNDARY APPROVED — AUTHORITATIVE BASELINE**

This authoritative downstream specification strictly adheres to approved Product Requirements Document v1.0 (`abef605`), Module & Service Entitlement Specification v1.0 (`a962a2a`), and User Roles, Permissions, Authority & Access Specification v1.0 (`25e7834`), establishes the complete logical security boundary architecture for the multi-tenant SaaS platform, and is formally approved as the authoritative downstream specification baseline for Tenant Isolation & Security Boundary architecture.
