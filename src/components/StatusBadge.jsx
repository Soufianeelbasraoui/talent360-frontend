import clsx from 'clsx';
import { ApplicationStatus, JobStatus } from '@/constants/enums';

export function StatusBadge({ status, className = '' }) {
  if (!status) return null;

  const statusUpper = status.toUpperCase();
  let badgeClass = 'badge-status-rejected';
  let label = statusUpper;

  switch (statusUpper) {
    case ApplicationStatus.NEW:
      badgeClass = 'badge-status-new';
      label = 'New';
      break;
    case ApplicationStatus.SCREENING:
      badgeClass = 'badge-status-screening';
      label = 'Screening';
      break;
    case ApplicationStatus.OFFER:
      badgeClass = 'badge-status-offer';
      label = 'Offer';
      break;
    case ApplicationStatus.HIRED:
      badgeClass = 'badge-status-hired';
      label = 'Hired';
      break;
    case ApplicationStatus.REJECTED:
      badgeClass = 'badge-status-rejected';
      label = 'Rejected';
      break;
    case JobStatus.OPEN:
      badgeClass = 'badge-status-hired';
      label = 'Open';
      break;
    case JobStatus.DRAFT:
      badgeClass = 'badge-status-screening';
      label = 'Draft';
      break;
    case JobStatus.PAUSED:
      badgeClass = 'badge-status-screening';
      label = 'Paused';
      break;
    case JobStatus.CLOSED:
      badgeClass = 'badge-status-rejected';
      label = 'Closed';
      break;
    default:
      badgeClass = 'badge-status-rejected';
      label = status;
  }

  return <span className={clsx('badge', badgeClass, className)}>{label}</span>;
}
