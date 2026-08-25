# 🚀 EasyTracker 4096 Virtual Routing-Slot & Tracking Cell Architecture

Designed for **20 Lakh (2,000,000) IoT & GPS Telematics Devices** with high concurrency, ultra-low latency, and 95% disk savings.

---

## 🏗️ 1. Architecture Highlights

1. **4,096 Virtual Routing Slots (`0` to `4095`):**
   - Every GPS device / IMEI deterministically maps to one of 4096 virtual routing slots via `get_imei_virtual_slot(imei)`.
   - The lookup table `virtual_routing_slots` dynamically maps each slot to an active Tracking Cell.
   - **Zero Physical Partitioning Overkill:** Implemented as a single metadata lookup table, avoiding 4,096 physical database tables.

2. **Tracking Cell Model (`TRACKING_CELL_001`):**
   - The initial deployment on Oracle Cloud Always Free operates as `TRACKING_CELL_001`.
   - All 4,096 slots (`0..4095`) are initially assigned to `TRACKING_CELL_001`.
   - When horizontal scaling is required in the future (e.g. adding `TRACKING_CELL_002` on Contabo or Hetzner), slot ranges (e.g., `2048..4095`) are reassigned with a single SQL statement without any schema or code changes.

3. **TimescaleDB Space-Time Hypertables:**
   - `tc_positions` is partitioned into **7-day time slots**.
   - Automatic columnar compression compresses data older than 7 days by **90% to 95%**.
   - Automatic data retention policy manages chunks older than 180 days.

4. **Multi-Protocol Support (Bangladesh Standard):**
   - **GT06 / Concox / Sinotrack:** Port `5023` (TCP/UDP)
   - **Teltonika (FMB920 / FMC130):** Port `5027` (TCP/UDP)
   - **Coban / GPS103 / TK103:** Port `5001` (TCP)
   - **H02 Protocol:** Port `5013` (TCP)
   - **Traccar Client / OsmAnd:** Port `5055` (HTTP)
   - **Watch Protocol:** Port `5093` (TCP)

---

## ⚡ 2. 1-Click Deployment on Oracle VPS (`TRACKING_CELL_001`)

Upload the `database_scripts` folder to your Ubuntu VPS and run:

```bash
cd database_scripts
chmod +x setup_server.sh
sudo ./setup_server.sh
```

---

## 🌐 3. Nginx Reverse Proxy & SSL Configuration

```nginx
# 1. Traccar Ingestion & API Gateway
server {
    server_name gps.easysoftsolution.net;

    location / {
        proxy_pass http://127.0.0.1:8082;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}

# 2. EasyTracker Web App / SaaS Portal
server {
    server_name easytracker.easysoftsolution.net;
    root /var/www/easytracker/dist;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }
}
```

Then run `sudo certbot --nginx -d gps.easysoftsolution.net -d easytracker.easysoftsolution.net` for free SSL!
