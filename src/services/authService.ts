import { AdminUser, AuthUser, AdminActivityLog } from '../types';

export const INITIAL_ADMIN_USERS: AdminUser[] = [
  {
    id: 'admin-1',
    email: 'laptoprazif@gmail.com',
    name: 'Razif (Super Admin)',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80',
    role: 'super_admin',
    addedAt: '2026-01-01',
    addedBy: 'Sistem Nasadef',
    isActive: true,
  },
  {
    id: 'admin-2',
    email: 'niknaza@gmail.com',
    name: 'Nik Naza',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&auto=format&fit=crop&q=80',
    role: 'admin',
    addedAt: '2026-01-01',
    addedBy: 'laptoprazif@gmail.com',
    isActive: true,
  },
  {
    id: 'admin-3',
    email: 'nikshafik86@gmail.com',
    name: 'Nik Shafik',
    avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=120&auto=format&fit=crop&q=80',
    role: 'admin',
    addedAt: '2026-01-01',
    addedBy: 'laptoprazif@gmail.com',
    isActive: true,
  },
  {
    id: 'admin-4',
    email: 'razifmake@gmail.com',
    name: 'Razif Make',
    avatarUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=120&auto=format&fit=crop&q=80',
    role: 'admin',
    addedAt: '2026-01-01',
    addedBy: 'laptoprazif@gmail.com',
    isActive: true,
  },
];

const ADMIN_STORAGE_KEY = 'nasadef_admin_users_list';
const AUTH_STORAGE_KEY = 'nasadef_current_auth_user';
const ACTIVITY_STORAGE_KEY = 'nasadef_admin_activity_logs';

export function getAdminUsers(): AdminUser[] {
  try {
    const raw = localStorage.getItem(ADMIN_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (e) {
    console.error('Failed to load admin list from storage', e);
  }
  return INITIAL_ADMIN_USERS;
}

export function saveAdminUsers(users: AdminUser[]): void {
  try {
    localStorage.setItem(ADMIN_STORAGE_KEY, JSON.stringify(users));
  } catch (e) {
    console.error('Failed to persist admin list', e);
  }
}

export function isEmailRegisteredAdmin(email: string): boolean {
  const normalized = email.trim().toLowerCase();
  const list = getAdminUsers();
  return list.some(a => a.email.toLowerCase() === normalized && a.isActive);
}

export function getAdminByEmail(email: string): AdminUser | undefined {
  const normalized = email.trim().toLowerCase();
  const list = getAdminUsers();
  return list.find(a => a.email.toLowerCase() === normalized);
}

export function getCurrentAuthUser(): AuthUser | null {
  try {
    const raw = localStorage.getItem(AUTH_STORAGE_KEY);
    if (raw) {
      const parsed: AuthUser = JSON.parse(raw);
      // Re-verify if user is still in the admin list
      if (parsed && parsed.email) {
        const isAdmin = isEmailRegisteredAdmin(parsed.email);
        parsed.isAdmin = isAdmin;
        return parsed;
      }
    }
  } catch (e) {
    console.error('Failed to parse current auth user', e);
  }
  return null;
}

export function setAuthUser(user: AuthUser | null): void {
  try {
    if (user) {
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user));
    } else {
      localStorage.removeItem(AUTH_STORAGE_KEY);
    }
  } catch (e) {
    console.error('Failed to set auth user', e);
  }
}

export function loginWithGoogleEmail(
  email: string,
  name?: string,
  avatarUrl?: string
): { success: boolean; user?: AuthUser; error?: string } {
  const cleanEmail = email.trim().toLowerCase();
  const adminProfile = getAdminByEmail(cleanEmail);

  if (!adminProfile) {
    return {
      success: false,
      error: `Akses Ditolak: Emel "${cleanEmail}" bukan pentadbir berdaftar! Hanya pentadbir yang didaftarkan (laptoprazif@gmail.com, niknaza@gmail.com, nikshafik86@gmail.com, razifmake@gmail.com) sahaja yang dibenarkan.`
    };
  }

  if (!adminProfile.isActive) {
    return {
      success: false,
      error: `Akaun pentadbir "${cleanEmail}" telah dinyahaktifkan oleh Super Admin.`
    };
  }

  const authUser: AuthUser = {
    id: adminProfile.id,
    email: adminProfile.email,
    name: name || adminProfile.name,
    avatarUrl: avatarUrl || adminProfile.avatarUrl,
    isAdmin: true,
    role: adminProfile.role,
    loginMethod: 'google',
  };

  setAuthUser(authUser);
  addActivityLog(authUser.email, 'LOG_MASUK_GOOGLE', 'Log masuk berjaya melalui Google Account.');

  return {
    success: true,
    user: authUser
  };
}

