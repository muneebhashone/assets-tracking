# Monitoring Module - User Interface Documentation

## Overview
The Monitoring Module provides real-time visibility into FrateZone's shipment synchronization system. Users can monitor system health, identify sync failures, and troubleshoot issues through three interconnected dashboards.

---

## 1. Main Monitoring Dashboard (`/dashboard/monitoring`)

### What Users See

#### Page Header
- **Title**: "System Monitoring" with activity icon
- **Subtitle**: "Monitor sync health, performance, and troubleshoot issues"
- **Refresh All Button**: Updates all dashboard data simultaneously

#### Health Status Section (Top Cards)

**Sync Health Status Card**
- **Visual Indicator**: Color-coded status icon (green checkmark, yellow/red alert)
- **Status Badge**: "HEALTHY", "WARNING", or "CRITICAL" with matching colors
- **Success Rate**: Large percentage display (e.g., "98.5% Success Rate")
- **Metrics Grid**:
  - **Active Syncs**: Number of currently running synchronizations
  - **Recent Failures**: Count of failed syncs in red text
  - **Avg Response**: Average API response time in milliseconds
  - **Last Updated**: Timestamp with clock icon

**Circuit Breaker Card**
- **Visual Indicator**: Shield icon (green check, yellow shield, red alert)
- **Status Badge**: "CLOSED" (normal), "OPEN" (blocked), or "HALF OPEN" (testing)
- **Description**: Plain English explanation of current state
- **Metrics**:
  - **Failure Count**: Number of consecutive failures
  - **Last Update**: When status was last changed

#### Performance Statistics Section

**Time Range Selector**
- Dropdown with options: Last 24 hours, 3 days, 7 days, 14 days, 30 days
- Affects all charts and statistics displayed

**Charts (Side by Side)**
- **Daily Sync Trends**: Line chart showing:
  - Green line: Successful syncs over time
  - Red line: Failed syncs over time  
  - Blue line: Total sync attempts
- **Top Failure Reasons**: Bar chart showing most common error causes
  - Red bars indicating failure frequency
  - Truncated error messages with full text below chart

#### Failed Syncs Overview Section

**Section Header**
- Warning triangle icon with "Failed Syncs Overview"
- Time filter dropdown (Last hour to Last week)
- "View All Failed Syncs" button

**Failed Syncs Table Preview**
- Shows first 10 most critical failed syncs
- Columns visible:
  - **Shipment ID**: Clickable identifier
  - **Carrier**: Badge with carrier name
  - **Tracking Number**: Monospace font for clarity
  - **Failures**: Color-coded count (blue<5, yellow 5-9, red 10+)
  - **Last Attempt**: Date and time of most recent failure
  - **Recent Errors**: Truncated error message with "+X more" if multiple
  - **Actions**: View history and retry buttons (admin only)

**Quick Actions Card**
- Three buttons for common operations:
  - "Manage Failed Syncs" - Navigate to detailed failed syncs page
  - "Refresh Health Status" - Update health metrics only
  - "Update Statistics" - Refresh performance charts

### What This Means for Monitoring

**Health Status Interpretation**:
- **Green (Healthy)**: System operating normally, success rate >95%
- **Yellow (Warning)**: Some issues detected, success rate 85-95% 
- **Red (Critical)**: Major problems, success rate <85%

**Circuit Breaker States**:
- **CLOSED**: All sync requests proceeding normally
- **OPEN**: System protection active, blocking requests to prevent cascade failures
- **HALF OPEN**: System testing if external service has recovered

**Performance Trends**:
- Upward trends in failures indicate system degradation
- Response time spikes suggest external API issues
- Recurring error patterns help identify systematic problems

---

## 2. Failed Syncs Management (`/dashboard/monitoring/failed-syncs`)

### What Users See

#### Page Header
- **Navigation**: "Back to Monitoring" button
- **Title**: "Failed Syncs Management" with red warning triangle
- **Subtitle**: "View and manage shipments that failed to sync"
- **Refresh Button**: Updates failed syncs data

#### Statistics Cards (Top Row)
- **Total Failed Syncs**: Large red number showing failures in selected timeframe
- **High Priority**: Orange number showing shipments with 10+ failures
- **Average Failures**: Overall average failure count per shipment

#### Advanced Filters Section
**Filter Controls**:
- **Time Range**: Dropdown (Last hour to Last week)
- **Failure Threshold**: Minimum failures to display (1+ to 10+)
- **Carrier**: Dynamic dropdown populated from actual failed syncs
- **Search**: Text input for shipment ID, tracking number, or error message

**Results Summary**: "Showing X of Y failed syncs" when filters applied

#### Comprehensive Failed Syncs Table
**Full table with sorting capabilities**:
- **Shipment ID**: Bold, clickable links to shipment details
- **Carrier**: Colored badges for visual categorization
- **Tracking Number**: Monospace formatted for readability
- **Failures**: Color-coded priority (blue→yellow→red as count increases)
- **Last Attempt**: Recent attempt timestamp
- **Recent Errors**: 
  - Latest error message (truncated if long)
  - "+X more" indicator for multiple errors
  - Hover shows full error text
