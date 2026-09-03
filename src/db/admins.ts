import { db, isPostgresConnected } from './index';
import { admins, adminInvitations, adminAuditLogs, dynamicSchemes } from './schema';
import { eq, desc, and, or } from 'drizzle-orm';
import type {
  AdminUser,
  AdminInvitation,
  AdminAuditLog,
  DynamicScheme,
  AdminRole,
  GeographicScopeLevel,
  AdminPermission,
  SchemeStatus,
} from '../types';

// =======================================================
// IN-MEMORY FALLBACK STORE (Resilient Dual-Mode Storage)
// =======================================================

// Pre-seeded Central Admin
const MEMORY_ADMINS: Map<string, AdminUser & { passwordHash?: string }> = new Map([
  [
    'admin_super_dynamiccode_001',
    {
      id: 'admin_super_dynamiccode_001',
      email: 'dynamiccode@gmail.com',
      name: 'Super Administrator',
      phone: '+91 98765 43210',
      role: 'CENTRAL_ADMIN',
      scopeLevel: 'INDIA',
      permissions: [
        'READ_SCHEME',
        'CREATE_SCHEME',
        'UPDATE_SCHEME',
        'DELETE_SCHEME',
        'PUBLISH_SCHEME',
        'APPROVE_SCHEME',
        'REJECT_SCHEME',
        'ARCHIVE_SCHEME',
        'MANAGE_STATE_ADMINS',
        'MANAGE_LOCAL_ADMINS',
        'VIEW_ANALYTICS',
        'MANAGE_HELP_CENTRES',
        'VIEW_APPLICATIONS',
        'MANAGE_APPLICATIONS',
        'VIEW_AUDIT_LOGS',
      ],
      status: 'ACTIVE',
      createdAt: '2026-01-01T00:00:00.000Z',
      updatedAt: '2026-01-01T00:00:00.000Z',
    },
  ],
  [
    'admin_central_001',
    {
      id: 'admin_central_001',
      email: 'central.admin@janai.gov.in',
      name: 'Dr. Rajiv Sharma',
      phone: '+91 98100 12345',
      role: 'CENTRAL_ADMIN',
      scopeLevel: 'INDIA',
      permissions: [
        'READ_SCHEME',
        'CREATE_SCHEME',
        'UPDATE_SCHEME',
        'DELETE_SCHEME',
        'PUBLISH_SCHEME',
        'APPROVE_SCHEME',
        'REJECT_SCHEME',
        'ARCHIVE_SCHEME',
        'MANAGE_STATE_ADMINS',
        'MANAGE_LOCAL_ADMINS',
        'VIEW_ANALYTICS',
        'MANAGE_HELP_CENTRES',
        'VIEW_APPLICATIONS',
        'MANAGE_APPLICATIONS',
        'VIEW_AUDIT_LOGS',
      ],
      status: 'ACTIVE',
      createdAt: '2026-01-01T00:00:00.000Z',
      updatedAt: '2026-01-01T00:00:00.000Z',
    },
  ],
  [
    'admin_state_ka_001',
    {
      id: 'admin_state_ka_001',
      email: 'karnataka.admin@janai.gov.in',
      name: 'Smt. Priya Rao',
      phone: '+91 98450 54321',
      role: 'STATE_ADMIN',
      scopeLevel: 'STATE',
      state: 'Karnataka',
      permissions: [
        'READ_SCHEME',
        'CREATE_SCHEME',
        'UPDATE_SCHEME',
        'PUBLISH_SCHEME',
        'APPROVE_SCHEME',
        'REJECT_SCHEME',
        'MANAGE_LOCAL_ADMINS',
        'VIEW_ANALYTICS',
        'VIEW_APPLICATIONS',
        'MANAGE_APPLICATIONS',
        'VIEW_AUDIT_LOGS',
      ],
      status: 'ACTIVE',
      invitedBy: 'admin_central_001',
      invitedByRole: 'CENTRAL_ADMIN',
      createdAt: '2026-01-15T00:00:00.000Z',
      updatedAt: '2026-01-15T00:00:00.000Z',
    },
  ],
  [
    'admin_local_mys_001',
    {
      id: 'admin_local_mys_001',
      email: 'mysuru.local@janai.gov.in',
      name: 'Shri. Ramesh Hegde',
      phone: '+91 99001 98765',
      role: 'LOCAL_ADMIN',
      scopeLevel: 'DISTRICT',
      state: 'Karnataka',
      district: 'Mysuru',
      taluk: 'Nanjangud',
      permissions: [
        'READ_SCHEME',
        'MANAGE_HELP_CENTRES',
        'VIEW_APPLICATIONS',
        'MANAGE_APPLICATIONS',
        'VIEW_AUDIT_LOGS',
      ],
      status: 'ACTIVE',
      invitedBy: 'admin_state_ka_001',
      invitedByRole: 'STATE_ADMIN',
      createdAt: '2026-02-01T00:00:00.000Z',
      updatedAt: '2026-02-01T00:00:00.000Z',
    },
  ],
]);

