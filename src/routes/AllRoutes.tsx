import AdminDashboardLayout from "@/layouts/AdminDashboardLayout";
import DashboardLayout from "@/layouts/DashboardLayout";
import RootLayout from "@/layouts/RootLayout";
import Login from "@/pages/auth/Login";
import CourseDetailsPage from "@/pages/course/CourseDetails";
import AdminDashboardHome from "@/pages/dashboard/AdminDashboardHome";
import CourseContent from "@/pages/dashboard/CourseContents";
import DashboardHome from "@/pages/dashboard/DashboardHome";
import MyCourses from "@/pages/dashboard/MyCourses";
import HomePage from "@/pages/home/HomePage";
import Unauthorized from "@/pages/Unauthorized";

import { createBrowserRouter, RouterProvider } from "react-router";

const AllRoutes = () => {
  const routes = createBrowserRouter([
    {
      path: "/",
      element: <RootLayout />,
      children: [
        {
          path: "/",
          element: <HomePage />,
        },
        {
          path: "/courses/:id",
          element: <CourseDetailsPage />,
        },
        {
          path: "/login",
          element: <Login />,
        },
        {
          path: "/unauthorized",
          element: <Unauthorized />,
        },
      ],
    },
    {
      path: "/dashboard",
      element: <DashboardLayout />,
      children: [
        {
          path: "/dashboard",
          element: <DashboardHome />,
        },
        {
          path: "courses",
          children: [
            {
              index: true,
              element: <MyCourses />,
            },
            {
              path: ":enrollmentId",
              element: <CourseContent />,
            },
          ],
        },
      ],
    },
    {
      path: "/admin",
      element: <AdminDashboardLayout />,
      children: [
        {
          path: "/admin/dashboard",
          element: <AdminDashboardHome />,
        },
      ],
    },
  ]);

  return <RouterProvider router={routes} />;
};

export default AllRoutes;
