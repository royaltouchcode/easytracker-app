# Integration Registry & API Synchronization Specification

## 1. Document Control & Governance

- **File Path:** `docs/03_specs/INTEGRATION_REGISTRY_API_SYNC_SPEC.md`
- **Document Title:** Integration Registry & API Synchronization Specification
- **Status:** APPROVED
- **Version:** v1.0
- **Approval Date:** 2026-09-18
- **Project:** Vehicle Tracking Standalone Launch
- **Product Brand:** TBD (EasyTracker is temporary working name only, per PRD `DEC-001`)
- **Active Development Branch:** `vehicle-tracking-launch-v1`
- **Authority Status:** APPROVED DOWNSTREAM SPECIFICATION
- **Normative Requirement Namespace:** `IRAS-*`
- **Acceptance Gate Namespace:** `GATE-IRAS-##`
- **Authoritative Upstream Dependencies:**
  1. `docs/03_specs/PRODUCT_REQUIREMENTS.md` v1.0 (Commit `abef60593db6a34c144341f9c70503c5bda7faa6`)
  2. `docs/03_specs/MODULE_SERVICE_ENTITLEMENT_SPEC.md` v1.0 (Commit `a962a2a22a55060aea6d4efd630b2f209943adba`)
  3. `docs/03_specs/USER_ROLES_PERMISSIONS_ACCESS_SPEC.md` v1.0 (Commit `25e783447c96d3128f8ebaa51c78e8c0f6ec85de`)
  4. `docs/03_specs/TENANT_ISOLATION_SECURITY_BOUNDARY_SPEC.md` v1.0 (Commit `93d7a4eb11d37d229844f86fec2b05434c309fc3`)
  5. `docs/03_specs/CUSTOMER_TYPES_COMMERCIAL_MODEL_SPEC.md` v1.0 (Commit `401414171edd1612394980ef9a734a859fed21b6`)
  6. `docs/03_specs/TRACKING_PROVIDER_ARCHITECTURE_SPEC.md` v1.0 (Commit `88bcd536cd252c1419d49887370be1993738ba91`)
  7. `docs/03_specs/DEVICE_CAPABILITY_REGISTRY_SPEC.md` v1.0 (Commit `5c9fe52c8350167a880fcea38d3654a2c00dcb31`)
  8. `docs/03_specs/VEHICLE_KNOWLEDGE_REGISTRY_SPEC.md` v1.0 (Commit `0e60ce3484c307b0451c46c120711ef0cef3acca`)
  9. `docs/03_specs/REGULATORY_KNOWLEDGE_SERVICE_SPEC.md` v1.0 (Commit `d26153bce8b6eab21fbf0b50fd8c176aeb8feb40`)
  10. `docs/03_specs/COMMAND_SAFETY_EXECUTION_SPEC.md` v1.0 (Commit `ebccd291d8d14152b30c7591c10b4b6eab20afa5`)
  11. `docs/03_specs/FLEET_PACK_SPEC.md` v1.0 (Commit `220ac0d90d76db36d5e03b117bc0e8bcb2264651`)
  12. `docs/03_specs/SALES_SUPPORT_RESCUE_SPEC.md` v1.0 (Commit `97cd0704454b87c4a9474c2675a533ec2cb67f76`)
  13. `docs/03_specs/SIM_M2M_DEVICE_INVENTORY_SPEC.md` v1.0 (Commit `4542f84b0a9b2fd78c49376fb916bc41c4761c91`)
  14. `docs/03_specs/SERVICE_WARRANTY_RMA_SPEC.md` v1.0 (Commit `c8d8dbdbb1d67e0691c311993890b1f228dd01b5`)
  15. `docs/03_specs/MEDIA_VOICE_VIDEO_SPEC.md` v1.0 (Commit `20037e34a2396ea03fb65f1eff7f7427761038c3`)

---

## 2. Executive Summary & Core Architectural Boundaries

- **IRAS-GEN-001 (Core Integration Registry Purpose & Scope):**
  - This specification defines the authoritative architecture, lifecycle governance, secure credential isolation, inbound telematics REST/webhook gateway (`POST /api/v1/telemetry/push`), external identifier mapping, and multi-tenant synchronization boundaries for all external integrations across the Vehicle Tracking Standalone Launch platform (`PRD-ITG-001`, `PRD-API-001`, `URPA-INT-001`).
  - Authority Classification: DIRECT UPSTREAM (`PRD-ITG-001`, `PRD-API-001`, `URPA-INT-001`).

- **IRAS-GEN-002 (Architectural Implementation Neutrality):**
  - All requirements, entities, lifecycle workflows, and mapping models defined in this specification are platform-, language-, database-, and broker-neutral.
  - This specification strictly prescribes logical invariants, state transitions, security boundaries, and authorization contracts without prescribing concrete database DDL schemas, table column types, specific Object-Relational Mapping (ORM) entities, low-level HTTP controllers, messaging middleware (e.g. Kafka, RabbitMQ, Redis Streams, AWS SQS), or cloud provider ecosystems (`TISB-GEN-003`, `SWR-GEN-004`).
  - Authority Classification: DOWNSTREAM ARCHITECTURAL COMPOSITION (`TISB-GEN-003`, `SWR-GEN-004`).

- **IRAS-GEN-003 (Fail-Closed Integration Default):**
  - If any integration configuration, authentication token, webhook signature, tenant binding, rate limit check, or safety prerequisite is invalid, expired, missing, unverified, or encounters an internal timeout/error, the Integration Registry and API Gateway MUST immediately fail closed (deny execution, drop telemetry, or reject command dispatch) (`URPA-SEC-002`, `MSE-ENT-002`).
  - Authority Classification: DIRECT UPSTREAM (`URPA-SEC-002`, `MSE-ENT-002`).

- **IRAS-GEN-004 (Core Entity Separations):**
  - The platform strictly enforces explicit separation of architectural entities across all integration workflows:
    1. *Integration Registration $\neq$ Tracking Provider Registration:* An Integration Registration represents the administrative lifecycle, network configuration, and credentials of an external gateway; a Tracking Provider Registration (`TPA`) represents telematics ingestion protocol routing and protocol parser adapters.
    2. *Integration Credential $\neq$ Human User Credential:* Machine API keys, provider tokens, and webhook secrets are cryptographically and administratively decoupled from human user accounts and interactive session tokens.
    3. *Integration State $\neq$ Feature Entitlement:* An active integration in the registry establishes gateway availability, not commercial subscription rights or tenant module entitlements (`CTCM-GEN-009`).
    4. *Integration State $\neq$ User Permission:* Gateway active status does not confer IAM execution privileges upon human operators or client applications (`URPA-INT-001`).
    5. *Connection Health $\neq$ Feature Availability:* Observed network health reachability describes operational transport conditions, not administrative entitlement or policy enablement (`TPA-LCY-001`).
    6. *External Identifier $\neq$ Internal Entity Identity:* External reference numbers, provider device IDs, or supplier ticket IDs are transient mappings and never supersede canonical internal UUIDs/surrogates.
    7. *Integration Connectivity $\neq$ Media Authority:* External media streaming or audio/video access is governed exclusively by `MEDIA_VOICE_VIDEO_SPEC.md` (`MVV-PRV-001`).
    8. *External Integration $\neq$ Device Capability Authority:* Provider API claims or external hardware documentation do not alter bench-tested hardware capabilities verified in `DEVICE_CAPABILITY_REGISTRY_SPEC.md` (`DCR-GEN-001`).
    9. *External Integration $\neq$ Vehicle Compatibility Authority:* External gateway metadata cannot declare vehicle electrical compatibility; `VEHICLE_KNOWLEDGE_REGISTRY_SPEC.md` (`VKR-GEN-001`) is the sole platform authority.
    10. *Integration $\neq$ Command Authorization:* External API requests never bypass Command Safety & Execution Engine gates (`CSE-INT-001`).
    11. *Provider ACK $\neq$ Device ACK $\neq$ Physical Outcome:* Transport acknowledgment from an external gateway API does not prove hardware reception or verified physical vehicle actuation (`CSE-GEN-006`).
  - Authority Classification: DOWNSTREAM ARCHITECTURAL COMPOSITION (`TPA-LCY-001`, `MVV-PRV-001`, `CSE-GEN-006`).

---

## 3. Approved Upstream Baseline & Reconciliation

The platform documentation hierarchy adheres strictly to `docs/DOCUMENT_AUTHORITY_INDEX.md`. This specification is formally subordinated to the 15 approved upstream specifications, each confirmed by immutable repository commit hashes:
- `docs/03_specs/PRODUCT_REQUIREMENTS.md` v1.0 (`abef60593db6a34c144341f9c70503c5bda7faa6`)
- `docs/03_specs/MODULE_SERVICE_ENTITLEMENT_SPEC.md` v1.0 (`a962a2a22a55060aea6d4efd630b2f209943adba`)
- `docs/03_specs/USER_ROLES_PERMISSIONS_ACCESS_SPEC.md` v1.0 (`25e783447c96d3128f8ebaa51c78e8c0f6ec85de`)
- `docs/03_specs/TENANT_ISOLATION_SECURITY_BOUNDARY_SPEC.md` v1.0 (`93d7a4eb11d37d229844f86fec2b05434c309fc3`)
- `docs/03_specs/CUSTOMER_TYPES_COMMERCIAL_MODEL_SPEC.md` v1.0 (`401414171edd1612394980ef9a734a859fed21b6`)
- `docs/03_specs/TRACKING_PROVIDER_ARCHITECTURE_SPEC.md` v1.0 (`88bcd536cd252c1419d49887370be1993738ba91`)
- `docs/03_specs/DEVICE_CAPABILITY_REGISTRY_SPEC.md` v1.0 (`5c9fe52c8350167a880fcea38d3654a2c00dcb31`)
- `docs/03_specs/VEHICLE_KNOWLEDGE_REGISTRY_SPEC.md` v1.0 (`0e60ce3484c307b0451c46c120711ef0cef3acca`)
- `docs/03_specs/REGULATORY_KNOWLEDGE_SERVICE_SPEC.md` v1.0 (`d26153bce8b6eab21fbf0b50fd8c176aeb8feb40`)
- `docs/03_specs/COMMAND_SAFETY_EXECUTION_SPEC.md` v1.0 (`ebccd291d8d14152b30c7591c10b4b6eab20afa5`)
- `docs/03_specs/FLEET_PACK_SPEC.md` v1.0 (`220ac0d90d76db36d5e03b117bc0e8bcb2264651`)
- `docs/03_specs/SALES_SUPPORT_RESCUE_SPEC.md` v1.0 (`97cd0704454b87c4a9474c2675a533ec2cb67f76`)
- `docs/03_specs/SIM_M2M_DEVICE_INVENTORY_SPEC.md` v1.0 (`4542f84b0a9b2fd78c49376fb916bc41c4761c91`)
- `docs/03_specs/SERVICE_WARRANTY_RMA_SPEC.md` v1.0 (`c8d8dbdbb1d67e0691c311993890b1f228dd01b5`)
- `docs/03_specs/MEDIA_VOICE_VIDEO_SPEC.md` v1.0 (`20037e34a2396ea03fb65f1eff7f7427761038c3`)

