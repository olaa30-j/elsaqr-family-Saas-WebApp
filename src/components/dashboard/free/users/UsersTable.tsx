import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import Modal from "../../../ui/Modal";
import type { User } from "../../../../types/user";
import { toast } from "react-toastify";
import { useDeleteUserMutation } from "../../../../store/api/usersApi";
import { statusOptions } from "../../../../types/user";
import UserForm from "./UserForm";
import { useGetAllRolesQuery } from '../../../../store/api/roleApi';

type FilterOptions = {
    status?: User['status'];
    role?: string;
};

interface UsersTableProps {
    currentPage: number;
    itemsPerPage: number;
    usersData: User[];
    pagination?: {
        totalUsers: number;
        totalPages: number;
        currentPage: number;
        pageSize: number;
    };
    onPageChange: (page: number) => void;
    onLimitChange: (limit: number) => void;
    isLoading: boolean;
    refetchUsers?: () => void;
}

const UsersTable: React.FC<UsersTableProps> = ({
    currentPage,
    usersData,
    pagination,
    onPageChange,
    refetchUsers
}) => {
    const navigate = useNavigate();
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(false);
    const [sortConfig, setSortConfig] = useState<{ key: keyof User; direction: 'asc' | 'desc' } | null>(null);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [userToDelete, setUserToDelete] = useState<User | null>(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [filters, setFilters] = useState<FilterOptions>({});
    const [deleteUser, { isLoading: isDeleting }] = useDeleteUserMutation();
    const { data: rolesResponse } = useGetAllRolesQuery();

    const availableRoles = useMemo(() => {
        return rolesResponse?.data || [];
    }, [rolesResponse]);

    useEffect(() => {
        setLoading(true);
        try {
            const data = usersData || [];
            setUsers(data);
        } catch (error) {
            console.error('Error loading users data:', error);
            toast.error('حدث خطأ في تحميل بيانات المستخدمين');
        } finally {
            setLoading(false);
        }
    }, [usersData]);

    const handleSort = (key: keyof User) => {
        let direction: 'asc' | 'desc' = 'asc';
        if (sortConfig?.key === key && sortConfig.direction === 'asc') {
            direction = 'desc';
        }
        setSortConfig({ key, direction });
    };

    const filteredUsers = users.filter(user => {
        const email = user.email?.toLowerCase() || '';
        const phone = user.phone?.toString() || '';

        const matchesSearch = searchTerm === "" ||
            email.includes(searchTerm.toLowerCase()) ||
            phone.includes(searchTerm);

        const matchesStatus = !filters.status || user.status === filters.status;
        const matchesRole = !filters.role ||
            (user.role && user.role.includes(filters.role));

        return matchesSearch && matchesStatus && matchesRole;
    });

    const sortedUsers = [...filteredUsers].sort((a, b) => {
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

    const handleEdit = (userId: string) => {
        navigate(`/admin/users/${userId}`);
    };

    const handleDeleteClick = (user: User) => {
        setUserToDelete(user);
        setIsDeleteModalOpen(true);
    };

    const confirmDelete = async () => {
        if (!userToDelete?._id) return;

        try {
            await deleteUser(userToDelete._id).unwrap();
            toast.success("تم حذف المستخدم بنجاح");
            refetchUsers?.();
            setIsDeleteModalOpen(false);
            setUserToDelete(null);
        } catch (error) {
            toast.error("فشل في حذف المستخدم");
            console.error("Delete error:", error);
        }
    };

    const handleFilterChange = (key: keyof FilterOptions, value: string) => {
        setFilters(prev => ({
            ...prev,
            [key]: value === 'all' ? undefined : value
        }));
        onPageChange(1);
    };

    const clearFilters = () => {
        setFilters({});
        setSearchTerm("");
    };

    const getSortIcon = (key: keyof User) => {
        if (!sortConfig || sortConfig.key !== key) {
            return (
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2"
                    stroke="currentColor" className="w-4 h-4 opacity-50">
                    <path strokeLinecap="round" strokeLinejoin="round"
                        d="M8.25 15L12 18.75 15.75 15m-7.5-6L12 5.25 15.75 9"></path>
                </svg>
            );
        }
        return (
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2"
                stroke="currentColor" className="w-4 h-4">
                <path strokeLinecap="round" strokeLinejoin="round"
                    d={sortConfig.direction === 'asc' ?
                        "M19.5 8.25l-7.5 7.5-7.5-7.5" :
                        "M4.5 15.75l7.5-7.5 7.5 7.5"}></path>
            </svg>
        );
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
            </div>
        );
    }


    return (
        <div className="relative flex flex-col w-full h-full text-primary bg-white rounded-xl shadow-sm">
            <div className="p-6">
                <div>
                    <h3 className="text-2xl font-bold text-primary">إدارة المستخدمين</h3>
                    <p className="text-slate-500 mt-1">قائمة بجميع المستخدمين المسجلين في النظام</p>
                </div>

                {/* Search and Filter Controls */}
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
                                placeholder="ابحث بالبريد الإلكتروني أو رقم الجوال..."
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
                            إضافة مستخدم جديد
                        </button>
                    </div>
                </div>

                {/* Filter Panel */}
                {isFilterOpen && (
                    <div className="bg-white p-4 shadow-sm rounded-lg border border-slate-200 mb-4">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
                                    {statusOptions.map(({ value, label }) => (
                                        <option key={value} value={value}>
                                            {label}
                                        </option>
                                    ))}
                                </select>
                            </div>


                            {/* Role Filter */}
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">
                                    الدور
                                </label>
                                <select
                                    value={filters.role || 'all'}
                                    onChange={(e) => handleFilterChange('role', e.target.value)}
                                    className="w-full p-2 border border-slate-300 rounded-md focus:ring-primary focus:border-primary"
                                >
                                    <option value="all">الكل</option>
                                    {availableRoles.map((role: string, index: number) => (
                                        <option key={index} value={role}>
                                            {role}
                                        </option>
                                    ))}
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

                {/* Users Table */}
                <div className="overflow-x-auto rounded-lg border border-slate-200">
                    <table className="min-w-full divide-y divide-slate-200">
                        <thead className="bg-slate-50">
                            <tr>
                                <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-slate-500 uppercase tracking-wider"></th>
                                <th
                                    scope="col"
                                    className="px-6 py-3 text-center text-xs font-medium text-slate-500 uppercase tracking-wider cursor-pointer hover:bg-slate-100 transition-colors"
                                    onClick={() => handleSort('email')}
                                >
                                    <div className="flex items-center justify-center gap-1">
                                        البريد الإلكتروني
                                        {getSortIcon('email')}
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
                                    onClick={() => handleSort('phone')}
                                >
                                    <div className="flex items-center justify-center gap-1">
                                        رقم الجوال
                                        {getSortIcon('phone')}
                                    </div>
                                </th>
                                <th
                                    scope="col"
                                    className="px-6 py-3 text-center text-xs font-medium text-slate-500 uppercase tracking-wider cursor-pointer hover:bg-slate-100 transition-colors"
                                    onClick={() => handleSort('role')}
                                >
                                    <div className="flex items-center justify-center gap-1">
                                        الدور
                                        {getSortIcon('role')}
                                    </div>
                                </th>
                                <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-slate-500 uppercase tracking-wider">
                                    الإجراءات
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-slate-200">
                            {sortedUsers.length > 0 ? (
                                sortedUsers.map((user) => (
                                    <tr key={user._id} className="hover:bg-slate-50 transition-colors">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex justify-center">
                                                <div className="h-10 w-10 rounded-full bg-slate-200 flex items-center justify-center text-slate-600 font-medium">
                                                    {user.email?.charAt(0).toUpperCase()}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-center">
                                                <div className="font-medium text-slate-900">
                                                    {user.email}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex justify-center">
                                                <span className={`px-2 py-1 text-responsive-sm font-semibold rounded-md ${user.status === 'مقبول' ? 'bg-green-100 text-green-800' :
                                                    user.status === 'مرفوض' ? 'bg-red-100 text-red-800' :
                                                        'bg-slate-100 text-primary'
                                                    }`}>
                                                    {user.status === 'مقبول' ? 'مقبول' :
                                                        user.status === 'مرفوض' ? 'مرفوض' : 'قيد الانتظار'}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500 text-center">
                                            {user.phone}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500 text-center">
                                            {user.role?.map(r =>
                                                availableRoles.find((ro: string) => ro === r)?.label || r
                                            ).join(', ')}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-center">
                                            {
                                                user.role[0] != 'مدير النظام' && (
                                                    <>
                                                        <div className="flex justify-center space-x-2 gap-2">
                                                            <button
                                                                onClick={() => user._id && handleEdit(user._id)}
                                                                className="text-slate-600 hover:text-primary transition-colors"
                                                                title="تعديل"
                                                            >
                                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                                                </svg>
                                                            </button>
                                                            <button
                                                                onClick={() => handleDeleteClick(user)}
                                                                className="text-red-700 hover:text-red-800 transition-colors"
                                                                title="حذف"
                                                                disabled={isDeleting}
                                                            >
                                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                                </svg>
                                                            </button>
                                                        </div>

                                                    </>)}
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={8} className="px-6 py-4 text-center text-slate-500">
                                        لا توجد بيانات متاحة
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                {pagination && pagination.totalPages > 1 && (
                    <div className="flex items-center justify-between mt-4 px-2">
                        <div className="text-sm text-slate-500">
                            عرض <span className="font-medium">{(pagination.currentPage - 1) * pagination.pageSize + 1}</span> إلى{' '}
                            <span className="font-medium">
                                {Math.min(pagination.currentPage * pagination.pageSize, pagination.totalUsers)}
                            </span>{' '}
                            من <span className="font-medium">{pagination.totalUsers}</span> نتائج
                        </div>
                        <div className="flex space-x-2 gap-2">
                            <button
                                onClick={() => onPageChange(currentPage - 1)}
                                disabled={currentPage === 1}
                                className={`px-3 py-1 rounded-md border ${currentPage === 1 ? 'bg-slate-100 text-slate-400 cursor-not-allowed' : 'bg-white text-primary hover:bg-slate-50'}`}
                            >
                                السابق
                            </button>
                            {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map((pageNum) => (
                                <button
                                    key={pageNum}
                                    onClick={() => onPageChange(pageNum)}
                                    className={`px-3 py-1 rounded-md ${currentPage === pageNum ? 'bg-primary text-white' : 'bg-white text-primary hover:bg-slate-100 border'}`}
                                >
                                    {pageNum}
                                </button>
                            ))}
                            <button
                                onClick={() => onPageChange(currentPage + 1)}
                                disabled={currentPage === pagination.totalPages}
                                className={`px-3 py-1 rounded-md border ${currentPage === pagination.totalPages ? 'bg-slate-100 text-slate-400 cursor-not-allowed' : 'bg-white text-primary hover:bg-slate-50'}`}
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
                    title="حذف مستخدم"
                    onConfirm={confirmDelete}
                >
                    <div className="flex items-center gap-4">
                        <div className="flex-shrink-0 p-2 bg-red-100 rounded-full text-red-600">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                        </div>
                        <p className="text-gray-700">
                            هل أنت متأكد من حذف المستخدم {userToDelete?.email}؟ لا يمكن التراجع عن هذا الإجراء.
                        </p>
                    </div>
                </Modal>

                {/* Add User Modal */}
                {isAddModalOpen && (
                    <Modal
                        isOpen={isAddModalOpen}
                        onClose={() => setIsAddModalOpen(false)}
                        title="إضافة مستخدم جديد"
                        extraStyle="bg-primary"
                        showFooter={false}
                    >
                        <>
                            <UserForm
                                onSuccess={() => {
                                    setIsAddModalOpen(false)
                                    refetchUsers?.()
                                }}
                            />
                        </>
                    </Modal>
                )}
            </div>
        </div>
    );
};

export default UsersTable;