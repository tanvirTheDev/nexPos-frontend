import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@common/components/ui/button";
import { Input } from "@common/components/ui/input";
import { Label } from "@common/components/ui/label";
import { Textarea } from "@common/components/ui/textarea";
import { Loader2 } from "lucide-react";
import type { Organization } from "../types";

const organizationSchema = z.object({
  companyName: z.string().min(1, "Company name is required"),
  contactEmail: z.string().email("Invalid email address"),
  contactPhone: z.string().min(1, "Phone is required"),
  address: z.string().optional(),
});

type OrganizationFormData = z.infer<typeof organizationSchema>;

interface OrganizationFormProps {
  organization?: Organization;
  onSubmit: (data: OrganizationFormData) => void;
  isLoading?: boolean;
}

export const OrganizationForm = ({
  organization,
  onSubmit,
  isLoading,
}: OrganizationFormProps) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<OrganizationFormData>({
    resolver: zodResolver(organizationSchema),
    defaultValues: organization
      ? {
          companyName: organization.companyName,
          contactEmail: organization.contactEmail,
          contactPhone: organization.contactPhone,
          address: organization.address || "",
        }
      : {},
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="companyName">Company Name</Label>
        <Input
          id="companyName"
          {...register("companyName")}
          placeholder="Enter company name"
        />
        {errors.companyName && (
          <p className="text-sm text-destructive">
            {errors.companyName.message}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="contactEmail">Contact Email</Label>
        <Input
          id="contactEmail"
          type="email"
          {...register("contactEmail")}
          placeholder="contact@example.com"
        />
        {errors.contactEmail && (
          <p className="text-sm text-destructive">
            {errors.contactEmail.message}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="contactPhone">Contact Phone</Label>
        <Input
          id="contactPhone"
          {...register("contactPhone")}
          placeholder="+1234567890"
        />
        {errors.contactPhone && (
          <p className="text-sm text-destructive">
            {errors.contactPhone.message}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="address">Address (Optional)</Label>
        <Textarea
          id="address"
          {...register("address")}
          placeholder="Enter address"
          rows={3}
        />
      </div>

      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Saving...
          </>
        ) : organization ? (
          "Update Organization"
        ) : (
          "Create Organization"
        )}
      </Button>
    </form>
  );
};
