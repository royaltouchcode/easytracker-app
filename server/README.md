# 🚀 EasyTracker Enterprise Server Web Application & Telematics Cluster

A decoupled, multi-tenant GPS Telematics & ERP SaaS stack engineered to scale to **2,000,000+ (20 Lakh) IoT devices** with sub-millisecond real-time map tracking.

---

## 🏛️ Architecture Highlights (HARD RULE ENFORCED)

1. **Separated ERP Control Plane (PostgreSQL 16):**
   - Strictly manages Customers, Tenants, Subscriptions, bKash Payments, Seller Quotas & Technician Negative Ledgers.
2. **Separated Telemetry Data Plane (TimescaleDB / PostgreSQL 16):**
   - High-throughput ingestion of raw GPS coordinates, speed, course, ignition, battery & sensors with 90%+ chunk compression.
3. **In-Memory Position Cache (Redis 7):**
   - Sub-millisecond latest vehicle locations across 20 Lakh units.
4. **Event Streaming Broker (Apache Kafka):**
   - Real-time dispatch of SOS, wire cut, and geofence alerts.
5. **Traccar Telematics Cluster:**
   - GT06 (5023), Teltonika (5027), Coban (5001), Osmand (5055).

---

## ⚡ 1-Command Deployment Guide

### 1. Prerequisites
- Docker & Docker Compose (`docker-compose` or `docker compose`)
- Oracle Cloud VPS / AWS / Hetzner / Linux Server (Ubuntu 22.04+ Recommended)

### 2. Launch the Entire Cluster
```bash
cd server
docker compose up -d
```

### 3. Verify Health
```bash
curl http://localhost:4000/health
```

Output:
```json
{
  "status": "healthy",
  "service": "EasyTracker Multi-Tenant Telematics & ERP API Gateway",
  "version": "2.0.0",
  "scaleTarget": "2,000,000 Devices"
}
```

---

## 📡 Port Allocation Summary

| Service | Port | Description |
| :--- | :--- | :--- |
| **API Gateway** | `4000` | SaaS REST API, SSO, bKash & WebSockets |
| **Traccar Web/API** | `8082` | Internal Telematics Engine |
| **GT06 GPS Port** | `5023` | Concox, WeTrack2, ET25 |
| **Teltonika GPS Port** | `5027` | FMB920, FMC130 |
| **Coban GPS Port** | `5001` | TK103, ST-901 |
| **ERP PostgreSQL** | `5432` | Business Plane Database |
| **Telemetry DB** | `5433` | TimescaleDB Time-Series Data Plane |
| **Redis Cache** | `6379` | In-Memory Hot Position Cache |
| **Kafka Broker** | `9092` | Event Streaming Engine |
