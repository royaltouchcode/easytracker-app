# SIM/M2M, Device & Inventory Operations Specification

**Status:** APPROVED  
**Version:** 1.0  
**Approved Date:** 2026-09-14  
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
12. `docs/03_specs/SALES_SUPPORT_RESCUE_SPEC.md` v1.0 (Commit `97cd070`)  
**Upstream Commits:** `abef605`, `a962a2a`, `25e7834`, `93d7a4e`, `4014141`, `88bcd53`, `5c9fe52`, `0e60ce3`, `d26153b`, `ebccd29`, `220ac0d`, `97cd070`  
**Purpose:** Establish the authoritative architectural framework for Physical Telematics Device Inventory, SIM/M2M Connectivity Lifecycle, Stock Custody, Warehouse Management, Identifier Integrity, Multi-Stage Provisioning, Device-to-SIM Association, Device-to-Vehicle Operational Assignment, Tracking Provider Routing Boundaries, Multi-Tenant Data Perimeters, and Downstream Service/Warranty/RMA Handoffs without hardware vendor lock-in, unverified carrier API assumptions, security bypasses, or premature infrastructure bloat.

---

## 1. DOCUMENT CONTROL

| Property | Specification |
| :--- | :--- |
| **Document Title** | SIM/M2M, Device & Inventory Operations Specification |
| **Document Identifier** | `docs/03_specs/SIM_M2M_DEVICE_INVENTORY_SPEC.md` |
| **Version** | `1.0` |
| **Status** | APPROVED |
| **Approved Date** | `2026-09-14` |
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
| **Authoritative Command Safety Spec**| `docs/03_specs/COMMAND_SAFETY_EXECUTION_SPEC.md` v1.0 (Commit `ebccd29`) |
| **Authoritative Fleet Pack Spec** | `docs/03_specs/FLEET_PACK_SPEC.md` v1.0 (Commit `220ac0d`) |
| **Authoritative Sales & Support Spec**| `docs/03_specs/SALES_SUPPORT_RESCUE_SPEC.md` v1.0 (Commit `97cd070`) |
| **Authority Precedence Index** | `docs/DOCUMENT_AUTHORITY_INDEX.md` |

---

## 2. EXECUTIVE SUMMARY

The **SIM/M2M, Device & Inventory Operations Specification** establishes the authoritative operational, lifecycle, and data architecture governing physical telematics tracking devices and cellular M2M/SIM connectivity within the EasyTracker standalone SaaS platform. 

While the **Device Capability Registry** (`DEVICE_CAPABILITY_REGISTRY_SPEC.md` v1.0) serves as the technical capability authority (defining command protocol schemas, telemetry parsing, sensor capabilities, and telematics profiles), this specification governs the **physical, operational, and logistic realities** of hardware units and cellular connectivity: serial numbers, IMEIs, ICCIDs, stock custody, warehouse locations, procurement batches, physical state transitions, technician handoffs, and tenant assignments.

Crucially, this specification enforces strict decoupled boundaries across platform entities:
1. **Entity Independence:** A physical Device is not a SIM card, a SIM card is not a Tracking Provider, a Tracking Provider is not a SaaS Tenant, and a cellular carrier is not an operational tracking system.
2. **State Separation:** A SIM card being marked active by an operator does not mean the device is provisioned; a device being physically in stock does not mean it is entitled; and a customer subscription being active does not manufacture physical hardware inventory.
3. **Identifier Integrity:** IMEIs, serial numbers, and ICCIDs must maintain absolute uniqueness and auditability, failing closed upon conflict detection without silent overwrites or destructive record merging.
4. **Decoupled Provisioning:** Provisioning follows a disciplined multi-stage verification flow (registration $\rightarrow$ capability check $\rightarrow$ SIM binding $\rightarrow$ carrier provisioning $\rightarrow$ provider routing $\rightarrow$ telemetry reception verification) before a unit is declared operationally active.
5. **Multi-Tenant Protection:** Physical inventory units may be transferred between tenants only through audited custody handoffs that completely quarantine historical operational telemetry, ensuring zero cross-tenant data leakage.

---

## 3. PURPOSE

The purpose of this specification is to:
1. Define the business logic, state machines, and operational invariants governing physical device and SIM inventory.
2. Provide a concrete data and operational model for inventory custody, warehouse locations, technician handoffs, and customer assignments.
3. Govern the operational binding between physical devices and SIM cards, preserving complete historical association logs.
4. Establish clear integration boundaries with the Device Capability Registry (`DCR-GEN-001`), Vehicle Knowledge Registry (`VKR-GEN-001`), and Tracking Provider Architecture (`TPA-GEN-001`).
5. Delineate clear handoff boundaries for downstream Service, Warranty, and RMA operations without prematurely prescribing repair accounting or repair center workflows.
6. Provide unambiguous, testable acceptance criteria ensuring implementation readiness without developer guesswork.

---

## 4. SCOPE

The scope of this specification encompasses:
- Physical telematics hardware inventory management (IMEI, serial, procurement batches, models).
- SIM/M2M cellular inventory management (ICCID, MSISDN, IMSI, carrier identity, form factors).
- Independent state machines for Device lifecycle and SIM lifecycle.
- Operational Device-to-SIM binding and unbinding lifecycle.
- Operational Device-to-Vehicle assignment boundaries (in coordination with VKR).
- Device-to-Tracking Provider routing registration (in coordination with TPA).
- Inventory custody and location tracking (central warehouse, tenant stock, installer custody, dealer custody, quarantined stock).
- Identifier uniqueness validation, conflict prevention, and auditable correction.
- Multi-stage provisioning and operational activation verification.
- Cross-tenant inventory transfer, reassignment, and historical data isolation.
- Integration boundaries with Sales operations (`SALES_SUPPORT_RESCUE_SPEC.md`) and Technical Support.
- Downstream handoff boundaries to Service, Warranty, and RMA operations.
- Non-functional requirements for inventory scalability (designing for 2,000,000 devices, building for tens).

---

## 5. OUT OF SCOPE

The following functional and technical domains are explicitly out of scope:
- **Technical Device Protocol & Schema Definitions:** Governed exclusively by `DEVICE_CAPABILITY_REGISTRY_SPEC.md` v1.0.
- **Vehicle Physical Fitment & CAN-Bus Engineering:** Governed exclusively by `VEHICLE_KNOWLEDGE_REGISTRY_SPEC.md` v1.0.
- **Direct Telecom Carrier API Integration:** Automatic BTRC or carrier provisioning endpoints are unverified external dependencies; concrete API adapters belong to the later Integration Registry specification.
- **Detailed Warranty Rules, Repair Pricing & Service Center Workflows:** Reserved exclusively for the downstream Service/Warranty/RMA specification.
- **Telecom Billing Settlement & M2M Data Ledgers:** Reserved for the downstream Billing/Metering specification.
- **Concrete Database Schema & Microservice Deployments:** Preserves implementation neutrality; no premature infrastructure lock-in (Kafka, Redis Streams, Kubernetes).

---

## 6. TERMINOLOGY & CORE ENTITY SEPARATION

To eliminate ambiguity across operational, commercial, and technical domains, the platform enforces the following core entity separations:

```
+----------------------------------------------------------------------------------------------------+
|                                    CORE ENTITY SEPARATIONS                                         |
+----------------------------------------------------------------------------------------------------+
|  [Tracking Provider] != [SaaS Tenant] != [SIM/M2M Carrier] != [Customer]                          |
|  [Physical Device]   != [Device Capability Record] != [SIM Card] != [Vehicle]                      |
|  [SIM Active]        != [Device Operational] != [Provider Active] != [Subscription Entitled]      |
|  [Inventory Custody] != [Operational Tracking Authority] != [Command Execution Authority]         |
+----------------------------------------------------------------------------------------------------+
```

- **Physical Device:** A discrete, serialized physical hardware telematics tracker identified by hardware attributes (IMEI, Serial Number).
- **Device Capability Record:** The technical specification, command schema, and protocol profile registered in the Device Capability Registry (`DCR-GEN-001`).
- **SIM Card (M2M):** A cellular subscriber identity module identified by ICCID and associated network identifiers (MSISDN, IMSI, Carrier).
- **Tracking Provider:** An external or internal licensed telematics gateway ingesting raw device protocol packets (`TPA-GEN-001`).
- **Carrier:** The cellular network operator (e.g., Grameenphone, Robi, Banglalink, Teletalk) providing M2M connectivity.
- **Inventory Custody:** The physical or organizational possession of an unassigned or assigned unit (e.g., Warehouse, Technician, Dealer).
- **Operational Tracking Authority:** The legal and IAM entitlement to view real-time location telemetry on a live map (`URPA-ROLE-001`).

---

## 7. ARCHITECTURAL PRINCIPLES

1. **Decoupled Architecture:** Physical stock tracking operates independently of technical protocol handling and billing ledgers.
2. **Fail-Closed Identifier Integrity:** Any duplicate or contradictory IMEI, Serial, or ICCID entry fails immediately; silent overwrites are strictly prohibited.
3. **No Automatic Authority Expansion:** Physical custody of a device or SIM card confers zero operational tracking, history playback, or command execution authority.
4. **Durable Traceability:** Every change of custody, binding, provisioning state, or tenant transfer must generate an immutable, auditable log entry.
5. **Scale for 2M, Build for Tens:** Architecture models millions of records cleanly without mandating distributed queues, event brokers, or multi-database partitioning upfront.

---

## 8. SIM/M2M DOMAIN MODEL

The SIM/M2M domain model governs cellular connectivity assets utilized by telematics hardware.

- **SMDI-SIM-001 (SIM Technical Identifiers):**
  - Every managed M2M SIM record must capture:
    1. `iccid`: Cellular subscriber identity module ICCID (Primary Technical Identity). Standard telematics profiles typically utilize 19-to-20 numeric digits conforming to ITU-T E.118 (`EXTERNAL TECHNICAL VERIFICATION REQUIRED`); platform business logic enforces strict global uniqueness across all tenants with fail-closed conflict handling.
    2. `msisdn`: Mobile Station International Subscriber Directory Number (Phone number used for SMS fallback / wakeup commands).
    3. `imsi`: International Mobile Subscriber Identity (Optional/Carrier dependent).
    4. `carrier_id`: Identifier of the cellular network operator.
    5. `form_factor`: Form factor (`STANDARD`, `MICRO`, `NANO`, `ESIM_MFF2`).
    6. `apn_profile`: Configured Access Point Name profile (APN name, username, authentication type).
  - *Data Masking:* MSISDN and IMSI are classified as sensitive operational identifiers and must be masked in administrative views lacking technical support authorization (`SSR-PRI-001`).

- **SMDI-SIM-002 (Carrier Neutrality & Independence):**
  - The platform architecture is carrier-agnostic. A SIM carrier relationship does not dictate Tracking Provider routing, and a Tracking Provider does not dictate cellular carrier ownership.
  - Multi-IMSI and national roaming SIMs are supported as standard M2M inventory assets without requiring proprietary platform adaptations.

---

## 9. SIM IDENTIFIER INTEGRITY & NORMALIZATION

