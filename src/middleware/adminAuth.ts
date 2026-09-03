import { Request, Response, NextFunction } from 'express';
import { findAdminById, findAdminByEmail } from '../db/admins';
import type { AdminUser, AdminRole, AdminPermission } from '../types';

// Extended Express Request interface
export interface AuthenticatedAdminRequest extends Request {
  admin?: AdminUser;
}

// Simple signed token generator & parser for prototype government authentication
const JWT_SECRET = process.env.ADMIN_JWT_SECRET || 'janai_gov_admin_secure_secret_key_2026';

export function signAdminToken(admin: AdminUser): string {
  const payload = {
    id: admin.id,
    email: admin.email,
    role: admin.role,
    scopeLevel: admin.scopeLevel,
    state: admin.state,
    district: admin.district,
    exp: Date.now() + 24 * 60 * 60 * 1000, // 24 hours
  };
  const str = Buffer.from(JSON.stringify(payload)).toString('base64');
  return `janai_admin_${str}`;
}

export function verifyAdminToken(token: string): { id: string; email: string; role: AdminRole; state?: string; district?: string } | null {
  try {
    if (!token.startsWith('janai_admin_')) return null;
    const jsonStr = Buffer.from(token.replace('janai_admin_', ''), 'base64').toString('utf-8');
    const payload = JSON.parse(jsonStr);
    if (payload.exp && payload.exp < Date.now()) {
      return null; // Expired
    }
    return payload;
  } catch (e) {
    return null;
  }
}

/**
 * Middleware: Verify Admin Authentication
 * Rejects unauthenticated requests with HTTP 401
 */
export async function requireAdminAuth(req: AuthenticatedAdminRequest, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  const token = authHeader?.startsWith('Bearer ') ? authHeader.substring(7) : (req.headers['x-admin-token'] as string);

  if (!token) {
    return res.status(401).json({
      success: false,
      error: 'UNAUTHENTICATED',
      message: 'Government administrator authentication required. Access token missing.',
    });
  }

  const tokenPayload = verifyAdminToken(token);
  if (!tokenPayload) {
    return res.status(401).json({
      success: false,
      error: 'INVALID_TOKEN',
      message: 'Government administrator token is invalid or expired.',
    });
  }

  const admin = await findAdminById(tokenPayload.id);
  if (!admin || admin.status === 'DISABLED') {
    return res.status(403).json({
      success: false,
      error: 'ACCOUNT_DISABLED',
      message: 'Government administrator account is not active.',
    });
  }

  req.admin = admin;
  next();
}

/**
 * Middleware: Check Allowed Admin Roles
 * Rejects unauthorized roles with HTTP 403
 */
export function requireAdminRole(...allowedRoles: AdminRole[]) {
  return (req: AuthenticatedAdminRequest, res: Response, next: NextFunction) => {
    if (!req.admin) {
      return res.status(401).json({
        success: false,
        error: 'UNAUTHENTICATED',
        message: 'Administrator authentication required.',
      });
    }

    if (!allowedRoles.includes(req.admin.role)) {
      return res.status(403).json({
        success: false,
        error: 'INSUFFICIENT_ROLE',
        message: `Forbidden. Role '${req.admin.role}' does not have authority for this action. Allowed: [${allowedRoles.join(', ')}]`,
      });
    }

    next();
  };
}

/**
 * Middleware: Check Admin Permission
 */
export function requireAdminPermission(permission: AdminPermission) {
  return (req: AuthenticatedAdminRequest, res: Response, next: NextFunction) => {
    if (!req.admin) {
      return res.status(401).json({
        success: false,
        error: 'UNAUTHENTICATED',
        message: 'Administrator authentication required.',
      });
    }

    // Central Admins have full authority
    if (req.admin.role === 'CENTRAL_ADMIN') {
      return next();
    }

    if (!req.admin.permissions || !req.admin.permissions.includes(permission)) {
      return res.status(403).json({
        success: false,
        error: 'PERMISSION_DENIED',
        message: `Forbidden. Missing required administrative permission: '${permission}'.`,
      });
    }

    next();
  };
}

/**
 * Middleware: Validate State Scope Match
 * Ensures a State Admin or Local Admin only operates within their designated state
 */
export function enforceStateScope(getStateFromReq: (req: Request) => string | undefined) {
  return (req: AuthenticatedAdminRequest, res: Response, next: NextFunction) => {
    if (!req.admin) {
      return res.status(401).json({ error: 'UNAUTHENTICATED' });
    }

    // Central Admin can operate across all states (INDIA)
    if (req.admin.role === 'CENTRAL_ADMIN') {
      return next();
    }

    const targetState = getStateFromReq(req);
    if (!targetState) {
      return next();
    }

    if (!req.admin.state || req.admin.state.toLowerCase() !== targetState.toLowerCase()) {
      return res.status(403).json({
        success: false,
        error: 'GEOGRAPHIC_SCOPE_VIOLATION',
        message: `Access denied. You are authorized only for '${req.admin.state}', cannot perform action on state '${targetState}'.`,
      });
    }

    next();
  };
}
