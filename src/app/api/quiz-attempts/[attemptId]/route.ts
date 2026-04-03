import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs';
import { prisma } from '@/lib/prisma';

export async function GET(
    request: NextRequest,
    { params }: { params: { attemptId: string } },
) {
    try {
        const { userId } = auth();

        if (!userId) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { attemptId } = params;

        const user = await prisma.user.findUnique({
            where: { clerkId: userId },
        });

        if (!user) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        const attempt = await prisma.quizAttempt.findUnique({
            where: { id: attemptId },
            include: {
                answers: {
                    include: {
                        question: true,
                    },
                },
            },
        });

        if (!attempt || attempt.userId !== user.id) {
            return NextResponse.json({ error: 'Attempt not found' }, { status: 404 });
        }

        const details = attempt.answers.map((answer) => ({
            id: answer.question.id,
            questionText: answer.question.questionText,
            userAnswer: answer.userAnswer,
            correctAnswer: answer.question.correctAnswer,
            explanation: answer.question.explanation,
            difficulty: answer.question.difficulty,
            isCorrect: answer.isCorrect,
        }));

        return NextResponse.json({
            attempt: {
                id: attempt.id,
                score: attempt.score,
                correctAnswers: attempt.correctAnswers,
                totalQuestions: attempt.totalQuestions,
                completedAt: attempt.completedAt,
            },
            details,
        });
    } catch (error) {
        console.error('Error fetching attempt:', error);
        return NextResponse.json(
            { error: 'Failed to fetch attempt' },
            { status: 500 },
        );
    }
}
