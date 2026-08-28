# Device Capability Registry Specification

**Status:** APPROVED  
**Version:** 1.0  
**Approved Date:** 2026-08-28  
**Product:** Vehicle Tracking Standalone Launch  
**Product Name:** TBD  
**Temporary Working Name:** EasyTracker  
**Authoritative Upstream:** `docs/03_specs/PRODUCT_REQUIREMENTS.md` v1.0 (Commit `abef605`), `docs/03_specs/MODULE_SERVICE_ENTITLEMENT_SPEC.md` v1.0 (Commit `a962a2a`), `docs/03_specs/USER_ROLES_PERMISSIONS_ACCESS_SPEC.md` v1.0 (Commit `25e7834`), `docs/03_specs/TENANT_ISOLATION_SECURITY_BOUNDARY_SPEC.md` v1.0 (Commit `93d7a4e`), `docs/03_specs/CUSTOMER_TYPES_COMMERCIAL_MODEL_SPEC.md` v1.0 (Commit `4014141`), `docs/03_specs/TRACKING_PROVIDER_ARCHITECTURE_SPEC.md` v1.0 (Commit `88bcd53`)  
**Upstream Commits:** `abef605`, `a962a2a`, `25e7834`, `93d7a4e`, `4014141`, `88bcd53`  
**Purpose:** Establish an authoritative, evidence-driven Device Knowledge & Capability Registry (DKR) governing technical capability truth, capability profiles, installation dependencies, evidence provenance, and effective instance capabilities without vendor marketing assumptions, AI guessing, or database implementation lock-in.

---

## 1. DOCUMENT CONTROL

| Property | Specification |
| :--- | :--- |
| **Document Title** | Device Capability Registry Specification |
| **Document Identifier** | `docs/03_specs/DEVICE_CAPABILITY_REGISTRY_SPEC.md` |
| **Version** | `1.0` |
| **Status** | APPROVED |
| **Approved Date** | `2026-08-28` |
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
| **Approval Basis** | Draft completed with built-in static audit, independently reviewed, all nine Recommended findings resolved through one consolidated correction, and focused final re-review passed with zero blocking findings, 77 stable DCR requirement IDs and COMPLETE upstream traceability. |
| **Authority Precedence Index** | `docs/DOCUMENT_AUTHORITY_INDEX.md` |

---

## 2. PURPOSE

- **DCR-GEN-001 (Specification Purpose):** This specification defines the authoritative, evidence-driven Device Knowledge & Capability Registry (DKR) architecture for the Vehicle Tracking SaaS platform. It establishes the technical governance model for determining what physical tracking devices, hardware models, variants, firmware versions, protocols, installation wiring, and provider adapters are technically capable of supporting. It prevents unsubstantiated seller claims, AI guessing, commercial subscription purchases, or unverified provider metadata from fabricating technical capabilities (`PRD-DKR-001`, `MSE-DEV-001`, `URPA-DEV-001`).

---

## 3. SCOPE

- **DCR-GEN-002 (In-Scope Device Capability Registry Dimensions):**
  - Conceptual separation between Model Capability Knowledge (shared catalogue) and Device-Instance Effective Capability.
  - Multi-layer capability decomposition: Physical Hardware $\neq$ Firmware/Protocol $\neq$ Installation Wiring $\neq$ Provider Exposure $\neq$ Effective Capability $\neq$ Platform-Derived Features.
  - Device identification model: Manufacturer, Model, Hardware Variant, Hardware Revision, Firmware Build, Wire Protocol, IMEI, Serial Number.
  - Evidence-driven capability verification classes, contextual applicability, and provenance tracking.
  - Fail-safe capability states: `UNKNOWN`, `UNVERIFIED`, `UNSUPPORTED`, and conceptual operational classifications.
  - Installation-dependent capability boundaries (relay immobilization, ignition sense, fuel sensors, SOS panic, dashcams, voice intercom).
  - RMA device replacement, vehicle reassignment, and provider migration capability re-evaluation rules.
  - Platform-derived features (geofencing, trip calculation, overspeed analysis) vs native device capabilities.
  - Engine Disable and Engine Restore capability prerequisites vs 9-term command authorization gates.
  - Granular voice and video capability decomposition without technology lock-in.
  - Role-based registry governance locked to `devices.registry.verify`.
  - Cross-tenant shared catalogue isolation vs tenant-private device instance perimeters.
  - 8 comprehensive architecture matrices and strict upstream traceability.

---

## 4. OUT OF SCOPE

- **DCR-GEN-003 (Explicit Architectural Exclusions):** This specification SHALL NOT define:
  - Concrete database schemas, SQL DDL tables, column data types, or ORM entity classes.
  - REST API controller implementations, JSON payload serializers, or form validation scripts.
  - Hardware firmware binaries, C/C++ firmware flashing tools, or serial bootloader utilities.
  - Physical wire harnesses, relay pinout schematics, or automotive soldering instructions.
  - Vehicle make/model/variant compatibility databases (reserved for the downstream Vehicle Knowledge Registry).
  - Selection of the initial production hardware device catalogue (governed by `DEC-003`).
  - Commercial pricing, hardware sales margins, or accessory billing ledgers (governed by `DEC-004`).
  - Selection of specific time-series databases, cache stores, or queue brokers.

---

## 5. AUTHORITY & SOURCE BASIS

- **DCR-GEN-004 (Governing Upstream Precedence):** In accordance with `docs/DOCUMENT_AUTHORITY_INDEX.md`, this specification adheres strictly to:
  1. Approved `docs/03_specs/PRODUCT_REQUIREMENTS.md` v1.0 (Commit `abef605`).
  2. Approved `docs/03_specs/MODULE_SERVICE_ENTITLEMENT_SPEC.md` v1.0 (Commit `a962a2a`).
  3. Approved `docs/03_specs/USER_ROLES_PERMISSIONS_ACCESS_SPEC.md` v1.0 (Commit `25e7834`).
  4. Approved `docs/03_specs/TENANT_ISOLATION_SECURITY_BOUNDARY_SPEC.md` v1.0 (Commit `93d7a4e`).
  5. Approved `docs/03_specs/CUSTOMER_TYPES_COMMERCIAL_MODEL_SPEC.md` v1.0 (Commit `4014141`).
  6. Approved `docs/03_specs/TRACKING_PROVIDER_ARCHITECTURE_SPEC.md` v1.0 (Commit `88bcd53`).
  7. Historical reconciliation audits (`docs/02_audit/`) as context only.
  8. Legacy code and documentation (strictly as non-authoritative implementation evidence).

---

## 6. DEFINITIONS & TERMINOLOGY CLARIFICATION

- **Device Knowledge & Capability Registry (DKR):** The authoritative platform architectural domain and technical knowledge system defined in upstream specifications (`PRD-DKR-001`, `URPA-DEV-001`) that models, verifies, and records technical capabilities of GPS tracking hardware models, firmware builds, protocols, and individual device instances.
- **Specification Identifier (DCR):** The document identifier and requirement ID prefix (`DCR-*`) for this specification (`DEVICE_CAPABILITY_REGISTRY_SPEC.md`). DKR and DCR do NOT represent two independent or competing registries; DKR represents the canonical platform domain concept, and DCR represents this authoritative specification and its numbered requirements.
- **Capability Profile:** A verified, reusable technical specification template defining the inherent hardware, firmware, and protocol capabilities of a specific Device Model and Variant.
- **Device Instance:** A specific, physically manufactured tracking unit identified by an authoritative internal platform identity, IMEI, and optional manufacturer serial number.
- **Effective Capability:** The dynamic, verified set of technical features available on a specific Device Instance, computed by evaluating its Capability Profile, applicable installed wiring, attached accessories, active Provider adapter exposure, and verification evidence.
- **Evidence Provenance:** The auditable chain of technical documentation, test records, handshake telemetry, and technician verification reports supporting a capability claim.
- **Fail-Safe Capability State:** The architectural rule where any capability not affirmatively proven and verified defaults to `UNKNOWN`, `UNVERIFIED`, or `UNSUPPORTED`, preventing false availability claims in customer UI and blocking command dispatch.

---

## 7. ARCHITECTURAL PRINCIPLES

- **DCR-GEN-005 (Evidence-Driven Capability Authority):** Technical capability truth MUST derive exclusively from verified technical evidence in the DKR (`PRD-DKR-001`, `MSE-DEV-001`). Neither seller marketing, customer requests, commercial package purchases, nor AI guesses can grant or verify a technical capability.
- **DCR-GEN-006 (Zero Security Compromise on Capability Gates):** Platform services, customer dashboards, alert engines, and command dispatchers MUST consult the effective instance capability before exposing features or accepting command requests (`TISB-CMD-001`, `TPA-CAP-001`).

---

## 8. DEVICE CAPABILITY AUTHORITY

- **DCR-CAP-001 (Sole Authority of DKR):** The Device Knowledge & Capability Registry is the sole authoritative source of device technical capabilities across the entire SaaS platform (`PRD-DKR-002`).
- **DCR-CAP-002 (Non-Technical Roles Barred from Verification):** Marketing staff, sales representatives, customer support agents, end customers, and external AI services are strictly prohibited from verifying or asserting device capabilities (`URPA-DEV-001`). Technical capability verification requires platform technical authority (`devices.registry.verify`).

---

## 9. MODEL KNOWLEDGE VS DEVICE INSTANCE

