# FrateZone - Deployment Guide

## Overview

This guide covers the complete deployment process for FrateZone, from development to production environments. The application is built with Next.js 14 and designed for containerized deployment or traditional server deployment.

## Prerequisites

### System Requirements
- **Node.js**: Version 20.12.* (as specified in `package.json:89`)
- **Memory**: Minimum 2GB RAM, Recommended 4GB+
- **Storage**: Minimum 10GB free space
- **Operating System**: Linux (Ubuntu 20.04+), macOS, or Windows Server

### Required Services
- **Database**: PostgreSQL 12+ (backend dependency)
- **File Storage**: AWS S3 or compatible storage service
- **Email Service**: SMTP server for notifications
- **External APIs**: SeaRates API access, Google Maps API key

### Package Manager
- **pnpm**: Required (not npm or yarn)
  ```bash
  npm install -g pnpm
  ```

## Environment Configuration

### Environment Variables

Create environment files for different deployment stages:

#### Development (`.env.local`)
```env
# API Configuration
NEXT_PUBLIC_API_URL=http://localhost:8000

# Google Maps Integration
NEXT_PUBLIC_GOOGLE_MAP_API_KEY=your_google_maps_api_key

# AWS S3 Configuration
S3_BUCKET_URL=https://your-bucket.s3.region.amazonaws.com

# Development specific
NODE_ENV=development
```

#### Staging (`.env.staging`)
```env
# API Configuration
NEXT_PUBLIC_API_URL=https://api-staging.yourcompany.com

# Google Maps Integration
NEXT_PUBLIC_GOOGLE_MAP_API_KEY=your_google_maps_api_key

# AWS S3 Configuration
S3_BUCKET_URL=https://your-staging-bucket.s3.region.amazonaws.com

# Staging specific
NODE_ENV=production
```

#### Production (`.env.production`)
```env
# API Configuration
NEXT_PUBLIC_API_URL=https://api.yourcompany.com

# Google Maps Integration
NEXT_PUBLIC_GOOGLE_MAP_API_KEY=your_google_maps_api_key

# AWS S3 Configuration
S3_BUCKET_URL=https://your-production-bucket.s3.region.amazonaws.com

# Production specific
NODE_ENV=production
```

### Next.js Configuration
**File**: `next.config.js:1-27`

The configuration includes:
- **React Strict Mode**: Disabled for compatibility
- **TypeScript Build Errors**: Ignored for faster builds
- **ESLint**: Ignored during builds
- **Image Optimization**: Remote patterns for S3
- **Rewrites**: S3 bucket proxy configuration

```javascript
const nextConfig = {
  reactStrictMode: false,
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      {
        hostname: "fratezone.s3.us-east-2.amazonaws.com",
      },
    ],
  },
  async rewrites() {
    return [
      {
        source: "/bucket/:path*",
        destination: `${process.env.S3_BUCKET_URL}/:path*`,
      },
    ];
  },
};
```

## Build Process

### Development Build
```bash
# Install dependencies
pnpm install

# Start development server
pnpm dev

# Verify development setup
curl http://localhost:3000
```

### Production Build
```bash
# Install production dependencies
pnpm install --prod

# Build the application
pnpm build

# Verify build artifacts
ls -la .next/
```

### Build Optimization
The build process includes:
- **Static Generation**: Pre-rendered pages where possible
- **Code Splitting**: Automatic route-based splitting
- **Image Optimization**: Next.js Image component optimization
- **Bundle Analysis**: Regular bundle size monitoring

```bash
# Analyze bundle size (if analyzer is configured)
pnpm build:analyze

# Check build output
pnpm build && ls -la .next/static/
```

## PM2 Deployment

### PM2 Configuration
**File**: `ecosystem.config.js:1-10`

```javascript
module.exports = {
  apps: [
    {
      name: "zim-tracking-client",
      script: "node",
      args: "node_modules/next/dist/bin/next start -p 3021",
      watch: false,
    },
  ],
};
```

### PM2 Deployment Steps

#### 1. Install PM2
```bash
# Install PM2 globally
npm install -g pm2

# Verify installation
pm2 --version
```

