import clsx from 'clsx';
import { Skeleton } from './Skeleton';
import { EmptyState } from './EmptyState';

export function DataTable({
  columns,
  data = [],
  isLoading = false,
  emptyMessage = 'No records found.',
  className = '',
}) {
  if (isLoading) {
    return (
      <div className="card p-3">
        <Skeleton count={5} height={40} className="mb-2" />
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="card">
        <EmptyState title="No items to display" description={emptyMessage} />
      </div>
    );
  }

  return (
    <div className={clsx('table-responsive', className)}>
      <table className="table table-hover table-responsive-stack align-middle">
        <thead>
          <tr>
            {columns.map((col, idx) => (
              <th key={idx} scope="col" className={col.className}>
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, rowIdx) => (
            <tr key={row.id || rowIdx}>
              {columns.map((col, colIdx) => (
                <td key={colIdx} data-label={col.header} className={col.className}>
                  {col.render
                    ? col.render(row)
                    : col.accessor
                    ? row[col.accessor] ?? '—'
                    : null}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
