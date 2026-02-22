import { useState } from "react";
import { Plus, Eye, Trash2 } from "lucide-react";
import { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import { toast } from "sonner";
import { DataTable } from "@common/components/tables/DataTable";
import { FormModal } from "@common/components/forms/FormModal";
import { ConfirmDialog } from "@common/components/forms/ConfirmDialog";
import { Button } from "@common/components/ui/button";
import { Badge } from "@common/components/ui/badge";
import { TableSkeleton } from "@common/components/common/LoadingState";
import {
  useGetSalesQuery,
  useCreateSaleMutation,
  useDeleteSaleMutation,
} from "../services/saleApi";
import { SaleForm } from "../components/SaleForm";
import { SaleDetailDialog } from "../components/SaleDetailDialog";
import type { Sale, CreateSaleInput } from "../types";

const statusVariant = (status: string) => {
  switch (status) {
    case "paid":
      return "default" as const;
    case "partial":
      return "secondary" as const;
    case "unpaid":
      return "destructive" as const;
    default:
      return "default" as const;
  }
};

export const SalePage = () => {
  const { data, isLoading } = useGetSalesQuery();
  const [createSale, { isLoading: isCreating }] = useCreateSaleMutation();
  const [deleteSale, { isLoading: isDeleting }] = useDeleteSaleMutation();

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [detailSale, setDetailSale] = useState<Sale | null>(null);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [saleToDelete, setSaleToDelete] = useState<string | null>(null);

  const handleCreate = async (formData: CreateSaleInput) => {
    try {
      await createSale(formData).unwrap();
      toast.success("Sale created successfully");
      setIsCreateModalOpen(false);
    } catch (error: unknown) {
      const err = error as { data?: { message?: string } };
      toast.error(err?.data?.message || "Failed to create sale");
    }
  };

  const handleDelete = async () => {
    if (!saleToDelete) return;
    try {
      await deleteSale(saleToDelete).unwrap();
      toast.success("Sale deleted successfully");
      setDeleteConfirmOpen(false);
      setSaleToDelete(null);
    } catch (error: unknown) {
      const err = error as { data?: { message?: string } };
      toast.error(err?.data?.message || "Failed to delete sale");
    }
  };

  const columns: ColumnDef<Sale>[] = [
    {
      accessorKey: "invoiceNumber",
      header: "Invoice #",
      cell: ({ row }) => (
        <span className="font-mono text-sm">{row.original.invoiceNumber}</span>
      ),
    },
    {
      accessorKey: "customerId",
      header: "Customer",
      cell: ({ row }) =>
        typeof row.original.customerId === "object"
          ? row.original.customerId.name
          : row.original.customerId,
    },
    {
      accessorKey: "saleDate",
      header: "Date",
      cell: ({ row }) =>
        format(new Date(row.original.saleDate), "dd MMM yyyy"),
    },
    {
      accessorKey: "totalAmount",
      header: "Total",
      cell: ({ row }) => `$${row.original.totalAmount.toFixed(2)}`,
    },
    {
      accessorKey: "paidAmount",
      header: "Paid",
      cell: ({ row }) => (
        <span className="text-green-600">
          ${row.original.paidAmount.toFixed(2)}
        </span>
      ),
    },
    {
      accessorKey: "dueAmount",
      header: "Due",
      cell: ({ row }) => (
        <Badge
          variant={row.original.dueAmount > 0 ? "destructive" : "default"}
        >
          ${row.original.dueAmount.toFixed(2)}
        </Badge>
      ),
    },
    {
      accessorKey: "paymentStatus",
      header: "Status",
      cell: ({ row }) => (
        <Badge variant={statusVariant(row.original.paymentStatus)}>
          {row.original.paymentStatus}
        </Badge>
      ),
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => (
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setDetailSale(row.original)}
            title="View details"
          >
            <Eye className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              setSaleToDelete(row.original.id);
              setDeleteConfirmOpen(true);
            }}
            title="Delete sale"
          >
            <Trash2 className="h-4 w-4 text-destructive" />
          </Button>
        </div>
      ),
    },
  ];

  if (isLoading) {
    return <TableSkeleton />;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Sales</h1>
          <p className="text-muted-foreground">Manage your sales</p>
        </div>
        <Button onClick={() => setIsCreateModalOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          New Sale
        </Button>
      </div>

      <DataTable
        columns={columns}
        data={data?.data || []}
        searchKey="invoiceNumber"
        searchPlaceholder="Search by invoice..."
      />

      <FormModal
        open={isCreateModalOpen}
        onOpenChange={setIsCreateModalOpen}
        title="Create Sale"
        description="Create a new sale"
        className="sm:max-w-[800px]"
      >
        <SaleForm onSubmit={handleCreate} isLoading={isCreating} />
      </FormModal>

      <SaleDetailDialog
        sale={detailSale}
        open={!!detailSale}
        onOpenChange={(open) => !open && setDetailSale(null)}
      />

      <ConfirmDialog
        open={deleteConfirmOpen}
        onOpenChange={setDeleteConfirmOpen}
        title="Delete Sale"
        description="Are you sure you want to delete this sale? This action cannot be undone."
        onConfirm={handleDelete}
        variant="destructive"
        isLoading={isDeleting}
      />
    </div>
  );
};
