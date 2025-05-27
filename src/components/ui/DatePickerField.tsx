import React from 'react';
import { Controller } from 'react-hook-form';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import type { DatePickerFieldProps } from '../../types/form';

const DatePickerField: React.FC<DatePickerFieldProps> = ({
  label,
  name,
  id,
  control,
  error,
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
          className="text-sm block mb-3 font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
        >
          {label}
          {required && ' *'}
        </label>
      )}
      <Controller
        name={name}
        control={control}
        render={({ field }) => (
          <DatePicker
            id={id}
            selected={field.value}
            onChange={(date) => field.onChange(date)}
            disabled={disabled}
            className={`flex h-10 w-full rounded-md border ${
              error ? 'border-red-500' : 'border-input'
            } bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50`}
            dateFormat="yyyy/MM/dd"
            placeholderText="اختر تاريخ الميلاد"
            {...props}
          />
        )}
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

export default DatePickerField;