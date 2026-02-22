import { useState } from "react";
import { Plus, Eye } from "lucide-react";
import { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import { toast } from "sonner";
import { DataTable } from "@common/components/tables/DataTable";
import { FormModal } from "@common/components/forms/FormModal";
import { Button } from "@common/components/ui/button";
import { Badge } from "@common/components/ui/badge";
import { Separator } from "@common/components/ui/separator";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle,
} from "@common/components/ui/dialog";
import { TableSkeleton } from "@common/components/common/LoadingState";
import {
  useGetSalesReturnsQuery,
  useCreateSalesReturnMutation,
} from "../services/salesReturnApi";
import { SalesReturnForm } from "../components/SalesReturnForm";
import type { SalesReturn, CreateSalesReturnInput } from "../types";

export const SalesReturnPage = () => {
  const { data, isLoading } = useGetSalesReturnsQuery();
  const [createReturn, { isLoading: isCreating }] = useCreateSalesReturnMutation();

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [detailReturn, setDetailReturn] = useState<SalesReturn | null>(null);

  const handleCreate = async (formData: CreateSalesReturnInput) => {
    try {
      await createReturn(formData).unwrap();
      toast.success("Sales return created successfully");
      setIsCreateModalOpen(false);
    } catch (error: unknown) {
      const err = error as { data?: { message?: string } };
      toast.error(err?.data?.message || "Failed to create sales return");
    }
  };

  const columns: ColumnDef<SalesReturn>[] = [
    {
      accessorKey: "returnInvoiceNumber",
      header: "Return Invoice #",
      cell: ({ row }) => (
        <span className="font-mono text-sm">{row.original.returnInvoiceNumber}</span>
      ),
    },
    {
      accessorKey: "saleInvoiceNumber",
      header: "Sale Invoice #",
      cell: ({ row }) => (
        <span className="font-mono text-sm text-muted-foreground">
          {row.original.saleInvoiceNumber}
        </span>
      ),
    },
    {
      accessorKey: "customerId",
      header: "Customer",
      cell: ({ row }) =>
        typeof row.original.customerId === "object"
          ? row.original.customerId.name
          : row.original.customerId,
    },
    {
      accessorKey: "returnDate",
      header: "Date",
      cell: ({ row }) => format(new Date(row.original.returnDate), "dd MMM yyyy"),
    },
    {
      accessorKey: "totalAmount",
      header: "Total",
      cell: ({ row }) => (
        <Badge variant="secondary">${row.original.totalAmount.toFixed(2)}</Badge>
      ),
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => (
        <Button variant="ghost" size="sm" onClick={() => setDetailReturn(row.original)}>
          <Eye className="h-4 w-4" />
        </Button>
      ),
    },
  ];

  if (isLoading) return <TableSkeleton />;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Sales Returns</h1>
          <p className="text-muted-foreground">Manage sales returns</p>
        </div>
        <Button onClick={() => setIsCreateModalOpen(true)}>
          <Plus className="mr-2 h-4 w-4" /> New Return
        </Button>
      </div>

      <DataTable
        columns={columns}
        data={data?.data || []}
        searchKey="returnInvoiceNumber"
        searchPlaceholder="Search by invoice..."
      />

      <FormModal
        open={isCreateModalOpen}
        onOpenChange={setIsCreateModalOpen}
        title="Create Sales Return"
        description="Return items from a sale"
        className="sm:max-w-[800px]"
      >
        <SalesReturnForm onSubmit={handleCreate} isLoading={isCreating} />
      </FormModal>

      <Dialog open={!!detailReturn} onOpenChange={(open) => !open && setDetailReturn(null)}>
        <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Return: {detailReturn?.returnInvoiceNumber}</DialogTitle>
          </DialogHeader>
          {detailReturn && (
            <div className="space-y-4 mt-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-muted-foreground">Original Sale</span>
                  <p className="font-medium">{detailReturn.saleInvoiceNumber}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Date</span>
                  <p className="font-medium">{format(new Date(detailReturn.returnDate), "PPP")}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Customer</span>
                  <p className="font-medium">
                    {typeof detailReturn.customerId === "object"
                      ? detailReturn.customerId.name
                      : detailReturn.customerId}
                  </p>
                </div>
              </div>
              <Separator />
              <div className="border rounded-md">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b bg-muted/50">
                      <th className="text-left p-2">Product</th>
                      <th className="text-right p-2">Qty</th>
                      <th className="text-right p-2">Price</th>
                      <th className="text-right p-2">Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {detailReturn.items.map((item, idx) => (
                      <tr key={idx} className="border-b last:border-0">
                        <td className="p-2">{item.productName}</td>
                        <td className="text-right p-2">{item.quantity}</td>
                        <td className="text-right p-2">${item.unitPrice.toFixed(2)}</td>
                        <td className="text-right p-2">${item.totalPrice.toFixed(2)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <Separator />
              <div className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span>${detailReturn.subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">VAT</span>
                  <span>${detailReturn.vatAmount.toFixed(2)}</span>
                </div>
                <Separator />
                <div className="flex justify-between font-semibold text-base">
                  <span>Total Return</span>
                  <span>${detailReturn.totalAmount.toFixed(2)}</span>
                </div>
              </div>
              {detailReturn.reason && (
                <>
                  <Separator />
                  <div>
                    <span className="text-sm text-muted-foreground">Reason</span>
                    <p className="text-sm mt-1">{detailReturn.reason}</p>
                  </div>
                </>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};
