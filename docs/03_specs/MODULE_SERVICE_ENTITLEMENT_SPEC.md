# Module & Service Entitlement Specification

**Status:** APPROVED  
**Version:** 1.0  
**Approved Date:** 2026-08-28  
**Product:** Vehicle Tracking Standalone Launch  
**Product Name:** TBD  
**Temporary Working Name:** EasyTracker  
**Authoritative Upstream:** `docs/03_specs/PRODUCT_REQUIREMENTS.md` v1.0 (Commit `abef605`)  
**Upstream Approval Commit:** `abef605`  
**Approval Basis:** Independent senior review completed, focused corrections applied, and focused final re-review passed with zero blocking findings.  
**Authority Status:** APPROVED DOWNSTREAM SPECIFICATION  
**Purpose:** Define authoritative module, service, subscription, entitlement, device capability and managed-service availability rules without replacing RBAC, device capability verification or safety policy.

---

## 1. DOCUMENT CONTROL

| Property | Specification |
| :--- | :--- |
| **Document Title** | Module & Service Entitlement Specification |
| **Document Identifier** | `docs/03_specs/MODULE_SERVICE_ENTITLEMENT_SPEC.md` |
| **Version** | `1.0` |
| **Status** | APPROVED |
| **Approved Date** | `2026-08-28` |
| **Product Brand** | TBD (Temporary Working Name: EasyTracker) |
| **Project Context** | Standalone Vehicle Tracking Launch (with future Agency SaaS vertical alignment) |
| **Active Development Branch** | `vehicle-tracking-launch-v1` |
| **Authoritative Upstream PRD** | `docs/03_specs/PRODUCT_REQUIREMENTS.md` v1.0 (Commit `abef605`) |
| **Upstream Approval Commit** | `abef605` |
| **Approval Basis** | Independent senior review completed, focused corrections applied, and focused final re-review passed with zero blocking findings. |
| **Authority Status** | APPROVED DOWNSTREAM SPECIFICATION |
| **Reconciliation Audit Reference**| `docs/02_audit/VEHICLE_TRACKING_REQUIREMENT_RECONCILIATION_AUDIT_V0_1.md` v1.0 (Commit `a50486b`) |
| **Authority Precedence Index** | `docs/DOCUMENT_AUTHORITY_INDEX.md` |

---

## 2. PURPOSE

- **MSE-GEN-001 (Purpose Statement):** This specification defines the authoritative rules, governance models, and validation logic that determine how modules, services, telematics features, and operational workflows become commercially, technically, and safely available to tenants, customers, devices, and users across the Vehicle Tracking platform.

---

## 3. SCOPE

- **MSE-GEN-002 (In-Scope Capabilities):** This specification governs:
  - The 6-layer governing feature availability formula.
  - Multi-tenant entitlement boundaries and modular B2B service ownership modes (`DISABLED`, `TENANT_MANAGED`, `SAAS_MANAGED`, `HYBRID`).
  - Customer subscription lifecycles, plan downgrades, suspensions, and feature gating.
  - Device capability gating driven by the Device Knowledge Registry.
  - Command safety gating, voice mode gating, and capability-driven video gating.
  - Modular pack availability (Fleet Core, Public Transport, Cargo, Courier, Corporate Fleet).
  - Module catalogues, capability matrices, dependency rules, and readiness classifications.

---

## 4. OUT OF SCOPE

- **MSE-GEN-003 (Explicit Exclusions):** This specification SHALL NOT define:
  - Commercial retail pricing, subscription fee slabs, or discount matrices (PRD `DEC-004`).
  - Concrete database schemas, SQL DDL, or table column definitions.
  - Detailed low-level REST API payload schemas or RPC signatures.
  - User-level granular Permission Token matrices (reserved for `USER_ROLES_PERMISSIONS_SPEC.md`).
  - Frontend UI component wireframes, CSS styling, or visual layouts.
  - Physical cloud deployment topology, Dockerfiles, or Kubernetes manifests.

---

## 5. AUTHORITY & SOURCE BASIS

- **MSE-GEN-004 (Governing Precedence):** In accordance with `docs/DOCUMENT_AUTHORITY_INDEX.md`, this specification adheres strictly to the following authority order:
  1. Approved `docs/03_specs/PRODUCT_REQUIREMENTS.md` v1.0 (Commit `abef605`).
  2. Approved `docs/02_audit/VEHICLE_TRACKING_REQUIREMENT_RECONCILIATION_AUDIT_V0_1.md` v1.0 (Commit `a50486b`).
  3. `docs/01_working_requirements/VEHICLE_TRACKING_LAUNCH_REQUIREMENTS_WORKING_BASELINE_V0_4.md`.
  4. Legacy authority documents (`PRODUCT_MASTER_INSTRUCTION.md`, `PRODUCT_REQUIREMENTS_DOCUMENT.md`).
  5. Implementation codebase (strictly as implementation evidence, never authority).

---

## 6. DEFINITIONS

- **Platform Capability:** An intrinsic technical feature, service, or integration supported by the deployed SaaS software build.
- **Tenant Entitlement:** The authoritative set of modules and commercial limits granted to a specific B2B organization or operational tenant.
- **Customer Subscription:** The commercial agreement and active service plan purchased by an individual or business account within a tenant.
- **User Authorization / Scope:** The role, permission tokens, and organizational data boundary assigned to an individual user identity.
- **Device Capability:** The physical hardware and firmware capabilities verified for a specific device in the Device Knowledge Registry.
- **Safety / Workflow Policy:** Deterministic runtime rules, thresholds, and confirmation protocols that protect physical safety and legal compliance.

---

## 7. GOVERNING FEATURE AVAILABILITY FORMULA

- **MSE-ENT-001 (The 6-Layer Availability Formula):** Every request to display, access, or execute any platform feature, telematics stream, or device command MUST evaluate the governing formula:
  $$\text{Feature Available} = \text{Platform Capability} \land \text{Tenant Entitlement} \land \text{Customer Subscription} \land \text{User Permission / Scope} \land \text{Device Capability} \land \text{Safety / Workflow Policy}$$
- **MSE-ENT-002 (Fail-Closed Layer Rule):** If any single layer in the formula evaluates to false, the system MUST fail closed (deny access). No lower layer MAY override a denied higher layer under any operational condition.

---

## 8. ENTITLEMENT VS AUTHORIZATION

- **MSE-ENT-003 (Separation of Concerns):**
  - **Entitlement** answers: *“Is this module or service commercially, organizationally, and technically available to this tenant, customer, and vehicle?”*
  - **Authorization** answers: *“Is this authenticated user permitted to perform this specific action within this organizational and data scope?”*
- **MSE-ENT-004 (Prohibition of Plan Logic in RBAC):** Commercial subscription tiers, billing add-ons, and device capabilities SHALL NOT be conflated directly into user role definitions; RBAC evaluates user rights only within the boundaries of active entitlements.

---

## 9. ENTITLEMENT HIERARCHY

- **MSE-ENT-005 (The 6 Evaluation Levels):**
  - **Level 1 (Platform Capability):** Global software availability. Managed by SaaS Platform Owner.
  - **Level 2 (Tenant Entitlement):** Organization-level commercial provisioning. Managed by Platform Admin.
  - **Level 3 (Customer Subscription):** Account-level plan and add-ons. Managed by Tenant Admin or Customer Purchase.
  - **Level 4 (User Permission / Scope):** Individual role and data domain. Managed by Tenant / Organization Admin.
  - **Level 5 (Device Capability):** Hardware and protocol validation. Managed by Device Knowledge Registry.
  - **Level 6 (Safety / Workflow Policy):** Runtime guardrails and state verification. Evaluated deterministically by the Core Safety Engine.

