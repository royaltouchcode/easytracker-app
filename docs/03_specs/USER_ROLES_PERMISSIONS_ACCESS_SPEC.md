# User Roles, Permissions, Authority & Access Specification

**Status:** APPROVED  
**Version:** 1.0  
**Approved Date:** 2026-08-28  
**Product:** Vehicle Tracking Standalone Launch  
**Product Name:** TBD  
**Temporary Working Name:** EasyTracker  
**Authoritative Upstream:** `docs/03_specs/PRODUCT_REQUIREMENTS.md` v1.0 (Commit `abef605`), `docs/03_specs/MODULE_SERVICE_ENTITLEMENT_SPEC.md` v1.0 (Commit `a962a2a`)  
**Upstream Commits:** `abef605`, `a962a2a`  
**Approval Basis:** Independent senior review completed, focused corrections applied, and focused final re-review passed with zero blocking findings.  
**Authority Status:** APPROVED DOWNSTREAM SPECIFICATION  
**Purpose:** Define authoritative actor roles, permission vocabulary, scope, delegation, temporary grants and sensitive-access control while preserving separation between entitlement, authorization, device capability and safety policy.

---

## 1. DOCUMENT CONTROL

| Property | Specification |
| :--- | :--- |
| **Document Title** | User Roles, Permissions, Authority & Access Specification |
| **Document Identifier** | `docs/03_specs/USER_ROLES_PERMISSIONS_ACCESS_SPEC.md` |
| **Version** | `1.0` |
| **Status** | APPROVED |
| **Approved Date** | `2026-08-28` |
| **Product Brand** | TBD (Temporary Working Name: EasyTracker) |
| **Project Context** | Standalone Vehicle Tracking Launch (with future Agency SaaS vertical alignment) |
| **Active Development Branch** | `vehicle-tracking-launch-v1` |
| **Authoritative Upstream PRD** | `docs/03_specs/PRODUCT_REQUIREMENTS.md` v1.0 (Commit `abef605`) |
| **Authoritative Upstream Entitlement Spec**| `docs/03_specs/MODULE_SERVICE_ENTITLEMENT_SPEC.md` v1.0 (Commit `a962a2a`) |
| **Upstream Commits** | `abef605`, `a962a2a` |
| **Approval Basis** | Independent senior review completed, focused corrections applied, and focused final re-review passed with zero blocking findings. |
| **Authority Status** | APPROVED DOWNSTREAM SPECIFICATION |
| **Authority Precedence Index** | `docs/DOCUMENT_AUTHORITY_INDEX.md` |

---

## 2. PURPOSE

- **URPA-GEN-001 (Purpose Statement):** This specification defines the authoritative security architecture, role models, granular permission tokens, organizational data scopes, temporary access workflows, and fail-closed authorization logic governing human and automated actors across the Vehicle Tracking platform.

---

## 3. SCOPE

- **URPA-GEN-002 (In-Scope Capabilities):** This specification defines:
  - The multi-dimensional authorization evaluation formula.
  - Standard operational role personas across Platform, Tenant, Fleet, Commercial, Support, Technical, Rescue, Public Transit, and Customer domains.
  - Custom tenant role composition rules and administrative delegation boundaries.
  - Granular permission action vocabulary (`domain.resource.action`) and permission catalogues.
  - Scope models (Tenant, Fleet, Vehicle, Incident, Work Order, Station/Route) and scope intersection rules.
  - Temporary access grants (diagnostic Support, emergency Rescue, work-order Technician).
  - High-risk command safety authorization (engine disable/restore, relay, sensitive configuration).
  - Voice, video, media export, audit logging, and Integration Registry administrative privileges.
  - Separation of duties, invitation security, fail-closed enforcement, and non-functional requirements.

---

## 4. OUT OF SCOPE

- **URPA-GEN-003 (Explicit Exclusions):** This specification SHALL NOT define:
  - Concrete database schemas, SQL DDL tables, or column datatypes.
  - Low-level REST API endpoints, HTTP method mappings, or JSON request/response payloads.
  - Specific authentication protocols, token formats, or vendor SDKs (e.g. JWT, OIDC, Keycloak, OAuth2).
  - Concrete MFA mechanisms, biometric algorithms, or specific PIN entry UI dialogs.
  - Commercial retail pricing or package fee structures.
  - System architecture topology or physical cloud deployment manifests.

---

## 5. AUTHORITY & SOURCE BASIS

- **URPA-GEN-004 (Governing Precedence):** In accordance with `docs/DOCUMENT_AUTHORITY_INDEX.md`, this specification adheres strictly to:
  1. Approved `docs/03_specs/PRODUCT_REQUIREMENTS.md` v1.0 (Commit `abef605`).
  2. Approved `docs/03_specs/MODULE_SERVICE_ENTITLEMENT_SPEC.md` v1.0 (Commit `a962a2a`).
  3. Approved Reconciliation Audit v1.0 (`docs/02_audit/VEHICLE_TRACKING_REQUIREMENT_RECONCILIATION_AUDIT_V0_1.md`).
  4. Working Requirements Baseline V0.4 (`docs/01_working_requirements/`).
  5. Legacy authority documents (`PRODUCT_MASTER_INSTRUCTION.md`, `PRODUCT_REQUIREMENTS_DOCUMENT.md`).
  6. Existing code (strictly as implementation evidence, never authority).

---

## 6. DEFINITIONS

- **Role:** An administrative bundle of permission tokens representing an operational persona (e.g. `FLEET_MANAGER`, `SUPPORT_AGENT`).
- **Permission:** An atomic, explicit grant to perform a specific action on a resource (e.g. `tracking.location.view_live`).
- **Scope:** The boundary of resources (Tenant, Fleet Group, Vehicle, Support Ticket, Incident) over which a permission applies.
- **Authority:** The legal and organizational standing of an actor within a specific tenant context.
- **Temporary Access Grant:** A time-bounded, purpose-justified, revocable grant for sensitive data access (e.g. Support live location).
- **Sensitive Action:** An operation accessing private customer data, live location, cabin audio, or video streams.
- **High-Risk Action:** An operation physically affecting vehicle mobility (e.g. engine disable), modifying firmware, or altering security boundaries.

---

## 7. AUTHORIZATION MODEL

- **URPA-AUTH-001 (The Core Authorization Decision Formula):** Every request to perform an action on a resource MUST evaluate:
  $$\text{Authorized} = \text{Authenticated Actor} \land \text{Active Membership} \land \text{Tenant Match} \land \text{Entitled Module} \land \text{Required Permission} \land \text{Target in Scope} \land \text{Purpose / Grant} \land \text{Device Capability} \land \text{Safety Policy}$$
- **URPA-AUTH-002 (Fail-Closed Execution):** If any term in the formula evaluates to false, authorization MUST immediately fail closed (HTTP 403 / Access Denied).

---

## 8. AUTHENTICATION VS AUTHORIZATION

- **URPA-AUTH-003 (Strict Decoupling):**
  - **Authentication** verifies *identity* (Who is this actor?).
  - **Authorization** verifies *entitlement, permission, and scope* (What is this authenticated actor permitted to do on this specific resource?).
- **URPA-AUTH-004 (No Authentication-Level Access Grants):** Valid identity authentication SHALL NEVER grant resource access without explicit permission and scope verification.

