'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';

const features = [
    {
        icon: '📄',
        title: 'Smart PDF Upload',
        description: 'Seamlessly upload and process PDF documents of any topic',
    },
    {
        icon: '🧠',
        title: 'AI-Powered Generation',
        description: 'Intelligent quiz creation using advanced language models',
    },
    {
        icon: '📊',
        title: 'Rich Analytics',
        description: 'Track progress, identify weak areas, and improve systematically',
    },
    {
        icon: '⚡',
        title: 'Multiple Quiz Modes',
        description: 'Choose from MCQ, True/False, Short Answer, and mixed modes',
    },
    {
        icon: '🎯',
        title: 'Difficulty Control',
        description: 'Generate quizzes at easy, medium, hard, or mixed difficulty levels',
    },
    {
        icon: '📈',
        title: 'Performance Insights',
        description: 'Get detailed feedback on your learning journey and improvements',
    },
];

export function LandingHero() {
    return (
        <section className="relative min-h-screen overflow-hidden flex items-center justify-center pt-20 px-4">
            {/* Animated background gradient */}
            <div className="absolute inset-0 -z-10">
                <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-3xl animate-float" />
                <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-accent/20 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }} />
            </div>

            <div className="max-w-5xl mx-auto text-center">
                <h1 className="text-6xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent animate-fade-in">
                    QuizForge AI
                </h1>

                <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-2xl mx-auto animate-slide-in">
                    Transform your PDFs into intelligent, adaptive quizzes with AI. Learn smarter, not harder.
                </p>

                <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16 animate-slide-in">
                    <Link href="/sign-up">
                        <Button size="lg" className="w-full sm:w-auto">
                            Get Started Free
                        </Button>
                    </Link>
                    <Link href="/dashboard">
                        <Button size="lg" variant="outline" className="w-full sm:w-auto">
                            View Demo
                        </Button>
                    </Link>
                </div>

                {/* Hero card showcase */}
                <div className="relative">
                    <Card variant="glass" className="p-8 md:p-12">
                        <div className="aspect-video bg-gradient-to-br from-primary/10 to-accent/10 rounded-lg flex items-center justify-center">
                            <div className="text-6xl">✨</div>
                        </div>
                    </Card>
                </div>
            </div>
        </section>
    );
}

export function FeaturesSection() {
    return (
        <section className="py-20 px-4">
            <div className="max-w-6xl mx-auto">
                <h2 className="text-4xl md:text-5xl font-bold text-center mb-16">
                    Powerful Features for Smart Learning
                </h2>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {features.map((feature, i) => (
                        <Card key={i} variant="glass" className="p-6 hover:shadow-glow">
                            <div className="text-4xl mb-4">{feature.icon}</div>
                            <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                            <p className="text-gray-400">{feature.description}</p>
                        </Card>
                    ))}
                </div>
            </div>
        </section>
    );
}

export function CTASection() {
    return (
        <section className="py-20 px-4">
            <div className="max-w-3xl mx-auto">
                <Card variant="glass" className="p-12 text-center">
                    <h2 className="text-4xl font-bold mb-4">Ready to Transform Your Learning?</h2>
                    <p className="text-lg text-gray-300 mb-8">
                        Join thousands of students and professionals who use QuizForge AI to master new topics faster.
                    </p>
                    <Link href="/sign-up">
                        <Button size="lg" fullWidth>
                            Start Your Free Trial
                        </Button>
                    </Link>
                </Card>
            </div>
        </section>
    );
}
