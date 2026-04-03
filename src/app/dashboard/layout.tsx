'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { UserButton } from '@clerk/nextjs';

const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: '📊' },
    { name: 'Upload PDF', href: '/dashboard/upload', icon: '📄' },
    { name: 'Quiz History', href: '/dashboard/history', icon: '📋' },
    { name: 'Analytics', href: '/dashboard/analytics', icon: '📈' },
    { name: 'Settings', href: '/dashboard/settings', icon: '⚙️' },
];

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const pathname = usePathname();

    return (
        <div className="min-h-screen bg-dark-bg">
            {/* Sidebar */}
            <aside
                className={`fixed left-0 top-0 h-screen bg-dark-surface border-r border-glass-lighter transition-all duration-300 z-30 ${sidebarOpen ? 'w-64' : 'w-20'}`}
            >
                <div className="h-16 flex items-center justify-between px-4 border-b border-glass-lighter">
                    {sidebarOpen && (
                        <Link href="/dashboard" className="text-xl font-bold text-primary">
                            Quiz Generator
                        </Link>
                    )}
                    <button
                        onClick={() => setSidebarOpen(!sidebarOpen)}
                        className="p-2 hover:bg-glass-light rounded-lg transition-colors"
                    >
                        {sidebarOpen ? '👈' : '👉'}
                    </button>
                </div>

                <nav className="p-4 space-y-2">
                    {navigation.map((item) => {
                        const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-300 ${isActive ? 'bg-primary text-white shadow-glow' : 'text-gray-400 hover:bg-glass-light hover:text-white'}`}
                            >
                                <span className="text-xl">{item.icon}</span>
                                {sidebarOpen && <span className="font-medium">{item.name}</span>}
                            </Link>
                        );
                    })}
                </nav>
            </aside>

            {/* Main content */}
            <div className={`transition-all duration-300 ${sidebarOpen ? 'ml-64' : 'ml-20'}`}>
                {/* Top bar */}
                <div className="h-16 border-b border-glass-lighter bg-dark-surface/50 backdrop-blur flex items-center justify-between px-6">
                    <h1 className="text-2xl font-bold text-white">PDF Quiz Generator</h1>
                    <UserButton afterSignOutUrl="/" />
                </div>

                {/* Page content */}
                <main className="p-6">{children}</main>
            </div>
        </div>
    );
}
