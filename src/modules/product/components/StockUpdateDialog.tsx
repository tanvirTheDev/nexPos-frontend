import { Badge } from "@common/components/ui/badge";
import { Button } from "@common/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@common/components/ui/dialog";
import { Input } from "@common/components/ui/input";
import { Label } from "@common/components/ui/label";
import { Loader2, Minus, Plus } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { useUpdateStockMutation } from "../services/productApi";
import type { Product } from "../types";

interface StockUpdateDialogProps {
  product: Product;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const StockUpdateDialog = ({
  product,
  open,
  onOpenChange,
}: StockUpdateDialogProps) => {
  const [quantity, setQuantity] = useState(1);
  const [operation, setOperation] = useState<"add" | "subtract">("add");
  const [updateStock, { isLoading }] = useUpdateStockMutation();

  const handleSubmit = async () => {
    if (quantity <= 0) {
      toast.error("Quantity must be greater than 0");
      return;
    }

    if (operation === "subtract" && quantity > product.stock) {
      toast.error("Cannot subtract more than current stock");
      return;
    }

    try {
      await updateStock({
        id: product.id,
        quantity,
        operation,
      }).unwrap();
      toast.success(
        `Stock ${operation === "add" ? "added" : "subtracted"} successfully`,
      );
      setQuantity(1);
      onOpenChange(false);
    } catch (error: unknown) {
      const err = error as { data?: { message?: string } };
      toast.error(err?.data?.message || "Failed to update stock");
    }
  };

  const newStock =
    operation === "add" ? product.stock + quantity : product.stock - quantity;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[400px]">
        <DialogHeader>
          <DialogTitle>Update Stock</DialogTitle>
          <DialogDescription>
            {product.name} (SKU: {product.sku})
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 mt-4">
          <div className="flex items-center justify-between p-3 bg-muted rounded-md">
            <span className="text-sm">Current Stock</span>
            <Badge
              variant={
                product.stock <= product.minStock ? "destructive" : "default"
              }
            >
              {product.stock}
            </Badge>
          </div>

          <div className="space-y-2">
            <Label>Operation</Label>
            <div className="grid grid-cols-2 gap-2">
              <Button
                type="button"
                variant={operation === "add" ? "default" : "outline"}
                onClick={() => setOperation("add")}
                className="w-full"
              >
                <Plus className="mr-2 h-4 w-4" />
                Add Stock
              </Button>
              <Button
                type="button"
                variant={operation === "subtract" ? "default" : "outline"}
                onClick={() => setOperation("subtract")}
                className="w-full"
              >
                <Minus className="mr-2 h-4 w-4" />
                Remove Stock
              </Button>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="quantity">Quantity</Label>
            <Input
              id="quantity"
              type="number"
              min={1}
              value={quantity}
              onChange={(e) => setQuantity(Number(e.target.value))}
            />
          </div>

          <div className="flex items-center justify-between p-3 bg-muted rounded-md">
            <span className="text-sm">New Stock</span>
            <Badge variant={newStock < 0 ? "destructive" : "default"}>
              {newStock < 0 ? "Invalid" : newStock}
            </Badge>
          </div>

          <div className="flex justify-end gap-3">
            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={isLoading || newStock < 0 || quantity <= 0}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Updating...
                </>
              ) : (
                "Update Stock"
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
