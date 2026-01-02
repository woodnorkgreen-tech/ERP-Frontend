import { ref } from 'vue'
import html2pdf from 'html2pdf.js'
import type { ProjectEnquiry } from '../types/enquiry'

export function useProjectPDF() {
  const isGenerating = ref(false)

  const generateProjectPDF = async (enquiry: ProjectEnquiry) => {
    isGenerating.value = true

    try {
      // Create HTML content
      const content = createPDFContent(enquiry)

      // PDF options
      const options = {
        margin: 10,
        filename: `Project-${enquiry.enquiry_number}.pdf`,
        image: { type: 'jpeg' as const, quality: 0.98 },
        html2canvas: { scale: 2, useCORS: true },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' as const }
      }

      // Generate PDF
      await html2pdf().set(options).from(content).save()

      return { success: true }
    } catch (error) {
      console.error('PDF generation error:', error)
      return { success: false, error }
    } finally {
      isGenerating.value = false
    }
  }

  const generateMultipleProjectsPDF = async (enquiries: ProjectEnquiry[]) => {
    isGenerating.value = true

    try {
      let combinedContent = '<div style="font-family: Arial, sans-serif;">'

      enquiries.forEach((enquiry, index) => {
        combinedContent += createPDFContent(enquiry)

        // Add page break between projects (except last one)
        if (index < enquiries.length - 1) {
          combinedContent += '<div style="page-break-after: always;"></div>'
        }
      })

      combinedContent += '</div>'

      const options = {
        margin: 10,
        filename: `Projects-Export-${new Date().getTime()}.pdf`,
        image: { type: 'jpeg' as const, quality: 0.98 },
        html2canvas: { scale: 2, useCORS: true },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' as const }
      }

      await html2pdf().set(options).from(combinedContent).save()

      return { success: true }
    } catch (error) {
      console.error('Bulk PDF generation error:', error)
      return { success: false, error }
    } finally {
      isGenerating.value = false
    }
  }

  const createPDFContent = (enquiry: ProjectEnquiry): string => {
    const statusLabel = getStatusLabel(enquiry.status)
    const priorityLabel = enquiry.priority?.toUpperCase() || 'N/A'
    const deliverables = parseProjectScope(enquiry.project_scope)
    const tasks = enquiry.enquiryTasks || []

    // metrics
    const completedTasks = tasks.filter(t => t.status === 'completed').length
    const totalTasks = tasks.length
    const progress = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0

    const brandingColor = '#15803d' // Woodwork Green (Green-700)
    const accentColor = '#22c55e' // Green-500

    return `
      <div style="font-family: 'Helvetica Neue', Arial, sans-serif; max-width: 800px; color: #1f2937; line-height: 1.4; font-size: 12px;">
        
        <!-- Header -->
        <div style="background: ${brandingColor}; color: white; padding: 20px 25px; border-radius: 4px 4px 0 0; display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 20px;">
          <div>
            <h1 style="margin: 0; font-size: 24px; font-weight: 700; letter-spacing: 0.5px;">PROJECT DATA SHEET</h1>
            <p style="margin: 5px 0 0 0; opacity: 0.9; font-size: 11px;">ENQUIRY #${enquiry.enquiry_number}</p>
          </div>
          <div style="text-align: right;">
            <div style="font-size: 11px; opacity: 0.9;">GENERATED ON</div>
            <div style="font-weight: 600; font-size: 13px;">${new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }).toUpperCase()}</div>
          </div>
        </div>

        <!-- Executive Summary -->
        <div style="display: flex; gap: 15px; margin-bottom: 25px;">
          <div style="flex: 1; background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 4px; padding: 12px;">
            <div style="font-size: 10px; color: #64748b; font-weight: 700; text-transform: uppercase; margin-bottom: 4px;">Project Status</div>
            <div style="font-size: 14px; font-weight: 700; color: ${addonStatusColor(enquiry.status)};">${statusLabel.toUpperCase()}</div>
          </div>
          <div style="flex: 1; background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 4px; padding: 12px;">
            <div style="font-size: 10px; color: #64748b; font-weight: 700; text-transform: uppercase; margin-bottom: 4px;">Task Progress</div>
            <div style="font-size: 14px; font-weight: 700; color: #0f172a;">${progress}% COMPLETE</div>
            <div style="background: #e2e8f0; height: 4px; border-radius: 2px; margin-top: 6px; overflow: hidden;">
              <div style="background: ${accentColor}; width: ${progress}%; height: 100%;"></div>
            </div>
          </div>
           <div style="flex: 1; background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 4px; padding: 12px;">
            <div style="font-size: 10px; color: #64748b; font-weight: 700; text-transform: uppercase; margin-bottom: 4px;">Priority Level</div>
            <div style="font-size: 14px; font-weight: 700; color: ${getPriorityColor(enquiry.priority)};">${priorityLabel}</div>
          </div>
        </div>

        <div style="display: flex; gap: 25px; margin-bottom: 25px;">
          
          <!-- Column 1: Client & Contact -->
          <div style="flex: 1;">
             <h3 style="border-bottom: 2px solid ${brandingColor}; color: ${brandingColor}; font-size: 13px; font-weight: 700; margin: 0 0 10px 0; padding-bottom: 4px; text-transform: uppercase;">Client Information</h3>
             <table style="width: 100%; border-collapse: collapse; font-size: 11px;">
               <tr>
                 <td style="padding: 4px 0; color: #64748b; font-weight: 600; width: 35%;">CLIENT NAME</td>
                 <td style="padding: 4px 0; font-weight: 600;">${getClientName(enquiry)}</td>
               </tr>
               <tr>
                 <td style="padding: 4px 0; color: #64748b; font-weight: 600;">CONTACT</td>
                 <td style="padding: 4px 0;">${enquiry.contact_person || '-'}</td>
               </tr>
                <tr>
                 <td style="padding: 4px 0; color: #64748b; font-weight: 600;">PHONE</td>
                 <td style="padding: 4px 0;">${(enquiry.client as any)?.phone || '-'}</td>
               </tr>
                <tr>
                 <td style="padding: 4px 0; color: #64748b; font-weight: 600;">EMAIL</td>
                 <td style="padding: 4px 0;">${(enquiry.client as any)?.email || '-'}</td>
               </tr>
             </table>
          </div>

          <!-- Column 2: Project Details -->
          <div style="flex: 1;">
            <h3 style="border-bottom: 2px solid ${brandingColor}; color: ${brandingColor}; font-size: 13px; font-weight: 700; margin: 0 0 10px 0; padding-bottom: 4px; text-transform: uppercase;">Project Particulars</h3>
             <table style="width: 100%; border-collapse: collapse; font-size: 11px;">
               <tr>
                 <td style="padding: 4px 0; color: #64748b; font-weight: 600; width: 35%;">TITLE</td>
                 <td style="padding: 4px 0; font-weight: 600;">${enquiry.title}</td>
               </tr>
               ${enquiry.job_number ? `
               <tr>
                 <td style="padding: 4px 0; color: #64748b; font-weight: 600;">JOB #</td>
                 <td style="padding: 4px 0;">${enquiry.job_number}</td>
               </tr>` : ''}
              <tr>
                 <td style="padding: 4px 0; color: #64748b; font-weight: 600;">VENUE</td>
                 <td style="padding: 4px 0;">${enquiry.venue || 'N/A'}</td>
               </tr>
               <tr>
                 <td style="padding: 4px 0; color: #64748b; font-weight: 600;">OFFICER</td>
                 <td style="padding: 4px 0;">${enquiry.project_officer?.name || 'Unassigned'}</td>
               </tr>
             </table>
          </div>
        </div>
        
        <!-- Timeline Section (Horizontal) -->
        <div style="margin-bottom: 25px; background: #fff; border: 1px solid #e2e8f0; border-radius: 4px; padding: 15px;">
           <h3 style="color: #64748b; font-size: 11px; font-weight: 700; margin: 0 0 10px 0; text-transform: uppercase;">Project Schedule</h3>
           <div style="display: flex; justify-content: space-between;">
              <div style="flex: 1; border-right: 1px solid #e2e8f0; padding-right: 10px;">
                 <div style="font-size: 10px; color: #94a3b8; font-weight: 600; text-transform: uppercase;">Received</div>
                 <div style="font-weight: 600;">${formatDate(enquiry.date_received || enquiry.created_at || null)}</div>
              </div>
               <div style="flex: 1; border-right: 1px solid #e2e8f0; padding: 0 10px;">
                 <div style="font-size: 10px; color: #94a3b8; font-weight: 600; text-transform: uppercase;">Expected Delivery</div>
                 <div style="font-weight: 600;">${formatDate(enquiry.expected_delivery_date || null)}</div>
              </div>
              ${(enquiry as any).event_date ? `
               <div style="flex: 1; border-right: 1px solid #e2e8f0; padding: 0 10px;">
                 <div style="font-size: 10px; color: #94a3b8; font-weight: 600; text-transform: uppercase;">Event Date</div>
                 <div style="font-weight: 600;">${formatDate((enquiry as any).event_date)}</div>
              </div>` : ''}
               <div style="flex: 1; padding-left: 10px;">
                 <div style="font-size: 10px; color: #94a3b8; font-weight: 600; text-transform: uppercase;">Days Remaining</div>
                 <div style="font-weight: 600;">${calculateDaysRemaining(enquiry.expected_delivery_date)}</div>
              </div>
           </div>
        </div>

        <!-- Description & Scope Grid -->
        <div style="display: flex; gap: 25px; margin-bottom: 25px;">
          <div style="flex: 3;">
             <h3 style="border-bottom: 2px solid ${brandingColor}; color: ${brandingColor}; font-size: 13px; font-weight: 700; margin: 0 0 10px 0; padding-bottom: 4px; text-transform: uppercase;">Description of Works</h3>
             <div style="background: #f8fafc; padding: 12px; border-radius: 4px; font-size: 11px; color: #334155; text-align: justify;">
                ${enquiry.description || 'No description provided.'}
             </div>
          </div>
          
          <div style="flex: 2;">
             <h3 style="border-bottom: 2px solid ${brandingColor}; color: ${brandingColor}; font-size: 13px; font-weight: 700; margin: 0 0 10px 0; padding-bottom: 4px; text-transform: uppercase;">Deliverables</h3>
             <div style="background: #f8fafc; padding: 12px; border-radius: 4px; border: 1px solid #e2e8f0;">
                <ul style="margin: 0; padding: 0 0 0 15px; font-size: 11px; color: #334155;">
                  ${deliverables.length > 0
        ? deliverables.map(d => `<li style="margin-bottom: 4px;">${d}</li>`).join('')
        : '<li>As per description</li>'}
                </ul>
             </div>
          </div>
        </div>

        <!-- Detailed Tasks Table -->
        <div style="margin-bottom: 25px;">
           <h3 style="border-bottom: 2px solid ${brandingColor}; color: ${brandingColor}; font-size: 13px; font-weight: 700; margin: 0 0 10px 0; padding-bottom: 4px; text-transform: uppercase;">Operational Tasks (${tasks.length})</h3>
           <table style="width: 100%; border-collapse: collapse; font-size: 10px;">
              <thead style="background: #f1f5f9;">
                <tr>
                  <th style="padding: 8px; text-align: left; border: 1px solid #cbd5e1; font-weight: 700; color: #475569;">TASK NAME</th>
                  <th style="padding: 8px; text-align: left; border: 1px solid #cbd5e1; font-weight: 700; color: #475569;">TYPE</th>
                  <th style="padding: 8px; text-align: center; border: 1px solid #cbd5e1; font-weight: 700; color: #475569;">STATUS</th>
                  <th style="padding: 8px; text-align: left; border: 1px solid #cbd5e1; font-weight: 700; color: #475569;">ASSIGNED TO</th>
                  <th style="padding: 8px; text-align: left; border: 1px solid #cbd5e1; font-weight: 700; color: #475569;">DUE DATE</th>
                </tr>
              </thead>
              <tbody>
                ${tasks.length > 0 ? tasks.map((task, idx) => `
                  <tr style="background: ${idx % 2 === 0 ? '#ffffff' : '#f8fafc'}; border-bottom: 1px solid #e2e8f0;">
                    <td style="padding: 6px 8px; border: 1px solid #e2e8f0; font-weight: 600;">${task.title || formatTaskType(task.type)}</td>
                    <td style="padding: 6px 8px; border: 1px solid #e2e8f0;">${formatTaskType(task.type)}</td>
                    <td style="padding: 6px 8px; border: 1px solid #e2e8f0; text-align: center;">
                       <span style="display: inline-block; padding: 2px 6px; border-radius: 4px; font-size: 9px; font-weight: 700; color: white; background: ${getTaskStatusColor(task.status)};">
                         ${task.status.toUpperCase().replace('_', ' ')}
                       </span>
                    </td>
                    <td style="padding: 6px 8px; border: 1px solid #e2e8f0;">${getTaskAssignee(task)}</td>
                    <td style="padding: 6px 8px; border: 1px solid #e2e8f0;">${formatDate(task.due_date || null)}</td>
                  </tr>
                `).join('') : `<tr><td colspan="5" style="padding: 15px; text-align: center; color: #94a3b8; font-style: italic;">No tasks assigned yet.</td></tr>`}
              </tbody>
           </table>
        </div>

        <!-- Financial & Notes Grid -->
        <div style="display: flex; gap: 25px; page-break-inside: avoid;">
           <div style="flex: 1;">
              <h3 style="border-bottom: 2px solid ${brandingColor}; color: ${brandingColor}; font-size: 13px; font-weight: 700; margin: 0 0 10px 0; padding-bottom: 4px; text-transform: uppercase;">Financial Summary</h3>
              <table style="width: 100%; border-collapse: collapse; font-size: 11px;">
                <tr style="background: #f8fafc; border-bottom: 1px solid #e2e8f0;">
                   <td style="padding: 8px; color: #64748b; font-weight: 600;">ESTIMATED BUDGET</td>
                   <td style="padding: 8px; font-weight: 700; text-align: right;">KES ${formatCurrency(enquiry.estimated_budget || 0)}</td>
                </tr>
                <!-- Placeholder for future financial data -->
                <tr style="border-bottom: 1px solid #e2e8f0;">
                   <td style="padding: 8px; color: #64748b; font-weight: 600;">QUOTED AMOUNT</td>
                   <td style="padding: 8px; font-weight: 600; text-align: right; color: #94a3b8;">-</td>
                </tr>
                 <tr>
                   <td style="padding: 8px; color: #64748b; font-weight: 600;">INVOICED</td>
                   <td style="padding: 8px; font-weight: 600; text-align: right; color: #94a3b8;">-</td>
                </tr>
              </table>
           </div>

           <div style="flex: 1;">
              <h3 style="border-bottom: 2px solid ${brandingColor}; color: ${brandingColor}; font-size: 13px; font-weight: 700; margin: 0 0 10px 0; padding-bottom: 4px; text-transform: uppercase;">Important Notes</h3>
              <div style="background: #fffbeb; border: 1px solid #fcd34d; border-radius: 4px; padding: 10px; font-size: 11px; color: #92400e; min-height: 60px;">
                 ${enquiry.follow_up_notes || 'No notes flagged for this project.'}
              </div>
           </div>
        </div>

        <!-- Footer -->
        <div style="border-top: 1px solid #cbd5e1; margin-top: 40px; padding-top: 15px; display: flex; justify-content: space-between; font-size: 10px; color: #64748b;">
           <div>
              <strong>CONFIDENTIAL DOCUMENT</strong><br>
              This document contains proprietary information.
           </div>
           <div style="text-align: right;">
              System Generated • Page 1 of 1
           </div>
        </div>

      </div>
    `
  }


  // Helper functions
  const getClientName = (enquiry: ProjectEnquiry): string => {
    if (!enquiry.client) return 'Unknown Client'
    return (enquiry.client as any).full_name || (enquiry.client as any).FullName || 'Unknown Client'
  }

  const getStatusLabel = (status: string): string => {
    const labels: Record<string, string> = {
      'client_registered': 'Client Registered',
      'enquiry_logged': 'Enquiry Logged',
      'site_survey_completed': 'Site Survey Completed',
      'design_completed': 'Design Completed',
      'design_approved': 'Design Approved',
      'materials_specified': 'Materials Specified',
      'budget_created': 'Budget Created',
      'quote_prepared': 'Quote Prepared',
      'quote_approved': 'Quote Approved',
      'planning': 'Planning',
      'in_progress': 'In Progress',
      'completed': 'Completed',
      'cancelled': 'Cancelled'
    }
    return labels[status] || status
  }

  const getPriorityColor = (priority: string): string => {
    const colors: Record<string, string> = {
      'low': '#10b981',
      'medium': '#f59e0b',
      'high': '#f97316',
      'urgent': '#ef4444'
    }
    return colors[priority] || '#6b7280'
  }

  const getTaskStatusColor = (status: string): string => {
    const colors: Record<string, string> = {
      'pending': '#6b7280',
      'in_progress': '#3b82f6',
      'completed': '#10b981',
      'cancelled': '#ef4444'
    }
    return colors[status] || '#6b7280'
  }

  const formatTaskType = (type: string): string => {
    return type.split('-').map(word =>
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ')
  }

  const getTaskAssignee = (task: any): string => {
    if (task.assigned_user) return task.assigned_user.name
    if (task.assignedUser) return task.assignedUser.name
    if (task.assigned_to) return task.assigned_to.name
    return 'Unassigned'
  }

  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('en-KE', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount)
  }

  const formatDate = (date: string | null): string => {
    if (!date) return 'N/A'
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const calculateDaysRemaining = (dateStr: string | null | undefined) => {
    if (!dateStr) return '-'
    const target = new Date(dateStr)
    const now = new Date()
    const diff = Math.ceil((target.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))

    if (isNaN(diff)) return '-'
    if (diff < 0) return `<span style="color: #dc2626;">${Math.abs(diff)} days overdue</span>`
    return `<span style="color: #16a34a;">${diff} days left</span>`
  }

  const addonStatusColor = (status: string): string => {
    const colors: Record<string, string> = {
      'client_registered': '#475569',
      'enquiry_logged': '#1e40af',
      'site_survey_completed': '#0891b2',
      'design_completed': '#7e22ce',
      'design_approved': '#9333ea',
      'materials_specified': '#c026d3',
      'budget_created': '#db2777',
      'quote_prepared': '#ca8a04',
      'quote_approved': '#16a34a',
      'planning': '#4f46e5',
      'in_progress': '#ea580c',
      'completed': '#15803d',
      'cancelled': '#dc2626'
    }
    return colors[status] || '#1f2937'
  }

  const parseProjectScope = (scope: any): string[] => {
    if (!scope) return []

    // If it's already an array, return it
    if (Array.isArray(scope)) {
      return scope.filter(item => item && item.trim())
    }

    // If it's a string, try to parse as JSON array
    if (typeof scope === 'string') {
      try {
        const parsed = JSON.parse(scope)
        if (Array.isArray(parsed)) {
          return parsed.filter(item => item && item.trim())
        }
      } catch {
        // Not valid JSON, return empty
      }
    }

    return []
  }

  return {
    isGenerating,
    generateProjectPDF,
    generateMultipleProjectsPDF
  }
}
