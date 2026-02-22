import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@common/components/ui/card";
import { Badge } from "@common/components/ui/badge";
import { Skeleton } from "@common/components/ui/skeleton";
import { AlertTriangle } from "lucide-react";
import { useGetLowStockQuery } from "../services/dashboardApi";

interface LowStockProduct {
  id: string;
  name: string;
  sku: string;
  stock: number;
  minStock: number;
}

export const StockAlert = () => {
  const { data, isLoading } = useGetLowStockQuery(undefined);

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-5 w-32" />
          <Skeleton className="h-4 w-48" />
        </CardHeader>
        <CardContent className="space-y-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-12 w-full" />
          ))}
        </CardContent>
      </Card>
    );
  }

  const products: LowStockProduct[] = data?.data || [];

  if (products.length === 0) return null;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-destructive" />
              Low Stock Alert
            </CardTitle>
            <CardDescription>
              {products.length} products running low on stock
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {products.slice(0, 8).map((product) => (
            <div
              key={product.id}
              className="flex items-center justify-between"
            >
              <div>
                <p className="font-medium text-sm">{product.name}</p>
                <p className="text-xs text-muted-foreground">
                  SKU: {product.sku}
                </p>
              </div>
              <Badge variant="destructive">
                {product.stock} / {product.minStock}
              </Badge>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
