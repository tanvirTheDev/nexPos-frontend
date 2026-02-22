export interface ProductStock {
  productId: string;
  productName: string;
  sku: string;
  currentStock: number;
  minStock: number;
  maxStock?: number;
  reorderPoint?: number;
  purchasePrice: number;
  salePrice: number;
  stockValue: number;
  isLowStock: boolean;
}

export interface StockMovement {
  date: string;
  type: "purchase" | "sale" | "purchase_return" | "sales_return" | "adjustment";
  referenceId: string;
  referenceNumber: string;
  productId: string;
  productName: string;
  quantity: number;
  direction: "in" | "out";
}

export interface StockHistory {
  productId: string;
  productName: string;
  currentStock: number;
  movements: StockMovement[];
}

export interface StockValuation {
  totalProducts: number;
  totalStockQuantity: number;
  totalPurchaseValue: number;
  totalSaleValue: number;
  products: ProductStock[];
}