- **DCR-MDL-001 (Model Knowledge vs Instance Separation):** The platform maintains a strict conceptual boundary between:
  1. **Shared Model Knowledge (Capability Profiles):** Theoretical and lab-verified capability definitions representing what a hardware model/variant can support under ideal conditions.
  2. **Device-Instance Effective Capability:** The actual operational capability of a physical unit operating in a specific vehicle with specific wiring, accessories, firmware, and provider backend.
- **DCR-MDL-002 (No Automatic Model-to-Instance Entitlement):** A Device Instance SHALL NOT automatically inherit all capabilities of its parent Capability Profile if physical installation wiring, required accessories, or provider translation are missing (`MSE-DEV-001`).

---

## 10. DEVICE IDENTITY MODEL

- **DCR-ID-001 (Authoritative Device Instance Identity):** Every physical device instance is uniquely identified within the platform by:
  - Authoritative Internal Device Identifier (canonical system-wide unique identifier; `device_uuid` is an illustrative non-binding concept).
  - Primary Cellular Modem Identifier (IMEI / 15-digit decimal string).
  - Manufacturer Serial Number (where available from hardware labelling).
  - Assigned Capability Profile reference.
  - Tenant Ownership boundary (authoritative SaaS Tenant perimeter).
- **DCR-ID-002 (No IMEI-Only Capability Inference):** The platform SHALL NEVER infer hardware model, revision, or capabilities purely from IMEI prefix ranges (Type Allocation Codes / TAC) without explicit model registration and verification (`PRD-DKR-001`).

---

## 11. MANUFACTURER / MODEL / VARIANT

- **DCR-MDL-003 (Granular Model Variant Modeling):** The DKR models hardware at granular variant precision:
  - `Manufacturer`: Hardware OEM (e.g., Teltonika, Concox/Jimi, Queclink, Sinotrack, Coban candidate examples).
  - `Base Model`: Core hardware line (e.g., FMB920, VL03, GV50, S102A pilot evidence).
  - `Hardware Revision / Variant`: Specific sub-models distinguishing 2G, 4G, internal battery sizes, CAN-bus support, or I/O pin counts.
  - `Market / Region Variant`: Regional modem band support (e.g., Asian 4G LTE vs European bands).
- **DCR-MDL-004 (OEM / Rebranded Model Disambiguation):** Rebranded, white-labeled, or clone devices MUST be registered under distinct capability profiles unless technical documentation proves identical hardware and firmware architectures (`PRD-DKR-001`).

---

## 12. FIRMWARE-AWARE CAPABILITY

- **DCR-FW-001 (Firmware Version Sensitivity):** Capabilities MUST be evaluated in the context of verified firmware characteristics (`PRD-DKR-002`). Features introduced in newer firmware versions (e.g., BLE beacon scanning, dynamic sleep modes, updated crash algorithms) SHALL NOT be assumed available on older firmware builds. Reported firmware strings constitute observational evidence and are not unquestioned truth if malformed, conflicting, or unverifiable.
- **DCR-FW-002 (Firmware Upgrade Re-Evaluation):** When a device's verified firmware build changes, the platform flags the device instance for capability re-evaluation without invalidating historical telemetry records (`TPA-MIG-003`).

---

## 13. PROTOCOL-AWARE CAPABILITY

- **DCR-PRT-001 (Wire Protocol Capability Boundary):** Even if physical hardware possesses a sensor or feature, the feature is ONLY technically available if the active communication protocol supports transmitting that telemetry packet or command frame (`TPA-ING-002`). Wire protocol capabilities operate as one contributing technical layer and do not universally define physical hardware truth.
- **DCR-PRT-002 (Protocol Dialect Constraints):** Where devices support multiple protocol modes (e.g., binary vs ASCII, extended sensor frames vs compact packets), the effective capability reflects the verified operational capabilities of the active protocol configuration.

---

## 14. PROVIDER EVIDENCE BOUNDARY

- **DCR-PRV-001 (Provider Support != Hardware Truth):** A Tracking Provider gateway API claiming command support does NOT prove that a physical device instance possesses the required hardware or wiring (`TPA-CAP-001`).
- **DCR-PRV-002 (Provider Metadata as Ingestion Evidence):** Dynamic metadata reported by Tracking Providers (e.g., device status flags, protocol names) constitutes observational evidence, NOT authoritative capability verification (`TPA-PRV-001`).

---

## 15. INSTALLATION-DEPENDENT CAPABILITY

- **DCR-INS-001 (Installation Dependency Governance):** Where a capability is installation-dependent and physical installation, wiring, or accessory attachment materially affects functionality, the capability MUST NOT be marked verified on a device instance without verified installation evidence:
  - **Engine Disable / Restore:** Requires verified physical relay installation and wiring to vehicle fuel pump or ignition circuit (`MSE-DEV-001`, `URPA-CMD-001`).
  - **ACC / Ignition Sense:** Requires verified connection to vehicle ACC line or verified voltage threshold calibration where wiring is required.
  - **Analog / Ultrasonic Fuel Sensor:** Requires physical sensor mounting, wiring, and tank calibration tables.
  - **SOS Panic Button:** Requires physical panic button accessory wiring inside the passenger cabin where external button is used.
  - **Dashcam Video Stream:** Requires camera hardware mounting, power harness, and memory card readiness.
  - **Cabin Voice Microphone:** Requires microphone accessory wiring inside vehicle cabin where external mic is used (`PRD-VOC-001`).
- **DCR-INS-002 (Applicable Prerequisites Resolution):** Effective technical capability depends on ALL APPLICABLE verified technical prerequisites for that specific capability:
  $$\text{Effective Capability} = \text{Hardware Cap} \land [\text{Firmware Cap}] \land [\text{Protocol Cap}] \land [\text{Installation Verified}] \land [\text{Provider Support}]$$
  *Only prerequisites applicable to the specific capability domain are evaluated; self-contained or passive features do not mandate irrelevant wiring or command layers.*

---

## 16. CAPABILITY EVIDENCE MODEL

- **DCR-EVD-001 (Evidence Classes & Domain Applicability):** Capability claims are substantiated by auditable evidence records categorized into contextual evidence classes based on domain applicability:
  - *Manufacturer Engineering Documentation:* High applicability for inherent hardware pinout, chipset capabilities, and factory specifications.
  - *Controlled Bench / Device Testing:* High applicability for confirming firmware command responses and electrical I/O behavior.
  - *Technician Installation & Commissioning Reports:* High applicability for physical relay wiring, sensor mounting, and vehicle electrical integration.
  - *Protocol Diagnostic Telemetry Handshakes:* Confirmatory applicability for active protocol frame parsing and live field telemetry.
  - *Provider Marketing Metadata:* Observational only; insufficient alone to verify hardware capabilities.
- **DCR-EVD-002 (Evidence Record Provenance):** Every evidence record in the DKR records:
  - Target Capability Profile ID or Device Instance identifier.
  - Evidence source type and verification authority identifier.
  - Verification timestamp and scope.
  - Supporting technical artifacts or test references.

---

## 17. EVIDENCE PROVENANCE & RETENTION

- **DCR-EVD-003 (Evidence Retention & Provenance):** Evidence records retained under approved platform retention policies must preserve accurate historical provenance. Evidence records explain why a capability was verified without asserting infinite storage lifetimes (`PRD-AUD-002`, `DEC-009`).

---

## 18. CAPABILITY STATUS & CONFIDENCE

- **DCR-CAP-003 (Standardized Capability States & Operational Classifications):** Capabilities on Capability Profiles and Device Instances are governed by canonical states and operational classifications:
  - `UNKNOWN`: Insufficient evidence to determine support; treated as fail-safe unverified.
  - `UNVERIFIED`: Profile indicates theoretical model support, but instance installation, wiring, or provider exposure lacks verification.
  - `UNSUPPORTED`: Affirmatively determined that hardware, firmware, wiring, or provider cannot support feature.
  - *Operational / Conceptual Classifications:* Verified/Supported (affirmatively verified by applicable evidence) and Deprecated (retired due to hardware wear, protocol change, or safety rules) are operational classifications without prescribing mandatory database enum schemas.

---

## 19. UNKNOWN / UNVERIFIED CAPABILITY HANDLING

- **DCR-CAP-004 (Fail-Safe Handling & Truthful Status Display):** Any capability evaluated as `UNKNOWN` or `UNVERIFIED` MUST fail safe:
  - UI dashboards and commercial interfaces SHALL NOT represent the feature as available, operational, or guaranteed.
  - User interfaces MAY truthfully display informational status badges (e.g., "Unknown", "Unverified", "Verification Required", "Setup Required") where appropriate.
  - Command dispatchers MUST reject outbound commands targeting unverified capabilities (`TPA-CAP-002`).
  - Alert engines SHALL NOT configure triggers relying on unverified sensor inputs.

---

## 20. UNSUPPORTED CAPABILITY GOVERNANCE

- **DCR-CAP-005 (Immutability & Authorized Correction of Unsupported States):** An `UNSUPPORTED` capability CANNOT be overridden or forced into an active state by purchasing commercial subscriptions, granting admin permissions, or applying AI suggestions (`MSE-DEV-001`, `CTCM-DEV-003`). However, if authoritative new technical evidence demonstrates that prior classification was erroneous or hardware context changed, capability classification may be corrected through authorized evidence-based technical governance.

---

## 21. CAPABILITY CHANGE & DRIFT

- **DCR-LCY-001 (Triggered Capability Re-Evaluation):** A Device Instance's effective capabilities MUST undergo formal re-evaluation upon the occurrence of material lifecycle events:
  - Verified firmware update or configuration change reported by provider.
  - Tracking Provider migration or gateway adapter reassignment (`TPA-MIG-001`).
  - Physical vehicle transfer, re-installation, or wiring alteration by field technician (`CTCM-DEV-008`).
  - Accessory detachment or hardware maintenance report.
  - Technical correction of parent Capability Profile.

