import { createBrowserRouter, Navigate } from "react-router-dom";
import { LoginPage } from "@modules/auth/pages/LoginPage";
import { ProtectedRoute } from "@modules/auth/components/ProtectedRoute";
import { MainLayout } from "@common/components/layout/MainLayout";

export const router = createBrowserRouter([
  {
    path: "/login",
    element: <LoginPage />,
  },
  {
    element: <ProtectedRoute />,
    children: [
      {
        element: <MainLayout />,
        children: [
          {
            path: "/",
            element: <Navigate to="/dashboard" replace />,
          },
          {
            path: "/dashboard",
            element: (
              <div className="text-2xl font-bold">
                Dashboard (Coming in Day 10)
              </div>
            ),
          },
          // Placeholder routes for sidebar navigation
          {
            path: "/products",
            element: <div className="text-xl">Products (Coming Soon)</div>,
          },
          {
            path: "/categories",
            element: <div className="text-xl">Categories (Coming Soon)</div>,
          },
          {
            path: "/units",
            element: <div className="text-xl">Units (Coming Soon)</div>,
          },
          {
            path: "/vat",
            element: <div className="text-xl">VAT (Coming Soon)</div>,
          },
          {
            path: "/customers",
            element: <div className="text-xl">Customers (Coming Soon)</div>,
          },
          {
            path: "/suppliers",
            element: <div className="text-xl">Suppliers (Coming Soon)</div>,
          },
          {
            path: "/purchase",
            element: <div className="text-xl">Purchase (Coming Soon)</div>,
          },
          {
            path: "/sales",
            element: <div className="text-xl">Sales (Coming Soon)</div>,
          },
          {
            path: "/purchase-return",
            element: (
              <div className="text-xl">Purchase Return (Coming Soon)</div>
            ),
          },
          {
            path: "/sales-return",
            element: (
              <div className="text-xl">Sales Return (Coming Soon)</div>
            ),
          },
          {
            path: "/due-collection",
            element: (
              <div className="text-xl">Due Collection (Coming Soon)</div>
            ),
          },
          {
            path: "/supplier-payment",
            element: (
              <div className="text-xl">Supplier Payment (Coming Soon)</div>
            ),
          },
          {
            path: "/stock/current",
            element: (
              <div className="text-xl">Current Stock (Coming Soon)</div>
            ),
          },
          {
            path: "/stock/low",
            element: <div className="text-xl">Low Stock (Coming Soon)</div>,
          },
          {
            path: "/stock/movements",
            element: (
              <div className="text-xl">Stock Movements (Coming Soon)</div>
            ),
          },
          {
            path: "/reports/sales",
            element: (
              <div className="text-xl">Sales Report (Coming Soon)</div>
            ),
          },
          {
            path: "/reports/purchase",
            element: (
              <div className="text-xl">Purchase Report (Coming Soon)</div>
            ),
          },
          {
            path: "/reports/profit-loss",
            element: (
              <div className="text-xl">Profit & Loss (Coming Soon)</div>
            ),
          },
          {
            path: "/reports/stock",
            element: (
              <div className="text-xl">Stock Report (Coming Soon)</div>
            ),
          },
          {
            path: "/users",
            element: <div className="text-xl">Users (Coming Soon)</div>,
          },
          {
            path: "/settings",
            element: <div className="text-xl">Settings (Coming Soon)</div>,
          },
          {
            path: "/profile",
            element: <div className="text-xl">Profile (Coming Soon)</div>,
          },
        ],
      },
    ],
  },
]);
