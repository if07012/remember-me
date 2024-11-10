import Quiz from "../components/Quiz";


export default async function Page({ params }: { params: { kali: string } }) {
    const kali = params.kali;

    return (
        <>
            <Quiz kali={kali} />
        </>
    );
}