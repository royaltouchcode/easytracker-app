# Tracking Provider Architecture Specification

**Status:** APPROVED  
**Version:** 1.0  
**Approved Date:** 2026-08-28  
**Authority Status:** APPROVED DOWNSTREAM SPECIFICATION  
**Product:** Vehicle Tracking Standalone Launch  
**Product Name:** TBD  
**Temporary Working Name:** EasyTracker  
**Authoritative Upstream:** `docs/03_specs/PRODUCT_REQUIREMENTS.md` v1.0 (Commit `abef605`), `docs/03_specs/MODULE_SERVICE_ENTITLEMENT_SPEC.md` v1.0 (Commit `a962a2a`), `docs/03_specs/USER_ROLES_PERMISSIONS_ACCESS_SPEC.md` v1.0 (Commit `25e7834`), `docs/03_specs/TENANT_ISOLATION_SECURITY_BOUNDARY_SPEC.md` v1.0 (Commit `93d7a4e`), `docs/03_specs/CUSTOMER_TYPES_COMMERCIAL_MODEL_SPEC.md` v1.0 (Commit `4014141`)  
**Upstream Commits:** `abef605`, `a962a2a`, `25e7834`, `93d7a4e`, `4014141`  
**Purpose:** Define the provider-neutral Tracking Provider architecture, multi-provider Tenant model, authoritative Provider/Device/Tenant mapping, ingestion and command boundaries, Provider lifecycle, Provider health, credential isolation, normalization and migration behavior without selecting the first Production Provider or implementing infrastructure.

---

## 1. DOCUMENT CONTROL

| Property | Specification |
| :--- | :--- |
| **Document Title** | Tracking Provider Architecture Specification |
| **Document Identifier** | `docs/03_specs/TRACKING_PROVIDER_ARCHITECTURE_SPEC.md` |
| **Version** | `1.0` |
| **Status** | APPROVED |
| **Approved Date** | `2026-08-28` |
| **Authority Status** | APPROVED DOWNSTREAM SPECIFICATION |
| **Approval Basis** | Independent senior architecture/security review completed, consolidated focused corrections applied, residual authority and terminology issues resolved, and focused final re-review passed with zero blocking findings, 101 stable requirement IDs and complete upstream traceability. |
| **Product Brand** | TBD (Temporary Working Name: EasyTracker) |
| **Project Context** | Standalone Vehicle Tracking Launch (with future Agency SaaS vertical alignment) |
| **Active Development Branch** | `vehicle-tracking-launch-v1` |
| **Authoritative Upstream PRD** | `docs/03_specs/PRODUCT_REQUIREMENTS.md` v1.0 (Commit `abef605`) |
| **Authoritative Entitlement Spec** | `docs/03_specs/MODULE_SERVICE_ENTITLEMENT_SPEC.md` v1.0 (Commit `a962a2a`) |
| **Authoritative Roles & Access Spec**| `docs/03_specs/USER_ROLES_PERMISSIONS_ACCESS_SPEC.md` v1.0 (Commit `25e7834`) |
| **Authoritative Tenant Boundary Spec**| `docs/03_specs/TENANT_ISOLATION_SECURITY_BOUNDARY_SPEC.md` v1.0 (Commit `93d7a4e`) |
| **Authoritative Commercial Model Spec**| `docs/03_specs/CUSTOMER_TYPES_COMMERCIAL_MODEL_SPEC.md` v1.0 (Commit `4014141`) |
| **Authority Precedence Index** | `docs/DOCUMENT_AUTHORITY_INDEX.md` |

---

## 2. PURPOSE

- **TPA-GEN-001 (Specification Purpose):** This specification defines the authoritative, provider-neutral architecture for integrating the standalone Vehicle Tracking SaaS platform with external and internal Tracking Providers. It establishes the governance for multi-provider routing, authoritative telemetry ingestion mapping, command dispatch boundaries, data normalization, operational health monitoring, credential security, fail-closed handling, and seamless provider migration without selecting the first Production Provider (`DEC-002`) or introducing concrete database/server implementations.

---

## 3. SCOPE

- **TPA-GEN-002 (In-Scope Tracking Provider Architecture Dimensions):**
  - Canonical Tracking Provider abstraction and multi-provider coexistence per Tenant.
  - Strict decoupling of Tracking Providers from SaaS Tenancy and cellular SIM/telco carriers.
  - Authoritative scenario-dependent ingestion mapping ($	ext{Provider} + 	ext{Connection} + 	ext{External Device ID} + 	ext{Internal Device} + 	ext{Tenant} + 	ext{Applicable Resource}$).
  - Fail-closed telemetry routing, absence of cross-tenant fallbacks, and zero AI guessing.
  - Ingestion mechanisms (Webhook/Push, API Pull/Poll, Streaming) vs direct GPS protocol ingestion.
  - Position of Traccar as a future self-hosted/SaaS-managed candidate without mandatory current selection.
  - Two-stage data normalization pipeline: Raw Provider Payloads vs Normalized Telemetry & Events.
  - Device Knowledge & Capability Registry authority over Provider-reported feature claims.
  - Server-side Provider credential security, rotation, and tenant credential isolation.
  - Provider Connection lifecycle, operational health states, and complete isolation from Demo sandboxes.
  - Command provider adapters, translation, correlation, and non-bypassable 9-term authorization gates.
  - Canonical Engine Disable and Engine Restore governance without fixed numeric speed thresholds.
  - Telemetry idempotency, multi-clock provenance, and reconciliation.
  - Multimedia provider architecture (dashcam video streams, event clips, snapshots, audio monitoring).
  - Provider offboarding, retirement, and data portability without historical provenance erasure for retained records.
  - 9 comprehensive architecture matrices and strict upstream traceability.

---

## 4. OUT OF SCOPE

- **TPA-GEN-003 (Explicit Architectural Exclusions):** This specification SHALL NOT define:
  - Concrete database schemas, SQL DDL tables, or ORM entity definitions.
  - REST API endpoint code, webhook controller handlers, or JSON schema parser implementations.
  - Wire protocol byte parsers (e.g., Teltonika, GT06, Concox, JT808 raw binary/hex decoders).
  - Traccar server installation scripts, Docker Compose files, or VPS provisioning configurations.
  - Selection of specific message brokers, queue technologies (Kafka, RabbitMQ, Redis), or time-series databases (TimescaleDB, ClickHouse).
  - Selection or hardcoding of the initial 3rd-party licensed VTS provider (governed by `DEC-002`).
  - Pricing rate cards, commercial billing engines, or revenue recognition ledgers (governed by `DEC-004`).
  - Direct integration endpoints for government agencies (BRTA, BTRC, Police 999) without officially verified legal agreements.

---

## 5. AUTHORITY & SOURCE BASIS

- **TPA-GEN-004 (Governing Upstream Precedence):** In accordance with `docs/DOCUMENT_AUTHORITY_INDEX.md`, this specification adheres strictly to:
  1. Approved `docs/03_specs/PRODUCT_REQUIREMENTS.md` v1.0 (Commit `abef605`).
  2. Approved `docs/03_specs/MODULE_SERVICE_ENTITLEMENT_SPEC.md` v1.0 (Commit `a962a2a`).
  3. Approved `docs/03_specs/USER_ROLES_PERMISSIONS_ACCESS_SPEC.md` v1.0 (Commit `25e7834`).
  4. Approved `docs/03_specs/TENANT_ISOLATION_SECURITY_BOUNDARY_SPEC.md` v1.0 (Commit `93d7a4e`).
  5. Approved `docs/03_specs/CUSTOMER_TYPES_COMMERCIAL_MODEL_SPEC.md` v1.0 (Commit `4014141`).
  6. Historical reconciliation audits (`docs/02_audit/`) as context only.
  7. Legacy code and documentation (strictly as non-authoritative implementation evidence).

---

## 6. DEFINITIONS

- **Tracking Provider:** An approved external or internal telematics telemetry source, gateway, or tracking server that receives signals from physical GPS trackers and exposes telemetry and command interfaces to the SaaS platform.
- **Provider Account / Connection:** A specific authenticated credential and configuration context on a Tracking Provider representing a discrete commercial or technical integration.
- **External Provider Device Identity:** The identifier assigned to or recognized by a Tracking Provider to represent a physical tracking device (e.g., IMEI, device serial, provider internal ID).
- **Internal Device Identity:** The authoritative, immutable UUID assigned to a physical tracking unit within the SaaS platform's Device Knowledge & Capability Registry.
- **Authoritative Ingestion Mapping:** The deterministic binding associating incoming provider telemetry with a specific Internal Device, SaaS Tenant, Customer Account, and Vehicle where applicable.
- **Raw Provider Payload:** The original diagnostic data structure received directly from a Tracking Provider before parsing or transformation.
- **Normalized Telemetry:** Standardized internal domain events and telemetry records generated by transforming raw provider payloads into canonical platform formats.
- **Fail-Closed Mapping:** An architectural security rule whereby unmapped, ambiguous, or conflicting telemetry is completely withheld from customer visibility.

---

## 7. ARCHITECTURAL PRINCIPLES

- **TPA-GEN-005 (Provider Independence & Portability):** The SaaS platform core domain SHALL NEVER couple directly to the proprietary protocols, APIs, error formats, or data structures of any single Tracking Provider (`PRD-PRV-001`, `MSE-PRV-001`).
- **TPA-GEN-006 (Zero Security Compromise on Ingestion):** Ingested telematics data SHALL NOT cross Tenant boundaries under any circumstance. Provider failure, degradation, or configuration error MUST fail closed (`TISB-PRV-001`, `TISB-PRV-004`).

---

## 8. TRACKING PROVIDER ABSTRACTION

