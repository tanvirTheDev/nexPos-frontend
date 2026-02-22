import { createBrowserRouter, Navigate } from "react-router-dom";
import { LoginPage } from "@modules/auth/pages/LoginPage";
import { ProtectedRoute } from "@modules/auth/components/ProtectedRoute";
import { RoleGuard } from "@modules/auth/components/RoleGuard";
import { MainLayout } from "@common/components/layout/MainLayout";
import { DashboardPage } from "@modules/dashboard/pages/DashboardPage";
import { OrganizationPage } from "@modules/organization/pages/OrganizationPage";
import { UserPage } from "@modules/user/pages/UserPage";
import { ProductPage } from "@modules/product/pages/ProductPage";
import { CategoryPage } from "@modules/product/pages/CategoryPage";
import { UnitPage } from "@modules/product/pages/UnitPage";
import { VATPage } from "@modules/product/pages/VATPage";
import { CustomerPage } from "@modules/customer/pages/CustomerPage";
import { SupplierPage } from "@modules/supplier/pages/SupplierPage";
import { PurchasePage } from "@modules/purchase/pages/PurchasePage";
import { SalePage } from "@modules/sale/pages/SalePage";
import { PurchaseReturnPage } from "@modules/purchase-return/pages/PurchaseReturnPage";
import { SalesReturnPage } from "@modules/sales-return/pages/SalesReturnPage";
import { DueCollectionPage } from "@modules/due-collection/pages/DueCollectionPage";
import { SupplierPaymentPage } from "@modules/supplier-payment/pages/SupplierPaymentPage";
import { CurrentStockPage } from "@modules/stock/pages/CurrentStockPage";
import { LowStockPage } from "@modules/stock/pages/LowStockPage";
import { StockMovementsPage } from "@modules/stock/pages/StockMovementsPage";
import { SalesReportPage } from "@modules/reports/pages/SalesReportPage";
import { PurchaseReportPage } from "@modules/reports/pages/PurchaseReportPage";
import { ProfitLossPage } from "@modules/reports/pages/ProfitLossPage";
import { StockReportPage } from "@modules/reports/pages/StockReportPage";
import { CustomerReportPage } from "@modules/reports/pages/CustomerReportPage";
import { SupplierReportPage } from "@modules/reports/pages/SupplierReportPage";

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
            element: <DashboardPage />,
          },
          {
            path: "/organizations",
            element: (
              <RoleGuard roles={["SuperAdmin"]}>
                <OrganizationPage />
              </RoleGuard>
            ),
          },
          {
            path: "/users",
            element: <UserPage />,
          },
          {
            path: "/products",
            element: <ProductPage />,
          },
          {
            path: "/categories",
            element: <CategoryPage />,
          },
          {
            path: "/units",
            element: <UnitPage />,
          },
          {
            path: "/vat",
            element: <VATPage />,
          },
          {
            path: "/customers",
            element: <CustomerPage />,
          },
          {
            path: "/suppliers",
            element: <SupplierPage />,
          },
          {
            path: "/purchase",
            element: <PurchasePage />,
          },
          {
            path: "/sales",
            element: <SalePage />,
          },
          {
            path: "/purchase-return",
            element: <PurchaseReturnPage />,
          },
          {
            path: "/sales-return",
            element: <SalesReturnPage />,
          },
          {
            path: "/due-collection",
            element: <DueCollectionPage />,
          },
          {
            path: "/supplier-payment",
            element: <SupplierPaymentPage />,
          },
          {
            path: "/stock/current",
            element: <CurrentStockPage />,
          },
          {
            path: "/stock/low",
            element: <LowStockPage />,
          },
          {
            path: "/stock/movements",
            element: <StockMovementsPage />,
          },
          {
            path: "/reports/sales",
            element: <SalesReportPage />,
          },
          {
            path: "/reports/purchase",
            element: <PurchaseReportPage />,
          },
          {
            path: "/reports/profit-loss",
            element: <ProfitLossPage />,
          },
          {
            path: "/reports/stock",
            element: <StockReportPage />,
          },
          {
            path: "/reports/customers",
            element: <CustomerReportPage />,
          },
          {
            path: "/reports/suppliers",
            element: <SupplierReportPage />,
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
