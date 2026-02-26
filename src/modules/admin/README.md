# Admin Module

## Overview
The Admin module is responsible for high-level system administration, user management, and access control. It provides the tools necessary to manage the organization's structure, user accounts, and their respective permissions within the WNG-ERP system.

## Key Features

### 1. User Management
- **User List**: Comprehensive view of all system users with search and filtering by department and status.
- **User Lifecycle**: Create new users, edit existing ones, and toggle account activation status.
- **Employee Integration**: New users are linked to existing Employee records from the HR module, ensuring data consistency across the organization.
- **Account Security**: Secure password management and administrative password resets.

### 2. Role & Permission Management (RBAC)
- **Granular Controls**: Utilizes Spatie's Laravel Permission package to provide a robust Role-Based Access Control system.
- **Role Configuration**: Create and edit roles (e.g., "Super Admin", "Project Manager", "Finance Officer") with custom names and descriptions.
- **Permission Mapping**: Assign specific system permissions to roles through an intuitive interface.
- **User Role Assignment**: Effortlessly assign or remove multiple roles for any system user.

### 3. Department Management
- **Organizational Structure**: Define and manage company departments.
- **User Allocation**: Assign users to their respective departments for reporting and scoped access.

### 4. Admin Dashboard
- **System Metrics**: Real-time statistics on total users, active roles, and departments.
- **Quick Actions**: Deep links to common administrative tasks.
- **Recent Activity**: Audit-style trail of recent administrative actions.
- **System Maintenance**: Tools for system-wide refreshes and maintenance tasks.

## Technical Architecture

### Backend (`app/Modules/Admin`)
- **Controllers**:
    - `UserController`: Handles all user-related CRUD operations and status toggling.
    - `RoleController`: Manages Role creation, updates, and permission synchronization.
    - `PermissionController`: Provides a read-only list of available system permissions.
- **Models**:
    - `App\Models\User`: The primary user model, integrated with Spatie's `HasRoles` trait.
    - `Spatie\Permission\Models\Role`: Standard Spatie Role model with custom attributes like `description`.
    - `Spatie\Permission\Models\Permission`: Standard Spatie Permission model.
- **Routes**: Grouped under the `/api/admin` prefix in `routes/api.php`, protected by relevant permission middleware.

### Frontend (`src/modules/admin`)
- **Views**:
    - `AdminDashboard.vue`: Main entry point for administrators.
    - `UserManagement.vue`: Interactive table for user operations.
    - `RoleManagement.vue`: Management interface for system roles and their permission matrices.
    - `DepartmentManagement.vue`: Tools for organizational structure management.
- **Composables**:
    - `useUsers`: State management and API interactions for user data.
    - `useRoles`: Logic for role fetching and creation.
    - `usePermissions`: Fetches available permissions for role mapping.
- **Integration**: Heavily utilizes shared components like `Pagination.vue` and `Modal.vue` for a consistent experience.

## Permissions & Security
Access to the Admin module is restricted to users with specific administrative permissions defined in `App\Constants\Permissions.php`. Key constants include:
- `USER_READ`, `USER_CREATE`, `USER_UPDATE`, `USER_DELETE`: User account control.
- `ROLE_READ`, `ROLE_CREATE`, `ROLE_UPDATE`, `ROLE_DELETE`: RBAC management.
- `DEPARTMENT_READ`, `DEPARTMENT_CREATE`, `DEPARTMENT_UPDATE`, `DEPARTMENT_DELETE`: Organizational management.
- `ADMIN_ACCESS`: General entry to the admin panel.

## Implementation Details
- **RBAC**: Permissions are checked both on the backend (via Laravel Middleware) and the frontend (via permission guards on buttons and routes) to ensure multilayered security.
- **Reactivity**: The UI uses Vue 3's Composition API for real-time updates when roles or users are modified.
- **Data Integrity**: Deletion of roles is blocked if they are still assigned to users, preventing accidental orphan accounts.
