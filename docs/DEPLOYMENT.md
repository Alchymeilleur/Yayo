# Yayo Deployment Guide

## Production Deployment Options

### Option 1: Docker Deployment (Recommended)

#### Deploy on DigitalOcean with Docker

```bash
# 1. Create a DigitalOcean Droplet (Ubuntu 22.04, 2GB RAM)
# 2. SSH into your droplet
ssh root@your_droplet_ip

# 3. Install Docker and Docker Compose
curl -fsSL https://get.docker.com -o get-docker.sh
sh get-docker.sh

# 4. Install Docker Compose
curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
chmod +x /usr/local/bin/docker-compose

# 5. Clone your repository
git clone https://github.com/Alchymeilleur/Yayo.git
cd Yayo

# 6. Create production .env file
cat > .env.prod << EOF
PORT=5000
NODE_ENV=production
DB_HOST=postgres
DB_PORT=5432
DB_NAME=yayo_db
DB_USER=postgres
DB_PASSWORD=$(openssl rand -base64 32)
JWT_SECRET=$(openssl rand -base64 32)
FRONTEND_URL=https://yourdomain.com
EOF

# 7. Start services in production mode
docker-compose -f docker-compose.yml up -d

# 8. Verify services are running
docker-compose ps
```

#### Setup Nginx Reverse Proxy

```bash
# Install Nginx
sudo apt update
sudo apt install nginx -y

# Create Nginx config
sudo tee /etc/nginx/sites-available/yayo > /dev/null <<EOF
upstream backend {
    server localhost:5000;
}

upstream frontend {
    server localhost:3000;
}

server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;

    # Redirect HTTP to HTTPS
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name yourdomain.com www.yourdomain.com;

    ssl_certificate /etc/letsencrypt/live/yourdomain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/yourdomain.com/privkey.pem;

    # API routes
    location /api {
        proxy_pass http://backend;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # Frontend
    location / {
        proxy_pass http://frontend;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
EOF

# Enable site
sudo ln -s /etc/nginx/sites-available/yayo /etc/nginx/sites-enabled/

# Remove default site
sudo rm /etc/nginx/sites-enabled/default

# Test Nginx config
sudo nginx -t

# Restart Nginx
sudo systemctl restart nginx

# Setup SSL with Let's Encrypt
sudo apt install certbot python3-certbot-nginx -y
sudo certbot certonly --standalone -d yourdomain.com -d www.yourdomain.com

# Restart Nginx with SSL
sudo systemctl restart nginx
```

---

### Option 2: Vercel + Railway Deployment

#### Deploy Frontend on Vercel

```bash
# 1. Install Vercel CLI
npm i -g vercel

# 2. Deploy frontend
cd frontend
vercel --prod

# 3. Set environment variables
# NEXT_PUBLIC_API_URL=https://your-backend-domain.com/api
```

#### Deploy Backend on Railway

```bash
# 1. Install Railway CLI
npm i -g @railway/cli

# 2. Login to Railway
railway login

# 3. Create new project
railway init

# 4. Add PostgreSQL addon
railway add

# 5. Set environment variables in Railway dashboard
# PORT=5000
# NODE_ENV=production
# DB_* (auto-populated from PostgreSQL addon)
# JWT_SECRET=your_secret_key

# 6. Deploy
railway up
```

---

### Option 3: Heroku Deployment (Legacy)

```bash
# 1. Create Heroku account and install CLI
curl https://cli-assets.heroku.com/install.sh | sh

# 2. Login
heroku login

# 3. Create apps
heroku create yayo-backend
heroku create yayo-frontend

# 4. Add PostgreSQL addon
heroku addons:create heroku-postgresql:hobby-dev -a yayo-backend

# 5. Set environment variables
heroku config:set JWT_SECRET=your_secret_key -a yayo-backend
heroku config:set NODE_ENV=production -a yayo-backend

# 6. Deploy
git push heroku main:main
```

---

## Environment Variables for Production

### Backend