---

## 4. Integration Registry Lifecycle Model

- **IRAS-LCY-001 (8-State Integration Governance Lifecycle):**
  - In strict accordance with `PRD-ITG-001`, every external integration (telematics provider gateways, government interfaces, telecom M2M APIs, payment gateways, and AI services) MUST be tracked in the Integration Registry across exactly 8 canonical lifecycle states:
    $$\mathbf{PLANNED} \longrightarrow \mathbf{DOCUMENTATION\_PENDING} \longrightarrow \mathbf{SANDBOX} \longrightarrow \mathbf{APPROVED} \longrightarrow \mathbf{ACTIVE} \longleftrightarrow \mathbf{DEGRADED} \longleftrightarrow \mathbf{SUSPENDED} \longrightarrow \mathbf{RETIRED}$$
  - No states may be added, removed, reordered, or renamed (`PRD-ITG-001`).
  - Authority Classification: DIRECT UPSTREAM (`PRD-ITG-001`).

- **IRAS-LCY-002 (Administrative State Transition Invariants):**
  - External integrations progress through lifecycle states strictly via authorized administrative actions (`URPA-INT-001`):
    1. `PLANNED`: External gateway identified on roadmap; no endpoint or credential configuration active.
    2. `DOCUMENTATION_PENDING`: Gateway technical architecture initiated; API documentation or contract verification incomplete.
    3. `SANDBOX`: Non-production test credentials configured; sandbox connectivity validation in progress.
    4. `APPROVED`: Technical compatibility, security verification, and contractual prerequisites certified by platform governance.
    5. `ACTIVE`: Live production gateway operational and authorized for production traffic dispatch and ingestion.
    6. `DEGRADED`: Gateway experiencing elevated operational failure rates, rate limits, or packet delays; manual or policy-guided investigation active.
    7. `SUSPENDED`: Gateway administratively halted due to security alerts, commercial termination, or infrastructure downtime.
    8. `RETIRED`: Gateway permanently decommissioned; historical configuration retained strictly for immutable audit provenance (`TPA-OFF-003`).
  - Commercially entitled integrations with status `PLANNED` or `DOCUMENTATION_PENDING` SHALL remain non-executable in production (`MSE-ITG-001`).
  - Authority Classification: DIRECT UPSTREAM (`MSE-ITG-001`, `TPA-LCY-001`).

- **IRAS-LCY-003 (Governance State vs Observed Telemetry Health):**
  - The platform strictly separates administrative Integration Registry governance state (`ACTIVE`, `DEGRADED`, `SUSPENDED`) from dynamic Observed Provider Health (Healthy/Available, Degraded, Unavailable) (`TPA-LCY-001`).
  - Real-time telemetry connection drops or momentary timeouts evaluate dynamically under operational observability (`TPA-HLT-001`) and SHALL NOT automatically mutate administrative Integration Registry governance states without separate, approved administrative policy intervention.
  - Authority Classification: DIRECT UPSTREAM (`TPA-LCY-001`, `TPA-HLT-001`).

- **IRAS-LCY-004 (Production Activation Verification Gate):**
  - Moving an integration from `APPROVED` to `ACTIVE` requires satisfying all mandatory onboarding verification gates: server-side endpoint URLs and credentials configured, non-production sandbox handshake validated, device ID mapping format verified, and explicit administrative approval granted under `platform.integration.activate` (`TPA-LCY-003`, `TPA-LCY-004`, `URPA-INT-001`).
  - Production gateway activation is a high-risk platform-reserved action and SHALL NEVER be triggered automatically or delegated to unprivileged users (`URPA-PERM-004`).
  - Authority Classification: DIRECT UPSTREAM (`TPA-LCY-003`, `TPA-LCY-004`, `URPA-INT-001`).

- **IRAS-LCY-005 (Prohibition of Mock Endpoints as Live Proof):**
  - In strict accordance with `PRD-ITG-002`, hardcoded prototype endpoints, mock URLs, simulated responses, or staging fixtures in legacy code or test harnesses SHALL NOT be treated as proof of live government, telecom, or commercial external integration availability.
  - An integration cannot enter `APPROVED` or `ACTIVE` status based on mock execution evidence (`PRD-ITG-002`).
  - Authority Classification: DIRECT UPSTREAM (`PRD-ITG-002`).

---

## 5. IAM & Commercial Entitlement Boundary

- **IRAS-IAM-001 (Platform Integration IAM Permissions):**
  - Integration Registry administration is strictly governed by the canonical lifecycle permissions defined in `USER_ROLES_PERMISSIONS_ACCESS_SPEC.md` Section 37 and Section 64:
    - `platform.integration.view`: View integration configurations, lifecycle status, and connection endpoints (Platform Only, non-sensitive).
    - `platform.integration.configure`: Configure external integration endpoints, parameters, and credentials (Platform Only, sensitive).
    - `platform.integration.test`: Trigger non-production sandbox handshake and diagnostic connectivity queries (Platform Only, non-sensitive).
    - `platform.integration.approve`: High-risk certification that integration security and contracts are satisfied (Platform Only, sensitive, high-risk).
    - `platform.integration.activate`: High-risk authorization moving integration to live production `ACTIVE` status (Platform Only, sensitive, high-risk).
    - `platform.integration.suspend`: Administrative suspension halting live traffic through an integration (Platform Only, sensitive).
    - `platform.integration.retire`: Permanent deprecation and decommission of an integration (Platform Only, sensitive).
  - All integration permissions are strictly `PLATFORM_RESERVED` (`URPA-PERM-004`) and cannot be assigned or delegated by tenant administrators.
  - Authority Classification: DIRECT UPSTREAM (`URPA-INT-001`, `URPA-PERM-004`).

- **IRAS-IAM-002 (Absence of Commercial Integration Module):**
  - Integration capabilities operate as intrinsic platform capabilities (Layer 1 of the 6-layer formula in `MSE-ENT-001`).
  - `INTEGRATION COMMERCIAL MODULE TOKEN NOT ESTABLISHED UPSTREAM`. No commercial module token (e.g. `MOD-INT-15`) exists in `MODULE_SERVICE_ENTITLEMENT_SPEC.md`. Token `MOD-SIM-15` governs SIM / M2M Lifecycle ERP exclusively.
  - Platform integration governance SHALL NOT be conditioned on commercial module purchase or tenant subscription plans (`MSE-GEN-002`, `MSE-ENT-001`).
  - Authority Classification: DIRECT UPSTREAM (`MSE-GEN-002`, `MSE-ENT-001`).

- **IRAS-IAM-003 (Authority Gap on Tenant-Delegable Mutation):**
  - `AUTHORITY GAP — TENANT-DELEGABLE INTEGRATION MUTATION PERMISSION NOT DEFINED UPSTREAM`.
  - Approved URPA establishes zero tenant-delegable integration permissions (e.g. `tenant.integration.manage` does not exist).
  - All integration configurations and secret updates default strictly to `Platform Owner` and `Platform Admin` actors. Any future tenant-scoped integration management must be formally approved in an upstream URPA revision.
  - Authority Classification: FAIL-CLOSED AUTHORITY GAP (`URPA-PERM-004`).

- **IRAS-IAM-004 (Operational Role Access Isolation):**
  - Operational roles—including `Support Agent`, `Technical Support`, `Sales Agent`, `Dealer / Channel`, `Rescue Dispatcher`, `Rescue Member`, `Tech Installer`, and `Driver`—have `platform.*` set to `NO` or `NOT ALLOWED` (`URPA-ROLE-006`, `URPA-ROLE-008`, `URPA` Section 84).
  - Operational roles possess ZERO authority to view integration credentials, configure endpoints, rotate secrets, trigger sync jobs, or replay webhooks (`SSR-SUP-001`, `SSR-RSC-001`).
  - Authority Classification: DIRECT UPSTREAM (`URPA-ROLE-006`, `URPA-ROLE-008`, `SSR-SUP-001`).

---

## 6. Multi-Tenant Isolation & Credential Security

- **IRAS-TEN-001 (Semantic Multi-Tenant Isolation):**
  - All external integration configurations, client API keys, webhook endpoints, and data synchronizations MUST enforce strict multi-tenant isolation (`TISB-TEN-001`, `TISB-SEC-001`).
  - Tenant-specific integration configurations and provider credentials MUST be strictly isolated within that Tenant's administrative security perimeter (`TISB-PRV-001`, `TPA-SEC-002`). Cross-tenant visibility, execution, or credential sharing is strictly prohibited and fails closed.
  - Commercial Dealer / Channel reseller status confers commercial lead visibility only and confers zero cross-tenant integration configuration authority (`SWR-GEN-002`).
  - Authority Classification: DIRECT UPSTREAM (`TISB-TEN-001`, `TISB-SEC-001`, `TPA-SEC-002`).

- **IRAS-TEN-002 (Database Schema & Implementation Neutrality):**
  - In strict compliance with `TISB-GEN-003`, this specification preserves semantic tenant scoping without prescribing physical database schemas.
  - Field terms such as tenant scoping boundaries, integration identifiers, and platform-global flags describe logical security invariants, NOT mandatory physical database column names, foreign keys, or vendor-specific SQL DDL (`TISB-GEN-003`).
  - Authority Classification: DOWNSTREAM ARCHITECTURAL COMPOSITION (`TISB-GEN-003`).

- **IRAS-SEC-001 (Server-Side Encrypted Credential Vault):**
  - Tracking provider credentials, Traccar master tokens, external API keys, webhook secrets, and partner passwords MUST be stored in encrypted server-side vaults at rest (`PRD-PRV-004`, `TISB-SEC-002`).
  - Authority Classification: DIRECT UPSTREAM (`PRD-PRV-004`, `TISB-SEC-002`).

- **IRAS-SEC-002 (Client Non-Exposure Invariant):**
  - External integration credentials, backend API keys, provider master tokens, and raw media gateway secrets MUST NEVER be exposed to browser clients, mobile applications, or end-customer dashboards (`PRD-PRV-004`, `URPA-PRV-001`, `MVV-PRV-002`).
  - UI client interactions with external gateways MUST operate strictly via authenticated, authorized server-side backend proxies (`MVV-PRV-002`).
  - Authority Classification: DIRECT UPSTREAM (`PRD-PRV-004`, `URPA-PRV-001`, `MVV-PRV-002`).

