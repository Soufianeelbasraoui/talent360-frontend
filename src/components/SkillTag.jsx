import clsx from 'clsx';
import { X } from 'lucide-react';

export function SkillTag({ name, status = 'neutral', onRemove, className = '' }) {
  return (
    <span
      className={clsx(
        'skill-tag',
        status === 'matching' && 'matching',
        status === 'missing' && 'missing',
        className
      )}
    >
      <span>{name}</span>
      {onRemove && (
        <button
          type="button"
          onClick={e => {
            e.stopPropagation();
            onRemove();
          }}
          className="btn p-0 ms-1 border-0 text-muted"
          style={{ lineHeight: 1 }}
          aria-label={`Remove skill ${name}`}
        >
          <X size={12} />
        </button>
      )}
    </span>
  );
}