---

## 10. PLATFORM CAPABILITY

- **MSE-CAP-001 (Platform Capability States):** Every module at the platform level MUST hold one of the following states:
  - `AVAILABLE`: Fully implemented, verified, and operational in the deployment.
  - `DISABLED`: Temporarily disabled globally by the platform operator.
  - `PLANNED`: Architectural placeholder reserved for post-launch releases.
  - `DEPENDENCY_BLOCKED`: Requires an external dependency (e.g. telecom API) not yet available.
  - `VERIFICATION_REQUIRED`: Blocked pending statutory legal or regulatory verification.
- **MSE-CAP-002 (Absolute Boundary):** Features marked `DISABLED`, `PLANNED`, `DEPENDENCY_BLOCKED`, or `VERIFICATION_REQUIRED` SHALL NOT be unlocked by any tenant entitlement or customer subscription.

---

## 11. TENANT ENTITLEMENT

- **MSE-TEN-001 (Server-Authoritative Tenant Grants):** Tenant entitlements MUST be validated server-side for every API request; client-side route guards alone SHALL NOT constitute entitlement enforcement.
- **MSE-TEN-002 (Tenant Admin Scope Limitation):** A Tenant Admin MAY configure customer offerings and user access ONLY within the modules and quota limits provisioned in the tenant's active entitlement. Tenant Admins SHALL NOT grant un-entitled modules.

---

## 12. CUSTOMER SUBSCRIPTION

- **MSE-SUB-001 (Subset Rule):** A customer account's active subscription MUST be a subset of the parent tenant's active entitlement.
- **MSE-SUB-002 (Multi-Vehicle Heterogeneous Subscriptions):** An account managing multiple vehicles MUST be permitted to assign different subscription packages (e.g. Basic Tracking for Bike A, Advanced Security + Video for Car B) to different vehicles within the same account.

---

## 13. DIRECT CUSTOMER MODEL

- **MSE-DIR-001 (Consistent Direct Governance):** Retail customers served directly by the SaaS platform MUST be governed by the identical 6-layer entitlement formula:
  $$\text{Platform Capability} \longrightarrow \text{Direct Tenant Entitlement} \longrightarrow \text{Retail Customer Subscription} \longrightarrow \text{User Scope} \longrightarrow \text{Device Capability} \longrightarrow \text{Safety Policy}$$
  Direct customer channels SHALL NOT bypass any security, capability, or safety validation layer.

---

## 14. B2B MODULAR SERVICE MODEL

- **MSE-B2B-001 (Independent Operational Pillars):** B2B GPS/VTS tenants MUST be able to independently select between self-managed and SaaS-managed operations across the core functional pillars:
  1. Hardware Supply (Tenant-Sourced vs. SaaS-Supplied).
  2. Telecom M2M SIMs (Tenant-Contracted vs. SaaS-Managed).
  3. Tracking Server Infrastructure (Tenant-Owned Traccar vs. SaaS Ingest Gateway).
  4. Sales & Customer Acquisition (Tenant Sales Force vs. SaaS Store Funnel).
  5. Technical Support & Helpdesk (Tenant Support Agents vs. SaaS Tier-1 Helpdesk).
  6. Emergency Roadside Rescue (Tenant Field Team vs. SaaS Rescue Network).

---

## 15. MANAGED SERVICE MODES

- **MSE-MOD-001 (Operational Service Modes):** Operational service modules (Support, Rescue, Sales, Installation, SIM Management, Device ERP) MUST operate in one of four explicit modes:
  - `DISABLED`: Service is completely inactive for the tenant.
  - `TENANT_MANAGED`: The tenant executes the service using its own authorized staff.
  - `SAAS_MANAGED`: The SaaS operator provides the operational service under a commercial SLA.
  - `HYBRID`: Responsibilities are split (e.g. SaaS handles Tier-1 intake; Tenant handles field dispatch).

---

## 16. TRACKING SERVICE ENTITLEMENT

- **MSE-TRK-001 (Live Telematics Prerequisites):** Live tracking for a vehicle SHALL be operational only when:
  Platform Tracking is `AVAILABLE` $\land$ Tenant Tracking is `ENTITLED` $\land$ Vehicle Subscription is `ACTIVE` $\land$ User has vehicle scope $\land$ Device is registered with an active tracking provider $\land$ Device is not suspended.
- **MSE-TRK-002 (Provider Outage Handling):** Temporary tracking provider downtime SHALL display a `TELEMETRY STALE` badge and SHALL NOT silently fall back to simulated demo data.

---

## 17. MULTI-PROVIDER ENTITLEMENT

- **MSE-PRV-001 (Granular Provider Routing):** The entitlement engine MUST support routing telemetry through different Tracking Providers assigned at the Tenant, Account, Fleet Group, or Individual Device level.
- **MSE-PRV-002 (Provider Credential Protection):** Subscribing to tracking service SHALL NEVER expose tracking provider master tokens or Traccar admin credentials to end customers or tenant users.

---

## 18. FLEET PACK ENTITLEMENT

- **MSE-FLT-001 (Modular Pack Gating):** Specialized fleet capabilities MUST be gated into distinct entitlement modules:
  - `FLEET_CORE`: Shared fleet foundation (Groups, Driver rosters, Mileage, Geofences, Maintenance).
  - `PUBLIC_TRANSPORT`: Transit stations, routes, fares, counter dispatch, supervisor counter stepper, driver cockpit.
  - `CARGO_LOGISTICS`: Waypoints, cargo milestones, e-lock monitoring, trip manifests.
  - `COURIER_DELIVERY`: Rider tasks, route compliance, cash-on-delivery tracking readiness.
  - `CORPORATE_FLEET`: Department cost centers, vehicle booking requests, driver whitelists.
- **MSE-FLT-002 (No Forced Bloat):** General fleet operators subscribing only to `FLEET_CORE` SHALL NOT see irrelevant public transport counter or courier dispatch interfaces.

---

## 19. PUBLIC TRANSPORT ENTITLEMENT

- **MSE-TRN-001 (Transit Workflow Activation):** When `PUBLIC_TRANSPORT` is entitled and subscribed, the system MUST activate:
  - Station & Counter Management (`PRD-TRN-001`, `PRD-TRN-002`).
  - Onboard Supervisor Big-Touch Passenger Stepper (`PRD-TRN-003`).
  - Driver Digital Cockpit HUD (`PRD-TRN-004`).
  - Departure Clearance Gatepasses (`PRD-TRN-002`).
- **MSE-TRN-002 (Configurable Vehicle Capacity):** Passenger seat limits MUST derive dynamically from the specific vehicle profile in the Vehicle Knowledge Registry; hardcoding a universal 40-seat capacity is STRICTLY PROHIBITED.

---

## 20. DEVICE CAPABILITY GATING

- **MSE-DEV-001 (Registry-Driven Hardware Gating):** Device-dependent features (relay cut, GPS wakeup, USSD, battery voltage, analog fuel, microphone, speaker, camera) MUST be gated strictly by verified capabilities recorded in the Device Knowledge Registry.
- **MSE-DEV-002 (Unknown / Unverified Device Capability Gating):** Unknown or unverified technical device capabilities MUST NOT automatically unlock sensitive or device-dependent features (including engine control, relay commands, voice monitoring, audio recording, live audio, two-way intercom, camera feeds, event video, unsupported sensors, or sensitive configuration commands); these features MUST fail closed until verified. However, an incomplete Device Capability Registry profile SHALL NOT prohibit safely parsed basic telemetry ingest (such as position, timestamp, basic speed, and baseline status) when reliably received and understood by the configured tracking provider/protocol integration. Telemetry Ingest Confidence remains distinct from Verified Advanced Device Capability.