---

## 9. ENTITLEMENT VS AUTHORIZATION

- **URPA-AUTH-005 (Boundary Separation):**
  - **Entitlement** governs whether a module is commercially active for the tenant/customer.
  - **Authorization** governs whether an individual user holds the permission token and scope to act within that active module.
- **URPA-AUTH-006 (Prohibition of Plan Conflation):** Subscribing to an advanced package (e.g. Video Monitoring) SHALL NOT grant all tenant users automatic video viewing permissions; RBAC controls access within the entitled boundary.

---

## 10. GOVERNING SECURITY PRINCIPLES

- **URPA-SEC-001 (Foundational Principles):**
  - **Least Privilege:** Users receive only the minimum permissions and scopes necessary for their role.
  - **Deny by Default:** Absence of an explicit permission grant means access is denied.
  - **Server-Side Authority:** All authorization decisions are computed server-side on every request.
  - **No Username Inference:** Roles and permissions SHALL NEVER be inferred from username prefixes (e.g. `driver_`, `supervisor_`), email patterns, or client metadata (`PRD-AUT-002`).

---

## 11. TENANT ISOLATION

- **URPA-TEN-001 (Absolute Isolation):** Data, devices, accounts, alerts, and audit logs belonging to Tenant A MUST NEVER be accessible by Tenant B under any condition (`PRD-ISO-001`).
- **URPA-TEN-002 (Fail-Closed Context Validation):** Any access request lacking an authenticated, valid tenant context or exhibiting a tenant boundary mismatch MUST fail closed and be denied access with zero resource disclosure (`PRD-ISO-002`).

---

## 12. ROLE MODEL

- **URPA-ROLE-001 (Standard Role Personas):** The platform defines exactly 17 standard operational role personas categorized into 8 functional domains:
  1. Platform Governance (`PLATFORM_OWNER`, `PLATFORM_ADMIN`).
  2. Tenant & Company Operations (`TENANT_ADMIN`, `COMPANY_MANAGER`, `FLEET_MANAGER`).
  3. Commercial & Onboarding (`SALES_AGENT`, `CUSTOMER_SERVICE`).
  4. Support & Maintenance (`SUPPORT_AGENT`, `TECHNICAL_SUPPORT`, `TECHNICIAN_INSTALLER`).
  5. Emergency Rescue (`RESCUE_DISPATCHER`, `RESCUE_MEMBER`).
  6. Channel & Distribution (`DEALER_CHANNEL`).
  7. Customer Ownership (`CUSTOMER_OWNER`).
  8. Vehicle & Transit Operations (`DRIVER`, `COUNTER_INCHARGE`, `ONBOARD_SUPERVISOR`).

---

## 13. PLATFORM OWNER

- **URPA-ROLE-002 (Platform Owner Governance):**
  - Scope: Global Platform.
  - Responsibilities: Master SaaS governance, tenant lifecycle provisioning, global platform capability toggles, and root audit oversight.
  - Boundary: Subject to command safety policies, device registry truth, and statutory privacy laws; SHALL NOT bypass command safety or audit trails.

---

## 14. PLATFORM ADMIN

- **URPA-ROLE-003 (Platform Admin Operations):**
  - Scope: Global Platform.
  - Responsibilities: Tenant account provisioning, global device knowledge registry maintenance, tracking provider gateway management, and integration registry maintenance.
  - Boundary: Bound by granular permissions; cannot access customer live locations without explicit diagnostic authorization.

---

## 15. TENANT ADMIN

- **URPA-ROLE-004 (Tenant Administrator Authority):**
  - Scope: Assigned Tenant only.
  - Responsibilities: User management, custom role creation, fleet configuration, customer subscription provisioning, and service mode selection (`MSE-MOD-001`).
  - Boundary: Strictly confined to assigned tenant; SHALL NOT provision modules beyond platform entitlements or assign platform-reserved permissions.

---

## 16. COMPANY MANAGER

- **URPA-ROLE-005 (Company Management Scope):**
  - Scope: Assigned Company / Division within Tenant.
  - Responsibilities: Operational fleet oversight, driver assignments, business reports, and billing status review.

---

## 17. FLEET MANAGER

- **URPA-ROLE-006 (Fleet Operations Scope):**
  - Scope: Assigned Fleet(s) or Fleet Group(s).
  - Responsibilities: Real-time fleet tracking, geofence management, route planning, driver rosters, trip reports, and maintenance scheduling.
  - Boundary: Restricted to assigned fleet groups; cannot view unassigned tenant fleets or modify tenant-level billing.

---

## 18. SALES

- **URPA-ROLE-007 (Sales Role Boundaries & No Default Sensitive Tracking):**
  - Scope: Commercial CRM and Customer Onboarding.
  - Responsibilities: Lead qualification, quotations, device/vehicle compatibility checks, package selection, and commission review.
  - Boundary: **Sales users SHALL NOT receive live vehicle tracking maps or historical trip logs by default** merely because they initiated a sale, referred a customer, or onboarded a device (`PRD-SLS-002`). Any sensitive tracking access requires a separately authorized, explicitly scoped workflow under applicable policy.

---

## 19. CUSTOMER SERVICE

- **URPA-ROLE-008 (Customer Service Boundaries & No Default Sensitive Access):**
  - Scope: Account and Billing Inquiry.
  - Responsibilities: Account verification, plan explanations, payment status lookup, and ticket creation.
  - Boundary: **Customer Service users SHALL NOT receive live tracking maps, historical routes, cabin audio, video clips, or remote device commands by default.** Any sensitive access requires a separately authorized operational workflow under applicable policy.

---

## 20. SUPPORT

- **URPA-ROLE-009 (Support Diagnostic Default):**
  - Scope: Assigned Support Tickets.
  - Responsibilities: Device connectivity troubleshooting, telemetry packet diagnostics, battery/voltage checks, and command delivery logs (`PRD-SUP-001`).
  - Boundary: **Support agents default strictly to technical diagnostics.** Live location access requires an active ticket, explicit authorization through the configured workflow under applicable consent/legal basis, and a time-limited grant (`PRD-SUP-002`, `MSE-SUP-002`).

---

## 21. TECHNICAL SUPPORT

- **URPA-ROLE-010 (Technical Support Deep Diagnostics):**
  - Scope: Protocol & Hardware Level Troubleshooting.
  - Responsibilities: Tracking provider raw log inspection, firmware handshake analysis, sensor calibration review, and installation verification.

---

## 22. TECHNICIAN / INSTALLER

- **URPA-ROLE-011 (Technician Work-Order Scoping):**
  - Scope: Assigned Work Orders / Service Jobs only.
  - Responsibilities: Physical device installation, relay wiring verification, sensor testing, device activation handshake, and warranty RMA returns (`PRD-INS-001`).
  - Boundary: Access is strictly time-bounded to active work orders; cannot view long-term customer location history or unassigned vehicles.

---

## 23. RESCUE DISPATCHER

- **URPA-ROLE-012 (Rescue Dispatcher Authority):**
  - Scope: Emergency Incidents within Assigned Region.
  - Responsibilities: Emergency incident intake, rescue team assignment, real-time response coordination, and incident resolution (`PRD-RSC-001`).

