'use client';

import { useEffect, useState } from 'react';
import { Card } from '@/components/ui/Card';
import { Skeleton } from '@/components/ui/Skeleton';
import {
    LineChart,
    Line,
    BarChart,
    Bar,
    PieChart,
    Pie,
    Cell,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
} from 'recharts';

export default function AnalyticsPage() {
    const [loading, setLoading] = useState(true);
    const [analytics, setAnalytics] = useState<any>(null);

    useEffect(() => {
        // Simulate loading analytics data
        setTimeout(() => {
            setAnalytics({
                averageScore: 78,
                totalAttempts: 12,
                quizzesCompleted: 5,
                improvementTrend: [
                    { date: 'Week 1', score: 65 },
                    { date: 'Week 2', score: 70 },
                    { date: 'Week 3', score: 75 },
                    { date: 'Week 4', score: 78 },
                ],
                scoreDistribution: [
                    { range: '0-50%', count: 2 },
                    { range: '51-75%', count: 5 },
                    { range: '76-90%', count: 3 },
                    { range: '91-100%', count: 2 },
                ],
                topicPerformance: [
                    { topic: 'ML Basics', score: 85 },
                    { topic: 'Neural Networks', score: 72 },
                    { topic: 'NLP', score: 68 },
                    { topic: 'Computer Vision', score: 81 },
                ],
            });
            setLoading(false);
        }, 1000);
    }, []);

    if (loading) {
        return (
            <div className="space-y-8">
                <div>
                    <h1 className="text-4xl font-bold mb-2">Analytics</h1>
                    <p className="text-gray-400">Track your learning progress and performance insights</p>
                </div>
                <div className="grid md:grid-cols-4 gap-6">
                    <Skeleton count={4} height="100px" />
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-4xl font-bold mb-2">Analytics</h1>
                <p className="text-gray-400">Track your learning progress and performance insights</p>
            </div>

            {/* Stats cards */}
            <div className="grid md:grid-cols-4 gap-6">
                <Card variant="glass" className="p-6 text-center">
                    <p className="text-gray-400 mb-2">Average Score</p>
                    <p className="text-4xl font-bold text-primary">{analytics.averageScore}%</p>
                </Card>

                <Card variant="glass" className="p-6 text-center">
                    <p className="text-gray-400 mb-2">Quizzes Completed</p>
                    <p className="text-4xl font-bold text-accent">{analytics.quizzesCompleted}</p>
                </Card>

                <Card variant="glass" className="p-6 text-center">
                    <p className="text-gray-400 mb-2">Total Attempts</p>
                    <p className="text-4xl font-bold text-success">{analytics.totalAttempts}</p>
                </Card>

                <Card variant="glass" className="p-6 text-center">
                    <p className="text-gray-400 mb-2">Improvement</p>
                    <p className="text-4xl font-bold text-warning">+13%</p>
                </Card>
            </div>

            {/* Trend chart */}
            <Card variant="glass" className="p-6">
                <h3 className="text-xl font-bold mb-6">Score Trend</h3>
                <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={analytics.improvementTrend}>
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                        <XAxis dataKey="date" stroke="rgba(255,255,255,0.5)" />
                        <YAxis stroke="rgba(255,255,255,0.5)" />
                        <Tooltip
                            contentStyle={{
                                backgroundColor: '#151b3a',
                                border: '1px solid rgba(255,255,255,0.1)',
                            }}
                        />
                        <Line
                            type="monotone"
                            dataKey="score"
                            stroke="#7c3aed"
                            strokeWidth={3}
                            dot={{ fill: '#7c3aed', r: 5 }}
                        />
                    </LineChart>
                </ResponsiveContainer>
            </Card>

            {/* Two column layout */}
            <div className="grid md:grid-cols-2 gap-6">
                {/* Score distribution */}
                <Card variant="glass" className="p-6">
                    <h3 className="text-xl font-bold mb-6">Score Distribution</h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <PieChart>
                            <Pie
                                data={analytics.scoreDistribution}
                                cx="50%"
                                cy="50%"
                                labelLine={false}
                                label={({ range, count }) => `${range}: ${count}`}
                                outerRadius={80}
                                fill="#8884d8"
                                dataKey="count"
                            >
                                {['#7c3aed', '#06b6d4', '#10b981', '#f59e0b'].map(
                                    (color, index) => (
                                        <Cell key={`cell-${index}`} fill={color} />
                                    ),
                                )}
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

                {/* Topic performance */}
                <Card variant="glass" className="p-6">
                    <h3 className="text-xl font-bold mb-6">Topic Performance</h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={analytics.topicPerformance}>
                            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                            <XAxis dataKey="topic" stroke="rgba(255,255,255,0.5)" />
                            <YAxis stroke="rgba(255,255,255,0.5)" />
                            <Tooltip
                                contentStyle={{
                                    backgroundColor: '#151b3a',
                                    border: '1px solid rgba(255,255,255,0.1)',
                                }}
                            />
                            <Bar dataKey="score" fill="#7c3aed" />
                        </BarChart>
                    </ResponsiveContainer>
                </Card>
            </div>
        </div>
    );
}
