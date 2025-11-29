// src/app/api/forms/route.ts
import { getAuthUser } from '@/lib/auth';
import { connectDB } from '@/lib/db';
import { Form } from '@/lib/models';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  const userId = await getAuthUser();
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  await connectDB();
  const forms = await Form.find({ userId }).sort({ createdAt: -1 });
  return NextResponse.json(forms.map(f => ({
    id: f._id.toString(),
    title: f.title,
    createdAt: f.createdAt
  })));
}