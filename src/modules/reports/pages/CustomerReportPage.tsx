import { Users, UserCheck, AlertCircle, DollarSign } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@common/components/ui/card";
import { Badge } from "@common/components/ui/badge";
import { TableSkeleton } from "@common/components/common/LoadingState";
import { useGetCustomerReportQuery } from "../services/reportApi";

export const CustomerReportPage = () => {
  const { data, isLoading } = useGetCustomerReportQuery();
  const report = data?.data;

  if (isLoading) return <TableSkeleton />;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Customer Report</h1>
        <p className="text-muted-foreground">Customer analytics and top customers</p>
      </div>

      {report && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-100 rounded-lg"><Users className="h-5 w-5 text-blue-600" /></div>
                  <div>
                    <p className="text-sm text-muted-foreground">Total Customers</p>
                    <p className="text-2xl font-bold">{report.totalCustomers}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-green-100 rounded-lg"><UserCheck className="h-5 w-5 text-green-600" /></div>
                  <div>
                    <p className="text-sm text-muted-foreground">Active Customers</p>
                    <p className="text-2xl font-bold">{report.activeCustomers}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-yellow-100 rounded-lg"><AlertCircle className="h-5 w-5 text-yellow-600" /></div>
                  <div>
                    <p className="text-sm text-muted-foreground">Customers with Due</p>
                    <p className="text-2xl font-bold">{report.customersWithDue}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-red-100 rounded-lg"><DollarSign className="h-5 w-5 text-red-600" /></div>
                  <div>
                    <p className="text-sm text-muted-foreground">Total Due</p>
                    <p className="text-2xl font-bold">${report.totalDueAmount.toFixed(2)}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader><CardTitle>Top 10 Customers</CardTitle></CardHeader>
            <CardContent>
              <div className="border rounded-md">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b bg-muted/50">
                      <th className="text-left p-3">#</th>
                      <th className="text-left p-3">Customer</th>
                      <th className="text-right p-3">Total Sales</th>
                      <th className="text-right p-3">Total Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    {report.topCustomers.map((c, idx) => (
                      <tr key={idx} className="border-b last:border-0">
                        <td className="p-3">{idx + 1}</td>
                        <td className="p-3 font-medium">{c.customerName}</td>
                        <td className="text-right p-3">{c.totalSales}</td>
                        <td className="text-right p-3">
                          <Badge variant="secondary">${c.totalAmount.toFixed(2)}</Badge>
                        </td>
                      </tr>
                    ))}
                    {report.topCustomers.length === 0 && (
                      <tr><td colSpan={4} className="p-4 text-center text-muted-foreground">No data</td></tr>
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
