import { useState } from "react";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { ColumnDef } from "@tanstack/react-table";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { DataTable } from "@common/components/tables/DataTable";
import { FormModal } from "@common/components/forms/FormModal";
import { ConfirmDialog } from "@common/components/forms/ConfirmDialog";
import { Button } from "@common/components/ui/button";
import { Badge } from "@common/components/ui/badge";
import { Input } from "@common/components/ui/input";
import { Label } from "@common/components/ui/label";
import { TableSkeleton } from "@common/components/common/LoadingState";
import { Loader2 } from "lucide-react";
import {
  useGetVATsQuery,
  useCreateVATMutation,
  useUpdateVATMutation,
  useDeleteVATMutation,
} from "../services/vatApi";
import type { VAT, CreateVATInput } from "../types";

const vatSchema = z.object({
  name: z.string().min(1, "VAT name is required"),
  percentage: z.number().min(0, "Must be 0 or more").max(100, "Max is 100%"),
});

type VATFormData = z.infer<typeof vatSchema>;

const VATForm = ({
  vat,
  onSubmit,
  isLoading,
}: {
  vat?: VAT;
  onSubmit: (data: VATFormData) => void;
  isLoading?: boolean;
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<VATFormData>({
    resolver: zodResolver(vatSchema),
    defaultValues: vat
      ? { name: vat.name, percentage: vat.percentage }
      : { percentage: 0 },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">VAT Name</Label>
        <Input
          id="name"
          {...register("name")}
          placeholder="e.g. Standard VAT"
        />
        {errors.name && (
          <p className="text-sm text-destructive">{errors.name.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="percentage">Percentage (%)</Label>
        <Input
          id="percentage"
          type="number"
          step="0.01"
          min="0"
          max="100"
          {...register("percentage", { valueAsNumber: true })}
          placeholder="15"
        />
        {errors.percentage && (
          <p className="text-sm text-destructive">
            {errors.percentage.message}
          </p>
        )}
      </div>

      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Saving...
          </>
        ) : vat ? (
          "Update VAT"
        ) : (
          "Create VAT"
        )}
      </Button>
    </form>
  );
};

export const VATPage = () => {
  const { data, isLoading } = useGetVATsQuery();
  const [createVAT, { isLoading: isCreating }] = useCreateVATMutation();
  const [updateVAT, { isLoading: isUpdating }] = useUpdateVATMutation();
  const [deleteVAT, { isLoading: isDeleting }] = useDeleteVATMutation();

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedVAT, setSelectedVAT] = useState<VAT | null>(null);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [vatToDelete, setVatToDelete] = useState<string | null>(null);

  const handleCreate = async (formData: CreateVATInput) => {
    try {
      await createVAT(formData).unwrap();
      toast.success("VAT created successfully");
      setIsCreateModalOpen(false);
    } catch (error: unknown) {
      const err = error as { data?: { message?: string } };
      toast.error(err?.data?.message || "Failed to create VAT");
    }
  };

  const handleUpdate = async (formData: CreateVATInput) => {
    if (!selectedVAT) return;
    try {
      await updateVAT({ id: selectedVAT.id, data: formData }).unwrap();
      toast.success("VAT updated successfully");
      setSelectedVAT(null);
    } catch (error: unknown) {
      const err = error as { data?: { message?: string } };
      toast.error(err?.data?.message || "Failed to update VAT");
    }
  };

  const handleDelete = async () => {
    if (!vatToDelete) return;
    try {
      await deleteVAT(vatToDelete).unwrap();
      toast.success("VAT deleted successfully");
      setDeleteConfirmOpen(false);
      setVatToDelete(null);
    } catch (error: unknown) {
      const err = error as { data?: { message?: string } };
      toast.error(err?.data?.message || "Failed to delete VAT");
    }
  };

  const columns: ColumnDef<VAT>[] = [
    {
      accessorKey: "name",
      header: "Name",
    },
    {
      accessorKey: "percentage",
      header: "Rate",
      cell: ({ row }) => (
        <Badge variant="outline">{row.original.percentage}%</Badge>
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
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setSelectedVAT(row.original)}
          >
            <Pencil className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              setVatToDelete(row.original.id);
              setDeleteConfirmOpen(true);
            }}
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
          <h1 className="text-3xl font-bold">VAT</h1>
          <p className="text-muted-foreground">Manage tax rates</p>
        </div>
        <Button onClick={() => setIsCreateModalOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Add VAT
        </Button>
      </div>

      <DataTable
        columns={columns}
        data={data?.data || []}
        searchKey="name"
        searchPlaceholder="Search VAT..."
      />

      <FormModal
        open={isCreateModalOpen}
        onOpenChange={setIsCreateModalOpen}
        title="Create VAT"
        description="Add a new tax rate"
      >
        <VATForm onSubmit={handleCreate} isLoading={isCreating} />
      </FormModal>

      <FormModal
        open={!!selectedVAT}
        onOpenChange={(open) => !open && setSelectedVAT(null)}
        title="Edit VAT"
        description="Update tax rate details"
      >
        {selectedVAT && (
          <VATForm
            vat={selectedVAT}
            onSubmit={handleUpdate}
            isLoading={isUpdating}
          />
        )}
      </FormModal>

      <ConfirmDialog
        open={deleteConfirmOpen}
        onOpenChange={setDeleteConfirmOpen}
        title="Delete VAT"
        description="Are you sure you want to delete this VAT rate? Products using this rate may be affected."
        onConfirm={handleDelete}
        variant="destructive"
        isLoading={isDeleting}
      />
    </div>
  );
};
