import { format } from "date-fns";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@common/components/ui/dialog";
import { Badge } from "@common/components/ui/badge";
import { Separator } from "@common/components/ui/separator";
import type { Purchase } from "../types";

interface PurchaseDetailDialogProps {
  purchase: Purchase | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const statusVariant = (status: string) => {
  switch (status) {
    case "paid":
      return "default" as const;
    case "partial":
      return "secondary" as const;
    case "unpaid":
      return "destructive" as const;
    default:
      return "default" as const;
  }
};

export const PurchaseDetailDialog = ({
  purchase,
  open,
  onOpenChange,
}: PurchaseDetailDialogProps) => {
  if (!purchase) return null;

  const supplierName =
    typeof purchase.supplierId === "object"
      ? purchase.supplierId.name
      : purchase.supplierId;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            Invoice: {purchase.invoiceNumber}
            <Badge variant={statusVariant(purchase.paymentStatus)}>
              {purchase.paymentStatus}
            </Badge>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 mt-4">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-muted-foreground">Supplier</span>
              <p className="font-medium">{supplierName}</p>
            </div>
            <div>
              <span className="text-muted-foreground">Date</span>
              <p className="font-medium">
                {format(new Date(purchase.purchaseDate), "PPP")}
              </p>
            </div>
          </div>

          <Separator />

          <div>
            <h4 className="font-semibold mb-2">Items</h4>
            <div className="border rounded-md">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b bg-muted/50">
                    <th className="text-left p-2">Product</th>
                    <th className="text-right p-2">Qty</th>
                    <th className="text-right p-2">Unit Price</th>
                    <th className="text-right p-2">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {purchase.items.map((item, idx) => (
                    <tr key={idx} className="border-b last:border-0">
                      <td className="p-2">{item.productName}</td>
                      <td className="text-right p-2">{item.quantity}</td>
                      <td className="text-right p-2">
                        ${item.unitPrice.toFixed(2)}
                      </td>
                      <td className="text-right p-2">
                        ${item.totalPrice.toFixed(2)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <Separator />

          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Subtotal</span>
              <span>${purchase.subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">VAT</span>
              <span>${purchase.vatAmount.toFixed(2)}</span>
            </div>
            <Separator />
            <div className="flex justify-between font-semibold text-base">
              <span>Total</span>
              <span>${purchase.totalAmount.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Paid</span>
              <span className="text-green-600">
                ${purchase.paidAmount.toFixed(2)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Due</span>
              <Badge variant={purchase.dueAmount > 0 ? "destructive" : "default"}>
                ${purchase.dueAmount.toFixed(2)}
              </Badge>
            </div>
          </div>

          {purchase.notes && (
            <>
              <Separator />
              <div>
                <span className="text-sm text-muted-foreground">Notes</span>
                <p className="text-sm mt-1">{purchase.notes}</p>
              </div>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
