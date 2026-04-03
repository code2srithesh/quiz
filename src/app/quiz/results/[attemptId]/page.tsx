'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { getPerformanceLevel } from '@/utils/validation';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

export default function ResultsPage({ params }: { params: { attemptId: string } }) {
    const router = useRouter();
    const [attempt, setAttempt] = useState<any>(null);
    const [questions, setQuestions] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [expandedQuestion, setExpandedQuestion] = useState<string | null>(null);

    useEffect(() => {
        fetch(`/api/quiz-attempts/${params.attemptId}`)
            .then((res) => res.json())
            .then((data) => {
                setAttempt(data.attempt);
                setQuestions(data.details);
                setLoading(false);
            })
            .catch((err) => {
                console.error(err);
                setLoading(false);
            });
    }, [params.attemptId]);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-center">
                    <div className="animate-spin text-4xl mb-4">⚙️</div>
                    <p className="text-gray-400">Loading results...</p>
                </div>
            </div>
        );
    }

    if (!attempt) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <Card variant="glass" className="p-8 text-center">
                    <p className="text-error">Results not found</p>
                </Card>
            </div>
        );
    }

    const performanceLevel = getPerformanceLevel(attempt.score);
    const byDifficulty = questions.reduce(
        (acc: any, q: any) => {
            const level = q.difficulty;
            if (!acc[level]) {
                acc[level] = { correct: 0, total: 0 };
            }
            acc[level].total++;
            if (q.isCorrect) acc[level].correct++;
            return acc;
        },
        {},
    );

    const chartData = Object.entries(byDifficulty).map(([level, data]: any) => ({
        name: level,
        correct: data.correct,
        incorrect: data.total - data.correct,
    }));

    const pieData = [
        { name: 'Correct', value: attempt.correctAnswers },
        { name: 'Incorrect', value: attempt.totalQuestions - attempt.correctAnswers },
    ];

    const COLORS = ['#10b981', '#ef4444'];

    return (
        <div className="min-h-screen bg-dark-bg py-8 px-4">
            <div className="max-w-4xl mx-auto">
                {/* Score section */}
                <div className="mb-8">
                    <Card
                        variant="glass"
                        className="p-12 text-center bg-gradient-to-br from-primary/20 to-accent/20"
                    >
                        <p className="text-gray-400 mb-4">Quiz complete! Here's your score:</p>
                        <div className="text-7xl font-bold mb-4" style={{ color: performanceLevel.color }}>
                            {attempt.score}%
                        </div>
                        <p className="text-2xl font-semibold mb-6">{performanceLevel.message}</p>
                        <p className="text-gray-300">
                            You answered {attempt.correctAnswers} out of {attempt.totalQuestions} questions
                            correctly
                        </p>
                    </Card>
                </div>

                {/* Analytics section */}
                <div className="grid md:grid-cols-2 gap-6 mb-8">
                    <Card variant="glass" className="p-6">
                        <h3 className="text-xl font-bold mb-6">Performance by Difficulty</h3>
                        <ResponsiveContainer width="100%" height={300}>
                            <BarChart data={chartData}>
                                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                                <XAxis dataKey="name" stroke="rgba(255,255,255,0.5)" />
                                <YAxis stroke="rgba(255,255,255,0.5)" />
                                <Tooltip
                                    contentStyle={{
                                        backgroundColor: '#151b3a',
                                        border: '1px solid rgba(255,255,255,0.1)',
                                    }}
                                />
                                <Legend />
                                <Bar dataKey="correct" fill="#10b981" />
                                <Bar dataKey="incorrect" fill="#ef4444" />
                            </BarChart>
                        </ResponsiveContainer>
                    </Card>

                    <Card variant="glass" className="p-6">
                        <h3 className="text-xl font-bold mb-6">Overall Breakdown</h3>
                        <ResponsiveContainer width="100%" height={300}>
                            <PieChart>
                                <Pie
                                    data={pieData}
                                    cx="50%"
                                    cy="50%"
                                    labelLine={false}
                                    label={({ name, value }) => `${name}: ${value}`}
                                    outerRadius={80}
                                    fill="#8884d8"
                                    dataKey="value"
                                >
                                    {pieData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index]} />
                                    ))}
                                </Pie>
                                <Tooltip
                                    contentStyle={{
                                        backgroundColor: '#151b3a',
                                        border: '1px solid rgba(255,255,255,0.1)',
                                    }}
                                />
                            </PieChart>
                        </ResponsiveContainer>
                    </Card>
                </div>

                {/* Question review */}
                <div>
                    <h3 className="text-2xl font-bold mb-6">Question Review</h3>
                    <div className="space-y-4">
                        {questions.map((q, index) => (
                            <Card
                                key={q.id}
                                variant="subtle"
                                className="p-6"
                                onClick={() =>
                                    setExpandedQuestion(expandedQuestion === q.id ? null : q.id)
                                }
                            >
                                <div className="flex items-start justify-between cursor-pointer">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-3 mb-2">
                                            <span
                                                className={`text-2xl ${q.isCorrect ? 'text-success' : 'text-error'}`}
                                            >
                                                {q.isCorrect ? '✓' : '✗'}
                                            </span>
                                            <p className="font-semibold">Question {index + 1}</p>
                                            <span
                                                className={`px-2 py-1 rounded text-xs font-semibold capitalize ${q.difficulty === 'easy' ? 'bg-green-500/20 text-green-300' : q.difficulty === 'medium' ? 'bg-yellow-500/20 text-yellow-300' : 'bg-red-500/20 text-red-300'}`}
                                            >
                                                {q.difficulty}
                                            </span>
                                        </div>
                                        <p className="text-gray-300">{q.questionText}</p>
                                    </div>
                                    <span className="text-gray-400 ml-4">{expandedQuestion === q.id ? '▼' : '▶'}</span>
                                </div>

                                {expandedQuestion === q.id && (
                                    <div className="mt-6 pt-6 border-t border-glass-lighter space-y-4">
                                        <div>
                                            <p className="text-sm text-gray-400 mb-2">Your answer:</p>
                                            <p
                                                className={`p-3 rounded-lg ${q.isCorrect ? 'bg-success/10 text-success' : 'bg-error/10 text-error'}`}
                                            >
                                                {q.userAnswer || '(not answered)'}
                                            </p>
                                        </div>

                                        {!q.isCorrect && (
                                            <div>
                                                <p className="text-sm text-gray-400 mb-2">Correct answer:</p>
                                                <p className="p-3 rounded-lg bg-success/10 text-success">
                                                    {q.correctAnswer}
                                                </p>
                                            </div>
                                        )}

                                        <div>
                                            <p className="text-sm text-gray-400 mb-2">Explanation:</p>
                                            <p className="text-gray-300">{q.explanation}</p>
                                        </div>
                                    </div>
                                )}
                            </Card>
                        ))}
                    </div>
                </div>

                {/* Actions */}
                <div className="mt-8 flex gap-4">
                    <Link href="/dashboard" className="flex-1">
                        <Button fullWidth variant="outline">
                            Back to Dashboard
                        </Button>
                    </Link>
                    <Link href="/dashboard" className="flex-1">
                        <Button fullWidth>
                            Take Another Quiz
                        </Button>
                    </Link>
                </div>
            </div>
        </div>
    );
}
