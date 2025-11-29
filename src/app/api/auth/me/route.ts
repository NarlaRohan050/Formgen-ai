// src/app/api/auth/me/route.ts
import { getAuthUser } from '@/lib/auth';
import { NextResponse } from 'next/server';

export async function GET() {
  const userId = await getAuthUser();
  return NextResponse.json({ userId });
}