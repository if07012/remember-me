import { NextResponse } from 'next/server';
import { createRowWithId, listRowsBySheet } from '@/app/lib/googleSheets';

const SHEET_ID = process.env.MEMBERS_SHEET_ID as string;
const SHEET_NAME = process.env.MEMBERS_SHEET_NAME || 'members';

export async function GET(request: Request) {
  try {
    if (!SHEET_ID) {
      return NextResponse.json({ error: 'MEMBERS_SHEET_ID not configured' }, { status: 500 });
    }

    const { searchParams } = new URL(request.url);
    const q = (searchParams.get('q') || '').toLowerCase();

    const rows = await listRowsBySheet(SHEET_ID, SHEET_NAME);
    const data = q
      ? rows.filter((r: any) => {
          const name = (r.name || '').toLowerCase();
          const location = (r.location || '').toLowerCase();
          return name.includes(q) || location.includes(q);
        })
      : rows;

    return NextResponse.json({ data });
  } catch (error) {
    console.error('GET /api/members error:', error);
    return NextResponse.json({ error: 'Failed to list members' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    if (!SHEET_ID) {
      return NextResponse.json({ error: 'MEMBERS_SHEET_ID not configured' }, { status: 500 });
    }
    const body = await request.json();
    const { name, location } = body || {};
    if (!name || !location) {
      return NextResponse.json({ error: 'name and location are required' }, { status: 400 });
    }
    const { id } = await createRowWithId(SHEET_ID, SHEET_NAME, { name, location });
    return NextResponse.json({ id, name, location });
  } catch (error) {
    console.error('POST /api/members error:', error);
    return NextResponse.json({ error: 'Failed to create member' }, { status: 500 });
  }
}


