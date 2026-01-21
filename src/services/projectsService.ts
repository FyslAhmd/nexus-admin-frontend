import api from './api';
import {
  ApiResponse,
  Project,
  PaginatedResponse,
  CreateProjectData,
  UpdateProjectData,
  ProjectStatus,
  ProjectStats,
} from '../types';

// Projects API service
export const projectsApi = {
  // Get all projects (paginated)
  getAll: async (params?: {
    page?: number;
    limit?: number;
    search?: string;
    status?: ProjectStatus;
    includeDeleted?: boolean;
  }) => {
    const response = await api.get<ApiResponse<PaginatedResponse<Project>>>(
      '/projects',
      { params }
    );
    return response.data;
  },

  // Get project by ID
  getById: async (id: string) => {
    const response = await api.get<ApiResponse<{ project: Project }>>(
      `/projects/${id}`
    );
    return response.data;
  },

  // Create project
  create: async (data: CreateProjectData) => {
    const response = await api.post<ApiResponse<{ project: Project }>>(
      '/projects',
      data
    );
    return response.data;
  },

  // Update project (Admin only)
  update: async (id: string, data: UpdateProjectData) => {
    const response = await api.patch<ApiResponse<{ project: Project }>>(
      `/projects/${id}`,
      data
    );
    return response.data;
  },

  // Delete project (Admin only - soft delete)
  delete: async (id: string) => {
    const response = await api.delete<ApiResponse<{ project: Project }>>(
      `/projects/${id}`
    );
    return response.data;
  },

  // Get project stats
  getStats: async () => {
    const response = await api.get<ApiResponse<{ stats: ProjectStats }>>(
      '/projects/stats'
    );
    return response.data;
  },
};

export default projectsApi;
