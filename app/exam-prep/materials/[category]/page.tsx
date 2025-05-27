'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';

interface Material {
  materi: string;
  tipe: 'multiple_choice' | 'fill_blank';
  userPrompt: string;
  bahasa: string;
}

interface Question {
  type: 'multiple_choice' | 'fill_blank';
  question: string;
  explanation: string;
  options?: string[];
  correctAnswer: string | number;
  wrongAnswerExplanations?: string[];
}

const QuestionTypeIcon = ({ type }: { type: 'multiple_choice' | 'fill_blank' }) => {
  if (type === 'multiple_choice') {
    return (
      <div className="flex items-center gap-2 text-blue-600">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
          <path d="M16 4H4a1 1 0 00-1 1v10a1 1 0 001 1h12a1 1 0 001-1V5a1 1 0 00-1-1zM7 14l-3-3 1.414-1.414L7 11.172l4.586-4.586L13 8l-6 6z" />
        </svg>
        <span className="text-sm">Multiple Choice</span>
      </div>
    );
  }
  return (
    <div className="flex items-center gap-2 text-green-600">
      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M3 5a2 2 0 012-2h10a2 2 0 012 2v10a2 2 0 01-2 2H5a2 2 0 01-2-2V5zm11 1H6v8l4-2 4 2V6z" clipRule="evenodd" />
      </svg>
      <span className="text-sm">Fill in the Blank</span>
    </div>
  );
};

