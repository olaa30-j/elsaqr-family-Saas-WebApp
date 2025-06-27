import React from "react";

interface IPrivacyPolicyPopup {
    closePopup: () => void;
}

const PrivacyPolicyPopup: React.FC<IPrivacyPolicyPopup> = ({ closePopup }) => {
    const handleBackdropClick = (e: React.MouseEvent) => {
        if (e.target === e.currentTarget) {
            closePopup();
        }
    };

    return (
        <div
            className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-[1000] p-4"
            onClick={handleBackdropClick}
        >
            <div className="max-w-3xl w-full max-h-[90vh] overflow-y-auto bg-white dark:bg-gray-800 rounded-xl shadow-2xl scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600 scrollbar-track-transparent scrollbar-hide">
                {/* Header */}
                <div className="sticky top-0 bg-white dark:bg-gray-800 p-5 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center z-10">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
                            سياسة الخصوصية
                        </h2>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                            تطبيق صندوق أسرة صقر الدهمش
                        </p>
                    </div>
                    <button
                        onClick={closePopup}
                        className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                        aria-label="إغلاق سياسة الخصوصية"
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-6 w-6 text-gray-500 dark:text-gray-400"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M6 18L18 6M6 6l12 12"
                            />
                        </svg>
                    </button>
                </div>

                {/* Content */}
                <div className="p-6 text-gray-700 dark:text-gray-300">
                    <div className="prose dark:prose-invert max-w-none">
                        <p className="mb-6 text-lg">
                            نحن في صندوق أسرة صقر الدهمش نولي أهمية بالغة لاحترام خصوصية
                            مستخدمينا والحفاظ على سرية بياناتهم، ونعمل بكل جدية على حماية جميع
                            المعلومات التي يتم جمعها من خلال التطبيق.
                        </p>

                        <Section title="1. معلومات الهوية الشخصية">
                            <p>
                                قد نقوم بجمع معلومات التعريف الشخصية من المستخدمين بطرق متنوعة، تشمل
                                على سبيل المثال لا الحصر: التسجيل في التطبيق، التفاعل مع الخدمات أو
                                الميزات التي نوفرها، أو المشاركة في الفعاليات والدورات العائلية.
                            </p>
                            <p className="mt-3">
                                قد يُطلب من المستخدمين تقديم الاسم الكامل، البريد الإلكتروني، رقم
                                الهاتف، والصورة الشخصية. تُستخدم هذه المعلومات للتواصل مع أفراد
                                الأسرة، ترتيب الفعاليات، تقديم الخدمات، وتحسين تجربة المستخدم داخل
                                التطبيق.
                            </p>
                        </Section>

                        <Section title="2. معلومات غير متعلقة بالهوية الشخصية">
                            <p>
                                قد نقوم بجمع معلومات غير شخصية عن المستخدمين عند تفاعلهم مع التطبيق،
                                مثل نوع الجهاز، نظام التشغيل، نوع الاتصال بالإنترنت، ومزود الخدمة.
                                تُستخدم هذه البيانات لأغراض تقنية وتحليلية تهدف إلى تحسين أداء
                                التطبيق.
                            </p>
                        </Section>

                        <Section title="3. استخدام المعلومات">
                            <p className="mb-3">نقوم باستخدام المعلومات التي يتم جمعها للأغراض التالية:</p>
                            <ul className="space-y-2">
                                <li className="flex items-start">
                                    <span className="inline-block mr-2 text-primary-500">•</span>
                                    <span>تحسين خدمة العملاء والاستجابة السريعة للاحتياجات</span>
                                </li>
                                <li className="flex items-start">
                                    <span className="inline-block mr-2 text-primary-500">•</span>
                                    <span>تطوير وتحسين التطبيق والمحتوى والخدمات بناءً على الملاحظات</span>
                                </li>
                                <li className="flex items-start">
                                    <span className="inline-block mr-2 text-primary-500">•</span>
                                    <span>التواصل مع المستخدمين بشأن الأنشطة العائلية والخدمات ذات الصلة</span>
                                </li>
                            </ul>
                        </Section>

                        {/* الأقسام الأخرى بنفس النمط */}
                        <Section title="4. حماية المعلومات">
                            <p>
                                نلتزم بإجراءات أمنية صارمة لحماية البيانات من الوصول أو التعديل أو
                                الكشف غير المصرح به. نوظف تقنيات تشفير وضوابط وصول صارمة لحماية
                                معلوماتكم.
                            </p>
                        </Section>

                        <Section title="5. مشاركة المعلومات">
                            <p>
                                نحن لا نبيع أو نؤجر أو نتاجر بمعلومات الهوية الشخصية لأي طرف ثالث. قد نشارك بيانات عامة غير مرتبطة بالهوية الشخصية مع شركائنا أو مقدمي الخدمات لأغراض إدارية أو تقنية. في بعض الحالات، قد نستخدم مزودي خدمة خارجيين لمساعدتنا في إدارة أنشطة مثل إرسال الإشعارات أو تنظيم الاستبيانات، ويتم تزويدهم فقط بالمعلومات اللازمة لتنفيذ مهامهم
                            </p>
                        </Section>

                        <Section title="6. روابط الطرف الثالث">
                            <p>
                                قد يتضمن التطبيق روابط لمواقع أو خدمات أطراف ثالثة مثل الرعاة أو الموردين. نحن غير مسؤولين عن سياسات الخصوصية أو المحتوى الخاص بتلك المواقع، ونوصي بمراجعتها قبل تقديم أي معلومات
                            </p>
                        </Section>

                        <Section title="7. التعديلات على سياسة الخصوصية">
                            <p>
                                نحتفظ بالحق في تحديث سياسة الخصوصية في أي وقت. سيتم تحديد تاريخ آخر تحديث أسفل هذه الصفحة، ونشجع المستخدمين على مراجعة السياسة بشكل دوري للاطلاع على أي تغييرات
                            </p>
                        </Section>

                        <Section title="8. موافقتك على السياسة">
                            <p>
                                باستخدامك لهذا التطبيق، فإنك توافق على بنود هذه السياسة وشروط الاستخدام. إذا لم تكن موافقاً، يُرجى عدم استخدام التطبيق. استمرار الاستخدام بعد إدخال أي تعديلات يُعد موافقة ضمنية عليها
                            </p>
                        </Section>


                        <Section title="9. الختام">
                            <p className="font-medium">
                                نؤكد على أهمية خصوصية المعلومات العائلية، ونلتزم بحمايتها وتعزيز
                                الثقة المتبادلة بين أفراد الأسرة والمنصة.
                            </p>
                        </Section>

                        <div className="mt-8 p-4 bg-gray-50 dark:bg-gray-700/30 rounded-lg border border-gray-200 dark:border-gray-700">
                            <p className="text-sm text-gray-600 dark:text-gray-300">
                                <span className="font-semibold">تاريخ آخر تحديث:</span> 27 يونيو 2025
                            </p>
                        </div>
                    </div>
                </div>

                {/* Footer Buttons */}
                <div className="sticky bottom-0 bg-white dark:bg-gray-800 p-4 border-t border-gray-200 dark:border-gray-700 flex justify-end space-x-3">
                    <button
                        onClick={closePopup}
                        className="px-6 py-3 bg-primary hover:bg-primary/90 text-white font-medium rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
                    >
                        أوافق
                    </button>
                </div>
            </div>
        </div>
    );
};

// مكون مساعد محسّن
const Section: React.FC<{ title: string; children: React.ReactNode }> = ({
    title,
    children,
}) => (
    <div className="mt-8">
        <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-3 flex items-center">
            <span className="w-3 h-3 bg-primary-500 rounded-full"></span>
            {title}
        </h3>
        <div className="text-gray-700 px-2 dark:text-gray-300 space-y-3 pl-6 border-r-2 border-primary-100 dark:border-gray-700">
            {children}
        </div>
    </div>
);

export default PrivacyPolicyPopup;