const MEMORY_INVITATIONS: Map<string, AdminInvitation> = new Map();
const MEMORY_AUDIT_LOGS: AdminAuditLog[] = [
  {
    id: 'log_boot_001',
    adminId: 'admin_central_001',
    adminEmail: 'central.admin@janai.gov.in',
    adminName: 'Dr. Rajiv Sharma',
    adminRole: 'CENTRAL_ADMIN',
    action: 'BOOTSTRAP_SYSTEM',
    resourceType: 'SYSTEM',
    resourceId: 'SYS_INITIALIZE',
    geographicScope: {},
    details: { message: 'Central Admin root authority provisioned.' },
    timestamp: '2026-01-01T00:00:00.000Z',
  },
  {
    id: 'log_boot_002',
    adminId: 'admin_central_001',
    adminEmail: 'central.admin@janai.gov.in',
    adminName: 'Dr. Rajiv Sharma',
    adminRole: 'CENTRAL_ADMIN',
    action: 'CREATE_STATE_ADMIN',
    resourceType: 'ADMIN',
    resourceId: 'admin_state_ka_001',
    geographicScope: { state: 'Karnataka' },
    details: { state: 'Karnataka', officer: 'Smt. Priya Rao' },
    timestamp: '2026-01-15T00:00:00.000Z',
  },
];
const MEMORY_DYNAMIC_SCHEMES: Map<string, DynamicScheme> = new Map();

// =======================================================
// ADMIN CRUD & REPOSITORY OPERATIONS
// =======================================================

export function enrichAdminUser(user: AdminUser): AdminUser {
  if (user.email === 'central.admin@janai.gov.in' || user.id === 'admin_central_001') {
    return {
      ...user,
      officialUid: 'CENTRAL-GOV-001',
      tierTitle: 'Tier 1: Central Government (National Authority)',
    };
  }
  if (user.email === 'karnataka.admin@janai.gov.in' || user.id === 'admin_state_ka_001') {
    return {
      ...user,
      officialUid: 'STATE-KA-001',
      tierTitle: 'Tier 2: State Government (State Authority - Karnataka)',
    };
  }
  if (user.email === 'mysuru.local@janai.gov.in' || user.id === 'admin_local_mys_001') {
    return {
      ...user,
      officialUid: 'LOCAL-MYS-001',
      tierTitle: 'Tier 3: Local Government (District Authority - Mysuru)',
    };
  }
  if (user.email === 'dynamiccode@gmail.com' || user.id === 'admin_super_dynamiccode_001') {
    return {
      ...user,
      officialUid: 'CENTRAL-GOV-ROOT',
      tierTitle: 'Tier 1: Central Super Admin (Root National)',
    };
  }
  // Generic fallback based on role
  if (user.role === 'CENTRAL_ADMIN') {
    return {
      ...user,
      officialUid: user.officialUid || `CENTRAL-${user.id.slice(-4).toUpperCase()}`,
      tierTitle: 'Tier 1: Central Government (National Authority)',
    };
  } else if (user.role === 'STATE_ADMIN') {
    return {
      ...user,
      officialUid: user.officialUid || `STATE-${user.state?.slice(0, 2).toUpperCase() || 'ST'}-${user.id.slice(-3).toUpperCase()}`,
      tierTitle: `Tier 2: State Government (${user.state || 'State'} Authority)`,
    };
  } else {
    return {
      ...user,
      officialUid: user.officialUid || `LOCAL-${user.district?.slice(0, 3).toUpperCase() || 'LOC'}-${user.id.slice(-3).toUpperCase()}`,
      tierTitle: `Tier 3: Local Government (${user.district || 'Local'} Authority)`,
    };
  }
}

