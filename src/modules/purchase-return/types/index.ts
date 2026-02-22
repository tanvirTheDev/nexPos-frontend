export interface PurchaseReturnItem {
  productId: string;
  productName: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

export interface PurchaseReturn {
  id: string;
  returnInvoiceNumber: string;
  purchaseId: string | { id: string; invoiceNumber: string };
  purchaseInvoiceNumber: string;
  supplierId: string | { id: string; name: string };
  items: PurchaseReturnItem[];
  subtotal: number;
  vatAmount: number;
  totalAmount: number;
  reason?: string;
  returnDate: string;
  organizationId: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreatePurchaseReturnInput {
  purchaseId: string;
  items: {
    productId: string;
    quantity: number;
    unitPrice: number;
  }[];
  vatAmount?: number;
  reason?: string;
  returnDate: string;
}
