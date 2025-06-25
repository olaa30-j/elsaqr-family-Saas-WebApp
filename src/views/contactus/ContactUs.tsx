import { motion } from "framer-motion";
import { Mail, MailQuestionIcon, Send } from "lucide-react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { useState } from 'react';

interface ContactFormData {
  name: string;
  email: string;
  phone?: string;
  department: string;
  message: string;
}

const ContactUs = () => {
  const SCRIPT_URL = '/google-script/macros/s/AKfycbyaYdl5H_e8AyZTCgWuSkXu4Mm48Twvgv0bO1DyGb_MYfZZ8QWdGCPlH_h4O-v1vO8h_w/exec';

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ContactFormData>();

  const [isSending, setIsSending] = useState(false);
  const [sendStatus, setSendStatus] = useState<{
    success: boolean;
    message: string;
    ticketNumber: string;
  } | null>(null);

  const onSubmit: SubmitHandler<ContactFormData> = async (data) => {
    setIsSending(true);
    setSendStatus(null);

    try {
      const formData = new URLSearchParams();
      formData.append('name', data.name);
      formData.append('email', data.email);
      if (data.phone) formData.append('phone', data.phone);
      formData.append('department', data.department);
      formData.append('message', data.message);

      const response = await fetch(SCRIPT_URL, {
        method: 'POST',
        body: formData,
      });

      const responseText = await response.text();

      let result;
      try {
        result = JSON.parse(responseText);
      } catch (e) {
        if (response.ok) {
          setSendStatus({
            success: true,
            message: 'تم الإرسال بنجاح',
            ticketNumber: ''
          });
          reset();
          return;
        }
        throw new Error(responseText || 'Request failed');
      }

      if (!response.ok || !result.success) {
        throw new Error(result.error || result.message || 'Request failed');
      }

      setSendStatus({
        success: true,
        message: 'تم الإرسال بنجاح',
        ticketNumber: result.ticketNumber || ''
      });
      reset();
    } catch (error) {
      let errorMessage = 'حدث خطأ غير متوقع';

      if (error instanceof Error) {
        errorMessage = error.message;

        if (errorMessage.includes('DOCTYPE html')) {
          errorMessage = 'حدث خطأ في الخادم، يرجى المحاولة لاحقاً';
        } else if (errorMessage.includes('exceeded')) {
          errorMessage = 'تم تجاوز الحد المسموح به، يرجى المحاولة لاحقاً';
        }
      }

      setSendStatus({
        success: false,
        message: errorMessage,
        ticketNumber: ''
      });
      console.error('فشل الإرسال:', error);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="mx-auto pb-16 pt-12 md:pb-24 md:pt-16 min-h-screen"
    >
      {/* شعار العائلة */}
      <div className="flex justify-center mb-12">
        <div className="flex flex-col items-center gap-3">
          <h1 className="font-cairo flex items-center gap-4 text-primary text-3xl md:text-4xl font-bold leading-10 text-right underline">
            <MailQuestionIcon className="w-10 h-10" /> تواصل معنا
          </h1>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 lg:[&>*:nth-child(1)]:order-2 lg:[&>*:nth-child(2)]:order-1 gap-8 p-10 max-w-7xl mx-auto">
        {/* نموذج التواصل */}
        <div className="p-6 md:p-8 lg:rounded-e-2xl rounded-2xl shadow-lg bg-white">
          <h2 className="text-primary font-cairo text-3xl md:text-4xl font-semibold leading-10 mb-8 text-right">
            أرسل لنا رسالة
          </h2>

          {sendStatus && (
            <div className={`mb-6 p-4 rounded-lg ${sendStatus.success ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
              {sendStatus.message}
              {sendStatus.ticketNumber && (
                <div className="mt-2 font-bold">
                  رقم التذكرة: {sendStatus.ticketNumber}
                </div>
              )}
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1 text-right">
                  الاسم الكامل *
                </label>
                <input
                  type="text"
                  id="name"
                  {...register("name", { required: "هذا الحقل مطلوب" })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-primary/90 focus:border-primary/90 text-right"
                  dir="rtl"
                />
                {errors.name && (
                  <p className="mt-1 text-sm text-red-600 text-right">
                    {errors.name.message}
                  </p>
                )}
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1 text-right">
                  البريد الإلكتروني *
                </label>
                <input
                  type="email"
                  id="email"
                  {...register("email", {
                    required: "هذا الحقل مطلوب",
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: "بريد إلكتروني غير صالح",
                    },
                  })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-primary/90 focus:border-primary/90 text-right"
                  dir="rtl"
                />
                {errors.email && (
                  <p className="mt-1 text-sm text-red-600 text-right">
                    {errors.email.message}
                  </p>
                )}
              </div>
            </div>

            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1 text-right">
                رقم الهاتف
              </label>
              <input
                type="tel"
                id="phone"
                {...register("phone")}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-primary/90 focus:border-primary/90 text-right"
                dir="rtl"
              />
            </div>

            <div>
              <label htmlFor="department" className="block text-sm font-medium text-gray-700 mb-1 text-right">
                القسم المراد التواصل معه *
              </label>
              <select
                id="department"
                {...register("department", { required: "يرجى اختيار القسم" })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-primary/90 focus:border-primary/90 text-right"
                dir="rtl"
              >
                <option value="">اختر القسم...</option>
                <option value="finance">القسم المالي</option>
                <option value="social">القسم الاجتماعي</option>
                <option value="administration">الإدارة العامة</option>
                <option value="technical">الدعم الفني</option>
                <option value="complaints">شكاوى عامة</option>
                <option value="hr">شؤون الموظفين</option>
                <option value="services">خدمات العملاء</option>
              </select>
              {errors.department && (
                <p className="mt-1 text-sm text-red-600 text-right">
                  {errors.department.message}
                </p>
              )}
            </div>

            <div>
              <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1 text-right">
                الرسالة *
              </label>
              <textarea
                id="message"
                rows={5}
                {...register("message", {
                  required: "هذا الحقل مطلوب",
                  minLength: {
                    value: 10,
                    message: "يجب أن تحتوي الرسالة على الأقل على 10 أحرف"
                  }
                })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-primary/90 focus:border-primary/90 text-right"
                dir="rtl"
              ></textarea>
              {errors.message && (
                <p className="mt-1 text-sm text-red-600 text-right">
                  {errors.message.message}
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={isSending}
              className={`w-full h-12 text-white text-base font-semibold leading-6 rounded-full transition-all duration-300 hover:bg-primary/90 bg-primary shadow-sm ${isSending ? 'opacity-70 cursor-not-allowed' : ''} flex items-center justify-center`}
            >
              {isSending ? (
                <>
                  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span className="mr-2">جاري الإرسال...</span>
                </>
              ) : (
                <>
                  <Send className="w-5 h-5 ml-2" />
                  <span>إرسال الرسالة</span>
                </>
              )}
            </button>
          </form>
        </div>

        {/* معلومات التواصل */}
        <div className="lg:mb-0 mb-10">
          <div className="group w-full h-full">
            <div className="relative h-full min-h-[60vh] rounded-2xl overflow-hidden">
              <img
                src="https://www.shutterstock.com/shutterstock/videos/1027983752/thumb/1.jpg?ip=x480"
                alt="صورة تواصل"
                className="w-full h-full object-cover"
              />
              <div className="absolute bottom-0 w-full lg:p-8 p-4">
                <div className="bg-white rounded-lg p-6 block shadow-lg">
                  <div className="rounded-xl py-6">
                    <div className="space-y-4">
                      <div className="flex items-start gap-4">
                        <div className="p-2 bg-primary/5 rounded-full">
                          <Mail className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                          <h3 className="font-medium text-gray-700">البريد الإلكتروني</h3>
                          <a href="mailto:elsaqrfamily@gmail.com" className="text-primary hover:text-primary/90">
                            elsaqrfamily@gmail.com
                          </a>
                        </div>
                      </div>
                    </div>

                    <div className="mt-8 bg-gray-50 p-4 rounded-lg">
                      <h3 className="font-medium text-gray-700 mb-2">ملاحظة:</h3>
                      <p className="text-sm text-gray-600">
                        جميع الرسائل تصل أولاً إلى مدير النظام الذي سيقوم بتحويلها إلى القسم المختص خلال 24-48 ساعة.
                      </p>
                      <p className="text-sm text-gray-600 mt-2">
                        سيصلك تأكيد بإرسال الشكوى مع رقم التذكرة على بريدك الإلكتروني.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ContactUs;