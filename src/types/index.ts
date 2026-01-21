// User roles
export enum UserRole {
  ADMIN = 'ADMIN',
  MANAGER = 'MANAGER',
  STAFF = 'STAFF',
}

// User status
export enum UserStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
}

// Project status
export enum ProjectStatus {
  ACTIVE = 'ACTIVE',
  ARCHIVED = 'ARCHIVED',
  DELETED = 'DELETED',
}

// User interface
export interface User {
  _id: string;
  name: string;
  email: string;
  role: UserRole;
  status: UserStatus;
  invitedAt?: string;
  createdAt: string;
  updatedAt: string;
}

// Invite interface
export interface Invite {
  _id: string;
  email: string;
  role: UserRole;
  token: string;
  expiresAt: string;
  acceptedAt?: string;
  createdAt: string;
}

// Project interface
export interface Project {
  _id: string;
  name: string;
  description?: string;
  status: ProjectStatus;
  isDeleted: boolean;
  createdBy: User | string;
  createdAt: string;
  updatedAt: string;
}

// Pagination interface
export interface Pagination {
  currentPage: number;
  totalPages: number;
  totalCount: number;
  limit: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

// API Response interface
export interface ApiResponse<T = unknown> {
  success: boolean;
  message: string;
  data?: T;
  errors?: Array<{
    field: string;
    message: string;
  }>;
}

// Paginated response
export interface PaginatedResponse<T> {
  items: T[];
  pagination: Pagination;
}

// Login credentials
export interface LoginCredentials {
  email: string;
  password: string;
}

// Registration data
export interface RegisterData {
  token: string;
  name: string;
  password: string;
}

// Create invite data
export interface CreateInviteData {
  email: string;
  role: UserRole;
}

// Create project data
export interface CreateProjectData {
  name: string;
  description?: string;
}

// Update project data
export interface UpdateProjectData {
  name?: string;
  description?: string;
  status?: ProjectStatus;
}

// Auth state
export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

// Users state
export interface UsersState {
  users: User[];
  pagination: Pagination | null;
  isLoading: boolean;
  error: string | null;
}

// Projects state
export interface ProjectsState {
  projects: Project[];
  pagination: Pagination | null;
  selectedProject: Project | null;
  isLoading: boolean;
  error: string | null;
}

// Stats interfaces
export interface UserStats {
  total: number;
  active: number;
  inactive: number;
  byRole: Array<{ role: string; count: number }>;
}

export interface ProjectStats {
  total: number;
  active: number;
  archived: number;
  deleted: number;
}

// Invite response
export interface InviteResponse {
  invite: {
    id: string;
    email: string;
    role: UserRole;
    expiresAt: string;
  };
  inviteToken: string;
  inviteLink: string;
}

// Verify invite response
export interface VerifyInviteResponse {
  email: string;
  role: UserRole;
  expiresAt: string;
}
