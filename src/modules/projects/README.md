# Projects Module - Comprehensive Documentation

The **Projects Module** is the core operational engine of the WNG-ERP. it manages the complete end-to-end lifecycle of event projects, coordinating multiple departments and technical processes from the initial client enquiry to final archival.

---

## 1. Module Overview & Lifecycle

The module follows a strictly sequenced departmental workflow (Workflow Engine) that ensures technical and financial accountability at every stage.

### 🔄 The Project Lifecycle
1.  **Enquiry (Lead)**: Capture initial project details (Title, Client, Dates, Venue) via `ProjectsEnquiries.vue`.
2.  **Survey Task**: Technical site assessment. Includes checklists and photo documentation.
3.  **Materials Task (BOM)**: Design/Production team defines the specifications and Bill of Materials using `MaterialsTask.vue`. 
    *   *Strict Gate*: Requires approval from both Project Officer and Production before budgeting can begin.
4.  **Budget Task**: Project Managers assign costs to materials, labour, logistics, and overheads.
    *   *Features*: Material import from BOM, variance analysis, versioning.
5.  **Quote Task**: Financial proposal generation for the client.
    *   *Features*: Smart merge with budget, margin controls, client-ready PDF generation via `FlashQuoter.vue`.
6.  **Design Task**: Management of technical drawings and creative assets with versioning.
7.  **Procurement Task**: Material sourcing, vendor coordination, and PO generation based on approved budgets.
8.  **Production Task**: Fabrication tracking, job cards, and quality checkpoints.
9.  **Logistics Task**: Transport planning, vehicle assignment, and delivery/return checklists.
10. **Setup Task**: Onsite implementation tracking, issue management, and documentation.
11. **Handover Task**: Final delivery to client with sign-off and satisfaction surveys.
12. **Setdown Task**: Event dismantling and equipment reconciliation.
13. **Archival Task**: Final closure, memorial report, and financial/technical post-mortem.

## 🔄 Detailed Conversion Flow: Enquiry to Project

The transition from a "Lead" (Enquiry) to a "Mission" (Project) is a critical technical sequence in the WNG-ERP.

### 1. Lead Capture (Enquiry Creation)
*   **Frontend**: Handled by ` ` and the creation modal. It captures client data, venue, and estimated dates.
*   **Backend**: `EnquiryController@store` executes:
    *   **ID Generation**: Assigns a temporary `ENQ-MM-YYYY-NNN` (e.g., `ENQ-11-2025-001`).
    *   **Workflow Seeding**: `EnquiryWorkflowService` creates the initial set of tasks (Survey, Design, Materials) based on the project type.
    *   **Initial Status**: Set to `enquiry_logged`.

### 2. Technical Validation & Costing
*   The project lead completes the **Survey Task** and **Materials Task**.
*   **Strict Gate**: The system prevents budgeting until the Materials Task is approved by both the **Project Officer** and **Production Manager**.
*   The Project Manager then completes the **Budget Task** and **Quote Task**.

### 3. Client Approval & Activation
The formal conversion happens during the **Quote Approval Task**.
*   **Frontend**: `QuoteApprovalTask.vue` provides the "Activate Project" interface once the internal quote decision is saved as "Approved".
*   **API Call**: `POST /api/projects/enquiries/{id}/approve-quote`.
*   **Backend Implementation (`ProjectEnquiry@approveQuote`)**:
    *   **Job Number Generation**: Generates the official, permanent `WNG-MM-YYYY-NNN` number.
    *   **Financial Locking**: Sets `quote_approved = true` and logs the timestamp and approver.
    *   **Project Initialization**: Creates a record in the `projects` table, linking it to the enquiry.
    *   **Global Broadcasting**: Dispatches the `ProjectActivated` event and pushes notifications to all users.
    *   **Achievement Signal**: Triggers the "Kinetic Achievement" popup in the frontend for a premium user experience.

### 4. Transition to Active Project
*   **State Management**: Once the `job_number` is assigned, the record automatically moves from the "Enquiries" view to the "Active Projects" view in the frontend.
*   **Execution Tasks**: The system now enables execution-focused tasks like **Procurement**, **Production**, and **Logistics**.

