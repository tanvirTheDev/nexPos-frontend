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
  useGetDueCollectionsQuery,
  useCreateDueCollectionMutation,
} from "../services/dueCollectionApi";
import { DueCollectionForm } from "../components/DueCollectionForm";
import type { DueCollection, CreateDueCollectionInput } from "../types";

const methodLabel: Record<string, string> = {
  cash: "Cash",
  card: "Card",
  bank: "Bank Transfer",
};

export const DueCollectionPage = () => {
  const { data, isLoading } = useGetDueCollectionsQuery();
  const [createCollection, { isLoading: isCreating }] = useCreateDueCollectionMutation();

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [detailItem, setDetailItem] = useState<DueCollection | null>(null);

  const handleCreate = async (formData: CreateDueCollectionInput) => {
    try {
      await createCollection(formData).unwrap();
      toast.success("Due collection recorded successfully");
      setIsCreateModalOpen(false);
    } catch (error: unknown) {
      const err = error as { data?: { message?: string } };
      toast.error(err?.data?.message || "Failed to create due collection");
    }
  };

  const columns: ColumnDef<DueCollection>[] = [
    {
      accessorKey: "receiptNumber",
      header: "Receipt #",
      cell: ({ row }) => (
        <span className="font-mono text-sm">{row.original.receiptNumber}</span>
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
      accessorKey: "collectionDate",
      header: "Date",
      cell: ({ row }) => format(new Date(row.original.collectionDate), "dd MMM yyyy"),
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
          <h1 className="text-3xl font-bold">Due Collections</h1>
          <p className="text-muted-foreground">Collect due payments from customers</p>
        </div>
        <Button onClick={() => setIsCreateModalOpen(true)}>
          <Plus className="mr-2 h-4 w-4" /> New Collection
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
        title="Create Due Collection"
        description="Record a due payment from a customer"
      >
        <DueCollectionForm onSubmit={handleCreate} isLoading={isCreating} />
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
                  <span className="text-muted-foreground">Customer</span>
                  <p className="font-medium">
                    {typeof detailItem.customerId === "object"
                      ? detailItem.customerId.name
                      : detailItem.customerId}
                  </p>
                </div>
                <div>
                  <span className="text-muted-foreground">Date</span>
                  <p className="font-medium">{format(new Date(detailItem.collectionDate), "PPP")}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Sale Invoice</span>
                  <p className="font-medium">
                    {detailItem.saleId
                      ? typeof detailItem.saleId === "object"
                        ? detailItem.saleId.invoiceNumber
                        : detailItem.saleId
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
                <span>Amount Collected</span>
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
