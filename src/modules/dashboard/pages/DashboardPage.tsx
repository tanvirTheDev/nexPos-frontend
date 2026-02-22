import {
  DollarSign,
  Package,
  ShoppingCart,
  Users,
  TrendingUp,
  TrendingDown,
} from "lucide-react";
import { StatsCard } from "../components/StatsCard";
import { RecentSales } from "../components/RecentSales";
import { StockAlert } from "../components/StockAlert";
import { useGetDashboardStatsQuery } from "../services/dashboardApi";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@common/components/ui/card";

export const DashboardPage = () => {
  const { data: stats, isLoading } = useGetDashboardStatsQuery(undefined);

  const dashboardData = stats?.data;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground">Overview of your business</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Total Revenue"
          value={`$${dashboardData?.totalRevenue?.toLocaleString() || "0"}`}
          icon={DollarSign}
          description="Total sales revenue"
          trend={
            dashboardData?.revenueTrend
              ? {
                  value: dashboardData.revenueTrend,
                  isPositive: dashboardData.revenueTrend > 0,
                }
              : undefined
          }
          isLoading={isLoading}
        />
        <StatsCard
          title="Total Products"
          value={dashboardData?.totalProducts || 0}
          icon={Package}
          description="Items in inventory"
          isLoading={isLoading}
        />
        <StatsCard
          title="Total Sales"
          value={dashboardData?.totalSales || 0}
          icon={ShoppingCart}
          description="Completed transactions"
          trend={
            dashboardData?.salesTrend
              ? {
                  value: dashboardData.salesTrend,
                  isPositive: dashboardData.salesTrend > 0,
                }
              : undefined
          }
          isLoading={isLoading}
        />
        <StatsCard
          title="Customers"
          value={dashboardData?.totalCustomers || 0}
          icon={Users}
          description="Registered customers"
          isLoading={isLoading}
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="lg:col-span-4">
          <CardHeader>
            <CardTitle>Business Summary</CardTitle>
            <CardDescription>Key financial metrics</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b pb-3">
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-green-600" />
                  <span className="text-sm">Total Purchases</span>
                </div>
                <span className="text-sm font-semibold">
                  ${dashboardData?.totalPurchaseAmount?.toLocaleString() || "0"}
                </span>
              </div>
              <div className="flex items-center justify-between border-b pb-3">
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-green-600" />
                  <span className="text-sm">Total Sales Revenue</span>
                </div>
                <span className="text-sm font-semibold">
                  ${dashboardData?.totalRevenue?.toLocaleString() || "0"}
                </span>
              </div>
              <div className="flex items-center justify-between border-b pb-3">
                <div className="flex items-center gap-2">
                  <TrendingDown className="h-4 w-4 text-red-600" />
                  <span className="text-sm">Total Due (Customers)</span>
                </div>
                <span className="text-sm font-semibold text-red-600">
                  ${dashboardData?.totalCustomerDue?.toLocaleString() || "0"}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <TrendingDown className="h-4 w-4 text-red-600" />
                  <span className="text-sm">Total Due (Suppliers)</span>
                </div>
                <span className="text-sm font-semibold text-red-600">
                  ${dashboardData?.totalSupplierDue?.toLocaleString() || "0"}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="lg:col-span-3">
          <StockAlert />
        </div>
      </div>

      <RecentSales />
    </div>
  );
};