const PreviewModal = ({ 
  questions, 
  onClose,
  category,
  onSave,
  isSaving 
}: { 
  questions: Question[], 
  onClose: () => void,
  category: string,
  onSave: (question: Question) => Promise<void>,
  isSaving: boolean
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const currentQuestion = questions[currentIndex];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-3xl w-full max-h-[80vh] overflow-y-auto p-6">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-bold">Preview Questions</h3>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="mb-4">
          <div className="text-sm text-gray-500 mb-2">
            Question {currentIndex + 1} of {questions.length}
          </div>
          
          <div className="mb-6">
            <h4 className="font-semibold mb-4">{currentQuestion.question}</h4>
            
            {currentQuestion.type === 'multiple_choice' && (
              <div className="space-y-2">
                {currentQuestion.options?.map((option, idx) => (
                  <div
                    key={idx}
                    className={`p-3 rounded-lg border ${
                      idx === Number(currentQuestion.correctAnswer)
                        ? 'border-green-500 bg-green-50'
                        : 'border-gray-200 hover:bg-gray-50'
                    }`}
                  >
                    {option}
                    {idx === Number(currentQuestion.correctAnswer) && (
                      <span className="ml-2 text-green-600">✓</span>
                    )}
                  </div>
                ))}
              </div>
            )}

            {currentQuestion.type === 'fill_blank' && (
              <div className="p-3 rounded-lg border border-green-500 bg-green-50">
                Correct Answer: {currentQuestion.correctAnswer}
              </div>
            )}
          </div>

          <div className="bg-blue-50 p-4 rounded-lg">
            <h5 className="font-semibold mb-2">Explanation:</h5>
            <p>{currentQuestion.explanation}</p>
          </div>
        </div>

        <div className="flex justify-between items-center mt-6">
          <div className="flex gap-2">
            <button
              onClick={() => setCurrentIndex(i => i - 1)}
              disabled={currentIndex === 0}
              className={`px-4 py-2 rounded-lg ${
                currentIndex === 0
                  ? 'bg-gray-100 text-gray-400'
                  : 'bg-blue-500 text-white hover:bg-blue-600'
              }`}
            >
              Previous
            </button>
            <button
              onClick={() => setCurrentIndex(i => i + 1)}
              disabled={currentIndex === questions.length - 1}
              className={`px-4 py-2 rounded-lg ${
                currentIndex === questions.length - 1
                  ? 'bg-gray-100 text-gray-400'
                  : 'bg-blue-500 text-white hover:bg-blue-600'
              }`}
            >
              Next
            </button>
          </div>
          <button
            onClick={()=>{
              onSave(currentQuestion);
            }}
            disabled={isSaving}
            className={`px-6 py-2 rounded-lg ${
              isSaving
                ? 'bg-gray-300 cursor-not-allowed'
                : 'bg-green-500 hover:bg-green-600 text-white'
            }`}
          >
            {isSaving ? (
              <span className="flex items-center gap-2">
                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Saving...
              </span>
            ) : (
              'Save Questions'
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default function MaterialsList() {
  const params = useParams();
  const category = params.category as string;
  const [materials, setMaterials] = useState<Material[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [generatingQuestions, setGeneratingQuestions] = useState<number | null>(null);
  const [previewQuestions, setPreviewQuestions] = useState<Question[] | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const fetchMaterials = async () => {
      try {
        const response = await fetch(`/api/materials?category=${category}`);
        if (!response.ok) {
          throw new Error('Failed to fetch materials');
        }
        const data = await response.json();
        setMaterials(data);
        setIsLoading(false);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
        setIsLoading(false);
      }
    };

    fetchMaterials();
  }, [category]);

  const handleGenerateQuestions = async (material: Material, index: number) => {
    setGeneratingQuestions(index);
    try {
      const response = await fetch('/api/questions/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          category,
          material: material.materi,
          userPrompt: material.userPrompt,
          language: material.bahasa,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate questions');
      }

      const data = await response.json();
      setPreviewQuestions(data.questions);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate questions');
    } finally {
      setGeneratingQuestions(null);
    }
  };

  const handleSaveQuestions = async (question: Question) => {
    if (!previewQuestions) return;
    
    setIsSaving(true);
    try {
      const response = await fetch('/api/questions/save', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          category,
          question: question,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to save questions');
      }

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save questions');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen p-6">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-3xl font-bold mb-4">Loading Materials...</h1>
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen p-6">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-3xl font-bold mb-4">Error</h1>
          <p className="text-red-500 mb-4">{error}</p>
          <Link href="/exam-prep" className="text-blue-500 hover:underline">
            Back to Categories
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold capitalize">{category} Materials</h1>
          <div className="flex gap-4">
            <Link
              href={`/exam-prep/${category}`}
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition duration-200"
            >
              Practice Questions
            </Link>
            <Link
              href="/exam-prep"
              className="text-blue-500 hover:underline flex items-center"
            >
              Back to Categories
            </Link>
          </div>
        </div>

        {materials.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-600 mb-4">No materials available for this category yet.</p>
            <Link
              href="/exam-prep/generate"
              className="text-blue-500 hover:underline"
            >
              Generate Questions
            </Link>
          </div>
        ) : (
          <div className="grid gap-4">
            {materials.map((material, index) => (
              <div
                key={index}
                className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition duration-200"
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex justify-between items-center mb-4">
                      <h2 className="text-xl font-semibold">Material {index + 1}</h2>
                      <QuestionTypeIcon type={material.tipe} />
                    </div>
                    <p className="text-gray-600 whitespace-pre-wrap mb-4">{material.materi}</p>
                    <div className="flex justify-end">
                      <button
                        onClick={() => handleGenerateQuestions(material, index)}
                        disabled={generatingQuestions === index}
                        className={`px-4 py-2 rounded-lg ${
                          generatingQuestions === index
                            ? 'bg-gray-300 cursor-not-allowed'
                            : 'bg-green-500 hover:bg-green-600 text-white'
                        }`}
                      >
                        {generatingQuestions === index ? (
                          <span className="flex items-center gap-2">
                            <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                            </svg>
                            Generating...
                          </span>
                        ) : (
                          'Generate Questions'
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {previewQuestions && (
          <PreviewModal
            questions={previewQuestions}
            onClose={() => setPreviewQuestions(null)}
            category={category}
            onSave={handleSaveQuestions}
            isSaving={isSaving}
          />
        )}
      </div>
    </div>
  );
}