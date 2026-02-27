export interface ProjectEnquiry {
  id: number;
  date_received: string;
  expected_delivery_date?: string;
  client_id: number;
  title: string;
  description?: string;
  project_scope?: string[];
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'client_registered' | 'enquiry_logged' | 'site_survey_completed' | 'design_completed' | 'design_approved' | 'materials_specified' | 'budget_created' | 'quote_prepared' | 'quote_approved' | 'planning' | 'in_progress' | 'completed' | 'cancelled';
  department_id?: number;
  assigned_department?: string;
  project_deliverables?: string;
  contact_person: string;
  project_officer_id?: number;
  assigned_po?: number;
  follow_up_notes?: string;
  enquiry_number: string;
  contact_email?: string;
  contact_phone?: string;
  job_number?: string;

  venue?: string;
  site_survey_skipped: boolean;
  site_survey_skip_reason?: string;
  selected_workflow_tasks?: string[];
  workflow_preset_type?: string;
  quote_approved?: boolean;
  quote_approved_at?: string;
  quote_approved_by?: number;
  estimated_budget?: number;
  created_by: number;
  // Relations
  client?: {
    id: number;
    full_name: string;
  };
  department?: {
    id: number;
    name: string;
  };
  project_officer?: {
    id: number;
    name: string;
    email: string;
  };
  enquiryTasks?: EnquiryTask[];
  creator?: {
    id: number;
    name: string;
  };
  created_at?: string;
  updated_at?: string;
}

export interface TaskAssignmentHistory {
  id: number;
  enquiry_task_id: number;
  assigned_to: number;
  assigned_by: number;
  assigned_at: string;
  notes?: string;
  assignedTo?: {
    id: number;
    name: string;
  };
  assignedBy?: {
    id: number;
    name: string;
  };
}

export interface EnquiryTask {
  id: number;
  project_enquiry_id: number;
  department_id?: number;
  title: string;
  task_description?: string;
  type: string;
  status: 'pending' | 'in_progress' | 'completed' | 'cancelled' | 'skipped';
  priority?: 'low' | 'medium' | 'high' | 'urgent';
  estimated_hours?: number;
  actual_hours?: number;
  due_date?: string;
  started_at?: string;
  completed_at?: string;
  submitted_at?: string;
  notes?: string;
  task_order?: number;
  assigned_user_id?: number;
  created_by: number;
  created_at: string;
  updated_at: string;
  enquiry?: ProjectEnquiry;
  department?: {
    id: number;
    name: string;
  };
  creator?: {
    id: number;
    name: string;
  };
  assignedUser?: {
    id: number;
    name: string;
  };
  assignedUsers?: {
    id: number;
    name: string;
    pivot?: {
      assigned_by: number;
      assigned_at: string;
    };
  }[];
  assigned_users?: {
    id: number;
    name: string;
    pivot?: {
      assigned_by: number;
      assigned_at: string;
    };
  }[];
  // Backward compatibility fields
  assigned_at?: string;
  assigned_by?: {
    id: number;
    name: string;
  };
  assigned_to?: {
    id: number;
    name: string;
  };
  assignedTo?: {  // Laravel relationship (camelCase)
    id: number;
    name: string;
  };
  assignmentHistory?: TaskAssignmentHistory[];
  material_approval?: {
    needs_approval: boolean;
    approved_count: number;
    total_count: number;
    all_approved: boolean;
    element_count?: number;
    material_count?: number;
    is_gated?: boolean;
    gate_message?: string;
    departments: {
      design: boolean;
      production: boolean;
      finance: boolean;
    };
  };
}

export interface CreateProjectEnquiryData {
  date_received: string;
  expected_delivery_date?: string;
  client_id: number | null;
  title: string;
  description?: string;
  project_scope?: string[];
  priority?: 'low' | 'medium' | 'high' | 'urgent';
  status: ProjectEnquiry['status'];
  contact_person: string;
  project_officer_id?: number | null;
  assigned_po?: number;
  follow_up_notes?: string;
  contact_email?: string;
  contact_phone?: string;
  venue?: string;
  site_survey_skipped?: boolean;
  site_survey_skip_reason?: string;
  selected_workflow_tasks?: string[];
  workflow_preset_type?: string;
  estimated_budget?: number;
}

export interface UpdateProjectEnquiryData extends Partial<CreateProjectEnquiryData> {
  status?: ProjectEnquiry['status'];
}

