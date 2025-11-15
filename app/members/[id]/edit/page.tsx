import Link from 'next/link';

async function fetchMember(id: string) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || ''}/api/members/${id}`, { cache: 'no-store' });
  if (!res.ok) return null;
  return await res.json();
}

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const member = await fetchMember(id);
  if (!member) return (
    <div className="p-6">
      <p>Member not found.</p>
      <Link className="text-blue-600" href="/members">Back</Link>
    </div>
  );

  async function onSubmit(formData: FormData) {
    'use server';
    const name = String(formData.get('name') || '').trim();
    const location = String(formData.get('location') || '').trim();
    await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || ''}/api/members/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, location }),
      cache: 'no-store',
    });
  }

  return (
    <div className="p-6">
      <h1 className="text-xl font-semibold mb-4">Edit Member</h1>
      <form action={onSubmit} className="max-w-md space-y-4">
        <div>
          <label className="block text-sm mb-1">Name</label>
          <input name="name" defaultValue={member.name} className="w-full rounded-md border px-3 py-2" required />
        </div>
        <div>
          <label className="block text-sm mb-1">Location</label>
          <input name="location" defaultValue={member.location} className="w-full rounded-md border px-3 py-2" required />
        </div>
        <button className="rounded bg-black px-3 py-2 text-white">Update</button>
      </form>
    </div>
  );
}