---

## 21. VOICE ENTITLEMENT

- **MSE-VOC-001 (Independent Voice Capability Entitlements):** The system MUST evaluate each voice mode as an independent entitlement:
  1. `voice_call_monitoring` (Requires tracker microphone + authorized caller whitelist).
  2. `audio_recording` (Requires onboard audio storage + event audio trigger).
  3. `live_audio_stream` (Requires bidirectional data stream + audio codec support).
  4. `two_way_audio` (Requires cabin microphone + cabin speaker + intercom entitlement).
- **MSE-VOC-002 (Consent & Privacy Gating):** Voice features SHALL NOT be enabled without explicit tenant compliance certification under applicable Bangladesh privacy laws (`PRD-VOC-002`).

---

## 22. VIDEO / CAMERA ENTITLEMENT

- **MSE-VID-001 (Capability-Driven Video Services):** Video service features MUST be independently gated:
  - `live_video` $\longrightarrow$ Dashcam RTSP/WebRTC stream capability.
  - `snapshot_on_demand` $\longrightarrow$ Still image capture protocol capability.
  - `event_crash_video` $\longrightarrow$ Pre/post-buffered crash clip upload capability.
  - `historical_playback` $\longrightarrow$ Remote SD card/MDVR query capability.
  - `multi_camera` $\longrightarrow$ Multi-channel video feed support.
  - `evidence_export` $\longrightarrow$ Authorized administrative cryptographic export permission.

---

## 23. ENGINE CONTROL ENTITLEMENT

- **MSE-CMD-001 (Multi-Layer Engine Cut Gating):** Commercial entitlement alone SHALL NEVER execute an engine cut command. Execution MUST satisfy all required safety layers (`PRD-SAF-001`):
  1. Platform Relay Capability `AVAILABLE`.
  2. Tenant Engine Cut `ENTITLED`.
  3. Customer Subscription `ACTIVE` (where commercially controlled).
  4. User holds verified `ENGINE_CUT` permission within the target vehicle's scope.
  5. Device Knowledge Registry confirms verified hardware relay wiring and command capability.
  6. Applicable Safe-State / Command Safety Policy is satisfied (with safe-state conditions evaluated deterministically by the Safety Engine, such as motion state, ignition state, vehicle condition, or policy-configured speed thresholds).
  7. User completes explicit confirmation and satisfies step-up authentication where required by policy (for example, hold-to-confirm interaction and credential/PIN verification).

---

## 24. SUPPORT ENTITLEMENT

- **MSE-SUP-001 (Diagnostic vs. Location Gating):** Support entitlement MUST default strictly to technical diagnostics (`PRD-SUP-001`).
- **MSE-SUP-002 (Temporary Scoped Location Access):** Live location access for support staff SHALL be granted ONLY upon:
  - Active support ticket and verified diagnostic purpose.
  - Explicit authorization through the approved and configured authorization workflow under the applicable consent or legal basis (such as customer authorization, tenant admin grant, or configured operational policy).
  - Time-limited grant with automatic expiration (exact duration configurable / TBD under `DEC-005`).
  - Immutable reason logging and comprehensive security audit trail.

---

## 25. RESCUE ENTITLEMENT

- **MSE-RSC-001 (Active Incident Gating):** Emergency rescue service entitlement MUST grant live location and vehicle controls ONLY to rescue members assigned to an active, open emergency incident (`PRD-RSC-001`).
- **MSE-RSC-002 (Instant Revocation):** When the emergency rescue incident status transitions to `RESOLVED` or `CLOSED`, all rescue access to the vehicle MUST be revoked immediately (`PRD-RSC-002`).

---

## 26. SALES SERVICE ENTITLEMENT

- **MSE-SLS-001 (CRM & Store Gating):** Sales service entitlement grants access to customer CRM, quotations, orders, device compatibility pickers, and sales commission ledgers.
- **MSE-SLS-002 (Location Inaccessibility):** Sales service entitlement SHALL NEVER grant access to live vehicle tracking maps or historical trip logs (`PRD-SLS-002`).

---

## 27. INSTALLATION / TECHNICAL SERVICE ENTITLEMENT

- **MSE-INS-001 (Installation Workflow Gating):** Technician service entitlement grants access to installation checklists, device wiring verification, sensor calibration, and initial activation handshakes scoped strictly to assigned service orders.

---

## 28. SIM / M2M ENTITLEMENT

- **MSE-SIM-001 (SIM ERP Gating):** SIM / M2M operations entitlement grants access to SIM inventory, APN management, recharge ledgers, pooled plan tracking, and operator invoice reconciliation.

---

## 29. DEVICE / INVENTORY ENTITLEMENT

- **MSE-INV-001 (Hardware ERP Gating):** Device inventory entitlement grants access to serialized IMEI tracking, supplier batches, spare parts stock, warranty ledgers, and serialized RMA return workflows.

---

## 30. REFERRAL ENTITLEMENT

- **MSE-REF-001 (Refer-and-Earn Gating):** Referral entitlement enables customer referral code generation, link sharing, and cashback ledgers, strictly segregated from sales commission and dealer margin ledgers (`PRD-REF-004`).

---

## 31. AI FEATURE ENTITLEMENT

- **MSE-AI-001 (AI Capability Gating):** AI entitlement enables natural-language explanations, maintenance extraction, and recommendation assistance via the provider-abstracted AI Orchestrator.
- **MSE-AI-002 (Authority Lockdown):** AI entitlement SHALL NOT grant external AI models authority to bypass permissions, guess hardware capabilities, alter safety policies, or access customer PII/live telemetry (`PRD-AI-004`).

---

## 32. REGULATORY KNOWLEDGE ENTITLEMENT

- **MSE-REG-001 (Compliance Knowledge Gating):** Regulatory Knowledge entitlement enables viewing official BRTA, BTRC, and Police circulars and rule update notifications. Unverified regulatory updates SHALL NOT automatically alter operational tracking rules (`PRD-REG-002`).

---

## 33. DEMO MODE

- **MSE-DMO-001 (Complete Isolation):** Demo entitlement enables access to interactive Web and Mobile demo simulations with simulated routes. Demo mode MUST be completely isolated from production databases and SHALL NEVER control real vehicles (`PRD-DMO-002`).

---

## 34. TRIAL ENTITLEMENT

- **MSE-TRL-001 (Time-Limited Trial Gating):** Trial entitlements MUST enforce:
  - Authoritative start and expiration timestamps.
  - Quota caps on active vehicles, tracking frequency, and media storage.
  - Restriction of high-risk commands (e.g. engine cut disabled in trial).
  - Automatic expiration and seamless conversion to paid subscription.

---

## 35. MODULE DEPENDENCIES

- **MSE-DEP-001 (Dependency Validation Rules):** Modules with upstream prerequisites MUST NOT be activated unless their prerequisite dependencies are satisfied:
  - `PUBLIC_TRANSPORT` $\longrightarrow$ **REQUIRED:** `FLEET_CORE` (shared common fleet capability foundation; does not automatically dictate commercial package pricing).
  - `CARGO_LOGISTICS` $\longrightarrow$ **REQUIRED:** `FLEET_CORE` (shared common fleet capability foundation; does not automatically dictate commercial package pricing).
  - `COURIER_DELIVERY` $\longrightarrow$ **REQUIRED:** `FLEET_CORE` (shared common fleet capability foundation; does not automatically dictate commercial package pricing).
  - `VIDEO_SERVICES` $\longrightarrow$ **REQUIRED:** Compatible Dashcam/MDVR Hardware Capability.
  - `VOICE_SERVICES` $\longrightarrow$ **REQUIRED:** Compatible Audio Hardware Capability.
  - `ENGINE_CONTROL` $\longrightarrow$ **REQUIRED:** Compatible Relay Hardware Capability + Command Safety Policy.
  - `RESCUE_DISPATCH` $\longrightarrow$ **REQUIRED:** Active Telematics Tracking Ingest.