---

## 22. DEVICE REPLACEMENT / RMA

- **DCR-LCY-002 (RMA Device Independence):** When a physical tracking unit is replaced under RMA or warranty replacement:
  - The replacement device MUST possess its own distinct authoritative internal device identity (`CTCM-DEV-008`).
  - The replacement unit SHALL NOT silently inherit the old unit's effective capabilities without independent hardware model, IMEI, firmware, and installation verification.
  - Historical telemetry and capability logs of the decommissioned unit remain immutable (`PRD-RET-001`).

---

## 23. DEVICE REASSIGNMENT

- **DCR-LCY-003 (Vehicle Reassignment Governance):** Purely administrative or logical rebinding of a vehicle to a customer without physical tracker removal does not alter verified hardware capability. If physical device relocation, re-installation, or vehicle electrical harness alterations occur, installation-dependent capabilities (relay, fuel sensor, panic button) MUST reset to `UNVERIFIED` until technician verification is completed for the new vehicle context.

---

## 24. PROVIDER MIGRATION IMPACT

- **DCR-LCY-004 (Provider Migration Capability Impact):** Migrating a device from Provider A to Provider B does not alter its physical hardware capability, but MAY alter its effective capability if Provider B lacks command translation, sensor frame parsing, or media streaming adapters for that device model (`TPA-MIG-001`).

---

## 25. TRACKING / LOCATION CAPABILITY

- **DCR-SEN-001 (Location Telemetry Capabilities):** The DKR decomposes location capabilities into distinct measurable attributes:
  - `gnss_position`: Basic GPS/GLONASS latitude, longitude, speed, bearing, altitude.
  - `assisted_gps`: Fast TTFF (Time to First Fix) via AGPS cellular assistance.
  - `cell_tower_lbs`: Location-based positioning via cellular tower triangulation (fallback when GPS is lost).
  - `odometer_virtual`: Platform/device accumulated mileage calculation.

---

## 26. POWER & BATTERY CAPABILITIES

- **DCR-SEN-002 (Power Source Disambiguation):** The platform strictly distinguishes between external vehicle power and internal device backup battery:
  - `external_voltage_sense`: Measurement of vehicle battery voltage (e.g., 12V/24V electrical bus).
  - `internal_battery_present`: Physical presence of an onboard rechargeable backup battery.
  - `internal_battery_voltage`: Voltage level of the internal backup battery.
  - `internal_battery_level_pct`: Percentage state of charge of internal battery.
  - `power_cut_detection`: Hardware ability to detect and trigger immediate alert upon external power disconnect.
  *External vehicle power SHALL NEVER be conflated with internal backup battery capacity (`PRD-TRK-001`).*

---

## 27. FUEL / ANALOG SENSORS

- **DCR-SEN-003 (Fuel & Analog Sensor Prerequisites):** Fuel and analog telemetry capabilities are strictly conditional on verified hardware interfaces and physical sensors:
  - `fuel_level_analog`: Requires resistive or voltage-based analog fuel float wiring.
  - `fuel_level_ultrasonic`: Requires external ultrasonic fuel sensor and RS232/RS485 interface.
  - `fuel_level_can`: Requires verified CAN-bus/OBD-II vehicle bus decoder integration.
  - `temperature_sense`: Requires external 1-Wire or analog temperature probe.
  *The platform SHALL NEVER assume fuel monitoring capability from generic GPS tracker marketing.*

---

## 28. PLATFORM-DERIVED VS DEVICE-NATIVE

- **DCR-CAP-006 (Native vs Platform-Derived Separation):** The platform maintains a strict boundary between native hardware capabilities and SaaS platform-computed features:
  - **Device-Native Capabilities:** Raw GPS fixes, hardware ignition wire sense, relay circuit control, physical tamper switch, hardware crash accelerometer.
  - **Platform-Derived Features:** Circular/polygon geofencing, journey idle-time calculation, overspeed rule evaluation (which may originate from device, provider, or platform engine), driver safety scoring, scheduled reports.
  *Platform features utilizing telematics data SHALL NOT be misrepresented as device hardware capabilities.*

---

## 29. DIAGNOSTIC CAPABILITIES

- **DCR-CMD-001 (Diagnostic Telemetry & Query):** Where supported by model firmware and provider adapters, diagnostic capabilities include:
  - `diagnostic_query`: On-demand query of device operating status (`commands.status.query`).
  - `gsm_signal_rssi`: Cellular signal strength monitoring.
  - `gnss_satellite_count`: Active satellite tracking count and HDOP dilution of precision.
  - `firmware_version_report`: Reporting of running firmware version string.

---

## 30. GPS WAKEUP & SLEEP MODES

- **DCR-CMD-002 (Power Management & Wakeup):** Decouples device power management capabilities:
  - `gps_wakeup_command`: On-demand remote wakeup from deep sleep mode (`commands.gps_wakeup.request`).
  - `periodic_heartbeat`: Configurable stationary periodic keep-alive interval.
  - `motion_sleep_mode`: Automatic deep sleep upon accelerometer motion cessation.

---

## 31. USSD / SIM CAPABILITIES

- **DCR-SEN-004 (USSD & Modem Capabilities):** USSD balance query and SIM command capabilities (`commands.apn_config.request`) are conditional on modem band compatibility, cellular carrier SIM capabilities, and provider gateway support (`CTCM-SIM-001`, `TPA-SIM-001`).

---

## 32. ENGINE DISABLE / RESTORE CAPABILITY

- **DCR-CMD-003 (Engine Immobilization Capability Prerequisites):**
  - Canonical Capability Names: **`engine_disable`** and **`engine_restore`**.
  - Technical Capability Prerequisites:
    1. Hardware model possesses verified digital output pin supporting relay driving (`PRD-CMD-001`).
    2. Physical automotive relay is installed and wired into vehicle ignition or fuel pump circuit where installation is required.
    3. Device firmware and active protocol support remote relay toggle command frames.
    4. Active Tracking Provider connection supports relay command translation (`TPA-CMD-001`).
    5. Installation evidence is verified in DKR by authorized technical personnel.
  *Absence of any single applicable prerequisite sets effective capability to `UNSUPPORTED` or `UNVERIFIED`.*

---

## 33. ENGINE AUTHORIZATION BOUNDARY

- **DCR-CMD-004 (Capability != Command Authorization):** DKR verifies technical capability ("Can the hardware path execute immobilization?"). It DOES NOT grant authorization to dispatch the command. Command dispatch requires satisfying the complete 9-term authorization and safe-state formula (`URPA-CMD-001`, `TISB-CMD-001`, `TPA-CMD-002`):
  $$\text{Authorized} = \text{Actor} \land \text{Membership} \land \text{Tenant} \land \text{Entitlement} \land \text{Permission} \land \text{Scope} \land \text{Purpose} \land \text{Device Cap} \land \text{Safety Policy}$$

---

## 34. COMMAND SUPPORT GRANULARITY

- **DCR-CMD-005 (Granular Command Modeling):** The DKR rejects monolithic `supports_commands = true` flags. Command capabilities are independently evaluated:
  - `commands.engine_disable.request` $\neq$ `commands.engine_restore.request`
  - `commands.status.query` $\neq$ `commands.gps_wakeup.request`
  - `commands.reboot.request` $\neq$ `commands.apn_config.request`
  *Supporting one command type confers zero assumption of support for other commands.*

---

## 35. PROVIDER ACK VS DEVICE ACK

- **DCR-CMD-006 (Acknowledgment Boundary):** The capability to transmit a command through a provider gateway does NOT guarantee physical device execution (`TPA-CMD-005`). Effective command capability verification requires confirmation of real hardware delivery mechanisms.

---

## 36. VOICE / AUDIO CAPABILITY MODEL

- **DCR-MED-001 (Granular Voice Capabilities):** In accordance with approved upstream baselines, voice capabilities are decoupled into independent functional types (`PRD-VOC-001`, `MSE-VOC-001`):
  - `voice_call_monitoring`: One-way listen-in cabin monitoring via onboard or external microphone (permission token: `media.voice.monitor_call`).
  - `two_way_audio`: Interactive voice communication via microphone and cabin speaker (permission token: `media.intercom.two_way_speak`).
  - `audio_recording`: Automated audio capture during incident events (permission token: `media.audio.record_event`).
  - `live_audio_stream`: Real-time streaming audio channel (permission token: `media.audio.stream_live`).
  *Supporting one audio capability type DOES NOT imply support for others.*

---

## 37. VIDEO / MEDIA CAPABILITY MODEL

- **DCR-MED-002 (Granular Video Capabilities):** Video capabilities represent conceptual functional categories rather than fixed platform enum schemas (`PRD-VID-001`, `MSE-TRK-001`):
  - Live Video Streaming (real-time video feed; permission token: `media.video.stream_live`).
  - Recorded Video Playback (remote playback and download; permission token: `media.video.playback`).
  - Event / Crash Video Clip (automatic capture upon collision/incident).
  - On-Demand Camera Snapshot (still camera photo capture).
  - Multi-Channel Camera Support (road-facing, cabin-facing, cargo-facing).
  - Verifiable Evidence Export (tamper-evident video export; permission token: `media.evidence.export`).
  *Machine-readable labels in matrices represent illustrative capability categories.*

---

## 38. CAMERA & ACCESSORY VARIATIONS

