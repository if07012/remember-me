"use client"
import { useState } from "react";

const questions = [
    {
        question: "What is 2 + 2?",
        options: ["3", "4", "5", "6"],
        answer: "4",
    },
    {
        question: "What is 5 * 5?",
        options: ["20", "25", "30", "35"],
        answer: "25",
    },
];

export default function Page() {
    const [answers, setAnswers] = useState<any>([]);
    const handleAnswerSelect = (questionIndex: number, option: any) => {
        setAnswers((prevAnswers: any) => ({
            ...prevAnswers,
            [questionIndex]: option,
        }));
    };
    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
            <h1 className="text-2xl font-bold mb-6">Math Quiz</h1>
            <div className="w-full max-w-2xl mx-auto space-y-6">
                <h1 className="text-2xl font-bold text-center mb-6">Math Quiz</h1>
                <form className="space-y-6">
                    {questions.map((q, qIndex) => (
                        <div key={qIndex} className="bg-white p-6 rounded-lg shadow-md">
                            <h2 className="text-xl font-semibold mb-4">{q.question}</h2>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                {q.options.map((option, oIndex) => (
                                    <label
                                        key={oIndex}
                                        className={`block p-4 rounded-lg text-center cursor-pointer transition duration-300 ${answers[qIndex] === option
                                            ? "bg-blue-100 border-2 border-blue-500"
                                            : "bg-gray-50 hover:bg-blue-50"
                                            }`}
                                        onClick={() => handleAnswerSelect(qIndex, option)}
                                    >
                                        {option}
                                    </label>
                                ))}
                            </div>
                        </div>
                    ))}
                    <button
                        type="submit"
                        className="w-full bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition duration-300"
                    >
                        Submit Quiz
                    </button>
                </form>
            </div>
        </div>
    )
}