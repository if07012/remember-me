import { NextResponse } from 'next/server';
import { appendSheetData, getGoogleSheet } from '@/app/lib/googleSheets';

export async function POST(request: Request) {
    try {
        const { category, answers, userId } = await request.json();

        if (!category || !answers || !Array.isArray(answers)) {
            return NextResponse.json({ error: 'Category and answers array are required' }, { status: 400 });
        }

        // Format submission data for the sheet
        const submissionData = answers.map(answer => ({
            userId: userId || 'anonymous',
            category,
            questionId: answer.questionId,
            userAnswer: answer.userAnswer,
            isCorrect: answer.isCorrect,
            submittedAt: new Date().toISOString(),
        }));

        // Get the Google Sheet document
        const doc = await getGoogleSheet(process.env.QUESTIONS_SHEET_ID || '');

        // Get or create the submissions sheet
        const sheetName = `${category}-submissions`;
        let sheet = doc.sheetsByTitle[sheetName];

        if (!sheet) {
            // If sheet doesn't exist, create it
            sheet = await doc.addSheet({ title: sheetName });
        }

        // Save to Google Sheets
        await appendSheetData(
            process.env.QUESTIONS_SHEET_ID || '',
            submissionData,
            sheetName
        );

        return NextResponse.json({
            success: true,
            summary: {
                totalQuestions: answers.length,
                correctAnswers: answers.filter(a => a.isCorrect).length,
                submittedAt: new Date().toISOString()
            }
        });
    } catch (error) {
        console.error('Error saving submission:', error);
        return NextResponse.json(
            { error: error instanceof Error ? error.message : 'Failed to save submission' },
            { status: 500 }
        );
    }
} 