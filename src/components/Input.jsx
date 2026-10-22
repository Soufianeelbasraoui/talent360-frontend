import { forwardRef } from 'react';
import clsx from 'clsx';

/**
 * Standard Accessible Input with 5px radius and error states.
 * @param {Object} props
 * @param {string} [props.label]
 * @param {string} [props.error]
 * @param {string} [props.helperText]
 * @param {string} [props.id]
 * @param {string} [props.className]
 * @param {React.ReactNode} [props.leftIcon]
 * @param {React.ReactNode} [props.rightElement]
 */
export const Input = forwardRef(function Input(
  {
    label,
    error,
    helperText,
    id,
    className = '',
    leftIcon,
    rightElement,
    type = 'text',
    required,
    ...rest
  },
  ref
) {
  const inputId = id || (label ? `input-${label.toLowerCase().replace(/\s+/g, '-')}` : undefined);

  return (
    <div className="mb-3 text-start">
      {label && (
        <label htmlFor={inputId} className="form-label">
          {label} {required && <span className="text-danger">*</span>}
        </label>
      )}

      <div className="position-relative d-flex align-items-center">
        {leftIcon && (
          <span
            className="position-absolute start-0 ms-3 text-muted d-flex align-items-center"
            style={{ pointerEvents: 'none' }}
          >
            {leftIcon}
          </span>
        )}

        <input
          ref={ref}
          id={inputId}
          type={type}
          required={required}
          className={clsx(
            'form-control',
            leftIcon && 'ps-5',
            rightElement && 'pe-5',
            error && 'is-invalid',
            className
          )}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? `${inputId}-error` : helperText ? `${inputId}-help` : undefined}
          {...rest}
        />

        {rightElement && (
          <div className="position-absolute end-0 me-2 d-flex align-items-center">
            {rightElement}
          </div>
        )}
      </div>

      {error && (
        <div id={`${inputId}-error`} className="invalid-feedback d-block mt-1">
          {error}
        </div>
      )}

      {!error && helperText && (
        <div id={`${inputId}-help`} className="form-text mt-1">
          {helperText}
        </div>
      )}
    </div>
  );
});
