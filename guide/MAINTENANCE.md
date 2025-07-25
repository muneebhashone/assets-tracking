# FrateZone - Maintenance & Support Guide

## Overview

This guide provides comprehensive information for maintaining, monitoring, and supporting the FrateZone application in production environments. It covers routine maintenance tasks, troubleshooting procedures, backup strategies, and security practices.

## System Monitoring

### Application Health Monitoring

#### Built-in Monitoring Dashboard
The application includes a comprehensive monitoring system accessible at `/dashboard/monitoring` (Super Admin only).

**Key Metrics to Monitor:**
- **Sync Health Status**: Success rate of external API integrations
- **Circuit Breaker Status**: Protection against cascading failures
- **Response Times**: API response performance
- **Error Rates**: Frequency and types of errors
- **Active Users**: Current system usage

#### System Health Checks
```bash
# Application health check
curl http://localhost:3021/api/health

# Expected response:
{
  "status": "healthy",
  "timestamp": "2024-01-15T10:30:00Z",
  "uptime": 86400,
  "version": "1.0.0"
}
```

#### PM2 Monitoring
```bash
# Check process status
pm2 status

# Monitor processes in real-time
pm2 monit

# View process details
pm2 show fratezone-frontend

# Check process logs
pm2 logs fratezone-frontend --lines 100
```

### Performance Monitoring

#### Key Performance Indicators (KPIs)
- **Response Time**: Page load times < 2 seconds
- **Memory Usage**: < 80% of allocated memory
- **CPU Usage**: < 70% average CPU utilization
- **Database Connections**: Monitor connection pool usage
- **API Success Rate**: > 95% success rate for external APIs

#### Performance Monitoring Commands
```bash
# System resource usage
htop
free -m
df -h

# Process-specific monitoring
ps aux | grep node
lsof -p <process_id>

# Network monitoring
netstat -tulpn | grep :3021
ss -tulpn | grep :3021
```

### Log Management

#### Log Locations
```bash
# PM2 application logs
~/.pm2/logs/fratezone-frontend-out.log    # Standard output
~/.pm2/logs/fratezone-frontend-error.log  # Error output

# System logs
/var/log/nginx/access.log      # Nginx access logs
/var/log/nginx/error.log       # Nginx error logs
/var/log/syslog                # System logs
```

#### Log Rotation Configuration
```bash
# Install PM2 log rotation
pm2 install pm2-logrotate

# Configure log rotation
pm2 set pm2-logrotate:max_size 10M
pm2 set pm2-logrotate:retain 30
pm2 set pm2-logrotate:compress true
```

#### Log Analysis
```bash
# View recent errors
tail -f ~/.pm2/logs/fratezone-frontend-error.log

# Search for specific errors
grep -i "error" ~/.pm2/logs/fratezone-frontend-out.log

# Count error occurrences
grep -c "Error" ~/.pm2/logs/fratezone-frontend-error.log

# Filter logs by date
awk '/2024-01-15/' ~/.pm2/logs/fratezone-frontend-out.log
```

## Routine Maintenance Tasks

### Daily Tasks

#### System Health Check
```bash
#!/bin/bash
# daily-health-check.sh

echo "=== Daily Health Check - $(date) ==="

# Check if application is running
if pm2 list | grep -q "online"; then
    echo "✓ Application is running"
else
    echo "✗ Application is not running"
    pm2 restart fratezone-frontend
fi

# Check disk space
DISK_USAGE=$(df / | tail -1 | awk '{print $5}' | sed 's/%//')
if [ $DISK_USAGE -gt 80 ]; then
    echo "⚠ Warning: Disk usage is ${DISK_USAGE}%"
else
    echo "✓ Disk usage is ${DISK_USAGE}%"
fi

# Check memory usage
MEMORY_USAGE=$(free | grep Mem | awk '{printf("%.2f", $3/$2 * 100.0)}')
echo "✓ Memory usage is ${MEMORY_USAGE}%"

# Check recent errors
ERROR_COUNT=$(grep -c "Error" ~/.pm2/logs/fratezone-frontend-error.log | tail -100)
echo "✓ Recent errors: $ERROR_COUNT"

echo "=== Health Check Complete ==="
```

