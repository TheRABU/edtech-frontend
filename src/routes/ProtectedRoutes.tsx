import type { ReactNode } from "react";
import { Navigate, useLocation } from "react-router";
import { useAuth } from "@/hooks/useAuth";
import { Loader2 } from "lucide-react";

interface ProtectedRouteProps {
  children: ReactNode;
  requiredRole?: string | string[];
}

const ProtectedRoute = ({ children, requiredRole }: ProtectedRouteProps) => {
  const location = useLocation();
  const { isAuthenticated, isLoading, user, isUnauthorized } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto text-indigo-600 mb-4" />
          <p className="text-gray-600 dark:text-gray-400">
            Checking authentication...
          </p>
        </div>
      </div>
    );
  }

  if (isUnauthorized || !isAuthenticated) {
    return (
      <Navigate
        to="/login"
        state={{
          from: location,
          message: "Please login to access this page",
        }}
        replace
      />
    );
  }

  if (requiredRole && user) {
    const userRole = user.role || "student";
    const requiredRoles = Array.isArray(requiredRole)
      ? requiredRole
      : [requiredRole];

    if (!requiredRoles.includes(userRole)) {
      return (
        <Navigate
          to="/unauthorized"
          state={{
            from: location,
            requiredRole,
            userRole,
          }}
          replace
        />
      );
    }
  }

  return <>{children}</>;
};

export default ProtectedRoute;