- **TPA-PRV-001 (Canonical Provider Abstraction):** The platform defines a unified, provider-neutral abstraction layer that encapsulates all telematics communication. This abstraction supports:
  - Licensed 3rd-party commercial VTS gateways (e.g., GP IoT, Robi, Bondstein candidate examples under `DEC-002`).
  - Tenant-owned tracking servers (e.g., dedicated client-managed Traccar or proprietary server instances).
  - SaaS-managed / self-hosted Traccar clusters (where approved in future roadmap phases).
  - Other approved specialized gateway adapters.
  *Named vendors represent non-binding candidate examples only.*

---

## 9. PROVIDER VS TENANT

- **TPA-PRV-002 (Provider != Tenant):** A Tracking Provider is an external or infrastructure telematics source, NOT a SaaS Tenant (`CTCM-B2B-003`, `TISB-PRV-002`). A single Tracking Provider may ingest data for multiple independent SaaS Tenants; conversely, a single SaaS Tenant may utilize multiple Tracking Providers. Provider account access breadth SHALL NEVER define or expand internal SaaS tenant authorization.

---

## 10. MULTI-PROVIDER TENANT MODEL

- **TPA-PRV-003 (Multi-Provider Support per Tenant):** A single SaaS Tenant MUST be capable of concurrently operating across multiple Tracking Providers (`MSE-PRV-001`). Distinct Customer Accounts, Fleets, Fleet Groups, or individual Vehicles within that Tenant may be routed through different Tracking Providers without cross-provider leakage or operational disruption.

---

## 11. B2B OWN-PROVIDER MODEL

- **TPA-PRV-004 (B2B Tenant Provider Autonomy):** Independent B2B GPS/VTS Tenants have the capability to integrate their own approved Tracking Provider connections, utilize 3rd-party licensed gateways, or adopt SaaS-managed gateways where entitled, authorized, configured, operationally approved, and trust-validated (`CTCM-B2B-001`). B2B Tenants SHALL NOT be forced onto Agency-owned providers merely by using the shared SaaS platform, nor does B2B provider ownership bypass standard Integration Registry, URPA, or TISB security controls.

---

## 12. PROVIDER ACCOUNT / CONNECTION

- **TPA-PRV-005 (Provider Connection Context):** Every integration with a Tracking Provider operates through an explicit Provider Connection context encapsulating:
  - Target provider adapter type.
  - Server-side authenticated connection credentials.
  - Assigned Tenant scope (Platform-shared, B2B Tenant-specific, or Fleet-specific).
  - Ingestion configuration (webhook URLs, polling intervals, rate limit parameters).
  - Operational health and governance lifecycle state.

---

## 13. EXTERNAL PROVIDER DEVICE IDENTITY

- **TPA-DEV-001 (External Identifier Disentanglement):** Physical tracking units possess external provider-side identifiers (IMEI, device serial, vendor-specific ID) that are distinct from internal platform UUIDs (`PRD-DKR-001`). Mere knowledge of an external provider identifier SHALL NEVER grant authorization or access to vehicle telemetry.

---

## 14. AUTHORITATIVE PROVIDER MAPPING

- **TPA-MAP-001 (Scenario-Dependent Ingestion Binding):** Customer-visible operational telemetry requires sufficient authoritative Provider, Device, Tenant, and applicable resource associations for the specific scenario. Inbound telemetry must resolve through applicable bindings:
  $$\text{Tracking Provider} \longrightarrow \text{Provider Connection} \longrightarrow \text{External Device ID} \longrightarrow \text{Internal Device} \longrightarrow \text{Tenant} \longrightarrow [\text{Customer / Vehicle / Fleet}]$$
  Unassigned or quarantined devices may legitimately exist before vehicle assignment, remaining restricted and non-customer-visible. Direct Tenant or Fleet scenarios do not require artificial customer accounts where the approved business model does not mandate them.

---

## 15. FAIL-CLOSED MAPPING

- **TPA-MAP-002 (Fail-Closed Telemetry Governance):** If incoming telematics data contains an unknown External Device ID, ambiguous mapping, inactive mapping, Tenant mismatch, or references a retired/replaced device, the platform MUST immediately drop the payload from customer visibility (`TISB-PRV-001`). Unmapped data MAY enter a quarantined administrative reconciliation log but SHALL NEVER be exposed to customer dashboards.

---

## 16. NO CROSS-TENANT FALLBACK

- **TPA-MAP-003 (Prohibition of Fallback Routing):** Under NO circumstances SHALL the ingestion engine fall back to a default Tenant, guess a Tenant assignment via AI, apply global search fallbacks, or route ambiguous data to another customer (`TISB-PRV-003`).

---

## 17. INGESTION METHODS

- **TPA-ING-001 (Supported Ingestion Modalities):** The provider architecture supports three primary ingestion integration modalities:
  1. **Webhook / Push:** Provider delivers telemetry payloads via authenticated HTTP requests.
  2. **API Pull / Polling:** SaaS worker processes poll provider APIs on configurable schedules.
  3. **Streaming / WebSocket:** Real-time event streaming connections from provider message hubs.
  *The ingestion modality is configured per Provider Connection without altering core domain logic.*

---

## 18. DIRECT PROTOCOL VS PROVIDER API

- **TPA-ING-002 (Ingestion Boundary Separation):** The platform strictly separates:
  - **Provider API Ingestion:** HTTP/REST/Webhook interfaces communicating with intermediate tracking servers.
  - **Direct Device Protocol Ingestion:** Low-level TCP/UDP socket listeners communicating directly with GPS hardware firmware (e.g., port 5000+ protocol servers).
  Direct protocol listeners belong to dedicated gateway infrastructure (such as Traccar or socket gateway clusters) and SHALL NOT be conflated with the SaaS web application HTTP server.

---

## 19. TRACCAR POSITION

- **TPA-PRV-006 (Traccar Strategic Positioning):** Traccar is recognized as a candidate self-hosted / SaaS-managed Tracking Provider adapter in the platform architecture roadmap (`PRD-PRV-001`). However, Traccar is NOT the mandatory launch provider, NOT the universal backend, and NOT the SaaS tenant boundary (`DEC-002`). Initial launch supports licensed 3rd-party VTS gateways while preserving Traccar compatibility for future deployment phases.

---

## 20. PROVIDER NORMALIZATION

- **TPA-NRM-001 (Canonical Normalization Pipeline):** The normalization engine transforms heterogeneous provider payloads into canonical platform domain models representing:
  - Telemetry snapshots (latitude, longitude, altitude, speed, bearing, GPS fix, satellites).
  - Sensor signals (ignition state, external power voltage, backup battery level, fuel level, temperature).
  - Operational events (motion start/stop, geofence enter/exit, overspeed, power cut, tamper, SOS panic).
  - Diagnostic metadata (device connectivity, signal strength, firmware version, provider timestamp).
  *Normalization MUST NOT fabricate data fields absent from the original provider payload.*

---

## 21. RAW VS NORMALIZED DATA

- **TPA-NRM-002 (Raw vs Normalized Data Segregation):** Ingested data is conceptually partitioned into:
  - **Raw Provider Payload:** Unmodified raw payload stored with reception metadata for diagnostic and operational troubleshooting. Raw Provider Payload retention, where retained, is governed by applicable approved privacy, retention, security, legal/regulatory, Provider-contract, and operational policies. Exact retention periods and requirements remain unresolved/downstream according to the actual upstream Open Decision, including `DEC-009` where applicable. Raw Provider Payloads do NOT automatically constitute permanent immutable audit records.
  - **Normalized Domain Record:** Standardized, typed telemetry record used for live map display, trip calculation, alert evaluation, and reporting.

---

## 22. DATA QUALITY / PROVENANCE

- **TPA-NRM-003 (Provenance & Data Quality Retention):** Every normalized telemetry record MUST retain provenance metadata indicating:
  - Ingesting Provider ID and Provider Connection ID.
  - Original External Device ID.
  - Normalization outcome and status flags (valid, partial, degraded, uncalibrated).
  - Multi-point timestamps (Device timestamp, Provider timestamp, Ingestion timestamp).

---

## 23. EVENT NORMALIZATION

- **TPA-EVT-001 (Semantic Event Mapping):** Provider-specific alert and alarm codes MUST be deterministically mapped to canonical platform event types (e.g., `ignition.on`, `ignition.off`, `power.cut`, `motion.overspeed`, `alert.sos`, `alert.tamper`). Unknown or unverified provider alarm codes SHALL be captured as generic diagnostic events rather than guessed into critical safety alerts.

---

## 24. DEVICE CAPABILITY AUTHORITY

- **TPA-CAP-001 (Device Capability Registry Precedence):** Provider-reported features or dynamic metadata DO NOT constitute verified Device Capabilities (`PRD-DKR-002`, `MSE-DEV-001`). Device capabilities (relay support, audio monitoring, camera streaming, fuel sensors) are governed strictly by the authoritative Device Knowledge & Capability Registry.

---

## 25. UNKNOWN / UNVERIFIED CAPABILITY

- **TPA-CAP-002 (Fail-Safe Capability Handling):** If a device's hardware model is unverified, or a specific feature is marked `UNVERIFIED` or `UNSUPPORTED` in the registry, the platform SHALL NOT expose that feature in customer UI or accept command requests for that feature, even if the Provider adapter claims support (`MSE-DEV-001`).

---

## 26. PROVIDER CREDENTIAL SECURITY

- **TPA-SEC-001 (Server-Side Credential Protection):** All Provider API keys, client secrets, basic auth tokens, and webhook signing secrets MUST be stored securely on the server side (`TISB-SEC-001`). Provider administrative credentials SHALL NEVER be exposed to web clients, mobile apps, or browser local storage.

---

## 27. CREDENTIAL OWNERSHIP

