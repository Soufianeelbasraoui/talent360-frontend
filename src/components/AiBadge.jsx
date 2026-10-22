import clsx from 'clsx';
import { Sparkles } from 'lucide-react';

export function AiBadge({ label = 'AI', className = '' }) {
  return (
    <span className={clsx('ai-badge', className)}>
      <Sparkles size={13} aria-hidden="true" />
      <span>{label}</span>
    </span>
  );
}
