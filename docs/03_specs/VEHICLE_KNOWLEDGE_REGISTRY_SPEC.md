# Vehicle Knowledge Registry Specification

**Status:** APPROVED  
**Version:** 1.0  
**Approved Date:** 2026-08-29  
**Product:** Vehicle Tracking Standalone Launch  
**Product Name:** TBD  
**Temporary Working Name:** EasyTracker  
**Authority Status:** APPROVED DOWNSTREAM SPECIFICATION  
**Authoritative Upstream:**
1. `docs/03_specs/PRODUCT_REQUIREMENTS.md` v1.0 (Commit `abef605`)
2. `docs/03_specs/MODULE_SERVICE_ENTITLEMENT_SPEC.md` v1.0 (Commit `a962a2a`)
3. `docs/03_specs/USER_ROLES_PERMISSIONS_ACCESS_SPEC.md` v1.0 (Commit `25e7834`)
4. `docs/03_specs/TENANT_ISOLATION_SECURITY_BOUNDARY_SPEC.md` v1.0 (Commit `93d7a4e`)
5. `docs/03_specs/CUSTOMER_TYPES_COMMERCIAL_MODEL_SPEC.md` v1.0 (Commit `4014141`)
6. `docs/03_specs/TRACKING_PROVIDER_ARCHITECTURE_SPEC.md` v1.0 (Commit `88bcd53`)
7. `docs/03_specs/DEVICE_CAPABILITY_REGISTRY_SPEC.md` v1.0 (Commit `5c9fe52`)  
**Upstream Commits:** `abef605`, `a962a2a`, `25e7834`, `93d7a4e`, `4014141`, `88bcd53`, `5c9fe52`  
**Approval Basis:** Draft completed with built-in static audit, independently reviewed, all eight Recommended findings resolved through one consolidated correction, and focused final re-review passed with zero blocking findings, 66 stable VKR requirement IDs and COMPLETE upstream traceability.  
**Purpose:** Establish an authoritative, evidence-driven Vehicle Knowledge Registry (VKR) governing shared vehicle reference knowledge, multi-market vehicle taxonomy, electrical architectures, interface compatibilities, installation considerations, and device–vehicle compatibility modeling without commercial seller guessing, AI hallucinations, or database implementation lock-in.

---

## 1. DOCUMENT CONTROL

| Property | Specification |
| :--- | :--- |
| **Document Title** | Vehicle Knowledge Registry Specification |
| **Document Identifier** | `docs/03_specs/VEHICLE_KNOWLEDGE_REGISTRY_SPEC.md` |
| **Version** | `1.0` |
| **Status** | APPROVED |
| **Approved Date** | `2026-08-29` |
| **Product Brand** | TBD (Temporary Working Name: EasyTracker) |
| **Authority Status** | APPROVED DOWNSTREAM SPECIFICATION |
| **Approval Basis** | Draft completed with built-in static audit, independently reviewed, all eight Recommended findings resolved through one consolidated correction, and focused final re-review passed with zero blocking findings, 66 stable VKR requirement IDs and COMPLETE upstream traceability. |
| **Project Context** | Standalone Vehicle Tracking Launch (with future Agency SaaS vertical alignment) |
| **Active Development Branch** | `vehicle-tracking-launch-v1` |
| **Authoritative Upstream PRD** | `docs/03_specs/PRODUCT_REQUIREMENTS.md` v1.0 (Commit `abef605`) |
| **Authoritative Entitlement Spec** | `docs/03_specs/MODULE_SERVICE_ENTITLEMENT_SPEC.md` v1.0 (Commit `a962a2a`) |
| **Authoritative Roles & Access Spec**| `docs/03_specs/USER_ROLES_PERMISSIONS_ACCESS_SPEC.md` v1.0 (Commit `25e7834`) |
| **Authoritative Tenant Boundary Spec**| `docs/03_specs/TENANT_ISOLATION_SECURITY_BOUNDARY_SPEC.md` v1.0 (Commit `93d7a4e`) |
| **Authoritative Commercial Model Spec**| `docs/03_specs/CUSTOMER_TYPES_COMMERCIAL_MODEL_SPEC.md` v1.0 (Commit `4014141`) |
| **Authoritative Tracking Provider Spec**| `docs/03_specs/TRACKING_PROVIDER_ARCHITECTURE_SPEC.md` v1.0 (Commit `88bcd53`) |
| **Authoritative Device Capability Spec**| `docs/03_specs/DEVICE_CAPABILITY_REGISTRY_SPEC.md` v1.0 (Commit `5c9fe52`) |
| **Authority Precedence Index** | `docs/DOCUMENT_AUTHORITY_INDEX.md` |

---

## 2. PURPOSE

- **VKR-GEN-001 (Specification Purpose):** This specification defines the authoritative, evidence-driven Vehicle Knowledge Registry (VKR) architecture for the Vehicle Tracking SaaS platform. It establishes the technical governance model for recording, verifying, and evaluating shared vehicle reference knowledge, vehicle taxonomy, electrical architectures, interface compatibilities (CAN/OBD), fuel telemetry sources, and device–vehicle compatibility modeling (`PRD-DKR-001`, `MSE-DEV-001`, `DCR-INT-003`). It guarantees that vehicle technical compatibility is derived exclusively from verified technical evidence and remains strictly decoupled from user permissions, tenant entitlements, commercial sales, and AI guessing.

---

## 3. SCOPE

- **VKR-GEN-002 (In-Scope Vehicle Knowledge Registry Dimensions):**
  - Conceptual separation between Shared Vehicle Reference Knowledge and Tenant-Private Vehicle Instances.
  - Multi-tier vehicle taxonomy: Manufacturer/Make $\neq$ Model $\neq$ Generation $\neq$ Variant/Trim $\neq$ Model Year $\neq$ Market/Region $\neq$ Powertrain.
  - Market and regional awareness (distinguishing domestic, global, and reconditioned/imported vehicles).
  - Vehicle identification models (VIN, chassis numbering, engine designations, registration references).
  - Contextual vehicle evidence classes and source provenance governance.
  - Electrical system knowledge (12V, 24V, multi-battery, EV/Hybrid low-voltage accessory interfaces).
  - Vehicle telemetry interfaces (CAN-bus, OBD-II, J1939, digital tachograph, manufacturer proprietary buses).
  - Fuel tank and sender characteristics (analog resistive floats, ultrasonic sender interfaces, CAN fuel data).
  - Odometer and distance source disambiguation.
  - Ignition / ACC / Ready-state behavior across ICE, hybrid, and electric vehicles.
  - Device–Vehicle compatibility assessment and confidence modeling.
  - Engine Disable / Restore vehicle-side installation feasibility boundaries.
  - Non-destructive installation method modeling (hardwired, OBD pass-through, wireless sensor fitment).
  - Vehicle classification (passenger, commercial truck, bus, delivery, specialized).
  - AI non-authority perimeter and regulatory compliance boundaries.
  - 8 architecture-level matrices, non-functional requirements, acceptance criteria, and complete upstream traceability.

---

## 4. OUT OF SCOPE

- **VKR-GEN-003 (Explicit Architectural Exclusions):** This specification SHALL NOT define:
  - Concrete database schemas, SQL DDL tables, column data types, or ORM entity classes.
  - REST API controller implementations, JSON payload serializers, or form validation scripts.
  - Detailed automotive repair manuals, wire color codes, pinout diagrams, or physical splicing schematics.
  - Selection of the initial production vehicle seed catalogue (governed by `DEC-013`).
  - Selection of the initial production hardware device catalogue (governed by `DEC-003`).
  - Tracking Provider protocol decoders or wire frame parsers (governed by TPA / wire protocol specs).
  - Commercial pricing, billing rate cards, or installation fee schedules (governed by `DEC-004`).
  - Legal vehicle ownership or registration title registries (governed by statutory registration authorities).

---

## 5. AUTHORITY & SOURCE BASIS

- **VKR-GEN-004 (Governing Upstream Precedence):** In accordance with `docs/DOCUMENT_AUTHORITY_INDEX.md`, this specification adheres strictly to:
  1. Approved `docs/03_specs/PRODUCT_REQUIREMENTS.md` v1.0 (Commit `abef605`).
  2. Approved `docs/03_specs/MODULE_SERVICE_ENTITLEMENT_SPEC.md` v1.0 (Commit `a962a2a`).
  3. Approved `docs/03_specs/USER_ROLES_PERMISSIONS_ACCESS_SPEC.md` v1.0 (Commit `25e7834`).
  4. Approved `docs/03_specs/TENANT_ISOLATION_SECURITY_BOUNDARY_SPEC.md` v1.0 (Commit `93d7a4e`).
  5. Approved `docs/03_specs/CUSTOMER_TYPES_COMMERCIAL_MODEL_SPEC.md` v1.0 (Commit `4014141`).
  6. Approved `docs/03_specs/TRACKING_PROVIDER_ARCHITECTURE_SPEC.md` v1.0 (Commit `88bcd53`).
  7. Approved `docs/03_specs/DEVICE_CAPABILITY_REGISTRY_SPEC.md` v1.0 (Commit `5c9fe52`).
  8. Historical reconciliation audits (`docs/02_audit/`) as context only.
  9. Legacy code and documentation (strictly as non-authoritative implementation evidence).