- **TPA-SEC-002 (Tenant Credential Segregation):** Provider credentials owned by a specific B2B Tenant (e.g., custom Traccar API tokens or private VTS gateway accounts) MUST be strictly isolated within that Tenant's administrative perimeter (`TISB-TEN-008`). They SHALL NEVER be utilized for other tenants or exposed to platform-wide users.

---

## 28. CREDENTIAL DELEGATION

- **TPA-SEC-003 (Boundary Enforced on Shared Credentials):** When the SaaS platform utilizes a shared master Provider account to manage devices across multiple tenants, the platform's internal authorization boundary MUST enforce tenant isolation (`TISB-PRV-002`). Broad provider-level account visibility SHALL NEVER leak across tenant perimeters.

---

## 29. PROVIDER CONNECTION LIFECYCLE

- **TPA-LCY-001 (Provider Governance Lifecycle States):** Provider Connections progress through defined governance lifecycle states aligned with Integration Registry standards:
  $$\text{PLANNED} \longrightarrow \text{DOCUMENTATION_PENDING} \longrightarrow \text{SANDBOX} \longrightarrow \text{APPROVED} \longrightarrow \text{ACTIVE} \longleftrightarrow \text{DEGRADED} \longleftrightarrow \text{SUSPENDED} \longrightarrow \text{RETIRED}$$
  *Integration Registry State (e.g., `ACTIVE`, `DEGRADED`, `SUSPENDED`) defines governance and operational registration status in the platform registry, whereas Observed Provider Health represents dynamic live operational telemetry reachability evaluated as conceptual conditions (healthy/available, degraded, unavailable). While both domains may describe a degraded condition, observed health metrics do not automatically rewrite Integration Registry governance states without separate approved policy.*

---

## 30. ENTITLEMENT VS PROVIDER ACTIVE

- **TPA-LCY-002 (Commercial Entitlement != Operational Activation):** A Tenant may be commercially entitled to a module while its underlying Provider Connection remains `SANDBOX`, `SUSPENDED`, or operationally degraded (`CTCM-GEN-009`). Commercial entitlement establishes the right to use, NOT the instantaneous operational health of the external gateway.

---

## 31. PROVIDER ONBOARDING

- **TPA-LCY-003 (Provider Onboarding Verification Gates):** Activating a new Provider Connection requires satisfying explicit onboarding gates:
  1. Provider identity, adapter type, and communication modality verified.
  2. Server-side connection credentials and endpoint URLs configured.
  3. Non-production sandbox or controlled-device communication validated where provider capabilities permit.
  4. Device ID mapping format and event normalization rules validated.
  5. Administrative operational approval (`platform.integration.activate`) granted (`URPA-ADM-001`).

---

## 32. PROVIDER ACTIVATION

- **TPA-LCY-004 (Activation Authorization):** Moving a Provider Connection to `ACTIVE` requires administrative integration authority (`platform.integration.activate`) combined with valid connection health checks. Zero universal multi-signature approval rules are mandated.

---

## 33. PROVIDER HEALTH

- **TPA-HLT-001 (Operational Health Monitoring):** The platform maintains operational observability over Observed Provider Health, evaluating conceptual health conditions without prescribing final implementation enum schemas:
  - **Healthy / Available:** Successful telemetry reception, valid responses, within expected operational thresholds.
  - **Degraded:** Elevated error rates, delayed telemetry, rate limiting, or partial API failures.
  - **Unavailable:** Total connection timeout, invalid authentication, or server unresponsiveness.

---

## 34. PROVIDER DEGRADATION

- **TPA-HLT-002 (Graceful Degradation Governance):** During provider degradation or outage, the platform MUST:
  - Mark live map display as stale/last-known with clear visual indicators (`PRD-TRK-001`).
  - Cease claiming fresh real-time tracking data.
  - Refrain from fabricating synthetic telemetry.
  - Queue or fail command dispatches transparently with accurate error reasons.

---

## 35. NO DEMO FALLBACK

- **TPA-HLT-003 (Strict Prohibition of Demo Fallback):** Production provider outages MUST NEVER trigger automatic fallback to Public Demo or simulated telematics sandboxes (`TISB-DMO-001`). Demo and Production environments remain 100% logically isolated.

---

## 36. PROVIDER FAILOVER

- **TPA-HLT-004 (Controlled Failover Boundaries):** The platform SHALL NOT assume transparent, automatic Provider failover for physical devices. Because GPS hardware is configured to communicate with a specific server IP/port, shifting a device to a different provider requires an explicit, authorized migration workflow (`TPA-MIG-001`).

---

## 37. PROVIDER MIGRATION

- **TPA-MIG-001 (Provider Migration Governance):** Migrating a device, fleet, or tenant from Provider A to Provider B executes under strict provenance preservation:
  - Internal Device UUID, Customer Account, and Vehicle associations remain unchanged.
  - External Provider Device ID mapping is updated to point to Provider B.
  - Historical telemetry and command logs retained under approved retention policy preserve their original Provider A provenance (`PRD-AUD-002`).
  - Historical data SHALL NOT be rewritten or attributed to Provider B.

---

## 38. THIRD-PARTY TO TRACCAR FUTURE MIGRATION

- **TPA-MIG-002 (Roadmap Migration Path):** The provider abstraction enables strategic migration from initial licensed 3rd-party VTS gateways to self-hosted/SaaS-managed Traccar clusters in future phases without rewriting customer accounts, vehicle profiles, or business logic.

---

## 39. DEVICE REASSIGNMENT VS PROVIDER MIGRATION

- **TPA-MIG-003 (Separation of Lifecycle Events):**
  - **Vehicle Reassignment:** Moving an existing tracker to a new vehicle within the same tenant.
  - **Device Replacement (RMA):** Replacing a defective tracker with a new physical hardware unit (`CTCM-DEV-008`).
  - **Provider Migration:** Changing the telematics gateway backend for an existing tracker.
  *These are distinct lifecycle operations with independent validation workflows.*

---

## 40. COMMAND PROVIDER ADAPTER

- **TPA-CMD-001 (Command Adapter Responsibility):** The command abstraction layer converts internal canonical command requests into provider-specific payloads (API calls, SMS relays, gateway instructions, or Traccar protocol commands).

---

## 41. COMMAND AUTHORIZATION

- **TPA-CMD-002 (9-Term Command Authorization Precondition):** A command SHALL ONLY be dispatched to a Tracking Provider after satisfying the full 9-term authorization and safety formula (`URPA-CMD-001`, `TISB-CMD-001`):
  $$\text{Authorized} = \text{Actor} \land \text{Membership} \land \text{Tenant} \land \text{Entitlement} \land \text{Permission} \land \text{Scope} \land \text{Purpose} \land \text{Device Cap} \land \text{Safety Policy}$$

---

## 42. ENGINE COMMAND TERMINOLOGY

- **TPA-CMD-003 (Canonical Engine Terminology & Permissions):**
  - Canonical Commercial & Feature Names: **`Engine Disable`** and **`Engine Restore`**.
  - Canonical Request Permission Tokens: **`commands.engine_disable.request`** and **`commands.engine_restore.request`**.
  - Informal or legacy command terminology is strictly prohibited in favor of canonical Engine Disable and Engine Restore.
  - No fixed numeric speed threshold is mandated as a universal command gate.

---

## 43. COMMAND TRANSLATION

- **TPA-CMD-004 (Provider Command Translation Integrity):** Command adapters must validate that the target Provider Connection is `ACTIVE` and supports the specific command preset before formatting the request. Unsupported command requests must fail closed before transmission.

---

## 44. COMMAND LIFECYCLE

- **TPA-CMD-005 (Canonical Command Lifecycle States):** Commands dispatched through a Tracking Provider progress through distinct lifecycle stages:
  $$\text{REQUESTED} \longrightarrow \text{AUTHORIZED} \longrightarrow \text{SENT} \longrightarrow \text{QUEUED / DELIVERED} \longrightarrow \text{DEVICE_ACKNOWLEDGED}$$
  *Terminal failure states include `REJECTED`, `FAILED`, `TIMEOUT`, `OFFLINE`, and `UNSUPPORTED`. Provider transmission acceptance alone does not equal physical device execution.*

---

## 45. COMMAND CORRELATION

- **TPA-CMD-006 (Command Correlation & Tracking):** Every outbound command MUST maintain an internal Correlation ID linking the original user authorization, provider-side transaction ID, delivery status, and device execution response (`PRD-CMD-001`).

---

## 46. COMMAND RESULT ISOLATION

- **TPA-CMD-007 (Command Result Tenant Boundary):** Provider command execution responses and device acknowledgments MUST be routed strictly to the originating Tenant and authorized user context (`TISB-CMD-001`).

---

## 47. OFFLINE DEVICE COMMANDS

- **TPA-CMD-008 (Offline Device Command Handling):** If a device is offline, the platform SHALL NOT fabricate a successful execution response. In accordance with provider capabilities, commands may be queued for future delivery or returned immediately with `DEVICE_OFFLINE` status.

---

## 48. TELEMETRY IDEMPOTENCY

- **TPA-TEL-001 (Ingestion Deduplication & Idempotency):** The ingestion engine MUST safely detect and handle duplicate provider messages using logical idempotency controls without discarding legitimate identical sequential sensor readings. Specific persistence and indexing implementations remain downstream architectural decisions.

---

## 49. OUT-OF-ORDER TELEMETRY

- **TPA-TEL-002 (Out-of-Order Telemetry & Reconciliation):** When cellular network latency causes telemetry packets to arrive out of order, the ingestion pipeline evaluates available timestamp provenance to reconstruct chronological history without blindly trusting a single unsynchronized clock.

---

## 50. PROVIDER TIME SEMANTICS

