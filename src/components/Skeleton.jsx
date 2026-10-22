import clsx from 'clsx';

/**
 * Clean skeleton placeholder for loading states.
 * @param {Object} props
 * @param {number} [props.count=1]
 * @param {number|string} [props.height=20]
 * @param {number|string} [props.width='100%']
 * @param {string} [props.className]
 */
export function Skeleton({ count = 1, height = 20, width = '100%', className = '' }) {
  const items = Array.from({ length: count });

  return (
    <>
      {items.map((_, i) => (
        <div
          key={i}
          className={clsx('placeholder-glow mb-2', className)}
          style={{ width, height }}
        >
          <span
            className="placeholder w-100 h-100"
            style={{
              borderRadius: '5px',
              backgroundColor: '#E5E7EB',
              display: 'block',
            }}
          />
        </div>
      ))}
    </>
  );
}