export async function findAdminByEmail(emailOrUid: string): Promise<AdminUser | null> {
  const raw = emailOrUid.trim();
  const normalized = raw.toLowerCase();

  // Tier UID and email aliases
  let lookupEmail = normalized;
  if (normalized === 'central-gov-001' || normalized === 'admin_central_001' || normalized === 'central') {
    lookupEmail = 'central.admin@janai.gov.in';
  } else if (normalized === 'state-ka-001' || normalized === 'admin_state_ka_001' || normalized === 'state') {
    lookupEmail = 'karnataka.admin@janai.gov.in';
  } else if (normalized === 'local-mys-001' || normalized === 'admin_local_mys_001' || normalized === 'local') {
    lookupEmail = 'mysuru.local@janai.gov.in';
  } else if (normalized === 'central-gov-root' || normalized === 'admin_super_dynamiccode_001' || normalized === 'super') {
    lookupEmail = 'dynamiccode@gmail.com';
  }

  if (isPostgresConnected && db) {
    try {
      const records = await db.select().from(admins)
        .where(
          or(
            eq(admins.email, lookupEmail),
            eq(admins.adminUid, raw),
            eq(admins.adminUid, normalized),
            eq(admins.email, normalized)
          )
        ).limit(1);
      if (records.length > 0) {
        const row = records[0];
        const user: AdminUser = {
          id: row.adminUid,
          email: row.email,
          name: row.name,
          phone: row.phone || undefined,
          role: row.role as AdminRole,
          scopeLevel: row.scopeLevel as GeographicScopeLevel,
          state: row.state || undefined,
          district: row.district || undefined,
          taluk: row.taluk || undefined,
          localArea: row.localArea || undefined,
          permissions: (row.permissions as AdminPermission[]) || [],
          status: row.status as any,
          invitedBy: row.invitedBy || undefined,
          invitedByRole: (row.invitedByRole as AdminRole) || undefined,
          lastLoginAt: row.lastLoginAt?.toISOString(),
          createdAt: row.createdAt?.toISOString() || new Date().toISOString(),
          updatedAt: row.updatedAt?.toISOString() || new Date().toISOString(),
        };
        const enriched = enrichAdminUser(user);
        MEMORY_ADMINS.set(enriched.id, enriched);
        return enriched;
      }
    } catch (e) {
      console.warn('[AdminDB] Error finding admin by email/uid in Postgres:', e);
    }
  }

  for (const admin of MEMORY_ADMINS.values()) {
    if (
      admin.email.toLowerCase() === lookupEmail ||
      admin.email.toLowerCase() === normalized ||
      admin.id.toLowerCase() === normalized ||
      admin.officialUid?.toLowerCase() === normalized
    ) {
      return enrichAdminUser({ ...admin });
    }
  }

  return null;
}

export async function findAdminById(id: string): Promise<AdminUser | null> {
  if (isPostgresConnected && db) {
    try {
      const records = await db.select().from(admins).where(eq(admins.adminUid, id)).limit(1);
      if (records.length > 0) {
        const row = records[0];
        const user: AdminUser = {
          id: row.adminUid,
          email: row.email,
          name: row.name,
          phone: row.phone || undefined,
          role: row.role as AdminRole,
          scopeLevel: row.scopeLevel as GeographicScopeLevel,
          state: row.state || undefined,
          district: row.district || undefined,
          taluk: row.taluk || undefined,
          localArea: row.localArea || undefined,
          permissions: (row.permissions as AdminPermission[]) || [],
          status: row.status as any,
          invitedBy: row.invitedBy || undefined,
          invitedByRole: (row.invitedByRole as AdminRole) || undefined,
          lastLoginAt: row.lastLoginAt?.toISOString(),
          createdAt: row.createdAt?.toISOString() || new Date().toISOString(),
          updatedAt: row.updatedAt?.toISOString() || new Date().toISOString(),
        };
        const enriched = enrichAdminUser(user);
        MEMORY_ADMINS.set(enriched.id, enriched);
        return enriched;
      }
    } catch (e) {
      console.warn('[AdminDB] Error finding admin by id in Postgres:', e);
    }
  }

  const inMem = MEMORY_ADMINS.get(id);
  return inMem ? enrichAdminUser({ ...inMem }) : null;
}

export async function saveAdmin(admin: AdminUser, passwordHash?: string): Promise<AdminUser> {
  const normalizedEmail = admin.email.toLowerCase().trim();
  MEMORY_ADMINS.set(admin.id, { ...admin, email: normalizedEmail, passwordHash });

  if (isPostgresConnected && db) {
    try {
      // Find if admin already exists by adminUid OR by email to avoid unique constraint collisions
      const existing = await db
        .select()
        .from(admins)
        .where(or(eq(admins.adminUid, admin.id), eq(admins.email, normalizedEmail)))
        .limit(1);

      if (existing.length > 0) {
        await db
          .update(admins)
          .set({
            adminUid: admin.id,
            email: normalizedEmail,
            name: admin.name,
            phone: admin.phone || null,
            role: admin.role,
            scopeLevel: admin.scopeLevel,
            state: admin.state || null,
            district: admin.district || null,
            taluk: admin.taluk || null,
            localArea: admin.localArea || null,
            permissions: admin.permissions,
            status: admin.status,
            ...(passwordHash ? { passwordHash } : {}),
            ...(admin.invitedBy ? { invitedBy: admin.invitedBy } : {}),
            ...(admin.invitedByRole ? { invitedByRole: admin.invitedByRole } : {}),
            ...(admin.lastLoginAt ? { lastLoginAt: new Date(admin.lastLoginAt) } : {}),
            updatedAt: new Date(),
          })
          .where(eq(admins.id, existing[0].id));
      } else {
        await db.insert(admins).values({
          adminUid: admin.id,
          email: normalizedEmail,
          name: admin.name,
          phone: admin.phone || null,
          role: admin.role,
          scopeLevel: admin.scopeLevel,
          state: admin.state || null,
          district: admin.district || null,
          taluk: admin.taluk || null,
          localArea: admin.localArea || null,
          permissions: admin.permissions,
          status: admin.status,
          passwordHash: passwordHash || null,
          invitedBy: admin.invitedBy || null,
          invitedByRole: admin.invitedByRole || null,
          lastLoginAt: admin.lastLoginAt ? new Date(admin.lastLoginAt) : null,
        });
      }
    } catch (e) {
      console.warn('[AdminDB] Error saving admin in Postgres:', e);
    }
  }

  return admin;
}