---

## 6. DEFINITIONS & CORE CONCEPTS

- **Vehicle Knowledge Registry (VKR):** The platform architectural domain and technical reference system that models, verifies, and manages shared technical knowledge regarding vehicle makes, models, generations, electrical systems, interface buses, and compatibility requirements.
- **Shared Vehicle Reference Knowledge:** Globally shared, non-private technical facts defining the engineering specifications, electrical architecture, interface protocols, and fitment constraints of vehicle models and variants.
- **Tenant Vehicle Instance:** A specific, physically operating vehicle owned, leased, or managed by a customer within a private SaaS tenant perimeter, identified by private registration, chassis/VIN, and assigned tracking devices.
- **Device–Vehicle Compatibility:** The verified technical relationship evaluating whether a specific tracking device (and its firmware, wiring, and accessories) can safely and correctly operate within a specific vehicle variant.
- **Vehicle Taxonomy:** The structured hierarchical classification of vehicles across Make, Model, Generation, Variant, Market, Year, Body, and Powertrain.
- **Evidence Provenance:** The auditable chain of technical documentation, homologation data, service bulletins, and technician commissioning records supporting a vehicle knowledge claim.

---

## 7. ARCHITECTURAL PRINCIPLES

- **VKR-GEN-005 (Evidence-Driven Vehicle Truth):** Vehicle reference knowledge and compatibility ratings MUST derive exclusively from verified technical evidence (`PRD-DKR-001`, `DCR-GEN-005`). Commercial sales, customer requests, marketing brochures, or AI suggestions cannot create or verify vehicle compatibility.
- **VKR-GEN-006 (Strict Domain Separation):** Vehicle reference knowledge is strictly decoupled from device technical capabilities, user permissions, tenant entitlements, and customer subscriptions (`MSE-DEV-001`, `CTCM-GEN-009`, `DCR-INT-003`).

---

## 8. VEHICLE KNOWLEDGE AUTHORITY

- **VKR-AUT-001 (Sole Authority for Reference Knowledge):** The Vehicle Knowledge Registry is the sole authoritative source of vehicle technical reference data across the SaaS platform (`PRD-DKR-001`).
- **VKR-AUT-002 (Non-Technical Roles Barred from Verification):** Marketing staff, sales representatives, customer support agents, end customers, and external AI services are strictly prohibited from verifying vehicle reference facts or declaring compatibility truth (`URPA-DEV-001`, `DCR-CAP-002`). Verification requires platform technical authority (`applicable approved technical registry authority`).

---

## 9. REFERENCE VEHICLE VS VEHICLE INSTANCE

- **VKR-REF-001 (Shared Reference vs Tenant Instance Boundary):** The platform maintains a strict boundary between:
  1. **Shared Vehicle Reference Knowledge:** Generic, model-level technical specifications, electrical architectures, and interface compatibilities shared globally across all tenants.
  2. **Tenant Vehicle Instance Data:** Customer-private operational data, vehicle registration numbers, VIN/chassis associations, assigned tracking devices, driver assignments, and live telemetry.
- **VKR-REF-002 (Zero Leakage into Shared Catalogue):** Shared Vehicle Reference records SHALL NEVER contain tenant identifiers, customer names, private license plates, live locations, or tracking provider credentials (`TISB-TEN-001`, `TISB-TEN-008`).

---

## 10. VEHICLE TAXONOMY

- **VKR-TAX-001 (Hierarchical Vehicle Taxonomy):** The VKR models vehicles through a normalized, granular taxonomy:
  - `Make / Manufacturer`: Vehicle OEM (e.g., Toyota, Hino, Isuzu, Hyundai, Tata, Mahindra).
  - `Model`: Core commercial vehicle line (e.g., Corolla, HiAce, Fielder, Dutro, N-Series).
  - `Generation`: Specific engineering design era or platform iteration (e.g., Corolla E140 vs E160 vs E210).
  - `Variant / Trim`: Specific engine, transmission, body, or electrical package (e.g., 1.5L Hybrid G-Package vs 1.3L Petrol Base).
  - `Market / Region`: Geographic target market specification (e.g., Japan Domestic Market [JDM], South Asian Export, European Spec).
  - `Model Year Range`: Applicable engineering production years (e.g., 2012–2018).
  - `Propulsion / Powertrain`: Combustion (Petrol/Diesel/CNG/LPG), Mild Hybrid, Full Hybrid (HEV), Plug-in Hybrid (PHEV), Battery Electric (BEV).
- **VKR-TAX-002 (Non-Interchangeability of Taxonomic Levels):** Make, Model, Generation, Variant, and Model Year are distinct architectural concepts and SHALL NEVER be treated as interchangeable strings (`PRD-DKR-001`).

---

## 11. MAKE / MODEL / GENERATION / VARIANT

- **VKR-TAX-003 (Generation & Variant Precision):** Vehicle compatibility evaluations MUST evaluate at Generation and Variant precision whenever electrical, fuel, or interface characteristics differ across variants of the same model name (`DCR-MDL-003`).
- **VKR-TAX-004 (No Blind Make-to-Model Equivalence):** Compatibility proven on one vehicle model (e.g., Toyota Corolla E160 Petrol) SHALL NOT be automatically inferred as compatible on a different model (e.g., Toyota HiAce H200 Diesel) or a different generation of the same model without independent verification evidence.

---

## 12. MODEL YEAR / PRODUCTION YEAR

- **VKR-TAX-005 (Model Year vs Registration Year Disambiguation):** The VKR strictly distinguishes between:
  - `Model Year (MY)`: Manufacturer's engineering specification year.
  - `Production / Manufacturing Year`: Calendar year the physical vehicle was assembled at the factory.
  - `Registration Year`: Calendar year the vehicle was registered with local authorities in official registration records.
  *Registration year SHALL NEVER be used as the sole determinant of vehicle generation or technical specification (`PRD-DKR-001`).*

---

## 13. MARKET / REGION AWARENESS

- **VKR-MKT-001 (Market-Specific Variant Modeling):** The VKR explicitly models market-specific engineering variations. Vehicles sharing identical model badges in different markets (e.g., JDM Toyota Premio vs European Toyota Avensis) often possess fundamentally different CAN-bus protocols, OBD pinouts, and electrical harnesses.
- **VKR-MKT-002 (Imported & Reconditioned Vehicle Awareness):** In South Asian and regional markets, a significant proportion of passenger vehicles are imported reconditioned units (such as JDM imports). The VKR models source-market electrical and ECU characteristics rather than assuming local domestic factory specifications (`PRD-GEN-001`).

---

## 14. VEHICLE IDENTIFIERS

- **VKR-ID-001 (Contextual Identifier Support):** The VKR supports multiple standard and market-specific vehicle identifier formats as illustrative, non-binding reference patterns:
  - `Vehicle Identification Number (VIN)`: Standard 17-character ISO 3779 identifier.
  - `Chassis / Frame Number`: Non-standard chassis frame numbers common in Japanese domestic market and regional commercial vehicles.
  - `Engine Model Code`: OEM engine family designation (e.g., `1NZ-FE`, `1GD-FTV`).
  - `Model Code / Frame Code`: Manufacturer chassis designation.
- **VKR-ID-002 (No Forced Universal VIN Structure):** The VKR SHALL NOT reject or fail vehicles that lack standard 17-digit ISO VINs, safely supporting chassis frame numbers and commercial serial codes without rigid schema failures.

---

## 15. EVIDENCE MODEL

- **VKR-EVD-001 (Contextual Evidence Classes):** Vehicle knowledge facts and compatibility claims are substantiated by auditable evidence records categorized into contextual evidence classes:
  - *Manufacturer Technical Documentation & Workshop Manuals:* Authoritative for factory wiring, fuse box layouts, nominal voltages, and ECU pinouts.
  - *Official Homologation & Type-Approval Data:* Authoritative for vehicle weight, dimensions, engine displacement, and propulsion class.
  - *Controlled Technician Commissioning Inspections:* High applicability for verifying real-world wiring feasibility, ignition tap points, and relay fitment.
  - *Live Diagnostic Handshake & Protocol Traces:* Confirmatory for active CAN-bus PID availability, OBD-II parameter responses, and baud rates.
  - *Dealer / Seller Claims:* Observational only; insufficient alone to establish verified technical facts.
- **VKR-EVD-002 (No Rigid Universal Evidence Hierarchy):** Evidence strength depends on the specific vehicle attribute being evaluated (e.g., workshop manuals are authoritative for electrical pinouts, while live diagnostic traces are authoritative for aftermarket OBD PID exposure).

