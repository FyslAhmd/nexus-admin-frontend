import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { AxiosError } from 'axios';
import { usersApi } from '../../services';
import {
  UsersState,
  User,
  UserRole,
  UserStatus,
  ApiResponse,
} from '../../types';

const initialState: UsersState = {
  users: [],
  pagination: null,
  isLoading: false,
  error: null,
};

// Async thunks
export const fetchUsers = createAsyncThunk(
  'users/fetchUsers',
  async (
    params: {
      page?: number;
      limit?: number;
      search?: string;
      role?: UserRole;
      status?: UserStatus;
    } = {},
    { rejectWithValue }
  ) => {
    try {
      const response = await usersApi.getAll(params);
      if (response.success && response.data) {
        return response.data;
      }
      return rejectWithValue(response.message || 'Failed to fetch users');
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      const message =
        axiosError.response?.data?.message || 'Failed to fetch users';
      return rejectWithValue(message);
    }
  }
);

export const updateUserRole = createAsyncThunk(
  'users/updateRole',
  async (
    { id, role }: { id: string; role: UserRole },
    { rejectWithValue }
  ) => {
    try {
      const response = await usersApi.updateRole(id, role);
      if (response.success && response.data) {
        return response.data.user;
      }
      return rejectWithValue(response.message || 'Failed to update user role');
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      const message =
        axiosError.response?.data?.message || 'Failed to update user role';
      return rejectWithValue(message);
    }
  }
);

export const updateUserStatus = createAsyncThunk(
  'users/updateStatus',
  async (
    { id, status }: { id: string; status: UserStatus },
    { rejectWithValue }
  ) => {
    try {
      const response = await usersApi.updateStatus(id, status);
      if (response.success && response.data) {
        return response.data.user;
      }
      return rejectWithValue(response.message || 'Failed to update user status');
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      const message =
        axiosError.response?.data?.message || 'Failed to update user status';
      return rejectWithValue(message);
    }
  }
);

// Slice
const usersSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {
    clearUsersError: (state) => {
      state.error = null;
    },
    updateUserInList: (state, action: PayloadAction<User>) => {
      const index = state.users.findIndex((u) => u._id === action.payload._id);
      if (index !== -1) {
        state.users[index] = action.payload;
      }
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch users
      .addCase(fetchUsers.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.isLoading = false;
        state.users = action.payload.items;
        state.pagination = action.payload.pagination;
        state.error = null;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Update user role
      .addCase(updateUserRole.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateUserRole.fulfilled, (state, action) => {
        state.isLoading = false;
        const index = state.users.findIndex((u) => u._id === action.payload._id);
        if (index !== -1) {
          state.users[index] = action.payload;
        }
      })
      .addCase(updateUserRole.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Update user status
      .addCase(updateUserStatus.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateUserStatus.fulfilled, (state, action) => {
        state.isLoading = false;
        const index = state.users.findIndex((u) => u._id === action.payload._id);
        if (index !== -1) {
          state.users[index] = action.payload;
        }
      })
      .addCase(updateUserStatus.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearUsersError, updateUserInList } = usersSlice.actions;
export default usersSlice.reducer;
