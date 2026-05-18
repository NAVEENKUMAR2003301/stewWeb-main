const CircularProgress = ({
    value = 0,
    max = 100,
    size = 80,
    strokeWidth = 8,
    color = '#b76e79',
    label,
}) => {
    const radius = (size - strokeWidth) / 2;
    const circumference = 2 * Math.PI * radius;
    const progress = Math.min(value / max, 1);
    const offset = circumference - progress * circumference;

    return (
        <div className="flex flex-col items-center gap-1 w-full">
            <svg width={size} height={size} className="transform -rotate-90">
                {/* Background circle */}
                <circle
                    cx={size / 2}
                    cy={size / 2}
                    r={radius}
                    stroke="#e5e7eb"
                    strokeWidth={strokeWidth}
                    fill="none"
                />
                {/* Progress circle */}
                <circle
                    cx={size / 2}
                    cy={size / 2}
                    r={radius}
                    stroke={color}
                    strokeWidth={strokeWidth}
                    fill="none"
                    strokeDasharray={circumference}
                    strokeDashoffset={offset}
                    strokeLinecap="round"
                    className="transition-all duration-700 ease-out"
                />
                {/* Center value */}
                <text
                    x="50%"
                    y="50%"
                    dominantBaseline="central"
                    textAnchor="middle"
                    fontSize="18"
                    fontWeight="bold"
                    fill="#1e1e1e"
                    transform={`rotate(90, ${size / 2}, ${size / 2})`}
                >
                    {value}
                </text>
            </svg>

            {label && (
                <>
                    <p className="text-xs text-gray-500 text-center mt-1">{label}</p>
                    {/* Linear progress bar under label */}
                    <div className="w-full h-1 bg-gray-200 rounded-full">
                        <div
                            className="h-full rounded-full transition-all duration-700"
                            style={{ width: `${progress * 100}%`, backgroundColor: color }}
                        />
                    </div>
                </>
            )}
        </div>
    );
};

export default CircularProgress;