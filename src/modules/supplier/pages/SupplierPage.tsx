import { useState } from "react";
import { Plus, Pencil, Trash2, Wallet } from "lucide-react";
import { ColumnDef } from "@tanstack/react-table";
import { toast } from "sonner";
import { DataTable } from "@common/components/tables/DataTable";
import { FormModal } from "@common/components/forms/FormModal";
import { ConfirmDialog } from "@common/components/forms/ConfirmDialog";
import { Button } from "@common/components/ui/button";
import { Badge } from "@common/components/ui/badge";
import { TableSkeleton } from "@common/components/common/LoadingState";
import {
  useGetSuppliersQuery,
  useCreateSupplierMutation,
  useUpdateSupplierMutation,
  useDeleteSupplierMutation,
} from "../services/supplierApi";
import { SupplierForm } from "../components/SupplierForm";
import { SupplierBalanceDialog } from "../components/SupplierBalanceDialog";
import type { Supplier, CreateSupplierInput } from "../types";

export const SupplierPage = () => {
  const { data, isLoading } = useGetSuppliersQuery();
  const [createSupplier, { isLoading: isCreating }] = useCreateSupplierMutation();
  const [updateSupplier, { isLoading: isUpdating }] = useUpdateSupplierMutation();
  const [deleteSupplier, { isLoading: isDeleting }] = useDeleteSupplierMutation();

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedSupplier, setSelectedSupplier] = useState<Supplier | null>(null);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [supplierToDelete, setSupplierToDelete] = useState<string | null>(null);
  const [balanceSupplier, setBalanceSupplier] = useState<Supplier | null>(null);

  const handleCreate = async (formData: CreateSupplierInput) => {
    try {
      await createSupplier(formData).unwrap();
      toast.success("Supplier created successfully");
      setIsCreateModalOpen(false);
    } catch (error: unknown) {
      const err = error as { data?: { message?: string } };
      toast.error(err?.data?.message || "Failed to create supplier");
    }
  };

  const handleUpdate = async (formData: CreateSupplierInput) => {
    if (!selectedSupplier) return;
    try {
      await updateSupplier({ id: selectedSupplier.id, data: formData }).unwrap();
      toast.success("Supplier updated successfully");
      setSelectedSupplier(null);
    } catch (error: unknown) {
      const err = error as { data?: { message?: string } };
      toast.error(err?.data?.message || "Failed to update supplier");
    }
  };

  const handleDelete = async () => {
    if (!supplierToDelete) return;
    try {
      await deleteSupplier(supplierToDelete).unwrap();
      toast.success("Supplier deleted successfully");
      setDeleteConfirmOpen(false);
      setSupplierToDelete(null);
    } catch (error: unknown) {
      const err = error as { data?: { message?: string } };
      toast.error(err?.data?.message || "Failed to delete supplier");
    }
  };

  const columns: ColumnDef<Supplier>[] = [
    {
      accessorKey: "name",
      header: "Name",
    },
    {
      accessorKey: "email",
      header: "Email",
      cell: ({ row }) => row.original.email || "—",
    },
    {
      accessorKey: "phone",
      header: "Phone",
      cell: ({ row }) => row.original.phone || "—",
    },
    {
      accessorKey: "balance",
      header: "Due Balance",
      cell: ({ row }) => (
        <Badge variant={row.original.balance > 0 ? "destructive" : "default"}>
          ${row.original.balance.toFixed(2)}
        </Badge>
      ),
    },
    {
      accessorKey: "isActive",
      header: "Status",
      cell: ({ row }) => (
        <Badge variant={row.original.isActive ? "default" : "secondary"}>
          {row.original.isActive ? "Active" : "Inactive"}
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
            onClick={() => setBalanceSupplier(row.original)}
            title="Update balance"
          >
            <Wallet className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setSelectedSupplier(row.original)}
            title="Edit supplier"
          >
            <Pencil className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              setSupplierToDelete(row.original.id);
              setDeleteConfirmOpen(true);
            }}
            title="Delete supplier"
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
          <h1 className="text-3xl font-bold">Suppliers</h1>
          <p className="text-muted-foreground">Manage your suppliers</p>
        </div>
        <Button onClick={() => setIsCreateModalOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Add Supplier
        </Button>
      </div>

      <DataTable
        columns={columns}
        data={data?.data || []}
        searchKey="name"
        searchPlaceholder="Search suppliers..."
      />

      <FormModal
        open={isCreateModalOpen}
        onOpenChange={setIsCreateModalOpen}
        title="Create Supplier"
        description="Add a new supplier"
      >
        <SupplierForm onSubmit={handleCreate} isLoading={isCreating} />
      </FormModal>

      <FormModal
        open={!!selectedSupplier}
        onOpenChange={(open) => !open && setSelectedSupplier(null)}
        title="Edit Supplier"
        description="Update supplier details"
      >
        {selectedSupplier && (
          <SupplierForm
            supplier={selectedSupplier}
            onSubmit={handleUpdate}
            isLoading={isUpdating}
          />
        )}
      </FormModal>

      <ConfirmDialog
        open={deleteConfirmOpen}
        onOpenChange={setDeleteConfirmOpen}
        title="Delete Supplier"
        description="Are you sure you want to delete this supplier? This action cannot be undone."
        onConfirm={handleDelete}
        variant="destructive"
        isLoading={isDeleting}
      />

      {balanceSupplier && (
        <SupplierBalanceDialog
          supplier={balanceSupplier}
          open={!!balanceSupplier}
          onOpenChange={(open) => !open && setBalanceSupplier(null)}
        />
      )}
    </div>
  );
};
