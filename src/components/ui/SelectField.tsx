import React from 'react';
import type { SelectFieldProps } from '../../types/form';

const SelectField: React.FC<SelectFieldProps> = ({
  label,
  name,
  id,
  options,
  register,
  error,
  disabled,
  placeholder = 'اختر من القائمة',
  required = false,
  className = '',
}) => {
  return (
    <div className={`space-y-2 ${className}`}>
      {label && (
        <label
          htmlFor={id}
          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
        >
          {label}
          {required && ' *'}
        </label>
      )}
      <select
        disabled={disabled}
        id={id}
        className={`flex h-10 w-full rounded-md border ${error ? 'border-red-500' : 'border-input'
          } bg-background px-3 py-2 text-base ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm`}
        {...(register ? register(name) : {})}
        aria-invalid={!!error}
      >
        <option value="">{placeholder}</option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {error && <p className="text-red-500 text-xs">{error.message}</p>}
    </div>
  );
};

export default SelectField;