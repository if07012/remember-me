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
  const language = searchParams.get('language') || 'English';
  const apiKey = process.env.GROQ_API_KEY;

  if (!category) {
    return NextResponse.json({ error: 'Category is required' }, { status: 400 });
  }

  if (!apiKey) {
    return NextResponse.json({ error: 'API key is not configured' }, { status: 500 });
  }

  try {
    const response = await fetch(GROQ_API_ENDPOINT, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        messages: [
          {
            role: 'system',
            content: `You are a highly reliable exam question generator for third grade elementary school students. Generate 5 challenging but fair questions for the ${category} category. 
            Include a mix of multiple choice and fill-in-the-blank questions.
            Ensure questions test understanding rather than just memorization.
            Make explanations detailed and educational.
            
            Format the response as a JSON array of questions where each question follows this structure:
            For multiple choice:
            {
              "type": "multiple_choice",
              "question": "question text",
              "options": ["option1", "option2", "option3", "option4"],
              "correctAnswer": 0-3,
              "explanation": "detailed explanation",
              "wrongAnswerExplanations": ["why option1 is wrong", "", "why option3 is wrong", "why option4 is wrong"],
              "language": "${language}"
            }
            
            For fill in the blank:
            {
              "type": "fill_blank",
              "question": "question text with ___ for blank",
              "correctAnswer": "correct answer",
              "explanation": "detailed explanation",
              "caseSensitive": boolean,
              "acceptableAnswers": ["answer1", "answer2"],
              "language": "${language}"
            }
            
            Ensure all responses are in valid JSON format.
            and for the wrongAnswerExplanations and explanation please provide in "Bahasa Indonesia"
            but for the question and answer please provide in "${language}"
           `
          }
        ],
        model: 'deepseek-r1-distill-llama-70b',
        temperature: 0.5,
        max_tokens: 4096,
        top_p: 0.9,
        stream: false
      })
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      console.error('Groq API error:', errorData);
      throw new Error(`Groq API returned ${response.status}`);
    }

    const completion = await response.json();
    const content = completion.choices?.[0]?.message?.content;

    if (!content) {
      throw new Error('No response from Groq API');
    }

    try {
      // Extract JSON from possible markdown response
      const questions = extractJsonFromMarkdown(content);

      if (!Array.isArray(questions)) {
        throw new Error('Response is not an array');
      }

      questions.forEach((question, index) => {
        if (!question.type || !question.question || !question.explanation) {
          throw new Error(`Question ${index + 1} is missing required fields`);
        }
        if (question.type === 'multiple_choice' && (!Array.isArray(question.options) || !question.wrongAnswerExplanations)) {
          throw new Error(`Multiple choice question ${index + 1} is missing required fields`);
        }
        if (question.type === 'fill_blank' && !question.correctAnswer) {
          throw new Error(`Fill in the blank question ${index + 1} is missing required fields`);
        }
      });

      return NextResponse.json(questions);
    } catch (e) {
      console.error('Failed to parse or validate Groq response:', content);
      throw new Error('Invalid response format from Groq API');
    }
  } catch (error) {
    console.error('Error fetching questions:', error);
    return NextResponse.json(
      { error: 'Failed to fetch questions' },
      { status: 500 }
    );
  }
} 