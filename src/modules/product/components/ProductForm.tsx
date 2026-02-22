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
import { Textarea } from "@common/components/ui/textarea";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";
import { useGetCategoriesQuery } from "../services/categoryApi";
import { useGetUnitsQuery } from "../services/unitApi";
import { useGetVATsQuery } from "../services/vatApi";
import type { Product } from "../types";

const requiredSelect = (message: string) =>
  z
    .string()
    .optional()
    .transform((val) => val ?? "")
    .refine((val) => val.length > 0, message);

const productSchema = z.object({
  name: z.string().min(1, "Product name is required"),
  sku: z.string().min(1, "SKU is required"),
  barcode: z.string().optional(),
  description: z.string().optional(),
  categoryId: requiredSelect("Category is required"),
  unitId: requiredSelect("Unit is required"),
  vatId: requiredSelect("VAT is required"),
  purchasePrice: z.number().min(0, "Must be positive"),
  salePrice: z.number().min(0, "Must be positive"),
  stock: z.number().min(0, "Must be positive"),
  minStock: z.number().min(0, "Must be positive"),
});

type ProductFormData = z.infer<typeof productSchema>;

interface ProductFormProps {
  product?: Product;
  onSubmit: (data: ProductFormData) => void;
  isLoading?: boolean;
}

const resolveId = (field: string | { id: string }) =>
  typeof field === "object" ? field.id : field;

export const ProductForm = ({
  product,
  onSubmit,
  isLoading,
}: ProductFormProps) => {
  const { data: categories } = useGetCategoriesQuery();
  const { data: units } = useGetUnitsQuery();
  const { data: vats } = useGetVATsQuery();
  console.log(categories);
  console.log(units);
  console.log(vats);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
    defaultValues: product
      ? {
          name: product.name,
          sku: product.sku,
          barcode: product.barcode || "",
          description: product.description || "",
          categoryId: resolveId(product.categoryId),
          unitId: resolveId(product.unitId),
          vatId: resolveId(product.vatId),
          purchasePrice: product.purchasePrice,
          salePrice: product.salePrice,
          stock: product.stock,
          minStock: product.minStock,
        }
      : {
          name: "",
          sku: "",
          barcode: "",
          description: "",
          categoryId: "",
          unitId: "",
          vatId: "",
          stock: 0,
          minStock: 0,
          purchasePrice: 0,
          salePrice: 0,
        },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="name">Product Name</Label>
          <Input id="name" {...register("name")} placeholder="Enter name" />
          {errors.name && (
            <p className="text-sm text-destructive">{errors.name.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="sku">SKU</Label>
          <Input id="sku" {...register("sku")} placeholder="LAP001" />
          {errors.sku && (
            <p className="text-sm text-destructive">{errors.sku.message}</p>
          )}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="barcode">Barcode (Optional)</Label>
        <Input
          id="barcode"
          {...register("barcode")}
          placeholder="1234567890123"
        />
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label>Category</Label>
          <Controller
            name="categoryId"
            control={control}
            render={({ field }) => (
              <Select value={field.value || ""} onValueChange={field.onChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {categories?.data?.map((cat) => (
                    <SelectItem key={cat.id} value={cat.id}>
                      {cat.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
          {errors.categoryId && (
            <p className="text-sm text-destructive">
              {errors.categoryId.message}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label>Unit</Label>
          <Controller
            name="unitId"
            control={control}
            render={({ field }) => (
              <Select value={field.value || ""} onValueChange={field.onChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Select unit" />
                </SelectTrigger>
                <SelectContent>
                  {units?.data?.map((unit) => (
                    <SelectItem key={unit.id} value={unit.id}>
                      {unit.name} ({unit.symbol})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
          {errors.unitId && (
            <p className="text-sm text-destructive">{errors.unitId.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label>VAT</Label>
          <Controller
            name="vatId"
            control={control}
            render={({ field }) => (
              <Select value={field.value || ""} onValueChange={field.onChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Select VAT" />
                </SelectTrigger>
                <SelectContent>
                  {vats?.data?.map((vat) => (
                    <SelectItem key={vat.id} value={vat.id}>
                      {vat.name} ({vat.percentage}%)
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
          {errors.vatId && (
            <p className="text-sm text-destructive">{errors.vatId.message}</p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="purchasePrice">Purchase Price</Label>
          <Input
            id="purchasePrice"
            type="number"
            step="0.01"
            {...register("purchasePrice", { valueAsNumber: true })}
          />
          {errors.purchasePrice && (
            <p className="text-sm text-destructive">
              {errors.purchasePrice.message}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="salePrice">Sale Price</Label>
          <Input
            id="salePrice"
            type="number"
            step="0.01"
            {...register("salePrice", { valueAsNumber: true })}
          />
          {errors.salePrice && (
            <p className="text-sm text-destructive">
              {errors.salePrice.message}
            </p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="stock">Initial Stock</Label>
          <Input
            id="stock"
            type="number"
            {...register("stock", { valueAsNumber: true })}
          />
          {errors.stock && (
            <p className="text-sm text-destructive">{errors.stock.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="minStock">Min Stock (Alert Threshold)</Label>
          <Input
            id="minStock"
            type="number"
            {...register("minStock", { valueAsNumber: true })}
          />
          {errors.minStock && (
            <p className="text-sm text-destructive">
              {errors.minStock.message}
            </p>
          )}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description (Optional)</Label>
        <Textarea
          id="description"
          {...register("description")}
          placeholder="Product description"
          rows={3}
        />
      </div>

      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Saving...
          </>
        ) : product ? (
          "Update Product"
        ) : (
          "Create Product"
        )}
      </Button>
    </form>
  );
};
