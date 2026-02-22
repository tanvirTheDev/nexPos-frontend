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
  useGetUnitsQuery,
  useCreateUnitMutation,
  useUpdateUnitMutation,
  useDeleteUnitMutation,
} from "../services/unitApi";
import type { Unit, CreateUnitInput } from "../types";

const unitSchema = z.object({
  name: z.string().min(1, "Unit name is required"),
  symbol: z.string().min(1, "Symbol is required"),
});

type UnitFormData = z.infer<typeof unitSchema>;

const UnitForm = ({
  unit,
  onSubmit,
  isLoading,
}: {
  unit?: Unit;
  onSubmit: (data: UnitFormData) => void;
  isLoading?: boolean;
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<UnitFormData>({
    resolver: zodResolver(unitSchema),
    defaultValues: unit
      ? { name: unit.name, symbol: unit.symbol }
      : {},
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">Unit Name</Label>
        <Input id="name" {...register("name")} placeholder="e.g. Kilogram" />
        {errors.name && (
          <p className="text-sm text-destructive">{errors.name.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="symbol">Symbol</Label>
        <Input id="symbol" {...register("symbol")} placeholder="e.g. kg" />
        {errors.symbol && (
          <p className="text-sm text-destructive">{errors.symbol.message}</p>
        )}
      </div>

      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Saving...
          </>
        ) : unit ? (
          "Update Unit"
        ) : (
          "Create Unit"
        )}
      </Button>
    </form>
  );
};

export const UnitPage = () => {
  const { data, isLoading } = useGetUnitsQuery();
  const [createUnit, { isLoading: isCreating }] = useCreateUnitMutation();
  const [updateUnit, { isLoading: isUpdating }] = useUpdateUnitMutation();
  const [deleteUnit, { isLoading: isDeleting }] = useDeleteUnitMutation();

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedUnit, setSelectedUnit] = useState<Unit | null>(null);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [unitToDelete, setUnitToDelete] = useState<string | null>(null);

  const handleCreate = async (formData: CreateUnitInput) => {
    try {
      await createUnit(formData).unwrap();
      toast.success("Unit created successfully");
      setIsCreateModalOpen(false);
    } catch (error: unknown) {
      const err = error as { data?: { message?: string } };
      toast.error(err?.data?.message || "Failed to create unit");
    }
  };

  const handleUpdate = async (formData: CreateUnitInput) => {
    if (!selectedUnit) return;
    try {
      await updateUnit({ id: selectedUnit.id, data: formData }).unwrap();
      toast.success("Unit updated successfully");
      setSelectedUnit(null);
    } catch (error: unknown) {
      const err = error as { data?: { message?: string } };
      toast.error(err?.data?.message || "Failed to update unit");
    }
  };

  const handleDelete = async () => {
    if (!unitToDelete) return;
    try {
      await deleteUnit(unitToDelete).unwrap();
      toast.success("Unit deleted successfully");
      setDeleteConfirmOpen(false);
      setUnitToDelete(null);
    } catch (error: unknown) {
      const err = error as { data?: { message?: string } };
      toast.error(err?.data?.message || "Failed to delete unit");
    }
  };

  const columns: ColumnDef<Unit>[] = [
    {
      accessorKey: "name",
      header: "Name",
    },
    {
      accessorKey: "symbol",
      header: "Symbol",
      cell: ({ row }) => (
        <Badge variant="outline">{row.original.symbol}</Badge>
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
            onClick={() => setSelectedUnit(row.original)}
          >
            <Pencil className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              setUnitToDelete(row.original.id);
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
          <h1 className="text-3xl font-bold">Units</h1>
          <p className="text-muted-foreground">
            Manage measurement units for products
          </p>
        </div>
        <Button onClick={() => setIsCreateModalOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Add Unit
        </Button>
      </div>

      <DataTable
        columns={columns}
        data={data?.data || []}
        searchKey="name"
        searchPlaceholder="Search units..."
      />

      <FormModal
        open={isCreateModalOpen}
        onOpenChange={setIsCreateModalOpen}
        title="Create Unit"
        description="Add a new measurement unit"
      >
        <UnitForm onSubmit={handleCreate} isLoading={isCreating} />
      </FormModal>

      <FormModal
        open={!!selectedUnit}
        onOpenChange={(open) => !open && setSelectedUnit(null)}
        title="Edit Unit"
        description="Update unit details"
      >
        {selectedUnit && (
          <UnitForm
            unit={selectedUnit}
            onSubmit={handleUpdate}
            isLoading={isUpdating}
          />
        )}
      </FormModal>

      <ConfirmDialog
        open={deleteConfirmOpen}
        onOpenChange={setDeleteConfirmOpen}
        title="Delete Unit"
        description="Are you sure you want to delete this unit? Products using this unit may be affected."
        onConfirm={handleDelete}
        variant="destructive"
        isLoading={isDeleting}
      />
    </div>
  );
};