```env
NODE_ENV=production
PORT=5000
DB_HOST=your_postgres_host
DB_PORT=5432
DB_NAME=yayo_prod_db
DB_USER=postgres
DB_PASSWORD=secure_password_here
DB_SSL=true
JWT_SECRET=generate_strong_secret_key_here
JWT_EXPIRE=7d
FRONTEND_URL=https://yourdomain.com
```

### Frontend

```env
NEXT_PUBLIC_API_URL=https://yourdomain.com/api
NEXT_PUBLIC_APP_NAME=Yayo
NEXT_PUBLIC_APP_URL=https://yourdomain.com
```

---

## Database Backup & Restore

### Backup PostgreSQL

```bash
# With Docker
docker-compose exec postgres pg_dump -U postgres yayo_db > backup.sql

# Without Docker
pg_dump -U postgres -h localhost yayo_db > backup.sql
```

### Restore PostgreSQL

```bash
# With Docker
cat backup.sql | docker-compose exec -T postgres psql -U postgres

# Without Docker
psql -U postgres -h localhost yayo_db < backup.sql
```

### Automated Daily Backups

```bash
# Create backup script
cat > /home/backup.sh << 'EOF'
#!/bin/bash
BACKUP_DIR="/home/backups"
mkdir -p $BACKUP_DIR
docker-compose exec -T postgres pg_dump -U postgres yayo_db > $BACKUP_DIR/backup-$(date +%Y-%m-%d-%H-%M-%S).sql
# Keep only last 7 days
find $BACKUP_DIR -name "*.sql" -mtime +7 -delete
EOF

chmod +x /home/backup.sh

# Schedule with cron (daily at 2 AM)
echo "0 2 * * * /home/backup.sh" | crontab -
```

---

## Monitoring & Logging

### View Docker Logs

```bash
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f backend
docker-compose logs -f frontend
docker-compose logs -f postgres
```

### Health Checks

```bash
# API Health
curl https://yourdomain.com/api/health

# Expected response
{"status":"OK","timestamp":"2026-06-11T16:00:00Z"}
```

### Monitor CPU & Memory

```bash
# View container stats
docker stats

# View system resources
free -h
df -h
```

---

## CI/CD with GitHub Actions

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Deploy to server
        uses: appleboy/ssh-action@master
        with:
          host: ${{ secrets.HOST }}
          username: ${{ secrets.USERNAME }}
          key: ${{ secrets.SSH_KEY }}
          script: |
            cd /home/yayo
            git pull origin main
            docker-compose pull
            docker-compose up -d
            docker-compose exec -T backend npm run migrate
```

---

## Security Checklist

- [ ] Change all default passwords
- [ ] Enable HTTPS/SSL
- [ ] Set strong JWT_SECRET
- [ ] Enable database backups
- [ ] Configure firewall rules
- [ ] Enable CORS properly
- [ ] Use environment variables for secrets
- [ ] Keep dependencies updated
- [ ] Enable rate limiting
- [ ] Setup monitoring/alerts

---

## Troubleshooting Production Issues

### High Memory Usage

```bash
# Check memory
free -h

# Restart services
docker-compose restart

# Increase swap (if needed)
sudo fallocate -l 4G /swapfile
sudo chmod 600 /swapfile
sudo mkswap /swapfile
sudo swapon /swapfile
```

### Database Connection Issues

```bash
# Check database logs
docker-compose logs postgres

# Restart database
docker-compose restart postgres

# Verify connection
docker-compose exec postgres psql -U postgres -c "SELECT 1"
```

### SSL Certificate Renewal

```bash
# Auto-renewal (runs automatically with Certbot)
sudo certbot renew --dry-run

# Manual renewal
sudo certbot renew --force-renewal
```

---

## Performance Optimization

### Database
- Add indexes to frequently queried columns
- Archive old listings and messages
- Use connection pooling

### Backend
- Enable gzip compression
- Implement caching (Redis)
- Use CDN for static files

### Frontend
- Optimize images
- Code splitting
- Lazy loading
- Service workers for offline support

---

## Support & Resources

- Documentation: [docs/](./docs/)
- GitHub Issues: https://github.com/Alchymeilleur/Yayo/issues
- Docker Compose: https://docs.docker.com/compose/
- Railway Docs: https://railway.app/docs
- Vercel Docs: https://vercel.com/docs