#### 2. Deploy Application
```bash
# Navigate to project directory
cd /path/to/assets-tracking

# Install dependencies
pnpm install

# Build application
pnpm build

# Start with PM2
pm2 start ecosystem.config.js

# Verify deployment
pm2 status
pm2 logs zim-tracking-client
```

#### 3. PM2 Management Commands
```bash
# Status and monitoring
pm2 status                    # View all processes
pm2 show zim-tracking-client  # Detailed process info
pm2 logs                      # View logs
pm2 monit                     # Real-time monitoring

# Process management
pm2 restart zim-tracking-client  # Restart application
pm2 reload zim-tracking-client   # Zero-downtime reload
pm2 stop zim-tracking-client     # Stop application
pm2 delete zim-tracking-client   # Delete process

# Startup configuration
pm2 startup                      # Configure system startup
pm2 save                         # Save current process list
```

#### 4. PM2 Advanced Configuration
```javascript
// ecosystem.config.js - Advanced configuration
module.exports = {
  apps: [
    {
      name: "fratezone-frontend",
      script: "node",
      args: "node_modules/next/dist/bin/next start",
      cwd: "/path/to/assets-tracking",
      instances: "max",  // Use all CPU cores
      exec_mode: "cluster",
      watch: false,
      max_memory_restart: "1G",
      env: {
        NODE_ENV: "production",
        PORT: 3021,
      },
      env_staging: {
        NODE_ENV: "production",
        PORT: 3022,
      },
      error_file: "./logs/err.log",
      out_file: "./logs/out.log",
      log_file: "./logs/combined.log",
      time: true,
    },
  ],
};
```

## Docker Deployment

### Dockerfile
Create a `Dockerfile` in the project root:

```dockerfile
# Use official Node.js runtime as base image
FROM node:20.12-alpine

# Set working directory
WORKDIR /app

# Install pnpm
RUN npm install -g pnpm

# Copy package files
COPY package.json pnpm-lock.yaml ./

# Install dependencies
RUN pnpm install --frozen-lockfile

# Copy application code
COPY . .

# Build application
RUN pnpm build

# Expose port
EXPOSE 3000

# Start application
CMD ["pnpm", "start"]
```

### Docker Compose
Create a `docker-compose.yml` file:

```yaml
version: '3.8'

services:
  fratezone-frontend:
    build: .
    ports:
      - "3021:3000"
    environment:
      - NODE_ENV=production
      - NEXT_PUBLIC_API_URL=${NEXT_PUBLIC_API_URL}
      - NEXT_PUBLIC_GOOGLE_MAP_API_KEY=${NEXT_PUBLIC_GOOGLE_MAP_API_KEY}
      - S3_BUCKET_URL=${S3_BUCKET_URL}
    volumes:
      - ./logs:/app/logs
    restart: unless-stopped
    depends_on:
      - fratezone-backend
    networks:
      - fratezone-network

  fratezone-backend:
    # Backend service configuration
    image: your-backend-image:latest
    ports:
      - "8000:8000"
    networks:
      - fratezone-network

networks:
  fratezone-network:
    driver: bridge
```

### Docker Deployment Commands
```bash
# Build and start services
docker-compose up -d

# View logs
docker-compose logs -f fratezone-frontend

# Scale services
docker-compose up -d --scale fratezone-frontend=3

# Stop services
docker-compose down

# Update and restart
docker-compose pull
docker-compose up -d
```

## Cloud Deployment

### AWS EC2 Deployment

#### 1. EC2 Instance Setup
```bash
# Connect to EC2 instance
ssh -i your-key.pem ubuntu@your-ec2-ip

# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install pnpm
npm install -g pnpm

# Install PM2
npm install -g pm2

# Install nginx (optional, for reverse proxy)
sudo apt install nginx
```

#### 2. Application Deployment
```bash
# Clone repository
git clone https://your-repo-url.git /var/www/fratezone
cd /var/www/fratezone

# Set up environment
cp .env.production .env.local

# Install and build
pnpm install
pnpm build

# Start with PM2
pm2 start ecosystem.config.js
pm2 startup
pm2 save
```

