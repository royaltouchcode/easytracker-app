# Service, Warranty & RMA Operations Specification

## 1. DOCUMENT CONTROL

- **File Path:** `docs/03_specs/SERVICE_WARRANTY_RMA_SPEC.md`
- **Document Title:** Service, Warranty & RMA Operations Specification
- **Status:** APPROVED
- **Version:** 1.0
- **Date:** 2026-09-16
- **Project:** Vehicle Tracking Standalone Launch
- **Product Brand:** TBD (EasyTracker is temporary working name only)
- **Authority:** APPROVED DOWNSTREAM SPECIFICATION
- **Authoritative Upstream Dependencies:**
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
  13. `docs/03_specs/SIM_M2M_DEVICE_INVENTORY_SPEC.md` v1.0 (Commit `4542f84`)
- **Upstream Commits:** `abef605`, `a962a2a`, `25e7834`, `93d7a4e`, `4014141`, `88bcd53`, `5c9fe52`, `0e60ce3`, `d26153b`, `ebccd29`, `220ac0d`, `97cd070`, `4542f84`

---

## 2. EXECUTIVE SUMMARY & PURPOSE

- **SWR-GEN-001 (Core Domain Purpose):**
  - This specification establishes the authoritative operational, lifecycle, and architectural framework for Field Service Management, Installation Work Orders, Warranty Tracking and Dual-Date Validation, Serialized Return Merchandise Authorization (RMA), Vehicle Hardware Replacement Mapping, Dynamic Capability Recalculation, Stock Custody during Service, Workshop Bench Diagnostics, Return-to-Service Clearance, and Equipment Decommissioning for the Vehicle Tracking Standalone Launch.
  - Subordinated to the approved Product Requirements Document (`PRD-INS-001`, `PRD-WAR-001`, `PRD-RMA-001`, `PRD-DEV-002`, `PRD-SCL-001`), Module & Service Entitlement Specification (`MOD-INV-16`, `MSE-INV-001`, `MSE-REP-001`), User Roles, Permissions & Access Specification (`URPA-ROLE-011`, `URPA-TECH-001`), and SIM/M2M Device Inventory Specification (`SMDI-RMA-001`), this specification establishes:
    1. A deterministic Work Order and Field Service lifecycle supporting both Doorstep Service and Authorized Service Center Networks with geo-location and skill-profile technician dispatching.
    2. Comprehensive pre-installation vehicle electrical inspection checklists and post-installation wiring, ignition sensing, and activation handshake verification.
    3. A serialized 6-milestone RMA state machine (`FAULT_REPORTED` ➔ `TECHNICIAN_INSPECTED` ➔ `RETURNED_TO_WAREHOUSE` ➔ `SUPPLIER_RMA_DISPATCHED` ➔ `REPAIRED / REPLACED` ➔ `RESTOCKED / SCRAPPED`) in strict fidelity to `PRD-RMA-001` with zero unauthorized bypass branches.
    4. Dual-date warranty coverage tracking from supplier purchase date and customer activation date with automated status evaluation.
    5. Robust hardware replacement mapping re-anchoring replacement device IMEIs to vehicles while preserving historical telematics, trips, alarms, and maintenance records intact.
    6. Automatic dynamic capability recalculation triggered via the Device Capability Registry upon hardware swap.
    7. Strict chain of custody across technician vehicles, service centers, quarantine depots, and external supplier transit nodes without conferring unauthorized operational tracking or command authority.

---

## 3. ARCHITECTURAL PRINCIPLES

- **SWR-GEN-003 (Fail-Closed Default):**
  - The service, warranty, and RMA engine fails closed under all error or ambiguous conditions:
    - Unverified Vehicle Compatibility $\rightarrow$ Work order held; physical installation blocked.
    - Unverified Replacement Device Model $\rightarrow$ Hardware swap blocked until validated against DCR.
    - Expired or Unmatched Work Order Scope $\rightarrow$ Technician diagnostic access immediately revoked.
    - Missing or Unconfirmed Activation Handshake $\rightarrow$ Work order cannot transition to completed.
    - Conflicting Warranty Evidence $\rightarrow$ Flagged for manual commercial review; never silently granted.

- **SWR-GEN-004 (Implementation Neutrality):**
  - All entities, workflows, state models, and interfaces defined in this specification are platform- and database-neutral.
  - The specification prescribes logical invariants, state transitions, security perimeters, and audit requirements without prescribing specific SQL/NoSQL engines, ORM frameworks, message broker implementations, or cloud provider services.

---

## 4. SCOPE BOUNDARIES

### 4.1 In Scope
- **Fault Triage & Intake:** Handoff from Customer Support (`SSR-SUP-003`) and Customer Self-Service into formal Service Requests and Work Orders.
- **Service Request & Work Order Lifecycle:** Intake, booking, scheduling, dispatch, pre-installation inspection, wiring validation, activation handshake, completion, failure, and cancellation.
- **Service Delivery Channels:** Doorstep mobile technician service and Authorized Service Center Network (`PRD-INS-001`).
- **Technician Scoped Access:** Time-bound, job-scoped diagnostic access bounded strictly by `WORK_ORDER_SCOPE` (`URPA-TECH-001`).
- **Serialized RMA Workflow:** Complete serialized state machine implementing `PRD-RMA-001` milestones and operational branching.
- **Dual-Date Warranty Tracking:** Capturing supplier purchase date and customer activation date, and executing automated status classification (`PRD-WAR-001`).
- **Hardware Replacement & History Continuity:** Remapping replacement IMEIs to vehicles while preserving historical telematics and triggering dynamic capability recalculation (`PRD-DEV-002`, `MSE-REP-001`).
- **Service Custody Management:** Physical custody tracking across `TECHNICIAN_VAN`, `RMA_QUARANTINE`, and external transit node `SUPPLIER_REPAIR_DEPOT` (`SMDI` Matrix 4).
- **Bench Diagnostics & Return to Service:** Failure diagnostic procedures, quarantine clearance to `INSPECTED_AVAILABLE`, and asset scrap to `RETIRED_DECOMMISSIONED` (`SMDI` Matrix 3).
- **Spare Parts & Warranty Ledgers:** Serialized component tracking and warranty event logs under `MOD-INV-16` (`MSE-INV-001`).

### 4.2 Out of Scope
- **Hardware Capability Definition:** Technical device parameters, protocol syntax, and sensor specs are governed exclusively by `DEVICE_CAPABILITY_REGISTRY_SPEC.md` (`5c9fe52`).
- **Vehicle Electrical Compatibility Definition:** Vehicle electrical architectures, fuse ratings, and relay wiring compatibility are governed exclusively by `VEHICLE_KNOWLEDGE_REGISTRY_SPEC.md` (`0e60ce3`).
- **Telecom Carrier Contracting & APN Architecture:** SIM procurement, carrier data pooling, APN topologies, and MSISDN routing are governed exclusively by `SIM_M2M_DEVICE_INVENTORY_SPEC.md` (`4542f84`).
- **Tracking Provider Ingestion Protocols:** Telematics packet decoding, socket management, and parser adapters are governed exclusively by `TRACKING_PROVIDER_ARCHITECTURE_SPEC.md` (`88bcd53`).
- **Actuator Command Safety Authority:** Actuator command authorization and safe-state verification are governed exclusively by `COMMAND_SAFETY_EXECUTION_SPEC.md` (`ebccd29`).
- **Multi-Tenant Security Perimeters:** Tenant data boundaries and cross-tenant isolation enforcement are governed exclusively by `TENANT_ISOLATION_SECURITY_BOUNDARY_SPEC.md` (`93d7a4e`).

### 4.3 Deferred to Downstream Specifications
- **Billing, Invoicing & Labor Pricing:** Invoicing mechanics, labor rates, customer repair fee schedules, and payment processing are deferred to the downstream **Billing & Metering Specification**.
- **External Supplier & Logistics APIs:** Automated REST/SOAP/EDI integrations with supplier RMA portals, carrier webhooks, and courier tracking APIs are deferred to the downstream **Integration Registry / API Sync Specification**.
- **Specialized Media Hardware Bench Testing:** Acoustic microphone calibration and dashcam optical bench diagnostics are deferred to the downstream **Media Voice/Video Specification**.
- **Diagnostic Telemetry Retention & Archival:** Raw diagnostic packet retention limits, purge cadences, and customer offboarding data sanitization are deferred to the downstream **Privacy, Data Retention & Offboarding Specification** (`DEC-009`).
- **AI Automated Diagnostic Assistants:** Machine learning triage models and automated root-cause recommendation engines are deferred to the downstream **AI Orchestration & Guardrails Specification**.
- **Concrete Database Schemas & REST APIs:** Physical relational tables, DDL migrations, REST payload schemas, and event bus topics are deferred to downstream **Data Architecture** and **API Contract Specifications**.

---

## 5. TERMINOLOGY & CORE ENTITY SEPARATION

- **SWR-GEN-002 (Core Entity Separation):**
  - The platform strictly enforces explicit separation of architectural entities across all operational workflows:
    1. *Service Request $\neq$ Support Ticket:* A Support Ticket (`MOD-SUP-13`) represents a customer inquiry or technical support diagnostic interaction; a Service Request represents a formal request for physical service, installation, inspection, or repair.
    2. *Work Order $\neq$ RMA Case:* A Work Order represents an assigned operational field or workshop task executed by a technician; an RMA Case represents the serialized lifecycle and commercial custody tracking of a physical hardware unit.
    3. *RMA Case $\neq$ Warranty Determination:* An RMA Case tracks hardware return logistics and physical disposition; Warranty Determination is the technical/contractual evaluation of whether repair or replacement costs are covered.
    4. *Warranty Determination $\neq$ Commercial Charge:* Warranty Determination establishes coverage eligibility; Commercial Charge is the financial invoicing transaction deferred to Billing.
    5. *Physical Device $\neq$ SIM:* Physical telematics hardware (identified by IMEI) is an independent serialized entity from cellular subscriber identity hardware (identified by ICCID).
    6. *Device $\neq$ Vehicle:* A telematics device is a swappable peripheral hardware component; a vehicle is an enduring asset and operational anchor.
    7. *Device Replacement $\neq$ Vehicle Replacement:* Replacing a faulty hardware unit remaps a peripheral identity without altering vehicle identity, registration, ownership, or historical telemetry.
    8. *Technician $\neq$ Driver:* A Technician (`URPA-ROLE-011`) performs installation, diagnostics, and repairs within `WORK_ORDER_SCOPE`; a Driver operates a vehicle and views fleet navigation without service authority.
    9. *Physical Custody $\neq$ Operational Tracking Authority:* Holding physical custody of a device in a van or workshop confers zero operational tracking authority and zero live map location visibility.
    10. *Repair Custody $\neq$ Tenant Ownership:* Physical custody within a repair depot or technician kit does not alter tenant asset ownership or cross-tenant data boundaries.
    11. *Dealer $\neq$ Technician:* A Dealer (`DEALER_CHANNEL`) is a commercial reseller; a Technician is an accredited installer with job-scoped diagnostic permissions.
    12. *Dealer $\neq$ Tenant Operational User:* A Dealer possesses commercial lead visibility but zero tenant fleet operational management authority.
    13. *Customer $\neq$ Tenant:* A Customer is an individual or corporate subscriber; a Tenant is an isolated SaaS organizational boundary.
    14. *Tracking Provider $\neq$ SIM Carrier:* A Tracking Provider is a telematics ingestion service (`TPA`); a SIM Carrier is a cellular network operator (`SMDI`).

