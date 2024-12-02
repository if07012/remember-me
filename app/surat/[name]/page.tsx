import AcmeLogo from '@/app/ui/acme-logo';
import Drag from '@/app/ui/dashboard/drag';
import LoginForm from '@/app/ui/login-form';
import Link from 'next/link';

export default async function Page({ params }: { params: { name: string } }) {
    const name = params.name;
    return (
        <main>
            <Link href={'/surat/albalad'}>Al Balad</Link> -  <Link href={'/surat/allail'}>Al Lail</Link> - <Link href={'/surat/assham'}>AS Shams</Link>  - <Link href={'/surat/alfajr'}>Al Fajr</Link>
            <h1 className='text-5xl'>Surat {name}</h1>
            <Drag surat={name}/>
        </main>
    );
}