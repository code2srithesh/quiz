import type { Metadata } from 'next';
import { ClerkProvider } from '@clerk/nextjs';
import './globals.css';

export const metadata: Metadata = {
    title: 'PDF Quiz Generator - Create Quizzes from PDFs',
    description: 'Transform your PDFs into intelligent quizzes with AI',
    viewport: 'width=device-width, initial-scale=1',
    keywords: ['quiz', 'PDF', 'AI', 'learning', 'educational'],
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <ClerkProvider>
            <html lang="en" suppressHydrationWarning>
                <head>
                    <meta charSet="utf-8" />
                    <link rel="icon" href="/favicon.ico" />
                </head>
                <body className="bg-dark-bg text-gray-100">
                    <main>{children}</main>
                </body>
            </html>
        </ClerkProvider>
    );
}