---

## 6. CUSTOMER SUPPORT TRIAGE & SERVICE INTAKE HANDOFF

- **SWR-SVC-001 (Support Triage Handoff Boundary):**
  - Customer reported hardware malfunctions, offline communication drops, and device sensor errors originate within Customer Support (`MOD-SUP-13`) governed by `SALES_SUPPORT_RESCUE_SPEC.md` (`SSR-SUP-003`).
  - Technical Support personnel (`URPA-ROLE-010`) conducting protocol investigations within `SUPPORT_TICKET_SCOPE` may inspect diagnostic parameters (configured APN, SIM ICCID, cellular carrier, hardware revision, battery voltage, signal quality, firmware version, and device heartbeat timestamps).
  - In accordance with `SSR-SUP-003` and `DEC-005`, diagnostic inspection does NOT grant live map location tracking or operational fleet tracking.
  - When Support determines that remote configuration (`commands.apn_config.request`) or diagnostic reboot (`commands.reboot.request`) cannot resolve the physical defect, Support initiates formal escalation by creating a downstream Service Request.
  - Support agents have zero authority to approve commercial warranty liability, issue customer credit refunds, or execute hardware asset write-offs.

- **SWR-SVC-002 (Support Managed Mode Alignment):**
  - In strict compliance with `MODULE_SERVICE_ENTITLEMENT_SPEC.md` (`MSE-MOD-001`), the Support $\rightarrow$ Service intake handoff operates within the tenant's configured service mode:
    - `DISABLED`: In-house support disabled; customer directly engages designated third-party service provider.
    - `TENANT_MANAGED`: Tenant internal support agents manage triage and dispatch internal technician work orders.
    - `SAAS_MANAGED`: Platform SaaS central support conducts diagnostic triage and schedules authorized network field technicians.
    - `HYBRID`: First-line triage managed by tenant staff; escalated hardware RMA and supplier dispatch handled by SaaS platform operations.
---

## 7. SERVICE REQUEST & WORK ORDER DOMAIN MODEL

- **SWR-WO-001 (Service Request & Work Order Structure):**
  - The service operations model decouples customer intake from physical technician execution:
    1. *Service Request:* Captures customer intent, reported fault symptoms, desired service channel, customer scheduling preferences, and target vehicle identifier. A Service Request may result in zero, one, or multiple operational Work Orders (e.g. initial diagnostic visit followed by parts replacement visit).
    2. *Work Order:* The atomic operational execution unit assigned to an accredited technician (`URPA-ROLE-011`). A Work Order encapsulates: `work_order_id`, `service_request_id`, tenant association and scoping boundary, `vehicle_id`, `assigned_technician_id`, `service_channel`, `scheduled_window_start`, `scheduled_window_end`, `status`, `pre_inspection_checklist_id`, `installed_device_imei`, `removed_device_imei`, `activation_handshake_status`, and `audit_log_id`.

- **SWR-WO-002 (Work Order Lifecycle State Machine):**
  - Work orders progress through a deterministic, auditable state lifecycle:
    $$\text{DRAFT} \longrightarrow \text{SCHEDULED} \longrightarrow \text{DISPATCHED} \longrightarrow \text{IN\_PROGRESS} \longrightarrow \text{COMPLETED}$$
    $$\text{IN\_PROGRESS} \longrightarrow \text{FAILED} \quad | \quad \text{SCHEDULED} / \text{DISPATCHED} \longrightarrow \text{CANCELLED}$$
  - *State Transition Invariants:*
    - `DRAFT`: Order created and populated with vehicle and task requirements; no technician assigned.
    - `SCHEDULED`: Accredited technician assigned; time window committed.
    - `DISPATCHED`: Technician en route; physical inventory kit issued.
    - `IN_PROGRESS`: Technician arrived on-site; pre-inspection checklist initiated; `WORK_ORDER_SCOPE` activated.
    - `COMPLETED`: Physical wiring verified, activation handshake confirmed, vehicle checklist signed off; `WORK_ORDER_SCOPE` auto-revoked.
    - `FAILED`: Wiring incompatibility, vehicle electrical fault, or hardware handshake failure; unit quarantined; work order closed with failure code.
    - `CANCELLED`: Customer or operational cancellation before physical commencement.

---

## 8. FIELD INSTALLATION & SERVICE CHANNELS

- **SWR-INS-001 (Service Delivery Channels):**
  - In accordance with `PRODUCT_REQUIREMENTS.md` (`PRD-INS-001`), the platform supports two primary operational service channels:
    1. *Doorstep Mobile Service:* Mobile installer dispatches to customer residential premises, commercial depot, or roadside location via mobile service vehicle (`TECHNICIAN_VAN` custody node).
    2. *Authorized Service Center Network:* Vehicle is presented at a certified brick-and-mortar installation workshop or partner repair depot (`TENANT_DEPOT` / `CENTRAL_WAREHOUSE` custody node).
  - Both channels execute identical technical verification, safety policies, checklist captures, and activation protocols.

- **SWR-INS-002 (Geo-Location & Skill-Profile Technician Dispatch):**
  - In accordance with `PRD-INS-001`, work order dispatching evaluates two mandatory technical criteria:
    1. *Technician Skill Profile:* Matching technician technical accreditation against required task complexity (e.g. standard 2-wire battery installation vs 4-wire relay immobilization vs complex CAN bus / fuel sensor integration). Task assignment fails closed if technician lacks verified certification for the required vehicle class or device complexity.
    2. *Geo-Location Proximity:* Matching assigned technician territory or active service van location to the target job site.
  - *Implementation Neutrality:* The system enforces the data constraints of skill and geo matching without mandating proprietary dispatch optimization algorithms or fixed scheduling SLA contracts.

---

## 9. PRE-INSTALLATION VEHICLE INSPECTION & VEHICLE INTEGRITY

- **SWR-INS-003 (Pre-Installation Inspection Checklist):**
  - In accordance with `PRD-INS-001` and `VEHICLE_KNOWLEDGE_REGISTRY_SPEC.md` (`VKR-ELC-001`), prior to physically tapping vehicle wiring or mounting hardware, the technician must execute and log a mandatory pre-installation checklist:
    1. *Vehicle Electrical Health:* Battery terminal voltage measurement and electrical suitability must be verified against the applicable authoritative VKR vehicle electrical profile (`VKR-ELC-001`) and verified device operating voltage range (`DCR-CAP-001`). SWR independently prescribes zero hardcoded numeric voltage cutoff thresholds.
    2. *Ignition & Electrical Class Match:* Confirmation that vehicle electrical class matches the approved profile from VKR (`12V_PASSENGER`, `24V_COMMERCIAL`, or multi-battery system).
    3. *Dashboard & Warning Indicator Status:* Check for existing Check-Engine, ABS, or electrical warning lamps prior to EasyTracker intervention.
    4. *Physical Harness Condition:* Inspection of OEM wiring harness for prior splicing, damage, or moisture ingress.
  - Inspection results must be durably recorded. If the vehicle exhibits critical electrical faults or class mismatches, physical installation MUST NOT proceed.

- **SWR-INS-004 (Hardware Wiring & Safety Verification):**
  - Technician wiring execution must adhere strictly to verified vehicle wiring diagrams provided by VKR (`VKR-ELC-001`) and device capabilities (`DCR-CAP-001`):
    1. *Power & Chassis Ground:* Permanent unswitched power connection fused according to device capability specifications (`DCR-CAP-001`).
    2. *Ignition Sensing Verification:* Switched ACC ignition wire verified across key states only where the verified device capability profile (`DCR-CAP-001`) and vehicle electrical profile (`VKR-ELC-001`) require physical ACC sensing. For devices or vehicles utilizing virtual ignition, OBD-II plug-and-play, or 2-wire battery sensing, verification validates the corresponding profile-authorized ignition mechanism.
    3. *Relay Actuator Wiring:* If vehicle profile authorizes engine immobilization (`MOD-CMD-05`), relay must be wired into approved starter or fuel circuit strictly per VKR guidelines (`VKR-CMD-001`). Splicing into unauthorized ignition or steering lines is strictly prohibited.
    4. *Physical Mounting:* Device must be securely affixed behind dashboard or within approved enclosure with GNSS antenna orientation unobstructed by metallic bulkheads.

---

## 10. HARDWARE WIRING, IGNITION SENSING & ACTIVATION HANDSHAKE VERIFICATION

- **SWR-INS-005 (Activation Handshake & Operational Verification):**
  - Following physical installation, the technician must verify end-to-end device communication and sensor telemetry prior to job sign-off:
    1. *Cellular Network Registration:* Confirmation that device has attached to cellular carrier and established IP data connection via Tracking Provider Gateway (`SMDI-TRK-001`, `TPA-DEV-001`, `TPA-MAP-001`).
    2. *GNSS Fix Acquisition:* Confirmation that device reports valid 3D GPS fix with acceptable satellite count and HDOP under test conditions.
    3. *Ignition Telemetry Verification:* Verification that vehicle ignition state transitions produce corresponding state changes in the diagnostic telemetry stream within the active work order console, evaluated consistently with the device's verified ignition sensing method (`DCR-CAP-001`).
    4. *Tamper / Power Cut Alert Verification:* Testing internal backup battery switchover and power disconnect detection.
  - Work order completion is blocked until the activation handshake is authoritatively confirmed by the backend telematics ingestion service. A technician cannot manually override a failed activation handshake.

---

## 11. SERIALIZED RMA DOMAIN MODEL & CORE ENTITIES

- **SWR-RMA-001 (Serialized RMA Core Entities):**
  - The Return Merchandise Authorization (RMA) framework tracks individual physical hardware items across their failure, inspection, supplier repair, and restocking lifecycle:
    1. *RMA Case:* Encapsulates: `rma_case_id`, tenant association and scoping boundary, `device_id`, `imei`, `serial_number`, `reported_defect_code`, `intake_source` (Support Ticket / Technician Field / Customer Return), `current_milestone`, `warranty_status_id`, `custody_node_id`, `disposition_result`, and `closure_timestamp`.
    2. *RMA Item:* The serialized physical device record tracking hardware revisions, bound SIM details, and diagnostic log references.
    3. *RMA Inspection Report:* Detailed technical report capturing bench diagnostic observations, physical damage flags, tamper seal integrity, and test log artifacts.
    4. *Supplier Claim Reference:* External B2B supplier RMA authorization number, tracking manufacturer repair turnaround and replacement dispatch.

---

## 12. SERIALIZED RMA LIFECYCLE STATE MACHINE