#### Log Review
```bash
# Check for critical errors
grep -i "critical\|fatal\|emergency" ~/.pm2/logs/fratezone-frontend-error.log

# Monitor failed API calls
grep -i "api.*error\|timeout\|connection" ~/.pm2/logs/fratezone-frontend-out.log

# Check authentication failures
grep -i "unauthorized\|forbidden\|auth.*fail" ~/.pm2/logs/fratezone-frontend-out.log
```

### Weekly Tasks

#### Performance Review
```bash
#!/bin/bash
# weekly-performance-review.sh

echo "=== Weekly Performance Review - $(date) ==="

# CPU and Memory usage over past week
echo "Average system load:"
uptime

echo "Memory usage trends:"
free -h

# Log file sizes
echo "Log file sizes:"
du -h ~/.pm2/logs/

# Application response times (if monitoring tools are available)
echo "Application metrics:"
pm2 show fratezone-frontend

echo "=== Performance Review Complete ==="
```

#### Dependency Updates
```bash
# Check for outdated packages
pnpm outdated

# Update non-breaking changes
pnpm update

# Security audit
pnpm audit

# Fix security vulnerabilities
pnpm audit fix
```

#### Database Maintenance (Backend Task)
While the frontend doesn't directly manage the database, coordinate with backend team for:
- Database connection monitoring
- Query performance analysis
- Index optimization
- Connection pool management

### Monthly Tasks

#### Security Review
```bash
#!/bin/bash
# monthly-security-review.sh

echo "=== Monthly Security Review - $(date) ==="

# Check for failed login attempts
echo "Failed authentication attempts:"
grep -c "401\|403" /var/log/nginx/access.log

# Review user access logs
echo "Reviewing user access patterns..."
# Analyze access logs for unusual patterns

# SSL certificate expiration check
echo "SSL certificate status:"
openssl x509 -in /etc/ssl/certs/your-cert.pem -dates -noout

# Check for security updates
echo "System security updates:"
sudo apt list --upgradable | grep -i security

echo "=== Security Review Complete ==="
```

#### Backup Verification
```bash
#!/bin/bash
# verify-backups.sh

echo "=== Backup Verification - $(date) ==="

BACKUP_DIR="/backups/fratezone"

# Check if backups exist
if [ -d "$BACKUP_DIR" ]; then
    echo "✓ Backup directory exists"
    
    # List recent backups
    echo "Recent backups:"
    ls -lt $BACKUP_DIR | head -10
    
    # Check backup integrity
    LATEST_BACKUP=$(ls -t $BACKUP_DIR/*.tar.gz | head -1)
    if tar -tzf "$LATEST_BACKUP" > /dev/null 2>&1; then
        echo "✓ Latest backup integrity verified"
    else
        echo "✗ Latest backup is corrupted"
    fi
else
    echo "✗ Backup directory not found"
fi

echo "=== Backup Verification Complete ==="
```

## Backup and Recovery

### Backup Strategy

#### Application Files Backup
```bash
#!/bin/bash
# backup-application.sh

BACKUP_DIR="/backups/fratezone"
APP_DIR="/var/www/fratezone"
DATE=$(date +%Y%m%d_%H%M%S)

# Create backup directory
mkdir -p $BACKUP_DIR

echo "Starting application backup - $DATE"

# Backup application files
tar -czf $BACKUP_DIR/app_$DATE.tar.gz \
    --exclude=node_modules \
    --exclude=.next \
    --exclude=logs \
    -C $APP_DIR .

# Backup environment files
cp $APP_DIR/.env.production $BACKUP_DIR/env_$DATE.bak

# Backup configuration files
tar -czf $BACKUP_DIR/config_$DATE.tar.gz \
    /etc/nginx/sites-available/fratezone \
    ~/.pm2/

echo "Application backup completed: app_$DATE.tar.gz"

# Cleanup old backups (keep last 30 days)
find $BACKUP_DIR -name "app_*.tar.gz" -mtime +30 -delete
find $BACKUP_DIR -name "config_*.tar.gz" -mtime +30 -delete
find $BACKUP_DIR -name "env_*.bak" -mtime +30 -delete

echo "Backup cleanup completed"
```

