export interface Supplier {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  address?: string;
  balance: number;
  isActive: boolean;
  organizationId: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateSupplierInput {
  name: string;
  email?: string;
  phone?: string;
  address?: string;
}

export interface UpdateBalanceInput {
  amount: number;
  operation: "add" | "subtract";
}
