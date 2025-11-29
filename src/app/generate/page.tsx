// src/app/generate/page.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function GeneratePage() {
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleGenerate = async () => {
    // ✅ Get user ID from API (safe for Client Component)
    const meRes = await fetch('/api/auth/me');
    const meData = await meRes.json();

    if (!meData.userId) {
      alert('Please log in first');
      router.push('/auth/login');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/ai/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt, userId: meData.userId }),
      });
      const result = await res.json();
      if (res.ok) {
        alert(`✅ Form created! Share: /form/${result.id}`);
        router.push(`/form/${result.id}`);
      } else {
        alert('❌ Generation failed: ' + (result.error || 'Unknown error'));
      }
    } catch (err) {
      alert('⚠️ Network error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen p-6 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">AI Form Generator</h1>
      <p className="mb-4">Describe the form you need in plain English:</p>
      <textarea
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        placeholder='e.g., "Internship application form with name, email, resume upload, and GitHub profile"'
        className="w-full h-24 p-3 border rounded-lg mb-4"
      />
      <button
        onClick={handleGenerate}
        disabled={loading || !prompt.trim()}
        className={`px-4 py-2 rounded-lg ${
          loading || !prompt.trim()
            ? 'bg-gray-400 cursor-not-allowed'
            : 'bg-green-600 hover:bg-green-700 text-white'
        }`}
      >
        {loading ? 'Generating...' : 'Generate Form'}
      </button>
    </div>
  );
}