- **TPA-TEL-003 (Multi-Point Timestamp Provenance):** The platform records three distinct time dimensions for all telemetry:
  1. **Device Time (GPS/Hardware Timestamp):** Captured at the physical sensor level.
  2. **Provider Time (Gateway Timestamp):** Recorded upon arrival at the provider server.
  3. **Ingestion Time (Platform Timestamp):** Recorded upon processing by the SaaS ingestion engine.
  *Timestamp reconciliation evaluates clock validity across all available provenance points.*

---

## 51. STALE / LAST-KNOWN DATA

- **TPA-TEL-004 (Stale Data Presentation):** When telemetry flow is interrupted, customer interfaces MUST clearly distinguish between fresh real-time positions and stale/last-known coordinates (`PRD-TRK-001`).

---

## 52. EVENT DEDUPLICATION

- **TPA-EVT-002 (Event Alert Correlation):** Critical alarms (SOS panic, crash, power disconnect) repeated by external providers within brief network retransmission windows MUST be correlated to prevent duplicate alert storms and spam notifications.

---

## 53. ACCIDENT / SOS INPUT

- **TPA-EVT-003 (Incident Signal Governance):** Ingested crash packets or SOS triggers represent input signals into structured incident workflows (`MSE-RSC-001`). Provider signals ALONE SHALL NOT trigger irreversible physical actions (such as automated engine disabling) without human confirmation and policy validation.

---

## 54. MEDIA PROVIDER ARCHITECTURE

- **TPA-MED-001 (Multimedia Stream Abstraction):** The media provider adapter manages connections to dashcam video servers, camera snapshots, and cabin audio streams. Media capabilities are partitioned into distinct operational types:
  - Live Video Stream (Single/Multi-channel).
  - Recorded Event / Crash Video Clip.
  - Periodic / On-Demand Camera Snapshot.
  - Cabin Voice Monitoring / Audio Stream.

---

## 55. MEDIA ACCESS

- **TPA-MED-002 (Media Access Security):** External provider media URLs, RTSP streams, or playback tokens SHALL NEVER be exposed directly to unauthenticated clients (`URPA-MED-001`, `TISB-MED-001`). Media access requires valid Tenant scope, applicable approved User Permission and Scope (e.g., `media.video.stream_live`, `media.voice.monitor_call`), active customer subscription, and verified legal basis. Implementation may use proxying, signed tokens, or temporary credentials without mandating a single token technology in this specification.

---

## 56. VOICE CAPABILITY SEPARATION

- **TPA-MED-003 (Granular Voice Capabilities):** Voice capabilities are decoupled into independent functional types in accordance with approved platform models:
  - `voice_call_monitoring` (One-way listen-in).
  - `two_way_audio` (Interactive cabin communication).
  - `audio_recording` (Stored audio event clips).
  - `live_audio_stream` (Real-time ambient audio stream).
  *Hardware support for one capability type DOES NOT imply support for others (`PRD-VOC-001`). Commercial availability of hardware capabilities does NOT automatically grant user permissions.*

---

## 57. VIDEO CAPABILITY SEPARATION

- **TPA-MED-004 (Granular Video Capabilities):** Video features are decoupled into:
  - `dashcam_live_single` / `dashcam_live_multi` (Real-time viewing).
  - `dashcam_event_clip` (Automated accident clips).
  - `dashcam_snapshot` (On-demand still images).
  *Hardware and bandwidth capabilities must be verified per vehicle (`PRD-VID-001`).*

---

## 58. SIM / M2M BOUNDARY

- **TPA-SIM-001 (Telematics vs Telco Boundary):** Tracking Provider architecture is strictly decoupled from cellular SIM/M2M data carrier management (`CTCM-SIM-001`). Cellular data plans, APN configurations, and telco billing operate as independent operational domains.

---

## 59. WEBHOOK TRUST

- **TPA-ING-003 (Webhook Authentication & Verification):** Inbound webhooks from Tracking Providers MUST use appropriate verified origin trust/authentication supported by the provider integration and risk model (e.g., cryptographic HMAC signatures, shared secrets, or mutual TLS where supported). IP allowlisting alone is a defense-in-depth measure and SHALL NOT be treated as universally sufficient authentication. Unauthenticated or malformed payloads must fail closed.

---

## 60. API TRUST

- **TPA-ING-004 (Server-to-Server API Security):** Outbound server-to-server communication with Tracking Providers (HTTP APIs, streaming interfaces, or socket relays) MUST execute over authenticated, transport-protected channels utilizing securely managed server-side credentials.

---

## 61. RATE LIMITS

- **TPA-ING-005 (Provider Rate Limit Compliance):** Polling workers and command dispatchers MUST respect provider-specific API rate limits, backoff headers, and concurrency quotas to prevent upstream connection throttling.

---

## 62. PAGINATION / PARTIAL DATA

- **TPA-ING-006 (Pagination Integrity):** Polling adapters handling historical trip or alert queries MUST fully iterate across paginated responses before assembling comprehensive trip playback records.

---

## 63. ERROR NORMALIZATION

- **TPA-HLT-005 (Standardized Provider Errors):** Provider-specific error codes MUST be mapped to canonical platform error categories (`AUTH_FAILURE`, `RATE_LIMITED`, `PROVIDER_UNAVAILABLE`, `DEVICE_NOT_FOUND`, `COMMAND_TIMEOUT`) for transparent diagnostics without fabricating success.

---

## 64. PROVIDER STATE VS SUBSCRIPTION

- **TPA-PRV-007 (Provider State != Subscription State):**
  - An active customer subscription may exist while a Provider Connection is temporarily degraded.
  - A healthy Provider Connection may ingest data for an account whose subscription is expired (resulting in fail-closed customer blocking).
  *Commercial and operational states remain completely independent (`CTCM-GEN-009`).*

---

## 65. PROVIDER STATE VS DEVICE STATE

- **TPA-DEV-002 (Provider Health != Device Connectivity):**
  - $	ext{Provider Healthy} 
eq 	ext{Device Online}$ (A healthy gateway may have offline devices).
  - $	ext{Device Offline} 
eq 	ext{Provider Down}$ (A single tracker out of cellular range does not indicate provider failure).

---

## 66. PROVIDER STATE VS INTEGRATION STATE

- **TPA-LCY-005 (Integration Approval != Live Health):** An integration marked `ACTIVE` in the administrative registry represents legal and configuration approval; it does not guarantee that the remote provider server is currently reachable or healthy.

---

## 67. PROVIDER CONFIGURATION SCOPE

- **TPA-ADM-001 (Provider Configuration Governance):** Provider Connection configurations are managed based on granular integration permissions (`platform.integration.configure`), tenant scope, and managed-service mode (`URPA-ADM-001`). Tenant Administrator status alone does not grant blanket or unrestricted provider credential access.

---

## 68. PROVIDER CONFIGURATION ACCESS

- **TPA-ADM-002 (Privileged Configuration Access):** End users, fleet drivers, and personal vehicle owners SHALL NEVER have access to Provider connection settings, API credentials, or raw gateway endpoints.

---

## 69. PROVIDER TEST / VALIDATION

- **TPA-TST-001 (Non-Production Testing Sandbox):** Provider adapters should be validated in non-production environments using synthetic telemetry or dedicated test trackers where provider capabilities permit. Where no provider sandbox exists, documentation review, restricted credentials, or authorized test devices must be used.

---

## 70. CONTROLLED REAL-DEVICE TESTING

- **TPA-TST-002 (Isolated Device Integration Testing):** When validating new hardware or provider protocols with physical devices, testing MUST execute within dedicated test tenant accounts to avoid polluting live customer production data.

---

## 71. PUBLIC DEMO PROVIDER MODEL

- **TPA-DMO-001 (Simulated Demo Architecture):** The Public Demo environment operates on synthetic or replayed telemetry generators completely decoupled from live Tracking Providers (`TISB-DMO-001`).

---

## 72. CONTROLLED DEVICE DEMO

- **TPA-DMO-002 (Dedicated Demonstration Hardware):** Controlled device demonstrations for sales prospects utilize dedicated hardware registered in isolated demo tenant perimeters (`MSE-DMO-001`).

---

## 73. REAL-DEVICE TRIAL TENANT

- **TPA-DMO-003 (Production Isolated Trial Tenants):** Real-device customer trials connect to production Tracking Providers under standard multi-tenant isolation, subject to automated time-based trial expiration (`CTCM-SLS-004`).

---

## 74. PROVIDER OBSERVABILITY

- **TPA-OBS-001 (Operational Observability):** The platform maintains operational observability capturing ingestion throughput, parsing errors, mapping failures, command delivery latency, rate limiting, and upstream provider health conditions without mandating unverified real-time latency SLAs.

---

## 75. PROVIDER AUDITABILITY

- **TPA-AUD-001 (Durable Provider Audit Trail):** All administrative actions relating to Provider Connections (credential updates, lifecycle state changes, device mappings, manual failovers) MUST produce durable, auditable records according to approved audit policy (`PRD-AUD-002`, `URPA-AUD-001`).

---

## 76. CREDENTIAL ROTATION

- **TPA-SEC-004 (Secure Credential Rotation):** Provider adapters MUST support authorized credential rotation while keeping secrets strictly server-side, minimizing disruption according to provider capabilities without hardcoding unverified seamless rotation availability guarantees.

---

## 77. PROVIDER COMPROMISE / SUSPENSION

- **TPA-SEC-005 (Rapid Compromise Containment):** If a Provider Connection or API secret is suspected of being compromised, administrators can immediately suspend the connection, cutting off inbound data processing and outbound commands (`TISB-SEC-001`).

---

## 78. PROVIDER OFFBOARDING

- **TPA-OFF-001 (Structured Provider Decommissioning):** Offboarding a Tracking Provider executes through structured stages:
  1. Halt new device registrations on that provider.
  2. Migrate active devices to an alternate approved provider.
  3. Set provider governance state to `SUSPENDED` then `RETIRED`.
  4. Revoke and delete server-side API credentials.
  *Historical telemetry records previously ingested from that provider remain preserved under approved retention policy.*

