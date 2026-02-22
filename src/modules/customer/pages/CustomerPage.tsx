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
  useGetCustomersQuery,
  useCreateCustomerMutation,
  useUpdateCustomerMutation,
  useDeleteCustomerMutation,
} from "../services/customerApi";
import { CustomerForm } from "../components/CustomerForm";
import { BalanceUpdateDialog } from "../components/BalanceUpdateDialog";
import type { Customer, CreateCustomerInput } from "../types";

export const CustomerPage = () => {
  const { data, isLoading } = useGetCustomersQuery();
  const [createCustomer, { isLoading: isCreating }] = useCreateCustomerMutation();
  const [updateCustomer, { isLoading: isUpdating }] = useUpdateCustomerMutation();
  const [deleteCustomer, { isLoading: isDeleting }] = useDeleteCustomerMutation();

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [customerToDelete, setCustomerToDelete] = useState<string | null>(null);
  const [balanceCustomer, setBalanceCustomer] = useState<Customer | null>(null);

  const handleCreate = async (formData: CreateCustomerInput) => {
    try {
      await createCustomer(formData).unwrap();
      toast.success("Customer created successfully");
      setIsCreateModalOpen(false);
    } catch (error: unknown) {
      const err = error as { data?: { message?: string } };
      toast.error(err?.data?.message || "Failed to create customer");
    }
  };

  const handleUpdate = async (formData: CreateCustomerInput) => {
    if (!selectedCustomer) return;
    try {
      await updateCustomer({ id: selectedCustomer.id, data: formData }).unwrap();
      toast.success("Customer updated successfully");
      setSelectedCustomer(null);
    } catch (error: unknown) {
      const err = error as { data?: { message?: string } };
      toast.error(err?.data?.message || "Failed to update customer");
    }
  };

  const handleDelete = async () => {
    if (!customerToDelete) return;
    try {
      await deleteCustomer(customerToDelete).unwrap();
      toast.success("Customer deleted successfully");
      setDeleteConfirmOpen(false);
      setCustomerToDelete(null);
    } catch (error: unknown) {
      const err = error as { data?: { message?: string } };
      toast.error(err?.data?.message || "Failed to delete customer");
    }
  };

  const columns: ColumnDef<Customer>[] = [
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
            onClick={() => setBalanceCustomer(row.original)}
            title="Update balance"
          >
            <Wallet className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setSelectedCustomer(row.original)}
            title="Edit customer"
          >
            <Pencil className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              setCustomerToDelete(row.original.id);
              setDeleteConfirmOpen(true);
            }}
            title="Delete customer"
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
          <h1 className="text-3xl font-bold">Customers</h1>
          <p className="text-muted-foreground">Manage your customers</p>
        </div>
        <Button onClick={() => setIsCreateModalOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Add Customer
        </Button>
      </div>

      <DataTable
        columns={columns}
        data={data?.data || []}
        searchKey="name"
        searchPlaceholder="Search customers..."
      />

      <FormModal
        open={isCreateModalOpen}
        onOpenChange={setIsCreateModalOpen}
        title="Create Customer"
        description="Add a new customer"
      >
        <CustomerForm onSubmit={handleCreate} isLoading={isCreating} />
      </FormModal>

      <FormModal
        open={!!selectedCustomer}
        onOpenChange={(open) => !open && setSelectedCustomer(null)}
        title="Edit Customer"
        description="Update customer details"
      >
        {selectedCustomer && (
          <CustomerForm
            customer={selectedCustomer}
            onSubmit={handleUpdate}
            isLoading={isUpdating}
          />
        )}
      </FormModal>

      <ConfirmDialog
        open={deleteConfirmOpen}
        onOpenChange={setDeleteConfirmOpen}
        title="Delete Customer"
        description="Are you sure you want to delete this customer? This action cannot be undone."
        onConfirm={handleDelete}
        variant="destructive"
        isLoading={isDeleting}
      />

      {balanceCustomer && (
        <BalanceUpdateDialog
          customer={balanceCustomer}
          open={!!balanceCustomer}
          onOpenChange={(open) => !open && setBalanceCustomer(null)}
        />
      )}
    </div>
  );
};
