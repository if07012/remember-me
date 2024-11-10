'use client';
import React, { useEffect, useState } from 'react';

const Quiz = ({ kali }: any) => {
    const [item, setItems] = useState<any>([]);
    const [result, setResult] = useState<string>("");
    const [hasil, sethasil] = useState<string>("");
    const [index, setIndex] = useState<number>(0);
    useEffect(() => {
        const items = []
        for (let j = 1; j <= 2; j++) {
            for (let i = 1; i <= 10; i++) {
                items.push({
                    a: i,
                    b: kali,
                    result: i * kali
                })
            }
        }
        const shuffledArray = [...items]; // Copy the original array

        // Shuffle the copied array
        for (let i = shuffledArray.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffledArray[i], shuffledArray[j]] = [shuffledArray[j], shuffledArray[i]]; // Swap elements
        }
        setItems(shuffledArray);
    }, [kali])
    const currentItem = item[index];
    const onSubmit = (result: string) => {
        if (parseInt(result) === currentItem.result) {
            const items = [...item];
            items[index].hasil = "Benar";
            items[index].jawaban = result;
            setItems([...items])
            sethasil("Jawaban benar");
        } else {
            const items = [...item];
            items[index].hasil = "Salah";
            items[index].jawaban = result;
            setItems([...items])
            sethasil("Jawaban benar");
            sethasil("Jawaban Salah");
        }
        setTimeout(() => {
            sethasil("");
            setResult("");
            setIndex(index + 1);
        }, 500)
    }
    if (!currentItem)
        return <>
        </>
    return (
        <>
            <div className="container mx-auto p-6">
                <h1 className="text-5xl font-bold text-gray-900 text-center">
                    Quiz Perkalian {kali}
                </h1>
                <div className="container mx-auto p-6">
                    <div className="flex flex-col md:flex-row gap-6">
                        <div className="bg-blue-500 p-4 text-white rounded w-fit">
                            {item.map((n: any) => {
                                if (!n.jawaban)
                                    return <></>
                                return <div>
                                    {n.b} X {n.a}  = {n.jawaban} ({n.hasil === "Salah" ? n.hasil + " jawaban nya " + n.result : n.hasil})
                                </div>
                            })}
                        </div>
                        <div className="bg-green-500 p-4 text-white rounded w-fit">
                            {index <= item.length &&
                                <h1 className="text-5xl font-bold text-gray-900 flex items-center justify-center">
                                    {currentItem.b}X {currentItem.a}  = <input type='number' value={result}
                                        onChange={(e) => {
                                            setResult(e.target.value)
                                        }}
                                        onKeyDown={e => {
                                            if (e.key === "Enter") {
                                                onSubmit(result);
                                            }
                                        }}
                                    />
                                    &nbsp;
                                    <button className="bg-green-500 hover:bg-blue-600
                             text-white font-bold py-2 px-4 rounded"
                                        onClick={() => {
                                            onSubmit(result);
                                        }}>
                                        Submit
                                    </button>
                                </h1>
                            }
                        </div>
                    </div>
                </div>
                <a href={"/perkalian/" + kali} className="bg-blue-500 text-white font-bold py-2 px-4 rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500">
                    Back to Learning
                </a>
            </div>
        </>
    );
};

export default Quiz;