'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';

interface BaseQuestion {
  id: number;
  type: 'multiple_choice' | 'fill_blank';
  question: string;
  explanation: string;
  language: 'English' | 'Indonesia';
}

interface MultipleChoiceQuestion extends BaseQuestion {
  type: 'multiple_choice';
  options: any[];
  correctAnswer: number;
  wrongAnswerExplanations: string[];
}

interface FillBlankQuestion extends BaseQuestion {
  type: 'fill_blank';
  correctAnswer: string;
  caseSensitive?: boolean;
  acceptableAnswers?: string[];
}

type Question = MultipleChoiceQuestion | FillBlankQuestion;

interface Answer {
  questionId: number;
  userAnswer: string | number;
  isCorrect: boolean;
  question: Question;
}
function shuffleArray(array: any[]) {
  for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1)); // Random index
      [array[i], array[j]] = [array[j], array[i]];  // Swap elements
  }
  return array;
}
export default function ExamPrepCategory() {
  const params = useParams();
  const category = params.category as string;
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [fillBlankAnswer, setFillBlankAnswer] = useState<string>('');
  const [showExplanation, setShowExplanation] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedLanguage, setSelectedLanguage] = useState<'English' | 'Indonesia'>('Indonesia');
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const response = await fetch(`/api/questions?category=${category}&language=${selectedLanguage}`);
        if (!response.ok) {
          throw new Error('Failed to fetch questions');
        }
        const data = await response.json();
        setQuestions(shuffleArray(data));
        setIsLoading(false);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
        setIsLoading(false);
      }
    };

    fetchQuestions();
  }, [category, selectedLanguage]);

  const currentQuestion = questions[currentQuestionIndex];

  const handleAnswerSelect = (answerIndex: number) => {
    setSelectedAnswer(answerIndex);
    setShowExplanation(true);
    console.log(currentQuestion);
    const correct = parseInt(answerIndex.toString()) ===parseInt( (currentQuestion as MultipleChoiceQuestion).correctAnswer.toString());
    setIsCorrect(correct);
    
    // Store the answer
    const answer: Answer = {
      questionId: currentQuestion.id,
      userAnswer: answerIndex,
      isCorrect: correct,
      question: currentQuestion
    };
    setAnswers([...answers, answer]);
  };

  const handleFillBlankSubmit = () => {
    const question = currentQuestion as FillBlankQuestion;
    const userAnswer = question.caseSensitive ? fillBlankAnswer : fillBlankAnswer.toLowerCase();
    const acceptableAnswers = question.acceptableAnswers || [question.correctAnswer];
    const normalizedAcceptableAnswers = question.caseSensitive 
      ? acceptableAnswers 
      : acceptableAnswers.map(answer => answer.toLowerCase());
    
    const correct = normalizedAcceptableAnswers.includes(userAnswer.trim());
    setIsCorrect(correct);
    setShowExplanation(true);

    // Store the answer
    const answer: Answer = {
      questionId: question.id,
      userAnswer: fillBlankAnswer,
      isCorrect: correct,
      question: question
    };
    setAnswers([...answers, answer  ]);
  };

  const handleSubmit = async () => {
    if (isSubmitting) return;
    
    setIsSubmitting(true);
    try {
      const response = await fetch('/api/questions/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          category,
          answers,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to submit answers');
      }

      const result = await response.json();
      setSubmitted(true);
      // You can show a success message or summary here
      alert(`Submission successful! You got ${result.summary.correctAnswers} out of ${result.summary.totalQuestions} questions correct.`);
    } catch (err) {
      alert('Failed to submit answers. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedAnswer(null);
      setFillBlankAnswer('');
      setShowExplanation(false);
      setIsCorrect(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen p-6">
        <div className="max-w-2xl mx-auto text-center">
          <h1 className="text-3xl font-bold mb-4">Loading Questions...</h1>
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen p-6">
        <div className="max-w-2xl mx-auto text-center">
          <h1 className="text-3xl font-bold mb-4">Error</h1>
          <p className="text-red-500">{error}</p>
          <Link href="/exam-prep" className="mt-4 inline-block text-blue-500 hover:underline">
            Back to Categories
          </Link>
        </div>
      </div>
    );
  }

  if (!currentQuestion) {
    return (
      <div className="min-h-screen p-6">
        <div className="max-w-2xl mx-auto text-center">
          <h1 className="text-3xl font-bold mb-4">No questions available</h1>
          <p className="mb-4">Please check back later for questions in this category.</p>
          <Link href="/exam-prep" className="text-blue-500 hover:underline">
            Back to Categories
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-2xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold capitalize">
            {category} Exam Preparation
          </h1>
          <div className="flex items-center gap-4">
            <select
              value={selectedLanguage}
              onChange={(e) => setSelectedLanguage(e.target.value as 'English' | 'Indonesia')}
              className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-lg"
            >
              <option value="English">English</option>
              <option value="Indonesia">Indonesia</option>
            </select>
            <Link
              href="/exam-prep"
              className="text-blue-500 hover:underline"
            >
              Back to Categories
            </Link>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="mb-4 text-sm text-gray-600">
            Question {currentQuestionIndex + 1} of {questions.length}
          </div>
          
          <h2 className="text-xl font-semibold mb-4">{currentQuestion.question}</h2>
          
          {currentQuestion.type === 'multiple_choice' && (
            <div className="space-y-3">
              {(currentQuestion as MultipleChoiceQuestion).options.map((option, index) => (
                <button
                  key={index}
                  onClick={() => handleAnswerSelect(index)}
                  disabled={showExplanation}
                  className={`w-full p-3 text-left rounded-lg transition duration-200 ${
                    selectedAnswer === index
                      ? index === parseInt((currentQuestion as MultipleChoiceQuestion).correctAnswer.toString())
                        ? 'bg-green-100 border-green-500'
                        : 'bg-red-100 border-red-500'
                      : 'bg-gray-50 hover:bg-gray-100'
                  } ${showExplanation && index === (currentQuestion as MultipleChoiceQuestion).correctAnswer ? 'bg-green-100' : ''}`}
                >
                  {option.option}
                </button>
              ))}
            </div>
          )}

          {currentQuestion.type === 'fill_blank' && (
            <div className="space-y-4">
              <input
                type="text"
                value={fillBlankAnswer}
                onChange={(e) => setFillBlankAnswer(e.target.value)}
                disabled={showExplanation}
                placeholder="Type your answer here"
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                onKeyPress={(e) => {
                  if (e.key === 'Enter' && !showExplanation) {
                    handleFillBlankSubmit();
                  }
                }}
              />
              {!showExplanation && (
                <button
                  onClick={handleFillBlankSubmit}
                  className="w-full bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition duration-200"
                >
                  Submit Answer
                </button>
              )}
            </div>
          )}

          {showExplanation && (
            <div className="mt-6 p-4 bg-blue-50 rounded-lg">
              <h3 className="font-semibold mb-2">Explanation:</h3>
              {!isCorrect && currentQuestion.type === 'multiple_choice' && selectedAnswer !== null && (
                <div className="mb-3 p-3 bg-red-50 rounded">
                  <p className="text-red-700 font-medium">Why your answer is incorrect:</p>
                  <p>{(currentQuestion as MultipleChoiceQuestion).options[selectedAnswer].explanation }</p>
                </div>
              )}
              {!isCorrect && currentQuestion.type === 'fill_blank' && (
                <div className="mb-3 p-3 bg-red-50 rounded">
                  <p className="text-red-700 font-medium">Your answer was incorrect:</p>
                  <p>You entered: "{fillBlankAnswer}"</p>
                  <p>The correct answer is: "{(currentQuestion as FillBlankQuestion).correctAnswer}"</p>
                </div>
              )}
             {isCorrect  && <div className="p-3 bg-green-50 rounded">
                <p className="text-green-700 font-medium">Explanation:</p>
                <p>{currentQuestion.explanation}</p>
              </div>}
            </div>
          )}

          {showExplanation && currentQuestionIndex < questions.length - 1 && (
            <button
              onClick={handleNextQuestion}
              className="mt-6 w-full bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition duration-200"
            >
              Next Question
            </button>
          )}

          {/* Add submit button at the end */}
          {currentQuestionIndex === questions.length - 1 && showExplanation && !submitted && (
            <button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className={`mt-6 w-full py-2 px-4 rounded-lg transition duration-200 ${
                isSubmitting 
                  ? 'bg-gray-400 cursor-not-allowed' 
                  : 'bg-green-500 hover:bg-green-600 text-white'
              }`}
            >
              {isSubmitting ? 'Submitting...' : 'Submit All Answers'}
            </button>
          )}

          {/* Show summary after submission */}
          {submitted && (
            <div className="mt-6 p-4 bg-green-50 rounded-lg">
              <h3 className="font-semibold text-green-700 mb-2">Submission Complete!</h3>
              <p>Your answers have been recorded. You can review them later.</p>
              <Link href="/exam-prep" className="mt-4 inline-block text-blue-500 hover:underline">
                Back to Categories
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 