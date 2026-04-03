import { create } from 'zustand';

interface QuizState {
    currentQuizId: string | null;
    currentQuestionIndex: number;
    answers: { [key: string]: string };
    quizStartTime: number | null;

    // Actions
    setCurrentQuiz: (quizId: string | null) => void;
    setQuestionIndex: (index: number) => void;
    setAnswer: (questionId: string, answer: string) => void;
    setAnswers: (answers: { [key: string]: string }) => void;
    startQuiz: () => void;
    resetQuiz: () => void;
}

export const useQuizStore = create<QuizState>((set) => ({
    currentQuizId: null,
    currentQuestionIndex: 0,
    answers: {},
    quizStartTime: null,

    setCurrentQuiz: (quizId) => set({ currentQuizId: quizId }),

    setQuestionIndex: (index) => set({ currentQuestionIndex: index }),

    setAnswer: (questionId, answer) =>
        set((state) => ({
            answers: {
                ...state.answers,
                [questionId]: answer,
            },
        })),

    setAnswers: (answers) => set({ answers }),

    startQuiz: () =>
        set({
            quizStartTime: Date.now(),
            currentQuestionIndex: 0,
            answers: {},
        }),

    resetQuiz: () =>
        set({
            currentQuizId: null,
            currentQuestionIndex: 0,
            answers: {},
            quizStartTime: null,
        }),
}));