export async function listAdmins(caller: AdminUser): Promise<AdminUser[]> {
  let dbAdmins: AdminUser[] = [];
  if (isPostgresConnected && db) {
    try {
      const records = await db.select().from(admins);
      if (records.length > 0) {
        dbAdmins = records.map((row) => ({
          id: row.adminUid,
          email: row.email,
          name: row.name,
          phone: row.phone || undefined,
          role: row.role as AdminRole,
          scopeLevel: row.scopeLevel as GeographicScopeLevel,
          state: row.state || undefined,
          district: row.district || undefined,
          taluk: row.taluk || undefined,
          localArea: row.localArea || undefined,
          permissions: (row.permissions as AdminPermission[]) || [],
          status: row.status as any,
          invitedBy: row.invitedBy || undefined,
          invitedByRole: (row.invitedByRole as AdminRole) || undefined,
          lastLoginAt: row.lastLoginAt?.toISOString(),
          createdAt: row.createdAt?.toISOString() || new Date().toISOString(),
          updatedAt: row.updatedAt?.toISOString() || new Date().toISOString(),
        }));
        for (const a of dbAdmins) {
          MEMORY_ADMINS.set(a.id, a);
        }
      }
    } catch (e) {
      console.warn('[AdminDB] Error listing admins from Postgres:', e);
    }
  }

  const source = dbAdmins.length > 0 ? dbAdmins : Array.from(MEMORY_ADMINS.values());

  // Central Admin sees all
  if (caller.role === 'CENTRAL_ADMIN') {
    return source;
  }

  // State Admin sees admins within their state
  if (caller.role === 'STATE_ADMIN') {
    return source.filter((a) => a.state === caller.state);
  }

  // Local Admin sees admins in their district
  if (caller.role === 'LOCAL_ADMIN') {
    return source.filter((a) => a.state === caller.state && a.district === caller.district);
  }

  return [];
}

// =======================================================
// INVITATION MANAGEMENT
// =======================================================

export async function createAdminInvitation(invitation: AdminInvitation): Promise<AdminInvitation> {
  MEMORY_INVITATIONS.set(invitation.invitationToken, invitation);

  if (isPostgresConnected && db) {
    try {
      const existing = await db
        .select()
        .from(adminInvitations)
        .where(eq(adminInvitations.invitationToken, invitation.invitationToken))
        .limit(1);

      if (existing.length > 0) {
        await db
          .update(adminInvitations)
          .set({
            email: invitation.email.toLowerCase(),
            name: invitation.name,
            phone: invitation.phone || null,
            role: invitation.role,
            scopeLevel: invitation.scopeLevel,
            state: invitation.state || null,
            district: invitation.district || null,
            taluk: invitation.taluk || null,
            localArea: invitation.localArea || null,
            permissions: invitation.permissions,
            invitedBy: invitation.invitedBy,
            invitedByRole: invitation.invitedByRole,
            invitedByName: invitation.invitedByName,
            status: invitation.status,
            expiresAt: new Date(invitation.expiresAt),
          })
          .where(eq(adminInvitations.id, existing[0].id));
      } else {
        await db.insert(adminInvitations).values({
          email: invitation.email.toLowerCase(),
          name: invitation.name,
          phone: invitation.phone || null,
          role: invitation.role,
          scopeLevel: invitation.scopeLevel,
          state: invitation.state || null,
          district: invitation.district || null,
          taluk: invitation.taluk || null,
          localArea: invitation.localArea || null,
          permissions: invitation.permissions,
          invitationToken: invitation.invitationToken,
          invitedBy: invitation.invitedBy,
          invitedByRole: invitation.invitedByRole,
          invitedByName: invitation.invitedByName,
          status: invitation.status,
          expiresAt: new Date(invitation.expiresAt),
        });
      }
    } catch (e) {
      console.warn('[AdminDB] Error saving invitation in Postgres:', e);
    }
  }

  return invitation;
}

