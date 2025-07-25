# FrateZone - Feature Documentation

## Overview

FrateZone provides comprehensive logistics and shipment tracking capabilities through a role-based dashboard system. Each user role has access to specific features based on their permissions and organizational hierarchy.

## Role-Based Feature Access

### User Role Hierarchy
```
Super Admin
├── Sub Admin
├── White Label Admin
│   └── White Label Sub Admin
└── Client Super User
    └── Client User
```

### Permission System
**Reference**: `utils/constants.ts:62-78`

- `VIEW_SHIPMENT` - View shipment information
- `CREATE_SHIPMENT` - Create new shipments
- `EDIT_SHIPMENT` - Edit existing shipments
- `DELETE_SHIPMENT` - Delete shipments
- `VIEW_USER` - View user information
- `CREATE_USER` - Create new users
- `EDIT_USER` - Edit existing users
- `DELETE_USER` - Delete users
- `VIEW_DASHBOARD` - Access dashboard features
- `VIEW_COMPANY` - View company information
- `CREATE_COMPANY` - Create new companies
- `DELETE_COMPANY` - Delete companies
- `EDIT_COMPANY` - Edit company information
- `VIEW_PERMISSIONS` - View permission settings
- `UPDATE_PERMISSIONS` - Update user permissions

## Navigation Structure

### Admin Navigation
**Reference**: `constants/data.ts:3-69`

Available to Super Admin and Sub Admin roles:

1. **Dashboard** (`/dashboard`) - System overview and analytics
2. **Shipment List** (`/dashboard/shipment-list`) - All shipments management
3. **Active Users** (`/dashboard/users`) - User management
4. **Requested Users** (`/dashboard/requested-users`) - User approval queue
5. **Company** (`/dashboard/company`) - Company management
6. **Assigns** (`/dashboard/assigns`) - Credit assignments (Super Admin only)
7. **Support** (`/dashboard/support`) - Support ticket management (Super Admin only)
8. **Changelogs** (`/dashboard/changelogs`) - System changelog
9. **Monitoring** (`/dashboard/monitoring`) - System monitoring (Super Admin only)

### User Navigation
**Reference**: `constants/data.ts:71-96`

Available to Client Users and Client Super Users:

1. **Dashboard** (`/dashboard`) - Personal dashboard
2. **Shipment List** (`/dashboard/shipment-list`) - Company shipments
3. **Track New Shipment** (`/dashboard/shipment`) - Create new tracking
4. **Changelogs** (`/dashboard/changelogs`) - System updates

## Core Features

### 1. Dashboard System

#### Admin Dashboard
**Component**: `components/dashboard/admin-dashboard.tsx`
**Page**: `components/page-client/DashboardPage.tsx`

**Features:**
- System-wide statistics and KPIs
- User activity metrics
- Shipment status distribution
- Company performance analytics
- Recent activity feeds
- Quick action buttons

**Key Metrics:**
- Total users across all roles
- Active shipments by status
- Company-wise shipment distribution
- Monthly tracking trends
- System health indicators

#### User Dashboard
**Component**: `components/dashboard/user-dashboard.tsx`

**Features:**
- Personal shipment overview
- Company-specific statistics
- Recent shipment activities
- Status-wise shipment breakdown
- Quick access to frequently used features

**Key Metrics:**
- Personal shipment count
- Company shipment statistics
- Status distribution charts
- Recent tracking updates

### 2. Shipment Management System

#### Shipment Creation
**Component**: `components/forms/shipment-creation-form.tsx`
**Page**: `components/page-client/CreateShipmentPage.tsx`

**Features:**
- **Tracking Methods:**
  - Container Number tracking
  - Master Bill of Lading (MBL) tracking
- **Carrier Selection:**
  - Dynamic carrier dropdown
  - Carrier-specific validation
- **Route Information:**
  - Origin and destination ports
  - Estimated dates
  - Vessel information
- **Additional Details:**
  - Customer information
  - Reference numbers
  - Special instructions

**Validation:**
- Container number format validation
- Carrier-specific format checks
- Required field validation
- Date consistency checks

#### Bulk Shipment Upload
**Component**: `components/forms/bulk-shipment-upload.tsx`

**Features:**
- **File Upload:**
  - Excel (.xlsx, .xls) support
  - CSV file support
  - Drag-and-drop interface
  - File validation