#### 3. Nginx Configuration (Optional)
```nginx
# /etc/nginx/sites-available/fratezone
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://localhost:3021;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

### Vercel Deployment

#### 1. Vercel Configuration
Create `vercel.json`:

```json
{
  "buildCommand": "pnpm build",
  "devCommand": "pnpm dev",
  "installCommand": "pnpm install",
  "framework": "nextjs",
  "regions": ["iad1", "sfo1"],
  "functions": {
    "app/**/*.tsx": {
      "maxDuration": 30
    }
  },
  "rewrites": [
    {
      "source": "/bucket/:path*",
      "destination": "/api/proxy/s3/:path*"
    }
  ]
}
```

#### 2. Deploy to Vercel
```bash
# Install Vercel CLI
npm install -g vercel

# Login to Vercel
vercel login

# Deploy
vercel --prod

# Set environment variables
vercel env add NEXT_PUBLIC_API_URL production
vercel env add NEXT_PUBLIC_GOOGLE_MAP_API_KEY production
vercel env add S3_BUCKET_URL production
```

### DigitalOcean App Platform

#### 1. App Specification
Create `.do/app.yaml`:

```yaml
name: fratezone
services:
- name: frontend
  source_dir: /
  github:
    repo: your-username/assets-tracking
    branch: main
  run_command: pnpm start
  build_command: pnpm install && pnpm build
  environment_slug: node-js
  instance_count: 2
  instance_size_slug: basic-xxs
  envs:
  - key: NODE_ENV
    value: production
  - key: NEXT_PUBLIC_API_URL
    value: ${APP_URL}
  routes:
  - path: /
```

## SSL/TLS Configuration

### Let's Encrypt with Certbot
```bash
# Install certbot
sudo apt install certbot python3-certbot-nginx

# Obtain SSL certificate
sudo certbot --nginx -d your-domain.com

# Auto-renewal
sudo crontab -e
# Add: 0 12 * * * /usr/bin/certbot renew --quiet
```

### Manual SSL Configuration
```nginx
server {
    listen 443 ssl http2;
    server_name your-domain.com;

    ssl_certificate /path/to/your/certificate.crt;
    ssl_certificate_key /path/to/your/private.key;
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers ECDHE-RSA-AES128-GCM-SHA256:ECDHE-RSA-AES256-GCM-SHA384;

    location / {
        proxy_pass http://localhost:3021;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}

server {
    listen 80;
    server_name your-domain.com;
    return 301 https://$server_name$request_uri;
}
```

## Performance Optimization

### Build Optimization
```bash
# Production build with optimizations
NODE_ENV=production pnpm build

# Bundle analysis
npm install -g @next/bundle-analyzer
ANALYZE=true pnpm build
```

### Caching Configuration
```nginx
# Static assets caching
location /_next/static/ {
    expires 1y;
    add_header Cache-Control "public, immutable";
}

location /images/ {
    expires 30d;
    add_header Cache-Control "public";
}
```

### Compression
```nginx
# Gzip configuration
gzip on;
gzip_comp_level 6;
gzip_types
    text/plain
    text/css
    text/xml
    text/javascript
    application/json
    application/javascript
    application/xml+rss
    application/atom+xml
    image/svg+xml;
```

## Monitoring and Logging

### Application Monitoring
```bash
# PM2 monitoring
pm2 install pm2-server-monit

# Custom health check endpoint
curl http://localhost:3021/api/health
```

### Log Management
```bash
# PM2 log rotation
pm2 install pm2-logrotate

# View logs
pm2 logs --lines 100
pm2 flush  # Clear logs
```

### Health Checks
Create a health check endpoint:

```typescript
// pages/api/health.ts
export default function handler(req, res) {
  res.status(200).json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    version: process.env.npm_package_version,
  });
}
```

## Backup and Recovery

### Application Backup
```bash
#!/bin/bash
# backup-app.sh

BACKUP_DIR="/backups/fratezone"
APP_DIR="/var/www/fratezone"
DATE=$(date +%Y%m%d_%H%M%S)

# Create backup directory
mkdir -p $BACKUP_DIR

