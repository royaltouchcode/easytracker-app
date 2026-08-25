#!/bin/bash
# ==============================================================================
# 🚀 EASYTRACKER TELEMATICS ENTERPRISE - TRACKING_CELL_001 SETUP SCRIPT
# Automated Server Provisioning for Ubuntu (Oracle Cloud Always Free / Contabo / Hetzner)
# Configured for PostgreSQL 16, TimescaleDB, 4096 Virtual Slots, Traccar 6.5 & Nginx
# ==============================================================================

set -e

echo "======================================================================"
echo " 🚀 Initializing EasyTracker TRACKING_CELL_001 Provisioning           "
echo "======================================================================"

# 1. Update OS & Essential Dependencies
sudo apt update && sudo apt upgrade -y
sudo apt install -y curl wget gnupg2 lsb-release ca-certificates unzip git ufw nginx certbot python3-certbot-nginx default-jre

# 2. Add TimescaleDB & PostgreSQL 16 Repository
sudo install -d /etc/apt/keyrings
curl -fsSL https://packagecloud.io/timescale/timescaledb/gpgkey | sudo gpg --dearmor -o /etc/apt/keyrings/timescaledb.gpg
echo "deb [signed-by=/etc/apt/keyrings/timescaledb.gpg] https://packagecloud.io/timescale/timescaledb/ubuntu/ $(lsb_release -c -s) main" | sudo tee /etc/apt/sources.list.d/timescaledb.list

sudo apt update
sudo apt install -y postgresql-16 timescaledb-2-postgresql-16

# 3. Auto-tune PostgreSQL for server RAM
sudo timescaledb-tune --yes
sudo systemctl restart postgresql
sudo systemctl enable postgresql

# 4. Create Traccar Database & Initialize 4096 Virtual Slots Schema
DB_PASS="EasyTrackerStrongPass2026!"

sudo -u postgres psql -c "CREATE DATABASE traccar;" || true
sudo -u postgres psql -c "CREATE USER traccar WITH ENCRYPTED PASSWORD '$DB_PASS';" || true
sudo -u postgres psql -c "GRANT ALL PRIVILEGES ON DATABASE traccar TO traccar;" || true
sudo -u postgres psql -d traccar -c "GRANT ALL ON SCHEMA public TO traccar;" || true

# Execute 4096 Virtual Routing-Slot & TimescaleDB Schema
if [ -f "./traccar_timescaledb_slots.sql" ]; then
    echo "Applying 4096 Virtual Routing-Slot Schema & TRACKING_CELL_001..."
    sudo -u postgres psql -d traccar -f "./traccar_timescaledb_slots.sql"
fi

# 5. Download and Install Official Traccar Server
TRACCAR_VERSION="6.5"
cd /tmp
ARCH=$(uname -m)
if [ "$ARCH" = "aarch64" ] || [ "$ARCH" = "arm64" ]; then
    echo "Detected ARM64 Architecture (Oracle Ampere A1)..."
    wget -q "https://github.com/traccar/traccar/releases/download/v${TRACCAR_VERSION}/traccar-linux-arm-${TRACCAR_VERSION}.zip" -O traccar.zip
else
    echo "Detected x86_64 Architecture..."
    wget -q "https://github.com/traccar/traccar/releases/download/v${TRACCAR_VERSION}/traccar-linux-64-${TRACCAR_VERSION}.zip" -O traccar.zip
fi

unzip -o traccar.zip
sudo ./traccar.run

# 6. Configure Traccar XML with PostgreSQL & Protocol Ports
cat <<EOF | sudo tee /opt/traccar/conf/traccar.xml
<?xml version='1.0' encoding='UTF-8'?>
<!DOCTYPE properties SYSTEM 'http://java.sun.com/dtd/properties.dtd'>
<properties>
    <entry key='config.default'>./conf/default.xml</entry>

    <!-- PostgreSQL 16 + TimescaleDB Database Connection -->
    <entry key='database.driver'>org.postgresql.Driver</entry>
    <entry key='database.url'>jdbc:postgresql://localhost:5432/traccar?ssl=false&amp;tcpKeepAlive=true</entry>
    <entry key='database.user'>traccar</entry>
    <entry key='database.password'>${DB_PASS}</entry>

    <!-- Concurrency & Performance Tuning -->
    <entry key='database.maxPoolSize'>64</entry>
    <entry key='database.positionsHistoryDays'>180</entry>
    <entry key='server.timeout'>120</entry>

    <!-- Supported GPS Protocol Ports (Bangladesh Standard) -->
    <entry key='gt06.port'>5023</entry>
    <entry key='teltonika.port'>5027</entry>
    <entry key='gps103.port'>5001</entry>
    <entry key='h02.port'>5013</entry>
    <entry key='osmand.port'>5055</entry>
    <entry key='watch.port'>5093</entry>
</properties>
EOF

# 7. Start Traccar Service
sudo systemctl daemon-reload
sudo systemctl enable traccar
sudo systemctl restart traccar

# 8. Configure Firewall Ports (UFW)
sudo ufw allow 22/tcp
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw allow 8082/tcp
sudo ufw allow 5023/tcp
sudo ufw allow 5023/udp
sudo ufw allow 5027/tcp
sudo ufw allow 5027/udp
sudo ufw allow 5001/tcp
sudo ufw allow 5013/tcp
sudo ufw allow 5055/tcp
sudo ufw allow 5093/tcp
sudo ufw --force enable

echo "======================================================================"
echo " ✅ TRACKING_CELL_001 Successfully Deployed!                          "
echo " Web UI: http://YOUR_SERVER_IP:8082                                   "
echo " Database: PostgreSQL 16 (TimescaleDB 4096 Virtual Routing Slots)      "
echo " Protocols Enabled: GT06(5023), Teltonika(5027), GPS103(5001), H02(5013) "
echo "======================================================================"
