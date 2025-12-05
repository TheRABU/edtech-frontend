CourseMaster Frontend
A modern, production-ready React application for the CourseMaster E-learning platform. Built with React 19, TypeScript, Vite, and Tailwind CSS to deliver a seamless learning experience across all devices.

🎯 Features
Authentication & User Management
JWT-based authentication with HTTP-only cookies

Protected routes with role-based access control

Student registration and login flows

Admin dashboard with elevated privileges

Persistent login state with Redux

Course Discovery & Enrollment
Interactive course browsing with filters

Server-side pagination and infinite scroll

Advanced search by title, instructor, category

Sorting by price, rating, and popularity

Detailed course view with syllabus preview

One-click enrollment with secure payment flow

Learning Experience
Interactive video player with progress tracking

Lesson completion marking

Real-time progress indicators

Assignment submission system

Interactive quizzes with instant feedback

Course navigation and bookmarking

Admin Management
Full course CRUD operations

Batch management interface

Enrollment analytics dashboard

Assignment review system

Student performance tracking

UI/UX Excellence
Fully responsive design (mobile-first approach)

Dark/Light theme support

Smooth animations and transitions

Accessible components (ARIA compliant)

Loading states and skeletons

Offline support with service workers

🛠️ Tech Stack
Core Frameworks
React 19 - Latest React with concurrent features

TypeScript - Type safety and developer experience

Vite - Next-generation frontend tooling

Tailwind CSS - Utility-first CSS framework

State & Data Management
Redux Toolkit - Predictable state management

React Query - Server state management

Axios - HTTP client with interceptors

Zod - Runtime type validation

UI Components & Styling
Radix UI - Accessible, unstyled UI primitives

Lucide React - Beautiful SVG icons

Class Variance Authority - Type-safe class utilities

Tailwind Merge & clsx - Conditional class utilities

Forms & Validation
React Hook Form - Performant form management

Zod Resolvers - Schema validation integration

React Day Picker - Date selection components

Routing & Navigation
React Router v7 - Declarative routing

React Toastify - Notification system

Development Tools
ESLint - Code quality and consistency

DaisyUI - Tailwind component library

Date-fns - Modern date manipulation

🏗️ Project Structure
text
src/
├── api/              # API client configuration and endpoints
├── assets/           # Static assets (images, fonts, icons)
├── components/       # Reusable UI components
│   ├── ui/          # Base components (Button, Card, etc.)
│   ├── layout/      # Layout components (Header, Footer, Sidebar)
│   └── shared/      # Shared components across features
├── features/         # Feature-based modules
│   ├── auth/        # Authentication flows
│   ├── courses/     # Course browsing and management
│   ├── dashboard/   # Student and admin dashboards
│   ├── learning/    # Course consumption features
│   └── admin/       # Admin management features
├── hooks/           # Custom React hooks
├── lib/             # Utility libraries and helpers
├── pages/           # Page components (routes)
├── routes/          # Route definitions and protected routes
├── store/           # Redux store configuration and slices
├── types/           # TypeScript type definitions
├── utils/           # Helper functions and constants
├── App.tsx          # Root application component
├── main.tsx         # Application entry point
└── vite-env.d.ts    # Vite type definitions
🚀 Getting Started
Prerequisites
Node.js 18+ or 20+

npm, yarn, or pnpm

Backend server running (see backend README)

Installation
Clone and install dependencies:

bash
git clone <repository-url>
cd frontend
npm install
Environment Configuration:
Create a .env file in the root directory:

env
# API Configuration
VITE_API_BASE_URL=http://localhost:5000/api/v1
VITE_API_TIMEOUT=10000

# Application Settings
VITE_APP_NAME=CourseMaster
VITE_APP_VERSION=1.0.0
VITE_DEFAULT_THEME=light

# Feature Flags
VITE_ENABLE_ANALYTICS=true
VITE_ENABLE_OFFLINE_MODE=true

# External Services (Optional)
VITE_GOOGLE_ANALYTICS_ID=UA-XXXXXXXXX-X
VITE_SENTRY_DSN=https://xxxxxxxxxxxxxxxxxxxxx@sentry.io/xxxxxx
Development Server:

bash
npm run dev
Open http://localhost:5173 in your browser.

Production Build:

bash
npm run build
npm run preview
📱 Available Scripts
npm run dev - Start development server with hot reload

npm run build - Build for production

npm run preview - Preview production build locally

npm run lint - Run ESLint for code quality

npm run lint:fix - Fix ESLint issues automatically

🎨 Styling & Theming
The application uses a modern design system built on Tailwind CSS with the following features:

Design Tokens
css
:root {
  --primary: 221 83% 53%;    /* Blue */
  --secondary: 262 83% 58%;  /* Purple */
  --accent: 142 76% 36%;     /* Green */
  --neutral: 220 14% 96%;    /* Light Gray */
  --base-100: 0 0% 100%;     /* White */
  --base-900: 222 47% 11%;   /* Dark Blue */
}
Component Library
Button Variants: primary, secondary, outline, ghost, destructive

Card Types: default, elevated, bordered, interactive

Form Elements: accessible inputs, selects, checkboxes

Feedback States: loading, error, success, empty states

Responsive Breakpoints
Mobile: < 640px

Tablet: 640px - 1024px

Desktop: > 1024px

🔧 Configuration
Vite Configuration
typescript
// vite.config.ts
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
      },
    },
  },
  build: {
    outDir: 'dist',
    sourcemap: true,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom', 'react-router-dom'],
          ui: ['@radix-ui/react-*', 'lucide-react'],
          state: ['@reduxjs/toolkit', 'react-redux'],
        },
      },
    },
  },
});
Redux Store Configuration
typescript
// store/store.ts
export const store = configureStore({
  reducer: {
    auth: authReducer,
    courses: coursesReducer,
    user: userReducer,
    ui: uiReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }).concat(apiMiddleware),
});

// Type-safe hooks
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export const useAppDispatch = useDispatch.withTypes<AppDispatch>();
export const useAppSelector = useSelector.withTypes<RootState>();
📱 Component Architecture
Atomic Design Principles
Atoms: Basic building blocks (Button, Input, Icon)

Molecules: Simple combinations (SearchBar, CourseCard)

Organisms: Complex sections (CourseList, DashboardHeader)

Templates: Page layouts (DashboardLayout, AuthLayout)

Pages: Complete views (HomePage, CourseDetailPage)

Custom Hooks
typescript
// Example custom hook for authentication
export function useAuth() {
  const dispatch = useAppDispatch();
  const { user, isLoading } = useAppSelector((state) => state.auth);

  const login = async (credentials: LoginCredentials) => {
    const result = await dispatch(loginUser(credentials));
    return result;
  };

  const logout = () => dispatch(logoutUser());

  return {
    user,
    isLoading,
    login,
    logout,
    isAuthenticated: !!user,
    isAdmin: user?.role === 'admin',
  };
}
🔌 API Integration
Axios Configuration
typescript
// api/client.ts
const axiosClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  timeout: parseInt(import.meta.env.VITE_API_TIMEOUT),
  withCredentials: true, // For HTTP-only cookies
});

// Request interceptor for adding tokens
axiosClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor for error handling
axiosClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized access
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);
🛡️ Security & Best Practices
Security Features
HTTP-only cookies for JWT storage

CSRF protection with axios defaults

XSS prevention through React's built-in escaping

Secure route protection with role-based guards

Input sanitization and validation

Performance Optimizations
Code splitting with dynamic imports

Image optimization with Vite

Memoization of expensive computations

Virtual scrolling for long lists

Service worker for offline support

Accessibility
ARIA labels and roles

Keyboard navigation support

Screen reader compatibility

Focus management

Color contrast compliance (WCAG 2.1)

📦 Deployment
Vercel Deployment
bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod
Netlify Deployment
bash
# Build command
npm run build

# Publish directory
dist/
Environment Variables for Production
env
VITE_API_BASE_URL=https://api.coursemaster.live/api/v1
VITE_APP_ENV=production
VITE_ENABLE_SENTRY=true
🧪 Testing
Component Testing
bash
# Install testing dependencies
npm install --save-dev @testing-library/react @testing-library/jest-dom vitest

# Run tests
npm test
E2E Testing
bash
# Install Playwright
npm init playwright@latest

# Run E2E tests
npx playwright test
🤝 Contributing
Fork the repository

Create a feature branch (git checkout -b feature/amazing-feature)

Follow the code style (ESLint + Prettier)

Add tests for new functionality

Update documentation as needed

Create a Pull Request

Commit Convention
text
feat: Add new course filter component
fix: Resolve authentication token expiration
docs: Update API integration guide
style: Format component with prettier
refactor: Simplify course card component
test: Add tests for enrollment flow
chore: Update dependencies
🚀 Performance Metrics
First Contentful Paint: < 1.5s

Largest Contentful Paint: < 2.5s

First Input Delay: < 100ms

Cumulative Layout Shift: < 0.1

Bundle Size: < 500kb gzipped

📚 Documentation
Component Library Storybook

API Integration Guide

State Management Guide

Deployment Guide

🆘 Support
Documentation: docs.coursemaster.live

Issue Tracker: GitHub Issues

Email Support: support@coursemaster.com

📄 License
This project is licensed under the MIT License - see the LICENSE file for details.

🙏 Acknowledgments
Vite for the excellent build tooling

Tailwind CSS for the utility-first CSS

Radix UI for accessible primitives

React Hook Form for form management

Built with ❤️ for the future of education
