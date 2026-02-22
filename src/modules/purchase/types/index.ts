export interface PurchaseItem {
  productId: string;
  productName: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

export interface Purchase {
  id: string;
  invoiceNumber: string;
  supplierId: string | { id: string; name: string };
  items: PurchaseItem[];
  subtotal: number;
  vatAmount: number;
  totalAmount: number;
  paidAmount: number;
  dueAmount: number;
  paymentStatus: "paid" | "partial" | "unpaid";
  purchaseDate: string;
  notes?: string;
  isActive: boolean;
  organizationId: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreatePurchaseInput {
  supplierId: string;
  items: {
    productId: string;
    quantity: number;
    unitPrice: number;
  }[];
  vatAmount?: number;
  paidAmount: number;
  purchaseDate: string;
  notes?: string;
}

export interface UpdatePurchaseInput {
  paidAmount?: number;
  notes?: string;
}