- **SMDI-ID-001 (SIM Identifier Uniqueness):**
  - The `iccid` must be globally unique across the entire platform.
  - An attempt to register an existing `iccid` must fail closed with a `DUPLICATE_IDENTIFIER_CONFLICT` error.
  - Automatic stripping of non-numeric characters, whitespace, and leading/trailing control characters is mandatory prior to evaluation.

- **SMDI-ID-002 (MSISDN Handling):**
  - MSISDN numbers must be stored in standardized international telephone format (e.g., E.164 format: `+8801XXXXXXXXX`) as an operational reference profile (`EXTERNAL TECHNICAL VERIFICATION REQUIRED`), without restricting downstream carrier-specific routing.
  - Because cellular operators occasionally recycle phone numbers across multi-year cycles, MSISDN recycling must be accommodated: an MSISDN may be reassigned to a new ICCID only after the previous SIM record is formally in `DEACTIVATED` or `RETIRED` status with full audit logging.

---

## 10. SIM CARRIER BOUNDARY & REGULATORY LIMITS

- **SMDI-REG-001 (No Assumed Carrier API Automation):**
  - The platform does not assume the existence of direct, synchronous, real-time BTRC or telecom operator provisioning APIs.
  - All carrier activation, suspension, and deactivation requests are tracked through internal workflow request states (`REQUESTED`, `PENDING_CONFIRMATION`, `CONFIRMED`, `FAILED`).
  - The platform must never mark a SIM as active on the cellular network merely because an internal user pressed an activation button.

- **SMDI-REG-002 (Legal & Regulatory Compliance Boundary):**
  - Mandatory statutory telecommunications procedures, biometric M2M verification, and regulatory SIM quotas are governed under:
    > `LEGAL / REGULATORY VERIFICATION REQUIRED`
  - The platform supports manual recording of regulatory compliance tokens (e.g., BTRC corporate approval reference, carrier M2M allotment ID) without hardcoding unverified statutory automation.

- **SMDI-SIM-004 (Carrier Evidence Separation & Request Tracking):**
  - The platform strictly decouples internal administrative operational intent from external carrier/network confirmation:
    $$\text{Internal Administrative Request} \neq \text{External Carrier Confirmation} \neq \text{Operation Failure}$$
  - Platform-side asynchronous request tracking models carrier operations (activation, suspension, deactivation, plan changes) through explicit internal workflow request states (e.g., `REQUESTED`, `PENDING_CONFIRMATION`, `CONFIRMED`, `FAILED`, or integration-specific equivalents). These workflow states represent platform-side request tracking semantics and do not impose a proprietary universal carrier API contract.
  - The SIM entity lifecycle state (`SMDI-SIM-003`) is decoupled from the carrier request record: an internal user action moves the SIM to `ACTIVATION_PENDING` (or corresponding pending status) and dispatches a workflow request; transition to `ACTIVE` requires externally verifiable evidence appropriate to the configured carrier/provider integration (such as an authoritative carrier confirmation callback, manual reference confirmation, or provider network handshake). Raw telemetry reception alone shall not be treated as formal carrier administrative activation unless explicitly established by an approved provider integration contract.
  - *Zero Direct State Manufacturing:* An administrative user shall never directly force an unverified `ACTIVE` cellular state without external evidence.
  - *Durable Audit Logging:* All carrier request operations must record immutable audit events capturing request ID, actor identity, effective tenant scope, prior and requested states, external carrier reference or transaction ID (where available), timestamp, error/failure details, and reconciliation/retry history (`SMDI-AUD-001`).

---

## 11. SIM LIFECYCLE STATE MACHINE

- **SMDI-SIM-003 (SIM Lifecycle States):**
  A SIM card transitions through strictly validated lifecycle states:
  1. `RECEIVED`: Physical SIM batch received from carrier/supplier; unverified and unassigned.
  2. `AVAILABLE`: Verified, tested, and stored in inventory stock; available for device binding.
  3. `RESERVED`: Allocated to an upcoming batch, customer order, or technician kit; unavailable for other allocations.
  4. `BOUND`: Physically or logically associated with a specific Physical Device (`SMDI-AST-001`).
  5. `ACTIVATION_PENDING`: External carrier activation requested; awaiting network operational confirmation.
  6. `ACTIVE`: Confirmed operational on cellular network; transmitting or ready to transmit data.
  7. `SUSPENDED`: Temporarily halted (e.g., customer non-payment, seasonal fleet pause, security quarantine); network data barred.
  8. `DEACTIVATED`: Permanently disconnected by carrier; cannot be reactivated on the same subscription.
  9. `RETIRED`: Physical SIM damaged, destroyed, or decommissioned; archived for durable audit history.

---

## 12. PHYSICAL DEVICE INVENTORY MODEL

The Physical Device inventory model captures discrete hardware units managed across the supply chain.

- **SMDI-DEV-001 (Physical Device Record):**
  - Every physical tracker record must capture:
    1. `device_id`: Unique platform surrogate identifier (UUID).
    2. `imei`: International Mobile Equipment Identity (Primary Hardware Identity), capturing serialized hardware units in accordance with DCR-verified device profiles.
    3. `serial_number`: Manufacturer hardware serial number.
    4. `model_code`: Manufacturer model reference (e.g., `S102A`, `FMB920`).
    5. `procurement_batch`: Batch/shipment reference for traceability.
    6. `hardware_revision`: Physical board/firmware baseline revision.
    7. `custody_state`: Current physical location and organizational holder.
    8. `tenant_id`: Owning SaaS tenant (or `PLATFORM` for shared stock).

---

## 13. DEVICE IDENTITY & IDENTIFIER INTEGRITY

- **SMDI-ID-003 (IMEI Validation & Normalization):**
  - All standard production IMEI entries capture 15 numeric digits conforming to the 3GPP Luhn checksum algorithm (modulus 10 check digit verification) as a standard hardware validation profile (`EXTERNAL TECHNICAL VERIFICATION REQUIRED`). Non-standard pilot, prototype, or test bench devices may be registered only when explicitly authorized by an approved Device Capability Registry profile (`DCR-GEN-001`).
  - IMEIs must be globally unique across all tenants on the platform.
  - Any conflict detected during batch import, manual registration, or API provisioning must halt the operation and generate a `DEVICE_IDENTITY_CONFLICT` audit alert.

- **SMDI-ID-004 (Immutable vs Correctable Identifiers):**
  - An IMEI is strictly immutable once telemetry has been received and verified for that unit.
  - If an IMEI was recorded erroneously prior to deployment, correction requires a formal `Identity Correction Request` authorized by a `PLATFORM_ADMIN` or authorized `TENANT_ADMIN`, creating an immutable audit trail linking the old and new values.

---

## 14. DEVICE LIFECYCLE STATE MACHINE

- **SMDI-DEV-002 (Device Lifecycle States):**
  A physical device transitions through the following formal states:
  1. `RECEIVED`: Hardware delivered to warehouse; package received; uninspected.
  2. `INSPECTED_AVAILABLE`: Passed physical inspection and DCR registry validation; in stock.
  3. `RESERVED`: Allocated to an installer kit, customer deployment, or sales demo.
  4. `PROVISIONING`: SIM bound, APN configured, and initial provider handshake initiated.
  5. `ACTIVE_OPERATIONAL`: Successfully installed in a vehicle and streaming verified telemetry to an authoritative tracking provider.
  6. `MAINTENANCE_PAUSE`: Temporarily removed for vehicle maintenance, battery replacement, or re-wiring.
  7. `QUARANTINED`: Unit malfunctioning, reporting erratic telemetry, suspected compromised, or subject to tampering investigation.
  8. `RETIRED_DECOMMISSIONED`: Hardware end-of-life, physically destroyed, or permanently decommissioned.

---

## 15. DEVICE CAPABILITY REGISTRY (DCR) INTEGRATION

- **SMDI-DEV-003 (DCR Subordination & Technical Boundary):**
  - The inventory system cannot independently declare what commands, sensors, or baud rates a physical device supports.
  - Before a physical device record can transition from `RECEIVED` to `INSPECTED_AVAILABLE`, its `model_code` and `hardware_revision` must match a verified entry in the Device Capability Registry (`DCR-GEN-001`).
  - If a model is not recognized in DCR, the device record is flagged as `DCR_CAPABILITY_UNKNOWN` and cannot be assigned to customer fleets or provisioned for live tracking (`DCR-REG-001`).

---

## 16. VEHICLE KNOWLEDGE REGISTRY (VKR) BOUNDARY

- **SMDI-DEV-004 (VKR Compatibility Boundary):**
  - Physical possession or inventory assignment of a tracking device does not certify vehicle electrical compatibility.
  - When an operational assignment between a Device and a Vehicle is requested, the system must evaluate vehicle compatibility prerequisites via the Vehicle Knowledge Registry (`VKR-GEN-001`).
  - If the vehicle electrical architecture, voltage (12V vs 24V), or relay requirements are `UNKNOWN` or `INCOMPATIBLE`, the inventory workflow must flag a `VEHICLE_COMPATIBILITY_WARNING` and require explicit certified technician override (`VKR-CMD-001`, `CSE-AUT-003`).

---

## 17. DEVICE ↔ SIM ASSOCIATION

- **SMDI-AST-001 (Device-to-SIM Binding Invariants):**
  1. *Launch Baseline Binding & DCR-Governed Cardinality:* For the standalone launch baseline, the operational tracking model operates under a single active Device-to-SIM binding where supported by the device's verified hardware profile. A SIM card can be actively bound to at most one Physical Device. However, this launch operational constraint is subordinate to the Device Capability Registry (`DCR-CAP-001`) and must not be treated as a permanent universal hardware limitation. Where an approved future or profile-enabled hardware revision supports multi-SIM, eSIM multi-profile, multi-IMSI, or secondary fallback connectivity, active binding cardinality and channel allocation shall be governed authoritatively by the device's verified DCR capability profile and applicable provider/carrier configuration without requiring changes to core inventory audit or isolation guarantees. Duplicate or conflicting active bindings within a single channel profile fail closed.
  2. *Historical Traceability:* When a SIM card is replaced (e.g., damaged SIM, carrier migration), the previous binding is terminated with an explicit end timestamp, reason code (`RMA`, `CARRIER_CHANGE`, `UPGRADE`), and operator identity.
  3. *Zero Capability Manufacture:* Binding a SIM card to a device does not alter the hardware's intrinsic DCR capabilities; physical inventory cannot manufacture multi-connectivity or single-connectivity attributes independent of DCR.

---

## 18. DEVICE ↔ VEHICLE ASSIGNMENT

- **SMDI-AST-002 (Operational Vehicle Assignment):**
  1. *Decoupled Linking:* A device record can exist unassigned to any vehicle (warehouse stock). A vehicle record can exist without an assigned tracking device.
  2. *One-to-One Active Constraint:* A vehicle may have at most one primary active tracking unit, unless an approved multi-tracker redundancy entitlement (`MOD-FLT-06`) is explicitly enabled.
  3. *Unassignment Telemetry Boundary:* When a device is unassigned from a vehicle (e.g., de-installation, vehicle sale), all historical trip, track, and alert data remains tied to the Vehicle entity and the Tenant; the newly unassigned physical device carries zero former vehicle telemetry into subsequent deployments.

