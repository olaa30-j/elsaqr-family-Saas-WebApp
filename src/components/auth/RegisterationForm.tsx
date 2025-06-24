/**
 * RegistrationForm Component
 * 
 * This component provides a user registration form with validation and submission handling.
 * It collects user information including email, phone, password, family branch, and relationship.
 * 
 * Features:
 * - Form validation using Yup and react-hook-form
 * - Phone number input with specific format validation
 * - Password strength requirements
 * - Family branch selection from available options
 * - Relationship to family selection
 * - Success/error feedback using toast notifications
 * - Loading state during form submission
 * - Automatic redirection after successful registration
 * 
 * Dependencies:
 * - react-hook-form for form management
 * - yup for validation schema
 * - react-toastify for notifications
 * - Custom UI components (InputField, SelectField, PhoneInput)
 * - API hooks for registration and family branches data
 */

import React, { useTransition } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import InputField from '../ui/InputField';
import SelectField from '../ui/SelectField';
import PhoneInput from '../ui/PhoneInput';
import type { RegistrationFormData } from '../../types/authTypes';
import { useRegistrationMutation } from '../../store/api/authApi';
import { familyRelationships } from '../../types/user';
import { Link } from 'react-router-dom';
import { useFamilyBranches } from '../../hooks/useFamilyBranches';

// Default values for form fields
export const DEFAULT_IMAGE = 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQSsuWiNNpEjZxIi0uQPyEq6qecEqY0XaI27Q&s';
const DEFAULT_LNAME = 'الدهمش';
const DEFAULT_FNAME = 'الاسم الاول';

/**
 * Validation schema using Yup
 * Defines the validation rules for each form field:
 * - email: Required, must be valid email format
 * - phone: Required, must start with 5 and be 9 digits total
 * - password: Required, min 8 chars, must contain uppercase, lowercase, number, and special char
 * - confirmPassword: Must match password field
 * - familyBranch: Required selection
 * - familyRelationship: Required selection
 */
const schema = yup.object().shape({
  email: yup.string().email('البريد الإلكتروني غير صحيح').required('البريد الإلكتروني مطلوب'),
  phone: yup.string()
    .required('رقم الهاتف مطلوب')
    .matches(/^5\d{8}$/, 'يجب أن يتكون رقم الهاتف من 9 أرقام ويبدأ بـ 5'),
  password: yup.string()
    .required('كلمة المرور مطلوبة')
    .min(8, 'كلمة المرور يجب أن تكون على الأقل 8 أحرف')
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
      'يجب أن تحتوي كلمة المرور على: حرف إنجليزي كبير (A-Z)، حرف إنجليزي صغير (a-z)، رقم (0-9)، وحرف خاص (@$!%*?&)'
    ),
  confirmPassword: yup.string()
    .oneOf([yup.ref('password')], 'كلمات المرور غير متطابقة')
    .required('تأكيد كلمة المرور مطلوب'),
  familyBranch: yup.mixed().required('فرع العائلة مطلوب'),
  familyRelationship: yup.string().required('صلة القرابة مطلوبة'),
});

/**
 * RegistrationForm Component
 * 
 * @returns {React.ReactElement} The registration form JSX
 */