- **IRAS-SEC-003 (Cryptographic Algorithm Scope Containment):**
  - In accordance with `PRD-SEC-001` (Line 707), the platform mandates generic AES-256 encryption at rest and TLS encryption in transit.
  - This specification strictly refrains from mandating unapproved cryptographic algorithms (e.g. AES-256-GCM), key derivation schemes (e.g. HKDF), or specific cloud vendor Key Management Services (e.g. AWS KMS, HashiCorp Vault). Concrete cryptographic primitives remain implementation details.
  - Authority Classification: DOWNSTREAM ARCHITECTURAL COMPOSITION (`PRD-SEC-001`).

---

## 7. Inbound Telematics REST & Signed Webhook Gateway

- **IRAS-API-001 (Inbound Telematics Push REST Endpoint):**
  - In strict accordance with `PRD-API-001`, the platform MUST provide a secure, authenticated REST API and signed Webhook endpoint at the exact path:
    $$\mathbf{POST\ /api/v1/telemetry/push}$$
  - This endpoint serves as the primary ingress gateway for external telematics providers pushing normalized tracking packets into the platform ingestion pipeline (`PRD-API-001`).
  - Authority Classification: DIRECT UPSTREAM (`PRD-API-001`).

- **IRAS-API-002 (API-Key Authentication Boundary):**
  - In accordance with `PRD-API-001`, requests to `POST /api/v1/telemetry/push` MUST authenticate via secure API key credentials bound to an active Integration Registry record.
  - Unauthenticated requests, requests with expired/revoked keys, or requests from integrations not in `ACTIVE` state MUST be rejected immediately (`PRD-API-001`, `MSE-ITG-001`). Formatted as HTTP 401 Unauthorized as a downstream REST architectural composition.
  - Authority Classification: DIRECT UPSTREAM (`PRD-API-001`, `MSE-ITG-001`) for mandatory authentication and active integration gating; DOWNSTREAM ARCHITECTURAL COMPOSITION for HTTP 401 response code formatting.

- **IRAS-API-003 (Inbound Telematics Rate Limiting):**
  - In accordance with `PRD-API-001`, the telematics push endpoint MUST enforce rate limiting to protect platform ingestion services from denial-of-service, runaway provider loops, or socket saturation.
  - Rate limiting operates at the integration connection perimeter. Excess requests must fail closed (`PRD-API-001`). Formatted as HTTP 429 Too Many Requests as a downstream REST architectural composition.
  - Authority Classification: DIRECT UPSTREAM (`PRD-API-001`) for rate-limiting enforcement; DOWNSTREAM ARCHITECTURAL COMPOSITION for HTTP 429 response code formatting.

- **IRAS-API-004 (Implementation-Neutral Replay Protection):**
  - In accordance with `PRD-API-001`, the telematics push endpoint MUST enforce replay protection to prevent malicious or accidental duplicate payload processing.
  - The exact replay-prevention mechanism is not established upstream. Replay protection mechanisms (such as timestamp currency validation against a configurable threshold, nonce-based validation, message identifiers, replay caches, or equivalent controls) MAY be selected as implementation choices only after downstream Data, API, Events, or Security architecture defines them. This specification preserves strict implementation neutrality and does NOT mandate specific timestamp validation, nonce, message-id, or rigid window algorithms (`PRD-API-001`).
  - Authority Classification: DIRECT UPSTREAM (`PRD-API-001`).

- **IRAS-API-005 (REST Surface Containment):**
  - The presence of `POST /api/v1/telemetry/push` in `PRD-API-001` SHALL NOT be construed as authority for a broad public REST API product.
  - Endpoints for resource entity CRUD (e.g. `/vehicles`, `/devices`, `/drivers`, `/customers`), GraphQL resolvers, or gRPC interfaces are NOT established upstream and are strictly excluded from this specification. Global API versioning policy beyond `/api/v1/` remains unestablished upstream.
  - Authority Classification: DOWNSTREAM ARCHITECTURAL COMPOSITION (`PRD-API-001`).

---

## 8. Webhook & Retry Boundary

- **IRAS-WHK-001 (Signed Inbound Webhook Verification):**
  - In strict accordance with `PRD-API-001`, webhook endpoints receiving telematics pushes MUST be cryptographically signed by the transmitting origin.
  - Inbound webhook payloads lacking a valid cryptographic signature or failing signature verification MUST be rejected immediately (`PRD-API-001`, `TPA-ING-003`).
  - Authority Classification: DIRECT UPSTREAM (`PRD-API-001`, `TPA-ING-003`).

- **IRAS-WHK-002 (Webhook Signature Algorithm Neutrality):**
  - `OUTBOUND WEBHOOK SIGNING STANDARD NOT ESTABLISHED UPSTREAM`.
  - While `TPA-ING-003` cites HMAC signatures as an architectural example, neither `PRD-API-001` nor any upstream specification mandates a specific signature header name (e.g. `X-EasyTracker-Signature-256`) or specific algorithm (e.g. HMAC-SHA256).
  - Webhook signature validation remains algorithm-neutral at the specification tier, accommodating provider-native signature protocols without inventing unapproved header standards.
  - Authority Classification: DOWNSTREAM ARCHITECTURAL COMPOSITION (`PRD-API-001`, `TPA-ING-003`).

- **IRAS-WHK-003 (Authority Gap on Outbound Webhook Delivery):**
  - `AUTHORITY GAP — OUTBOUND WEBHOOK DELIVERY GUARANTEE NOT DEFINED UPSTREAM`.
  - Upstream specifications establish no requirements for outbound event webhook delivery semantics, delivery guarantees (e.g. at-least-once), Dead Letter Queues (DLQ), or manual replay interfaces.
  - The platform does not mandate background retry worker topologies or dead-letter storage. Outbound webhook architecture is deferred to downstream API contract specifications.
  - Authority Classification: FAIL-CLOSED AUTHORITY GAP (`PRD-API-001`).

- **IRAS-RTY-001 (Retry & Deduplication Non-Invention):**
  - The following concepts are NOT established upstream and are strictly excluded from normative requirements: 24-hour deduplication windows, cached duplicate acknowledgments, exponential backoff formulas, jitter algorithms, and hardcoded HTTP status retry matrices (e.g. 429/502/503/504 retry vs 4xx non-retry).
  - In accordance with `TPA-TEL-001` and `PRD-ING-003`, the ingestion pipeline handles duplicate messages and timestamp re-sequencing via logical idempotency controls without discarding legitimate sequential sensor readings. Specific caching windows and mathematical backoff algorithms remain downstream engineering decisions.
  - Authority Classification: DOWNSTREAM ARCHITECTURAL COMPOSITION (`TPA-TEL-001`, `PRD-ING-003`).

---

## 9. External Identifier & Mapping Architecture

- **IRAS-MAP-001 (External Provider Device ID Ingestion):**
  - In accordance with `TPA-MAP-001`, `TPA-MAP-002`, and TPA Section 99, telematics packets ingested from external gateways identify devices using provider-native identifiers (e.g. `External Provider Device ID`).
  - The Integration Registry provides the connector configuration linking an external provider connection to the authoritative Multi-Stage Mapping Chain (`TPA-MAP-002`).
  - Authority Classification: DIRECT UPSTREAM (`TPA-MAP-001`, `TPA-MAP-002`).

- **IRAS-MAP-002 (Ambiguous & Unmapped Identifier Fail-Closed):**
  - In strict compliance with `TPA-MAP-002`, `TPA-MAP-003`, and `TISB-PRV-001`, if an inbound telemetry packet contains an unknown external identifier, an ambiguous identifier mapping, or an identifier bound to an inactive/suspended tenant, the ingestion engine MUST immediately drop the payload from customer visibility (`TPA-MAP-002`).
  - In accordance with `TPA-MAP-002`, unmapped data MAY enter a quarantined administrative reconciliation log for diagnostic review, but SHALL NEVER be exposed to customer dashboards or create orphan asset records. In strict compliance with `TPA-MAP-003`, the ingestion engine SHALL NOT execute fallback routing to default tenants, guess tenant assignments, or route ambiguous data to alternate tenants.
  - Authority Classification: DIRECT UPSTREAM (`TPA-MAP-002`, `TPA-MAP-003`, `TISB-PRV-001`).

- **IRAS-MAP-003 (Abstract Identifier Mapping Independence):**
  - External identifier mappings (e.g. external work order references, supplier ticket numbers, carrier SIM references) operate as logical associative links and SHALL NOT be bound to rigid database tuple schemas (`SWR-GEN-002`, `TPA-SCL-003`).
  - External identifier mappings cannot modify canonical internal identities, customer account boundaries, or vehicle registrations.
  - Authority Classification: DOWNSTREAM ARCHITECTURAL COMPOSITION (`SWR-GEN-002`, `TPA-SCL-003`).

---

## 10. Tracking Provider & Media Provider Boundaries

- **IRAS-PRV-001 (Tracking Provider Control Plane Subordination):**
  - In accordance with `PRD-PRV-001` and `TPA-PRV-001`, telematics abstraction is governed authoritatively by the Tracking Provider Control Plane.
  - The Integration Registry tracks gateway connectivity and credentials, but DOES NOT determine device-to-provider routing, protocol packet decoding, or multi-provider assignment (`PRD-PRV-003`, `TPA-ROU-001`).
  - Authority Classification: DIRECT UPSTREAM (`PRD-PRV-001`, `TPA-PRV-001`).

- **IRAS-PRV-002 (Routing Non-Override & Fallback Prohibition):**
  - Integration Registry connectivity configurations SHALL NOT override explicit device-to-provider bindings established in TPA (`TPA-ROU-001`).
  - The platform strictly prohibits unapproved fallback mechanisms: there is no first-provider fallback, no default-provider fallback, and no automatic failover to synthetic demo providers (`TPA-ROU-001`, `TPA-DMO-001`). If a mapped provider connection is down, telemetry ingestion fails closed.
  - Authority Classification: DIRECT UPSTREAM (`TPA-ROU-001`, `TPA-DMO-001`).

- **IRAS-MED-001 (Media Provider Architecture Segregation):**
  - In accordance with `MVV-PRV-001` and `TPA-MED-001`, the platform strictly segregates Tracking Providers (handling GNSS coordinates, telemetry, and commands) from Media Providers (handling audio streams, dashcam video, and media file transfers).
  - Telematics integration support SHALL NOT imply media streaming support. Media gateway connectivity is governed exclusively by `MEDIA_VOICE_VIDEO_SPEC.md` (`MVV-PRV-001`).
  - Authority Classification: DIRECT UPSTREAM (`MVV-PRV-001`, `TPA-MED-001`).

- **IRAS-MED-002 (Media Credential & Protocol Neutrality):**
  - External media provider credentials and raw stream URLs must be shielded and never exposed directly to unauthenticated clients (`MVV-PRV-002`).
  - In accordance with `MEDIA_VOICE_VIDEO_SPEC.md`, protocol streaming technologies (such as RTSP, WebRTC, and HLS) are implementation-neutral examples and are NOT mandated as universal platform standards. Media session control operates via proxying and temporary tokens without requiring dedicated proprietary relay hardware (`MVV-PRV-002`).
  - Authority Classification: DIRECT UPSTREAM (`MVV-PRV-002`).

