/**
 * LoginForm Component
 * 
 * This component provides a user login form with validation and submission handling.
 * It accepts either email or phone number as identifier along with password.
 * 
 * Features:
 * - Dual input validation (accepts both email and phone number)
 * - Password validation
 * - Loading state during form submission
 * - Success/error feedback using toast notifications
 * - Automatic redirection to dashboard after successful login
 * - Form validation using Yup and react-hook-form
 * - Redux state management for loading and error states
 * 
 * Dependencies:
 * - react-hook-form for form management
 * - yup for validation schema
 * - react-toastify for notifications
 * - react-router-dom for navigation
 * - Redux for state management
 * - Custom InputField component
 */

import React from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import InputField from '../ui/InputField';
import { useLoginMutation } from '../../store/api/authApi';
import type { LoginFormData } from '../../types/authTypes';
import { useAppDispatch } from '../../store/store';
import { setError, setLoading } from '../../features/auth/authSlice';
import { useNavigate } from 'react-router-dom';

/**
 * Validation schema using Yup
 * Defines the validation rules for each form field:
 * - identifier: Required, must be either valid email or phone number (starting with 5 and 9 digits)
 * - password: Required, minimum 6 characters
 */
const schema = yup.object().shape({
  identifier: yup
    .string()
    .required('البريد الإلكتروني أو رقم الهاتف مطلوب')
    .test(
      'is-email-or-phone',
      'يجب إدخال بريد إلكتروني صحيح أو رقم هاتف يبدأ بـ 5 ويتكون من 9 أرقام',
      (value) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (emailRegex.test(value)) return true;

        const phoneRegex = /^5\d{8}$/;
        return phoneRegex.test(value);
      }
    ),
  password: yup
    .string()
    .required('كلمة المرور مطلوبة')
    .min(6, 'يجب أن تتكون كلمة المرور من 6 أحرف على الأقل'),
});

/**
 * LoginForm Component
 * 
 * @returns {React.ReactElement} The login form JSX
 */
const LoginForm: React.FC = () => {
  // Redux dispatch function
  const dispatch = useAppDispatch();
  
  // Navigation hook for programmatic routing
  const navigate = useNavigate();

  // Form handling using react-hook-form
  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<LoginFormData>({
    resolver: yupResolver(schema),
    mode: 'onChange', // Validate form on change
  });

  // API mutation for login
  const [login, { isLoading }] = useLoginMutation();

  /**
   * Handles form submission
   * @param {LoginFormData} data - The form data containing identifier and password
   */
  const onSubmit = async (data: LoginFormData) => {
    try {
      // Set loading state
      dispatch(setLoading(true));
      
      // Call login API
      await login({
        identifier: data.identifier,
        password: data.password
      }).unwrap();

      // Show success message and redirect to dashboard
      toast.success('تم تسجيل الدخول بنجاح');
      navigate('/dashboard')
    } catch (error) {
      // Show error message if login fails
      toast.error('بيانات الدخول غير صحيحة');
      dispatch(setError('تأكد من صحة البريد الإلكتروني/رقم الهاتف وكلمة المرور'));
    } finally {
      // Reset loading state
      dispatch(setLoading(false));
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Identifier Input (Email or Phone) */}
        <InputField
          label="البريد الإلكتروني أو رقم الهاتف"
          name="identifier"
          id="identifier"
          placeholder="أدخل البريد الإلكتروني أو رقم الهاتف"
          register={register}
          error={errors.identifier}
          description="يمكنك إدخال البريد الإلكتروني أو رقم الهاتف بصيغة 5XXXXXXXX (بدون كود الاتصال الدولي)"
          autoComplete="username"
        />

        {/* Password Input */}
        <InputField
          label="كلمة المرور"
          type="password"
          name="password"
          id="password"
          placeholder="أدخل كلمة المرور"
          register={register}
          error={errors.password}
          autoComplete="current-password"
        />

        {/* Submit Button */}
        <div className="pt-2">
          <button
            type="submit"
            disabled={isLoading || !isValid}
            className={`w-full bg-primary hover:bg-primary/90 text-white font-medium py-2 px-4 rounded-md transition duration-200 ${
              isLoading ? 'opacity-70 cursor-not-allowed' : ''
            } ${
              !isValid ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            {isLoading ? (
              // Loading spinner when submitting
              <span className="flex items-center justify-center">
                <svg className="animate-spin mx-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                جاري تسجيل الدخول...
              </span>
            ) : (
              'تسجيل الدخول'
            )}
          </button>
        </div>
      </form>
    </>
  );
};

export default LoginForm;