export async function findInvitationByToken(token: string): Promise<AdminInvitation | null> {
  if (isPostgresConnected && db) {
    try {
      const records = await db
        .select()
        .from(adminInvitations)
        .where(eq(adminInvitations.invitationToken, token))
        .limit(1);
      if (records.length > 0) {
        const row = records[0];
        const inv: AdminInvitation = {
          id: String(row.id),
          email: row.email,
          name: row.name,
          phone: row.phone || undefined,
          role: row.role as AdminRole,
          scopeLevel: row.scopeLevel as GeographicScopeLevel,
          state: row.state || undefined,
          district: row.district || undefined,
          taluk: row.taluk || undefined,
          localArea: row.localArea || undefined,
          permissions: (row.permissions as AdminPermission[]) || [],
          invitationToken: row.invitationToken,
          invitedBy: row.invitedBy,
          invitedByRole: row.invitedByRole as AdminRole,
          invitedByName: row.invitedByName,
          status: row.status as any,
          expiresAt: row.expiresAt.toISOString(),
          createdAt: row.createdAt?.toISOString() || new Date().toISOString(),
        };
        MEMORY_INVITATIONS.set(inv.invitationToken, inv);
        return inv;
      }
    } catch (e) {
      console.warn('[AdminDB] Error finding invitation in Postgres:', e);
    }
  }

  if (MEMORY_INVITATIONS.has(token)) {
    const inv = MEMORY_INVITATIONS.get(token)!;
    if (new Date(inv.expiresAt) < new Date() && inv.status === 'PENDING') {
      inv.status = 'EXPIRED';
    }
    return { ...inv };
  }

  return null;
}

export async function updateInvitationStatus(token: string, status: 'ACCEPTED' | 'REVOKED' | 'EXPIRED') {
  if (MEMORY_INVITATIONS.has(token)) {
    const inv = MEMORY_INVITATIONS.get(token)!;
    inv.status = status;
  }

  if (isPostgresConnected && db) {
    try {
      await db
        .update(adminInvitations)
        .set({ status })
        .where(eq(adminInvitations.invitationToken, token));
    } catch (e) {
      console.warn('[AdminDB] Error updating invitation in Postgres:', e);
    }
  }
}

export async function listInvitations(caller: AdminUser): Promise<AdminInvitation[]> {
  let dbInvitations: AdminInvitation[] = [];
  if (isPostgresConnected && db) {
    try {
      const records = await db.select().from(adminInvitations);
      if (records.length > 0) {
        dbInvitations = records.map((row) => ({
          id: String(row.id),
          email: row.email,
          name: row.name,
          phone: row.phone || undefined,
          role: row.role as AdminRole,
          scopeLevel: row.scopeLevel as GeographicScopeLevel,
          state: row.state || undefined,
          district: row.district || undefined,
          taluk: row.taluk || undefined,
          localArea: row.localArea || undefined,
          permissions: (row.permissions as AdminPermission[]) || [],
          invitationToken: row.invitationToken,
          invitedBy: row.invitedBy,
          invitedByRole: row.invitedByRole as AdminRole,
          invitedByName: row.invitedByName,
          status: row.status as any,
          expiresAt: row.expiresAt.toISOString(),
          createdAt: row.createdAt?.toISOString() || new Date().toISOString(),
        }));
        for (const inv of dbInvitations) {
          MEMORY_INVITATIONS.set(inv.invitationToken, inv);
        }
      }
    } catch (e) {
      console.warn('[AdminDB] Error listing invitations from Postgres:', e);
    }
  }

  const all = dbInvitations.length > 0 ? dbInvitations : Array.from(MEMORY_INVITATIONS.values());

  if (caller.role === 'CENTRAL_ADMIN') {
    return all;
  }
  if (caller.role === 'STATE_ADMIN') {
    return all.filter((inv) => inv.state === caller.state);
  }
  return [];
}

// =======================================================
// AUDIT LOGS
// =======================================================

