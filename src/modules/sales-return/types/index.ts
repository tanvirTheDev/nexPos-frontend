export interface SalesReturnItem {
  productId: string;
  productName: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

export interface SalesReturn {
  id: string;
  returnInvoiceNumber: string;
  saleId: string | { id: string; invoiceNumber: string };
  saleInvoiceNumber: string;
  customerId: string | { id: string; name: string };
  items: SalesReturnItem[];
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

export interface CreateSalesReturnInput {
  saleId: string;
  items: {
    productId: string;
    quantity: number;
    unitPrice: number;
  }[];
  vatAmount?: number;
  reason?: string;
  returnDate: string;
}
