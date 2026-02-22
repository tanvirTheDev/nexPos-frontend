import { useState } from "react";
import { Plus, Pencil, Trash2, Shield } from "lucide-react";
import { ColumnDef } from "@tanstack/react-table";
import { toast } from "sonner";
import { format } from "date-fns";
import { DataTable } from "@common/components/tables/DataTable";
import { FormModal } from "@common/components/forms/FormModal";
import { ConfirmDialog } from "@common/components/forms/ConfirmDialog";
import { Button } from "@common/components/ui/button";
import { Badge } from "@common/components/ui/badge";
import { TableSkeleton } from "@common/components/common/LoadingState";
import { useAuth } from "@common/hooks/useAuth";
import {
  useGetUsersQuery,
  useCreateOrgAdminMutation,
  useCreateAdminMutation,
  useUpdateUserMutation,
  useDeleteUserMutation,
} from "../services/userApi";
import { UserForm } from "../components/UserForm";
import type { UserRecord } from "../types";
import { PermissionDialog } from "../components/PermissionDialog";

const roleBadgeVariant = (role: string) => {
  switch (role) {
    case "SuperAdmin":
      return "default" as const;
    case "OrgAdmin":
      return "secondary" as const;
    default:
      return "outline" as const;
  }
};

export const UserPage = () => {
  const { isSuperAdmin, isOrgAdmin } = useAuth();
  const { data, isLoading } = useGetUsersQuery();
  const [createOrgAdmin, { isLoading: isCreatingOrgAdmin }] =
    useCreateOrgAdminMutation();
  const [createAdmin, { isLoading: isCreatingAdmin }] =
    useCreateAdminMutation();
  const [updateUser, { isLoading: isUpdating }] = useUpdateUserMutation();
  const [deleteUser, { isLoading: isDeleting }] = useDeleteUserMutation();

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<UserRecord | null>(null);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<string | null>(null);
  const [permissionUser, setPermissionUser] = useState<UserRecord | null>(null);

  const createMode: "org-admin" | "admin" = isSuperAdmin
    ? "org-admin"
    : "admin";

  const handleCreate = async (formData: Record<string, unknown>) => {
    try {
      if (isSuperAdmin) {
        await createOrgAdmin({
          name: formData.name as string,
          email: formData.email as string,
          password: formData.password as string,
          organizationId: formData.organizationId as string,
        }).unwrap();
        toast.success("Org Admin created successfully");
      } else {
        await createAdmin({
          name: formData.name as string,
          email: formData.email as string,
          password: formData.password as string,
          permissions: [],
        }).unwrap();
        toast.success("Admin created successfully");
      }
      setIsCreateModalOpen(false);
    } catch (error: unknown) {
      const err = error as { data?: { message?: string } };
      toast.error(err?.data?.message || "Failed to create user");
    }
  };

  const handleUpdate = async (formData: Record<string, unknown>) => {
    if (!selectedUser) return;
    try {
      const updateData: Record<string, unknown> = {
        name: formData.name,
        email: formData.email,
      };
      if (formData.password) {
        updateData.password = formData.password;
      }
      await updateUser({
        id: selectedUser.id,
        data: updateData,
      }).unwrap();
      toast.success("User updated successfully");
      setSelectedUser(null);
    } catch (error: unknown) {
      const err = error as { data?: { message?: string } };
      toast.error(err?.data?.message || "Failed to update user");
    }
  };

  const handleDelete = async () => {
    if (!userToDelete) return;
    try {
      await deleteUser(userToDelete).unwrap();
      toast.success("User deactivated successfully");
      setDeleteConfirmOpen(false);
      setUserToDelete(null);
    } catch (error: unknown) {
      const err = error as { data?: { message?: string } };
      toast.error(err?.data?.message || "Failed to delete user");
    }
  };

  const columns: ColumnDef<UserRecord>[] = [
    {
      accessorKey: "name",
      header: "Name",
    },
    {
      accessorKey: "email",
      header: "Email",
    },
    {
      accessorKey: "role",
      header: "Role",
      cell: ({ row }) => (
        <Badge variant={roleBadgeVariant(row.original.role)}>
          {row.original.role}
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
      accessorKey: "lastLogin",
      header: "Last Login",
      cell: ({ row }) =>
        row.original.lastLogin
          ? format(new Date(row.original.lastLogin), "MMM dd, yyyy HH:mm")
          : "Never",
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => {
        if (row.original.role === "SuperAdmin") return null;

        return (
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSelectedUser(row.original)}
              title="Edit user"
            >
              <Pencil className="h-4 w-4" />
            </Button>
            {(isSuperAdmin || isOrgAdmin) &&
              row.original.role === "Admin" && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setPermissionUser(row.original)}
                  title="Manage permissions"
                >
                  <Shield className="h-4 w-4" />
                </Button>
              )}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setUserToDelete(row.original.id);
                setDeleteConfirmOpen(true);
              }}
              title="Delete user"
            >
              <Trash2 className="h-4 w-4 text-destructive" />
            </Button>
          </div>
        );
      },
    },
  ];

  if (isLoading) {
    return <TableSkeleton />;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Users</h1>
          <p className="text-muted-foreground">Manage user accounts</p>
        </div>
        <Button onClick={() => setIsCreateModalOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          {isSuperAdmin ? "Add Org Admin" : "Add Admin"}
        </Button>
      </div>

      <DataTable
        columns={columns}
        data={data?.data || []}
        searchKey="name"
        searchPlaceholder="Search users..."
      />

      <FormModal
        open={isCreateModalOpen}
        onOpenChange={setIsCreateModalOpen}
        title={isSuperAdmin ? "Create Org Admin" : "Create Admin"}
        description={
          isSuperAdmin
            ? "Create a new organization administrator"
            : "Create a new admin user"
        }
      >
        <UserForm
          onSubmit={handleCreate}
          isLoading={isCreatingOrgAdmin || isCreatingAdmin}
          mode={createMode}
        />
      </FormModal>

      <FormModal
        open={!!selectedUser}
        onOpenChange={(open) => !open && setSelectedUser(null)}
        title="Edit User"
        description="Update user details"
      >
        {selectedUser && (
          <UserForm
            user={selectedUser}
            onSubmit={handleUpdate}
            isLoading={isUpdating}
            mode={
              selectedUser.role === "OrgAdmin" ? "org-admin" : "admin"
            }
          />
        )}
      </FormModal>

      <ConfirmDialog
        open={deleteConfirmOpen}
        onOpenChange={setDeleteConfirmOpen}
        title="Delete User"
        description="Are you sure you want to deactivate this user? They will no longer be able to access the system."
        onConfirm={handleDelete}
        variant="destructive"
        isLoading={isDeleting}
      />

      {permissionUser && (
        <PermissionDialog
          user={permissionUser}
          open={!!permissionUser}
          onOpenChange={(open) => !open && setPermissionUser(null)}
        />
      )}
    </div>
  );
};
