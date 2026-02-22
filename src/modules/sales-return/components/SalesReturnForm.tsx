import { useForm, useFieldArray, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Loader2, Plus, Trash2, RotateCcw } from "lucide-react";
import { Button } from "@common/components/ui/button";
import { Input } from "@common/components/ui/input";
import { Label } from "@common/components/ui/label";
import { Textarea } from "@common/components/ui/textarea";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@common/components/ui/select";
import { Card, CardContent } from "@common/components/ui/card";
import { Separator } from "@common/components/ui/separator";
import { useGetSalesQuery } from "@modules/sale/services/saleApi";
import { useGetProductsQuery } from "@modules/product/services/productApi";

const requiredSelect = (message: string) =>
  z.string().optional().transform((val) => val ?? "").refine((val) => val.length > 0, message);

const salesReturnSchema = z.object({
  saleId: requiredSelect("Sale is required"),
  items: z
    .array(
      z.object({
        productId: z.string().min(1, "Product is required"),
        quantity: z.coerce.number().min(1, "Qty must be at least 1"),
        unitPrice: z.coerce.number().min(0, "Price must be 0 or more"),
      })
    )
    .min(1, "At least one item is required"),
  vatAmount: z.coerce.number().min(0).default(0),
  reason: z.string().optional(),
  returnDate: z.string().min(1, "Return date is required"),
});

type SalesReturnFormData = z.infer<typeof salesReturnSchema>;

interface SalesReturnFormProps {
  onSubmit: (data: SalesReturnFormData) => void;
  isLoading?: boolean;
}

export const SalesReturnForm = ({ onSubmit, isLoading }: SalesReturnFormProps) => {
  const { data: salesData } = useGetSalesQuery();
  const { data: productsData } = useGetProductsQuery();

  const sales = salesData?.data || [];
  const products = productsData?.data || [];

  const {
    register, control, handleSubmit, watch, formState: { errors },
  } = useForm<SalesReturnFormData>({
    resolver: zodResolver(salesReturnSchema),
    defaultValues: {
      saleId: "",
      items: [{ productId: "", quantity: 1, unitPrice: 0 }],
      vatAmount: 0,
      reason: "",
      returnDate: new Date().toISOString().split("T")[0],
    },
  });

  const { fields, append, remove } = useFieldArray({ control, name: "items" });
  const watchItems = watch("items");
  const watchVat = watch("vatAmount");

  const subtotal = watchItems.reduce(
    (sum, item) => sum + (item.quantity || 0) * (item.unitPrice || 0), 0
  );
  const totalAmount = subtotal + (watchVat || 0);

  const getSaleLabel = (s: (typeof sales)[0]) => {
    const customer = typeof s.customerId === "object" ? s.customerId.name : s.customerId;
    return `${s.invoiceNumber} — ${customer}`;
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Original Sale</Label>
          <Controller control={control} name="saleId"
            render={({ field }) => (
              <Select value={field.value || undefined} onValueChange={field.onChange}>
                <SelectTrigger><SelectValue placeholder="Select sale" /></SelectTrigger>
                <SelectContent>
                  {sales.map((s) => (
                    <SelectItem key={s.id} value={s.id}>{getSaleLabel(s)}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
          {errors.saleId && <p className="text-sm text-destructive">{errors.saleId.message}</p>}
        </div>
        <div className="space-y-2">
          <Label htmlFor="returnDate">Return Date</Label>
          <Input id="returnDate" type="date" {...register("returnDate")} />
          {errors.returnDate && <p className="text-sm text-destructive">{errors.returnDate.message}</p>}
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <Label className="text-base font-semibold flex items-center gap-2">
            <RotateCcw className="h-4 w-4" /> Return Items
          </Label>
          <Button type="button" variant="outline" size="sm"
            onClick={() => append({ productId: "", quantity: 1, unitPrice: 0 })}>
            <Plus className="mr-1 h-4 w-4" /> Add Item
          </Button>
        </div>
        {errors.items?.message && <p className="text-sm text-destructive">{errors.items.message}</p>}
        <div className="space-y-3">
          {fields.map((field, index) => {
            const itemTotal = (watchItems[index]?.quantity || 0) * (watchItems[index]?.unitPrice || 0);
            return (
              <Card key={field.id} className="border-dashed">
                <CardContent className="pt-4 pb-3 px-4">
                  <div className="grid grid-cols-12 gap-3 items-end">
                    <div className="col-span-12 md:col-span-4 space-y-1">
                      <Label className="text-xs">Product</Label>
                      <Controller control={control} name={`items.${index}.productId`}
                        render={({ field: sf }) => (
                          <Select value={sf.value || undefined} onValueChange={sf.onChange}>
                            <SelectTrigger className="h-9"><SelectValue placeholder="Select product" /></SelectTrigger>
                            <SelectContent>
                              {products.map((p) => (
                                <SelectItem key={p.id} value={p.id}>{p.name} ({p.sku})</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        )}
                      />
                      {errors.items?.[index]?.productId && (
                        <p className="text-xs text-destructive">{errors.items[index].productId?.message}</p>
                      )}
                    </div>
                    <div className="col-span-4 md:col-span-2 space-y-1">
                      <Label className="text-xs">Qty</Label>
                      <Input type="number" min={1} className="h-9"
                        {...register(`items.${index}.quantity`, { valueAsNumber: true })} />
                    </div>
                    <div className="col-span-4 md:col-span-2 space-y-1">
                      <Label className="text-xs">Unit Price</Label>
                      <Input type="number" min={0} step="0.01" className="h-9"
                        {...register(`items.${index}.unitPrice`, { valueAsNumber: true })} />
                    </div>
                    <div className="col-span-3 md:col-span-3 space-y-1">
                      <Label className="text-xs">Total</Label>
                      <div className="h-9 flex items-center px-3 bg-muted rounded-md text-sm font-medium">
                        ${itemTotal.toFixed(2)}
                      </div>
                    </div>
                    <div className="col-span-1 flex justify-end">
                      <Button type="button" variant="ghost" size="sm"
                        onClick={() => fields.length > 1 && remove(index)}
                        disabled={fields.length <= 1} className="h-9 w-9 p-0">
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      <Separator />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="reason">Reason (Optional)</Label>
          <Textarea id="reason" {...register("reason")} placeholder="Reason for return..." rows={3} />
        </div>
        <div className="space-y-3">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Subtotal</span>
            <span className="font-medium">${subtotal.toFixed(2)}</span>
          </div>
          <div className="flex items-center justify-between gap-4">
            <Label htmlFor="vatAmount" className="text-sm text-muted-foreground whitespace-nowrap">VAT Amount</Label>
            <Input id="vatAmount" type="number" min={0} step="0.01" className="h-8 w-32 text-right"
              {...register("vatAmount", { valueAsNumber: true })} />
          </div>
          <Separator />
          <div className="flex justify-between font-semibold text-lg">
            <span>Total Return</span>
            <span>${totalAmount.toFixed(2)}</span>
          </div>
        </div>
      </div>

      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading ? (<><Loader2 className="mr-2 h-4 w-4 animate-spin" />Creating...</>) : "Create Sales Return"}
      </Button>
    </form>
  );
};