- **SWR-RMA-002 (Six Canonical RMA Milestones & Strict Milestone Fidelity):**
  - In strict compliance with `PRODUCT_REQUIREMENTS.md` (`PRD-RMA-001`), the platform supports the serialized RMA workflow comprising the mandatory sequential milestones:
    $$\text{FAULT\_REPORTED} \longrightarrow \text{TECHNICIAN\_INSPECTED} \longrightarrow \text{RETURNED\_TO\_WAREHOUSE} \longrightarrow \text{SUPPLIER\_RMA\_DISPATCHED} \longrightarrow \text{REPAIRED / REPLACED} \longrightarrow \text{RESTOCKED / SCRAPPED}$$
  - *Milestone Lifecycle Invariants & Intake Channel Rules:*
    - `FAULT_REPORTED`: Initiated via Support escalation, customer ticket, or automated telemetry health alert. Device transitions to `QUARANTINED` in inventory (`SMDI` Matrix 3).
    - `TECHNICIAN_INSPECTED`: Mandatory physical inspection milestone. Defective hardware is inspected by an accredited technician. For field dispatches, an on-site technician inspects the device on the vehicle; for direct depot drop-off or courier delivery (which operates as an intake channel, NOT permission to skip inspection), inspection is performed by an accredited depot technician upon arrival. In all cases, `TECHNICIAN_INSPECTED` must be affirmatively completed and logged before the unit advances.
    - `RETURNED_TO_WAREHOUSE`: Unit is formally received into warehouse inventory custody at the central depot or repair hub and enters `RMA_QUARANTINE` custody. Deep bench testing and physical defect logging are completed.
    - `SUPPLIER_RMA_DISPATCHED`: In strict adherence to `PRD-RMA-001`, serialized units in the RMA lifecycle are dispatched to the manufacturer repair depot (`SUPPLIER_REPAIR_DEPOT` custody). SWR establishes zero unapproved normative bypass branches that skip supplier dispatch.
    - `REPAIRED / REPLACED`: Unit disposition returned from supplier as repaired original hardware or swapped with replacement serialized hardware unit.
    - `RESTOCKED / SCRAPPED`: Terminal milestone. Conforming units clearing quality control return to available stock (`INSPECTED_AVAILABLE`); non-repairable units transition to platform retirement (`RETIRED_DECOMMISSIONED`).
---

## 13. HARDWARE WARRANTY COVERAGE & DUAL-DATE EVALUATION

- **SWR-WAR-001 (Dual-Date Warranty Tracking):**
  - In strict compliance with `PRODUCT_REQUIREMENTS.md` (`PRD-WAR-001`), the platform must track two distinct hardware warranty coverage timelines for every physical device record:
    1. *Supplier Purchase Date Timeline ($T_{supp}$):* The authoritative invoice/receipt date when the device was procured by the platform or tenant from the OEM hardware supplier. Governs the platform's or tenant's legal right to claim manufacturer repair or replacement under supplier contract.
    2. *Customer Activation Date Timeline ($T_{act}$):* The authoritative timestamp when the device was first paired to a customer subscription and completed its initial verified telemetry handshake. Governs the customer's warranty coverage entitlement under commercial subscription terms.
  - Both timestamps are recorded durably in the serialized device inventory ledger (`MOD-INV-16`, `MSE-INV-001`). Neither timestamp may be overwritten upon subsequent ownership transfer or hardware replacement.

- **SWR-WAR-002 (Automated Warranty Status Evaluation):**
  - In accordance with `PRD-WAR-001`, when an RMA case or service request is created, the warranty evaluation engine executes an automated verification against active coverage rules:
    - If $\text{Now} \le T_{act} + D_{cust\_warranty}$, unit is categorized as `IN_WARRANTY` (Customer).
    - If $\text{Now} > T_{act} + D_{cust\_warranty}$, unit is categorized as `OUT_OF_WARRANTY` (Customer).
    - Concurrently, if $\text{Now} \le T_{supp} + D_{supp\_warranty}$, unit is categorized as `IN_WARRANTY` (Supplier).
  - Physical inspection evidence may override automated status:
    - `CUSTOMER_DAMAGED`: Tamper seal broken, liquid submersion, reverse polarity burnout, or external casing physical destruction detected during inspection.
    - `VOIDED`: Unauthorized firmware flashing, third-party component modification, or non-certified vehicle installation detected.

- **SWR-WAR-003 (Unresolved Commercial Warranty Durations & Policies):**
  - *Explicit Commercial Non-Invention:* Specific warranty durations (e.g. 12 months vs 24 months vs lifetime subscription warranty) and customer damage liability rules are commercial decisions governed by open decisions `DEC-003` (Device Catalogue & Vendor Selection) and `DEC-004` (Subscription Pricing).
  - The SWR specification establishes the structural schema, calculation hooks, and evidence requirements; specific duration constants, deductible thresholds, and replacement fees remain configurable system parameters and are NEVER hard-coded as technical invariants.

---

## 14. FIELD AND WORKSHOP HARDWARE SWAP PROTOCOL

- **SWR-SWP-001 (Safe Hardware Swap Execution):**
  - When field or workshop diagnostics establish that an installed tracker has failed, the technician executes the hardware swap protocol:
    1. *Safe Power Disconnect:* De-energize harness before unmounting hardware; prevent short circuits.
    2. *SIM Extraction / Retention Evaluation:* Determine whether the existing SIM remains functional and carrier-active (`SMDI-SIM-003`). If functional, the SIM is extracted from the defective unit for insertion into the replacement unit; if defective, a replacement SIM is issued under SMDI provisioning rules.
    3. *Defective Unit Quarantine:* Defective unit IMEI is immediately set to `QUARANTINED` status and placed in `TECHNICIAN_VAN` or `RMA_QUARANTINE` custody (`SMDI` Matrix 3, Matrix 4).
    4. *Replacement Unit Allocation:* A pre-inspected replacement unit in `INSPECTED_AVAILABLE` status is allocated from technician stock and scanned via mobile barcode/QR reader (`SMDI-NFR-005`).

---

## 15. DEVICE REPLACEMENT MAPPING & VEHICLE HISTORY CONTINUITY

- **SWR-RPL-001 (Vehicle Replacement Mapping Invariant):**
  - In strict compliance with `PRODUCT_REQUIREMENTS.md` (`PRD-DEV-002`) and `MSE-REP-001`, when replacing a faulty tracker under warranty or RMA, the system MUST remap the replacement device identity to the vehicle while maintaining logical continuity of the vehicle's historical trips, maintenance records, and event logs.
  - The vehicle entity is the durable operational and reporting anchor; the telematics device is an interchangeable peripheral hardware component. Replacing hardware must NEVER create a new vehicle entity, erase historical vehicle trips, or fragment fleet mileage reporting.

- **SWR-RPL-002 (Non-Overlapping Device Association & Provenance Invariant):**
  - To ensure audit integrity and prevent historical sensor misattribution, the system enforces strictly non-overlapping temporal association boundaries:
    - The removed device $\text{IMEI}_{old}$ is associated with the vehicle for the historical time interval $[T_{initial}, T_{swap})$. For as long as any trip, telemetry, or event record from that interval is retained under applicable retention policy, the record immutably preserves the device association and provenance effective when it was generated ($\text{IMEI}_{old}$).
    - The replacement device $\text{IMEI}_{new}$ becomes associated with the vehicle for the subsequent interval $[T_{swap}, T_{end}]$ (where $T_{end}$ marks subsequent de-installation or retirement). Telemetry ingested at or after $T_{swap}$ references $\text{IMEI}_{new}$.
    - Each retained event resolves to exactly one authoritative device association for its effective event timestamp. Under zero circumstances may historical telemetry generated by $\text{IMEI}_{old}$ be rewritten or retroactively assigned to $\text{IMEI}_{new}$.
    - History continuity governs device association and provenance only; SWR does NOT prescribe raw data retention durations or permanent retention policies (`DEC-009`).

---

## 16. DYNAMIC CAPABILITY RECALCULATION INTEGRATION

- **SWR-DCR-001 (Mandatory DCR Capability Recalculation):**
  - In strict compliance with `MODULE_SERVICE_ENTITLEMENT_SPEC.md` (`MSE-REP-001`), when a tracker is replaced under warranty/RMA, commercial subscriptions remain active, but device-dependent capabilities MUST be re-evaluated immediately against the new device's verified hardware profile from the Device Capability Registry (`DCR-MDL-001`).
  - *Recalculation Rules:*
    1. If $\text{Model}_{new} == \text{Model}_{old}$, capabilities remain identical and verified.
    2. If $\text{Model}_{new}$ lacks an actuator or sensor present in $\text{Model}_{old}$ (e.g. replacement unit lacks relay output or fuel sensor input), the dependent capability (e.g. `MOD-CMD-05` Remote Engine Immobilizer) is dynamically deactivated for that vehicle, and an informative system notification is generated.
    3. Under no circumstances may a replacement device inherit capabilities that are not authoritatively verified in its own DCR profile.

---

## 17. VEHICLE KNOWLEDGE REGISTRY COMPATIBILITY BOUNDARY

- **SWR-VKR-001 (Vehicle Compatibility Subordination):**
  - Physical replacement hardware assignment must validate vehicle electrical and installation compatibility against the Vehicle Knowledge Registry (`VEHICLE_KNOWLEDGE_REGISTRY_SPEC.md`, `0e60ce3`).
  - *Compatibility Verification Gates:*
    1. *Electrical Class Compatibility:* Replacement unit operating voltage range must match vehicle electrical class (`VKR-ELC-001`). Installing a 12V-only tracker into a 24V commercial vehicle is blocked fail-closed.
    2. *Actuator Compatibility:* If the vehicle profile requires engine immobilization, the replacement unit's relay specifications must match the approved vehicle circuit guidelines (`VKR-CMD-001`, `VKR-CMP-001`).
    3. *Unknown Compatibility Handling:* If the vehicle model or replacement tracker pairing is marked `UNKNOWN` or `UNVERIFIED` in VKR, automated pairing is blocked until certified override evidence is provided by an accredited technical admin.

---

## 18. TRACKING PROVIDER ROUTING RE-ASSOCIATION BOUNDARY

- **SWR-TPA-001 (Provider Gateway Route Re-association & Fail-Closed Routing):**
  - In strict compliance with `TRACKING_PROVIDER_ARCHITECTURE_SPEC.md` (`88bcd53`, `TPA-DEV-001`, `TPA-MAP-001`, `TPA-MAP-002`, `TPA-PRV-001`, `TPA-DMO-001`):
    1. *Authoritative Route Re-binding:* Upon committing a replacement hardware mapping, the authoritative Device-to-Provider routing association must be updated consistently with the replacement device identity (`TPA-MAP-001`), while routing for the replaced unit fails closed or terminates (`TPA-MAP-002`).
    2. *Fail-Closed Routing Invariant:* If no verified provider route exists for the replacement device, routing MUST fail closed immediately; the replacement device CANNOT enter `ACTIVE_OPERATIONAL` status (`TPA-MAP-002`, `SMDI-CON-002`).
    3. *Zero Unverified Fallback:* Gateway routing must NEVER fall back to a first-available provider, default provider, or Demo provider (`TPA-DMO-001`).
