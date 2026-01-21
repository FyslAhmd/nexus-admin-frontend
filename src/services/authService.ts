import api from './api';
import {
  ApiResponse,
  User,
  LoginCredentials,
  RegisterData,
  CreateInviteData,
  InviteResponse,
  VerifyInviteResponse,
} from '../types';

// Auth API service
export const authApi = {
  // Login
  login: async (credentials: LoginCredentials) => {
    const response = await api.post<ApiResponse<{ user: User; token: string }>>(
      '/auth/login',
      credentials
    );
    return response.data;
  },

  // Register via invite
  register: async (data: RegisterData) => {
    const response = await api.post<ApiResponse<{ user: User; token: string }>>(
      '/auth/register-via-invite',
      data
    );
    return response.data;
  },

  // Verify invite token
  verifyInvite: async (token: string) => {
    const response = await api.get<ApiResponse<VerifyInviteResponse>>(
      `/auth/verify-invite/${token}`
    );
    return response.data;
  },

  // Create invite (Admin only)
  createInvite: async (data: CreateInviteData) => {
    const response = await api.post<ApiResponse<InviteResponse>>(
      '/auth/invite',
      data
    );
    return response.data;
  },

  // Get current user
  getCurrentUser: async () => {
    const response = await api.get<ApiResponse<{ user: User }>>('/auth/me');
    return response.data;
  },
};

export default authApi;