---

## 24. RESCUE MEMBER

- **URPA-ROLE-013 (Rescue Member Incident Gating):**
  - Scope: Assigned Emergency Incident only.
  - Responsibilities: On-site vehicle recovery, roadside assistance, and incident status updates.
  - Boundary: Access to live vehicle coordinates is granted strictly during active incident assignment and is **automatically and promptly revoked upon incident closure** according to authoritative revocation policy (exact measurable propagation target: TBD / downstream measurable NFR) (`PRD-RSC-002`, `MSE-RSC-002`).

---

## 25. DEALER / CHANNEL

- **URPA-ROLE-014 (Dealer / Channel Scoping):**
  - Scope: Assigned Dealer Branch and Referred Customer Accounts.
  - Responsibilities: Stock inventory management, device sales, customer onboarding, and dealer margin tracking (`PRD-CUST-009`).

---

## 26. CUSTOMER / VEHICLE OWNER

- **URPA-ROLE-015 (Customer Vehicle Ownership Scope):**
  - Scope: Owned / Subscribed Vehicles.
  - Responsibilities: Live tracking, trip history, geofence alerts, family sharing preferences, maintenance reminders, and remote commands (subject to safety policy).

---

## 27. DRIVER

- **URPA-ROLE-016 (Driver Vehicle Assignment Scope):**
  - Scope: Assigned Vehicle and Active Shift / Trip only.
  - Responsibilities: Digital Cockpit HUD navigation, assigned route viewing, trip mileage logging, and emergency SOS triggering (`PRD-TRN-004`).

---

## 28. COUNTER INCHARGE

- **URPA-ROLE-017 (Counter Incharge Station Scope):**
  - Scope: Assigned Transit Station / Ticket Counter.
  - Responsibilities: Bus schedule monitoring, departure clearance, gatepass generation, and station passenger booking logging (`PRD-TRN-001`, `PRD-TRN-002`).

---

## 29. ONBOARD SUPERVISOR

- **URPA-ROLE-018 (Onboard Supervisor Bus Trip Scope):**
  - Scope: Assigned Bus and Active Trip.
  - Responsibilities: Big-touch passenger counter stepping (`➕/➖`), seat occupancy tracking, boarding GPS logging, and in-transit SOS reporting (`PRD-TRN-003`).

---

## 30. CUSTOM TENANT ROLES

- **URPA-ROLE-019 (Custom Role Composition Rules):**
  - Tenant Admins MAY create custom roles by grouping tenant-delegable permissions.
  - Custom roles MUST NOT include platform-reserved permissions.
  - Custom roles MUST NOT grant access to un-entitled tenant modules.

---

## 31. MULTI-ROLE USERS

- **URPA-ROLE-020 (Multi-Role Permission Union):** When a user is assigned multiple roles within the same tenant, their effective permissions SHALL be the mathematical union of the granted permissions, with each permission strictly bounded by its respective scope.

---

## 32. MULTI-TENANT MEMBERSHIP

- **URPA-ROLE-021 (Tenant Context Isolation):** If a user identity belongs to multiple tenants (e.g. a contractor working for Tenant X and Tenant Y), the user MUST operate in a single active tenant session at any time. Permissions and scopes SHALL NEVER merge across tenant boundaries.

---

## 33. ROLE ASSIGNMENT AUTHORITY

- **URPA-ROLE-022 (Grantor Delegation Ceiling):** An administrator cannot assign a role or permission that grants greater authority than the administrator is authorized to delegate. Platform roles can be assigned ONLY by Platform Owners / Platform Admins.

---

## 34. PERMISSION MODEL

- **URPA-PERM-001 (Permission Token Structure):** Permission identifiers MUST adhere to the hierarchical format:
  `domain.resource.action`
  *(e.g. `tracking.location.view_live`, `commands.engine_disable.request`, `media.video.stream_live`).*

---

## 35. PERMISSION ACTION VOCABULARY

- **URPA-PERM-002 (Standard Action Verbs):** The action component of permission tokens MUST use the standardized vocabulary:
  - `view` (Read-only single record / status).
  - `list` (Query / search multiple records).
  - `create` (Instantiate new entity).
  - `update` (Modify existing entity metadata).
  - `delete` (Remove entity / archive).
  - `assign` (Bind resource to scope / actor).
  - `request` (Initiate workflow requiring policy/confirmation).
  - `execute` (Trigger direct operational action).
  - `export` (Extract sensitive bulk data).
  - `approve` (Authorize pending grant / workflow).
  - `verify` (Certify technical / compliance state).
  - `configure` (Modify operational parameters).

---

## 36. PERMISSION DOMAINS

- **URPA-PERM-003 (Domain Scope):** Permissions are partitioned across 16 core product domains:
  `platform`, `tenant`, `users`, `roles`, `entitlements`, `vehicles`, `fleets`, `tracking`, `alerts`, `commands`, `devices`, `media`, `support`, `rescue`, `transit`, `audit`.

---

## 37. PERMISSION CATALOGUE

| Permission Token | Domain | Resource | Action | Platform Only? | Tenant Delegable? | Scope Required? | Sensitive? | High-Risk? |
| :--- | :--- | :--- | :--- | :---: | :---: | :---: | :---: | :---: |
| `platform.tenant.create` | `platform` | `tenant` | `create` | **YES** | NO | `PLATFORM` | YES | NO |
| `platform.entitlement.grant` | `platform` | `entitlement`| `grant` | **YES** | NO | `PLATFORM` | YES | NO |
| `platform.integration.view` | `platform` | `integration`| `view` | **YES** | NO | `PLATFORM` | NO | NO |
| `platform.integration.configure` | `platform` | `integration`| `configure` | **YES** | NO | `PLATFORM` | YES | NO |
| `platform.integration.test` | `platform` | `integration`| `test` | **YES** | NO | `PLATFORM` | NO | NO |
| `platform.integration.approve`| `platform` | `integration`| `approve` | **YES** | NO | `PLATFORM` | YES | YES |
| `platform.integration.activate`| `platform` | `integration`| `activate` | **YES** | NO | `PLATFORM` | **YES** | **YES** |
| `platform.integration.suspend` | `platform` | `integration`| `suspend` | **YES** | NO | `PLATFORM` | YES | NO |
| `platform.integration.retire` | `platform` | `integration`| `retire` | **YES** | NO | `PLATFORM` | YES | NO |
| `tenant.users.manage` | `tenant` | `users` | `manage` | NO | **YES** | `TENANT` | NO | NO |
| `tenant.roles.manage` | `tenant` | `roles` | `manage` | NO | **YES** | `TENANT` | YES | NO |
| `tracking.location.view_live`| `tracking` | `location` | `view` | NO | **YES** | `VEHICLE / FLEET`| **YES** | NO |
| `tracking.history.view` | `tracking` | `history` | `view` | NO | **YES** | `VEHICLE / FLEET`| **YES** | NO |
| `tracking.history.export` | `tracking` | `history` | `export` | NO | **YES** | `VEHICLE / FLEET`| **YES** | NO |
| `alerts.realtime.view` | `alerts` | `alert` | `view` | NO | **YES** | `VEHICLE / FLEET`| NO | NO |
| `commands.status.query` | `commands` | `status` | `query` | NO | **YES** | `DEVICE` | NO | NO |
| `commands.engine_disable.request`|`commands`| `engine` | `request`| NO | **YES** | `VEHICLE` | **YES** | **YES** |
| `commands.engine_restore.request`|`commands`| `engine` | `request`| NO | **YES** | `VEHICLE` | **YES** | **YES** |
| `devices.registry.verify` | `devices` | `registry` | `verify` | **YES** | NO | `PLATFORM / DEVICE`| **YES** | **YES** |
| `media.voice.monitor_call` | `media` | `voice` | `monitor`| NO | **YES** | `VEHICLE` | **YES** | NO |
| `media.audio.stream_live` | `media` | `audio` | `stream` | NO | **YES** | `VEHICLE` | **YES** | NO |
| `media.video.stream_live` | `media` | `video` | `stream` | NO | **YES** | `VEHICLE` | **YES** | NO |
| `media.evidence.export` | `media` | `evidence` | `export` | NO | **YES** | `VEHICLE` | **YES** | **YES** |
| `support.diagnostics.view` | `support` | `diagnostics`| `view` | NO | **YES** | `DEVICE / TICKET`| NO | NO |
| `support.location.grant_temp`| `support` | `location` | `grant` | NO | **YES** | `TICKET` | **YES** | **YES** |
| `rescue.incident.dispatch` | `rescue` | `incident` | `dispatch`| NO | **YES** | `INCIDENT` | **YES** | NO |
| `rescue.location.track` | `rescue` | `location` | `track` | NO | **YES** | `INCIDENT` | **YES** | NO |
| `transit.gatepass.issue` | `transit` | `gatepass` | `issue` | NO | **YES** | `STATION / ROUTE`| NO | NO |
| `transit.passenger.step` | `transit` | `passenger`| `step` | NO | **YES** | `VEHICLE / TRIP` | NO | NO |
| `audit.log.view` | `audit` | `log` | `view` | NO | **YES** | `TENANT` | YES | NO |

