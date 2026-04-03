'use client';

import { useEffect, useState } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Skeleton } from '@/components/ui/Skeleton';
import { Input } from '@/components/ui/Input';
import Link from 'next/link';

interface QuizAttempt {
    id: string;
    quizTitle: string;
    documentTitle: string;
    score: number;
    totalQuestions: number;
    correctAnswers: number;
    completedAt: string;
    difficulty: string;
}

export default function HistoryPage() {
    const [attempts, setAttempts] = useState<QuizAttempt[]>([]);
    const [filteredAttempts, setFilteredAttempts] = useState<QuizAttempt[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        // Simulate loading history data
        setTimeout(() => {
            const mockData = [
                {
                    id: '1',
                    quizTitle: 'ML Fundamentals',
                    documentTitle: 'Machine Learning Intro',
                    score: 85,
                    totalQuestions: 10,
                    correctAnswers: 8,
                    completedAt: new Date().toISOString(),
                    difficulty: 'medium',
                },
                {
                    id: '2',
                    quizTitle: 'Python Basics',
                    documentTitle: 'Python Programming',
                    score: 72,
                    totalQuestions: 15,
                    correctAnswers: 11,
                    completedAt: new Date(Date.now() - 86400000).toISOString(),
                    difficulty: 'easy',
                },
            ];
            setAttempts(mockData);
            setFilteredAttempts(mockData);
            setLoading(false);
        }, 1000);
    }, []);

    useEffect(() => {
        const filtered = attempts.filter(
            (attempt) =>
                attempt.quizTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
                attempt.documentTitle.toLowerCase().includes(searchQuery.toLowerCase()),
        );
        setFilteredAttempts(filtered);
    }, [searchQuery, attempts]);

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-4xl font-bold mb-2">Quiz History</h1>
                <p className="text-gray-400">Review past quizzes and track your progress</p>
            </div>

            <Input
                placeholder="Search quizzes..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
            />

            {loading ? (
                <div className="space-y-4">
                    <Skeleton count={3} height="80px" />
                </div>
            ) : filteredAttempts.length > 0 ? (
                <div className="space-y-4">
                    {filteredAttempts.map((attempt) => (
                        <Card key={attempt.id} variant="subtle" className="p-6">
                            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                                <div className="flex-1">
                                    <h3 className="font-semibold text-lg mb-2">{attempt.quizTitle}</h3>
                                    <p className="text-sm text-gray-400 mb-2">{attempt.documentTitle}</p>
                                    <div className="flex gap-4 text-sm text-gray-500">
                                        <span>
                                            {attempt.correctAnswers}/{attempt.totalQuestions} correct
                                        </span>
                                        <span>
                                            {new Date(attempt.completedAt).toLocaleDateString()}
                                        </span>
                                        <span className="capitalize">{attempt.difficulty}</span>
                                    </div>
                                </div>

                                <div className="flex items-center gap-4">
                                    <div className="text-right">
                                        <p
                                            className="text-3xl font-bold"
                                            style={{
                                                color:
                                                    attempt.score >= 80
                                                        ? '#10b981'
                                                        : attempt.score >= 60
                                                            ? '#f59e0b'
                                                            : '#ef4444',
                                            }}
                                        >
                                            {attempt.score}%
                                        </p>
                                    </div>
                                    <Link href={`/quiz/results/${attempt.id}`}>
                                        <Button size="sm">View Results</Button>
                                    </Link>
                                </div>
                            </div>
                        </Card>
                    ))}
                </div>
            ) : (
                <Card variant="glass" className="p-12 text-center">
                    <p className="text-gray-400 mb-4">No quizzes found</p>
                    <p className="text-gray-500 text-sm">Start by uploading a PDF and generating a quiz</p>
                </Card>
            )}
        </div>
    );
}
