# ReliefIQ — Raspberry Pi Deployment Guide

## Requirements
- Raspberry Pi 4 or 5 (4GB+ RAM recommended)
- Raspberry Pi OS (64-bit, Bookworm or later)
- Internet connection
- Cloudflare account (free) with a domain configured

---

## 1. System Setup

```bash
sudo apt update && sudo apt upgrade -y
sudo apt install -y python3.11 python3.11-venv python3-pip nginx git curl
```

Install Node.js 20:
```bash
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs
```

---

## 2. Clone & Configure

```bash
sudo mkdir -p /opt/reliefiq
sudo chown $USER:$USER /opt/reliefiq
cd /opt/reliefiq
git clone git@github.com:sakibchy/ReliefIQ.git .
cp .env.example .env
nano .env   # Fill in your API keys
```

---

## 3. Build Frontend

```bash
cd /opt/reliefiq/frontend
npm install
npm run build
sudo mkdir -p /var/www/reliefiq
sudo cp -r dist/* /var/www/reliefiq/
```

---

## 4. Install Backend

```bash
cd /opt/reliefiq/backend
python3.11 -m venv venv
source venv/bin/activate
pip install -r requirements.txt

# Create upload directory
sudo mkdir -p /var/lib/reliefiq/uploads
sudo chown $USER:$USER /var/lib/reliefiq
```

---

## 5. Configure Nginx

```bash
sudo cp /opt/reliefiq/nginx/reliefiq.conf /etc/nginx/sites-available/reliefiq
sudo ln -s /etc/nginx/sites-available/reliefiq /etc/nginx/sites-enabled/
sudo rm /etc/nginx/sites-enabled/default
sudo nginx -t
sudo systemctl reload nginx
```

---

## 6. Configure systemd Service

```bash
sudo cp /opt/reliefiq/systemd/reliefiq.service /etc/systemd/system/
sudo systemctl daemon-reload
sudo systemctl enable reliefiq
sudo systemctl start reliefiq
sudo systemctl status reliefiq
```

---

## 7. Install Cloudflare Tunnel

```bash
# Install cloudflared
curl -L https://github.com/cloudflare/cloudflared/releases/latest/download/cloudflared-linux-arm64.deb -o cloudflared.deb
sudo dpkg -i cloudflared.deb

# Authenticate
cloudflared tunnel login

# Create tunnel
cloudflared tunnel create reliefiq

# Configure tunnel (edit config.yml to point to localhost:80)
# Then install as service:
sudo cloudflared service install
sudo systemctl start cloudflared
```

---

## 8. Deploy Updates

```bash
cd /opt/reliefiq
bash scripts/deploy.sh
```

---

## Monitoring

```bash
# Check backend status
sudo systemctl status reliefiq

# View backend logs
sudo journalctl -u reliefiq -f

# Check nginx logs
sudo tail -f /var/log/nginx/error.log

# Check Cloudflare tunnel
sudo systemctl status cloudflared
```