---

## 38. SCOPE MODEL

- **URPA-SCOPE-001 (Hierarchical & Domain Scopes):** Scopes define the concrete resource boundary for permission execution:
  - `GLOBAL_PLATFORM` $\longrightarrow$ Entire SaaS ecosystem.
  - `TENANT_SCOPE` $\longrightarrow$ All accounts and assets within a tenant.
  - `COMPANY_SCOPE` $\longrightarrow$ Assigned division/subsidiary.
  - `CUSTOMER_ACCOUNT` $\longrightarrow$ Individual/commercial customer account.
  - `FLEET` $\longrightarrow$ Top-level organizational fleet partition.
  - `FLEET_GROUP` $\longrightarrow$ Specific sub-fleet or operational vehicle group.
  - `VEHICLE_SCOPE` $\longrightarrow$ Explicit single vehicle.
  - `DEVICE_SCOPE` $\longrightarrow$ Hardware tracker IMEI / device entity.
  - `DRIVER_SCOPE` $\longrightarrow$ Assigned individual driver operator.
  - `ROUTE_SCOPE` $\longrightarrow$ Assigned transit corridor or delivery route.
  - `WORK_ORDER_SCOPE` $\longrightarrow$ Active technician job.
  - `SUPPORT_TICKET_SCOPE` $\longrightarrow$ Active customer helpdesk ticket.
  - `RESCUE_INCIDENT_SCOPE` $\longrightarrow$ Active emergency incident.
  - `TRANSIT_STATION_SCOPE` $\longrightarrow$ Assigned bus counter / station.
  - `TRANSIT_TRIP_SCOPE` $\longrightarrow$ Assigned scheduled bus trip.
  - `ORDER_SERVICE_REQUEST_SCOPE` $\longrightarrow$ Commercial sales or activation order.
  - `MEDIA_EVIDENCE_OBJECT_SCOPE` $\longrightarrow$ Specific cryptographic video/audio clip.

---

## 39. SCOPE INTERSECTION

- **URPA-SCOPE-002 (Mandatory Resource Scope Match):** Every authorization decision for a scoped resource or action MUST validate that the target resource falls strictly within the actor's active authorized scope boundary.

---

## 40. MULTIPLE SCOPES

- **URPA-SCOPE-003 (Multiple Scope Grants):** A user MAY hold multiple disjoint scopes within the same tenant (e.g. Fleet Manager assigned to Fleet North and Fleet East, but excluded from Fleet South).

---

## 41. PLATFORM RESERVED PERMISSIONS

- **URPA-PERM-004 (Platform Isolation):** Permissions governing global tenant creation, platform capability toggles, global provider secrets, global device knowledge verification (`devices.registry.verify`), and production integration activation (`platform.integration.activate`) are strictly `PLATFORM_RESERVED` and CANNOT be assigned or delegated by tenant admins.

---

## 42. TENANT-DELEGABLE PERMISSIONS

- **URPA-PERM-005 (Tenant Delegation Boundary):** Tenant admins MAY delegate permissions related to fleet operations, driver rosters, geofences, report generation, and customer management within their entitled modules.

---

## 43. HIGH-RISK PERMISSIONS

- **URPA-PERM-006 (High-Risk Governance):** Actions with physical safety or security impact (engine disable/restore, media export, emergency access grants, role management, production integration activation) require explicit permission tokens and cannot be bundled into generic operational roles.

---

## 44. ENGINE CONTROL AUTHORITY

- **URPA-CMD-001 (Explicit Engine Command Permissions & Safety Gating):**
  - Remote engine disable requires `commands.engine_disable.request`.
  - Remote engine restore requires `commands.engine_restore.request`.
  - Generic vehicle management permissions SHALL NOT authorize engine control.
  - Execution strictly requires full compliance with `MSE-CMD-001` (Platform Capability $\land$ Tenant Entitlement $\land$ Customer Subscription where applicable $\land$ User Permission / Scope $\land$ Verified Device Capability $\land$ Safe-State / Command Safety Policy Satisfied $\land$ Explicit Confirmation $\land$ Step-up Authentication where required by policy $\land$ Server Authorization $\land$ Authoritative Result $\land$ Audit). No fixed speed threshold is mandated.

---

## 45. DEVICE COMMAND AUTHORITY

- **URPA-CMD-002 (Granular Command Permissions):** The system separates diagnostic commands (`commands.status.query`, `commands.gps_wakeup.request`) from sensitive configuration commands (`commands.apn_config.request`, `commands.reboot.request`).

---

## 46. SUPPORT TEMPORARY ACCESS

- **URPA-SUP-001 (Support Location Grant Lifecycle):** Live location access for support staff requires:
  1. Active support ticket.
  2. Verified diagnostic purpose.
  3. Explicit authorization through the configured workflow under applicable consent/legal basis (`DEC-005`).
  4. Time-limited grant with automatic revocation upon expiration.
  5. Immutable security audit logging.

---

## 47. RESCUE INCIDENT ACCESS

- **URPA-RSC-001 (Incident-Bound Tracking):** Rescue dispatchers and response members receive vehicle tracking access strictly within the scope of an assigned `RESCUE_INCIDENT_SCOPE`. Access is **automatically and promptly revoked upon incident closure** according to authoritative revocation policy (exact measurable propagation target: TBD / downstream measurable NFR) (`PRD-RSC-002`, `MSE-RSC-002`).