export async function recordAuditLog(log: Omit<AdminAuditLog, 'id' | 'timestamp'>): Promise<AdminAuditLog> {
  const fullLog: AdminAuditLog = {
    ...log,
    id: `log_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    timestamp: new Date().toISOString(),
  };

  MEMORY_AUDIT_LOGS.unshift(fullLog);
  if (MEMORY_AUDIT_LOGS.length > 500) {
    MEMORY_AUDIT_LOGS.pop();
  }

  if (isPostgresConnected && db) {
    try {
      await db.insert(adminAuditLogs).values({
        adminId: log.adminId,
        adminEmail: log.adminEmail,
        adminName: log.adminName,
        adminRole: log.adminRole,
        action: log.action,
        resourceType: log.resourceType,
        resourceId: log.resourceId,
        state: log.geographicScope.state || null,
        district: log.geographicScope.district || null,
        taluk: log.geographicScope.taluk || null,
        details: log.details,
        ipAddress: log.ipAddress || null,
      });
    } catch (e) {
      console.warn('[AdminDB] Error recording audit log in Postgres:', e);
    }
  }

  return fullLog;
}

export async function getAuditLogs(caller: AdminUser, limit: number = 50): Promise<AdminAuditLog[]> {
  if (isPostgresConnected && db) {
    try {
      const records = await db
        .select()
        .from(adminAuditLogs)
        .orderBy(desc(adminAuditLogs.timestamp))
        .limit(limit);

      if (records.length > 0) {
        let mapped: AdminAuditLog[] = records.map((r) => ({
          id: String(r.id),
          adminId: r.adminId,
          adminEmail: r.adminEmail,
          adminName: r.adminName,
          adminRole: r.adminRole as AdminRole,
          action: r.action,
          resourceType: r.resourceType as any,
          resourceId: r.resourceId,
          geographicScope: {
            state: r.state || undefined,
            district: r.district || undefined,
            taluk: r.taluk || undefined,
          },
          details: (r.details as any) || {},
          ipAddress: r.ipAddress || undefined,
          timestamp: r.timestamp?.toISOString() || new Date().toISOString(),
        }));

        if (caller.role === 'STATE_ADMIN') {
          mapped = mapped.filter(
            (log) =>
              log.geographicScope.state === caller.state ||
              log.adminId === caller.id ||
              (log.details && log.details.state === caller.state)
          );
        } else if (caller.role === 'LOCAL_ADMIN') {
          mapped = mapped.filter(
            (log) =>
              log.geographicScope.district === caller.district ||
              log.adminId === caller.id
          );
        }
        return mapped.slice(0, limit);
      }
    } catch (e) {
      console.warn('[AdminDB] Error retrieving audit logs from Postgres:', e);
    }
  }

  let filtered = MEMORY_AUDIT_LOGS;

  if (caller.role === 'STATE_ADMIN') {
    filtered = filtered.filter(
      (log) =>
        log.geographicScope.state === caller.state ||
        log.adminId === caller.id ||
        (log.details && log.details.state === caller.state)
    );
  } else if (caller.role === 'LOCAL_ADMIN') {
    filtered = filtered.filter(
      (log) =>
        log.geographicScope.district === caller.district ||
        log.adminId === caller.id
    );
  }

  return filtered.slice(0, limit);
}

// =======================================================
// DYNAMIC SCHEMES REPOSITORY
// =======================================================

export async function saveDynamicScheme(scheme: DynamicScheme): Promise<DynamicScheme> {
  scheme.updatedAt = new Date().toISOString();
  MEMORY_DYNAMIC_SCHEMES.set(scheme.id, scheme);

  if (isPostgresConnected && db) {
    try {
      const existing = await db
        .select()
        .from(dynamicSchemes)
        .where(eq(dynamicSchemes.schemeId, scheme.id))
        .limit(1);

      if (existing.length > 0) {
        await db
          .update(dynamicSchemes)
          .set({
            title: scheme.title,
            code: scheme.code || null,
            description: scheme.description,
            level: scheme.level,
            ministry: scheme.ministry,
            department: scheme.department || null,
            state: scheme.state || null,
            district: scheme.district || null,
            taluk: scheme.taluk || null,
            category: scheme.category,
            subCategory: scheme.subCategory || null,
            benefitValue: scheme.benefitValue,
            benefitDescription: scheme.benefitDescription,
            eligibilityDescription: scheme.eligibilityDescription,
            applicationProcess: scheme.applicationProcess,
            requiredDocs: scheme.requiredDocs,
            rules: scheme.rules,
            officialUrl: scheme.officialUrl,
            status: scheme.status,
            sourceDocumentName: scheme.sourceDocumentName || null,
            sourceDocumentUrl: scheme.sourceDocumentUrl || null,
            ocrExtractedText: scheme.ocrExtractedText || null,
            aiStructuredJson: scheme.aiStructuredJson || null,
            rejectionReason: scheme.rejectionReason || null,
            verificationNotes: scheme.verificationNotes || null,
            approvedBy: scheme.approvedBy || null,
            approvedByName: scheme.approvedByName || null,
            approvedAt: scheme.approvedAt ? new Date(scheme.approvedAt) : null,
            publishedAt: scheme.publishedAt ? new Date(scheme.publishedAt) : null,
            lastVerifiedAt: scheme.lastVerifiedAt ? new Date(scheme.lastVerifiedAt) : null,
            updatedAt: new Date(),
          })
          .where(eq(dynamicSchemes.id, existing[0].id));
      } else {
        await db.insert(dynamicSchemes).values({
          schemeId: scheme.id,
          title: scheme.title,
          code: scheme.code || null,
          description: scheme.description,
          level: scheme.level,
          ministry: scheme.ministry,
          department: scheme.department || null,
          state: scheme.state || null,
          district: scheme.district || null,
          taluk: scheme.taluk || null,
          category: scheme.category,
          subCategory: scheme.subCategory || null,
          benefitValue: scheme.benefitValue,
          benefitDescription: scheme.benefitDescription,
          eligibilityDescription: scheme.eligibilityDescription,
          applicationProcess: scheme.applicationProcess,
          requiredDocs: scheme.requiredDocs,
          rules: scheme.rules,
          officialUrl: scheme.officialUrl,
          status: scheme.status,
          sourceDocumentName: scheme.sourceDocumentName || null,
          sourceDocumentUrl: scheme.sourceDocumentUrl || null,
          ocrExtractedText: scheme.ocrExtractedText || null,
          aiStructuredJson: scheme.aiStructuredJson || null,
          rejectionReason: scheme.rejectionReason || null,
          verificationNotes: scheme.verificationNotes || null,
          createdBy: scheme.createdBy,
          createdByRole: scheme.createdByRole,
          createdByName: scheme.createdByName,
          approvedBy: scheme.approvedBy || null,
          approvedByName: scheme.approvedByName || null,
          approvedAt: scheme.approvedAt ? new Date(scheme.approvedAt) : null,
          publishedAt: scheme.publishedAt ? new Date(scheme.publishedAt) : null,
          lastVerifiedAt: scheme.lastVerifiedAt ? new Date(scheme.lastVerifiedAt) : null,
        });
      }
    } catch (e) {
      console.warn('[AdminDB] Error saving dynamic scheme in Postgres:', e);
    }
  }

  return scheme;
}

export async function findDynamicSchemeById(id: string): Promise<DynamicScheme | null> {
  if (isPostgresConnected && db) {
    try {
      const records = await db
        .select()
        .from(dynamicSchemes)
        .where(eq(dynamicSchemes.schemeId, id))
        .limit(1);
      if (records.length > 0) {
        const row = records[0];
        const scheme: DynamicScheme = {
          id: row.schemeId,
          title: row.title,
          code: row.code || undefined,
          description: row.description,
          level: row.level as any,
          ministry: row.ministry,
          department: row.department || undefined,
          state: row.state || undefined,
          district: row.district || undefined,
          taluk: row.taluk || undefined,
          category: row.category,
          subCategory: row.subCategory || undefined,
          benefitValue: row.benefitValue,
          benefitDescription: row.benefitDescription,
          eligibilityDescription: row.eligibilityDescription,
          applicationProcess: row.applicationProcess,
          requiredDocs: (row.requiredDocs as string[]) || [],
          rules: (row.rules as any) || {},
          officialUrl: row.officialUrl,
          status: row.status as SchemeStatus,
          sourceDocumentName: row.sourceDocumentName || undefined,
          sourceDocumentUrl: row.sourceDocumentUrl || undefined,
          ocrExtractedText: row.ocrExtractedText || undefined,
          aiStructuredJson: row.aiStructuredJson as any,
          rejectionReason: row.rejectionReason || undefined,
          verificationNotes: row.verificationNotes || undefined,
          createdBy: row.createdBy,
          createdByRole: row.createdByRole as AdminRole,
          createdByName: row.createdByName,
          approvedBy: row.approvedBy || undefined,
          approvedByName: row.approvedByName || undefined,
          approvedAt: row.approvedAt?.toISOString(),
          publishedAt: row.publishedAt?.toISOString(),
          lastVerifiedAt: row.lastVerifiedAt?.toISOString(),
          createdAt: row.createdAt?.toISOString() || new Date().toISOString(),
          updatedAt: row.updatedAt?.toISOString() || new Date().toISOString(),
        };
        MEMORY_DYNAMIC_SCHEMES.set(scheme.id, scheme);
        return scheme;
      }
    } catch (e) {
      console.warn('[AdminDB] Error finding dynamic scheme in Postgres:', e);
    }
  }

  if (MEMORY_DYNAMIC_SCHEMES.has(id)) {
    return { ...MEMORY_DYNAMIC_SCHEMES.get(id)! };
  }

  return null;
}

export async function listDynamicSchemesForAdmin(caller: AdminUser): Promise<DynamicScheme[]> {
  let dbSchemes: DynamicScheme[] = [];
  if (isPostgresConnected && db) {
    try {
      const records = await db.select().from(dynamicSchemes);
      if (records.length > 0) {
        dbSchemes = records.map((row) => ({
          id: row.schemeId,
          title: row.title,
          code: row.code || undefined,
          description: row.description,
          level: row.level as any,
          ministry: row.ministry,
          department: row.department || undefined,
          state: row.state || undefined,
          district: row.district || undefined,
          taluk: row.taluk || undefined,
          category: row.category,
          subCategory: row.subCategory || undefined,
          benefitValue: row.benefitValue,
          benefitDescription: row.benefitDescription,
          eligibilityDescription: row.eligibilityDescription,
          applicationProcess: row.applicationProcess,
          requiredDocs: (row.requiredDocs as string[]) || [],
          rules: (row.rules as any) || {},
          officialUrl: row.officialUrl,
          status: row.status as SchemeStatus,
          sourceDocumentName: row.sourceDocumentName || undefined,
          sourceDocumentUrl: row.sourceDocumentUrl || undefined,
          ocrExtractedText: row.ocrExtractedText || undefined,
          aiStructuredJson: row.aiStructuredJson as any,
          rejectionReason: row.rejectionReason || undefined,
          verificationNotes: row.verificationNotes || undefined,
          createdBy: row.createdBy,
          createdByRole: row.createdByRole as AdminRole,
          createdByName: row.createdByName,
          approvedBy: row.approvedBy || undefined,
          approvedByName: row.approvedByName || undefined,
          approvedAt: row.approvedAt?.toISOString(),
          publishedAt: row.publishedAt?.toISOString(),
          lastVerifiedAt: row.lastVerifiedAt?.toISOString(),
          createdAt: row.createdAt?.toISOString() || new Date().toISOString(),
          updatedAt: row.updatedAt?.toISOString() || new Date().toISOString(),
        }));
        for (const s of dbSchemes) {
          MEMORY_DYNAMIC_SCHEMES.set(s.id, s);
        }
      }
    } catch (e) {
      console.warn('[AdminDB] Error listing dynamic schemes from Postgres:', e);
    }
  }

  const all = dbSchemes.length > 0 ? dbSchemes : Array.from(MEMORY_DYNAMIC_SCHEMES.values());

  if (caller.role === 'CENTRAL_ADMIN') {
    return all;
  }
  if (caller.role === 'STATE_ADMIN') {
    return all.filter((s) => s.level === 'CENTRAL' || s.state === caller.state);
  }
  if (caller.role === 'LOCAL_ADMIN') {
    return all.filter(
      (s) =>
        s.level === 'CENTRAL' ||
        (s.state === caller.state && (!s.district || s.district === caller.district))
    );
  }

  return [];
}

export async function listPublishedSchemes(citizenState?: string, citizenDistrict?: string): Promise<DynamicScheme[]> {
  let dbSchemes: DynamicScheme[] = [];
  if (isPostgresConnected && db) {
    try {
      const records = await db.select().from(dynamicSchemes).where(eq(dynamicSchemes.status, 'PUBLISHED'));
      if (records.length > 0) {
        dbSchemes = records.map((row) => ({
          id: row.schemeId,
          title: row.title,
          code: row.code || undefined,
          description: row.description,
          level: row.level as any,
          ministry: row.ministry,
          department: row.department || undefined,
          state: row.state || undefined,
          district: row.district || undefined,
          taluk: row.taluk || undefined,
          category: row.category,
          subCategory: row.subCategory || undefined,
          benefitValue: row.benefitValue,
          benefitDescription: row.benefitDescription,
          eligibilityDescription: row.eligibilityDescription,
          applicationProcess: row.applicationProcess,
          requiredDocs: (row.requiredDocs as string[]) || [],
          rules: (row.rules as any) || {},
          officialUrl: row.officialUrl,
          status: row.status as SchemeStatus,
          sourceDocumentName: row.sourceDocumentName || undefined,
          sourceDocumentUrl: row.sourceDocumentUrl || undefined,
          ocrExtractedText: row.ocrExtractedText || undefined,
          aiStructuredJson: row.aiStructuredJson as any,
          rejectionReason: row.rejectionReason || undefined,
          verificationNotes: row.verificationNotes || undefined,
          createdBy: row.createdBy,
          createdByRole: row.createdByRole as AdminRole,
          createdByName: row.createdByName,
          approvedBy: row.approvedBy || undefined,
          approvedByName: row.approvedByName || undefined,
          approvedAt: row.approvedAt?.toISOString(),
          publishedAt: row.publishedAt?.toISOString(),
          lastVerifiedAt: row.lastVerifiedAt?.toISOString(),
          createdAt: row.createdAt?.toISOString() || new Date().toISOString(),
          updatedAt: row.updatedAt?.toISOString() || new Date().toISOString(),
        }));
        for (const s of dbSchemes) {
          MEMORY_DYNAMIC_SCHEMES.set(s.id, s);
        }
      }
    } catch (e) {
      console.warn('[AdminDB] Error listing published schemes from Postgres:', e);
    }
  }

  const all = dbSchemes.length > 0
    ? dbSchemes
    : Array.from(MEMORY_DYNAMIC_SCHEMES.values()).filter((s) => s.status === 'PUBLISHED');

  if (!citizenState) {
    return all;
  }

  return all.filter((s) => {
    // Central schemes are available to all citizens in India
    if (s.level === 'CENTRAL' || !s.state) {
      return true;
    }
    // State scheme matching
    if (s.state.toLowerCase() === citizenState.toLowerCase()) {
      if (!s.district || !citizenDistrict) {
        return true;
      }
      return s.district.toLowerCase() === citizenDistrict.toLowerCase();
    }
    return false;
  });
}

