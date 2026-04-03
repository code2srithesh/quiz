'use client';

import { useEffect, useState } from 'react';
import { useUser } from '@clerk/nextjs';
import Link from 'next/link';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Skeleton } from '@/components/ui/Skeleton';

interface Document {
    id: string;
    title: string;
    uploadedAt: string;
    pageCount?: number;
}

interface RecentQuiz {
    id: string;
    title: string;
    score: number;
    totalQuestions: number;
    completedAt: string;
}

export default function DashboardPage() {
    const { user, isLoaded } = useUser();
    const [documents, setDocuments] = useState<Document[]>([]);
    const [recentQuizzes, setRecentQuizzes] = useState<RecentQuiz[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (isLoaded && user) {
            // Simulate loading data
            setTimeout(() => {
                setDocuments([
                    {
                        id: '1',
                        title: 'Introduction to Machine Learning',
                        uploadedAt: new Date().toISOString(),
                        pageCount: 45,
                    },
                ]);
                setRecentQuizzes([
                    {
                        id: '1',
                        title: 'ML Fundamentals Quiz',
                        score: 85,
                        totalQuestions: 10,
                        completedAt: new Date().toISOString(),
                    },
                ]);
                setLoading(false);
            }, 1000);
        }
    }, [isLoaded, user]);

    if (!isLoaded) {
        return <div>Loading...</div>;
    }

    return (
        <div className="space-y-8">
            {/* Welcome section */}
            <div className="space-y-2">
                <h1 className="text-4xl font-bold">Welcome back, {user?.firstName || 'User'}! 👋</h1>
                <p className="text-gray-400">Ready to master new topics? Let's get started.</p>
            </div>

            {/* Quick actions */}
            <div className="grid md:grid-cols-2 gap-6">
                <Card variant="glass" className="p-8">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-gray-400 mb-2">Upload a new PDF</p>
                            <p className="text-2xl font-bold">Get started</p>
                        </div>
                        <div className="text-5xl">📄</div>
                    </div>
                    <Link href="/dashboard/upload" className="mt-4 inline-block">
                        <Button variant="primary">Upload PDF</Button>
                    </Link>
                </Card>

                <Card variant="glass" className="p-8">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-gray-400 mb-2">View your progress</p>
                            <p className="text-2xl font-bold">Analytics</p>
                        </div>
                        <div className="text-5xl">📊</div>
                    </div>
                    <Link href="/dashboard/analytics" className="mt-4 inline-block">
                        <Button variant="secondary">View Analytics</Button>
                    </Link>
                </Card>
            </div>

            {/* Documents section */}
            <div>
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold">Recent Documents</h2>
                    <Link href="/dashboard/upload">
                        <Button variant="outline" size="sm">
                            + Upload More
                        </Button>
                    </Link>
                </div>

                {loading ? (
                    <Card variant="glass" className="p-6">
                        <Skeleton count={2} height="40px" />
                    </Card>
                ) : documents.length > 0 ? (
                    <div className="space-y-3">
                        {documents.map((doc) => (
                            <Card key={doc.id} variant="subtle" className="p-4 flex items-center justify-between hover:bg-dark-card/80">
                                <div>
                                    <p className="font-semibold">{doc.title}</p>
                                    <p className="text-sm text-gray-500">
                                        {doc.pageCount} pages • Uploaded{' '}
                                        {new Date(doc.uploadedAt).toLocaleDateString()}
                                    </p>
                                </div>
                                <Link href={`/dashboard/quiz-generator?documentId=${doc.id}`}>
                                    <Button size="sm">Generate Quiz</Button>
                                </Link>
                            </Card>
                        ))}
                    </div>
                ) : (
                    <Card variant="glass" className="p-12 text-center">
                        <p className="text-gray-400 mb-4">No documents yet</p>
                        <Link href="/dashboard/upload">
                            <Button>Upload your first PDF</Button>
                        </Link>
                    </Card>
                )}
            </div>

            {/* Recent quizzes */}
            <div>
                <h2 className="text-2xl font-bold mb-6">Recent Quizzes</h2>

                {loading ? (
                    <Card variant="glass" className="p-6">
                        <Skeleton count={2} height="60px" />
                    </Card>
                ) : recentQuizzes.length > 0 ? (
                    <div className="space-y-3">
                        {recentQuizzes.map((quiz) => (
                            <Card key={quiz.id} variant="subtle" className="p-4">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="font-semibold">{quiz.title}</p>
                                        <p className="text-sm text-gray-500">
                                            {quiz.score}% • {quiz.totalQuestions} questions
                                        </p>
                                    </div>
                                    <div className="text-3xl font-bold text-primary">{quiz.score}%</div>
                                </div>
                            </Card>
                        ))}
                    </div>
                ) : (
                    <Card variant="glass" className="p-12 text-center">
                        <p className="text-gray-400">No quizzes taken yet</p>
                    </Card>
                )}
            </div>
        </div>
    );
}
