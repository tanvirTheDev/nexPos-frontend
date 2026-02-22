export interface DueCollection {
  id: string;
  receiptNumber: string;
  customerId: string | { id: string; name: string };
  saleId?: string | { id: string; invoiceNumber: string };
  amount: number;
  paymentMethod: "cash" | "card" | "bank";
  notes?: string;
  collectionDate: string;
  organizationId: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateDueCollectionInput {
  customerId: string;
  saleId?: string;
  amount: number;
  paymentMethod: "cash" | "card" | "bank";
  notes?: string;
  collectionDate: string;
}
