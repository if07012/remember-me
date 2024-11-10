import Perkalian from "./components/Perkalian";


export default async function Page({ params }: { params: { kali: string } }) {
    const kali = params.kali;

    return (
        <>
            <a href={"/perkalian/1"} className="bg-blue-500 text-white font-bold py-2 px-4 rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500">
                Perkalian 1
            </a>
            &nbsp;
            <a href={"/perkalian/2"} className="bg-blue-500 text-white font-bold py-2 px-4 rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500">
                Perkalian 2
            </a>
            &nbsp;
            <a href={"/perkalian/3"} className="bg-blue-500 text-white font-bold py-2 px-4 rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500">
                Perkalian 3
            </a>
            &nbsp;
            <a href={"/perkalian/4"} className="bg-blue-500 text-white font-bold py-2 px-4 rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500">
                Perkalian 4
            </a>
            &nbsp;
            <a href={"/perkalian/5"} className="bg-blue-500 text-white font-bold py-2 px-4 rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500">
                Perkalian 5
            </a>
            &nbsp;
            <Perkalian kali={kali} />
        </>
    );
}