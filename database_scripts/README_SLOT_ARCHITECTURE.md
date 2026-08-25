# 🚀 EasyTracker Slot-Wise Database & TimescaleDB Architecture

Designed for **20 Lakh (2,000,000) IoT & GPS Telematics Devices** with high concurrency, ultra-low latency, and 95% disk savings.

---

## 🏗️ 1. Architecture Highlights

1. **Space-Time 2D Hypertable Partitioning:**
   - `tc_positions` is partitioned by **7-day time slots** and **16 device-hash space slots**.
   - Solves table lock contention and supports 200,000+ writes/sec.

2. **Automated Columnar Compression:**
   - Automatically compresses telemetry chunks older than 7 days.
   - Saves **90% to 95% disk space** (e.g. 500 GB raw GPS points compress down to ~35 GB).

3. **Partner & Tenant Slot Quotas:**
   - Dedicated tables `partner_slot_quotas` and `device_slot_assignments`.
   - Floating credit ledger, negative balance thresholds, and 1-tap slot assignment function `allocate_device_to_partner_slot()`.

4. **Continuous Aggregates (Real-Time Stats):**
   - Materialized real-time daily summary (`daily_device_telematics_summary`) for instant report calculation without scanning billions of raw telemetry rows.

---

## ⚡ 2. 1-Click Deployment on Oracle / Contabo VPS

Upload the `database_scripts` folder to your Ubuntu VPS and run:

```bash
chmod +x setup_server.sh
./setup_server.sh
```

---

## 🌐 3. Nginx Reverse Proxy & SSL Configuration

To connect `gps.easysoftsolution.net` to Traccar with SSL:

```nginx
server {
    server_name gps.easysoftsolution.net;

    location / {
        proxy_pass http://localhost:8082;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

Then run `sudo certbot --nginx -d gps.easysoftsolution.net` for free Let's Encrypt SSL!
