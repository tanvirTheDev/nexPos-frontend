import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Loader2 } from "lucide-react";
import { Button } from "@common/components/ui/button";
import { Input } from "@common/components/ui/input";
import { Label } from "@common/components/ui/label";
import { Textarea } from "@common/components/ui/textarea";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@common/components/ui/select";
import { useGetSuppliersQuery } from "@modules/supplier/services/supplierApi";
import { useGetPurchasesQuery } from "@modules/purchase/services/purchaseApi";

const requiredSelect = (message: string) =>
  z.string().optional().transform((val) => val ?? "").refine((val) => val.length > 0, message);

const supplierPaymentSchema = z.object({
  supplierId: requiredSelect("Supplier is required"),
  purchaseId: z.string().optional(),
  amount: z.coerce.number().min(0.01, "Amount must be greater than 0"),
  paymentMethod: z.enum(["cash", "card", "bank"], {
    message: "Payment method is required",
  }),
  notes: z.string().optional(),
  paymentDate: z.string().min(1, "Payment date is required"),
});

type SupplierPaymentFormData = z.infer<typeof supplierPaymentSchema>;

interface SupplierPaymentFormProps {
  onSubmit: (data: SupplierPaymentFormData) => void | Promise<void>;
  isLoading?: boolean;
}

export const SupplierPaymentForm = ({ onSubmit, isLoading }: SupplierPaymentFormProps) => {
  const { data: suppliersData } = useGetSuppliersQuery();
  const { data: purchasesData } = useGetPurchasesQuery();

  const suppliers = suppliersData?.data || [];
  const purchases = purchasesData?.data?.filter((p) => p.dueAmount > 0) || [];

  const {
    register, control, handleSubmit, watch, formState: { errors },
  } = useForm<
    z.input<typeof supplierPaymentSchema>,
    unknown,
    SupplierPaymentFormData
  >({
    resolver: zodResolver(supplierPaymentSchema),
    defaultValues: {
      supplierId: "",
      purchaseId: "",
      amount: 0,
      paymentMethod: undefined,
      notes: "",
      paymentDate: new Date().toISOString().split("T")[0],
    },
  });

  const selectedSupplierId = watch("supplierId");
  const filteredPurchases = purchases.filter((p) => {
    const supId = typeof p.supplierId === "object" ? p.supplierId.id : p.supplierId;
    return supId === selectedSupplierId;
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Supplier</Label>
          <Controller control={control} name="supplierId"
            render={({ field }) => (
              <Select value={field.value || undefined} onValueChange={field.onChange}>
                <SelectTrigger><SelectValue placeholder="Select supplier" /></SelectTrigger>
                <SelectContent>
                  {suppliers.map((s) => (
                    <SelectItem key={s.id} value={s.id}>
                      {s.name} {s.balance > 0 ? `(Due: $${s.balance.toFixed(2)})` : ""}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
          {errors.supplierId && <p className="text-sm text-destructive">{errors.supplierId.message}</p>}
        </div>

        <div className="space-y-2">
          <Label>Purchase Invoice (Optional)</Label>
          <Controller control={control} name="purchaseId"
            render={({ field }) => (
              <Select value={field.value || undefined} onValueChange={field.onChange}>
                <SelectTrigger><SelectValue placeholder="General payment" /></SelectTrigger>
                <SelectContent>
                  {filteredPurchases.map((p) => (
                    <SelectItem key={p.id} value={p.id}>
                      {p.invoiceNumber} (Due: ${p.dueAmount.toFixed(2)})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label htmlFor="amount">Amount</Label>
          <Input id="amount" type="number" min={0.01} step="0.01"
            {...register("amount", { valueAsNumber: true })} />
          {errors.amount && <p className="text-sm text-destructive">{errors.amount.message}</p>}
        </div>

        <div className="space-y-2">
          <Label>Payment Method</Label>
          <Controller control={control} name="paymentMethod"
            render={({ field }) => (
              <Select value={field.value || undefined} onValueChange={field.onChange}>
                <SelectTrigger><SelectValue placeholder="Select method" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="cash">Cash</SelectItem>
                  <SelectItem value="card">Card</SelectItem>
                  <SelectItem value="bank">Bank Transfer</SelectItem>
                </SelectContent>
              </Select>
            )}
          />
          {errors.paymentMethod && <p className="text-sm text-destructive">{errors.paymentMethod.message}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="paymentDate">Payment Date</Label>
          <Input id="paymentDate" type="date" {...register("paymentDate")} />
          {errors.paymentDate && <p className="text-sm text-destructive">{errors.paymentDate.message}</p>}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="notes">Notes (Optional)</Label>
        <Textarea id="notes" {...register("notes")} placeholder="Add notes..." rows={2} />
      </div>

      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading ? (<><Loader2 className="mr-2 h-4 w-4 animate-spin" />Creating...</>) : "Create Supplier Payment"}
      </Button>
    </form>
  );
};