---

## 2. Technical Architecture

### 🏗️ Backend Implementation (Laravel)

The backend is built with a modular approach, combining core controllers and specialized services.

#### Key Models & Relationships
- **`Project`**: Root entity linked to an `Enquiry`.
- **`ProjectEnquiry`**: Core proposal data (Jobs, Venue, Client).
- **`EnquiryTask`**: The workflow unit. Each stage (Budget, Quote, etc.) is an `EnquiryTask`.
- **Specialized Data Tables**: To keep the system performant, specialized data is stored in dedicated tables or JSON columns:
    - `TaskMaterialsData`, `TaskBudgetData`, `TaskQuoteData`, `TaskProcurementData`, `TaskProductionData`.
- **Versioning Tables**: `BudgetVersion`, `MaterialVersion`, `QuoteVersion` store snapshots for audit trails.

#### Workflow & Security
- **Strict Approval Gates**: Logic in `BudgetService.php` and `MaterialsController.php` enforces that tasks cannot proceed until specific departmental approvals are met.
- **Permission System**: Leverages `Spatie\Permission` to restrict actions (e.g., `projects.budget.approve`).

#### Main Controllers/Services
- `EnquiryController`: Management of leads and project transitions.
- `TaskController`: Dynamic task retrieval and status management.
- `BudgetService`: Heavy-duty logic for variance analysis, materials import, and pricing math.
- `MaterialsController`: Handles granular element/material lists and BOM versioning.

---

### 💻 Frontend Implementation (Vue 3)

The frontend uses a dynamic, task-based UI architecture.

#### Core UI Components
- **`ProjectTasks.vue`**: The main operations hub for a project, showing the task timeline.
- **`TaskRenderer.vue`**: A dynamic component that renders the specific task interface based on its `type` (e.g., `BudgetTask.vue`).
- **`ProjectsCommandCenter.vue`**: A high-level management dashboard for multi-project monitoring.

#### State Management & Composables
The module relies on specialized composables to encapsulate complex business logic:
- `useWorkflow.ts`: Handles task transitions and "Next Step" logic.
- `useMaterials.ts`: Logic for element/material management.
- `useBudget.ts`: Financial calculations and variance analysis.
- `useTaskAssignment.ts`: Manages assignment of users to specific tasks.

#### Components Library
- **`tasks/`**: Contains specialized UIs for every lifecycle stage (e.g., `LogisticsTask.vue`, `ProductionTask.vue`).
- **`shared/`**: Reusable components like unit selectors, status badges, and activity feeds.

---

## 3. Key Technical Patterns

### 📊 Smart Merge & Sync
The **Quote-Budget Sync** system allows project managers to pull updates from the budget into the quote without overwriting custom client pricing. It uses a `persistent_id` matching algorithm to track items across different task types.

### 📐 Variance Analysis
The `analyzeMaterialVariances` logic in the backend provides a granular "What has changed?" report when importing specifications, highlighting added, removed, or updated items with quantity and price impact.

### 📝 Audit Trails & History
Every significant action (approval, rejection, data save) is logged in the `action_logs` table and visible via the `ActionLogViewer.vue` in the frontend sidebar.

---

## 4. Database Schema Highlights

- **`project_enquiries`**: Main project header.
- **`enquiry_tasks`**: List of tasks within a project (type, status, assignee).
- **`task_budget_data`**: JSON-heavy storage for project finances.
- **`task_materials_data`**: Element-based BOM storage.
- **`project_elements` / `element_materials`**: Normalized storage for reused templates.

---

## 🚀 Development & Maintenance

### Adding a New Task Type
1.  Add the type to the `EnquiryTask` model/constants in the backend.
2.  Create the corresponding Vue component in `frontend/src/modules/projects/components/tasks/`.
3.  Register the component in `TaskRenderer.vue`.
4.  Implement the specialized data model and controller logic in the backend.

---
*Generated by Antigravity AI - WNG-ERP Technical Documentation*
