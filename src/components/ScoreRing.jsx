import clsx from 'clsx';
import { getScoreTier, formatScore } from '@/utils/formatters';

/**
 * Circular progress ring for match score percentage.
 * Green (>85), Amber (60-85), Gray (<60).
 * @param {Object} props
 * @param {number|null|undefined} props.score - e.g. 88 or 0.88
 * @param {number} [props.size=44]
 * @param {number} [props.strokeWidth=3.5]
 * @param {string} [props.className]
 */
export function ScoreRing({ score, size = 44, strokeWidth = 3.5, className = '' }) {
  const tier = getScoreTier(score);
  const normalizedScore = score > 1 ? score : (score || 0) * 100;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (Math.min(100, Math.max(0, normalizedScore)) / 100) * circumference;

  return (
    <div
      className={clsx('match-score-ring', `score-${tier}`, className)}
      style={{ width: size, height: size }}
      title={`Match score: ${formatScore(score)}`}
      role="progressbar"
      aria-valuenow={Math.round(normalizedScore)}
      aria-valuemin={0}
      aria-valuemax={100}
    >
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        {/* Background track */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="#E5E7EB"
          strokeWidth={strokeWidth}
        />
        {/* Colored progress */}
        <circle
          className="progress"
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
          style={{ transition: 'stroke-dashoffset 0.5s ease' }}
        />
      </svg>
      <span className="score-text">{formatScore(score)}</span>
    </div>
  );
}
