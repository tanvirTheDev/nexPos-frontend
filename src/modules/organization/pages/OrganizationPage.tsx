import { useState } from "react";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { ColumnDef } from "@tanstack/react-table";
import { toast } from "sonner";
import { DataTable } from "@common/components/tables/DataTable";
import { FormModal } from "@common/components/forms/FormModal";
import { ConfirmDialog } from "@common/components/forms/ConfirmDialog";
import { Button } from "@common/components/ui/button";
import { Badge } from "@common/components/ui/badge";
import { TableSkeleton } from "@common/components/common/LoadingState";
import {
  useGetOrganizationsQuery,
  useCreateOrganizationMutation,
  useUpdateOrganizationMutation,
  useDeleteOrganizationMutation,
} from "../services/organizationApi";
import { OrganizationForm } from "../components/OrganizationForm";
import type { Organization, CreateOrganizationInput } from "../types";

export const OrganizationPage = () => {
  const { data, isLoading } = useGetOrganizationsQuery();
  const [createOrganization, { isLoading: isCreating }] =
    useCreateOrganizationMutation();
  const [updateOrganization, { isLoading: isUpdating }] =
    useUpdateOrganizationMutation();
  const [deleteOrganization, { isLoading: isDeleting }] =
    useDeleteOrganizationMutation();

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedOrg, setSelectedOrg] = useState<Organization | null>(null);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [orgToDelete, setOrgToDelete] = useState<string | null>(null);

  const handleCreate = async (formData: CreateOrganizationInput) => {
    try {
      await createOrganization(formData).unwrap();
      toast.success("Organization created successfully");
      setIsCreateModalOpen(false);
    } catch (error: unknown) {
      const err = error as { data?: { message?: string } };
      toast.error(err?.data?.message || "Failed to create organization");
    }
  };

  const handleUpdate = async (formData: CreateOrganizationInput) => {
    if (!selectedOrg) return;
    try {
      await updateOrganization({
        id: selectedOrg.id,
        data: formData,
      }).unwrap();
      toast.success("Organization updated successfully");
      setSelectedOrg(null);
    } catch (error: unknown) {
      const err = error as { data?: { message?: string } };
      toast.error(err?.data?.message || "Failed to update organization");
    }
  };

  const handleDelete = async () => {
    if (!orgToDelete) return;
    try {
      await deleteOrganization(orgToDelete).unwrap();
      toast.success("Organization deleted successfully");
      setDeleteConfirmOpen(false);
      setOrgToDelete(null);
    } catch (error: unknown) {
      const err = error as { data?: { message?: string } };
      toast.error(err?.data?.message || "Failed to delete organization");
    }
  };

  const columns: ColumnDef<Organization>[] = [
    {
      accessorKey: "companyName",
      header: "Company Name",
    },
    {
      accessorKey: "contactEmail",
      header: "Email",
    },
    {
      accessorKey: "contactPhone",
      header: "Phone",
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
            onClick={() => setSelectedOrg(row.original)}
          >
            <Pencil className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              setOrgToDelete(row.original.id);
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
          <h1 className="text-3xl font-bold">Organizations</h1>
          <p className="text-muted-foreground">Manage all organizations</p>
        </div>
        <Button onClick={() => setIsCreateModalOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Add Organization
        </Button>
      </div>

      <DataTable
        columns={columns}
        data={data?.data || []}
        searchKey="companyName"
        searchPlaceholder="Search organizations..."
      />

      <FormModal
        open={isCreateModalOpen}
        onOpenChange={setIsCreateModalOpen}
        title="Create Organization"
        description="Add a new organization to the system"
      >
        <OrganizationForm onSubmit={handleCreate} isLoading={isCreating} />
      </FormModal>

      <FormModal
        open={!!selectedOrg}
        onOpenChange={(open) => !open && setSelectedOrg(null)}
        title="Edit Organization"
        description="Update organization details"
      >
        {selectedOrg && (
          <OrganizationForm
            organization={selectedOrg}
            onSubmit={handleUpdate}
            isLoading={isUpdating}
          />
        )}
      </FormModal>

      <ConfirmDialog
        open={deleteConfirmOpen}
        onOpenChange={setDeleteConfirmOpen}
        title="Delete Organization"
        description="Are you sure you want to delete this organization? This action cannot be undone."
        onConfirm={handleDelete}
        variant="destructive"
        isLoading={isDeleting}
      />
    </div>
  );
};
