import { useState, useCallback, useMemo, useEffect } from 'react';
import {
    useUpdateShowByEntityTypeMutation,
    useGetShowStatusByEntityTypeQuery
} from '../../../store/api/notificationApi';
import { motion, AnimatePresence } from 'framer-motion';
import { Image as ImageIcon, Bell, Settings, Save, Users, Megaphone, Wallet, User } from 'lucide-react';
import { toast } from 'react-toastify';

type EntityType = 'مناسبه' | 'عضو' | 'اعلان' | 'ماليه' | 'معرض الصور' | 'مستخدم';

const entityTypes: { value: EntityType; label: string; icon: React.ReactNode }[] = [
    { value: 'مناسبه', label: 'المناسبات', icon: <Bell className="w-5 h-5" /> },
    { value: 'عضو', label: 'الأعضاء', icon: <Users className="w-5 h-5" /> },
    { value: 'اعلان', label: 'الإعلانات', icon: <Megaphone className="w-5 h-5" /> },
    { value: 'ماليه', label: 'المالية', icon: <Wallet className="w-5 h-5" /> },
    { value: 'معرض الصور', label: 'معرض الصور', icon: <ImageIcon className="w-5 h-5" /> },
    { value: 'مستخدم', label: 'المستخدمين', icon: <User className="w-5 h-5" /> },
];

const NotificationSettingsPage = () => {
    const [updateSettings] = useUpdateShowByEntityTypeMutation();
    const [loadingStates, setLoadingStates] = useState<Record<string, boolean>>({});
    const [toggleStates, setToggleStates] = useState<Record<EntityType, boolean>>({} as Record<EntityType, boolean>);

    // استعلامات لكل نوع كيان
    const eventQuery = useGetShowStatusByEntityTypeQuery('مناسبه');
    const memberQuery = useGetShowStatusByEntityTypeQuery('عضو');
    const adQuery = useGetShowStatusByEntityTypeQuery('اعلان');
    const financialQuery = useGetShowStatusByEntityTypeQuery('ماليه');
    const galleryQuery = useGetShowStatusByEntityTypeQuery('معرض الصور');
    const userQuery = useGetShowStatusByEntityTypeQuery('مستخدم');

    const allQueries = {
        'مناسبه': eventQuery,
        'عضو': memberQuery,
        'اعلان': adQuery,
        'ماليه': financialQuery,
        'معرض الصور': galleryQuery,
        'مستخدم': userQuery
    };

    const isLoading = useMemo(() =>
        Object.values(allQueries).some(query => query.isLoading),
        [allQueries]
    );

    useEffect(() => {
        const newToggleStates: Record<EntityType, boolean> = {} as Record<EntityType, boolean>;
        
        entityTypes.forEach(({ value }) => {
            if (allQueries[value]?.data?.data) {
                newToggleStates[value] = allQueries[value].data.data.show;
            }
        });

        if (Object.keys(newToggleStates).length > 0) {
            setToggleStates(newToggleStates);
        }
    }, [
        eventQuery.data, 
        memberQuery.data, 
        adQuery.data, 
        financialQuery.data, 
        galleryQuery.data, 
        userQuery.data
    ]);

    const handleToggle = useCallback((entityType: EntityType) => {
        setToggleStates(prev => ({
            ...prev,
            [entityType]: !prev[entityType]
        }));
    }, []);

    const handleSaveChanges = useCallback(async () => {
        try {
            setLoadingStates(prev => ({ ...prev, global: true }));            
            const changes = entityTypes
                .filter(({ value }) => {
                    const serverState = allQueries[value]?.data?.data?.show;
                    return serverState !== undefined && toggleStates[value] !== serverState;
                })
                .map(({ value }) => ({
                    entityType: value,
                    show: toggleStates[value]
                }));

            if (changes.length > 0) {
                await Promise.all(
                    changes.map(({ entityType, show }) =>
                        updateSettings({ entityType, show }).unwrap()
                    )
                );
                toast.success('تم حفظ التغييرات بنجاح');

                changes.forEach(({ entityType }) => {
                    allQueries[entityType].refetch();
                });
            } else {
                toast.info('لا يوجد إشعارات لتفعيل الخاصية من المستخدم');
            }
        } catch (err) {
            toast.error('حدث خطأ أثناء حفظ التغييرات');
            entityTypes.forEach(({ value }) => {
                if (allQueries[value]?.data?.data) {
                    setToggleStates(prev => ({
                        ...prev,
                        [value]: allQueries[value]?.data?.data.show
                    }));
                }
            });
        } finally {
            setLoadingStates(prev => ({ ...prev, global: false }));
        }
    }, [toggleStates, updateSettings]);

    if (isLoading) return <div className="text-center py-8">جاري التحميل...</div>;

    return (
        <div className="w-full mx-auto">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden"
            >
                {/* Header */}
                <div className="flex items-center p-6 border-b border-gray-100">
                    <Settings className="w-6 h-6 text-primary mx-3" />
                    <h2 className="text-2xl font-semibold text-gray-800">إدارة إظهار الإشعارات</h2>
                </div>

                {/* Description */}
                <div className="p-6 pb-0">
                    <p className="text-gray-600">
                        يمكنك التحكم في أنواع الإشعارات التي تظهر للمستخدمين حسب نوع الكيان
                    </p>
                </div>

                {/* Settings List */}
                <div className="divide-y divide-gray-100">
                    <AnimatePresence>
                        {entityTypes.map(({ value, label, icon }) => {
                            const query = allQueries[value];
                            const isToggleLoading = loadingStates[value] || query?.isFetching;
                            const isChecked = toggleStates[value] ?? false;

                            return (
                                <motion.div
                                    key={value}
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    className="p-6 flex items-center justify-between"
                                >
                                    <div className="flex items-center">
                                        <div className="p-2 rounded-lg bg-primary/5 text-primary mx-4">
                                            {icon}
                                        </div>
                                        <div>
                                            <h3 className="font-medium text-gray-800">{label}</h3>
                                            <p className="text-sm text-gray-500">إشعارات متعلقة بـ {label}</p>
                                        </div>
                                    </div>

                                    <button
                                        type="button"
                                        onClick={() => handleToggle(value)}
                                        disabled={isToggleLoading || loadingStates.global}
                                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors 
                                        ${isChecked ? 'bg-primary' : 'bg-gray-300'}
                                        ${isToggleLoading ? 'opacity-50 cursor-not-allowed' : ''}
                                        focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2`}
                                    >
                                        <span
                                            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform
                                            ${isChecked ? '-translate-x-6' : 'translate-x-1'}`}
                                        />
                                        <span className="sr-only">تبديل الإشعارات</span>
                                    </button>
                                </motion.div>
                            );
                        })}
                    </AnimatePresence>
                </div>

                {/* Footer */}
                <motion.div
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.98 }}
                    className="p-6 border-t border-gray-100 flex justify-end"
                >
                    <button
                        type="button"
                        className={`flex items-center px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors
                        ${loadingStates.global ? 'opacity-50 cursor-not-allowed' : ''}`}
                        onClick={handleSaveChanges}
                        disabled={loadingStates.global}
                    >
                        {loadingStates.global ? (
                            'جاري الحفظ...'
                        ) : (
                            <>
                                <Save className="w-5 h-5 mx-2" />
                                حفظ التغييرات
                            </>
                        )}
                    </button>
                </motion.div>
            </motion.div>
        </div>
    );
};

export default NotificationSettingsPage;