import { NextRequest, NextResponse } from 'next/server';
import { verifyAccess } from './jwt';

export function ok(data: unknown, message = 'Success', status = 200, pagination?: unknown) {
  return NextResponse.json({ success: true, message, data, ...(pagination ? { pagination } : {}) }, { status });
}

export function err(message: string, status = 400) {
  return NextResponse.json({ success: false, message }, { status });
}

export function paginate(page: number, limit: number, total: number) {
  return { total, page, limit, pages: Math.ceil(total / limit) };
}

export function parsePagination(pageStr?: string | null, limitStr?: string | null) {
  const page = Math.max(1, parseInt(pageStr || '1'));
  const limit = Math.min(100, Math.max(1, parseInt(limitStr || '20')));
  const skip = (page - 1) * limit;
  return { page, limit, skip };
}

export function getAuth(req: NextRequest): { id: string; role: string } | null {
  try {
    const auth = req.headers.get('authorization') || '';
    const token = auth.replace('Bearer ', '');
    if (!token) return null;
    const payload = verifyAccess(token);
    return { id: payload.id as string, role: payload.role as string };
  } catch {
    return null;
  }
}

export function requireAuth(req: NextRequest) {
  const user = getAuth(req);
  if (!user) return { user: null, response: err('Unauthorized', 401) };
  return { user, response: null };
}

export function requireAdmin(req: NextRequest) {
  const user = getAuth(req);
  if (!user) return { user: null, response: err('Unauthorized', 401) };
  if (user.role !== 'ADMIN') return { user: null, response: err('Forbidden', 403) };
  return { user, response: null };
}
