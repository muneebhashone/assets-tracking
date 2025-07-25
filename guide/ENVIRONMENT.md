# FrateZone - Environment Configuration Guide

## Overview

This guide provides comprehensive information about environment configuration for the FrateZone application across development, staging, and production environments. It covers environment variables, configuration files, and best practices for secure configuration management.

## Environment Variables

### Required Environment Variables

#### API Configuration
```env
# Backend API Base URL
NEXT_PUBLIC_API_URL=https://api.yourcompany.com
# Description: Base URL for the backend API service
# Example: https://api.fratezone.com
# Note: Must include protocol (https://) and exclude trailing slash
```

#### Google Maps Integration
```env
# Google Maps API Key
NEXT_PUBLIC_GOOGLE_MAP_API_KEY=AIzaSyBvOkBwgyKQJ1X2IT4CphE6kOTInqKQ4vM
# Description: Google Maps JavaScript API key for location services
# Required Scopes: Maps JavaScript API, Places API, Geocoding API
# Restrictions: Configure domain restrictions for security
```

#### AWS S3 Configuration
```env
# S3 Bucket URL
S3_BUCKET_URL=https://fratezone-storage.s3.us-east-2.amazonaws.com
# Description: AWS S3 bucket URL for file storage and retrieval
# Format: https://bucket-name.s3.region.amazonaws.com
# Note: Used for file uploads, downloads, and Next.js rewrites
```

### Optional Environment Variables

#### Development Configuration
```env
# Node Environment
NODE_ENV=development
# Values: development, production, test
# Default: development

# Development Port
PORT=3000
# Description: Port for development server
# Default: 3000

# Debug Mode
DEBUG=true
# Description: Enable debug logging and development features
# Values: true, false
# Default: false
```

#### Production Configuration
```env
# Node Environment
NODE_ENV=production
# Required for production builds and optimizations

# Application Port
PORT=3021
# Description: Port for production server
# Default: 3000
# Note: ecosystem.config.js uses port 3021
```

#### Analytics and Monitoring
```env
# Analytics Tracking ID (Optional)
NEXT_PUBLIC_GA_TRACKING_ID=G-XXXXXXXXXX
# Description: Google Analytics 4 tracking ID
# Format: G-XXXXXXXXXX

# Sentry DSN (Optional)
NEXT_PUBLIC_SENTRY_DSN=https://xxx@sentry.io/xxx
# Description: Sentry error tracking DSN
# Note: Include if error tracking is enabled
```

### Environment-Specific Configuration

#### Development Environment (.env.local)
```env
# Development API - Local backend
NEXT_PUBLIC_API_URL=http://localhost:8000

# Development Google Maps API Key
NEXT_PUBLIC_GOOGLE_MAP_API_KEY=your_development_api_key

# Development S3 Bucket
S3_BUCKET_URL=https://dev-bucket.s3.region.amazonaws.com

# Development specific settings
NODE_ENV=development
DEBUG=true
NEXT_PUBLIC_ENV=development
```

#### Staging Environment (.env.staging)
```env
# Staging API
NEXT_PUBLIC_API_URL=https://api-staging.yourcompany.com

# Staging Google Maps API Key (same as production or separate)
NEXT_PUBLIC_GOOGLE_MAP_API_KEY=your_staging_api_key

# Staging S3 Bucket
S3_BUCKET_URL=https://staging-bucket.s3.region.amazonaws.com

# Staging specific settings
NODE_ENV=production
NEXT_PUBLIC_ENV=staging
```

#### Production Environment (.env.production)
```env
# Production API
NEXT_PUBLIC_API_URL=https://api.yourcompany.com

# Production Google Maps API Key
NEXT_PUBLIC_GOOGLE_MAP_API_KEY=your_production_api_key

# Production S3 Bucket
S3_BUCKET_URL=https://production-bucket.s3.region.amazonaws.com

# Production specific settings
NODE_ENV=production
NEXT_PUBLIC_ENV=production
```

## Configuration Files

### Next.js Configuration (next.config.js)

**File Location**: `next.config.js`

