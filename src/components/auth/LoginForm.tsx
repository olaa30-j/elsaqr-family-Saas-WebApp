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

const LoginForm: React.FC = () => {
  const dispatch = useAppDispatch();

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<LoginFormData>({
    resolver: yupResolver(schema),
    mode: 'onChange',
  });

  const [login, { isLoading }] = useLoginMutation();

  const onSubmit = async (data: LoginFormData) => {
    try {
      dispatch(setLoading(true));
      await login({
        identifier: data.identifier,
        password: data.password
      }).unwrap();
      
      toast.success('تم تسجيل الدخول بنجاح');
    } catch (error) {
      toast.error('بيانات الدخول غير صحيحة');
      dispatch(setError('تأكد من صحة البريد الإلكتروني/رقم الهاتف وكلمة المرور'));
    } finally {
      dispatch(setLoading(false));
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
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

        <div className="pt-2">
          <button
            type="submit"
            disabled={isLoading || !isValid}
            className={`w-full bg-primary hover:bg-primary/90 text-white font-medium py-2 px-4 rounded-md transition duration-200 ${isLoading ? 'opacity-70 cursor-not-allowed' : ''
              } ${!isValid ? 'opacity-50 cursor-not-allowed' : ''
              }`}
          >
            {isLoading ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
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