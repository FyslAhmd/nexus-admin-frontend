import api from './api';
import {
  ApiResponse,
  User,
  PaginatedResponse,
  UserRole,
  UserStatus,
  UserStats,
} from '../types';

// Users API service
export const usersApi = {
  // Get all users (paginated)
  getAll: async (params?: {
    page?: number;
    limit?: number;
    search?: string;
    role?: UserRole;
    status?: UserStatus;
  }) => {
    const response = await api.get<ApiResponse<PaginatedResponse<User>>>(
      '/users',
      { params }
    );
    return response.data;
  },

  // Get user by ID
  getById: async (id: string) => {
    const response = await api.get<ApiResponse<{ user: User }>>(`/users/${id}`);
    return response.data;
  },

  // Update user role
  updateRole: async (id: string, role: UserRole) => {
    const response = await api.patch<ApiResponse<{ user: User }>>(
      `/users/${id}/role`,
      { role }
    );
    return response.data;
  },

  // Update user status
  updateStatus: async (id: string, status: UserStatus) => {
    const response = await api.patch<ApiResponse<{ user: User }>>(
      `/users/${id}/status`,
      { status }
    );
    return response.data;
  },

  // Get user stats
  getStats: async () => {
    const response = await api.get<ApiResponse<{ stats: UserStats }>>(
      '/users/stats'
    );
    return response.data;
  },
};

export default usersApi;
