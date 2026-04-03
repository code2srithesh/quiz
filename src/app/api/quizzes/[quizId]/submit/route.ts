import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs';
import { prisma } from '@/lib/prisma';
import { calculateScorePercentage } from '@/utils/validation';

export async function POST(
    request: NextRequest,
    { params }: { params: { quizId: string } },
) {
    try {
        const { userId } = auth();

        if (!userId) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { quizId } = params;
        const { answers } = await request.json();

        const user = await prisma.user.findUnique({
            where: { clerkId: userId },
        });

        if (!user) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        // Get quiz with questions
        const quiz = await prisma.quiz.findUnique({
            where: { id: quizId },
            include: { questions: true },
        });

        if (!quiz || quiz.userId !== user.id) {
            return NextResponse.json({ error: 'Quiz not found' }, { status: 404 });
        }

        // Calculate score
        let correctCount = 0;
        Object.entries(answers).forEach(([questionId, userAnswer]) => {
            const question = quiz.questions.find((q: typeof quiz.questions[0]) => q.id === questionId);
            if (question) {
                // Normalize answer comparison
                const answerText =
                    typeof userAnswer === 'string' ? userAnswer.toLowerCase().trim() : '';
                const correctText = question.correctAnswer
                    .toLowerCase()
                    .trim();

                // For MCQ typed as string, check direct match
                if (answerText === correctText) {
                    correctCount++;
                }
            }
        });

        const score = calculateScorePercentage(correctCount, quiz.questions.length);

        // Create attempt record
        const attempt = await prisma.quizAttempt.create({
            data: {
                userId: user.id,
                quizId,
                score,
                totalQuestions: quiz.questions.length,
                correctAnswers: correctCount,
                timeTaken: 0,
                mode: 'normal',
                answers: {
                    create: Object.entries(answers).map(([questionId, userAnswer]) => ({
                        questionId,
                        userAnswer: typeof userAnswer === 'string' ? userAnswer : '',
                        isCorrect: (() => {
                            const question = quiz.questions.find((q: typeof quiz.questions[0]) => q.id === questionId);
                            if (!question) return false;
                            return (
                                (userAnswer as string)
                                    .toLowerCase()
                                    .trim() === question.correctAnswer.toLowerCase().trim()
                            );
                        })(),
                    })),
                },
            },
        });

        return NextResponse.json({
            success: true,
            attemptId: attempt.id,
            score,
        });
    } catch (error) {
        console.error('Quiz submission error:', error);
        return NextResponse.json(
            { error: 'Failed to submit quiz' },
            { status: 500 },
        );
    }
}