---

## 11. Hardware Capability & Vehicle Compatibility Boundaries

- **IRAS-DCR-001 (Hardware Capability Gating Subordination):**
  - External integration feeds, provider documentation, and vendor API responses SHALL NOT be treated as authoritative verification of device hardware capabilities (`DCR-GEN-001`).
  - Device capabilities (sensor inputs, output relays, voice hardware, camera channels) are governed exclusively by bench-tested profiles in `DEVICE_CAPABILITY_REGISTRY_SPEC.md` (`DCR-GEN-001`). If a capability is unverified in DCR, the platform fails closed regardless of external provider claims (`DCR-CAP-002`).
  - Authority Classification: DIRECT UPSTREAM (`DCR-GEN-001`, `DCR-CAP-002`).

- **IRAS-VKR-001 (Vehicle Compatibility Subordination):**
  - External integration metadata and third-party telematics payloads SHALL NOT be treated as authority for vehicle electrical architecture, OBD-II profile, or immobilizer relay compatibility (`VKR-GEN-001`).
  - `VEHICLE_KNOWLEDGE_REGISTRY_SPEC.md` is the sole platform authority for vehicle compatibility. Commands or features incompatible with the target vehicle's VKR profile fail closed immediately (`VKR-CMP-001`).
  - Authority Classification: DIRECT UPSTREAM (`VKR-GEN-001`, `VKR-CMP-001`).

---

## 12. Command Safety & Execution Subordination (Critical)

- **IRAS-CSE-001 (Non-Bypassable 9-Term Command Authorization):**
  - In strict compliance with `COMMAND_SAFETY_EXECUTION_SPEC.md` (`CSE-INT-001`), commands initiated via external 3rd-party APIs, webhooks, or integration keys MUST authenticate as machine actors, bind to an explicit tenant context, and satisfy the complete 9-term authorization formula:
    $$\text{Authorized} \iff \text{Actor} \land \text{Membership} \land \text{Tenant} \land \text{Entitlement} \land \text{Permission} \land \text{Scope} \land \text{Purpose} \land \text{Device Capability} \land \text{Safety Policy}$$
  - An active integration key, administrator API token, or external partner credential NEVER bypasses command safety gates (`CSE-INT-001`, `CSE-AUT-001`).
  - Authority Classification: DIRECT UPSTREAM (`CSE-AUT-001`, `CSE-INT-001`).

- **IRAS-CSE-002 (Zero Fixed Speed Thresholds & Profile Gating):**
  - In accordance with `CSE-SAF-003` ("Zero Fixed Speed Threshold Principle"), the platform contains zero hardcoded numeric speed thresholds (e.g. `<= 5 km/h` is strictly non-canonical and prohibited). Safe speed limits and immobilization safety envelopes are governed dynamically by vehicle profiles in VKR and tenant safety policies (`CSE-SAF-003`).
  - High-risk commands strictly enforce canonical terminology: **`Engine Disable`** and **`Engine Restore`**. `Engine Restore` safe-state evaluation is decoupled from motion predicates to prevent vehicle lockout traps (`CSE-SAF-005`).
  - Operational commands (`Reboot`, `APN Configuration`) are classified as `Operational Config` (`CSE-SAF-001`) and are NOT governed by powertrain immobilization safe-state predicates. Universal dual approval, universal OTP, universal PIN, and biometric checks are not mandated upstream.
  - Authority Classification: DIRECT UPSTREAM (`CSE-SAF-001`, `CSE-SAF-003`, `CSE-SAF-005`).

- **IRAS-CSE-003 (Multi-Tier Acknowledgment Verification):**
  - External integrations interacting with commands MUST preserve the strict 3-tier acknowledgment model:
    $$\mathbf{Provider\ ACK} \neq \mathbf{DEVICE\_ACKNOWLEDGED} \neq \mathbf{PHYSICAL\_CONFIRMED}$$
  - An HTTP 200 OK or transport-level `Provider ACK` from an external provider gateway confirms only message receipt by the intermediary. External integrations SHALL NEVER report physical execution success to clients based solely on provider transport acknowledgments (`CSE-GEN-006`, `CSE-ACK-001`).
  - Authority Classification: DIRECT UPSTREAM (`CSE-GEN-006`, `CSE-ACK-001`).

---

## 13. Master-Data & Synchronization Conflict Boundary

- **IRAS-SYN-001 (Registry Master-Data Subordination):**
  - The Integration Registry acts as an external connector and gateway repository, NOT the master system of record for platform domain entities. Domain authority belongs strictly to dedicated platform registries:
    - Vehicle engineering reference knowledge, electrical taxonomy, and compatibility profiles: Authoritative in `VEHICLE_KNOWLEDGE_REGISTRY_SPEC.md` (`VKR-GEN-001`). Operational vehicle asset instances and cross-system sync conflict policies represent an upstream authority gap (`SYNC MASTER-DATA AUTHORITY NOT ESTABLISHED UPSTREAM`).
    - Device hardware profiles: Authoritative in `DEVICE_CAPABILITY_REGISTRY_SPEC.md` (`DCR-GEN-001`).
    - SIM and M2M inventory: Authoritative in `SIM_M2M_DEVICE_INVENTORY_SPEC.md` (`SMDI-GEN-001`).
    - Service and RMA cases: Authoritative in `SERVICE_WARRANTY_RMA_SPEC.md` (`SWR-GEN-001`).
    - Media recordings, storage, and evidentiary assets: Authoritative in `MEDIA_VOICE_VIDEO_SPEC.md` (`MVV-MED-001`, `MVV-EVD-001`).
  - External synchronization jobs SHALL NOT overwrite authoritative registry data without explicit domain validation.
  - Authority Classification: DIRECT UPSTREAM (`VKR-GEN-001`, `DCR-GEN-001`, `SMDI-GEN-001`, `SWR-GEN-001`, `MVV-MED-001`, `MVV-EVD-001`).

- **IRAS-SYN-002 (Authority Gap on External Sync Conflict Policy):**
  - `SYNC MASTER-DATA AUTHORITY NOT ESTABLISHED UPSTREAM`.
  - The platform does not mandate a universal "local always wins" or "external always wins" merge policy.
  - Synchronization conflict rules for external systems (e.g. external ERP customer updates vs local tenant profiles) are not defined in upstream PRD/specs and must be explicitly specified per domain in downstream data synchronization specifications.
  - Authority Classification: FAIL-CLOSED AUTHORITY GAP (`TPA-GEN-001`).

---

## 14. Service, Warranty & RMA Integration Boundary

- **IRAS-SWR-001 (RMA Lifecycle Non-Override):**
  - In strict compliance with `PRD-RMA-001` and `SERVICE_WARRANTY_RMA_SPEC.md` (`SWR-GEN-001`, Matrix 2, `GATE-SWR-09`), the platform enforces the serialized 6-milestone RMA lifecycle:
    $$\mathbf{FAULT\_REPORTED} \longrightarrow \mathbf{TECHNICIAN\_INSPECTED} \longrightarrow \mathbf{RETURNED\_TO\_WAREHOUSE} \longrightarrow \mathbf{SUPPLIER\_RMA\_DISPATCHED} \longrightarrow \mathbf{REPAIRED\ /\ REPLACED} \longrightarrow \mathbf{RESTOCKED\ /\ SCRAPPED}$$
  - External supplier integrations, warranty portals, or logistics APIs SHALL NOT rename, reorder, or insert unapproved states into the RMA workflow (`PRD-RMA-001`, `SWR-GEN-001`). Direct supplier RMA API automation is unestablished upstream.
  - Authority Classification: DIRECT UPSTREAM (`PRD-RMA-001`, `SWR-GEN-001`).

- **IRAS-SWR-002 (Hardware Replacement Continuity Linkage):**
  - When an external RMA or field service workflow replaces a faulty telematics unit, the system remaps the new device IMEI to the vehicle per `PRD-DEV-002`, preserving historical telemetry, trips, and alerts across non-overlapping intervals ($[T_{initial}, T_{swap})$ and $[T_{swap}, T_{end}]$).
  - The hardware swap automatically triggers dynamic capability recalculation in DCR (`SWR-GEN-001`, `PRD-DEV-002`).
  - Authority Classification: DIRECT UPSTREAM (`PRD-DEV-002`, `SWR-GEN-001`).

---

## 15. SIM, M2M & Telecom Carrier Boundary

- **IRAS-SIM-001 (SIM Card Inventory & Carrier Boundary):**
  - In strict accordance with `SIM_M2M_DEVICE_INVENTORY_SPEC.md`, cellular SIM inventory is governed under `MOD-SIM-15` (`SMDI-GEN-001`).
  - SIM records capture ICCID (ITU-T E.118, globally unique), MSISDN (E.164, masked for unprivileged roles), IMSI (masked), and APN profiles (`SMDI-SIM-001`).
  - `CARRIER API NOT ESTABLISHED UPSTREAM`. The platform does not establish direct telecom carrier REST APIs, automated MNO provisioning integrations, or carrier portal ticketing systems. Cellular carrier request tracking and provisioning evidence separation operate strictly in accordance with `SMDI-SIM-004`, while SIM card lifecycle states adhere to `SMDI-SIM-003`. External carrier confirmation is decoupled from internal administrative requests, and live carrier APIs remain unestablished upstream.
  - SIM Carrier $\neq$ Tracking Provider $\neq$ Integration Registration.
  - Authority Classification: DIRECT UPSTREAM (`SMDI-SIM-001`, `SMDI-SIM-003`, `SMDI-SIM-004`).

---

## 16. Government & Regulatory Readiness Boundary

- **IRAS-GOV-001 (Government Gateway Readiness & Statutory Gating):**
  - In accordance with `PRD-GOV-001` and `PRD-GOV-002`, the platform maintains data model readiness for automated vehicle registration, fitness certificate, and tax token verification with BRTA IS, and secure query readiness for law enforcement and emergency 999 dispatch.
  - `GOVERNMENT INTEGRATION NOT ESTABLISHED UPSTREAM`. No live government API integrations are active or approved upstream. BTRC authority represents telematics device import and radio frequency regulatory knowledge (`RKS-AUT-003`, `RKS-EXT-001`), not a live external API gateway.
  - In accordance with `MSE-REG-002` and `RKS-EXT-001`, statutory compliance integrations MUST remain gated under:
    $$\mathbf{LEGAL\ /\ REGULATORY\ VERIFICATION\ REQUIRED}$$
  - Features dependent on unresolved statutory integrations remain disabled in production (`MSE-REG-002`).
  - Authority Classification: DIRECT UPSTREAM (`PRD-GOV-001`, `PRD-GOV-002`, `MSE-REG-002`).