- **DCR-MED-003 (Accessory-Dependent Video Readiness):** Video streaming and recording capabilities require verified camera hardware attachment, storage media (SD card) health, and adequate cellular bandwidth. Absence of verified camera hardware locks video capabilities to `UNSUPPORTED`.

---

## 39. SENSOR / EXTENSION CAPABILITIES

- **DCR-SEN-005 (Specialized Sensor Extensions):** Specialized sensors are modeled as explicit, capability-gated extensions:
  - `door_sensor_digital`: Cabin / cargo door open/close magnetic switch.
  - `temperature_multi_probe`: Multi-zone cold chain refrigerated cargo probes.
  - `ble_beacon_scanner`: Bluetooth Low Energy wireless tag scanning for asset tracking.
  - `driver_id_ibutton`: 1-Wire iButton / RFID driver authentication reader.
  - `can_bus_fms`: Standardized Fleet Management System (FMS) J1939 telemetry decoder.

---

## 40. CAPABILITY DEPENDENCY CHAINS

- **DCR-CAP-007 (Deterministic Dependency Enforcement):** Advanced capabilities depend deterministically on underlying baseline capabilities:
  - Two-Way Audio $\implies$ requires microphone hardware + audio amplifier + speaker.
  - Live Video Streaming $\implies$ requires GNSS positioning + high-speed modem + camera module + provider streaming adapter.
  - Engine Immobilization $\implies$ requires digital output driver + installed relay + ignition sense where applicable.
  *If any prerequisite fails, the parent capability evaluates to `UNSUPPORTED`.*

---

## 41. CAPABILITY PROFILE ARCHITECTURE

- **DCR-MDL-005 (Capability Profile Template):** A Capability Profile is an immutable, versioned technical specification record capturing:
  - Unique Profile Identifier (e.g., illustrative `CP-TELTONIKA-FMB920-V1`).
  - Manufacturer, Base Model, Hardware Revision, Supported Firmware Range.
  - Master capability matrix specifying inherent hardware support for canonical capabilities.
  - Known hardware limitations, pinout constraints, and protocol dialect mappings.
  - Profile verification status and approving technical authority.

---

## 42. DEVICE-INSTANCE EFFECTIVE CAPABILITY

- **DCR-CAP-008 (Effective Capability Resolution Engine):** The effective capability of a specific physical Device Instance is resolved dynamically by evaluating applicable prerequisites:
  $$\text{EffectiveCap}(D) = \text{ProfileCap}(M) \land [\text{FirmwareMatch}(D)] \land [\text{InstallationStatus}(D)] \land [\text{ProviderSupport}(P)]$$
  *The resolved effective capability is cached and re-evaluated upon any lifecycle state trigger (`DCR-LCY-001`).*

---

## 43. MODEL DEFAULT VS INSTANCE OVERRIDE

- **DCR-MDL-006 (Model Default Baseline):** A Device Instance inherits its baseline technical capabilities from its assigned Capability Profile. Inherent hardware constraints (e.g., absence of camera port) can NEVER be overridden to active on an instance.

---

## 44. CAPABILITY OVERRIDE GOVERNANCE

- **DCR-ADM-001 (Strict Override Lockdown):** Instance-level capability adjustments (e.g., marking a relay as physically disconnected after maintenance) require:
  - Explicit administrative verification authority (`devices.registry.verify`).
  - Auditable technical rationale and technician inspection ticket reference.
  - Restricting capabilities down (from supported to unsupported) or confirming verified installation.
  *Admins CANNOT override inherent hardware limitations or manufacture unverified capabilities (`URPA-DEV-001`).*

---

## 45. VERIFICATION AUTHORITY & IAM

- **DCR-ADM-002 (IAM Authority Enforcement):**
  - Technical registry verification is locked to `devices.registry.verify` (`URPA-DEV-001`, `URPA-PERM-004`).
  - Platform integration adapter capability mapping is governed by `platform.integration.configure` (`URPA-ADM-001`).
  - Profile creation in shared catalogues is an administrative technical action governed by applicable approved technical registry authority.
  - Ordinary Tenant Admins, Customer Users, and Sales Staff have read-only access (via `tracking.location.view_live` or `support.diagnostics.view`) and CANNOT alter registry truth.

---

## 46. AI NON-AUTHORITY ON CAPABILITIES

- **DCR-AI-001 (Prohibition of AI Capability Authority):** Artificial intelligence or machine learning systems SHALL NEVER have authority to mark capabilities as verified, override hardware limitations, map unknown models, or authorize command execution (`URPA-AUTH-001`). AI suggestions are strictly advisory for human technician review.

---

## 47. TENANT ISOLATION BOUNDARY

- **DCR-TEN-001 (Tenant Perimeter Isolation):** Device instances, installation records, vehicle mappings, and customer telemetry remain strictly isolated within the assigned Tenant's perimeter (`TISB-TEN-001`). A tenant administrator CANNOT view or query device instances belonging to other tenants.

---

## 48. SHARED KNOWLEDGE VS TENANT DATA

- **DCR-TEN-002 (Shared Knowledge vs Instance Data Separation):**
  - **Shared Global Knowledge:** Master Capability Profiles, manufacturer specifications, protocol definitions, and hardware documentation are globally shared across all tenants without leaking private data.
  - **Tenant-Private Instance Data:** Device IMEI, physical serial number, vehicle binding, customer identity, technician installation notes, and live telemetry reside exclusively within tenant boundaries (`TISB-TEN-008`).

---

## 49. PROVIDER-SPECIFIC CAPABILITY MAPPING

- **DCR-PRV-003 (Provider Capability Translation Mapping):** The DKR maintains explicit translation rules mapping internal canonical capabilities to specific Tracking Provider command strings and telemetry field mappings (`TPA-CMD-001`).

---

## 50. UNKNOWN DEVICE & IDENTITY CONFLICT

- **DCR-ID-003 (Unknown Device Restricted Review):** If an unregistered or unrecognized device IMEI attempts to ingest telemetry or register on the platform, the platform MUST hold the record in a restricted technical review context (`TPA-MAP-002`). Unrecognized devices receive an `UNKNOWN` capability status and remain completely invisible to customer operational workflows until verified.

---

## 51. CONTROLLED TESTING & VERIFICATION

- **DCR-TST-001 (Safe Capability Testing):** Hardware capability testing (relay toggling, buzzer sounding, camera triggering) MUST execute strictly in authorized test tenant perimeters using dedicated test hardware (`TPA-TST-002`). High-risk commands SHALL NEVER be dispatched to active customer vehicles merely to discover hardware capabilities.

---

## 52. CAPABILITY DEPRECATION

- **DCR-LCY-005 (Graceful Capability Deprecation):** When a hardware revision or firmware build suffers known vulnerabilities or component failures, the platform technical authority can classify that specific capability as deprecated on the profile, automatically updating all child device instances to safely disable the feature.

---

## 53. DURABLE AUDITABILITY

- **DCR-AUD-001 (Durable Registry Audit Trail):** All Capability Profile modifications, instance verification approvals, capability overrides, and evidence attachments MUST generate durable, auditable event records in accordance with approved platform audit policies (`PRD-AUD-002`, `URPA-AUD-001`).

---

## 54. COMMERCIAL BOUNDARY

- **DCR-COM-001 (Decoupling from Commercial Pricing):** Technical capability registry truth is independent of commercial subscription pricing or packaging (`CTCM-GEN-009`). A customer paying for a "Premium Video & Fleet Pack" does not make a basic 2G tracker capable of video streaming.

---

## 55. INVENTORY & PROCUREMENT BOUNDARY

- **DCR-INT-001 (Hardware Procurement Integration):** During inventory onboarding and device staging, warehouse technicians associate physical devices with verified Capability Profiles, ensuring accurate capabilities before field deployment (`CTCM-DEV-001`).

---

## 56. INSTALLATION & TECHNICIAN BOUNDARY

- **DCR-INT-002 (Technician Commissioning Sign-Off):** Field installation technicians complete digital commissioning checklists verifying physical wiring (ignition, relay, panic button, sensors), which feed Level 3 evidence into the DKR to activate installation-dependent capabilities.

---

## 57. VEHICLE KNOWLEDGE BOUNDARY

- **DCR-INT-003 (Vehicle Knowledge Registry Separation):** Device capabilities (e.g., OBD-II CAN reading) remain distinct from vehicle electrical compatibility (e.g., 24V commercial truck vs 12V passenger sedan). Vehicle electrical properties reside in the future Vehicle Knowledge Registry.

---

## 58. REGULATORY BOUNDARY

- **DCR-REG-001 (Regulatory Compliance Preconditions):** Telematics hardware operating in Bangladesh must comply with applicable equipment standardization and telecommunications import guidelines (LEGAL / REGULATORY VERIFICATION REQUIRED). The platform asserts no unverified government certifications (`PRD-GEN-001`).

---

## 59. SCALE & DATA PORTABILITY

- **DCR-SCL-001 (Multi-Tenant Scalable Architecture):** The capability registry is architected to evaluate effective capabilities across thousands of devices efficiently via cached capability hashes without single-server or single-tenant bottlenecks (`PRD-NFR-001`).

---

## 60. CORE VS EXTENSIONS BOUNDARY

- **DCR-EXT-001 (Core vs Specialized Extension Segregation):** Baseline tracking capabilities (GNSS, ignition, power, relay) are maintained in the Core Registry Model, while proprietary vendor sensors (BLE temperature, proprietary CAN metrics) are managed through modular capability extensions (`TPA-EXT-002`).

---

## 61. DEVICE CAPABILITY MATRIX

