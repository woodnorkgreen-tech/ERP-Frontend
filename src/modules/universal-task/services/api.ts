// Universal Task System API Service
import axios from 'axios';
import type { AxiosInstance, AxiosResponse } from 'axios';
import type {
  Task,
  TaskFilters,
  PaginationState,
  ApiResponse,
  PaginatedResponse,
  TaskFormData,
  TaskIssue,
  TaskComment,
  TaskAttachment,
  TaskTimeEntry,
  TaskTemplate,
  TaskAnalytics,
  TaskKeyMetrics,
  TimeSeriesData,
  DepartmentAnalytics,
  TimeEntryFormData,
  TaskIssueFormData
} from '../types';
import { API_ENDPOINTS } from '../constants';

class TaskApiService {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: '/api/universal-tasks',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    });

    // Add request interceptor for authentication
    this.client.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem('auth_token');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Add response interceptor for error handling
    this.client.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          // Handle unauthorized access
          localStorage.removeItem('auth_token');
          window.location.href = '/login';
        }
        return Promise.reject(error);
      }
    );
  }

  // ==================== Task API Methods ====================

  async getTasks(
    filters: TaskFilters = {},
    pagination: Partial<PaginationState> = {}
  ): Promise<PaginatedResponse<Task>> {
    const params = {
      ...filters,
      ...pagination
    };

    const response = await this.client.get(API_ENDPOINTS.TASKS, { params });
    const raw = response.data as any;

    // Backend returns Laravel paginator in raw.data; normalize to PaginatedResponse<Task>
    const paginator = raw?.data;
    const items: Task[] = Array.isArray(paginator?.data) ? paginator.data : [];

    const meta = paginator
      ? {
          pagination: {
            page: paginator.current_page ?? paginator.currentPage ?? 1,
            per_page: paginator.per_page ?? paginator.perPage ?? items.length ?? 0,
            total: paginator.total ?? items.length ?? 0
          }
        }
      : undefined;

    return {
      success: !!raw?.success,
      data: items,
      meta,
      error: raw?.error
    };
  }

  async getTask(id: number): Promise<ApiResponse<Task>> {
    const response = await this.client.get(`${API_ENDPOINTS.TASKS}/${id}`);
    return response.data;
  }

  async createTask(data: TaskFormData): Promise<ApiResponse<Task>> {
    const response = await this.client.post(API_ENDPOINTS.TASKS, data);
    return response.data;
  }

  async updateTask(id: number, data: Partial<TaskFormData>): Promise<ApiResponse<Task>> {
    const response = await this.client.put(`${API_ENDPOINTS.TASKS}/${id}`, data);
    return response.data;
  }

  async deleteTask(id: number): Promise<ApiResponse<void>> {
    const response = await this.client.delete(`${API_ENDPOINTS.TASKS}/${id}`);
    return response.data;
  }

  async updateTaskStatus(id: number, status: string, notes?: string): Promise<ApiResponse<Task>> {
    const response = await this.client.patch(`${API_ENDPOINTS.TASKS}/${id}/status`, {
      status,
      notes
    });
    return response.data;
  }

  async assignTask(id: number, userIds: number[], role?: string, replaceExisting: boolean = false): Promise<ApiResponse<Task>> {
    const response = await this.client.post(`${API_ENDPOINTS.TASKS}/${id}/assign`, {
      user_ids: userIds,
      role,
      replace_existing: replaceExisting
    });
    return response.data;
  }

  async getTaskHistory(id: number): Promise<PaginatedResponse<any>> {
    const response = await this.client.get(`${API_ENDPOINTS.TASKS}/${id}/history`);
    return response.data;
  }

  async getTaskActivity(id: number): Promise<ApiResponse<any>> {
    const response = await this.client.get(`${API_ENDPOINTS.TASKS}/${id}/activity`);
    return response.data;
  }

  // ==================== Subtask API Methods ====================

  async getSubtasks(taskId: number): Promise<ApiResponse<Task[]>> {
    const response = await this.client.get(API_ENDPOINTS.SUBTASKS.replace('{task}', taskId.toString()));
    return response.data;
  }

  async createSubtask(taskId: number, data: TaskFormData): Promise<ApiResponse<Task>> {
    const response = await this.client.post(API_ENDPOINTS.SUBTASKS.replace('{task}', taskId.toString()), data);
    return response.data;
  }

  async getTaskHierarchy(taskId: number): Promise<ApiResponse<any>> {
    const response = await this.client.get(`tasks/${taskId}/hierarchy`);
    return response.data;
  }

  // ==================== Comment API Methods ====================

  async getTaskComments(taskId: number): Promise<ApiResponse<TaskComment[]>> {
    const response = await this.client.get(API_ENDPOINTS.COMMENTS.replace('{task}', taskId.toString()));
    return response.data;
  }

  async createComment(taskId: number, content: string, parentCommentId?: number): Promise<ApiResponse<TaskComment>> {
    const response = await this.client.post(API_ENDPOINTS.COMMENTS.replace('{task}', taskId.toString()), {
      content,
      parent_comment_id: parentCommentId
    });
    return response.data;
  }

  async updateComment(commentId: number, content: string): Promise<ApiResponse<TaskComment>> {
    const response = await this.client.put(`comments/${commentId}`, { content });
    return response.data;
  }

  async deleteComment(commentId: number): Promise<ApiResponse<void>> {
    const response = await this.client.delete(`comments/${commentId}`);
    return response.data;
  }

  async replyToComment(taskId: number, commentId: number, content: string): Promise<ApiResponse<TaskComment>> {
    const response = await this.client.post(`tasks/${taskId}/comments/${commentId}/reply`, {
      content
    });
    return response.data;
  }

  // ==================== Attachment API Methods ====================

  async getTaskAttachments(taskId: number): Promise<ApiResponse<TaskAttachment[]>> {
    const response = await this.client.get(API_ENDPOINTS.ATTACHMENTS.replace('{task}', taskId.toString()));
    return response.data;
  }

  async uploadAttachment(taskId: number, file: File, description?: string): Promise<ApiResponse<TaskAttachment>> {
    const formData = new FormData();
    formData.append('file', file);
    if (description) {
      formData.append('description', description);
    }

    const response = await this.client.post(API_ENDPOINTS.ATTACHMENTS.replace('{task}', taskId.toString()), formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    return response.data;
  }

  async downloadAttachment(attachmentId: number): Promise<Blob> {
    const response = await this.client.get(`attachments/${attachmentId}/download`, {
      responseType: 'blob'
    });
    return response.data;
  }

  async deleteAttachment(attachmentId: number): Promise<ApiResponse<void>> {
    const response = await this.client.delete(`attachments/${attachmentId}`);
    return response.data;
  }

  async getAttachmentVersions(filename: string): Promise<ApiResponse<TaskAttachment[]>> {
    const response = await this.client.get(`attachments/file/${encodeURIComponent(filename)}/versions`);
    return response.data;
  }

  // ==================== Issue API Methods ====================

  async getTaskIssues(taskId?: number): Promise<PaginatedResponse<TaskIssue>> {
    const params = taskId ? { task_id: taskId } : {};
    const response = await this.client.get(API_ENDPOINTS.ISSUES, { params });
    return response.data;
  }

  async createIssue(data: TaskIssueFormData & { task_id: number }): Promise<ApiResponse<TaskIssue>> {
    const response = await this.client.post(API_ENDPOINTS.ISSUES, data);
    return response.data;
  }

  async updateIssue(id: number, data: Partial<TaskIssueFormData>): Promise<ApiResponse<TaskIssue>> {
    const response = await this.client.put(`${API_ENDPOINTS.ISSUES}/${id}`, data);
    return response.data;
  }

  async resolveIssue(id: number, resolutionNotes?: string): Promise<ApiResponse<TaskIssue>> {
    const response = await this.client.patch(`${API_ENDPOINTS.ISSUES}/${id}/resolve`, {
      resolution_notes: resolutionNotes
    });
    return response.data;
  }

  async searchIssues(query: string): Promise<PaginatedResponse<TaskIssue>> {
    const response = await this.client.get('issues/search', {
      params: { q: query }
    });
    return response.data;
  }

  // ==================== Experience Log API Methods ====================

  async getExperienceLogs(taskId?: number): Promise<PaginatedResponse<any>> {
    const params = taskId ? { task_id: taskId } : {};
    const response = await this.client.get(API_ENDPOINTS.EXPERIENCE_LOGS, { params });
    return response.data;
  }

  async createExperienceLog(data: any): Promise<ApiResponse<any>> {
    const response = await this.client.post(API_ENDPOINTS.EXPERIENCE_LOGS, data);
    return response.data;
  }

  async updateExperienceLog(id: number, data: any): Promise<ApiResponse<any>> {
    const response = await this.client.put(`${API_ENDPOINTS.EXPERIENCE_LOGS}/${id}`, data);
    return response.data;
  }

  async deleteExperienceLog(id: number): Promise<ApiResponse<void>> {
    const response = await this.client.delete(`${API_ENDPOINTS.EXPERIENCE_LOGS}/${id}`);
    return response.data;
  }

  async searchExperienceLogs(query: string): Promise<PaginatedResponse<any>> {
    const response = await this.client.get('experience-logs/search', {
      params: { q: query }
    });
    return response.data;
  }

  // ==================== Template API Methods ====================

  async getTemplates(filters: any = {}): Promise<PaginatedResponse<TaskTemplate>> {
    const response = await this.client.get(API_ENDPOINTS.TEMPLATES, { params: filters });
    return response.data;
  }

  async getTemplate(id: number): Promise<ApiResponse<TaskTemplate>> {
    const response = await this.client.get(`${API_ENDPOINTS.TEMPLATES}/${id}`);
    return response.data;
  }

  async createTemplate(data: any): Promise<ApiResponse<TaskTemplate>> {
    const response = await this.client.post(API_ENDPOINTS.TEMPLATES, data);
    return response.data;
  }

  async updateTemplate(id: number, data: any): Promise<ApiResponse<TaskTemplate>> {
    const response = await this.client.put(`${API_ENDPOINTS.TEMPLATES}/${id}`, data);
    return response.data;
  }

  async deleteTemplate(id: number): Promise<ApiResponse<void>> {
    const response = await this.client.delete(`${API_ENDPOINTS.TEMPLATES}/${id}`);
    return response.data;
  }

  async instantiateTemplate(id: number, variables: Record<string, any> = {}, context: any = {}): Promise<ApiResponse<any>> {
    const response = await this.client.post(`${API_ENDPOINTS.TEMPLATES}/${id}/instantiate`, {
      variables,
      ...context
    });
    return response.data;
  }

  async getTemplateVersions(id: number): Promise<ApiResponse<TaskTemplate[]>> {
    const response = await this.client.get(`${API_ENDPOINTS.TEMPLATES}/${id}/versions`);
    return response.data;
  }

  // ==================== Time Tracking API Methods ====================

  async getTimeEntries(taskId: number): Promise<ApiResponse<TaskTimeEntry[]>> {
    const response = await this.client.get(API_ENDPOINTS.TIME_ENTRIES.replace('{task}', taskId.toString()));
    return response.data;
  }

  async createTimeEntry(taskId: number, data: TimeEntryFormData): Promise<ApiResponse<TaskTimeEntry>> {
    const response = await this.client.post(API_ENDPOINTS.TIME_ENTRIES.replace('{task}', taskId.toString()), data);
    return response.data;
  }

  async updateTimeEntry(id: number, data: Partial<TimeEntryFormData>): Promise<ApiResponse<TaskTimeEntry>> {
    const response = await this.client.put(`time-entries/${id}`, data);
    return response.data;
  }

  async deleteTimeEntry(id: number): Promise<ApiResponse<void>> {
    const response = await this.client.delete(`time-entries/${id}`);
    return response.data;
  }

  async getTimeVariance(taskId: number): Promise<ApiResponse<any>> {
    const response = await this.client.get(`tasks/${taskId}/time-variance`);
    return response.data;
  }

  // ==================== Analytics API Methods ====================

  async getDashboardAnalytics(filters: any = {}): Promise<ApiResponse<TaskAnalytics>> {
    const response = await this.client.get(API_ENDPOINTS.ANALYTICS.DASHBOARD, { params: filters });
    return response.data;
  }

  async getKeyMetrics(filters: any = {}): Promise<ApiResponse<TaskKeyMetrics>> {
    const response = await this.client.get(API_ENDPOINTS.ANALYTICS.METRICS, { params: filters });
    return response.data;
  }

  async getTimeSeriesAnalytics(period: string = 'day', days: number = 30, filters: any = {}): Promise<ApiResponse<TimeSeriesData>> {
    const params = { period, days, ...filters };
    const response = await this.client.get(API_ENDPOINTS.ANALYTICS.TIME_SERIES, { params });
    return response.data;
  }

  async getDepartmentAnalytics(filters: any = {}): Promise<ApiResponse<DepartmentAnalytics>> {
    const response = await this.client.get(API_ENDPOINTS.ANALYTICS.DEPARTMENTS, { params: filters });
    return response.data;
  }

  async exportAnalytics(type: string, format: string = 'json', filters: any = {}): Promise<Blob> {
    const params = { type, format, ...filters };
    const response = await this.client.get('analytics/export', {
      params,
      responseType: 'blob'
    });
    return response.data;
  }

  // ==================== Saved Views API Methods ====================

  async getSavedViews(): Promise<PaginatedResponse<any>> {
    const response = await this.client.get(API_ENDPOINTS.SAVED_VIEWS);
    return response.data;
  }

  async createSavedView(data: any): Promise<ApiResponse<any>> {
    const response = await this.client.post(API_ENDPOINTS.SAVED_VIEWS, data);
    return response.data;
  }

  async updateSavedView(id: number, data: any): Promise<ApiResponse<any>> {
    const response = await this.client.put(`${API_ENDPOINTS.SAVED_VIEWS}/${id}`, data);
    return response.data;
  }

  async deleteSavedView(id: number): Promise<ApiResponse<void>> {
    const response = await this.client.delete(`${API_ENDPOINTS.SAVED_VIEWS}/${id}`);
    return response.data;
  }

  async applySavedView(id: number): Promise<ApiResponse<any>> {
    const response = await this.client.post(`${API_ENDPOINTS.SAVED_VIEWS}/${id}/apply`);
    return response.data;
  }
}

// Export singleton instance
export const taskApi = new TaskApiService();
export default taskApi;