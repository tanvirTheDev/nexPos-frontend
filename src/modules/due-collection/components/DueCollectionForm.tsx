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
import { useGetCustomersQuery } from "@modules/customer/services/customerApi";
import { useGetSalesQuery } from "@modules/sale/services/saleApi";

const requiredSelect = (message: string) =>
  z.string().optional().transform((val) => val ?? "").refine((val) => val.length > 0, message);

const dueCollectionSchema = z.object({
  customerId: requiredSelect("Customer is required"),
  saleId: z.string().optional(),
  amount: z.coerce.number().min(0.01, "Amount must be greater than 0"),
  paymentMethod: z.enum(["cash", "card", "bank"], {
    message: "Payment method is required",
  }),
  notes: z.string().optional(),
  collectionDate: z.string().min(1, "Collection date is required"),
});

type DueCollectionFormData = z.infer<typeof dueCollectionSchema>;

interface DueCollectionFormProps {
  onSubmit: (data: DueCollectionFormData) => void | Promise<void>;
  isLoading?: boolean;
}

export const DueCollectionForm = ({ onSubmit, isLoading }: DueCollectionFormProps) => {
  const { data: customersData } = useGetCustomersQuery();
  const { data: salesData } = useGetSalesQuery();

  const customers = customersData?.data || [];
  const sales = salesData?.data?.filter((s) => s.dueAmount > 0) || [];

  const {
    register, control, handleSubmit, watch, formState: { errors },
  } = useForm<z.input<typeof dueCollectionSchema>, unknown, DueCollectionFormData>({
    resolver: zodResolver(dueCollectionSchema),
    defaultValues: {
      customerId: "",
      saleId: "",
      amount: 0,
      paymentMethod: undefined,
      notes: "",
      collectionDate: new Date().toISOString().split("T")[0],
    },
  });

  const selectedCustomerId = watch("customerId");
  const filteredSales = sales.filter((s) => {
    const custId = typeof s.customerId === "object" ? s.customerId.id : s.customerId;
    return custId === selectedCustomerId;
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Customer</Label>
          <Controller control={control} name="customerId"
            render={({ field }) => (
              <Select value={field.value || undefined} onValueChange={field.onChange}>
                <SelectTrigger><SelectValue placeholder="Select customer" /></SelectTrigger>
                <SelectContent>
                  {customers.map((c) => (
                    <SelectItem key={c.id} value={c.id}>
                      {c.name} {c.balance > 0 ? `(Due: $${c.balance.toFixed(2)})` : ""}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
          {errors.customerId && <p className="text-sm text-destructive">{errors.customerId.message}</p>}
        </div>

        <div className="space-y-2">
          <Label>Sale Invoice (Optional)</Label>
          <Controller control={control} name="saleId"
            render={({ field }) => (
              <Select value={field.value || undefined} onValueChange={field.onChange}>
                <SelectTrigger><SelectValue placeholder="General payment" /></SelectTrigger>
                <SelectContent>
                  {filteredSales.map((s) => (
                    <SelectItem key={s.id} value={s.id}>
                      {s.invoiceNumber} (Due: ${s.dueAmount.toFixed(2)})
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
          <Label htmlFor="collectionDate">Collection Date</Label>
          <Input id="collectionDate" type="date" {...register("collectionDate")} />
          {errors.collectionDate && <p className="text-sm text-destructive">{errors.collectionDate.message}</p>}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="notes">Notes (Optional)</Label>
        <Textarea id="notes" {...register("notes")} placeholder="Add notes..." rows={2} />
      </div>

      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading ? (<><Loader2 className="mr-2 h-4 w-4 animate-spin" />Creating...</>) : "Create Due Collection"}
      </Button>
    </form>
  );
};
