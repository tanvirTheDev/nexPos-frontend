import { useState } from "react";
import { toast } from "sonner";
import { Loader2, Plus, Minus } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@common/components/ui/dialog";
import { Button } from "@common/components/ui/button";
import { Input } from "@common/components/ui/input";
import { Label } from "@common/components/ui/label";
import { Badge } from "@common/components/ui/badge";
import { useUpdateCustomerBalanceMutation } from "../services/customerApi";
import type { Customer } from "../types";

interface BalanceUpdateDialogProps {
  customer: Customer;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const BalanceUpdateDialog = ({
  customer,
  open,
  onOpenChange,
}: BalanceUpdateDialogProps) => {
  const [amount, setAmount] = useState(0);
  const [operation, setOperation] = useState<"add" | "subtract">("add");
  const [updateBalance, { isLoading }] = useUpdateCustomerBalanceMutation();

  const handleSubmit = async () => {
    if (amount <= 0) {
      toast.error("Amount must be greater than 0");
      return;
    }

    try {
      await updateBalance({
        id: customer.id,
        data: { amount, operation },
      }).unwrap();
      toast.success(`Balance ${operation === "add" ? "increased" : "decreased"} successfully`);
      setAmount(0);
      onOpenChange(false);
    } catch (error: unknown) {
      const err = error as { data?: { message?: string } };
      toast.error(err?.data?.message || "Failed to update balance");
    }
  };

  const newBalance =
    operation === "add"
      ? customer.balance + amount
      : customer.balance - amount;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[400px]">
        <DialogHeader>
          <DialogTitle>Update Balance</DialogTitle>
          <DialogDescription>{customer.name}</DialogDescription>
        </DialogHeader>

        <div className="space-y-4 mt-4">
          <div className="flex items-center justify-between p-3 bg-muted rounded-md">
            <span className="text-sm">Current Balance (Due)</span>
            <Badge variant={customer.balance > 0 ? "destructive" : "default"}>
              ${customer.balance.toFixed(2)}
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
                Add Due
              </Button>
              <Button
                type="button"
                variant={operation === "subtract" ? "default" : "outline"}
                onClick={() => setOperation("subtract")}
                className="w-full"
              >
                <Minus className="mr-2 h-4 w-4" />
                Reduce Due
              </Button>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="amount">Amount</Label>
            <Input
              id="amount"
              type="number"
              min={0}
              step="0.01"
              value={amount}
              onChange={(e) => setAmount(Number(e.target.value))}
            />
          </div>

          <div className="flex items-center justify-between p-3 bg-muted rounded-md">
            <span className="text-sm">New Balance</span>
            <Badge variant={newBalance > 0 ? "destructive" : "default"}>
              ${newBalance.toFixed(2)}
            </Badge>
          </div>

          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isLoading}>
              Cancel
            </Button>
            <Button onClick={handleSubmit} disabled={isLoading || amount <= 0}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Updating...
                </>
              ) : (
                "Update Balance"
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