```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  // React Strict Mode - Disabled for compatibility
  reactStrictMode: false,
  
  // Build Configuration
  typescript: {
    // Ignore TypeScript errors during build for faster deployment
    ignoreBuildErrors: true,
  },
  eslint: {
    // Ignore ESLint errors during build
    ignoreDuringBuilds: true,
  },
  
  // Image Optimization
  images: {
    remotePatterns: [
      {
        // Allow S3 bucket images
        hostname: "fratezone.s3.us-east-2.amazonaws.com",
      },
      {
        // Add additional domains as needed
        hostname: "your-domain.s3.amazonaws.com",
      },
    ],
  },
  
  // URL Rewrites for S3 Proxy
  async rewrites() {
    return [
      {
        // Proxy /bucket/* requests to S3
        source: "/bucket/:path*",
        destination: `${process.env.S3_BUCKET_URL}/:path*`,
      },
    ];
  },
  
  // Environment Variables (server-side only)
  env: {
    CUSTOM_KEY: process.env.CUSTOM_KEY,
  },
  
  // Experimental Features
  experimental: {
    // Enable if using Server Components features
    // serverComponentsExternalPackages: ['package-name'],
  },
};

module.exports = nextConfig;
```

### PM2 Configuration (ecosystem.config.js)

**File Location**: `ecosystem.config.js`

```javascript
module.exports = {
  apps: [
    {
      // Application name
      name: "fratezone-frontend",
      
      // Execution command
      script: "node",
      args: "node_modules/next/dist/bin/next start -p 3021",
      
      // Working directory
      cwd: "/var/www/fratezone",
      
      // Instance configuration
      instances: 1,  // Single instance or 'max' for cluster mode
      exec_mode: "fork",  // 'fork' or 'cluster'
      
      // Resource limits
      max_memory_restart: "1G",
      
      // Process management
      watch: false,
      ignore_watch: ["node_modules", ".next", "logs"],
      
      // Environment variables
      env: {
        NODE_ENV: "production",
        PORT: 3021,
      },
      
      // Staging environment
      env_staging: {
        NODE_ENV: "production",
        PORT: 3022,
        NEXT_PUBLIC_ENV: "staging",
      },
      
      // Production environment
      env_production: {
        NODE_ENV: "production",
        PORT: 3021,
        NEXT_PUBLIC_ENV: "production",
      },
      
      // Logging
      log_file: "./logs/combined.log",
      out_file: "./logs/out.log",
      error_file: "./logs/error.log",
      log_date_format: "YYYY-MM-DD HH:mm Z",
      
      // Advanced options
      merge_logs: true,
      time: true,
    },
  ],
  
  // Deployment configuration (optional)
  deploy: {
    production: {
      user: "deploy",
      host: "your-server.com",
      ref: "origin/main",
      repo: "git@github.com:yourcompany/fratezone.git",
      path: "/var/www/fratezone",
      "post-deploy": "pnpm install && pnpm build && pm2 reload ecosystem.config.js --env production",
    },
  },
};
```

### Package.json Configuration

**Relevant Configuration Sections**:

```json
{
  "engines": {
    "node": "20.12.*"
  },
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "prettier": "prettier . --write"
  }
}
```

### Biome Configuration (biome.json)

**File Location**: `biome.json`

```json
{
  "$schema": "https://biomejs.dev/schemas/1.4.1/schema.json",
  "organizeImports": {
    "enabled": true
  },
  "linter": {
    "enabled": true,
    "rules": {
      "recommended": true
    }
  },
  "formatter": {
    "enabled": true,
    "indentStyle": "tab",
    "indentWidth": 2,
    "lineWidth": 100
  },
  "javascript": {
    "formatter": {
      "quoteStyle": "double",
      "trailingComma": "es5"
    }
  }
}
```

### Tailwind CSS Configuration (tailwind.config.ts)

**Key Configuration Elements**:
```typescript
import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Poppins", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
  
  // Safelist for dynamic classes (important for status colors)
  safelist: [
    "text-green-600",
    "text-blue-600", 
    "text-yellow-600",
    "text-red-600",
    "bg-green-600",
    "bg-blue-600",
    "bg-yellow-600",
    "bg-red-600",
    // Add other dynamic classes as needed
  ],
};

export default config;
```

## Environment Setup Instructions

### Development Environment Setup

#### Prerequisites
```bash
# Install Node.js (version 20.12.*)
# Download from https://nodejs.org or use version manager

# Install pnpm globally
npm install -g pnpm

# Verify installations
node --version  # Should be 20.12.*
pnpm --version
```

#### Setup Steps
```bash
# 1. Clone the repository
git clone https://github.com/yourcompany/fratezone.git
cd fratezone

# 2. Install dependencies
pnpm install

# 3. Copy environment template
cp .env.example .env.local

# 4. Configure environment variables
nano .env.local
# Add your specific values for:
# - NEXT_PUBLIC_API_URL
# - NEXT_PUBLIC_GOOGLE_MAP_API_KEY
# - S3_BUCKET_URL

# 5. Start development server
pnpm dev

# 6. Verify setup
curl http://localhost:3000
```

