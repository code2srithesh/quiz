// Validation utilities for the application

export const VALID_QUESTION_TYPES = ['mcq', 'true_false', 'short_answer', 'mixed'] as const;
export const VALID_DIFFICULTIES = ['easy', 'medium', 'hard', 'mixed'] as const;
export const VALID_QUIZ_MODES = ['normal', 'exam', 'revision'] as const;

export const QUESTION_COUNT_OPTIONS = [5, 10, 15, 20] as const;
export const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB
export const ALLOWED_FILE_TYPES = ['application/pdf'];

/**
 * Validate PDF file
 */
export function validatePDFFile(
    file: File | undefined,
): { valid: boolean; error?: string } {
    if (!file) {
        return { valid: false, error: 'No file selected' };
    }

    if (!ALLOWED_FILE_TYPES.includes(file.type)) {
        return { valid: false, error: 'Only PDF files are allowed' };
    }

    if (file.size > MAX_FILE_SIZE) {
        return {
            valid: false,
            error: `File size must be less than ${MAX_FILE_SIZE / 1024 / 1024}MB`,
        };
    }

    return { valid: true };
}

/**
 * Validate quiz generation parameters
 */
export function validateQuizParams(params: {
    questionCount?: number;
    difficulty?: string;
    questionType?: string;
}): { valid: boolean; error?: string } {
    if (params.questionCount && !QUESTION_COUNT_OPTIONS.includes(params.questionCount as any)) {
        return { valid: false, error: 'Invalid question count' };
    }

    if (params.difficulty && !VALID_DIFFICULTIES.includes(params.difficulty as any)) {
        return { valid: false, error: 'Invalid difficulty level' };
    }

    if (params.questionType && !VALID_QUESTION_TYPES.includes(params.questionType as any)) {
        return { valid: false, error: 'Invalid question type' };
    }

    return { valid: true };
}

/**
 * Format file size for display
 */
export function formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';

    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
}

/**
 * Calculate score percentage
 */
export function calculateScorePercentage(correct: number, total: number): number {
    if (total === 0) return 0;
    return Math.round((correct / total) * 100);
}

/**
 * Get performance level based on score
 */
export function getPerformanceLevel(
    score: number,
): {
    level: 'excellent' | 'good' | 'fair' | 'needs-improvement';
    color: string;
    message: string;
} {
    if (score >= 90) {
        return { level: 'excellent', color: '#10b981', message: 'Excellent!' };
    }
    if (score >= 75) {
        return { level: 'good', color: '#3b82f6', message: 'Great work!' };
    }
    if (score >= 60) {
        return { level: 'fair', color: '#f59e0b', message: 'Good effort' };
    }
    return { level: 'needs-improvement', color: '#ef4444', message: 'Keep practicing!' };
}