---

## 16. SOURCE PROVENANCE

- **VKR-SRC-001 (Durable Source Provenance & Licensing):** Every vehicle reference record and compatibility rating in the VKR preserves provenance metadata:
  - Source type and authoritative document reference.
  - Applicable Make, Model, Generation, Variant, and Market scope.
  - Verification timestamp and verifying technical authority identifier.
  - Known limitations or conflicting source annotations.
  *Source provenance explains why a vehicle specification was verified without asserting infinite storage lifetimes or requiring raw copyrighted manual reproduction (`PRD-AUD-002`, `DCR-EVD-003`).*

---

## 17. CONFIDENCE & VERIFICATION

- **VKR-SRC-002 (Verification States & Conceptual Classifications):** Vehicle specifications and compatibility assessments are governed by explainable conceptual classifications:
  - `Unknown Fact / Compatibility Not Established`: Insufficient evidence to establish vehicle specifications or compatibility.
  - `Unverified Fact`: Reference model exists, but specific variant electrical, CAN, or relay feasibility lacks technical verification.
  - `Verified Incompatibility`: Affirmatively verified that the vehicle architecture cannot support the interface or installation.
  - *Operational Classifications:* Verified/Supported and Deprecated are conceptual operational classifications without prescribing mandatory database enum schemas (`DCR-CAP-003`).

---

## 18. CONFLICTING VEHICLE KNOWLEDGE

- **VKR-SRC-003 (Conflict Visibility & Restricted Reconciliation):** When conflicting technical evidence is discovered between sources (e.g., differing CAN baud rates across model years), the VKR MUST flag the conflict visibly. The platform SHALL NOT silently pick the newest source or average values; conflicting records remain restricted until technical reconciliation is completed by authorized personnel (`PRD-DKR-001`).

---

## 19. CORRECTION & TRACEABILITY

- **VKR-SRC-004 (Traceable Technical Correction):** When higher-fidelity evidence, official service bulletins, or field inspection reports correct prior vehicle data, the VKR updates reference specifications with full historical traceability without rewriting prior audit trails or compromising tenant isolation (`PRD-AUD-002`).

---

## 20. VEHICLE ELECTRICAL KNOWLEDGE

- **VKR-ELC-001 (Electrical System Modeling):** The VKR models verified electrical characteristics relevant to telematics hardware installation:
  - `Nominal System Voltage`: Evidence-based classification (such as 12V DC for light passenger vehicles, 24V DC for commercial heavy trucks/buses, or multi-battery setups).
  - `Operating Voltage Range`: Verified operating tolerance (e.g., 9V–36V hardware compatibility matching).
  - `Battery Configuration`: Single battery, dual starting batteries in parallel, or series configurations.
  - `Alternator & Charging Profiles`: Typical charging float voltages.
  *The platform SHALL NEVER assume a vehicle is 12V without verified classification or evidence (`DCR-SEN-002`).*

---

## 21. EV / HYBRID / NON-ICE SAFETY

- **VKR-ELC-002 (EV & Hybrid Low-Voltage Accessory Boundary):** For Electric Vehicles (BEV) and Hybrid Vehicles (HEV/PHEV):
  - Telematics hardware connects EXCLUSIVELY to manufacturer-approved low-voltage accessory/auxiliary circuits (e.g., auxiliary 12V/24V low-voltage systems).
  - Telematics hardware SHALL NEVER tap into, modify, or interface with high-voltage traction batteries or hazardous high-voltage cabling.
  - Vehicle state modeling adapts: "Ignition Run" corresponds to "System Ready / Drive Ready" state rather than internal combustion engine cranking.
  - Work involving high-voltage traction systems remains outside the scope of telematics installation and requires authorized technical procedures.

---

## 22. CAN / OBD / VEHICLE INTERFACES

- **VKR-IFC-001 (Evidence-Driven CAN & OBD Availability):** Vehicle bus interface capabilities MUST be verified per vehicle variant (`PRD-TRK-001`):
  - `Physical Connector Presence != Data Availability`: A standard 16-pin OBD-II socket does NOT guarantee that the vehicle ECU exposes telemetry PIDs (speed, RPM, fuel level, odometer) over standard OBD-II protocols.
  - `Protocol Standards (Illustrative)`: Models whether vehicle uses standard ISO 15765-4 (CAN), SAE J1939 (Heavy Duty FMS), ISO 14230 (KWP2000), ISO 9141-2, or proprietary vendor bus dialects where verified.
  - `Contactless CAN Fitment Consideration`: Identifies whether vehicle wiring permits non-intrusive inductive/contactless CAN reader accessories to protect factory wiring integrity.
  *The platform SHALL NEVER assume standard OBD telemetry from the mere presence of an OBD socket.*

---

## 23. FUEL KNOWLEDGE

- **VKR-FUL-001 (Vehicle Fuel System Modeling):** The VKR models verified vehicle fuel telemetry characteristics:
  - `Fuel Tank Geometry & Capacity`: Factory tank volume in liters and dual-tank configurations where applicable.
  - `Fuel Level Sensor Type`: Analog resistive float, ultrasonic sender mounting feasibility, or digital CAN-bus broadcast.
  - `Fuel Return Line & Flow Sensor Fitment`: Identifies return-line diesel architectures where flow-meter sensors can be installed.
  *Vehicle fuel system knowledge is distinct from tracking device fuel sensor capabilities (`DCR-SEN-003`).*

---

## 24. ODOMETER / DISTANCE SOURCES

- **VKR-IFC-002 (Odometer Source Disambiguation):** The VKR distinguishes possible vehicle distance sources:
  - `Vehicle Cluster Odometer`: Physical dashboard odometer reading.
  - `ECU Diagnostic Odometer`: Odometer value broadcast on CAN-bus or queried via OBD-II PID.
  - `Device Calculated Distance`: Accumulated mileage computed by GPS tracker firmware.
  - `Platform Calculated Distance`: SaaS platform-derived mileage accumulated from raw GPS telemetry points.
  *The platform SHALL NOT assume all vehicles broadcast ECU odometer data (`DCR-SEN-001`).*

---

## 25. IGNITION / ACC KNOWLEDGE

- **VKR-ELC-003 (Ignition Sense Architecture):** The VKR models vehicle ignition signal mechanisms:
  - `Physical ACC Wire`: Switched ignition line accessible at fuse box or harness.
  - `Virtual Ignition Sense`: Voltage rise threshold detection or accelerometer vibration motion detection for vehicles lacking accessible ACC lines.
  - `CAN-Bus Ignition Status`: Broadcasted digital vehicle operating state over CAN/FMS.
  - `Push-to-Start / Smart Key Architecture`: Special electrical considerations where traditional key cylinders are absent.

---

## 26. DEVICE / VEHICLE COMPATIBILITY

- **VKR-CMP-001 (Applicable Compatibility Assessment):** Device–Vehicle compatibility assessment is evaluated across all applicable technical dimensions:
  $$\text{Compatible}(D, V) = \text{ElectricalMatch}(D, V) \land [\text{InterfaceMatch}(D, V)] \land [\text{InstallationFeasible}(D, V)] \land [\text{AccessoryFit}(D, V)]$$
  *Compatibility is context-dependent: a GPS tracker can be fully compatible for basic location tracking on a vehicle while being unsupported for CAN-bus fuel monitoring or engine immobilization.*

---

## 27. ENGINE DISABLE / RESTORE COMPATIBILITY

- **VKR-CMD-001 (Vehicle-Side Immobilization Feasibility):**
  - Canonical Terminology: **`Engine Disable`** and **`Engine Restore`** (`PRD-CMD-001`, `URPA-CMD-001`, `DCR-CMD-003`).
  - Vehicle-Side Feasibility Requirements:
    1. Verified vehicle electrical circuit suitable for relay interruption (e.g., low-pressure fuel pump relay circuit or starter solenoid circuit).
    2. Verification that circuit interruption does NOT disable vehicle power steering, electronic braking (ABS/ESC), or critical safety ECUs while in motion.
    3. Push-to-start, smart key, hybrid, and electric vehicle architectures require specialized immobilizer compatibility profiles.
  *Vehicle compatibility confirms only technical wiring feasibility; it DOES NOT grant command authorization or bypass the 9-term command gate (`URPA-CMD-001`, `TISB-CMD-001`).*
- **VKR-CMD-002 (Zero Speed Threshold Assumption):** The VKR contains zero fixed numeric speed thresholds for engine immobilization. Speed safety policies are enforced downstream by the Command Execution & Safety Engine (`DCR-CMD-004`).

---

## 28. INSTALLATION KNOWLEDGE BOUNDARY

