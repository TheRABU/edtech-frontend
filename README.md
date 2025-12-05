EdTech Frontend
A modern, production-ready React application for the LMS platform EdTechBD. Built with React 19, TypeScript, Vite, and Tailwind CSS to deliver a seamless learning experience across all devices.

## Features
  - Authentication & User Management
  - JWT-based authentication with HTTP-only cookies

  - Protected routes with role-based access control
  
  - Student registration and login flows
  
  - Admin dashboard with elevated privileges
  
  - Persistent login state with Redux

   Course Discovery & Enrollment
    - Interactive course browsing with filters
    
    - Server-side pagination and infinite scroll
    
    - Advanced search by title, instructor, category
    
    - Sorting by price, rating, and popularity
    
    - Detailed course view with syllabus preview
    
    - One-click enrollment with secure payment flow
  
  - Learning Experience
  - Interactive video player with progress tracking which uses youtube embeded links

   - Lesson completion marking

- Real-time progress indicators

- Course navigation and bookmarking
- Student performance tracking

### Admin Management
Full course CRUD operations with COURSE





### UI/UX Excellence
Fully responsive design (mobile-first approach)

Dark/Light theme support

Smooth animations and transitions

Accessible components (ARIA compliant)

Loading states and skeletons

Offline support with service workers

Tech Stack
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

 
######## Getting Started
Prerequisites
Node.js 18+ or 20+

npm, yarn, or pnpm

Backend server running (see backend README)

Installation
Clone and install dependencies:

```
bash
git clone <repository-url>
cd frontend
npm install
```
Environment Configuration:
Create a .env file in the root directory:

env
# API Configuration
```
VITE_API_BASE_URL= live-backend-link
VITE_API_BASE_URL_LOCAL = http://localhost:5000/api/v1
```




Development Server:
```
bash
npm run dev
Open http://localhost:5173 in your browser.
```
Production Build:
```
bash
npm run build
```

Styling & Theming
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



### Redux Store Configuration
typescript



Component Architecture
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

 
#### API Integration
Axios Configuration

Axios intercepter was used

/lib/axios.ts
````
import config from "@/config";
import axios from "axios";

export const axiosInstance = axios.create({
  baseURL: config.baseUrl,
  withCredentials: true,
});

// Add a request interceptor
axiosInstance.interceptors.request.use(
  function (config) {
    return config;
  },
  function (error) {
    return Promise.reject(error);
  }
);

// Add a response interceptor
axiosInstance.interceptors.response.use(
  function onFulfilled(response) {
    return response;
  },
  function onRejected(error) {

    return Promise.reject(error);
  }
);

````

## Security & Best Practices
Security Features
HTTP-only cookies for JWT storage

CSRF protection with axios defaults

XSS prevention through React's built-in escaping

Secure route protection with role-based guards

Input sanitization and validation

Performance Optimizations
Code splitting with dynamic imports


Memoization of expensive computations

Virtual scrolling for long lists

Service worker for offline support

Accessibility
ARIA labels and roles

Keyboard navigation support

Screen reader compatibility

Focus management

Color contrast compliance (WCAG 2.1)

# Deployment
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
```
VITE_API_BASE_URL=https://api.coursemaster.live/api/v1
VITE_APP_ENV=production
```





          Support
            Documentation: docs.coursemaster.live
            
            Issue Tracker: GitHub Issues
            
            Email Support: support@coursemaster.com

📄 License
This project is licensed under the MIT License - see the LICENSE file for details.

 Acknowledgments
Vite for the excellent build tooling

Tailwind CSS for the utility-first CSS

React Hook Form for form management

Built with ❤️ for the future of education
