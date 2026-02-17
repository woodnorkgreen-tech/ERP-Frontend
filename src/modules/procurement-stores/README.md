# Procurement & Stores Module

The **Procurement & Stores** module is an integrated supply chain management system within the WNG-ERP, handling everything from vendor management and item requisition to inventory control and billing.

## 🚀 Sub-Modules

### 1. Procurement
Manages the end-to-end purchasing lifecycle:
- **Supplier Registry**: Centralized database of vendors with contact details and payment terms.
- **Stock Requisitions**: Internal requests for items with a multi-stage approval workflow.
- **Purchase Orders (LPOs)**: Generation of official LPOs, including PDF generation and automated email dispatch to vendors.
- **Goods Receipt Notes (GRN)**: Formal intake process to reconcile delivered goods against open Purchase Orders.
- **Billing & Payments**: Integrated system for recording vendor invoices (Bills) and tracking payment status (Pending, Partial, Fully Paid).

### 2. Stores (Inventory Management)
Real-time tracking of physical assets and materials:
- **Materials Library**: Comprehensive list of all items, categorized with technical specifications.
- **Stock Operations**:
    - **Check-In/Out**: Real-time logging of individual items entering or leaving the warehouse.
    - **Batch Operations**: Higher-efficiency bulk check-ins/outs for large project deployments.
- **Returns & Defectives**: Management of items returning from projects and tracking damaged or non-functional stock.
- **Inventory Logs**: Historical audit trail of every stock movement for accountability.

## 🌟 Key Features

### ⚖️ Technical Reconciliation (LPO → GRN)
Automated verification system that ensures items billed by vendors match the quantities received and the original order specifications.

### 💰 Financial Integration
Direct linkage between the procurement flow and the billing system, allowing for seamless recording of financial liabilities as soon as goods are received.

### 📦 Batch Inventory Handling
Optimized workflows for handling massive volumes of stock, specifically designed for rapid setup and setdown phases of event projects.

## 🏗️ Technical Architecture

### Frontend Composition
- **Views**:
    - `procurement/`: Dashboard, Supplier Management, Requisitions, LPOs, GRNs, and Billing.
    - `stores/`: Dashboard, Materials Library, Stock In/Out, Returns, and Reports.
- **Shared Architecture**:
    - **Composables**: Centralized logic for each entity (`useSuppliers.ts`, `usePurchaseOrders.ts`, `useInventory.ts`, etc.).
    - **Types**: Heavily typed interfaces to ensure data integrity across the procurement workflow.

### API Structure (Prefix: `/api/procurement-stores`)
| Endpoint | Description |
| :--- | :--- |
| `/suppliers` | Vendor and contact management |
| `/requisitions` | Internal item requests and approvals |
| `/purchase-orders` | LPO generation and submission |
| `/goods-receipt-notes` | Receipt confirmation and reconciliation |
| `/bills` | Vendor invoice and payment tracking |
| `/inventory` | Core stock level and movement data |

---
*Last Updated: February 2026*
