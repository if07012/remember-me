'use client';
import React, { useEffect, useState } from 'react';

const Perkalian = ({ kali }: any) => {
    const [item, setItems] = useState<any>([]);
    useEffect(() => {
        const items = []
        for (let i = 1; i <= 10; i++) {
            items.push(`${kali} X ${i} = ${parseInt(kali) * i}`)
        }
        setItems(items);
    }, [kali])
    return (
        <>
            <div className="container mx-auto p-6">
                <h1 className="text-5xl font-bold text-gray-900 text-center">
                    Perkalian {kali}
                </h1>
                <div className="container mx-auto p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {item.map((n: any) => {
                            return <div className="bg-white p-4 shadow-md rounded-lg">
                                <h1 className="text-5xl font-bold text-gray-900">
                                    {n}
                                </h1>
                            </div>
                        })}

                    </div>
                </div>
                <a href={"/perkalian/" + kali+"/quiz"} className="bg-blue-500 text-white font-bold py-2 px-4 rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500">
                    QUiz
                </a>
            </div>

        </>
    );
};

export default Perkalian;