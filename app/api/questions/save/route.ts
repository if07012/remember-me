import { NextResponse } from 'next/server';
import { appendSheetData, getGoogleSheet } from '@/app/lib/googleSheets';

export async function POST(request: Request) {
    try {
        const { category, question } = await request.json();

        if (!category || !question) {
            return NextResponse.json({ error: 'Category and questions array are required' }, { status: 400 });
        }
        question.options = JSON.stringify(question.options);
        question.wrongAnswerExplanations = JSON.stringify(question.wrongAnswerExplanations);
        // Format questions for the sheet
        const sheetData = [question]

        // Get the Google Sheet document
        const doc = await getGoogleSheet(process.env.QUESTIONS_SHEET_ID || '');

        // Get or create the category-exam sheet
        const sheetName = `${category}-exam`;
        let sheet = doc.sheetsByTitle[sheetName];

        if (!sheet) {
            // If sheet doesn't exist, create it
            sheet = await doc.addSheet({ title: sheetName });
        }

        // Save to Google Sheets in the category-exam sheet
        await appendSheetData(
            process.env.QUESTIONS_SHEET_ID || '',
            sheetData,
            sheetName
        );

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Error saving questions:', error);
        return NextResponse.json(
            { error: error instanceof Error ? error.message : 'Failed to save questions' },
            { status: 500 }
        );
    }
} 