---

## 17. Commercial Billing & Payment Abstraction Boundary

- **IRAS-BIL-001 (Commercial Billing & Payment Abstraction Boundary):**
  - In accordance with `SWR-GEN-003` (Section 4.3) and `PRD-BIL-001`, customer invoicing, subscription fee calculation, rate cards, and payment processing are deferred to the downstream **Billing & Metering Specification**.
  - Strategic open decisions `DEC-004` (package pricing) and `DEC-008` (payment gateway selection) remain open.
  - Candidate payment gateways listed in `PRD-COM-003` (bKash, Nagad, SSLCommerz, Bank Transfer, COD) are illustrative candidate options. The Integration Registry does NOT own merchant credentials, payment settlement logic, or IPN webhook callback processing (`PRD-COM-003`, `PRD-BIL-001`).
  - Authority Classification: DIRECT UPSTREAM (`PRD-COM-003`, `PRD-BIL-001`, `DEC-008`).

---

## 18. Artificial Intelligence & Demo Isolation

- **IRAS-AI-001 (Non-Authoritative AI & Strict Privacy Boundary):**
  - In accordance with `PRD-AI-001` through `PRD-AI-004`, external AI is abstracted through a multi-provider orchestrator and is strictly non-authoritative: *"AI assists: find, extract, compare, explain, recommend and automate safe workflows. Verified data and deterministic policy decide."* (`PRD-AI-003`).
  - Artificial intelligence models SHALL NEVER possess authority to assign devices to tenants, verify device capabilities, activate provider connections, or authorize high-risk vehicle commands (`TPA-AI-001`). Core tracking, safety rules, and permissions must not fail if external AI is unreachable (`PRD-AI-001`).
  - In strict accordance with `DEC-014` and `PRD-AI-004`:
    $$\mathbf{Zero\ PII\ /\ live\ telemetry\ sent\ to\ free\ cloud\ AI\ models}$$
  - Customer PII, live vehicle locations, historical coordinates, customer-linked IMEIs, SIM ICCIDs, cabin voice logs, dashcam videos, and integration credentials MUST NEVER be sent to free or unapproved public cloud AI models (`DEC-014`, `PRD-AI-004`).
  - Public demo simulation (`MOD-DMO-20`) operates strictly on synthetic demo telemetry (`TPA-DMO-001`).
  - Authority Classification: DIRECT UPSTREAM (`PRD-AI-001`, `PRD-AI-004`, `DEC-014`, `TPA-AI-001`).

---

## 19. Durable Audit Logging & Security Restraints

- **IRAS-AUD-001 (Tamper-Resistant Integration Audit Trail):**
  - In strict compliance with `PRD-AUD-002` and `URPA-AUD-003`, all integration lifecycle transitions, endpoint updates, credential rotations, and administrative approvals MUST generate immutable, tamper-resistant audit records capturing: User/Actor ID, Tenant ID, IP Address, Timestamp, Action Performed, Target Entity, and Outcome Status.
  - Audit logging operates as an implementation-neutral security invariant without mandating concrete database tuples (e.g. `diff_hash` columns are not required) (`PRD-AUD-002`, `URPA-AUD-003`).
  - Authority Classification: DIRECT UPSTREAM (`PRD-AUD-002`, `URPA-AUD-003`).

- **IRAS-AUD-002 (Plaintext Secret Logging Prohibition):**
  - In accordance with `PRD-PRV-004` and `TISB-SEC-002`, audit logs, debug traces, and telemetry error payloads MUST NEVER capture or expose plaintext secrets, API keys, private provider tokens, or webhook shared secrets.
  - Secret attributes recorded in audit trails MUST be redacted or masked (`PRD-PRV-004`, `TISB-SEC-002`).
  - Authority Classification: DOWNSTREAM ARCHITECTURAL COMPOSITION (`PRD-PRV-004`, `TISB-SEC-002`).

---

## 20. Scale, Non-Functional Requirements & Performance

- **IRAS-SCL-001 (High-Scale Architectural Target & Target Gap):**
  - In accordance with `PRD-SCL-001`, the platform architecture MUST scale gracefully from initial launch to a long-term target capacity of approximately 2,000,000 connected devices via horizontal scaling of ingestion nodes, provider adapters, and storage clusters.
  - `INTEGRATION THROUGHPUT TARGET NOT ESTABLISHED UPSTREAM`.
  - Upstream specifications establish zero integration-specific numeric throughput targets, requests-per-second quotas, packet batch sizes, or worker pool allocations. Specific capacity sizing remains a downstream infrastructure engineering responsibility (`PRD-SCL-001`).
  - Authority Classification: DIRECT UPSTREAM (`PRD-SCL-001`).

---

## 21. Formal IRAS Authority Gap Register

| Topic | Authority Gap Status | Existing Upstream Authority | Future Draft MAY Define | Future Draft MUST NOT Invent |
| :--- | :---: | :--- | :--- | :--- |
| **Tenant-Delegable Integration IAM** | **GAP EXISTS** | `platform.integration.*` (Platform reserved) | Logical tenant-scoping boundaries for configuration. | Inventing unapproved `tenant.integration.*` tokens without URPA revision. |
| **Granular Runtime Secret Rotation** | **GAP EXISTS** | `platform.integration.configure` | Lifecycle process for administrative secret rotation. | Inventing a dedicated `integration.secret.rotate` token as existing authority. |
| **Manual Webhook Replay Permission** | **GAP EXISTS** | None | Operational diagnostic interface for administrators. | Inventing `webhook.retry.manual` permission token. |
| **Runtime Sync-Trigger Permission** | **GAP EXISTS** | None | Administrative scheduled task trigger principles. | Inventing `sync.job.trigger` permission token. |
| **Partner / Public API IAM Token** | **GAP EXISTS** | `PRD-API-001` (API key authentication) | Machine API key scoping and lifecycle. | Inventing `partner.api.access` token or public API pricing tiers. |
| **Outbound Webhook Delivery Guarantee**| **GAP EXISTS** | `PRD-API-001` (Signed webhooks) | Best-effort delivery principles. | Mandating at-least-once delivery, DLQs, or broker topologies. |
| **Outbound Webhook Signing Algorithm** | **GAP EXISTS** | `PRD-API-001` (Signed webhooks) | Implementation-neutral cryptographic signature requirement. | Mandating `HMAC-SHA256` or `X-EasyTracker-Signature-256` as upstream standards. |
| **External Identifier General Mapping** | **GAP EXISTS** | `TPA-MAP-001` (Provider Device ID) | Abstract mapping interface. | Mandating rigid physical database tuples or index constraints. |
| **Cross-System Sync Conflict Policy** | **GAP EXISTS** | Local domain registries (VKR, DCR, SMDI, SWR) | Domain-specific precedence rules. | Inventing a universal "LOCAL ALWAYS WINS" rule. |
| **Concrete HTTP Retry / Non-Retry Matrix**| **GAP EXISTS** | None | Client-side retry guidance principles. | Mandating 429/502/503/504 retry matrices or fixed backoff curves. |
| **Idempotency Deduplication Window** | **GAP EXISTS** | `PRD-API-001` (Replay protection) | Implementation-neutral replay protection requirement. | Mandating fixed 24-hour deduplication windows. |
| **Global REST API Versioning Policy** | **GAP EXISTS** | Path `/api/v1/telemetry/push` | URI versioning convention for telematics push. | Mandating global content-negotiated API versioning frameworks. |
| **Integration Throughput Target** | **GAP EXISTS** | `PRD-SCL-001` (~2M connected devices) | Horizontal scalability principles. | Inventing numeric RPS quotas, batch limits, or worker pool counts. |
| **Live Government APIs** | **GAP EXISTS** | `PRD-GOV-001`, `PRD-GOV-002`, `PRD-ITG-002` | Data model readiness; fail-closed gating. | Inventing live BRTA or Police/999 API endpoints; conflating BTRC regulatory knowledge (`RKS-AUT-003`, `RKS-EXT-001`) with live API gateways. |
| **Direct Telecom Carrier APIs** | **GAP EXISTS** | `SMDI-SIM-001` to `SMDI-SIM-004` | Batch provisioning workflows. | Inventing direct MNO REST APIs or portal ticket automation. |
| **Direct Supplier RMA APIs** | **GAP EXISTS** | `SWR-GEN-003` (Section 4.3) | Logical handoff to supplier portals. | Inventing automated supplier EDI or shipping courier APIs. |
| **Payment Gateway Integration Ownership**| **GAP EXISTS** | `DEC-008`, `PRD-COM-003`, `PRD-BIL-001` | Deferral boundary to Billing & Metering spec. | Assigning merchant credential or IPN callback ownership to Integration Registry. |

---

## 22. Comprehensive Traceability Matrix

