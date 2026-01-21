import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { AxiosError } from 'axios';
import { authApi } from '../../services';
import {
  AuthState,
  User,
  LoginCredentials,
  RegisterData,
  ApiResponse,
} from '../../types';

// Get initial state from localStorage
const token = localStorage.getItem('token');
const userStr = localStorage.getItem('user');
const user = userStr ? JSON.parse(userStr) : null;

const initialState: AuthState = {
  user,
  token,
  isAuthenticated: !!token && !!user,
  isLoading: false,
  error: null,
};

// Async thunks
export const login = createAsyncThunk(
  'auth/login',
  async (credentials: LoginCredentials, { rejectWithValue }) => {
    try {
      const response = await authApi.login(credentials);
      if (response.success && response.data) {
        // Store token and user in localStorage
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
        return response.data;
      }
      return rejectWithValue(response.message || 'Login failed');
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      const message =
        axiosError.response?.data?.message || 'Login failed. Please try again.';
      return rejectWithValue(message);
    }
  }
);

export const register = createAsyncThunk(
  'auth/register',
  async (data: RegisterData, { rejectWithValue }) => {
    try {
      const response = await authApi.register(data);
      if (response.success && response.data) {
        // Store token and user in localStorage
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
        return response.data;
      }
      return rejectWithValue(response.message || 'Registration failed');
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      const message =
        axiosError.response?.data?.message ||
        'Registration failed. Please try again.';
      return rejectWithValue(message);
    }
  }
);

export const getCurrentUser = createAsyncThunk(
  'auth/getCurrentUser',
  async (_, { rejectWithValue }) => {
    try {
      const response = await authApi.getCurrentUser();
      if (response.success && response.data) {
        // Update user in localStorage
        localStorage.setItem('user', JSON.stringify(response.data.user));
        return response.data.user;
      }
      return rejectWithValue(response.message || 'Failed to get user');
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      const message =
        axiosError.response?.data?.message || 'Failed to get user data';
      return rejectWithValue(message);
    }
  }
);

// Check auth status - verify token is still valid
export const checkAuthStatus = createAsyncThunk(
  'auth/checkAuthStatus',
  async (_, { rejectWithValue, dispatch }) => {
    try {
      const response = await authApi.getCurrentUser();
      if (response.success && response.data) {
        localStorage.setItem('user', JSON.stringify(response.data.user));
        return response.data.user;
      }
      // Invalid token - logout
      dispatch(logout());
      return rejectWithValue('Session expired');
    } catch (error) {
      // Token invalid - logout
      dispatch(logout());
      const axiosError = error as AxiosError<ApiResponse>;
      const message =
        axiosError.response?.data?.message || 'Session expired';
      return rejectWithValue(message);
    }
  }
);

// Slice
const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.error = null;
      // Clear localStorage
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    },
    clearError: (state) => {
      state.error = null;
    },
    setCredentials: (
      state,
      action: PayloadAction<{ user: User; token: string }>
    ) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.isAuthenticated = true;
      // Store in localStorage
      localStorage.setItem('token', action.payload.token);
      localStorage.setItem('user', JSON.stringify(action.payload.user));
    },
  },
  extraReducers: (builder) => {
    builder
      // Login
      .addCase(login.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.isAuthenticated = true;
        state.error = null;
      })
      .addCase(login.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Register
      .addCase(register.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(register.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.isAuthenticated = true;
        state.error = null;
      })
      .addCase(register.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Get current user
      .addCase(getCurrentUser.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getCurrentUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload;
      })
      .addCase(getCurrentUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Check auth status
      .addCase(checkAuthStatus.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(checkAuthStatus.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload;
        state.isAuthenticated = true;
      })
      .addCase(checkAuthStatus.rejected, (state) => {
        state.isLoading = false;
        state.user = null;
        state.token = null;
        state.isAuthenticated = false;
      });
  },
});

export const { logout, clearError, setCredentials } = authSlice.actions;
export default authSlice.reducer;
