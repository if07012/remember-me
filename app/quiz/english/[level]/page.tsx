"use client"
import { useState } from "react";


export default async function Page({ params }: { params: Promise<{ level: string }> }) {

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
            <div className="w-full max-w-2xl mx-auto space-y-6">
                <form className="space-y-6">

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