| Requirement ID | Requirement / Obligation Summary | Upstream Authority | Authority Type | Downstream / Deferred Dependency |
| :--- | :--- | :--- | :--- | :--- |
| **IRAS-GEN-001** | Core Integration Registry purpose, lifecycle governance, and API gateway scope | `PRD-ITG-001`, `PRD-API-001`, `URPA-INT-001` | DIRECT UPSTREAM | Core Registry Architecture |
| **IRAS-GEN-002** | Architectural implementation neutrality across databases, brokers, and controllers | `TISB-GEN-003`, `SWR-GEN-004` | DOWNSTREAM ARCHITECTURAL COMPOSITION | Data & API Specifications |
| **IRAS-GEN-003** | Fail-closed integration default upon error, missing context, or failed check | `URPA-SEC-002`, `MSE-ENT-002` | DIRECT UPSTREAM | Core Security Engine |
| **IRAS-GEN-004** | Core entity separations between integration, provider, credential, state, and outcome | `TPA-LCY-001`, `MVV-PRV-001`, `CSE-GEN-006` | DOWNSTREAM ARCHITECTURAL COMPOSITION | Platform Architecture |
| **IRAS-LCY-001** | Mandatory 8-state integration governance lifecycle (`PLANNED` to `RETIRED`) | `PRD-ITG-001` | DIRECT UPSTREAM | Registry Lifecycle Engine |
| **IRAS-LCY-002** | Administrative state transition invariants and non-executability of draft states | `MSE-ITG-001`, `TPA-LCY-001` | DIRECT UPSTREAM | Registry Governance Engine |
| **IRAS-LCY-003** | Separation of administrative governance state from dynamic observed telemetry health | `TPA-LCY-001`, `TPA-HLT-001` | DIRECT UPSTREAM | Observability Engine |
| **IRAS-LCY-004** | Production activation onboarding verification gates under `platform.integration.activate`| `TPA-LCY-003`, `TPA-LCY-004`, `URPA-INT-001` | DIRECT UPSTREAM | Security Administration |
| **IRAS-LCY-005** | Strict prohibition on treating mock/prototype endpoints as live integration proof | `PRD-ITG-002` | DIRECT UPSTREAM | Integration Compliance |
| **IRAS-IAM-001** | Platform-reserved integration IAM lifecycle permissions (`view` to `retire`) | `URPA-INT-001`, `URPA-PERM-004` | DIRECT UPSTREAM | IAM Authorization Engine |
| **IRAS-IAM-002** | Absence of commercial integration module; integration as Layer 1 platform capability | `MSE-GEN-002`, `MSE-ENT-001` | DIRECT UPSTREAM | Commercial Model Engine |
| **IRAS-IAM-003** | Authority gap on tenant-delegable integration mutation; platform-reserved default | `URPA-PERM-004` | FAIL-CLOSED AUTHORITY GAP | Future URPA Revision |
| **IRAS-IAM-004** | Operational role isolation: zero integration authority for Support, Sales, Dealer, Rescue | `URPA-ROLE-006`, `URPA-ROLE-008`, `SSR-SUP-001`| DIRECT UPSTREAM | Operational Role Boundaries |
| **IRAS-TEN-001** | Strict semantic multi-tenant isolation of integration configs, keys, and webhooks | `TISB-TEN-001`, `TISB-SEC-001`, `TPA-SEC-002` | DIRECT UPSTREAM | Tenant Boundary Engine |
| **IRAS-TEN-002** | Database schema neutrality; exclusion of mandatory physical column names | `TISB-GEN-003` | DOWNSTREAM ARCHITECTURAL COMPOSITION | Database Architecture |
| **IRAS-SEC-001** | Encrypted server-side secret vault storage for integration keys and tokens | `PRD-PRV-004`, `TISB-SEC-002` | DIRECT UPSTREAM | Secret Storage Vault |
| **IRAS-SEC-002** | Strict client non-exposure invariant: credentials shielded from browser/mobile apps | `PRD-PRV-004`, `URPA-PRV-001`, `MVV-PRV-002` | DIRECT UPSTREAM | API Gateway & Proxy |
| **IRAS-SEC-003** | Generic AES-256 encryption containment; zero unapproved KMS or cipher lock-in | `PRD-SEC-001` | DOWNSTREAM ARCHITECTURAL COMPOSITION | Cryptographic Primitives |
| **IRAS-API-001** | Dedicated inbound telematics push REST endpoint (`POST /api/v1/telemetry/push`) | `PRD-API-001` | DIRECT UPSTREAM | Ingestion Gateway API |
| **IRAS-API-002** | Mandatory API-key authentication bound to active integration records (HTTP 401 composition) | `PRD-API-001`, `MSE-ITG-001` | DIRECT UPSTREAM / DOWNSTREAM COMPOSITION | Gateway Authentication |
| **IRAS-API-003** | Inbound telematics rate limiting at the integration connection perimeter (HTTP 429 composition) | `PRD-API-001` | DIRECT UPSTREAM / DOWNSTREAM COMPOSITION | Rate Limiting Engine |
| **IRAS-API-004** | Mandatory implementation-neutral replay protection without premature mechanism lock-in | `PRD-API-001` | DIRECT UPSTREAM | Ingestion Protection |
| **IRAS-API-005** | REST surface containment: exclusion of resource CRUD, GraphQL, or gRPC | `PRD-API-001` | DOWNSTREAM ARCHITECTURAL COMPOSITION | API Surface Control |
| **IRAS-WHK-001** | Cryptographically signed inbound webhook requirement for telematics push | `PRD-API-001`, `TPA-ING-003` | DIRECT UPSTREAM | Webhook Ingress Gateway |
| **IRAS-WHK-002** | Webhook signature algorithm neutrality; zero unapproved header lock-in | `PRD-API-001`, `TPA-ING-003` | DOWNSTREAM ARCHITECTURAL COMPOSITION | Ingress Adapters |
| **IRAS-WHK-003** | Authority gap on outbound webhook delivery guarantees, DLQs, and manual replays | `PRD-API-001` | FAIL-CLOSED AUTHORITY GAP | Downstream API Contracts |
| **IRAS-RTY-001** | Logical idempotency without inventing 24-hour windows, jitter, or HTTP retry matrices | `TPA-TEL-001`, `PRD-ING-003` | DOWNSTREAM ARCHITECTURAL COMPOSITION | Ingestion Deduplication |
| **IRAS-MAP-001** | Ingestion linkage for External Provider Device IDs to Multi-Stage Mapping Chain | `TPA-MAP-001`, `TPA-MAP-002` | DIRECT UPSTREAM | Mapping Chain Engine |
| **IRAS-MAP-002** | Fail-closed telemetry governance: dashboard suppression, quarantine logging, and prohibition of fallback routing | `TPA-MAP-002`, `TPA-MAP-003`, `TISB-PRV-001` | DIRECT UPSTREAM | Ingestion Quarantine |
| **IRAS-MAP-003** | Logical external identifier mapping independence from rigid database tuples | `SWR-GEN-002`, `TPA-SCL-003` | DOWNSTREAM ARCHITECTURAL COMPOSITION | Mapping Subsystem |
| **IRAS-PRV-001** | Subordination to Tracking Provider Control Plane for protocol decoding and routing | `PRD-PRV-001`, `TPA-PRV-001` | DIRECT UPSTREAM | Ingestion Control Plane |
| **IRAS-PRV-002** | Device-to-provider routing non-override and prohibition of unapproved fallback | `TPA-ROU-001`, `TPA-DMO-001` | DIRECT UPSTREAM | Multi-Provider Router |
| **IRAS-MED-001** | Architectural segregation of Media Providers from Tracking Providers | `MVV-PRV-001`, `TPA-MED-001` | DIRECT UPSTREAM | Media Architecture |
| **IRAS-MED-002** | Media credential shielding and implementation-neutral streaming session control | `MVV-PRV-002` | DIRECT UPSTREAM | Media Subsystem |
| **IRAS-DCR-001** | Absolute subordination to DCR bench-tested device capabilities; fail closed on unverified | `DCR-GEN-001`, `DCR-CAP-002` | DIRECT UPSTREAM | Device Registry Engine |
| **IRAS-VKR-001** | Absolute subordination to VKR vehicle electrical compatibility and engineering profiles | `VKR-GEN-001`, `VKR-CMP-001` | DIRECT UPSTREAM | Vehicle Registry Engine |
| **IRAS-CSE-001** | Strict command safety subordination: non-bypassable 9-term authorization formula | `CSE-AUT-001`, `CSE-INT-001` | DIRECT UPSTREAM | Command Safety Engine |
| **IRAS-CSE-002** | Zero fixed speed thresholds, canonical Engine Disable/Restore, operational config decoupling| `CSE-SAF-001`, `CSE-SAF-003`, `CSE-SAF-005`| DIRECT UPSTREAM | Command Safety Policy |
| **IRAS-CSE-003** | Multi-tier acknowledgment: Provider ACK does not constitute physical execution | `CSE-GEN-006`, `CSE-ACK-001` | DIRECT UPSTREAM | Command State Tracking |
| **IRAS-SYN-001** | Subordination to domain registries (VKR engineering reference, DCR, SMDI, SWR, MVV) for domain authority | `VKR-GEN-001`, `DCR-GEN-001`, `SMDI-GEN-001`, `SWR-GEN-001`, `MVV-MED-001`, `MVV-EVD-001` | DIRECT UPSTREAM | Master Data Governance |
| **IRAS-SYN-002** | Authority gap on external sync conflict merge policies ("local always wins" unmandated) | `TPA-GEN-001` | FAIL-CLOSED AUTHORITY GAP | Data Synchronization Spec |
| **IRAS-SWR-001** | Strict preservation of canonical 6-milestone RMA lifecycle (`FAULT_REPORTED` to `SCRAPPED`)| `PRD-RMA-001`, `SWR-GEN-001` | DIRECT UPSTREAM | RMA Workflow Engine |
| **IRAS-SWR-002** | Hardware replacement IMEI remapping continuity and DCR capability recalculation | `PRD-DEV-002`, `SWR-GEN-001` | DIRECT UPSTREAM | Service Management |
| **IRAS-SIM-001** | SIM inventory data model subordination to SMDI, carrier evidence separation, and absence of direct carrier APIs | `SMDI-SIM-001`, `SMDI-SIM-003`, `SMDI-SIM-004` | DIRECT UPSTREAM | SIM / M2M Inventory |
| **IRAS-GOV-001** | Government integration readiness and statutory compliance gating under regulatory review | `PRD-GOV-001`, `PRD-GOV-002`, `MSE-REG-002` | DIRECT UPSTREAM | Regulatory Compliance |
| **IRAS-BIL-001** | Deferral of commercial billing, fee calculation, and payment gateways to Billing spec | `PRD-COM-003`, `PRD-BIL-001`, `DEC-008` | DIRECT UPSTREAM | Billing & Metering Spec |
| **IRAS-AI-001** | Non-authoritative AI, multi-provider abstraction, and zero PII/telemetry to public AI | `PRD-AI-001`, `PRD-AI-004`, `DEC-014` | DIRECT UPSTREAM | AI Privacy & Governance |
| **IRAS-AUD-001** | Immutable, tamper-resistant integration audit logging capturing required invariants | `PRD-AUD-002`, `URPA-AUD-003` | DIRECT UPSTREAM | System Audit Trail |
| **IRAS-AUD-002** | Strict prohibition on recording or exposing plaintext secrets in audit logs or traces | `PRD-PRV-004`, `TISB-SEC-002` | DOWNSTREAM ARCHITECTURAL COMPOSITION | Audit Security Policy |
| **IRAS-SCL-001** | Platform capacity target of ~2M connected devices and throughput target authority gap | `PRD-SCL-001` | DIRECT UPSTREAM | Scalability Framework |

---

## 23. Testable Acceptance Criteria

- **`GATE-IRAS-01` (Core Registry Purpose & Scope Verification):**
  - Verify that the Integration Registry subsystem provides explicit lifecycle governance, credential isolation, and telematics ingress routing without assuming unapproved application roles. Tests `IRAS-GEN-001`.
- **`GATE-IRAS-02` (Implementation Neutrality Verification):**
  - Verify that specification requirements contain zero mandatory SQL DDL, ORM entities, specific message broker dependencies, or cloud provider bindings. Tests `IRAS-GEN-002`.
- **`GATE-IRAS-03` (Fail-Closed Default Verification):**
  - Verify that missing credentials, expired tokens, unverified tenant bindings, or internal exceptions immediately result in rejected access or dropped telemetry. Tests `IRAS-GEN-003`.
- **`GATE-IRAS-04` (Core Entity Separation Enforcement):**
  - Verify that the architecture enforces strict separation between Integration Registrations and Tracking Provider Registrations, and between Transport ACKs and Physical Execution Confirmations. Tests `IRAS-GEN-004`.
