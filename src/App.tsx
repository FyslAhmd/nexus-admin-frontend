import React, { useEffect } from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from 'react-router-dom';
import { Provider } from 'react-redux';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { store } from './store';
import { useAppDispatch, useAppSelector } from './hooks';
import { checkAuthStatus } from './features/auth/authSlice';
import { MainLayout } from './components/layout';
import { AuthGuard, RoleGuard } from './components/guards';
import { Login, Register, Dashboard, Users, Projects } from './pages';
import { LoadingSpinner } from './components/ui';
import { UserRole } from './types';

// Auth status checker component
const AuthChecker: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const dispatch = useAppDispatch();
  const { isLoading, token } = useAppSelector((state) => state.auth);

  useEffect(() => {
    if (token) {
      dispatch(checkAuthStatus());
    }
  }, [dispatch, token]);

  if (isLoading && token) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <LoadingSpinner size="lg" />
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};

// App Routes Component
const AppRoutes: React.FC = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/login" element={<Login />} />
      <Route path="/register/:token" element={<Register />} />

      {/* Protected Routes */}
      <Route
        path="/"
        element={
          <AuthGuard>
            <MainLayout />
          </AuthGuard>
        }
      >
        {/* Dashboard - All authenticated users */}
        <Route index element={<Navigate to="/dashboard" replace />} />
        <Route path="dashboard" element={<Dashboard />} />

        {/* Projects - All authenticated users */}
        <Route path="projects" element={<Projects />} />

        {/* Users - Admin only */}
        <Route
          path="users"
          element={
            <RoleGuard allowedRoles={[UserRole.ADMIN]}>
              <Users />
            </RoleGuard>
          }
        />

        {/* Catch all - redirect to dashboard */}
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Route>

      {/* Fallback Route */}
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
};

// Main App Component
const App: React.FC = () => {
  return (
    <Provider store={store}>
      <Router>
        <AuthChecker>
          <AppRoutes />
        </AuthChecker>
        <ToastContainer
          position="top-right"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
        />
      </Router>
    </Provider>
  );
};

export default App;
