import { NextResponse } from 'next/server';
import { readSheetData } from '@/app/lib/googleSheets';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');

    if (!category) {
        return NextResponse.json({ error: 'Category is required' }, { status: 400 });
    }

    try {
        // Read data from the category-specific sheet
        const data = await readSheetData(
            process.env.QUESTIONS_SHEET_ID || '',
            category
        );

        // Get unique materials with their latest timestamp
        return NextResponse.json(data);
    } catch (error) {
        console.error('Error fetching materials:', error);
        return NextResponse.json(
            { error: 'Failed to fetch materials' },
            { status: 500 }
        );
    }
} 