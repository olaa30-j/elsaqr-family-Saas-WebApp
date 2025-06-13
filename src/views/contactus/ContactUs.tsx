import { motion } from "framer-motion";
import { Mail, Phone, MapPin, Send } from "lucide-react";
import { useForm, type SubmitHandler } from "react-hook-form";
import emailjs from '@emailjs/browser';
import { useState } from 'react';

// 1. تعريف نوع البيانات للنموذج
interface ContactFormData {
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
  contactMethod?: 'email' | 'phone';
}

const ContactUs = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ContactFormData>();

  const [isSending, setIsSending] = useState(false);
  const [sendStatus, setSendStatus] = useState({ 
    success: false, 
    message: '' 
  });

  // 2. تحديد نوع دالة الإرسال
  const onSubmit: SubmitHandler<ContactFormData> = async (data) => {
    setIsSending(true);
    setSendStatus({ success: false, message: '' });

    try {
      // 3. استبدال هذه القيم بمعلومات حسابك
      const serviceID = 'YOUR_SERVICE_ID';
      const templateID = 'YOUR_TEMPLATE_ID';
      const userID = 'YOUR_USER_ID';

      await emailjs.send(serviceID, templateID, {
        from_name: data.name,
        from_email: data.email,
        phone: data.phone,
        subject: data.subject,
        message: data.message,
        contact_method: data.contactMethod
      }, userID);

      setSendStatus({ 
        success: true, 
        message: 'تم إرسال رسالتك بنجاح!' 
      });
      reset();
    } catch (error) {
      console.error('Error sending email:', error);
      setSendStatus({ 
        success: false, 
        message: 'حدث خطأ أثناء إرسال الرسالة. يرجى المحاولة مرة أخرى.' 
      });
    } finally {
      setIsSending(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="max-w-7xl mx-auto px-4 sm:px-6 py-16 md:py-24 bg-gray-50"
    >
      {/* شعار العائلة */}
      <div className="flex justify-center mb-12">
        <div className="flex items-center gap-3">
          <img 
            src="/logo.png" 
            alt="شجرة العائلة" 
            className="h-12 w-12 object-contain"
          />
          <h1 className="text-2xl font-bold text-indigo-800">شجرة العائلة</h1>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* الجزء الأيسر - معلومات التواصل */}
        <div className="lg:mb-0 mb-10">
          <div className="group w-full h-full">
            <div className="relative h-full">
              <img 
                src="https://images.unsplash.com/photo-1521791136064-7986c2920216?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2069&q=80" 
                alt="صورة تواصل" 
                className="w-full h-full lg:rounded-s-2xl rounded-2xl bg-blend-multiply bg-indigo-700 object-cover"
              />
              <h1 className="font-sans text-white text-3xl md:text-4xl font-bold leading-10 absolute top-8 right-8 text-right">
                تواصل معنا
              </h1>
              <div className="absolute bottom-0 w-full lg:p-8 p-4">
                <div className="bg-white rounded-lg p-6 block shadow-lg">
                  <a href="tel:+966123456789" className="flex items-center mb-6">
                    <Phone className="w-6 h-6 text-indigo-600" />
                    <h5 className="text-black text-base font-normal leading-6 mr-5">
                      +966 12 345 6789
                    </h5>
                  </a>
                  <a href="mailto:info@familytree.com" className="flex items-center mb-6">
                    <Mail className="w-6 h-6 text-indigo-600" />
                    <h5 className="text-black text-base font-normal leading-6 mr-5">
                      info@familytree.com
                    </h5>
                  </a>
                  <div className="flex items-center">
                    <MapPin className="w-6 h-6 text-indigo-600" />
                    <h5 className="text-black text-base font-normal leading-6 mr-5">
                      الرياض، المملكة العربية السعودية
                    </h5>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* خريطة */}
          <div className="bg-gray-100 rounded-xl overflow-hidden h-64 mt-8">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3621.843641714886!2d46.67227631500236!3d24.77451858409017!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3e2ee3e9c6748a25%3A0x45e671f0a6e5f4f1!2sRiyadh!5e0!3m2!1sen!2ssa!4v1620000000000!5m2!1sen!2ssa"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              className="rounded-xl"
            ></iframe>
          </div>
        </div>

        {/* الجزء الأيمن - نموذج التواصل */}
        <div className="bg-white p-6 md:p-8 lg:rounded-e-2xl rounded-2xl shadow-lg">
          <h2 className="text-indigo-600 font-sans text-3xl md:text-4xl font-semibold leading-10 mb-8 text-right">
            أرسل لنا رسالة
          </h2>
          
          {sendStatus.message && (
            <div className={`mb-6 p-4 rounded-lg ${
              sendStatus.success ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
            }`}>
              {sendStatus.message}
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
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 text-right"
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
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 text-right"
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
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 text-right"
                dir="rtl"
              />
            </div>

            <div>
              <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1 text-right">
                الموضوع *
              </label>
              <input
                type="text"
                id="subject"
                {...register("subject", { required: "هذا الحقل مطلوب" })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 text-right"
                dir="rtl"
              />
              {errors.subject && (
                <p className="mt-1 text-sm text-red-600 text-right">
                  {errors.subject.message}
                </p>
              )}
            </div>

            <div className="mb-6 text-right">
              <h4 className="text-gray-500 text-base md:text-lg font-normal leading-7 mb-4">
                طريقة التواصل المفضلة
              </h4>
              <div className="flex justify-end gap-8">
                <div className="flex items-center">
                  <label htmlFor="radio-email" className="flex items-center cursor-pointer text-gray-500 text-base font-normal leading-6">
                    <span className="border border-gray-300 rounded-full ml-2 w-4 h-4"></span> 
                    البريد الإلكتروني
                  </label>
                  <input 
                    id="radio-email" 
                    type="radio" 
                    value="email"
                    {...register("contactMethod")}
                    className="hidden" 
                  />
                </div>
                <div className="flex items-center">
                  <label htmlFor="radio-phone" className="flex items-center cursor-pointer text-gray-500 text-base font-normal leading-6">
                    <span className="border border-gray-300 rounded-full ml-2 w-4 h-4"></span> 
                    الهاتف
                  </label>
                  <input 
                    id="radio-phone" 
                    type="radio" 
                    value="phone"
                    {...register("contactMethod")}
                    className="hidden" 
                  />
                </div>
              </div>
            </div>

            <div>
              <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1 text-right">
                الرسالة *
              </label>
              <textarea
                id="message"
                rows={5}
                {...register("message", { required: "هذا الحقل مطلوب" })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 text-right"
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
              className={`w-full h-12 text-white text-base font-semibold leading-6 rounded-full transition-all duration-300 hover:bg-indigo-800 bg-indigo-600 shadow-sm ${
                isSending ? 'opacity-70 cursor-not-allowed' : ''
              }`}
            >
              {isSending ? (
                <>
                  <svg className="animate-spin inline-block h-5 w-5 text-white mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  جاري الإرسال...
                </>
              ) : (
                <>
                  <Send className="inline-block w-5 h-5 ml-2" />
                  إرسال الرسالة
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </motion.div>
  );
};

export default ContactUs;