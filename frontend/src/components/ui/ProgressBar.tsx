interface ProgressBarProps {
  value: number;        // 0–100
  showLabel?: boolean;
  size?: 'sm' | 'md' | 'lg';
  color?: 'blue' | 'green' | 'gold';
}

const trackH  = { sm: 'h-1.5', md: 'h-2', lg: 'h-3' };
const fillColor = {
  blue:  'linear-gradient(90deg, #1E2D6B, #5B6FA8)',
  green: 'linear-gradient(90deg, #1DA750, #34C471)',
  gold:  'linear-gradient(90deg, #D4AE0C, #F0C930)',
};

export default function ProgressBar({
  value,
  showLabel = true,
  size = 'md',
  color = 'blue',
}: ProgressBarProps) {
  const clamped = Math.max(0, Math.min(100, value));
  return (
    <div className="w-full">
      <div
        className={`w-full rounded-full overflow-hidden ${trackH[size]}`}
        style={{ background: '#E8EBF0' }}
      >
        <div
          className={`${trackH[size]} rounded-full transition-all duration-700 ease-out`}
          style={{ width: `${clamped}%`, background: fillColor[color] }}
        />
      </div>
      {showLabel && (
        <p className="text-xs mt-1 text-right font-medium" style={{ color: '#9AA0A6' }}>
          {clamped}% completado
        </p>
      )}
    </div>
  );
}
