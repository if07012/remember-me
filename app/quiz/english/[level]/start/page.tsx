"use client"
import { useState, useEffect } from "react";
import { useRouter } from 'next/navigation';

function shuffleArray(array: any[]) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1)); // Random index
        [array[i], array[j]] = [array[j], array[i]];  // Swap elements
    }
    return array;
}
let interval: any = null;
function formatTime(seconds: number) {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
}
async function postData(body: any, type: string, module: string, isPass: string) {
    try {
        const response = await fetch(`https://bengkel-api-db-a0gpcsexa5cwe9g2.southeastasia-01.azurewebsites.net/api/sheet/report?isPass=${isPass}&type=${type}&module=${module}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-functions-key': '1mfIulpMhjZ5agPydsogLoHLMGiv2Pgt'
            },
            body: JSON.stringify(body)
        });

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json(); // Parse JSON response
        console.log('Success:', data);
    } catch (error) {
        console.error('Error:', error);
    }
}

export default function Page({ params }: { params: { level: string } }) {
    const level = params.level;
    const [questions, setQuestions] = useState<any[]>([]);
    const [report, setReport] = useState<any>({});
    const [start, setStart] = useState<boolean>(false);
    const [index, setIndex] = useState<number>(0);
    const [loading, setLoading] = useState(true);
    const [isDone, setDone] = useState(false);
    const router = useRouter();
    const [progress, setProgress] = useState(0);
    const [duration, setDuration] = useState(0);
    const [minimumAnswer, setMinimumAnswer] = useState(0);
    const [remainingDuration, setRemainingDuration] = useState(0);
    useEffect(() => {
        if (start) {
            setRemainingDuration(duration)
        }
    }, [start])
    useEffect(() => {
        if (questions.length > 0) {
            setReport({
                totalAnswer: questions.filter(n => n.currentAnswer).length,
                correctAnswer: questions.filter(n => n.currentAnswer === n.correctAnswer).length,
                wrongAnswer: questions.filter(n => n.currentAnswer).length - questions.filter(n => n.currentAnswer === n.correctAnswer).length,
                precentage: (questions.filter(n => n.currentAnswer === n.correctAnswer).length / questions.filter(n => n.currentAnswer).length * 100).toFixed(2)
            });
        }
    }, [questions])
    useEffect(() => {
        if (start && remainingDuration > 0) {
            interval = setInterval(() => {
                setRemainingDuration(remainingDuration - 1)
            }, 1000);

            return () => clearInterval(interval);
        }
        if (start && remainingDuration == 0 && interval) {
            setDone(true)
            clearInterval(interval)
            postData(questions.filter(n => n.currentAnswer), "English", "English-" + level, questions.filter(n => n.currentAnswer === n.correctAnswer).length >= minimumAnswer ? "Passes" : "Failed")
        }
    }, [start, remainingDuration]);
    useEffect(() => {
        const callApi = async () => {
            let response = await fetch(`https://bengkel-api-db-a0gpcsexa5cwe9g2.southeastasia-01.azurewebsites.net/api/sheet?sheet=English-${params.level}`,
                {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'x-functions-key': '1mfIulpMhjZ5agPydsogLoHLMGiv2Pgt'
                    }
                }
            )
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            const data = await response.json();
            response = await fetch(`https://bengkel-api-db-a0gpcsexa5cwe9g2.southeastasia-01.azurewebsites.net/api/sheet?sheet=Setting`,
                {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'x-functions-key': '1mfIulpMhjZ5agPydsogLoHLMGiv2Pgt'
                    }
                }
            )
            const configuration = (await response.json()).filter((n: any) => n.module === "English")[0] ?? {};
            setDuration(configuration.duration);
            setMinimumAnswer(configuration.minimum)
            let result: any[] = [];
            for (let i = 0; i <= configuration.looping; i++) {
                const arr = shuffleArray([...data.map((v: any) => {
                    return {
                        ...v
                    }
                })]);
                for (const a in arr) {
                    arr[a].correctAnswer = arr[a].answer;
                    const answers = shuffleArray([...shuffleArray(data.filter((n: any) => n.questions !== arr[a].questions).map((n: any) => n.answer)).slice(0, 3), arr[a].answer]);
                    arr[a].answers = [...answers];
                }
                result = [...result, ...arr]
            }
            setQuestions([...result]);

            setLoading(false);
        }
        callApi()
    }, [])
    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
            <h1 className="text-6xl font-bold mb-6">Test English - {level}</h1>
            {!isDone && <>
                {!loading && <h1 className="text-2xl font-bold mb-6">Please do the best in {duration} seconds, minimun Correct Answer is {minimumAnswer} </h1>}
                {duration > 0 && start && <h1 className="text-2xl font-bold mb-6">{formatTime(remainingDuration)} </h1>}
                <div className="w-full">
                    <form className="grid grid-cols-1 gap-4">
                        {loading && <>
                            <div className="bg-white p-6 rounded-lg shadow-md">
                                <div className="grid grid-cols-1 gap-4">
                                    <div className="block p-14 rounded-lg text-center cursor-pointer transition duration-300 animate-pulse"></div>
                                </div>
                                <div className="grid grid-cols-2 gap-4 m-8">
                                    <div className="block p-14 rounded-lg text-center cursor-pointer transition duration-300 animate-pulse"></div>
                                    <div className="block p-14 rounded-lg text-center cursor-pointer transition duration-300 animate-pulse"></div>
                                    <div className="block p-14 rounded-lg text-center cursor-pointer transition duration-300 animate-pulse"></div>
                                    <div className="block p-14 rounded-lg text-center cursor-pointer transition duration-300 animate-pulse"></div>
                                </div>
                            </div>

                        </>}
                        {!loading && index < questions.length && !start &&
                            <button
                                type="submit"
                                className="w-full mt-16 bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition duration-300"
                                onClick={() => {
                                    setStart(true)
                                }}
                            >
                                <h2 className="text-4xl font-semibold mb-4">Start</h2>
                            </button>
                        }
                        {!loading && index < questions.length && start &&
                            <div className="bg-white p-6 rounded-lg shadow-md">

                                <div className="grid grid-cols-1 gap-4">
                                    <label
                                        className={`block p-4 rounded-lg text-center cursor-pointer transition duration-300 ${false
                                            ? "bg-blue-100 border-2 border-blue-500"
                                            : "bg-gray-50 hover:bg-blue-50"
                                            }`}
                                        onClick={() => {

                                        }}
                                    >
                                        <h2 className="text-6xl font-semibold mb-4">{questions[index].questions} = </h2>
                                    </label>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    {questions[index].answers.map((a: any) => {
                                        return <label
                                            className={`block p-4 rounded-lg text-center cursor-pointer transition duration-300 ${true
                                                ? "bg-blue-100 border-2 border-blue-500"
                                                : "bg-gray-50 hover:bg-blue-50"
                                                }`}
                                            onClick={() => {
                                                questions[index].currentAnswer = a;
                                                setQuestions([...questions])
                                                setTimeout(() => {
                                                    setIndex(index + 1)
                                                }, 100)
                                            }}
                                        >
                                            <h2 className="text-4xl font-semibold">{a}</h2>
                                        </label>
                                    })}
                                </div>
                            </div>
                        }
                        {!loading && index < questions.length && start && <div className="w-full bg-gray-200 rounded-full h-4">
                            <div
                                className="bg-blue-500 h-4 rounded-full transition-all duration-500"
                                style={{ width: `${progress}%` }}
                            ></div>
                        </div>}
                    </form>
                </div>
            </>}
            {isDone && <>
                <div className="w-full  p-6 bg-white rounded-lg shadow-md">
                    <h1 className="text-2xl font-bold text-center mb-6">Quiz Dashboard</h1>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {/* Total Answers Card */}
                        <div className="bg-slate-500 p-6 rounded-lg shadow-md text-center">
                            <h2 className="text-xl font-semibold text-slate-700">Total Answers</h2>
                            <p className="text-3xl font-bold mt-2">{report.totalAnswer}</p>
                        </div>

                        {/* Correct Answers Card */}
                        <div className="bg-green-400 p-6 rounded-lg shadow-md text-center">
                            <h2 className="text-xl font-semibold text-green-700">Correct Answers</h2>
                            <p className="text-3xl font-bold mt-2">{report.correctAnswer}</p>
                        </div>

                        {/* Wrong Answers Card */}
                        <div className="bg-red-400 p-6 rounded-lg shadow-md text-center">
                            <h2 className="text-xl font-semibold text-red-700">Wrong Answers</h2>
                            <p className="text-3xl font-bold mt-2">{report.wrongAnswer}</p>
                        </div>

                        {/* Correct Percentage Card */}
                        <div className="bg-yellow-400 p-6 rounded-lg shadow-md text-center">
                            <h2 className="text-xl font-semibold text-yellow-700">Correct Percentage</h2>
                            <p className="text-3xl font-bold mt-2">{report.precentage} %</p>
                        </div>
                    </div>
                    <div className="  p-6 justify-center bg-white rounded-lg shadow-md">
                        <h1 className="text-2xl font-bold text-center mb-6">Wrong Answer</h1>
                        <div className="overflow-x-auto">
                            <table className="min-w-full bg-white border border-gray-200 divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Question
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Corrent Answer
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Your Answer
                                        </th>

                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200">
                                    {(questions.filter(n => n.currentAnswer !== n.correctAnswer && n.currentAnswer)).map((question: any, index: number) => (
                                        <tr key={index} className="hover:bg-gray-50">
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{question.questions}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{question.correctAnswer}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{question.currentAnswer}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    <button
                        type="submit"
                        className="w-full mt-16 bg-black text-white px-6 py-3 rounded-lg hover:bg-gray-600 transition duration-300"
                        onClick={() => {
                            window.location.href = (`/quiz/English`)
                        }}
                    >
                        <h2 className="text-4xl font-semibold mb-4">Back </h2>
                    </button>
                </div>
            </>}
        </div>
    )
}