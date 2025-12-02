import RootLayout from "@/layouts/RootLayout";
import CourseDetailsPage from "@/pages/course/CourseDetails";
import HomePage from "@/pages/home/HomePage";

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
      ],
    },
  ]);

  return <RouterProvider router={routes} />;
};

export default AllRoutes;
