import { useState } from "react";
import { DollarSign, ShoppingCart, CreditCard, AlertCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@common/components/ui/card";
import { Input } from "@common/components/ui/input";
import { Label } from "@common/components/ui/label";
import { Badge } from "@common/components/ui/badge";
import { TableSkeleton } from "@common/components/common/LoadingState";
import { useGetPurchaseReportQuery } from "../services/reportApi";

export const PurchaseReportPage = () => {
  const [startDate, setStartDate] = useState("2026-01-01");
  const [endDate, setEndDate] = useState("2026-12-31");

  const { data, isLoading } = useGetPurchaseReportQuery({ startDate, endDate });
  const report = data?.data;

  if (isLoading) return <TableSkeleton />;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Purchase Report</h1>
          <p className="text-muted-foreground">Purchase analytics and breakdown</p>
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
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-purple-100 rounded-lg"><ShoppingCart className="h-5 w-5 text-purple-600" /></div>
                  <div>
                    <p className="text-sm text-muted-foreground">Total Purchases</p>
                    <p className="text-2xl font-bold">{report.totalPurchases}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-green-100 rounded-lg"><DollarSign className="h-5 w-5 text-green-600" /></div>
                  <div>
                    <p className="text-sm text-muted-foreground">Total Amount</p>
                    <p className="text-2xl font-bold">${report.totalAmount.toFixed(2)}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-emerald-100 rounded-lg"><CreditCard className="h-5 w-5 text-emerald-600" /></div>
                  <div>
                    <p className="text-sm text-muted-foreground">Total Paid</p>
                    <p className="text-2xl font-bold">${report.totalPaid.toFixed(2)}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-red-100 rounded-lg"><AlertCircle className="h-5 w-5 text-red-600" /></div>
                  <div>
                    <p className="text-sm text-muted-foreground">Total Due</p>
                    <p className="text-2xl font-bold">${report.totalDue.toFixed(2)}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader><CardTitle>Top Suppliers</CardTitle></CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {report.purchasesBySupplier.slice(0, 10).map((item, idx) => (
                    <div key={idx} className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-sm">{item.supplierName}</p>
                        <p className="text-xs text-muted-foreground">{item.totalPurchases} purchases</p>
                      </div>
                      <Badge variant="secondary">${item.totalAmount.toFixed(2)}</Badge>
                    </div>
                  ))}
                  {report.purchasesBySupplier.length === 0 && (
                    <p className="text-sm text-muted-foreground text-center py-4">No data</p>
                  )}
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader><CardTitle>Top Products</CardTitle></CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {report.purchasesByProduct.slice(0, 10).map((item, idx) => (
                    <div key={idx} className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-sm">{item.productName}</p>
                        <p className="text-xs text-muted-foreground">Qty: {item.totalQuantity}</p>
                      </div>
                      <Badge variant="secondary">${item.totalAmount.toFixed(2)}</Badge>
                    </div>
                  ))}
                  {report.purchasesByProduct.length === 0 && (
                    <p className="text-sm text-muted-foreground text-center py-4">No data</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </>
      )}
    </div>
  );
};
