import { Badge } from "@common/components/ui/badge";
import { Button } from "@common/components/ui/button";
import { Card, CardContent } from "@common/components/ui/card";
import { Input } from "@common/components/ui/input";
import { Label } from "@common/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@common/components/ui/select";
import { Separator } from "@common/components/ui/separator";
import { Textarea } from "@common/components/ui/textarea";
import { zodResolver } from "@hookform/resolvers/zod";
import { useGetProductsQuery } from "@modules/product/services/productApi";
import type { Product } from "@modules/product/types";
import { useGetSuppliersQuery } from "@modules/supplier/services/supplierApi";
import { Loader2, Plus, ShoppingCart, Trash2 } from "lucide-react";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import { z } from "zod";

const requiredSelect = (message: string) =>
  z
    .string()
    .optional()
    .transform((val) => val ?? "")
    .refine((val) => val.length > 0, message);

const purchaseSchema = z.object({
  supplierId: requiredSelect("Supplier is required"),
  items: z
    .array(
      z.object({
        productId: z.string().min(1, "Product is required"),
        quantity: z.coerce.number().min(1, "Quantity must be at least 1"),
        unitPrice: z.coerce.number().min(0, "Price must be 0 or more"),
      }),
    )
    .min(1, "At least one item is required"),
  vatAmount: z.coerce.number().min(0).default(0),
  paidAmount: z.coerce.number().min(0, "Paid amount must be 0 or more"),
  purchaseDate: z.string().min(1, "Purchase date is required"),
  notes: z.string().optional(),
});

type PurchaseFormData = z.infer<typeof purchaseSchema>;

interface PurchaseFormProps {
  onSubmit: (data: PurchaseFormData) => void;
  isLoading?: boolean;
}

