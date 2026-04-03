'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { QUIZ_CONFIG } from '@/utils/constants';

export default function SettingsPage() {
    const [theme, setTheme] = useState<'dark' | 'light'>('dark');
    const [animationsEnabled, setAnimationsEnabled] = useState(true);
    const [defaultQuestionCount, setDefaultQuestionCount] = useState(10);
    const [defaultDifficulty, setDefaultDifficulty] = useState<'easy' | 'medium' | 'hard'>('medium');
    const [defaultQuestionType, setDefaultQuestionType] = useState<'mcq' | 'true_false' | 'short_answer' | 'mixed'>('mixed');
    const [saved, setSaved] = useState(false);

    const handleSave = async () => {
        try {
            const response = await fetch('/api/settings', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    theme,
                    animationsEnabled,
                    defaultQuestionCount,
                    defaultDifficulty,
                    defaultQuestionType,
                }),
            });

            if (response.ok) {
                setSaved(true);
                setTimeout(() => setSaved(false), 3000);
            }
        } catch (error) {
            console.error('Error saving settings:', error);
        }
    };

    return (
        <div className="space-y-8 max-w-2xl">
            <div>
                <h1 className="text-4xl font-bold mb-2">Settings</h1>
                <p className="text-gray-400">Customize your quiz generation experience</p>
            </div>

            {saved && (
                <div className="p-4 bg-success/10 border border-success/50 rounded-lg text-success">
                    ✓ Settings saved successfully!
                </div>
            )}

            {/* Theme */}
            <Card variant="glass" className="p-6">
                <h3 className="text-xl font-bold mb-4">Theme</h3>
                <div className="space-y-3">
                    {['dark', 'light'].map((t) => (
                        <label key={t} className="flex items-center gap-3 cursor-pointer">
                            <input
                                type="radio"
                                name="theme"
                                value={t}
                                checked={theme === t}
                                onChange={(e) => setTheme(e.target.value as any)}
                                className="w-4 h-4"
                            />
                            <span className="capitalize">{t} Mode</span>
                        </label>
                    ))}
                </div>
            </Card>

            {/* Animations */}
            <Card variant="glass" className="p-6">
                <h3 className="text-xl font-bold mb-4">Animations</h3>
                <label className="flex items-center gap-3 cursor-pointer">
                    <input
                        type="checkbox"
                        checked={animationsEnabled}
                        onChange={(e) => setAnimationsEnabled(e.target.checked)}
                        className="w-4 h-4"
                    />
                    <span>Enable smooth animations</span>
                </label>
            </Card>

            {/* Default quiz settings */}
            <Card variant="glass" className="p-6">
                <h3 className="text-xl font-bold mb-4">Default Quiz Settings</h3>

                <div className="mb-6">
                    <label className="block text-sm font-medium mb-3">Default Question Count</label>
                    <div className="grid grid-cols-4 gap-2">
                        {QUIZ_CONFIG.QUESTION_OPTIONS.map((count) => (
                            <button
                                key={count}
                                onClick={() => setDefaultQuestionCount(count)}
                                className={`p-3 rounded-lg border-2 transition-all ${defaultQuestionCount === count ? 'border-primary bg-primary/10' : 'border-glass-lighter hover:border-primary'}`}
                            >
                                {count}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="mb-6">
                    <label className="block text-sm font-medium mb-3">Default Difficulty</label>
                    <div className="space-y-2">
                        {['easy', 'medium', 'hard'].map((diff) => (
                            <label key={diff} className="flex items-center gap-3 cursor-pointer">
                                <input
                                    type="radio"
                                    name="difficulty"
                                    value={diff}
                                    checked={defaultDifficulty === diff}
                                    onChange={(e) => setDefaultDifficulty(e.target.value as any)}
                                />
                                <span className="capitalize">{diff}</span>
                            </label>
                        ))}
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium mb-3">Default Question Type</label>
                    <div className="grid grid-cols-2 gap-2">
                        {[
                            { value: 'mcq', label: 'MCQ' },
                            { value: 'true_false', label: 'True/False' },
                            { value: 'short_answer', label: 'Short Answer' },
                            { value: 'mixed', label: 'Mixed' },
                        ].map(({ value, label }) => (
                            <button
                                key={value}
                                onClick={() => setDefaultQuestionType(value as any)}
                                className={`p-3 rounded-lg border-2 transition-all text-sm ${defaultQuestionType === value ? 'border-accent bg-accent/10' : 'border-glass-lighter hover:border-accent'}`}
                            >
                                {label}
                            </button>
                        ))}
                    </div>
                </div>
            </Card>

            <Button fullWidth onClick={handleSave}>
                Save Settings
            </Button>
        </div>
    );
}