---

## 36. CORE / OPTIONAL / FUTURE CLASSIFICATION

- **MSE-CLS-001 (Module Scope Classification):**
  1. `CORE_CAPABILITY`: Essential for basic tracking (Ingest, Live Map, History, Trips, Alerts).
  2. `OPTIONAL_MODULE`: Commercial add-ons (Voice, Video, Specialized Fleet Packs, Referral).
  3. `DEVICE_DEPENDENT`: Gated by physical hardware (Relay, Sensors, Camera, Microphone).
  4. `MANAGED_SERVICE`: Available in Tenant-Managed or SaaS-Managed modes (Support, Rescue, Install).
  5. `ARCHITECTURE_READY`: Domain boundaries prepared for future SaaS migration (Shared Billing, Shared CRM).
  6. `DEPENDENCY_BOUND`: Blocked pending external government or telecom verification (BRTA IS Sync, Police 999).

---

## 37. FEATURE VISIBILITY

- **MSE-VIS-001 (UI Visibility States):** User interfaces MUST render controls according to authoritative availability states:
  - `HIDDEN`: Module is un-entitled or irrelevant to customer persona.
  - `VISIBLE_DISABLED`: Feature is entitled but blocked by policy, scope, or device capability (with clear tooltip explanation).
  - `AVAILABLE`: Feature satisfies all 6 layers and is fully actionable.
  - `PENDING_VERIFICATION`: Hardware or integration is undergoing admin verification.

---

## 38. AVAILABILITY REASON MODEL

- **MSE-RSN-001 (Standardized Reason Codes):** When a feature is unavailable, the platform SHOULD provide an informative reason code:
  `NOT_ENTITLED`, `NOT_SUBSCRIBED`, `NO_PERMISSION`, `OUT_OF_SCOPE`, `DEVICE_UNSUPPORTED`, `DEVICE_UNVERIFIED`, `POLICY_BLOCKED`, `DEPENDENCY_UNAVAILABLE`, `SERVICE_SUSPENDED`, or `TRIAL_EXPIRED`.

---

## 39. ENTITLEMENT LIFECYCLE

- **MSE-LFC-001 (State Machine Transitions):** Entitlements and subscriptions MUST transition through:
  $$\text{PROVISIONED} \longrightarrow \text{ACTIVE} \longleftrightarrow \text{SUSPENDED} \longrightarrow \text{EXPIRED} \longrightarrow \text{REVOKED}$$
  Every state transition MUST generate an auditable system event.

---

## 40. EFFECTIVE DATE / EXPIRY

- **MSE-EXP-001 (Temporal Boundary Enforcement):** Entitlements MUST support `effective_from` and `expires_at` timestamps. Expired entitlements MUST immediately transition to inactive status upon timestamp expiration without requiring manual cron triggers.

---

## 41. DOWNGRADE / EXPIRY

- **MSE-DNG-001 (Safe Downgrade Behavior):** When a subscription expires or downgrades:
  - New usage of expired features MUST be blocked immediately.
  - Historical data (trips, alerts, reports) MUST NOT be deleted; it remains governed by data retention policies.
  - High-risk commands MUST be disabled immediately upon entitlement expiration.

---

## 42. SUSPENSION

- **MSE-SUS-001 (Suspension Typology):** The system MUST distinguish between:
  - *Commercial Suspension* (Non-payment of subscription; tracking halted, history preserved).
  - *Security Suspension* (Compromised account or tamper event; access frozen, audit logged).
  - *Operational / Dependency Suspension* (Provider outage; system displays degraded status).

---

## 43. TENANT OVERRIDES

- **MSE-OVR-001 (Tenant Boundary Restriction):** A Tenant Admin MAY restrict or disable entitled modules for specific customer sub-accounts. Tenant Admins SHALL NEVER expand permissions beyond the tenant's platform entitlement.

---

## 44. CUSTOMER OVERRIDES

- **MSE-OVR-002 (Customer Preference Boundaries):** Customer preferences (e.g. opting out of SMS alerts) MAY narrow subscribed services, but SHALL NEVER override device safety limits or administrative suspensions.

---

## 45. USER / ROLE INTERSECTION

- **MSE-USR-001 (Intersection Evaluation):** A user can execute an action ONLY when the customer account holds the active Entitlement AND the user's role holds the active Permission Token within the target vehicle's scope.

---

## 46. DEVICE REPLACEMENT

- **MSE-REP-001 (Dynamic Capability Recalculation):** When a tracker is replaced under RMA, commercial subscriptions remain active, but device-dependent capabilities MUST be re-evaluated immediately against the new device's verified hardware profile (`PRD-DEV-002`).

---

## 47. FIRMWARE / CAPABILITY CHANGE

- **MSE-FIRM-001 (Re-Verification Trigger):** If a device's firmware or protocol is upgraded, capabilities MUST be re-evaluated; any feature that fails verification MUST fail closed immediately.

---

## 48. TRACKING PROVIDER CHANGE

- **MSE-PRVC-001 (Provider Migration Independence):** Migrating a vehicle or fleet from a 3rd-party VTS provider to a self-hosted Traccar node SHALL NOT alter customer subscription records, but provider-specific feature adapters MUST be dynamically updated.

---

## 49. WHITE-LABEL RELATIONSHIP

- **MSE-WHT-001 (Branding Gating):** White-labeling entitlement grants custom domain mapping, branding themes, and logo customization without altering shared platform security, isolation, or multi-tenant codebases (`PRD-WHT-001`).

---

## 50. BILLING / METERING RELATIONSHIP

- **MSE-BIL-001 (Entitlement & Metering Linkage):** The entitlement engine MUST emit usage events (active vehicle counts, video storage consumption, SMS dispatches) to the billing engine for automated invoice generation (`PRD-BIL-001`).

---

## 51. PAYMENT / RENEWAL RELATIONSHIP

- **MSE-PAY-001 (Backend Confirmation Rule):** Entitlement activation or renewal MUST occur ONLY upon authoritative backend payment confirmation; frontend payment gateway callbacks alone SHALL NOT activate entitlements without server validation.

---

## 52. DEMO / TRIAL / CUSTOMER CONVERSION

- **MSE-CONV-001 (Clean Conversion Boundary):** Converting from Demo or Trial to a paid subscription MUST create fresh production identity, billing, and device records; simulated demo data SHALL NEVER be imported into production databases.

---

## 53. AUDIT REQUIREMENTS

- **MSE-AUD-001 (Immutable Entitlement Audit):** Every entitlement grant, revocation, suspension, quota adjustment, and override MUST record: Timestamp, Actor User ID, Target Tenant/Customer ID, Affected Module ID, Previous State, New State, and Operational Justification (`PRD-AUD-002`).

---

## 54. SECURITY REQUIREMENTS

- **MSE-SEC-001 (Server-Authoritative Enforcement):** Entitlement evaluation MUST occur server-side on every request.
- **MSE-SEC-002 (No LocalStorage Security Tokens):** Client-side storage (e.g. `localStorage`) SHALL NEVER be used as the authoritative entitlement store.
- **MSE-SEC-003 (Fail-Closed Default):** Any missing entitlement record or database timeout MUST default to access denied.

