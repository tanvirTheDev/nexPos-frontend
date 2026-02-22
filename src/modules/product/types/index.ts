export interface Product {
  id: string;
  name: string;
  sku: string;
  barcode?: string;
  description?: string;
  categoryId: string | { id: string; name: string };
  unitId: string | { id: string; name: string; symbol: string };
  vatId: string | { id: string; name: string; percentage: number };
  purchasePrice: number;
  salePrice: number;
  stock: number;
  minStock: number;
  maxStock?: number;
  reorderPoint?: number;
  image?: string;
  isActive: boolean;
  organizationId: string;
  createdBy?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Category {
  id: string;
  name: string;
  description?: string;
  isActive: boolean;
  organizationId: string;
  createdAt: string;
  updatedAt: string;
}

export interface Unit {
  id: string;
  name: string;
  symbol: string;
  isActive: boolean;
  organizationId: string;
  createdAt: string;
  updatedAt: string;
}

export interface VAT {
  id: string;
  name: string;
  percentage: number;
  isActive: boolean;
  organizationId: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateProductInput {
  name: string;
  sku: string;
  barcode?: string;
  description?: string;
  categoryId: string | { id: string; name: string };
  unitId: string | { id: string; name: string; symbol: string };
  vatId: string | { id: string; name: string; percentage: number };
  purchasePrice: number;
  salePrice: number;
  stock: number;
  minStock: number;
}

export interface CreateCategoryInput {
  name: string;
  description?: string;
}

export interface CreateUnitInput {
  name: string;
  symbol: string;
}

export interface CreateVATInput {
  name: string;
  percentage: number;
}
