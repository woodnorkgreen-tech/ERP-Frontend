import type { ProcurementTaskData, ProjectInfo } from '@/modules/projects/services'

export class CSVExporter {
  private static escapeField(field: string): string {
    if (field.includes('"')) {
      field = field.replace(/"/g, '""')
    }
    if (field.includes(',') || field.includes('\n') || field.includes('"')) {
      field = `"${field}"`
    }
    return field
  }

  static exportProcurementData(
    data: ProcurementTaskData,
    projectInfo: ProjectInfo
  ): void {
    const rows: string[][] = []

    // Header
    rows.push([`Procurement Report - ${projectInfo.enquiryTitle}`])
    rows.push([`Generated: ${new Date().toLocaleString()}`])
    rows.push([`Project ID: ${projectInfo.projectId}`])
    rows.push([`Client: ${projectInfo.clientName}`])
    rows.push([`Venue: ${projectInfo.eventVenue}`])
    rows.push([])

    // Summary
    rows.push(['SUMMARY'])
    rows.push(['Total Budget', `KES ${data.budgetSummary.materialsTotal.toLocaleString()}`])
    rows.push(['Total Items', data.procurementItems.length.toString()])
    rows.push(['Completion', `${Math.round((data.procurementItems.filter(item =>
      ['received', 'hired'].includes(item.availabilityStatus)
    ).length / data.procurementItems.length) * 100)}%`])
    rows.push([])

    // Status breakdown
    rows.push(['STATUS BREAKDOWN'])
    rows.push(['Status', 'Count'])
    const statuses = ['available', 'ordered', 'received', 'hired', 'cancelled']
    statuses.forEach(status => {
      const count = data.procurementItems.filter(item => item.availabilityStatus === status).length
      if (count > 0) {
        rows.push([status, count.toString()])
      }
    })
    rows.push([])

    // Column headers
    rows.push([
      'Element',
      'Description',
      'Quantity',
      'Unit',
      'Unit Cost',
      'Total Cost',
      'Vendor',
      'Status'
    ])

    // Data rows
    data.procurementItems.forEach(item => {
      rows.push([
        item.elementName,
        item.description,
        item.quantity.toString(),
        item.unitOfMeasurement,
        item.budgetUnitPrice.toString(),
        item.budgetTotalPrice.toString(),
        item.vendorName || 'Not assigned',
        item.availabilityStatus
      ])
    })

    // Convert to CSV
    const csv = rows
      .map(row => row.map(field => this.escapeField(field)).join(','))
      .join('\n')

    // Download
    this.downloadCSV(csv, `procurement-${projectInfo.projectId}-${Date.now()}.csv`)
  }

  static exportElementSummary(
    data: ProcurementTaskData,
    projectInfo: ProjectInfo
  ): void {
    const rows: string[][] = []

    // Header
    rows.push([`Element Summary - ${projectInfo.enquiryTitle}`])
    rows.push([`Generated: ${new Date().toLocaleString()}`])
    rows.push([])

    // Column headers
    rows.push([
      'Element Name',
      'Total Items',
      'Total Budget',
      'Available',
      'Ordered',
      'Received',
      'Hired',
      'Cancelled'
    ])

    // Group by element
    const elementGroups = new Map<string, typeof data.procurementItems>()
    data.procurementItems.forEach(item => {
      if (!elementGroups.has(item.elementName)) {
        elementGroups.set(item.elementName, [])
      }
      elementGroups.get(item.elementName)!.push(item)
    })

    // Data rows
    elementGroups.forEach((items, elementName) => {
      const totalBudget = items.reduce((sum, item) => sum + item.budgetTotalPrice, 0)
      const statusCounts = {
        available: items.filter(item => item.availabilityStatus === 'available').length,
        ordered: items.filter(item => item.availabilityStatus === 'ordered').length,
        received: items.filter(item => item.availabilityStatus === 'received').length,
        hired: items.filter(item => item.availabilityStatus === 'hired').length,
        cancelled: items.filter(item => item.availabilityStatus === 'cancelled').length
      }

      rows.push([
        elementName,
        items.length.toString(),
        `KES ${totalBudget.toLocaleString()}`,
        statusCounts.available.toString(),
        statusCounts.ordered.toString(),
        statusCounts.received.toString(),
        statusCounts.hired.toString(),
        statusCounts.cancelled.toString()
      ])
    })

    // Convert to CSV
    const csv = rows
      .map(row => row.map(field => this.escapeField(field)).join(','))
      .join('\n')

    // Download
    this.downloadCSV(csv, `procurement-elements-${projectInfo.projectId}-${Date.now()}.csv`)
  }

  private static downloadCSV(csv: string, filename: string): void {
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    const url = URL.createObjectURL(blob)

    link.setAttribute('href', url)
    link.setAttribute('download', filename)
    link.style.visibility = 'hidden'

    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)

    URL.revokeObjectURL(url)
  }
}
