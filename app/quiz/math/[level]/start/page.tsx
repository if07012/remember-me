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

export default function Page({ params }: { params: { level: string } }) {
    const level = params.level;
    const [answers, setAnswers] = useState<any>([]);
    const [index, setIndex] = useState(0);
    const handleAnswerSelect = (questionIndex: number, option: any) => {
        setAnswers((prevAnswers: any) => ({
            ...prevAnswers,
            [questionIndex]: option,
        }));
        if (index + 1 < questions.length)
            setIndex(index + 1)
    };
    const q = questions[index];
    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
            <h1 className="text-2xl font-bold mb-6">Math Quiz Level {level}</h1>
            <div className="w-full max-w-2xl mx-auto space-y-6">
                <form className="space-y-6">
                    <div className="bg-white p-6 rounded-lg shadow-md">
                        <h2 className="text-xl font-semibold mb-4">{q.question}</h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {q.options.map((option, oIndex) => (
                                <label
                                    key={oIndex}
                                    className={`block p-4 rounded-lg text-center cursor-pointer transition duration-300 ${answers[index] === option
                                        ? "bg-blue-100 border-2 border-blue-500"
                                        : "bg-gray-50 hover:bg-blue-50"
                                        }`}
                                    onClick={() => handleAnswerSelect(index, option)}
                                >
                                    {option}
                                </label>
                            ))}
                        </div>
                    </div>
                </form>
            </div>
        </div>
    )
}