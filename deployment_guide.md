# Deployment Guide

## Table of Contents

- [Overview](#overview)
- [Prerequisites](#prerequisites)
- [Deployment Options](#deployment-options)
- [Environment Configuration](#environment-configuration)
- [Production Deployment](#production-deployment)
- [Monitoring and Maintenance](#monitoring-and-maintenance)
- [Backup and Recovery](#backup-and-recovery)
- [Troubleshooting](#troubleshooting)

## Overview

This guide provides comprehensive instructions for deploying the Sebenza Logistics Suite to production environments. The application is built with Next.js and can be deployed on various platforms including Vercel, Netlify, AWS, Azure, and traditional web servers.

### Deployment Architecture

```text
┌─────────────────────────────────────────────────────────┐
│                    Load Balancer                        │
└─────────────────────┬───────────────────────────────────┘
                      │
         ┌────────────┴────────────┐
         │                         │
    ┌────▼────┐               ┌────▼────┐
    │ App     │               │ App     │
    │ Server  │               │ Server  │
    │ (Node)  │               │ (Node)  │
    └────┬────┘               └────┬────┘
         │                         │
         └────────────┬────────────┘
                      │
    ┌─────────────────▼─────────────────┐
    │            Database               │
    │        (PostgreSQL/MySQL)         │
    └───────────────────────────────────┘
```

## Prerequisites

### System Requirements

**Minimum Requirements:**
- **CPU**: 2 cores
- **RAM**: 4 GB
- **Storage**: 20 GB SSD
- **Network**: 100 Mbps

**Recommended for Production:**
- **CPU**: 4+ cores
- **RAM**: 8+ GB
- **Storage**: 50+ GB SSD
- **Network**: 1 Gbps

### Software Dependencies

- **Node.js**: Version 18.x or higher
- **npm**: Version 9.x or higher
- **Git**: For code deployment
- **PM2**: For process management (optional but recommended)
- **Nginx**: For reverse proxy (recommended)
- **SSL Certificate**: For HTTPS (required for production)

### Development Tools

- **Docker**: For containerized deployment (optional)
- **Docker Compose**: For multi-container setups
- **Terraform**: For infrastructure as code (optional)

## Deployment Options

### 1. Vercel Deployment (Recommended for Startups)

Vercel provides the easiest deployment option for Next.js applications.

#### Setup Steps

1. **Connect Repository**

   ```bash
   # Push your code to GitHub/GitLab/Bitbucket
   git push origin main
   ```

2. **Deploy to Vercel**

   ```bash
   # Install Vercel CLI
   npm install -g vercel
   
   # Login to Vercel
   vercel login
   
   # Deploy
   vercel --prod
   ```

3. **Configure Environment Variables**
   - Go to Vercel Dashboard → Project → Settings → Environment Variables
   - Add all production environment variables

#### Environment Variables for Vercel

```bash
# Application
NEXT_PUBLIC_APP_NAME="Sebenza Logistics Suite"
NEXT_PUBLIC_APP_VERSION="1.0.0"
NEXT_PUBLIC_APP_URL="https://your-domain.vercel.app"

# Database (when implemented)
DATABASE_URL="postgresql://user:password@host:port/database"

# Authentication (when implemented)
NEXTAUTH_SECRET="your-production-secret-key"
NEXTAUTH_URL="https://your-domain.vercel.app"

# External APIs
SHIPPING_API_KEY="your-production-shipping-api-key"
PAYMENT_GATEWAY_KEY="your-production-payment-key"

# Email Service
SMTP_HOST="smtp.gmail.com"
SMTP_PORT="587"
SMTP_USER="your-email@company.com"
SMTP_PASS="your-app-password"
```

### 2. AWS Deployment

#### Using AWS Amplify

1. **Install AWS CLI**

   ```bash
   # Install AWS CLI
   curl "https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip" -o "awscliv2.zip"
   unzip awscliv2.zip
   sudo ./aws/install
   
   # Configure AWS credentials
   aws configure
   ```

2. **Deploy with Amplify**

   ```bash
   # Install Amplify CLI
   npm install -g @aws-amplify/cli
   
   # Initialize Amplify project
   amplify init
   
   # Add hosting
   amplify add hosting
   
   # Deploy
   amplify publish
   ```

#### Using EC2 with Docker

1. **Create EC2 Instance**
   - Launch Ubuntu 20.04 LTS instance
   - Configure security groups (ports 22, 80, 443)
   - Attach Elastic IP

2. **Install Docker**

   ```bash
   # Update system
   sudo apt update && sudo apt upgrade -y
   
   # Install Docker
   curl -fsSL https://get.docker.com -o get-docker.sh
   sh get-docker.sh
   
   # Install Docker Compose
   sudo curl -L "https://github.com/docker/compose/releases/download/v2.20.0/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
   sudo chmod +x /usr/local/bin/docker-compose
   ```

3. **Create Docker Configuration**

   ```dockerfile
   # Dockerfile
   FROM node:18-alpine AS base
   
   # Install dependencies only when needed
   FROM base AS deps
   RUN apk add --no-cache libc6-compat
   WORKDIR /app
   
   COPY package.json package-lock.json ./
   RUN npm ci --only=production
   
   # Rebuild the source code only when needed
   FROM base AS builder
   WORKDIR /app
   COPY --from=deps /app/node_modules ./node_modules
   COPY . .
   
   ENV NEXT_TELEMETRY_DISABLED 1
   RUN npm run build
   
   # Production image
   FROM base AS runner
   WORKDIR /app
   
   ENV NODE_ENV production
   ENV NEXT_TELEMETRY_DISABLED 1
   
   RUN addgroup --system --gid 1001 nodejs
   RUN adduser --system --uid 1001 nextjs
   
   COPY --from=builder /app/public ./public
   COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
   COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
   
   USER nextjs
   
   EXPOSE 3000
   ENV PORT 3000
   ENV HOSTNAME "0.0.0.0"
   
   CMD ["node", "server.js"]
   ```

4. **Docker Compose Configuration**

   ```yaml
   # docker-compose.yml
   version: '3.8'
   
   services:
     app:
       build: .
       ports:
         - "3000:3000"
       environment:
         - NODE_ENV=production
         - DATABASE_URL=${DATABASE_URL}
         - NEXTAUTH_SECRET=${NEXTAUTH_SECRET}
       restart: unless-stopped
       depends_on:
         - postgres
   
     postgres:
       image: postgres:15
       environment:
         POSTGRES_DB: sebenza_logistics
         POSTGRES_USER: ${DB_USER}
         POSTGRES_PASSWORD: ${DB_PASSWORD}
       volumes:
         - postgres_data:/var/lib/postgresql/data
       restart: unless-stopped
   
     nginx:
       image: nginx:alpine
       ports:
         - "80:80"
         - "443:443"
       volumes:
         - ./nginx.conf:/etc/nginx/nginx.conf
         - ./ssl:/etc/ssl/certs
       depends_on:
         - app
       restart: unless-stopped
   
   volumes:
     postgres_data:
   ```

### 3. Traditional Server Deployment

#### Using PM2 Process Manager

1. **Server Setup**

   ```bash
   # Update system
   sudo apt update && sudo apt upgrade -y
   
   # Install Node.js
   curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
   sudo apt-get install -y nodejs
   
   # Install PM2
   sudo npm install -g pm2
   
   # Install Nginx
   sudo apt install nginx -y
   ```

2. **Application Deployment**

   ```bash
   # Clone repository
   git clone https://github.com/your-org/sebenza-logistics.git
   cd sebenza-logistics
   
   # Install dependencies
   npm ci --only=production
   
   # Build application
   npm run build
   
   # Create PM2 configuration
   cat > ecosystem.config.js << EOF
   module.exports = {
     apps: [{
       name: 'sebenza-logistics',
       script: 'npm',
       args: 'start',
       instances: 'max',
       exec_mode: 'cluster',
       env: {
         NODE_ENV: 'production',
         PORT: 3000
       },
       env_production: {
         NODE_ENV: 'production',
         PORT: 3000
       }
     }]
   }
   EOF
   
   # Start application
   pm2 start ecosystem.config.js --env production
   pm2 save
   pm2 startup
   ```

3. **Nginx Configuration**

   ```nginx
   # /etc/nginx/sites-available/sebenza-logistics
   server {
       listen 80;
       server_name your-domain.com www.your-domain.com;
       return 301 https://$server_name$request_uri;
   }
   
   server {
       listen 443 ssl http2;
       server_name your-domain.com www.your-domain.com;
   
       ssl_certificate /etc/ssl/certs/your-domain.com.crt;
       ssl_certificate_key /etc/ssl/private/your-domain.com.key;
       ssl_protocols TLSv1.2 TLSv1.3;
       ssl_ciphers HIGH:!aNULL:!MD5;
   
       location / {
           proxy_pass http://localhost:3000;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_set_header X-Real-IP $remote_addr;
           proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
           proxy_set_header X-Forwarded-Proto $scheme;
           proxy_cache_bypass $http_upgrade;
       }
   
       # Static file caching
       location /_next/static/ {
           proxy_pass http://localhost:3000;
           expires 1y;
           add_header Cache-Control "public, immutable";
       }
   
       # Security headers
       add_header X-Frame-Options "SAMEORIGIN" always;
       add_header X-Content-Type-Options "nosniff" always;
       add_header X-XSS-Protection "1; mode=block" always;
       add_header Referrer-Policy "strict-origin-when-cross-origin" always;
   }
   ```

## Environment Configuration

### Production Environment Variables

Create a `.env.production` file:

```bash
# Application Configuration
NODE_ENV=production
NEXT_PUBLIC_APP_NAME="Sebenza Logistics Suite"
NEXT_PUBLIC_APP_VERSION="1.0.0"
NEXT_PUBLIC_APP_URL="https://your-production-domain.com"

# Database Configuration
DATABASE_URL="postgresql://username:password@localhost:5432/sebenza_logistics"
DATABASE_POOL_SIZE=10
DATABASE_SSL=true

# Authentication
NEXTAUTH_SECRET="your-very-secure-secret-key-minimum-32-characters"
NEXTAUTH_URL="https://your-production-domain.com"
JWT_SECRET="another-secure-secret-for-jwt-tokens"

# Email Configuration
SMTP_HOST="smtp.your-email-provider.com"
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER="noreply@your-domain.com"
SMTP_PASS="your-email-password"

# External API Configuration
SHIPPING_API_KEY="your-production-shipping-api-key"
SHIPPING_API_URL="https://api.shipping-provider.com"
PAYMENT_GATEWAY_KEY="your-production-payment-gateway-key"
PAYMENT_GATEWAY_SECRET="your-payment-gateway-secret"

# File Storage
UPLOAD_DIR="/var/uploads/sebenza-logistics"
MAX_FILE_SIZE=10485760  # 10MB in bytes

# Redis (for session storage)
REDIS_URL="redis://localhost:6379"

# Monitoring
SENTRY_DSN="your-sentry-dsn-for-error-tracking"
ANALYTICS_ID="your-google-analytics-id"

# Feature Flags
ENABLE_REGISTRATION=false
ENABLE_EMAIL_VERIFICATION=true
ENABLE_TWO_FACTOR_AUTH=true

# Rate Limiting
RATE_LIMIT_REQUESTS_PER_MINUTE=100
RATE_LIMIT_WINDOW_MS=60000

# Security
CORS_ORIGIN="https://your-domain.com"
CSRF_SECRET="your-csrf-secret-key"
```

### Environment Validation

Create `env.validation.js`:

```javascript
const requiredEnvVars = [
  'NODE_ENV',
  'NEXTAUTH_SECRET',
  'NEXTAUTH_URL',
  'DATABASE_URL'
]

const optionalEnvVars = [
  'SMTP_HOST',
  'SMTP_USER',
  'SMTP_PASS',
  'REDIS_URL',
  'SENTRY_DSN'
]

function validateEnvironment() {
  const missing = requiredEnvVars.filter(varName => !process.env[varName])
  
  if (missing.length > 0) {
    console.error('Missing required environment variables:')
    missing.forEach(varName => console.error(`  - ${varName}`))
    process.exit(1)
  }
  
  console.log('✅ Environment validation passed')
  
  // Log optional variables status
  const missingOptional = optionalEnvVars.filter(varName => !process.env[varName])
  if (missingOptional.length > 0) {
    console.warn('Missing optional environment variables:')
    missingOptional.forEach(varName => console.warn(`  - ${varName}`))
  }
}

module.exports = { validateEnvironment }
```

## Production Deployment

### Pre-deployment Checklist

- [ ] All environment variables configured
- [ ] Database migrations completed
- [ ] SSL certificates installed
- [ ] Backup strategy implemented
- [ ] Monitoring tools configured
- [ ] Load testing completed
- [ ] Security audit performed
- [ ] Performance optimization applied

### Deployment Process

1. **Code Preparation**

   ```bash
   # Ensure clean state
   git status
   git checkout main
   git pull origin main
   
   # Run tests
   npm run test
   npm run typecheck
   npm run lint
   
   # Build for production
   npm run build
   ```

2. **Database Setup**

   ```bash
   # Create production database
   createdb sebenza_logistics
   
   # Run migrations (when implemented)
   npm run db:migrate:prod
   
   # Seed initial data (if needed)
   npm run db:seed:prod
   ```

3. **Deployment Steps**

   ```bash
   # Stop current application
   pm2 stop sebenza-logistics
   
   # Backup current version
   cp -r /var/www/sebenza-logistics /var/www/sebenza-logistics-backup-$(date +%Y%m%d%H%M%S)
   
   # Deploy new version
   git pull origin main
   npm ci --only=production
   npm run build
   
   # Start application
   pm2 start ecosystem.config.js --env production
   pm2 reload sebenza-logistics
   ```

4. **Health Check**

   ```bash
   # Check application status
   pm2 status
   
   # Check logs
   pm2 logs sebenza-logistics --lines 50
   
   # Test endpoints
   curl -f http://localhost:3000/api/health
   curl -f https://your-domain.com/api/health
   ```

### Blue-Green Deployment

For zero-downtime deployments:

```bash
#!/bin/bash
# blue-green-deploy.sh

BLUE_PORT=3000
GREEN_PORT=3001
CURRENT_ENV=$(cat /var/www/current-env)

if [ "$CURRENT_ENV" = "blue" ]; then
    DEPLOY_PORT=$GREEN_PORT
    DEPLOY_ENV="green"
    LIVE_PORT=$BLUE_PORT
else
    DEPLOY_PORT=$BLUE_PORT
    DEPLOY_ENV="blue"
    LIVE_PORT=$GREEN_PORT
fi

echo "Deploying to $DEPLOY_ENV environment on port $DEPLOY_PORT"

# Deploy to inactive environment
PORT=$DEPLOY_PORT pm2 start ecosystem.config.js --name "sebenza-$DEPLOY_ENV"

# Health check
sleep 10
if curl -f http://localhost:$DEPLOY_PORT/api/health; then
    echo "Health check passed, switching traffic"
    
    # Update nginx upstream
    sed -i "s/localhost:$LIVE_PORT/localhost:$DEPLOY_PORT/g" /etc/nginx/sites-available/sebenza-logistics
    nginx -s reload
    
    # Stop old environment
    pm2 stop sebenza-$CURRENT_ENV
    pm2 delete sebenza-$CURRENT_ENV
    
    # Update current environment marker
    echo $DEPLOY_ENV > /var/www/current-env
    
    echo "Deployment successful!"
else
    echo "Health check failed, rolling back"
    pm2 stop sebenza-$DEPLOY_ENV
    pm2 delete sebenza-$DEPLOY_ENV
    exit 1
fi
```

## Monitoring and Maintenance

### Application Monitoring

1. **PM2 Monitoring**

   ```bash
   # Install PM2 monitoring
   pm2 install pm2-server-monit
   
   # Monitor CPU and memory
   pm2 monit
   
   # Check logs
   pm2 logs --timestamp
   ```

2. **System Monitoring**

   ```bash
   # Install monitoring tools
   sudo apt install htop iotop nethogs -y
   
   # Monitor system resources
   htop              # CPU and memory usage
   iotop             # Disk I/O
   nethogs           # Network usage
   df -h             # Disk space
   ```

3. **Log Management**

   ```bash
   # Rotate logs
   sudo nano /etc/logrotate.d/sebenza-logistics
   ```

   ```text
   /var/log/sebenza-logistics/*.log {
       daily
       rotate 30
       compress
       delaycompress
       missingok
       notifempty
       create 644 www-data www-data
       postrotate
           pm2 reload sebenza-logistics
       endscript
   }
   ```

### Performance Monitoring

1. **Application Performance Monitoring (APM)**

   ```javascript
   // Add to your app
   import * as Sentry from '@sentry/nextjs'
   
   Sentry.init({
     dsn: process.env.SENTRY_DSN,
     environment: process.env.NODE_ENV,
     tracesSampleRate: 0.1,
   })
   ```

2. **Uptime Monitoring**

   Create health check endpoint:

   ```javascript
   // pages/api/health.js
   export default function handler(req, res) {
     const healthCheck = {
       uptime: process.uptime(),
       message: 'OK',
       timestamp: new Date().toISOString(),
       environment: process.env.NODE_ENV,
       version: process.env.NEXT_PUBLIC_APP_VERSION
     }
     
     res.status(200).json(healthCheck)
   }
   ```

### Automated Maintenance

1. **Daily Backup Script**

   ```bash
   #!/bin/bash
   # daily-backup.sh
   
   DATE=$(date +%Y%m%d_%H%M%S)
   BACKUP_DIR="/backups/sebenza-logistics"
   
   # Create backup directory
   mkdir -p $BACKUP_DIR
   
   # Database backup
   pg_dump sebenza_logistics | gzip > $BACKUP_DIR/database_$DATE.sql.gz
   
   # Application files backup
   tar -czf $BACKUP_DIR/files_$DATE.tar.gz /var/www/sebenza-logistics
   
   # Upload to S3 (optional)
   aws s3 cp $BACKUP_DIR/database_$DATE.sql.gz s3://your-backup-bucket/
   aws s3 cp $BACKUP_DIR/files_$DATE.tar.gz s3://your-backup-bucket/
   
   # Clean old backups (keep last 7 days)
   find $BACKUP_DIR -name "*.gz" -mtime +7 -delete
   
   echo "Backup completed: $DATE"
   ```

2. **Add to Crontab**

   ```bash
   # Edit crontab
   crontab -e
   
   # Add daily backup at 2 AM
   0 2 * * * /var/scripts/daily-backup.sh >> /var/log/backup.log 2>&1
   
   # Weekly system updates (Sundays at 3 AM)
   0 3 * * 0 apt update && apt upgrade -y >> /var/log/updates.log 2>&1
   
   # Monthly log cleanup
   0 4 1 * * find /var/log -name "*.log" -mtime +30 -delete
   ```

## Backup and Recovery

### Backup Strategy

1. **Database Backups**
   - **Frequency**: Daily automated, weekly manual verification
   - **Retention**: 30 days local, 1 year offsite
   - **Method**: `pg_dump` for PostgreSQL

2. **File Backups**
   - **Frequency**: Daily for uploads, weekly for application files
   - **Retention**: 7 days local, 30 days offsite
   - **Method**: Incremental backups with `rsync`

3. **Configuration Backups**
   - **Frequency**: After any configuration change
   - **Retention**: Version controlled in Git
   - **Method**: Infrastructure as Code

### Recovery Procedures

1. **Database Recovery**

   ```bash
   # Stop application
   pm2 stop sebenza-logistics
   
   # Restore database
   gunzip -c /backups/database_YYYYMMDD_HHMMSS.sql.gz | psql sebenza_logistics
   
   # Restart application
   pm2 start sebenza-logistics
   ```

2. **Full System Recovery**

   ```bash
   # Restore application files
   tar -xzf /backups/files_YYYYMMDD_HHMMSS.tar.gz -C /
   
   # Restore database
   gunzip -c /backups/database_YYYYMMDD_HHMMSS.sql.gz | psql sebenza_logistics
   
   # Restart services
   pm2 restart all
   systemctl restart nginx
   ```

## Troubleshooting

### Common Deployment Issues

#### Build Failures

**Issue**: Build fails during deployment
**Solutions**:

```bash
# Clear cache and rebuild
rm -rf .next node_modules
npm ci
npm run build

# Check for TypeScript errors
npm run typecheck

# Verify environment variables
node -e "console.log(process.env.NODE_ENV)"
```

#### Port Conflicts

**Issue**: Port already in use
**Solutions**:

```bash
# Find process using port
sudo lsof -i :3000

# Kill process
sudo kill -9 <PID>

# Use different port
PORT=3001 npm start
```

#### Memory Issues

**Issue**: Out of memory errors
**Solutions**:

```bash
# Increase Node.js memory limit
export NODE_OPTIONS="--max-old-space-size=4096"

# Monitor memory usage
pm2 monit

# Restart application
pm2 reload sebenza-logistics
```

#### SSL Certificate Issues

**Issue**: SSL certificate errors
**Solutions**:

```bash
# Check certificate validity
openssl x509 -in /etc/ssl/certs/your-domain.crt -text -noout

# Renew Let's Encrypt certificate
certbot renew

# Restart Nginx
sudo systemctl restart nginx
```

### Performance Issues

#### High Response Times

**Diagnosis**:

```bash
# Check application logs
pm2 logs sebenza-logistics

# Monitor system resources
htop
iotop

# Check database performance
# (when database is implemented)
```

**Solutions**:

1. **Enable Caching**
2. **Optimize Database Queries**
3. **Scale Horizontally**
4. **Use CDN for Static Assets**

#### High Memory Usage

**Diagnosis**:

```bash
# Check memory usage by process
ps aux --sort=-%mem | head

# Monitor Node.js heap
node --inspect index.js
```

**Solutions**:

1. **Implement Memory Profiling**
2. **Optimize Large Objects**
3. **Use Streaming for Large Files**
4. **Increase Server Memory**

### Recovery Procedures

#### Application Crash Recovery

```bash
# Check PM2 status
pm2 status

# Restart crashed processes
pm2 restart sebenza-logistics

# View crash logs
pm2 logs sebenza-logistics --lines 100

# Enable auto-restart
pm2 startup
pm2 save
```

#### Database Connection Issues

```bash
# Check database status
sudo systemctl status postgresql

# Test connection
psql -h localhost -U username -d sebenza_logistics

# Restart database
sudo systemctl restart postgresql
```

---

*Last updated: July 3, 2025*
*Version: 1.0.0*

For technical support during deployment, contact our DevOps team at devops@sebenza.com
