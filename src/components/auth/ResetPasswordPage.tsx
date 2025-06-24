/**
 * ResetPasswordPage Component
 * 
 * This component handles the password reset functionality, allowing users to set a new password
 * after receiving a reset token via email. It includes validation for password matching and length.
 * 
 * Features:
 * - Token-based password reset flow
 * - Password confirmation validation
 * - Minimum password length enforcement (6 characters)
 * - Loading state during form submission
 * - Success state after successful password reset
 * - Error handling with user feedback
 * - Responsive design with proper accessibility attributes
 * 
 * Dependencies:
 * - React hooks (useState)
 * - react-router-dom for token parameter handling
 * - Redux Toolkit RTK Query for API mutation
 * - Tailwind CSS for styling
 */

import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useResetPasswordMutation } from '../../store/api/authApi';

const ResetPasswordPage = () => {
    // Get reset token from URL parameters
    const { token } = useParams<{ token: string }>();
    
    // API mutation hook for password reset
    const [resetPassword, { isLoading, isSuccess }] = useResetPasswordMutation();
    
    // Component state
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');

    /**
     * Handles form submission
     * @param {React.FormEvent} e - The form event
     */
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Validate password match
        if (newPassword !== confirmPassword) {
            setError('كلمات المرور غير متطابقة');
            return;
        }

        // Validate password length
        if (newPassword.length < 6) {
            setError('كلمة المرور يجب أن تكون على الأقل 6 أحرف');
            return;
        }

        try {
            // Call the reset password API
            await resetPassword({ token: token!, newPassword }).unwrap();
        } catch (err) {
            setError('حدث خطأ أثناء إعادة تعيين كلمة المرور');
            console.error('فشل إعادة التعيين:', err);
        }
    };

    return (
        <section className="max-w-md my-10">
            {/* Header Section */}
            <div className="text-center">
                <img
                    src="https://res.cloudinary.com/dmhvfuuke/image/upload/v1748029147/family-logo_z54fug.png"
                    alt="شعار عائلة الصقر الدهمش"
                    className="mx-auto h-28 w-28 object-contain"
                />
                <h2 className="mt-6 text-3xl font-bold tracking-tight text-foreground font-heading">
                    تعيين كلمة مرور جديدة
                </h2>
                <p className="mt-2 text-sm text-color-2">
                    مرحبًا بك في تطبيق صندوق العائلة
                </p>
            </div>

            {/* Conditional Rendering based on success state */}
            {isSuccess ? (
                /* Success Message */
                <div className="text-center py-8">
                    <div className="text-green-500 mb-4">
                        <svg 
                            xmlns="http://www.w3.org/2000/svg" 
                            className="h-12 w-12 mx-auto" 
                            fill="none" 
                            viewBox="0 0 24 24" 
                            stroke="currentColor"
                        >
                            <path 
                                strokeLinecap="round" 
                                strokeLinejoin="round" 
                                strokeWidth={2} 
                                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" 
                            />
                        </svg>
                    </div>
                    <p className="text-gray-700 mb-4">تم تغيير كلمة المرور بنجاح</p>
                    <p className="text-sm text-gray-500">
                        يمكنك الآن{' '}
                        <a href="/login" className="text-primary hover:underline">
                            تسجيل الدخول
                        </a>{' '}
                        باستخدام كلمة المرور الجديدة
                    </p>
                </div>
            ) : (
                /* Password Reset Form */
                <form 
                    onSubmit={handleSubmit} 
                    className="space-y-4 shadow-md border p-6 bg-white rounded-lg mt-10"
                >
                    {/* Error Message Display */}
                    {error && (
                        <div className="p-3 bg-red-50 text-red-600 rounded-md text-sm">
                            {error}
                        </div>
                    )}

                    {/* New Password Input */}
                    <div>
                        <label 
                            htmlFor="newPassword" 
                            className="block text-sm font-medium text-gray-700 mb-1"
                        >
                            كلمة المرور الجديدة
                        </label>
                        <input
                            id="newPassword"
                            name="newPassword"
                            type="password"
                            required
                            minLength={6}
                            value={newPassword}
                            onChange={(e) => {
                                setNewPassword(e.target.value);
                                setError('');
                            }}
                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-200 transition duration-200"
                            placeholder="أدخل كلمة المرور الجديدة"
                        />
                        <p className="mt-1 text-xs text-gray-500">
                            يجب أن تحتوي على الأقل 6 أحرف
                        </p>
                    </div>

                    {/* Confirm Password Input */}
                    <div>
                        <label 
                            htmlFor="confirmPassword" 
                            className="block text-sm font-medium text-gray-700 mb-1"
                        >
                            تأكيد كلمة المرور
                        </label>
                        <input
                            id="confirmPassword"
                            name="confirmPassword"
                            type="password"
                            required
                            value={confirmPassword}
                            onChange={(e) => {
                                setConfirmPassword(e.target.value);
                                setError('');
                            }}
                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-200 transition duration-200"
                            placeholder="أعد إدخال كلمة المرور الجديدة"
                        />
                    </div>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        disabled={isLoading}
                        className={`w-full py-2 px-4 rounded-md font-medium transition duration-200 ${
                            isLoading
                                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                : 'bg-primary hover:bg-primary-dark text-white shadow-md'
                        }`}
                    >
                        {isLoading ? (
                            // Loading state
                            <span className="flex items-center justify-center">
                                <svg 
                                    className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" 
                                    xmlns="http://www.w3.org/2000/svg" 
                                    fill="none" 
                                    viewBox="0 0 24 24"
                                >
                                    <circle 
                                        className="opacity-25" 
                                        cx="12" 
                                        cy="12" 
                                        r="10" 
                                        stroke="currentColor" 
                                        strokeWidth="4"
                                    ></circle>
                                    <path 
                                        className="opacity-75" 
                                        fill="currentColor" 
                                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                    ></path>
                                </svg>
                                جاري الحفظ...
                            </span>
                        ) : (
                            'تغيير كلمة المرور'
                        )}
                    </button>
                </form>
            )}

            {/* Login Link */}
            <div className="mt-4 text-center text-sm text-gray-500">
                تذكرت كلمة المرور؟{' '}
                <a 
                    href="/login" 
                    className="text-primary hover:underline"
                >
                    العودة لتسجيل الدخول
                </a>
            </div>
        </section>
    );
}

export default ResetPasswordPage;