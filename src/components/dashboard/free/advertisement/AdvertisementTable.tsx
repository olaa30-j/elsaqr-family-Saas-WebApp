import {
    useGetAdvertisementsQuery,
    useDeleteAdvertisementMutation,
    useCreateAdvertisementMutation,
    useUpdateAdvertisementMutation
} from '../../../../store/api/advertisementApi';
import {
    ChevronUp,
    ChevronDown,
    Search,
    Plus,
    Loader2,
    Trash2,
    Edit
} from 'lucide-react';
import type { IAdvertisement, IAdvertisementForm, AdvertisementType, AdvertisementStatus } from '../../../../types/advertisement';
import Modal from '../../../ui/Modal';
import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { toast } from 'react-toastify';
import { usePermission } from '../../../../hooks/usePermission';
import AdvertisementForm from './AdvertisementForm';
import AdvertisementTypeBadge from './AdvertisementTypeBadge';
import AdvertisementStatusBadge from './AdvertisementStatusBadge';
import RichTextRenderer from '../../../shared/RichTextRenderer';

type SortField = keyof IAdvertisement;
type SortDirection = 'asc' | 'desc';

const AdvertisementTable = () => {
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(10);
    const [sortConfig, setSortConfig] = useState<{ key: SortField; direction: SortDirection } | null>({
        key: 'createdAt',
        direction: 'desc'
    });
    const [searchTerm, setSearchTerm] = useState('');
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

    const [filters, setFilters] = useState({
        type: undefined as AdvertisementType | undefined,
        status: undefined as AdvertisementStatus | undefined
    });

    const [isFormOpen, setIsFormOpen] = useState(false);
    const [currentAd, setCurrentAd] = useState<IAdvertisement | null>(null);
    const divRef = useRef<HTMLDivElement>(null);

    const { data, isLoading, isError, error, refetch } = useGetAdvertisementsQuery({
        page: currentPage,
        limit: itemsPerPage,
    }, {
        refetchOnMountOrArgChange: true
    });

    useEffect(() => {
        if (divRef.current) {
            const fullText = divRef.current.textContent || divRef.current.innerText;
            const truncated = fullText.slice(0, 16);
            divRef.current.textContent = truncated + (fullText.length > 16 ? "..." : "");
        }
    }, [data]);

    const [deleteAd] = useDeleteAdvertisementMutation();
    const [createAd, { isLoading: isCreating }] = useCreateAdvertisementMutation();
    const [updateAd, { isLoading: isUpdating }] = useUpdateAdvertisementMutation();

    const { hasPermission: canCreateAD } = usePermission('AD_CREATE');
    const { hasPermission: canDeleteAD } = usePermission('AD_DELETE');
    const { hasPermission: canEditAD } = usePermission('AD_EDIT');

    useEffect(() => {
        if (isError) {
            toast.error('فشل في تحميل الإعلانات. يرجى المحاولة مرة أخرى.');
            console.error('Error fetching advertisements:', error);
        }
    }, [isError, error]);


    const handleSort = (key: SortField) => {
        let direction: SortDirection = 'asc';
        if (sortConfig?.key === key && sortConfig.direction === 'asc') {
            direction = 'desc';
        }
        setSortConfig({ key, direction });
    };

    const filteredAds = (data?.data || []).filter(ad => {
        const matchesSearch = searchTerm === "" ||
            ad.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            ad.content.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesType = !filters.type || ad.type === filters.type;
        const matchesStatus = !filters.status || ad.status === filters.status;

        return matchesSearch && matchesType && matchesStatus;
    });

    const sortedAds = [...filteredAds].sort((a, b) => {
        if (!sortConfig) return 0;

        const aValue = a[sortConfig.key];
        const bValue = b[sortConfig.key];

        if (aValue === undefined) return 1;
        if (bValue === undefined) return -1;

        if (aValue < bValue) {
            return sortConfig.direction === 'asc' ? -1 : 1;
        }
        if (aValue > bValue) {
            return sortConfig.direction === 'asc' ? 1 : -1;
        }
        return 0;
    });

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    useEffect(() => {
        refetch();
    }, [currentPage, refetch]);


    const handleFilterChange = (key: keyof typeof filters, value: string) => {
        setFilters(prev => ({
            ...prev,
            [key]: value === 'all' ? undefined : value as any
        }));
        setCurrentPage(1);
    };

    const clearFilters = () => {
        setFilters({
            type: undefined,
            status: undefined
        });
        setSearchTerm("");
    };

    const getSortIcon = (key: SortField) => {
        if (!sortConfig || sortConfig.key !== key) {
            return <ChevronUp className="w-4 h-4 opacity-50" />;
        }
        return sortConfig.direction === 'asc' ?
            <ChevronUp className="w-4 h-4" /> :
            <ChevronDown className="w-4 h-4" />;
    };

    const handleSubmit = async (formData: IAdvertisementForm) => {
        try {
            if (currentAd?._id) {
                await updateAd({
                    id: currentAd._id,
                    updates: formData
                }).unwrap();
                toast.success('تم تحديث الإعلان بنجاح');
            } else {
                await createAd(formData).unwrap();
                toast.success('تم إنشاء الإعلان بنجاح');
            }
            setIsFormOpen(false);
            refetch();
        } catch (error) {
            console.error('Failed to save advertisement:', error);
            toast.error('فشل في حفظ الإعلان. يرجى المحاولة مرة أخرى.');
        }
    };

    const handleEdit = (ad: IAdvertisement) => {
        setCurrentAd(ad);
        setIsFormOpen(true);
    };

    const handleDelete = async (id: string) => {
        try {
            await deleteAd(id).unwrap();
            toast.success('تم حذف الإعلان بنجاح');
            setIsDeleteModalOpen(false)
            refetch();
        } catch (error) {
            console.error('Failed to delete advertisement:', error);
            toast.error('فشل في حذف الإعلان. يرجى المحاولة مرة أخرى.');
        }
    };


    return (
        <div className="relative flex flex-col w-full h-full text-primary bg-white rounded-xl shadow-sm">
            <div className="p-6">
                <div>
                    <h3 className="text-2xl font-bold text-primary">إدارة الإعلانات</h3>
                    <p className="text-slate-500 mt-1">قائمة بجميع الإعلانات في النظام</p>
                </div>

                {/* Search and Filter Controls */}
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 my-6">
                    <div className="mt-4">
                        <div className="relative w-full md:w-[35vw]">
                            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                                <Search className="w-5 h-5 text-slate-400" />
                            </div>
                            <input
                                type="text"
                                className="w-full pr-10 pl-4 py-2 border border-slate-300 rounded-lg focus:ring-primary focus:border-primary"
                                placeholder="ابحث بعنوان الإعلان أو محتواه..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-3">
                        <button
                            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-primary bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors"
                            onClick={() => setIsFilterOpen(!isFilterOpen)}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                            </svg>
                            {isFilterOpen ? 'إغلاق الفلاتر' : 'تصفية النتائج'}
                        </button>
                        {canCreateAD && (
                            <button
                                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-primary rounded-lg hover:bg-primary-dark transition-colors"
                                onClick={() => {
                                    setCurrentAd(null);
                                    setIsFormOpen(true);
                                }}
                            >
                                <Plus className="h-5 w-5" />
                                إضافة إعلان جديد
                            </button>
                        )}
                    </div>
                </div>

                {/* Filter Panel */}
                {isFilterOpen && (
                    <div className="bg-white p-4 shadow-sm rounded-lg border border-slate-200 mb-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {/* Type Filter */}
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">
                                    نوع الإعلان
                                </label>
                                <select
                                    value={filters.type || 'all'}
                                    onChange={(e) => handleFilterChange('type', e.target.value)}
                                    className="w-full p-2 border border-slate-300 rounded-md focus:ring-primary focus:border-primary"
                                >
                                    <option value="all">الكل</option>
                                    <option value="important">مهم</option>
                                    <option value="general">عام</option>
                                    <option value="social">اجتماعي</option>
                                </select>
                            </div>

                            {/* Status Filter */}
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">
                                    الحالة
                                </label>
                                <select
                                    value={filters.status || 'all'}
                                    onChange={(e) => handleFilterChange('status', e.target.value)}
                                    className="w-full p-2 border border-slate-300 rounded-md focus:ring-primary focus:border-primary"
                                >
                                    <option value="all">الكل</option>
                                    <option value="accept">مقبول</option>
                                    <option value="reject">مرفوض</option>
                                    <option value="pending">قيد الانتظار</option>
                                </select>
                            </div>
                        </div>

                        <div className="flex justify-end mt-4 gap-2">
                            <button
                                onClick={clearFilters}
                                className="px-3 py-1 text-sm text-primary border border-primary rounded-md hover:bg-slate-50"
                            >
                                مسح الفلاتر
                            </button>
                        </div>
                    </div>
                )}

                {/* Advertisements Table */}
                <div className="overflow-x-auto rounded-lg border border-slate-200">
                    <table className="min-w-full divide-y divide-slate-200">
                        <thead className="bg-slate-50">
                            <tr>
                                <th></th>
                                <th
                                    scope="col"
                                    className="px-6 py-3 text-center text-xs font-medium text-slate-500 uppercase tracking-wider cursor-pointer hover:bg-slate-100 transition-colors"
                                    onClick={() => handleSort('title')}
                                >
                                    <div className="flex items-center justify-center gap-1">
                                        العنوان
                                        {getSortIcon('title')}
                                    </div>
                                </th>
                                <th
                                    scope="col"
                                    className="px-6 py-3 text-center text-xs font-medium text-slate-500 uppercase tracking-wider cursor-pointer hover:bg-slate-100 transition-colors"
                                    onClick={() => handleSort('type')}
                                >
                                    <div className="flex items-center justify-center gap-1">
                                        النوع
                                        {getSortIcon('type')}
                                    </div>
                                </th>
                                <th
                                    scope="col"
                                    className="px-6 py-3 text-center text-xs font-medium text-slate-500 uppercase tracking-wider cursor-pointer hover:bg-slate-100 transition-colors"
                                    onClick={() => handleSort('status')}
                                >
                                    <div className="flex items-center justify-center gap-1">
                                        الحالة
                                        {getSortIcon('status')}
                                    </div>
                                </th>
                                <th
                                    scope="col"
                                    className="px-6 py-3 text-center text-xs font-medium text-slate-500 uppercase tracking-wider cursor-pointer hover:bg-slate-100 transition-colors"
                                    onClick={() => handleSort('createdAt')}
                                >
                                    <div className="flex items-center justify-center gap-1">
                                        تاريخ الإنشاء
                                        {getSortIcon('createdAt')}
                                    </div>
                                </th>
                                <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-slate-500 uppercase tracking-wider">
                                    المحتوى
                                </th>
                                {(canEditAD || canDeleteAD) && (
                                    <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-slate-500 uppercase tracking-wider">
                                        الإجراءات
                                    </th>
                                )}
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-slate-200">
                            {isLoading ? (
                                <tr>
                                    <td colSpan={6} className="px-6 py-4 text-center">
                                        <div className="flex justify-center">
                                            <Loader2 className="animate-spin h-8 w-8 text-primary" />
                                        </div>
                                    </td>
                                </tr>
                            ) : isError ? (
                                <tr>
                                    <td colSpan={6} className="px-6 py-4 text-center text-red-500">
                                        حدث خطأ أثناء تحميل البيانات
                                    </td>
                                </tr>
                            ) : (sortedAds.length > 0) ? (
                                sortedAds.map((ad) => (
                                    <tr key={ad._id} className="hover:bg-slate-50 transition-colors">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="w-10 h-10 mx-auto">
                                                <img src={ad.image} className='w-full h-full rounded-md' alt={ad.title} />
                                            </div>
                                        </td>

                                        <td className="px-2 py-4 whitespace-nowrap">
                                            <div className="text-center font-medium text-slate-900">
                                                {ad.title}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex justify-center">
                                                <AdvertisementTypeBadge type={ad.type} />
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex justify-center">
                                                <AdvertisementStatusBadge status={ad.status} />
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-center text-sm text-slate-500">
                                                {new Date(ad.createdAt).toLocaleDateString('ar-EG')}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="text-center text-sm text-slate-500 line-clamp-2" ref={divRef}>
                                                <RichTextRenderer content={ad.content} /> 
                                            </div>
                                        </td>
                                        {(canEditAD || canDeleteAD) && (
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-center">
                                                <div className="flex justify-center space-x-2 gap-2">
                                                    {canEditAD && (
                                                        <button
                                                            onClick={() => handleEdit(ad)}
                                                            className="text-slate-600 hover:text-primary transition-colors"
                                                            title="تعديل"
                                                        >
                                                            <Edit className="h-5 w-5" />
                                                        </button>
                                                    )}
                                                    {canDeleteAD && (
                                                        <button
                                                            onClick={() => {
                                                                setCurrentAd(ad);
                                                                setIsDeleteModalOpen(true);
                                                            }}
                                                            className="text-red-700 hover:text-red-800 transition-colors"
                                                            title="حذف"
                                                        >
                                                            <Trash2 className="h-5 w-5" />
                                                        </button>
                                                    )}
                                                </div>
                                            </td>
                                        )}
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={6} className="px-6 py-4 text-center text-slate-500">
                                        لا توجد إعلانات متاحة
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>


                {/* Pagination */}
                <div className="flex items-center justify-between mt-4 mb-16 px-2">
                    <div className="text-sm text-slate-500">
                        عرض <span className="font-medium">{(currentPage - 1) * itemsPerPage + 1}</span> إلى{' '}
                        <span className="font-medium">
                            {Math.min(currentPage * itemsPerPage, data?.pagination?.totalAdvertisements || 0)}
                        </span>{' '}
                        من <span className="font-medium">{data?.pagination?.totalAdvertisements || 0}</span> نتائج
                    </div>
                    <div className="flex space-x-2">
                        <button
                            onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
                            disabled={currentPage === 1}
                            className={`px-3 py-1 rounded-md mx-2 ${currentPage === 1
                                ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                                : 'bg-primary text-white hover:bg-primary/90'
                                }`}
                        >
                            السابق
                        </button>

                        {Array.from(
                            { length: Math.min(5, data?.pagination?.totalPages || 1) },
                            (_, i) => {
                                const totalPages = data?.pagination?.totalPages || 1;
                                let pageNum;

                                if (totalPages <= 5) {
                                    pageNum = i + 1;
                                } else if (currentPage <= 3) {
                                    pageNum = i + 1;
                                } else if (currentPage >= totalPages - 2) {
                                    pageNum = totalPages - 4 + i;
                                } else {
                                    pageNum = currentPage - 2 + i;
                                }

                                return (
                                    <button
                                        key={pageNum}
                                        onClick={() => handlePageChange(pageNum)}
                                        className={`px-3 py-1 rounded-md ${currentPage === pageNum
                                            ? 'bg-primary text-white'
                                            : 'bg-white text-primary hover:bg-primary/10 border border-primary'
                                            }`}
                                    >
                                        {pageNum}
                                    </button>
                                );
                            }
                        )}

                        <button
                            onClick={() => handlePageChange(currentPage + 1)}
                            disabled={currentPage >= (data?.pagination?.totalPages || 1)}
                            className={`px-3 py-1 rounded-md ${currentPage >= (data?.pagination?.totalPages || 1)
                                ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                                : "bg-primary text-white hover:bg-primary/90"
                                }`}
                        >
                            التالي
                        </button>
                    </div>
                </div>

                {/* Advertisement Form Modal */}
                {
                    canDeleteAD && (
                        <Modal
                            isOpen={isDeleteModalOpen}
                            onClose={() => setIsDeleteModalOpen(false)}
                            title="حذف الإعلان"
                            type='delete'
                            onConfirm={() => {
                                if (currentAd) {
                                    handleDelete(currentAd._id);
                                }
                            }}
                        >
                            <div className="space-y-4">
                                <div className="flex gap-3 items-start">
                                    <div className="flex-shrink-0 flex items-center justify-center w-10 h-10 bg-red-100 rounded-full mt-1">
                                        <svg
                                            className="w-6 h-6 text-red-600"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth="2"
                                                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                                            />
                                        </svg>
                                    </div>
                                    <div>
                                        <p className="font-medium text-gray-800">هل أنت متأكد من حذف الإعلان؟</p>
                                        <p className="text-sm text-gray-600 mt-1">
                                            سيتم حذف الإعلان بشكل دائم ولا يمكن استعادته.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </Modal>
                    )
                }                <AnimatePresence>
                    {isFormOpen && (
                        <Modal
                            title={currentAd?._id ? 'تعديل الإعلان' : 'إنشاء إعلان جديد'}
                            isOpen={isFormOpen}
                            type='form'
                            onClose={() => setIsFormOpen(false)}
                            onConfirm={undefined}
                        >
                            <motion.div
                                initial={{ y: -50, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                exit={{ y: 50, opacity: 0 }}
                                className="rounded-lg w-full"
                                onClick={(e) => e.stopPropagation()}
                            >
                                <AdvertisementForm
                                    currentAd={currentAd}
                                    onSubmit={handleSubmit}
                                    onCancel={() => setIsFormOpen(false)}
                                    isLoading={isCreating || isUpdating}
                                />
                            </motion.div>
                        </Modal>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}

export default AdvertisementTable;