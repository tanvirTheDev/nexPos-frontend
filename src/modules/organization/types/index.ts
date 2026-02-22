export interface Organization {
  id: string;
  companyName: string;
  contactEmail: string;
  contactPhone: string;
  address?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateOrganizationInput {
  companyName: string;
  contactEmail: string;
  contactPhone: string;
  address?: string;
}
