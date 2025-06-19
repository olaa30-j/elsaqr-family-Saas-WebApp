import { motion } from "framer-motion";
import { Mail, MailQuestionIcon, Send } from "lucide-react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { useState } from 'react';
import Footer from "../../components/shared/Footer";
import emailjs from '@emailjs/browser';

interface ContactFormData {
  name: string;
  email: string;
  phone?: string;
  department: 'finance' | 'social' | 'administration' | 'technical';
  message: string;
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

  const onSubmit: SubmitHandler<ContactFormData> = async (data) => {
    setIsSending(true);
    setSendStatus({ success: false, message: '' });

    try {
      const adminPromise = emailjs.send(
        'service_vfong02',
        'template_97hnbpp',
        {
          name: data.name,
          email: data.email,
          phone: data.phone || 'غير متوفر',
          department: getDepartmentName(data.department),
          message: data.message,
          date: new Date().toLocaleDateString('ar-EG'),
        },
        'YD9WeZIAC8Glvj7bh'
      );

      const userPromise = emailjs.send(
        'service_vfong02',
        'template_w1pbb7t',
        {
          name: data.name,
          email: data.email,
          department: getDepartmentName(data.department),
          date: new Date().toLocaleDateString('ar-EG'),
          ticket_number: `TKT-${Date.now().toString().slice(-6)}`,
        },
        'YD9WeZIAC8Glvj7bh'
      );

      await Promise.all([adminPromise, userPromise]);

      setSendStatus({
        success: true,
        message: 'تم إرسال رسالتك بنجاح! سيصلك إيميل تأكيد قريباً'
      });
      reset();
    } catch (error) {
      console.error('Error sending emails:', error);
      setSendStatus({
        success: false,
        message: 'حدث خطأ أثناء إرسال الرسالة. يرجى المحاولة مرة أخرى.'
      });
    } finally {
      setIsSending(false);
    }
  };

