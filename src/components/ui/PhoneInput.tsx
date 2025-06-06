import React from 'react';
import type { PhoneInputProps } from '../../types/form';


const PhoneInput: React.FC<PhoneInputProps> = ({
  label,
  name,
  id,
  register,
  error,
  description,
  required = false,
  countryCode = '+966',
  disabled,
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
      <div 
        className="flex items-center" 
        id={id} 
        aria-describedby={description ? `${id}-description` : undefined} 
        aria-invalid={!!error}
      >
        <div className="bg-gray-100 px-3 py-2 rounded-r-md border-l-0 border border-input text-muted-foreground">
          {countryCode}
        </div>
        <input
          type="tel"
          disabled={disabled}
          className={`flex h-10 w-full rounded-md border ${
            error ? 'border-red-500' : 'border-input'
          } bg-background px-3 py-4 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm rounded-r-none`}
          placeholder="5XXXXXXXX"
          maxLength={9}
        {...(register ? register(name) : {})}
        />
      </div>
      {description && (
        <p id={`${id}-description`} className="text-muted-foreground text-xs">
          {description}
        </p>
      )}
      {error && <p className="text-red-500 text-xs">{error.message}</p>}
    </div>
  );
};

export default PhoneInput;