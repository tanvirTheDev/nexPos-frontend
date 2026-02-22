export interface SupplierPayment {
  id: string;
  receiptNumber: string;
  supplierId: string | { id: string; name: string };
  purchaseId?: string | { id: string; invoiceNumber: string };
  amount: number;
  paymentMethod: "cash" | "card" | "bank";
  notes?: string;
  paymentDate: string;
  organizationId: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateSupplierPaymentInput {
  supplierId: string;
  purchaseId?: string;
  amount: number;
  paymentMethod: "cash" | "card" | "bank";
  notes?: string;
  paymentDate: string;
}