---

## 55. OFFLINE / DEGRADED BEHAVIOR

- **MSE-OFF-001 (Offline Security Guardrail):** Mobile apps experiencing cellular disconnection MAY display cached read-only trip summaries, but SHALL NOT permit high-risk command execution or offline entitlement elevation without authoritative server validation.

---

## 56. EXTERNAL DEPENDENCY FAILURE

- **MSE-DEP-002 (Failure Isolation):** External provider outages (e.g. video streaming server downtime) MUST be isolated; the system MUST display degraded service status while keeping unaffected tracking and ERP modules fully operational.

---

## 57. FEATURE MODULE CONTROL

- **MSE-FMC-001 (Hierarchical Feature Control Hierarchy):** The administrative feature control hierarchy MUST follow the descending path:
  $$\text{Platform Admin (Global Capabilities)} \longrightarrow \text{Tenant Admin (Organization Modules)} \longrightarrow \text{Fleet / Account Manager (Service Tiers)} \longrightarrow \text{User Role}$$

---

## 58. CHANNEL / CUSTOMER MODEL CONSISTENCY

- **MSE-CHN-001 (Universal Governance):** All business channels (Direct B2C, Enterprise Fleet, B2B White-Label, Dealer Consignment) MUST be governed by identical entitlement validation rules.

---

## 59. AUTHORITY OWNERSHIP

- **MSE-OWN-001 (Separation of Decision Ownership):**
  - SaaS Platform Owner owns: Platform Capabilities & Global Limits.
  - Tenant Admin owns: Customer Plan Offerings within Entitled Quotas.
  - Device Registry owns: Technical Hardware Feature Truth.
  - Safety Policy Engine owns: High-Risk Command Authorizations.
  - IAM Service owns: User Identity, Roles, and Permissions.

---

## 60. ADMINISTRATIVE CONTROL BOUNDARY

- **MSE-ADM-001 (Prohibition of Privilege Escalation):** Administrative status SHALL NOT grant authority to bypass tenant data boundaries, override hardware physical capabilities, or bypass high-risk command safety policies.

---

## 61. INTEGRATION REGISTRY INTERACTION

- **MSE-ITG-001 (Operational State Requirement):** An external integration (e.g. BRTA IS Sync, Police 999) SHALL be executable only when its Integration Registry status is `ACTIVE` (`PRD-ITG-001`). Commercially entitled integrations with status `PLANNED` or `DOCUMENTATION_PENDING` MUST remain non-executable.

---

## 62. REGULATORY-DEPENDENT FEATURES

- **MSE-REG-002 (Statutory Compliance Gating):** Features with unresolved statutory requirements (e.g. automated law enforcement engine cut) MUST remain disabled in production until official regulatory verification is completed (`PRD-GOV-002`).

---

## 63. MODULE / SERVICE CATALOGUE

| Module / Service ID | Module Name | Category | Applicable Customer Personas | Capability Class | Device Dependent? | Managed Service Modes | Major Prerequisites | Launch Classification | Entitlement Required? | User Permission? | Safety Gate? |
| :--- | :--- | :--- | :--- | :--- | :---: | :--- | :--- | :--- | :---: | :---: | :---: |
| **MOD-TRK-01** | Core Live Tracking | Telematics | All Customers | `CORE_CAPABILITY` | YES | `DISABLED`, `TENANT_MANAGED`, `SAAS_MANAGED` | Ingest Gateway | `LAUNCH_CORE` | YES | YES | NO |
| **MOD-HST-02** | Position History & Trips | Telematics | All Customers | `CORE_CAPABILITY` | YES | `DISABLED`, `TENANT_MANAGED`, `SAAS_MANAGED` | Core Tracking | `LAUNCH_CORE` | YES | YES | NO |
| **MOD-GEO-03** | Geofencing & Corridors | Telematics | All Customers | `CORE_CAPABILITY` | NO | `DISABLED`, `TENANT_MANAGED`, `SAAS_MANAGED` | Core Tracking | `LAUNCH_CORE` | YES | YES | NO |
| **MOD-ALT-04** | Real-Time Alerts & SOS | Safety | All Customers | `CORE_CAPABILITY` | CONDITIONAL | `DISABLED`, `TENANT_MANAGED`, `SAAS_MANAGED` | Ingest Gateway | `LAUNCH_CORE` | YES | YES | YES |
| **MOD-CMD-05** | Remote Engine Immobilizer | Safety | All Customers | `DEVICE_DEPENDENT` | YES | `DISABLED`, `TENANT_MANAGED`, `SAAS_MANAGED` | Device Relay | `LAUNCH_CORE` | YES | YES | **YES** |
| **MOD-FLT-06** | Fleet Core Management | Fleet | Fleets, B2B, Corporate | `OPTIONAL_MODULE` | NO | `DISABLED`, `TENANT_MANAGED`, `SAAS_MANAGED` | Core Tracking | `LAUNCH_CORE` | YES | YES | NO |
| **MOD-TRN-07** | Public Transport Pack | Vertical | Public Transport, B2B | `OPTIONAL_MODULE` | CONDITIONAL | `DISABLED`, `TENANT_MANAGED`, `SAAS_MANAGED` | Fleet Core | `LAUNCH_CANDIDATE_PRIORITY_TBD` | YES | YES | NO |
| **MOD-CRG-08** | Cargo & Logistics Pack | Vertical | Cargo Fleets, B2B | `OPTIONAL_MODULE` | CONDITIONAL | `DISABLED`, `TENANT_MANAGED`, `SAAS_MANAGED` | Fleet Core | `LAUNCH_CANDIDATE_PRIORITY_TBD` | YES | YES | NO |
| **MOD-DEL-09** | Courier & Delivery Pack | Vertical | Courier Fleets, B2B | `OPTIONAL_MODULE` | CONDITIONAL | `DISABLED`, `TENANT_MANAGED`, `SAAS_MANAGED` | Fleet Core | `LAUNCH_CANDIDATE_PRIORITY_TBD` | YES | YES | NO |
| **MOD-COR-10** | Corporate Fleet Pool | Vertical | Corporate Fleets | `OPTIONAL_MODULE` | NO | `DISABLED`, `TENANT_MANAGED`, `SAAS_MANAGED` | Fleet Core | `LAUNCH_CANDIDATE_PRIORITY_TBD` | YES | YES | NO |
| **MOD-VOC-11** | Cabin Voice Monitoring | Media | All Customers | `DEVICE_DEPENDENT` | YES | `DISABLED`, `TENANT_MANAGED`, `SAAS_MANAGED` | Microphone Hardware | `LAUNCH_OPTIONAL` | YES | YES | **YES** |
| **MOD-VID-12** | Dashcam & Event Video | Media | All Customers | `DEVICE_DEPENDENT` | YES | `DISABLED`, `TENANT_MANAGED`, `SAAS_MANAGED` | Camera / MDVR | `LAUNCH_OPTIONAL` | YES | YES | **YES** |
| **MOD-SUP-13** | Customer Support Hub | Operations | All Customers | `MANAGED_SERVICE` | NO | `DISABLED`, `TENANT_MANAGED`, `SAAS_MANAGED`, `HYBRID` | None | `LAUNCH_CORE` | YES | YES | **YES** |
| **MOD-RSC-14** | Emergency Rescue Dispatch | Operations | All Customers | `MANAGED_SERVICE` | CONDITIONAL | `DISABLED`, `TENANT_MANAGED`, `SAAS_MANAGED`, `HYBRID` | Core Tracking | `LAUNCH_CORE` | YES | YES | **YES** |
| **MOD-SIM-15** | SIM / M2M Lifecycle ERP | ERP | B2B, Fleets, Admin | `OPTIONAL_MODULE` | NO | `DISABLED`, `TENANT_MANAGED`, `SAAS_MANAGED`, `HYBRID` | None | `LAUNCH_CORE` | YES | YES | NO |
| **MOD-INV-16** | Hardware Inventory & RMA | ERP | B2B, Dealers, Admin | `OPTIONAL_MODULE` | NO | `DISABLED`, `TENANT_MANAGED`, `SAAS_MANAGED`, `HYBRID` | None | `LAUNCH_CORE` | YES | YES | NO |
| **MOD-REF-17** | Customer Referral Engine | Growth | Individual, B2B | `OPTIONAL_MODULE` | NO | `DISABLED`, `TENANT_MANAGED`, `SAAS_MANAGED` | Customer Store | `LAUNCH_CORE` | YES | YES | NO |
| **MOD-AI-18** | AI Diagnostic Assistant | Intelligence| All Customers | `OPTIONAL_MODULE` | NO | `DISABLED`, `TENANT_MANAGED`, `SAAS_MANAGED` | AI Orchestrator | `LAUNCH_OPTIONAL` | YES | YES | **YES** |
| **MOD-REG-19** | Regulatory Knowledge | Compliance | Fleets, B2B, Admin | `OPTIONAL_MODULE` | NO | `DISABLED`, `TENANT_MANAGED`, `SAAS_MANAGED` | None | `LAUNCH_CORE` | YES | YES | NO |
| **MOD-DMO-20** | Product Demo Simulation | Onboarding | Public / Prospects | `CORE_CAPABILITY` | NO | `DISABLED`, `SAAS_MANAGED` | None | `LAUNCH_CORE` | NO | NO | NO |
| **MOD-GOV-21** | BRTA IS & Police Gateway | GovTech | Fleets, Police | `DEPENDENCY_BOUND`| CONDITIONAL | `DISABLED`, `SAAS_MANAGED` | Official Gov APIs | `DEPENDENCY_BLOCKED`| YES | YES | **YES** |

