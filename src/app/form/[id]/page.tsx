// src/app/form/[id]/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';

export default function PublicFormPage() {
  const params = useParams();
  const id = params.id as string;

  const [form, setForm] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!id) return;
    fetch(`/api/forms/${id}`)
      .then(res => res.json())
      .then(data => {
        setForm(data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Failed to load form:', err);
        setLoading(false);
      });
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const submission: Record<string, any> = {};
    for (let [key, value] of formData.entries()) {
      submission[key] = value;
    }

    setSubmitting(true);
    try {
      const res = await fetch('/api/submissions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ formId: id, submission }),
      });
      if (res.ok) {
        alert('Form submitted successfully!');
        (e.target as HTMLFormElement).reset();
      } else {
        alert('Submission failed');
      }
    } catch (err) {
      alert('Error');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div className="p-6">Loading form...</div>;
  if (!form) return <div className="p-6">Form not found</div>;

  return (
    <div className="min-h-screen p-6 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">{form.title}</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        {Object.entries(form.schema.properties).map(([name, field]: [string, any]) => {
          if (field.format === 'image') {
            return (
              <div key={name}>
                <label className="block mb-1">{name}</label>
                <input
                  type="file"
                  name={name}
                  accept="image/*"
                  className="w-full p-1 border rounded"
                  required={form.schema.required?.includes(name)}
                />
              </div>
            );
          }
          return (
            <div key={name}>
              <label className="block mb-1">{name}</label>
              <input
                type={field.format === 'email' ? 'email' : field.type === 'string' ? 'text' : field.type}
                name={name}
                className="w-full p-2 border rounded"
                required={form.schema.required?.includes(name)}
              />
            </div>
          );
        })}
        <button
          type="submit"
          disabled={submitting}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          {submitting ? 'Submitting...' : 'Submit'}
        </button>
      </form>
    </div>
  );
}