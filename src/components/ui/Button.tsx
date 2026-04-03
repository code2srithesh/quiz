import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
    size?: 'sm' | 'md' | 'lg';
    children: React.ReactNode;
    isLoading?: boolean;
    fullWidth?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
    (
        {
            variant = 'primary',
            size = 'md',
            children,
            isLoading = false,
            fullWidth = false,
            disabled,
            className = '',
            ...props
        },
        ref,
    ) => {
        const baseStyles =
            'font-medium rounded-lg transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed';

        const variants = {
            primary:
                'bg-primary hover:bg-primary-light text-white shadow-lg hover:shadow-glow',
            secondary:
                'bg-accent hover:bg-blue-400 text-white shadow-lg hover:shadow-glow-cyan',
            outline:
                'border border-primary text-primary hover:bg-primary hover:text-white',
            ghost: 'text-gray-300 hover:text-white hover:bg-glass-lighter',
        };

        const sizes = {
            sm: 'px-3 py-1.5 text-sm',
            md: 'px-5 py-2.5 text-base',
            lg: 'px-6 py-3 text-lg',
        };

        return (
            <button
                ref={ref}
                className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${fullWidth ? 'w-full' : ''} ${className}`}
                disabled={disabled || isLoading}
                {...props}
            >
                {isLoading && <span className="animate-spin">⚙️</span>}
                {children}
            </button>
        );
    },
);

Button.displayName = 'Button';
