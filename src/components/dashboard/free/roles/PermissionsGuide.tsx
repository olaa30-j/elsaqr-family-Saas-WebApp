import { motion, AnimatePresence } from "framer-motion";
import { X, User, Shield, CreditCard, Calendar, Image, Users, Settings, HelpCircle, Lock, LockOpen, Trash2 } from "lucide-react";

interface IPermissionsGuideProps {
    isOpen: boolean;
    handleClose: () => void;
}

const PermissionsGuide = ({ isOpen, handleClose }: IPermissionsGuideProps) => {
    // تعريف الأقسام والصلاحيات
    const sections = [
        {
            title: "الملف الشخصي",
            icon: <User size={18} className="text-blue-500" />,
            permissions: ["عرض البيانات الشخصية"],
            description: "عرض وتعديل المعلومات الشخصية",
            path: "/profile",
            access: "جميع الأعضاء"
        },
        {
            title: "الدعم الفني",
            icon: <HelpCircle size={18} className="text-gray-500" />,
            permissions: [],
            description: "صفحة التواصل مع الدعم الفني",
            path: "/contact-us",
            access: "جميع الأعضاء"
        },
        {
            title: "لوحة الإدارة",
            icon: <Settings size={18} className="text-purple-500" />,
            permissions: ["تفعيل إدارة المستخدمين", "تفعيل إدارة الأعضاء"],
            description: "لوحة التحكم الرئيسية للمدراء",
            path: "/admin/dashboard",
            access: "المستخدمون المفعلون فقط",
            activationRequired: true
        },
        {
            title: "الأدوار والصلاحيات",
            icon: <Shield size={18} className="text-purple-500" />,
            permissions: ["تفعيل إدارة المستخدمين", "تفعيل إدارة الأعضاء"],
            description: "إدارة أدوار المستخدمين والصلاحيات",
            path: "/admin/roles-permissions",
            access: "المستخدمون المفعلون فقط",
            activationRequired: true
        },
        {
            title: "اللجنة المالية",
            icon: <CreditCard size={18} className="text-green-500" />,
            permissions: ["عرض المعاملات المالية", "تعديل المعاملات", "حذف المعاملات"],
            description: "إدارة المعاملات المالية والميزانية",
            paths: [
                { path: "/financial", permission: "عرض" },
                { path: "/financial/:id", permission: "عرض" },
                { path: "/financial/edit/:id", permission: "تعديل" },
                { path: "/financial/delete/:id", permission: "حذف" }
            ],
            access: "المستخدمون المفعلون للوحة الإدارة",
            activationRequired: true,
            deleteNote: "لظهور زر الحذف يجب تفعيل صلاحية الحذف"
        },
        {
            title: "اللجنة الاجتماعية",
            icon: <Calendar size={18} className="text-blue-500" />,
            permissions: ["عرض المناسبات", "تعديل المناسبات", "حذف المناسبات"],
            description: "إدارة المناسبات والفعاليات الاجتماعية",
            paths: [
                { path: "/events", permission: "عرض" },
                { path: "/events/:id", permission: "عرض" },
                { path: "/events/edit/:id", permission: "تعديل" },
                { path: "/events/delete/:id", permission: "حذف" }
            ],
            access: "المستخدمون المفعلون للوحة الإدارة",
            activationRequired: true,
            deleteNote: "لظهور زر الحذف يجب تفعيل صلاحية الحذف"
        },
        {
            title: "إدارة الإعلانات",
            icon: <CreditCard size={18} className="text-rose-500" />,
            permissions: ["عرض الإعلانات", "تعديل الإعلانات", "حذف الإعلانات"],
            description: "إدارة الإعلانات والتعديل عليها",
            paths: [
                { path: "/advertisement", permission: "عرض" },
                { path: "/advertisement-details/:id", permission: "عرض" },
                { path: "/advertisement-edit/:id", permission: "تعديل" },
                { path: "/advertisement-delete/:id", permission: "حذف" }
            ],
            access: "المستخدمون المفعلون للوحة الإدارة",
            activationRequired: true,
            deleteNote: "لظهور زر الحذف يجب تفعيل صلاحية الحذف"
        },
        {
            title: "شجرة العائلة",
            icon: <Users size={18} className="text-emerald-500" />,
            permissions: ["عرض شجرة العائلة"],
            description: "عرض شجرة العائلة والأعضاء",
            path: "/family-tree/:branch",
            access: "جميع الأعضاء"
        },
        {
            title: "معرض الصور",
            icon: <Image size={18} className="text-amber-500" />,
            permissions: ["عرض الألبومات", "تعديل الألبومات", "حذف الألبومات"],
            description: "عرض ألبومات الصور العائلية",
            paths: [
                { path: "/albums", permission: "عرض" },
                { path: "/albums/:id", permission: "عرض" },
                { path: "/albums/edit/:id", permission: "تعديل" },
                { path: "/albums/delete/:id", permission: "حذف" }
            ],
            access: "جميع الأعضاء",
            deleteNote: "لظهور زر الحذف يجب تفعيل صلاحية الحذف"
        }
    ];

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

                                <header className="text-center mb-6">
                                    <h2 className="text-xl pt-4 font-bold text-gray-800 dark:text-white flex items-center justify-center gap-2">
                                        <Shield size={28} />
                                        دليل الصلاحيات والتفعيل
                                    </h2>
                                    <p className="text-gray-500 dark:text-gray-400 mt-2">
                                        الفرق بين العضو العادي والمستخدم المفعل
                                    </p>
                                </header>

                                {/* شرح عام */}
                                <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg mb-6 border border-blue-200 dark:border-blue-800/70">
                                    <div className="flex items-start gap-3">
                                        <div className="mt-1">
                                            <LockOpen size={20} className="text-blue-500" />
                                        </div>
                                        <div>
                                            <h3 className="font-semibold text-blue-800 dark:text-blue-200 mb-1">معلومات عامة</h3>
                                            <p className="text-sm text-gray-700 dark:text-gray-300">
                                                جميع الأعضاء يمكنهم الوصول للصفحات الأساسية، ولكن لاستخدام لوحة الإدارة يجب تفعيل العضو كمستخدم من قبل المدير.
                                                <br />
                                                <span className="font-medium mt-1 block">ملاحظة:</span> 
                                                أزرار الحذف في الأقسام المختلفة لن تظهر إلا بعد تفعيل صلاحية الحذف لكل قسم.
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* قائمة الأقسام */}
                                <div className="space-y-4">
                                    {sections.map((section, index) => (
                                        <div key={index} className={`bg-gray-50 dark:bg-gray-700/30 p-4 rounded-lg border ${section.activationRequired ? 'border-purple-200 dark:border-purple-800/70' : 'border-gray-200 dark:border-gray-700'}`}>
                                            <div className="flex items-start gap-3">
                                                <div className="mt-1">
                                                    {section.activationRequired ? (
                                                        <Lock size={18} className="text-purple-500" />
                                                    ) : (
                                                        <LockOpen size={18} className="text-gray-500" />
                                                    )}
                                                </div>
                                                <div className="flex-1">
                                                    <div className="flex justify-between items-start">
                                                        <h3 className="font-semibold text-gray-800 dark:text-gray-200">{section.title}</h3>
                                                        <span className={`text-xs px-2 py-1 rounded-full ${section.activationRequired ? 'bg-purple-100 text-purple-800 dark:bg-purple-900/50 dark:text-purple-200' : 'bg-gray-100 text-gray-800 dark:bg-gray-600 dark:text-gray-200'}`}>
                                                            {section.access}
                                                        </span>
                                                    </div>
                                                    
                                                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{section.description}</p>
                                                    
                                                    <div className="mt-3">
                                                        <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">الصلاحيات المطلوبة:</h4>
                                                        <div className="flex flex-wrap gap-2">
                                                            {section.permissions.map((permission, i) => (
                                                                <span key={i} className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${permission.includes('حذف') ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200' : 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'}`}>
                                                                    {permission.includes('حذف') && <Trash2 size={12} className="mr-1" />}
                                                                    {permission}
                                                                </span>
                                                            ))}
                                                        </div>
                                                    </div>

                                                    {section.activationRequired && (
                                                        <div className="mt-2 bg-purple-50 dark:bg-purple-900/10 p-2 rounded text-xs text-purple-700 dark:text-purple-300">
                                                            <span className="font-medium">ملاحظة:</span> يتطلب تفعيل العضو كمستخدم من قبل المدير
                                                        </div>
                                                    )}

                                                    {section.deleteNote && (
                                                        <div className="mt-2 bg-red-50 dark:bg-red-900/10 p-2 rounded text-xs text-red-700 dark:text-red-300 flex items-start gap-1">
                                                            <Trash2 size={14} className="mt-0.5 flex-shrink-0" />
                                                            <span>{section.deleteNote}</span>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                <footer className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700 text-center text-gray-500 dark:text-gray-400 text-sm">
                                    <p>لطلب تفعيل حسابك كمستخدم أو تفعيل صلاحيات معينة، يرجى التواصل مع مدير النظام</p>
                                </footer>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default PermissionsGuide;