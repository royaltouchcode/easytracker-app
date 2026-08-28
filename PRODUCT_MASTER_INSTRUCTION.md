# 🧭 EasyTracker — Product Master Architecture & Review Instruction

## 1. Architectural Principles & Constraints
1. **Regulatory & Licensing Decoupling:**
   - In Bangladesh, directly ingesting raw socket data via telco M2M SIMs without a costly BTRC VTS license carries compliance penalties.
   - EasyTracker solves this by acting as an **Enterprise SaaS & Application Layer** receiving parsed GPS/event data from licensed 3rd party providers (e.g. Grameenphone IoT, Robi M2M, Bondstein) via JSON Push Webhooks (`POST /api/v1/telemetry/push`).
   - Simultaneously, it maintains a **1-click migration switch** to native self-hosted Traccar socket clusters (Port 5027/5023) when capital and licenses are acquired.

2. **Autonomous Video & Audio Vault (Decoupled Media Layer):**
   - Media bandwidth is kept independent from 3rd party GPS tracking servers.
   - 10-second crash video clips, cabin voice logs, and dashcam snapshots are stored directly into the operator's private **Cloudflare R2 / AWS S3 / MinIO** bucket with **SHA-256 cryptographic verification** for court and insurance admissibility.

3. **Multi-Role RBAC & Security Isolation:**
   - Super Admin: System configuration, clusters, inventory, RMA, quotas.
   - Company Manager: Multi-station control, fare configuration, gatepass PIN management.
   - Counter Incharge: Gatepass clearance, platform dispatch, walkie-talkie broadcast.
   - Onboard Vehicle Supervisor: Live seat occupancy stepper, highway passenger logs, cabin intercom.
   - Bus Driver: Radar cockpit, speed governor HUD, 2-way SOS siren.

---

## 2. Technical Stack & Dependencies
- **Framework:** React 19 (SPA Architecture)
- **Language:** TypeScript 5.7+ (Strict typing)
- **Build Tool:** Vite 6/8 with `@tailwindcss/vite`
- **Icons:** `lucide-react`
- **Inter-Tab Sync:** Web `BroadcastChannel` API + `window.storage` fallback
- **Audio Synthesizer:** Native Web Audio API (`AudioContext` oscillator & gain nodes)
- **Maps & Telematics:** Leaflet / OpenStreetMap with custom vehicle markers

---

## 3. ChatGPT Review Guidelines (What to Audit)
When reviewing this codebase with ChatGPT Plus:
1. **State Consistency & Inter-Tab Broadcast:** Verify `FleetTransitHubView.tsx` `BroadcastChannel` handling, message idempotency, and fallback polling.
2. **Role Precedence Logic:** Verify role matching in `Header.tsx` and `FleetTransitHubView.tsx` to ensure Supervisor and Driver distinctions are strictly maintained.
3. **GovTech & BRTA Module:** Audit `GovTechPoliceGateway.tsx` for compliance checklist coverage and 3-tier simulator soundness.
4. **Performance & Bundle Size:** Verify tree-shaking, lazy chunk loading, and responsive design across desktop, tablet, and mobile screens.