# Backup application files
tar -czf $BACKUP_DIR/app_$DATE.tar.gz -C $APP_DIR .

# Keep only last 7 days of backups
find $BACKUP_DIR -name "app_*.tar.gz" -mtime +7 -delete
```

### Deployment Rollback
```bash
# PM2 rollback (if using ecosystem with deployment)
pm2 deploy ecosystem.config.js production revert 1

# Manual rollback
git checkout previous-working-commit
pnpm build
pm2 restart fratezone-frontend
```

## Security Considerations

### Server Security
```bash
# Update system packages
sudo apt update && sudo apt upgrade -y

# Configure firewall
sudo ufw allow 22    # SSH
sudo ufw allow 80    # HTTP
sudo ufw allow 443   # HTTPS
sudo ufw enable

# Disable root login
sudo nano /etc/ssh/sshd_config
# Set: PermitRootLogin no
sudo systemctl restart ssh
```

### Application Security
- **Environment Variables**: Never commit sensitive data
- **HTTPS**: Always use HTTPS in production
- **Headers**: Configure security headers in nginx
- **Dependencies**: Regularly update dependencies
- **Secrets**: Use secure secret management

```nginx
# Security headers
add_header X-Frame-Options "SAMEORIGIN" always;
add_header X-Content-Type-Options "nosniff" always;
add_header X-XSS-Protection "1; mode=block" always;
add_header Referrer-Policy "no-referrer-when-downgrade" always;
add_header Content-Security-Policy "default-src 'self' http: https: data: blob: 'unsafe-inline'" always;
```

## Troubleshooting

### Common Issues

#### Build Failures
```bash
# Clear cache and rebuild
rm -rf .next node_modules
pnpm install
pnpm build
```

#### Memory Issues
```bash
# Increase Node.js memory limit
NODE_OPTIONS="--max-old-space-size=4096" pnpm build
```

#### PM2 Issues
```bash
# Reset PM2
pm2 kill
pm2 start ecosystem.config.js

# Check PM2 logs
pm2 logs --lines 50
```

#### Port Conflicts
```bash
# Check port usage
lsof -i :3021
netstat -tulpn | grep :3021

# Kill process using port
kill -9 $(lsof -t -i:3021)
```

### Performance Issues
```bash
# Check server resources
htop
df -h
free -m

# Monitor application
pm2 monit
```

### Log Analysis
```bash
# Application logs
tail -f /var/log/nginx/access.log
tail -f ~/.pm2/logs/fratezone-frontend-out.log

# System logs
journalctl -u nginx -f
```

## Deployment Checklist

### Pre-deployment
- [ ] Environment variables configured
- [ ] Database connections tested
- [ ] S3 bucket accessible
- [ ] Google Maps API key valid
- [ ] SSL certificates ready
- [ ] Backup procedures in place

### Deployment Steps
- [ ] Code deployed to server
- [ ] Dependencies installed
- [ ] Application built successfully
- [ ] Environment variables set
- [ ] PM2/Docker process started
- [ ] Nginx configured (if applicable)
- [ ] SSL certificates installed
- [ ] Health checks passing

### Post-deployment
- [ ] Application accessible
- [ ] All features working
- [ ] Performance metrics normal
- [ ] Logs configured
- [ ] Monitoring set up
- [ ] Backup tested
- [ ] Team notified

## Maintenance Tasks

### Regular Tasks
```bash
# Weekly
sudo apt update && sudo apt upgrade -y
pm2 flush  # Clear logs
npm audit  # Check security vulnerabilities

# Monthly
pnpm update  # Update dependencies
certbot renew --dry-run  # Test SSL renewal

# Quarterly
# Review and update security configurations
# Analyze performance metrics
# Update documentation
```

### Automated Maintenance
```bash
# Crontab examples
0 2 * * 0 /path/to/backup-script.sh     # Weekly backup
0 3 * * * /usr/bin/certbot renew         # Daily SSL check
0 4 * * * pm2 flush                      # Daily log cleanup
```

This comprehensive deployment guide provides all necessary information for successfully deploying and maintaining the FrateZone application in various environments.