- **VKR-INS-001 (Conceptual Fitment & Safety Guidance):** The VKR records conceptual installation considerations (e.g., voltage matching requirements, fuse tap locations, contactless CAN recommendations) to guide field technicians.
- **VKR-INS-002 (Prohibition of Dangerous Bypass Instructions):** The VKR SHALL NEVER include dangerous electrical bypass instructions, immobilizer defeat hacks, or vehicle safety interlock modifications that violate automotive safety standards (`DCR-GEN-003`).

---

## 29. DEVICE REPLACEMENT IMPACT

- **VKR-CMP-002 (Device Replacement Compatibility Re-Evaluation):** When a customer replaces a tracking device (e.g., under RMA or hardware upgrade), Device–Vehicle compatibility MUST be independently re-evaluated for the new device model and variant (`DCR-LCY-002`). The new device SHALL NOT blindly inherit compatibility ratings from the retired unit.

---

## 30. VEHICLE REPLACEMENT / CHANGE IMPACT

- **VKR-CMP-003 (Vehicle Transfer Compatibility Re-Evaluation):** When a tracking device is physically transferred to a different vehicle, compatibility MUST be re-evaluated against the new vehicle's make, model, generation, and electrical architecture (`DCR-LCY-003`). Purely administrative metadata corrections for the same physical vehicle do not alter verified technical compatibility.

---

## 31. PLATFORM-DERIVED FEATURES

- **VKR-CAP-001 (Platform-Derived vs Vehicle-Native Separation):** The platform maintains a strict boundary between vehicle-native characteristics and SaaS platform-computed features (`DCR-CAP-006`):
  - **Vehicle-Native Facts:** Factory fuel tank volume, engine displacement, CAN baud rate, electrical bus type, starter relay circuit type.
  - **Platform-Derived Features:** Route playback, circular/polygon geofence alerts, trip fuel consumption estimates, speed limit violation scoring, scheduled maintenance reminders.
  *Platform features SHALL NOT be misrepresented as vehicle hardware capabilities.*

---

## 32. VEHICLE CLASSIFICATION

- **VKR-TAX-006 (Standardized Vehicle Functional Classes):** The VKR supports conceptual, extensible technical vehicle classifications:
  - `Passenger Vehicle`: Sedans, hatchbacks, microbuses, SUVs, private cars.
  - `Commercial Light Goods`: Pickups, delivery vans, small covered vans.
  - `Commercial Heavy Goods`: Multi-axle freight trucks, prime movers, flatbeds, dump trucks.
  - `Public Passenger Transport`: City buses, inter-district coaches, minibuses.
  - `Three-Wheeler / Light Transport`: Auto-rickshaws, easy bikes, electric three-wheelers.
  - `Two-Wheeler`: Motorcycles, delivery scooters.
  - `Specialized Heavy Equipment`: Construction cranes, excavators, agricultural tractors, generator sets.
  *Commercial subscription packages (e.g., Fleet Packs) do not redefine physical vehicle classifications (`CTCM-VEH-001`).*

---

## 33. OPTIONAL WEIGHT / DIMENSION / CAPACITY KNOWLEDGE

- **VKR-TAX-007 (Optional Technical Specifications):** Gross Vehicle Weight (GVW), unladen curb weight, axle count, passenger seating capacity, and fuel tank capacity are recorded only where officially sourced and relevant to fleet telematics. These attributes remain optional extensions and are not mandatory for basic GPS tracking compatibility (`PRD-DKR-001`).

---

## 34. REGISTRATION / OWNERSHIP BOUNDARY

- **VKR-REG-001 (Legal Ownership & Registration Separation):** The VKR is a technical reference registry and SHALL NOT act as a legal vehicle ownership or title registry (`PRD-GEN-001`).
- **VKR-REG-002 (Government Registration Agency Non-Authority):** Government vehicle registration records do not automatically prove technical compatibility or device fitment. The platform asserts zero unverified live government API endpoints.

---

## 35. TENANT / PRIVACY BOUNDARY

- **VKR-TEN-001 (Strict Tenant Perimeter Isolation for Vehicle Instances):** Tenant vehicle instances, private license plate numbers, chassis/VIN bindings, customer identities, and vehicle telemetry remain strictly isolated within the assigned tenant perimeter (`TISB-TEN-001`, `TISB-TEN-008`).
- **VKR-TEN-002 (Shared Reference Safety):** Shared vehicle reference catalogues contain zero tenant identifiers, private customer details, or vehicle operational histories (`TISB-TEN-008`).

---

## 36. VEHICLE SEED CATALOGUE

- **VKR-CAT-001 (Seed Catalogue Extensibility):** In accordance with `DEC-013`, the initial production vehicle seed catalogue scope is intentionally decoupled and extensible (`PRD-DKR-001`). The VKR architecture supports starting with a curated seed catalogue of common vehicles (e.g., common passenger cars, light commercial vans, heavy trucks) and expanding seamlessly without altering the core taxonomy or schema.

---

## 37. UNKNOWN VEHICLE / VARIANT

- **VKR-CAT-002 (Fail-Safe Unknown Vehicle Handling):** If a vehicle make, model, or variant is unrecognized in the VKR:
  - The vehicle record enters a restricted technical verification context (`PRD-DKR-002`).
  - Vehicle–device compatibility defaults to `Unknown / Unverified`.
  - The platform SHALL NEVER guess a vehicle generation or variant purely from model name, registration year, or AI suggestions.

---

## 38. SOURCE STALENESS / SUPERSESSION

- **VKR-SRC-005 (Graceful Knowledge Supersession):** When vehicle manufacturers release updated technical bulletins or superseding workshop manuals, existing reference records are updated with clear supersession provenance. Historical installation records remain explainable without data loss (`PRD-AUD-002`).

---

## 39. MULTI-MARKET / IMPORTED VEHICLES

- **VKR-MKT-003 (Multi-Market Cross-Referencing):** For imported and reconditioned vehicles, the VKR records both the source manufacturing market (such as Japan Domestic Market) and the operating destination market, preserving accurate ECU and electrical specifications (`PRD-GEN-001`).

---

## 40. REBRAND / OEM CROSS-REFERENCE

- **VKR-TAX-008 (Platform Sharing & Badge Engineering):** Where vehicles share identical underlying chassis and electrical architectures across brands, the VKR records explicit architectural cross-references without assuming absolute equivalence across all accessories or engine trims.

---

## 41. AI BOUNDARY

- **VKR-AI-001 (AI Non-Authority on Vehicle Knowledge):** Artificial intelligence or machine learning systems SHALL NOT have authority to verify vehicle reference facts, declare device–vehicle compatibility, override electrical constraints, or authorize engine immobilization (`URPA-AUTH-001`, `TPA-AI-001`, `DCR-AI-001`).
- **VKR-AI-002 (AI Sensitive Data Protection):** In accordance with `DEC-014`, private customer vehicle instances, license plates, chassis numbers, and live telemetry SHALL NEVER be transmitted to unapproved or free cloud AI models (`TISB-SEC-001`). AI assistance is restricted to human-in-the-loop document summarization on verified technical manuals.

---

## 42. REGULATORY BOUNDARY

- **VKR-REG-003 (Regulatory Preconditions):** Vehicle electrical modifications, telematics device fitment, and engine immobilizer installations must comply with applicable vehicle safety regulations and road transport laws in the operating jurisdiction (LEGAL / REGULATORY VERIFICATION REQUIRED) (`PRD-GEN-001`). The platform asserts zero unverified regulatory approvals.

---

## 43. RESPONSIBILITY / VERIFICATION AUTHORITY

- **VKR-ADM-001 (Privileged Technical Verification):** Adding vehicle reference models, approving electrical profiles, and certifying device–vehicle compatibility is restricted to platform technical authorities (`applicable approved technical registry authority`). Ordinary customer users, sales representatives, and dealers have read-only visibility into compatibility catalogues.

---

## 44. AUDITABILITY

- **VKR-AUD-001 (Durable Registry Audit Trail):** All vehicle reference profile creations, compatibility certifications, technical corrections, and evidence attachments MUST generate durable, append-protected, tamper-evident audit records in accordance with approved platform audit policies (`PRD-AUD-002`, `URPA-AUD-001`).

---

## 45. SCALE & PORTABILITY

- **VKR-SCL-001 (Multi-Market Scalable Architecture):** The VKR is architected to scale from an initial curated seed catalogue to tens of thousands of global vehicle models, generations, and variants across diverse propulsion types without single-database or single-market performance bottlenecks (`PRD-NFR-001`).

---

## 46. CORE VS EXTENSION KNOWLEDGE

- **VKR-EXT-001 (Core vs Specialized Extension Segregation):** Baseline vehicle reference data (Make, Model, Generation, Voltage, Fuel Type, Ignition Architecture) is maintained in the Core Vehicle Model, while manufacturer-specific proprietary CAN PIDs, specialized refrigeration sensor interfaces, and crane PTO inputs are managed via modular extensions (`TPA-EXT-002`, `DCR-EXT-001`).

---

## 47. VEHICLE IDENTITY / TAXONOMY MATRIX

