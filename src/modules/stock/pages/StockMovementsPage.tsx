import { useState } from "react";
import { ArrowDownLeft, ArrowUpRight } from "lucide-react";
import { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import { DataTable } from "@common/components/tables/DataTable";
import { Badge } from "@common/components/ui/badge";
import { Input } from "@common/components/ui/input";
import { Label } from "@common/components/ui/label";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@common/components/ui/select";
import { Card, CardContent } from "@common/components/ui/card";
import { TableSkeleton } from "@common/components/common/LoadingState";
import { useGetStockMovementsQuery } from "../services/stockApi";
import type { StockMovement } from "../types";

const typeLabels: Record<string, string> = {
  purchase: "Purchase",
  sale: "Sale",
  purchase_return: "Purchase Return",
  sales_return: "Sales Return",
  adjustment: "Adjustment",
};

const typeVariant = (type: string) => {
  switch (type) {
    case "purchase": return "default" as const;
    case "sale": return "secondary" as const;
    case "purchase_return": return "outline" as const;
    case "sales_return": return "outline" as const;
    default: return "default" as const;
  }
};

export const StockMovementsPage = () => {
  const [typeFilter, setTypeFilter] = useState<string>("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const { data, isLoading } = useGetStockMovementsQuery({
    type: typeFilter || undefined,
    startDate: startDate || undefined,
    endDate: endDate || undefined,
  });

  const columns: ColumnDef<StockMovement>[] = [
    {
      accessorKey: "date",
      header: "Date",
      cell: ({ row }) => format(new Date(row.original.date), "dd MMM yyyy HH:mm"),
    },
    { accessorKey: "productName", header: "Product" },
    {
      accessorKey: "type",
      header: "Type",
      cell: ({ row }) => (
        <Badge variant={typeVariant(row.original.type)}>
          {typeLabels[row.original.type] || row.original.type}
        </Badge>
      ),
    },
    {
      accessorKey: "direction",
      header: "Direction",
      cell: ({ row }) =>
        row.original.direction === "in" ? (
          <div className="flex items-center gap-1 text-green-600">
            <ArrowDownLeft className="h-4 w-4" /> In
          </div>
        ) : (
          <div className="flex items-center gap-1 text-red-500">
            <ArrowUpRight className="h-4 w-4" /> Out
          </div>
        ),
    },
    {
      accessorKey: "quantity",
      header: "Quantity",
      cell: ({ row }) => (
        <span className={row.original.direction === "in" ? "text-green-600" : "text-red-500"}>
          {row.original.direction === "in" ? "+" : "-"}{row.original.quantity}
        </span>
      ),
    },
    {
      accessorKey: "referenceNumber",
      header: "Reference",
      cell: ({ row }) => (
        <span className="font-mono text-sm">{row.original.referenceNumber}</span>
      ),
    },
  ];

  if (isLoading) return <TableSkeleton />;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Stock Movements</h1>
        <p className="text-muted-foreground">Track all stock in/out movements</p>
      </div>

      <Card>
        <CardContent className="pt-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label>Movement Type</Label>
              <Select value={typeFilter} onValueChange={(v) => setTypeFilter(v === "all" ? "" : v)}>
                <SelectTrigger><SelectValue placeholder="All types" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="purchase">Purchase</SelectItem>
                  <SelectItem value="sale">Sale</SelectItem>
                  <SelectItem value="purchase_return">Purchase Return</SelectItem>
                  <SelectItem value="sales_return">Sales Return</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Start Date</Label>
              <Input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>End Date</Label>
              <Input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
            </div>
          </div>
        </CardContent>
      </Card>

      <DataTable
        columns={columns}
        data={data?.data || []}
        searchKey="productName"
        searchPlaceholder="Search by product..."
      />
    </div>
  );
};
