export interface SaleItem {
  productId: string;
  productName: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

export interface Sale {
  id: string;
  invoiceNumber: string;
  customerId: string | { id: string; name: string };
  items: SaleItem[];
  subtotal: number;
  vatAmount: number;
  totalAmount: number;
  paidAmount: number;
  dueAmount: number;
  paymentStatus: "paid" | "partial" | "unpaid";
  saleDate: string;
  notes?: string;
  isActive: boolean;
  organizationId: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateSaleInput {
  customerId: string;
  items: {
    productId: string;
    quantity: number;
    unitPrice: number;
  }[];
  vatAmount?: number;
  paidAmount: number;
  saleDate: string;
  notes?: string;
}

export interface UpdateSaleInput {
  paidAmount?: number;
  notes?: string;
}