---

## 19. DEVICE ↔ TRACKING PROVIDER BOUNDARY

- **SMDI-TRK-001 (Authoritative Provider Route Establishment):**
  - Integration with external Tracking Providers is governed strictly by `TRACKING_PROVIDER_ARCHITECTURE_SPEC.md` v1.0 (`TPA-GEN-001`).
  - Registering a device in physical inventory does NOT create an active route on a tracking provider.
  - When a device transitions to `PROVISIONING`, an authoritative routing entry must be created mapping `device_id` $\rightarrow$ `tracking_provider_id` via the Integration Registry (`TPA-ROU-001`).
  - *Fail-Closed Routing:* Multi-provider routing is fail-closed. If provider routing fails, no default fallback or demo fallback is permitted (`TPA-ROU-002`).
  - *SIM Carrier != Provider:* A SIM card provided by a carrier (e.g., GP) does not automatically establish routing to that carrier's tracking platform (e.g., GP IoT) unless explicitly configured by the tenant administrator.

---

## 20. TENANT & CUSTOMER ASSIGNMENT BOUNDARIES

- **SMDI-TEN-001 (Multi-Tenant Inventory Partitioning):**
  - All inventory assets (Devices and SIMs) belong either to `PLATFORM_STOCK` (central unallocated pool) or to a specific `TENANT_STOCK`.
  - A tenant cannot view, search, reserve, or assign inventory belonging to another tenant (`TISB-TEN-001`).
  - Tenant assignment does not equal Customer assignment: within a commercial fleet tenant, inventory is assigned to customer accounts or corporate sub-divisions according to `CUSTOMER_TYPES_COMMERCIAL_MODEL_SPEC.md` (`CTCM-CUS-001`).

- **SMDI-TEN-002 (Cross-Tenant Reassignment & Quarantine):**
  - When a physical device is transferred from Tenant A to Tenant B (e.g., device buyback, enterprise transfer, hardware return):
    1. The device must pass through a mandatory `TRANSFER_QUARANTINE` state.
    2. All active telemetry routes, cached command contexts, and temporary diagnostic grants are revoked (`CSE-QUE-004`).
    3. Tenant B receives a completely clean hardware operational record; zero access to Tenant A's historical location, routes, alerts, or trip logs is granted (`TISB-SEC-001`).

---

## 21. INVENTORY OWNERSHIP & PHYSICAL CUSTODY

- **SMDI-INV-001 (Ownership vs Custody):**
  The platform strictly distinguishes legal ownership from physical custody:
  - `OWNERSHIP`: Legal entity holding title (Platform, Hardware Reseller, Tenant, or End Customer).
  - `CUSTODY`: Physical party or facility currently holding the hardware across canonical baseline custody locations (Central Warehouse, Tenant Regional Depot, Field Technician Van, Dealer/Channel Showroom, Customer Premises, Installed Vehicle, or RMA Quarantine).
  - Physical custody does NOT grant operational tracking, live map tracking, or command execution authority (`SSR-SAL-001`, `SSR-CHN-001`).

---

## 22. STOCK & INVENTORY LOCATION MANAGEMENT

- **SMDI-INV-002 (Stock Custody Locations & Baseline Taxonomy):**
  Inventory locations are modeled through structured canonical baseline operational custody nodes:
  1. `CENTRAL_WAREHOUSE`: Main company procurement, intake inspection, and central inventory staging.
  2. `TENANT_DEPOT`: Tenant-managed operational staging facility for regional fleet logistics.
  3. `TECHNICIAN_VAN`: Mobile field inventory held in custody by certified telematics installers.
  4. `DEALER_SHOWROOM`: Channel partner custody for direct retail distribution and local fulfillment.
  5. `CUSTOMER_PREMISES`: Hardware physically delivered to or staged at customer-controlled premises awaiting scheduled installation (staged uninstalled inventory; confers zero tracking or command authority).
  6. `INSTALLED_VEHICLE`: Hardware physically mounted and wired into an assigned operational vehicle (active field custody; operational tracking governed by IAM and command dispatch governed by CSE).
  7. `RMA_QUARANTINE`: Defective, damaged, tampered, or decommissioned stock awaiting inspection or service center intake.
  - *Extensibility & Invariant Protection:* The platform establishes these seven canonical baseline custody types while permitting future authorized custody locations, provided any new custody node strictly preserves tenant data isolation, physical custody audit logging, and zero automatic operational tracking or command authority expansion (`SSR-SAL-001`, `SSR-CHN-001`).
  - *No ERP Bloat:* Stock management is restricted to unit location, batch custody, and status tracking. Full accounting ledgers, purchase order financing, and general ledger depreciation belong to external enterprise ERPs (`FPS-CAR-002`).

---

## 23. PROVISIONING & MULTI-STAGE ACTIVATION

- **SMDI-PROV-001 (Stepwise Provisioning Verification & Prerequisite Flexibility):**
  Activation of a telematics unit is not a single atomic switch; it is a multi-stage deterministic verification framework:
  - **Foundational Prerequisites (Sequential):**
    - **Stage 1 (Inventory Registration):** Physical hardware record created with verified IMEI hardware identity (`SMDI-ID-003`).
    - **Stage 2 (Capability Registry Verification):** Hardware model confirmed in DCR prior to allocation (`SMDI-DEV-003`).
    - **Stage 3 (SIM Binding):** Compatible M2M SIM card bound to unit under launch baseline binding / DCR-governed profile constraint (`SMDI-AST-001`).
  - **Asynchronous Operational Readiness Gates (Flexible Order):**
    - **Stage 4 (Cellular Carrier Provisioning):** APN configuration dispatched; carrier activation requested (`SMDI-SIM-004`).
    - **Stage 5 (Tracking Provider Route Setup):** Authoritative route registered in Integration Registry (`SMDI-TRK-001`).
    - **Stage 6 (Vehicle Installation Handoff):** Certified technician attaches hardware to vehicle electrical system (`SMDI-AST-002`).
    - *Operational Flexibility:* While Stages 1–3 are strict foundational prerequisites for unit configuration, Stages 4, 5, and 6 represent independent prerequisite readiness dimensions that may be fulfilled in flexible operational sequence based on deployment logistics (e.g., bench pre-staging vs field mobile installation vs pre-installed factory vehicles). The platform does not impose an artificial linear sequence among Stages 4, 5, and 6.
  - **Mandatory Final Verification Gate:**
    - **Stage 7 (Initial Telemetry Verification):** First valid GPS fix and heartbeat packet ingested by authoritative tracking provider and verified by platform.
    - *Fail-Closed Invariant:* A unit cannot enter `ACTIVE_OPERATIONAL` until all prerequisite readiness dimensions (Stages 1 through 6) are satisfied AND Stage 7 is successfully confirmed by physical operational telemetry evidence (`SMDI-PROV-002`).
    - *State Independence:* Provider Active $\neq$ SIM Active $\neq$ Device Installed $\neq$ Customer Subscription Active $\neq$ Tenant Entitled.

---

## 24. TRANSFER & REASSIGNMENT WORKFLOWS

- **SMDI-INV-003 (Audited Custody Transfers):**
  - Transfer of physical devices or SIM cards between custody nodes (e.g., Central Warehouse $\rightarrow$ Technician Van) requires a two-step dispatch/receipt workflow:
    1. *Initiation:* Custody transfer initiated by dispatching actor. Unit marked `IN_TRANSIT`.
    2. *Receipt Confirmation:* Receiving technician or depot manager scans IMEI/barcode to confirm physical custody. Unit transitions to new custody node.
  - *Discrepancy Handling:* Any unacknowledged unit remaining `IN_TRANSIT` past the configured threshold triggers an audit alert (`SMDI-AUD-001`).

---

## 25. RETURN, QUARANTINE & DECOMMISSIONING

- **SMDI-INV-004 (Quarantine & Return Protocols):**
  - Defective, damaged, or tampered hardware must be immediately transitioned to `QUARANTINED` status.
  - While in `QUARANTINED` status:
    1. The device cannot be assigned to any vehicle or customer.
    2. All active command capabilities are revoked (`CSE-QUE-004`).
    3. The bound SIM is evaluated for suspension or unbinding.
  - Hardware determined to be permanently unserviceable transitions to `RETIRED_DECOMMISSIONED` with permanent serial/IMEI retirement, preventing re-registration under fraudulent pretenses.

---

## 26. DEALER & CHANNEL PARTNER BOUNDARIES

- **SMDI-CHN-001 (Channel Custody Non-Authority):**
  - Dealers, resellers, and channel partners frequently hold physical hardware stock for retail sale and distribution (`CTCM-CUS-001`, `SSR-CHN-001`).
  - Holding dealer custody over unassigned or assigned devices grants:
    - ✅ Stock inventory management, custody transfer, and retail activation handoff.
    - ❌ **ZERO** operational tracking visibility, zero live map access, zero historical trip access, and zero command dispatch authority.

---

## 27. SALES OPERATIONS INTERACTION

- **SMDI-SAL-001 (Sales Stock Inquiries):**
  - Sales personnel may query stock availability, lead times, and hardware model availability across unreserved inventory (`SSR-SAL-001`).
  - Sales queries are strictly read-only and restricted to high-level stock counts and model specifications.
  - Sales actors have zero authority to view live customer tracking data, query active vehicle telemetry, or alter hardware-SIM bindings.

---

## 28. TECHNICAL SUPPORT DIAGNOSTIC INTERACTION

- **SMDI-SUP-001 (Support Hardware Diagnostics):**
  - Technical Support personnel investigating reported hardware malfunctions or communication faults may inspect technical inventory metadata:
    - Configured APN, SIM ICCID, cellular carrier, hardware revision, initial activation timestamp.
  - In accordance with `SALES_SUPPORT_RESCUE_SPEC.md` (`SSR-SUP-003`), viewing technical hardware diagnostics does NOT grant live map location tracking or command dispatch authority. Temporary live map access requires an explicit, time-bound customer grant under `DEC-005`.

---

## 29. SERVICE, WARRANTY & RMA HANDOFF BOUNDARY

- **SMDI-RMA-001 (Downstream RMA Handoff Boundary):**
  - This specification defines the physical inventory state handoff to the downstream **Service, Warranty & RMA Specification**:
    - When a field unit fails, this specification provides: `device_id`, `imei`, current custody, bound `iccid`, vehicle association history, and transition to `QUARANTINED` status.
  - *Explicit Non-Invention:* Warranty period calculations, manufacturer warranty claim submissions, repair cost estimations, RMA ticket resolution workflows, and repair center part logistics are explicitly deferred to the dedicated Service/Warranty/RMA specification.

---

## 30. IAM ROLES & PERMISSION INTEGRATION

