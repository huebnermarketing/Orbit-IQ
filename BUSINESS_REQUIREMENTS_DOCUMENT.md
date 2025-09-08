# Orbit IQ - Business Requirements Document

## Table of Contents
1. [Executive Summary](#executive-summary)
2. [System Overview](#system-overview)
3. [User Roles and Permissions](#user-roles-and-permissions)
4. [Core Modules](#core-modules)
5. [Database Schema](#database-schema)
6. [API Endpoints](#api-endpoints)
7. [Frontend Components](#frontend-components)
8. [Business Rules and Constraints](#business-rules-and-constraints)
9. [Security and Authentication](#security-and-authentication)
10. [Email System](#email-system)
11. [File Storage and Management](#file-storage-and-management)
12. [Future Enhancements](#future-enhancements)

---

## Executive Summary

Orbit IQ is a comprehensive project management and client relationship management system designed for agencies and direct clients. The system provides role-based access control, client management, user management, organization settings, and project/task management capabilities. The application is built using Laravel (PHP) backend with Vue.js frontend, utilizing MySQL database and AWS S3 for file storage.

---

## System Overview

### Technology Stack
- **Backend**: Laravel 11 (PHP Framework)
- **Frontend**: Vue.js 3 with TypeScript
- **Database**: MySQL
- **Authentication**: Laravel Sanctum
- **File Storage**: AWS S3 + Local Storage
- **Email**: Laravel Mail with Queue Jobs
- **UI Framework**: Tailwind CSS
- **State Management**: Pinia

### Application Architecture
- **API-First Design**: RESTful API endpoints
- **Single Page Application**: Vue.js frontend
- **Role-Based Access Control**: Multi-level permission system
- **Queue-Based Processing**: Asynchronous email and job processing
- **Responsive Design**: Mobile-first approach

---

## User Roles and Permissions

### System Roles (Hierarchical)
1. **Super Admin**
   - Full system access
   - Can manage all users including other super admins
   - Can modify any user's email address
   - Can assign any system role
   - Can manage organization settings
   - Can access all client data

2. **Admin**
   - Can manage regular users (not super admins)
   - Cannot modify super admin accounts
   - Cannot change user email addresses (except for pending client persons)
   - Can manage organization roles, teams, and clients
   - Can access client management features

3. **User**
   - Basic system access
   - Can manage their own profile
   - Can access assigned projects and tasks
   - Limited to their assigned workspace/team access

### Organization Roles (Functional)
1. **Account Manager (AM)**
   - Can be assigned as primary or secondary account manager for clients
   - Can manage client relationships
   - Can access client-specific data

2. **Project Manager (PM)**
   - Can manage projects and tasks
   - Can assign tasks to team members
   - Can track project progress

3. **Client**
   - Reserved for client persons only
   - Cannot be assigned through user management
   - Created automatically when client persons set up passwords
   - Has access to their company's projects and tasks

4. **Custom Roles**
   - Can be created by admins
   - Can have custom permissions
   - Can be locked (system-defined) or unlocked (user-defined)

---

## Core Modules

### 1. Authentication & User Management

#### User Registration & Login
- **Registration**: Email-based registration with email verification
- **Login**: Email/password authentication with optional MFA
- **Remember Me**: Extended session tokens (30 days vs 24 hours)
- **Password Reset**: Secure token-based password reset via email
- **MFA Support**: TOTP-based two-factor authentication with backup codes

#### User Management (Admin Only)
- **User Listing**: Paginated table with search, filtering, and sorting
- **User Creation**: Create new users with role assignment
- **User Editing**: Update user information with role restrictions
- **User Deactivation**: Soft delete with status management
- **Password Reset**: Admin-initiated password resets
- **Email Restrictions**: Only super admins can modify user email addresses

#### User Profile Management
- **Profile Information**: Name, email, timezone, avatar
- **Password Change**: Current password verification required
- **Avatar Upload**: Image upload with validation
- **MFA Management**: Enable/disable two-factor authentication
- **Backup Codes**: Regenerate MFA backup codes

### 2. Organization Management

#### Organization Profile
- **Company Information**: Name, description, email, phone, address, website
- **Logo Management**: Upload and manage organization logo
- **Settings**: Timezone and other organizational preferences

#### Organization Roles
- **Role Creation**: Create custom organization roles
- **Role Management**: Edit, activate/deactivate, delete roles
- **Role Assignment**: Assign multiple roles to users
- **Role Permissions**: Define custom permissions for roles
- **System Roles**: Locked system-defined roles (AM, PM, Client)
- **User Count**: Display number of users per role with tooltips

#### User Groups
- **Group Creation**: Create user groups with name, description, and color
- **Member Management**: Add/remove users from groups
- **Group Listing**: Tabular display with member avatars
- **Group Actions**: Edit, delete groups with member management

#### Teams
- **Team Creation**: Create teams with name, description, and color
- **Member Management**: Add/remove team members
- **Team Roles**: Owner, admin, member roles within teams
- **Team Listing**: Display with member avatars and status

### 3. Client Management

#### Client Companies
- **Client Creation**: Add new client companies with comprehensive information
- **Client Information**:
  - Company name, email, phone, website, address
  - Primary Account Manager (single selection)
  - Secondary Account Managers (multiple selection)
  - Client Type (Agency or Direct Client)
  - Active/Inactive status
- **Logo Management**: Automatic favicon fetching from client websites
- **Client Listing**: Table with company logos, names, account managers, and status
- **Client Editing**: Update client information with logo refresh
- **Client Deletion**: Soft delete with cascade handling

#### Client Detail View
- **Company Overview**: Comprehensive client information display
- **Account Managers**: Primary and secondary account manager details
- **Modern Design**: Gradient backgrounds, shadows, and premium styling
- **Responsive Layout**: Mobile-friendly design

#### Client Persons (Contact Management)
- **Person Creation**: Add client contact persons
- **Person Information**: Name, email, phone, status
- **Invitation System**: Email-based password setup invitations
- **Status Management**: Pending, Active, Inactive statuses
- **Password Setup**: Secure token-based password creation
- **User Account Creation**: Automatic user account creation upon password setup
- **Email Restrictions**: Only super admins can modify activated client person emails
- **Status Workflow**: Pending users must complete password setup via link

### 4. Project & Task Management (Planned)

#### Projects
- **Project Creation**: Create projects with name, description, color, avatar
- **Project Management**: Assign owners, set dates, manage status
- **Project Status**: Active, completed, archived
- **Workspace Integration**: Projects belong to workspaces

#### Tasks
- **Task Creation**: Create tasks with name, description, priority, due dates
- **Task Management**: Assign to users, set status, track progress
- **Task Status**: Todo, in_progress, completed, cancelled
- **Task Priority**: Low, medium, high, urgent
- **Hierarchical Tasks**: Parent-child task relationships
- **Task Ordering**: Custom ordering within projects

#### Workspaces
- **Workspace Creation**: Create workspaces with name, description, color
- **Workspace Management**: Assign owners, set public/private status
- **Member Management**: Add/remove workspace members
- **Workspace Roles**: Owner, admin, member roles

---

## Database Schema

### Core Tables

#### Users Table
```sql
- id (Primary Key)
- name (String, Required)
- email (String, Unique, Required)
- email_verified_at (Timestamp, Nullable)
- password (String, Required)
- avatar (String, Nullable)
- timezone (String, Default: UTC)
- role (Enum: super_admin, admin, user, Default: user)
- is_active (Boolean, Default: true)
- mfa_enabled (Boolean, Default: false)
- mfa_secret (String, Nullable)
- mfa_backup_codes (JSON, Nullable)
- organization_role_id (Foreign Key, Nullable)
- assigned_pm_id (Foreign Key, Nullable)
- remember_token (String, Nullable)
- created_at, updated_at (Timestamps)
```

#### Organization Roles Table
```sql
- id (Primary Key)
- name (String, Required)
- description (Text, Nullable)
- permissions (JSON, Nullable)
- color (String, Default: #3B82F6)
- is_active (Boolean, Default: true)
- is_locked (Boolean, Default: false)
- sort_order (Integer, Default: 0)
- created_at, updated_at (Timestamps)
```

#### User Organization Roles (Pivot Table)
```sql
- id (Primary Key)
- user_id (Foreign Key to users)
- organization_role_id (Foreign Key to organization_roles)
- created_at, updated_at (Timestamps)
- Unique constraint on (user_id, organization_role_id)
```

#### Clients Table
```sql
- id (Primary Key)
- company_name (String, Required)
- email (String, Required)
- phone (String, Nullable)
- website (String, Nullable)
- address (Text, Nullable)
- primary_account_manager_id (Foreign Key to users, Nullable)
- client_type (Enum: Agency, Direct Client, Default: Direct Client)
- is_active (Boolean, Default: true)
- logo_url (String, Nullable)
- logo_fetched_at (Timestamp, Nullable)
- created_at, updated_at (Timestamps)
```

#### Client Secondary Account Managers (Pivot Table)
```sql
- id (Primary Key)
- client_id (Foreign Key to clients)
- user_id (Foreign Key to users)
- created_at, updated_at (Timestamps)
- Unique constraint on (client_id, user_id)
```

#### Client Persons Table
```sql
- id (Primary Key)
- client_id (Foreign Key to clients)
- name (String, Required)
- email (String, Required)
- phone (String, Nullable)
- password_setup_token (String, Nullable, Unique)
- password_setup_expires_at (Timestamp, Nullable)
- status (Enum: pending, active, inactive, Default: pending)
- user_id (Foreign Key to users, Nullable)
- created_at, updated_at (Timestamps)
- Unique constraint on (client_id, email)
- Index on (client_id, status)
- Index on password_setup_token
```

#### User Groups Table
```sql
- id (Primary Key)
- name (String, Required)
- description (Text, Nullable)
- color (String, Default: #3B82F6)
- is_active (Boolean, Default: true)
- created_at, updated_at (Timestamps)
```

#### User Group Members (Pivot Table)
```sql
- id (Primary Key)
- user_group_id (Foreign Key to user_groups)
- user_id (Foreign Key to users)
- created_at, updated_at (Timestamps)
- Unique constraint on (user_group_id, user_id)
```

#### Teams Table
```sql
- id (Primary Key)
- name (String, Required)
- description (Text, Nullable)
- avatar (String, Nullable)
- workspace_id (Foreign Key to workspaces)
- owner_id (Foreign Key to users)
- created_at, updated_at (Timestamps)
```

#### Team Members (Pivot Table)
```sql
- id (Primary Key)
- team_id (Foreign Key to teams)
- user_id (Foreign Key to users)
- role (Enum: owner, admin, member, Default: member)
- created_at, updated_at (Timestamps)
- Unique constraint on (team_id, user_id)
```

#### Workspaces Table
```sql
- id (Primary Key)
- name (String, Required)
- description (Text, Nullable)
- color (String, Default: #6366f1)
- avatar (String, Nullable)
- owner_id (Foreign Key to users)
- is_public (Boolean, Default: false)
- created_at, updated_at (Timestamps)
```

#### Workspace Members (Pivot Table)
```sql
- id (Primary Key)
- workspace_id (Foreign Key to workspaces)
- user_id (Foreign Key to users)
- role (Enum: owner, admin, member, Default: member)
- created_at, updated_at (Timestamps)
- Unique constraint on (workspace_id, user_id)
```

#### Projects Table
```sql
- id (Primary Key)
- name (String, Required)
- description (Text, Nullable)
- color (String, Default: #6366f1)
- avatar (String, Nullable)
- workspace_id (Foreign Key to workspaces)
- owner_id (Foreign Key to users)
- status (Enum: active, completed, archived, Default: active)
- start_date (Date, Nullable)
- due_date (Date, Nullable)
- created_at, updated_at (Timestamps)
```

#### Tasks Table
```sql
- id (Primary Key)
- name (String, Required)
- description (Text, Nullable)
- status (Enum: todo, in_progress, completed, cancelled, Default: todo)
- priority (Enum: low, medium, high, urgent, Default: medium)
- project_id (Foreign Key to projects)
- assignee_id (Foreign Key to users, Nullable)
- creator_id (Foreign Key to users)
- parent_id (Foreign Key to tasks, Nullable)
- order (Integer, Default: 0)
- due_date (Date, Nullable)
- completed_at (Timestamp, Nullable)
- created_at, updated_at (Timestamps)
```

---

## API Endpoints

### Authentication Endpoints
```
POST /api/auth/register - User registration
POST /api/auth/login - User login
POST /api/auth/logout - User logout (Protected)
POST /api/auth/forgot-password - Send password reset email
POST /api/auth/reset-password - Reset password with token
```

### User Management Endpoints (Admin Only)
```
GET /api/admin/users - List users with pagination and filtering
POST /api/admin/users - Create new user
PUT /api/admin/users/{user} - Update user
DELETE /api/admin/users/{user} - Delete user
POST /api/admin/users/{user}/reset-password - Reset user password
GET /api/admin/users/am-users - Get account manager users
```

### Organization Management Endpoints
```
GET /api/admin/organization/profile - Get organization profile
PUT /api/admin/organization/profile - Update organization profile
POST /api/admin/organization/logo - Upload organization logo

GET /api/admin/organization-roles - List organization roles
POST /api/admin/organization-roles - Create organization role
PUT /api/admin/organization-roles/{role} - Update organization role
DELETE /api/admin/organization-roles/{role} - Delete organization role
GET /api/admin/organization-roles/{role}/users - Get role users

GET /api/admin/teams - List teams
POST /api/admin/teams - Create team
PUT /api/admin/teams/{team} - Update team
DELETE /api/admin/teams/{team} - Delete team
```

### Client Management Endpoints
```
GET /api/admin/clients - List clients with pagination and filtering
POST /api/admin/clients - Create new client
GET /api/admin/clients/{client} - Get client details
PUT /api/admin/clients/{client} - Update client
DELETE /api/admin/clients/{client} - Delete client
GET /api/admin/clients/account-managers - Get account manager users

GET /api/admin/clients/{client}/persons - List client persons
POST /api/admin/clients/{client}/persons - Create client person
GET /api/admin/clients/{client}/persons/{person} - Get client person
PUT /api/admin/clients/{client}/persons/{person} - Update client person
DELETE /api/admin/clients/{client}/persons/{person} - Delete client person
POST /api/admin/clients/{client}/persons/{person}/resend-invitation - Resend invitation
```

### Public Client Endpoints
```
POST /api/client/setup-password - Setup password for client person
```

### User Profile Endpoints (Protected)
```
GET /api/profile - Get user profile
PUT /api/profile - Update user profile
POST /api/profile/avatar - Upload user avatar
DELETE /api/profile/avatar - Delete user avatar
POST /api/profile/change-password - Change user password
```

### MFA Endpoints (Protected)
```
GET /api/mfa/status - Get MFA status
POST /api/mfa/setup - Setup MFA
POST /api/mfa/enable - Enable MFA
POST /api/mfa/disable - Disable MFA
POST /api/mfa/regenerate-backup-codes - Regenerate backup codes
```

### Project & Task Endpoints (Planned)
```
GET /api/workspaces - List workspaces
POST /api/workspaces - Create workspace
GET /api/workspaces/{workspace} - Get workspace
PUT /api/workspaces/{workspace} - Update workspace
DELETE /api/workspaces/{workspace} - Delete workspace

GET /api/projects - List projects
POST /api/projects - Create project
GET /api/projects/{project} - Get project
PUT /api/projects/{project} - Update project
DELETE /api/projects/{project} - Delete project

GET /api/tasks - List tasks
POST /api/tasks - Create task
GET /api/tasks/{task} - Get task
PUT /api/tasks/{task} - Update task
DELETE /api/tasks/{task} - Delete task
```

---

## Frontend Components

### Layout Components
- **AppLayout**: Main application layout with sidebar navigation
- **Sidebar**: Collapsible navigation sidebar with user profile
- **Header**: Page header with title and user actions
- **Navigation**: Role-based navigation menu

### Modal Components
- **UserModal**: Create/edit user with role assignment
- **ClientModal**: Create/edit client with account manager assignment
- **ClientPersonModal**: Create/edit client person with status management
- **OrganizationRoleModal**: Create/edit organization roles
- **TeamModal**: Create/edit teams with member management
- **UserGroupModal**: Create/edit user groups
- **MfaSetupModal**: Two-factor authentication setup

### Form Components
- **AvatarUpload**: Image upload with preview and validation
- **SearchableSelect**: Multi-select dropdown with search functionality
- **StatusToggle**: Toggle switch for active/inactive status
- **PasswordInput**: Password input with visibility toggle

### Table Components
- **DataTable**: Paginated table with search, filtering, and sorting
- **UserTable**: User listing with role display and actions
- **ClientTable**: Client listing with logo and account manager display
- **ClientPersonTable**: Client person listing with status management

### View Components
- **DashboardView**: Main dashboard with statistics and quick actions
- **OrgSettingsView**: Organization settings with tabbed interface
- **ClientDetailView**: Client detail page with company overview and persons
- **SettingsView**: User settings with profile, security, and notifications
- **LoginView**: Authentication page with login and forgot password
- **ClientPasswordSetupView**: Client password setup page

### Utility Components
- **Toast**: Notification system for success/error messages
- **LoadingSpinner**: Loading indicator for async operations
- **Tooltip**: Hover tooltips for additional information
- **ProfileIcon**: User avatar with fallback to initials

---

## Business Rules and Constraints

### User Management Rules
1. **Email Uniqueness**: Email addresses must be unique across all users
2. **Role Hierarchy**: Super admins can manage all users, admins cannot manage super admins
3. **Email Modification**: Only super admins can modify user email addresses
4. **Client Role Restriction**: "Client" organization role cannot be assigned through user management
5. **Client-Linked Users**: Users with client organization role cannot have their system/org roles changed
6. **User Deactivation**: Users can be deactivated but not permanently deleted

### Client Management Rules
1. **Client Person Workflow**: Pending users must complete password setup via invitation link
2. **Status Transitions**: 
   - Pending → Active (via password setup only)
   - Active ↔ Inactive (admin can change)
   - Cannot revert from Active/Inactive to Pending
3. **Email Restrictions**: Only super admins can modify activated client person emails
4. **Account Manager Assignment**: Must be users with AM organization role
5. **Logo Management**: Automatic favicon fetching from client websites
6. **Client Deletion**: Cascade delete client persons and associated user accounts

### Organization Rules
1. **Role Management**: System-defined roles (AM, PM, Client) are locked and cannot be deleted
2. **Custom Roles**: User-defined roles can be created, edited, and deleted
3. **Role Assignment**: Users can have multiple organization roles
4. **Team Management**: Teams belong to workspaces and have hierarchical roles
5. **Group Management**: User groups are for organizational purposes only

### Security Rules
1. **Password Requirements**: Minimum 8 characters with confirmation
2. **MFA Support**: Optional two-factor authentication with backup codes
3. **Session Management**: Remember me extends session to 30 days
4. **Token Expiration**: Password reset tokens expire in 24 hours
5. **API Protection**: All admin endpoints require authentication
6. **Role-Based Access**: Frontend and backend enforce role-based permissions

---

## Security and Authentication

### Authentication Methods
1. **Email/Password**: Primary authentication method
2. **Remember Me**: Extended session tokens for convenience
3. **Two-Factor Authentication**: TOTP-based MFA with backup codes
4. **Password Reset**: Secure token-based password recovery

### Authorization Levels
1. **Public Routes**: Login, register, password reset, client password setup
2. **Authenticated Routes**: User profile, settings, dashboard
3. **Admin Routes**: User management, organization settings, client management
4. **Super Admin Routes**: All admin routes plus super admin management

### Security Features
1. **CSRF Protection**: Laravel CSRF tokens for form submissions
2. **XSS Protection**: Input sanitization and output escaping
3. **SQL Injection Protection**: Eloquent ORM with parameterized queries
4. **Rate Limiting**: API rate limiting for authentication endpoints
5. **Secure Headers**: Security headers for XSS and clickjacking protection
6. **File Upload Security**: Image validation and secure file storage

---

## Email System

### Email Templates
1. **Password Reset**: Branded email template with reset link
2. **Client Invitation**: Branded email template for client password setup
3. **Password Change Notification**: Security notification for password changes
4. **Welcome Email**: New user welcome message

### Email Features
1. **Queue Processing**: Asynchronous email sending via Laravel queues
2. **Branded Design**: Consistent branding across all email templates
3. **Token Security**: Secure tokens with expiration for password operations
4. **Error Handling**: User-friendly error messages for email failures
5. **Resend Functionality**: Ability to resend invitation emails

### Email Jobs
1. **SendPasswordResetJob**: Handles password reset emails
2. **SendClientInvitationJob**: Handles client invitation emails
3. **SendPasswordChangeNotificationJob**: Handles password change notifications

---

## File Storage and Management

### Storage Systems
1. **AWS S3**: Primary storage for production files
2. **Local Storage**: Development and fallback storage
3. **Public Disk**: Accessible files like avatars and logos

### File Types
1. **User Avatars**: Profile pictures with validation
2. **Organization Logos**: Company logos with validation
3. **Client Logos**: Automatically fetched favicons from websites
4. **Document Uploads**: Future feature for project documents

### File Management
1. **Image Validation**: File type, size, and dimension validation
2. **Automatic Resizing**: Avatar and logo resizing for consistency
3. **Secure URLs**: Signed URLs for private file access
4. **Cleanup Jobs**: Automatic cleanup of orphaned files

---

## Future Enhancements

### Planned Features
1. **Project Management**: Full project and task management system
2. **Time Tracking**: Time tracking for tasks and projects
3. **Reporting**: Analytics and reporting dashboard
4. **Notifications**: Real-time notifications system
5. **File Sharing**: Document sharing and collaboration
6. **Calendar Integration**: Calendar view for tasks and deadlines
7. **Mobile App**: Native mobile application
8. **API Documentation**: Comprehensive API documentation
9. **Webhooks**: Webhook system for integrations
10. **Audit Logging**: Comprehensive audit trail

### Technical Improvements
1. **Performance Optimization**: Database indexing and query optimization
2. **Caching**: Redis caching for improved performance
3. **Search**: Full-text search capabilities
4. **Backup System**: Automated backup and recovery
5. **Monitoring**: Application monitoring and logging
6. **Testing**: Comprehensive test coverage
7. **Documentation**: Technical documentation and user guides

---

## Conclusion

Orbit IQ is a comprehensive project management and client relationship management system designed to meet the needs of agencies and direct clients. The system provides robust user management, client management, organization settings, and security features while maintaining scalability and extensibility for future enhancements.

The application follows modern development practices with a clean architecture, role-based access control, and comprehensive security measures. The modular design allows for easy maintenance and future feature additions while ensuring data integrity and user security.

This business requirements document serves as a comprehensive guide for understanding the system's functionality, technical implementation, and business rules. It should be updated as new features are added or existing functionality is modified.
