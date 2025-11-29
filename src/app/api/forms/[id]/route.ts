// src/app/api/forms/[id]/route.ts
import { connectDB } from '@/lib/db';
import { Form } from '@/lib/models';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> } // ✅ params is a Promise
) {
  // ✅ Await params to get the actual object
  const { id } = await params;

  await connectDB();
  const form = await Form.findById(id);
  if (!form) {
    return NextResponse.json({ error: 'Form not found' }, { status: 404 });
  }
  return NextResponse.json({
    id: form._id.toString(),
    title: form.title,
    schema: form.schema
  });
}