---

## 48. TECHNICIAN TEMPORARY ACCESS

- **URPA-TECH-001 (Work-Order Bounded Access):** Field installers receive diagnostic telemetry access strictly during active `WORK_ORDER_SCOPE`. Permanent tracking history access is prohibited.

---

## 49. PURPOSE-BASED ACCESS

- **URPA-AUTH-007 (Mandatory Purpose Recording):** Sensitive administrative actions (support location grants, media exports, device configuration overrides) MUST capture a mandatory justification / ticket reference string.

---

## 50. STEP-UP REQUIREMENTS

- **URPA-AUTH-008 (Elevated Assurance Gating):** High-risk operations (engine disable/restore, media export, role privilege changes) require step-up authentication validation server-side prior to execution where required by policy.

---

## 51. TEMPORARY GRANT LIFECYCLE

- **URPA-AUTH-009 (Grant State Machine):** Temporary grants transition through:
  $$\text{REQUESTED} \longrightarrow \text{APPROVED} \longrightarrow \text{ACTIVE} \longrightarrow \text{EXPIRED / REVOKED}$$
  Expired grants MUST be rejected immediately upon timestamp expiry.

---

## 52. USER / MEMBERSHIP LIFECYCLE

- **URPA-USER-001 (Membership States):** User accounts operate in states: `INVITED`, `ACTIVE`, `SUSPENDED`, `DISABLED`, `REMOVED`. Suspended or disabled accounts fail closed on all requests.

---

## 53. INVITATION / ONBOARDING SECURITY

- **URPA-USER-002 (Secure Onboarding Tokens):** Staff invitations MUST use cryptographically secure, time-limited invitation links. **Plaintext credential distribution via WhatsApp, SMS, or clipboard sharing is STRICTLY PROHIBITED** (`PRD-SEC-003`).

---

## 54. ROLE / PERMISSION CHANGE

- **URPA-USER-003 (Prompt Privilege Propagation):** Role revocations and permission reductions MUST propagate promptly and reliably across active sessions to prevent unauthorized operations (`MSE-NFR-004`).

---

## 55. USER REMOVAL

- **URPA-USER-004 (Safe Deprovisioning):** Removing a user terminates all active sessions, revokes all temporary grants, and preserves historical audit attribution records.

---

## 56. VEHICLE OWNERSHIP / ASSIGNMENT

- **URPA-VEH-001 (Ownership vs. Assignment):** The authorization engine distinguishes between:
  - *Customer Owner* (Commercial subscriber; holds full management rights within plan).
  - *Assigned Driver* (Operational operator; restricted to cockpit/navigation views).
  - *Service Technician* (Temporary diagnostic scope during repair).

---

## 57. PROVIDER ADMINISTRATION

- **URPA-PRV-001 (Provider Vault Protection):** Access to Tracking Provider master tokens, push webhook secrets, and Traccar cluster credentials requires `platform.provider.manage` and SHALL NEVER be exposed to end customers (`MSE-PRV-002`).

---

## 58. DEVICE CAPABILITY VERIFICATION AUTHORITY

- **URPA-DEV-001 (Registry Verification Lockdown):** Verifying hardware capabilities in the Device Knowledge Registry requires `devices.registry.verify`. **Sales staff and AI models are strictly barred from verifying device capabilities** (`PRD-DKR-002`, `MSE-DEV-001`).

---

## 59. VOICE / AUDIO ACCESS

- **URPA-MED-001 (Independent Voice Permissions):** The system enforces 4 discrete permissions matching `PRD-VOC-001`:
  `media.voice.monitor_call`, `media.audio.record_event`, `media.audio.stream_live`, `media.intercom.two_way_speak`.

---

## 60. VIDEO / MEDIA ACCESS

- **URPA-MED-002 (Video Access Segregation):** Viewing live dashcam video (`media.video.stream_live`) is segregated from historical playback (`media.video.playback`) and cryptographic media export (`media.evidence.export`).

---

## 61. REPORT ACCESS

- **URPA-REP-001 (Report Scope Parity):** Reports and analytics exports MUST respect the identical scope boundaries as live telemetry; users cannot generate reports for unassigned fleets or external tenants.

---

## 62. EXPORT ACCESS

- **URPA-EXP-001 (Controlled Export Privileges):** Bulk data export (telemetry dumps, trip logs, evidence clips) requires explicit `*.export` permissions and audit logging.

---

## 63. REGULATORY KNOWLEDGE AUTHORITY

- **URPA-REG-001 (Compliance Role Boundaries):** Viewing regulatory knowledge requires `regulatory.knowledge.view`; approving operational policy circulars requires `platform.regulatory.approve` (`PRD-REG-002`).

---

## 64. INTEGRATION REGISTRY AUTHORITY

- **URPA-INT-001 (Integration Lifecycle Privileges):** The platform distinguishes lifecycle permissions: `platform.integration.view`, `platform.integration.configure`, `platform.integration.test`, `platform.integration.approve`, `platform.integration.activate`, `platform.integration.suspend`, `platform.integration.retire`. Production gateway activation (`platform.integration.activate`) is a high-risk platform-reserved action and SHALL NEVER be granted through ordinary configuration permissions or commercial entitlement (`MSE-ITG-001`).

---

## 65. AUDIT LOG ACCESS

- **URPA-AUD-001 (Audit Inspection Scoping):** Viewing tenant audit trails requires `audit.log.view` scoped strictly to the user's tenant. Audit records are append-only and immutable.

---

## 66. ADMINISTRATIVE OVERRIDES

- **URPA-ADM-001 (No Universal Bypass):** Administrative privilege does NOT create an automatic bypass of tenant isolation, high-risk command safety, or legal consent requirements.

---

## 67. SYSTEM / SERVICE ACTORS

- **URPA-SYS-001 (Machine Authority Scoping):** Automated background services (telemetry ingestion, alert processors, billing workers) MUST use explicit service identity tokens scoped to specific processing tasks.

---

## 68. AI ACTOR BOUNDARY

- **URPA-AI-001 (AI Authority Boundary & Assisted Automation):** External AI models are NOT independent authority sources and SHALL NOT possess authority to independently grant permissions, elevate user roles, bypass command safety, or authorize high-risk actions (`PRD-AI-004`, `MSE-AI-002`). AI models MAY assist, recommend, or automate safe workflows where a deterministic, authorized system independently validates all required authority, scope, and safety policy gates.

---

## 69. FEATURE MODULE CONTROL INTERSECTION

- **URPA-FMC-001 (Entitlement-Authorization Gate):** If a module is un-entitled at the tenant level, holding a user permission token for that module SHALL NOT unlock the feature (`MSE-ENT-001`).

---

## 70. DEPENDENCY / DEGRADED STATE

- **URPA-DEP-001 (Graceful Degradation):** When an external dependency (e.g. video server) is offline, user authorization remains valid while the UI displays an informative `SERVICE_UNAVAILABLE` notice.

---

## 71. DEMO ACCESS

- **URPA-DMO-001 (Demo Isolation Guarantee):** Demo users receive simulated demo permissions bounded strictly to synthetic sandbox data; demo tokens CANNOT access production databases or send real commands (`PRD-DMO-002`).

