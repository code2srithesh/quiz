import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    error?: string;
    helperText?: string;
    icon?: React.ReactNode;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
    ({ label, error, helperText, icon, className = '', ...props }, ref) => {
        return (
            <div className="w-full">
                {label && (
                    <label className="block text-sm font-medium mb-2 text-gray-300">
                        {label}
                    </label>
                )}
                <div className="relative">
                    {icon && (
                        <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                            {icon}
                        </div>
                    )}
                    <input
                        ref={ref}
                        className={`w-full bg-dark-card border border-glass-lighter rounded-lg px-4 py-2.5 ${icon ? 'pl-10' : ''} text-white placeholder-gray-500 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/30 transition-all duration-300 ${className} ${error ? 'border-error' : ''}`}
                        {...props}
                    />
                </div>
                {error && <p className="text-error text-sm mt-1">{error}</p>}
                {helperText && <p className="text-gray-500 text-sm mt-1">{helperText}</p>}
            </div>
        );
    },
);

Input.displayName = 'Input';
