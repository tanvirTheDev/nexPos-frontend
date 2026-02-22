import { Package, DollarSign, TrendingUp, AlertTriangle } from "lucide-react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@common/components/ui/card";
import { Badge } from "@common/components/ui/badge";
import { TableSkeleton } from "@common/components/common/LoadingState";
import { useGetStockValuationQuery } from "@modules/stock/services/stockApi";

export const StockReportPage = () => {
  const { data, isLoading } = useGetStockValuationQuery();
  const report = data?.data;

  if (isLoading) return <TableSkeleton />;

  const lowStockCount = report?.products?.filter((p) => p.isLowStock).length || 0;
  const chartData = report?.products?.slice(0, 15).map((p) => ({
    name: p.productName.length > 12 ? p.productName.substring(0, 12) + "..." : p.productName,
    stock: p.currentStock,
    value: p.stockValue,
  })) || [];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Stock Report</h1>
        <p className="text-muted-foreground">Stock valuation and overview</p>
      </div>

      {report && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-100 rounded-lg"><Package className="h-5 w-5 text-blue-600" /></div>
                  <div>
                    <p className="text-sm text-muted-foreground">Total Products</p>
                    <p className="text-2xl font-bold">{report.totalProducts}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-green-100 rounded-lg"><TrendingUp className="h-5 w-5 text-green-600" /></div>
                  <div>
                    <p className="text-sm text-muted-foreground">Total Quantity</p>
                    <p className="text-2xl font-bold">{report.totalStockQuantity}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-emerald-100 rounded-lg"><DollarSign className="h-5 w-5 text-emerald-600" /></div>
                  <div>
                    <p className="text-sm text-muted-foreground">Purchase Value</p>
                    <p className="text-2xl font-bold">${report.totalPurchaseValue.toFixed(2)}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-yellow-100 rounded-lg"><AlertTriangle className="h-5 w-5 text-yellow-600" /></div>
                  <div>
                    <p className="text-sm text-muted-foreground">Low Stock Items</p>
                    <p className="text-2xl font-bold text-red-600">{lowStockCount}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {chartData.length > 0 && (
            <Card>
              <CardHeader><CardTitle>Stock Levels by Product</CardTitle></CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" tick={{ fontSize: 11 }} angle={-20} textAnchor="end" height={60} />
                    <YAxis tick={{ fontSize: 12 }} />
                    <Tooltip />
                    <Bar dataKey="stock" name="Stock Qty" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          )}

          <Card>
            <CardHeader><CardTitle>Stock Valuation Details</CardTitle></CardHeader>
            <CardContent>
              <div className="border rounded-md">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b bg-muted/50">
                      <th className="text-left p-3">Product</th>
                      <th className="text-left p-3">SKU</th>
                      <th className="text-right p-3">Stock</th>
                      <th className="text-right p-3">Purchase Price</th>
                      <th className="text-right p-3">Sale Price</th>
                      <th className="text-right p-3">Stock Value</th>
                      <th className="text-center p-3">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {report.products.map((p, idx) => (
                      <tr key={idx} className="border-b last:border-0">
                        <td className="p-3">{p.productName}</td>
                        <td className="p-3 font-mono text-xs">{p.sku}</td>
                        <td className="text-right p-3">{p.currentStock}</td>
                        <td className="text-right p-3">${p.purchasePrice.toFixed(2)}</td>
                        <td className="text-right p-3">${p.salePrice.toFixed(2)}</td>
                        <td className="text-right p-3 font-medium">${p.stockValue.toFixed(2)}</td>
                        <td className="text-center p-3">
                          <Badge variant={p.isLowStock ? "destructive" : "secondary"}>
                            {p.isLowStock ? "Low" : "OK"}
                          </Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
};