| Taxonomic Level | Canonical Definition | Scope & Mutability | Illustrative Reference Example | Validation Rule |
| :--- | :--- | :--- | :--- | :--- |
| **Make / OEM** | Vehicle manufacturing corporation | Global / Immutable | Toyota, Hino, Isuzu, Hyundai, Tata | Verified OEM Catalogue |
| **Model** | Commercial product line badge | Global / Immutable | Corolla, HiAce, Fielder, Dutro, N-Series | OEM Model Line Spec |
| **Generation** | Engineering chassis/platform era | Global / Immutable | Corolla E160 (2012–2018) vs E210 (2018+) | Platform Engineering Spec|
| **Variant / Trim** | Engine, powertrain & electrical trim| Market / Versioned | 1.5L 1NZ-FE Petrol vs 1.5L 1NZ-FXE Hybrid| Workshop Manual / VIN |
| **Market / Region**| Target geographic manufacturing spec| Regional / Immutable| JDM (Japan), South Asian Export, Euro Spec| Homologation / Market Doc|
| **Model Year** | Manufacturer engineering spec year | Versioned | MY2016, MY2020 | Manufacturer Spec Sheet |
| **Production Year**| Actual factory assembly calendar year| Physical / Immutable| 2015 assembly for MY2016 vehicle | Vehicle Build Plate / VIN|
| **Registration Year**| Local authority registration year | Administrative | Official Registration Certificate | Registration Document |

---

## 48. EVIDENCE / SOURCE MATRIX

| Evidence Class | Primary Applicability Domain | Source / Authority | Verifiable Artifacts | Evaluative Weight & Scope |
| :--- | :--- | :--- | :--- | :---: |
| **Official Workshop Manual / Wiring Diagram**| Electrical Pinouts, Fuse Box, ACC & Relays| OEM Vehicle Engineering | Factory Service Manual, Circuit Schematic | **Authoritative for Wiring / Electrical** |
| **Official Homologation / Spec Sheet** | Dimensions, GVW, Engine, Fuel Capacity | Government / OEM | Type-Approval Certificate, Brochure | **Authoritative for Physical Specs** |
| **Controlled Field Installation Report** | Real-World Relay Feasibility & Access | Certified Master Installer | Digital Commissioning Form, Photos | **Authoritative for Fitment Feasibility** |
| **Live CAN / OBD Diagnostic Trace** | Active CAN PIDs, Baud Rate, OBD Telemetry | Diagnostic Scanner / Sniffer| CAN Bus Log, OBD-II PID Response Dump | **Authoritative for Interface PIDs** |
| **Vehicle Data Aggregator Database** | Multi-Model Reference Specifications | Approved 3rd-Party Data | Commercial Reference Dataset | **Confirmatory / Requires Validation** |
| **Dealer / Seller Marketing Claim** | Commercial Product Description | Vehicle Importer / Dealer | Sales Flyer, Listing Description | **Observational / Non-Authoritative** |
| **AI Extraction Suggestion** | Document Text Extraction | AI Document Parser | Extracted Text Draft for Review | **Advisory Only / Human Sign-Off Req** |

---

## 49. SHARED VS INSTANCE DATA MATRIX

| Data Attribute Category | Shared Reference Knowledge (Global Catalogue) | Tenant Vehicle Instance (Customer Private) | Boundary / Governance Rule |
| :--- | :---: | :---: | :--- |
| **Make, Model, Generation, Trim** | **YES** | References Shared Record | Global reference; zero private data. |
| **Nominal Electrical Voltage (12V/24V)** | **YES** | Inherited from Reference | Universal electrical characteristic. |
| **CAN Bus Interface & Standard PIDs** | **YES** | Inherited from Reference | Protocol availability template. |
| **Fuel Tank Capacity & Sender Type** | **YES** | Reference baseline (Custom tank opt) | Standard factory fuel geometry. |
| **Engine Disable Relay Wiring Type** | **YES** | Reference wiring feasibility profile| General immobilization feasibility. |
| **Vehicle Registration / License Plate**| **NO (STRICTLY PROHIBITED)** | **YES** | Private customer PII; Tenant isolated. |
| **Chassis / Frame / VIN Number** | **NO (STRICTLY PROHIBITED)** | **YES** | Private vehicle instance identity. |
| **Assigned Tracking Device (IMEI)** | **NO (STRICTLY PROHIBITED)** | **YES** | Private telematics binding. |
| **Current Location & Live Telemetry** | **NO (STRICTLY PROHIBITED)** | **YES** | Private operational telemetry. |
| **Driver Assignment & Trip History** | **NO (STRICTLY PROHIBITED)** | **YES** | Private fleet operations data. |

---

## 50. ELECTRICAL / INTERFACE MATRIX

| Vehicle Propulsion / Type | Nominal Low-Voltage Bus | Alternator / DC-DC Charging Voltage | Ignition / Run-State Sensing Method | CAN / OBD Interface Characteristics | Engine Disable Feasibility Considerations |
| :--- | :---: | :---: | :---: | :---: | :--- |
| **Standard ICE (Petrol / Diesel 12V)**| 12V DC | 13.8V – 14.4V | Switched 12V ACC / Voltage Rise | Standard ISO 15765-4 / OBD-II Port | Fuel pump relay interruption feasible. |
| **Commercial Heavy Truck (Diesel 24V)**| 24V DC | 27.6V – 28.8V | Switched 24V ACC / D+ Terminal | SAE J1939 FMS / 9-pin Deutsch / OBD | Fuel shut-off solenoid / ECU starter relay. |
| **Full Hybrid (HEV - e.g., Prius, Axio)**| Low-Voltage Auxiliary Bus | Regulated Low-Voltage DC-DC Bus | "Ready" State / CAN Ignition Signal | Enhanced Hybrid CAN PIDs / OBD-II | Low-voltage starter relay or ECU fuel cutoff. |
| **Battery Electric (BEV - e.g., Leaf)** | Low-Voltage Auxiliary Bus | Regulated Low-Voltage DC-DC Bus | "System Ready" / CAN Bus Wakeup | EV CAN (State of Charge, Battery Temp)| Low-voltage control circuit isolation only. |
| **Three-Wheeler / CNG Auto-Rickshaw** | 12V DC | 13.5V – 14.2V | Mechanical Ignition Key Switch | Non-CAN / Direct Analog Wiring | Ignition coil grounding / Fuel solenoid relay.|
| **Motorcycle / Scooter (12V)** | 12V DC | 13.8V – 14.4V | Key Switch / Low-capacity battery | Non-CAN / Direct Micro-harness | Ignition kill switch / Starter relay. |

---

## 51. DEVICE–VEHICLE COMPATIBILITY MATRIX

| Vehicle Reference Profile | Device Hardware Profile | Required Wiring / Accessories | Supported Features | Unsupported Features | Overall Compatibility Rating |
| :--- | :--- | :--- | :--- | :--- | :---: |
| **Toyota Corolla E160 (12V Petrol)** | Teltonika FMB920 (12V/24V) | Hardwired Power + ACC + Relay | GNSS, ACC, Voltage, Engine Disable | CAN-bus telemetry, Video | **VERIFIED COMPATIBLE** (Core + Immobilization) |
| **Toyota Corolla E160 (12V Petrol)** | Basic OBD-II Plug Tracker | Direct OBD-II Port Plug-in | GNSS, Virtual Ignition, Battery Volts | Relay Engine Disable, Fuel Float | **VERIFIED COMPATIBLE** (Plug Only) |
| **Hino 500 Truck (24V Diesel)** | 12V-Only Low-Voltage Tracker | Direct 24V Battery Tap | NONE (Hardware Burn Risk!) | ALL (Voltage Incompatible) | **UNSUPPORTED / DANGEROUS** |
| **Hino 500 Truck (24V Diesel)** | Teltonika FMB920 (10V–30V Rated)| 24V Power + ACC + 24V Relay | GNSS, ACC, 24V Voltage, 24V Disable | CAN FMS (Requires CAN adapter) | **VERIFIED COMPATIBLE** (24V Core) |
| **Toyota Axio Hybrid (12V HEV)** | Standard 12V Relay Tracker | Auxiliary 12V + Ready Line | GNSS, Auxiliary Volts, System Ready | Traction Battery Volts (High Voltage) | **VERIFIED COMPATIBLE** (Aux Only) |
| **Any Unrecognized Vehicle Model**| Any Verified GPS Tracker | Unknown | Unknown | Unknown | **UNVERIFIED / PENDING REVIEW** |

---

## 52. ENGINE DISABLE / RESTORE BOUNDARY MATRIX

