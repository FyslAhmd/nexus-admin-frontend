import { configureStore } from '@reduxjs/toolkit';
import authReducer from './features/auth/authSlice';
import usersReducer from './features/users/usersSlice';
import projectsReducer from './features/projects/projectsSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    users: usersReducer,
    projects: projectsReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
  devTools: import.meta.env.DEV,
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
