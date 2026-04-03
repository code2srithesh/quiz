'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { Modal } from '@/components/ui/Modal';

interface QuizQuestion {
    id: string;
    questionText: string;
    questionType: 'mcq' | 'true_false' | 'short_answer';
    options?: Array<{ text: string; isCorrect: boolean }>;
    correctAnswer: string;
    explanation: string;
    difficulty: string;
}

export default function QuizPage({ params }: { params: { quizId: string } }) {
    const router = useRouter();
    const [quiz, setQuiz] = useState<any>(null);
    const [questions, setQuestions] = useState<QuizQuestion[]>([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [answers, setAnswers] = useState<{ [key: string]: string }>({});
    const [loading, setLoading] = useState(true);
    const [submitted, setSubmitted] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);

    useEffect(() => {
        // Fetch quiz and questions
        fetch(`/api/quizzes/${params.quizId}`)
            .then((res) => res.json())
            .then((data) => {
                setQuiz(data.quiz);
                setQuestions(data.questions);
                setLoading(false);
            })
            .catch((err) => {
                console.error(err);
                setLoading(false);
            });
    }, [params.quizId]);

    const currentQuestion = questions[currentIndex];
    const progress = ((currentIndex + 1) / questions.length) * 100;
    const isAnswered = answers[currentQuestion?.id];

    const handleAnswer = (value: string) => {
        setAnswers({
            ...answers,
            [currentQuestion.id]: value,
        });
    };

    const handleNext = () => {
        if (currentIndex < questions.length - 1) {
            setCurrentIndex(currentIndex + 1);
        }
    };

    const handlePrevious = () => {
        if (currentIndex > 0) {
            setCurrentIndex(currentIndex - 1);
        }
    };

    const handleSubmitQuiz = async () => {
        setSubmitted(true);

        try {
            const response = await fetch(`/api/quizzes/${params.quizId}/submit`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ answers }),
            });

            if (!response.ok) throw new Error('Failed to submit');

            const data = await response.json();
            router.push(`/quiz/results/${data.attemptId}`);
        } catch (error) {
            console.error('Submission error:', error);
            setSubmitted(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-center">
                    <div className="animate-spin text-4xl mb-4">⚙️</div>
                    <p className="text-gray-400">Loading quiz...</p>
                </div>
            </div>
        );
    }

    if (!quiz || questions.length === 0) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <Card variant="glass" className="p-8 text-center">
                    <p className="text-error">Quiz not found</p>
                </Card>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-dark-bg py-8 px-4">
            <div className="max-w-3xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <div className="flex items-center justify-between mb-4">
                        <h1 className="text-2xl font-bold">{quiz.title}</h1>
                        <button
                            onClick={() => setShowConfirm(true)}
                            className="text-gray-400 hover:text-white"
                        >
                            ✕
                        </button>
                    </div>
                    <ProgressBar
                        value={currentIndex + 1}
                        max={questions.length}
                        label={`Question ${currentIndex + 1} of ${questions.length}`}
                    />
                </div>

                {/* Question card */}
                <Card variant="glass" className="p-8 mb-8">
                    <p className="text-gray-400 mb-2">{currentQuestion.difficulty}</p>
                    <h2 className="text-2xl font-bold mb-8">{currentQuestion.questionText}</h2>

                    {/* Options */}
                    {currentQuestion.questionType === 'mcq' && currentQuestion.options && (
                        <div className="space-y-3">
                            {currentQuestion.options.map((option, index) => (
                                <button
                                    key={index}
                                    onClick={() => handleAnswer(option.text)}
                                    className={`w-full p-4 rounded-lg border-2 text-left transition-all duration-300 ${answers[currentQuestion.id] === option.text ? 'border-primary bg-primary/10 text-white' : 'border-glass-lighter text-gray-300 hover:border-primary/50'}`}
                                >
                                    {option.text}
                                </button>
                            ))}
                        </div>
                    )}

                    {currentQuestion.questionType === 'true_false' && currentQuestion.options && (
                        <div className="grid grid-cols-2 gap-4">
                            {currentQuestion.options.map((option, index) => (
                                <button
                                    key={index}
                                    onClick={() => handleAnswer(option.text)}
                                    className={`p-4 rounded-lg border-2 font-semibold transition-all duration-300 ${answers[currentQuestion.id] === option.text ? 'border-accent bg-accent/10 text-white' : 'border-glass-lighter text-gray-300 hover:border-accent/50'}`}
                                >
                                    {option.text}
                                </button>
                            ))}
                        </div>
                    )}

                    {currentQuestion.questionType === 'short_answer' && (
                        <textarea
                            value={answers[currentQuestion.id] || ''}
                            onChange={(e) => handleAnswer(e.target.value)}
                            placeholder="Type your answer here..."
                            className="w-full bg-dark-card border border-glass-lighter rounded-lg p-4 text-white placeholder-gray-500 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/30 min-h-28"
                        />
                    )}
                </Card>

                {/* Navigation */}
                <div className="flex items-center justify-between gap-4">
                    <Button
                        onClick={handlePrevious}
                        disabled={currentIndex === 0}
                        variant="outline"
                    >
                        ← Previous
                    </Button>

                    {currentIndex === questions.length - 1 ? (
                        <Button
                            onClick={() => setShowConfirm(true)}
                            isLoading={submitted}
                        >
                            Submit Quiz
                        </Button>
                    ) : (
                        <Button
                            onClick={handleNext}
                            disabled={!isAnswered}
                        >
                            Next →
                        </Button>
                    )}
                </div>

                {/* Confirm modal */}
                <Modal
                    isOpen={showConfirm}
                    onClose={() => setShowConfirm(false)}
                    title="Confirm Submission"
                >
                    <p className="mb-6 text-gray-300">
                        You have answered {Object.keys(answers).length} out of {questions.length} questions. Ready to submit?
                    </p>
                    <div className="flex gap-4">
                        <Button
                            onClick={() => setShowConfirm(false)}
                            variant="outline"
                            fullWidth
                        >
                            Continue
                        </Button>
                        <Button
                            onClick={handleSubmitQuiz}
                            isLoading={submitted}
                            fullWidth
                        >
                            Submit & View Results
                        </Button>
                    </div>
                </Modal>
            </div>
        </div>
    );
}
