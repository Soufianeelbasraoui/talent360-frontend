import clsx from 'clsx';
import { Sparkles } from 'lucide-react';

/**
 * AI marker: emerald badge with sparkle icon and text 'AI' or custom label.
 * @param {Object} props
 * @param {string} [props.label='AI']
 * @param {string} [props.className]
 */
export function AiBadge({ label = 'AI', className = '' }) {
  return (
    <span className={clsx('ai-badge', className)}>
      <Sparkles size={13} aria-hidden="true" />
      <span>{label}</span>
    </span>
  );
}