#### Automated Backup Setup
```bash
# Add to crontab (crontab -e)
# Daily backup at 2 AM
0 2 * * * /path/to/backup-application.sh >> /var/log/backup.log 2>&1

# Weekly full system backup at 3 AM on Sundays
0 3 * * 0 /path/to/full-system-backup.sh >> /var/log/backup.log 2>&1
```

### Recovery Procedures

#### Application Recovery
```bash
#!/bin/bash
# restore-application.sh

BACKUP_DIR="/backups/fratezone"
APP_DIR="/var/www/fratezone"
BACKUP_FILE="$1"

if [ -z "$BACKUP_FILE" ]; then
    echo "Usage: $0 <backup_file>"
    echo "Available backups:"
    ls -lt $BACKUP_DIR/app_*.tar.gz | head -5
    exit 1
fi

echo "Starting application recovery from $BACKUP_FILE"

# Stop application
pm2 stop fratezone-frontend

# Backup current state
mv $APP_DIR ${APP_DIR}_backup_$(date +%Y%m%d_%H%M%S)

# Create new application directory
mkdir -p $APP_DIR

# Extract backup
tar -xzf $BACKUP_DIR/$BACKUP_FILE -C $APP_DIR

# Restore environment file
BACKUP_DATE=$(echo $BACKUP_FILE | grep -o '[0-9]\{8\}_[0-9]\{6\}')
cp $BACKUP_DIR/env_$BACKUP_DATE.bak $APP_DIR/.env.production

# Install dependencies
cd $APP_DIR
pnpm install

# Build application
pnpm build

# Start application
pm2 start ecosystem.config.js

echo "Application recovery completed"
```

#### Database Recovery Coordination
While frontend doesn't manage the database directly, coordinate with backend team for:
```bash
# Database backup verification
# User data recovery
# Transaction log restoration
# Data integrity checks
```

## Security Maintenance

### Security Monitoring

#### Access Log Analysis
```bash
#!/bin/bash
# analyze-access-logs.sh

LOG_FILE="/var/log/nginx/access.log"
DATE=$(date +%Y-%m-%d)

echo "=== Access Log Analysis for $DATE ==="

# Count unique IP addresses
echo "Unique visitors today:"
grep "$DATE" $LOG_FILE | awk '{print $1}' | sort | uniq -c | sort -nr | head -10

# Check for suspicious patterns
echo "Potential security threats:"
grep "$DATE" $LOG_FILE | grep -E "40[1-4]|50[0-9]" | awk '{print $1, $7, $9}' | sort | uniq -c | sort -nr

# Monitor specific endpoints
echo "API endpoint access:"
grep "$DATE" $LOG_FILE | grep "/api/" | awk '{print $7}' | sort | uniq -c | sort -nr

# Check for bot traffic
echo "Bot/crawler traffic:"
grep "$DATE" $LOG_FILE | grep -i "bot\|crawler\|spider" | wc -l

echo "=== Analysis Complete ==="
```

#### Security Headers Check
```bash
# Check security headers
curl -I https://your-domain.com

# Expected security headers:
# X-Frame-Options: SAMEORIGIN
# X-Content-Type-Options: nosniff
# X-XSS-Protection: 1; mode=block
# Strict-Transport-Security: max-age=31536000
```

### SSL Certificate Management

