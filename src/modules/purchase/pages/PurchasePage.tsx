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
  useGetPurchasesQuery,
  useCreatePurchaseMutation,
  useDeletePurchaseMutation,
} from "../services/purchaseApi";
import { PurchaseForm } from "../components/PurchaseForm";
import { PurchaseDetailDialog } from "../components/PurchaseDetailDialog";
import type { Purchase, CreatePurchaseInput } from "../types";

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

export const PurchasePage = () => {
  const { data, isLoading } = useGetPurchasesQuery();
  const [createPurchase, { isLoading: isCreating }] =
    useCreatePurchaseMutation();
  const [deletePurchase, { isLoading: isDeleting }] =
    useDeletePurchaseMutation();

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [detailPurchase, setDetailPurchase] = useState<Purchase | null>(null);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [purchaseToDelete, setPurchaseToDelete] = useState<string | null>(null);

  const handleCreate = async (formData: CreatePurchaseInput) => {
    try {
      await createPurchase(formData).unwrap();
      toast.success("Purchase created successfully");
      setIsCreateModalOpen(false);
    } catch (error: unknown) {
      const err = error as { data?: { message?: string } };
      toast.error(err?.data?.message || "Failed to create purchase");
    }
  };

  const handleDelete = async () => {
    if (!purchaseToDelete) return;
    try {
      await deletePurchase(purchaseToDelete).unwrap();
      toast.success("Purchase deleted successfully");
      setDeleteConfirmOpen(false);
      setPurchaseToDelete(null);
    } catch (error: unknown) {
      const err = error as { data?: { message?: string } };
      toast.error(err?.data?.message || "Failed to delete purchase");
    }
  };

  const columns: ColumnDef<Purchase>[] = [
    {
      accessorKey: "invoiceNumber",
      header: "Invoice #",
      cell: ({ row }) => (
        <span className="font-mono text-sm">{row.original.invoiceNumber}</span>
      ),
    },
    {
      accessorKey: "supplierId",
      header: "Supplier",
      cell: ({ row }) =>
        typeof row.original.supplierId === "object"
          ? row.original.supplierId.name
          : row.original.supplierId,
    },
    {
      accessorKey: "purchaseDate",
      header: "Date",
      cell: ({ row }) =>
        format(new Date(row.original.purchaseDate), "dd MMM yyyy"),
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
            onClick={() => setDetailPurchase(row.original)}
            title="View details"
          >
            <Eye className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              setPurchaseToDelete(row.original.id);
              setDeleteConfirmOpen(true);
            }}
            title="Delete purchase"
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
          <h1 className="text-3xl font-bold">Purchases</h1>
          <p className="text-muted-foreground">
            Manage your purchase orders
          </p>
        </div>
        <Button onClick={() => setIsCreateModalOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          New Purchase
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
        title="Create Purchase"
        description="Add a new purchase order"
        className="sm:max-w-[800px]"
      >
        <PurchaseForm onSubmit={handleCreate} isLoading={isCreating} />
      </FormModal>

      <PurchaseDetailDialog
        purchase={detailPurchase}
        open={!!detailPurchase}
        onOpenChange={(open) => !open && setDetailPurchase(null)}
      />

      <ConfirmDialog
        open={deleteConfirmOpen}
        onOpenChange={setDeleteConfirmOpen}
        title="Delete Purchase"
        description="Are you sure you want to delete this purchase? This action cannot be undone."
        onConfirm={handleDelete}
        variant="destructive"
        isLoading={isDeleting}
      />
    </div>
  );
};