| Conceptual Capability | Capability Category | Inherent Hardware Required? | Installation Wiring Required? | Provider Support Required? | Applicable User Permission | Verification Source | Notes |
| :--- | :---: | :---: | :---: | :---: | :--- | :---: | :--- |
| **GNSS Position** | Core Location | YES (GPS Antenna) | NO (Power Only) | YES | `tracking.location.view_live` | OEM Spec / Telemetry | Basic lat/long/speed/bearing. |
| **Ignition Sense** | Core Telemetry | YES (Digital Input)| **YES (ACC Wire)** | YES | `tracking.location.view_live` | Tech Report / Telemetry| Engine run-state detection. |
| **External Power Sense** | Core Telemetry | YES (ADC / Power) | **YES (12V/24V)** | YES | `support.diagnostics.view` | OEM Spec / Telemetry | Vehicle battery voltage monitoring. |
| **Internal Battery Level**| Core Telemetry | **YES (Li-ion)** | NO (Internal) | YES | `support.diagnostics.view` | OEM Spec / Telemetry | Backup battery charge state. |
| **Power Disconnect Alert**| Core Alarm | **YES (Li-ion)** | **YES (12V/24V)** | YES | `alerts.realtime.view` | OEM Spec / Telemetry | Alert on battery tampering/cut. |
| **Engine Disable** | High-Risk Command| **YES (Relay Driver)**| **YES (Relay Wire)** | **YES** | `commands.engine_disable.request` | **Bench Test / Tech Report**| Remote engine immobilization. |
| **Engine Restore** | High-Risk Command| **YES (Relay Driver)**| **YES (Relay Wire)** | **YES** | `commands.engine_restore.request` | **Bench Test / Tech Report**| Restore engine circuit continuity. |
| **Diagnostic Query** | Diagnostics | YES (Firmware) | NO | YES | `commands.status.query` | OEM Spec / Diagnostic | On-demand status & signal query. |
| **GPS Wakeup** | Power Mgmt | YES (Modem) | NO | YES | `commands.gps_wakeup.request` | OEM Spec / Diagnostic | Remote wakeup from sleep mode. |
| **SOS Panic Button** | Safety Alarm | YES (Digital In) | **YES (Panic Button)**| YES | `alerts.realtime.view` | **Technician Report** | In-cabin emergency trigger. |
| **Analog Fuel Level** | Sensor Extension | YES (Analog ADC) | **YES (Fuel Float)** | YES | `tracking.history.view` | **Technician Report** | Analog fuel level tracking. |
| **Voice Call Monitoring**| Voice Audio | **YES (Microphone)** | **YES (Mic Harness)**| **YES** | `media.voice.monitor_call` | **Bench Test / Tech Report**| One-way cabin listen-in. |
| **Two-Way Audio** | Voice Audio | **YES (Mic+Speaker)**| **YES (Speaker Wire)**| **YES** | `media.intercom.two_way_speak` | **Bench Test / Tech Report**| Interactive cabin communication. |
| **Audio Recording** | Voice Audio | **YES (Audio DSP)** | **YES (Mic Harness)**| **YES** | `media.audio.record_event` | **Bench Test / Tech Report**| Automated incident audio clips. |
| **Live Video Streaming** | Video Media | **YES (Camera Mod)** | **YES (Video Harness)**| **YES** | `media.video.stream_live` | **Bench Test / Tech Report**| Real-time dashcam video streaming. |
| **Video Playback** | Video Media | **YES (SD Storage)** | **YES (Video Harness)**| **YES** | `media.video.playback` | **Bench Test / Tech Report**| Remote playback of recorded footage. |

---

## 62. CAPABILITY EVIDENCE MATRIX

| Evidence Class | Primary Applicability Domain | Authority / Source Actor | Verifiable Artifacts | Capability Target Scope | Relative Evaluative Strength |
| :--- | :--- | :--- | :--- | :--- | :---: |
| **Controlled Bench / Lab Testing** | Electrical I/O, Command Execution | Platform Hardware Engineer | Test Log, Oscilloscope Trace, Frame Dump | Capability Profile / Hardware | **Authoritative for Hardware / MCU** |
| **Manufacturer Engineering Documentation**| Inherent Pinout, Chipset Specifications| Hardware OEM Engineering | Official Datasheet, Protocol Spec, Release Notes | Capability Profile (Model-wide)| **Authoritative for Inherent Specs** |
| **Technician Commissioning Inspection**| Physical Relay, Sensor & Camera Wiring| Certified Field Technician | Digital Commissioning Form, Photos, Test Readings| Device Instance (Specific Unit) | **Authoritative for Installation** |
| **Live Protocol Diagnostic Handshake** | Telemetry Parsing, Protocol Exposure | Ingestion Engine Parser | Observed Protocol Frames, ACK Responses | Device Instance / Firmware | **Confirmatory for Protocol State** |
| **Provider Gateway Metadata** | External Gateway Configuration | External Provider Gateway | JSON Status Flags, Marketing Tags | Device Instance (Observational) | **Observational / Non-Authoritative** |

---

## 63. CAPABILITY LAYER MATRIX

| Capability Architectural Layer | Primary Governing Factor | Can Inherent HW Constraints Be Overridden? | Can Missing Installation Be Bypassed? | Primary Validation Artifact |
| :--- | :--- | :---: | :---: | :--- |
| **1. Physical Hardware Layer** | Silicon chipset, pinout, modem, sensors | **NO (Hard Constraint)** | N/A | OEM Datasheet / Bench Test |
| **2. Firmware & Protocol Layer** | Installed firmware build, packet dialects | **NO** | N/A | Protocol Spec / Diagnostic Frame |
| **3. Installation & Wiring Layer** | Physical wire connections, attached relays | **NO** | **NO (Hard Constraint)** | Technician Inspection Checklist |
| **4. Provider Translation Layer** | Gateway command adapter, API support | **NO** | N/A | Provider Integration Test Record |
| **5. Effective Instance Layer** | Resolved conjunction of applicable layers | **NO** | **NO** | DKR Resolved Capability Hash |
| **6. Application Feature Layer** | Entitlement, Permission, Subscription | N/A (Does not alter HW) | N/A | URPA / MSE Authorization Token |

---

## 64. COMMAND CAPABILITY MATRIX

| Canonical Command Preset | Required Hardware Feature | Required Installation | Required Provider Capability | Required User Permission | Safety Policy Required? | Device ACK Required? |
| :--- | :--- | :--- | :--- | :--- | :---: | :---: |
| **`Engine Disable`** | Digital Output Pin + Relay Driver | Physical Relay Wired | Relay Toggle Command | `commands.engine_disable.request` | **YES (Safe State)** | **YES** |
| **`Engine Restore`** | Digital Output Pin + Relay Driver | Physical Relay Wired | Relay Restore Command | `commands.engine_restore.request` | **YES** | **YES** |
| **`Status / Diagnostics`** | Modem Firmware Processor | Basic Power Connected | Status Query Command | `commands.status.query` | NO | YES |
| **`GPS Wakeup`** | Low-Power Wakeup Timer | Basic Power Connected | Wakeup SMS/GPRS Frame | `commands.gps_wakeup.request` | NO | YES |
| **`Reboot Device`** | Hardware Watchdog / MCU | Basic Power Connected | MCU Reset Command | `commands.reboot.request` | **YES** | **YES** |
| **`Configure APN`** | Cellular Modem NVRAM | SIM Inserted | Parameter Write Frame | `commands.apn_config.request` | **YES** | **YES** |

---

## 65. MEDIA CAPABILITY MATRIX

| Conceptual Media Category | Hardware Prerequisites | Physical Installation Required | Bandwidth & Storage Prereqs | Applicable User Permission | Legal / Privacy Precondition |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Voice Call Monitoring** | High-sensitivity Microphone | Cabin Mic Mounting & Wiring | Cellular Voice / Audio Stream | `media.voice.monitor_call` | **Explicit Consent / Notice** |
| **Two-Way Audio** | Mic + Internal/External Speaker| Speaker & Mic Cabin Wiring | Full-Duplex Audio Channel | `media.intercom.two_way_speak` | **Interactive Consent / Notice**|
| **Audio Recording** | Mic + DSP Event Recorder | Cabin Mic Mounting | Onboard / Cloud Audio Buffer | `media.audio.record_event` | **Incident Policy Compliance** |
| **Live Video Streaming** | Road/Cabin Camera Sensors | Windshield Mount + Harness | 4G LTE High-Speed Uplink | `media.video.stream_live` | **Workplace / Privacy Notice** |
| **Recorded Video Playback**| Camera + H.264/H.265 Encoder | Continuous Power Harness | Onboard MicroSD Card ($>32$GB)| `media.video.playback` | **Authorized Audit Policy** |
| **Evidence Export** | Watermarking / Hash Engine | Cryptographic Integrity | Tamper-Proof Storage Vault | `media.evidence.export` | **Chain of Custody Legal Basis**|

---

## 66. CAPABILITY STATE / EVIDENCE MATRIX

| Initial State | New Evidence Presented | Validation Condition | Resulting Capability State | Customer UI Impact | Outbound Command Permitted? |
| :--- | :--- | :--- | :---: | :---: | :---: |
| **`UNKNOWN`** | None | No documentation or inspection | **`UNKNOWN`** | Displayed as "Unknown" / Inactive | **NO (Blocked)** |
| **`UNKNOWN`** | OEM Engineering Documentation | Model-wide inherent support proven | **`UNVERIFIED`** (Instance)| Displayed as "Setup Required"| **NO (Blocked)** |
| **`UNVERIFIED`** | Technician Inspection Report | Relay / Sensor physical wire proven | **Verified / Supported** | Fully Enabled | **YES (If Authorized)** |
| **Verified / Supported**| Maintenance Report | Relay removed during vehicle repair | **`UNSUPPORTED`** | Displayed as "Unsupported" | **NO (Blocked)** |
| **`UNSUPPORTED`** | Commercial Subscription Paid | Customer purchases Premium Pack | **`UNSUPPORTED` (Immutable)**| Disabled / "Hardware Incapable"| **NO (Blocked)** |

