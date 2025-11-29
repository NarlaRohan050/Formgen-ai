// src/app/dashboard/page.tsx
import { getAuthUser } from '@/lib/auth';
import { connectDB } from '@/lib/db';
import { Form } from '@/lib/models';
import { redirect } from 'next/navigation';

export default async function DashboardPage() {
  // ✅ Only allowed in Server Components
  const userId = await getAuthUser();
  if (!userId) {
    redirect('/auth/login');
  }

  await connectDB();
  const forms = await Form.find({ userId }).sort({ createdAt: -1 });

  return (
    <div className="min-h-screen p-6">
      <h1 className="text-2xl font-bold mb-4">Your Forms</h1>
      {forms.length === 0 ? (
        <p>No forms yet. <a href="/generate" className="text-blue-600 underline">Create one!</a></p>
      ) : (
        <ul className="space-y-2">
          {forms.map(form => (
            <li key={form._id.toString()} className="p-4 border rounded">
              <h3 className="font-bold">{form.title}</h3>
              <p className="text-sm text-gray-600">
                Created: {new Date(form.createdAt).toLocaleString()}
              </p>
              <a
                href={`/form/${form._id.toString()}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 underline mt-2 inline-block"
              >
                View Form
              </a>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}