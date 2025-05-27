'use client';

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function GenerateQuestions() {
  const [category, setCategory] = useState('');
  const [material, setMaterial] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const categories = [
    { id: 'pancasila', name: 'Pendidikan Pancasila' },
    { id: 'islam', name: 'Pendidikan Agama Islam' },
    { id: 'matematika', name: 'Matematika' },
    { id: 'english', name: 'English' },
    { id: 'math-english', name: 'Math in English' },
    { id: 'science', name: 'Science in English' },
    { id: 'bahasa', name: 'Bahasa Indonesia' },
    { id: 'ips-ipa', name: 'Ilmu Pengetahuan Alam dan Sosial' },
  ];

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      router.push(`/exam-prep/materials/${category}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-2xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Generate Exam Questions</h1>
          <Link
            href="/exam-prep"
            className="text-blue-500 hover:underline"
          >
            Back to Categories
          </Link>
        </div>
        
        {error && (
          <div className="mb-4 p-4 bg-red-50 text-red-700 rounded-lg">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
              Category
            </label>
            <select
              id="category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              required
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Select a category</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>


          <button
            type="submit"
            disabled={isLoading}
            className={`w-full py-3 px-4 rounded-lg text-white font-medium ${
              isLoading ? 'bg-blue-400' : 'bg-blue-500 hover:bg-blue-600'
            }`}
          >
            {isLoading ? 'Generating Questions...' : 'Generate Questions'}
          </button>
        </form>
      </div>
    </div>
  );
} 