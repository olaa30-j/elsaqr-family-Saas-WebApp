import { useState } from 'react';
import { useForgotPasswordMutation } from '../../store/api/authApi';

const ForgotPasswordPage = () => {
    const [forgotPassword, { isLoading }] = useForgotPasswordMutation();
    const [email, setEmail] = useState('');
    const [isSubmitted, setIsSubmitted] = useState(false);

    // التحقق من صحة البريد الإلكتروني
    const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    const isButtonDisabled = !isEmailValid || isLoading;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await forgotPassword({ email }).unwrap();
            setIsSubmitted(true);
        } catch (error) {
            // يتم التعامل مع الخطأ في onQueryStarted في mutation
        }
    };

    return (
        <section className="max-w-md my-10">
            <div className="text-center">
                <img
                    src="https://res.cloudinary.com/dmhvfuuke/image/upload/v1748029147/family-logo_z54fug.png"
                    alt="شعار عائلة الصقر الدهمش"
                    className="mx-auto h-28 w-28 object-contain"
                />
                <h2
                    className="mt-6 text-3xl font-bold tracking-tight text-foreground font-heading"
                >إعادة تعيين كلمة المرور
                </h2>
                <p className="mt-2 text-sm text-color-2">
                    مرحبًا بك في تطبيق صندوق العائلة
                </p>
            </div>


            {isSubmitted ? (
                <div className="text-center py-8">
                    <div className="text-green-500 mb-4">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </div>
                    <p className="text-gray-700 mb-4">تم إرسال رابط إعادة التعيين إلى بريدك الإلكتروني</p>
                    <p className="text-sm text-gray-500">إذا لم تستلم البريد، يرجى التحقق من مجلد الرسائل غير المرغوب فيها</p>
                </div>
            ) : (
                <form onSubmit={handleSubmit} className="space-y-4 shadow-md border p-6 bg-white rounded-lg mt-10">
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                            البريد الإلكتروني
                        </label>
                        <input
                            id="email"
                            name="email"
                            type="email"
                            autoComplete="email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 ${email && !isEmailValid
                                    ? 'border-red-500 focus:ring-red-200'
                                    : 'border-gray-300 focus:ring-blue-200'
                                } transition duration-200`}
                            placeholder="أدخل بريدك الإلكتروني"
                        />
                        {email && !isEmailValid && (
                            <p className="mt-1 text-sm text-red-600">يرجى إدخال بريد إلكتروني صحيح</p>
                        )}
                    </div>

                    <button
                        type="submit"
                        disabled={isButtonDisabled}
                        className={`w-full py-2 px-4 rounded-md font-medium transition duration-200 ${isButtonDisabled
                                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                : 'bg-primary hover:bg-primary text-white shadow-md'
                            }`}
                    >
                        {isLoading ? (
                            <span className="flex items-center justify-center">
                                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                جاري الإرسال...
                            </span>
                        ) : (
                            'إرسال الرابط'
                        )}
                    </button>
                </form>
            )}

            <div className="mt-4 text-center text-sm text-gray-500">
                تذكرت كلمة المرور؟{' '}
                <a href="/login" className="text-primary hover:underline">العودة لتسجيل الدخول</a>
            </div>
        </section>
    );
}

export default ForgotPasswordPage;