# Cyberspace Forum Deployment Guide

## Prerequisites on VPS

```bash
sudo apt update
sudo apt install openjdk-17-jdk nodejs npm nginx p7zip-full -y
sudo npm install -g pm2
pm2 startup
```

## 1. Deploy Next.js Frontend

### Build locally

```bash
cd app
npm run build

# Create correct structure
rm -rf deploy-temp
mkdir -p deploy-temp
cp -r .next/standalone/* deploy-temp/
cp -r .next/static deploy-temp/.next/
cp -r public deploy-temp/
```

### Deploy to VPS

```bash
# Compress and send in one command
tar czf - -C deploy-temp . | ssh cyberadmin@YOUR_VPS_IP "cd /var/www/cyberspace/app && tar xzf -"

# Restart on VPS
ssh cyberadmin@YOUR_VPS_IP "pm2 restart nextjs-app"
```

### First time setup on VPS

```bash
cd /var/www/cyberspace/app
pm2 start "node server.js" --name nextjs-app
pm2 save
```

## 2. Deploy Quarkus Backend

### Build locally

```bash
cd server
./mvnw clean package -DskipTests

cd target
7z a -t7z -mx=9 quarkus-build.7z quarkus-app/
```

### Deploy to VPS

```bash
scp quarkus-build.7z cyberadmin@YOUR_VPS_IP:/tmp/
```

### Extract and run on VPS

```bash
cd /var/www/cyberspace/server
7z x /tmp/quarkus-build.7z
rm /tmp/quarkus-build.7z

# First time setup
pm2 start "java -jar quarkus-app/quarkus-run.jar" --name quarkus-server
pm2 save
```

### Restart server

```bash
pm2 restart quarkus-server
```

## 3. Nginx Configuration

```nginx
server {
    listen 443 ssl http2;
    server_name cyberspace.forum;

    # SSL certificates (configure with certbot)

    # Next.js app
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }

    # WebSocket server
    location /chat {
        proxy_pass http://localhost:8080;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

## 4. Environment Variables

### app/.env.local

```bash
NEXT_PUBLIC_WS_URL=wss://cyberspace.forum/chat
```

## 5. Useful Commands

```bash
# Check PM2 status
pm2 status
pm2 logs

# Restart services
pm2 restart all

# Check ports
sudo netstat -tulpn | grep -E '(3000|8080)'

# Nginx
sudo nginx -t
sudo systemctl restart nginx
```