---

## 67. DEVICE LIFECYCLE IMPACT MATRIX

| Device Lifecycle Event | Impact on Model Capability Profile | Impact on Device Instance Effective Capability | Action Required in DKR |
| :--- | :--- | :--- | :--- |
| **Device Staging & Onboarding** | Profile matched from shared catalogue | Defaults to `UNVERIFIED` for install-dependent features | Assign IMEI to Profile; generate internal ID. |
| **Field Installation Complete** | No change | Installation-dependent features evaluate as verified | Upload commissioning report. |
| **Firmware Update Deployed** | No change | Re-evaluates protocol & firmware capability flags | Validate reported build against profile. |
| **Device RMA / Replacement** | No change | Old instance retired; new instance initialized as `UNVERIFIED` | Create new instance record; link RMA ticket. |
| **Vehicle Transfer (Physical Relocation)**| No change | Install-dependent features reset to `UNVERIFIED` | Require technician commissioning sign-off. |
| **Vehicle Transfer (Logical Rebinding)** | No change | No change to verified wiring capabilities | Update administrative metadata binding. |
| **Provider Migration** | No change | Re-evaluates provider gateway translation support | Validate command presets with new adapter. |
| **Device Decommissioning / Retirement** | No change | All capabilities transition to inactive / retired | Lock instance; retain historical provenance. |

---

## 68. RESPONSIBILITY MATRIX

| Capability Domain | Platform Technical Authority (`devices.registry.verify`) | Field Installation Technician | SaaS Tenant Administrator | External Tracking Provider | AI Model Assistant |
| :--- | :---: | :---: | :---: | :---: | :---: |
| **Create Capability Profiles** | **PRIMARY** | NO ACCESS | NO ACCESS | NO ACCESS | Advisory Only |
| **Verify Hardware Specifications**| **PRIMARY** | Inspection Input | NO AUTHORITY | NO AUTHORITY | Advisory Only |
| **Submit Installation Sign-Off** | Review & Audit | **PRIMARY** | NO AUTHORITY | NO AUTHORITY | NO ACCESS |
| **Configure Effective Overrides** | **PRIMARY** | Ticket Request | NO AUTHORITY | NO AUTHORITY | NO ACCESS |
| **Map Provider Command Adapters** | **PRIMARY** | NO ACCESS | NO ACCESS | Metadata Input | Advisory Only |
| **View Device Capabilities** | **YES** | **YES** | **YES** | NO ACCESS | Read-Only Summary |

---

## 69. NON-FUNCTIONAL REQUIREMENTS

- **DCR-NFR-001 (Verification Integrity):** 100% of capabilities exposed in customer applications MUST be backed by verified evidence in the DKR.
- **DCR-NFR-002 (Fail-Closed Default):** Any device instance with missing, conflicting, or unverified capability evidence MUST fail closed, blocking associated operational features and command dispatch.
- **DCR-NFR-003 (Strict Tenant Isolation):** Shared model knowledge SHALL NEVER leak private tenant IMEI numbers, vehicle registrations, or customer operational data (`TISB-TEN-008`).
- **DCR-NFR-004 (Immutable Audit Logging):** All capability profile modifications, instance verifications, and override actions MUST generate durable, auditable records (`PRD-AUD-002`).
- **DCR-NFR-005 (Evaluation Performance):** Dynamic effective capability resolution MUST execute efficiently without locking transactional SaaS business tables (`PRD-NFR-001`).
- **DCR-NFR-006 (Hardware Portability):** Device Capability Profiles MUST remain independent of specific tracking providers or cellular carriers, enabling seamless hardware portability.
- **DCR-NFR-007 (Technology Neutrality):** The DKR specification SHALL NOT mandate specific database engines, message queues, or infrastructure frameworks.
- **DCR-NFR-008 (Tamper-Resistant Provenance):** Evidence records retained under approved policy MUST preserve unalterable provenance indicating who verified the capability and when.

---

## 70. ACCEPTANCE CRITERIA

- **DCR-ACC-001 (Device Capability Registry Acceptance Gates):**
  1. *DKR Sole Authority:* Technical capability truth derives exclusively from verified DKR records.
  2. *Sales / Marketing Barred:* Commercial packages, marketing claims, and sales requests cannot verify capabilities.
  3. *AI Non-Authority:* Artificial intelligence cannot independently verify capabilities or override hardware states.
  4. *Provider Metadata Non-Authority:* Provider gateway metadata alone cannot verify unsupported hardware features.
  5. *Model vs Instance Separation:* Inherent model profiles and effective instance capabilities remain strictly decoupled.
  6. *No Automatic Entitlement:* Physical hardware capability does not grant commercial subscription entitlement.
  7. *No Subscription-Manufactured Hardware:* Purchasing a subscription cannot make incapable hardware functional.
  8. *Granular Model Variants:* Tracks distinct base models, hardware revisions, and regional sub-variants.
  9. *No TAC / IMEI Guessing:* Capabilities are never inferred purely from IMEI prefixes without profile mapping.
  10. *OEM Disambiguation:* Rebranded and clone devices require distinct verification.
  11. *Firmware Sensitivity:* Feature availability evaluates against reported firmware builds.
  12. *Protocol Constraints:* Features reflect verified capabilities of the active wire protocol without treating protocol as sole authority.
  13. *Installation Dependency:* Applicable relay, fuel sensors, panic buttons, and cameras require verified installation wiring.
  14. *Relay Verification Required:* Engine Disable capability requires verified physical relay installation.
  15. *ACC Wire Verification:* Ignition detection requires verified ACC line connection or voltage calibration where applicable.
  16. *Fuel Sensor Verification:* Fuel tracking requires verified analog/ultrasonic/CAN hardware wiring.
  17. *Panic Button Verification:* SOS alarms require verified in-cabin panic button installation where external button is used.
  18. *Dashcam Verification:* Video streaming requires verified camera harness and SD card readiness.
  19. *Microphone Verification:* Voice monitoring requires verified cabin microphone installation where external mic is used.
  20. *Contextual Evidence Classes:* Evaluates evidence based on domain applicability without rigid linear ranking.
  21. *Evidence Provenance:* All capability verifications record timestamp, authority ID, and source artifact.
  22. *Provenance != Infinite Retention:* Provenance accuracy for retained records does not mandate infinite storage.
  23. *Standardized States & Classifications:* Supports `UNKNOWN`, `UNVERIFIED`, `UNSUPPORTED`, and conceptual operational states.
  24. *Fail-Safe Unknown State:* `UNKNOWN` capabilities block false availability claims and command dispatch while allowing truthful status display.
  25. *Fail-Safe Unverified State:* `UNVERIFIED` installation features block customer command execution while permitting truthful setup indicators.
  26. *Immutable Unsupported State:* `UNSUPPORTED` hardware constraints can never be overridden by software toggles.
  27. *Triggered Re-Evaluation:* Firmware upgrades, provider migrations, and physical vehicle transfers trigger capability re-evaluation.
  28. *RMA Independence:* Replacement devices receive distinct internal identities and require independent verification.
  29. *Reassignment Disambiguation:* Physical device relocation resets installation-dependent capabilities, while logical rebinding preserves verified wiring.
  30. *Provider Migration Impact:* Provider migration re-evaluates provider-exposed translation without altering hardware truth.
  31. *Location Decomposition:* Decouples GNSS positioning, assisted GPS, and cell tower LBS fallback.
  32. *Power Source Disambiguation:* External vehicle supply voltage and internal backup battery remain strictly distinct.
  33. *Power Cut Detection:* Power disconnect alerts require verified internal backup battery hardware.
  34. *Fuel Analog vs CAN Separation:* Analog resistive fuel floats and CAN-bus digital decoders remain separate.
  35. *Platform vs Native Separation:* Geofencing and overspeed scoring are recognized as platform-computed features.
  36. *Status Query Granularity:* Diagnostic status queries require firmware and provider support.
  37. *Remote Wakeup Capability:* GPS wakeup requires low-power modem timer support.
  38. *USSD Modem Separation:* USSD balance queries require modem, SIM, and carrier compatibility.
  39. *Canonical Engine Terms:* Uses strictly **`Engine Disable`** and **`Engine Restore`**.
  40. *Zero Informal Immobilization Terms:* Zero occurrences of informal or legacy engine immobilization phrasing.
  41. *Engine Permission Tokens:* Enforces exact approved tokens `commands.engine_disable.request` and `commands.engine_restore.request`.
  42. *Zero Numeric Speed Threshold:* No fixed numeric speed threshold is mandated as a universal command gate.
  43. *Capability != Authorization:* Verified immobilization capability does not bypass 9-term command authorization.
  44. *Command Granularity:* Rejects monolithic `supports_commands = true` flags in favor of per-command evaluation.
  45. *Provider ACK != Device ACK:* Provider queue acceptance is not misrepresented as physical device execution.
  46. *Offline Device Status:* Offline devices return transparent offline status without fabricating command success.
  47. *Granular Voice Concepts:* Decouples `voice_call_monitoring`, `two_way_audio`, `audio_recording`, `live_audio_stream`.
  48. *Exact Voice IAM Tokens:* Uses exact approved tokens `media.voice.monitor_call`, `media.intercom.two_way_speak`, etc.
  49. *Granular Video Categories:* Decouples live video, video playback, event clips, snapshots, multi-camera, and evidence export.
  50. *Exact Video IAM Tokens:* Uses exact approved tokens `media.video.stream_live`, `media.video.playback`, `media.evidence.export`.
  51. *No Guessed Video Specs:* No invented camera counts, resolutions, codecs, or storage durations.
  52. *Camera Readiness Check:* Video capabilities require verified camera harness attachment.
  53. *Sensor Extensions:* Models door sensors, multi-temperature probes, BLE beacons, and iButton driver ID.
  54. *Applicable Dependency Chains:* Enforces deterministic prerequisites for advanced composite capabilities based on applicable layers.
  55. *Immutable Profile Templates:* Capability Profiles maintain immutable versioned hardware specifications.
  56. *Dynamic Effective Resolution:* Instance capabilities evaluate dynamically across applicable profile, firmware, wiring, and provider layers.
  57. *Override Lockdown:* Instance capability overrides require `devices.registry.verify` and technical justification.
  58. *Admins Cannot Forge Hardware:* Administrators cannot override physical hardware limitations.
  59. *Privileged Verification IAM:* Technical verification is restricted to platform technical authority (`devices.registry.verify`).
  60. *Tenant Admin Isolation:* Tenant admins have read-only visibility into verified capabilities.
  61. *Tenant Perimeter Isolation:* Device instances and telemetry remain strictly tenant-isolated (`TISB-TEN-001`).
  62. *Shared Catalogue Safety:* Global capability profiles contain zero tenant PII or operational telemetry.
  63. *Provider Command Mapping:* DKR maps canonical capabilities to provider-specific command frames.
  64. *Unknown Device Restricted Review:* Unrecognized device IMEIs enter restricted technical review with `UNKNOWN` capability state.
  65. *Isolated Capability Testing:* Hardware verification testing executes in dedicated test tenant accounts.
  66. *Capability Deprecation:* Compromised hardware capabilities can be deprecated globally.
  67. *Durable Auditability:* Material registry changes generate durable, auditable logs.
  68. *Commercial Independence:* DKR technical truth is decoupled from commercial package pricing.
  69. *Warehouse Staging Integration:* Inventory onboarding links physical hardware to verified profiles.
  70. *Technician Commissioning Sign-Off:* Digital checklists substantiate installation evidence.
  71. *Vehicle Knowledge Separation:* Device capabilities remain distinct from vehicle electrical compatibility.
  72. *No False Regulatory Claims:* Platform asserts no unverified BTRC or BRTA hardware certifications.
  73. *No Invented Official Endpoints:* Government integration endpoints are not fabricated.
  74. *Scalable Evaluation:* Dynamic capability evaluation avoids locking relational business tables.
  75. *Technology Neutrality:* Contains zero mandatory database, queue, or container infrastructure lock-in.
  76. *Zero Application Implementation:* Contains zero executable application code or schema DDL.

