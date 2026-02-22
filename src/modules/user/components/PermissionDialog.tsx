import { useState, useEffect } from "react";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@common/components/ui/dialog";
import { Button } from "@common/components/ui/button";
import { Label } from "@common/components/ui/label";
import {
  useAssignPermissionsMutation,
  useGetUserPermissionsQuery,
} from "../services/userApi";
import type { UserRecord } from "../types";

const AVAILABLE_PERMISSIONS = [
  { group: "Dashboard", permissions: ["dashboard:view"] },
  {
    group: "Products",
    permissions: [
      "product:view",
      "product:create",
      "product:update",
      "product:delete",
    ],
  },
  {
    group: "Customers",
    permissions: [
      "customer:view",
      "customer:create",
      "customer:update",
      "customer:delete",
    ],
  },
  {
    group: "Suppliers",
    permissions: [
      "supplier:view",
      "supplier:create",
      "supplier:update",
      "supplier:delete",
    ],
  },
  {
    group: "Purchases",
    permissions: [
      "purchase:view",
      "purchase:create",
      "purchase:update",
      "purchase:delete",
    ],
  },
  {
    group: "Sales",
    permissions: [
      "sales:view",
      "sales:create",
      "sales:update",
      "sales:delete",
    ],
  },
  {
    group: "Returns",
    permissions: [
      "purchase_return:view",
      "purchase_return:create",
      "sales_return:view",
      "sales_return:create",
    ],
  },
  {
    group: "Payments",
    permissions: [
      "due_collection:view",
      "due_collection:create",
      "supplier_payment:view",
      "supplier_payment:create",
    ],
  },
  {
    group: "Reports",
    permissions: ["reports:view"],
  },
  {
    group: "Users",
    permissions: ["user:view", "user:create", "user:update", "user:delete"],
  },
];

interface PermissionDialogProps {
  user: UserRecord;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const PermissionDialog = ({
  user,
  open,
  onOpenChange,
}: PermissionDialogProps) => {
  const { data: permData } = useGetUserPermissionsQuery(user.id, {
    skip: !open,
  });
  const [assignPermissions, { isLoading }] = useAssignPermissionsMutation();
  const [selected, setSelected] = useState<string[]>([]);

  useEffect(() => {
    if (permData?.data?.permissions) {
      setSelected(permData.data.permissions);
    } else {
      setSelected(user.permissions || []);
    }
  }, [permData, user.permissions]);

  const togglePermission = (perm: string) => {
    setSelected((prev) =>
      prev.includes(perm) ? prev.filter((p) => p !== perm) : [...prev, perm]
    );
  };

  const toggleGroup = (perms: string[]) => {
    const allSelected = perms.every((p) => selected.includes(p));
    if (allSelected) {
      setSelected((prev) => prev.filter((p) => !perms.includes(p)));
    } else {
      setSelected((prev) => [...new Set([...prev, ...perms])]);
    }
  };

  const handleSave = async () => {
    try {
      await assignPermissions({
        id: user.id,
        data: { permissions: selected },
      }).unwrap();
      toast.success("Permissions updated successfully");
      onOpenChange(false);
    } catch (error: unknown) {
      const err = error as { data?: { message?: string } };
      toast.error(err?.data?.message || "Failed to update permissions");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Manage Permissions</DialogTitle>
          <DialogDescription>
            Assign permissions for {user.name}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 mt-4">
          {AVAILABLE_PERMISSIONS.map((group) => (
            <div key={group.group} className="space-y-2">
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id={`group-${group.group}`}
                  checked={group.permissions.every((p) =>
                    selected.includes(p)
                  )}
                  onChange={() => toggleGroup(group.permissions)}
                  className="h-4 w-4 rounded border-gray-300"
                />
                <Label
                  htmlFor={`group-${group.group}`}
                  className="font-semibold text-sm"
                >
                  {group.group}
                </Label>
              </div>
              <div className="ml-6 grid grid-cols-2 gap-2">
                {group.permissions.map((perm) => (
                  <div key={perm} className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id={perm}
                      checked={selected.includes(perm)}
                      onChange={() => togglePermission(perm)}
                      className="h-3.5 w-3.5 rounded border-gray-300"
                    />
                    <Label htmlFor={perm} className="text-xs text-muted-foreground">
                      {perm}
                    </Label>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="flex justify-end gap-3 mt-6">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              "Save Permissions"
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
