import { TenantAccount, AuthSession } from '@/types/auth';

export const DEFAULT_ACCOUNTS: TenantAccount[] = [
  {
    id: 'admin',
    password: 'admin2026',
    role: 'super_admin',
    brandId: 'cake-slice',
    clientName: 'Master Administrator',
    notes: 'সম্পূর্ণ সিস্টেমের অ্যাক্সেস ও সব ব্র্যান্ড ম্যানেজমেন্ট',
    createdAt: '2026-01-01'
  },
  {
    id: 'cakeslice',
    password: 'farjana2026',
    role: 'tenant',
    brandId: 'cake-slice',
    clientName: 'Farjana — Cake Slice',
    monthlyRate: '৳10,000/মাস',
    notes: 'কেক ও মিষ্টান্ন ব্র্যান্ড স্পেস',
    createdAt: '2026-01-15'
  },
  {
    id: 'aurajewelry',
    password: 'aura2026',
    role: 'tenant',
    brandId: 'aura-jewelry',
    clientName: 'Aura Fine Jewelry',
    monthlyRate: '৳15,000/মাস',
    notes: 'খাঁটি স্বর্ণ ও ডায়মন্ড অলঙ্কার',
    createdAt: '2026-02-01'
  },
  {
    id: 'royaloud',
    password: 'oud2026',
    role: 'tenant',
    brandId: 'royal-oud',
    clientName: 'Royal Oud Fragrance',
    monthlyRate: '৳12,000/মাস',
    notes: 'পারফিউম ও সুগন্ধি',
    createdAt: '2026-02-10'
  },
  {
    id: 'heritage',
    password: 'heritage2026',
    role: 'tenant',
    brandId: 'heritage-attire',
    clientName: 'Heritage Luxury Attire',
    monthlyRate: '৳15,000/মাস',
    notes: 'জামদানি ও লাক্সারি ফ্যাশন',
    createdAt: '2026-02-20'
  }
];

const STORAGE_CUSTOM_ACCOUNTS_KEY = 'brandos_custom_tenants';
const STORAGE_SESSION_KEY = 'brandos_auth_session';

export function getAllAccounts(): TenantAccount[] {
  if (typeof window === 'undefined') return DEFAULT_ACCOUNTS;
  try {
    const raw = localStorage.getItem(STORAGE_CUSTOM_ACCOUNTS_KEY);
    if (!raw) return DEFAULT_ACCOUNTS;
    const custom = JSON.parse(raw);
    if (!Array.isArray(custom)) return DEFAULT_ACCOUNTS;
    
    // Merge: custom accounts override defaults by id
    const customIds = new Set(custom.map(c => c.id.toLowerCase()));
    const filteredDefaults = DEFAULT_ACCOUNTS.filter(d => !customIds.has(d.id.toLowerCase()));
    return [...filteredDefaults, ...custom];
  } catch {
    return DEFAULT_ACCOUNTS;
  }
}

export function saveTenantAccount(account: TenantAccount): boolean {
  if (typeof window === 'undefined') return false;
  try {
    const accounts = getAllAccounts();
    const existingIndex = accounts.findIndex(a => a.id.toLowerCase() === account.id.toLowerCase());
    let updated: TenantAccount[];
    if (existingIndex >= 0) {
      updated = accounts.map((a, i) => i === existingIndex ? account : a);
    } else {
      updated = [...accounts, account];
    }
    // Only store custom accounts
    const customOnly = updated.filter(a => a.id.toLowerCase() !== 'admin');
    localStorage.setItem(STORAGE_CUSTOM_ACCOUNTS_KEY, JSON.stringify(customOnly));
    return true;
  } catch {
    return false;
  }
}

export function deleteTenantAccount(accountId: string): boolean {
  if (typeof window === 'undefined') return false;
  if (accountId.toLowerCase() === 'admin') return false; // Prevent deleting master admin
  try {
    const accounts = getAllAccounts();
    const filtered = accounts.filter(a => a.id.toLowerCase() !== accountId.toLowerCase());
    const customOnly = filtered.filter(a => a.id.toLowerCase() !== 'admin');
    localStorage.setItem(STORAGE_CUSTOM_ACCOUNTS_KEY, JSON.stringify(customOnly));
    return true;
  } catch {
    return false;
  }
}

export function verifyCredentials(loginId: string, pass: string): AuthSession | null {
  const accounts = getAllAccounts();
  const normalizedId = loginId.trim().toLowerCase();
  const user = accounts.find(a => a.id.toLowerCase() === normalizedId && a.password === pass.trim());
  if (!user) return null;

  const session: AuthSession = {
    userId: user.id,
    role: user.role,
    brandId: user.brandId,
    clientName: user.clientName,
    token: `tok_${user.id}_${Date.now()}`,
    loginTime: new Date().toISOString()
  };

  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem(STORAGE_SESSION_KEY, JSON.stringify(session));
    } catch {
      // ignore
    }
  }

  return session;
}

export function getCurrentSession(): AuthSession | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(STORAGE_SESSION_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export function logoutSession(): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.removeItem(STORAGE_SESSION_KEY);
  } catch {
    // ignore
  }
}
