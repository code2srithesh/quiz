import React from 'react';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
    variant?: 'glass' | 'subtle' | 'solid';
    hover?: boolean;
    children: React.ReactNode;
}

export const Card = React.forwardRef<HTMLDivElement, CardProps>(
    ({ variant = 'glass', hover = true, className = '', children, ...props }, ref) => {
        const baseStyles = 'rounded-lg border transition-all duration-300';

        const variants = {
            glass:
                'bg-gradient-to-br from-glass-light to-glass-lighter border-glass-lighter backdrop-blur-md',
            subtle: 'bg-dark-card border-glass-lighter',
            solid: 'bg-dark-surface border-gray-800',
        };

        const hoverStyles =
            hover && variant === 'glass'
                ? 'hover:shadow-glass hover:border-primary/30 hover:from-glass-light hover:to-glass-lighter'
                : '';

        return (
            <div
                ref={ref}
                className={`${baseStyles} ${variants[variant]} ${hoverStyles} ${className}`}
                {...props}
            >
                {children}
            </div>
        );
    },
);

Card.displayName = 'Card';