---

## 79. TENANT PROVIDER OFFBOARDING

- **TPA-OFF-002 (Tenant Disconnection Safety):** When a B2B Tenant disconnects its private Tracking Provider, inbound data processing for that connection ceases immediately without deleting the tenant's retained historical vehicle telemetry.

---

## 80. PROVIDER RETIREMENT

- **TPA-OFF-003 (Retired Provider Governance):** A `RETIRED` Tracking Provider cannot accept new device mappings. For historical records that remain retained under approved retention policy, records retain the retired provider's ID as historical provenance (`PRD-RET-001`).

---

## 81. PROVIDER DELETION VS HISTORY

- **TPA-OFF-004 (Provenance Preservation):** Removing a provider configuration record SHALL NOT delete or rewrite historical telemetry, trips, or audit records that remain retained under approved retention policy.

---

## 82. PROVIDER COMMERCIAL BOUNDARY

- **TPA-COM-001 (Commercial Independence):** Commercial agreements with Tracking Providers (gateway fees, device licensing) are independent of customer SaaS subscriptions (`CTCM-B2B-003`).

---

## 83. PROVIDER COST / BILLING BOUNDARY

- **TPA-COM-002 (No Hardcoded Gateway Costs):** This architecture specification defines technical integration boundaries and does NOT calculate gateway fees or billing allocations.

---

## 84. PROVIDER REGULATORY BOUNDARY

- **TPA-REG-001 (Regulatory Compliance Precondition):** Third-party Tracking Providers operating in Bangladesh must comply with applicable telematics regulations (LEGAL / FINANCIAL VERIFICATION REQUIRED). The platform architecture makes no unverified legal claims regarding vendor licensing status.

---

## 85. GOVERNMENT INTEGRATION SEPARATION

- **TPA-REG-002 (Decoupled Government Gateways):** Official integrations with government entities (BRTA vehicle database, BTRC telematics portals, Police emergency centers) operate as distinct integration adapters subject to explicit legal authorization (`TISB-INT-001`).

---

## 86. AI PROVIDER-MAPPING BOUNDARY

- **TPA-AI-001 (Prohibition of AI Mapping Authority):** Artificial intelligence or machine learning models SHALL NEVER possess authority to assign devices to tenants, verify device capabilities, activate provider connections, or authorize high-risk vehicle commands (`URPA-AUTH-001`).

---

## 87. AI SENSITIVE DATA

- **TPA-AI-002 (Protection of Sensitive Telematics Data):** In accordance with `DEC-014`, provider administrative credentials, raw real-time customer locations, and private audio/video streams SHALL NEVER be transmitted to unapproved external AI services.

---

## 88. SCALE PRINCIPLE

- **TPA-SCL-001 (Scalable & Evolvable Architecture):** The provider integration architecture is designed to scale and evolve across multiple devices, providers, and tenants without single-provider, single-server, or single-tenant bottlenecks (`PRD-NFR-001`), while launching initially on lightweight infrastructure without mandating distributed scaling topologies prematurely.

---

## 89. HIGH-VOLUME TELEMETRY BOUNDARY

- **TPA-SCL-002 (Telemetry vs Transactional Data Boundary):** High-volume telematics ingestion streams are architecturally decoupled from transactional SaaS database workloads, ensuring rapid ingestion without locking relational business tables.

---

## 90. PROVIDER DATA PORTABILITY

- **TPA-SCL-003 (Customer Data Portability):** Customer accounts, vehicles, and fleet structures remain independent of provider-specific identifiers, enabling seamless export or provider migration.

---

## 91. PROVIDER LOCK-IN CONTROL

- **TPA-SCL-004 (Anti-Lock-In Design):** Customer-facing applications interact exclusively with platform-managed canonical models, preventing direct coupling to proprietary provider APIs.

---

## 92. PROVIDER-SPECIFIC EXTENSIONS

- **TPA-EXT-001 (Explicit Provider Extensions):** Specialized features available on select providers (e.g., proprietary CAN-bus metrics, custom BLE beacon sensors) MUST be exposed as explicit, capability-gated provider extensions rather than forced into the core model.

---

## 93. NORMALIZED CORE VS PROVIDER EXTENSION

- **TPA-EXT-002 (Core vs Extension Segregation):** The platform maintains a strict boundary between the universal Normalized Core Provider Contract and optional, capability-gated Provider-Specific Extensions exposed through controlled platform contracts.

---

## 94. PROVIDER CAPABILITY MATRIX

| Telematics Capability | Core / Extension | Requires Device Cap? | Requires Tenant Entitlement? | Requires Customer Subscription? | Applicable User Permission | Provider Verification Required? | Notes |
| :--- | :---: | :---: | :---: | :---: | :--- | :---: | :--- |
| **Telemetry Ingestion (Push/Pull)** | Core | YES | YES | YES | NO (System Ingestion) | YES | Fundamental location & sensor ingest. |
| **Live Map Position Display** | Core | YES | YES | YES | `tracking.location.view_live` | YES | Near-real-time coordinate updates. |
| **Historical Trip Playback** | Core | YES | YES | YES | `tracking.history.view` | YES | Chronological route reconstruction. |
| **Canonical Event Alerts** | Core | YES | YES | YES | `alerts.realtime.view` | YES | Speed, geofence, ignition, power cut. |
| **Engine Disable Request** | Core | **YES (Relay)** | **YES** | **YES** | `commands.engine_disable.request` | **YES** | High-risk command; 9-term auth + safety. |
| **Engine Restore Request** | Core | **YES (Relay)** | **YES** | **YES** | `commands.engine_restore.request` | **YES** | High-risk command; 9-term auth + safety. |
| **Device Diagnostics** | Core | YES | YES | YES | `support.diagnostics.view` | YES | Battery, voltage, signal, GPS fix. |
| **Live Video Streaming (`dashcam_live_single`)** | Extension | YES (Camera) | YES | YES | `media.video.stream_live` | YES | Dashcam real-time video feed. |
| **Event Video Clip Replay (`dashcam_event_clip`)** | Extension | YES (Camera) | YES | YES | `media.video.playback` | YES | Accident / crash video playback. |
| **Cabin Audio Monitoring (`voice_call_monitoring`)** | Extension | YES (Mic) | YES | YES | `media.voice.monitor_call` | YES | One-way listen-in; legal basis required. |
| **Two-Way Audio Call (`two_way_audio`)** | Extension | YES (Speaker) | YES | YES | `media.intercom.two_way_speak` | YES | Interactive cabin communication. |
| **Provider Health Status** | Core | NO | YES | NO | `platform.integration.view` | YES | Ingestion latency, gateway health. |

---

## 95. PROVIDER TYPE MATRIX

| Provider Architecture Type | Credential Owner | Tenant Scope Options | Multi-Tenant Ingestion? | Command Execution? | Multimedia Support? | Operational Management | Production Status |
| :--- | :--- | :--- | :---: | :---: | :---: | :--- | :--- |
| **Licensed 3rd-Party VTS Gateway** | SaaS Agency or B2B Tenant | Shared or Dedicated | **YES** | **YES** | Provider Dependent | External Vendor / SLA | **Eligible (Near-Term)** |
| **Tenant-Owned Tracking Server** | B2B Tenant | Tenant-Private Only | NO | **YES** | Provider Dependent | B2B Tenant Staff | **Eligible (Where Entitled)**|
| **SaaS-Managed Traccar Cluster** | SaaS Agency | Multi-Tenant Shared | **YES** | **YES** | Supported via Extensions| SaaS Infrastructure Team| **Future Roadmap Target** |
| **Other Approved Provider** | SaaS Agency or B2B Tenant | Shared or Dedicated | **YES** | **YES** | Provider Dependent | Dedicated Gateway Adapter| **Where Approved** |

---

## 96. INGESTION TRUST MATRIX

| Ingestion Modality | Origin Trust Source | Device Mapping Requirement | Duplicate Packet Risk | Out-of-Order Risk | Production Readiness | Security Notes |
| :--- | :--- | :--- | :---: | :---: | :---: | :--- |
| **Webhook / HTTP Push** | Cryptographic Signature / Secret | Authoritative Chain | Moderate | Low | **Production Approved** | Server-side validation; fail closed. |
| **API Pull / Scheduled Poll** | Server TLS + API Token | Authoritative Chain | Low | Moderate | **Production Approved** | Rate-limit compliant polling workers. |
| **Streaming / WebSocket** | Authenticated Stream Token | Authoritative Chain | Low | Very Low | **Production Approved** | Real-time bi-directional pipeline. |
| **Direct Protocol Socket Gateway**| Hardware IMEI / Dedicated Port | Authoritative Chain | High | Moderate | Future Architecture | Dedicated socket gateway adapter. |
| **Manual Telemetry Import** | Admin Token + Audit Verification | Authoritative Chain | High | High | Restricted / Sandbox Only | Restricted to diagnostics & testing. |

---

## 97. COMMAND PROVIDER MATRIX

| Canonical Command | Provider Translation Required? | Device Capability Required? | Tenant Entitlement Required? | Applicable User Permission | Safety Policy Required? | Device ACK Required? |
| :--- | :---: | :---: | :---: | :--- | :---: | :---: |
| **Engine Disable** | **YES** | **YES (Relay)** | **YES** | `commands.engine_disable.request` | **YES (Safe State)** | **YES** |
| **Engine Restore** | **YES** | **YES (Relay)** | **YES** | `commands.engine_restore.request` | **YES** | **YES** |
| **Status / Diagnostics** | **YES** | YES (Basic GPS) | YES | `commands.status.query` | NO | YES |
| **GPS Wakeup / Interval** | **YES** | YES (Configurable) | YES | `commands.gps_wakeup.request` | NO | YES |
| **Trigger Camera Snapshot** | **YES** | YES (Camera) | YES | Applicable Media Permission | NO | YES |
| **Initiate Voice Listen** | **YES** | YES (Mic) | YES | `media.voice.monitor_call` | **YES (Legal Basis)** | **YES** |

