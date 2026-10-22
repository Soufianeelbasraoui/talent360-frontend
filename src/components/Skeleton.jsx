import clsx from 'clsx';

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