export interface SiteSurvey {
  id: number;
  enquiry_id: number;
  project_id?: number;
  site_visit_date: string;
  status?: 'pending' | 'completed' | 'approved' | 'rejected';
  project_manager?: string;
  other_project_manager?: string;
  client_name: string;
  location: string;
  attendees?: string[];
  client_contact_person?: string;
  client_phone?: string;
  client_email?: string;
  project_description: string;
  objectives?: string;
  current_condition?: string;
  existing_branding?: string;
  access_logistics?: string;
  parking_availability?: string;
  size_accessibility?: string;
  lifts?: string;
  door_sizes?: string;
  loading_areas?: string;
  site_measurements?: string;
  room_size?: string;
  constraints?: string;
  electrical_outlets?: string;
  food_refreshment?: string;
  branding_preferences?: string;
  material_preferences?: string;
  color_scheme?: string;
  brand_guidelines?: string;
  special_instructions?: string;
  project_start_date?: string;
  project_deadline?: string;
  milestones?: string;
  safety_conditions?: string;
  potential_hazards?: string;
  safety_requirements?: string;
  additional_notes?: string;
  special_requests?: string;
  action_items?: string[];
  prepared_by?: string;
  prepared_signature?: string;
  prepared_date?: string;
  client_approval?: boolean;
  client_signature?: string;
  client_approval_date?: string;
  created_at?: string;
  updated_at?: string;
  enquiry?: ProjectEnquiry;
}

export interface CreateSiteSurveyData {
  enquiry_id: number;
  project_id?: number;
  site_visit_date: string;
  status?: 'pending' | 'completed' | 'approved' | 'rejected';
  project_manager?: string;
  other_project_manager?: string;
  client_name: string;
  location: string;
  attendees?: string[];
  client_contact_person?: string;
  client_phone?: string;
  client_email?: string;
  project_description: string;
  objectives?: string;
  current_condition?: string;
  existing_branding?: string;
  access_logistics?: string;
  parking_availability?: string;
  size_accessibility?: string;
  lifts?: string;
  door_sizes?: string;
  loading_areas?: string;
  site_measurements?: string;
  room_size?: string;
  constraints?: string;
  electrical_outlets?: string;
  food_refreshment?: string;
  branding_preferences?: string;
  material_preferences?: string;
  color_scheme?: string;
  brand_guidelines?: string;
  special_instructions?: string;
  project_start_date?: string;
  project_deadline?: string;
  milestones?: string;
  safety_conditions?: string;
  potential_hazards?: string;
  safety_requirements?: string;
  additional_notes?: string;
  special_requests?: string;
  action_items?: string[];
  prepared_by?: string;
  prepared_signature?: string;
  prepared_date?: string;
  client_approval?: boolean;
  client_signature?: string;
  client_approval_date?: string;
}

// Consolidated task interface - now all tasks use the same structure
export type UpdateSiteSurveyData = Partial<CreateSiteSurveyData>

export interface DashboardMetrics {
  enquiry_metrics: {
    total_enquiries: number;
    status_breakdown: Record<string, number>;
    monthly_trend: Array<{ month: string; count: number }>;
    priority_distribution: Record<string, number>;
    department_distribution: Record<string, number>;
  };
  task_metrics: {
    enquiry_tasks: Record<string, number>;
    departmental_tasks: Record<string, number>;
    total_tasks: number;
    overdue_tasks: number;
    tasks_by_department: Record<string, number>;
    performance_matrix: Record<string, {
      efficiency: number;
      punctuality: number;
      volume: number;
    }>;
    completion_rate: number;
  };
  project_metrics: {
    total_projects: number;
    active_projects: number;
    completed_projects: number;
    converted_enquiries: number;
    total_budget: number;
    projects_by_status: Record<string, number>;
    average_duration_days: number | null;
    phases_by_status: Record<string, number>;
    phase_progress: Array<{
      name: string;
      total: number;
      completed: number;
      progress: number;
    }>;
  };
  recent_activities?: Array<{
    type: string;
    title: string;
    description: string;
    timestamp: string;
    priority?: string;
    status?: string;
  }>;
  alerts?: Array<{
    type: string;
    severity: 'high' | 'medium' | 'low';
    title: string;
    message: string;
    action_url?: string;
  }>;
  financial_metrics?: {
    revenue: number;
    cost: number;
    profit: number;
    margin: number;
  };
  suggestions?: Array<{
    type: string;
    priority: 'high' | 'medium' | 'urgent';
    title: string;
    message: string;
    icon: string;
    action_label: string;
    action_url: string;
  }>;
  command_center_data?: {
    pipeline: {
      stages: Record<string, string>;
      counts: Record<string, number>;
    };
    department_pulse: Array<{
      id: number;
      name: string;
      pending: number;
      in_progress: number;
      total_load: number;
    }>;
    bottlenecks: any[];
    timestamp: string;
  };
  metadata?: {
    status_labels: Record<string, string>;
    priority_labels: Record<string, string>;
    currency: {
      symbol: string;
      code: string;
    };
    thresholds: Record<string, number>;
  };
}
