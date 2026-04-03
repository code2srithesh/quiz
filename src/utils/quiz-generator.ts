import OpenAI from 'openai';

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

export interface GeneratedQuestion {
    questionText: string;
    questionType: 'mcq' | 'true_false' | 'short_answer';
    difficulty: 'easy' | 'medium' | 'hard';
    options?: Array<{ text: string; isCorrect: boolean }>;
    correctAnswer: string;
    explanation: string;
    sourceSection?: string;
}

interface QuizGenerationParams {
    content: string;
    questionCount: number;
    difficulty: 'easy' | 'medium' | 'hard' | 'mixed';
    questionType: 'mcq' | 'true_false' | 'short_answer' | 'mixed';
    documentTitle: string;
}

/**
 * Generate quiz questions using OpenAI
 */
export async function generateQuizQuestions(
    params: QuizGenerationParams,
): Promise<GeneratedQuestion[]> {
    const { content, questionCount, difficulty, questionType, documentTitle } = params;

    // Build the prompt
    const systemPrompt = `You are an expert educational content creator. Your task is to generate high-quality quiz questions based on provided text content.

Key requirements:
- Questions MUST be directly derived from the provided text
- Avoid generic or hallucinated questions
- For MCQs: provide exactly 4 options with one correct answer and strong distractors
- Include clear explanations grounded in the source material
- Ensure variety in difficulty levels if "mixed" is requested
- Make questions clear, unambiguous, and grammatically correct`;

    const userPrompt = `Generate exactly ${questionCount} quiz questions about this content from "${documentTitle}":

Content:
${content.substring(0, 3000)}

Requirements:
- Question types: ${questionType}
- Difficulty level: ${difficulty}
- Format: Return as a JSON array
- Each question should have: questionText, questionType, difficulty, options (for MCQ), correctAnswer, explanation

Structure for JSON:
[
  {
    "questionText": "...",
    "questionType": "mcq|true_false|short_answer",
    "difficulty": "easy|medium|hard",
    "options": [{"text": "...", "isCorrect": boolean}],
    "correctAnswer": "...",
    "explanation": "..."
  }
]

Generate diverse, relevant questions now:`;

    try {
        const response = await openai.chat.completions.create({
            model: 'gpt-3.5-turbo',
            messages: [
                {
                    role: 'system',
                    content: systemPrompt,
                },
                {
                    role: 'user',
                    content: userPrompt,
                },
            ],
            temperature: 0.7,
            max_tokens: 3000,
        });

        const responseText = response.choices[0]?.message?.content || '[]';

        // Extract JSON from response
        const jsonMatch = responseText.match(/\[[\s\S]*\]/);
        if (!jsonMatch) {
            throw new Error('Invalid response format from OpenAI');
        }

        const questions = JSON.parse(jsonMatch[0]) as GeneratedQuestion[];

        // Validate and normalize questions
        return questions.slice(0, questionCount).map((q) => ({
            ...q,
            options:
                q.questionType === 'mcq'
                    ? q.options || []
                    : q.questionType === 'true_false'
                        ? [
                            { text: 'True', isCorrect: q.correctAnswer.toLowerCase() === 'true' },
                            { text: 'False', isCorrect: q.correctAnswer.toLowerCase() === 'false' },
                        ]
                        : undefined,
        }));
    } catch (error) {
        console.error('Error generating quiz questions:', error);
        throw new Error('Failed to generate quiz questions');
    }
}

/**
 * Generate a study summary after quiz completion
 */
export async function generateStudySummary(
    quizTitle: string,
    weakAreas: string[],
    strongAreas: string[],
): Promise<string> {
    const prompt = `Based on a quiz titled "${quizTitle}", create a personalized study recommendation summary.

Weak areas (needs improvement):
${weakAreas.join(', ')}

Strong areas (well understood):
${strongAreas.join(', ')}

Provide a concise, encouraging summary with specific recommendations for focused study on weak areas. Keep it to 3-4 sentences.`;

    try {
        const response = await openai.chat.completions.create({
            model: 'gpt-3.5-turbo',
            messages: [
                {
                    role: 'user',
                    content: prompt,
                },
            ],
            temperature: 0.7,
            max_tokens: 300,
        });

        return response.choices[0]?.message?.content || 'Keep practicing to improve your knowledge!';
    } catch (error) {
        console.error('Error generating study summary:', error);
        return 'Continue your learning journey and revisit challenging topics!';
    }
}

/**
 * Extract main topics from document
 */
export async function extractMainTopics(
    content: string,
    documentTitle: string,
): Promise<string[]> {
    const prompt = `Based on this document titled "${documentTitle}", identify the 5 main topics/concepts covered:

Content preview:
${content.substring(0, 2000)}

Return as a JSON array of strings with just the topic names, no explanations.`;

    try {
        const response = await openai.chat.completions.create({
            model: 'gpt-3.5-turbo',
            messages: [
                {
                    role: 'user',
                    content: prompt,
                },
            ],
            temperature: 0.5,
            max_tokens: 200,
        });

        const responseText = response.choices[0]?.message?.content || '[]';
        const jsonMatch = responseText.match(/\[[\s\S]*\]/);

        if (!jsonMatch) {
            return ['Topic 1', 'Topic 2', 'Topic 3'];
        }

        return JSON.parse(jsonMatch[0]);
    } catch (error) {
        console.error('Error extracting main topics:', error);
        return ['General Knowledge', 'Key Concepts', 'Applications'];
    }
}