---

## 19. SIM/M2M LIFECYCLE PRESERVATION & RE-ASSOCIATION BOUNDARY

- **SWR-SIM-001 (SIM Association Invariants during Replacement):**
  - In strict compliance with `SIM_M2M_DEVICE_INVENTORY_SPEC.md` (`4542f84`, `SMDI-AST-001`, `SMDI-AST-002`):
    1. *SIM Re-use / Re-binding:* If an active, functional SIM is transferred from a defective device to a replacement device, the binding transition must execute atomically: unbind SIM from $\text{IMEI}_{old}$, update SIM record status to `BOUND` with $\text{IMEI}_{new}$, and update provider routing table accordingly (`SMDI-AST-001`).
    2. *SIM Replacement:* If the SIM itself is damaged or non-functional, a replacement SIM is paired to $\text{IMEI}_{new}$ under standard SMDI provisioning rules, and the defective SIM transitions to `DEACTIVATED` or `RETIRED` (`SMDI-SIM-003`).
    3. *Zero Redefinition:* SWR consumes SMDI state transitions and cardinality rules ($1:1$ binding) without redefining cellular carrier lifecycle, APN provisioning, or MSISDN handling.

---

## 20. STOCK CUSTODY NODES & SERVICE CUSTODY EXTENSIONS

- **SWR-CUS-001 (Baseline Custody Taxonomy Compliance):**
  - In strict compliance with `SIM_M2M_DEVICE_INVENTORY_SPEC.md` Matrix 4, service operations utilize approved platform custody nodes:
    - `CENTRAL_WAREHOUSE`: Main company depot; bulk intake, staging, deep bench diagnostics.
    - `TENANT_DEPOT`: Regional enterprise fleet maintenance facility.
    - `TECHNICIAN_VAN`: Mobile technician service vehicle; field installation and swap inventory.
    - `DEALER_SHOWROOM`: Channel partner retail depot.
    - `CUSTOMER_PREMISES`: Customer facility awaiting scheduled installation.
    - `INSTALLED_VEHICLE`: On-board operational customer vehicle.
    - `RMA_QUARANTINE`: Secure inspection and diagnostic holding area within central depot.

- **SWR-CUS-002 (Downstream Service Custody Extension — Supplier Depot Transit):**
  - To model serialized hardware dispatched to external OEM manufacturers under `PRD-RMA-001` (`SUPPLIER_RMA_DISPATCHED`), this specification defines a downstream service-custody extension:
    - **`SUPPLIER_REPAIR_DEPOT`**: Physical custody located at external OEM manufacturer or contracted warranty repair center.
  - *Custody Authority Constraints:*
    - Telemetry Access: Strictly **NO** (device is de-installed and in external supplier custody).
    - Command Access: Strictly **NO** (zero command dispatch authority).
    - Multi-Tenant Isolation: Tenant ownership metadata is preserved throughout supplier dispatch; devices belonging to Tenant A can never be returned or reallocated to Tenant B.

---

## 21. CUSTODY CHAIN OF TRANSFERS & PHYSICAL TRACKING

- **SWR-CUS-003 (Durable Chain of Custody Logging):**
  - Every transfer of hardware custody during service and RMA must generate an immutable audit record (`SMDI-AUD-001`):
    1. *Transfer Dispatch:* Dispatching party records source custody node, destination custody node, carrier tracking number (if shipped), and serialized IMEIs in transfer batch.
    2. *Receipt Confirmation:* Receiving party confirms physical count and scans individual IMEIs. Any discrepancy between dispatched and received inventory triggers an immediate custody dispute flag and blocks unreceived units from progressing.
    3. *Audit Evidence:* Every custody event records: `transfer_id`, `timestamp_utc`, `actor_id`, `actor_role`, `from_custody_node`, `to_custody_node`, `item_count`, and `verification_status`.

---

## 22. WORKSHOP TEST-BENCH DIAGNOSTICS & HARDWARE VERIFICATION

- **SWR-DIA-001 (RMA Workshop Bench Diagnostics):**
  - Units returned to central depot or workshop enter `RMA_QUARANTINE` custody for technical evaluation:
    1. *Physical & Electrical Integrity Inspection:* Visual inspection for casing cracks, seal integrity, moisture detection strip activation, and circuit board component scorching.
    2. *Test-Bench Power-Up:* Connection to bench power supply monitoring idle current draw, sleep current draw, and transmit burst current against DCR power consumption baselines.
    3. *RF & GNSS Signal Bench Verification:* Testing cellular transceiver sensitivity and GNSS receiver carrier-to-noise ratio ($C/N_0$) under simulated or bench antenna conditions.
    4. *I/O & Relay Driver Bench Verification:* Testing ignition input sensing logic and output relay driver actuation under bench test loads.

---

## 23. RETURN-TO-SERVICE PROTOCOL & QUARANTINE CLEARANCE

- **SWR-DIA-002 (Quarantine Clearance to Available Stock):**
  - If bench diagnostics confirm that a repaired or re-flashed unit satisfies all technical performance criteria, the unit may clear quarantine:
    - State Transition: `QUARANTINED` $\longrightarrow$ `INSPECTED_AVAILABLE` (`SMDI` Matrix 3).
    - Custody Transition: `RMA_QUARANTINE` $\longrightarrow$ `CENTRAL_WAREHOUSE` or `TENANT_DEPOT`.
    - Association Reset: Unit must be completely unlinked from any previous vehicle association, and temporary diagnostic logs closed.
    - Clearance Sign-Off: An accredited platform or tenant technician must digitally sign the clearance record.

---

## 24. ASSET DECOMMISSIONING, E-WASTE LOGGING & QUARANTINE RETIREMENT

- **SWR-DEC-001 (Hardware Retirement & Decommissioning):**
  - When physical inspection or supplier diagnosis determines that a device is unrepairable or uneconomical to restore, the unit must be permanently retired:
    - State Transition: `QUARANTINED` $\longrightarrow$ `RETIRED_DECOMMISSIONED` (`SMDI` Matrix 3). Terminal state; no further operational transitions permitted.
    - Security Sanitization: Cryptographic credentials, private keys, and APN connection strings stored on device EEPROM/flash must be zeroized where hardware remains accessible.
    - Internal Disposal Record: The system records disposal method, physical asset write-off reference, and responsible officer ID.
    - Statutory Compliance Note: Formal statutory e-waste disposal certifications, hazardous material manifests, and government recycling filings remain: `LEGAL / REGULATORY VERIFICATION REQUIRED`. The platform invents zero unverified government disposal APIs or certificates.

---

## 25. SPARE PARTS STOCK MANAGEMENT & REPAIR LOGISTICS

- **SWR-LED-001 (Spare Parts Inventory Tracking):**
  - In strict compliance with `MODULE_SERVICE_ENTITLEMENT_SPEC.md` (`MSE-INV-001`), the inventory engine manages spare parts and repair components:
    - Tracked components: Replacement wiring harnesses, external GNSS/GSM antennas, inline fuses, automotive relays (12V/24V), internal lithium backup batteries, and replacement device enclosures.
    - Stock allocation: Components are tracked across `CENTRAL_WAREHOUSE`, `TENANT_DEPOT`, and `TECHNICIAN_VAN` kits.
    - Consumption logging: Consumed spare parts must be linked to the governing `work_order_id` or `rma_case_id`.
---

## 26. SERIALIZED WARRANTY LEDGER & AUDIT TRACKING

- **SWR-LED-002 (Serialized Warranty Audit Ledger):**
  - In strict compliance with `MSE-INV-001`, the system maintains an immutable serialized warranty ledger capturing the historical warranty lifecycle of every hardware unit:
    - Ledger records capture: `event_id`, `timestamp_utc`, `imei`, `actor_id`, `event_type` (`PURCHASE_RECORDED`, `ACTIVATED`, `WARRANTY_EXTENDED`, `CLAIM_SUBMITTED`, `CLAIM_APPROVED`, `CLAIM_REJECTED`, `EXPIRED`), `effective_coverage_start`, `effective_coverage_end`, and `authorizing_reference`.
    - The warranty ledger is append-only; historical warranty entries cannot be purged or modified upon subsequent claims.

---

## 27. COMMERCIAL & BILLING BOUNDARY

- **SWR-BIL-001 (Commercial Billing Separation & Deferred Accounting):**
  - This specification defines technical fault classification and warranty eligibility determination. All financial invoicing, labor pricing, part markup calculation, customer debit/credit ledgers, and payment processing are strictly **DEFERRED** to the downstream **Billing & Metering Specification**:
    - SWR emits technical classification tokens: `BILLABLE_REPAIR`, `WARRANTY_COVERED`, `CUSTOMER_LIABLE`, or `SUPPLIER_REIMBURSED`.
    - Downstream Billing consumes these classification tokens to calculate invoices based on commercial pricing plans and rate cards (`DEC-004`).
    - SWR does not calculate monetary values, apply currency conversions, or process credit card payments.

---

## 28. DEALER & CHANNEL PARTNER SERVICE BOUNDARIES

- **SWR-CHN-001 (Dealer Custody & Operational Isolation):**
  - In accordance with `SALES_SUPPORT_RESCUE_SPEC.md` (`SSR-CHN-001`) and `SIM_M2M_DEVICE_INVENTORY_SPEC.md` (`SMDI-CHN-001`):
    - Channel dealers holding stock in `DEALER_SHOWROOM` custody may receive customer defective units for warranty intake.
    - Dealer custody is strictly physical intake custody. Dealer personas (`DEALER_CHANNEL`) possess ZERO live map tracking authority, zero access to historical customer trip data, zero command dispatch permissions, and zero authority to execute warranty liability approvals.
    - Units received by dealers must be formally transferred to an authorized technician or warehouse via standard custody transfer protocols (`SWR-CUS-003`).

---

## 29. MULTI-TENANT ISOLATION & DATA PERIMETERS

- **SWR-TEN-001 (Strict Multi-Tenant Perimeters during Service):**
  - In strict compliance with `TENANT_ISOLATION_SECURITY_BOUNDARY_SPEC.md` (`93d7a4e`, `TISB-TECH-001`, `TISB-TEN-001`):
    1. *Tenant Work Order Isolation:* A technician assigned to Tenant A cannot view, access, or execute work orders belonging to Tenant B.
    2. *Hardware Reassignment Barrier:* Hardware belonging to Tenant A cannot be reallocated or assigned to a vehicle in Tenant B without a formal platform-level de-provisioning, data zeroization, and tenant transfer procedure (`SMDI-TEN-002`).
    3. *Cross-Tenant Leakage Prevention:* Service requests, RMA cases, customer notes, and historical vehicle logs are strictly partitioned by tenant isolation boundaries and tenant scoping at the query and storage layers (`TISB-TEN-001`).

---

## 30. DIAGNOSTIC TELEMETRY PRIVACY & RETENTION BOUNDARY