- **Data Processing:**
  - Column mapping
  - Data validation
  - Error reporting
  - Progress tracking

- **Batch Operations:**
  - Multiple shipment creation
  - Error handling and rollback
  - Success/failure reporting

#### Shipment Detail View
**Component**: `components/page-client/ShipmentDetailPage.tsx`

**Features:**
- **Shipment Information:**
  - Basic shipment details
  - Tracking number and carrier
  - Current status and location
  - Estimated/actual dates

- **Container Information:**
  - Container numbers and types
  - Loading and discharge dates
  - Gate in/out information
  - Empty return details

- **Movement History:**
  - Port-to-port movement tracking
  - Vessel information
  - Event timestamps
  - Location details

- **Live Location:**
  - Google Maps integration
  - Real-time vessel position
  - Route visualization
  - ETA calculations

#### Shipment List Management
**Component**: `components/tables/shipment-table/shipment-table.tsx`
**Page**: `components/page-client/ShipmentPage.tsx`

**Features:**
- **Advanced Filtering:**
  - Status-based filtering
  - Date range filtering
  - Carrier filtering
  - Company filtering (admin only)
  - Custom search

- **Sorting and Pagination:**
  - Multi-column sorting
  - Configurable page sizes
  - Jump to page functionality

- **Bulk Operations:**
  - Multi-select functionality
  - Batch status updates
  - Bulk export options

- **Status Management:**
  - Visual status indicators
  - Status color coding
  - Progress tracking

### 3. User Management System

#### User Creation and Management
**Component**: `components/forms/admin-create-user-form.tsx`
**Page**: `components/page-client/UsersPage.tsx`

**Features:**
- **User Creation:**
  - Role-based user creation
  - Permission assignment
  - Company association
  - Email verification

- **User Hierarchy:**
  - Parent-child relationships
  - Role-based access control
  - Company boundaries
  - Permission inheritance

- **User Status Management:**
  - Active/inactive status
  - Account approval workflow
  - Access revocation

#### User Detail Management
**Component**: `components/page-client/UserDetailPage.tsx`

**Features:**
- **Profile Management:**
  - Personal information editing
  - Contact details
  - Profile picture upload
  - Password management

- **Permission Management:**
  - Role assignment
  - Custom permission sets
  - Access level configuration
  - Company-specific permissions

- **Activity Tracking:**
  - Login history
  - Action logs
  - Usage statistics

#### Requested Users Management
**Component**: `components/page-client/RequestedUserPage.tsx`

**Features:**
- **Approval Workflow:**
  - Pending user requests
  - Approval/rejection process
  - Email notifications
  - Role assignment

- **Bulk Operations:**
  - Multi-user approval
  - Batch rejection
  - Role assignment in bulk

### 4. Company Management System

#### Company Administration
**Component**: `components/page-client/CompanyPage.tsx`
**Forms**: `components/forms/admin-company-form.tsx`

**Features:**
- **Company Creation:**
  - Basic company information
  - Contact details
  - Address information
  - Logo upload

- **Company Settings:**
  - Branding customization
  - Feature access controls
  - User limits
  - API access configuration

- **Company Hierarchy:**
  - Parent-child relationships
  - White-label configurations
  - Multi-tenant isolation

### 5. Credit Assignment System

#### Credit Management
**Component**: `components/page-client/AssignsPage.tsx`
**Form**: `components/forms/create-assign-form.tsx`

**Features (Super Admin Only):**
- **Credit Allocation:**
  - Assign tracking credits
  - Credit deduction
  - Balance management
  - Usage tracking

- **Company Limits:**
  - Set company limits
  - Monitor usage
  - Automatic restrictions
  - Overage notifications

### 6. Support Ticket System

#### Support Management
**Component**: `components/page-client/SupportPage.tsx`
**Detail**: `components/page-client/SupportDetailPage.tsx`

**Features:**
- **Ticket Creation:**
  - Multiple priority levels
  - Category classification
  - File attachments
  - Auto-assignment

- **Ticket Management:**
  - Status tracking
  - Response management
  - Escalation workflows
  - SLA monitoring

- **Communication:**
  - Internal notes
  - Customer responses
  - Email notifications
  - Response templates

### 7. Monitoring System

#### System Health Monitoring
**Component**: `components/page-client/MonitoringDashboardPage.tsx`

