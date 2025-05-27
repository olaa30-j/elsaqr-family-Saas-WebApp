import React from 'react';
import type { InputFieldProps } from '../../types/form';


const InputField: React.FC<InputFieldProps> = ({
  label,
  type = 'text',
  name,
  id,
  placeholder,
  register,
  error,
  autoComplete,
  description,
  required = false,
  className = '',
  disabled = false,
  ...props
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
      <input
        type={type}
        id={id}
        placeholder={placeholder}
        disabled={disabled}
        className={`flex h-10 w-full rounded-md border ${
          error ? 'border-red-500' : 'border-input'
        } bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm`}
        {...register(name)}
        {...props}
      />
      {description && (
        <p id={`${id}-description`} className="text-muted-foreground text-xs">
          {description}
        </p>
      )}
      {error && <p className="text-red-500 text-xs">{error.message}</p>}
    </div>
  );
};

export default InputField;