### Staging Environment Setup

#### Server Preparation
```bash
# 1. Update system
sudo apt update && sudo apt upgrade -y

# 2. Install Node.js
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs

# 3. Install pnpm
npm install -g pnpm

# 4. Install PM2
npm install -g pm2
```

#### Application Deployment
```bash
# 1. Clone repository
git clone https://github.com/yourcompany/fratezone.git /var/www/fratezone
cd /var/www/fratezone

# 2. Create staging environment file
cat > .env.staging << EOF
NEXT_PUBLIC_API_URL=https://api-staging.yourcompany.com
NEXT_PUBLIC_GOOGLE_MAP_API_KEY=your_staging_api_key
S3_BUCKET_URL=https://staging-bucket.s3.region.amazonaws.com
NODE_ENV=production
NEXT_PUBLIC_ENV=staging
EOF

# 3. Install dependencies and build
pnpm install
pnpm build

# 4. Start with PM2
pm2 start ecosystem.config.js --env staging

# 5. Save PM2 configuration
pm2 save
pm2 startup
```

### Production Environment Setup

#### Security Considerations
```bash
# 1. Create dedicated user
sudo adduser --system --group fratezone
sudo usermod -aG sudo fratezone

# 2. Set up directory permissions
sudo mkdir -p /var/www/fratezone
sudo chown -R fratezone:fratezone /var/www/fratezone

# 3. Configure firewall
sudo ufw allow 22    # SSH
sudo ufw allow 80    # HTTP
sudo ufw allow 443   # HTTPS
sudo ufw enable
```

#### Application Deployment
```bash
# 1. Switch to application user
sudo su - fratezone

# 2. Clone repository
git clone https://github.com/yourcompany/fratezone.git /var/www/fratezone
cd /var/www/fratezone

# 3. Create production environment file
cat > .env.production << EOF
NEXT_PUBLIC_API_URL=https://api.yourcompany.com
NEXT_PUBLIC_GOOGLE_MAP_API_KEY=your_production_api_key
S3_BUCKET_URL=https://production-bucket.s3.region.amazonaws.com
NODE_ENV=production
NEXT_PUBLIC_ENV=production
EOF

# 4. Install dependencies and build
pnpm install --frozen-lockfile
pnpm build

# 5. Start with PM2
pm2 start ecosystem.config.js --env production

# 6. Configure PM2 for startup
pm2 save
pm2 startup
```

## Security Best Practices

### Environment Variable Security

#### Sensitive Data Management
```bash
# Never commit sensitive environment files
echo ".env.local" >> .gitignore
echo ".env.production" >> .gitignore
echo ".env.staging" >> .gitignore

# Use restrictive file permissions
chmod 600 .env.production
chmod 600 .env.staging
```

#### API Key Security
```bash
# Rotate API keys regularly
# Use separate keys for different environments
# Restrict API keys by domain/IP when possible
# Monitor API key usage for anomalies
```

### Configuration File Security

#### File Permissions
```bash
# Set appropriate permissions
chmod 644 next.config.js
chmod 644 ecosystem.config.js
chmod 644 package.json

# Protect sensitive configuration
chmod 600 .env.production
chown root:root .env.production  # For system-level deployment
```

#### Access Control
```bash
# Limit access to configuration files
sudo chattr +i /var/www/fratezone/.env.production  # Make immutable
```

## Environment Validation

### Configuration Validation Script

```bash
#!/bin/bash
# validate-environment.sh

echo "=== Environment Configuration Validation ==="

# Check Node.js version
NODE_VERSION=$(node --version)
EXPECTED_VERSION="v20.12"

if [[ $NODE_VERSION == $EXPECTED_VERSION* ]]; then
    echo "✓ Node.js version: $NODE_VERSION"
else
    echo "✗ Node.js version mismatch. Expected: $EXPECTED_VERSION, Got: $NODE_VERSION"
fi

# Check pnpm installation
if command -v pnpm &> /dev/null; then
    echo "✓ pnpm is installed: $(pnpm --version)"
else
    echo "✗ pnpm is not installed"
fi

# Check environment file
if [ -f .env.local ] || [ -f .env.production ]; then
    echo "✓ Environment file exists"
else
    echo "✗ Environment file not found"
fi

# Check required environment variables
ENV_FILE=""
if [ -f .env.production ]; then
    ENV_FILE=".env.production"
elif [ -f .env.local ]; then
    ENV_FILE=".env.local"
fi

if [ -n "$ENV_FILE" ]; then
    # Check for required variables
    REQUIRED_VARS=("NEXT_PUBLIC_API_URL" "NEXT_PUBLIC_GOOGLE_MAP_API_KEY" "S3_BUCKET_URL")
    
    for var in "${REQUIRED_VARS[@]}"; do
        if grep -q "^${var}=" "$ENV_FILE"; then
            echo "✓ $var is configured"
        else
            echo "✗ $var is missing"
        fi
    done
fi

# Check build directory
if [ -d ".next" ]; then
    echo "✓ Application is built"
else
    echo "⚠ Application not built (run 'pnpm build')"
fi

echo "=== Validation Complete ==="
```

