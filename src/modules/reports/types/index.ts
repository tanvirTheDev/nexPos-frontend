export interface SalesReport {
  totalSales: number;
  totalAmount: number;
  totalPaid: number;
  totalDue: number;
  totalProfit: number;
  salesByProduct: { productId: string; productName: string; totalQuantity: number; totalAmount: number }[];
  salesByCustomer: { customerId: string; customerName: string; totalSales: number; totalAmount: number }[];
  dailyBreakdown: { date: string; count: number; amount: number }[];
  monthlyBreakdown: { month: string; count: number; amount: number }[];
}

export interface PurchaseReport {
  totalPurchases: number;
  totalAmount: number;
  totalPaid: number;
  totalDue: number;
  purchasesBySupplier: { supplierId: string; supplierName: string; totalPurchases: number; totalAmount: number }[];
  purchasesByProduct: { productId: string; productName: string; totalQuantity: number; totalAmount: number }[];
}

export interface ProfitLossReport {
  totalRevenue: number;
  totalCost: number;
  grossProfit: number;
  profitByProduct: { productId: string; productName: string; quantity: number; revenue: number; cost: number; profit: number }[];
}

export interface CustomerReport {
  totalCustomers: number;
  activeCustomers: number;
  customersWithDue: number;
  totalDueAmount: number;
  topCustomers: { customerId: string; customerName: string; totalSales: number; totalAmount: number }[];
}

export interface SupplierReport {
  totalSuppliers: number;
  activeSuppliers: number;
  suppliersWithDue: number;
  totalDueAmount: number;
  topSuppliers: { supplierId: string; supplierName: string; totalPurchases: number; totalAmount: number }[];
}

export interface DateRangeParams {
  startDate?: string;
  endDate?: string;
}
