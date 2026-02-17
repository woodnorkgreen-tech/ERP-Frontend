# Projects Module

The **Projects** module is the central engine of the WNG-ERP, managing the end-to-end lifecycle of event projects—from initial enquiry and technical surveying to budgeting, production, onsite setup, and final archival.

## 🚀 Core Lifecycle & Workflow

The module follows a strictly sequenced workflow involving specialized task types:

1.  **Enquiry (Lead)**: Capture initial project details from clients.
2.  **Survey Task**: Technical site assessment and requirement gathering.
3.  **Quote Task**: Generating financial estimates for client approval.
4.  **Budget Task**: Internal financial allocation for materials, labour, and logistics.
5.  **Design Task**: Creative visualization and technical drawings.
6.  **Procurement Task**: Material sourcing and vendor coordination.
7.  **Production Task**: Fabrication and workshop activities.
8.  **Logistics Task**: Transport and movement planning.
9.  **Setup Task**: Onsite implementation and construction.
10. **Handover Task**: Official project delivery to the client.
11. **Setdown Task**: Post-event dismantling and equipment return.
12. **Report Task**: Technical post-mortem and feedback.
13. **Archival Task**: Final closure and historical data logging.

## 🌟 Key Features

### 1. Project Command Center
A high-level interface for project managers to monitor the health, timeline, and status of all active projects in a single view.

### 2. Specialized Task Renderer
The module uses a `TaskRenderer.vue` system that dynamically loads specialized components based on the task's technical type (e.g., `LogisticsTask.vue`, `ProductionTask.vue`).

### 3. Deep Budgeting Integration
- **Material Budgeting**: Granular tracking of material consumption using the `MaterialsTask.vue`.
- **Labour Planning**: Assigning workshop and onsite teams with specific roles.
- **Logistics Integration**: Direct linkage with the Logistics module for vehicle and route assignments.
- **Budget Comparison**: Real-time tracking of *Quoted* vs *Actual* expenditure.

### 4. Team Resource Management
- **Category-Based Teams**: Teams are organized into **Workshop**, **Setup**, and **Setdown** groups.
- **Member Assignment**: Granular assignment of individual staff members to specific project phases.

### 5. Automated Notifications
Integrated notification system that triggers alerts for task assignments, budget approvals, and timeline deadlines.

## 🏗️ Technical Architecture

### Frontend Composition
- **Views**:
    - `ProjectsDashboard.vue`: Strategic overview and KPIs.
    - `ProjectsEnquiries.vue`: Lead management system.
    - `ProjectTasks.vue`: Operational task management for individual projects.
- **Composables**:
    - `useWorkflow.ts`: Manages task transition and status flow.
    - `useBudgetOperations.ts`: Heavy-duty logic for multi-currency budgeting and validation.
    - `useTeams.ts`: Team allocation logic.
    - `useTaskAssignment.ts`: User-to-task assignment logic.
- **Services**:
    - `budgetService.ts`: Core API calls for financial data.
    - `materialsService.ts`: Integration with the Stores/Inventory module.

### API Structure (Prefix: `/api/projects`)
| Endpoint | Description |
| :--- | :--- |
| `/enquiries` | Management of project leads |
| `/tasks` | Core task operations and rendering |
| `/budgets` | Comprehensive budgeting endpoints |
| `/teams` | Resource allocation and staff management |

---
*Last Updated: February 2026*
