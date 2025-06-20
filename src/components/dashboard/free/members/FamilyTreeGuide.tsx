import { motion, AnimatePresence } from "framer-motion";
import { X, Heart, Droplets, GitMerge, ChevronRight, AlertTriangle } from "lucide-react";

/**
 * دليل تفاعلي لشرح شجرة العائلة
 * 
 * @component
 * @example
 * // مثال استخدام أساسي
 * const [isGuideOpen, setIsGuideOpen] = useState(false);
 * 
 * return (
 *   <>
 *     <button onClick={() => setIsGuideOpen(true)}>فتح الدليل</button>
 *     <FamilyTreeGuide 
 *       isOpen={isGuideOpen} 
 *       handleClose={() => setIsGuideOpen(false)} 
 *     />
 *   </>
 * );
 * 
 * @param {Object} props - خصائص المكون
 * @param {boolean} props.isOpen - حالة فتح/إغلاق الدليل
 * @param {function} props.handleClose - دالة لإغلاق الدليل
 * 
 * @returns {JSX.Element} نافذة منبثقة تحتوي على دليل شجرة العائلة
 */

interface IFamilyTreeGuideProps {
    isOpen: boolean;
    handleClose: () => void;
}

const FamilyTreeGuide = ({ isOpen, handleClose }: IFamilyTreeGuideProps) => {
    return (
        <div className="fixed bottom-6 right-6 z-[100]">
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center p-4"
                        onClick={handleClose}
                    >
                        <motion.div
                            initial={{ scale: 0.95, y: 20 }}
                            animate={{ scale: 1, y: 0 }}
                            exit={{ scale: 0.95, y: 20 }}
                            className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-gray-200 dark:border-gray-700"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="p-6 relative">
                                <button
                                    onClick={handleClose}
                                    className="absolute top-5 left-5 text-gray-500 hover:text-rose-600 dark:hover:text-rose-400 transition-colors"
                                >
                                    <X size={26} />
                                </button>

                                <header className="text-center mb-8">
                                    <h2 className="text-xl pt-4 font-bold text-color-2 dark:from-indigo-400 dark:to-purple-400 flex items-center justify-center">
                                        <GitMerge size={32} strokeWidth={2.5} />
                                        الدليل العملي لبناء شجرة العائلة
                                    </h2>
                                    <p className="text-gray-500 dark:text-gray-400 mt-2">
                                        خطوات بسيطة لبناء شجرة عائلتك بشكل صحيح
                                    </p>
                                </header>

                                <div className="space-y-5">
                                    {/* الخطوات الأساسية */}
                                    <div className="bg-blue-50 dark:bg-blue-900/20 p-5 rounded-xl border border-blue-200 dark:border-blue-800/70">
                                        <h3 className="font-bold text-xl text-blue-700 dark:text-blue-300 mb-4 flex items-center gap-2">
                                            <ChevronRight className="text-blue-500" size={24} />
                                            كيف تبدأ بناء شجرة العائلة؟
                                        </h3>
                                        <div className="space-y-3">
                                            <div className="flex items-start gap-3">
                                                <div className="bg-blue-100 dark:bg-blue-800/50 rounded-full w-6 h-6 flex items-center justify-center mt-1 shrink-0">
                                                    <span className="text-blue-700 dark:text-blue-300 font-bold">1</span>
                                                </div>
                                                <p className="text-gray-700 dark:text-gray-300">
                                                    <span className="font-semibold">ابدأ من الجذور:</span> أضف الجد الأكبر ( الجد الأعلى )
                                                </p>
                                            </div>
                                            <div className="flex items-start gap-3">
                                                <div className="bg-blue-100 dark:bg-blue-800/50 rounded-full w-6 h-6 flex items-center justify-center mt-1 shrink-0">
                                                    <span className="text-blue-700 dark:text-blue-300 font-bold">2</span>
                                                </div>
                                                <p className="text-gray-700 dark:text-gray-300">
                                                    <span className="font-semibold">أضف الأبناء:</span> لكل زوجين، أضف أبنائهم وبناتهم
                                                </p>
                                            </div>
                                            <div className="flex items-start gap-3">
                                                <div className="bg-blue-100 dark:bg-blue-800/50 rounded-full w-6 h-6 flex items-center justify-center mt-1 shrink-0">
                                                    <span className="text-blue-700 dark:text-blue-300 font-bold">3</span>
                                                </div>
                                                <p className="text-gray-700 dark:text-gray-300">
                                                    <span className="font-semibold">أكمل الأجيال:</span> تابع إضافة الابناء وزوجاتهم ثم أبنائهم
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* الفروقات المهمة */}
                                    <div className="bg-green-50 dark:bg-green-900/20 p-5 rounded-xl border border-green-200 dark:border-green-800/70">
                                        <h3 className="font-bold text-xl text-green-700 dark:text-green-300 mb-4">
                                            الفرق بين أنواع الأفراد في الشجرة
                                        </h3>
                                        <div className="grid gap-4">
                                            <div className="flex items-start gap-3">
                                                <Droplets className="shrink-0 mt-1 text-blue-500" size={20} />
                                                <div>
                                                    <h4 className="font-semibold text-gray-800 dark:text-gray-200">الابن/الابنة</h4>
                                                    <p className="text-sm text-gray-600 dark:text-gray-400">
                                                         هم الأبناء البيولوجيون الذين يحملون دم العائلة، يتم إضافتهم باختيار "ابن" أو "ابنة" وتحديد أبويهم
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="flex items-start gap-3">
                                                <Heart className="shrink-0 mt-1 text-rose-500" size={20} />
                                                <div>
                                                    <h4 className="font-semibold text-gray-800 dark:text-gray-200">الزوج/الزوجة</h4>
                                                    <p className="text-sm text-gray-600 dark:text-gray-400">
                                                        هم أزواج الأبناء أو بنات العائلة، لا يحملون دم العائلة ولكنهم جزء من الأسرة
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* التحذيرات المهمة */}
                                    <div className="bg-amber-50 dark:bg-amber-900/20 p-5 rounded-xl border border-amber-200 dark:border-amber-800/70">
                                        <h3 className="font-bold text-xl text-amber-700 dark:text-amber-300 mb-4 flex items-center gap-2">
                                            <AlertTriangle className="text-amber-500" size={24} />
                                            تحذيرات مهمة يجب تجنبها
                                        </h3>
                                        <div className="space-y-3">
                                            <div className="flex items-start gap-3">
                                                <div className="bg-amber-100 dark:bg-amber-800/50 rounded-full w-6 h-6 flex items-center justify-center mt-1 shrink-0">
                                                    <span className="text-amber-700 dark:text-amber-300 font-bold">!</span>
                                                </div>
                                                <p className="text-gray-700 dark:text-gray-300">
                                                    <span className="font-semibold">لا تضيف زوجة بدون ابن:</span> كل زوجة يجب أن تكون مرتبطة بابن من العائلة فى خانة (الزوج لديها)
                                                </p>
                                            </div>
                                            <div className="flex items-start gap-3">
                                                <div className="bg-amber-100 dark:bg-amber-800/50 rounded-full w-6 h-6 flex items-center justify-center mt-1 shrink-0">
                                                    <span className="text-amber-700 dark:text-amber-300 font-bold">!</span>
                                                </div>
                                                <p className="text-gray-700 dark:text-gray-300">
                                                    <span className="font-semibold">لا تخلط بين الأبناء والزوجات:</span> الزوجات ليسوا أبناء للعائلة حتى لو كانوا مقربين
                                                </p>
                                            </div>
                                            <div className="flex items-start gap-3">
                                                <div className="bg-amber-100 dark:bg-amber-800/50 rounded-full w-6 h-6 flex items-center justify-center mt-1 shrink-0">
                                                    <span className="text-amber-700 dark:text-amber-300 font-bold">!</span>
                                                </div>
                                                <p className="text-gray-700 dark:text-gray-300">
                                                    <span className="font-semibold">تأكد من صحة الأبوين:</span> كل ابن يجب أن يكون له أب وأم حقيقيان في الشجرة
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* نصائح إضافية */}
                                    <div className="bg-purple-50 dark:bg-purple-900/20 p-5 rounded-xl border border-purple-200 dark:border-purple-800/70">
                                        <h3 className="font-bold text-xl text-purple-700 dark:text-purple-300 mb-4">
                                            نصائح لشجرة عائلة متكاملة
                                        </h3>
                                        <ul className="space-y-2 list-disc list-inside text-gray-700 dark:text-gray-300">
                                            <li>ابدأ بالأجيال الأكبر ثم انتقل للأصغر</li>
                                            <li>سجل تواريخ الميلاد والوفاة عندما تكون متوفرة</li>
                                            <li>أضف صورًا للأفراد لجعل الشجرة أكثر حيوية</li>
                                            <li>التأكد من تطابق البيانات بين سجلات الاعضاء</li>
                                        </ul>
                                    </div>
                                </div>

                                <footer className="mt-8 pt-5 border-t border-gray-200 dark:border-gray-700 text-center text-gray-500 dark:text-gray-400">
                                    <p>شجرة العائلة وثيقة حية تحكي تاريخ أسرتك للأجيال القادمة</p>
                                </footer>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default FamilyTreeGuide;