// Application constants

export const APP_NAME = 'PDF Quiz Generator';
export const APP_DESCRIPTION = 'Transform PDFs into intelligent quizzes with AI';

// Branding
export const APP_COLORS = {
    primary: '#7c3aed', // Purple
    accent: '#06b6d4', // Cyan
    success: '#10b981',
    error: '#ef4444',
    warning: '#f59e0b',
    dark: '#0a0e27',
};

// Quiz Constants
export const QUIZ_CONFIG = {
    MIN_QUESTIONS: 5,
    MAX_QUESTIONS: 20,
    DEFAULT_QUESTIONS: 10,
    QUESTION_OPTIONS: [5, 10, 15, 20],
    DIFFICULTIES: ['easy', 'medium', 'hard', 'mixed'],
    QUESTION_TYPES: ['mcq', 'true_false', 'short_answer', 'mixed'],
    MODES: ['normal', 'exam', 'revision'],
};

// PDF Constants
export const PDF_CONFIG = {
    MAX_SIZE_MB: 50,
    MAX_SIZE_BYTES: 50 * 1024 * 1024,
    ALLOWED_TYPES: ['application/pdf'],
    EXTRACTION_TIMEOUT: 30000,
};

// Pagination
export const PAGINATION = {
    DOCUMENTS_PER_PAGE: 10,
    QUIZZES_PER_PAGE: 10,
    HISTORY_PER_PAGE: 20,
};

// Animation Durations (ms)
export const ANIMATION_DURATION = {
    FAST: 200,
    NORMAL: 300,
    SLOW: 500,
    EXTRA_SLOW: 800,
};

// Routes
export const ROUTES = {
    HOME: '/',
    DASHBOARD: '/dashboard',
    UPLOAD: '/dashboard/upload',
    QUIZ_GENERATOR: '/dashboard/quiz-generator',
    QUIZ: '/quiz',
    RESULTS: '/quiz/results',
    HISTORY: '/dashboard/history',
    ANALYTICS: '/dashboard/analytics',
    SETTINGS: '/dashboard/settings',
    AUTH_CALLBACK: '/auth/callback',
    SIGN_IN: '/sign-in',
    SIGN_UP: '/sign-up',
};

// Error Messages
export const ERROR_MESSAGES = {
    GENERIC: 'Something went wrong. Please try again.',
    PDF_INVALID: 'Invalid PDF file. Please upload a valid PDF.',
    PDF_TOO_LARGE: 'PDF file is too large. Maximum size is 50MB.',
    EXTRACTION_FAILED: 'Failed to extract text from PDF.',
    GENERATION_FAILED: 'Failed to generate quiz. Please try again.',
    UPLOAD_FAILED: 'Failed to upload file. Please try again.',
    NO_CONTENT: 'Could not extract content from PDF.',
    NETWORK_ERROR: 'Network error. Please check your connection.',
};

// Success Messages
export const SUCCESS_MESSAGES = {
    UPLOAD_SUCCESS: 'PDF uploaded successfully!',
    QUIZ_GENERATED: 'Quiz generated successfully!',
    QUIZ_SUBMITTED: 'Quiz submitted successfully!',
    SETTINGS_SAVED: 'Settings saved successfully!',
};

// Placeholder Text
export const PLACEHOLDER_TEXT = {
    SEARCH: 'Search documents or quizzes...',
    PDF_UPLOAD_HINT: 'Drop your PDF here or click to browse',
    QUESTION_PLACEHOLDER: 'Your question...',
};

// Analytics
export const ANALYTICS_CONFIG = {
    CHART_HEIGHT: 300,
    COLORS: ['#7c3aed', '#06b6d4', '#10b981', '#f59e0b', '#ef4444'],
};

// Time Constants (ms)
export const TIMEOUTS = {
    API_REQUEST: 30000,
    PDF_EXTRACTION: 60000,
    QUIZ_GENERATION: 120000,
};
