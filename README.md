# NexusAdmin Frontend

Modern admin dashboard with dark glassmorphism UI for role-based user and project management.

## Tech Stack

- **Framework**: React 18 + Vite
- **Language**: TypeScript
- **State**: Redux Toolkit
- **Styling**: Tailwind CSS + Custom glassmorphism
- **Animations**: Framer Motion
- **Forms**: React Hook Form
- **HTTP**: Axios with interceptors
- **Notifications**: React Toastify + SweetAlert2

## Architecture

```
src/
├── components/
│   ├── guards/      # Route protection (AuthGuard, RoleGuard)
│   ├── layout/      # MainLayout, Header, Sidebar
│   └── ui/          # Reusable components (Button, Card, Modal...)
├── features/        # Redux slices (auth, users, projects)
├── hooks/           # Custom hooks (useAppDispatch, usePermissions)
├── pages/           # Route pages (Dashboard, Users, Projects, Login)
├── services/        # API service layer
├── types/           # TypeScript interfaces
└── App.tsx          # Router configuration
```

### Design Patterns

- **Feature-based Redux**: Each feature has its own slice with async thunks
- **Container/Presentational**: Pages handle logic, UI components are stateless
- **Custom Hooks**: Abstract Redux/permission logic for reusability
- **Service Layer**: API calls isolated from components

### Component Hierarchy

```
App
├── AuthGuard
│   └── MainLayout
│       ├── Sidebar (fixed)
│       ├── Header
│       └── Page Content
│           ├── Dashboard
│           ├── Users (Admin/Manager)
│           └── Projects
└── Public Routes
    ├── Login
    └── Register
```

### State Management

| Slice | Purpose |
|-------|---------|
| auth | User session, tokens, login state |
| users | User list, pagination, filters |
| projects | Project CRUD, pagination |

## Setup

### Prerequisites
- Node.js 18+
- Backend API running on port 5000

### Installation

```bash
# Install dependencies
npm install

# Configure environment
cp .env.example .env
# Edit VITE_API_URL if needed

# Run development server
npm run dev

# Build for production
npm run build
npm run preview
```

### Environment Variables

```env
VITE_API_URL=http://localhost:5000/api
```

## Features

### Authentication
- JWT-based login with auto-refresh
- Invitation-only registration
- Persistent sessions via localStorage

### Dashboard
- Stats overview (users, projects)
- Quick action cards
- Role-based content visibility

### User Management (Admin/Manager)
- User listing with search & filters
- Role assignment (Admin only)
- Account activation/deactivation
- Invitation system with copyable links

### Project Management
- CRUD operations
- Status filtering (Active/Archived)
- Soft delete with admin restore capability

### UI/UX
- Dark glassmorphism theme
- Framer Motion animations
- Responsive design (mobile-first)
- Loading states & error handling

## Tradeoffs & Assumptions

### Tradeoffs

1. **Redux over React Query**: Chose Redux Toolkit for centralized state. React Query would reduce boilerplate for server state but adds learning curve.

2. **Tailwind over CSS Modules**: Utility-first CSS is verbose in JSX but enables rapid prototyping. Custom glassmorphism classes in `index.css` for reusability.

3. **SweetAlert2 for Confirmations**: Heavier than native confirms but provides consistent dark-themed dialogs without custom modal state.

4. **Client-side Filtering**: Search/filter happens on paginated server data. For large datasets, full server-side filtering would be more efficient.

5. **Framer Motion Bundle Size**: Adds ~40KB gzipped. Worth it for smooth animations, but could use CSS animations for lighter builds.

### Assumptions

1. **Modern Browsers**: Uses CSS backdrop-filter, grid, flexbox. IE11 not supported.

2. **Single Tab Session**: No cross-tab sync for auth state. Logging out in one tab doesn't affect others until refresh.

3. **API Availability**: Assumes backend is always reachable. No offline mode or service worker caching.

4. **Token Storage**: JWTs stored in localStorage for simplicity. HttpOnly cookies would be more secure against XSS.

5. **Static Roles**: Role permissions are hardcoded. Dynamic permission system would require backend changes.

## Project Structure

```
├── public/
├── src/
│   ├── components/
│   │   ├── guards/
│   │   │   ├── AuthGuard.tsx
│   │   │   └── RoleGuard.tsx
│   │   ├── layout/
│   │   │   ├── Header.tsx
│   │   │   ├── MainLayout.tsx
│   │   │   └── Sidebar.tsx
│   │   └── ui/
│   │       ├── Badge.tsx
│   │       ├── Button.tsx
│   │       ├── Card.tsx
│   │       ├── Input.tsx
│   │       ├── LoadingSpinner.tsx
│   │       ├── Modal.tsx
│   │       ├── Pagination.tsx
│   │       └── Select.tsx
│   ├── features/
│   │   ├── auth/
│   │   ├── projects/
│   │   └── users/
│   ├── pages/
│   │   ├── Dashboard.tsx
│   │   ├── Login.tsx
│   │   ├── Projects.tsx
│   │   ├── Register.tsx
│   │   └── Users.tsx
│   ├── services/
│   ├── hooks/
│   ├── types/
│   ├── App.tsx
│   ├── index.css
│   └── main.tsx
├── tailwind.config.js
├── vite.config.ts
└── tsconfig.json
```

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start dev server (port 3000) |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build |
| `npm run lint` | Run ESLint |

## License

MIT
