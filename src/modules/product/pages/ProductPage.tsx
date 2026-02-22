import { TableSkeleton } from "@common/components/common/LoadingState";
import { ConfirmDialog } from "@common/components/forms/ConfirmDialog";
import { FormModal } from "@common/components/forms/FormModal";
import { DataTable } from "@common/components/tables/DataTable";
import { Badge } from "@common/components/ui/badge";
import { Button } from "@common/components/ui/button";
import { ColumnDef } from "@tanstack/react-table";
import { PackagePlus, Pencil, Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { ProductForm } from "../components/ProductForm";
import { StockUpdateDialog } from "../components/StockUpdateDialog";
import {
  useCreateProductMutation,
  useDeleteProductMutation,
  useGetProductsQuery,
  useUpdateProductMutation,
} from "../services/productApi";
import type { CreateProductInput, Product } from "../types";

export const ProductPage = () => {
  const { data, isLoading } = useGetProductsQuery();
  const [createProduct, { isLoading: isCreating }] = useCreateProductMutation();
  console.log(createProduct);
  const [updateProduct, { isLoading: isUpdating }] = useUpdateProductMutation();
  const [deleteProduct, { isLoading: isDeleting }] = useDeleteProductMutation();

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState<string | null>(null);
  const [stockProduct, setStockProduct] = useState<Product | null>(null);

  const handleCreate = async (formData: CreateProductInput) => {
    console.log(formData);
    try {
      await createProduct(formData).unwrap();
      toast.success("Product created successfully");
      setIsCreateModalOpen(false);
    } catch (error: unknown) {
      const err = error as { data?: { message?: string } };
      toast.error(err?.data?.message || "Failed to create product");
    }
  };

  const handleUpdate = async (formData: CreateProductInput) => {
    if (!selectedProduct) return;
    try {
      await updateProduct({
        id: selectedProduct.id,
        data: formData,
      }).unwrap();
      toast.success("Product updated successfully");
      setSelectedProduct(null);
    } catch (error: unknown) {
      const err = error as { data?: { message?: string } };
      toast.error(err?.data?.message || "Failed to update product");
    }
  };

  const handleDelete = async () => {
    if (!productToDelete) return;
    try {
      await deleteProduct(productToDelete).unwrap();
      toast.success("Product deleted successfully");
      setDeleteConfirmOpen(false);
      setProductToDelete(null);
    } catch (error: unknown) {
      const err = error as { data?: { message?: string } };
      toast.error(err?.data?.message || "Failed to delete product");
    }
  };

  const columns: ColumnDef<Product>[] = [
    {
      accessorKey: "name",
      header: "Name",
    },
    {
      accessorKey: "sku",
      header: "SKU",
      cell: ({ row }) => (
        <span className="font-mono text-xs">{row.original.sku}</span>
      ),
    },
    {
      accessorKey: "purchasePrice",
      header: "Purchase Price",
      cell: ({ row }) => `$${row.original.purchasePrice.toFixed(2)}`,
    },
    {
      accessorKey: "salePrice",
      header: "Sale Price",
      cell: ({ row }) => `$${row.original.salePrice.toFixed(2)}`,
    },
    {
      accessorKey: "stock",
      header: "Stock",
      cell: ({ row }) => {
        const isLow = row.original.stock <= row.original.minStock;
        return (
          <Badge variant={isLow ? "destructive" : "default"}>
            {row.original.stock}
          </Badge>
        );
      },
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
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setStockProduct(row.original)}
            title="Update stock"
          >
            <PackagePlus className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setSelectedProduct(row.original)}
            title="Edit product"
          >
            <Pencil className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              setProductToDelete(row.original.id);
              setDeleteConfirmOpen(true);
            }}
            title="Delete product"
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
          <h1 className="text-3xl font-bold">Products</h1>
          <p className="text-muted-foreground">Manage your product inventory</p>
        </div>
        <Button onClick={() => setIsCreateModalOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Add Product
        </Button>
      </div>

      <DataTable
        columns={columns}
        data={data?.data || []}
        searchKey="name"
        searchPlaceholder="Search products..."
      />

      <FormModal
        open={isCreateModalOpen}
        onOpenChange={setIsCreateModalOpen}
        title="Create Product"
        description="Add a new product to your inventory"
        className="sm:max-w-[650px]"
      >
        <ProductForm onSubmit={handleCreate} isLoading={isCreating} />
      </FormModal>

      <FormModal
        open={!!selectedProduct}
        onOpenChange={(open) => !open && setSelectedProduct(null)}
        title="Edit Product"
        description="Update product details"
        className="sm:max-w-[650px]"
      >
        {selectedProduct && (
          <ProductForm
            product={selectedProduct}
            onSubmit={handleUpdate}
            isLoading={isUpdating}
          />
        )}
      </FormModal>

      <ConfirmDialog
        open={deleteConfirmOpen}
        onOpenChange={setDeleteConfirmOpen}
        title="Delete Product"
        description="Are you sure you want to delete this product? This action cannot be undone."
        onConfirm={handleDelete}
        variant="destructive"
        isLoading={isDeleting}
      />

      {stockProduct && (
        <StockUpdateDialog
          product={stockProduct}
          open={!!stockProduct}
          onOpenChange={(open) => !open && setStockProduct(null)}
        />
      )}
    </div>
  );
};
