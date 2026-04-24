interface ProgressBarProps {
  value: number; // 0-100
  showLabel?: boolean;
  size?: 'sm' | 'md' | 'lg';
  color?: 'blue' | 'green' | 'gold';
}

const colors = {
  blue: 'bg-[#7B9FD4]',
  green: 'bg-emerald-500',
  gold: 'bg-amber-400',
};

const heights = { sm: 'h-1.5', md: 'h-2.5', lg: 'h-4' };

export default function ProgressBar({
  value,
  showLabel = true,
  size = 'md',
  color = 'blue',
}: ProgressBarProps) {
  const clamped = Math.max(0, Math.min(100, value));
  return (
    <div className="w-full">
      <div className={`w-full bg-gray-200 rounded-full overflow-hidden ${heights[size]}`}>
        <div
          className={`${heights[size]} ${colors[color]} rounded-full transition-all duration-700 ease-out`}
          style={{ width: `${clamped}%` }}
        />
      </div>
      {showLabel && (
        <p className="text-xs text-gray-500 mt-1 text-right">{clamped}% completado</p>
      )}
    </div>
  );
}
