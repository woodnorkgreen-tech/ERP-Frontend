# Production Module

A comprehensive production management module for work order management, job cards, production scheduling, and resource allocation tailored for events fabrication companies.

## Current Features

### Work Orders
- Create and manage work orders linked to projects/enquiries
- Track work order status (pending, in_progress, completed, on_hold, cancelled)
- Prioritize work orders (low, medium, high, urgent)
- Set due dates and track timelines
- Assign work to users/departments
- View detailed work order information
- Search and filter work orders

### Job Cards (NEW)
- **Technician Time Tracking**: Clock in/out functionality with real-time tracking
- **Fabrication-Specific Types**: Stage, Booth, Signage, Custom Items
- **Work Center Management**: Fabrication, Assembly, Finishing, Painting, Electrical
- **Material Requirements**: Track materials and costs per job card
- **Quality Checkpoints**: Ensure fabrication standards are met
- **Mobile-Responsive**: Touch-friendly interfaces for shop floor use
- **Status Management**: Planned → Released → In Progress → Completed workflow
- **Efficiency Tracking**: Compare planned vs actual hours

### HR & Analytics
- **Technician Performance Reports**: Daily, weekly, monthly analytics
- **Time Tracking Reports**: Regular hours, overtime, break time
- **Production Analytics**: Completion rates, utilization metrics
- **Cost Analysis**: Labor cost breakdown and efficiency ratings
- **Export Functionality**: CSV reports for HR and strategic planning

## Module Structure

```
production/
├── types/               # TypeScript interfaces and types
│   ├── index.ts         # Work Order, Job Card, Technician types
├── services/            # API service layer
│   ├── jobCards.ts      # Job cards and time tracking API
├── composables/         # Vue composables for state management
│   ├── useJobCards.ts   # Job card management
│   └── useProductionReports.ts # HR analytics
├── components/          # Reusable Vue components
│   ├── WorkOrderForm.vue      # Create/Edit work order modal
│   ├── JobCardForm.vue        # Create/Edit job card modal
│   └── JobCardDetails.vue     # View job card details with time tracking
└── views/              # Page components
    ├── WorkOrdersView.vue     # Work orders list and management
    ├── JobCardsView.vue       # Job cards list and management
    ├── JobCardDetailsView.vue # Dedicated job card details page
    ├── HRReportsView.vue      # HR analytics and reports
    └── ProductionDashboard.vue # Production overview dashboard
```

## Available Routes

- `/production/work-orders` - Work Orders management interface
- `/production/job-cards` - Job Cards management interface
- `/production/job-cards/:id` - Individual Job Card details
- `/production/reports` - HR Reports and analytics
- `/production/dashboard` - Production dashboard

## User Roles & Access

### Production Users
- Create and manage job cards
- Clock in/out time tracking
- Start/complete job cards
- View assigned work

### HR Users
- View technician performance reports
- Access time tracking analytics
- Export production reports
- Monitor labor costs

### Admins
- Full access to all features
- System configuration
- User management

## Getting Started

### Job Card Management
1. Navigate to `/production/job-cards`
2. Click "+ Create Job Card" to create new job cards
3. Assign to technicians and work centers
4. Track progress through the production workflow

### Time Tracking for Technicians
1. View assigned job cards
2. Click "Clock In" to start tracking time
3. Add work descriptions
4. Click "Clock Out" when finished
5. Automatic efficiency calculations

### HR Reporting
1. Navigate to `/production/reports`
2. Select period (week/month/quarter/year)
3. View technician performance metrics
4. Export reports for payroll and strategic planning

## Integration

The module is automatically integrated into the routing system and sidebar navigation for users with the "Production" role.

### For Super Admin
Production routes appear under the "Production" department in the sidebar.

### For Production Users
The Production dashboard is automatically set as their default landing page upon login.

## Future Enhancements

- [ ] Material inventory integration
- [ ] Quality control mobile app
- [ ] Production scheduling calendar
- [ ] Cost estimation tools
- [ ] Photo documentation for quality checks
- [ ] Mobile app for shop floor technicians
