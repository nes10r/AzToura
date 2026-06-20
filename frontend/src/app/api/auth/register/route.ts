import { NextRequest } from 'next/server';
import bcrypt from 'bcryptjs';
import { prisma } from '@/lib/prisma';
import { signAccess, signRefresh } from '@/lib/jwt';
import { ok, err } from '@/lib/api-helpers';

export async function POST(req: NextRequest) {
  try {
    const { email, password, name } = await req.json();
    if (!email || !password || !name) return err('All fields required');

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) return err('Email already in use', 409);

    const hashed = await bcrypt.hash(password, 12);
    const user = await prisma.user.create({ data: { email, password: hashed, name } });

    const payload = { id: user.id, email: user.email, role: user.role };
    const accessToken = signAccess(payload);
    const refreshToken = signRefresh(payload);

    const { password: _, ...safeUser } = user;
    return ok({ user: safeUser, accessToken, refreshToken }, 'Registered successfully', 201);
  } catch (e) {
    console.error(e);
    return err('Server error', 500);
  }
}
