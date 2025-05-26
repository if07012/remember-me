import Link from 'next/link';

export default function ExamPrepPage() {
  const categories = [
    { id: 'math', name: 'Mathematics', icon: '➕', color: 'blue' },
    { id: 'english', name: 'English', icon: '📚', color: 'green' },
    { id: 'science', name: 'Science', icon: '🔬', color: 'purple' },
    { id: 'history', name: 'History', icon: '📜', color: 'amber' },
    { id: 'religion', name: 'Religion', icon: '🕍', color: 'red' },
  ];

  return (
    <main className="min-h-screen p-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-center">Exam Preparation</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((category) => (
            <Link
              key={category.id}
              href={`/exam-prep/${category.id}`}
              className={`block bg-white p-6 rounded-lg shadow-md text-center transition duration-300 hover:shadow-lg hover:bg-${category.color}-50`}
            >
              <span className="text-4xl mb-4 block">{category.icon}</span>
              <h2 className="text-xl font-semibold">{category.name}</h2>
              <p className="mt-2 text-gray-600">Practice questions and answers</p>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
} 