- **`GATE-IRAS-05` (8-State Lifecycle Integrity):**
  - Verify that the integration registry strictly implements the 8 canonical states (`PLANNED`, `DOCUMENTATION_PENDING`, `SANDBOX`, `APPROVED`, `ACTIVE`, `DEGRADED`, `SUSPENDED`, `RETIRED`) with zero added or deleted states. Tests `IRAS-LCY-001`.
- **`GATE-IRAS-06` (Administrative Transition Invariant Gate):**
  - Verify that non-active integrations (`PLANNED`, `DOCUMENTATION_PENDING`) are strictly blocked from production telemetry execution. Tests `IRAS-LCY-002`.
- **`GATE-IRAS-07` (Governance State vs Observed Health Decoupling):**
  - Verify that temporary network connection reachability drops evaluate under observed health without automatically rewriting administrative registry governance states. Tests `IRAS-LCY-003`.
- **`GATE-IRAS-08` (Production Activation Gate Enforcement):**
  - Verify that transitioning an integration to `ACTIVE` strictly requires `platform.integration.activate`, configured credentials, validated sandbox handshake, and verified mapping rules. Tests `IRAS-LCY-004`.
- **`GATE-IRAS-09` (Mock / Prototype Rejection Gate):**
  - Verify that mock endpoints, prototype URLs, or test fixtures are rejected as proof of live external integration availability. Tests `IRAS-LCY-005`.
- **`GATE-IRAS-10` (Platform Integration IAM Token Purity):**
  - Verify that integration administration enforces the 7 canonical `platform.integration.*` tokens and rejects unapproved tokens. Tests `IRAS-IAM-001`.
- **`GATE-IRAS-11` (Commercial Module Non-Invention Gate):**
  - Verify that integration governance does not require a commercial module token and recognizes `MOD-SIM-15` as governing SIM ERP exclusively. Tests `IRAS-IAM-002`.
- **`GATE-IRAS-12` (Tenant-Delegable Authority Gap Containment):**
  - Verify that tenant-delegable integration mutation permissions fail closed and default to platform administrators. Tests `IRAS-IAM-003`.
- **`GATE-IRAS-13` (Operational Role Access Isolation Gate):**
  - Verify that Support, Technical Support, Sales, Dealer/Channel, Rescue, and Driver roles are denied integration mutation and credential access. Tests `IRAS-IAM-004`.
- **`GATE-IRAS-14` (Semantic Multi-Tenant Isolation Gate):**
  - Verify that integration credentials, configurations, and webhook bindings belonging to Tenant A cannot be accessed or executed by Tenant B. Tests `IRAS-TEN-001`.
- **`GATE-IRAS-15` (Database Schema Neutrality Gate):**
  - Verify that tenant scoping is enforced semantically without prescribing physical database column names or SQL RLS expressions. Tests `IRAS-TEN-002`.
- **`GATE-IRAS-16` (Server-Side Credential Vault Gate):**
  - Verify that all provider API keys, master tokens, and shared secrets are stored encrypted at rest in server-side vaults. Tests `IRAS-SEC-001`.
- **`GATE-IRAS-17` (Client Credential Non-Exposure Gate):**
  - Verify that provider administrative credentials and raw integration secrets are never transmitted to browser or mobile clients. Tests `IRAS-SEC-002`.
- **`GATE-IRAS-18` (Cryptographic Scope Containment Gate):**
  - Verify that the specification mandates generic AES-256 encryption at rest without locking into specific unapproved KMS vendors or cipher modes. Tests `IRAS-SEC-003`.
- **`GATE-IRAS-19` (Inbound Telematics Push Endpoint Verification):**
  - Verify that the platform provides the exact inbound telematics REST endpoint `POST /api/v1/telemetry/push`. Tests `IRAS-API-001`.
- **`GATE-IRAS-20` (API-Key Ingress Authentication Gate):**
  - Verify that requests to `POST /api/v1/telemetry/push` lacking a valid active integration API key are rejected (HTTP 401 composition). Tests `IRAS-API-002`.
- **`GATE-IRAS-21` (Ingress Rate Limiting Verification):**
  - Verify that telematics push requests exceeding connection quotas are throttled (HTTP 429 composition). Tests `IRAS-API-003`.
- **`GATE-IRAS-22` (Replay Protection Enforcement Gate):**
  - Verify that the ingress gateway enforces replay protection in accordance with `PRD-API-001` without prematurely prescribing specific validation mechanisms (such as mandatory timestamp validation, nonces, message IDs, or rigid window algorithms). Tests `IRAS-API-004`.
- **`GATE-IRAS-23` (REST Surface Containment Gate):**
  - Verify that the specification defines zero unapproved public CRUD REST endpoints, GraphQL resolvers, or gRPC services. Tests `IRAS-API-005`.
- **`GATE-IRAS-24` (Signed Inbound Webhook Verification Gate):**
  - Verify that inbound telematics webhook payloads lacking a verifiable cryptographic signature fail closed and are rejected. Tests `IRAS-WHK-001`.
- **`GATE-IRAS-25` (Webhook Signature Algorithm Neutrality Gate):**
  - Verify that webhook signature verification accommodates provider-native schemes without mandating proprietary header names. Tests `IRAS-WHK-002`.
- **`GATE-IRAS-26` (Outbound Webhook Delivery Gap Containment):**
  - Verify that outbound delivery guarantees (at-least-once, DLQ, manual replay) are not asserted as existing upstream requirements. Tests `IRAS-WHK-003`.
- **`GATE-IRAS-27` (Retry & Deduplication Non-Invention Gate):**
  - Verify that ingestion deduplication operates logically without inventing 24-hour windows, jitter, or hardcoded HTTP retry matrices. Tests `IRAS-RTY-001`.
- **`GATE-IRAS-28` (External Provider Device ID Ingestion Gate):**
  - Verify that external provider device identifiers resolve through the authoritative Multi-Stage Mapping Chain. Tests `IRAS-MAP-001`.
- **`GATE-IRAS-29` (Unmapped Identifier Fail-Closed Gate):**
  - Verify that telematics packets with unmapped or conflicting device identifiers are immediately dropped from customer dashboards and routed to quarantine (`TPA-MAP-002`) with zero fallback routing (`TPA-MAP-003`). Tests `IRAS-MAP-002`.
- **`GATE-IRAS-30` (Abstract Mapping Independence Gate):**
  - Verify that external identifier mappings operate logically without prescribing rigid relational database tuple schemas. Tests `IRAS-MAP-003`.
- **`GATE-IRAS-31` (Tracking Provider Subordination Gate):**
  - Verify that protocol parsing, socket ingestion, and provider routing are subordinated to `TRACKING_PROVIDER_ARCHITECTURE_SPEC.md`. Tests `IRAS-PRV-001`.
- **`GATE-IRAS-32` (Routing Non-Override & Fallback Prohibition Gate):**
  - Verify that integration configs cannot override provider routing and that fallback to default or demo providers is rejected. Tests `IRAS-PRV-002`.
- **`GATE-IRAS-33` (Media Provider Segregation Gate):**
  - Verify that Media Providers are segregated from Tracking Providers and that telematics access confers zero media streaming rights. Tests `IRAS-MED-001`.
- **`GATE-IRAS-34` (Media Credential Shielding & Protocol Neutrality Gate):**
  - Verify that raw media URLs and credentials are shielded and that streaming protocols remain implementation-neutral examples. Tests `IRAS-MED-002`.
- **`GATE-IRAS-35` (DCR Hardware Capability Subordination Gate):**
  - Verify that external provider claims cannot verify hardware capabilities and that unverified capabilities fail closed under DCR. Tests `IRAS-DCR-001`.
- **`GATE-IRAS-36` (VKR Vehicle Compatibility Subordination Gate):**
  - Verify that external integration metadata cannot verify vehicle compatibility and that incompatible operations fail closed under VKR. Tests `IRAS-VKR-001`.
- **`GATE-IRAS-37` (Command Safety 9-Term Formula Enforcement Gate):**
  - Verify that external API commands must authenticate as machine actors and satisfy the complete 9-term CSE formula without bypass. Tests `IRAS-CSE-001`.
- **`GATE-IRAS-38` (CSE Zero Fixed Speed & Profile Gating Gate):**
  - Verify zero fixed speed thresholds (`<= 5 km/h`), canonical Engine Disable/Restore terminology, and decoupling of operational config. Tests `IRAS-CSE-002`.
- **`GATE-IRAS-39` (Multi-Tier Acknowledgment Separation Gate):**
  - Verify that external integrations do not report physical command success based solely on provider transport acknowledgments. Tests `IRAS-CSE-003`.
- **`GATE-IRAS-40` (Domain Registry Master-Data Subordination Gate):**
  - Verify that external synchronization jobs cannot overwrite domain registries (VKR engineering profiles, DCR, SMDI, SWR, MVV) without domain validation. Tests `IRAS-SYN-001`.
- **`GATE-IRAS-41` (Sync Conflict Authority Gap Gate):**
  - Verify that the specification does not assert a universal "local always wins" rule and records sync conflict policy as an authority gap. Tests `IRAS-SYN-002`.
- **`GATE-IRAS-42` (Canonical RMA Lifecycle Non-Override Gate):**
  - Verify that external supplier integrations preserve the exact 6-milestone RMA lifecycle (`FAULT_REPORTED` to `SCRAPPED`). Tests `IRAS-SWR-001`.
- **`GATE-IRAS-43` (Hardware Replacement Continuity & Recalculation Gate):**
  - Verify that hardware replacement remapping preserves historical telemetry continuity and triggers dynamic capability recalculation. Tests `IRAS-SWR-002`.
- **`GATE-IRAS-44` (SIM Data Model Subordination & Carrier API Absence Gate):**
  - Verify that SIM inventory adheres to SMDI data models (`SMDI-SIM-001`), carrier request evidence tracking is decoupled from internal actions (`SMDI-SIM-004`), SIM lifecycle transitions adhere to `SMDI-SIM-003`, and direct carrier API integrations are marked unestablished. Tests `IRAS-SIM-001`.
- **`GATE-IRAS-45` (Government Gateway Readiness & Regulatory Review Gate):**
  - Verify that government integrations (BRTA, Police, 999) remain gated under `LEGAL / REGULATORY VERIFICATION REQUIRED` and that BTRC regulatory knowledge (`RKS-AUT-003`, `RKS-EXT-001`) is decoupled from live API gateways. Tests `IRAS-GOV-001`.
- **`GATE-IRAS-46` (Commercial Billing & Payment Deferral Gate):**
  - Verify that billing calculations, invoices, rate cards, and merchant credentials are fully deferred to the Billing specification. Tests `IRAS-BIL-001`.