---

## 71. UPSTREAM TRACEABILITY

| Specification Requirement ID | Upstream PRD ID(s) | Upstream Entitlement ID(s) | Upstream Roles & Access ID(s) | Upstream Tenant Boundary ID(s) | Upstream Commercial Model ID(s) | Upstream Provider Arch ID(s) | Primary Subject Covered |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **DCR-GEN-001 to DCR-GEN-006** | `PRD-GEN-001`, `PRD-DKR-001` | `MSE-GEN-001`, `MSE-DEV-001` | `URPA-GEN-001` | `TISB-GEN-001` | `CTCM-GEN-001` | `TPA-GEN-001`, `TPA-CAP-001` | Core Governance & Purpose |
| **DCR-CAP-001 to DCR-CAP-008** | `PRD-DKR-001`, `PRD-DKR-002` | `MSE-DEV-001` | `URPA-DEV-001` | `TISB-CMD-001` | `CTCM-DEV-003`, `CTCM-GEN-011` | `TPA-CAP-001`, `TPA-CAP-002` | Capability Authority & Resolution |
| **DCR-MDL-001 to DCR-MDL-006** | `PRD-DKR-001` | `MSE-DEV-001` | `URPA-DEV-001` | `TISB-TEN-008` | `CTCM-DEV-001` to `CTCM-DEV-005` | `TPA-DEV-001` | Model Knowledge vs Instance |
| **DCR-ID-001 to DCR-ID-003** | `PRD-DKR-001` | `MSE-DEV-001` | `URPA-DEV-001` | `TISB-TEL-001`, `TISB-SEC-007` | `CTCM-DEV-001` | `TPA-DEV-001`, `TPA-MAP-002` | Device Identity & Disambiguation |
| **DCR-FW-001, DCR-FW-002** | `PRD-DKR-002` | `MSE-DEV-001` | `URPA-DEV-001` | `TISB-PRV-004` | `CTCM-DEV-002` | `TPA-NRM-003` | Firmware Sensitivity & Upgrades |
| **DCR-PRT-001, DCR-PRT-002** | `PRD-TRK-001` | `MSE-TRK-001` | `URPA-PERM-001` | `TISB-PRV-001` | `CTCM-GEN-009` | `TPA-ING-002`, `TPA-NRM-001` | Protocol Constraints & Dialects |
| **DCR-PRV-001 to DCR-PRV-003** | `PRD-PRV-001` | `MSE-PRV-001` | `URPA-ADM-001` | `TISB-PRV-002` | `CTCM-B2B-003` | `TPA-PRV-001`, `TPA-CMD-001` | Provider Evidence & Command Translation |
| **DCR-INS-001, DCR-INS-002** | `PRD-CMD-001`, `PRD-VOC-001` | `MSE-CMD-001`, `MSE-VOC-001` | `URPA-CMD-001` | `TISB-CMD-001` | `CTCM-DEV-003` | `TPA-CMD-002`, `TPA-MED-003` | Installation Wiring Dependencies |
| **DCR-EVD-001 to DCR-EVD-003** | `PRD-DKR-001`, `PRD-AUD-002` | `MSE-DEV-001` | `URPA-DEV-001` | `TISB-AUD-001` | `CTCM-AUD-001` | `TPA-NRM-003`, `TPA-AUD-001` | Evidence Classes & Provenance |
| **DCR-LCY-001 to DCR-LCY-005** | `PRD-RET-001` | `MSE-SYS-001` | `URPA-USER-005` | `TISB-PRVY-001` | `CTCM-DEV-008`, `CTCM-LCY-004` | `TPA-MIG-001`, `TPA-OFF-003` | Lifecycle Triggers, RMA & Migration |
| **DCR-SEN-001 to DCR-SEN-005** | `PRD-TRK-001`, `PRD-ALT-001` | `MSE-TRK-001`, `MSE-ALT-001` | `URPA-PERM-001` | `TISB-TEL-001` | `CTCM-SIM-001`, `CTCM-SUB-002` | `TPA-TEL-003`, `TPA-SIM-001` | Location, Power, Fuel & Sensors |
| **DCR-CMD-001 to DCR-CMD-006** | `PRD-CMD-001` to `PRD-CMD-003`| `MSE-CMD-001` | `URPA-CMD-001` | `TISB-CMD-001` | `CTCM-CMD-001` | `TPA-CMD-001` to `TPA-CMD-008`| Command Presets, Safety & ACKs |
| **DCR-MED-001 to DCR-MED-003** | `PRD-VOC-001`, `PRD-VID-001` | `MSE-VOC-001`, `MSE-TRK-001` | `URPA-MED-001` | `TISB-MED-001` | `CTCM-SUB-005` | `TPA-MED-001` to `TPA-MED-004`| Voice & Video Media Decompositions |
| **DCR-ADM-001, DCR-ADM-002** | `PRD-AUT-001` | `MSE-ADM-001` | `URPA-DEV-001`, `URPA-PERM-004`| `TISB-TEN-008` | `CTCM-AUD-002` | `TPA-ADM-001` | Verification Authority & Lockdown |
| **DCR-TEN-001, DCR-TEN-002** | `PRD-ISO-001` | `MSE-GEN-001` | `URPA-TEN-001` | `TISB-TEN-001`, `TISB-TEN-008` | `CTCM-TEN-001` | `TPA-PRV-002` | Tenant Boundary & Shared Catalogue |
| **DCR-TST-001** | `PRD-DMO-001` | `MSE-DMO-001` | `URPA-DMO-001` | `TISB-DMO-002` | `CTCM-SLS-004` | `TPA-TST-001`, `TPA-TST-002` | Controlled Test Isolation |
| **DCR-AUD-001** | `PRD-AUD-002` | `MSE-AUD-001` | `URPA-AUD-001` | `TISB-AUD-001` | `CTCM-AUD-004` | `TPA-AUD-001` | Durable Auditability |
| **DCR-COM-001** | `PRD-B2B-001` | `MSE-ADM-001` | `URPA-ROLE-014` | `TISB-TEN-008` | `CTCM-GEN-009`, `CTCM-DEV-003` | `TPA-COM-001` | Commercial Boundary Decoupling |
| **DCR-INT-001 to DCR-INT-003** | `PRD-DKR-001`, `PRD-TRK-001` | `MSE-DEV-001` | `URPA-DEV-001` | `TISB-INT-001` | `CTCM-DEV-001`, `CTCM-DEV-008` | `TPA-DEV-001` | Inventory, Technician & Vehicle Boundaries |
| **DCR-REG-001** | `PRD-GEN-001` | `MSE-SYS-001` | `URPA-ADM-001` | `TISB-INT-001` | `CTCM-PAY-005` | `TPA-REG-001` | Regulatory Preconditions |
| **DCR-AI-001** | `PRD-AUT-001` | `MSE-SYS-001` | `URPA-AUTH-001` | `TISB-SEC-001` | `CTCM-AUD-001` | `TPA-AI-001`, `TPA-AI-002` | AI Non-Authority Perimeter |
| **DCR-SCL-001** | `PRD-NFR-001` | `MSE-NFR-001` | `URPA-NFR-001` | `TISB-NFR-001` | `CTCM-NFR-001` | `TPA-SCL-001` | Scalability & Performance |
| **DCR-EXT-001** | `PRD-PRV-001` | `MSE-PRV-001` | `URPA-PERM-001` | `TISB-PRV-002` | `CTCM-SUB-002` | `TPA-EXT-001`, `TPA-EXT-002` | Core vs Specialized Extensions |
| **DCR-NFR-001 to DCR-NFR-008** | `PRD-NFR-001` to `PRD-NFR-004`| `MSE-NFR-001` to `MSE-NFR-004`| `URPA-NFR-001` to `URPA-NFR-004`| `TISB-NFR-001` to `TISB-NFR-004`| `CTCM-NFR-001` to `CTCM-NFR-004`| `TPA-NFR-001` to `TPA-NFR-008`| Non-Functional Engineering Standards |
| **DCR-ACC-001** | `PRD-GEN-001` | `MSE-GEN-001` | `URPA-GEN-001` | `TISB-ACC-001` | `CTCM-ACC-001` | `TPA-ACC-001` | Comprehensive Acceptance Criteria |

