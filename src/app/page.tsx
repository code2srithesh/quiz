'use client';

import { useAuth } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { LandingHero, FeaturesSection, CTASection } from '@/components/landing/LandingComponents';

export default function Home() {
    const { isSignedIn, isLoaded } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (isLoaded && isSignedIn) {
            router.push('/dashboard');
        }
    }, [isLoaded, isSignedIn, router]);

    if (!isLoaded) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin text-4xl mb-4">⚙️</div>
                    <p className="text-gray-400">Loading...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-dark-bg text-white">
            <header className="fixed top-0 left-0 right-0 z-40 bg-dark-bg/80 backdrop-blur-md border-b border-glass-lighter">
                <nav className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
                    <div className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                        Quiz Generator
                    </div>
                    <div className="flex gap-4">
                        <a
                            href="/sign-in"
                            className="px-6 py-2 text-gray-300 hover:text-white transition-colors"
                        >
                            Sign In
                        </a>
                        <a
                            href="/sign-up"
                            className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary-light transition-all"
                        >
                            Get Started
                        </a>
                    </div>
                </nav>
            </header>

            <main className="pt-20">
                <LandingHero />
                <FeaturesSection />
                <CTASection />
            </main>

            <footer className="border-t border-glass-lighter py-8 px-4 mt-20">
                <div className="max-w-6xl mx-auto text-center text-gray-500">
                    <p>&copy; 2024 PDF Quiz Generator. All rights reserved.</p>
                </div>
            </footer>
        </div>
    );
}
