# Operations Manual

## Table of Contents

- [Overview](#overview)
- [System Architecture](#system-architecture)
- [Environment Management](#environment-management)
- [Deployment Procedures](#deployment-procedures)
- [Monitoring and Alerting](#monitoring-and-alerting)
- [Backup and Recovery](#backup-and-recovery)
- [Performance Management](#performance-management)
- [Maintenance Procedures](#maintenance-procedures)
- [Incident Management](#incident-management)
- [Capacity Planning](#capacity-planning)

## Overview

This operations manual provides comprehensive guidance for managing, monitoring, and maintaining the Sebenza Logistics Suite in production environments. It covers daily operational procedures, emergency response protocols, and best practices for system reliability.

### Operational Objectives

- **Availability**: 99.9% uptime target
- **Performance**: Sub-2 second page load times
- **Scalability**: Support for 10,000+ concurrent users
- **Security**: Zero security incidents
- **Recovery**: 4-hour RTO, 1-hour RPO

### Team Responsibilities

#### DevOps Team

- Infrastructure management
- Deployment automation
- Monitoring and alerting
- Performance optimization
- Security compliance

#### Development Team

- Code quality and testing
- Bug fixes and hotfixes
- Feature development
- Technical documentation

#### Support Team

- User support and training
- Issue triage and escalation
- Documentation maintenance
- Customer communication

## System Architecture

### Production Environment Overview

```text
┌─────────────────────────────────────────────────────────┐
│                Load Balancer (HAProxy)                  │
│  - SSL Termination                                      │
│  - Health Checks                                        │
│  - Request Distribution                                 │
└─────────────────────┬───────────────────────────────────┘
                      │
          ┌───────────┴───────────┐
          │                       │
     ┌────▼────┐             ┌────▼────┐
     │ App     │             │ App     │
     │ Server  │             │ Server  │
     │ Node 1  │             │ Node 2  │
     └────┬────┘             └────┬────┘
          │                       │
          └───────────┬───────────┘
                      │
    ┌─────────────────▼─────────────────┐
    │           Database Cluster        │
    │  ┌─────────┐  ┌─────────┐        │
    │  │ Primary │  │ Replica │        │
    │  │   DB    │  │   DB    │        │
    │  └─────────┘  └─────────┘        │
    └───────────────────────────────────┘
    
    ┌─────────────────────────────────────┐
    │          Supporting Services        │
    │  ┌─────────┐  ┌─────────┐          │
    │  │  Redis  │  │  Nginx  │          │
    │  │ (Cache) │  │ (Proxy) │          │
    │  └─────────┘  └─────────┘          │
    └─────────────────────────────────────┘
```

### Component Specifications

#### Application Servers

- **Count**: 2 (minimum), auto-scaling to 6
- **Instance Type**: 4 vCPU, 8 GB RAM, 100 GB SSD
- **OS**: Ubuntu 22.04 LTS
- **Runtime**: Node.js 18.x
- **Process Manager**: PM2 in cluster mode

#### Database Cluster

- **Primary**: 8 vCPU, 16 GB RAM, 500 GB SSD
- **Replica**: 4 vCPU, 8 GB RAM, 500 GB SSD
- **Engine**: PostgreSQL 15
- **Backup**: Automated daily backups with 30-day retention

#### Load Balancer

- **Type**: Application Load Balancer (ALB)
- **SSL**: TLS 1.2/1.3 certificates
- **Health Checks**: HTTP endpoint monitoring
- **Failover**: Automatic unhealthy instance removal

## Environment Management

### Environment Overview

#### Production Environment

- **URL**: <https://app.sebenza.com>
- **Database**: Primary cluster with read replicas
- **Monitoring**: Full monitoring and alerting
- **Backup**: Daily automated backups
- **SSL**: Production certificates

#### Staging Environment

- **URL**: <https://staging.sebenza.com>
- **Database**: Staging database with production data snapshot
- **Monitoring**: Basic monitoring
- **Backup**: Weekly backups
- **SSL**: Staging certificates

#### Development Environment

- **URL**: <https://dev.sebenza.com>
- **Database**: Development database with mock data
- **Monitoring**: Basic health checks
- **Backup**: No automated backups
- **SSL**: Self-signed certificates

### Environment Configuration

#### Environment Variables

```bash
# Production environment variables
NODE_ENV=production
APP_PORT=3000
DATABASE_URL=postgresql://user:pass@prod-db:5432/sebenza
REDIS_URL=redis://prod-redis:6379
LOG_LEVEL=info
METRICS_ENABLED=true
ALERTS_WEBHOOK=https://alerts.company.com/webhook

# Staging environment variables
NODE_ENV=staging
APP_PORT=3000
DATABASE_URL=postgresql://user:pass@staging-db:5432/sebenza
REDIS_URL=redis://staging-redis:6379
LOG_LEVEL=debug
METRICS_ENABLED=true
ALERTS_WEBHOOK=https://staging-alerts.company.com/webhook
```

#### Configuration Management

```typescript
interface EnvironmentConfig {
  environment: 'production' | 'staging' | 'development'
  app: {
    port: number
    logLevel: 'error' | 'warn' | 'info' | 'debug'
    sessionTimeout: number
  }
  database: {
    url: string
    poolSize: number
    queryTimeout: number
  }
  cache: {
    url: string
    ttl: number
  }
  monitoring: {
    enabled: boolean
    metricsEndpoint: string
    alertsWebhook: string
  }
}

class ConfigManager {
  private config: EnvironmentConfig

  constructor() {
    this.config = this.loadConfig()
    this.validateConfig()
  }

  private loadConfig(): EnvironmentConfig {
    return {
      environment: process.env.NODE_ENV as any || 'development',
      app: {
        port: parseInt(process.env.APP_PORT || '3000'),
        logLevel: process.env.LOG_LEVEL as any || 'info',
        sessionTimeout: parseInt(process.env.SESSION_TIMEOUT || '3600')
      },
      database: {
        url: process.env.DATABASE_URL || '',
        poolSize: parseInt(process.env.DB_POOL_SIZE || '10'),
        queryTimeout: parseInt(process.env.DB_QUERY_TIMEOUT || '30000')
      },
      cache: {
        url: process.env.REDIS_URL || '',
        ttl: parseInt(process.env.CACHE_TTL || '3600')
      },
      monitoring: {
        enabled: process.env.METRICS_ENABLED === 'true',
        metricsEndpoint: process.env.METRICS_ENDPOINT || '',
        alertsWebhook: process.env.ALERTS_WEBHOOK || ''
      }
    }
  }
}
```

## Deployment Procedures

### Standard Deployment Process

#### Pre-deployment Checklist

- [ ] Code review completed and approved
- [ ] All tests passing (unit, integration, E2E)
- [ ] Security scan completed
- [ ] Performance benchmarks met
- [ ] Database migrations tested
- [ ] Configuration changes verified
- [ ] Rollback plan prepared
- [ ] Stakeholders notified

#### Deployment Steps

```bash
#!/bin/bash
# Standard deployment script

set -e

ENVIRONMENT=${1:-staging}
VERSION=${2:-latest}

echo "Starting deployment to $ENVIRONMENT (version: $VERSION)"

# 1. Backup current state
echo "Creating backup..."
./scripts/backup.sh $ENVIRONMENT

# 2. Update application code
echo "Updating application code..."
git fetch origin
git checkout $VERSION
npm ci --only=production

# 3. Run database migrations
echo "Running database migrations..."
npm run db:migrate:$ENVIRONMENT

# 4. Build application
echo "Building application..."
npm run build

# 5. Deploy to staging first (if production deployment)
if [ "$ENVIRONMENT" = "production" ]; then
    echo "Deploying to staging for final verification..."
    ./scripts/deploy.sh staging $VERSION
    
    echo "Running smoke tests on staging..."
    npm run test:smoke:staging
    
    read -p "Staging tests passed. Continue with production deployment? (y/N): " confirm
    if [ "$confirm" != "y" ]; then
        echo "Production deployment cancelled"
        exit 1
    fi
fi

# 6. Deploy application
echo "Deploying application..."
pm2 deploy ecosystem.config.js $ENVIRONMENT

# 7. Health check
echo "Running health checks..."
./scripts/health-check.sh $ENVIRONMENT

# 8. Verify deployment
echo "Verifying deployment..."
./scripts/verify-deployment.sh $ENVIRONMENT

echo "Deployment completed successfully!"
```

#### Blue-Green Deployment

```bash
#!/bin/bash
# Blue-green deployment for zero downtime

CURRENT_COLOR=$(cat /var/deployment/current-color)
NEW_COLOR=$([ "$CURRENT_COLOR" = "blue" ] && echo "green" || echo "blue")

echo "Current environment: $CURRENT_COLOR"
echo "Deploying to: $NEW_COLOR"

# Deploy to inactive environment
./scripts/deploy-to-environment.sh $NEW_COLOR

# Health check new environment
if ./scripts/health-check.sh $NEW_COLOR; then
    echo "Health check passed, switching traffic..."
    
    # Update load balancer to point to new environment
    ./scripts/switch-traffic.sh $NEW_COLOR
    
    # Verify traffic switch
    sleep 30
    if ./scripts/verify-traffic.sh $NEW_COLOR; then
        echo "Traffic switch successful"
        
        # Stop old environment
        ./scripts/stop-environment.sh $CURRENT_COLOR
        
        # Update current color marker
        echo $NEW_COLOR > /var/deployment/current-color
        
        echo "Blue-green deployment completed successfully!"
    else
        echo "Traffic verification failed, rolling back..."
        ./scripts/switch-traffic.sh $CURRENT_COLOR
        exit 1
    fi
else
    echo "Health check failed, deployment aborted"
    exit 1
fi
```

### Rollback Procedures

#### Automatic Rollback Triggers

- Health check failures
- Error rate exceeding 5%
- Response time exceeding 5 seconds
- Critical system alerts

#### Manual Rollback Process

```bash
#!/bin/bash
# Emergency rollback script

ENVIRONMENT=${1:-production}
ROLLBACK_VERSION=${2}

echo "Initiating emergency rollback for $ENVIRONMENT"

if [ -z "$ROLLBACK_VERSION" ]; then
    # Get last known good version
    ROLLBACK_VERSION=$(cat /var/deployment/last-good-version)
    echo "Using last known good version: $ROLLBACK_VERSION"
fi

# Stop current application
echo "Stopping current application..."
pm2 stop sebenza-$ENVIRONMENT

# Restore from backup
echo "Restoring application from backup..."
./scripts/restore-backup.sh $ENVIRONMENT $ROLLBACK_VERSION

# Rollback database if needed
read -p "Rollback database? (y/N): " rollback_db
if [ "$rollback_db" = "y" ]; then
    echo "Rolling back database..."
    ./scripts/rollback-database.sh $ENVIRONMENT $ROLLBACK_VERSION
fi

# Start application
echo "Starting application..."
pm2 start sebenza-$ENVIRONMENT

# Verify rollback
echo "Verifying rollback..."
./scripts/health-check.sh $ENVIRONMENT

echo "Rollback completed"
```

## Monitoring and Alerting

### Application Monitoring

#### Key Metrics

**Performance Metrics**:

- Response time (95th percentile < 2s)
- Throughput (requests per second)
- Error rate (< 0.1%)
- Availability (> 99.9%)

**System Metrics**:

- CPU utilization (< 80%)
- Memory usage (< 85%)
- Disk usage (< 90%)
- Network I/O

**Business Metrics**:

- Active users
- Transaction volume
- Revenue metrics
- Feature adoption

#### Monitoring Stack

```yaml
# Prometheus configuration
global:
  scrape_interval: 15s
  evaluation_interval: 15s

rule_files:
  - "alert_rules.yml"

scrape_configs:
  - job_name: 'sebenza-app'
    static_configs:
      - targets: ['app1:3000', 'app2:3000']
    scrape_interval: 10s
    metrics_path: '/metrics'

  - job_name: 'node-exporter'
    static_configs:
      - targets: ['app1:9100', 'app2:9100']

alerting:
  alertmanagers:
    - static_configs:
        - targets: ['alertmanager:9093']
```

#### Application Metrics Collection

```typescript
import prometheus from 'prom-client'

// Custom metrics
const httpRequestDuration = new prometheus.Histogram({
  name: 'http_request_duration_seconds',
  help: 'Duration of HTTP requests in seconds',
  labelNames: ['method', 'route', 'status_code'],
  buckets: [0.1, 0.5, 1, 2, 5]
})

const activeUsers = new prometheus.Gauge({
  name: 'active_users_total',
  help: 'Number of active users'
})

const databaseConnections = new prometheus.Gauge({
  name: 'database_connections_active',
  help: 'Number of active database connections'
})

// Middleware to collect metrics
export function metricsMiddleware(req: Request, res: Response, next: NextFunction) {
  const start = Date.now()
  
  res.on('finish', () => {
    const duration = (Date.now() - start) / 1000
    httpRequestDuration
      .labels(req.method, req.route?.path || req.path, res.statusCode.toString())
      .observe(duration)
  })
  
  next()
}

// Custom business metrics
export class BusinessMetrics {
  static updateActiveUsers(count: number) {
    activeUsers.set(count)
  }
  
  static recordTransaction(amount: number, type: string) {
    transactionAmount
      .labels(type)
      .observe(amount)
  }
}
```

### Alert Configuration

#### Critical Alerts

```yaml
# alert_rules.yml
groups:
  - name: critical
    rules:
      - alert: ApplicationDown
        expr: up{job="sebenza-app"} == 0
        for: 1m
        labels:
          severity: critical
        annotations:
          summary: "Application instance is down"
          description: "{{ $labels.instance }} has been down for more than 1 minute"

      - alert: HighErrorRate
        expr: rate(http_requests_total{status=~"5.."}[5m]) > 0.05
        for: 2m
        labels:
          severity: critical
        annotations:
          summary: "High error rate detected"
          description: "Error rate is {{ $value }} errors per second"

      - alert: HighResponseTime
        expr: histogram_quantile(0.95, rate(http_request_duration_seconds_bucket[5m])) > 2
        for: 5m
        labels:
          severity: warning
        annotations:
          summary: "High response time"
          description: "95th percentile response time is {{ $value }} seconds"

      - alert: DatabaseConnectionsHigh
        expr: database_connections_active > 80
        for: 5m
        labels:
          severity: warning
        annotations:
          summary: "High database connection usage"
          description: "Database connections at {{ $value }}"
```

#### Alert Routing

```typescript
interface AlertRule {
  name: string
  condition: string
  severity: 'critical' | 'warning' | 'info'
  channels: NotificationChannel[]
}

interface NotificationChannel {
  type: 'email' | 'slack' | 'pagerduty' | 'webhook'
  target: string
  template?: string
}

const alertRules: AlertRule[] = [
  {
    name: 'Application Down',
    condition: 'up == 0',
    severity: 'critical',
    channels: [
      { type: 'pagerduty', target: 'incidents' },
      { type: 'slack', target: '#alerts-critical' },
      { type: 'email', target: 'oncall@company.com' }
    ]
  },
  {
    name: 'High CPU Usage',
    condition: 'cpu_usage > 80',
    severity: 'warning',
    channels: [
      { type: 'slack', target: '#alerts-warning' },
      { type: 'email', target: 'devops@company.com' }
    ]
  }
]
```

### Logging Strategy

#### Log Levels and Categories

```typescript
enum LogLevel {
  ERROR = 0,
  WARN = 1,
  INFO = 2,
  DEBUG = 3
}

interface LogEntry {
  timestamp: Date
  level: LogLevel
  category: string
  message: string
  metadata?: Record<string, any>
  requestId?: string
  userId?: string
}

class Logger {
  private static instance: Logger
  
  constructor(private config: LogConfig) {}
  
  error(message: string, metadata?: any) {
    this.log(LogLevel.ERROR, 'application', message, metadata)
  }
  
  warn(message: string, metadata?: any) {
    this.log(LogLevel.WARN, 'application', message, metadata)
  }
  
  info(message: string, metadata?: any) {
    this.log(LogLevel.INFO, 'application', message, metadata)
  }
  
  audit(action: string, userId: string, resource: string, metadata?: any) {
    this.log(LogLevel.INFO, 'audit', `${action} on ${resource}`, {
      userId,
      resource,
      ...metadata
    })
  }
  
  private log(level: LogLevel, category: string, message: string, metadata?: any) {
    const entry: LogEntry = {
      timestamp: new Date(),
      level,
      category,
      message,
      metadata,
      requestId: this.getCurrentRequestId(),
      userId: this.getCurrentUserId()
    }
    
    // Send to appropriate destinations
    this.sendToDestinations(entry)
  }
}
```

#### Log Management

```bash
# Log rotation configuration
# /etc/logrotate.d/sebenza-logistics

/var/log/sebenza-logistics/*.log {
    daily
    rotate 30
    compress
    delaycompress
    missingok
    notifempty
    create 644 sebenza sebenza
    postrotate
        pm2 reload sebenza-logistics
    endscript
}

# Centralized logging with rsyslog
# /etc/rsyslog.d/50-sebenza.conf

$ModLoad imfile
$InputFilePollingInterval 1

# Application logs
$InputFileName /var/log/sebenza-logistics/app.log
$InputFileTag sebenza-app:
$InputFileStateFile sebenza-app-state
$InputFileSeverity info
$InputRunFileMonitor

# Send to central log server
*.* @@logserver.company.com:514
```

## Backup and Recovery

### Backup Strategy

#### Database Backups

```bash
#!/bin/bash
# Database backup script

BACKUP_DIR="/backups/database"
DATE=$(date +%Y%m%d_%H%M%S)
DB_NAME="sebenza_logistics"

# Create backup directory
mkdir -p $BACKUP_DIR

# Full database backup
echo "Creating full database backup..."
pg_dump -h $DB_HOST -U $DB_USER -d $DB_NAME | gzip > $BACKUP_DIR/full_backup_$DATE.sql.gz

# Incremental backup (WAL files)
echo "Archiving WAL files..."
rsync -av $PGDATA/pg_wal/ $BACKUP_DIR/wal_archive/

# Verify backup integrity
echo "Verifying backup..."
gunzip -t $BACKUP_DIR/full_backup_$DATE.sql.gz

if [ $? -eq 0 ]; then
    echo "Backup completed successfully: full_backup_$DATE.sql.gz"
    
    # Upload to cloud storage
    aws s3 cp $BACKUP_DIR/full_backup_$DATE.sql.gz s3://sebenza-backups/database/
    
    # Clean old local backups (keep 7 days)
    find $BACKUP_DIR -name "full_backup_*.sql.gz" -mtime +7 -delete
else
    echo "Backup verification failed!"
    exit 1
fi
```

#### Application Backups

```bash
#!/bin/bash
# Application files backup

BACKUP_DIR="/backups/application"
DATE=$(date +%Y%m%d_%H%M%S)
APP_DIR="/var/www/sebenza-logistics"

# Create backup
echo "Creating application backup..."
tar -czf $BACKUP_DIR/app_backup_$DATE.tar.gz \
    --exclude=node_modules \
    --exclude=.next \
    --exclude=logs \
    $APP_DIR

# Backup configuration files
echo "Backing up configuration..."
tar -czf $BACKUP_DIR/config_backup_$DATE.tar.gz \
    /etc/nginx/sites-available/sebenza-logistics \
    /etc/pm2/ecosystem.config.js \
    /etc/systemd/system/sebenza-*.service

# Upload to cloud storage
aws s3 cp $BACKUP_DIR/app_backup_$DATE.tar.gz s3://sebenza-backups/application/
aws s3 cp $BACKUP_DIR/config_backup_$DATE.tar.gz s3://sebenza-backups/config/

echo "Application backup completed"
```

### Recovery Procedures

#### Database Recovery

```bash
#!/bin/bash
# Database recovery script

BACKUP_FILE=${1}
TARGET_DB=${2:-sebenza_logistics_restored}

if [ -z "$BACKUP_FILE" ]; then
    echo "Usage: $0 <backup_file> [target_database]"
    exit 1
fi

echo "Starting database recovery..."

# Create target database
createdb $TARGET_DB

# Restore from backup
echo "Restoring from $BACKUP_FILE..."
if [[ $BACKUP_FILE == *.gz ]]; then
    gunzip -c $BACKUP_FILE | psql -d $TARGET_DB
else
    psql -d $TARGET_DB < $BACKUP_FILE
fi

# Verify restoration
echo "Verifying restoration..."
psql -d $TARGET_DB -c "SELECT COUNT(*) FROM users;"

if [ $? -eq 0 ]; then
    echo "Database recovery completed successfully"
else
    echo "Database recovery failed"
    exit 1
fi
```

#### Point-in-Time Recovery

```bash
#!/bin/bash
# Point-in-time recovery using WAL files

RECOVERY_TARGET_TIME=${1}
BACKUP_FILE=${2}

if [ -z "$RECOVERY_TARGET_TIME" ] || [ -z "$BACKUP_FILE" ]; then
    echo "Usage: $0 <recovery_time> <backup_file>"
    echo "Example: $0 '2025-07-03 15:30:00' /backups/full_backup_20250703_120000.sql.gz"
    exit 1
fi

echo "Starting point-in-time recovery to $RECOVERY_TARGET_TIME..."

# Stop PostgreSQL
systemctl stop postgresql

# Restore base backup
echo "Restoring base backup..."
rm -rf $PGDATA/*
gunzip -c $BACKUP_FILE | pg_restore -d postgres

# Create recovery configuration
cat > $PGDATA/recovery.conf << EOF
restore_command = 'cp /backups/wal_archive/%f %p'
recovery_target_time = '$RECOVERY_TARGET_TIME'
recovery_target_action = 'promote'
EOF

# Start PostgreSQL in recovery mode
systemctl start postgresql

echo "Point-in-time recovery initiated. Monitor logs for completion."
```

### Disaster Recovery

#### Recovery Time Objectives

- **RTO (Recovery Time Objective)**: 4 hours
- **RPO (Recovery Point Objective)**: 1 hour
- **MTTR (Mean Time To Recovery)**: 2 hours

#### Disaster Recovery Plan

```bash
#!/bin/bash
# Disaster recovery orchestration script

DR_SITE=${1:-secondary}
RECOVERY_TYPE=${2:-full}  # full, partial, failover

echo "Initiating disaster recovery to $DR_SITE (type: $RECOVERY_TYPE)"

# Step 1: Assess damage and determine recovery scope
./scripts/assess-damage.sh

# Step 2: Activate DR site infrastructure
echo "Activating DR site infrastructure..."
./scripts/activate-dr-site.sh $DR_SITE

# Step 3: Restore data from backups
echo "Restoring data..."
case $RECOVERY_TYPE in
    "full")
        ./scripts/restore-full-system.sh $DR_SITE
        ;;
    "partial")
        ./scripts/restore-critical-systems.sh $DR_SITE
        ;;
    "failover")
        ./scripts/activate-standby.sh $DR_SITE
        ;;
esac

# Step 4: Update DNS and routing
echo "Updating DNS records..."
./scripts/update-dns.sh $DR_SITE

# Step 5: Verify system functionality
echo "Running system verification..."
./scripts/verify-dr-system.sh $DR_SITE

# Step 6: Notify stakeholders
echo "Notifying stakeholders..."
./scripts/notify-dr-activation.sh $DR_SITE

echo "Disaster recovery completed. System is operational on $DR_SITE"
```

## Performance Management

### Performance Monitoring

#### Key Performance Indicators

```typescript
interface PerformanceMetrics {
  responseTime: {
    avg: number
    p50: number
    p95: number
    p99: number
  }
  throughput: {
    requestsPerSecond: number
    concurrentUsers: number
  }
  resourceUtilization: {
    cpu: number
    memory: number
    disk: number
    network: number
  }
  errorRates: {
    total: number
    client: number  // 4xx errors
    server: number  // 5xx errors
  }
}

class PerformanceMonitor {
  private metrics: PerformanceMetrics
  
  async collectMetrics(): Promise<PerformanceMetrics> {
    return {
      responseTime: await this.getResponseTimeMetrics(),
      throughput: await this.getThroughputMetrics(),
      resourceUtilization: await this.getResourceMetrics(),
      errorRates: await this.getErrorRateMetrics()
    }
  }
  
  async checkPerformanceThresholds(): Promise<PerformanceAlert[]> {
    const metrics = await this.collectMetrics()
    const alerts: PerformanceAlert[] = []
    
    // Response time threshold
    if (metrics.responseTime.p95 > 2000) {
      alerts.push({
        type: 'response_time',
        severity: 'warning',
        message: `95th percentile response time: ${metrics.responseTime.p95}ms`
      })
    }
    
    // Resource utilization thresholds
    if (metrics.resourceUtilization.cpu > 80) {
      alerts.push({
        type: 'cpu_usage',
        severity: 'warning',
        message: `High CPU usage: ${metrics.resourceUtilization.cpu}%`
      })
    }
    
    return alerts
  }
}
```

### Performance Optimization

#### Application-Level Optimization

```typescript
// Database query optimization
class OptimizedQueries {
  // Use connection pooling
  private pool = new Pool({
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    max: 20,                    // Maximum connections
    idleTimeoutMillis: 30000,   // Close idle connections after 30s
    connectionTimeoutMillis: 2000, // Return error after 2s if no connection available
  })
  
  // Implement query caching
  async getProjects(userId: string): Promise<Project[]> {
    const cacheKey = `projects:${userId}`
    
    // Check cache first
    const cached = await cache.get(cacheKey)
    if (cached) {
      return JSON.parse(cached)
    }
    
    // Query database
    const query = `
      SELECT p.*, c.name as client_name 
      FROM projects p 
      JOIN clients c ON p.client_id = c.id 
      WHERE p.team_members @> $1
      ORDER BY p.updated_at DESC
    `
    const result = await this.pool.query(query, [JSON.stringify([userId])])
    
    // Cache results for 5 minutes
    await cache.setex(cacheKey, 300, JSON.stringify(result.rows))
    
    return result.rows
  }
  
  // Batch operations for better performance
  async createMultipleInvoices(invoices: CreateInvoiceRequest[]): Promise<Invoice[]> {
    const client = await this.pool.connect()
    
    try {
      await client.query('BEGIN')
      
      const results = await Promise.all(
        invoices.map(invoice => this.createInvoiceInternal(client, invoice))
      )
      
      await client.query('COMMIT')
      return results
    } catch (error) {
      await client.query('ROLLBACK')
      throw error
    } finally {
      client.release()
    }
  }
}
```

#### Caching Strategy

```typescript
// Multi-layer caching implementation
class CacheManager {
  private redis: Redis
  private localCache: LRUCache<string, any>
  
  constructor() {
    this.redis = new Redis(process.env.REDIS_URL)
    this.localCache = new LRUCache({ max: 1000, ttl: 60000 }) // 1 minute local cache
  }
  
  async get(key: string): Promise<any> {
    // Check local cache first (fastest)
    const localValue = this.localCache.get(key)
    if (localValue) {
      return localValue
    }
    
    // Check Redis cache
    const redisValue = await this.redis.get(key)
    if (redisValue) {
      const parsed = JSON.parse(redisValue)
      this.localCache.set(key, parsed) // Populate local cache
      return parsed
    }
    
    return null
  }
  
  async set(key: string, value: any, ttl: number = 3600): Promise<void> {
    // Set in both caches
    this.localCache.set(key, value)
    await this.redis.setex(key, ttl, JSON.stringify(value))
  }
  
  async invalidate(pattern: string): Promise<void> {
    // Clear local cache entries matching pattern
    for (const key of this.localCache.keys()) {
      if (key.match(pattern)) {
        this.localCache.delete(key)
      }
    }
    
    // Clear Redis cache entries
    const keys = await this.redis.keys(pattern)
    if (keys.length > 0) {
      await this.redis.del(...keys)
    }
  }
}
```

### Load Testing

#### Performance Testing Strategy

```javascript
// Artillery.js load testing configuration
module.exports = {
  config: {
    target: 'https://api.sebenza.com',
    phases: [
      { duration: 60, arrivalRate: 10 },    // Warm up
      { duration: 300, arrivalRate: 50 },   // Sustained load
      { duration: 120, arrivalRate: 100 },  // Peak load
      { duration: 60, arrivalRate: 200 }    // Stress test
    ],
    defaults: {
      headers: {
        'Authorization': 'Bearer {{ $randomString() }}',
        'Content-Type': 'application/json'
      }
    }
  },
  scenarios: [
    {
      name: 'User Journey - Project Management',
      weight: 40,
      flow: [
        { get: { url: '/api/v1/auth/me' } },
        { get: { url: '/api/v1/projects' } },
        { get: { url: '/api/v1/projects/{{ $randomString() }}' } },
        { post: { url: '/api/v1/projects', json: { name: 'Test Project' } } }
      ]
    },
    {
      name: 'User Journey - Invoice Management',
      weight: 30,
      flow: [
        { get: { url: '/api/v1/invoices' } },
        { post: { url: '/api/v1/invoices', json: { clientId: '{{ $randomString() }}' } } }
      ]
    },
    {
      name: 'User Journey - Dashboard',
      weight: 30,
      flow: [
        { get: { url: '/api/v1/dashboard/metrics' } },
        { get: { url: '/api/v1/dashboard/recent-activity' } }
      ]
    }
  ]
}
```

## Maintenance Procedures

### Routine Maintenance

#### Daily Tasks

```bash
#!/bin/bash
# Daily maintenance script

echo "Starting daily maintenance tasks..."

# Check system health
echo "1. Checking system health..."
./scripts/health-check.sh production

# Check disk space
echo "2. Checking disk space..."
df -h | awk '$5 > 80 {print "WARNING: " $0}'

# Check log file sizes
echo "3. Checking log file sizes..."
find /var/log -name "*.log" -size +100M -exec ls -lh {} \;

# Update system metrics
echo "4. Updating system metrics..."
./scripts/collect-metrics.sh

# Check backup status
echo "5. Verifying backup status..."
./scripts/verify-backups.sh

# Clean temporary files
echo "6. Cleaning temporary files..."
find /tmp -type f -mtime +3 -delete
find /var/tmp -type f -mtime +7 -delete

# Check SSL certificate expiration
echo "7. Checking SSL certificates..."
./scripts/check-ssl-expiry.sh

echo "Daily maintenance completed"
```

#### Weekly Tasks

```bash
#!/bin/bash
# Weekly maintenance script

echo "Starting weekly maintenance tasks..."

# System updates (non-production environments)
if [ "$ENVIRONMENT" != "production" ]; then
    echo "1. Updating system packages..."
    apt update && apt upgrade -y
fi

# Database maintenance
echo "2. Running database maintenance..."
psql -d sebenza_logistics -c "VACUUM ANALYZE;"
psql -d sebenza_logistics -c "REINDEX DATABASE sebenza_logistics;"

# Log rotation and cleanup
echo "3. Rotating logs..."
logrotate -f /etc/logrotate.conf

# Performance report generation
echo "4. Generating performance reports..."
./scripts/generate-performance-report.sh

# Security scan
echo "5. Running security scan..."
./scripts/security-scan.sh

# Backup verification
echo "6. Testing backup restoration..."
./scripts/test-backup-restore.sh

echo "Weekly maintenance completed"
```

#### Monthly Tasks

```bash
#!/bin/bash
# Monthly maintenance script

echo "Starting monthly maintenance tasks..."

# Comprehensive security audit
echo "1. Running security audit..."
./scripts/security-audit.sh

# Performance optimization review
echo "2. Analyzing performance trends..."
./scripts/performance-analysis.sh

# Capacity planning review
echo "3. Reviewing capacity metrics..."
./scripts/capacity-review.sh

# Dependency updates
echo "4. Checking for dependency updates..."
npm audit
npm outdated

# SSL certificate renewal
echo "5. Renewing SSL certificates..."
certbot renew --dry-run

# Disaster recovery test
echo "6. Testing disaster recovery procedures..."
./scripts/dr-test.sh

echo "Monthly maintenance completed"
```

### Maintenance Windows

#### Scheduled Maintenance

**Production Maintenance Windows**:

- **Weekly**: Sundays 2:00 AM - 4:00 AM UTC
- **Monthly**: First Sunday of month 1:00 AM - 5:00 AM UTC
- **Emergency**: As needed with 2-hour notice

**Maintenance Notification Process**:

```typescript
interface MaintenanceWindow {
  id: string
  type: 'scheduled' | 'emergency'
  startTime: Date
  endTime: Date
  description: string
  affectedServices: string[]
  impact: 'high' | 'medium' | 'low'
}

class MaintenanceManager {
  async scheduleMaintenanceWindow(window: MaintenanceWindow): Promise<void> {
    // Validate maintenance window
    await this.validateMaintenanceWindow(window)
    
    // Schedule notifications
    await this.scheduleNotifications(window)
    
    // Create status page announcement
    await this.createStatusPageAnnouncement(window)
    
    // Schedule automated tasks
    await this.scheduleMaintenanceTasks(window)
  }
  
  private async scheduleNotifications(window: MaintenanceWindow): Promise<void> {
    const notifications = [
      { time: subDays(window.startTime, 7), type: 'initial' },
      { time: subDays(window.startTime, 1), type: 'reminder' },
      { time: subHours(window.startTime, 2), type: 'final' },
      { time: window.startTime, type: 'start' },
      { time: window.endTime, type: 'complete' }
    ]
    
    for (const notification of notifications) {
      await this.scheduleNotification(notification, window)
    }
  }
}
```

## Incident Management

### Incident Response Process

#### Severity Levels

**P1 - Critical**:

- Complete system outage
- Data breach or security incident
- Financial system failure
- **Response Time**: 15 minutes
- **Resolution Target**: 4 hours

**P2 - High**:

- Major feature unavailable
- Performance severely degraded
- Affecting multiple customers
- **Response Time**: 30 minutes
- **Resolution Target**: 8 hours

**P3 - Medium**:

- Minor feature issues
- Performance degradation
- Affecting limited users
- **Response Time**: 2 hours
- **Resolution Target**: 24 hours

**P4 - Low**:

- Cosmetic issues
- Enhancement requests
- **Response Time**: 8 hours
- **Resolution Target**: 72 hours

#### Incident Response Workflow

```typescript
interface Incident {
  id: string
  title: string
  description: string
  severity: 'P1' | 'P2' | 'P3' | 'P4'
  status: 'open' | 'investigating' | 'identified' | 'monitoring' | 'resolved'
  assignee: string
  reporter: string
  createdAt: Date
  updatedAt: Date
  timeline: IncidentEvent[]
}

class IncidentManager {
  async createIncident(incident: Partial<Incident>): Promise<Incident> {
    const newIncident: Incident = {
      id: generateId(),
      severity: 'P3',
      status: 'open',
      createdAt: new Date(),
      updatedAt: new Date(),
      timeline: [],
      ...incident
    } as Incident
    
    // Auto-assign based on severity
    if (newIncident.severity === 'P1' || newIncident.severity === 'P2') {
      await this.pageOnCallEngineer(newIncident)
    }
    
    // Create incident channel
    await this.createIncidentChannel(newIncident)
    
    // Start incident timeline
    await this.addTimelineEvent(newIncident.id, {
      type: 'created',
      message: 'Incident created',
      timestamp: new Date()
    })
    
    return newIncident
  }
  
  async updateIncidentStatus(
    incidentId: string, 
    status: Incident['status'], 
    updateMessage: string
  ): Promise<void> {
    await this.addTimelineEvent(incidentId, {
      type: 'status_change',
      message: `Status changed to ${status}: ${updateMessage}`,
      timestamp: new Date()
    })
    
    // Post update to status page
    await this.updateStatusPage(incidentId, status, updateMessage)
    
    // Notify stakeholders
    await this.notifyStakeholders(incidentId, status, updateMessage)
  }
}
```

### Post-Incident Review

#### Post-Mortem Process

```typescript
interface PostMortem {
  incidentId: string
  title: string
  summary: string
  timeline: TimelineEvent[]
  rootCause: string
  contributingFactors: string[]
  impact: {
    duration: number
    usersAffected: number
    revenueImpact: number
  }
  actionItems: ActionItem[]
  lessonsLearned: string[]
}

interface ActionItem {
  description: string
  assignee: string
  dueDate: Date
  priority: 'high' | 'medium' | 'low'
  status: 'open' | 'in_progress' | 'completed'
}

class PostMortemManager {
  async generatePostMortem(incidentId: string): Promise<PostMortem> {
    const incident = await this.getIncident(incidentId)
    const metrics = await this.calculateIncidentMetrics(incident)
    
    return {
      incidentId,
      title: `Post-Mortem: ${incident.title}`,
      summary: this.generateSummary(incident),
      timeline: incident.timeline,
      rootCause: '',  // To be filled during review
      contributingFactors: [],
      impact: metrics,
      actionItems: await this.generateActionItems(incident),
      lessonsLearned: []
    }
  }
  
  private async generateActionItems(incident: Incident): Promise<ActionItem[]> {
    const actionItems: ActionItem[] = []
    
    // Generate action items based on incident type and patterns
    if (incident.timeline.some(e => e.message.includes('database'))) {
      actionItems.push({
        description: 'Implement database monitoring alerts',
        assignee: 'database-team',
        dueDate: addDays(new Date(), 14),
        priority: 'high',
        status: 'open'
      })
    }
    
    return actionItems
  }
}
```

## Capacity Planning

### Resource Planning

#### Capacity Metrics Collection

```typescript
interface CapacityMetrics {
  timestamp: Date
  cpu: {
    current: number
    average: number
    peak: number
  }
  memory: {
    used: number
    available: number
    percentage: number
  }
  storage: {
    used: number
    available: number
    percentage: number
  }
  network: {
    inbound: number
    outbound: number
  }
  application: {
    activeUsers: number
    requestsPerSecond: number
    databaseConnections: number
  }
}

class CapacityPlanner {
  async collectCapacityMetrics(): Promise<CapacityMetrics> {
    return {
      timestamp: new Date(),
      cpu: await this.getCPUMetrics(),
      memory: await this.getMemoryMetrics(),
      storage: await this.getStorageMetrics(),
      network: await this.getNetworkMetrics(),
      application: await this.getApplicationMetrics()
    }
  }
  
  async forecastCapacity(timeframe: number): Promise<CapacityForecast> {
    const historicalData = await this.getHistoricalMetrics(timeframe)
    
    // Use linear regression for basic forecasting
    const cpuTrend = this.calculateTrend(historicalData.map(d => d.cpu.average))
    const memoryTrend = this.calculateTrend(historicalData.map(d => d.memory.percentage))
    
    return {
      cpu: {
        currentUsage: historicalData[historicalData.length - 1].cpu.average,
        projectedUsage: cpuTrend.projected,
        timeToCapacity: this.calculateTimeToCapacity(cpuTrend, 80)
      },
      memory: {
        currentUsage: historicalData[historicalData.length - 1].memory.percentage,
        projectedUsage: memoryTrend.projected,
        timeToCapacity: this.calculateTimeToCapacity(memoryTrend, 85)
      },
      recommendedActions: this.generateRecommendations(cpuTrend, memoryTrend)
    }
  }
}
```

#### Scaling Strategies

```typescript
interface ScalingRule {
  metric: string
  threshold: number
  action: 'scale_up' | 'scale_down'
  cooldown: number
  minInstances: number
  maxInstances: number
}

const scalingRules: ScalingRule[] = [
  {
    metric: 'cpu_utilization',
    threshold: 70,
    action: 'scale_up',
    cooldown: 300,  // 5 minutes
    minInstances: 2,
    maxInstances: 10
  },
  {
    metric: 'cpu_utilization',
    threshold: 30,
    action: 'scale_down',
    cooldown: 600,  // 10 minutes
    minInstances: 2,
    maxInstances: 10
  },
  {
    metric: 'memory_utilization',
    threshold: 80,
    action: 'scale_up',
    cooldown: 300,
    minInstances: 2,
    maxInstances: 10
  }
]

class AutoScaler {
  async evaluateScaling(): Promise<void> {
    const currentMetrics = await this.getCurrentMetrics()
    const currentInstances = await this.getCurrentInstanceCount()
    
    for (const rule of scalingRules) {
      const metricValue = currentMetrics[rule.metric]
      
      if (this.shouldScale(rule, metricValue, currentInstances)) {
        await this.executeScaling(rule, currentInstances)
      }
    }
  }
  
  private shouldScale(
    rule: ScalingRule, 
    metricValue: number, 
    currentInstances: number
  ): boolean {
    // Check threshold
    const thresholdMet = rule.action === 'scale_up' 
      ? metricValue > rule.threshold 
      : metricValue < rule.threshold
    
    if (!thresholdMet) return false
    
    // Check instance limits
    if (rule.action === 'scale_up' && currentInstances >= rule.maxInstances) {
      return false
    }
    
    if (rule.action === 'scale_down' && currentInstances <= rule.minInstances) {
      return false
    }
    
    // Check cooldown period
    return this.isCooldownExpired(rule)
  }
}
```

---

*Last updated: July 3, 2025*
*Version: 1.0.0*

For operational support and escalations, contact the Operations Team at <ops@sebenza.com>