- **SWR-PRI-001 (Diagnostic Telemetry Retention & Privacy Boundary):**
  - In accordance with `USER_ROLES_PERMISSIONS_ACCESS_SPEC.md` (`URPA-TECH-001`) and open decision `DEC-009` (Telemetry Raw Data Retention):
    1. *Active Work Order Access Only:* Technicians receive live diagnostic telemetry feeds strictly during the active window of an assigned work order (`WORK_ORDER_SCOPE`).
    2. *No Permanent Historical Browsing:* Technicians cannot browse historical trips, locations, or geofences traveled by the customer prior to the service event.
    3. *Retention Duration Deferral:* Raw diagnostic packet retention limits and permanent archival durations are governed by open decision `DEC-009` and deferred to the downstream **Privacy, Data Retention & Offboarding Specification**. SWR does NOT declare permanent or indefinite telemetry retention.

---

## 31. COMMAND SAFETY SUBORDINATION & OPERATIONAL RESTRICTIONS

- **SWR-CMD-001 (Absolute CSE Subordination & Zero Test-Bench Bypasses):**
  - In strict compliance with `COMMAND_SAFETY_EXECUTION_SPEC.md` (`ebccd29`, `CSE-AUT-002`):
    1. *Universal 9-Term Formula Enforcement:* No service role—including Field Technician, Service Center Manager, Platform Admin, or Workshop Bench Tester—possesses authority to bypass any term of the 9-term command authorization formula (`URPA-ADM-001`, `TISB-CMD-001`, `CSE-AUT-002`).
    2. *Canonical Actuator Terminology:* Actuator operations are designated strictly as **`Engine Disable`** and **`Engine Restore`**. Non-canonical actuator slang, colloquialisms, or legacy abbreviations are strictly forbidden across all system interfaces.
    3. *Zero Invented Bench Predicates:* The system does NOT invent special test-bench safety exceptions, stationary override predicates, or speed bypasses. High-risk actuator commands (`commands.engine_disable.request`) executed during field testing must satisfy standard CSE safe-state rules (verified stationary, ignition state, vehicle condition).
    4. *Technician Command Scope:* Field technicians (`URPA-ROLE-011`) are authorized only for non-intrusive diagnostic query commands (`commands.status.query`), APN configuration commands (`commands.apn_config.request`), and diagnostic restart commands (`commands.reboot.request`) where policy permits. Technicians do NOT possess default authority for `commands.engine_disable.request` or `commands.engine_restore.request`.

---

## 32. COMMERCIAL FLEET BATCH RMA & MULTI-VEHICLE MAINTENANCE

- **SWR-FLT-001 (Commercial Fleet Batch RMA Operational Composition):**
  - In support of commercial fleet workflows (`PRD-RMA-001`, `MSE-INV-001`), enterprise and commercial fleet operators managing high vehicle volumes may initiate batch service requests for fleet-wide scheduled maintenance or component service campaigns as an SWR operational composition:
    - *Operational Composition & Zero Upstream Authority Claim:* While `FLEET_PACK_SPEC.md` (`220ac0d`) governs multi-vehicle fleet hierarchy and packaging, it establishes no batch RMA authority. SWR specifies batch service request initiation strictly as a downstream operational composition.
    - *Batch Selection $\neq$ Bulk Authorization:* While UI intake and dispatch initiation may occur in batches, bulk selection NEVER constitutes bulk authorization. Every physical device and vehicle target independently enforces its own individual state verification, individual tenant scoping, individual warranty evaluation, individual DCR capability recalculation, custody transition, and audit trail generation. A verification failure on vehicle X never silently invalidates or bypasses verification on vehicle Y.
---

## 33. REGULATORY JURISDICTION & STATUTORY SCRAP BOUNDARIES

- **SWR-REG-001 (Regulatory Subordination & Zero Fabricated Mandates):**
  - In strict compliance with `REGULATORY_KNOWLEDGE_SERVICE_SPEC.md` (`d26153b`, `RKS-EXT-001`):
    - SWR incorporates jurisdictional regulatory rules without inventing government procedures or statutory mandates.
    - SWR asserts zero unverified statutory responsibilities or automated APIs for BTRC, BRTA, police, or environmental protection departments.
    - All physical scrapping, hazardous waste management, and hardware destruction workflows are tracked internally as platform asset retirement (`RETIRED_DECOMMISSIONED`).
    - Where formal statutory e-waste disposal certificates or environmental filings are legally mandated by local law, they are explicitly tagged:
      `LEGAL / REGULATORY VERIFICATION REQUIRED`.

---

## 34. DOWNSTREAM SPECIFICATION HANDOFFS & DEFERRED SYSTEMS

- **SWR-DEF-001 (Explicit Specification Deferral Handoffs):**
  - The SWR specification formally delegates non-core concerns to dedicated downstream specifications:
    1. *Billing & Metering:* Customer repair fee cards, technician labor billing ledgers, parts markup accounting, and payment gateway webhooks.
    2. *Integration Registry / API Sync:* Third-party workshop management system APIs, external courier tracking webhooks, and automated OEM supplier RMA portal integrations.
    3. *Media Voice / Video:* Bench diagnostic procedures for dashcam video sensors, cabin microphones, and ADAS hardware.
    4. *Privacy, Data Retention & Offboarding:* Diagnostic telemetry raw data retention duration (`DEC-009`), customer offboarding asset unlinking, and data erasure schedules.
    5. *AI Orchestration & Guardrails:* Automated fault triage bots, predictive failure warning models, and AI diagnostic assistants (`MOD-AI-18`).
    6. *Reports & Analytics:* RMA failure rate aggregations, supplier MTBF dashboards, and warranty loss-ratio reporting.
    7. *Data Architecture / API Contract:* Concrete relational database schema DDL, REST endpoint specifications, and asynchronous event bus payloads.

---

## 35. IAM ROLES & PERMISSION INTEGRATION

- **SWR-IAM-001 (Strict URPA Role & Scope Compliance & IAM Mutation Authority Gap):**
  - In strict compliance with `USER_ROLES_PERMISSIONS_ACCESS_SPEC.md` (`25e7834`) and `TENANT_ISOLATION_SECURITY_BOUNDARY_SPEC.md` (`TISB-TEN-001` 6-layer security model), service operations are governed by approved operational roles and explicit scope models:
    - `TECHNICIAN_INSTALLER` (`URPA-ROLE-011`): Authorized strictly within `WORK_ORDER_SCOPE` (`URPA-TECH-001`) for assigned physical installations, wiring checks, activation testing, and field RMA returns.
    - `TECHNICAL_SUPPORT` (`URPA-ROLE-010`): Deep diagnostics troubleshooting within `SUPPORT_TICKET_SCOPE`.
    - `SUPPORT_AGENT` (`URPA-ROLE-009`): Initial customer triage and Service Request intake within `SUPPORT_TICKET_SCOPE`.
    - `TENANT_ADMIN` (`URPA-ROLE-004`): Tenant-level work order scheduling, inventory oversight, and technician assignment within `TENANT_SCOPE`.
    - `PLATFORM_ADMIN` (`URPA-ROLE-003`): Global device model registration (`devices.registry.verify`), supplier RMA claims, and master inventory governance.
    - `PLATFORM_OWNER` (`URPA-ROLE-002`): Master SaaS policy governance and root audit oversight.
  - *AUTHORITY GAP — SERVICE / RMA MUTATION PERMISSIONS NOT DEFINED UPSTREAM:*
    - In accordance with platform security architecture (`TISB-TEN-001`), Role (`URPA-ROLE-*`), `WORK_ORDER_SCOPE` (`URPA-TECH-001`), and Module Entitlement (`MOD-INV-16`, `MSE-INV-001`) MUST NOT be treated as a substitute for an IAM permission token.
    - Approved `USER_ROLES_PERMISSIONS_ACCESS_SPEC.md` defines NO fine-grained permission tokens for RMA state transitions, work order state mutations, or warranty determinations.
    - Zero permission tokens are fabricated (zero `rma.*`, zero `work_order.*`, zero `warranty.*` tokens are invented).
    - *Normative Fail-Closed Mutation Rule:* Any operational mutation requiring fine-grained IAM mutation authority MUST fail closed unless an approved platform permission token and actor assignment explicitly authorizes it. Operational mutations remain governed under platform administrative authority (`PLATFORM_ADMIN` / `URPA-ADM-001`) or are deferred to downstream IAM specification updates.

- **SWR-IAM-002 (Technician Work-Order Bounded Diagnostic Access):**
  - Field installers receive diagnostic telemetry access strictly during active `WORK_ORDER_SCOPE` (`URPA-TECH-001`):
    - Diagnostic inspection encompasses signal quality, battery voltage, ignition state, and heartbeat timestamps.
    - Diagnostic access does NOT grant operational fleet tracking, historical route browsing, or command safety bypasses.
    - Upon work order completion, failure, or cancellation, `WORK_ORDER_SCOPE` is automatically revoked.

---

## 36. MODULE & SERVICE ENTITLEMENT (MSE) BOUNDARIES

- **SWR-MSE-001 (Approved Module Token Compliance):**
  - In strict compliance with `MODULE_SERVICE_ENTITLEMENT_SPEC.md` (`a962a2a`):
    - Hardware inventory, spare parts stock, warranty ledgers, and serialized RMA return workflows are governed by **`MOD-INV-16`** (Hardware Inventory & RMA) under `MSE-INV-001`.
    - Customer support diagnostic triage operates under **`MOD-SUP-13`** (Customer Support Hub).
    - Core live tracking association operates under **`MOD-TRK-01`** (Core Live Tracking).
    - SIM connectivity management operates under **`MOD-SIM-15`** (SIM / M2M Lifecycle ERP).
    - Dynamic capability recalculation upon hardware replacement operates under **`MSE-REP-001`**.
  - *Zero Module Invention:* SWR invents zero unapproved module tokens (e.g. no `MOD-WAR-*`, no `MOD-RMA-*`, no `MOD-SRV-*`).

---

## 37. CONCURRENCY, ATOMICITY & IDEMPOTENCY INVARIANTS

- **SWR-CON-001 (Concurrency Invariants & Conflict Prevention):**
  - The service and RMA engine enforces deterministic, implementation-neutral concurrency invariants across all entity mutations:
    1. *Lost-Update Prevention & Stale-Write Rejection:* Simultaneous status updates on a work order or RMA case must detect concurrent modifications and reject stale writes. State updates enforce atomic transition verification and conflict detection.
    2. *Atomic Hardware Replacement Commit:* Remapping $\\text{IMEI}_{new}$ to a vehicle, archiving $\\text{IMEI}_{old}$, re-evaluating DCR capabilities, updating provider routes, and unbinding/rebinding SIM records MUST execute in a single atomic transaction boundary. A failure in any component rolls back the entire swap operation, preventing orphaned telematics associations.
    3. *Work Order Assignment Idempotency:* Dispatching a technician or scheduling an appointment must be idempotent, preventing duplicate technician booking records or double-dispatched inventory.
    4. *Stale Scope Invalidation:* Committing work order closure atomically invalidates active `WORK_ORDER_SCOPE` tokens for the assigned technician.

---

## 38. AUDITABILITY, DURABLE EVIDENCE & TRANSACTION LOGGING