- **SMDI-IAM-001 (Strict URPA Token Compliance):**
  - In strict compliance with `USER_ROLES_PERMISSIONS_ACCESS_SPEC.md` v1.0 (`25e7834`), inventory operations are governed by approved platform roles and explicit permission tokens:
    - `devices.registry.verify`: Validate device model against DCR and authorize hardware registration.
    - `platform.provider.manage`: Authorize Tracking Provider route registration and binding.
    - `commands.apn_config.request`: Authorize initial APN provisioning commands via CSE engine.
    - `support.diagnostics.view`: Authorize technical support inspection of device/SIM technical metadata.
    - `audit.log.view`: Authorize inspection of custody transfer and lifecycle audit logs.
  - *Zero Token Invention:* This specification invents zero unapproved permission tokens. Fine-grained physical warehouse actions operate under Tenant Admin / Platform Admin governance.

---

## 31. MODULE & SERVICE ENTITLEMENT (MSE) BOUNDARIES

- **SMDI-MSE-001 (Approved Module Token Compliance):**
  - In strict compliance with `MODULE_SERVICE_ENTITLEMENT_SPEC.md` v1.0 (`a962a2a`), inventory and SIM operations correspond to official platform modules:
    - `MOD-SIM-15` (SIM / M2M Lifecycle ERP)
    - `MOD-INV-16` (Hardware Inventory & RMA)
  - Interacting modules include `MOD-001` (Core Tracking), `MOD-CMD-05` (Command Execution Engine), `MOD-SUP-13` (Support Hub), and `MOD-DMO-20` (Product Demo Simulation).
  - *Entitlement Boundary:* Holding a commercial subscription for a vehicle does not manufacture physical inventory; physical device availability and entitlement validation are independent preconditions.

---

## 32. TENANT ISOLATION & DATA PERIMETERS

- **SMDI-TEN-003 (Data Perimeter Enforcement):**
  - In strict compliance with `TENANT_ISOLATION_SECURITY_BOUNDARY_SPEC.md` v1.0 (`93d7a4e`):
    1. Every inventory database query must enforce mandatory tenant scoping: `WHERE tenant_id = :current_tenant_id` (unless executed by Platform Super Admin across `PLATFORM_STOCK`).
    2. Physical devices returned from customer fleets are wiped of all volatile configuration keys before return to unallocated stock.
    3. Cross-tenant inventory lookup or reservation is physically impossible at the query layer.

---

## 33. PRIVACY & SECRET MANAGEMENT BOUNDARIES

- **SMDI-PRI-001 (Identifier & Secret Protection):**
  - Telematics devices frequently utilize sensitive credentials: APN passwords, SMS gateway passwords, private provider shared keys.
  - *Zero Plaintext Storage:* All carrier and provider secrets must be stored in secure platform key vaults; physical inventory tables must never store plaintext passwords or carrier API keys.
  - Customer personal details (names, phone numbers, addresses) must never be embedded in physical device or SIM inventory records (`SSR-PRI-001`).

---

## 34. REGULATORY KNOWLEDGE SERVICE (RKS) BOUNDARY

- **SMDI-REG-003 (RKS Compliance Verification):**
  - In strict compliance with `REGULATORY_KNOWLEDGE_SERVICE_SPEC.md` v1.0 (`d26153b`):
    - National telecommunications regulations regarding cellular transmission, emergency frequency bands, and certified radio frequency compliance are referenced through RKS.
    - If national statutory rules mandate specific telematics hardware certification (e.g., BSTI, BTRC type approval), inventory verification enforces the RKS certification flag prior to operational deployment.
    - Any unverified regulatory assertion is marked:
      > `LEGAL / REGULATORY VERIFICATION REQUIRED`

---

## 35. ARTIFICIAL INTELLIGENCE & AUTOMATION GUARDRAILS

- **SMDI-AI-001 (AI Non-Authority & Sensitive Data Guard):**
  - AI systems (including `MOD-AI-18`) are strictly non-authoritative:
    - ❌ AI cannot authorize hardware decommissioning, transfer inventory between tenants, alter IMEI records, or trigger SIM deactivations.
    - ✅ AI may assist in automated anomaly detection (e.g., identifying clusters of devices with erratic GPS signals or abnormal SIM data consumption patterns).
  - *DEC-014 Data Guard:* In strict compliance with `DEC-014`, zero customer PII, device IMEIs, ICCIDs, or location telemetry may be transmitted to free or unapproved third-party cloud AI models.

---

## 36. DEMO, TRIAL & PRODUCTION SEGREGATION

- **SMDI-DEM-001 (Demo Stock Segregation):**
  - In strict compliance with `SALES_SUPPORT_RESCUE_SPEC.md` (`SSR-DEM-001`):
    - Public demo devices are strictly synthetic or isolated bench units.
    - Production inventory failure (e.g., SIM network timeout, provider routing failure) must NEVER fall back to synthetic demo simulation.
    - Controlled trial devices provided to prospective enterprise clients must be formally provisioned as real production units in `TRIAL` status with explicit auto-expiration limits.

---

## 37. AUDITABILITY & DURABLE EVIDENCE

- **SMDI-AUD-001 (Durable Inventory Event Logging):**
  - 100% of the following operational events must generate durable, immutable audit records:
    1. Device creation, IMEI correction, or serial update.
    2. SIM creation, ICCID update, or MSISDN reassignment.
    3. Device $\leftrightarrow$ SIM binding and unbinding.
    4. Device $\leftrightarrow$ Vehicle assignment and unassignment.
    5. Custody node transfer dispatch and receipt confirmation.
    6. Transition to `QUARANTINED` or `RETIRED_DECOMMISSIONED`.
    7. Provisioning stage progression and provider route establishment.
  - Audit records must capture: `event_id`, `timestamp_utc`, `actor_id`, `actor_role`, `tenant_id`, `entity_type`, `entity_id`, `before_state`, `after_state`, and `authorization_evidence`.

---

## 38. CONCURRENCY, REASSIGNMENT & STALE-STATE HANDLING

- **SMDI-CON-001 (Concurrency Invariants & Conflict Prevention):**
  - The inventory system must enforce deterministic, implementation-neutral concurrency invariants across all entity mutations:
    1. *Lost-Update Prevention & Stale-Write Rejection:* Simultaneous custody updates, binding requests, or status transitions on a device or SIM record must detect concurrent modifications and reject stale writes. State updates must enforce atomic transition verification and conflict detection, returning deterministic conflict responses upon race conditions. Implementation mechanisms (such as application-level version checking, optimistic record attributes, or transactional conditional writes) are non-normative implementation patterns provided the invariant of lost-update prevention and stale-write rejection is preserved without database engine lock-in.
    2. *Atomic Transitions & Conflict Auditability:* Lifecycle, custody, and assignment transitions must execute atomically; any conflicting or rejected mutation attempt must be recorded in the audit trail without corrupting entity state or leaving dangling associations.
    3. *Reservation Timeouts & Idempotency:* Inventory reserved for customer orders or technician kits must handle reservation conflicts deterministically and automatically release back to `INSPECTED_AVAILABLE` if not provisioned within the configured timeout window, with replay and idempotency protection on provisioning dispatches.
    4. *Stale Association Invalidation:* Committing a new SIM binding or vehicle assignment must atomically invalidate any prior cached routing or cellular session parameters.

---

## 39. FAILURE & DENIAL SEMANTICS

- **SMDI-CON-002 (Fail-Closed Denial Semantics):**
  - The inventory engine fails closed under all error conditions:
    - Duplicate IMEI or ICCID $\rightarrow$ Operation rejected; conflict logged.
    - Unrecognized DCR Model Code $\rightarrow$ Registration blocked; flagged for capability review.
    - Unknown Vehicle Compatibility $\rightarrow$ Vehicle assignment blocked unless certified override provided.
    - Missing Provider Route $\rightarrow$ Provisioning halted; unit cannot enter `ACTIVE_OPERATIONAL`.
    - Cross-Tenant Custody Mismatch $\rightarrow$ Custody transfer rejected.

---

## 40. NON-FUNCTIONAL REQUIREMENTS

- **SMDI-NFR-001 (Scale & Density):**
  - Aligned with the authoritative approved PRD design principle (`PRD-SCL-001`), the architecture is designed for approximately 2,000,000 registered physical devices while building pragmatically for initial commercial deployments (tens of units).
  - SIM record storage and lifecycle management scale proportionally with registered devices and lifecycle replacement turnover; an engineering planning figure of approximately 2,500,000 SIM records represents derived, non-binding capacity-planning headroom / stress-test planning headroom (subject to refinement during subsequent Data Architecture, Events, and System Test phases) and is not an approved product ceiling or contractual constraint.
  - Core identifier lookups (barcode, IMEI, ICCID) must sustain sub-second query response under indexed inventory conditions.
- **SMDI-NFR-002 (Data Integrity):**
  - Zero tolerance for orphan SIM bindings, orphaned vehicle assignments, or duplicate active hardware identities.
- **SMDI-NFR-003 (Audit Durability):**
  - Inventory custody and lifecycle audit trails must be retained durably for statutory audit compliance (`DEC-009`).
- **SMDI-NFR-004 (Operational Resilience):**
  - Batch import capabilities must support atomic transaction boundaries per batch or structured line-by-line error isolation without database corruption.
- **SMDI-NFR-005 (Barcode & Mobile Interoperability):**
  - Serial numbers, IMEIs, and ICCIDs must support standard barcode/QR-code scanning formats (Code 128, DataMatrix, QR) for field technician mobile applications.
- **SMDI-NFR-006 (Extensibility):**
  - Support for future sensor accessories (BLE tags, temperature probes, door sensors) without requiring architectural rewrites of core device inventory tables.

---

## 41. ARCHITECTURE & OPERATIONS MATRICES

### Matrix 1: Operational Actor & Inventory Authority Matrix

| Operational Actor | Primary Function | View Stock Counts | Register Device/SIM | Bind SIM to Device | Assign to Vehicle | Transfer Custody | View Diagnostics | Execute Commands |
| :--- | :--- | :---: | :---: | :---: | :---: | :---: | :---: | :---: |
| **Platform Administrator** | System Governance | **ALL** | **YES** | **YES** | **YES** | **YES** | **YES** | Full (via CSE) |
| **Tenant Administrator** | Tenant Fleet Mgmt | Tenant Scope | **YES (Tenant)** | **YES** | **YES** | **YES** | **YES** | Full (via CSE) |
| **Technician / Installer** | Field Installation | Assigned Kit | **NO** | **YES (Field)** | **YES (Field)** | Receive/Return | Diagnostics Only | Verification Only |
| **Dealer / Channel Partner** | Retail Distribution | Dealer Custody| **NO** | **NO** | **NO** | Receive/Handoff| **NO** | **NO** |
| **Support Agent** | Case Troubleshooting | **NO** | **NO** | **NO** | **NO** | **NO** | Ticket Scoped | **NO** |
| **Sales Representative** | Commercial Quotes | Aggregated Qty | **NO** | **NO** | **NO** | **NO** | **NO** | **NO** |

---

### Matrix 2: SIM Lifecycle State Machine Matrix