#### Certificate Monitoring
```bash
#!/bin/bash
# check-ssl-certificate.sh

DOMAIN="your-domain.com"

echo "=== SSL Certificate Check for $DOMAIN ==="

# Check certificate expiration
EXPIRY_DATE=$(openssl s_client -servername $DOMAIN -connect $DOMAIN:443 2>/dev/null | openssl x509 -noout -dates | grep "notAfter" | cut -d= -f2)
EXPIRY_EPOCH=$(date -d "$EXPIRY_DATE" +%s)
CURRENT_EPOCH=$(date +%s)
DAYS_UNTIL_EXPIRY=$(( ($EXPIRY_EPOCH - $CURRENT_EPOCH) / 86400 ))

echo "Certificate expires: $EXPIRY_DATE"
echo "Days until expiry: $DAYS_UNTIL_EXPIRY"

if [ $DAYS_UNTIL_EXPIRY -lt 30 ]; then
    echo "⚠ Warning: Certificate expires in less than 30 days"
elif [ $DAYS_UNTIL_EXPIRY -lt 7 ]; then
    echo "🚨 Critical: Certificate expires in less than 7 days"
else
    echo "✓ Certificate is valid"
fi

echo "=== SSL Check Complete ==="
```

#### Certificate Renewal
```bash
# Let's Encrypt renewal
sudo certbot renew --dry-run

# Manual renewal if needed
sudo certbot certonly --nginx -d your-domain.com

# Restart nginx after renewal
sudo systemctl reload nginx
```

### Security Updates

#### System Updates
```bash
#!/bin/bash
# security-updates.sh

echo "=== Security Updates - $(date) ==="

# Update package lists
sudo apt update

# List available security updates
echo "Available security updates:"
sudo apt list --upgradable | grep -i security

# Install security updates
sudo apt upgrade -y

# Check if reboot is required
if [ -f /var/run/reboot-required ]; then
    echo "⚠ System reboot required"
    cat /var/run/reboot-required.pkgs
fi

echo "=== Security Updates Complete ==="
```

#### Application Dependencies
```bash
# Check for security vulnerabilities
pnpm audit

# Fix automatically fixable vulnerabilities
pnpm audit fix

# Review and update dependencies manually
pnpm outdated
```

## Error Handling and Troubleshooting

### Common Issues and Solutions

#### Application Won't Start
**Symptoms**: PM2 shows application as stopped or errored

**Troubleshooting Steps**:
```bash
# Check PM2 status
pm2 status

# View error logs
pm2 logs fratezone-frontend --err

# Check port availability
lsof -i :3021
netstat -tulpn | grep :3021

# Restart application
pm2 restart fratezone-frontend

# If still failing, rebuild
cd /var/www/fratezone
pnpm install
pnpm build
pm2 restart fratezone-frontend
```

#### High Memory Usage
**Symptoms**: Server running out of memory, slow performance

**Troubleshooting Steps**:
```bash
# Check memory usage
free -m
ps aux --sort=-%mem | head

# Check for memory leaks
pm2 monit

# Restart application to free memory
pm2 restart fratezone-frontend

# Increase swap if needed
sudo fallocate -l 2G /swapfile
sudo chmod 600 /swapfile
sudo mkswap /swapfile
sudo swapon /swapfile
```

#### Database Connection Issues
**Symptoms**: API errors, failed sync operations

**Troubleshooting Steps**:
```bash
# Check application logs
grep -i "database\|connection" ~/.pm2/logs/fratezone-frontend-out.log

# Verify environment variables
pm2 show fratezone-frontend

# Test API connectivity
curl -H "Authorization: Bearer <token>" http://localhost:8000/api/health

# Coordinate with backend team for database issues
```

#### External API Failures
**Symptoms**: Shipment tracking not updating, sync failures

**Troubleshooting Steps**:
1. **Check Monitoring Dashboard**: Go to `/dashboard/monitoring`
2. **Review Failed Syncs**: Check error messages and patterns
3. **Verify API Credentials**: Ensure external API keys are valid
4. **Check Rate Limits**: Verify not exceeding API rate limits
5. **Manual Retry**: Use retry functionality for failed syncs

### Emergency Procedures

#### Complete System Failure
```bash
#!/bin/bash
# emergency-recovery.sh

echo "=== Emergency Recovery Procedure ==="

# Stop all services
pm2 stop all
sudo systemctl stop nginx

# Check system resources
df -h
free -m
ps aux --sort=-%cpu | head -10

# Restart core services
sudo systemctl start nginx
pm2 start fratezone-frontend

# Verify services are running
pm2 status
sudo systemctl status nginx

# Check application health
curl -I http://localhost:3021

echo "=== Emergency Recovery Complete ==="
```