const RegistrationForm: React.FC = () => {
  // API mutation for registration
  const [registeration] = useRegistrationMutation();
  
  // Hook to fetch family branches data
  const { familyBranches } = useFamilyBranches();
  
  // React transition for handling loading states
  const [isPending, startTransition] = useTransition();
  
  // Filter out administrative branches from family branches
  let filterFamilyBranches = familyBranches.filter(
    (v) => v.label !== 'الفرع الاداري' && v.label !== 'جذر العائلة'
  );

  // Form handling using react-hook-form
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<RegistrationFormData>({
    resolver: yupResolver(schema as any),
    defaultValues: {}
  });

  /**
   * Handles form submission
   * @param {RegistrationFormData} data - The form data
   */
  const onSubmit = async (data: RegistrationFormData) => {
    startTransition(async () => {
      // Handle both object and string values for familyBranch
      const branchId = typeof data.familyBranch === 'object' ? data.familyBranch._id : data.familyBranch;    
      try {
        // Prepare form data for submission
        const formData = new FormData();

        // Append all required fields to formData
        formData.append('fname', DEFAULT_FNAME);
        formData.append('lname', DEFAULT_LNAME);
        formData.append('email', data.email);
        formData.append('phone', data.phone);
        formData.append('password', data.password);
        formData.append('familyBranch', branchId || '');
        formData.append('familyRelationship', data.familyRelationship);
        formData.append('image', data.image || DEFAULT_IMAGE);

        // Call registration API
        await registeration(formData).unwrap();

        // Show success message
        toast.success('تم التسجيل بنجاح! سيتم مراجعة طلبك وارسال رسالة تأكيد', {
          position: 'top-center',
          autoClose: 3000,
        });

        // Reset form after successful submission
        reset();

        // Redirect to home page after 3 seconds
        setTimeout(() => {
          window.location.href = '/';
        }, 3000);

      } catch (error) {
        // Show error message if registration fails
        toast.error('حدث خطأ أثناء التسجيل. يرجى المحاولة مرة أخرى', {
          position: 'top-center',
          autoClose: 3000,
        });
        console.error('Registration error:', error);
      }
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Email Input Field */}
        <InputField
          label="البريد الإلكتروني"
          type="email"
          name="email"
          id="email"
          placeholder="example@domain.com"
          register={register}
          error={errors.email}
          required
        />

        {/* Phone Input Field */}
        <PhoneInput
          label="رقم الهاتف"
          name="phone"
          id="phone"
          register={register}
          error={errors.phone}
          required
          description="يجب أن يتكون رقم الهاتف من 9 أرقام ويبدأ بـ 5"
        />

        {/* Password Input Field */}
        <InputField
          label="كلمة المرور"
          type="password"
          name="password"
          id="password"
          placeholder="********"
          register={register}
          error={errors.password}
          required
        />

        {/* Confirm Password Input Field */}
        <InputField
          label="تأكيد كلمة المرور"
          type="password"
          name="confirmPassword"
          id="confirmPassword"
          placeholder="********"
          register={register}
          error={errors.confirmPassword}
          required
        />

        {/* Family Branch Selection */}
        <SelectField
          label="فرع العائلة"
          name="familyBranch"
          id="familyBranch"
          options={filterFamilyBranches}
          register={register}
          required
        />

        {/* Family Relationship Selection */}
        <SelectField
          label="صلة القرابة بالعائلة"
          name="familyRelationship"
          id="familyRelationship"
          options={familyRelationships}
          register={register}
          error={errors.familyRelationship}
          required
        />
      </div>

      {/* Information Note for Users */}
      <div className="bg-amber-50 border border-amber-200 p-4 rounded-md">
        <p className="text-amber-800 text-sm">
          <span className="font-semibold">ملاحظة:</span> " يمكنك إضافة معلومات إضافية مثل تاريخ الميلاد والعنوان والنبذة الشخصية لاحقاً بعد تسجيل الدخول من صفحة الملف الشخصي. "
        </p>
      </div>

      {/* Submit Button */}
      <div className="space-y-4 mt-8">
        <button
          type="submit"
          disabled={isPending}
          className={`inline-flex items-center justify-center text-white gap-2 whitespace-nowrap font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary hover:bg-primary/90 h-11 rounded-md px-8 w-full py-3 text-lg ${isPending ? 'opacity-75 cursor-not-allowed' : ''}`}
        >
          {isPending ? (
            <>
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              جاري المعالجة...
            </>
          ) : 'تسجيل حساب جديد'}
        </button>
      </div>

      {/* Login Link for existing users */}
      <div className="border-t border-gray-200 mt-8 pt-6">
        <Link
          to="/login"
          className="flex items-center justify-center gap-2 py-3 text-lg group transition-colors"
        >
          <span className="text-gray-600 group-hover:text-gray-800 transition-colors">
            لديك حساب بالفعل؟
          </span>
          <span className="text-primary underline underline-offset-4 decoration-from-font hover:text-primary-dark transition-colors">
            تسجيل دخول
          </span>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 text-primary group-hover:translate-x-1 transition-transform"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        </Link>
      </div>
    </form>
  );
};

export default RegistrationForm;