| State Name | Meaning / Context | Allowed Next States | Entry Condition | Prohibited Transitions |
| :--- | :--- | :--- | :--- | :--- |
| **`RECEIVED`** | Batch received from carrier | `AVAILABLE`, `RETIRED` | Delivery confirmed | `ACTIVE`, `BOUND` |
| **`AVAILABLE`** | Verified and in stock | `RESERVED`, `BOUND`, `RETIRED` | Inspection passed | `ACTIVE`, `SUSPENDED` |
| **`RESERVED`** | Allocated to order/technician | `BOUND`, `AVAILABLE` | Order allocated | `ACTIVE`, `DEACTIVATED` |
| **`BOUND`** | Associated with physical device| `ACTIVATION_PENDING`, `AVAILABLE`| Device paired | `DEACTIVATED` |
| **`ACTIVATION_PENDING`**| Carrier activation dispatched | `ACTIVE`, `BOUND` (on failure) | Carrier request sent | `RESERVED`, `AVAILABLE` |
| **`ACTIVE`** | Confirmed transmitting data | `SUSPENDED`, `DEACTIVATED`, `BOUND`| Network confirmation | `AVAILABLE`, `RESERVED` |
| **`SUSPENDED`** | Paused (billing/seasonal/RMA) | `ACTIVE`, `DEACTIVATED`, `RETIRED` | Pause event triggered | `AVAILABLE`, `RESERVED` |
| **`DEACTIVATED`** | Operator subscription ended | `RETIRED` | Carrier disconnect | `ACTIVE`, `BOUND` |
| **`RETIRED`** | Scrapped or permanently dead | None (Terminal) | Destruction / scrap | Any active state |

---

### Matrix 3: Physical Device Lifecycle State Machine Matrix

| State Name | Meaning / Context | Allowed Next States | Entry Condition | Prohibited Transitions |
| :--- | :--- | :--- | :--- | :--- |
| **`RECEIVED`** | Physical shipment arrived | `INSPECTED_AVAILABLE`, `QUARANTINED`| Shipment receipt | `ACTIVE_OPERATIONAL` |
| **`INSPECTED_AVAILABLE`**| DCR verified; in warehouse stock| `RESERVED`, `PROVISIONING`, `QUARANTINED`| DCR model matched | `ACTIVE_OPERATIONAL` |
| **`RESERVED`** | Allocated to deployment kit | `PROVISIONING`, `INSPECTED_AVAILABLE` | Order allocation | `ACTIVE_OPERATIONAL` |
| **`PROVISIONING`** | SIM bound; APN/route setup | `ACTIVE_OPERATIONAL`, `QUARANTINED` | SIM paired & configured | `INSPECTED_AVAILABLE` |
| **`ACTIVE_OPERATIONAL`**| Installed in vehicle; streaming | `MAINTENANCE_PAUSE`, `QUARANTINED` | Telemetry verified | `INSPECTED_AVAILABLE` |
| **`MAINTENANCE_PAUSE`** | Temporary vehicle repair | `ACTIVE_OPERATIONAL`, `QUARANTINED` | Uninstalled for service | `RESERVED` |
| **`QUARANTINED`** | Malfunction / RMA investigation| `INSPECTED_AVAILABLE` (cleared), `RETIRED`| Fault / tamper detected | `ACTIVE_OPERATIONAL` |
| **`RETIRED_DECOMMISSIONED`**| EOL / destroyed / decommissioned| None (Terminal) | Physical scrap | Any operational state |

---

### Matrix 4: Stock Custody & Location Classification Matrix

| Custody Node | Physical Location | Holding Entity | Primary Activity | Telemetry Access | Command Access |
| :--- | :--- | :--- | :--- | :---: | :---: |
| **`CENTRAL_WAREHOUSE`** | Company HQ / Main Depot | Platform Operations | Intake, testing, staging | **NO** | Test Bench Only |
| **`TENANT_DEPOT`** | Regional Tenant Facility | Tenant Logistics | Local fleet stock | **NO** | **NO** |
| **`TECHNICIAN_VAN`** | Mobile Installer Vehicle | Certified Technician | Field installation / swap | Diagnostics Only | Verification Only |
| **`DEALER_SHOWROOM`** | Channel Retail Outlet | Channel Partner | Retail sales inventory | **NO** | **NO** |
| **`CUSTOMER_PREMISES`** | Enterprise Client Facility | Customer Custody | Staged awaiting installation | **NO** | **NO** |
| **`INSTALLED_VEHICLE`** | On-board Customer Vehicle | Customer / Driver | Active fleet telemetry | Full (via IAM) | Full (via CSE) |
| **`RMA_QUARANTINE`** | Secure Inspection Area | Service Center | Failure diagnostics | Diagnostics Only | Test Bench Only |

---

### Matrix 5: Identifier Uniqueness & Conflict Resolution Matrix

| Identifier Type | Standard Format | Uniqueness Scope | Validation Rule | Conflict Action | Override Policy |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **`IMEI`** | 15 numeric digits (DCR Profile) | Global (Platform-wide) | 3GPP Luhn Check (`EXTERNAL TECHNICAL VERIFICATION REQUIRED`) | Reject with `CONFLICT` | Authorized Admin Audit |
| **`Serial Number`** | Alphanumeric string | Manufacturer + Model | Regex normalization | Reject with `CONFLICT` | Manufacturer Verification |
| **`ICCID`** | 19-20 numeric digits (Standard Profile) | Global (Platform-wide) | ITU-T E.118 format (`EXTERNAL TECHNICAL VERIFICATION REQUIRED`) | Reject with `CONFLICT` | Carrier Confirmation |
| **`MSISDN`** | Standardized format (`+8801...`) | Active uniqueness | E.164 international format (`EXTERNAL TECHNICAL VERIFICATION REQUIRED`) | Require retirement of old | Recycling Audit Trail |

---

### Matrix 6: Provisioning & Activation Multi-Stage Readiness Matrix

*(Note: Stages 1–3 are foundational prerequisites; Stages 4, 5, and 6 are flexible readiness dimensions; Stage 7 is the mandatory final operational activation gate.)*

| Stage | Milestone Description | Prerequisite Gates | Evidence Required | Failure Consequence |
| :---: | :--- | :--- | :--- | :--- |
| **1** | Inventory Registration | Package intake | Valid Luhn-checked IMEI | Record rejected |
| **2** | Capability Verification | Stage 1 complete | DCR Registry match (`DCR-GEN-001`) | Flagged `CAPABILITY_UNKNOWN` |
| **3** | SIM Binding | Stage 2 complete + SIM in stock | Active binding per DCR profile (`SMDI-AST-001`) | Cannot proceed to APN |
| **4** | Cellular Provisioning | Stage 3 complete | APN configuration dispatched | Network offline |
| **5** | Provider Routing | Stage 4 complete | Route registered in TPA (`TPA-ROU-001`) | Ingestion rejected |
| **6** | Vehicle Installation | Stage 5 complete + VKR check | Technician installation sign-off | Physical install incomplete |
| **7** | Operational Activation | Stage 6 complete | First GPS fix & valid heartbeat packet| Remains in `PROVISIONING` |

---

### Matrix 7: Cross-Tenant Transfer & History Isolation Matrix

| Transfer Step | Source State (Tenant A) | Action Taken | Destination State (Tenant B) | Data Isolation Enforcement |
| :---: | :--- | :--- | :--- | :--- |
| **1. Unassign** | `ACTIVE_OPERATIONAL` | Device unlinked from Vehicle A | `UNASSIGNED` | Trip history stays with Vehicle A |
| **2. Quarantine** | `UNASSIGNED` | Moved to `TRANSFER_QUARANTINE` | `QUARANTINED` | Provider route revoked; cache cleared |
| **3. Transfer** | Tenant A releases title | Admin authorizes transfer | Reassigned to Tenant B | Tenant A loses all device visibility |
| **4. Intake** | Historical record sealed | Tenant B accepts custody | `INSPECTED_AVAILABLE` | Zero access to Tenant A trips/PII |
| **5. Redeploy** | N/A | Bound to new SIM / Vehicle B | `PROVISIONING` | Telemetry streams strictly to Tenant B |

---

### Matrix 8: Channel / Dealer Inventory Custody Boundary Matrix

| Capability / Action | Dealer / Channel Partner | Justification / Boundary | Governing Reference |
| :--- | :---: | :--- | :--- |
| **Hold Physical Device Stock** | **YES** | Authorizes retail staging and fulfillment | `CTCM-CUS-001` |
| **Scan / Transfer Custody** | **YES** | Allows receiving shipment and customer handoff | `SMDI-INV-001` |
| **View Fleet Tracking Map** | **NO** | Physical custody does NOT grant operational tracking | `SSR-CHN-001` |
| **View Location History** | **NO** | Customer location history is private operational data | `URPA-TEN-001` |
| **Dispatch Remote Commands** | **NO** | Remote commands strictly subordinate to CSE engine | `CSE-AUT-001` |
| **Access Provider Secrets** | **NO** | Provider credentials isolated server-side | `TPA-ROU-002` |

---

### Matrix 9: Upstream Authority Boundary Separation Matrix

| Functional Concern | Authoritative Upstream Document | Upstream Boundary Retained | Inventory Specification Boundary |
| :--- | :--- | :--- | :--- |
| **Technical Capability** | `DEVICE_CAPABILITY_REGISTRY_SPEC.md` | DCR defines schemas, protocols, sensors | Physical stock references DCR model |
| **Vehicle Compatibility**| `VEHICLE_KNOWLEDGE_REGISTRY_SPEC.md` | VKR defines vehicle electrical fitment | Physical assignment checks VKR rules |
| **Provider Routing** | `TRACKING_PROVIDER_ARCHITECTURE_SPEC.md`| TPA defines multi-provider ingestion | Registration establishes route link |
| **Command Execution** | `COMMAND_SAFETY_EXECUTION_SPEC.md` | CSE defines 9-term formula & safe-state | Inventory status grants ZERO command rights |
| **Tenant Isolation** | `TENANT_ISOLATION_SECURITY_BOUNDARY_SPEC.md`| TISB defines logical data perimeters | Stock partitioned strictly per tenant |
| **Commercial Models** | `CUSTOMER_TYPES_COMMERCIAL_MODEL_SPEC.md`| CTCM defines customer types & billing | Inventory availability != subscription |
| **Support Operations** | `SALES_SUPPORT_RESCUE_SPEC.md` | SSR defines support managed modes | Technical diagnostics access boundary |

---

### Matrix 10: Downstream Handoff Boundary Matrix

| Downstream Specification | Inventory Handoff Boundary | Deferred Content (NOT Designed Here) |
| :--- | :--- | :--- |
| **Service, Warranty & RMA** | Defective unit custody, `QUARANTINED` status | Warranty pricing, repair labor, RMA claims |
| **Integration Registry** | Device $\rightarrow$ Provider route configuration | Concrete telecom BTRC/carrier API adapters |
| **Billing & Metering** | Hardware asset activation timestamp | Subscription invoicing, data usage ledgers |
| **Privacy & Offboarding** | Hardware sanitization & history unlinking | Statutory data purge, GDPR offboarding |
| **AI & Automation** | Device anomaly telemetry feeds | Autonomous triage, machine learning models |

