import { NextRequest } from 'next/server';
import bcrypt from 'bcryptjs';
import { prisma } from '@/lib/prisma';
import { signAccess, signRefresh } from '@/lib/jwt';
import { ok, err } from '@/lib/api-helpers';

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();
    if (!email || !password) return err('Email and password required');

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return err('Invalid credentials', 401);
    if (!user.isActive) return err('Account disabled', 401);

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return err('Invalid credentials', 401);

    const payload = { id: user.id, email: user.email, role: user.role };
    const accessToken = signAccess(payload);
    const refreshToken = signRefresh(payload);

    const { password: _, ...safeUser } = user;
    return ok({ user: safeUser, accessToken, refreshToken }, 'Login successful');
  } catch (e) {
    console.error(e);
    return err('Server error', 500);
  }
}
