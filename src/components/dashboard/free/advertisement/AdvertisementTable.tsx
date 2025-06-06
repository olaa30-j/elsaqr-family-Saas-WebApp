import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    useGetAdvertisementsQuery,
    useDeleteAdvertisementMutation,
    useCreateAdvertisementMutation,
    useUpdateAdvertisementMutation
} from '../../../../store/api/advertisementApi';
import {
    ChevronUp,
    ChevronDown,
    Check,
    Loader2,
    Search,
    Plus,
    Edit,
    Trash2
} from 'lucide-react';
import type { IAdvertisement, IAdvertisementForm } from '../../../../types/advertisement';
import Modal from '../../../ui/Modal';

type SortField = 'title' | 'type' | 'createdAt';
type SortDirection = 'asc' | 'desc';

const AdvertisementTable = () => {
    // Pagination and sorting state
    const [page, setPage] = useState(1);
    const [limit] = useState(10);
    const [sortField, setSortField] = useState<SortField>('createdAt');
    const [sortDirection, setSortDirection] = useState<SortDirection>('desc');
    const [searchTerm, setSearchTerm] = useState('');
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [filters, setFilters] = useState({
        type: 'all',
        status: 'all'
    });

    // Form state
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [currentAd, setCurrentAd] = useState<Partial<IAdvertisement> | null>(null);
    const [formData, setFormData] = useState<IAdvertisementForm>({
        title: '',
        type: '',
        content: '',
        image: null
    });

    // API calls
    const { data, isLoading, isError } = useGetAdvertisementsQuery({
        page,
        limit,
        sort: `${sortDirection === 'desc' ? '-' : ''}${sortField}`,
        search: searchTerm,
        ...(filters.type !== 'all' && { type: filters.type }),
        ...(filters.status !== 'all' && { status: filters.status })
    });

    const [deleteAd] = useDeleteAdvertisementMutation();
    const [createAd] = useCreateAdvertisementMutation();
    const [updateAd] = useUpdateAdvertisementMutation();

    // Handle sort function
    const handleSort = (field: SortField) => {
        // Reset to page 1 when changing sort
        setPage(1);

        if (sortField === field) {
            // If same field, toggle direction
            setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
        } else {
            // If new field, set to ascending by default
            setSortField(field);
            setSortDirection('asc');
        }
    };

    // Get sort icon for table headers
    const getSortIcon = (field: SortField) => {
        if (sortField !== field) {
            return <span className="w-4 h-4 opacity-0"><ChevronUp className="w-4 h-4" /></span>;
        }
        return sortDirection === 'asc' ? (
            <ChevronUp className="w-4 h-4" />
        ) : (
            <ChevronDown className="w-4 h-4" />
        );
    };

    // Handle form changes
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setFormData(prev => ({ ...prev, image: e.target.files![0] }));
        }
    };

    // Handle filter changes
    const handleFilterChange = (filterName: string, value: string) => {
        setFilters(prev => ({
            ...prev,
            [filterName]: value
        }));
        setPage(1); // Reset to first page when filters change
    };

    const clearFilters = () => {
        setFilters({
            type: 'all',
            status: 'all'
        });
        setPage(1);
    };

    // Form submission
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if (currentAd?._id) {
                await updateAd({
                    id: currentAd._id,
                    updates: formData
                }).unwrap();
            } else {
                await createAd(formData).unwrap();
            }
            resetForm();
            setIsFormOpen(false);
        } catch (error) {
            console.error('Failed to save advertisement:', error);
        }
    };

    // Reset form
    const resetForm = () => {
        setCurrentAd(null);
        setFormData({
            title: '',
            type: '',
            content: '',
            image: null
        });
    };

    // Edit advertisement
    const handleEdit = (ad: IAdvertisement) => {
        setCurrentAd(ad);
        setFormData({
            title: ad.title,
            type: ad.type,
            content: ad.content,
            image: null
        });
        setIsFormOpen(true);
    };

    // Delete advertisement
    const handleDelete = async (id: string) => {
        if (window.confirm('هل أنت متأكد من حذف هذا الإعلان؟')) {
            try {
                await deleteAd(id).unwrap();
            } catch (error) {
                console.error('Failed to delete advertisement:', error);
            }
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
                        <button
                            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-primary rounded-lg hover:bg-primary-dark transition-colors"
                            onClick={() => setIsFormOpen(true)}
                        >
                            <Plus className="h-5 w-5" />
                            إضافة إعلان جديد
                        </button>
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
                                    value={filters.type}
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
                                    value={filters.status}
                                    onChange={(e) => handleFilterChange('status', e.target.value)}
                                    className="w-full p-2 border border-slate-300 rounded-md focus:ring-primary focus:border-primary"
                                >
                                    <option value="all">الكل</option>
                                    <option value="active">نشط</option>
                                    <option value="inactive">غير نشط</option>
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
                                <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-slate-500 uppercase tracking-wider">
                                    الإجراءات
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-slate-200">
                            {isLoading ? (
                                <tr>
                                    <td colSpan={5} className="px-6 py-4 text-center">
                                        <div className="flex justify-center">
                                            <Loader2 className="animate-spin h-8 w-8 text-primary" />
                                        </div>
                                    </td>
                                </tr>
                            ) : isError ? (
                                <tr>
                                    <td colSpan={5} className="px-6 py-4 text-center text-red-500">
                                        حدث خطأ أثناء تحميل البيانات
                                    </td>
                                </tr>
                            ) : (data && data?.data?.length > 0) ? (
                                data.data.map((ad) => (
                                    <tr key={ad._id} className="hover:bg-slate-50 transition-colors">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-center font-medium text-slate-900">
                                                {ad.title}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex justify-center">
                                                <span className={`px-2 py-1 text-xs font-semibold rounded-md ${ad.type === 'important' ? 'bg-red-100 text-red-800' :
                                                    ad.type === 'general' ? 'bg-blue-100 text-blue-800' :
                                                        'bg-green-100 text-green-800'
                                                    }`}>
                                                    {ad.type === 'important' ? 'مهم' :
                                                        ad.type === 'general' ? 'عام' :
                                                            'اجتماعي'}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-center text-sm text-slate-500">
                                                {new Date(ad.createdAt).toLocaleDateString('ar-EG')}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="text-center text-sm text-slate-500 line-clamp-2">
                                                {ad.content.substring(0, 60)}...
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-center">
                                            <div className="flex justify-center space-x-2 gap-2">
                                                <button
                                                    onClick={() => handleEdit(ad)}
                                                    className="text-slate-600 hover:text-primary transition-colors"
                                                    title="تعديل"
                                                >
                                                    <Edit className="h-5 w-5" />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(ad._id)}
                                                    className="text-red-700 hover:text-red-800 transition-colors"
                                                    title="حذف"
                                                >
                                                    <Trash2 className="h-5 w-5" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={5} className="px-6 py-4 text-center text-slate-500">
                                        لا توجد إعلانات متاحة
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
                {/* Pagination */}
                {data?.pagination && (
                    <div className="flex items-center justify-between mt-4 px-2">
                        <div className="text-sm text-slate-500">
                            عرض <span className="font-medium">{(page - 1) * limit + 1}</span> إلى{' '}
                            <span className="font-medium">
                                {Math.min(page * limit, data.pagination.totalAdvertisements)}
                            </span>{' '}
                            من <span className="font-medium">{data.pagination.totalAdvertisements}</span> نتائج
                        </div>
                        <div className="flex space-x-2 gap-2">
                            <button
                                onClick={() => setPage(p => Math.max(p - 1, 1))}
                                disabled={page === 1}
                                className={`px-3 py-1 rounded-md border ${page === 1 ?
                                    'bg-slate-100 text-slate-400 cursor-not-allowed' :
                                    'bg-white text-primary hover:bg-slate-50'
                                    }`}
                            >
                                السابق
                            </button>
                            {Array.from({ length: Math.min(5, data.pagination.totalPages) }, (_, i) => {
                                let pageNum;
                                if (data.pagination.totalPages <= 5) {
                                    pageNum = i + 1;
                                } else if (page <= 3) {
                                    pageNum = i + 1;
                                } else if (page >= data.pagination.totalPages - 2) {
                                    pageNum = data.pagination.totalPages - 4 + i;
                                } else {
                                    pageNum = page - 2 + i;
                                }

                                return (
                                    <button
                                        key={pageNum}
                                        onClick={() => setPage(pageNum)}
                                        className={`px-3 py-1 rounded-md ${page === pageNum ?
                                            'bg-primary text-white' :
                                            'bg-white text-primary hover:bg-slate-100 border'
                                            }`}
                                    >
                                        {pageNum}
                                    </button>
                                );
                            })}
                            <button
                                onClick={() => setPage(p => p + 1)}
                                disabled={page >= data.pagination.totalPages}
                                className={`px-3 py-1 rounded-md border ${page >= data.pagination.totalPages ?
                                    'bg-slate-100 text-slate-400 cursor-not-allowed' :
                                    'bg-white text-primary hover:bg-slate-50'
                                    }`}
                            >
                                التالي
                            </button>
                        </div>
                    </div>
                )}

                {/* Advertisement Form Modal */}
                <AnimatePresence>
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
                                <form onSubmit={handleSubmit}>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">العنوان</label>
                                            <input
                                                type="text"
                                                name="title"
                                                value={formData.title}
                                                onChange={handleInputChange}
                                                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                required
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">النوع</label>
                                            <select
                                                name="type"
                                                value={formData.type}
                                                onChange={handleInputChange}
                                                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                required
                                            >
                                                <option value="">اختر النوع</option>
                                                <option value="important">مهم</option>
                                                <option value="general">عام</option>
                                                <option value="social">اجتماعي</option>
                                            </select>
                                        </div>
                                    </div>

                                    <div className="mb-4">
                                        <label className="block text-sm font-medium text-gray-700 mb-1">المحتوى</label>
                                        <textarea
                                            name="content"
                                            value={formData.content}
                                            onChange={handleInputChange}
                                            rows={4}
                                            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            required
                                        />
                                    </div>

                                    <div className="mb-6">
                                        <label className="block text-sm font-medium text-gray-700 mb-1">الصورة</label>
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={handleFileChange}
                                            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        />
                                        {currentAd?.image && !formData.image && (
                                            <div className="mt-2">
                                                <p className="text-sm text-gray-500">الصورة الحالية: {currentAd.image}</p>
                                            </div>
                                        )}
                                    </div>

                                    <div className="flex justify-end gap-3">
                                        <button
                                            type="button"
                                            onClick={() => setIsFormOpen(false)}
                                            className="px-4 py-2 border rounded-md text-gray-700 hover:bg-gray-100"
                                        >
                                            إلغاء
                                        </button>
                                        <button
                                            type="submit"
                                            className="flex items-center px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90"
                                        >
                                            {isLoading ? (
                                                <>
                                                    <Loader2 className="animate-spin mx-2" size={18} />
                                                    جاري الحفظ...
                                                </>
                                            ) : (
                                                <>
                                                    <Check className="mr-2" size={18} />
                                                    حفظ
                                                </>
                                            )}
                                        </button>
                                    </div>
                                </form>
                            </motion.div>

                        </Modal>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}
export default AdvertisementTable;