---

## 98. PROVIDER OPERATIONAL STATE MATRIX

| Operational Scenario | Integration Registry State | Observed Provider Health (Conceptual) | Customer Subscription State | Device Connectivity State | Customer Experience / Impact |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **1. Normal Operation** | `ACTIVE` | Healthy / Available | `ACTIVE` | `ONLINE` | Live real-time tracking, full commands. |
| **2. Device Offline** | `ACTIVE` | Healthy / Available | `ACTIVE` | **`OFFLINE`** | Last-known position displayed; commands queued/blocked. |
| **3. Live Gateway Degraded** | `ACTIVE` | Degraded | `ACTIVE` | Unknown / Stale | Stale telemetry warning; fresh data paused. |
| **4. Live Gateway Outage** | `ACTIVE` | Unavailable | `ACTIVE` | Unknown / Stale | Outage banner; zero fake demo fallback. |
| **5. Subscription Lapsed** | `ACTIVE` | Healthy / Available | **`SUSPENDED`** | `ONLINE` (Ingesting) | **Fail-Closed:** Data hidden from customer UI. |
| **6. Integration Registry Degraded**| **`DEGRADED`** | Degraded | `ACTIVE` | Unknown / Stale | Administrative operational restriction; investigate provider. |
| **7. Integration Sandbox** | `SANDBOX` | Healthy / Available | `TRIAL` | Test Device | Isolated test data; zero production exposure. |

---

## 99. PROVIDER MAPPING MATRIX

| Mapping Verification Check | Authoritative Ingestion Requirement | Failure Condition Outcome | Customer Visibility | Administrative Action Required |
| :--- | :--- | :--- | :---: | :--- |
| **Provider ID Check** | Matches active Provider Connection | Unknown / Inactive Provider | **BLOCKED** | Reject payload; log security warning. |
| **External Device ID** | Matches registered hardware in DKR | Unregistered Device IMEI | **BLOCKED** | Quarantine payload; investigate device. |
| **Internal Device UUID** | Active hardware registry record | Decommissioned / Replaced Device | **BLOCKED** | Ignore stale device telemetry. |
| **Tenant Association** | Device assigned to verified Tenant | Tenant Mismatch / Unassigned | **BLOCKED** | Fail closed; zero cross-tenant leak. |
| **Applicable Resource Binding**| Device linked to Vehicle or Fleet context | Unlinked / Pending Install | **BLOCKED** | Withhold from customer map view. |
| **Subscription Check** | Active commercial entitlement | Expired / Suspended Account | **BLOCKED** | Preserve data in backend; hide from UI. |

---

## 100. PROVIDER MIGRATION MATRIX

| Data / Architectural Dimension | State in Old Provider (Source) | State in New Provider (Target) | Migration Handling Rule |
| :--- | :--- | :--- | :--- |
| **Internal Device Identity** | UUID: `DEV-1001` | UUID: `DEV-1001` | **Preserved:** UUID remains unchanged. |
| **External Provider Device ID**| `PROVIDER_A_IMEI_123` | `PROVIDER_B_DEVICE_456` | **Updated:** External mapping re-associated. |
| **Vehicle & Customer Binding** | Bound to Vehicle `V-501` | Bound to Vehicle `V-501` | **Preserved:** Customer and vehicle context unchanged. |
| **Historical Telemetry Data** | Recorded under `PROVIDER_A` | New records under `PROVIDER_B` | **Accurate Provenance:** Historical provenance for retained records remains accurate. |
| **Command Dispatch Gateway** | Routed through Adapter A | Routed through Adapter B | **Switched:** Outbound commands use new adapter. |
| **Verified Device Capability** | Verified in Registry | Verified in Registry | **Independent:** Hardware capability truth unchanged. |

---

## 101. PROVIDER RESPONSIBILITY MATRIX

| Architectural Dimension | SaaS Platform Core | B2B Tenant | Tracking Provider | Cellular SIM Carrier | Physical GPS Device |
| :--- | :---: | :---: | :---: | :---: | :---: |
| **Telemetry Ingestion & Mapping** | **PRIMARY** | Configuration | Data Source | Transport Layer | Signal Generator |
| **Tenant Isolation & Security** | **PRIMARY** | User Role Mgmt | NO ACCESS | NO ACCESS | NO ACCESS |
| **Device Capability Truth** | **PRIMARY (DKR)** | NO AUTHORITY | Metadata Only | NO ACCESS | Hardware Source |
| **Command Authorization Gate** | **PRIMARY (9-Term)**| Authorized Users | NO AUTHORITY | NO ACCESS | Execution Target |
| **Provider Credential Security** | Server Protection | Private Key Mgmt | Gateway Auth | NO ACCESS | NO ACCESS |
| **Cellular Connectivity (M2M)** | Management | Optional Carrier | Dependent | **PRIMARY** | Modem Hardware |
| **Customer UI Presentation** | **PRIMARY** | White-Label Theme| NO ACCESS | NO ACCESS | NO ACCESS |

---

## 102. FAIL-CLOSED MATRIX

| Fault Condition / Trigger | System Response & Customer Visibility | Command Dispatch Permitted? | Diagnostic / Audit Requirement |
| :--- | :--- | :---: | :--- |
| **Unknown External Device ID** | Ingestion dropped; Zero customer visibility | **NO** | Quarantine payload; log diagnostic alert. |
| **Ambiguous Device Mapping** | Ingestion dropped; Zero customer visibility | **NO** | Log mapping conflict; alert administrator. |
| **Cross-Tenant Data Conflict** | Ingestion dropped; Zero customer visibility | **NO** | Security alert; block cross-tenant leakage. |
| **Provider Connection Degraded** | Stale data indicator displayed on map | **NO (Failsafe)** | Provider health monitor alert logged. |
| **Device Hardware Offline** | Last-known position displayed on map | **Queued / Blocked** | Record offline duration; notify on timeout. |
| **Unsupported Command Request** | Command rejected before transmission | **NO** | Log unsupported capability attempt. |
| **Authentication Token Expired** | Ingestion halted; Zero fake data generated | **NO** | High-priority credential alert logged. |
| **Demo vs Production Mismatch** | Ingestion dropped; Demo strictly isolated | **NO** | Security audit violation logged. |

---

## 103. NON-FUNCTIONAL REQUIREMENTS

- **TPA-NFR-001 (Provider Neutrality):** 100% of customer-facing application services MUST operate exclusively against normalized domain models without referencing proprietary provider APIs.
- **TPA-NFR-002 (Strict Tenant Data Isolation):** Telematics data ingesting from any provider MUST be authoritatively bounded to a single Tenant before database persistence (`TISB-TEN-001`).
- **TPA-NFR-003 (Credential Confidentiality):** 100% of Provider API keys, webhook secrets, and certificates MUST reside in secure server-side storage and SHALL NEVER be exposed to client bundles.
- **TPA-NFR-004 (Durable Audit Trail):** All provider lifecycle changes, credential rotations, and command dispatches MUST produce durable, auditable records according to approved audit policy (`PRD-AUD-002`).
- **TPA-NFR-005 (Operational Observability):** Ingestion pipelines MUST emit health metrics (throughput, error rates, gateway latency) for operational monitoring.
- **TPA-NFR-006 (Scalable Ingestion Decoupling):** High-volume telemetry ingestion MUST be decoupled from transactional business workflows to prevent database lock contention.
- **TPA-NFR-007 (Fault-Tolerant Resilience):** Provider degradation or outage MUST fail closed gracefully without corrupting historical data or crashing the web application.
- **TPA-NFR-008 (Seamless Data Portability):** Vehicle profiles, trip histories, and customer configurations MUST remain portable across provider migrations without data loss for retained records.

---

## 104. ACCEPTANCE CRITERIA