---

## 42. REQUIREMENT TRACEABILITY MATRIX

| Requirement ID | PRD | MSE | URPA | TISB | CTCM | TPA | DCR | VKR | RKS | CSE | FPS | SSR | Architectural Scope Summary |
| :--- | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :--- |
| **SMDI-GEN-001** | `PRD-DEV-001` | `MSE-GEN-001` | `URPA-DEV-001` | `TISB-GEN-001` | `CTCM-GEN-001` | `TPA-GEN-001` | `DCR-GEN-001` | `VKR-GEN-001` | `RKS-GEN-001` | `CSE-GEN-001` | `FPS-DEV-001` | `SSR-DEV-001` | Physical vs Capability Decoupling |
| **SMDI-GEN-002** | `PRD-GEN-001` | `MSE-SYS-001` | `URPA-TEN-001` | `TISB-TEN-001` | `CTCM-CUS-001` | `TPA-ROU-001` | `DCR-GEN-001` | `VKR-GEN-001` | `RKS-GEN-001` | `CSE-GEN-001` | `FPS-CUS-001` | `SSR-GEN-002` | Core Entity Separations |
| **SMDI-GEN-003** | `PRD-GEN-004` | `MSE-SYS-001` | `URPA-GEN-001` | `TISB-GEN-001` | `CTCM-GEN-001` | `TPA-GEN-001` | `DCR-GEN-001` | `VKR-GEN-001` | `RKS-GEN-001` | `CSE-GEN-001` | `FPS-CAR-002` | `SSR-GEN-003` | Downstream Scope Containment |
| **SMDI-GEN-004** | `PRD-NFR-001` | `MSE-NFR-001` | `URPA-NFR-001` | `TISB-NFR-001` | `CTCM-NFR-001` | `TPA-NFR-001` | `DCR-NFR-001` | `VKR-NFR-001` | `RKS-NFR-001` | `CSE-NFR-001` | `FPS-NFR-001` | `SSR-GEN-004` | Scale (2M Devices) & Neutrality |
| **SMDI-GEN-005** | `PRD-GEN-001` | `MSE-SYS-001` | `URPA-CMD-001` | `TISB-TEN-001` | `CTCM-CUS-001` | `TPA-CAP-001` | `DCR-CMD-003` | `VKR-CMD-001` | `RKS-CMD-001` | `CSE-AUT-001` | `FPS-ENT-001` | `SSR-GEN-005` | Multi-Factor Entitlement Gating |
| **SMDI-SIM-001** | `PRD-DEV-001` | `MOD-SIM-15`  | `URPA-DEV-001` | `TISB-SEC-001` | `CTCM-CUS-001` | `TPA-CAP-001` | `DCR-GEN-001` | `VKR-GEN-001` | `RKS-GEN-001` | `CSE-GEN-001` | `FPS-DEV-001` | `SSR-DEV-001` | SIM Technical Identifiers |
| **SMDI-SIM-002** | `PRD-DEV-001` | `MOD-SIM-15`  | `URPA-DEV-001` | `TISB-TEN-001` | `CTCM-CUS-001` | `TPA-ROU-001` | `DCR-GEN-001` | `VKR-GEN-001` | `RKS-GEN-001` | `CSE-GEN-001` | `FPS-TRK-001` | `SSR-TRK-001` | Carrier Neutrality & Roaming |
| **SMDI-SIM-003** | `PRD-DEV-001` | `MOD-SIM-15`  | `URPA-DEV-001` | `TISB-TEN-001` | `CTCM-CUS-001` | `TPA-ROU-001` | `DCR-GEN-001` | `VKR-GEN-001` | `RKS-GEN-001` | `CSE-GEN-001` | `FPS-DEV-001` | `SSR-DEV-001` | SIM Lifecycle State Machine |
| **SMDI-SIM-004** | `PRD-DEV-001` | `MOD-SIM-15`  | `URPA-DEV-001` | `TISB-TEN-001` | `CTCM-CUS-001` | `TPA-ACK-002` | `DCR-GEN-001` | `VKR-GEN-001` | `RKS-GEN-001` | `CSE-ACK-001` | `FPS-DEV-001` | `SSR-DEV-001` | Carrier Evidence Separation |
| **SMDI-DEV-001** | `PRD-DEV-001` | `MOD-INV-16`  | `URPA-DEV-001` | `TISB-TEN-001` | `CTCM-CUS-001` | `TPA-CAP-001` | `DCR-GEN-001` | `VKR-GEN-001` | `RKS-GEN-001` | `CSE-GEN-001` | `FPS-DEV-001` | `SSR-DEV-001` | Physical Device Record |
| **SMDI-DEV-002** | `PRD-DEV-001` | `MOD-INV-16`  | `URPA-DEV-001` | `TISB-TEN-001` | `CTCM-CUS-001` | `TPA-ROU-001` | `DCR-GEN-001` | `VKR-GEN-001` | `RKS-GEN-001` | `CSE-GEN-001` | `FPS-DEV-001` | `SSR-DEV-001` | Device Lifecycle State Machine |
| **SMDI-DEV-003** | `PRD-DEV-001` | `MOD-INV-16`  | `URPA-DEV-001` | `TISB-TEN-001` | `CTCM-CUS-001` | `TPA-CAP-001` | `DCR-REG-001` | `VKR-GEN-001` | `RKS-GEN-001` | `CSE-AUT-002` | `FPS-DEV-001` | `SSR-DEV-001` | DCR Subordination Boundary |
| **SMDI-DEV-004** | `PRD-DEV-001` | `MOD-INV-16`  | `URPA-DEV-001` | `TISB-TEN-001` | `CTCM-CUS-001` | `TPA-CAP-001` | `DCR-GEN-001` | `VKR-CMD-001` | `RKS-GEN-001` | `CSE-AUT-003` | `FPS-VEH-001` | `SSR-VEH-001` | VKR Compatibility Boundary |
| **SMDI-ID-001**  | `PRD-DEV-001` | `MOD-SIM-15`  | `URPA-DEV-001` | `TISB-SEC-001` | `CTCM-CUS-001` | `TPA-ROU-001` | `DCR-GEN-001` | `VKR-GEN-001` | `RKS-SEC-001` | `CSE-GEN-001` | `FPS-DEV-001` | `SSR-DEV-001` | SIM Identifier Uniqueness |
| **SMDI-ID-002**  | `PRD-DEV-001` | `MOD-SIM-15`  | `URPA-DEV-001` | `TISB-SEC-001` | `CTCM-CUS-001` | `TPA-ROU-001` | `DCR-GEN-001` | `VKR-GEN-001` | `RKS-SEC-001` | `CSE-GEN-001` | `FPS-DEV-001` | `SSR-DEV-001` | MSISDN E.164 & Recycling |
| **SMDI-ID-003**  | `PRD-DEV-001` | `MOD-INV-16`  | `URPA-DEV-001` | `TISB-SEC-001` | `CTCM-CUS-001` | `TPA-ROU-001` | `DCR-GEN-001` | `VKR-GEN-001` | `RKS-SEC-001` | `CSE-GEN-001` | `FPS-DEV-001` | `SSR-DEV-001` | IMEI Luhn Check & Uniqueness |
| **SMDI-ID-004**  | `PRD-DEV-001` | `MOD-INV-16`  | `URPA-DEV-001` | `TISB-SEC-001` | `CTCM-CUS-001` | `TPA-ROU-001` | `DCR-GEN-001` | `VKR-GEN-001` | `RKS-SEC-001` | `CSE-GEN-001` | `FPS-DEV-001` | `SSR-DEV-001` | Identifier Correction Auditing |
| **SMDI-AST-001** | `PRD-DEV-001` | `MOD-INV-16`  | `URPA-DEV-001` | `TISB-TEN-001` | `CTCM-CUS-001` | `TPA-CAP-001` | `DCR-GEN-001` | `VKR-GEN-001` | `RKS-GEN-001` | `CSE-GEN-001` | `FPS-DEV-001` | `SSR-DEV-001` | Device ↔ SIM Binding Rules |
| **SMDI-AST-002** | `PRD-DEV-001` | `MOD-INV-16`  | `URPA-DEV-001` | `TISB-TEN-001` | `CTCM-CUS-001` | `TPA-CAP-001` | `DCR-GEN-001` | `VKR-GEN-001` | `RKS-GEN-001` | `CSE-GEN-001` | `FPS-DEV-001` | `SSR-DEV-001` | Device ↔ Vehicle Linking |
| **SMDI-AST-003** | `PRD-DEV-001` | `MOD-INV-16`  | `URPA-DEV-001` | `TISB-SEC-001` | `CTCM-CUS-001` | `TPA-ROU-001` | `DCR-GEN-001` | `VKR-GEN-001` | `RKS-SEC-001` | `CSE-QUE-004` | `FPS-DEV-001` | `SSR-CON-001` | Association Invalidation |
| **SMDI-PROV-001**| `PRD-DEV-001` | `MOD-INV-16`  | `URPA-DEV-001` | `TISB-TEN-001` | `CTCM-CUS-001` | `TPA-ROU-001` | `DCR-GEN-001` | `VKR-GEN-001` | `RKS-GEN-001` | `CSE-GEN-001` | `FPS-DEV-001` | `SSR-DEV-001` | Multi-Stage Provisioning |
| **SMDI-PROV-002**| `PRD-DEV-001` | `MOD-INV-16`  | `URPA-DEV-001` | `TISB-TEN-001` | `CTCM-CUS-001` | `TPA-ACK-002` | `DCR-GEN-001` | `VKR-GEN-001` | `RKS-GEN-001` | `CSE-ACK-001` | `FPS-DEV-001` | `SSR-DEV-001` | Telemetry Confirmation Gate |
| **SMDI-TRK-001** | `PRD-DEV-001` | `MOD-001`     | `URPA-DEV-001` | `TISB-TEN-001` | `CTCM-CUS-001` | `TPA-ROU-001` | `DCR-GEN-001` | `VKR-GEN-001` | `RKS-GEN-001` | `CSE-ROU-001` | `FPS-TRK-001` | `SSR-TRK-001` | Authoritative Provider Route |
| **SMDI-INV-001** | `PRD-DEV-001` | `MOD-INV-16`  | `URPA-DEV-001` | `TISB-TEN-001` | `CTCM-CUS-001` | `TPA-GEN-001` | `DCR-GEN-001` | `VKR-GEN-001` | `RKS-GEN-001` | `CSE-GEN-001` | `FPS-DEV-001` | `SSR-DEV-001` | Ownership vs Custody |
| **SMDI-INV-002** | `PRD-DEV-001` | `MOD-INV-16`  | `URPA-DEV-001` | `TISB-TEN-001` | `CTCM-CUS-001` | `TPA-GEN-001` | `DCR-GEN-001` | `VKR-GEN-001` | `RKS-GEN-001` | `CSE-GEN-001` | `FPS-DEV-001` | `SSR-DEV-001` | Stock Custody Nodes |
| **SMDI-INV-003** | `PRD-DEV-001` | `MOD-INV-16`  | `URPA-DEV-001` | `TISB-TEN-001` | `CTCM-CUS-001` | `TPA-GEN-001` | `DCR-GEN-001` | `VKR-GEN-001` | `RKS-GEN-001` | `CSE-GEN-001` | `FPS-DEV-001` | `SSR-DEV-001` | Audited Custody Transfers |
| **SMDI-INV-004** | `PRD-DEV-001` | `MOD-INV-16`  | `URPA-DEV-001` | `TISB-TEN-001` | `CTCM-CUS-001` | `TPA-GEN-001` | `DCR-GEN-001` | `VKR-GEN-001` | `RKS-GEN-001` | `CSE-QUE-004` | `FPS-DEV-001` | `SSR-DEV-001` | Quarantine & Decommission |
| **SMDI-TEN-001** | `PRD-SEC-001` | `MOD-INV-16`  | `URPA-TEN-001` | `TISB-TEN-001` | `CTCM-CUS-001` | `TPA-GEN-001` | `DCR-GEN-001` | `VKR-GEN-001` | `RKS-SEC-001` | `CSE-GEN-001` | `FPS-TEN-001` | `SSR-TEN-001` | Multi-Tenant Partitioning |
| **SMDI-TEN-002** | `PRD-GEN-001` | `MOD-INV-16`  | `URPA-TEN-001` | `TISB-TEN-001` | `CTCM-CUS-001` | `TPA-GEN-001` | `DCR-GEN-001` | `VKR-GEN-001` | `RKS-GEN-001` | `CSE-GEN-001` | `FPS-CUS-001` | `SSR-SAL-001` | Customer vs Tenant Assignment |
| **SMDI-TEN-003** | `PRD-SEC-001` | `MOD-INV-16`  | `URPA-TEN-001` | `TISB-SEC-001` | `CTCM-CUS-001` | `TPA-ROU-001` | `DCR-GEN-001` | `VKR-GEN-001` | `RKS-SEC-001` | `CSE-QUE-004` | `FPS-TEN-001` | `SSR-TEN-001` | Data Perimeter Enforcement |
| **SMDI-CHN-001** | `PRD-GEN-001` | `MOD-INV-16`  | `URPA-ROLE-006`| `TISB-TEN-001` | `CTCM-CUS-001` | `TPA-GEN-001` | `DCR-GEN-001` | `VKR-GEN-001` | `RKS-GEN-001` | `CSE-AUT-001` | `FPS-CUS-001` | `SSR-CHN-001` | Channel Custody Non-Authority |
| **SMDI-SAL-001** | `PRD-GEN-001` | `MOD-INV-16`  | `URPA-ROLE-006`| `TISB-TEN-001` | `CTCM-CUS-001` | `TPA-GEN-001` | `DCR-GEN-001` | `VKR-GEN-001` | `RKS-GEN-001` | `CSE-AUT-001` | `FPS-CUS-001` | `SSR-SAL-001` | Sales Stock Inquiries |
| **SMDI-SUP-001** | `PRD-GEN-001` | `MOD-SUP-13`  | `URPA-ROLE-006`| `TISB-TEN-001` | `CTCM-CUS-001` | `TPA-GEN-001` | `DCR-GEN-001` | `VKR-GEN-001` | `RKS-GEN-001` | `CSE-AUT-001` | `FPS-SUP-001` | `SSR-SUP-003` | Support Hardware Diagnostics |
| **SMDI-RMA-001** | `PRD-DEV-001` | `MOD-INV-16`  | `URPA-DEV-001` | `TISB-TEN-001` | `CTCM-CUS-001` | `TPA-GEN-001` | `DCR-GEN-001` | `VKR-GEN-001` | `RKS-GEN-001` | `CSE-QUE-004` | `FPS-DEV-001` | `SSR-DEV-001` | Downstream RMA Handoff |
| **SMDI-IAM-001** | `PRD-GEN-001` | `MSE-SYS-001` | `URPA-ROLE-001`| `TISB-TEN-001` | `CTCM-GEN-001` | `TPA-CAP-001` | `DCR-CMD-003` | `VKR-GEN-001` | `RKS-GEN-001` | `CSE-AUT-001` | `FPS-IAM-001` | `SSR-IAM-001` | URPA Token Compliance |
| **SMDI-MSE-001** | `PRD-GEN-001` | `MSE-GEN-001` | `URPA-GEN-001` | `TISB-TEN-001` | `CTCM-GEN-001` | `TPA-CAP-001` | `DCR-GEN-001` | `VKR-GEN-001` | `RKS-GEN-001` | `CSE-AUT-001` | `FPS-ENT-001` | `SSR-GEN-005` | MSE Module Token Compliance |
| **SMDI-SEC-001** | `PRD-CMD-001` | `MOD-CMD-05`  | `URPA-CMD-001` | `TISB-CMD-001` | `CTCM-CMD-001` | `TPA-CAP-001` | `DCR-CMD-003` | `VKR-CMD-001` | `RKS-CMD-001` | `CSE-AUT-001` | `FPS-CMD-001` | `SSR-CMD-001` | Command Safety Subordination |
| **SMDI-PRI-001** | `PRD-AUD-002` | `MSE-SYS-001` | `URPA-ROLE-006`| `TISB-SEC-001` | `CTCM-CUS-001` | `TPA-AUD-001` | `DCR-GEN-001` | `VKR-GEN-001` | `RKS-SEC-001` | `CSE-AUD-001` | `FPS-PRI-001` | `SSR-PRI-001` | Privacy & Secret Management |
| **SMDI-REG-001** | `PRD-REG-001` | `MOD-REG-19`  | `URPA-GEN-001` | `TISB-GEN-001` | `CTCM-GEN-001` | `TPA-GEN-001` | `DCR-GEN-001` | `VKR-GEN-001` | `RKS-GOV-001` | `CSE-GEN-001` | `FPS-GEN-001` | `SSR-REG-001` | Carrier & Regulatory Purity |
| **SMDI-REG-002** | `PRD-REG-001` | `MOD-REG-19`  | `URPA-GEN-001` | `TISB-GEN-001` | `CTCM-GEN-001` | `TPA-GEN-001` | `DCR-GEN-001` | `VKR-GEN-001` | `RKS-GOV-002` | `CSE-GEN-001` | `FPS-GEN-001` | `SSR-REG-001` | Regulatory Compliance Gate |
| **SMDI-REG-003** | `PRD-REG-001` | `MOD-REG-19`  | `URPA-GEN-001` | `TISB-GEN-001` | `CTCM-GEN-001` | `TPA-GEN-001` | `DCR-GEN-001` | `VKR-GEN-001` | `RKS-GOV-003` | `CSE-GEN-001` | `FPS-GEN-001` | `SSR-REG-001` | RKS Certification Boundary |
| **SMDI-AI-001**  | `PRD-GEN-001` | `MOD-AI-18`   | `URPA-GEN-001` | `TISB-SEC-001` | `CTCM-GEN-001` | `TPA-GEN-001` | `DCR-GEN-001` | `VKR-GEN-001` | `RKS-GEN-001` | `CSE-GEN-001` | `FPS-AI-001`  | `SSR-AI-001`  | AI Non-Authority & DEC-014 |
| **SMDI-DEM-001** | `PRD-GEN-001` | `MOD-DMO-20`  | `URPA-GEN-001` | `TISB-GEN-001` | `CTCM-GEN-001` | `TPA-GEN-001` | `DCR-GEN-001` | `VKR-GEN-001` | `RKS-GEN-001` | `CSE-ENV-001` | `FPS-DEM-001` | `SSR-DEM-001` | Demo / Trial Segregation |
| **SMDI-AUD-001** | `PRD-AUD-001` | `MSE-SYS-001` | `URPA-ROLE-006`| `TISB-SEC-001` | `CTCM-GEN-001` | `TPA-AUD-001` | `DCR-GEN-001` | `VKR-GEN-001` | `RKS-SEC-001` | `CSE-AUD-001` | `FPS-GEN-001` | `SSR-AUD-001` | Durable Inventory Audit |
| **SMDI-CON-001** | `PRD-NFR-001` | `MSE-SYS-001` | `URPA-TEN-001` | `TISB-SEC-001` | `CTCM-GEN-001` | `TPA-ROU-001` | `DCR-GEN-001` | `VKR-GEN-001` | `RKS-GEN-001` | `CSE-CON-001` | `FPS-GEN-001` | `SSR-CON-001` | Concurrency Invariants & Conflict Rejection |
| **SMDI-CON-002** | `PRD-GEN-001` | `MSE-SYS-001` | `URPA-GEN-001` | `TISB-GEN-001` | `CTCM-GEN-001` | `TPA-ROU-001` | `DCR-GEN-001` | `VKR-GEN-001` | `RKS-GEN-001` | `CSE-SAF-004` | `FPS-GEN-001` | `SSR-GEN-005` | Fail-Closed Denial Semantics |
| **SMDI-NFR-001 to 006**| `PRD-NFR-001`| `MSE-NFR-001`| `URPA-NFR-001` | `TISB-NFR-001` | `CTCM-NFR-001` | `TPA-NFR-001` | `DCR-NFR-001` | `VKR-NFR-001` | `RKS-NFR-001` | `CSE-NFR-001` | `FPS-NFR-001` | `SSR-NFR-001` | Non-Functional Architecture |
| **SMDI-ACC-001** | `PRD-GEN-001` | `MSE-SYS-001` | `URPA-CMD-001` | `TISB-ACC-001` | `CTCM-ACC-001` | `TPA-ACC-001` | `DCR-ACC-001` | `VKR-ACC-001` | `RKS-ACC-001` | `CSE-ACC-001` | `FPS-ACC-001` | `SSR-ACC-001` | Acceptance Criteria Gates |

