import { useState } from "react";
import { Link, Outlet, useLocation } from "react-router";
import { Home, BookOpen, LogOut, Menu, X, Bell, HomeIcon } from "lucide-react";

import {
  useGetMeQuery,
  useLogoutMutation,
} from "@/redux/features/auth/auth.api";
import { useNavigate } from "react-router";

const AdminDashboardLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const { data: user } = useGetMeQuery(undefined);
  const [logout] = useLogoutMutation();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout(undefined).unwrap();
      navigate("/login");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const navigationItems = [
    {
      name: "Dashboard",
      href: "/admin/dashboard",
      icon: Home,
      current: location.pathname === "/admin/dashboard",
    },

    {
      name: "Home",
      href: "/",
      icon: HomeIcon,
      current: location.pathname === "/",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Mobile sidebar toggle */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-4 py-3 flex justify-between items-center">
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-2 rounded-md text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
        >
          {sidebarOpen ? (
            <X className="h-6 w-6" />
          ) : (
            <Menu className="h-6 w-6" />
          )}
        </button>
        <div className="flex items-center gap-3">
          <button className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300">
            <Bell className="h-5 w-5" />
          </button>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-indigo-100 dark:bg-indigo-900 flex items-center justify-center">
              <span className="text-sm font-medium text-indigo-600 dark:text-indigo-300">
                {user?.name?.charAt(0) || "U"}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Sidebar desktop */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-64 lg:flex-col">
        <div className="flex flex-col flex-grow pt-5 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 overflow-y-auto">
          {/* Logo */}
          <div className="flex items-center justify-center px-4 pb-4">
            <Link to="/dashboard" className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-lg bg-indigo-600 flex items-center justify-center">
                <BookOpen className="h-6 w-6 text-white" />
              </div>
              <span className="text-xl font-bold text-gray-900 dark:text-white">
                EduTech
              </span>
            </Link>
          </div>

          {/* User info */}
          <div className="px-4 pb-6 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-indigo-100 dark:bg-indigo-900 flex items-center justify-center">
                <span className="text-lg font-semibold text-indigo-600 dark:text-indigo-300">
                  {user?.name?.charAt(0) || "U"}
                </span>
              </div>
              <div>
                <h3 className="font-medium text-gray-900 dark:text-white">
                  {user?.name || "User"}
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Admin
                </p>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="mt-6 flex-1 px-2 space-y-1">
            {navigationItems.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={`
                  group flex items-center px-3 py-2.5 text-sm font-medium rounded-md transition-colors
                  ${
                    item.current
                      ? "bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300"
                      : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-gray-100"
                  }
                `}
              >
                <item.icon
                  className={`
                    mr-3 h-5 w-5 flex-shrink-0
                    ${
                      item.current
                        ? "text-indigo-600 dark:text-indigo-400"
                        : "text-gray-400 dark:text-gray-500 group-hover:text-gray-500 dark:group-hover:text-gray-400"
                    }
                  `}
                />
                {item.name}
              </Link>
            ))}
          </nav>

          {/* Logout button */}
          <div className="p-4 border-t border-gray-200 dark:border-gray-700">
            <button
              onClick={handleLogout}
              className="flex items-center w-full px-3 py-2.5 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-gray-100 rounded-md transition-colors"
            >
              <LogOut className="mr-3 h-5 w-5 text-gray-400 dark:text-gray-500" />
              Logout
            </button>
          </div>
        </div>
      </div>

      {/* Mobile sidebar */}
      {sidebarOpen && (
        <div className="lg:hidden fixed inset-0 z-40">
          <div
            className="fixed inset-0 bg-gray-600 bg-opacity-75"
            onClick={() => setSidebarOpen(false)}
          />
          <div className="fixed inset-y-0 left-0 flex max-w-xs w-full">
            <div className="relative flex-1 flex flex-col max-w-xs w-full pt-5 pb-4 bg-white dark:bg-gray-800">
              <div className="absolute top-0 right-0 -mr-12 pt-2">
                <button
                  onClick={() => setSidebarOpen(false)}
                  className="ml-1 flex items-center justify-center h-10 w-10 rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
                >
                  <X className="h-6 w-6 text-white" />
                </button>
              </div>
              {/* Mobile sidebar content */}
              <div className="flex-shrink-0 flex items-center px-4 pb-4">
                <Link
                  to="/dashboard"
                  className="flex items-center gap-2"
                  onClick={() => setSidebarOpen(false)}
                >
                  <div className="w-10 h-10 rounded-lg bg-indigo-600 flex items-center justify-center">
                    <BookOpen className="h-6 w-6 text-white" />
                  </div>
                  <span className="text-xl font-bold text-gray-900 dark:text-white">
                    EduTech
                  </span>
                </Link>
              </div>
              <div className="px-4 pb-6 border-b border-gray-200 dark:border-gray-700">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-indigo-100 dark:bg-indigo-900 flex items-center justify-center">
                    <span className="text-lg font-semibold text-indigo-600 dark:text-indigo-300">
                      {user?.name?.charAt(0) || "U"}
                    </span>
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900 dark:text-white">
                      {user?.name || "User"}
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Admin
                    </p>
                  </div>
                </div>
              </div>
              <nav className="mt-6 flex-1 px-2 space-y-1">
                {navigationItems.map((item) => (
                  <Link
                    key={item.name}
                    to={item.href}
                    onClick={() => setSidebarOpen(false)}
                    className={`
                      group flex items-center px-3 py-2.5 text-sm font-medium rounded-md transition-colors
                      ${
                        item.current
                          ? "bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300"
                          : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-gray-100"
                      }
                    `}
                  >
                    <item.icon
                      className={`
                        mr-3 h-5 w-5 flex-shrink-0
                        ${
                          item.current
                            ? "text-indigo-600 dark:text-indigo-400"
                            : "text-gray-400 dark:text-gray-500 group-hover:text-gray-500 dark:group-hover:text-gray-400"
                        }
                      `}
                    />
                    {item.name}
                  </Link>
                ))}
              </nav>
              <div className="p-4 border-t border-gray-200 dark:border-gray-700">
                <button
                  onClick={() => {
                    handleLogout();
                    setSidebarOpen(false);
                  }}
                  className="flex items-center w-full px-3 py-2.5 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-gray-100 rounded-md transition-colors"
                >
                  <LogOut className="mr-3 h-5 w-5 text-gray-400 dark:text-gray-500" />
                  Logout
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main content */}
      <div className="lg:pl-64 flex flex-col flex-1">
        <main className="flex-1 pb-8 pt-16 lg:pt-8">
          <div className="px-4 sm:px-6 lg:px-8">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminDashboardLayout;
