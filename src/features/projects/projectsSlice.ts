import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { AxiosError } from 'axios';
import { projectsApi } from '../../services';
import {
  ProjectsState,
  Project,
  CreateProjectData,
  UpdateProjectData,
  ProjectStatus,
  ApiResponse,
} from '../../types';

const initialState: ProjectsState = {
  projects: [],
  pagination: null,
  selectedProject: null,
  isLoading: false,
  error: null,
};

// Async thunks
export const fetchProjects = createAsyncThunk(
  'projects/fetchProjects',
  async (
    params: {
      page?: number;
      limit?: number;
      search?: string;
      status?: ProjectStatus;
    } = {},
    { rejectWithValue }
  ) => {
    try {
      const response = await projectsApi.getAll(params);
      if (response.success && response.data) {
        return response.data;
      }
      return rejectWithValue(response.message || 'Failed to fetch projects');
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      const message =
        axiosError.response?.data?.message || 'Failed to fetch projects';
      return rejectWithValue(message);
    }
  }
);

export const createProject = createAsyncThunk(
  'projects/createProject',
  async (data: CreateProjectData, { rejectWithValue }) => {
    try {
      const response = await projectsApi.create(data);
      if (response.success && response.data) {
        return response.data.project;
      }
      return rejectWithValue(response.message || 'Failed to create project');
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      const message =
        axiosError.response?.data?.message || 'Failed to create project';
      return rejectWithValue(message);
    }
  }
);

export const updateProject = createAsyncThunk(
  'projects/updateProject',
  async (
    { id, data }: { id: string; data: UpdateProjectData },
    { rejectWithValue }
  ) => {
    try {
      const response = await projectsApi.update(id, data);
      if (response.success && response.data) {
        return response.data.project;
      }
      return rejectWithValue(response.message || 'Failed to update project');
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      const message =
        axiosError.response?.data?.message || 'Failed to update project';
      return rejectWithValue(message);
    }
  }
);

export const deleteProject = createAsyncThunk(
  'projects/deleteProject',
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await projectsApi.delete(id);
      if (response.success) {
        return id;
      }
      return rejectWithValue(response.message || 'Failed to delete project');
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      const message =
        axiosError.response?.data?.message || 'Failed to delete project';
      return rejectWithValue(message);
    }
  }
);

// Slice
const projectsSlice = createSlice({
  name: 'projects',
  initialState,
  reducers: {
    clearProjectsError: (state) => {
      state.error = null;
    },
    setSelectedProject: (state, action: PayloadAction<Project | null>) => {
      state.selectedProject = action.payload;
    },
    updateProjectInList: (state, action: PayloadAction<Project>) => {
      const index = state.projects.findIndex(
        (p) => p._id === action.payload._id
      );
      if (index !== -1) {
        state.projects[index] = action.payload;
      }
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch projects
      .addCase(fetchProjects.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchProjects.fulfilled, (state, action) => {
        state.isLoading = false;
        state.projects = action.payload.items;
        state.pagination = action.payload.pagination;
        state.error = null;
      })
      .addCase(fetchProjects.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Create project
      .addCase(createProject.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createProject.fulfilled, (state, action) => {
        state.isLoading = false;
        state.projects.unshift(action.payload);
        state.error = null;
      })
      .addCase(createProject.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Update project
      .addCase(updateProject.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateProject.fulfilled, (state, action) => {
        state.isLoading = false;
        const index = state.projects.findIndex(
          (p) => p._id === action.payload._id
        );
        if (index !== -1) {
          state.projects[index] = action.payload;
        }
        state.error = null;
      })
      .addCase(updateProject.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Delete project
      .addCase(deleteProject.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(deleteProject.fulfilled, (state, action) => {
        state.isLoading = false;
        state.projects = state.projects.filter((p) => p._id !== action.payload);
        state.error = null;
      })
      .addCase(deleteProject.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearProjectsError, setSelectedProject, updateProjectInList } =
  projectsSlice.actions;
export default projectsSlice.reducer;