---

## 43. ACCEPTANCE CRITERIA

- **SMDI-ACC-001 (SIM/M2M, Device & Inventory Acceptance Gates):**
  *(Note: `SMDI-ACC-001` serves as the authoritative umbrella meta-requirement establishing this Acceptance Criteria framework and its traceability row in Section 42, satisfied collectively by the 28 concrete acceptance gates below.)*
  1. *Physical vs Capability Decoupling Gate:* Physical inventory tracks serialized units without manufacturing DCR technical capability (`SMDI-GEN-001`).
  2. *Entity Separation Invariant Gate:* System strictly maintains $Tenant \neq Customer \neq Account \neq Owner \neq Driver$ and $Device \neq SIM \neq Vehicle$ and $SIM\ Carrier \neq Tracking\ Provider$ (`SMDI-GEN-002`).
  3. *Downstream Scope Containment Gate:* Specification defines inventory state handoffs without absorbing RMA repair pricing, media streaming, or billing ledgers (`SMDI-GEN-003`, `SMDI-RMA-001`).
  4. *Scale Architecture & NFR Gate:* Data models accommodate the authoritative 2,000,000 device scale design principle (`PRD-SCL-001`) with derived non-binding planning headroom for approximately 2,500,000 SIM records without mandating premature distributed queue or clustering infrastructure, satisfying non-functional requirements (`SMDI-GEN-004`, `SMDI-NFR-001`, `SMDI-NFR-002`, `SMDI-NFR-003`, `SMDI-NFR-004`, `SMDI-NFR-005`, `SMDI-NFR-006`).
  5. *Multi-Factor Entitlement Gate:* Inventory mutations enforce Platform $\land$ Tenant $\land$ Subscription $\land$ Role $\land$ Scope verification under strict URPA role permissions and MSE module boundaries (`SMDI-GEN-005`, `SMDI-IAM-001`, `SMDI-MSE-001`).
  6. *SIM Data Model Gate:* All M2M SIMs capture ICCID, MSISDN (masked), IMSI, carrier identity, form factor, and APN profile (`SMDI-SIM-001`).
  7. *Carrier Neutrality Gate:* SIM carrier does not dictate Tracking Provider routing; roaming and multi-IMSI profiles supported natively (`SMDI-SIM-002`).
  8. *SIM Lifecycle State Machine Gate:* Formal enforcement of 9 distinct SIM states (`RECEIVED` through `RETIRED`) with strict transition gating (`SMDI-SIM-003`).
  9. *Carrier Evidence & Regulatory Gate:* External carrier request states (`REQUESTED`, `PENDING_CONFIRMATION`) are decoupled from confirmed operational states with strict regulatory boundary verification (`SMDI-SIM-004`, `SMDI-REG-001`, `SMDI-REG-002`, `SMDI-REG-003`).
  10. *Physical Device Record Gate:* Trackers capture UUID, 15-digit Luhn IMEI, serial number, model code, procurement batch, and custody state (`SMDI-DEV-001`).
  11. *Device Lifecycle State Machine Gate:* Formal enforcement of 8 distinct device states (`RECEIVED` through `RETIRED_DECOMMISSIONED`) with invalid transition blocking (`SMDI-DEV-002`).
  12. *DCR Registry Subordination Gate:* Physical devices cannot enter `INSPECTED_AVAILABLE` without a verified match in the Device Capability Registry (`SMDI-DEV-003`).
  13. *VKR Compatibility Gate:* Operational assignment to a vehicle checks VKR compatibility rules; fail-closed on unknown voltage or relay requirements (`SMDI-DEV-004`).
  14. *Identifier Uniqueness & Formatting Gate:* IMEIs, ICCIDs, and E.164 MSISDNs maintain global uniqueness across all tenants; duplicate entries fail closed without overwriting existing data (`SMDI-ID-001`, `SMDI-ID-002`, `SMDI-ID-003`).
  15. *Identifier Correction Audit Gate:* Pre-deployment IMEI/Serial corrections require authorized audit requests; zero silent inline updates (`SMDI-ID-004`).
  16. *Device-to-SIM Binding & Cardinality Gate:* Hardware enforces launch baseline single active SIM binding (or DCR-profile-governed cardinality), a SIM is bound to at most one device at a time, conflicting active bindings fail closed, and complete historical bindings are retained (`SMDI-AST-001`).
  17. *Vehicle Assignment Isolation Gate:* Device unassignment from a vehicle leaves all historical trip and alert data sealed with the vehicle and tenant (`SMDI-AST-002`).
  18. *Stale Association Invalidation & Concurrency Gate:* Device custody transfer, SIM unbinding, or quarantine immediately revokes active telematics routing and cached command contexts under deterministic concurrency invariants (lost-update prevention, stale-write rejection) and fail-closed denial semantics (`SMDI-AST-003`, `SMDI-CON-001`, `SMDI-CON-002`).
  19. *Multi-Stage Provisioning Gate:* Devices advance through all 7 provisioning stages; operational status requires verified physical telemetry ingestion (`SMDI-PROV-001`, `SMDI-PROV-002`).
  20. *Authoritative Provider Routing & Demo Segregation Gate:* Ingestion routing configured in Integration Registry under TPA v1.0; fail-closed routing with zero default or demo fallback, maintaining complete isolation from demo stock (`SMDI-TRK-001`, `SMDI-DEM-001`).
  21. *Ownership vs Custody Gate:* System distinguishes legal ownership from physical custody; custody grants zero operational tracking or command rights (`SMDI-INV-001`).
  22. *Stock Location Nodes Gate:* Custody tracked across the 7 canonical baseline custody/location types (`CENTRAL_WAREHOUSE`, `TENANT_DEPOT`, `TECHNICIAN_VAN`, `DEALER_SHOWROOM`, `CUSTOMER_PREMISES`, `INSTALLED_VEHICLE`, `RMA_QUARANTINE`) with extensible architecture and strict separation between custody and operational tracking authority (`SMDI-INV-002`).
  23. *Audited Transfer & Durable Event Gate:* Inter-custody transfers enforce two-step dispatch and receipt confirmation with discrepancy alerts and durable immutable audit logging (`SMDI-INV-003`, `SMDI-AUD-001`).
  24. *Quarantine Protocol Gate:* Faulty hardware enters `QUARANTINED` status with immediate revocation of active command and tracking capabilities (`SMDI-INV-004`).
  25. *Multi-Tenant Data Perimeter Gate:* Inventory queries enforce mandatory tenant scoping; cross-tenant inventory access is barred and cross-tenant transfers enforce quarantine and telemetry isolation (`SMDI-TEN-001`, `SMDI-TEN-002`, `SMDI-TEN-003`).
  26. *Channel & Dealer Boundary Gate:* Dealer stock custody grants zero live map tracking, history viewing, or remote command execution authority (`SMDI-CHN-001`).
  27. *Sales & Support Boundary Gate:* Sales queries limited to aggregate stock; Support diagnostic inspection does not confer live map tracking or command dispatch rights (`SMDI-SAL-001`, `SMDI-SUP-001`).
  28. *Canonical Command, Privacy & AI Security Gate:* Canonical terms **`Engine Disable`** and **`Engine Restore`** strictly maintained; inventory status never confers command authority; PII/secrets protected and AI restricted from sensitive inventory mutations (`SMDI-SEC-001`, `SMDI-PRI-001`, `SMDI-AI-001`).

