#!/bin/bash
# ==============================================================================
# 🚀 EASYTRACKER 20 LAKH SCALE - AUTOMATED UBUNTU SERVER PROVISIONING SCRIPT
# Supports: Oracle Cloud Always Free (ARM / x86) & Contabo / Hetzner VPS
# ==============================================================================

set -e

echo "=========================================================="
echo " Starting EasyTracker PostgreSQL + TimescaleDB Deployment "
echo "=========================================================="

# 1. Update OS & Essential Tools
sudo apt update && sudo apt upgrade -y
sudo apt install -y curl wget gnupg2 lsb-release ca-certificates unzip git ufw nginx certbot python3-certbot-nginx

# 2. Add TimescaleDB & PostgreSQL 16 Repository
sudo install -d /etc/apt/keyrings
curl -fsSL https://packagecloud.io/timescale/timescaledb/gpgkey | sudo gpg --dearmor -o /etc/apt/keyrings/timescaledb.gpg
echo "deb [signed-by=/etc/apt/keyrings/timescaledb.gpg] https://packagecloud.io/timescale/timescaledb/ubuntu/ $(lsb_release -c -s) main" | sudo tee /etc/apt/sources.list.d/timescaledb.list

sudo apt update
sudo apt install -y postgresql-16 timescaledb-2-postgresql-16

# 3. Auto-tune PostgreSQL for server RAM (Crucial for high IoT concurrency)
sudo timescaledb-tune --yes
sudo systemctl restart postgresql
sudo systemctl enable postgresql

# 4. Create Traccar Database and apply Slot Architecture
DB_PASS="EasyTrackerStrongPass2026!"

sudo -u postgres psql -c "CREATE DATABASE traccar;" || true
sudo -u postgres psql -c "CREATE USER traccar WITH ENCRYPTED PASSWORD '$DB_PASS';" || true
sudo -u postgres psql -c "GRANT ALL PRIVILEGES ON DATABASE traccar TO traccar;" || true
sudo -u postgres psql -d traccar -c "GRANT ALL ON SCHEMA public TO traccar;" || true

# Execute Slot-Wise TimescaleDB Schema
if [ -f "./traccar_timescaledb_slots.sql" ]; then
    sudo -u postgres psql -d traccar -f "./traccar_timescaledb_slots.sql"
fi

# 5. Download and Install Official Traccar Server
TRACCAR_VERSION="6.5"
cd /tmp
wget -q "https://github.com/traccar/traccar/releases/download/v${TRACCAR_VERSION}/traccar-linux-64-${TRACCAR_VERSION}.zip" -O traccar.zip || \
wget -q "https://github.com/traccar/traccar/releases/download/v${TRACCAR_VERSION}/traccar-linux-arm-${TRACCAR_VERSION}.zip" -O traccar.zip

unzip -o traccar.zip
sudo ./traccar.run

# 6. Configure Traccar XML with PostgreSQL & Slot Optimizations
cat <<EOF | sudo tee /opt/traccar/conf/traccar.xml
<?xml version='1.0' encoding='UTF-8'?>
<!DOCTYPE properties SYSTEM 'http://java.sun.com/dtd/properties.dtd'>
<properties>
    <entry key='config.default'>./conf/default.xml</entry>

    <!-- PostgreSQL + TimescaleDB Database Connection -->
    <entry key='database.driver'>org.postgresql.Driver</entry>
    <entry key='database.url'>jdbc:postgresql://localhost:5432/traccar?ssl=false&amp;tcpKeepAlive=true</entry>
    <entry key='database.user'>traccar</entry>
    <entry key='database.password'>${DB_PASS}</entry>

    <!-- Server Concurrency & Performance Tuning -->
    <entry key='database.maxPoolSize'>64</entry>
    <entry key='database.positionsHistoryDays'>180</entry>
    <entry key='server.timeout'>120</entry>

    <!-- GPS Protocol Ports (GT06, Concox, Sinotrack, Teltonika) -->
    <entry key='gt06.port'>5023</entry>
    <entry key='h02.port'>5013</entry>
    <entry key='teltonika.port'>5027</entry>
    <entry key='watch.port'>5093</entry>
</properties>
EOF

# 7. Start Traccar Service
sudo systemctl daemon-reload
sudo systemctl enable traccar
sudo systemctl restart traccar

# 8. Configure Firewall Ports
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw allow 8082/tcp
sudo ufw allow 5023/tcp
sudo ufw allow 5013/tcp
sudo ufw allow 5027/tcp
sudo ufw --force enable

echo "=========================================================="
echo " ✅ EasyTracker Traccar + TimescaleDB Setup Completed!   "
echo " Web UI: http://YOUR_SERVER_IP:8082                      "
echo " Database: PostgreSQL 16 (TimescaleDB Slot Architecture)   "
echo "=========================================================="
