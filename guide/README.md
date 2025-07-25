# FrateZone - Logistics Tracking Application

## Project Overview

FrateZone is a comprehensive Next.js 14 logistics and shipment tracking application designed for maritime container management. The platform provides real-time tracking, monitoring, and management capabilities for shipping companies, freight forwarders, and their clients.

### Key Features

- **Real-time Shipment Tracking**: Track containers and shipments across multiple carriers
- **Role-based Dashboard System**: Different interfaces for admins, sub-admins, and client users
- **Live Location Tracking**: Google Maps integration for vessel and container positions
- **Monitoring System**: Advanced sync health monitoring with failure management
- **Multi-tenant Architecture**: Support for white-label partners and client companies
- **Comprehensive Reporting**: Analytics and insights for logistics operations

## Quick Start Guide

### Prerequisites

- Node.js 20.12.* (as specified in package.json engines)
- pnpm package manager
- PostgreSQL database
- AWS S3 bucket for file storage
- Google Maps API key
- SeaRates API access

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd assets-tracking
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   ```

3. **Environment Setup**
   Create a `.env.local` file in the root directory with the following variables:
   ```env
   # API Configuration
   NEXT_PUBLIC_API_URL=your_backend_api_url
   
   # Google Maps
   NEXT_PUBLIC_GOOGLE_MAP_API_KEY=your_google_maps_api_key
   
   # S3 Configuration
   S3_BUCKET_URL=your_s3_bucket_url
   
   # Database and other backend configurations are handled by your API server
   ```

4. **Start Development Server**
   ```bash
   pnpm dev
   ```
   The application will be available at `http://localhost:3000`

### Production Deployment

1. **Build the application**
   ```bash
   pnpm build
   ```

2. **Start production server**
   ```bash
   pnpm start
   ```

3. **Using PM2 (Recommended)**
   ```bash
   pm2 start ecosystem.config.js
   ```

## Technology Stack

### Frontend Framework
- **Next.js 14**: React framework with App Router
- **TypeScript**: Type-safe JavaScript
- **Tailwind CSS**: Utility-first CSS framework
- **shadcn/ui**: Modern React component library built on Radix UI

### State Management & Data Fetching
- **@tanstack/react-query**: Server state management with caching
- **React Hook Form**: Form state management with validation
- **Zod**: Schema validation for forms and APIs

### UI Components & Visualization
- **@radix-ui**: Primitive UI components
- **@tanstack/react-table**: Advanced data tables
- **@nivo/bar & @nivo/line**: Data visualization charts
- **Recharts**: Additional charting library

### Development Tools
- **Biome**: Fast formatter and linter (replacing ESLint/Prettier)
- **TypeScript**: Static type checking
- **Tailwind CSS**: Styling with safelist configuration

### Integrations
- **Google Maps API**: Location tracking and mapping
- **SeaRates API**: Shipment tracking data provider
- **AWS S3**: File storage and management
- **React Dropzone**: File upload handling

## Project Structure

```
assets-tracking/
├── app/                          # Next.js 14 App Router pages
│   ├── (auth)/                   # Authentication pages
│   ├── (dashboard)/              # Protected dashboard pages
│   └── globals.css               # Global styles
├── components/                   # Reusable UI components
│   ├── ui/                       # shadcn/ui components
│   ├── forms/                    # Form components
│   ├── tables/                   # Table components
│   ├── page-client/              # Page-specific client components
│   └── layout/                   # Layout components
├── services/                     # API service layer
│   └── admin/                    # Admin-specific services
├── types/                        # TypeScript type definitions
├── utils/                        # Utility functions
├── constants/                    # Application constants
├── hooks/                        # Custom React hooks
├── lib/                          # Library configurations
├── public/                       # Static assets
└── guide/                        # Documentation (this folder)
```

## Key Architecture Patterns

### Route Organization
- `(auth)` - Authentication pages (signin, signup, password reset)
- `(dashboard)` - Protected dashboard pages with role-based access
- Public pages - Support requests, shipment viewing, live location

### Authentication System
- **Token-based Authentication**: JWT tokens stored in cookies
- **Middleware Protection**: All `/dashboard/*` routes are protected
- **Role-based Access Control**: Different permissions for different user types
- **Auth Services**: Located in `services/auth.services.ts`

### Component Architecture
- **Page Components**: Client-side logic in `components/page-client/`
- **Reusable UI**: shadcn/ui patterns in `components/ui/`
- **Form Components**: Centralized in `components/forms/`
- **Table Components**: Advanced tables in `components/tables/`
- **Permission Wrapper**: Role-based component rendering

## Development Commands

```bash
# Development
pnpm dev              # Start development server

# Building
pnpm build           # Build for production
pnpm start           # Start production server

# Code Quality
pnpm lint            # Run Next.js linting
pnpm prettier        # Format code with Prettier

# Note: Biome is configured but commands may vary
```

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `NEXT_PUBLIC_API_URL` | Backend API base URL | Yes |
| `NEXT_PUBLIC_GOOGLE_MAP_API_KEY` | Google Maps API key for location features | Yes |
| `S3_BUCKET_URL` | AWS S3 bucket URL for file storage | Yes |

## User Roles & Permissions

### Super Admin
- Full system access
- Monitor system health and performance  
- Manage all users, companies, and shipments
- Access to monitoring dashboard and sync management

### Sub Admin  
- Manage users within assigned scope
- View and manage shipments
- Limited administrative functions

### White Label Admin
- Manage their white-label instance
- Create and manage sub-users
- Company-specific dashboard

### Client Super User
- Manage users within their company
- Full access to company shipments
- Company administration

### Client User
- Track and view assigned shipments
- Basic dashboard functionality
- Limited to company-specific data

## Core Features

### Dashboard System
- **Admin Dashboard**: System-wide metrics, user management, monitoring
- **User Dashboard**: Personal shipment tracking, company-specific data
- **Role-based Navigation**: Dynamic menu based on user permissions

### Shipment Management  
- **Create Shipments**: Support for container and Bill of Lading tracking
- **Bulk Upload**: Excel/CSV file processing for multiple shipments
- **Live Tracking**: Real-time location updates via SeaRates API
- **Status Management**: Track shipment lifecycle from planning to delivery

### User Management
- **Multi-level Hierarchy**: Support for complex organizational structures
- **Permission System**: Granular access control
- **Company Management**: Multi-tenant support with isolation

### Monitoring System
- **Sync Health Monitoring**: Track API synchronization status
- **Failed Sync Management**: Identify and retry failed operations
- **Performance Analytics**: Response times and success rates
- **Circuit Breaker**: Automatic protection against API failures

## Getting Help

- **Architecture Details**: See `guide/ARCHITECTURE.md`
- **Development Guidelines**: See `guide/DEVELOPMENT.md`
- **Feature Documentation**: See `guide/FEATURES.md`
- **API Documentation**: See `guide/API.md`
- **Deployment Guide**: See `guide/DEPLOYMENT.md`
- **User Manual**: See `guide/USER_MANUAL.md`

## Support & Maintenance

For ongoing support and maintenance, refer to:
- `guide/MAINTENANCE.md` - Maintenance procedures and best practices
- `guide/ENVIRONMENT.md` - Environment configuration details
- `guide/SERVICES.md` - Service layer and database documentation

## License

This project is proprietary software. All rights reserved.

---

**Note**: This application is designed for maritime logistics operations and requires proper API credentials and database setup for full functionality. Contact the development team for production deployment guidance.