import { useLocation, Link } from "react-router";
import { AlertTriangle, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

const Unauthorized = () => {
  const location = useLocation();
  const state = location.state as {
    requiredRole?: string | string[];
    userRole?: string;
    from?: string;
  };

  const requiredRoles = state?.requiredRole
    ? Array.isArray(state.requiredRole)
      ? state.requiredRole.join(", ")
      : state.requiredRole
    : "Authenticated User";

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 px-4">
      <div className="max-w-md w-full text-center">
        <div className="inline-flex items-center justify-center w-20 h-20 bg-red-100 dark:bg-red-900/20 rounded-full mb-6">
          <AlertTriangle className="h-10 w-10 text-red-600 dark:text-red-400" />
        </div>

        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-3">
          Access Denied
        </h1>

        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 mb-6 shadow-sm border border-gray-200 dark:border-gray-700">
          <p className="text-gray-600 dark:text-gray-300 mb-4">
            You don't have permission to access this page.
          </p>

          <div className="space-y-2 text-sm text-left">
            {state?.userRole && (
              <div className="flex justify-between">
                <span className="text-gray-500 dark:text-gray-400">
                  Your Role:
                </span>
                <span className="font-medium text-gray-700 dark:text-gray-300">
                  {state.userRole}
                </span>
              </div>
            )}

            <div className="flex justify-between">
              <span className="text-gray-500 dark:text-gray-400">
                Required Role:
              </span>
              <span className="font-medium text-red-600 dark:text-red-400">
                {requiredRoles}
              </span>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button asChild variant="outline">
            <Link to={state?.from || "/"}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Go Back
            </Link>
          </Button>

          {/* <Button asChild>
            <Link to="/dashboard">
              Go to Dashboard
            </Link>
          </Button> */}
        </div>

        <p className="mt-6 text-sm text-gray-500 dark:text-gray-400">
          Need access? Contact your administrator.
        </p>
      </div>
    </div>
  );
};

export default Unauthorized;
