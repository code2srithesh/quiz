/** @type {import('tailwindcss').Config} */
module.exports = {
    darkMode: 'class',
    content: [
        './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
        './src/components/**/*.{js,ts,jsx,tsx,mdx}',
        './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    ],
    theme: {
        extend: {
            colors: {
                // Dark futuristic base theme
                'dark-bg': '#0a0e27',
                'dark-surface': '#10152d',
                'dark-card': '#151b3a',

                // Glass effect colors
                'glass-light': 'rgba(255, 255, 255, 0.1)',
                'glass-lighter': 'rgba(255, 255, 255, 0.08)',

                // Brand colors
                'primary': '#7c3aed', // Vibrant purple
                'primary-light': '#a78bfa',
                'accent': '#06b6d4', // Cyan accent
                'success': '#10b981',
                'error': '#ef4444',
                'warning': '#f59e0b',
            },
            backgroundImage: {
                'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
                'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
                'glass-gradient': 'linear-gradient(135deg, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.05))',
                'aurora': 'linear-gradient(180deg, rgba(124, 58, 237, 0.15), rgba(6, 182, 212, 0.15))',
            },
            backdropFilter: {
                'glass': 'blur(10px)',
            },
            boxShadow: {
                'glass': '0 8px 32px rgba(31, 38, 135, 0.37)',
                'glass-sm': '0 4px 15px rgba(31, 38, 135, 0.25)',
                'glow': '0 0 20px rgba(124, 58, 237, 0.3)',
                'glow-cyan': '0 0 20px rgba(6, 182, 212, 0.3)',
            },
            animation: {
                'float': 'float 6s ease-in-out infinite',
                'pulse-glow': 'pulse-glow 2s ease-in-out infinite',
                'shimmer': 'shimmer 2s infinite',
                'slide-in': 'slide-in 0.5s ease-out',
                'fade-in': 'fade-in 0.5s ease-out',
            },
            keyframes: {
                float: {
                    '0%, 100%': { transform: 'translateY(0px)' },
                    '50%': { transform: 'translateY(-20px)' },
                },
                'pulse-glow': {
                    '0%, 100%': { opacity: '1' },
                    '50%': { opacity: '0.5' },
                },
                shimmer: {
                    '0%': { backgroundPosition: '-1200px 0' },
                    '100%': { backgroundPosition: '1200px 0' },
                },
                'slide-in': {
                    '0%': { transform: 'translateY(20px)', opacity: '0' },
                    '100%': { transform: 'translateY(0)', opacity: '1' },
                },
                'fade-in': {
                    '0%': { opacity: '0' },
                    '100%': { opacity: '1' },
                },
            },
            fontFamily: {
                'display': ['var(--font-display)', 'system-ui', 'sans-serif'],
                'body': ['var(--font-body)', 'system-ui', 'sans-serif'],
            },
        },
    },
    plugins: [
        require('@tailwindcss/forms'),
        function ({ addUtilities }) {
            const newUtilities = {
                '.glass': {
                    'background': 'rgba(255, 255, 255, 0.1)',
                    'backdrop-filter': 'blur(10px)',
                    'border': '1px solid rgba(255, 255, 255, 0.2)',
                },
                '.glass-dark': {
                    'background': 'rgba(10, 14, 39, 0.8)',
                    'backdrop-filter': 'blur(10px)',
                    'border': '1px solid rgba(255, 255, 255, 0.1)',
                },
            };
            addUtilities(newUtilities);
        },
    ],
};
