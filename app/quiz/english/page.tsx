"use client"
import { useEffect, useState } from "react";
import { useRouter } from 'next/navigation';

export default function Page() {
    const [levels, setLevels] = useState<any[]>([]);
    const router = useRouter();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const callApi = async () => {
            const response = await fetch('/api/sheet/all?group=English',
                {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json'
                    }
                }
            )
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            const data = await response.json(); // Convert response to JSON
            setLevels([...data]);
            setLoading(false);
        }
        callApi()
    }, [])
    return (
        <div className="flex flex-col items-center justify-center gap-8 min-h-min">
            <h1 className="text-6xl pt-10 font-bold mb-6">English Quiz</h1>

            <div className="flex flex-row flex-wrap gap-3 items-start justify-cente">
                {loading && <>
                    <div className="block p-14 rounded-lg text-center cursor-pointer transition duration-300 animate-pulse"></div>
                    <div className="block p-14 rounded-lg text-center cursor-pointer transition duration-300 animate-pulse"></div>
                    <div className="block p-14 rounded-lg text-center cursor-pointer transition duration-300 animate-pulse"></div>
                    <div className="block p-14 rounded-lg text-center cursor-pointer transition duration-300 animate-pulse"></div>
                </>}
                {!loading && levels.map((n: any) => {
                    return <label
                        className={`block p-8 rounded-lg text-center cursor-pointer transition duration-300 ${n.isPass
                            ? "bg-green-800 border-2 border-green-500 text-white"
                            : "bg-gray-50 hover:bg-blue-50"
                            }`}
                        onClick={() => {
                            if (n.level.replace('English-', '') === "QUIZ")
                                router.push(`/quiz/english/${n.level.replace('English-', '')}/start`)
                            else
                                router.push(`/quiz/english/${n.level.replace('English-', '')}/learn`)
                        }}
                    >
                        <h2 className="text-4xl font-semibold"> {n.level}</h2>
                    </label>
                })}
            </div>


        </div>
    )
}