| Architectural Dimension | Vehicle Knowledge Registry (VKR) | Device Capability Registry (DCR) | Authorization & Execution Engine (URPA/TISB/TPA) |
| :--- | :--- | :--- | :--- |
| **Primary Question Answered** | *"Is this vehicle electrically suitable for immobilization?"* | *"Does the device hardware & relay support immobilization?"* | *"Is the user, tenant, speed state & safety policy authorized?"* |
| **Required Verification Artifact**| Workshop Manual / Relay Circuit Feasibility Profile| Bench Test / Hardware Digital Output Proof | 9-term Command Authorization Evaluation Token |
| **Handling of Push-to-Start / HEV**| Models vehicle-specific circuit safety constraints| Asserts digital output driver capability | Enforces multi-factor step-up & safety interlocks |
| **Command Issuance Permitted?** | **NO (Zero Execution Authority)** | **NO (Technical Capability Only)** | **YES (Only if all 9 terms evaluate TRUE)** |
| **Speed Safety Threshold Gate** | N/A (Does not evaluate vehicle motion speed) | N/A (Does not evaluate live telemetry speed) | **Evaluates real-time telemetry speed & safety policy**|

---

## 53. KNOWLEDGE CHANGE / LIFECYCLE MATRIX

| Vehicle Lifecycle / Change Event | Impact on Shared Vehicle Reference Knowledge | Impact on Tenant Vehicle Instance Record | Action Required in VKR / SaaS Platform |
| :--- | :--- | :--- | :--- |
| **New Vehicle Model Added to Market** | New Reference Profile created under review | No impact on existing instances | Technical authority verifies specs & publishes. |
| **Manufacturer Service Bulletin Issued**| Reference Profile updated with new wiring note| Flags child instances for technician awareness | Version update with provenance audit log. |
| **Customer Purchases New Vehicle** | References existing Shared Profile | New Tenant Vehicle Instance created | Assigns VIN/Plate to reference model ID. |
| **Customer Replaces Tracking Device** | No change to shared vehicle knowledge | Compatibility re-evaluated for new device | Independent device-vehicle compatibility check. |
| **Device Transferred to Different Vehicle**| No change to shared vehicle knowledge | Instance re-associated; install reset to unverified| Re-evaluate compatibility for new vehicle model. |
| **Administrative License Plate Update** | No change to shared vehicle knowledge | Instance metadata updated (Same vehicle) | Update plate string; preserve verified wiring. |

---

## 54. RESPONSIBILITY MATRIX

| Capability / Governance Domain | Platform Technical Authority | Certified Field Installer | Tenant Fleet Administrator | Customer End-User | AI Model Assistant |
| :--- | :---: | :---: | :---: | :---: | :---: |
| **Create Vehicle Reference Profiles** | **PRIMARY** | Inspection Input | NO ACCESS | NO ACCESS | Advisory Suggestions |
| **Certify Device–Vehicle Compatibility**| **PRIMARY** | Inspection Input | NO ACCESS | NO ACCESS | Advisory Suggestions |
| **Submit Commissioning Inspection Form**| Audit & Review | **PRIMARY** | NO ACCESS | NO ACCESS | NO ACCESS |
| **Bind Customer Vehicle to Reference** | System Auto / Match | Verification Input| **PRIMARY** | Self-Service Select| Candidate Matching |
| **View Vehicle Compatibility Catalogue**| **YES** | **YES** | **YES** | **YES** | Read-Only Access |
| **Override Electrical Safety Constraints**| **STRICTLY PROHIBITED**| **STRICTLY PROHIBITED**| **STRICTLY PROHIBITED**| **STRICTLY PROHIBITED**| **STRICTLY PROHIBITED**|

---

## 55. NON-FUNCTIONAL REQUIREMENTS

- **VKR-NFR-001 (Verification Integrity):** 100% of vehicle reference specifications and compatibility ratings exposed in customer applications MUST be backed by auditable evidence records.
- **VKR-NFR-002 (Fail-Closed Compatibility Default):** Any unrecognized vehicle model, unverified electrical variant, or conflicting wiring profile MUST fail closed to `Unknown` or `Unverified`, preventing unverified installations and blocking command dispatch.
- **VKR-NFR-003 (Strict Tenant Isolation):** Shared vehicle reference catalogues SHALL NEVER leak tenant identities, customer names, private license plates, or vehicle operational histories (`TISB-TEN-008`).
- **VKR-NFR-004 (Durable Audit Logging):** All vehicle reference profile creations, compatibility certifications, and technical corrections MUST generate durable, append-protected, tamper-evident audit records (`PRD-AUD-002`).
- **VKR-NFR-005 (Evaluation Performance):** Dynamic device–vehicle compatibility evaluations MUST evaluate efficiently via cached compatibility records without locking operational transactional SaaS business tables (`PRD-NFR-001`).
- **VKR-NFR-006 (Extensibility & Portability):** The vehicle knowledge architecture MUST support diverse international vehicle makes, regional imports, commercial heavy trucks, and electric vehicles without requiring schema redesigns.
- **VKR-NFR-007 (Technology Neutrality):** The VKR specification SHALL NOT mandate specific database engines, ORM frameworks, message brokers, or infrastructure services.
- **VKR-NFR-008 (Tamper-Resistant Provenance):** Evidence records retained under approved policy MUST preserve unalterable provenance indicating who verified the vehicle specification and when.

---

## 56. ACCEPTANCE CRITERIA

- **VKR-ACC-001 (Vehicle Knowledge Registry Acceptance Gates):**
  1. *Vehicle Knowledge != Device Capability:* Vehicle reference knowledge and device hardware capabilities remain strictly decoupled.
  2. *Shared Reference != Vehicle Instance:* Shared reference catalogues contain zero private customer license plates, VINs, or telemetry.
  3. *Granular Taxonomy:* Distinctly models Make, Model, Generation, Variant, Market, Model Year, Production Year, and Registration Year.
  4. *Model Year != Registration Year:* Registration year in official records is never used as the sole determinant of vehicle generation or specifications.
  5. *Market & Regional Awareness:* Explicitly supports source market variants and regional reconditioned/imported vehicles.
  6. *No Badge-Based Equivalence:* Similar commercial badges do not establish technical compatibility without variant evidence.
  7. *Flexible Identifier Support:* Accommodates standard 17-digit VINs, chassis frame numbers, and commercial chassis codes without rigid schema lock-in.
  8. *Contextual Evidence Classes:* Evaluates evidence based on domain applicability without rigid linear hierarchies.
  9. *No AI Verification Authority:* AI models cannot independently verify vehicle facts or certify compatibility.
  10. *Dealer Claims Non-Authoritative:* Seller marketing brochures and customer descriptions cannot verify technical specifications.
  11. *Conflict Visibility:* Conflicting technical evidence between sources remains visible and restricted until resolved.
  12. *Electrical System Modeling:* Strictly models nominal system voltage (12V, 24V, multi-battery) based on verified evidence.
  13. *No Universal 12V Assumption:* The platform never assumes a vehicle is 12V without verified classification.
  14. *EV / Hybrid Safety Boundary:* Enforces low-voltage auxiliary connection boundaries; bans high-voltage traction battery taps.
  15. *CAN / OBD Interface Evidence:* Models protocol standards and distinguishes socket presence from active data exposure.
  16. *OBD Plug != Telemetry Data:* The presence of a 16-pin OBD socket does not imply available telemetry PIDs.
  17. *Fuel System Modeling:* Decouples vehicle fuel tank geometry from device analog/ultrasonic/CAN sensor capabilities.
  18. *Odometer Source Disambiguation:* Strictly distinguishes cluster odometer, ECU diagnostic odometer, and GPS-calculated mileage.
  19. *Ignition Architecture Disambiguation:* Models switched ACC, virtual voltage rise, CAN run-state, and push-to-start architectures.
  20. *Vehicle Compatibility != Command Authorization:* Vehicle-side immobilization feasibility does not bypass 9-term command authorization.
  21. *Canonical Engine Terms:* Uses strictly **`Engine Disable`** and **`Engine Restore`**; zero occurrences of informal engine immobilization phrasing.
  22. *Zero Numeric Speed Thresholds:* The VKR contains zero fixed numeric speed thresholds for engine immobilization.
  23. *No Unsafe Bypass Instructions:* The VKR contains zero dangerous electrical bypass or safety defeat instructions.
  24. *Applicable Compatibility Assessment:* Device–vehicle compatibility evaluates all applicable electrical, interface, and fitment layers.
  25. *Device Replacement Check:* Replacing a device triggers independent compatibility re-evaluation for the new unit.
  26. *Vehicle Transfer Check:* Transferring a device to another vehicle triggers independent compatibility re-evaluation.
  27. *Logical Rebinding Disambiguation:* Purely administrative plate updates for the same vehicle preserve verified wiring status.
  28. *Platform-Derived Feature Separation:* Geofencing, overspeed scoring, and trip reports are recognized as platform SaaS features.
  29. *Standardized Vehicle Classes:* Supports passenger, commercial light goods, heavy trucks, buses, three-wheelers, and two-wheelers.
  30. *Commercial Pack != Vehicle Class:* Commercial Fleet Pack subscriptions do not redefine physical vehicle taxonomy.
  31. *Registration != Ownership Authority:* Government registration records do not establish technical compatibility or ownership rights.
  32. *Zero Invented Government Endpoints:* The platform asserts zero unverified live government registration API integration endpoints.
  33. *Regulatory Preconditions:* Equipment fitment is framed as `LEGAL / REGULATORY VERIFICATION REQUIRED`.
  34. *Seed Catalogue Extensibility:* Fully supports `DEC-013` seed catalogue launch and future expansion without schema redesign.
  35. *Fail-Safe Unknown Vehicle:* Unrecognized vehicles default to `Unknown / Unverified` compatibility and enter restricted review.
  36. *Multi-Market Cross-Referencing:* Explicitly cross-references source manufacturing and destination operating markets.
  37. *Platform Sharing Disambiguation:* Shared vehicle platforms (rebadged models) maintain distinct variant verifications.
  38. *AI Sensitive Data Protection:* Enforces `DEC-014` data boundaries, barring private vehicle telemetry from unapproved/free cloud AI models.
  39. *Privileged Verification Authority:* Vehicle reference verification is restricted to platform technical authorities.
  40. *Durable Auditability:* Material reference changes generate durable, append-protected audit trails.
  41. *Scalable Architecture:* Evaluates compatibility efficiently across thousands of vehicles without table locks.
  42. *Core vs Extension Model:* Segregates core normalized vehicle data from specialized vendor extensions.
  43. *Zero IAM Invention:* Contains zero unapproved or invented vehicle registry IAM permission tokens.
  44. *Zero Implementation Leakage:* Contains zero executable application code, SQL DDL, or database schema prescriptions.
  45. *Complete Upstream Traceability:* 100% of requirements map to approved upstream specifications.

