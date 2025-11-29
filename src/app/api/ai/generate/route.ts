// src/app/api/ai/generate/route.ts
import { NextRequest, NextResponse } from 'next/server';
import Groq from 'groq-sdk';
import { getRelevantForms } from '@/lib/ai';
import { Form } from '@/lib/models';
import { connectDB } from '@/lib/db';

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

export async function POST(req: NextRequest) {
  const { prompt, userId } = await req.json();
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const relevant = await getRelevantForms(userId, prompt);

  const aiPrompt = `You are an intelligent form schema generator.  

Here is relevant user form history for reference:
${JSON.stringify(relevant, null, 2)}

Now generate a new form schema for this request:
"${prompt}"

Output ONLY valid JSON with this structure:
{
  "title": "string",
  "purpose": "string (e.g., job application)",
  "schema": {
    "type": "object",
    "properties": {
      "fieldName": { "type": "string|number|boolean", "format": "email|url|image?" }
    },
    "required": ["fieldName"]
  }
}`;

  try {
    const chat = await groq.chat.completions.create({
      messages: [{ role: 'user', content: aiPrompt }],
      model: 'llama-3.1-8b-instant',
      temperature: 0.3,
      max_tokens: 1000,
    });

    let content = chat.choices[0]?.message?.content || '';
    const jsonMatch = content.match(/```(?:json)?\s*({[\s\S]*})\s*```/);
    if (jsonMatch) content = jsonMatch[1];
    
    const schemaObj = JSON.parse(content);

    await connectDB();
    const form = new Form({
      userId,
      title: schemaObj.title,
      purpose: schemaObj.purpose,
      prompt,
      schema: schemaObj.schema
    });
    await form.save();

    return NextResponse.json({ id: form._id.toString(), ...schemaObj });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'AI generation failed' }, { status: 500 });
  }
}