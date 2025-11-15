import Link from 'next/link';
import { useDebouncedCallback } from 'use-debounce';
import { Suspense } from 'react';

async function fetchMembers(q: string) {
  const url = q ? `/api/members?q=${encodeURIComponent(q)}` : '/api/members';
  const res = await fetch(url, { cache: 'no-store' });
  if (!res.ok) throw new Error('Failed to fetch members');
  const json = await res.json();
  return json.data || [];
}

function Search({ defaultValue }: { defaultValue?: string }) {
  const updateQuery = useDebouncedCallback((value: string) => {
    const params = new URLSearchParams(window.location.search);
    if (value) params.set('q', value); else params.delete('q');
    window.location.search = params.toString();
  }, 300);

  return (
    <input
      type="text"
      placeholder="Search name or location..."
      defaultValue={defaultValue}
      onChange={(e) => updateQuery(e.target.value)}
      className="block w-full max-w-md rounded-md border px-3 py-2"
    />
  );
}

async function MembersTable({ q }: { q: string }) {
  const members = await fetchMembers(q);
  return (
    <div className="mt-4 overflow-x-auto">
      <table className="min-w-full border">
        <thead>
          <tr className="bg-gray-50">
            <th className="p-2 text-left">Name</th>
            <th className="p-2 text-left">Location</th>
            <th className="p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {members.map((m: any) => (
            <tr key={m.id} className="border-t">
              <td className="p-2">{m.name}</td>
              <td className="p-2">{m.location}</td>
              <td className="p-2 flex gap-2">
                <Link href={`/members/${m.id}/edit`} className="text-blue-600">Edit</Link>
                <form
                  action={`/api/members/${m.id}`}
                  method="post"
                  onSubmit={async (e) => {
                    e.preventDefault();
                    await fetch(`/api/members/${m.id}`, { method: 'DELETE' });
                    window.location.reload();
                  }}
                >
                  <button type="submit" className="text-red-600">Delete</button>
                </form>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default async function Page({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
  const { q = '' } = await searchParams;
  return (
    <div className="p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">Members</h1>
        <Link className="rounded bg-black px-3 py-2 text-white" href="/members/new">Add Member</Link>
      </div>
      {/* @ts-expect-error Server Component within same file */}
      <Search defaultValue={q} />
      <Suspense>
        {/* @ts-expect-error Async Server Component */}
        <MembersTable q={q} />
      </Suspense>
    </div>
  );
}