- **SWR-AUD-001 (Durable Service & RMA Audit Logging):**
  - 100% of the following operational events must generate durable, append-only audit records:
    1. Work order creation, scheduling, assignment, technician arrival, checklist sign-off, completion, and cancellation.
    2. Pre-installation vehicle electrical inspection readings and ignition sense verification results.
    3. RMA case creation, status milestone progression, and disposition determinations.
    4. Warranty evaluation execution, input timestamps, and coverage status decisions.
    5. Hardware replacement association, DCR recalculation diffs, and VKR compatibility checks.
    6. Custody transfer dispatch, carrier tracking numbers, receipt confirmations, and discrepancy flags.
    7. Diagnostic command dispatches (`commands.status.query`, `commands.reboot.request`) and parameter changes (`commands.apn_config.request`).
  - Audit records capture: `audit_id`, `timestamp_utc`, tenant scoping identifier, `actor_id`, `actor_role`, `entity_type`, `entity_id`, `before_state`, `after_state`, and `authorization_evidence`.
---

## 39. NON-FUNCTIONAL REQUIREMENTS & SCALE ALIGNMENT

- **SWR-NFR-001 (Scale & High-Density Target):**
  - In strict compliance with `PRODUCT_REQUIREMENTS.md` (`PRD-SCL-001`), the architecture is designed for approximately 2,000,000 connected devices while building pragmatically for initial commercial launch deployments (tens of units).
  - Work order processing, serialized RMA tracking, and warranty ledger lookups must sustain sub-second query response times under indexed operational conditions.
  - Zero numerical ceilings or arbitrary limits are imposed on the total number of historical work orders or serialized RMA cases.

- **SWR-NFR-002 (Data Integrity & Fail-Closed Resilience):**
  - Zero tolerance for orphaned device bindings, orphaned vehicle associations, or unmapped replacement hardware.
  - Fail-closed error isolation prevents partial hardware replacements or corrupted telematics histories upon database or network timeouts.

---

## 40. ARCHITECTURE & OPERATIONS MATRICES

### Matrix 1: Operational Actor & Service Authority Matrix

| Operational Actor | Primary Function | Schedule Work Orders | Execute Field Installation | Access Live Telemetry | Execute Test Commands | Validate Warranty | Approve Scrap / Retirement |
| :--- | :--- | :---: | :---: | :---: | :---: | :---: | :---: |
| **Platform Owner** | Master SaaS Governance | **YES** | **NO** | Restricted (Audit) | Full (via CSE) | Policy Admin | **YES** |
| **Platform Admin** | Platform Operations | **YES** | **NO** | Restricted (Audit) | Full (via CSE) | **YES** (Admin) | **YES** (`URPA-ADM-001`) |
| **Tenant Admin** | Fleet Operations | **YES (Tenant)** | **NO** | **YES (Tenant)** | Full (via CSE) | View / Claim | Tenant Units Only |
| **Technician / Installer** | Field Service / Repair | **NO** | **YES** (Assigned) | Work Order Scoped | Verification Only | Evidence Log Only | **NO** |
| **Technical Support** | Deep Diagnostics | Escalate Only | **NO** | Ticket Scoped | Diagnostic Only | View Only | **NO** |
| **Support Agent** | Intake & Triage | Intake Only | **NO** | **NO** | **NO** | View Only | **NO** |
| **Dealer / Channel** | Retail Distribution | **NO** | **NO** | **NO** | **NO** | **NO** | **NO** |

*Note on IAM Mutation Authority:* In accordance with `SWR-IAM-001`, fine-grained mutation tokens for RMA/Work Orders are undefined in upstream URPA (Authority Gap); operations fail closed unless authorized under platform administrative authority (`PLATFORM_ADMIN`) or downstream IAM extensions.

---

### Matrix 2: Serialized RMA Lifecycle State Machine Matrix

| State Milestone | Context & Entry Condition | Allowed Next Milestones | Prohibited Transitions | Custody State | Telemetry Access | Command Access |
| :--- | :--- | :--- | :--- | :--- | :---: | :---: |
| **`FAULT_REPORTED`** | Defect reported via Support/Customer | `TECHNICIAN_INSPECTED` | `RETURNED_TO_WAREHOUSE`, `REPAIRED`, `RESTOCKED` | `INSTALLED_VEHICLE` / `TENANT_DEPOT` | Ticket Scoped | Diagnostic Only |
| **`TECHNICIAN_INSPECTED`**| Inspected by technician (field or depot intake) | `RETURNED_TO_WAREHOUSE` | `SUPPLIER_RMA_DISPATCHED`, `RESTOCKED`, `ACTIVE_OPERATIONAL` | `TECHNICIAN_VAN` / `RMA_QUARANTINE` | Work Order Scoped | Verification Only |
| **`RETURNED_TO_WAREHOUSE`**| Received into warehouse depot custody | `SUPPLIER_RMA_DISPATCHED` | `REPAIRED / REPLACED`, `RESTOCKED / SCRAPPED`, `ACTIVE_OPERATIONAL` | `RMA_QUARANTINE` | Diagnostics Only | Test Bench Only |
| **`SUPPLIER_RMA_DISPATCHED`**| Shipped to OEM repair depot | `REPAIRED / REPLACED` | `RESTOCKED`, `ACTIVE_OPERATIONAL` | `SUPPLIER_REPAIR_DEPOT` | **NO** | **NO** |
| **`REPAIRED / REPLACED`** | Returned from supplier disposition | `RESTOCKED / SCRAPPED` | `SUPPLIER_RMA_DISPATCHED`, `ACTIVE_OPERATIONAL` | `RMA_QUARANTINE` | Diagnostics Only | Test Bench Only |
| **`RESTOCKED / SCRAPPED`** | Restocked to inventory or terminal scrap| None (Terminal Milestone) | Any Active State | `CENTRAL_WAREHOUSE` / `RETIRED` | **NO** | **NO** |

---

### Matrix 3: Work Order Lifecycle State Machine Matrix

| Work Order State | Meaning / Trigger | Allowed Next States | Scope Status | Telemetry Access | Action Allowed |
| :--- | :--- | :--- | :--- | :---: | :--- |
| **`DRAFT`** | Initial request captured | `SCHEDULED`, `CANCELLED` | Inactive | **NO** | Resource Planning |
| **`SCHEDULED`** | Technician & window committed | `DISPATCHED`, `CANCELLED` | Inactive | **NO** | Kit Allocation |
| **`DISPATCHED`** | Technician en route with stock | `IN_PROGRESS`, `CANCELLED` | Inactive | **NO** | Inventory Transit |
| **`IN_PROGRESS`** | Technician on-site; work initiated | `COMPLETED`, `FAILED` | **ACTIVE** | **DIAGNOSTIC ONLY**| Inspection, Wiring, Handshake |
| **`COMPLETED`** | Handshake verified; job signed off| None (Terminal) | **REVOKED** | **NO** | Closed / Billing Handoff |
| **`FAILED`** | Technical failure or abort | None (Terminal) | **REVOKED** | **NO** | Escalation / Reschedule |
| **`CANCELLED`** | Aborted before on-site work | None (Terminal) | **REVOKED** | **NO** | Stock Return |

---

### Matrix 4: Service Custody & Location Classification Matrix

| Custody Node | Physical Location | Holding Entity | Primary Service Activity | Telemetry Visibility | Command Authority |
| :--- | :--- | :--- | :--- | :---: | :---: |
| **`CENTRAL_WAREHOUSE`** | Platform Main Depot | Platform Logistics | Intake, QC inspection, bulk staging | **NO** | Test Bench Only |
| **`TENANT_DEPOT`** | Regional Maintenance Base | Tenant Fleet Staff | Regional spare stock, fleet staging | **NO** | **NO** |
| **`TECHNICIAN_VAN`** | Mobile Service Vehicle | Accredited Technician | Field swap, doorstep installation | Diagnostic Only | Verification Only |
| **`DEALER_SHOWROOM`** | Channel Partner Depot | Reseller Partner | Retail RMA intake drop-off | **NO** | **NO** |
| **`CUSTOMER_PREMISES`** | Client Facility / Residence | Customer Custody | Staged awaiting technician appointment | **NO** | **NO** |
| **`INSTALLED_VEHICLE`** | On-board Customer Vehicle | Customer / Driver | Active fleet operations | Full (via IAM) | Full (via CSE) |
| **`RMA_QUARANTINE`** | Secure Inspection Depot | Service Technician | Failure diagnostics, bench testing | Diagnostic Only | Test Bench Only |
| **`SUPPLIER_REPAIR_DEPOT`**| External OEM Factory | Hardware Manufacturer| Factory rework, component swap | **NO** | **NO** |

---

### Matrix 5: Cross-Domain Authority Matrix

| Domain Area | Authoritative Upstream Spec | Governing Invariant | SWR Operational Subordination Rule |
| :--- | :--- | :--- | :--- |
| **Hardware Capabilities** | `DEVICE_CAPABILITY_REGISTRY_SPEC.md` | `DCR-MDL-001`, `DCR-CAP-001` | SWR cannot manufacture device capabilities; re-evaluates via DCR on swap. |
| **Vehicle Compatibility** | `VEHICLE_KNOWLEDGE_REGISTRY_SPEC.md` | `VKR-ELC-001`, `VKR-CMD-001` | SWR validates electrical class and wiring harness compatibility against VKR. |
| **SIM Connectivity** | `SIM_M2M_DEVICE_INVENTORY_SPEC.md` | `SMDI-AST-001`, `SMDI-SIM-003` | SWR consumes SIM binding and custody states; 1:1 binding strictly preserved. |
| **Provider Routing** | `TRACKING_PROVIDER_ARCHITECTURE_SPEC.md` | `TPA-DEV-001`, `TPA-PRV-001` | Ingestion route re-mapped to new IMEI atomically upon swap; no demo fallback. |
| **Command Safety** | `COMMAND_SAFETY_EXECUTION_SPEC.md` | `CSE-AUT-002`, `CSE-SAF-001` | Universal 9-term formula applies to all commands; zero bench/service exceptions. |
| **Tenant Isolation** | `TENANT_ISOLATION_SECURITY_BOUNDARY_SPEC.md` | `TISB-TECH-001`, `TISB-TEN-001` | Multi-tenant boundary strictly maintained across tickets, custody, and inventory. |

---

## 41. COMPREHENSIVE TRACEABILITY MATRIX