- **TPA-ACC-001 (Tracking Provider Architecture Acceptance Gates):**
  1. *Provider != Tenant:* Tracking Providers and SaaS Tenants remain strictly decoupled entities.
  2. *Carrier Separation:* Tracking Providers and cellular SIM/M2M operators remain distinct operational domains.
  3. *Multi-Provider Tenants:* A single Tenant can operate vehicles across multiple Tracking Providers simultaneously.
  4. *B2B Provider Autonomy:* B2B Tenants can connect their own approved private tracking gateways.
  5. *No Forced Agency Gateway:* B2B Tenants are not mandated to use Agency-owned tracking servers.
  6. *Credential Scope Isolation:* Provider master account breadth never defines or expands SaaS user authorization.
  7. *Authoritative Ingestion Mapping:* Inbound telemetry must resolve through the complete multi-stage mapping chain.
  8. *Unknown Device Fail-Closed:* Unrecognized external device IDs are dropped from customer visibility.
  9. *Ambiguous Mapping Fail-Closed:* Conflicting device mappings fail closed immediately.
  10. *Zero Cross-Tenant Leakage:* Ingested telemetry never crosses tenant perimeters.
  11. *No AI Mapping Guessing:* Artificial intelligence cannot assign device mappings or verify tenant ownership.
  12. *Zero Default Tenant Fallback:* Ingestion failure never routes data to a fallback or default tenant.
  13. *Port Separation:* HTTP/API webhook ports and raw GPS TCP/UDP protocol ports remain strictly segregated.
  14. *Direct Protocol vs API Distinction:* Direct socket listeners and intermediate API adapters remain separate.
  15. *Traccar Launch Independence:* Traccar is not mandated as the initial launch provider (`DEC-002`).
  16. *Future Traccar Compatibility:* The architecture fully supports future self-hosted Traccar deployment.
  17. *PRD DEC-002 Preserved:* Initial production provider selection remains open and configurable.
  18. *Raw vs Normalized Separation:* Raw provider payloads and normalized domain records remain distinct.
  19. *Deterministic Event Mapping:* Provider alarm codes map deterministically without guesswork.
  20. *Device Capability Authority:* Provider metadata alone cannot declare unverified hardware capabilities.
  21. *Unknown Capability Protection:* Features unsupported by hardware remain unavailable in customer UI.
  22. *Server-Side Credentials:* Provider secrets and API keys remain protected on the server side.
  23. *Zero Client Secret Exposure:* Provider credentials never leak to mobile apps or browser storage.
  24. *Tenant Credential Segregation:* B2B Tenant provider credentials cannot expose other tenants.
  25. *Entitlement vs Connection State:* Commercial entitlement and provider connection state remain separate.
  26. *No Automatic Activation:* Purchasing a subscription does not automatically activate an unready provider.
  27. *No Universal Multi-Signature:* Provider activation requires valid authorization without invented multi-signature gates.
  28. *Zero Demo Fallback on Outage:* Provider outages never fall back to Public Demo or simulated data.
  29. *Zero Fabricated Telemetry:* The platform never generates fake live telemetry during provider outages.
  30. *Stale Data Warning:* Interrupted telemetry is clearly marked as stale/last-known.
  31. *Historical Provenance Accuracy:* Provider migration preserves accurate original source provenance for retained records.
  32. *3rd-Party to Traccar Migration:* Architecture enables future migration from 3rd-party gateways to Traccar.
  33. *Migration != Reassignment:* Provider migration, vehicle reassignment, and RMA remain distinct.
  34. *Migration != Customer Transfer:* Provider migration does not alter customer account ownership.
  35. *Canonical Engine Terms:* Uses strictly **`Engine Disable`** and **`Engine Restore`**.
  36. *Canonical Permission Tokens:* Enforces `commands.engine_disable.request` and `commands.engine_restore.request`.
  37. *Zero Numeric Speed Threshold:* No fixed numeric speed threshold is mandated as a universal command gate.
  38. *Command Hardware Verification:* Provider command dispatch requires verified hardware relay capability.
  39. *Command Permission Enforcement:* Command dispatch requires explicit user permission and scope.
  40. *Command Safety Policy Gate:* Commands cannot bypass safe-state verification or step-up authentication.
  41. *Real Device ACK Required:* Provider transmission acknowledgment is not misrepresented as physical device success.
  42. *Offline Device Handling:* Offline trackers return transparent offline/queued status, never false success.
  43. *Command Result Isolation:* Command execution logs and ACKs remain strictly tenant-isolated.
  44. *Idempotent Ingestion:* Duplicate provider messages are safely deduplicated.
  45. *Out-of-Order Handling:* Telemetry arriving out of order preserves timestamp chronology and provenance.
  46. *Multi-Point Timestamps:* Records Device Time, Provider Time, and Ingestion Time distinctly.
  47. *Accident / SOS Human Verification:* SOS/Crash events feed incident workflows without auto-executing engine disable.
  48. *Voice Capability Granularity:* Decouples `voice_call_monitoring`, `two_way_audio`, and `audio_recording`.
  49. *Video Capability Granularity:* Decouples live video, multi-camera feeds, event clips, and snapshots.
  50. *Media Access Authorization:* Provider media streams require valid platform authentication and approved user permissions.
  51. *SIM Commercial Independence:* Cellular carrier relationships remain separate from provider architecture.
  52. *Webhook Authentication:* Inbound webhooks enforce verified cryptographic signature or token verification.
  53. *Webhook Flexibility:* Architecture accommodates providers without native webhook signing.
  54. *Provider Rate Limit Handling:* Polling adapters adhere to provider-specific throttling limits.
  55. *Pagination Integrity:* Multi-page provider API responses are fully assembled before playback generation.
  56. *Normalized Error Codes:* Provider faults map to standardized operational categories.
  57. *Provider Healthy != Device Online:* Decouples gateway operational health from tracker cellular connectivity.
  58. *Device Offline != Provider Down:* Individual tracker offline status does not imply gateway failure.
  59. *Integration Active != Healthy:* Lifecycle approval remains distinct from live operational health.
  60. *Privileged Admin Config:* Provider configuration requires explicit platform/tenant admin authority.
  61. *Customer Config Isolation:* Ordinary users cannot view or modify provider connection settings.
  62. *Isolated Integration Testing:* Gateway testing executes in sandboxes without exposing live customer data.
  63. *Public Demo Isolation:* Public Demo utilizes synthetic telemetry completely isolated from live gateways.
  64. *Real-Device Trial Isolation:* Customer hardware trials operate in isolated multi-tenant perimeters.
  65. *Durable Provider Auditing:* Material provider administrative actions produce durable audit logs.
  66. *Secure Secret Rotation:* Credentials can be rotated securely without client-side secret exposure.
  67. *Compromise Containment:* Compromised provider connections can be suspended immediately.
  68. *History Retained on Offboarding:* Decommissioning a provider preserves retained historical telemetry records.
  69. *Retired Provider Provenance:* Retained historical records maintain accurate reference to retired gateways.
  70. *Commercial Cost Independence:* Technical provider abstraction operates independently of gateway billing.
  71. *No Hardcoded Billing Costs:* Gateway usage costs are not calculated in technical provider architecture.
  72. *No False Regulatory Claims:* Platform does not assert unverified BTRC/BRTA licensing status.
  73. *No Invented Official Endpoints:* Government integration endpoints are not fabricated without contracts.
  74. *AI Non-Authority on Ingestion:* AI cannot map devices, activate gateways, or issue vehicle commands.
  75. *AI Sensitive Data Protection:* Credentials and live GPS coordinates are never transmitted to unapproved AI.
  76. *Multi-Provider Scalability:* Architecture avoids single-server, single-tenant, or single-provider bottlenecks.
  77. *High-Volume Stream Isolation:* Telemetry streams are decoupled from ERP transactional databases.
  78. *Portability of Business Identity:* Customer and vehicle UUIDs remain independent of provider IDs.
  79. *Anti-Vendor Lock-In:* Core applications interact exclusively with normalized domain models.
  80. *Explicit Provider Extensions:* Unique provider capabilities remain explicit and capability-gated.
  81. *Realistic Capability Matrices:* Matrices reflect configurable and provider-dependent capabilities accurately.
  82. *Zero Application Implementation:* Specification contains zero executable application code or schema DDL.

---

## 105. UPSTREAM TRACEABILITY

