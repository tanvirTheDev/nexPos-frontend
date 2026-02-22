import { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "@common/components/tables/DataTable";
import { Badge } from "@common/components/ui/badge";
import { TableSkeleton } from "@common/components/common/LoadingState";
import { useGetCurrentStockQuery } from "../services/stockApi";
import type { ProductStock } from "../types";

export const CurrentStockPage = () => {
  const { data, isLoading } = useGetCurrentStockQuery();

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
        <Badge variant={row.original.isLowStock ? "destructive" : "default"}>
          {row.original.currentStock}
        </Badge>
      ),
    },
    { accessorKey: "minStock", header: "Min Stock" },
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
    {
      accessorKey: "stockValue",
      header: "Stock Value",
      cell: ({ row }) => (
        <span className="font-medium">${row.original.stockValue.toFixed(2)}</span>
      ),
    },
    {
      accessorKey: "isLowStock",
      header: "Status",
      cell: ({ row }) => (
        <Badge variant={row.original.isLowStock ? "destructive" : "secondary"}>
          {row.original.isLowStock ? "Low Stock" : "Normal"}
        </Badge>
      ),
    },
  ];

  if (isLoading) return <TableSkeleton />;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Current Stock</h1>
        <p className="text-muted-foreground">Overview of all product stock levels</p>
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
