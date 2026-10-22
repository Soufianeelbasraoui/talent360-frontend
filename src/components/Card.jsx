import clsx from 'clsx';

export function Card({
  header,
  footer,
  className = '',
  bodyClassName = '',
  children,
  ...rest
}) {
  return (
    <div className={clsx('card', className)} {...rest}>
      {header && <div className="card-header">{header}</div>}
      <div className={clsx('card-body', bodyClassName)}>{children}</div>
      {footer && <div className="card-footer">{footer}</div>}
    </div>
  );
}
