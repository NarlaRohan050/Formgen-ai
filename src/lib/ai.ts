// src/lib/ai.ts
import { Form } from '@/lib/models';
import { connectDB } from '@/lib/db';

export async function getRelevantForms(userId: string, prompt: string) {
  await connectDB();
  const keywords = prompt.toLowerCase().split(/\W+/).filter(w => w.length > 2);
  
  const forms = await Form.find({ userId })
    .sort({ createdAt: -1 })
    .limit(100);

  const scored = forms.map(form => {
    let score = 0;
    const text = (form.purpose + ' ' + form.prompt).toLowerCase();
    keywords.forEach(kw => {
      if (text.includes(kw)) score += 1;
    });
    return { form, score };
  }).filter(x => x.score > 0);

  scored.sort((a, b) => b.score - a.score);
  return scored.slice(0, 5).map(x => ({
    purpose: x.form.purpose,
    fields: Object.keys(x.form.schema.properties || {})
  }));
}