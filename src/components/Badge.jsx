import clsx from 'clsx';

/**
 * Clean Badge with 5px radius and subtle styling.
 * @param {Object} props
 * @param {'primary'|'secondary'|'success'|'warning'|'danger'|'info'|'light'} [props.variant='secondary']
 * @param {string} [props.className]
 * @param {React.ReactNode} props.children
 */
export function Badge({ variant = 'secondary', className = '', children, ...rest }) {
  return (
    <span className={clsx('badge', `bg-${variant}`, className)} {...rest}>
      {children}
    </span>
  );
}
