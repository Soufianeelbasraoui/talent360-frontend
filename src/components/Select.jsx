import { forwardRef } from 'react';
import clsx from 'clsx';

/**
 * Standard Accessible Select with 5px radius and error states.
 * @param {Object} props
 * @param {string} [props.label]
 * @param {string} [props.error]
 * @param {string} [props.helperText]
 * @param {string} [props.id]
 * @param {Array<{ label: string, value: string|number }>} [props.options]
 * @param {string} [props.placeholder]
 * @param {string} [props.className]
 */
export const Select = forwardRef(function Select(
  {
    label,
    error,
    helperText,
    id,
    options = [],
    placeholder = 'Select an option...',
    className = '',
    required,
    children,
    ...rest
  },
  ref
) {
  const selectId = id || (label ? `select-${label.toLowerCase().replace(/\s+/g, '-')}` : undefined);

  return (
    <div className="mb-3 text-start">
      {label && (
        <label htmlFor={selectId} className="form-label">
          {label} {required && <span className="text-danger">*</span>}
        </label>
      )}

      <select
        ref={ref}
        id={selectId}
        className={clsx('form-select', error && 'is-invalid', className)}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? `${selectId}-error` : helperText ? `${selectId}-help` : undefined}
        {...rest}
      >
        {placeholder && <option value="">{placeholder}</option>}
        {options.map(opt => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
        {children}
      </select>

      {error && (
        <div id={`${selectId}-error`} className="invalid-feedback d-block mt-1">
          {error}
        </div>
      )}

      {!error && helperText && (
        <div id={`${selectId}-help`} className="form-text mt-1">
          {helperText}
        </div>
      )}
    </div>
  );
});