**Features (Super Admin Only):**
- **Health Overview:**
  - System status indicators
  - API response times
  - Success/failure rates
  - Circuit breaker status

- **Performance Metrics:**
  - Daily sync trends
  - Error rate analytics
  - Response time charts
  - Failure reason analysis

#### Failed Sync Management
**Component**: `components/page-client/FailedSyncsPage.tsx`

**Features:**
- **Failure Analysis:**
  - Failed sync identification
  - Error categorization
  - Failure count tracking
  - Time-based filtering

- **Retry Management:**
  - Manual retry triggering
  - Bulk retry operations
  - Success tracking
  - Error resolution

#### Sync History Details
**Component**: `components/page-client/SyncHistoryPage.tsx`

**Features:**
- **Detailed History:**
  - Complete sync attempt log
  - Response time tracking
  - Error message details
  - Success pattern analysis

- **Diagnostic Tools:**
  - Performance analysis
  - Error trend identification
  - Recovery time tracking

### 8. Changelog System

#### Changelog Management
**Component**: `components/page-client/ChangelogListPage.tsx`
**Detail**: `components/page-client/ChangelogDetailPage.tsx`
**Form**: `components/forms/changelog-form.tsx`

**Features:**
- **Version Tracking:**
  - Release version management
  - Feature documentation
  - Bug fix tracking
  - Release date management

- **Content Management:**
  - Rich text editing
  - Image support
  - Category classification
  - Impact assessment

- **Distribution:**
  - User notification
  - Email announcements
  - In-app notifications
  - RSS feed generation

## Public Features

### 1. Public Shipment Tracking
**Page**: `app/view-shipment/page.tsx`
**Component**: `components/page-client/ViewShipmentPage.tsx`

**Features:**
- **Guest Access:**
  - No authentication required
  - Tracking number input
  - Basic shipment information
  - Status updates

- **Information Display:**
  - Current status
  - Location information
  - Estimated delivery
  - Contact information

### 2. Live Location Tracking
**Page**: `app/live-location/page.tsx`

**Features:**
- **Real-time Tracking:**
  - Google Maps integration
  - Vessel position updates
  - Route visualization
  - ETA calculations

- **Interactive Map:**
  - Zoom and pan controls
  - Multiple map layers
  - Location markers
  - Route highlighting

### 3. Support Request System
**Page**: `app/support-request/page.tsx`
**Form**: `components/forms/create-support-request.tsx`

**Features:**
- **Public Access:**
  - No authentication required
  - Category selection
  - Priority levels
  - File attachments

- **Contact Management:**
  - Customer information capture
  - Automatic ticket creation
  - Email notifications
  - Reference number generation

## Advanced Features

### 1. Real-time Data Integration

#### SeaRates API Integration
**Service**: `services/searates.queries.ts`

**Features:**
- **Live Tracking Data:**
  - Real-time shipment updates
  - Container movement tracking
  - Vessel information
  - Port data

- **Data Synchronization:**
  - Automatic data updates
  - Failure handling
  - Rate limit management
  - Cache optimization

#### Google Maps Integration
**Component**: `components/google-map/map.tsx`

**Features:**
- **Location Services:**
  - Vessel position tracking
  - Port location mapping
  - Route visualization
  - Distance calculations

- **Interactive Features:**
  - Custom markers
  - Info windows
  - Layer controls
  - Responsive design

### 2. File Management System

#### File Upload Capabilities
**Component**: `components/UploadedFilesView.tsx`

**Features:**
- **Multiple File Types:**
  - Excel spreadsheets (.xlsx, .xls)
  - CSV files
  - Images (PNG, JPG, GIF)
  - PDF documents

- **Upload Interface:**
  - Drag-and-drop support
  - Progress tracking
  - Error handling
  - File validation

#### S3 Integration
**Configuration**: `next.config.js:17-24`

**Features:**
- **Cloud Storage:**
  - Secure file storage
  - CDN distribution
  - Automatic backup
  - Scalable storage

### 3. Data Export and Reporting

#### Export Capabilities
**Libraries**: exceljs, xlsx

**Features:**
- **Multiple Formats:**
  - Excel workbooks
  - CSV files
  - PDF reports
  - JSON data

- **Customizable Reports:**
  - Date range selection
  - Field customization
  - Filtering options
  - Scheduled exports

