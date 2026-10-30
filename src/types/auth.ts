export type UserRole = 'super_admin' | 'tenant';

export interface TenantAccount {
  id: string; // Login ID / Username (case-insensitive)
  password: string; // Password
  role: UserRole;
  brandId: string; // The locked brand id this account is bound to
  clientName: string; // Display name of the client/business
  monthlyRate?: string; // Optional subscription rate for client management
  notes?: string;
  createdAt: string;
}

export interface AuthSession {
  userId: string;
  role: UserRole;
  brandId: string;
  clientName: string;
  token: string;
  loginTime: string;
}
