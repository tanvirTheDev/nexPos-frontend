import {
  LayoutDashboard,
  Package,
  Users,
  ShoppingCart,
  BarChart3,
  Settings,
  Box,
  CreditCard,
} from "lucide-react";

export interface SidebarItem {
  label: string;
  icon?: any;
  to?: string;
  permission?: string;
  subItems?: SidebarItem[];
}

export const SIDEBAR_ITEMS: SidebarItem[] = [
  {
    label: "Dashboard",
    icon: LayoutDashboard,
    to: "/dashboard",
    permission: "dashboard:view",
  },
  {
    label: "Basic",
    icon: Box,
    subItems: [
      {
        label: "Product Info",
        subItems: [
          { label: "Products", to: "/products", permission: "product:view" },
          {
            label: "Categories",
            to: "/categories",
            permission: "category:view",
          },
          { label: "Units", to: "/units", permission: "unit:view" },
          { label: "VAT", to: "/vat", permission: "vat:view" },
        ],
      },
      { label: "Customers", to: "/customers", permission: "customer:view" },
      { label: "Suppliers", to: "/suppliers", permission: "supplier:view" },
    ],
  },
  {
    label: "Transaction",
    icon: CreditCard,
    subItems: [
      { label: "Purchase", to: "/purchase", permission: "purchase:view" },
      { label: "Sales", to: "/sales", permission: "sales:view" },
      {
        label: "Purchase Return",
        to: "/purchase-return",
        permission: "purchase:view",
      },
      { label: "Sales Return", to: "/sales-return", permission: "sales:view" },
      {
        label: "Due Collection",
        to: "/due-collection",
        permission: "payment:view",
      },
      {
        label: "Supplier Payment",
        to: "/supplier-payment",
        permission: "payment:view",
      },
    ],
  },
  {
    label: "Stock",
    icon: Package,
    subItems: [
      {
        label: "Current Stock",
        to: "/stock/current",
        permission: "stock:view",
      },
      { label: "Low Stock", to: "/stock/low", permission: "stock:view" },
      {
        label: "Stock Movements",
        to: "/stock/movements",
        permission: "stock:view",
      },
    ],
  },
  {
    label: "Reports",
    icon: BarChart3,
    subItems: [
      {
        label: "Sales Report",
        to: "/reports/sales",
        permission: "reports:view",
      },
      {
        label: "Purchase Report",
        to: "/reports/purchase",
        permission: "reports:view",
      },
      {
        label: "Profit & Loss",
        to: "/reports/profit-loss",
        permission: "reports:view",
      },
      {
        label: "Stock Report",
        to: "/reports/stock",
        permission: "reports:view",
      },
    ],
  },
  {
    label: "Users",
    icon: Users,
    to: "/users",
    permission: "user:view",
  },
  {
    label: "Settings",
    icon: Settings,
    to: "/settings",
  },
];
