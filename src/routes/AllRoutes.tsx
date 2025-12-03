import RootLayout from "@/layouts/RootLayout";
import Login from "@/pages/auth/Login";
import CourseDetailsPage from "@/pages/course/CourseDetails";
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
  ]);

  return <RouterProvider router={routes} />;
};

export default AllRoutes;