---

## 57. UPSTREAM TRACEABILITY

| Specification Requirement ID | Upstream PRD ID(s) | Upstream Entitlement ID(s) | Upstream Roles & Access ID(s) | Upstream Tenant Boundary ID(s) | Upstream Commercial Model ID(s) | Upstream Provider Arch ID(s) | Upstream Device Cap ID(s) | Primary Subject Covered |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **VKR-GEN-001 to VKR-GEN-006** | `PRD-GEN-001`, `PRD-DKR-001` | `MSE-GEN-001`, `MSE-DEV-001` | `URPA-GEN-001` | `TISB-GEN-001` | `CTCM-GEN-001` | `TPA-GEN-001` | `DCR-GEN-001`, `DCR-INT-003` | Core Governance & Purpose |
| **VKR-AUT-001, VKR-AUT-002** | `PRD-DKR-001`, `PRD-DKR-002` | `MSE-DEV-001` | `URPA-DEV-001` | `TISB-CMD-001` | `CTCM-DEV-003` | `TPA-CAP-001` | `DCR-CAP-001`, `DCR-CAP-002` | Vehicle Knowledge Authority |
| **VKR-REF-001, VKR-REF-002** | `PRD-ISO-001` | `MSE-GEN-001` | `URPA-TEN-001` | `TISB-TEN-001`, `TISB-TEN-008` | `CTCM-TEN-001` | `TPA-PRV-002` | `DCR-TEN-001`, `DCR-TEN-002` | Shared Reference vs Tenant Instance |
| **VKR-TAX-001 to VKR-TAX-008** | `PRD-DKR-001` | `MSE-DEV-001` | `URPA-DEV-001` | `TISB-TEN-008` | `CTCM-VEH-001` | `TPA-DEV-001` | `DCR-MDL-003`, `DCR-INT-003` | Vehicle Taxonomy & Classification |
| **VKR-MKT-001 to VKR-MKT-003** | `PRD-GEN-001`, `PRD-DKR-001` | `MSE-DEV-001` | `URPA-DEV-001` | `TISB-TEN-008` | `CTCM-DEV-001` | `TPA-DEV-001` | `DCR-MDL-003` | Market Awareness & Regional Imports |
| **VKR-ID-001, VKR-ID-002** | `PRD-DKR-001` | `MSE-DEV-001` | `URPA-DEV-001` | `TISB-TEL-001` | `CTCM-DEV-001` | `TPA-DEV-001` | `DCR-ID-001`, `DCR-ID-002` | Vehicle Identifiers & Chassis Formats |
| **VKR-EVD-001, VKR-EVD-002** | `PRD-DKR-001`, `PRD-AUD-002` | `MSE-DEV-001` | `URPA-DEV-001` | `TISB-AUD-001` | `CTCM-AUD-001` | `TPA-NRM-003` | `DCR-EVD-001`, `DCR-EVD-002` | Evidence Classes & Weighting |
| **VKR-SRC-001 to VKR-SRC-005** | `PRD-DKR-001`, `PRD-AUD-002` | `MSE-DEV-001` | `URPA-DEV-001` | `TISB-AUD-001` | `CTCM-AUD-001` | `TPA-AUD-001` | `DCR-EVD-003`, `DCR-CAP-003` | Provenance, Conflicts & Correction |
| **VKR-ELC-001 to VKR-ELC-003** | `PRD-TRK-001` | `MSE-TRK-001` | `URPA-PERM-001` | `TISB-TEL-001` | `CTCM-SUB-002` | `TPA-TEL-003` | `DCR-SEN-002`, `DCR-INS-001` | Electrical System, EV & Ignition |
| **VKR-IFC-001, VKR-IFC-002** | `PRD-TRK-001` | `MSE-TRK-001` | `URPA-PERM-001` | `TISB-TEL-001` | `CTCM-SUB-002` | `TPA-ING-002` | `DCR-PRT-001`, `DCR-SEN-001` | CAN, OBD & Odometer Interfaces |
| **VKR-FUL-001** | `PRD-TRK-001`, `PRD-ALT-001` | `MSE-TRK-001` | `URPA-PERM-001` | `TISB-TEL-001` | `CTCM-SUB-002` | `TPA-TEL-003` | `DCR-SEN-003` | Vehicle Fuel Tank & Sendering |
| **VKR-CMP-001 to VKR-CMP-003** | `PRD-DKR-001` | `MSE-DEV-001` | `URPA-DEV-001` | `TISB-CMD-001` | `CTCM-DEV-003` | `TPA-CAP-001` | `DCR-CAP-008`, `DCR-LCY-002` | Device–Vehicle Compatibility |
| **VKR-CMD-001, VKR-CMD-002** | `PRD-CMD-001` | `MSE-CMD-001` | `URPA-CMD-001` | `TISB-CMD-001` | `CTCM-CMD-001` | `TPA-CMD-001`, `TPA-CMD-002` | `DCR-CMD-003`, `DCR-CMD-004` | Engine Disable Feasibility & Speed |
| **VKR-INS-001, VKR-INS-002** | `PRD-CMD-001` | `MSE-CMD-001` | `URPA-CMD-001` | `TISB-CMD-001` | `CTCM-DEV-003` | `TPA-CMD-002` | `DCR-INS-001`, `DCR-GEN-003` | Installation Guidance & Safety |
| **VKR-CAP-001** | `PRD-TRK-001`, `PRD-GEO-001` | `MSE-TRK-001`, `MSE-GEO-001` | `URPA-PERM-001` | `TISB-TEL-001` | `CTCM-SUB-001` | `TPA-CAP-001` | `DCR-CAP-006` | Platform-Derived vs Native |
| **VKR-REG-001 to VKR-REG-003** | `PRD-GEN-001` | `MSE-SYS-001` | `URPA-ADM-001` | `TISB-INT-001` | `CTCM-PAY-005` | `TPA-REG-001` | `DCR-REG-001` | Registration & Regulatory Boundaries |
| **VKR-TEN-001, VKR-TEN-002** | `PRD-ISO-001` | `MSE-GEN-001` | `URPA-TEN-001` | `TISB-TEN-001`, `TISB-TEN-008` | `CTCM-TEN-001` | `TPA-PRV-002` | `DCR-TEN-001`, `DCR-TEN-002` | Tenant Perimeter & Catalogue Safety |
| **VKR-CAT-001, VKR-CAT-002** | `PRD-DKR-001` | `MSE-DEV-001` | `URPA-DEV-001` | `TISB-TEN-008` | `CTCM-DEV-001` | `TPA-DEV-001` | `DCR-INT-003` | Seed Catalogue & Unknown Handling |
| **VKR-AI-001, VKR-AI-002** | `PRD-AUT-001` | `MSE-SYS-001` | `URPA-AUTH-001` | `TISB-SEC-001` | `CTCM-AUD-001` | `TPA-AI-001`, `TPA-AI-002` | `DCR-AI-001` | AI Non-Authority & Privacy |
| **VKR-ADM-001, VKR-AUD-001** | `PRD-AUT-001`, `PRD-AUD-002` | `MSE-ADM-001`, `MSE-AUD-001` | `URPA-DEV-001`, `URPA-AUD-001` | `TISB-AUD-001` | `CTCM-AUD-002` | `TPA-ADM-001` | `DCR-ADM-001`, `DCR-AUD-001` | Privileged Authority & Audit |
| **VKR-SCL-001, VKR-EXT-001** | `PRD-NFR-001` | `MSE-NFR-001` | `URPA-NFR-001` | `TISB-NFR-001` | `CTCM-NFR-001` | `TPA-SCL-001`, `TPA-EXT-001` | `DCR-SCL-001`, `DCR-EXT-001` | Scale & Core-Extension Segregation |
| **VKR-NFR-001 to VKR-NFR-008** | `PRD-NFR-001` to `PRD-NFR-004`| `MSE-NFR-001` to `MSE-NFR-004`| `URPA-NFR-001` to `URPA-NFR-004`| `TISB-NFR-001` to `TISB-NFR-004`| `CTCM-NFR-001` to `CTCM-NFR-004`| `TPA-NFR-001` to `TPA-NFR-008`| `DCR-NFR-001` to `DCR-NFR-008`| Non-Functional Standards |
| **VKR-ACC-001** | `PRD-GEN-001` | `MSE-GEN-001` | `URPA-GEN-001` | `TISB-ACC-001` | `CTCM-ACC-001` | `TPA-ACC-001` | `DCR-ACC-001` | Comprehensive Acceptance Criteria |