---

## 64. FEATURE CAPABILITY MATRIX

| Feature Name | Platform Layer | Tenant Entitlement Layer | Customer Subscription Layer | User Permission Layer | Device Capability Layer | Safety Policy Layer |
| :--- | :---: | :---: | :---: | :---: | :---: | :---: |
| **Live Vehicle Tracking** | `AVAILABLE` | Required | Required | `VIEW_LOCATION` | GPS Fix Active | Stale Data Check |
| **Historical Route Playback** | `AVAILABLE` | Required | Required | `VIEW_HISTORY` | Standard GNSS | Retention Policy Check |
| **Remote Engine Immobilization** | `AVAILABLE` | Required | Required | `ENGINE_IMMOBILIZE` | **Verified Relay** | **Safe-State Policy Satisfied + Step-up Auth** |
| **One-Way Voice Monitoring** | `AVAILABLE` | Required | Required | `VOICE_MONITOR` | **Microphone Hardware** | **Privacy Legal Consent** |
| **Two-Way Cabin Intercom** | `AVAILABLE` | Required | Required | `INTERCOM_SPEAK` | **Mic + Speaker** | **Privacy Legal Consent** |
| **Live Dashcam Video Streaming** | `AVAILABLE` | Required | Required | `STREAM_VIDEO` | **RTSP / WebRTC Cam** | Bandwidth / Storage Policy |
| **Crash Video Clip Download** | `AVAILABLE` | Required | Required | `EXPORT_MEDIA` | **MDVR / SD Storage** | **Chain-of-Custody Audit** |
| **Public Transit Departure Gatepass**| `AVAILABLE`| Required | Required | `GATEPASS_ISSUE` | None | Station Schedule Match |
| **Conductor Passenger Stepper** | `AVAILABLE` | Required | Required | `SUPERVISOR_STEPPER`| None | Configured Capacity Cap |
| **Support Temporary Live Location**| `AVAILABLE` | Required | N/A | `SUPPORT_DIAGNOSTICS`| None | **Active Ticket + Explicit Grant + Auto-Expiry** |
| **Emergency Rescue Field Tracking**| `AVAILABLE` | Required | Optional | `RESCUE_RESPOND` | None | **Active Incident Assignment** |
| **Referral Reward Wallet** | `AVAILABLE` | Required | Required | `VIEW_REWARDS` | None | Anti-Fraud Validation |

---

## 65. MODULE DEPENDENCY MATRIX

| Module Identifier | Target Module | Upstream Prerequisite | Dependency Type | Rationale |
| :--- | :--- | :--- | :---: | :--- |
| **DEP-01** | `PUBLIC_TRANSPORT` | `FLEET_CORE` | **REQUIRED** | Common technical Fleet foundation dependency (does not dictate commercial package pricing). |
| **DEP-02** | `CARGO_LOGISTICS` | `FLEET_CORE` | **REQUIRED** | Common technical Fleet foundation dependency (does not dictate commercial package pricing). |
| **DEP-03** | `COURIER_DELIVERY` | `FLEET_CORE` | **REQUIRED** | Common technical Fleet foundation dependency (does not dictate commercial package pricing). |
| **DEP-04** | `CORPORATE_FLEET` | `FLEET_CORE` | **REQUIRED** | Common technical Fleet foundation dependency (does not dictate commercial package pricing). |
| **DEP-05** | `ENGINE_IMMOBILIZE` | `DEVICE_RELAY_CAPABILITY` | **REQUIRED** | Engine cut cannot physically execute without verified hardware relay wiring. |
| **DEP-06** | `DASHCAM_VIDEO` | `DEVICE_CAMERA_CAPABILITY`| **REQUIRED** | Video feeds require verified MDVR/camera hardware profiles. |
| **DEP-07** | `VOICE_MONITORING` | `DEVICE_MIC_CAPABILITY` | **REQUIRED** | Audio features require verified microphone hardware profiles. |
| **DEP-08** | `RESCUE_DISPATCH` | `CORE_LIVE_TRACKING` | **CONDITIONAL** | Field rescue requires real-time vehicle coordinates for navigation. |
| **DEP-09** | `CUSTOMER_REFERRALS`| `CUSTOMER_STORE` | **OPTIONAL** | Referral codes link directly to store checkout and device purchase flows. |
| **DEP-10** | `AI_ASSISTANT` | `AI_ORCHESTRATOR` | **REQUIRED** | AI assistance requires an active, provider-abstracted AI backend service. |

---

## 66. MANAGED SERVICE MODE MATRIX

| Operational Area | `DISABLED` Supported? | `TENANT_MANAGED` Supported? | `SAAS_MANAGED` Supported? | `HYBRID` Supported? | Primary Business Context |
| :--- | :---: | :---: | :---: | :---: | :--- |
| **Sales & Onboarding** | YES | YES | YES | YES | Tenant sales force vs. SaaS online store. |
| **Tier-1 Customer Support** | YES | YES | YES | YES | Tenant helpdesk vs. SaaS 24/7 support. |
| **Emergency Field Rescue** | YES | YES | YES | YES | Tenant roadside crew vs. SaaS rescue network. |
| **Technician Installation** | YES | YES | YES | YES | Tenant workshop vs. SaaS certified installer network. |
| **SIM / M2M Operations** | YES | YES | YES | YES | Tenant telecom contract vs. SaaS managed M2M SIMs. |
| **Hardware Procurement / RMA**| YES | YES | YES | YES | Tenant own inventory vs. SaaS supplied hardware. |

