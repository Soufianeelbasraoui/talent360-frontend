import { FolderOpen } from 'lucide-react';

/**
 * Standard empty state component with helpful copy and optional CTA.
 * @param {Object} props
 * @param {string} props.title
 * @param {string} props.description
 * @param {React.ReactNode} [props.icon]
 * @param {React.ReactNode} [props.action]
 */
export function EmptyState({
  title = 'No items found',
  description = 'There is currently no information to show.',
  icon,
  action,
}) {
  return (
    <div className="text-center py-5 px-3">
      <div className="d-inline-flex align-items-center justify-content-center p-3 mb-3 bg-light rounded-circle text-muted">
        {icon || <FolderOpen size={32} />}
      </div>
      <h3 className="fs-6 fw-semibold text-dark mb-1">{title}</h3>
      <p className="text-muted small mb-4 mx-auto" style={{ maxWidth: '420px' }}>
        {description}
      </p>
      {action && <div>{action}</div>}
    </div>
  );
}
