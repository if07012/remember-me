"use client"
import { useState, useEffect } from "react";
import { useRouter } from 'next/navigation';


export default function Page({ params }: { params: { level: string } }) {
    const level = params.level;
    const [questions, setQuestions] = useState<any[]>([]);
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        const callApi = async () => {
            const response = await fetch(`https://bengkel-api-db-a0gpcsexa5cwe9g2.southeastasia-01.azurewebsites.net/api/sheet?sheet=English-${params.level}`,
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
            const data = await response.json(); // Convert response to JSON
            setQuestions([...data]);
            setLoading(false);
        }
        callApi()
    }, [])
    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
            <h1 className="text-6xl font-bold mb-6">Remember English - {level}</h1>
            <div className="w-full">
                <form className="grid grid-cols-2 gap-2">
                    {loading && <>
                        <div className="bg-white p-6 rounded-lg shadow-md">
                            <div className="grid grid-cols-2 gap-2">
                                <div className="block p-6 rounded-lg text-center cursor-pointer transition duration-300 animate-pulse"></div>
                                <div className="block p-6 rounded-lg text-center cursor-pointer transition duration-300 animate-pulse"></div>
                            </div>
                        </div>
                        <div className="bg-white p-6 rounded-lg shadow-md">
                            <div className="grid grid-cols-2 gap-2">
                                <div className="block p-6 rounded-lg text-center cursor-pointer transition duration-300 animate-pulse"></div>
                                <div className="block p-6 rounded-lg text-center cursor-pointer transition duration-300 animate-pulse"></div>
                            </div>
                        </div>
                        <div className="bg-white p-6 rounded-lg shadow-md">
                            <div className="grid grid-cols-2 gap-2">
                                <div className="block p-6 rounded-lg text-center cursor-pointer transition duration-300 animate-pulse"></div>
                                <div className="block p-6 rounded-lg text-center cursor-pointer transition duration-300 animate-pulse"></div>
                            </div>
                        </div>
                        <div className="bg-white p-6 rounded-lg shadow-md">
                            <div className="grid grid-cols-2 gap-2">
                                <div className="block p-6 rounded-lg text-center cursor-pointer transition duration-300 animate-pulse"></div>
                                <div className="block p-6 rounded-lg text-center cursor-pointer transition duration-300 animate-pulse"></div>
                            </div>
                        </div>
                    </>}
                    {!loading && questions.map(m => {
                        return <div className="bg-white p-6 rounded-lg shadow-md">

                            <div className="grid grid-cols-2 gap-2">
                                <label
                                    className={`block p-1 rounded-lg text-center cursor-pointer transition duration-300 ${false
                                        ? "bg-blue-100 border-2 border-blue-500"
                                        : "bg-gray-50 hover:bg-blue-50"
                                        }`}
                                    onClick={() => {

                                    }}
                                >
                                    <h2 className="text-4xl font-semibold mb-4">{m.questions} </h2>
                                </label>
                                <label
                                    className={`block p-1 rounded-lg text-center cursor-pointer transition duration-300 ${true
                                        ? "bg-blue-100 border-2 border-blue-500"
                                        : "bg-gray-50 hover:bg-blue-50"
                                        }`}
                                    onClick={() => {

                                    }}
                                >
                                    <h2 className="text-4xl font-semibold">{m.answer}</h2>
                                </label>
                            </div>
                        </div>
                    })}

                </form>
            </div>
            <div className="grid grid-cols-2 gap-2">
                <button
                    type="submit"
                    className="w-full mt-16 bg-black text-white px-6 py-3 rounded-lg hover:bg-gray-600 transition duration-300"
                    onClick={() => {
                        router.push(`/quiz/english`)
                    }}
                >
                    <h2 className="text-4xl font-semibold mb-4">Back </h2>
                </button>
                <button
                    type="submit"
                    className="w-full mt-16 bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition duration-300"
                    onClick={() => {
                        router.push(`/quiz/english/${level}/start`)
                    }}
                >
                    <h2 className="text-4xl font-semibold mb-4">Start Test </h2>
                </button>
            </div>
        </div>
    )
}