---

## 72. WHITE-LABEL ADMINISTRATION

- **URPA-WHT-001 (Branding Delegation):** White-label branding customization requires `tenant.branding.manage` and cannot modify underlying multi-tenant core security logic (`PRD-WHT-001`).

---

## 73. USER ROLE MANAGER

- **URPA-MGR-001 (Role Manager Capabilities):** Authorized tenant administrators MAY create, clone, update, and deactivate custom tenant roles within granted delegation limits.

---

## 74. PERMISSION ASSIGNMENT SAFETY

- **URPA-MGR-002 (Pre-Assignment Validation):** Before assigning permissions, the engine validates: Grantor Authority $\land$ Tenant Scope $\land$ Entitlement Active $\land$ Non-Platform Reserved.

---

## 75. SEGREGATION OF DUTIES

- **URPA-SOD-001 (Critical Separation Rules):**
  1. Sales staff CANNOT verify device capabilities or grant themselves live tracking.
  2. Support agents CANNOT grant themselves permanent location access.
  3. AI models CANNOT independently approve regulatory policies or trigger physical engine immobilization.

---

## 76. SELF-MODIFICATION PROHIBITION

- **URPA-SOD-002 (No Self-Elevation):** Users cannot elevate their own roles, expand their own scopes, or grant themselves additional permissions through profile update endpoints.

---

## 77. ROLE DEACTIVATION

- **URPA-MGR-003 (Safe Role Deactivation):** Deactivating a custom role safely unassigns active users or prompts for reassignment without leaving dangling privileges.

---

## 78. PERMISSION CHANGE AUDIT

- **URPA-AUD-002 (Mandatory IAM Audit Events):** All role creations, permission modifications, user assignments, temporary grants, and revocations MUST be logged to the immutable audit trail.

---

## 79. AUTHORIZATION AUDIT CONTENT

- **URPA-AUD-003 (Audit Event Attributes):** Authorization audit records MUST capture: Timestamp, Actor ID, Target User ID, Tenant ID, Action Performed, Scope Applied, Reason / Ticket Reference, and Result Status.

---

## 80. FAIL-CLOSED BEHAVIOR

- **URPA-SEC-002 (Fail-Closed Default):** In the event of an unhandled error, database timeout, or missing scope definition, the authorization engine MUST deny access.

---

## 81. DENIAL / ERROR PRINCIPLE

- **URPA-SEC-003 (Safe Error Responses):** Denied requests MUST return clear, non-leaking error responses (e.g. `HTTP 403 Forbidden` with standardized reason codes: `NOT_AUTHORIZED`, `OUT_OF_SCOPE`, `ENTITLEMENT_REQUIRED`).

---

## 82. REVOCATION PROPAGATION

- **URPA-SEC-004 (Prompt Revocation Delivery):** Authorization revocations and temporary grant expirations MUST propagate promptly across active user sessions to prevent unauthorized operations.

---

## 83. OFFLINE / CACHED CLIENT SECURITY

- **URPA-SEC-005 (No Client-Side Authority):** Mobile and web client caches are non-authoritative; offline apps cannot execute high-risk commands or bypass expired permissions.

---

## 84. PERMISSION MATRIX

*Note: The matrix covers all 17 standard operational role personas individually to ensure granular authority differentiation.*

| Standard Role Persona | `platform.*` | `tenant.users.*` | `tracking.view` | `commands.engine` | `media.video` | `support.location` | `rescue.track` | `transit.step` |
| :--- | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: |
| **Platform Owner** | **DEFAULT** | **DEFAULT** | RESTRICTED | RESTRICTED | RESTRICTED | RESTRICTED | RESTRICTED | NO |
| **Platform Admin** | **DEFAULT** | **DEFAULT** | RESTRICTED | RESTRICTED | RESTRICTED | RESTRICTED | RESTRICTED | NO |
| **Tenant Admin** | NO | **DEFAULT** | **DEFAULT** | OPTIONAL | OPTIONAL | NO | NO | OPTIONAL |
| **Company Manager**| NO | OPTIONAL | **DEFAULT** | OPTIONAL | OPTIONAL | NO | NO | OPTIONAL |
| **Fleet Manager** | NO | NO | **DEFAULT** | OPTIONAL | OPTIONAL | NO | NO | NO |
| **Sales Agent** | NO | NO | **NOT ALLOWED**| **NOT ALLOWED**| NO | NO | NO | NO |
| **Customer Service**| NO | NO | **NOT ALLOWED**| **NOT ALLOWED**| NO | NO | NO | NO |
| **Support Agent** | NO | NO | **RESTRICTED** | NO | NO | **RESTRICTED** | NO | NO |
| **Technical Support**|NO | NO | **RESTRICTED** | NO | NO | **RESTRICTED** | NO | NO |
| **Tech Installer** | NO | NO | **RESTRICTED** | NO | NO | NO | NO | NO |
| **Rescue Dispatcher**|NO | NO | NO | NO | NO | NO | **DEFAULT** | NO |
| **Rescue Member** | NO | NO | NO | NO | NO | NO | **RESTRICTED** | NO |
| **Dealer / Channel**| NO | NO | **NOT ALLOWED**| **NOT ALLOWED**| NO | NO | NO | NO |
| **Customer Owner** | NO | NO | **DEFAULT** | **DEFAULT** | OPTIONAL | NO | NO | NO |
| **Driver** | NO | NO | **RESTRICTED** | NO | NO | NO | NO | NO |
| **Counter Incharge**| NO | NO | **RESTRICTED** | NO | NO | NO | NO | NO |
| **Onboard Supervisor**|NO | NO | NO | NO | NO | NO | NO | **DEFAULT** |

---

## 85. ROLE-SCOPE MATRIX

| Standard Role Persona | Primary Authorized Scope Boundary | Secondary / Temporary Scope Boundary |
| :--- | :--- | :--- |
| **Platform Owner** | `GLOBAL_PLATFORM` | Master Audit Scope |
| **Platform Admin** | `GLOBAL_PLATFORM` | Assigned Tenant Context |
| **Tenant Admin** | `TENANT_SCOPE` | None (Confined to own Tenant) |
| **Company Manager** | `COMPANY_SCOPE` | Assigned Fleets |
| **Fleet Manager** | `FLEET` / `FLEET_GROUP` / `VEHICLE_SCOPE` | Assigned Sub-Fleets |
| **Sales Agent** | `ORDER_SERVICE_REQUEST_SCOPE` | Assigned CRM Leads |
| **Customer Service**| `CUSTOMER_ACCOUNT` (Non-sensitive) | Assigned Service Inquiries |
| **Support Agent** | `DEVICE_SCOPE` (Diagnostics) | `SUPPORT_TICKET_SCOPE` (Temporary Live Location) |
| **Technical Support**| `DEVICE_SCOPE` (Deep Protocol) | `SUPPORT_TICKET_SCOPE` (Protocol Telemetry) |
| **Technician Installer**| None (Inactive State) | `WORK_ORDER_SCOPE` (Active Service Job) |
| **Rescue Dispatcher**| `RESCUE_INCIDENT_SCOPE` (Regional) | Active Dispatch Queue |
| **Rescue Member** | None (Inactive State) | `RESCUE_INCIDENT_SCOPE` (Active Response) |
| **Dealer / Channel**| `CUSTOMER_ACCOUNT` (Referred) | Inventory Branch Scope |
| **Customer Owner** | `CUSTOMER_ACCOUNT` / `VEHICLE_SCOPE` | Delegated Family Vehicles |
| **Driver** | `VEHICLE_SCOPE` (Assigned Vehicle) | `DRIVER_SCOPE` / `TRANSIT_TRIP_SCOPE` (Shift) |
| **Counter Incharge**| `TRANSIT_STATION_SCOPE` | `ROUTE_SCOPE` (Assigned Transit Routes) |
| **Onboard Supervisor**| `TRANSIT_TRIP_SCOPE` | Assigned Transit Vehicle |

