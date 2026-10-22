import clsx from 'clsx';

/**
 * Clean card container with 5px radius and subtle border.
 * @param {Object} props
 * @param {React.ReactNode} [props.header]
 * @param {React.ReactNode} [props.footer]
 * @param {string} [props.className]
 * @param {string} [props.bodyClassName]
 * @param {React.ReactNode} props.children
 */
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
