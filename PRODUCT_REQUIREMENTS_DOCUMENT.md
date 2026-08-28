# 📄 EasyTracker — Product Requirements Document (PRD)

## 1. Executive Summary & Vision
EasyTracker is an enterprise-grade, multi-tenant Telematics & Fleet Management SaaS platform tailored for commercial transport (buses, trucks, corporate car rentals, and logistics) operating in Bangladesh and emerging markets.

The core vision is to provide **Carrier-Grade Fleet Automation, Transit Hub Intercom, Passenger Safety, Digital Gatepass Workflows, and BRTA/BTRC GovTech Compliance** without forcing early-stage operators into high-capital licensing traps.

---

## 2. Strategic 3-Tier Decoupled Architecture
Due to BTRC (Bangladesh Telecommunication Regulatory Commission) Vehicle Tracking Service (VTS) license capital constraints, EasyTracker is designed with a **3-Tier Decoupled Architecture**:

```
┌───────────────────────────────────────────────────────────┐
│ TIER 1: Telemetry & Ingest Gateway                        │
│ - Mode A (Current): 3rd Party Licensed VTS JSON Webhook   │
│ - Mode B (Future): Native Dedicated Traccar Sockets (5027)│
│ - Mode C: Dual-Stream Firmware (GPS to VTS, Media to Vault)│
└─────────────────────────────┬─────────────────────────────┘
                              │
                              ▼
┌───────────────────────────────────────────────────────────┐
│ TIER 2: EasyTracker Application Core & Fleet SaaS         │
│ - Transit Counter Hub, Gatepass Station, Driver Cockpit   │
│ - Passenger Stepper & Route Boarding Log                  │
│ - 2-Way Emergency SOS & Web Audio Alarm Synthesizer       │
│ - Corporate ERP, Device/SIM Inventory & Warranty/RMA      │
└─────────────────────────────┬─────────────────────────────┘
                              │
                              ▼
┌───────────────────────────────────────────────────────────┐
│ TIER 3: Private Autonomous Media Vault                    │
│ - 10s Crash MP4 Blackbox & Cabin Voice Notes Storage      │
│ - Cloudflare R2 / AWS S3 / MinIO Private Storage          │
│ - SHA-256 Cryptographic Hash Seal (Court-Admissible)      │
└───────────────────────────────────────────────────────────┘
```

---

## 3. Core Functional Requirements & Modules

### A. Transit Station & Fleet Hub (`FleetTransitHubView.tsx`)
1. **Counter Incharge Portal:**
   - Real-time vehicle scheduling, departure approval, seat occupancy monitoring.
   - Quick Intercom buttons: `"👥 আরও যাত্রী আসছে"`, `"✅ প্ল্যাটফর্ম খালি"`, `"🛑 ট্রিপ ছাড়ার প্রস্তুতি"`.
   - Gatepass verification and departure clearance broadcasting.
2. **Onboard Vehicle Supervisor Portal:**
   - Big-touch highway passenger stepper (`➕ ১ জন উঠল`, `➖ ১ জন নামল`) with capacity capping (40 seats).
   - GPS auto-tagged boarding log history.
   - 2-Way emergency SOS trigger and counter dispatch calling.
3. **Bus Driver Digital Cockpit:**
   - Overspeed governor gauge, real-time highway radar, HUD telemetry.
   - Driver SOS trigger and live incoming alert banner.
4. **Company Manager Central Hub:**
   - 5-tab station setup (Station Setup, Routes & Fares, Counter Incharges, Supervisors, PIN RBAC Access Matrix).
   - Synchronized fleet-wide activity log feed.

### B. Real-Time Inter-Tab Communication & Web Audio Engine
- **Zero-Latency BroadcastChannel (`easytracker_fleet_realtime_channel`):** Instant sync across open tabs and windows without server round-trip delay.
- **Web Audio Synthesizer:** Real-time dual-tone walkie-talkie chirp `[950Hz -> 1350Hz]` and pulsating emergency SOS siren `[1175Hz <-> 880Hz]`.
- **Storage Event Fallback & 1000ms Polling:** Guarantees message delivery even in cross-origin or background tab throttling scenarios.

### C. BRTA, BTRC & Police GovTech Gateway (`GovTechPoliceGateway.tsx`)
- **AIS-140 / BRTA Telematics Packet Standard:** 5-10 second telemetry logging with 90-day archive.
- **Highway Traffic Police 2-Way Terminal:** Plate search, QR code inspection, live highway speed check, and remote stolen vehicle engine lockdown.
- **BRTA 2-Way Sync:** Fitness certificate validity, tax token monitoring, and digital document vault.
- **BTRC M2M & Spectrum Compliance:** Partner whitelist verification.

### D. SaaS Super Admin & Enterprise ERP (`AdminDashboardView.tsx`)
- **Multi-Server Cluster Manager:** Connect multiple Traccar/GPS nodes with master failover.
- **1-Click Device & SIM Binder:** Category-wise unassigned SIM filtering, feature-based hardware pairing.
- **Enterprise Inventory & RMA:** Complete serial tracking, warranty ledger, return custody, and scrap logs.
- **Rate Cards & Dealer Quotas:** Custom billing slabs, seller allowances, and commission ledgers.

---

## 4. Non-Functional & Quality Requirements
1. **Zero Garbage Code:** All dead imports, unreferenced variables, and debug console artifacts removed.
2. **Zero Blank Pages:** Every sidebar link and sub-tab must render rich, high-contrast, fully populated views.
3. **Bilingual Support:** High-quality Bengali (বাংলা) interface alongside English technical terms.
4. **Type Safety:** 100% TypeScript type checking with zero compilation errors (`npm run build` exit code 0).