---

## 86. SENSITIVE ACCESS MATRIX

| Sensitive Resource / Action | Explicit Permission | Active Scope Match | Entitlement Required | Device Capability Gate | Temporary Grant / Purpose | Safety Policy Gate | Step-Up Auth | Audit Log |
| :--- | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: |
| **Live Tracking View** | `tracking.location.view_live` | YES | YES | GPS Active | NO | NO | NO | YES |
| **Historical Route Export** | `tracking.history.export` | YES | YES | Standard GNSS | YES | NO | Where Policy Requires | YES |
| **Remote Engine Disable** | `commands.engine_disable.request`| **YES** | **YES** | **Verified Relay** | **NO** | **Safe-State Satisfied**| **Where Policy Requires**| **YES** |
| **Remote Engine Restore** | `commands.engine_restore.request`| **YES** | **YES** | **Verified Relay** | **NO** | **Safe-State Satisfied**| **Where Policy Requires**| **YES** |
| **One-Way Voice Stream** | `media.audio.stream_live` | **YES** | **YES** | **Microphone Cap** | **YES** | **Privacy Consent** | **Where Policy Requires**| **YES** |
| **Two-Way Audio Intercom** | `media.intercom.two_way_speak` | **YES** | **YES** | **Speaker + Mic Cap**| **YES** | **Privacy Consent** | **Where Policy Requires**| **YES** |
| **Live Dashcam Video** | `media.video.stream_live` | **YES** | **YES** | **Camera Cap** | **NO** | **Bandwidth Policy** | **NO** | **YES** |
| **Historical Video Playback**| `media.video.playback` | **YES** | **YES** | **Storage Cap** | **NO** | **Bandwidth Policy** | **NO** | **YES** |
| **Cryptographic Media Export**| `media.evidence.export` | **YES** | **YES** | **MDVR / SD Cap** | **YES** | **Chain-of-Custody** | **Where Policy Requires**| **YES** |
| **Support Live Location** | `support.location.grant_temp` | **YES** | **YES** | None | **Active Ticket + Grant**| **Auto-Expiry** | **Where Policy Requires**| **YES** |
| **Rescue Incident Location** | `rescue.location.track` | **YES** | **YES** | None | **Active Incident Assign**| **Auto-Revoke on Close**| **NO** | **YES** |
| **Device Registry Verify** | `devices.registry.verify` | **YES** | **YES** | Registry Match | **Technical Verification**| **Admin Rule** | **Where Policy Requires**| **YES** |
| **Regulatory Policy Approve**| `platform.regulatory.approve`| **YES** | **YES** | None | **Platform Governance** | **Admin Rule** | **Where Policy Requires**| **YES** |
| **Integration Prod Activate**| `platform.integration.activate`|**YES** | **YES** | None | **Integration Governance**|**Admin Rule** | **Where Policy Requires**| **YES** |

---

## 87. PLATFORM VS TENANT DELEGATION MATRIX

| Permission Category | Platform Reserved | Tenant Delegable | Conditional Delegation Rules |
| :--- | :---: | :---: | :--- |
| **Tenant Lifecycle & Billing** | **YES** | NO | Restricted to SaaS Platform Owners. |
| **Global Device Knowledge Registry** | **YES** | NO | Technical hardware verification is centralized (`devices.registry.verify`). |
| **Tracking Provider Master Gateway** | **YES** | NO | Master gateway secrets remain in platform vaults (`platform.provider.manage`). |
| **Integration Production Activation** | **YES** | NO | Activating live external endpoints requires `platform.integration.activate`. |
| **Tenant Fleet & Driver Operations** | NO | **YES** | Tenant Admins may delegate freely to Fleet Managers. |
| **Customer Store & Onboarding** | NO | **YES** | Delegable to Tenant Sales and Customer Service staff. |
| **Transit Counters & Stepper Rosters**| NO | **YES** | Delegable to Counter Incharges and Supervisors. |
| **High-Risk Engine Immobilization** | NO | **YES** | Delegable only to authorized fleet security managers. |

---

## 88. ROLE DEFAULTS / CUSTOMIZATION

- **URPA-MGR-004 (Default Bundles vs. Custom Roles):** Standard role personas provide pre-configured, tested default permission sets. Tenants MAY compose custom roles to match organizational workflows, provided all assigned permissions are `TENANT_DELEGABLE` and within active tenant entitlements.

---

## 89. SEARCH / REPORT / EXPORT ISOLATION

- **URPA-SEC-006 (Server-Authoritative Data Isolation):** Global search, autocomplete lookups, analytics reports, and export routines MUST enforce the identical tenant boundary and resource-scope authorization as underlying source data, ensuring zero cross-tenant data bleed.

---

## 90. IDENTIFIER SECURITY

- **URPA-SEC-007 (Knowledge != Authority):** Knowledge of a resource identifier (IMEI, Vehicle UUID, Ticket ID) SHALL NEVER bypass authorization; the actor must hold explicit permission and scope over that resource.

---

## 91. TRACKING PROVIDER DATA ACCESS

- **URPA-PRV-002 (Provider Ingestion Isolation):** Ingested telematics packets MUST be stamped with validated `tenant_id` and `vehicle_id` associations before becoming accessible to tenant users.

---

## 92. OFFBOARDING ACCESS

- **URPA-USER-005 (Terminated Tenant Access):** When a tenant subscription terminates, all user access is revoked immediately, while historical records enter the statutory retention lifecycle (`PRD-RET-001`).

---

## 93. NON-FUNCTIONAL REQUIREMENTS

- **URPA-NFR-001 (Authorization Overhead):** Server-side RBAC and scope evaluation SHALL add $\le 15\text{ ms}$ latency overhead to API execution.
- **URPA-NFR-002 (Fail-Closed Security):** 100% of authorization decision services MUST fail closed upon unhandled exception or cache failure.
- **URPA-NFR-003 (Audit Integrity):** 100% of privilege grants, revocations, and high-risk command executions MUST be recorded in immutable audit logs.
- **URPA-NFR-004 (Prompt Propagation):** Privilege revocations and temporary grant expirations MUST propagate promptly across active sessions (exact target: TBD / downstream measurable NFR).

---

## 94. ACCEPTANCE CRITERIA

