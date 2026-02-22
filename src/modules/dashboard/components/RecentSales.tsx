import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@common/components/ui/card";
import { Badge } from "@common/components/ui/badge";
import { Skeleton } from "@common/components/ui/skeleton";
import { useGetRecentSalesQuery } from "../services/dashboardApi";
import { format } from "date-fns";

interface SaleItem {
  id: string;
  invoiceNumber: string;
  customerId?: { name: string };
  totalAmount: number;
  paymentStatus: "paid" | "partial" | "unpaid";
  saleDate: string;
}

const paymentStatusVariant = (status: string) => {
  switch (status) {
    case "paid":
      return "default" as const;
    case "partial":
      return "secondary" as const;
    case "unpaid":
      return "destructive" as const;
    default:
      return "secondary" as const;
  }
};

export const RecentSales = () => {
  const { data, isLoading } = useGetRecentSalesQuery(undefined);

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-5 w-32" />
          <Skeleton className="h-4 w-48" />
        </CardHeader>
        <CardContent className="space-y-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-14 w-full" />
          ))}
        </CardContent>
      </Card>
    );
  }

  const sales: SaleItem[] = data?.data || [];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Sales</CardTitle>
        <CardDescription>Latest {sales.length} transactions</CardDescription>
      </CardHeader>
      <CardContent>
        {sales.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-6">
            No recent sales
          </p>
        ) : (
          <div className="space-y-4">
            {sales.map((sale) => (
              <div
                key={sale.id}
                className="flex items-center justify-between border-b pb-3 last:border-0 last:pb-0"
              >
                <div className="space-y-1">
                  <p className="text-sm font-medium">{sale.invoiceNumber}</p>
                  <p className="text-xs text-muted-foreground">
                    {sale.customerId?.name || "Walk-in Customer"} &middot;{" "}
                    {format(new Date(sale.saleDate), "MMM dd, yyyy")}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <Badge variant={paymentStatusVariant(sale.paymentStatus)}>
                    {sale.paymentStatus}
                  </Badge>
                  <span className="text-sm font-semibold">
                    ${sale.totalAmount.toFixed(2)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
