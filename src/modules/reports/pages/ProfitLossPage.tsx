import { useState } from "react";
import { TrendingUp, TrendingDown, DollarSign } from "lucide-react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@common/components/ui/card";
import { Input } from "@common/components/ui/input";
import { Label } from "@common/components/ui/label";
import { Badge } from "@common/components/ui/badge";
import { TableSkeleton } from "@common/components/common/LoadingState";
import { useGetProfitLossReportQuery } from "../services/reportApi";

export const ProfitLossPage = () => {
  const [startDate, setStartDate] = useState("2026-01-01");
  const [endDate, setEndDate] = useState("2026-12-31");

  const { data, isLoading } = useGetProfitLossReportQuery({ startDate, endDate });
  const report = data?.data;

  if (isLoading) return <TableSkeleton />;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Profit & Loss</h1>
          <p className="text-muted-foreground">Revenue, cost, and profit analysis</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="space-y-1">
            <Label className="text-xs">From</Label>
            <Input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} className="h-8 w-36" />
          </div>
          <div className="space-y-1">
            <Label className="text-xs">To</Label>
            <Input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} className="h-8 w-36" />
          </div>
        </div>
      </div>

      {report && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-green-100 rounded-lg"><TrendingUp className="h-5 w-5 text-green-600" /></div>
                  <div>
                    <p className="text-sm text-muted-foreground">Total Revenue</p>
                    <p className="text-2xl font-bold text-green-600">${report.totalRevenue.toFixed(2)}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-red-100 rounded-lg"><TrendingDown className="h-5 w-5 text-red-600" /></div>
                  <div>
                    <p className="text-sm text-muted-foreground">Total Cost</p>
                    <p className="text-2xl font-bold text-red-600">${report.totalCost.toFixed(2)}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-100 rounded-lg"><DollarSign className="h-5 w-5 text-blue-600" /></div>
                  <div>
                    <p className="text-sm text-muted-foreground">Gross Profit</p>
                    <p className={`text-2xl font-bold ${report.grossProfit >= 0 ? "text-green-600" : "text-red-600"}`}>
                      ${report.grossProfit.toFixed(2)}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {report.profitByProduct.length > 0 && (
            <Card>
              <CardHeader><CardTitle>Profit by Product</CardTitle></CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={350}>
                  <BarChart data={report.profitByProduct.slice(0, 15)}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="productName" tick={{ fontSize: 11 }} angle={-20} textAnchor="end" height={60} />
                    <YAxis tick={{ fontSize: 12 }} />
                    <Tooltip
                      formatter={(value) =>
                        typeof value === "number" ? `$${value.toFixed(2)}` : String(value)
                      }
                    />
                    <Legend />
                    <Bar dataKey="revenue" name="Revenue" fill="#22c55e" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="cost" name="Cost" fill="#ef4444" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="profit" name="Profit" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          )}

          <Card>
            <CardHeader><CardTitle>Product Profit Breakdown</CardTitle></CardHeader>
            <CardContent>
              <div className="border rounded-md">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b bg-muted/50">
                      <th className="text-left p-3">Product</th>
                      <th className="text-right p-3">Qty</th>
                      <th className="text-right p-3">Revenue</th>
                      <th className="text-right p-3">Cost</th>
                      <th className="text-right p-3">Profit</th>
                    </tr>
                  </thead>
                  <tbody>
                    {report.profitByProduct.map((item, idx) => (
                      <tr key={idx} className="border-b last:border-0">
                        <td className="p-3">{item.productName}</td>
                        <td className="text-right p-3">{item.quantity}</td>
                        <td className="text-right p-3 text-green-600">${item.revenue.toFixed(2)}</td>
                        <td className="text-right p-3 text-red-600">${item.cost.toFixed(2)}</td>
                        <td className="text-right p-3">
                          <Badge variant={item.profit >= 0 ? "default" : "destructive"}>
                            ${item.profit.toFixed(2)}
                          </Badge>
                        </td>
                      </tr>
                    ))}
                    {report.profitByProduct.length === 0 && (
                      <tr><td colSpan={5} className="p-4 text-center text-muted-foreground">No data</td></tr>
                    )}
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