- **URPA-ACC-001 (Authorization Verification Criteria):**
  1. *Tenant Boundary*: Tenant A user attempting to query Tenant B vehicle receives HTTP 403 / zero records.
  2. *Sales Isolation*: Sales agent attempting to view live tracking map receives HTTP 403 Access Denied.
  3. *Admin Ceiling*: Tenant Admin attempting to assign `platform.tenant.create` receives HTTP 403 Forbidden.
  4. *Entitlement Gate*: User with video permission in a tenant without Video Entitlement receives `ENTITLEMENT_REQUIRED`.
  5. *Device Capability Gate*: Customer triggering engine disable on a tracker without verified relay receives `DEVICE_UNSUPPORTED`.
  6. *Engine Safe-State*: Engine disable command fails closed if safety engine policy is unsatisfied.
  7. *Support Diagnostics*: Support agent viewing device diagnostics sees battery/voltage but zero live coordinates without an approved grant.
  8. *Support Auto-Expiry*: Expired support location grant immediately blocks further coordinate viewing.
  9. *Rescue Auto-Revoke*: Closing a rescue incident promptly revokes location access for assigned rescue members.
  10. *Technician Boundary*: Technician assigned to Work Order A cannot view telemetry for Vehicle B.
  11. *Transit Scoping*: Counter Incharge cannot issue gatepasses for unassigned transit routes.
  12. *Supervisor Scoping*: Onboard Supervisor stepper commands apply strictly to the assigned active bus trip.
  13. *Provider Secret Protection*: End customer API calls cannot retrieve tracking provider master tokens.
  14. *No Username Inference*: Authenticating as `driver_admin` or `supervisor_99` grants zero automatic permissions.
  15. *AI Authority Barrier*: AI Orchestrator prompt injection cannot trigger remote vehicle immobilization.
  16. *Demo Production Barrier*: Demo tokens attempting production API calls fail closed.

---

## 95. UPSTREAM TRACEABILITY

| Specification Requirement ID | Upstream PRD ID(s) | Upstream Entitlement Spec ID(s) | Primary Subject Covered |
| :--- | :--- | :--- | :--- |
| **URPA-GEN-001 to URPA-GEN-004** | `PRD-GEN-001`, `PRD-AUT-001` | `MSE-GEN-001` to `MSE-GEN-004` | Scope, Purpose & Precedence |
| **URPA-AUTH-001, URPA-AUTH-002** | `PRD-AUT-001`, `PRD-AUT-002` | `MSE-ENT-001`, `MSE-ENT-002` | Authorization Formula & Fail-Closed |
| **URPA-AUTH-003 to URPA-AUTH-006** | `PRD-AUT-001` | `MSE-ENT-003`, `MSE-ENT-004` | AuthN vs. AuthZ & Entitlement Decoupling |
| **URPA-SEC-001 to URPA-SEC-007** | `PRD-SEC-003`, `PRD-AUT-002` | `MSE-SEC-001` to `MSE-SEC-003` | Governing Security, No Prefix Inference |
| **URPA-TEN-001, URPA-TEN-002** | `PRD-ISO-001`, `PRD-ISO-002` | `MSE-TEN-001`, `MSE-TEN-002` | Absolute Multi-Tenant Isolation |
| **URPA-ROLE-001 to URPA-ROLE-022**| `PRD-ROL-001`, `PRD-AUT-001` | `MSE-USR-001`, `MSE-FMC-001` | 17 Role Personas & Delegation Authority |
| **URPA-PERM-001 to URPA-PERM-006**| `PRD-AUT-001` | `MSE-ENT-005` | Permission Structure, Verbs & Catalogue |
| **URPA-SCOPE-001 to URPA-SCOPE-003**| `PRD-AUT-001` | `MSE-USR-001` | 17 Scope Domains & Scope Intersection |
| **URPA-CMD-001, URPA-CMD-002** | `PRD-CMD-003`, `PRD-SAF-001` | `MSE-CMD-001` | Engine Disable & Device Command Authority |
| **URPA-SUP-001** | `PRD-SUP-001`, `PRD-SUP-002` | `MSE-SUP-001`, `MSE-SUP-002` | Support Diagnostics & Temporary Grant |
| **URPA-RSC-001** | `PRD-RSC-001`, `PRD-RSC-002` | `MSE-RSC-001`, `MSE-RSC-002` | Rescue Incident Tracking & Prompt Revoke |
| **URPA-TECH-001** | `PRD-INS-001`, `PRD-SRV-001` | `MSE-INS-001` | Technician Work-Order Bounded Access |
| **URPA-MED-001, URPA-MED-002** | `PRD-VOC-001`, `PRD-VID-001` | `MSE-VOC-001`, `MSE-VID-001` | 4 Voice Modes & Video Access Segregation |
| **URPA-DEV-001** | `PRD-DKR-001`, `PRD-DKR-002` | `MSE-DEV-001`, `MSE-DEV-002` | Device Knowledge Registry Verification |
| **URPA-REG-001, URPA-INT-001** | `PRD-REG-001`, `PRD-ITG-001` | `MSE-REG-001`, `MSE-ITG-001` | Regulatory & Integration Lifecycle IAM |
| **URPA-DMO-001** | `PRD-DMO-001`, `PRD-DMO-002` | `MSE-DMO-001` | Full Product Demo Sandbox Isolation |
| **URPA-SOD-001, URPA-SOD-002** | `PRD-AUT-001` | `MSE-ADM-001` | Segregation of Duties & No Self-Elevation |
| **URPA-AUD-001 to URPA-AUD-003** | `PRD-AUD-002` | `MSE-AUD-001` | Immutable IAM Audit Logging |
| **URPA-NFR-001 to URPA-NFR-004** | `PRD-NFR-001` to `PRD-NFR-004`| `MSE-NFR-001` to `MSE-NFR-004`| Non-Functional Security & Performance |

---

## 96. OPEN ITEMS

The following open decisions from approved `PRODUCT_REQUIREMENTS.md` v1.0 and `MODULE_SERVICE_ENTITLEMENT_SPEC.md` v1.0 are carried forward without premature resolution:

| Decision ID | Subject / Topic | Upstream Baseline Status | Status in this Specification |
| :--- | :--- | :--- | :--- |
| **DEC-005** | Support Location Grant Workflow & Exact Duration | Configurable (Ticket-scoped, explicit grant, auto-expiry) | Enforced as time-limited + configurable workflow. |
| **DEC-006** | Rescue Operating Model & Dispatch Partnership | TBD / Configurable by operational policy | Enforced as active-incident scoped + prompt revocation. |
| **DEC-014** | Production AI Sensitive Data Implementation Policy | Zero customer PII/telemetry to cloud AI | Strict AI authority boundary enforced. |

---

## 97. BLOCKING QUESTIONS

> **Zero Blocking Questions.**  
All role personas, permission tokens, scope intersections, temporary grant workflows, and safety gates are fully specified based on approved `PRODUCT_REQUIREMENTS.md` v1.0 and `MODULE_SERVICE_ENTITLEMENT_SPEC.md` v1.0.

---

## 98. SPECIFICATION VERDICT

> # **USER ROLES & ACCESS APPROVED — AUTHORITATIVE BASELINE**

This authoritative downstream specification strictly adheres to approved Product Requirements Document v1.0 (`abef605`) and Module & Service Entitlement Specification v1.0 (`a962a2a`), formalizes the complete RBAC, scoping, temporary access, and command safety authorization model, and is formally approved as the authoritative downstream specification baseline for User Roles, Permissions, Authority & Access.
