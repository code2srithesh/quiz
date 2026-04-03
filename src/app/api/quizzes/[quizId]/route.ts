import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs';
import { prisma } from '@/lib/prisma';

export async function GET(
    request: NextRequest,
    { params }: { params: { quizId: string } },
) {
    try {
        const { userId } = auth();

        if (!userId) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { quizId } = params;

        const user = await prisma.user.findUnique({
            where: { clerkId: userId },
        });

        if (!user) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        const quiz = await prisma.quiz.findUnique({
            where: { id: quizId },
            include: { questions: { orderBy: { order: 'asc' } } },
        });

        if (!quiz || quiz.userId !== user.id) {
            return NextResponse.json({ error: 'Quiz not found' }, { status: 404 });
        }

        const questions = quiz.questions.map((q: typeof quiz.questions[0]) => ({
            id: q.id,
            questionText: q.questionText,
            questionType: q.questionType,
            options: q.options ? JSON.parse(q.options as string) : null,
            correctAnswer: q.correctAnswer,
            explanation: q.explanation,
            difficulty: q.difficulty,
        }));

        return NextResponse.json({
            quiz: {
                id: quiz.id,
                title: quiz.title,
                description: quiz.description,
                questionCount: quiz.questionCount,
            },
            questions,
        });
    } catch (error) {
        console.error('Error fetching quiz:', error);
        return NextResponse.json({ error: 'Failed to fetch quiz' }, { status: 500 });
    }
}
