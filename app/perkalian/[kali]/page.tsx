
import Perkalian from './components/perkalian';

export default async function Page({ params }: { params: { kali: string } }) {
    const kali = params.kali;

    return (
        <>
            <Perkalian kali={kali} />
        </>
    );
}