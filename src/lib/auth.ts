// src/lib/auth.ts
import { cookies } from 'next/headers';
import { SignJWT, jwtVerify } from 'jose';
import { compare, hash } from 'bcryptjs';

const secret = new TextEncoder().encode(process.env.NEXTAUTH_SECRET);

export async function setAuthCookie(userId: string) {
  const token = await new SignJWT({ userId })
    .setProtectedHeader({ alg: 'HS256' })
    .setExpirationTime('7d')
    .sign(secret);
  
  // ✅ AWAIT cookies() because it's async in Next.js 15+
  (await cookies()).set('auth', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24 * 7, // 7 days
  });
}

export async function getAuthUser() {
  const cookieStore = await cookies(); // ✅ Await
  const cookie = cookieStore.get('auth')?.value;
  if (!cookie) return null;
  try {
    const { payload } = await jwtVerify(cookie, secret);
    return payload.userId as string;
  } catch {
    return null;
  }
}

export { hash, compare };