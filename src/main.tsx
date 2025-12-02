import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { Provider as ReduxProvider } from "react-redux";
import { store } from "./redux/store.ts";
import AllRoutes from "./routes/AllRoutes.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ReduxProvider store={store}>
      <AllRoutes />
    </ReduxProvider>
  </StrictMode>
);