### 4. Advanced Search and Filtering

#### Search Functionality
**Component**: `components/SearchBar.tsx`

**Features:**
- **Multi-field Search:**
  - Tracking numbers
  - Container numbers
  - Company names
  - Reference numbers

- **Smart Filtering:**
  - Auto-suggestions
  - Recent searches
  - Saved filters
  - Quick filters

#### Filter System
**Component**: `components/Filter.tsx`

**Features:**
- **Dynamic Filters:**
  - Status-based filtering
  - Date range filters
  - Company filters
  - Custom field filters

- **Filter Management:**
  - Save filter presets
  - Share filters
  - Filter history
  - Default filters

## Mobile and Responsive Features

### 1. Responsive Design
All components are built with mobile-first responsive design:

- **Breakpoint System:**
  - Mobile: < 768px
  - Tablet: 768px - 1024px
  - Desktop: > 1024px

- **Adaptive Components:**
  - Collapsible navigation
  - Touch-friendly interfaces
  - Optimized table layouts
  - Mobile-specific interactions

### 2. Mobile Navigation
**Component**: `components/layout/mobile-sidebar.tsx`

**Features:**
- **Slide-out Menu:**
  - Touch gestures
  - Overlay navigation
  - Quick access links
  - User profile access

- **Mobile Optimization:**
  - Thumb-friendly buttons
  - Optimized touch targets
  - Swipe gestures
  - Pull-to-refresh

## Integration Features

### 1. API Integration Layer
**Configuration**: `utils/api.utils.ts`

**Features:**
- **Centralized API Management:**
  - Automatic authentication
  - Error handling
  - Request/response interceptors
  - Rate limiting

- **Service Architecture:**
  - Domain-specific services
  - Query and mutation separation
  - Cache management
  - Optimistic updates

### 2. Third-party Integrations

#### Email Services
- **Notification System:**
  - User registration confirmations
  - Password reset emails
  - Support ticket updates
  - System notifications

#### Analytics Integration
- **Usage Tracking:**
  - Feature usage analytics
  - Performance monitoring
  - Error tracking
  - User behavior analysis

## Security Features

### 1. Authentication Security
- **Token Management:**
  - JWT token authentication
  - Automatic token refresh
  - Secure token storage
  - Session timeout

### 2. Authorization Features
- **Role-based Access:**
  - Hierarchical permissions
  - Feature-level access control
  - Company-based isolation
  - Dynamic permission checking

### 3. Data Protection
- **Input Validation:**
  - Server-side validation
  - Client-side validation
  - SQL injection prevention
  - XSS protection

## Performance Features

### 1. Caching Strategy
- **React Query Caching:**
  - Intelligent cache management
  - Background refetching
  - Stale-while-revalidate
  - Cache invalidation

### 2. Optimization Features
- **Code Splitting:**
  - Route-based splitting
  - Component lazy loading
  - Bundle optimization
  - Tree shaking

### 3. Loading Optimizations
- **Progressive Loading:**
  - Skeleton screens
  - Lazy image loading
  - Infinite scrolling
  - Prefetch strategies

## Accessibility Features

### 1. WCAG Compliance
- **Keyboard Navigation:**
  - Tab order management
  - Keyboard shortcuts
  - Focus management
  - Skip links

### 2. Screen Reader Support
- **ARIA Labels:**
  - Proper labeling
  - Role definitions
  - State announcements
  - Semantic HTML

### 3. Visual Accessibility
- **Design Features:**
  - High contrast modes
  - Font size scaling
  - Color-blind friendly
  - Motion reduction

## Feature Roadmap

### Planned Features
- **Enhanced Analytics:** Advanced reporting and dashboard customization
- **Mobile App:** Native mobile application for iOS and Android
- **Real-time Notifications:** WebSocket-based live updates
- **Advanced Integrations:** Additional carrier API integrations
- **Workflow Automation:** Automated processes and triggers
- **Advanced Search:** Elasticsearch integration for complex queries

### Future Enhancements
- **AI-powered Insights:** Predictive analytics and intelligent routing
- **IoT Integration:** Sensor data integration for cargo monitoring
- **Blockchain Integration:** Supply chain transparency and verification
- **Multi-language Support:** Internationalization and localization
- **Advanced Security:** Two-factor authentication and audit trails