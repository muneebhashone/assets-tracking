# FrateZone - User Manual

## Table of Contents
1. [Getting Started](#getting-started)
2. [User Roles & Access Levels](#user-roles--access-levels)
3. [Authentication](#authentication)
4. [Dashboard Overview](#dashboard-overview)
5. [Shipment Management](#shipment-management)
6. [User Management](#user-management)
7. [Company Management](#company-management)
8. [System Monitoring](#system-monitoring)
9. [Support System](#support-system)
10. [Common Workflows](#common-workflows)
11. [Troubleshooting](#troubleshooting)

## Getting Started

### System Requirements
- **Web Browser**: Chrome 90+, Firefox 88+, Safari 14+, Edge 90+
- **Internet Connection**: Stable broadband connection recommended
- **Screen Resolution**: Minimum 1024x768, Optimized for 1920x1080
- **JavaScript**: Must be enabled

### First Time Access
1. **Receive Invitation**: You will receive an email invitation with login credentials
2. **Access Platform**: Visit the provided URL (typically https://your-domain.com)
3. **Initial Login**: Use the temporary password provided
4. **Set New Password**: You'll be prompted to create a secure password
5. **Profile Setup**: Complete your profile information

### Navigation Overview
The platform uses a sidebar navigation system that adapts based on your user role and permissions.

## User Roles & Access Levels

### Super Admin
**Full System Access**
- Manage all users across all companies
- Access system monitoring and health dashboards
- Manage credit assignments and system settings
- View and manage all shipments system-wide
- Access support ticket management

**Navigation Menu**:
- Dashboard (System overview)
- Shipment List (All shipments)
- Active Users (All users)
- Requested Users (Approval queue)
- Company (All companies)
- Assigns (Credit management)
- Support (Ticket management)
- Changelogs (System updates)
- Monitoring (System health)

### Sub Admin
**Limited Administrative Access**
- Manage users within assigned scope
- View and manage shipments within permissions
- Access basic system information
- Cannot access system monitoring or credit assignments

**Navigation Menu**:
- Dashboard (Administrative overview)
- Shipment List (Assigned shipments)
- Active Users (Assigned users)
- Requested Users (Approval queue)
- Company (Assigned companies)
- Changelogs (System updates)

### White Label Admin
**Company-Specific Administration**
- Manage their white-label instance
- Create and manage company sub-users
- Access company-specific shipment data
- Customize company branding and settings

**Navigation Menu**:
- Dashboard (Company overview)
- Shipment List (Company shipments)
- Active Users (Company users)
- Company (Company settings)
- Changelogs (System updates)

### Client Super User
**Company User Management**
- Manage users within their company
- Full access to company shipments
- Company administration capabilities
- Cannot create users outside company scope

**Navigation Menu**:
- Dashboard (Company dashboard)
- Shipment List (Company shipments)
- Track New Shipment (Create tracking)
- Changelogs (System updates)

### Client User
**Basic Access**
- Track and view assigned shipments
- Access personal dashboard
- Limited to company-specific data
- Cannot manage other users

**Navigation Menu**:
- Dashboard (Personal dashboard)
- Shipment List (Personal shipments)
- Track New Shipment (Create tracking)
- Changelogs (System updates)

## Authentication

### Login Process
1. **Access Login Page**: Navigate to the platform URL
2. **Enter Credentials**: Provide email and password
3. **Two-Factor Authentication** (if enabled): Enter verification code
4. **Dashboard Access**: Automatically redirected to your role-appropriate dashboard

### Password Management
#### Change Password
1. Navigate to **Profile Settings**
2. Click **Security** tab
3. Enter current password
4. Enter new password (minimum 8 characters, including uppercase, lowercase, number, and special character)
5. Confirm new password
6. Click **Update Password**

#### Forgot Password
1. Click **Forgot Password** on login page
2. Enter your email address
3. Check email for reset link
4. Click link and enter new password
5. Return to login page

### Profile Settings
Access via the user menu in the top-right corner:

#### Personal Information
- **Name**: Update your display name
- **Email**: Change email address (requires verification)
- **Phone**: Update contact phone number
- **Profile Picture**: Upload or change profile image

#### Notification Preferences
- **Email Notifications**: Toggle email alerts for shipment updates
- **System Notifications**: Configure in-app notification preferences
- **Report Frequency**: Set frequency for automated reports

## Dashboard Overview

### Admin Dashboard
**For Super Admin and Sub Admin roles**

#### Key Metrics Cards
- **Total Users**: Active users across the system
- **Active Shipments**: Currently tracked shipments
- **Companies**: Number of companies in the system
- **System Health**: Overall system status indicator

#### Charts and Analytics
- **Shipment Status Distribution**: Pie chart showing shipment statuses
- **Monthly Tracking Trends**: Line chart of tracking activity over time
- **User Activity**: Recent user actions and system usage
- **Performance Metrics**: System response times and success rates

#### Quick Actions
- **Create New Shipment**: Direct link to shipment creation
- **Add New User**: Quick user creation access
- **View System Health**: Jump to monitoring dashboard
- **Generate Report**: Create custom reports

### User Dashboard
**For Client Users and Client Super Users**

#### Personal Metrics
- **My Shipments**: Number of shipments assigned to you
- **Company Shipments**: Total company shipment count
- **Recent Activity**: Your recent tracking activities
- **Pending Actions**: Items requiring your attention

#### Company Overview
- **Shipment Status Breakdown**: Visual status distribution
- **Recent Shipments**: List of recently created or updated shipments
- **Company Performance**: Delivery success rates and timing metrics

## Shipment Management

### Creating a New Shipment

#### Single Shipment Creation
1. **Navigate**: Go to **Shipment** → **Track New Shipment**
2. **Choose Tracking Method**:
   - **Container Number**: For container-based tracking
   - **Bill of Lading**: For MBL/HBL-based tracking
3. **Enter Details**:
   - **Tracking Number**: Enter the container number or BL number
   - **Carrier**: Select from dropdown (e.g., MAERSK, MSC, COSCO)
   - **Origin Port**: Select departure port
   - **Destination Port**: Select arrival port
4. **Additional Information**:
   - **Customer Name**: End customer information
   - **Reference Numbers**: Internal reference codes
   - **Special Instructions**: Any special handling notes
5. **Submit**: Click **Create Shipment** to save

#### Bulk Shipment Upload
1. **Navigate**: Go to **Shipment List** → **Bulk Upload**
2. **Download Template**: Get the Excel template with required columns
3. **Prepare Data**: Fill in the template with your shipment data
   - Required columns: Tracking Number, Carrier, Track With, Origin, Destination
   - Optional columns: Customer Info, References, ETD, ETA
4. **Upload File**: Drag and drop or select your Excel file
5. **Review Results**: Check validation results and error reports
6. **Process**: Click **Import Shipments** to complete

### Viewing Shipment Details

#### Shipment Information Panel
- **Basic Details**: Tracking number, carrier, current status
- **Route Information**: Origin and destination with map visualization
- **Timeline**: Key milestone dates (ETD, ETA, actual dates)
- **Customer Information**: Contact details and references

#### Container Information
- **Container Numbers**: List of associated containers
- **Container Types**: Size and type specifications (20GP, 40HC, etc.)
- **Loading Details**: Gate in/out times, loading dates
- **Empty Return**: Return depot and timing information

#### Live Tracking
- **Current Position**: Real-time vessel/container location
- **Interactive Map**: Google Maps integration with route visualization
- **Movement History**: Port-to-port movement tracking with timestamps
- **Estimated Arrival**: Updated ETA based on current progress

### Shipment List Management

#### Filtering Options
- **Status Filter**: Filter by shipment status
  - Planned: Shipments not yet started
  - In Transit: Currently moving
  - Delivered: Successfully delivered
  - Discharged: Discharged but not delivered
  - Unknown: Status cannot be determined
- **Date Range**: Filter by creation date or milestone dates
- **Carrier Filter**: Filter by shipping line
- **Company Filter** (Admin only): Filter by company
- **Search**: Search by tracking number, container number, or customer name

#### Sorting Options
- **Creation Date**: Newest or oldest first
- **Status**: Group by status
- **ETD/ETA**: Sort by scheduled dates
- **Carrier**: Alphabetical by shipping line

#### Bulk Operations
- **Multi-Select**: Use checkboxes to select multiple shipments
- **Bulk Export**: Export selected shipments to Excel
- **Bulk Status Update**: Update status for multiple shipments
- **Bulk Delete**: Remove multiple shipments (admin only)

### Status Management

#### Status Meanings
- **Planned**: Shipment created but not yet started
- **In Transit**: Container is on its way
- **Delivered**: Successfully delivered to destination
- **Discharged**: Discharged from vessel but not delivered
- **Unknown**: Status cannot be determined from tracking data

#### Status Updates
- **Automatic Updates**: System automatically updates status from carrier APIs
- **Manual Updates**: Admin users can manually update status when needed
- **Status History**: View complete history of status changes

## User Management

### Viewing Users

#### User List
Navigate to **Active Users** to see all users you have permission to view:
- **Basic Information**: Name, email, role, company
- **Status Indicators**: Active/inactive status, last login
- **Actions**: Edit, deactivate, or delete users (based on permissions)

#### User Filtering
- **Role Filter**: Filter by user role (Admin, User, etc.)
- **Company Filter**: Filter by company (if managing multiple companies)
- **Status Filter**: Active or inactive users
- **Search**: Search by name or email

### Creating New Users

#### User Creation Process
1. **Navigate**: Go to **Active Users** → **Add New User**
2. **Basic Information**:
   - **Full Name**: User's complete name
   - **Email Address**: Valid email for login and notifications
   - **Phone Number**: Contact number
3. **Role Assignment**:
   - **Role**: Select appropriate role based on user's responsibilities
   - **Company**: Assign to appropriate company
   - **Permissions**: Set specific permissions if custom access needed
4. **Account Settings**:
   - **Send Welcome Email**: Toggle to send invitation email
   - **Require Password Change**: Force password change on first login
   - **Account Status**: Set as active or inactive
5. **Submit**: Click **Create User** to complete

#### Role-Based Creation Restrictions
- **Super Admin**: Can create any role except other Super Admins
- **Sub Admin**: Can create White Label Sub Admin and Client Users
- **White Label Admin**: Can create White Label Sub Admin only
- **Client Super User**: Can create Client Users within their company

### Managing User Permissions

#### Permission Categories
- **Shipment Permissions**: View, create, edit, delete shipments
- **User Permissions**: View, create, edit, delete users
- **Company Permissions**: View, create, edit, delete companies
- **Dashboard Permissions**: Access to dashboard features
- **System Permissions**: Access to system settings and monitoring

#### Custom Permission Sets
1. **Navigate**: User Details → **Permissions** tab
2. **Select Permissions**: Check/uncheck individual permissions
3. **Permission Groups**: Use predefined permission sets
4. **Save Changes**: Click **Update Permissions**

### User Approval Workflow

#### Requested Users Management
Navigate to **Requested Users** to manage user registration requests:

#### Approval Process
1. **Review Request**: Check user information and company association
2. **Verify Details**: Confirm user's role and permission requirements
3. **Approve/Reject**:
   - **Approve**: Click **Approve** to activate the user account
   - **Reject**: Click **Reject** with reason for rejection
4. **Notification**: User receives email notification of decision

#### Bulk Approval
- **Select Multiple**: Use checkboxes to select multiple requests
- **Bulk Approve**: Approve multiple users at once
- **Assign Roles**: Set roles for multiple users during approval

## Company Management

### Company Overview
Navigate to **Company** to manage company information and settings.

### Company Information Management

#### Basic Company Details
- **Company Name**: Official business name
- **Contact Information**: Primary email and phone
- **Address**: Complete business address
- **Logo**: Upload company logo for branding

#### Company Settings
- **Tracking Credits**: Set credit limits for shipment tracking
- **Feature Access**: Enable/disable specific features
- **API Access**: Configure API credentials and endpoints
- **Branding**: Customize colors and logos for white-label partners

### Multi-Company Hierarchy

#### Parent-Child Relationships
- **Parent Companies**: Top-level company accounts
- **Child Companies**: Sub-companies or departments
- **White-Label Partners**: Independent branded instances

#### Company User Management
- **User Limits**: Set maximum number of users per company
- **Role Restrictions**: Define which roles are available
- **Data Isolation**: Ensure company data separation

## System Monitoring

### System Health Dashboard
**Available to Super Admin only**

Navigate to **Monitoring** to access system health information.

#### Health Overview Cards
- **Sync Health Status**: Overall system synchronization health
  - Green: Healthy (success rate > 95%)
  - Yellow: Warning (success rate 85-95%)
  - Red: Critical (success rate < 85%)
- **Circuit Breaker Status**: Protection system status
  - Closed: Normal operation
  - Open: Protection active
  - Half-Open: Testing recovery
- **Performance Metrics**: Response times and throughput
- **Last Updated**: Timestamp of last health check

#### Performance Charts
- **Daily Sync Trends**: Success/failure rates over time
- **Response Time Trends**: API response time monitoring
- **Error Rate Analysis**: Types and frequency of errors
- **Top Failure Reasons**: Most common error causes

### Failed Sync Management

#### Viewing Failed Syncs
Navigate to **Monitoring** → **Failed Syncs** to see synchronization failures:

#### Failure Information
- **Shipment Details**: Tracking number, carrier, customer info
- **Failure Count**: Number of consecutive failures
- **Last Attempt**: Timestamp of most recent failure
- **Error Messages**: Detailed error information
- **Actions**: Manual retry options

#### Retry Operations
- **Individual Retry**: Click **Retry** button for single shipment
- **Bulk Retry**: Select multiple failures and retry together
- **Success Tracking**: Monitor retry attempt results

### Sync History Details

#### Detailed History View
Click on any shipment from the failed syncs list to view complete history:

#### History Information
- **All Attempts**: Complete log of sync attempts
- **Response Times**: Performance data for each attempt
- **Error Details**: Full error messages and stack traces
- **Success Patterns**: Identify when syncs typically succeed

## Support System

### Viewing Support Tickets
**Available to Super Admin only**

Navigate to **Support** to access ticket management.

#### Ticket List
- **Ticket Information**: ID, subject, priority, status
- **Customer Details**: Name, email, company
- **Assignment**: Assigned support agent
- **Timestamps**: Creation and last update times

#### Ticket Filtering
- **Status Filter**: Open, in progress, resolved, closed
- **Priority Filter**: Low, medium, high, urgent
- **Category Filter**: Technical, billing, general inquiry
- **Agent Filter**: Filter by assigned agent

### Managing Support Tickets

#### Ticket Details View
Click on any ticket to view full details:

#### Ticket Information
- **Subject and Description**: Full problem description
- **Priority Level**: Urgency assessment
- **Category**: Type of issue
- **Attachments**: Files uploaded by customer

#### Ticket Actions
- **Update Status**: Change ticket status
- **Assign Agent**: Assign to support team member
- **Add Response**: Reply to customer
- **Internal Notes**: Add internal team notes
- **Escalate**: Escalate to higher priority

### Creating Support Tickets (Public)

#### Public Support Form
Available at `/support-request` without login:

#### Ticket Creation Process
1. **Contact Information**: Name, email, phone
2. **Issue Details**: Subject, description, category
3. **Priority Level**: Select appropriate urgency
4. **Attachments**: Upload relevant files
5. **Submit**: Creates ticket and sends confirmation email

## Common Workflows

### Daily Operations

#### Morning Routine
1. **Check Dashboard**: Review overnight activity and alerts
2. **Review Failed Syncs**: Address any synchronization issues
3. **Process User Requests**: Approve pending user requests
4. **Check Support Tickets**: Address urgent customer issues

#### Shipment Tracking Workflow
1. **Create Shipment**: Add new shipments to system
2. **Monitor Progress**: Check status updates and ETAs
3. **Handle Exceptions**: Address delayed or problematic shipments
4. **Update Customers**: Provide status updates as needed

### Weekly Operations

#### User Management
1. **Review User Activity**: Check login activity and usage patterns
2. **Process New Requests**: Approve or reject new user applications
3. **Update Permissions**: Adjust user access as needed
4. **Deactivate Unused Accounts**: Clean up inactive accounts

#### System Maintenance
1. **Review System Health**: Check monitoring dashboard
2. **Analyze Performance**: Review response times and error rates
3. **Plan Updates**: Schedule system updates and maintenance
4. **Backup Verification**: Ensure backups are working properly

### Monthly Operations

#### Reporting
1. **Generate Usage Reports**: Monthly activity summaries
2. **Performance Analysis**: System performance trends
3. **User Analytics**: User engagement and feature usage
4. **Cost Analysis**: Credit usage and system costs

#### System Review
1. **Security Audit**: Review access logs and permissions
2. **Performance Optimization**: Identify improvement opportunities
3. **Feature Planning**: Plan new features and enhancements
4. **Training Updates**: Update user training materials

## Troubleshooting

### Common Issues

#### Login Problems
**Issue**: Cannot log in to the system
**Solutions**:
- Verify email address is correct
- Check if Caps Lock is enabled
- Use password reset feature
- Clear browser cache and cookies
- Try different browser or incognito mode
- Contact system administrator

#### Shipment Not Updating
**Issue**: Shipment status not updating automatically
**Solutions**:
- Check carrier API status in monitoring dashboard
- Verify tracking number format is correct
- Confirm carrier is supported
- Try manual refresh of shipment details
- Check for system maintenance notifications
- Report to system administrator if issue persists

#### Slow Performance
**Issue**: Application loading slowly
**Solutions**:
- Check internet connection speed
- Clear browser cache
- Disable browser extensions
- Try different browser
- Check system status page
- Contact support if issue is widespread

#### Permission Errors
**Issue**: Cannot access certain features
**Solutions**:
- Verify your user role and permissions
- Log out and log back in
- Contact your administrator to verify access rights
- Check if feature requires higher permission level

### Error Messages

#### "Session Expired"
- **Cause**: Login session has timed out
- **Solution**: Log in again with your credentials

#### "Insufficient Permissions"
- **Cause**: Trying to access feature without proper permissions
- **Solution**: Contact administrator to request access

#### "Tracking Number Not Found"
- **Cause**: Invalid or non-existent tracking number
- **Solution**: Verify tracking number format and carrier

#### "Server Error"
- **Cause**: System error or maintenance
- **Solution**: Try again later or contact support

### Getting Help

#### Self-Service Options
1. **Documentation**: Check this user manual for guidance
2. **FAQ Section**: Review frequently asked questions
3. **Video Tutorials**: Watch feature walkthrough videos
4. **System Status**: Check status page for known issues

#### Contacting Support
1. **Support Ticket**: Create ticket through support form
2. **Email Support**: Send email to support@yourcompany.com
3. **Phone Support**: Call support hotline during business hours
4. **Live Chat**: Use in-app chat feature if available

#### Information to Provide
When contacting support, include:
- Your username and company
- Description of the problem
- Steps to reproduce the issue
- Screenshots if applicable
- Browser and operating system information
- Error messages received

### Browser Compatibility

#### Recommended Browsers
- **Chrome**: Version 90 or newer
- **Firefox**: Version 88 or newer
- **Safari**: Version 14 or newer
- **Edge**: Version 90 or newer

#### Browser Settings
- **JavaScript**: Must be enabled
- **Cookies**: Must be enabled
- **Pop-up Blocker**: May need to disable for some features
- **Ad Blockers**: May interfere with functionality

### Mobile Usage

#### Mobile Optimization
The platform is optimized for mobile devices with:
- **Responsive Design**: Adapts to screen size
- **Touch-Friendly Interface**: Large buttons and easy navigation
- **Mobile Menu**: Collapsible navigation for small screens

#### Mobile Limitations
Some features may have limited functionality on mobile:
- **Complex Tables**: May require horizontal scrolling
- **File Uploads**: May have restrictions
- **Advanced Features**: Some admin features work better on desktop

This comprehensive user manual provides detailed guidance for all user roles and common use cases within the FrateZone platform.