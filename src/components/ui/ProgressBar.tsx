interface ProgressBarProps {
    value: number;
    max?: number;
    label?: string;
    size?: 'sm' | 'md' | 'lg';
    animated?: boolean;
}

export function ProgressBar({
    value,
    max = 100,
    label,
    size = 'md',
    animated = true,
}: ProgressBarProps) {
    const percentage = Math.round((value / max) * 100);

    const sizes = {
        sm: 'h-1.5',
        md: 'h-2.5',
        lg: 'h-3.5',
    };

    const getColor = () => {
        if (percentage >= 90) return 'from-success to-green-500';
        if (percentage >= 75) return 'from-blue-500 to-blue-400';
        if (percentage >= 60) return 'from-warning to-amber-500';
        return 'from-error to-red-500';
    };

    return (
        <div className="w-full">
            {label && <p className="text-sm text-gray-400 mb-2">{label}</p>}
            <div className={`w-full bg-dark-surface rounded-full overflow-hidden ${sizes[size]}`}>
                <div
                    className={`h-full bg-gradient-to-r ${getColor()} transition-all duration-500 ${animated ? 'animate-pulse-glow' : ''}`}
                    style={{ width: `${Math.min(percentage, 100)}%` }}
                />
            </div>
            <p className="text-xs text-gray-500 mt-1">{percentage}%</p>
        </div>
    );
}
