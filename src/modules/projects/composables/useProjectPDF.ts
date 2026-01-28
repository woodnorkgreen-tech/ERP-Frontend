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

    // Blue Theme (Matching Budget PDF)
    const primaryColor = '#2563eb' // Blue-600
    const headerBg = '#eff6ff'     // Blue-50
    const headerText = '#1e40af'   // Blue-800
    const borderColor = '#e2e8f0'

    const jobNo = enquiry.job_number || '-'
    const dept = (enquiry.department as any)?.name || 'General'
    const surveyStatus = (enquiry as any).site_survey_skipped ? 'Skipped' : 'Required'

    return `
      <div style="font-family: 'Helvetica Neue', Arial, sans-serif; padding: 20px; color: #1f2937; line-height: 1.4; font-size: 10px;">
        
        <!-- Header -->
        <table style="width: 100%; margin-bottom: 20px; border-collapse: collapse;">
          <tr>
            <td style="width: 50%; vertical-align: top;">
               <!-- Logo placeholder - ensure /logo-outline.png exists in public folder -->
               <img src="/logo-outline.png" style="height: 60px; margin-bottom: 5px;" alt="Logo" />
               <div style="font-weight: bold; font-size: 14px; text-transform: uppercase; color: #111827;">Woodnork Green</div>
            </td>
            <td style="width: 50%; text-align: right; vertical-align: top;">
               <h1 style="color: ${primaryColor}; font-size: 20px; margin: 0 0 10px 0; text-transform: uppercase;">Project Data Sheet</h1>
               <div style="display: inline-block; border: 1px solid ${borderColor};">
                  <table style="border-collapse: collapse;">
                    <tr>
                      <td style="padding: 4px 10px; background: #fff; font-weight: bold; border-right: 1px solid ${borderColor}; color: #4b5563;">DATE</td>
                      <td style="padding: 4px 10px; background: #fff; color: ${primaryColor}; font-weight: bold;">${new Date().toLocaleDateString('en-GB')}</td>
                    </tr>
                    <tr>
                      <td style="padding: 4px 10px; background: #fff; font-weight: bold; border-right: 1px solid ${borderColor}; border-top: 1px solid ${borderColor}; color: #4b5563;">ENQ #</td>
                      <td style="padding: 4px 10px; background: #fff; color: #dc2626; font-weight: bold; border-top: 1px solid ${borderColor};">${enquiry.enquiry_number}</td>
                    </tr>
                  </table>
               </div>
            </td>
          </tr>
        </table>

        <!-- Executive Summary Grid -->
        <table style="width: 100%; margin-bottom: 20px; border-collapse: collapse;">
           <tr>
             <td style="width: 25%; padding-right: 10px;">
                <div style="background: #f8fafc; border: 1px solid ${borderColor}; padding: 8px; border-radius: 4px;">
                   <div style="font-size: 8px; color: #64748b; font-weight: bold; text-transform: uppercase; margin-bottom: 2px;">Status</div>
                   <div style="font-size: 11px; font-weight: bold; color: ${addonStatusColor(enquiry.status)};">${statusLabel.toUpperCase()}</div>
                </div>
             </td>
             <td style="width: 25%; padding-right: 10px;">
                <div style="background: #f8fafc; border: 1px solid ${borderColor}; padding: 8px; border-radius: 4px;">
                   <div style="font-size: 8px; color: #64748b; font-weight: bold; text-transform: uppercase; margin-bottom: 2px;">Progress</div>
                   <div style="font-size: 11px; font-weight: bold;">${progress}% COMPLETE</div>
                   <div style="height: 3px; background: #e2e8f0; margin-top: 4px; border-radius: 2px;"><div style="width: ${progress}%; height: 100%; background: ${primaryColor}; border-radius: 2px;"></div></div>
                </div>
             </td>
             <td style="width: 25%; padding-right: 10px;">
                <div style="background: #f8fafc; border: 1px solid ${borderColor}; padding: 8px; border-radius: 4px;">
                   <div style="font-size: 8px; color: #64748b; font-weight: bold; text-transform: uppercase; margin-bottom: 2px;">Priority</div>
                   <div style="font-size: 11px; font-weight: bold; color: ${getPriorityColor(enquiry.priority)};">${priorityLabel}</div>
                </div>
             </td>
             <td style="width: 25%;">
                <div style="background: #f8fafc; border: 1px solid ${borderColor}; padding: 8px; border-radius: 4px;">
                   <div style="font-size: 8px; color: #64748b; font-weight: bold; text-transform: uppercase; margin-bottom: 2px;">Department</div>
                   <div style="font-size: 11px; font-weight: bold;">${dept}</div>
                </div>
             </td>
           </tr>
        </table>

        <!-- Details Sections with Standard Headers -->
        
        <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
           <tr style="vertical-align: top;">
              <td style="width: 50%; padding-right: 15px;">
                 <div style="border-left: 3px solid #3b82f6; background-color: #eff6ff; color: #1e40af; font-weight: bold; padding: 4px 8px; margin-bottom: 8px; font-size: 11px;">CLIENT INFORMATION</div>
                 <table style="width: 100%; border-collapse: collapse;">
                    <tr><td style="padding: 3px 0; color: #64748b; width: 30%; font-weight: bold;">Name</td><td style="font-weight: bold;">${getClientName(enquiry)}</td></tr>
                    <tr><td style="padding: 3px 0; color: #64748b; font-weight: bold;">Contact</td><td>${enquiry.contact_person || '-'}</td></tr>
                    <tr><td style="padding: 3px 0; color: #64748b; font-weight: bold;">Phone</td><td>${(enquiry.client as any)?.phone || '-'}</td></tr>
                    <tr><td style="padding: 3px 0; color: #64748b; font-weight: bold;">Email</td><td>${(enquiry.client as any)?.email || '-'}</td></tr>
                 </table>
              </td>
              <td style="width: 50%;">
                 <div style="border-left: 3px solid #3b82f6; background-color: #eff6ff; color: #1e40af; font-weight: bold; padding: 4px 8px; margin-bottom: 8px; font-size: 11px;">PROJECT PARTICULARS</div>
                 <table style="width: 100%; border-collapse: collapse;">
                    <tr><td style="padding: 3px 0; color: #64748b; width: 30%; font-weight: bold;">Project Title</td><td style="font-weight: bold;">${enquiry.title}</td></tr>
                    <tr><td style="padding: 3px 0; color: #64748b; font-weight: bold;">Job Number</td><td>${jobNo}</td></tr>
                    <tr><td style="padding: 3px 0; color: #64748b; font-weight: bold;">Venue</td><td>${enquiry.venue || 'N/A'}</td></tr>
                    <tr><td style="padding: 3px 0; color: #64748b; font-weight: bold;">Officer</td><td>${enquiry.project_officer?.name || 'Unassigned'}</td></tr>
                 </table>
              </td>
           </tr>
        </table>

        <!-- Timeline Block -->
        <div style="background: #fff; border: 1px solid ${borderColor}; padding: 10px; margin-bottom: 20px;">
           <div style="font-size: 10px; color: #1e40af; font-weight: bold; text-transform: uppercase; margin-bottom: 8px;">Timeline Schedule</div>
           <table style="width: 100%; text-align: center;">
              <tr>
                 <td style="border-right: 1px solid ${borderColor};">
                    <div style="font-size: 9px; color: #64748b; text-transform: uppercase;">Received</div>
                    <div style="font-weight: bold;">${formatDate(enquiry.date_received || enquiry.created_at || null)}</div>
                 </td>
                 <td style="border-right: 1px solid ${borderColor};">
                    <div style="font-size: 9px; color: #64748b; text-transform: uppercase;">Deadline</div>
                    <div style="font-weight: bold;">${formatDate(enquiry.expected_delivery_date || null)}</div>
                 </td>
                 <td style="border-right: 1px solid ${borderColor};">
                    <div style="font-size: 9px; color: #64748b; text-transform: uppercase;">Survey</div>
                    <div style="font-weight: bold;">${surveyStatus}</div>
                 </td>
                 <td>
                    <div style="font-size: 9px; color: #64748b; text-transform: uppercase;">Status</div>
                    <div style="font-weight: bold;">${calculateDaysRemaining(enquiry.expected_delivery_date)}</div>
                 </td>
              </tr>
           </table>
        </div>

        <!-- Scope Block -->
        <div style="margin-bottom: 20px;">
           <div style="border-left: 3px solid #3b82f6; background-color: #eff6ff; color: #1e40af; font-weight: bold; padding: 4px 8px; margin-bottom: 8px; font-size: 11px;">SCOPE OF WORKS</div>
           <div style="background: #f8fafc; border: 1px solid ${borderColor}; padding: 10px; text-align: justify; margin-bottom: 10px;">
              ${enquiry.description || 'No description provided.'}
           </div>
           
           <!-- Deliverables List -->
           ${deliverables.length > 0 ? `
           <div style="font-weight: bold; font-size: 10px; color: #4b5563; margin-bottom: 4px; text-transform: uppercase;">Key Deliverables</div>
           <ul style="margin: 0; padding-left: 20px; color: #1f2937;">
              ${deliverables.map(d => `<li style="margin-bottom: 2px;">${d}</li>`).join('')}
           </ul>
           ` : ''}
        </div>

        <!-- Tasks Table -->
        <div style="margin-bottom: 20px;">
           <div style="border-left: 3px solid #3b82f6; background-color: #eff6ff; color: #1e40af; font-weight: bold; padding: 4px 8px; margin-bottom: 8px; font-size: 11px;">OPERATIONAL TASKS (${tasks.length})</div>
           <table style="width: 100%; border-collapse: collapse; font-size: 9px;">
              <thead style="background: #f1f5f9;">
                <tr>
                  <th style="padding: 6px; text-align: left; border: 1px solid ${borderColor}; color: #475569;">TASK</th>
                  <th style="padding: 6px; text-align: center; border: 1px solid ${borderColor}; color: #475569;">STATUS</th>
                  <th style="padding: 6px; text-align: left; border: 1px solid ${borderColor}; color: #475569;">ASSIGNED TO</th>
                  <th style="padding: 6px; text-align: right; border: 1px solid ${borderColor}; color: #475569;">DUE</th>
                </tr>
              </thead>
              <tbody>
                ${tasks.length > 0 ? tasks.map((task, idx) => `
                  <tr style="background: ${idx % 2 === 0 ? '#ffffff' : '#f8fafc'}; border-bottom: 1px solid ${borderColor};">
                    <td style="padding: 6px; border: 1px solid ${borderColor}; font-weight: 600;">${task.title || formatTaskType(task.type)}</td>
                    <td style="padding: 6px; border: 1px solid ${borderColor}; text-align: center;">
                       <span style="padding: 2px 4px; border-radius: 2px; color: white; background: ${getTaskStatusColor(task.status)}; font-size: 8px; text-transform: uppercase;">
                         ${task.status.replace('_', ' ')}
                       </span>
                    </td>
                    <td style="padding: 6px; border: 1px solid ${borderColor};">${getTaskAssignee(task)}</td>
                    <td style="padding: 6px; border: 1px solid ${borderColor}; text-align: right;">${formatDate(task.due_date || null)}</td>
                  </tr>
                `).join('') : `<tr><td colspan="4" style="padding: 10px; text-align: center; color: #94a3b8;">No tasks assigned.</td></tr>`}
              </tbody>
           </table>
        </div>

        <!-- Financials & Notes -->
        <div style="margin-bottom: 20px; page-break-inside: avoid;">
           <table style="width: 100%; border-collapse: collapse;">
              <tr style="vertical-align: top;">
                 <td style="width: 50%; padding-right: 15px;">
                    <div style="border-left: 3px solid #3b82f6; background-color: #eff6ff; color: #1e40af; font-weight: bold; padding: 4px 8px; margin-bottom: 8px; font-size: 11px;">FINANCIAL OVERVIEW</div>
                    <table style="width: 100%; border-collapse: collapse;">
                       <tr style="border-bottom: 1px solid ${borderColor};"><td style="padding: 5px 0; font-weight: bold; color: #64748b;">Budget Est.</td><td style="text-align: right; font-weight: bold;">KES ${formatCurrency(enquiry.estimated_budget || 0)}</td></tr>
                       <tr style="border-bottom: 1px solid ${borderColor};"><td style="padding: 5px 0; font-weight: bold; color: #64748b;">Current Quote</td><td style="text-align: right; color: #9ca3af;">-</td></tr>
                    </table>
                 </td>
                 <td style="width: 50%;">
                    <div style="border-left: 3px solid #3b82f6; background-color: #eff6ff; color: #1e40af; font-weight: bold; padding: 4px 8px; margin-bottom: 8px; font-size: 11px;">NOTES</div>
                    <div style="background: #fffbeb; border: 1px solid #fcd34d; padding: 8px; color: #b45309; border-radius: 4px; font-size: 10px;">
                       ${enquiry.follow_up_notes || 'No critical notes.'}
                    </div>
                 </td>
              </tr>
           </table>
        </div>

        <!-- Footer -->
        <div style="border-top: 1px solid ${borderColor}; margin-top: 30px; padding-top: 10px; font-size: 9px; color: #94a3b8; text-align: center;">
           Woodnork Green Ltd • Generated from System
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
