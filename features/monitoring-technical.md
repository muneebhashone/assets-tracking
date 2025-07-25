# Monitoring Dashboard Features Documentation

## Overview
The monitoring dashboard (`app/(dashboard)/dashboard/monitoring/`) provides comprehensive system monitoring capabilities for FrateZone's shipment synchronization system. It allows administrators to track sync health, manage failures, and analyze performance metrics.

## Feature Structure

### 1. Main Monitoring Dashboard (`/dashboard/monitoring`)

**File**: `app/(dashboard)/dashboard/monitoring/page.tsx` → `MonitoringDashboardPage.tsx`

**Core Features**:
- **System Health Overview**: Real-time sync health status cards
- **Circuit Breaker Status**: Monitor system protection mechanisms
- **Performance Statistics**: Charts showing sync performance over time
- **Failed Syncs Overview**: Quick view of recent failures
- **Quick Actions**: One-click operations for common tasks

**Key Components**:
- `HealthStatusCard` - Shows overall system health metrics
- `CircuitBreakerStatusCard` - Displays circuit breaker states
- `StatsCharts` - Performance visualization using charts
- `FailedSyncsTable` - Tabular view of failed synchronizations

**Interactive Elements**:
- Time range selector for statistics (1-30 days)
- Failed syncs time filter (1 hour to 1 week)
- "Refresh All" button to update all data
- Direct navigation to detailed pages

### 2. Failed Syncs Management (`/dashboard/monitoring/failed-syncs`)

**File**: `app/(dashboard)/dashboard/monitoring/failed-syncs/page.tsx` → `FailedSyncsPage.tsx`

**Core Features**:
- **Advanced Filtering**: Time range, failure threshold, and carrier filters
- **Search Functionality**: Search by shipment ID, tracking number, or error message
- **Statistics Dashboard**: Total failures, high priority items, average failure count
- **Comprehensive Table**: Detailed view of all failed synchronizations

**Filter Options**:
- **Time Range**: Last hour to last week
- **Failure Threshold**: 1+ to 10+ failures
- **Carrier Filter**: Dynamically populated from available carriers
- **Text Search**: Multi-field search across shipment data

**Statistics Cards**:
- Total failed syncs in selected time range
- High priority failures (10+ failures)
- Average failure count per shipment

**Data Management**:
- Real-time filtering and search
- Empty state handling with helpful messages
- Clear filters functionality

### 3. Sync History Details (`/dashboard/monitoring/sync-history/[shipmentId]`)

**File**: `app/(dashboard)/dashboard/monitoring/sync-history/[shipmentId]/page.tsx` → `SyncHistoryPage.tsx`

**Core Features**:
- **Shipment-Specific History**: Detailed sync attempts for individual shipments
- **Performance Metrics**: Success rates, response times, and attempt counts
- **Admin Controls**: Retry sync functionality for super admins
- **Navigation Integration**: Links to shipment details and monitoring dashboard

**Statistics Dashboard**:
- Total sync attempts
- Success rate percentage
- Latest attempt status
- Average API response time

**Role-Based Features**:
- Super admin users can retry failed syncs
- Regular users have read-only access
- Appropriate UI elements shown based on permissions

**Display Options**:
- Configurable record limits (20, 50, 100)
- Chronological ordering (most recent first)
- Detailed attempt information

## Technical Architecture

### Data Flow
1. **React Query Integration**: All pages use custom hooks from `services/monitoring.queries.ts`
2. **Real-time Updates**: Refetch capabilities on all data sources
3. **Permission-Based Access**: All pages wrapped with `PermissionWrapper`
4. **Responsive Design**: Grid layouts adapt to different screen sizes

### Key Services
- `useSyncHealth()` - System health metrics
- `useSyncStats()` - Performance statistics
- `useCircuitBreakerStatus()` - Circuit breaker monitoring
- `useFailedSyncs()` - Failed synchronization data
- `useSyncHistory()` - Individual shipment sync history

### UI Components
- Custom monitoring components in `components/monitoring/`
- Specialized table components in `components/tables/monitoring-table/`
- Standard UI components from shadcn/ui library

### Navigation Structure
```
/dashboard/monitoring (Main dashboard)
├── /failed-syncs (Failed syncs management)
└── /sync-history/[shipmentId] (Individual shipment history)
```

### Permission Requirements
- All monitoring features require super admin permissions
- Implemented through `PermissionWrapper` component
- Role-specific features (like retry sync) check user permissions dynamically

## Key Integrations

### Charts and Visualization
- Uses `@nivo/bar` and `@nivo/line` for performance charts
- Responsive chart components with time-based data

### Search and Filtering
- Real-time filtering using React useMemo hooks
- Multi-field search capabilities
- Dynamic carrier filter population

### State Management
- React Query for server state management
- Local state for UI filters and search terms
- Optimistic updates for better user experience