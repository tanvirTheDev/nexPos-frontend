export interface UserRecord {
  id: string;
  name: string;
  email: string;
  role: "SuperAdmin" | "OrgAdmin" | "Admin";
  organizationId?: string;
  permissions: string[];
  isActive: boolean;
  lastLogin?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateOrgAdminInput {
  name: string;
  email: string;
  password: string;
  organizationId: string;
}

export interface CreateAdminInput {
  name: string;
  email: string;
  password: string;
  permissions: string[];
}

export interface UpdateUserInput {
  name?: string;
  email?: string;
  isActive?: boolean;
}

export interface AssignPermissionsInput {
  permissions: string[];
}
