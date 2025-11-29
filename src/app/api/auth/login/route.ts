// src/app/api/auth/login/route.ts
import { compare } from '@/lib/auth';
import { connectDB } from '@/lib/db';
import { User } from '@/lib/models';
import { setAuthCookie } from '@/lib/auth';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  await connectDB();
  const { email, password } = await req.json();
  
  const user = await User.findOne({ email });
  if (!user || !(await compare(password, user.password))) {
    return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
  }

  // ✅ This is already async — no change needed, but ensure it's awaited
  await setAuthCookie(user._id.toString());
  return NextResponse.json({ success: true });
}