export default function Page() {
  async function onSubmit(formData: FormData) {
    'use server';
    const name = String(formData.get('name') || '').trim();
    const location = String(formData.get('location') || '').trim();
    if (!name || !location) return;
    await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || ''}/api/members`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, location }),
      cache: 'no-store',
    });
  }

  return (
    <div className="p-6">
      <h1 className="text-xl font-semibold mb-4">Add Member</h1>
      <form action={onSubmit} className="max-w-md space-y-4">
        <div>
          <label className="block text-sm mb-1">Name</label>
          <input name="name" className="w-full rounded-md border px-3 py-2" required />
        </div>
        <div>
          <label className="block text-sm mb-1">Location</label>
          <input name="location" className="w-full rounded-md border px-3 py-2" required />
        </div>
        <button className="rounded bg-black px-3 py-2 text-white">Save</button>
      </form>
    </div>
  );
}