- **Actions**: 
  - External link icon to view sync history
  - Retry button (admin only) with loading spinner

#### Empty State Handling
- **No Results**: Helpful message with clear filters button
- **No Failures**: Congratulatory message when system is healthy

### What This Means for Monitoring

**Priority System**:
- **Blue (1-4 failures)**: Normal retry attempts, likely temporary issues
- **Yellow (5-9 failures)**: Persistent problems requiring attention
- **Red (10+ failures)**: Critical issues needing immediate investigation

**Error Pattern Analysis**:
- Similar error messages across shipments indicate systematic issues
- Carrier-specific failures suggest integration problems
- Time-based patterns help identify external service outages

**Actionable Insights**:
- High failure counts indicate problematic shipments needing manual intervention
- Recent errors provide immediate troubleshooting information
- Search functionality enables quick investigation of specific issues

---

## 3. Sync History Details (`/dashboard/monitoring/sync-history/[shipmentId]`)

### What Users See

#### Page Header
- **Navigation**: "Back to Monitoring" button
- **Title**: "Sync History - Shipment #[ID]" with history icon
- **Subtitle**: "Detailed sync attempt history for this shipment"
- **Action Buttons**:
  - "View Shipment": External link to shipment details
  - "Retry Sync": Manual retry trigger (super admin only)
  - "Refresh": Update sync history data

#### Statistics Cards (Detailed Metrics)
- **Total Attempts**: Count of all recorded sync attempts
- **Success Rate**: Percentage with breakdown of successful vs failed attempts
- **Latest Status**: 
  - Green "Success" or Red "Failed" badge
  - Attempt number of most recent sync
- **Avg Response Time**: Average API response time across all attempts

#### Display Options
- **Records Limit**: Dropdown to show last 20, 50, or 100 attempts
- **Ordering Note**: "Showing the most recent sync attempts first"

#### Detailed Sync History Table
**Comprehensive attempt log with columns**:
- **ID**: Unique sync attempt identifier
- **Status**: 
  - Green checkmark + "Success" badge for successful attempts
  - Red X + "Failed" badge for failures
- **Attempt #**: Sequential attempt number for this shipment
- **Response Time**: 
  - Color-coded performance (green <2s, yellow 2-5s, red >5s)
  - Monospace formatting for precise timing
- **Timestamp**: 
  - Clock icon with full date and time
  - Format: "MMM dd, yyyy HH:mm:ss"
- **Error Details**: 
  - Truncated error message for failures
  - Hover tooltip shows complete error text
  - Dash (-) for successful attempts

#### Empty State
- **No History**: Message explaining no sync attempts recorded
- **Admin Action**: Retry sync button for super admins to initiate first attempt

### What This Means for Monitoring

**Performance Analysis**:
- **Response Times**: Help identify external API performance issues
- **Success Patterns**: Show if problems are intermittent or consistent
- **Attempt Frequency**: Indicate retry behavior and system persistence

**Troubleshooting Insights**:
- **Error Evolution**: Track if error messages change over time
- **Failure Clustering**: Identify time periods with systematic issues
- **Recovery Patterns**: See how long it takes systems to recover

**Administrative Control**:
- **Manual Intervention**: Super admins can force retry attempts
- **Detailed Diagnostics**: Full error messages enable precise troubleshooting
- **Historical Context**: Complete audit trail for compliance and analysis

---

## Navigation Flow & User Journey

### Typical Monitoring Workflow

1. **Start at Main Dashboard**: Get overall system health overview
2. **Identify Issues**: Notice high failure counts or degraded performance
3. **Investigate Failures**: Click "View All Failed Syncs" for detailed analysis
4. **Drill Down**: Use filters and search to identify problematic shipments
5. **Deep Dive**: Click sync history link for specific shipment diagnosis
6. **Take Action**: Retry failed syncs or escalate to technical team

### Role-Based Access

**All Monitoring Users**:
- View all dashboards and metrics
- Use filters and search functionality
- Access detailed sync histories
- Navigate between monitoring sections

**Super Admin Additional Capabilities**:
- Retry failed sync attempts
- Manual sync triggering
- Full administrative control over sync processes

### Visual Design Patterns

**Color Coding System**:
- **Green**: Success, healthy status, good performance
- **Yellow**: Warnings, moderate issues, attention needed
- **Red**: Failures, critical status, immediate action required
- **Blue**: Neutral metrics, informational data

**Interactive Elements**:
- Hover tooltips for truncated text
- Sortable table columns with visual indicators
- Loading states with spinners and skeletons
- Responsive design adapting to screen sizes

**Iconography**:
- Activity/trending icons for performance data
- Warning triangles for failure states  
- Shield icons for system protection status
- Clock icons for time-based information
- External link icons for navigation actions