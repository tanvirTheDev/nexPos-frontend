import { Truck, TruckIcon, AlertCircle, DollarSign } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@common/components/ui/card";
import { Badge } from "@common/components/ui/badge";
import { TableSkeleton } from "@common/components/common/LoadingState";
import { useGetSupplierReportQuery } from "../services/reportApi";

export const SupplierReportPage = () => {
  const { data, isLoading } = useGetSupplierReportQuery();
  const report = data?.data;

  if (isLoading) return <TableSkeleton />;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Supplier Report</h1>
        <p className="text-muted-foreground">Supplier analytics and top suppliers</p>
      </div>

      {report && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-purple-100 rounded-lg"><Truck className="h-5 w-5 text-purple-600" /></div>
                  <div>
                    <p className="text-sm text-muted-foreground">Total Suppliers</p>
                    <p className="text-2xl font-bold">{report.totalSuppliers}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-green-100 rounded-lg"><TruckIcon className="h-5 w-5 text-green-600" /></div>
                  <div>
                    <p className="text-sm text-muted-foreground">Active Suppliers</p>
                    <p className="text-2xl font-bold">{report.activeSuppliers}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-yellow-100 rounded-lg"><AlertCircle className="h-5 w-5 text-yellow-600" /></div>
                  <div>
                    <p className="text-sm text-muted-foreground">With Due Balance</p>
                    <p className="text-2xl font-bold">{report.suppliersWithDue}</p>
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
            <CardHeader><CardTitle>Top 10 Suppliers</CardTitle></CardHeader>
            <CardContent>
              <div className="border rounded-md">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b bg-muted/50">
                      <th className="text-left p-3">#</th>
                      <th className="text-left p-3">Supplier</th>
                      <th className="text-right p-3">Total Purchases</th>
                      <th className="text-right p-3">Total Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    {report.topSuppliers.map((s, idx) => (
                      <tr key={idx} className="border-b last:border-0">
                        <td className="p-3">{idx + 1}</td>
                        <td className="p-3 font-medium">{s.supplierName}</td>
                        <td className="text-right p-3">{s.totalPurchases}</td>
                        <td className="text-right p-3">
                          <Badge variant="secondary">${s.totalAmount.toFixed(2)}</Badge>
                        </td>
                      </tr>
                    ))}
                    {report.topSuppliers.length === 0 && (
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
