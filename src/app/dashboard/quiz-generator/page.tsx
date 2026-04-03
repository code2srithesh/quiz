'use client';

import { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { QUIZ_CONFIG } from '@/utils/constants';

export default function QuizGeneratorPage() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const documentId = searchParams.get('documentId');

    const [documentTitle, setDocumentTitle] = useState<string>('');
    const [selectedCount, setSelectedCount] = useState(10);
    const [selectedDifficulty, setSelectedDifficulty] = useState<'easy' | 'medium' | 'hard' | 'mixed'>('mixed');
    const [selectedType, setSelectedType] = useState<'mcq' | 'true_false' | 'short_answer' | 'mixed'>('mixed');
    const [generating, setGenerating] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!documentId) {
            router.push('/dashboard/upload');
            return;
        }

        // Fetch document details
        fetch(`/api/documents/${documentId}`)
            .then((res) => res.json())
            .then((data) => {
                if (data.error) throw new Error(data.error);
                setDocumentTitle(data.title);
                setLoading(false);
            })
            .catch((err) => {
                setError(err.message);
                setLoading(false);
            });
    }, [documentId, router]);

    const handleGenerateQuiz = async () => {
        setGenerating(true);
        setError(null);

        try {
            const response = await fetch('/api/quizzes/generate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    documentId,
                    questionCount: selectedCount,
                    difficulty: selectedDifficulty,
                    questionType: selectedType,
                }),
            });

            if (!response.ok) {
                throw new Error('Failed to generate quiz');
            }

            const data = await response.json();
            router.push(`/quiz/${data.quizId}`);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Generation failed');
            setGenerating(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-center">
                    <div className="animate-spin text-4xl mb-4">⚙️</div>
                    <p className="text-gray-400">Loading...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-8 max-w-2xl mx-auto">
            <div>
                <h1 className="text-4xl font-bold mb-2">Generate Quiz</h1>
                <p className="text-gray-400">Customize your quiz from "{documentTitle}"</p>
            </div>

            <Card variant="glass" className="p-8">
                {/* Question count */}
                <div className="mb-8">
                    <label className="block text-lg font-semibold mb-4">Number of Questions</label>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                        {QUIZ_CONFIG.QUESTION_OPTIONS.map((count) => (
                            <button
                                key={count}
                                onClick={() => setSelectedCount(count)}
                                className={`p-4 rounded-lg border-2 transition-all duration-300 font-semibold ${selectedCount === count ? 'border-primary bg-primary/10 text-primary' : 'border-glass-lighter text-gray-400 hover:border-primary'}`}
                            >
                                {count}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Difficulty */}
                <div className="mb-8">
                    <label className="block text-lg font-semibold mb-4">Difficulty Level</label>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                        {['easy', 'medium', 'hard', 'mixed'].map((level) => (
                            <button
                                key={level}
                                onClick={() => setSelectedDifficulty(level as any)}
                                className={`p-4 rounded-lg border-2 transition-all duration-300 font-semibold capitalize ${selectedDifficulty === level ? 'border-primary bg-primary/10 text-primary' : 'border-glass-lighter text-gray-400 hover:border-primary'}`}
                            >
                                {level}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Question type */}
                <div className="mb-8">
                    <label className="block text-lg font-semibold mb-4">Question Type</label>
                    <div className="grid grid-cols-2 gap-3">
                        {[
                            { value: 'mcq', label: 'MCQ Only' },
                            { value: 'true_false', label: 'True/False' },
                            { value: 'short_answer', label: 'Short Answer' },
                            { value: 'mixed', label: 'Mixed' },
                        ].map((type) => (
                            <button
                                key={type.value}
                                onClick={() => setSelectedType(type.value as any)}
                                className={`p-4 rounded-lg border-2 transition-all duration-300 font-semibold ${selectedType === type.value ? 'border-accent bg-accent/10 text-accent' : 'border-glass-lighter text-gray-400 hover:border-accent'}`}
                            >
                                {type.label}
                            </button>
                        ))}
                    </div>
                </div>

                {error && (
                    <div className="mb-6 p-4 bg-error/10 border border-error/50 rounded-lg text-error">
                        {error}
                    </div>
                )}

                <Button
                    fullWidth
                    isLoading={generating}
                    onClick={handleGenerateQuiz}
                    className="h-12 text-lg"
                >
                    {generating ? 'Generating Quiz...' : 'Generate Quiz'}
                </Button>
            </Card>

            {/* Quiz preview info */}
            <Card variant="subtle" className="p-6">
                <p className="text-gray-400 text-sm">
                    ✨ Your quiz will be generated with {selectedCount} questions at {selectedDifficulty}{' '}
                    difficulty level. The system will analyze your PDF content to create relevant and
                    meaningful questions.
                </p>
            </Card>
        </div>
    );
}
