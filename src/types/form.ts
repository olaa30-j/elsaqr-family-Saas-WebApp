import type { UseFormRegister, FieldError, Control } from 'react-hook-form';

interface BaseFieldProps {
  label?: string;
  name: string;
  id: string;
  register?: UseFormRegister<any>;
  error?: FieldError;
  description?: string;
  required?: boolean;
  className?: string;
  autoComplete?: string;
  disabled?: boolean;
  control?: Control<any>;
}

export interface InputFieldProps extends BaseFieldProps {
  type?: string;
  placeholder?: string;
  disabled?: boolean;
}

export interface PhoneInputProps extends BaseFieldProps {
  countryCode?: string;

}

interface SelectOption {
  value: string;
  label: string;
}

export interface SelectFieldProps extends BaseFieldProps {
  options: SelectOption[];
  placeholder?: string;
}

export interface DatePickerFieldProps extends Omit<BaseFieldProps, 'register'> {
  error?: FieldError;
  minDate?: Date;
  maxDate?: Date;
  dateFormat?: string;
  placeholderText?: string;
  isClearable?: boolean;
  popperClassName?: string;
  showTimeSelect?: boolean;
  timeFormat?: string;
  maxDateToday?: boolean;
  showYearDropdown?: boolean;
  showMonthDropdown?: boolean;
  disabled?: boolean;
}