### Runtime Configuration Check

```javascript
// utils/config-validation.js
export function validateConfiguration() {
  const requiredEnvVars = [
    'NEXT_PUBLIC_API_URL',
    'NEXT_PUBLIC_GOOGLE_MAP_API_KEY',
    'S3_BUCKET_URL',
  ];

  const missingVars = requiredEnvVars.filter(
    (varName) => !process.env[varName]
  );

  if (missingVars.length > 0) {
    console.error('Missing required environment variables:', missingVars);
    throw new Error(`Missing environment variables: ${missingVars.join(', ')}`);
  }

  // Validate URL formats
  try {
    new URL(process.env.NEXT_PUBLIC_API_URL);
    new URL(process.env.S3_BUCKET_URL);
  } catch (error) {
    console.error('Invalid URL format in environment variables');
    throw error;
  }

  console.log('✓ All environment variables are valid');
}
```

## Environment Migration

### Migrating Between Environments

#### Development to Staging
```bash
#!/bin/bash
# migrate-to-staging.sh

echo "Migrating configuration from development to staging..."

# Copy and modify environment file
cp .env.local .env.staging

# Update API URL
sed -i 's|localhost:8000|api-staging.yourcompany.com|g' .env.staging
sed -i 's|http:|https:|g' .env.staging

# Update S3 bucket
sed -i 's|dev-bucket|staging-bucket|g' .env.staging

# Add staging-specific variables
echo "NEXT_PUBLIC_ENV=staging" >> .env.staging

echo "Staging configuration created in .env.staging"
```

#### Staging to Production
```bash
#!/bin/bash
# migrate-to-production.sh

echo "Migrating configuration from staging to production..."

# Copy and modify environment file
cp .env.staging .env.production

# Update API URL
sed -i 's|api-staging|api|g' .env.production

# Update S3 bucket
sed -i 's|staging-bucket|production-bucket|g' .env.production

# Update environment identifier
sed -i 's|staging|production|g' .env.production

echo "Production configuration created in .env.production"
echo "⚠ Remember to update API keys and sensitive values manually"
```

## Troubleshooting Configuration Issues

### Common Configuration Problems

#### Missing Environment Variables
```bash
# Symptom: Application fails to start or API calls fail
# Solution: Verify all required environment variables are set

# Check current environment variables
printenv | grep NEXT_PUBLIC

# Verify environment file is loaded
node -e "console.log(process.env.NEXT_PUBLIC_API_URL)"
```

#### Incorrect API URLs
```bash
# Symptom: Network errors, CORS issues, or 404 responses
# Solution: Verify API URL format and accessibility

# Test API connectivity
curl -I $NEXT_PUBLIC_API_URL/health

# Check for trailing slashes
echo $NEXT_PUBLIC_API_URL  # Should not end with /
```

#### Build Configuration Issues
```bash
# Symptom: Build failures or runtime errors
# Solution: Check Next.js configuration

# Validate next.config.js syntax
node -c next.config.js

# Test build process
pnpm build --debug
```

#### PM2 Configuration Problems
```bash
# Symptom: Application won't start with PM2
# Solution: Verify ecosystem.config.js

# Validate ecosystem configuration
node -c ecosystem.config.js

# Test PM2 startup
pm2 start ecosystem.config.js --dry-run
```

### Debugging Configuration
```bash
# Enable debug mode
DEBUG=* pnpm dev

# Check environment variable loading
node -e "console.log('API URL:', process.env.NEXT_PUBLIC_API_URL)"

# Verify Next.js configuration
pnpm next info

# Check PM2 environment
pm2 show fratezone-frontend
```

This comprehensive environment configuration guide provides all the necessary information for properly configuring the FrateZone application across different environments while maintaining security and best practices.