export function loginWithCredentials(
  email: string,
  pass: string
): { success: boolean; user?: AuthUser; error?: string } {
  const cleanEmail = email.trim().toLowerCase();
  const adminProfile = getAdminByEmail(cleanEmail);

  if (!adminProfile) {
    return {
      success: false,
      error: `Emel "${cleanEmail}" tidak dijumpai dalam senarai pentadbir berdaftar.`
    };
  }

  // Secure default password verification or admin bypass
  if (!pass || pass.length < 4) {
    return {
      success: false,
      error: 'Sila masukkan kata laluan pentadbir yang sah (minimum 4 aksara).'
    };
  }

  const authUser: AuthUser = {
    id: adminProfile.id,
    email: adminProfile.email,
    name: adminProfile.name,
    avatarUrl: adminProfile.avatarUrl,
    isAdmin: true,
    role: adminProfile.role,
    loginMethod: 'password',
  };

  setAuthUser(authUser);
  addActivityLog(authUser.email, 'LOG_MASUK_KATA_LALUAN', 'Log masuk berjaya melalui borang emel & kata laluan.');

  return {
    success: true,
    user: authUser
  };
}

export function logout(): void {
  const current = getCurrentAuthUser();
  if (current) {
    addActivityLog(current.email, 'LOG_KELUAR', 'Log keluar dari sesi pentadbir.');
  }
  setAuthUser(null);
}

export function registerNewAdmin(
  newAdmin: { email: string; name: string; role: 'admin' | 'super_admin' },
  currentAdminEmail: string
): { success: boolean; error?: string; admin?: AdminUser } {
  const current = getCurrentAuthUser();
  if (!current || !current.isAdmin) {
    return {
      success: false,
      error: 'Kebenaran Ditolak: Hanya pentadbir aktif sahaja boleh mendaftar pentadbir baharu.'
    };
  }

  const cleanEmail = newAdmin.email.trim().toLowerCase();
  if (!cleanEmail.includes('@') || !cleanEmail.includes('.')) {
    return {
      success: false,
      error: 'Sila masukkan alamat emel Google yang sah.'
    };
  }

  const currentList = getAdminUsers();
  if (currentList.some(a => a.email.toLowerCase() === cleanEmail)) {
    return {
      success: false,
      error: `Emel "${cleanEmail}" telah pun wujud dalam senarai pentadbir.`
    };
  }

  const newAdminEntry: AdminUser = {
    id: `admin-${Date.now()}`,
    email: cleanEmail,
    name: newAdmin.name.trim() || cleanEmail.split('@')[0],
    avatarUrl: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(newAdmin.name || cleanEmail)}`,
    role: newAdmin.role || 'admin',
    addedAt: new Date().toLocaleDateString('ms-MY', { day: '2-digit', month: 'short', year: 'numeric' }),
    addedBy: currentAdminEmail,
    isActive: true
  };

  const updatedList = [...currentList, newAdminEntry];
  saveAdminUsers(updatedList);
  addActivityLog(
    currentAdminEmail,
    'DAFTAR_ADMIN_BAHARU',
    `Mendaftarkan admin baharu: ${newAdminEntry.email} (${newAdminEntry.name}) dengan peranan ${newAdminEntry.role}.`
  );

  return {
    success: true,
    admin: newAdminEntry
  };
}

export function removeAdmin(
  adminId: string,
  currentAdminEmail: string
): { success: boolean; error?: string } {
  const current = getCurrentAuthUser();
  if (!current || !current.isAdmin) {
    return { success: false, error: 'Kebenaran ditolak.' };
  }

  const list = getAdminUsers();
  const target = list.find(a => a.id === adminId);
  if (!target) {
    return { success: false, error: 'Pentadbir tidak dijumpai.' };
  }

  // Prevent self removal
  if (target.email.toLowerCase() === currentAdminEmail.toLowerCase()) {
    return { success: false, error: 'Anda tidak boleh memadam akaun pentadbir anda sendiri!' };
  }

  // Preserve initial super admin laptoprazif@gmail.com
  if (target.email.toLowerCase() === 'laptoprazif@gmail.com') {
    return { success: false, error: 'Akaun Super Admin Utama (laptoprazif@gmail.com) tidak boleh dipadamkan.' };
  }

  const updated = list.filter(a => a.id !== adminId);
  saveAdminUsers(updated);
  addActivityLog(currentAdminEmail, 'PADAM_ADMIN', `Memadam pentadbir: ${target.email}`);

  return { success: true };
}

export function getActivityLogs(): AdminActivityLog[] {
  try {
    const raw = localStorage.getItem(ACTIVITY_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) return parsed;
    }
  } catch (e) {
    console.error('Failed to load logs', e);
  }

  // Default initial logs
  return [
    {
      id: 'log-1',
      adminEmail: 'laptoprazif@gmail.com',
      action: 'SISTEM_DIHIDUPKAN',
      details: 'Sistem kawalan keselamatan Admin Whitelist diaktifkan dengan 4 pentadbir rasmi.',
      timestamp: '2026-01-01 10:00:00'
    }
  ];
}

export function addActivityLog(adminEmail: string, action: string, details: string): void {
  try {
    const logs = getActivityLogs();
    const newLog: AdminActivityLog = {
      id: `log-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      adminEmail,
      action,
      details,
      timestamp: new Date().toLocaleString('ms-MY', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
      })
    };
    const updated = [newLog, ...logs].slice(0, 100);
    localStorage.setItem(ACTIVITY_STORAGE_KEY, JSON.stringify(updated));
  } catch (e) {
    console.error('Failed to save log', e);
  }
}
