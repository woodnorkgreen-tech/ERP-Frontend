# Finance & Accounts Module

The **Finance & Accounts** module (formerly Petty Cash Management) is a robust financial tracking system designed to manage petty cash requisitions, disbursements, top-ups, and project-based financial allocations within the WNG-ERP.

## 🌟 Key Features

### 1. Financial Dashboard (Overview)
- **Real-time Balance**: Displays the current safe balance with visual indicators (Low/Critical warnings).
- **Financial Summary**: High-level metrics for total top-ups, total disbursements, and monthly spending volume.
- **Transaction History**: Unified list of all financial movements (Inflow/Outflow).
- **Analytics & Trends**: Visual representation of spending patterns.

### 2. Requisition Management
- **Request Flow**: Employees can submit digital petty cash requests with tiered details (Purpose, Payee, Project Reference).
- **Bulk Payees**: Support for multi-payee distributions (e.g., Transport, Meals).
- **Approval Workflow**: Admins can Approve or Reject requests with mandatory reasoning for rejections.
- **Digital Signatures**: Integrated signature pads for confirming item receipt by payees.
- **PDF Vouchers**: Auto-generation of official petty cash vouchers for documentation.

### 3. Disbursement System
- **Processing**: Converts approved requisitions into actual cash outflows.
- **Validation**: Real-time balance checks to prevent overshooting available funds.
- **Classification**: Automatic categorization (Agencies, Operations, Admin, etc.) for tax and reporting.
- **Payment Methods**: Support for Cash, M-Pesa, Bank Transfer, and other methods.

### 4. Funds Management (Top-ups)
- **Replenishment**: Add funds to the petty cash vault.
- **Source Tracking**: Track where top-ups originate from (Bank, Director, etc.).
- **FIFO Logic**: Balance is consumed based on the First-In-First-Out principle for accurate accounting.

### 5. Project Budget Integration
- **Project Tracking**: Link disbursements directly to project job numbers.
- **Budget Monitoring**: Real-time tracking of how much project budget has been "consumed" via petty cash.
- **Cross-Departmental Sync**: Automatic updates to project managers on financial status.

## 🏗️ Technical Architecture

### Frontend Structure
- **Vue 3 Components**: Composition API-based modular UI.
- **Pinia Store (`pettyCashStore.ts`)**: Centralized state management for transactions, balance, and loading states.
- **Services (`pettyCashService.ts`)**: Decoupled API logic with built-in retry mechanisms and permission enforcement.
- **Composables**:
  - `useErrorHandler`: Standardized error processing and user feedback.
  - `usePermissions`: Granular role-based access control.

### API Endpoints (Prefix: `/api/finance/petty-cash`)
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/balance` | Fetch current vault balance |
| `GET` | `/transactions` | List all financial movements |
| `POST` | `/requisitions` | Create new petty cash request |
| `POST` | `/disbursements` | Process cash disbursement |
| `POST` | `/top-ups` | Add funds to the vault |
| `GET` | `/budgets/summary` | Project-based budget consumption report |

## 🔐 Roles & Permissions

- **Requester (Employee)**: Can create requisitions and view their own history.
- **Approver (Accounts/HOD)**: Can approve/reject requisitions.
- **Disburser (Accounts)**: Can process payments, add top-ups, and manage the vault.
- **Super Admin**: Complete system oversight, data reset, and advanced configuration.

## 📊 Reporting & Maintenance

- **Excel Exports**: Bulk export transaction data for external auditing.
- **Template Uploads**: Mass processing of disbursements via CSV/Excel templates.
- **Data Integrity**: Built-in "Recalculate Balance" utility to fix synchronization issues.

---
*Last Updated: February 2026*