---

## 44. OPEN DECISIONS & DEFERRED ITEMS

The following open decisions from approved upstream Product Requirements Document v1.0 (`abef605`, Section 83) are carried forward as direct dependencies of this specification:

| Decision ID | Subject / Topic | Upstream Baseline Status | Inventory Specification Dependency / Why Carried |
| :--- | :--- | :--- | :--- |
| **DEC-001** | Final commercial product & brand name | TBD (EasyTracker is temporary working name only) | Carried as working name; brand name does not alter inventory data models. |
| **DEC-002** | Initial 3rd-party licensed VTS provider(s) | TBD (Candidate examples: GP IoT, Robi, Bondstein) | Accommodates multi-provider fail-closed routing without hardcoding specific provider platforms. |
| **DEC-003** | Initial production hardware device catalogue | TBD (S102A is pilot evidence; catalogue verified via DCR)| Models physical hardware instances generically without restricting platform to S102A. |
| **DEC-004** | Subscription package pricing & rate cards | TBD / Configurable per tenant and market policy | Enforces commercial entitlement separation; inventory availability != subscription pricing. |
| **DEC-005** | Support live-location grant exact duration | Configurable (Ticket-scoped, explicit grant, auto-expiry) | Preserves Support diagnostic scoping; inventory metadata != live tracking grant. |
| **DEC-006** | Emergency rescue field operating model | TBD / Configurable by tenant operational policy | Preserves emergency operational boundaries; inventory does not grant rescue dispatch authority. |
| **DEC-007** | Specialized fleet pack launch rollout order | TBD based on initial anchor customer demand | Accommodates vertical fleet packs without coupling hardware stock to launch sequencing. |
| **DEC-008** | Payment gateway provider selection | TBD / Integration candidate selection | Commercial payment selection deferred to billing; stock procurement billing deferred. |
| **DEC-009** | Telemetry raw data retention duration | TBD + Statutory legal/privacy verification required | Inventory audit logs retained durably; raw telematics retention deferred to privacy spec. |
| **DEC-014** | Production AI sensitive data class approval | Zero PII / live telemetry sent to free cloud AI models | Strictly blocks transmission of IMEIs, ICCIDs, and location data to unapproved cloud AI. |

---

## 45. BLOCKING QUESTIONS

> **Zero Blocking Questions.**  
The physical device inventory model, M2M SIM lifecycle, custody tracking nodes, identifier uniqueness rules, multi-stage provisioning gates, tracking provider routing boundaries, vehicle assignment isolation, and multi-tenant perimeters are fully specified based on approved upstream baselines (`PRODUCT_REQUIREMENTS.md` v1.0, `MODULE_SERVICE_ENTITLEMENT_SPEC.md` v1.0, `USER_ROLES_PERMISSIONS_ACCESS_SPEC.md` v1.0, `TENANT_ISOLATION_SECURITY_BOUNDARY_SPEC.md` v1.0, `CUSTOMER_TYPES_COMMERCIAL_MODEL_SPEC.md` v1.0, `TRACKING_PROVIDER_ARCHITECTURE_SPEC.md` v1.0, `DEVICE_CAPABILITY_REGISTRY_SPEC.md` v1.0, `VEHICLE_KNOWLEDGE_REGISTRY_SPEC.md` v1.0, `REGULATORY_KNOWLEDGE_SERVICE_SPEC.md` v1.0, `COMMAND_SAFETY_EXECUTION_SPEC.md` v1.0, `FLEET_PACK_SPEC.md` v1.0, and `SALES_SUPPORT_RESCUE_SPEC.md` v1.0). Strategic open items—including `DEC-002`, `DEC-003`, and `DEC-014`—are intentional upstream decisions safely accommodated by the modular, decoupled architecture.

---

## 46. SPECIFICATION VERDICT

> # **SIM/M2M, DEVICE & INVENTORY APPROVED v1.0 — AUTHORITATIVE BASELINE**

This authoritative downstream specification strictly adheres to approved Product Requirements Document v1.0 (`abef605`), Module & Service Entitlement Specification v1.0 (`a962a2a`), User Roles, Permissions, Authority & Access Specification v1.0 (`25e7834`), Tenant Isolation & Security Boundary Specification v1.0 (`93d7a4e`), Customer Types & Commercial Model Specification v1.0 (`4014141`), Tracking Provider Architecture Specification v1.0 (`88bcd53`), Device Capability Registry Specification v1.0 (`5c9fe52`), Vehicle Knowledge Registry Specification v1.0 (`0e60ce3`), Regulatory Knowledge Service Specification v1.0 (`d26153b`), Command Safety & Execution Specification v1.0 (`ebccd29`), Fleet Pack Specification v1.0 (`220ac0d`), and Sales, Support & Rescue Operations Specification v1.0 (`97cd070`), establishes the authoritative architectural and operational framework for physical tracking device inventory, M2M SIM lifecycle, stock custody nodes, warehouse location management, identifier integrity, multi-stage provisioning, device-to-SIM binding, vehicle operational assignment, tracking provider routing boundaries, multi-tenant perimeters, and downstream service/warranty/RMA handoffs, preserves all upstream safety, IAM, tenant, provider, and commercial invariants, and stands formally approved as an authoritative downstream specification baseline.