---

## 67. LAUNCH READINESS CLASSIFICATION

- **`LAUNCH_CORE` (Must be active day-one):**
  - Core Telematics (Ingest, Live Map, History, Trips, Geofences, Alerts).
  - Multi-Provider Ingestion Control Plane (3rd-Party Push & Pull).
  - Device Knowledge Registry & Capability Gating.
  - Vehicle Knowledge Registry.
  - Multi-Tenant Isolation & Server-Side Entitlement Engine.
  - Multi-Stage Command Safety Engine.
  - Customer Acquisition Store & Referral Ledgers.
  - Isolated Web & Mobile Product Demo.
  - Bangla & English Localization.
- **`LAUNCH_OPTIONAL / COMMERCIAL ADD-ONS`:**
  - One-Way Voice Monitoring & Dashcam Event Video (`LAUNCH_OPTIONAL`).
  - AI Diagnostic Assistant via AI Orchestrator (`LAUNCH_OPTIONAL`).
  - Specialized Fleet Packs (`LAUNCH CANDIDATE / COMMERCIAL — PRIORITY TBD` under PRD `DEC-007`):
    - Public Transport Pack (Transit counters, gatepasses, conductor stepper, driver cockpit).
    - Cargo & Logistics Pack.
    - Courier & Delivery Pack.
    - Corporate Fleet Pool Pack.
- **`POST_LAUNCH_PLANNED` (Architecture-ready; rollout post-launch):**
  - Self-Hosted Native Traccar Cluster Nodes.
  - Advanced Multi-Camera Live Streaming & Two-Way Cabin Intercom.
  - Dedicated White-Label Mobile Application Builds.
- **`DEPENDENCY_BLOCKED` (Awaiting official government verification):**
  - Automated BRTA IS Vehicle Fitness & Tax Token Sync.
  - Law Enforcement 999 Police Gateway Direct Dispatch.

---

## 68. OPEN ITEMS

The following 14 open items from approved `PRODUCT_REQUIREMENTS.md` v1.0 are carried forward without arbitrary resolution:

| Decision ID | Subject / Topic | Upstream PRD Baseline | Status in this Specification |
| :--- | :--- | :--- | :--- |
| **DEC-001** | Final Commercial Product Brand | Temporary working name: EasyTracker; Brand TBD | Preserved as brand-configurable. |
| **DEC-002** | Initial 3rd-Party VTS Provider | TBD (Candidate examples: GP IoT, Robi, Bondstein) | Provider-agnostic control plane. |
| **DEC-003** | Initial Hardware Device Catalogue | TBD (S102A is pilot evidence; catalogue verified via Registry) | Gated by Device Knowledge Registry. |
| **DEC-004** | Subscription Package Pricing & Slabs | TBD / Configurable per tenant and market policy | Engine supports configurable tiers. |
| **DEC-005** | Support Location Grant Exact Duration | Configurable (Ticket-scoped, explicit grant, auto-expiry) | Enforced as time-limited + auto-expiry. |
| **DEC-006** | Rescue Field Operating Model | TBD / Configurable by tenant operational policy | Supported in all 4 service modes. |
| **DEC-007** | Fleet Pack Launch Rollout Order | TBD based on initial anchor customer demand | Pack availability modularly decoupled. |
| **DEC-008** | Payment Gateway Provider Selection | TBD / Candidate selection | Payment abstraction layer supported. |
| **DEC-009** | Telemetry Raw Data Retention Duration | TBD + Statutory legal/privacy verification required | Configurable retention classes. |
| **DEC-010** | Crash Video Clip Retention Duration | TBD + Statutory legal/privacy verification required | Configurable retention classes. |
| **DEC-011** | Cabin Voice Recording Retention | TBD + Statutory legal/privacy verification required | Configurable retention classes. |
| **DEC-012** | Regulatory Monitoring Cadence | Configurable (Periodic automated scan + event trigger) | Architecture-ready compliance scanner. |
| **DEC-013** | Initial Vehicle Seed Catalogue Scope | TBD based on initial target customer segments | Vehicle Knowledge Registry extensible. |
| **DEC-014** | Production AI Sensitive Data Policy | Zero PII / live telemetry sent to free cloud AI models | Strict AI privacy boundaries enforced. |

---

## 69. REQUIREMENT TRACEABILITY

