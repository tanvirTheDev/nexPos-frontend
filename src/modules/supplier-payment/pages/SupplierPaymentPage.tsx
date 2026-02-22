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
  useGetSupplierPaymentsQuery,
  useCreateSupplierPaymentMutation,
} from "../services/supplierPaymentApi";
import { SupplierPaymentForm } from "../components/SupplierPaymentForm";
import type { SupplierPayment, CreateSupplierPaymentInput } from "../types";

const methodLabel: Record<string, string> = {
  cash: "Cash",
  card: "Card",
  bank: "Bank Transfer",
};

export const SupplierPaymentPage = () => {
  const { data, isLoading } = useGetSupplierPaymentsQuery();
  const [createPayment, { isLoading: isCreating }] = useCreateSupplierPaymentMutation();

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [detailItem, setDetailItem] = useState<SupplierPayment | null>(null);

  const handleCreate = async (formData: CreateSupplierPaymentInput) => {
    try {
      await createPayment(formData).unwrap();
      toast.success("Supplier payment recorded successfully");
      setIsCreateModalOpen(false);
    } catch (error: unknown) {
      const err = error as { data?: { message?: string } };
      toast.error(err?.data?.message || "Failed to create supplier payment");
    }
  };

  const columns: ColumnDef<SupplierPayment>[] = [
    {
      accessorKey: "receiptNumber",
      header: "Receipt #",
      cell: ({ row }) => (
        <span className="font-mono text-sm">{row.original.receiptNumber}</span>
      ),
    },
    {
      accessorKey: "supplierId",
      header: "Supplier",
      cell: ({ row }) =>
        typeof row.original.supplierId === "object"
          ? row.original.supplierId.name
          : row.original.supplierId,
    },
    {
      accessorKey: "amount",
      header: "Amount",
      cell: ({ row }) => (
        <span className="text-green-600 font-medium">${row.original.amount.toFixed(2)}</span>
      ),
    },
    {
      accessorKey: "paymentMethod",
      header: "Method",
      cell: ({ row }) => (
        <Badge variant="outline">{methodLabel[row.original.paymentMethod]}</Badge>
      ),
    },
    {
      accessorKey: "paymentDate",
      header: "Date",
      cell: ({ row }) => format(new Date(row.original.paymentDate), "dd MMM yyyy"),
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => (
        <Button variant="ghost" size="sm" onClick={() => setDetailItem(row.original)}>
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
          <h1 className="text-3xl font-bold">Supplier Payments</h1>
          <p className="text-muted-foreground">Pay dues to suppliers</p>
        </div>
        <Button onClick={() => setIsCreateModalOpen(true)}>
          <Plus className="mr-2 h-4 w-4" /> New Payment
        </Button>
      </div>

      <DataTable
        columns={columns}
        data={data?.data || []}
        searchKey="receiptNumber"
        searchPlaceholder="Search by receipt..."
      />

      <FormModal
        open={isCreateModalOpen}
        onOpenChange={setIsCreateModalOpen}
        title="Create Supplier Payment"
        description="Record a payment to a supplier"
      >
        <SupplierPaymentForm onSubmit={handleCreate} isLoading={isCreating} />
      </FormModal>

      <Dialog open={!!detailItem} onOpenChange={(open) => !open && setDetailItem(null)}>
        <DialogContent className="sm:max-w-[450px]">
          <DialogHeader>
            <DialogTitle>Receipt: {detailItem?.receiptNumber}</DialogTitle>
          </DialogHeader>
          {detailItem && (
            <div className="space-y-4 mt-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-muted-foreground">Supplier</span>
                  <p className="font-medium">
                    {typeof detailItem.supplierId === "object"
                      ? detailItem.supplierId.name
                      : detailItem.supplierId}
                  </p>
                </div>
                <div>
                  <span className="text-muted-foreground">Date</span>
                  <p className="font-medium">{format(new Date(detailItem.paymentDate), "PPP")}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Purchase Invoice</span>
                  <p className="font-medium">
                    {detailItem.purchaseId
                      ? typeof detailItem.purchaseId === "object"
                        ? detailItem.purchaseId.invoiceNumber
                        : detailItem.purchaseId
                      : "General Payment"}
                  </p>
                </div>
                <div>
                  <span className="text-muted-foreground">Payment Method</span>
                  <p className="font-medium">{methodLabel[detailItem.paymentMethod]}</p>
                </div>
              </div>
              <Separator />
              <div className="flex justify-between items-center text-lg font-semibold">
                <span>Amount Paid</span>
                <span className="text-green-600">${detailItem.amount.toFixed(2)}</span>
              </div>
              {detailItem.notes && (
                <>
                  <Separator />
                  <div>
                    <span className="text-sm text-muted-foreground">Notes</span>
                    <p className="text-sm mt-1">{detailItem.notes}</p>
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