---

## 58. OPEN ITEMS

The following open decisions from approved upstream baselines are carried forward with explicit dependency rationale:

| Decision ID | Subject / Topic | Upstream Baseline Status | VKR Dependency / Why Carried |
| :--- | :--- | :--- | :--- |
| **DEC-001** | Final Commercial Product & Brand Name | TBD (Temporary Working Name: EasyTracker) | Carried as global product branding baseline; supported under neutral multi-brand vehicle catalogue architecture. |
| **DEC-003** | Initial Production Hardware Device Catalogue | TBD (S102A is pilot evidence; production requires DKR verification)| Directly relevant to Device–Vehicle compatibility certification during initial production onboarding. |
| **DEC-013** | Initial Vehicle Seed Catalogue Scope | TBD based on initial target customer segments | **Direct Core VKR Dependency:** Governs the initial curated seed models (e.g., common commercial & passenger fleets) for launch. |
| **DEC-014** | Production AI Sensitive Data Class Approval | Zero PII / live telemetry sent to free cloud AI models | Directly governs privacy perimeter for customer vehicle instance chassis numbers, plates, and telemetry. |

---

## 59. LEGAL / REGULATORY VERIFICATION ITEMS

- **Vehicle Electrical Alteration & Immobilizer Compliance:** Verification of road transport safety regulations and electrical system modification standards under the relevant road transport authority (LEGAL / REGULATORY VERIFICATION REQUIRED).
- **Automotive Telematics Importation & Wireless Standards:** Verification of telematics device installation and frequency spectrum compliance under telecommunications regulatory guidelines.
- **Vehicle Ownership Title & Registration Authority:** Verification of statutory vehicle registration guidelines and official data protection rules governing vehicle chassis and plate numbers.

---

## 60. BLOCKING QUESTIONS

> **Zero Blocking Questions.**  
The evidence-driven Vehicle Knowledge Registry, hierarchical taxonomy, electrical system modeling, CAN/OBD interface boundaries, device–vehicle compatibility assessment engine, and tenant isolation boundaries are fully specified based on approved upstream baselines (`PRODUCT_REQUIREMENTS.md` v1.0, `MODULE_SERVICE_ENTITLEMENT_SPEC.md` v1.0, `USER_ROLES_PERMISSIONS_ACCESS_SPEC.md` v1.0, `TENANT_ISOLATION_SECURITY_BOUNDARY_SPEC.md` v1.0, `CUSTOMER_TYPES_COMMERCIAL_MODEL_SPEC.md` v1.0, `TRACKING_PROVIDER_ARCHITECTURE_SPEC.md` v1.0, and `DEVICE_CAPABILITY_REGISTRY_SPEC.md` v1.0). Strategic open items—including `DEC-013` (initial vehicle seed catalogue scope)—are intentional upstream decisions safely accommodated by the registry abstraction layer.

---

## 61. BUILT-IN STATIC AUDIT

| Audit Check Dimension | Verification Rule | Audit Result | Compliance Notes |
| :--- | :--- | :---: | :--- |
| **1. Upstream ID Existence** | 100% of cited upstream IDs exist in PRD, MSE, URPA, TISB, CTCM, TPA, DCR. | **PASS** | Fully validated against approved baseline texts. |
| **2. IAM Permission Exactness** | 100% of IAM tokens match exact approved URPA vocabulary. | **PASS** | Exact tokens: `commands.engine_disable.request`, `commands.engine_restore.request`, etc. |
| **3. Zero Invented IAM Tokens** | No unauthorized vehicle registry IAM tokens present. | **PASS** | Uses neutral wording for unassigned admin roles. |
| **4. Registry Verification Token** | `devices.registry.verify` not overstated as vehicle authority. | **PASS** | Maintained within actual URPA scope. |
| **5. Canonical Engine Commands** | Uses strictly `Engine Disable` and `Engine Restore`. | **PASS** | Zero instances of informal immobilization terms. |
| **6. Zero Speed Thresholds** | Zero fixed numeric speed thresholds for engine immobilization. | **PASS** | Zero mandatory speed thresholds in specification. |
| **7. Vehicle Knowledge != Device Cap**| Decoupled vehicle reference facts from device hardware capabilities. | **PASS** | Enforced in `VKR-GEN-006` & `VKR-CMP-001`. |
| **8. Shared Reference != Instance** | Shared catalogue leaks zero tenant PII or private vehicle data. | **PASS** | Enforced in `VKR-REF-001` & `VKR-TEN-001`. |
| **9. Taxonomy Granularity** | Make != Model != Generation != Variant != Model Year != Reg Year. | **PASS** | Enforced in `VKR-TAX-001` to `VKR-TAX-005`. |
| **10. Market Awareness** | Models market variations and reconditioned/imported vehicles. | **PASS** | Enforced in `VKR-MKT-001` to `VKR-MKT-003`. |
| **11. Electrical System Modeling** | Voltage is evidence-driven; EV low-voltage accessory interface safety. | **PASS** | Enforced in `VKR-ELC-001` & `VKR-ELC-002`. |
| **12. CAN / OBD Disambiguation** | Physical connector presence != protocol/data support. | **PASS** | Enforced in `VKR-IFC-001`. |
| **13. Fuel Knowledge Separation** | Vehicle fuel system geometry != device fuel sensor capabilities. | **PASS** | Enforced in `VKR-FUL-001`. |
| **14. Odometer Source Disambiguation**| Cluster != ECU CAN != GPS calculated distance. | **PASS** | Enforced in `VKR-IFC-002`. |
| **15. Applicable Compatibility Model**| Evaluates all applicable technical layers without universal mandates. | **PASS** | Enforced in `VKR-CMP-001`. |
| **16. AI Non-Authority** | AI cannot verify vehicle facts or certify compatibility under `DEC-014`. | **PASS** | Enforced in `VKR-AI-001` & `VKR-AI-002`. |
| **17. Regulatory Neutrality** | Asserts no unverified government vehicle certifications or APIs. | **PASS** | Enforced in `VKR-REG-001` to `VKR-REG-003`. |
| **18. Implementation Neutrality** | Contains zero database schemas, SQL, Kafka, or TimescaleDB lock-in. | **PASS** | Enforced in `VKR-GEN-003` & `VKR-NFR-007`. |
| **19. Open Decision Integrity** | Retains only genuinely VKR-relevant PRD Open Decisions (`DEC-013`, etc.).| **PASS** | `DEC-001`, `DEC-003`, `DEC-013`, `DEC-014` preserved with rationale. |
| **20. Requirement ID Stability** | Exactly 66 unique, stable requirement IDs defined. | **PASS** | `VKR-GEN-001` through `VKR-ACC-001` verified. |

---

## 62. SPECIFICATION VERDICT

> # **VEHICLE KNOWLEDGE REGISTRY APPROVED — AUTHORITATIVE BASELINE**

This approved downstream specification strictly adheres to approved Product Requirements Document v1.0 (`abef605`), Module & Service Entitlement Specification v1.0 (`a962a2a`), User Roles, Permissions, Authority & Access Specification v1.0 (`25e7834`), Tenant Isolation & Security Boundary Specification v1.0 (`93d7a4e`), Customer Types & Commercial Model Specification v1.0 (`4014141`), Tracking Provider Architecture Specification v1.0 (`88bcd53`), and Device Capability Registry Specification v1.0 (`5c9fe52`), establishes the authoritative baseline framework for shared vehicle reference knowledge, electrical architectures, and device–vehicle compatibility across the platform.
