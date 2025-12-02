import App from "@/App";
import RootLayout from "@/layouts/RootLayout";

import { createBrowserRouter, RouterProvider } from "react-router";

const AllRoutes = () => {
  const routes = createBrowserRouter([
    {
      path: "/",
      element: <RootLayout />,
      children: [
        {
          path: "/",
          element: <App />,
        },
      ],
    },
  ]);

  return <RouterProvider router={routes} />;
};

export default AllRoutes;
