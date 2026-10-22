import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from './Button';

/**
 * Standard server-side pagination bar.
 * @param {Object} props
 * @param {number} props.currentPage - 0-indexed
 * @param {number} props.totalPages
 * @param {(page: number) => void} props.onPageChange
 * @param {number} [props.totalElements]
 */
export function Pagination({ currentPage, totalPages, onPageChange, totalElements }) {
  if (totalPages <= 1) return null;

  return (
    <div className="d-flex align-items-center justify-content-between flex-wrap gap-2 pt-3">
      <div className="text-muted small">
        Page {currentPage + 1} of {totalPages}
        {typeof totalElements === 'number' && ` (${totalElements} total entries)`}
      </div>

      <div className="d-flex align-items-center gap-1">
        <Button
          variant="secondary"
          size="sm"
          disabled={currentPage <= 0}
          onClick={() => onPageChange(currentPage - 1)}
          aria-label="Previous page"
        >
          <ChevronLeft size={14} />
          <span className="d-none d-sm-inline ms-1">Previous</span>
        </Button>

        <Button
          variant="secondary"
          size="sm"
          disabled={currentPage >= totalPages - 1}
          onClick={() => onPageChange(currentPage + 1)}
          aria-label="Next page"
        >
          <span className="d-none d-sm-inline me-1">Next</span>
          <ChevronRight size={14} />
        </Button>
      </div>
    </div>
  );
}
