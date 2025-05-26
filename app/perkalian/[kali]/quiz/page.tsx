import Quiz from "../components/Quiz";


export default async function Page({ params }: { params: Promise<{ kali: string }> }) {
    const kali = await params

    return (
        <>
            <Quiz kali={kali} />
        </>
    );
}