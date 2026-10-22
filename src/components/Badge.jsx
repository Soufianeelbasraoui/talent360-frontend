import clsx from 'clsx';

export function Badge({ variant = 'secondary', className = '', children, ...rest }) {
  return (
    <span className={clsx('badge', `bg-${variant}`, className)} {...rest}>
      {children}
    </span>
  );
}