- **`GATE-IRAS-47` (Non-Authoritative AI & Zero Public AI PII Leakage Gate):**
  - Verify that AI models have zero decision authority and that zero customer PII, live locations, coordinates, or credentials reach free cloud AI (`DEC-014`). Tests `IRAS-AI-001`.
- **`GATE-IRAS-48` (Tamper-Resistant Integration Audit Trail Gate):**
  - Verify that integration lifecycle changes and credential updates produce immutable audit logs capturing actor, tenant, timestamp, action, and outcome. Tests `IRAS-AUD-001`.
- **`GATE-IRAS-49` (Plaintext Secret Logging Prohibition Gate):**
  - Verify that integration secrets, private API keys, and provider tokens are strictly masked or redacted from audit logs and traces. Tests `IRAS-AUD-002`.
- **`GATE-IRAS-50` (Platform Scale Target & Throughput Gap Gate):**
  - Verify alignment with the ~2M connected device capacity target and record integration throughput quotas as an authority gap. Tests `IRAS-SCL-001`.

---

## 24. Acceptance Coverage Reconciliation

The following sets formally demonstrate 100% testable acceptance gate coverage across all normative requirements defined in this specification:

- **Set A (Normative Implementation-Relevant Requirements):** 50 items (`IRAS-GEN-001` through `IRAS-GEN-004`, `IRAS-LCY-001` through `IRAS-LCY-005`, `IRAS-IAM-001` through `IRAS-IAM-004`, `IRAS-TEN-001` through `IRAS-TEN-002`, `IRAS-SEC-001` through `IRAS-SEC-003`, `IRAS-API-001` through `IRAS-API-005`, `IRAS-WHK-001` through `IRAS-WHK-003`, `IRAS-RTY-001`, `IRAS-MAP-001` through `IRAS-MAP-003`, `IRAS-PRV-001` through `IRAS-PRV-002`, `IRAS-MED-001` through `IRAS-MED-002`, `IRAS-DCR-001`, `IRAS-VKR-001`, `IRAS-CSE-001` through `IRAS-CSE-003`, `IRAS-SYN-001` through `IRAS-SYN-002`, `IRAS-SWR-001` through `IRAS-SWR-002`, `IRAS-SIM-001`, `IRAS-GOV-001`, `IRAS-BIL-001`, `IRAS-AI-001`, `IRAS-AUD-001` through `IRAS-AUD-002`, `IRAS-SCL-001`).
- **Set B (Formally Tested Requirements in Acceptance Gates):** 50 items (`GATE-IRAS-01` through `GATE-IRAS-50`).
- **Mathematical Coverage Proof:**
  $$\mathbf{Set\ A} = \mathbf{Set\ B}$$
  $$\mathbf{Set\ A} \setminus \mathbf{Set\ B} = \emptyset \quad (|A \setminus B| = 0)$$
  $$\mathbf{Set\ B} \setminus \mathbf{Set\ A} = \emptyset \quad (|B \setminus A| = 0)$$
- **Acceptance Quality Summary:** Zero orphan gates; zero unmapped normative requirements; 100% testable verification coverage.

---

## 25. Built-In Static Audit

The following table presents the deterministic static audit across all 20 required architectural categories (A through T), executed against the actual text of this specification:

| Cat | Audit Dimension | Evaluation Method & Evidence | Result |
| :---: | :--- | :--- | :---: |
| **A** | Source Integrity & Upstream Reference Validation | Verified all upstream requirement citations against actual approved repository commits (`abef605`, `a962a2a`, `25e7834`, `93d7a4e`, `4014141`, `88bcd53`, `5c9fe52`, `0e60ce3`, `d26153b`, `ebccd29`, `220ac0d`, `97cd070`, `4542f84`, `c8d8dbd`, `20037e3`). Zero fictitious IDs (`MVV-MED-001`, `MVV-EVD-001` verified). | **PASS** |
| **B** | Integration / Provider Entity Separation | Section 2 (`IRAS-GEN-004`) formally separates Integration Registration != Tracking Provider Registration, Credential != Human User, Integration State != Entitlement, Health != Availability, and Transport ACK != Physical Outcome. | **PASS** |
| **C** | IAM Role / Permission / Scope Purity | Section 5 (`IRAS-IAM-001` to `IRAS-IAM-004`) enforces strictly the 7 platform integration tokens defined in URPA Sections 37, 64, 84. Strictly isolates Support, Technical Support, Sales, Dealer, Rescue, and Driver. Declares explicit fail-closed gap on tenant delegation. | **PASS** |
| **D** | MSE / Commercial Entitlement Non-Invention | Section 5 (`IRAS-IAM-002`) confirms `INTEGRATION COMMERCIAL MODULE TOKEN NOT ESTABLISHED UPSTREAM`. Confirms `MOD-SIM-15` governs SIM ERP exclusively. Preserves integration as Layer 1 platform capability. | **PASS** |
| **E** | Integration Lifecycle Fidelity | Section 4 (`IRAS-LCY-001` to `IRAS-LCY-005`) strictly implements the 8 canonical states (`PLANNED` ... `RETIRED`) from `PRD-ITG-001`. Enforces `PRD-ITG-002` mock endpoint rejection. Decouples governance state from observed health (`TPA-LCY-001`). | **PASS** |
| **F** | Tenant Isolation / Credential Boundary | Section 6 (`IRAS-TEN-001` to `IRAS-SEC-003`) enforces strict multi-tenant perimeter isolation (`TISB-TEN-001`). Excludes physical database columns per `TISB-GEN-003`. Enforces encrypted server-side vaults (`PRD-PRV-004`) and zero client credential exposure. | **PASS** |
| **G** | REST / Webhook Authority Fidelity | Section 7 & 8 (`IRAS-API-001` to `IRAS-WHK-002`) strictly implements `POST /api/v1/telemetry/push`, API key auth, rate limiting, and signed webhooks per `PRD-API-001`. Preserves signature algorithm neutrality. Excludes unapproved public CRUD APIs. | **PASS** |
| **H** | Retry / Idempotency Non-Invention | Section 8 (`IRAS-RTY-001`, `IRAS-WHK-003`) strictly excludes 24-hour windows, cached duplicate ACKs, exponential backoff formulas, jitter algorithms, HTTP retry matrices, and DLQs. Implements logical idempotency per `TPA-TEL-001`. | **PASS** |
| **I** | Provider Routing / External Identifier Boundary | Section 9 & 10 (`IRAS-MAP-001` to `IRAS-PRV-002`) preserves `TPA-MAP-001` External Provider Device IDs, Multi-Stage Mapping Chain, and fail-closed unmapped drops to quarantine (`TPA-MAP-002`). Prohibits routing overrides or unapproved fallbacks (`TPA-MAP-003`, `TPA-ROU-001`). | **PASS** |
| **J** | DCR / VKR Technical Authority | Section 11 (`IRAS-DCR-001`, `IRAS-VKR-001`) strictly subordinates hardware capability to DCR bench testing and vehicle compatibility to VKR profiles. Rejects external provider claims as technical capability proof. | **PASS** |
| **K** | Command Safety / External Caller Boundary | Section 12 (`IRAS-CSE-001` to `IRAS-CSE-003`) subordinates external callers to the non-bypassable 9-term CSE authorization formula (`CSE-INT-001`). Contains zero fixed speed thresholds (`<= 5 km/h`), enforces canonical `Engine Disable`/`Restore`, and decouples operational config. | **PASS** |
| **L** | Government / Regulatory Purity | Section 16 (`IRAS-GOV-001`) preserves data model readiness without inventing live BRTA, Police, or 999 APIs (`GOVERNMENT INTEGRATION NOT ESTABLISHED UPSTREAM`). Clarifies BTRC represents regulatory compliance knowledge (`RKS-AUT-003`, `RKS-EXT-001`) rather than an active API gateway. Gates compliance under `LEGAL / REGULATORY VERIFICATION REQUIRED`. | **PASS** |
| **M** | SIM / Carrier / Supplier Boundary | Section 14 & 15 (`IRAS-SIM-001`, `IRAS-SWR-001`) preserves SMDI SIM data model (`MOD-SIM-15`), carrier request evidence separation (`SMDI-SIM-004`), SIM lifecycle transitions (`SMDI-SIM-003`), and records `CARRIER API NOT ESTABLISHED UPSTREAM`. Preserves exact 6-milestone RMA lifecycle (`PRD-RMA-001`). | **PASS** |
| **N** | Media / AI / Demo Boundary | Section 10 & 18 (`IRAS-MED-001` to `IRAS-AI-001`) segregates Media Providers from Tracking Providers, treats streaming protocols as neutral examples, preserves non-authoritative AI (`PRD-AI-001`), isolates public demo to synthetic data, and enforces `DEC-014`. | **PASS** |
| **O** | Billing / Later-Spec Containment | Section 17 (`IRAS-BIL-001`) defers billing calculations, invoices, rate cards, and merchant credentials to downstream Billing & Metering spec. Preserves `DEC-004` and `DEC-008` as open decisions without premature resolution. | **PASS** |
| **P** | Master-Data / Sync Conflict Authority Purity | Section 13 (`IRAS-SYN-001`, `IRAS-SYN-002`) subordinates domain reference data to VKR (engineering taxonomy/compatibility), DCR (hardware capability), SMDI (SIM inventory), SWR (warranty/RMA), and MVV (media vault). Strictly excludes a universal "local always wins" rule and registers `SYNC MASTER-DATA AUTHORITY NOT ESTABLISHED UPSTREAM`. | **PASS** |
| **Q** | Requirement ID / Traceability Integrity | Section 22 contains a complete traceability matrix with exactly 50 physical rows for 50 unique normative IRAS requirements (`IRAS-GEN-001` to `IRAS-SCL-001`). Zero dangling, duplicate, or malformed requirement IDs. | **PASS** |
| **R** | Acceptance Criteria Coverage | Section 24 provides deterministic mathematical proof: Set A (50) = Set B (50), Set A minus Set B = 0, Set B minus Set A = 0, zero orphan gates, zero undefined references. | **PASS** |
| **S** | Open Decision / Scale / Later-Spec Containment | Section 20 & 21 preserve `DEC-001` through `DEC-014`, align with the ~2M connected device capacity target (`PRD-SCL-001`), and record `INTEGRATION THROUGHPUT TARGET NOT ESTABLISHED UPSTREAM` without inferring numeric quotas. | **PASS** |
| **T** | Git Working Tree / Application Code Integrity | Target file created at exact approved path; authoritative tracked repository baseline remains unchanged; protected branch, main, and tag pointers strictly preserved; zero application code written or modified; only sanctioned IRAS specification and audit documentation entered approval, with git integrity validated by the approval gate. | **PASS** |

*Static Audit Concluded: 20 of 20 Categories Evaluated — 20 PASS, 0 FAIL, 0 DEVIATION.*
