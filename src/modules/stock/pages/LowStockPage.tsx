import { AlertTriangle } from "lucide-react";
import { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "@common/components/tables/DataTable";
import { Badge } from "@common/components/ui/badge";
import { TableSkeleton } from "@common/components/common/LoadingState";
import { useGetLowStockProductsQuery } from "../services/stockApi";
import type { ProductStock } from "../types";

export const LowStockPage = () => {
  const { data, isLoading } = useGetLowStockProductsQuery();

  const columns: ColumnDef<ProductStock>[] = [
    { accessorKey: "productName", header: "Product" },
    {
      accessorKey: "sku",
      header: "SKU",
      cell: ({ row }) => <span className="font-mono text-sm">{row.original.sku}</span>,
    },
    {
      accessorKey: "currentStock",
      header: "Current Stock",
      cell: ({ row }) => (
        <Badge variant="destructive">{row.original.currentStock}</Badge>
      ),
    },
    { accessorKey: "minStock", header: "Min Stock" },
    {
      id: "deficit",
      header: "Deficit",
      cell: ({ row }) => {
        const deficit = row.original.minStock - row.original.currentStock;
        return deficit > 0 ? (
          <span className="text-destructive font-medium">-{deficit}</span>
        ) : (
          <span className="text-muted-foreground">0</span>
        );
      },
    },
    {
      accessorKey: "purchasePrice",
      header: "Purchase Price",
      cell: ({ row }) => `$${row.original.purchasePrice.toFixed(2)}`,
    },
    {
      accessorKey: "salePrice",
      header: "Sale Price",
      cell: ({ row }) => `$${row.original.salePrice.toFixed(2)}`,
    },
  ];

  if (isLoading) return <TableSkeleton />;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <AlertTriangle className="h-8 w-8 text-destructive" />
        <div>
          <h1 className="text-3xl font-bold">Low Stock Alert</h1>
          <p className="text-muted-foreground">
            Products below minimum stock level ({data?.data?.length || 0} items)
          </p>
        </div>
      </div>
      <DataTable
        columns={columns}
        data={data?.data || []}
        searchKey="productName"
        searchPlaceholder="Search products..."
      />
    </div>
  );
};