| Requirement ID | Requirement Name | Upstream Authority Reference | Governing Role / Scope / Module | Acceptance Test Gate | Downstream Handoff Boundary |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **`SWR-GEN-001`** | Core Domain Purpose | `PRD-INS-001`, `PRD-WAR-001`, `PRD-RMA-001`, `PRD-DEV-002` | `PLATFORM_ADMIN`, `MOD-INV-16` | `GATE-SWR-01` | Full Specification Framework |
| **`SWR-GEN-002`** | Core Entity Separation | `PRD-DEV-002`, `MSE-INV-001` | All Operational Personas | `GATE-SWR-02` | Domain Architecture |
| **`SWR-GEN-003`** | Fail-Closed Default | `TISB-SEC-001`, `CSE-SAF-001` | Platform Core Engine | `GATE-SWR-03` | Security Boundary |
| **`SWR-GEN-004`** | Implementation Neutrality | `PRD-GEN-001` | Architectural Standard | `GATE-SWR-04` | Data Architecture Spec |
| **`SWR-SVC-001`** | Support Triage Handoff | `SSR-SUP-003`, `DEC-005` | `SUPPORT_AGENT`, `TECHNICAL_SUPPORT`, `MOD-SUP-13` | `GATE-SWR-05` | Sales, Support & Rescue Spec |
| **`SWR-SVC-002`** | Support Managed Modes | `MSE-MOD-001` | `TENANT_ADMIN`, `MOD-SUP-13` | `GATE-SWR-05` | Module Entitlement Spec |
| **`SWR-WO-001`** | Work Order Model | `PRD-INS-001` | `TECHNICIAN_INSTALLER`, `WORK_ORDER_SCOPE` | `GATE-SWR-06` | Field Service Operations |
| **`SWR-WO-002`** | Work Order Lifecycle | `PRD-INS-001` | `TECHNICIAN_INSTALLER`, `WORK_ORDER_SCOPE` | `GATE-SWR-06` | Field Service Operations |
| **`SWR-INS-001`** | Service Delivery Channels | `PRD-INS-001` | `TECHNICIAN_INSTALLER`, `MOD-INV-16` | `GATE-SWR-07` | Field Service Operations |
| **`SWR-INS-002`** | Geo/Skill Technician Dispatch | `PRD-INS-001` | `TENANT_ADMIN`, `PLATFORM_ADMIN` | `GATE-SWR-07` | Field Service Operations |
| **`SWR-INS-003`** | Pre-Installation Inspection | `PRD-INS-001`, `VKR-ELC-001`, `DCR-CAP-001` | `TECHNICIAN_INSTALLER`, `WORK_ORDER_SCOPE` | `GATE-SWR-08` | Vehicle Knowledge Registry |
| **`SWR-INS-004`** | Hardware Wiring & Safety | `PRD-INS-001`, `VKR-ELC-001`, `DCR-CAP-001`, `URPA-ROLE-011` | `TECHNICIAN_INSTALLER`, `WORK_ORDER_SCOPE` | `GATE-SWR-08` | Vehicle Knowledge Registry |
| **`SWR-INS-005`** | Activation Handshake Testing | `PRD-INS-001`, `SMDI-TRK-001` | `TECHNICIAN_INSTALLER`, `WORK_ORDER_SCOPE` | `GATE-SWR-08` | Tracking Provider Gateway |
| **`SWR-RMA-001`** | Serialized RMA Core Entities | `PRD-RMA-001`, `MSE-INV-001` | `PLATFORM_ADMIN`, `MOD-INV-16` | `GATE-SWR-09` | Hardware Inventory Spec |
| **`SWR-RMA-002`** | RMA Milestones & Canonical Sequence | `PRD-RMA-001`, `SMDI-RMA-001` | `TECHNICIAN_INSTALLER`, `PLATFORM_ADMIN` | `GATE-SWR-09` | Hardware Inventory Spec |
| **`SWR-WAR-001`** | Dual-Date Warranty Tracking | `PRD-WAR-001` | `PLATFORM_ADMIN`, `MOD-INV-16` | `GATE-SWR-10` | Commercial Model Spec |
| **`SWR-WAR-002`** | Automated Warranty Evaluation | `PRD-WAR-001` | Core Warranty Engine, `MOD-INV-16` | `GATE-SWR-10` | Commercial Model Spec |
| **`SWR-WAR-003`** | Unresolved Warranty Policies | `DEC-003`, `DEC-004` | Commercial Governance | `GATE-SWR-10` | Billing & Metering Spec |
| **`SWR-SWP-001`** | Safe Hardware Swap Protocol | `PRD-DEV-002`, `SMDI-DEV-002` | `TECHNICIAN_INSTALLER`, `WORK_ORDER_SCOPE` | `GATE-SWR-11` | Field Service Operations |
| **`SWR-RPL-001`** | Vehicle Replacement Mapping | `PRD-DEV-002` | Core Telematics Engine | `GATE-SWR-11` | Core Tracking Architecture |
| **`SWR-RPL-002`** | Non-Overlapping Device Association & Provenance | `PRD-DEV-002`, `MSE-REP-001`, `DEC-009` | Ingestion Gateway, `MOD-TRK-01` | `GATE-SWR-11` | Core Tracking Architecture |
| **`SWR-DCR-001`** | Dynamic DCR Recalculation | `MSE-REP-001`, `DCR-MDL-001` | Capability Engine | `GATE-SWR-12` | Device Capability Registry |
| **`SWR-VKR-001`** | Vehicle Compatibility Boundary| `VKR-ELC-001`, `VKR-CMD-001` | Compatibility Engine | `GATE-SWR-12` | Vehicle Knowledge Registry |
| **`SWR-TPA-001`** | Provider Route Re-association & Fail-Closed Routing | `TPA-DEV-001`, `TPA-MAP-001`, `TPA-MAP-002`, `TPA-PRV-001`, `TPA-DMO-001` | Telematics Gateway | `GATE-SWR-13` | Tracking Provider Spec |
| **`SWR-SIM-001`** | SIM Association Invariants | `SMDI-AST-001`, `SMDI-AST-002` | SIM ERP Engine, `MOD-SIM-15` | `GATE-SWR-13` | SIM/M2M Inventory Spec |
| **`SWR-CUS-001`** | Baseline Custody Taxonomy | `SMDI` Matrix 4 | Inventory Operations, `MOD-INV-16` | `GATE-SWR-14` | SIM/M2M Inventory Spec |
| **`SWR-CUS-002`** | Supplier Depot Custody Node | `PRD-RMA-001`, `SMDI` Matrix 4 | Logistics Operations | `GATE-SWR-14` | SIM/M2M Inventory Spec |
| **`SWR-CUS-003`** | Custody Chain Logging | `SMDI-AUD-001` | Logistics Operations | `GATE-SWR-14` | Durable Audit Trail |
| **`SWR-DIA-001`** | Workshop Bench Diagnostics | `SMDI` Matrix 4 | Service Center Technician | `GATE-SWR-15` | Device Capability Registry |
| **`SWR-DIA-002`** | Quarantine Clearance | `SMDI` Matrix 3 | Accredited Service Tech | `GATE-SWR-15` | Hardware Inventory Spec |
| **`SWR-DEC-001`** | Asset Decommissioning | `SMDI` Matrix 3, `PRD-RMA-001` | Platform Logistics Admin | `GATE-SWR-15` | Regulatory Spec (Pending) |
| **`SWR-LED-001`** | Spare Parts Inventory | `MSE-INV-001` | Inventory Staff, `MOD-INV-16` | `GATE-SWR-16` | Hardware Inventory Spec |
| **`SWR-LED-002`** | Serialized Warranty Ledger | `MSE-INV-001` | Inventory Staff, `MOD-INV-16` | `GATE-SWR-16` | Commercial Model Spec |
| **`SWR-BIL-001`** | Commercial Billing Separation | `DEC-004` | Billing Engine Handoff | `GATE-SWR-16` | Billing & Metering Spec |
| **`SWR-CHN-001`** | Dealer Service Boundary | `SSR-CHN-001`, `SMDI-CHN-001` | `DEALER_CHANNEL` Persona | `GATE-SWR-17` | Sales, Support & Rescue Spec |
| **`SWR-TEN-001`** | Multi-Tenant Perimeters | `TISB-TECH-001`, `TISB-TEN-001` | Platform Security Kernel | `GATE-SWR-17` | Tenant Isolation Spec |
| **`SWR-PRI-001`** | Telemetry Privacy & Retention | `URPA-TECH-001`, `DEC-009` | Privacy Engine | `GATE-SWR-17` | Privacy & Retention Spec |
| **`SWR-IAM-001`** | URPA Compliance & Mutation Authority Gap | `25e7834`, `URPA-ROLE-011`, `TISB-TEN-001` | All Operational Personas | `GATE-SWR-17` | User Roles & Access Spec |
| **`SWR-IAM-002`** | Technician Diagnostic Scope | `URPA-TECH-001` | `TECHNICIAN_INSTALLER`, `WORK_ORDER_SCOPE` | `GATE-SWR-17` | User Roles & Access Spec |
| **`SWR-MSE-001`** | Module Entitlement Compliance | `a962a2a`, `MSE-INV-001` | `MOD-INV-16`, Core Engine | `GATE-SWR-18` | Module Entitlement Spec |
| **`SWR-CMD-001`** | Command Safety Subordination | `CSE-AUT-002`, `URPA-ADM-001` | Safety Kernel Engine | `GATE-SWR-18` | Command Safety Exec Spec |
| **`SWR-FLT-001`** | Fleet Batch RMA Operational Composition | `PRD-RMA-001`, `MSE-INV-001` | Commercial Fleet Manager | `GATE-SWR-18` | Commercial Fleet Operations |
| **`SWR-REG-001`** | Regulatory Subordination | `RKS-EXT-001` | Compliance Engine | `GATE-SWR-18` | Regulatory Knowledge Spec |
| **`SWR-DEF-001`** | Specification Deferrals | Architecture Baseline | Platform Architecture | `GATE-SWR-18` | Downstream Specifications |
| **`SWR-CON-001`** | Concurrency Invariants | Database Transaction Boundary | Core Service Engine | `GATE-SWR-18` | Data Architecture Spec |
| **`SWR-AUD-001`** | Durable Service Audit Logging | `URPA-AUD-001`, `SMDI-AUD-001` | Master Audit Logger | `GATE-SWR-18` | Security & Audit Architecture |
| **`SWR-NFR-001`** | Scale & High-Density Target | `PRD-SCL-001` | Architecture Standard | `GATE-SWR-18` | System Test Architecture |
| **`SWR-NFR-002`** | Data Integrity & Resilience | Architecture Baseline | Platform Core Kernel | `GATE-SWR-18` | System Test Architecture |
| **`SWR-ACC-001`** | Comprehensive Acceptance Gates| Architecture Baseline | Verification Harness | `GATE-SWR-01` to `18` | Built-In Static Audit |

---

## 42. TESTABLE ACCEPTANCE CRITERIA

- **SWR-ACC-001 (Formal Acceptance Gates):**
  - Implementation readiness requires 100% deterministic pass on the following 18 acceptance test gates:

- **`GATE-SWR-01` (Core Domain & Milestone Verification):** Work order and RMA state engines enforce unambiguous state models without skipping required validation stages.
- **`GATE-SWR-02` (Entity Separation Enforcement):** Assert that Work Order IDs, Service Request IDs, RMA Case IDs, and Vehicle IDs cannot be aliased or structurally conflated.
- **`GATE-SWR-03` (Fail-Closed Denials):** Attempting an installation or hardware swap on an unverified vehicle or invalid DCR model triggers an immediate fail-closed block.
- **`GATE-SWR-04` (Implementation Neutrality Check):** System contracts contain zero vendor-specific SQL, ORM, or cloud-specific API dependencies.
- **`GATE-SWR-05` (Support Intake & Managed Mode Test):** Verify that Support triage escalates cleanly to Service Requests across all 4 MSE service modes (`DISABLED`, `TENANT_MANAGED`, `SAAS_MANAGED`, `HYBRID`).
- **`GATE-SWR-06` (Work Order Lifecycle Integrity):** Work orders transition through `DRAFT` ➔ `SCHEDULED` ➔ `DISPATCHED` ➔ `IN_PROGRESS` ➔ `COMPLETED` / `FAILED` / `CANCELLED` with strict invariant checks.
- **`GATE-SWR-07` (Channel & Technician Dispatch Gate):** Both Doorstep Service and Service Center bookings execute identical checklist and activation validations; dispatch requires verified skill profile match.
- **`GATE-SWR-08` (Pre-Inspection, Voltage & Capability-Aware Handshake Gate):** Physical installation requires signed pre-inspection checklist verifying electrical suitability against VKR profile (`VKR-ELC-001`) and device range (`DCR-CAP-001`) with zero unsupported hardcoded voltage cutoffs, profile-aware ACC ignition sensing, and backend-confirmed activation handshake.
- **`GATE-SWR-09` (Serialized RMA Sequential Milestone Gate):** RMA workflow enforces the mandatory sequential milestone sequence (`FAULT_REPORTED` ➔ `TECHNICIAN_INSPECTED` ➔ `RETURNED_TO_WAREHOUSE` ➔ `SUPPLIER_RMA_DISPATCHED` ➔ `REPAIRED / REPLACED` ➔ `RESTOCKED / SCRAPPED`) per `PRD-RMA-001`; depot intake triage satisfies `TECHNICIAN_INSPECTED` and unapproved bypass transitions are strictly rejected.
- **`GATE-SWR-10` (Dual-Date Warranty Validation Gate):** Warranty engine tracks supplier purchase date and customer activation date independently; flags `IN_WARRANTY`, `OUT_OF_WARRANTY`, or `CUSTOMER_DAMAGED`.
- **`GATE-SWR-11` (Vehicle History Continuity & Non-Overlapping Provenance Gate):** Remapping replacement IMEI preserves logical continuity of vehicle trips, alerts, and maintenance logs across non-overlapping intervals $[T_{initial}, T_{swap})$ and $[T_{swap}, T_{end}]$; preserves original device provenance throughout retained lifecycle without violating retention neutrality (`DEC-009`).
- **`GATE-SWR-12` (Dynamic Capability & Compatibility Gate):** Swapping hardware triggers immediate DCR capability recalculation (`MSE-REP-001`) and validates VKR electrical class compatibility.
- **`GATE-SWR-13` (TPA Route Re-association & Fail-Closed Gate):** Telematics ingestion route updates to replacement device under `TPA-MAP-001` while retired unit route fails closed under `TPA-MAP-002`; zero fallback to Demo providers (`TPA-DMO-001`); SIM rebinding executes without orphan associations.
- **`GATE-SWR-14` (Custody Chain of Transfers Gate):** Custody transitions across van, warehouse, and `SUPPLIER_REPAIR_DEPOT` log immutable transfer dispatch and receipt confirmation.
- **`GATE-SWR-15` (Quarantine Clearance & Scrap Gate):** Units clear quarantine to `INSPECTED_AVAILABLE` only upon passed bench diagnostic; unrepairable units transition terminally to `RETIRED_DECOMMISSIONED`.
- **`GATE-SWR-16` (Spare Parts & Billing Separation Gate):** Spare parts inventory decrements against work orders; all commercial labor fees and invoice generation deferred to Billing spec.
- **`GATE-SWR-17` (Tenant Perimeter, Ephemeral Scope & IAM Mutation Authority Gate):** Cross-tenant work order or device visibility is strictly blocked under semantic tenant boundaries (`TISB-TEN-001`); operational mutations fail closed in the absence of explicit IAM mutation tokens; technician diagnostic telemetry auto-revoked upon work order closure.
- **`GATE-SWR-18` (Command Safety, Fleet Composition & Deferral Purity Gate):** No test-bench command exceptions to CSE 9-term formula; canonical `Engine Disable` / `Engine Restore` enforced; batch RMA verified as operational composition (*Batch Selection $\neq$ Bulk Authorization*); all downstream system boundaries preserved.

---

## 43. BUILT-IN STATIC AUDIT

| Category | Dimension | Frequency | Result | Evidence |
| :--- | :--- | :---: | :---: | :--- |
| **A** | **Source Integrity & Upstream Reference Validation** | Commit Check | **PASS** | 100% of 13 approved upstream dependencies verified with exact commit hashes (`abef605`, `a962a2a`, `25e7834`, `93d7a4e`, `4014141`, `88bcd53`, `5c9fe52`, `0e60ce3`, `d26153b`, `ebccd29`, `220ac0d`, `97cd070`, `4542f84`). Zero invalid hashes. |
| **B** | **Core Entity Separation** | Invariant Check | **PASS** | `SWR-GEN-002` explicitly formalizes all 14 entity separations (Service Request $\\neq$ Support Ticket, Work Order $\\neq$ RMA Case, Device $\\neq$ Vehicle, Technician $\\neq$ Driver, etc.). |
| **C** | **IAM Role / Permission / Scope Purity** | Token Audit | **PASS** | Utilizes approved personas (`URPA-ROLE-011`, `010`, `009`, `004`, `003`, `002`); ephemeral access bounded by `WORK_ORDER_SCOPE` (`URPA-TECH-001`); formal `AUTHORITY GAP — SERVICE / RMA MUTATION PERMISSIONS NOT DEFINED UPSTREAM` declared; operational mutations fail closed unless explicitly authorized; zero permission tokens invented. |
| **D** | **MSE Module / Entitlement Purity** | Module Audit | **PASS** | Primary governance under approved `MOD-INV-16` (Hardware Inventory & RMA) and invariants `MSE-INV-001`, `MSE-REP-001`. Zero invented module tokens (no `MOD-WAR-*`, no `MOD-RMA-*`). |
| **E** | **RMA PRD Lifecycle Fidelity** | Lifecycle Audit | **PASS** | Formally implements mandatory sequential milestone progression from `PRD-RMA-001` (`FAULT_REPORTED` ➔ `TECHNICIAN_INSPECTED` ➔ `RETURNED_TO_WAREHOUSE` ➔ `SUPPLIER_RMA_DISPATCHED` ➔ `REPAIRED / REPLACED` ➔ `RESTOCKED / SCRAPPED`); depot intake triage satisfies `TECHNICIAN_INSPECTED`; zero unapproved bypass branches. |
| **F** | **Warranty Authority & Commercial Non-Invention** | Commercial Audit | **PASS** | Implements dual-date tracking (`PRD-WAR-001`) from supplier purchase and customer activation; leaves durations configurable per `DEC-003`/`DEC-004`; defers labor pricing/invoicing to Billing spec. |
| **G** | **Work Order / Technician Scope Isolation** | Scope Audit | **PASS** | Enforces `WORK_ORDER_SCOPE` (`URPA-TECH-001`). Diagnostic telemetry bounded to active job; zero operational fleet tracking or permanent historical route browsing. |
| **H** | **Device Replacement & History Continuity** | History Audit | **PASS** | Implements `PRD-DEV-002` vehicle remapping; historical telemetry, trips, and alerts remain anchored to vehicle across non-overlapping intervals $[T_{initial}, T_{swap})$ and $[T_{swap}, T_{end}]$; provenance immutability throughout retained lifecycle; retention neutrality (`DEC-009`). |
| **I** | **DCR Capability Authority** | Registry Audit | **PASS** | Implements `MSE-REP-001` dynamic capability recalculation against DCR upon hardware swap; replacement cannot inherit unverified capabilities (`SWR-DCR-001`). |
| **J** | **VKR Vehicle Compatibility Authority** | Registry Audit | **PASS** | Subordinated to VKR (`0e60ce3`); enforces vehicle electrical class, operating voltage range, and command relay compatibility against VKR (`VKR-ELC-001`, `VKR-CMD-001`); zero unsupported hardcoded voltage cutoffs; capability-aware ignition sensing (`DCR-CAP-001`). |
| **K** | **SMDI Inventory / SIM Boundary** | Boundary Audit | **PASS** | Consumes `SMDI-RMA-001`, `SMDI-AST-001`, `SMDI-AST-002`, `SMDI-TRK-001`, and Matrix 3/4. Zero unapproved binding identifiers; unapproved tokens excluded. SIM lifecycle preserved intact. |
| **L** | **TPA Provider Routing Boundary** | Gateway Audit | **PASS** | Route re-association and fail-closed telemetry handling strictly subordinate to `TPA-MAP-001` and `TPA-MAP-002`; zero fallback to demo devices (`TPA-DMO-001`). |
| **M** | **CSE Command Safety Subordination** | Safety Audit | **PASS** | Subordinated to `CSE-AUT-002` 9-term formula; zero test-bench exceptions; canonical terms `Engine Disable` and `Engine Restore` strictly enforced; zero prohibited terms. |
| **N** | **Tenant Isolation & Custody Non-Authority** | Isolation Audit | **PASS** | Enforces `TISB-TECH-001` and `TISB-TEN-001`; semantic tenant boundaries without physical database column lock-in; physical custody in van, warehouse, or `SUPPLIER_REPAIR_DEPOT` confers zero operational fleet authority and zero cross-tenant access. |
| **O** | **Regulatory / External Authority Purity** | Compliance Audit | **PASS** | Subordinated to `RKS-EXT-001`; zero invented BTRC/BRTA/Police APIs; statutory scrap certifications explicitly marked `LEGAL / REGULATORY VERIFICATION REQUIRED`. |
| **P** | **Later-Spec Scope Containment** | Scope Audit | **PASS** | `SWR-DEF-001` explicitly defers Billing, Integration Registry, Media, Privacy, AI, Reports, and concrete Data/API specifications. |
| **Q** | **Requirement ID / Traceability Integrity** | ID Check | **PASS** | 49 unique, stable `SWR-*` requirement definitions; zero collisions; 100% mapped in Traceability Matrix to upstream sources, roles, and acceptance gates. |
| **R** | **Acceptance Criteria Coverage** | Coverage Check | **PASS** | 18 testable acceptance gates (`GATE-SWR-01` through `GATE-SWR-18`) providing complete, verifiable coverage across all operational domains. |
| **S** | **Open Decision + Application Code Integrity** | Decision Audit | **PASS** | Explicitly preserves actual PRD open decisions `DEC-003` (Device Catalogue), `DEC-004` (Subscription Pricing), `DEC-005` (Support Live-Location Grant), and `DEC-009` (Telemetry Raw Data Retention); zero application code written or modified. |
| **T** | **Git Working Tree Hygiene** | Repository Audit | **PASS** | Authoritative development HEAD verified; protected branches and tags preserved; approved specification and audit artifacts clean; zero application code modifications. |
