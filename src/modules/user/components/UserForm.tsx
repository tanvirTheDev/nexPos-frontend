import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@common/components/ui/button";
import { Input } from "@common/components/ui/input";
import { Label } from "@common/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@common/components/ui/select";
import { Loader2 } from "lucide-react";
import { useAuth } from "@common/hooks/useAuth";
import { useGetOrganizationsQuery } from "@modules/organization/services/organizationApi";
import type { UserRecord } from "../types";

const createUserSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  organizationId: z.string().optional(),
});

const updateUserSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().optional(),
  organizationId: z.string().optional(),
});

type CreateUserFormData = z.infer<typeof createUserSchema>;
type UpdateUserFormData = z.infer<typeof updateUserSchema>;

interface UserFormProps {
  user?: UserRecord;
  onSubmit: (data: CreateUserFormData | UpdateUserFormData) => void;
  isLoading?: boolean;
  mode: "org-admin" | "admin";
}

export const UserForm = ({
  user,
  onSubmit,
  isLoading,
  mode,
}: UserFormProps) => {
  const { isSuperAdmin } = useAuth();
  const { data: organizations } = useGetOrganizationsQuery(undefined, {
    skip: !isSuperAdmin || mode !== "org-admin",
  });

  const schema = user ? updateUserSchema : createUserSchema;

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<CreateUserFormData>({
    resolver: zodResolver(schema),
    defaultValues: user
      ? {
          name: user.name,
          email: user.email,
          password: "",
          organizationId: user.organizationId || "",
        }
      : {},
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">Full Name</Label>
        <Input
          id="name"
          {...register("name")}
          placeholder="Enter full name"
        />
        {errors.name && (
          <p className="text-sm text-destructive">{errors.name.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          {...register("email")}
          placeholder="user@example.com"
        />
        {errors.email && (
          <p className="text-sm text-destructive">{errors.email.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="password">
          {user ? "Password (leave blank to keep current)" : "Password"}
        </Label>
        <Input
          id="password"
          type="password"
          {...register("password")}
          placeholder={user ? "••••••••" : "Min. 6 characters"}
        />
        {errors.password && (
          <p className="text-sm text-destructive">{errors.password.message}</p>
        )}
      </div>

      {isSuperAdmin && mode === "org-admin" && (
        <div className="space-y-2">
          <Label>Organization</Label>
          <Controller
            name="organizationId"
            control={control}
            render={({ field }) => (
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Select organization" />
                </SelectTrigger>
                <SelectContent>
                  {organizations?.data?.map((org) => (
                    <SelectItem key={org.id} value={org.id}>
                      {org.companyName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
        </div>
      )}

      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Saving...
          </>
        ) : user ? (
          "Update User"
        ) : mode === "org-admin" ? (
          "Create Org Admin"
        ) : (
          "Create Admin"
        )}
      </Button>
    </form>
  );
};
