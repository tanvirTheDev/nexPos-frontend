import { createBrowserRouter, Navigate } from "react-router-dom";
import { LoginPage } from "@modules/auth/pages/LoginPage";
import { ProtectedRoute } from "@modules/auth/components/ProtectedRoute";

export const router = createBrowserRouter([
  {
    path: "/login",
    element: <LoginPage />,
  },
  {
    element: <ProtectedRoute />,
    children: [
      {
        path: "/dashboard",
        element: (
          <div className="flex items-center justify-center min-h-screen">
            <div className="text-center space-y-2">
              <h1 className="text-3xl font-bold">Dashboard</h1>
              <p className="text-muted-foreground">Coming in Day 9</p>
            </div>
          </div>
        ),
      },
      {
        path: "/",
        element: <Navigate to="/dashboard" replace />,
      },
    ],
  },
]);
