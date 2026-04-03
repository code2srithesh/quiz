import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    console.log('🌱 Seeding database...');

    // Clear existing data
    await prisma.quizAnswer.deleteMany();
    await prisma.quizAttempt.deleteMany();
    await prisma.question.deleteMany();
    await prisma.quiz.deleteMany();
    await prisma.document.deleteMany();
    await prisma.userSettings.deleteMany();
    await prisma.user.deleteMany();

    // Create demo user
    const user = await prisma.user.create({
        data: {
            clerkId: 'user_demo_123',
            email: 'demo@quizforge.ai',
            name: 'Demo User',
            settings: {
                create: {
                    theme: 'dark',
                    animationsEnabled: true,
                    defaultQuestionCount: 10,
                    defaultDifficulty: 'medium',
                    defaultQuestionType: 'mixed',
                },
            },
        },
    });

    console.log(`✅ Created user: ${user.email}`);

    // Create demo document
    const document = await prisma.document.create({
        data: {
            userId: user.id,
            title: 'Introduction to Machine Learning',
            description: 'A comprehensive guide to ML fundamentals including supervised and unsupervised learning.',
            fileSize: 2500000,
            pageCount: 45,
            storagePath: '/uploads/demo/ml-intro.pdf',
            keywords: ['machine learning', 'AI', 'algorithms', 'data science'],
            mainTopics: ['Supervised Learning', 'Unsupervised Learning', 'Neural Networks', 'Deep Learning'],
            extractedText: `Machine Learning is a subset of artificial intelligence that enables systems to learn and improve from experience without being explicitly programmed...`,
        },
    });

    console.log(`✅ Created document: ${document.title}`);

    // Create demo quiz
    const quiz = await prisma.quiz.create({
        data: {
            userId: user.id,
            documentId: document.id,
            title: 'Machine Learning Fundamentals Quiz',
            description: 'Test your knowledge on ML basics',
            questionCount: 5,
            difficulty: 'medium',
            questionType: 'mixed',
            questions: {
                create: [
                    {
                        questionText: 'What is the primary goal of supervised learning?',
                        questionType: 'mcq',
                        difficulty: 'easy',
                        correctAnswer: 'To predict output values based on labeled training data',
                        explanation:
                            'Supervised learning uses labeled training data where both input and output are known. The algorithm learns the mapping function to make predictions on new unseen data.',
                        order: 1,
                        options: JSON.stringify([
                            { text: 'To predict output values based on labeled training data', isCorrect: true },
                            { text: 'To find patterns in unlabeled data', isCorrect: false },
                            { text: 'To reduce data dimensionality', isCorrect: false },
                            { text: 'To cluster similar data points', isCorrect: false },
                        ]),
                    },
                    {
                        questionText: 'True or False: Neural networks can only be used for classification tasks.',
                        questionType: 'true_false',
                        difficulty: 'medium',
                        correctAnswer: 'False',
                        explanation:
                            'Neural networks are versatile and can be used for both classification and regression tasks. They are powerful enough to handle complex non-linear problems in either category.',
                        order: 2,
                        options: JSON.stringify([
                            { text: 'True', isCorrect: false },
                            { text: 'False', isCorrect: true },
                        ]),
                    },
                    {
                        questionText: 'What is overfitting in machine learning?',
                        questionType: 'mcq',
                        difficulty: 'hard',
                        correctAnswer: 'When a model learns the training data too well, including its noise and quirks',
                        explanation:
                            'Overfitting occurs when a model learns the specific details and noise of the training data rather than learning the underlying pattern. This causes poor generalization to new data.',
                        order: 3,
                        options: JSON.stringify([
                            { text: 'When a model fails to learn the training data', isCorrect: false },
                            { text: 'When a model learns the training data too well, including its noise and quirks', isCorrect: true },
                            { text: 'When a model has too few parameters', isCorrect: false },
                            { text: 'When data preprocessing is done incorrectly', isCorrect: false },
                        ]),
                    },
                    {
                        questionText: 'Name two common unsupervised learning algorithms.',
                        questionType: 'short_answer',
                        difficulty: 'medium',
                        correctAnswer: 'K-means clustering and Principal Component Analysis (PCA)',
                        explanation:
                            'Common unsupervised algorithms include K-means clustering for grouping similar data points, and PCA for dimensionality reduction. Other examples include hierarchical clustering and DBSCAN.',
                        order: 4,
                    },
                    {
                        questionText: 'What is the purpose of cross-validation in machine learning?',
                        questionType: 'mcq',
                        difficulty: 'medium',
                        correctAnswer: 'To assess model performance and ensure it generalizes well to unseen data',
                        explanation:
                            'Cross-validation divides data into multiple subsets, training and testing on different combinations. This provides a more robust estimate of model performance and helps detect overfitting.',
                        order: 5,
                        options: JSON.stringify([
                            { text: 'To increase the size of training data', isCorrect: false },
                            { text: 'To assess model performance and ensure it generalizes well to unseen data', isCorrect: true },
                            { text: 'To reduce computation time', isCorrect: false },
                            { text: 'To eliminate outliers from data', isCorrect: false },
                        ]),
                    },
                ],
            },
        },
    });

    console.log(`✅ Created quiz: ${quiz.title}`);

    // Create demo quiz attempt
    const attempt = await prisma.quizAttempt.create({
        data: {
            userId: user.id,
            quizId: quiz.id,
            score: 80,
            totalQuestions: 5,
            correctAnswers: 4,
            timeTaken: 600,
            mode: 'normal',
        },
    });

    console.log(`✅ Created quiz attempt with score: ${attempt.score}`);

    console.log('🎉 Database seeded successfully!');
}

main()
    .catch((e) => {
        console.error('Seed failed:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