  const getDepartmentName = (department: string) => {
    switch (department) {
      case 'finance': return 'القسم المالي';
      case 'social': return 'القسم الاجتماعي';
      case 'administration': return 'إدارة العامة';
      case 'technical': return 'الدعم الفني';
      default: return department;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className=" mx-auto pb-16 pt-12 md:pb-24 md:pt-16 min-h-screen"
    >
      {/* شعار العائلة */}
      <div className="flex justify-center mb-12">
        <div className="flex flex-col items-center gap-3">
          <h1 className="font-cairo flex items-center gap-4 text-primary text-3xl md:text-4xl font-bold leading-10 text-right underline">
           <MailQuestionIcon className="w-10 h-10"/> تواصل معنا 
          </h1>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 lg:[&>*:nth-child(1)]:order-2 lg:[&>*:nth-child(2)]:order-1 gap-8 p-10 max-w-7xl">

        {/* الجزء الأيمن - نموذج التواصل */}
        <div className="p-6 md:p-8 lg:rounded-e-2xl rounded-2xl shadow-lg">
          <h2 className="text-primary font-cairo text-3xl md:text-4xl font-semibold leading-10 mb-8 text-right">
            أرسل لنا رسالة
          </h2>

          {sendStatus.message && (
            <div className={`mb-6 p-4 rounded-lg ${sendStatus.success ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
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

            {/* قسم جديد لاختيار القسم */}
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
                <option value="administration">إدارة العامة</option>
                <option value="technical">الدعم الفني</option>
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
                {...register("message", { required: "هذا الحقل مطلوب" })}
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
              className={`w-full h-12 text-white text-base font-semibold leading-6 rounded-full transition-all duration-300 hover:bg-primary bg-primary shadow-sm ${isSending ? 'opacity-70 cursor-not-allowed' : ''
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

                {/* الجزء الأيسر - معلومات التواصل */}
        <div className="lg:mb-0 mb-10">
          <div className="group w-full h-full">
            <div className="relative h-full min-h-[60vh]">
              <img
                src="https://www.shutterstock.com/shutterstock/videos/1027983752/thumb/1.jpg?ip=x480"
                alt="صورة تواصل"
                className="w-full h-full lg:rounded-s-2xl rounded-2xl bg-blend-multiply bg-primary object-cover"
              />
              <div className="absolute bottom-0 w-full lg:p-8 p-4">
                <div className="bg-white rounded-lg p-6 block shadow-lg">
                  <div className="bg-white rounded-xl py-6 h-fit">
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
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>

      <div className="-mb-20 mt-10 border-t border-gray-300">
        <Footer />
      </div>
    </motion.div>
  );
};

export default ContactUs;



// import { motion } from "framer-motion";
// import { Mail, MailQuestionIcon, Send } from "lucide-react";
// import { useForm, type SubmitHandler } from "react-hook-form";
// import { useState } from 'react';
// import Footer from "../../components/shared/Footer";

// interface ContactFormData {
//   name: string;
//   email: string;
//   phone?: string;
//   department: 'finance' | 'social' | 'administration' | 'technical';
//   message: string;
// }

// const ContactUs = () => {
//   const {
//     register,
//     handleSubmit,
//     formState: { errors },
//     reset,
//   } = useForm<ContactFormData>();

//   const [isSending, setIsSending] = useState(false);
//   const [sendStatus, setSendStatus] = useState({
//     success: false,
//     message: ''
//   });

//   const onSubmit: SubmitHandler<ContactFormData> = async (data) => {
//     setIsSending(true);
//     setSendStatus({ success: false, message: '' });

//     try {
//       const departmentName = getDepartmentName(data.department);
      
//       const response = await fetch('https://backend-tests-delta.vercel.app/api/v1/contact', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({
//           ...data,
//           department: departmentName,
//           date: new Date().toLocaleDateString('ar-EG'),
//           ticket_number: `TKT-${Date.now().toString().slice(-6)}`,
//         }),
//       });

//       if (!response.ok) {
//         throw new Error('Network response was not ok');
//       }

//       const result = await response.json();

//       if (result.success) {
//         setSendStatus({
//           success: true,
//           message: 'تم إرسال رسالتك بنجاح! سيصلك إيميل تأكيد قريباً'
//         });
//         reset();
//       } else {
//         throw new Error(result.message || 'Failed to send message');
//       }
//     } catch (error) {
//       console.error('Error sending message:', error);
//       setSendStatus({
//         success: false,
//         message: 'حدث خطأ أثناء إرسال الرسالة. يرجى المحاولة مرة أخرى.'
//       });
//     } finally {
//       setIsSending(false);
//     }
//   };

//   const getDepartmentName = (department: string) => {
//     switch (department) {
//       case 'finance': return 'القسم المالي';
//       case 'social': return 'القسم الاجتماعي';
//       case 'administration': return 'إدارة العامة';
//       case 'technical': return 'الدعم الفني';
//       default: return department;
//     }
//   };

//   return (
//     <motion.div
//       initial={{ opacity: 0, y: 20 }}
//       animate={{ opacity: 1, y: 0 }}
//       transition={{ duration: 0.4 }}
//       className=" mx-auto pb-16 pt-12 md:pb-24 md:pt-16 min-h-screen"
//     >
//       {/* شعار العائلة */}
//       <div className="flex justify-center mb-12">
//         <div className="flex flex-col items-center gap-3">
//           <h1 className="font-cairo flex items-center gap-4 text-primary text-3xl md:text-4xl font-bold leading-10 text-right underline">
//            <MailQuestionIcon className="w-10 h-10"/> تواصل معنا 
//           </h1>
//         </div>
//       </div>

//       <div className="grid grid-cols-1 lg:grid-cols-2 lg:[&>*:nth-child(1)]:order-2 lg:[&>*:nth-child(2)]:order-1 gap-8 p-10 max-w-7xl">

//         {/* الجزء الأيمن - نموذج التواصل */}
//         <div className="p-6 md:p-8 lg:rounded-e-2xl rounded-2xl shadow-lg">
//           <h2 className="text-primary font-cairo text-3xl md:text-4xl font-semibold leading-10 mb-8 text-right">
//             أرسل لنا رسالة
//           </h2>

//           {sendStatus.message && (
//             <div className={`mb-6 p-4 rounded-lg ${sendStatus.success ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
//               }`}>
//               {sendStatus.message}
//             </div>
//           )}

//           <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
//             <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
//               <div>
//                 <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1 text-right">
//                   الاسم الكامل *
//                 </label>
//                 <input
//                   type="text"
//                   id="name"
//                   {...register("name", { required: "هذا الحقل مطلوب" })}
//                   className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-primary/90 focus:border-primary/90 text-right"
//                   dir="rtl"
//                 />
//                 {errors.name && (
//                   <p className="mt-1 text-sm text-red-600 text-right">
//                     {errors.name.message}
//                   </p>
//                 )}
//               </div>

//               <div>
//                 <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1 text-right">
//                   البريد الإلكتروني *
//                 </label>
//                 <input
//                   type="email"
//                   id="email"
//                   {...register("email", {
//                     required: "هذا الحقل مطلوب",
//                     pattern: {
//                       value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
//                       message: "بريد إلكتروني غير صالح",
//                     },
//                   })}
//                   className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-primary/90 focus:border-primary/90 text-right"
//                   dir="rtl"
//                 />
//                 {errors.email && (
//                   <p className="mt-1 text-sm text-red-600 text-right">
//                     {errors.email.message}
//                   </p>
//                 )}
//               </div>
//             </div>

//             <div>
//               <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1 text-right">
//                 رقم الهاتف
//               </label>
//               <input
//                 type="tel"
//                 id="phone"
//                 {...register("phone")}
//                 className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-primary/90 focus:border-primary/90 text-right"
//                 dir="rtl"
//               />
//             </div>

//             {/* قسم جديد لاختيار القسم */}
//             <div>
//               <label htmlFor="department" className="block text-sm font-medium text-gray-700 mb-1 text-right">
//                 القسم المراد التواصل معه *
//               </label>
//               <select
//                 id="department"
//                 {...register("department", { required: "يرجى اختيار القسم" })}
//                 className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-primary/90 focus:border-primary/90 text-right"
//                 dir="rtl"
//               >
//                 <option value="">اختر القسم...</option>
//                 <option value="finance">القسم المالي</option>
//                 <option value="social">القسم الاجتماعي</option>
//                 <option value="administration">إدارة العامة</option>
//                 <option value="technical">الدعم الفني</option>
//               </select>
//               {errors.department && (
//                 <p className="mt-1 text-sm text-red-600 text-right">
//                   {errors.department.message}
//                 </p>
//               )}
//             </div>

//             <div>
//               <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1 text-right">
//                 الرسالة *
//               </label>
//               <textarea
//                 id="message"
//                 rows={5}
//                 {...register("message", { required: "هذا الحقل مطلوب" })}
//                 className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-primary/90 focus:border-primary/90 text-right"
//                 dir="rtl"
//               ></textarea>
//               {errors.message && (
//                 <p className="mt-1 text-sm text-red-600 text-right">
//                   {errors.message.message}
//                 </p>
//               )}
//             </div>

//             <button
//               type="submit"
//               disabled={isSending}
//               className={`w-full h-12 text-white text-base font-semibold leading-6 rounded-full transition-all duration-300 hover:bg-primary bg-primary shadow-sm ${isSending ? 'opacity-70 cursor-not-allowed' : ''
//                 }`}
//             >
//               {isSending ? (
//                 <>
//                   <svg className="animate-spin inline-block h-5 w-5 text-white mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
//                     <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
//                     <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
//                   </svg>
//                   جاري الإرسال...
//                 </>
//               ) : (
//                 <>
//                   <Send className="inline-block w-5 h-5 ml-2" />
//                   إرسال الرسالة
//                 </>
//               )}
//             </button>
//           </form>
//         </div>

//         {/* الجزء الأيسر - معلومات التواصل */}
//         <div className="lg:mb-0 mb-10">
//           <div className="group w-full h-full">
//             <div className="relative h-full min-h-[60vh]">
//               <img
//                 src="https://www.shutterstock.com/shutterstock/videos/1027983752/thumb/1.jpg?ip=x480"
//                 alt="صورة تواصل"
//                 className="w-full h-full lg:rounded-s-2xl rounded-2xl bg-blend-multiply bg-primary object-cover"
//               />
//               <div className="absolute bottom-0 w-full lg:p-8 p-4">
//                 <div className="bg-white rounded-lg p-6 block shadow-lg">
//                   <div className="bg-white rounded-xl py-6 h-fit">
//                     <div className="space-y-4">
//                       <div className="flex items-start gap-4">
//                         <div className="p-2 bg-primary/5 rounded-full">
//                           <Mail className="w-5 h-5 text-primary" />
//                         </div>
//                         <div>
//                           <h3 className="font-medium text-gray-700">البريد الإلكتروني</h3>
//                           <a href="mailto:elsaqrfamily@gmail.com" className="text-primary hover:text-primary/90">
//                             elsaqrfamily@gmail.com
//                           </a>
//                         </div>
//                       </div>
//                     </div>

//                     <div className="mt-8 bg-gray-50 p-4 rounded-lg">
//                       <h3 className="font-medium text-gray-700 mb-2">ملاحظة:</h3>
//                       <p className="text-sm text-gray-600">
//                         جميع الرسائل تصل أولاً إلى مدير النظام الذي سيقوم بتحويلها إلى القسم المختص خلال 24-48 ساعة.
//                       </p>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>

//       </div>

//       <div className="-mb-20 mt-10 border-t border-gray-300">
//         <Footer />
//       </div>
//     </motion.div>
//   );
// };

// export default ContactUs;