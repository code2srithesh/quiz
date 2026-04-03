import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs';
import { prisma } from '@/lib/prisma';
import { generateQuizQuestions } from '@/utils/quiz-generator';

export async function POST(request: NextRequest) {
    try {
        const { userId } = auth();

        if (!userId) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { documentId, questionCount, difficulty, questionType } = await request.json();

        // Validate inputs
        if (!documentId || !questionCount || !difficulty || !questionType) {
            return NextResponse.json(
                { error: 'Missing required parameters' },
                { status: 400 },
            );
        }

        const user = await prisma.user.findUnique({
            where: { clerkId: userId },
        });

        if (!user) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        // Get document
        const document = await prisma.document.findUnique({
            where: { id: documentId },
        });

        if (!document || document.userId !== user.id) {
            return NextResponse.json({ error: 'Document not found' }, { status: 404 });
        }

        if (!document.extractedText) {
            return NextResponse.json(
                { error: 'No content to generate quiz from' },
                { status: 400 },
            );
        }

        // Generate questions using AI
        const questions = await generateQuizQuestions({
            content: document.extractedText,
            questionCount,
            difficulty,
            questionType,
            documentTitle: document.title,
        });

        // Create quiz in database
        const quiz = await prisma.quiz.create({
            data: {
                userId: user.id,
                documentId,
                title: `${document.title} - ${questionCount} Question Quiz`,
                questionCount,
                difficulty,
                questionType,
                questions: {
                    create: questions.map((q, index) => ({
                        questionText: q.questionText,
                        questionType: q.questionType,
                        difficulty: q.difficulty,
                        options: q.options ? JSON.stringify(q.options) : null,
                        correctAnswer: q.correctAnswer,
                        explanation: q.explanation,
                        order: index + 1,
                    })),
                },
            },
        });

        return NextResponse.json({
            success: true,
            quizId: quiz.id,
        });
    } catch (error) {
        console.error('Quiz generation error:', error);
        return NextResponse.json(
            { error: 'Failed to generate quiz' },
            { status: 500 },
        );
    }
}