#### Data Corruption Recovery
```bash
#!/bin/bash
# data-recovery.sh

echo "=== Data Recovery Procedure ==="

# Stop application
pm2 stop fratezone-frontend

# Restore from latest backup
LATEST_BACKUP=$(ls -t /backups/fratezone/app_*.tar.gz | head -1)
echo "Restoring from: $LATEST_BACKUP"

# Execute recovery procedure
./restore-application.sh $(basename $LATEST_BACKUP)

# Verify recovery
curl http://localhost:3021/api/health

echo "=== Data Recovery Complete ==="
```

## Performance Optimization

### Application Performance

#### Bundle Size Optimization
```bash
# Analyze bundle size
ANALYZE=true pnpm build

# Check for large dependencies
du -sh node_modules/* | sort -hr | head -20

# Remove unused dependencies
pnpm prune
```

#### Memory Optimization
```bash
# Configure Node.js memory limits
NODE_OPTIONS="--max-old-space-size=2048" pm2 restart fratezone-frontend

# Monitor memory usage
pm2 monit
```

### Server Performance

#### Nginx Optimization
```nginx
# /etc/nginx/sites-available/fratezone
server {
    listen 80;
    server_name your-domain.com;

    # Enable gzip compression
    gzip on;
    gzip_comp_level 6;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript;

    # Static file caching
    location /_next/static/ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # Proxy configuration
    location / {
        proxy_pass http://localhost:3021;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        
        # Increase timeouts
        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;
    }
}
```

#### System Optimization
```bash
# Increase file descriptor limits
echo "fs.file-max = 65536" >> /etc/sysctl.conf

# Optimize network settings
echo "net.core.somaxconn = 1024" >> /etc/sysctl.conf
echo "net.ipv4.tcp_max_syn_backlog = 1024" >> /etc/sysctl.conf

# Apply changes
sudo sysctl -p
```

## Documentation Maintenance

### Keeping Documentation Updated

#### Regular Review Schedule
- **Monthly**: Review and update technical documentation
- **Quarterly**: Update user manuals and guides
- **After Major Updates**: Update all relevant documentation
- **Annual**: Comprehensive documentation audit

#### Documentation Checklist
- [ ] Update version numbers and release notes
- [ ] Verify all URLs and links are working
- [ ] Update screenshots and UI references
- [ ] Review and update API documentation
- [ ] Update deployment procedures
- [ ] Verify troubleshooting guides
- [ ] Update security procedures

### Change Management

#### Version Control
```bash
# Document changes in git
git add guide/
git commit -m "docs: update maintenance procedures for v2.1.0"
git push origin main
```

#### Change Log Maintenance
Keep a detailed change log of:
- Configuration changes
- Security updates
- Performance optimizations
- Bug fixes and patches
- Feature additions or removals

## Contact and Escalation

### Support Contacts

#### Internal Team
- **Development Team**: dev-team@yourcompany.com
- **DevOps Team**: devops@yourcompany.com
- **Security Team**: security@yourcompany.com

#### External Vendors
- **Hosting Provider**: support@hosting-provider.com
- **SSL Certificate Provider**: support@ssl-provider.com
- **Monitoring Service**: support@monitoring-service.com

### Escalation Procedures

#### Severity Levels

**Critical (P1)**: System completely down
- **Response Time**: 15 minutes
- **Escalation**: Immediate notification to all teams
- **Actions**: Emergency response procedure

**High (P2)**: Major functionality impaired
- **Response Time**: 1 hour
- **Escalation**: Notification to development and ops teams
- **Actions**: High priority investigation

**Medium (P3)**: Minor functionality issues
- **Response Time**: 4 hours
- **Escalation**: Standard team notification
- **Actions**: Normal priority investigation

**Low (P4)**: Minor issues or improvements
- **Response Time**: 24 hours
- **Escalation**: Assignment to appropriate team
- **Actions**: Standard development process

This comprehensive maintenance guide provides all the necessary procedures and tools for keeping the FrateZone application running smoothly in production.