| Specification Requirement ID | Upstream PRD ID(s) | Upstream Entitlement ID(s) | Upstream Roles & Access ID(s) | Upstream Tenant Boundary ID(s) | Upstream Commercial Model ID(s) | Primary Subject Covered |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **TPA-GEN-001 to TPA-GEN-006** | `PRD-GEN-001`, `PRD-PRV-001` | `MSE-GEN-001`, `MSE-PRV-001` | `URPA-GEN-001` | `TISB-GEN-001`, `TISB-PRV-001` | `CTCM-GEN-001`, `CTCM-B2B-003` | Core Abstraction & Governing Principles |
| **TPA-PRV-001 to TPA-PRV-007** | `PRD-PRV-001`, `PRD-B2B-001` | `MSE-PRV-001` | `URPA-ROLE-003` | `TISB-PRV-002`, `TISB-TEN-008` | `CTCM-B2B-003`, `CTCM-B2B-008` | Multi-Provider Model & B2B Autonomy |
| **TPA-DEV-001 to TPA-DEV-002** | `PRD-DKR-001`, `PRD-DKR-002` | `MSE-DEV-001` | `URPA-DEV-001` | `TISB-TEL-001`, `TISB-SEC-007` | `CTCM-DEV-001` to `CTCM-DEV-005` | Device Identity & Capability Registry |
| **TPA-MAP-001 to TPA-MAP-003** | `PRD-ISO-001`, `PRD-TRK-001` | `MSE-TRK-001` | `URPA-TEN-001` | `TISB-PRV-001`, `TISB-PRV-003` | `CTCM-TEN-001`, `CTCM-LCY-003` | Authoritative Mapping & Fail-Closed |
| **TPA-ING-001 to TPA-ING-006** | `PRD-TRK-001`, `PRD-NFR-001` | `MSE-TRK-001` | `URPA-PERM-001` | `TISB-PRV-001`, `TISB-TEL-001` | `CTCM-GEN-009` | Ingestion Modalities & Webhook Security |
| **TPA-NRM-001 to TPA-NRM-003** | `PRD-TRK-001`, `PRD-AUD-002` | `MSE-TRK-001` | `URPA-PERM-001` | `TISB-PRV-004` | `CTCM-GEN-007` | Normalization & Data Quality Provenance |
| **TPA-CAP-001, TPA-CAP-002** | `PRD-DKR-002` | `MSE-DEV-001` | `URPA-DEV-001` | `TISB-CMD-001` | `CTCM-DEV-003`, `CTCM-GEN-011` | Device Capability Registry Precedence |
| **TPA-SEC-001 to TPA-SEC-005** | `PRD-AUT-001`, `PRD-AUD-002` | `MSE-SYS-001` | `URPA-ADM-001` | `TISB-SEC-001`, `TISB-TEN-008` | `CTCM-AUD-001`, `CTCM-AUD-003` | Credential Protection & Security |
| **TPA-LCY-001 to TPA-LCY-005** | `PRD-SRV-001` | `MSE-SYS-001` | `URPA-ADM-001` | `TISB-PRV-004`, `TISB-TEN-006` | `CTCM-SVC-001`, `CTCM-LCY-002` | Provider Connection Lifecycle & State |
| **TPA-HLT-001 to TPA-HLT-005** | `PRD-TRK-001`, `PRD-NFR-001` | `MSE-TRK-001` | `URPA-SUP-001` | `TISB-PRV-004`, `TISB-DMO-001` | `CTCM-GEN-009` | Health Monitoring & Zero Demo Fallback |
| **TPA-MIG-001 to TPA-MIG-003** | `PRD-PRV-001`, `PRD-RET-001` | `MSE-PRV-001` | `URPA-USER-005` | `TISB-PRVY-001`, `TISB-SEC-007` | `CTCM-B2B-009`, `CTCM-DEV-008` | Provider Migration & Roadmap Path |
| **TPA-CMD-001 to TPA-CMD-008** | `PRD-CMD-001` to `PRD-CMD-003`| `MSE-CMD-001` | `URPA-CMD-001` | `TISB-CMD-001` | `CTCM-CMD-001` | Command Adapters, Safety & Lifecycle |
| **TPA-TEL-001 to TPA-TEL-004** | `PRD-TRK-001` | `MSE-TRK-001` | `URPA-PERM-001` | `TISB-TEL-001` | `CTCM-GEN-007` | Telemetry Idempotency & Provenance |
| **TPA-EVT-001 to TPA-EVT-003** | `PRD-ALT-001`, `PRD-RSC-001` | `MSE-ALT-001`, `MSE-RSC-001` | `URPA-RSC-001` | `TISB-RSC-001` | `CTCM-RSC-001` | Event Normalization & Incident Inputs |
| **TPA-MED-001 to TPA-MED-004** | `PRD-VOC-001`, `PRD-VID-001` | `MSE-VOC-001` | `URPA-MED-001` | `TISB-MED-001` | `CTCM-SUB-005` | Media Abstraction & Access Security |
| **TPA-SIM-001** | `PRD-TRK-001` | `MSE-TRK-001` | `URPA-PERM-001` | `TISB-TEL-001` | `CTCM-SIM-001`, `CTCM-SIM-002` | SIM / M2M Telematics Boundary |
| **TPA-ADM-001, TPA-ADM-002** | `PRD-AUT-001` | `MSE-ADM-001` | `URPA-ADM-001`, `URPA-ROLE-003`| `TISB-TEN-008` | `CTCM-AUD-002` | Provider Administrative Governance |
| **TPA-TST-001, TPA-TST-002** | `PRD-DMO-001` | `MSE-DMO-001` | `URPA-DMO-001` | `TISB-DMO-002` | `CTCM-SLS-004` | Non-Production Sandbox & Validation |
| **TPA-DMO-001 to TPA-DMO-003** | `PRD-DMO-001` | `MSE-DMO-001` | `URPA-DMO-001` | `TISB-DMO-001` to `TISB-DMO-003`| `CTCM-SLS-004` to `CTCM-SLS-006`| Public Demo vs Production Isolation |
| **TPA-OBS-001, TPA-AUD-001** | `PRD-AUD-002` | `MSE-AUD-001` | `URPA-AUD-001` | `TISB-AUD-001` | `CTCM-AUD-004`, `CTCM-AUD-005` | Operational Observability & Auditing |
| **TPA-OFF-001 to TPA-OFF-004** | `PRD-RET-001` | `MSE-SYS-001` | `URPA-USER-005` | `TISB-PRVY-001` | `CTCM-B2B-009`, `CTCM-LCY-004` | Structured Offboarding & Deletion |
| **TPA-COM-001, TPA-COM-002** | `PRD-B2B-001` | `MSE-ADM-001` | `URPA-ROLE-014` | `TISB-TEN-008` | `CTCM-B2B-002`, `CTCM-B2B-007` | Commercial Boundary & Cost Decoupling |
| **TPA-REG-001, TPA-REG-002** | `PRD-GEN-001` | `MSE-SYS-001` | `URPA-ADM-001` | `TISB-INT-001` | `CTCM-PAY-005`, `CTCM-GEN-010` | Regulatory Preconditions & Government |
| **TPA-AI-001, TPA-AI-002** | `PRD-AUT-001` | `MSE-SYS-001` | `URPA-AUTH-001` | `TISB-SEC-001` | `CTCM-AUD-001` | AI Non-Authority & Sensitive Data |
| **TPA-SCL-001 to TPA-SCL-004** | `PRD-NFR-001` | `MSE-NFR-001` | `URPA-NFR-001` | `TISB-NFR-001` | `CTCM-NFR-001`, `CTCM-INT-001` | Scalability, Portability & Lock-In |
| **TPA-EXT-001, TPA-EXT-002** | `PRD-PRV-001` | `MSE-PRV-001` | `URPA-PERM-001` | `TISB-PRV-002` | `CTCM-SUB-002` | Provider Extensions & Core Boundary |
| **TPA-NFR-001 to TPA-NFR-008** | `PRD-NFR-001` to `PRD-NFR-004`| `MSE-NFR-001` to `MSE-NFR-004`| `URPA-NFR-001` to `URPA-NFR-004`| `TISB-NFR-001` to `TISB-NFR-004`| `CTCM-NFR-001` to `CTCM-NFR-004`| Non-Functional System Performance |
| **TPA-ACC-001** | `PRD-GEN-001` | `MSE-GEN-001` | `URPA-GEN-001` | `TISB-ACC-001` | `CTCM-ACC-001` | Acceptance Criteria Verification Gates |

---

## 106. OPEN ITEMS

The following open decisions from approved upstream baselines are carried forward without premature resolution:

| Decision ID | Subject / Topic | Upstream Baseline Status | Status in this Specification |
| :--- | :--- | :--- | :--- |
| **DEC-001** | Final Commercial Product & Brand Name | TBD (Temporary Working Name: EasyTracker) | Supported under neutral multi-brand framework. |
| **DEC-002** | Initial 3rd-Party Licensed VTS Provider(s) | TBD (Candidate examples: GP IoT, Robi, Bondstein) | Supported via provider-neutral adapter architecture. |
| **DEC-004** | Subscription Package Pricing & Rate Cards | TBD / Configurable per tenant and market policy | Enforced as decoupled commercial pricing model. |
| **DEC-005** | Support Live-Location Grant Exact Duration | Configurable (Ticket-scoped, explicit grant, auto-expiry) | Diagnostic default; location requires ticket grant. |
| **DEC-006** | Rescue Field Operating Model | TBD / Configurable by tenant operational policy | Optional add-on; incident-scoped revocation. |
| **DEC-007** | Specialized Fleet Pack Launch Rollout Order | TBD based on initial anchor customer demand | Preserved as modular commercial add-ons. |
| **DEC-008** | Payment Gateway Provider Selection | TBD / Integration candidate selection | Preserved as digital payment gateway framework. |
| **DEC-009** | Telemetry Raw Data Retention Duration | TBD + Statutory legal/privacy verification required | Supported via multi-tier data retention design. |
| **DEC-010** | Crash Video Clip Retention Duration | TBD + Statutory legal/privacy verification required | Supported via media retention governance. |
| **DEC-011** | Cabin Voice Recording Retention Duration | TBD + Statutory legal/privacy verification required | Supported via voice retention governance. |
| **DEC-014** | Production AI Sensitive Data Class Approval | Zero PII / live telemetry sent to free cloud AI models | Strict provider secret & location privacy perimeter. |

---

## 107. LEGAL / REGULATORY VERIFICATION ITEMS

- **VTS Operator Licensing in Bangladesh:** Verification of statutory licensing and regulatory compliance requirements under the Bangladesh Telecommunication Regulatory Commission (BTRC) for external commercial Tracking Providers (LEGAL / REGULATORY VERIFICATION REQUIRED).
- **Telematics Data Processing & Cross-Border Hosting:** Verification of statutory data localization, sovereign data storage, and telematics privacy obligations where external provider infrastructure resides outside Bangladesh.
- **SIM/M2M Data Communication Regulations:** Verification of BTRC guidelines regarding M2M connectivity, static/dynamic IP pools, and commercial telematics APN routing.
- **Audio/Video Surveillance Compliance:** Verification of legal consent, workplace notification, and privacy standards governing in-cabin voice recording and dashcam streaming under Bangladesh law.
- **Government Emergency & Police Integration:** Verification of official memorandum of understanding (MoU) or statutory requirements before connecting to National Emergency Service (999) or BRTA portals.

---

## 108. BLOCKING QUESTIONS

> **Zero Blocking Questions.**  
The provider-neutral architecture, multi-provider tenant model, authoritative multi-stage mapping, fail-closed routing, command adapter boundaries, and provider lifecycle are fully specified based on approved upstream baselines (`PRODUCT_REQUIREMENTS.md` v1.0, `MODULE_SERVICE_ENTITLEMENT_SPEC.md` v1.0, `USER_ROLES_PERMISSIONS_ACCESS_SPEC.md` v1.0, `TENANT_ISOLATION_SECURITY_BOUNDARY_SPEC.md` v1.0, and `CUSTOMER_TYPES_COMMERCIAL_MODEL_SPEC.md` v1.0). The unresolved status of initial vendor selection (`DEC-002`) is an intentional upstream decision safely accommodated by the abstraction layer.

---

## 109. SPECIFICATION VERDICT

> # **TRACKING PROVIDER ARCHITECTURE APPROVED — AUTHORITATIVE BASELINE**

This authoritative downstream specification strictly adheres to approved Product Requirements Document v1.0 (`abef605`), Module & Service Entitlement Specification v1.0 (`a962a2a`), User Roles, Permissions, Authority & Access Specification v1.0 (`25e7834`), Tenant Isolation & Security Boundary Specification v1.0 (`93d7a4e`), and Customer Types & Commercial Model Specification v1.0 (`4014141`), establishes the complete architectural framework for provider-neutral telematics integration, and stands as an authoritative approved baseline.
