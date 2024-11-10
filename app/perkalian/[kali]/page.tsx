import Perkalian from "./components/Perkalian";


export default async function Page({ params }: { params: { kali: string } }) {
    const kali = params.kali;

    return (
        <>
            <Perkalian kali={kali} />
        </>
    );
}