interface SkeletonProps {
    width?: string | number;
    height?: string | number;
    className?: string;
    count?: number;
}

export function Skeleton({
    width = '100%',
    height = '20px',
    className = '',
    count = 1,
}: SkeletonProps) {
    const skeletons = Array.from({ length: count });

    return (
        <>
            {skeletons.map((_, i) => (
                <div
                    key={i}
                    className={`bg-gradient-to-r from-dark-card via-dark-surface to-dark-card animate-shimmer mb-3 rounded-lg ${className}`}
                    style={{
                        width,
                        height,
                        backgroundSize: '1200px 100%',
                        backgroundPosition: '-1200px 0',
                    }}
                />
            ))}
        </>
    );
}
