// src/app/api/submissions/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { Submission } from '@/lib/models';

export async function POST(req: NextRequest) {
  await connectDB();
  const { formId, submission } = await req.json();

  // In real app: validate against form schema
  const sub = new Submission({ formId, submission });
  await sub.save();

  return NextResponse.json({ success: true });
}