export const PurchaseForm = ({ onSubmit, isLoading }: PurchaseFormProps) => {
  const { data: suppliersData } = useGetSuppliersQuery();
  const { data: productsData } = useGetProductsQuery();

  const suppliers = suppliersData?.data || [];
  const products = productsData?.data || [];

  const {
    register,
    control,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<z.input<typeof purchaseSchema>, unknown, PurchaseFormData>({
    resolver: zodResolver(purchaseSchema),
    defaultValues: {
      supplierId: "",
      items: [{ productId: "", quantity: 1, unitPrice: 0 }],
      vatAmount: 0,
      paidAmount: 0,
      purchaseDate: new Date().toISOString().split("T")[0],
      notes: "",
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "items",
  });

  const watchItems = watch("items") as PurchaseFormData["items"];
  const watchVat = (watch("vatAmount") ?? 0) as number;

  const subtotal = watchItems.reduce(
    (sum, item) => sum + (item.quantity || 0) * (item.unitPrice || 0),
    0,
  );
  const totalAmount = subtotal + (watchVat || 0);
  const watchPaid = (watch("paidAmount") ?? 0) as number;
  const dueAmount = totalAmount - (watchPaid || 0);

  const getProductById = (id: string): Product | undefined =>
    products.find((p) => p.id === id);

  const handleProductSelect = (index: number, productId: string) => {
    const product = getProductById(productId);
    if (product) {
      const currentItems = watchItems;
      currentItems[index].unitPrice = product.purchasePrice;
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Supplier</Label>
          <Controller
            control={control}
            name="supplierId"
            render={({ field }) => (
              <Select
                value={field.value || undefined}
                onValueChange={field.onChange}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select supplier" />
                </SelectTrigger>
                <SelectContent>
                  {suppliers.map((s) => (
                    <SelectItem key={s.id} value={s.id}>
                      {s.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
          {errors.supplierId && (
            <p className="text-sm text-destructive">
              {errors.supplierId.message}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="purchaseDate">Purchase Date</Label>
          <Input id="purchaseDate" type="date" {...register("purchaseDate")} />
          {errors.purchaseDate && (
            <p className="text-sm text-destructive">
              {errors.purchaseDate.message}
            </p>
          )}
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <Label className="text-base font-semibold flex items-center gap-2">
            <ShoppingCart className="h-4 w-4" />
            Items
          </Label>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => append({ productId: "", quantity: 1, unitPrice: 0 })}
          >
            <Plus className="mr-1 h-4 w-4" />
            Add Item
          </Button>
        </div>

        {errors.items?.message && (
          <p className="text-sm text-destructive">{errors.items.message}</p>
        )}

        <div className="space-y-3">
          {fields.map((field, index) => {
            const itemTotal =
              (watchItems[index]?.quantity || 0) *
              (watchItems[index]?.unitPrice || 0);
            const selectedProduct = watchItems[index]?.productId
              ? getProductById(watchItems[index].productId)
              : null;

            return (
              <Card key={field.id} className="border-dashed">
                <CardContent className="pt-4 pb-3 px-4">
                  <div className="grid grid-cols-12 gap-3 items-end">
                    <div className="col-span-12 md:col-span-4 space-y-1">
                      <Label className="text-xs">Product</Label>
                      <Controller
                        control={control}
                        name={`items.${index}.productId`}
                        render={({ field: selectField }) => (
                          <Select
                            value={selectField.value || undefined}
                            onValueChange={(val) => {
                              selectField.onChange(val);
                              handleProductSelect(index, val);
                            }}
                          >
                            <SelectTrigger className="h-9">
                              <SelectValue placeholder="Select product" />
                            </SelectTrigger>
                            <SelectContent>
                              {products.map((p) => (
                                <SelectItem key={p.id} value={p.id}>
                                  {p.name} ({p.sku})
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        )}
                      />
                      {errors.items?.[index]?.productId && (
                        <p className="text-xs text-destructive">
                          {errors.items[index].productId?.message}
                        </p>
                      )}
                    </div>

                    <div className="col-span-4 md:col-span-2 space-y-1">
                      <Label className="text-xs">Qty</Label>
                      <Input
                        type="number"
                        min={1}
                        className="h-9"
                        {...register(`items.${index}.quantity`, {
                          valueAsNumber: true,
                        })}
                      />
                    </div>

                    <div className="col-span-4 md:col-span-2 space-y-1">
                      <Label className="text-xs">Unit Price</Label>
                      <Input
                        type="number"
                        min={0}
                        step="0.01"
                        className="h-9"
                        {...register(`items.${index}.unitPrice`, {
                          valueAsNumber: true,
                        })}
                      />
                    </div>

                    <div className="col-span-3 md:col-span-3 space-y-1">
                      <Label className="text-xs">Total</Label>
                      <div className="h-9 flex items-center px-3 bg-muted rounded-md text-sm font-medium">
                        ${itemTotal.toFixed(2)}
                      </div>
                      {selectedProduct && (
                        <p className="text-xs text-muted-foreground">
                          Stock: {selectedProduct.stock}
                        </p>
                      )}
                    </div>

                    <div className="col-span-1 flex justify-end">
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => fields.length > 1 && remove(index)}
                        disabled={fields.length <= 1}
                        className="h-9 w-9 p-0"
                      >
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
          <Label htmlFor="notes">Notes (Optional)</Label>
          <Textarea
            id="notes"
            {...register("notes")}
            placeholder="Add any notes..."
            rows={3}
          />
        </div>

        <div className="space-y-3">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Subtotal</span>
            <span className="font-medium">${subtotal.toFixed(2)}</span>
          </div>

          <div className="flex items-center justify-between gap-4">
            <Label
              htmlFor="vatAmount"
              className="text-sm text-muted-foreground whitespace-nowrap"
            >
              VAT Amount
            </Label>
            <Input
              id="vatAmount"
              type="number"
              min={0}
              step="0.01"
              className="h-8 w-32 text-right"
              {...register("vatAmount", { valueAsNumber: true })}
            />
          </div>

          <Separator />

          <div className="flex justify-between font-semibold text-lg">
            <span>Total</span>
            <span>${totalAmount.toFixed(2)}</span>
          </div>

          <div className="flex items-center justify-between gap-4">
            <Label htmlFor="paidAmount" className="text-sm whitespace-nowrap">
              Paid Amount
            </Label>
            <Input
              id="paidAmount"
              type="number"
              min={0}
              step="0.01"
              className="h-8 w-32 text-right"
              {...register("paidAmount", { valueAsNumber: true })}
            />
          </div>
          {errors.paidAmount && (
            <p className="text-sm text-destructive">
              {errors.paidAmount.message}
            </p>
          )}

          <div className="flex justify-between">
            <span className="text-sm text-muted-foreground">Due Amount</span>
            <Badge variant={dueAmount > 0 ? "destructive" : "default"}>
              ${dueAmount.toFixed(2)}
            </Badge>
          </div>
        </div>
      </div>

      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Creating Purchase...
          </>
        ) : (
          "Create Purchase"
        )}
      </Button>
    </form>
  );
};
