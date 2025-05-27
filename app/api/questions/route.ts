import { readSheetData } from '@/app/lib/googleSheets';
import { NextResponse } from 'next/server';

const GROQ_API_ENDPOINT = 'https://api.groq.com/openai/v1/chat/completions';

/**
 * Extracts JSON from markdown content that might be wrapped in code blocks
 * Handles cases like:
 * 1. Pure JSON
 * 2. JSON wrapped in ```json blocks
 * 3. JSON wrapped in ``` blocks
 */
function extractJsonFromMarkdown(markdown: string): any {
  // Try parsing as pure JSON first
  try {
    return JSON.parse(markdown);
  } catch (e) {
    // Not pure JSON, continue to markdown extraction
  }

  // Look for JSON in code blocks
  const codeBlockRegex = /```(?:json)?\s*\n?([\s\S]*?)\n?```/;
  const match = markdown.match(codeBlockRegex);

  if (match && match[1]) {
    try {
      return JSON.parse(match[1].trim());
    } catch (e) {
      console.error('Failed to parse JSON from code block:', e);
      throw new Error('Invalid JSON in markdown code block');
    }
  }

  // If no code blocks found, try to find array-like content
  const arrayMatch = markdown.match(/\[\s*\{[\s\S]*\}\s*\]/);
  if (arrayMatch) {
    try {
      return JSON.parse(arrayMatch[0]);
    } catch (e) {
      console.error('Failed to parse JSON from markdown content:', e);
      throw new Error('Invalid JSON in markdown content');
    }
  }

  throw new Error('No valid JSON found in markdown content');
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const category = searchParams.get('category');
  const language = searchParams.get('language') || 'Indonesia';

  if (!category) {
    return NextResponse.json({ error: 'Category is required' }, { status: 400 });
  }

  try {
    // Load questions from Google Sheets
    const data = await readSheetData(
      process.env.QUESTIONS_SHEET_ID || '',
      `${category}-exam`
    );

    // Filter questions by category and language
    const questions = data
      .map((question: any) => ({
        type: question.type,
        question: question.question,
        explanation: question.explanation,
        language: question.language,
        ...(question.type === 'multiple_choice' ? {
          options: JSON.parse(question.options),
          correctAnswer: question.correctAnswer,
          wrongAnswerExplanations: JSON.parse(question.wrongAnswerExplanations),
        } : {
          correctAnswer: question.correctAnswer,
          caseSensitive: question.caseSensitive,
          acceptableAnswers: question.acceptableAnswers,
        })
      }));

    if (questions.length === 0) {
      return NextResponse.json(
        { error: 'No questions found for this category' },
        { status: 404 }
      );
    }

    return NextResponse.json(questions);
  } catch (error) {
    console.error('Error fetching questions:', error);
    return NextResponse.json(
      { error: 'Failed to fetch questions' },
      { status: 500 }
    );
  }
} 