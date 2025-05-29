import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Modal from "../../ui/Modal";
import { type User } from "../../../types/user";
import { toast } from "react-toastify";
import { useDeleteUserMutation } from "../../../store/api/usersApi";
// import PermissionsSection from "./admin/UserPermissionsForm";

interface MembersTableProps {
    currentPage?: number;
    itemsPerPage?: number;
    usersData: User[] | undefined;
    refetchUsers?: () => void;
}

const MembersTable: React.FC<MembersTableProps> = ({
    currentPage: initialPage = 1,
    itemsPerPage = 10,
    usersData,
    refetchUsers
}) => {
    const navigate = useNavigate();
    const [users, setUsers] = useState<User[] | undefined>(usersData);
    const [loading, setLoading] = useState(false);
    const [currentPage, setCurrentPage] = useState(initialPage);
    const [totalPages, setTotalPages] = useState(1);
    const [sortConfig, setSortConfig] = useState<{ key: keyof User; direction: 'asc' | 'desc' } | null>(null);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [userToDelete, setUserToDelete] = useState<User | null>(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [deleteUser] = useDeleteUserMutation();

    useEffect(() => {
        setLoading(true);
        try {
            setUsers(usersData);
            setTotalPages(Math.ceil((usersData?.length || 0) / itemsPerPage));
        } catch (error) {
            console.error('Error loading family data:', error);
        } finally {
            setLoading(false);
        }
    }, [usersData, itemsPerPage]);

    const handleSort = (key: keyof User) => {
        let direction: 'asc' | 'desc' = 'asc';
        if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
            direction = 'desc';
        }
        setSortConfig({ key, direction });
    };

    const filteredUsers = users?.filter(user => 
        searchTerm === "" ||
        `${user.fname} ${user.lname}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase())
    ) || [];

    let sortedUsers = [...filteredUsers];
    if (sortConfig) {
        sortedUsers.sort((a, b) => {
            const aValue: any = a[sortConfig.key];
            const bValue: any = b[sortConfig.key];

            if (aValue < bValue) {
                return sortConfig.direction === 'asc' ? -1 : 1;
            }
            if (aValue > bValue) {
                return sortConfig.direction === 'asc' ? 1 : -1;
            }
            return 0;
        });
    }

    const paginatedUsers = sortedUsers.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    const handleEdit = (userId: string) => {
        navigate(`/admin/users/${userId}`);
    };

    const handleDeleteClick = (user: User) => {
        setUserToDelete(user);
        setIsDeleteModalOpen(true);
    };

    const confirmDelete = async () => {
        if (!userToDelete) return;
        
        try {
            await deleteUser(userToDelete._id).unwrap();
            toast.success("تم حذف المستخدم بنجاح");
            refetchUsers?.();
        } catch (error) {
            toast.error("فشل في حذف المستخدم");
            console.error("Delete error:", error);
        } finally {
            setIsDeleteModalOpen(false);
            setUserToDelete(null);
        }
    };

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const getSortIcon = (key: keyof User) => {
        if (!sortConfig || sortConfig.key !== key) {
            return (
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2"
                    stroke="currentColor" aria-hidden="true" className="w-4 h-4 opacity-50">
                    <path strokeLinecap="round" strokeLinejoin="round"
                        d="M8.25 15L12 18.75 15.75 15m-7.5-6L12 5.25 15.75 9"></path>
                </svg>
            );
        }
        return (
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2"
                stroke="currentColor" aria-hidden="true" className="w-4 h-4">
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
                    <h3 className="text-2xl font-bold text-primary">أعضاء العائلة</h3>
                    <p className="text-slate-500 mt-1">قائمة بأفراد العائلة والأسرة الممتدة</p>
                </div>
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 my-6 ">
                    <div className="mt-4">
                        <div className="relative w-[35vw]">
                            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                                <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                                </svg>
                            </div>
                            <input
                                type="text"
                                className="w-full pr-10 pl-4 py-2 border border-slate-300 rounded-lg focus:ring-primary focus:border-primary"
                                placeholder="ابحث بالاسم أو البريد الإلكتروني..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-3">
                        <button
                            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-primary bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors"
                            type="button">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                            </svg>
                            تصفية النتائج
                        </button>
                        <button
                            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-primary rounded-lg hover:bg-primary transition-colors"
                            type="button"
                            onClick={() => setIsAddModalOpen(!isAddModalOpen)}>
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                            </svg>
                            إضافة عضو جديد
                        </button>
                    </div>
                </div>

                <div className="overflow-x-auto rounded-lg border border-slate-200">
                    <table className="min-w-full divide-y divide-slate-200">
                        <thead className="bg-slate-50">
                            <tr>
                                <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-slate-500 uppercase tracking-wider"></th>
                                <th
                                    scope="col"
                                    className="px-6 py-3 text-center text-xs font-medium text-slate-500 uppercase tracking-wider cursor-pointer hover:bg-slate-100 transition-colors"
                                    onClick={() => handleSort('fname')}
                                >
                                    <div className="flex items-center justify-center gap-1">
                                        العضو
                                        {getSortIcon('fname')}
                                    </div>
                                </th>
                                <th
                                    scope="col"
                                    className="px-6 py-3 text-center text-xs font-medium text-slate-500 uppercase tracking-wider cursor-pointer hover:bg-slate-100 transition-colors"
                                    onClick={() => handleSort('familyBranch')}
                                >
                                    <div className="flex items-center justify-center gap-1">
                                        الفرع العائلي
                                        {getSortIcon('familyBranch')}
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
                                <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-slate-500 uppercase tracking-wider">
                                    رقم الجوال
                                </th>
                                <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-slate-500 uppercase tracking-wider">
                                    صلة القرابة
                                </th>
                                <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-slate-500 uppercase tracking-wider">
                                    الإجراءات
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-slate-200">
                            {paginatedUsers.length > 0 ? (
                                paginatedUsers.map((user: User) => (
                                    <tr key={user._id} className="hover:bg-slate-50 transition-colors">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex justify-center">
                                                {user.image ? (
                                                    <img
                                                        src={`${user?.image}`}
                                                        alt={`${user.fname} ${user.lname}`}
                                                        className="h-10 w-10 rounded-full object-cover"
                                                    />
                                                ) : (
                                                    <div className="h-10 w-10 rounded-full bg-slate-200 flex items-center justify-center text-slate-600 font-medium">
                                                        {user.fname.charAt(0)}{user.lname.charAt(0)}
                                                    </div>
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-center">
                                                <div className="font-medium text-slate-900">
                                                    {user.fname} {user.lname}
                                                </div>
                                                <div className="text-sm text-slate-500 mt-1">
                                                    {user.email}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-center">
                                                <div className="font-medium text-slate-900">
                                                    {user.familyBranch}
                                                </div>
                                                <div className="text-sm text-slate-500 mt-1">
                                                    {user.role}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex justify-center">
                                                <span className={`px-2 py-1 text-responsive-sm font-semibold rounded-md ${user.status === 'accept' ?
                                                    'bg-green-100 text-green-800' :
                                                    'bg-slate-100 text-primary'
                                                    }`}>
                                                    {user.status === 'accept' ? 'مفعل' : 'معلق'}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500 text-center">
                                            {user.phone}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500 text-center">
                                            {user.familyRelationship}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-center">
                                            <div className="flex justify-center space-x-2 gap-2">
                                                <button
                                                    onClick={() => handleEdit(user._id)}
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
                                                >
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                    </svg>
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={7} className="px-6 py-4 text-center text-slate-500">
                                        لا توجد بيانات متاحة
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                <div className="flex items-center justify-between mt-4 px-2">
                    <div className="text-sm text-slate-500">
                        عرض <span className="font-medium">{(currentPage - 1) * itemsPerPage + 1}</span> إلى{' '}
                        <span className="font-medium">
                            {Math.min(currentPage * itemsPerPage, filteredUsers.length)}
                        </span>{' '}
                        من <span className="font-medium">{filteredUsers.length}</span> نتائج
                    </div>
                    <div className="flex space-x-2 gap-2">
                        <button
                            onClick={() => handlePageChange(currentPage - 1)}
                            disabled={currentPage === 1}
                            className={`px-3 py-1 rounded-md border ${currentPage === 1 ?
                                'bg-slate-100 text-slate-400 cursor-not-allowed' :
                                'bg-white text-primary hover:bg-slate-50'
                                }`}
                        >
                            السابق
                        </button>
                        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                            <button
                                key={page}
                                onClick={() => handlePageChange(page)}
                                className={`px-3 py-1 rounded-md ${currentPage === page ?
                                    'bg-primary text-white' :
                                    'bg-white text-primary hover:bg-slate-100 border'
                                    }`}
                            >
                                {page}
                            </button>
                        ))}
                        <button
                            onClick={() => handlePageChange(currentPage + 1)}
                            disabled={currentPage === totalPages}
                            className={`px-3 py-1 rounded-md border ${currentPage === totalPages ?
                                'bg-slate-100 text-slate-400 cursor-not-allowed' :
                                'bg-white text-primary hover:bg-slate-50'
                                }`}
                        >
                            التالي
                        </button>
                    </div>
                </div>
            </div>

            <Modal
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                title="حذف مستخدم"
            >
                <div className="space-y-4">
                    <p className="text-lg">هل أنت متأكد من حذف المستخدم {userToDelete?.fname} {userToDelete?.lname}؟</p>
                    <div className="flex justify-end gap-3">
                        <button
                            onClick={() => setIsDeleteModalOpen(false)}
                            className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
                        >
                            إلغاء
                        </button>
                        <button
                            onClick={confirmDelete}
                            className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                        >
                            تأكيد الحذف
                        </button>
                    </div>
                </div>
            </Modal>
        </div>
    );
};

export default MembersTable;