---

## 72. OPEN ITEMS

The following open decisions from approved upstream baselines are carried forward without premature resolution:

| Decision ID | Subject / Topic | Upstream Baseline Status | Status in this Specification |
| :--- | :--- | :--- | :--- |
| **DEC-001** | Final Commercial Product & Brand Name | TBD (Temporary Working Name: EasyTracker) | Supported under neutral multi-brand framework. |
| **DEC-002** | Initial 3rd-Party Licensed VTS Provider(s) | TBD (Candidate examples: GP IoT, Robi, Bondstein) | Decoupled via provider capability translation mapping. |
| **DEC-003** | Initial Production Hardware Device Catalogue | TBD (S102A is pilot evidence; production requires DKR verification)| Supported via evidence-based Capability Profile architecture. |
| **DEC-009** | Telemetry Raw Data Retention Duration | TBD + Statutory legal/privacy verification required | Supported via multi-tier evidence & data retention design. |
| **DEC-010** | Crash Video Clip Retention Duration | TBD + Statutory legal/privacy verification required | Supported via media retention governance. |
| **DEC-011** | Cabin Voice Recording Retention Duration | TBD + Statutory legal/privacy verification required | Supported via voice retention governance. |
| **DEC-013** | Initial Vehicle Seed Catalogue Scope | TBD based on initial target customer segments | Strictly decoupled from Device Capability Registry. |
| **DEC-014** | Production AI Sensitive Data Class Approval | Zero PII / live telemetry sent to free cloud AI models | Strict device secret & location privacy perimeter. |

---

## 73. LEGAL / REGULATORY VERIFICATION ITEMS

- **Telecommunications Equipment Standards in Bangladesh:** Verification of statutory equipment standardization, IMEI registration guidelines, and import type approvals under the Bangladesh Telecommunication Regulatory Commission (BTRC) (LEGAL / REGULATORY VERIFICATION REQUIRED).
- **Automotive Immobilizer Safety Standards:** Verification of national road safety regulations and vehicle electrical modification compliance under the Bangladesh Road Transport Authority (BRTA).
- **Audio / Video Surveillance Legal Notice:** Verification of statutory workplace notification, driver consent, and privacy protections governing in-cabin voice recording and camera streaming.
- **Cross-Border Telematics Processing:** Verification of statutory data localization rules governing telematics metadata processed outside Bangladesh.

---

## 74. BLOCKING QUESTIONS

> **Zero Blocking Questions.**  
The evidence-driven Device Knowledge & Capability Registry, multi-layer capability decomposition, installation dependency boundaries, fail-safe capability states, and role-based verification governance are fully specified based on approved upstream baselines (`PRODUCT_REQUIREMENTS.md` v1.0, `MODULE_SERVICE_ENTITLEMENT_SPEC.md` v1.0, `USER_ROLES_PERMISSIONS_ACCESS_SPEC.md` v1.0, `TENANT_ISOLATION_SECURITY_BOUNDARY_SPEC.md` v1.0, `CUSTOMER_TYPES_COMMERCIAL_MODEL_SPEC.md` v1.0, and `TRACKING_PROVIDER_ARCHITECTURE_SPEC.md` v1.0). Strategic open items—including `DEC-003` (initial production hardware catalogue)—are intentional upstream decisions safely accommodated by the registry abstraction layer.

---

## 75. BUILT-IN STATIC AUDIT

| Audit Check Dimension | Verification Rule | Audit Result | Compliance Notes |
| :--- | :--- | :---: | :--- |
| **1. Upstream ID Existence** | 100% of cited upstream IDs exist in PRD, MSE, URPA, TISB, CTCM, TPA. | **PASS** | Fully validated against approved baseline texts. |
| **2. IAM Permission Exactness** | 100% of IAM tokens match exact approved URPA vocabulary. | **PASS** | Exact tokens: `devices.registry.verify`, `commands.engine_disable.request`, etc. |
| **3. Zero Inferred / Invented IAM Tokens** | No unauthorized tokens present. | **PASS** | Zero unauthorized IAM tokens in specification. |
| **4. Registry Verification Token** | `devices.registry.verify` confirmed as `PLATFORM_RESERVED` URPA token. | **PASS** | Verified in URPA Section 11 & Section 15. |
| **5. Canonical Engine Commands** | Uses strictly `Engine Disable` and `Engine Restore`. | **PASS** | Zero instances of informal immobilization terms. |
| **6. Zero Speed Thresholds** | Zero fixed numeric speed thresholds for engine immobilization. | **PASS** | Zero mandatory speed thresholds in specification. |
| **7. Commercial Independence** | Commercial subscription cannot manufacture technical capability. | **PASS** | Enforced in `DCR-CAP-005` & `DCR-COM-001`. |
| **8. Provider Non-Authority** | Provider gateway metadata alone cannot verify unsupported hardware. | **PASS** | Enforced in `DCR-PRV-001` & `DCR-PRV-002`. |
| **9. AI Non-Authority** | AI cannot verify capabilities or override hardware states. | **PASS** | Enforced in `DCR-AI-001`. |
| **10. Model vs Instance Separation** | Shared profile knowledge is decoupled from effective instance state. | **PASS** | Enforced in `DCR-MDL-001` & `DCR-CAP-008`. |
| **11. Applicable Prerequisites Model**| Evaluates only applicable layers per capability without universal mandates.| **PASS** | Enforced in `DCR-INS-002` & `DCR-CAP-008`. |
| **12. RMA Independence** | Replacement devices receive new internal IDs and independent proof. | **PASS** | Enforced in `DCR-LCY-002`. |
| **13. Provider ACK != Device ACK** | Gateway transmission acceptance is not physical execution success. | **PASS** | Enforced in `DCR-CMD-006`. |
| **14. Granular Voice Decomposition** | Decouples `voice_call_monitoring`, `two_way_audio`, `audio_recording`, etc. | **PASS** | Enforced in `DCR-MED-001`. |
| **15. Conceptual Video Categories** | Models conceptual media categories without rigid enum schemas. | **PASS** | Enforced in `DCR-MED-002`. |
| **16. Power Source Disambiguation** | External vehicle 12V/24V power $\neq$ Internal backup battery. | **PASS** | Enforced in `DCR-SEN-002`. |
| **17. Native vs Platform Separation**| Geofencing and overspeed scoring are platform-computed features. | **PASS** | Enforced in `DCR-CAP-006`. |
| **18. Shared Catalogue Safety** | Global model knowledge contains zero tenant PII or operational data. | **PASS** | Enforced in `DCR-TEN-002`. |
| **19. Regulatory Neutrality** | Asserts no unverified BTRC/BRTA hardware certifications. | **PASS** | Enforced in `DCR-REG-001`. |
| **20. Implementation Neutrality** | Contains zero database schemas, SQL, Kafka, or TimescaleDB lock-in. | **PASS** | Enforced in `DCR-GEN-003` & `DCR-NFR-007`. |
| **21. Open Decision Streamlining** | Retains only genuinely relevant PRD Open Decisions. | **PASS** | `DEC-001`–`003`, `DEC-009`–`011`, `DEC-013`–`014` preserved. |
| **22. Requirement ID Stability** | Exactly 77 unique, stable requirement IDs defined. | **PASS** | `DCR-GEN-001` through `DCR-ACC-001` verified. |

---

## 76. SPECIFICATION VERDICT

> # **DEVICE CAPABILITY REGISTRY APPROVED — AUTHORITATIVE BASELINE**

This authoritative downstream specification strictly adheres to approved Product Requirements Document v1.0 (`abef605`), Module & Service Entitlement Specification v1.0 (`a962a2a`), User Roles, Permissions, Authority & Access Specification v1.0 (`25e7834`), Tenant Isolation & Security Boundary Specification v1.0 (`93d7a4e`), Customer Types & Commercial Model Specification v1.0 (`4014141`), and Tracking Provider Architecture Specification v1.0 (`88bcd53`), establishes the complete evidence-driven framework for device technical capabilities, and is formally approved as the authoritative architectural baseline.
