import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { ChevronUp, ChevronDown, Eye, EyeOff, Trash2 } from "lucide-react";
import { toast } from "react-toastify";
import type { Branch } from "../../../types/branch";
import { useGetAllBranchesQuery, useDeleteBranchMutation } from "../../../store/api/branchApi";
import Modal from "../../../components/ui/Modal";
import BranchForm from "../../../components/dashboard/free/admin/BranchForm";

const BranchesPage = () => {
    const [page, setPage] = useState(1);
    const [limit] = useState(10);
    const [sortConfig, setSortConfig] = useState<{ key: keyof Branch; direction: 'asc' | 'desc' } | null>(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [branchToDelete, setBranchToDelete] = useState<Branch | null>(null);
    const [branchToEdit, setBranchToEdit] = useState<Branch | null>(null);
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [statusFilter, setStatusFilter] = useState<string>("all");

    const { data: branchesData, isLoading, isError, refetch } = useGetAllBranchesQuery({
        page,
        limit,
    });

    const [deleteBranch, { isLoading: isDeleting }] = useDeleteBranchMutation();

    // تطبيق الفرز والبحث والتصفية على البيانات
    const filteredBranches = useMemo(() => {
        if (!branchesData?.data) return [];

        let filtered = [...branchesData.data];

        // تطبيق البحث
        if (searchTerm) {
            filtered = filtered.filter(branch =>
                branch.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                (branch.branchOwner && branch.branchOwner.toLowerCase().includes(searchTerm.toLowerCase()))
            );
        }

        // تطبيق التصفية حسب الحالة
        if (statusFilter !== "all") {
            filtered = filtered.filter(branch =>
                statusFilter === "active" ? branch.show : !branch.show
            );
        }

        // تطبيق الفرز
        if (sortConfig) {
            filtered.sort((a: any, b: any) => {
                const aValue = a[sortConfig.key];
                const bValue = b[sortConfig.key];

                if (aValue === bValue) return 0;

                if (sortConfig.direction === 'asc') {
                    return aValue > bValue ? 1 : -1;
                } else {
                    return aValue < bValue ? 1 : -1;
                }
            });
        }

        return filtered;
    }, [branchesData, searchTerm, statusFilter, sortConfig]);

    const handleSort = (key: keyof Branch) => {
        let direction: 'asc' | 'desc' = 'asc';
        if (sortConfig?.key === key && sortConfig.direction === 'asc') {
            direction = 'desc';
        }
        setSortConfig({ key, direction });
    };

    const handleDeleteClick = (branch: Branch) => {
        setBranchToDelete(branch);
        setIsDeleteModalOpen(true);
    };

    const confirmDelete = async () => {
        if (!branchToDelete?._id) return;

        try {
            await deleteBranch({ id: branchToDelete._id }).unwrap();
            toast.success("تم حذف الفرع بنجاح");
            refetch();
            setIsDeleteModalOpen(false);
            setBranchToDelete(null);
        } catch (error) {
            toast.error("فشل في حذف الفرع");
            console.error("Delete error:", error);
        }
    };

    const handleEditClick = (branch: Branch) => {
        setBranchToEdit(branch);
        setIsEditModalOpen(true);
    };

    const handleSuccess = () => {
        refetch();
        setIsAddModalOpen(false);
        setIsEditModalOpen(false);
    };

    const getSortIcon = (key: keyof Branch) => {
        if (!sortConfig || sortConfig.key !== key) {
            return <ChevronUp className="w-4 h-4 opacity-50" />;
        }
        return sortConfig.direction === 'asc' ?
            <ChevronUp className="w-4 h-4" /> :
            <ChevronDown className="w-4 h-4" />;
    };

    const clearFilters = () => {
        setSearchTerm("");
        setStatusFilter("all");
        setSortConfig(null);
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="p-6 min-h-screen"
        >
            <div className="relative flex flex-col w-full h-full text-primary bg-white rounded-xl shadow-sm">
                <div className="p-6">
                    <div>
                        <h3 className="text-2xl font-bold text-primary">إدارة الفروع</h3>
                        <p className="text-slate-500 mt-1">قائمة بجميع الفروع المسجلة في النظام</p>
                    </div>
                </div>

                {/* Search and Filters */}
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 my-6">
                    <div className="mt-4">
                        <div className="relative w-full md:w-[35vw]">
                            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                                <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                                </svg>
                            </div>
                            <input
                                type="text"
                                className="w-full pr-10 pl-4 py-2 border border-slate-300 rounded-lg focus:ring-primary focus:border-primary"
                                placeholder="ابحث باسم الفرع أو مدير الفرع..."
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
                            onClick={() => setIsAddModalOpen(true)}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                            </svg>
                            إضافة فرع جديد
                        </button>
                    </div>
                </div>

                {/* Filter Panel */}
                {isFilterOpen && (
                    <div className="bg-white p-4 shadow-sm rounded-lg border border-gray-200 mb-4">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    الحالة
                                </label>
                                <select
                                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                                    value={statusFilter}
                                    onChange={(e) => setStatusFilter(e.target.value)}
                                >
                                    <option value="all">الكل</option>
                                    <option value="active">نشط</option>
                                    <option value="inactive">غير نشط</option>
                                </select>
                            </div>
                        </div>

                        <div className="flex justify-end mt-4 gap-2">
                            <button
                                className="px-3 py-1 text-sm text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50"
                                onClick={clearFilters}
                            >
                                مسح الفلاتر
                            </button>
                        </div>
                    </div>
                )}

                {/* Error State */}
                {isError && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                        فشل في تحميل البيانات. يرجى المحاولة مرة أخرى.
                    </div>
                )}

                {/* Table */}
                {branchesData && (
                    <div className="overflow-x-auto rounded-lg border border-gray-200">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th
                                        scope="col"
                                        className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                                        onClick={() => handleSort('name')}
                                    >
                                        <div className="flex items-center justify-center gap-4">
                                            اسم الفرع
                                            {getSortIcon('name')}
                                        </div>
                                    </th>
                                    <th
                                        scope="col"
                                        className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                                        onClick={() => handleSort('branchOwner')}
                                    >
                                        <div className="flex items-center justify-center gap-4">
                                            مدير الفرع
                                            {getSortIcon('branchOwner')}
                                        </div>
                                    </th>
                                    <th
                                        scope="col"
                                        className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                                        onClick={() => handleSort('show')}
                                    >
                                        <div className="flex items-center justify-center gap-4">
                                            الظهور
                                            {getSortIcon('show')}
                                        </div>
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        الإجراءات
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {filteredBranches.length > 0 ? (
                                    filteredBranches.map((branch) => (
                                        <motion.tr
                                            key={branch._id}
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            transition={{ duration: 0.3 }}
                                            className="hover:bg-gray-50"
                                        >
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 text-center">
                                                {branch.name}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center">
                                                {branch.branchOwner || 'غير محدد'}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-center">
                                                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${branch.show ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                                    {branch.show ? 'ظاهر' : 'مخفي'}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center">
                                                <div className="flex items-center justify-center space-x-2 space-x-reverse">
                                                    <button
                                                        onClick={() => handleEditClick(branch)}
                                                        className="text-slate-600 hover:text-primary transition-colors"
                                                        title="تعديل"
                                                    >
                                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                                        </svg>
                                                    </button>
                                                    <button
                                                        onClick={() => branch.show ? null : null}
                                                        className="text-gray-600 hover:text-gray-900"
                                                        title={branch.show ? 'إخفاء' : 'إظهار'}
                                                    >
                                                        {branch.show ? (
                                                            <EyeOff className="h-5 w-5" />
                                                        ) : (
                                                            <Eye className="h-5 w-5" />
                                                        )}
                                                    </button>
                                                    <button
                                                        onClick={() => handleDeleteClick(branch)}
                                                        className="text-red-700 hover:text-red-800 transition-colors"
                                                        title="حذف"
                                                    >
                                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                        </svg>
                                                    </button>
                                                </div>
                                            </td>
                                        </motion.tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={4} className="px-6 py-4 text-center text-gray-500">
                                            لا توجد فروع متطابقة مع معايير البحث
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                )}

                {/* Pagination */}
                {branchesData?.pagination && branchesData.pagination.totalPages > 1 && (
                    <div className="flex flex-col md:flex-row justify-between items-center mt-6">
                        <div className="mb-4 md:mb-0">
                            <p className="text-sm text-gray-700">
                                عرض <span className="font-medium">{(branchesData.pagination.currentPage - 1) * branchesData.pagination.pageSize + 1}</span> إلى{' '}
                                <span className="font-medium">
                                    {Math.min(branchesData.pagination.currentPage * branchesData.pagination.pageSize, branchesData.pagination.totalBranches)}
                                </span>{' '}
                                من <span className="font-medium">{branchesData.pagination.totalBranches}</span> فرع
                            </p>
                        </div>
                        <div className="flex space-x-2 gap-2">
                            <button
                                onClick={() => setPage(page - 1)}
                                disabled={page === 1}
                                className={`px-3 py-1 rounded-md border ${page === 1 ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-white text-blue-600 hover:bg-gray-50'}`}
                            >
                                السابق
                            </button>
                            {Array.from({ length: branchesData.pagination.totalPages }, (_, i) => i + 1).map((pageNum) => (
                                <button
                                    key={pageNum}
                                    onClick={() => setPage(pageNum)}
                                    className={`px-3 py-1 rounded-md ${page === pageNum ? 'bg-blue-600 text-white' : 'bg-white text-blue-600 hover:bg-gray-100 border'}`}
                                >
                                    {pageNum}
                                </button>
                            ))}
                            <button
                                onClick={() => setPage(page + 1)}
                                disabled={page === branchesData.pagination.totalPages}
                                className={`px-3 py-1 rounded-md border ${page === branchesData.pagination.totalPages ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-white text-blue-600 hover:bg-gray-50'}`}
                            >
                                التالي
                            </button>
                        </div>
                    </div>
                )}

                {/* Delete Confirmation Modal */}
                <Modal
                    isOpen={isDeleteModalOpen}
                    onClose={() => !isDeleting && setIsDeleteModalOpen(false)}
                    type="delete"
                    title="حذف فرع"
                    onConfirm={confirmDelete}
                >
                    <div className="flex items-center gap-4">
                        <div className="flex-shrink-0 p-2 bg-red-100 rounded-full text-red-600">
                            <Trash2 className="w-6 h-6" />
                        </div>
                        <p className="text-gray-700">
                            هل أنت متأكد من حذف الفرع {branchToDelete?.name}؟ لا يمكن التراجع عن هذا الإجراء.
                        </p>
                    </div>
                </Modal>

                {/* Add Branch Modal */}
                <Modal
                    isOpen={isAddModalOpen}
                    onClose={() => setIsAddModalOpen(false)}
                    showFooter={false}
                    extraStyle="max-w-2xl"
                >
                    <BranchForm onSuccess={handleSuccess} />
                </Modal>

                {/* Edit Branch Modal */}
                <Modal
                    isOpen={isEditModalOpen}
                    onClose={() => setIsEditModalOpen(false)}
                    showFooter={false}
                    extraStyle="max-w-2xl"
                >
                    {branchToEdit && (
                        <BranchForm 
                            onSuccess={handleSuccess}
                            defaultValues={{
                                name: branchToEdit.name,
                                branchOwner: branchToEdit.branchOwner || '',
                                show: branchToEdit.show,
                            }}
                            isEditing={true}
                            branchId={branchToEdit._id}
                        />
                    )}
                </Modal>
            </div>
        </motion.div>
    );
};

export default BranchesPage;