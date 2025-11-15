import Link from 'next/link';
export default function Page() {
  return (
    <main className="flex min-h-screen flex-col p-6 h-screen justify-center align-middle">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <Link href="/quiz/math" className="block bg-white p-6 rounded-lg shadow-md text-center transition duration-300 hover:shadow-lg hover:bg-blue-50">
          <span className="text-4xl mb-4 block">➕</span>
          <h2 className="text-xl font-semibold">Math</h2>
        </Link>
        <Link href="/quiz/english" className="block bg-white p-6 rounded-lg shadow-md text-center transition duration-300 hover:shadow-lg hover:bg-green-50">
          <span className="text-4xl mb-4 block">📚</span>
          <h2 className="text-xl font-semibold">English</h2>
        </Link>
        <Link href="/quiz/religion" className="block bg-white p-6 rounded-lg shadow-md text-center transition duration-300 hover:shadow-lg hover:bg-red-50">
          <span className="text-4xl mb-4 block">🕍</span>
          <h2 className="text-xl font-semibold">Religion</h2>
        </Link>
        <Link href="/exam-prep" className="block bg-white p-6 rounded-lg shadow-md text-center transition duration-300 hover:shadow-lg hover:bg-purple-50">
          <span className="text-4xl mb-4 block">📝</span>
          <h2 className="text-xl font-semibold">Exam Preparation</h2>
        </Link>
        <Link href="/quiz/all" className="block bg-white p-6 rounded-lg shadow-md text-center transition duration-300 hover:shadow-lg hover:bg-yellow-50">
          <span className="text-4xl mb-4 block">🌐</span>
          <h2 className="text-xl font-semibold">All Categories</h2>
        </Link>
        <Link href="/vocabulary" className="block bg-white p-6 rounded-lg shadow-md text-center transition duration-300 hover:shadow-lg hover:bg-indigo-50">
          <span className="text-4xl mb-4 block">💭</span>
          <h2 className="text-xl font-semibold">Remember Vocabulary</h2>
        </Link>
      </div>
    </main>
  );
}
