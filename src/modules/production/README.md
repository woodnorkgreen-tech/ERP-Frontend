# Production Module

A comprehensive production management module for work order management, production scheduling, and resource allocation.

## Current Features

### Work Orders
- Create and manage work orders linked to projects/enquiries
- Track work order status (pending, in_progress, completed, on_hold, cancelled)
- Prioritize work orders (low, medium, high, urgent)
- Set due dates and track timelines
- Assign work to users/departments
- View detailed work order information
- Search and filter work orders

## Module Structure

```
production/
├── types/               # TypeScript interfaces and types
├── services/            # API service layer
├── composables/         # Vue composables for state management
├── components/          # Reusable Vue components
│   ├── WorkOrderForm.vue      # Create/Edit work order modal
│   └── WorkOrderDetails.vue   # View work order details
└── views/              # Page components
    └── WorkOrdersView.vue     # Work orders list and management
```

## Available Routes

- `/production/work-orders` - Work Orders management interface

## Getting Started

### View Work Orders
1. Navigate to `/production/work-orders`
2. See all work orders in a paginated table
3. Use filters to find specific work orders by:
   - Status (pending, in_progress, completed, on_hold, cancelled)
   - Priority (low, medium, high, urgent)
   - Search by work order number or title

### Create a Work Order
1. Click "+ New Work Order" button
2. Fill in the form:
   - Work Order Number (unique)
   - Title
   - Quantity to produce
   - Status
   - Priority
   - Specifications (optional)
   - Due date (optional)
3. Submit to create

### Edit a Work Order
1. Click "Edit" on any work order row
2. Update the details
3. Save changes

### View Details
1. Click "View" on any work order
2. See full information including:
   - Work order details
   - Project information
   - Timeline
   - Assignment details

### Delete a Work Order
1. Click "Delete" on a work order row
2. Confirm deletion

## Integration

The module is automatically integrated into the routing system and sidebar navigation for users with the "Production" role.

### For Super Admin
Production routes appear under the "Production" department in the sidebar.

### For Production Users
The Production module dashboard is automatically set as their default landing page upon login.

## Future Features

- Job Cards (resource allocation per work order)
- Production Schedules
- Quality Control tracking
- Inventory management for production
- Production analytics and reporting