| Specification Requirement ID | Upstream PRD Requirement ID(s) | Primary Subject Covered |
| :--- | :--- | :--- |
| **MSE-GEN-001 to MSE-GEN-004** | `PRD-GEN-001`, `PRD-GEN-002` | Document Control, Scope & Authority Precedence |
| **MSE-ENT-001, MSE-ENT-002** | `PRD-ENT-001`, `PRD-ENT-002` | Governing 6-Layer Availability Formula |
| **MSE-ENT-003 to MSE-ENT-005** | `PRD-AUT-001`, `PRD-AUT-002` | Entitlement vs. Authorization & 6 Levels |
| **MSE-CAP-001, MSE-CAP-002** | `PRD-GOL-001`, `PRD-LCH-001` | Platform Capability States & Absolute Boundaries |
| **MSE-TEN-001, MSE-TEN-002** | `PRD-TEN-001`, `PRD-TEN-003` | Server-Authoritative Tenant Entitlements |
| **MSE-SUB-001, MSE-SUB-002** | `PRD-SUB-001`, `PRD-CUST-002` | Customer Subscriptions & Multi-Vehicle Packaging |
| **MSE-DIR-001** | `PRD-CUST-001`, `PRD-PUR-001` | Direct Customer Governance Consistency |
| **MSE-B2B-001, MSE-MOD-001** | `PRD-TEN-002`, `PRD-CUST-008` | Modular B2B Service Models & 4 Service Modes |
| **MSE-TRK-001, MSE-TRK-002** | `PRD-TRK-001`, `PRD-PRV-001` | Live Telematics Ingest Gating & Outage Safety |
| **MSE-PRV-001, MSE-PRV-002** | `PRD-PRV-002`, `PRD-PRV-004` | Multi-Provider Assignment & Credential Vaults |
| **MSE-FLT-001, MSE-FLT-002** | `PRD-FLT-001`, `PRD-COR-001` | Modular Fleet Pack Gating (Core, Cargo, Courier) |
| **MSE-TRN-001, MSE-TRN-002** | `PRD-TRN-001` to `PRD-TRN-005` | Public Transport Pack & Capacity Dynamics |
| **MSE-DEV-001, MSE-DEV-002** | `PRD-DKR-001` to `PRD-DKR-003` | Device Capability Registry Gating & Unknown Lockdown |
| **MSE-VOC-001, MSE-VOC-002** | `PRD-VOC-001`, `PRD-VOC-002` | 4 Distinct Voice Entitlements & Privacy Gating |
| **MSE-VID-001** | `PRD-VID-001`, `PRD-MED-001` | Capability-Driven Video Services & Cryptographic Seals |
| **MSE-CMD-001** | `PRD-CMD-003`, `PRD-SAF-001` | 7-Layer Remote Engine Immobilizer Safety Gating |
| **MSE-SUP-001, MSE-SUP-002** | `PRD-SUP-001`, `PRD-SUP-002` | Support Diagnostics vs. Ticket-Scoped Location |
| **MSE-RSC-001, MSE-RSC-002** | `PRD-RSC-001`, `PRD-RSC-002` | Emergency Rescue Incident-Scoped Gating & Auto-Revoke |
| **MSE-SLS-001, MSE-SLS-002** | `PRD-SLS-001`, `PRD-SLS-002` | Sales CRM Gating & Live Location Inaccessibility |
| **MSE-INS-001** | `PRD-INS-001`, `PRD-SRV-001` | Field Installation & Technician Service Gating |
| **MSE-SIM-001** | `PRD-SIM-001`, `PRD-SIM-002` | Telecom SIM / M2M Lifecycle ERP Gating |
| **MSE-INV-001** | `PRD-INV-001`, `PRD-RMA-001` | Hardware Inventory, Serialized RMA & Spare Parts |
| **MSE-REF-001** | `PRD-REF-001` to `PRD-REF-004` | Customer Referral Engine & 3 Independent Ledgers |
| **MSE-AI-001, MSE-AI-002** | `PRD-AI-001` to `PRD-AI-004` | AI Assistance Gating & Data Privacy Lockdown |
| **MSE-REG-001, MSE-REG-002** | `PRD-REG-001`, `PRD-REG-002` | Regulatory Knowledge Service & Human-Verified Rules |
| **MSE-DMO-001** | `PRD-DMO-001`, `PRD-DMO-002` | Full Product Demo Isolation & Anti-Fallback Rule |
| **MSE-TRL-001** | `PRD-SUB-001` | Controlled Trial Quotas & Automatic Expiration |
| **MSE-DEP-001, MSE-DEP-002** | `PRD-PRN-001`, `PRD-NFR-004` | Module Dependencies & Failure Isolation |
| **MSE-CLS-001** | `PRD-LCH-001`, `PRD-INT-001` | Scope Classification (Core, Optional, Planned, Future) |
| **MSE-VIS-001, MSE-RSN-001** | `PRD-UX-001`, `PRD-WEB-002` | Feature UI Visibility States & Reason Model |
| **MSE-LFC-001, MSE-EXP-001** | `PRD-SUB-001` | Entitlement State Machine & Temporal Enforcement |
| **MSE-DNG-001, MSE-SUS-001** | `PRD-SUB-002`, `PRD-SEC-002` | Safe Downgrades & Commercial/Security Suspension |
| **MSE-OVR-001, MSE-OVR-002** | `PRD-TEN-001`, `PRD-PRV-005` | Tenant and Customer Override Boundaries |
| **MSE-USR-001** | `PRD-AUT-001`, `PRD-ROL-001` | User Role and Entitlement Intersection |
| **MSE-REP-001, MSE-FIRM-001** | `PRD-DEV-002`, `PRD-DKR-001` | Hardware Replacement & Firmware Recalculation |
| **MSE-PRVC-001** | `PRD-PRV-002` | Tracking Provider Migration Independence |
| **MSE-WHT-001** | `PRD-WHT-001` | White-Label Branding Gating Without Code Forks |
| **MSE-BIL-001, MSE-PAY-001** | `PRD-BIL-001` | Billing Metering Linkage & Backend Payment Rule |
| **MSE-CONV-001** | `PRD-DMO-002`, `PRD-PUR-001` | Demo to Production Clean Conversion Boundary |
| **MSE-AUD-001** | `PRD-AUD-002` | Immutable System Audit Logging |
| **MSE-SEC-001 to MSE-SEC-003** | `PRD-SEC-003`, `PRD-PRN-003` | Server Enforcement, No LocalStorage, Fail-Closed |
| **MSE-OFF-001** | `PRD-NFR-003` | Mobile Offline Resilience & Security Guardrail |
| **MSE-FMC-001** | `PRD-TEN-003` | Hierarchical Administrative Feature Module Control |
| **MSE-CHN-001** | `PRD-CUST-001` to `PRD-CUST-009` | Universal Multi-Channel Consistency |
| **MSE-OWN-001, MSE-ADM-001** | `PRD-AUT-001` | Authority Ownership & Admin Boundary Limits |
| **MSE-ITG-001, MSE-REG-002** | `PRD-ITG-001`, `PRD-GOV-001` | Integration Registry Status & GovTech Gating |

---

## 70. ACCEPTANCE CRITERIA

- **MSE-ACC-001 (Core Entitlement Acceptance Verification):**
  1. *Tenant Boundary*: A tenant without module entitlement MUST be completely barred from accessing module endpoints (HTTP 403 / Fail-Closed).
  2. *Subscription Subset*: An end customer without an active subscription for an entitled module MUST receive an informative upgrade prompt without data exposure.
  3. *User Authorization*: A user lacking role permission MUST be denied execution even if the parent tenant and customer account subscribe to the feature.
  4. *Hardware Capability*: A tracker lacking verified relay wiring MUST NOT display an active engine immobilizer control.
  5. *Unknown Device Lockdown*: An `UNKNOWN / UNVERIFIED` device MUST NOT be permitted to execute relay, voice, or custom configuration commands; safely parsed basic telemetry ingest remains permitted.
  6. *Engine Cut Safety*: Engine immobilization MUST fail closed if speed exceeds safety policy limits or step-up PIN verification fails.
  7. *Support Location Isolation*: Support agents MUST NOT view live vehicle coordinates without an active ticket and verified customer authorization.
  8. *Rescue Auto-Revoke*: Closing an emergency rescue incident MUST immediately revoke rescue tracking access.
  9. *Admin Scope Limit*: A Tenant Admin MUST NOT be able to provision modules that exceed the tenant's platform entitlement.
  10. *Demo Isolation*: Public demo accounts MUST NOT communicate with real tracking hardware or view production database records.
  11. *AI Authority Limit*: AI Orchestrator queries MUST NOT bypass user permissions or receive sensitive customer coordinates.
  12. *Dependency Resilience*: Tracking provider downtime MUST display degraded telemetry status without destroying customer subscription records.
  13. *Tenant Isolation*: Cross-tenant database queries MUST return zero records and fail closed.
  14. *Historical Preservation*: Expired subscriptions MUST NOT trigger automated deletion of historical telemetry logs.
  15. *Device Replacement*: Installing a replacement tracker MUST dynamically recalculate available hardware features against the new device IMEI.
  16. *Server Authority*: Manipulating client-side JavaScript or URL routes MUST NOT bypass backend entitlement validation.

---

## 71. NON-FUNCTIONAL REQUIREMENTS

- **MSE-NFR-001 (Evaluation Latency):** Server-side entitlement and capability evaluation SHALL add $\le 20\text{ ms}$ overhead to API request processing.
- **MSE-NFR-002 (Fail-Closed Security):** All entitlement decision services MUST fail closed upon cache miss, database timeout, or unhandled exception.
- **MSE-NFR-003 (Audit Completeness):** 100% of administrative entitlement grants, suspensions, and manual overrides MUST be recorded in the immutable audit trail.
- **MSE-NFR-004 (Prompt Revocation Propagation):** Entitlement suspensions, administrative revocations, and emergency access expirations MUST propagate promptly and reliably enough across active sessions to prevent continued unauthorized sensitive operations (exact measurable propagation target: TBD / downstream measurable NFR).

---

## 72. BLOCKING QUESTIONS

> **Zero Blocking Questions.**  
All functional boundaries, service ownership modes, gating rules, and dependencies are fully specified based on the approved `PRODUCT_REQUIREMENTS.md` v1.0. All commercial pricing, vendor selections, and exact durations are safely preserved as non-blocking Open Items.

---

## 73. SPECIFICATION VERDICT

> # **MODULE & SERVICE ENTITLEMENT APPROVED — AUTHORITATIVE BASELINE**

This authoritative downstream specification strictly adheres to approved Product Requirements Document v1.0 (`abef605`), formalizes all 6 layers of the governing feature availability formula, establishes modular B2B service modes, and is formally approved as the authoritative downstream specification baseline for Module and Service Entitlements.
