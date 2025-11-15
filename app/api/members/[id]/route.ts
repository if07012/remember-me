import { NextResponse } from 'next/server';
import { deleteRowById, readRowById, updateRowById } from '@/app/lib/googleSheets';

const SHEET_ID = process.env.MEMBERS_SHEET_ID as string;
const SHEET_NAME = process.env.MEMBERS_SHEET_NAME || 'members';

export async function GET(
    _request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        if (!SHEET_ID) {
            return NextResponse.json({ error: 'MEMBERS_SHEET_ID not configured' }, { status: 500 });
        }
        const { id } = await params;
        const row = await readRowById(SHEET_ID, SHEET_NAME, id);
        if (!row) return NextResponse.json({ error: 'Not found' }, { status: 404 });
        return NextResponse.json(row);
    } catch (error) {
        console.error('GET /api/members/[id] error:', error);
        return NextResponse.json({ error: 'Failed to read member' }, { status: 500 });
    }
}

export async function PUT(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        if (!SHEET_ID) {
            return NextResponse.json({ error: 'MEMBERS_SHEET_ID not configured' }, { status: 500 });
        }
        const { id } = await params;
        const body = await request.json();
        const { name, location } = body || {};
        if (!name && !location) {
            return NextResponse.json({ error: 'Nothing to update' }, { status: 400 });
        }
        await updateRowById(SHEET_ID, SHEET_NAME, id, { name, location });
        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('PUT /api/members/[id] error:', error);
        return NextResponse.json({ error: 'Failed to update member' }, { status: 500 });
    }
}

export async function DELETE(
    _request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        if (!SHEET_ID) {
            return NextResponse.json({ error: 'MEMBERS_SHEET_ID not configured' }, { status: 500 });
        }
        const { id } = await params;
        await deleteRowById(SHEET_ID, SHEET_NAME, id);
        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('DELETE /api/members/[id] error:', error);
        return NextResponse.json({ error: 'Failed to delete member' }, { status: 500 });
    }
}


