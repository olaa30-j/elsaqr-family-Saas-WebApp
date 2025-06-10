import { useMemo, useState } from "react";
import {
    useGetAllRolesQuery,
    useRemoveRoleFromAllUsersMutation
} from "../../../../store/api/roleApi";
import { useGetUsersQuery } from "../../../../store/api/usersApi";
import type { User } from "../../../../types/user";
import type { SortConfig } from "../../../../types/SortConfig";
import Modal from "../../../ui/Modal";
import { Edit, Trash2 } from "lucide-react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";


const countUsersPerRole = (users: User[] | []) => {
    const counts: Record<string, number> = {};
    users?.forEach((user) => {
        user.role?.forEach((role: any) => {
            counts[role] = (counts[role] || 0) + 1;
        });
    });
    return counts;
};

const RoleCards = () => {
    const { data: roles, isLoading: isLoadingRoles } = useGetAllRolesQuery();
    const [removeUserRole] = useRemoveRoleFromAllUsersMutation();
    const { data: users, isLoading: isLoadingUsers } = useGetUsersQuery({ page: 1, limit: 10 });
    const [selectedRole, setSelectedRole] = useState<string | null>(null);
    const [sortConfig, setSortConfig] = useState<SortConfig<User>>({ key: 'email', direction: 'asc' });
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [roleToDelete, setRoleToDelete] = useState<string | null>(null);

    const roleCounts = useMemo(() => countUsersPerRole(users?.data || []), [users]);

    const handleDeleteRole = async () => {
        if (!roleToDelete) return;
        try {
            const response = await removeUserRole({ role: roleToDelete }).unwrap();
            toast.success(response.message || "تم حذف الدور بنجاح");
            setIsDeleteModalOpen(false);
            setRoleToDelete(null);
        } catch (error: any) {
            const errorMessage = error.data?.message || "حدث خطأ أثناء حذف الدور";
            toast.error(errorMessage);
            console.error("Delete role error:", error);
        }
    };

    if (isLoadingRoles || isLoadingUsers) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
            </div>
        );
    }

    if (!roles?.data || !users?.data) {
        return (
            <div className="bg-white rounded-lg shadow p-6 text-center text-gray-600">
                لا توجد بيانات متاحة
            </div>
        );
    }

    const filteredUsers = selectedRole
        ? users.data.filter((user: any) => user.role?.includes(selectedRole))
        : [];

    const handleSort = (key: keyof User) => {
        setSortConfig((prev: any) => ({
            key,
            direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc'
        }));
    };

    const sortedUsers = [...filteredUsers].sort((a, b) => {
        const aValue = a[sortConfig.key];
        const bValue = b[sortConfig.key];

        if (aValue === undefined) return 1;
        if (bValue === undefined) return -1;

        if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
        if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
        return 0;
    });

    return (
        <div className="py-6 min-h-screen">
            {/* Delete Confirmation Modal */}
            <Modal
                isOpen={isDeleteModalOpen}
                onClose={() => {
                    setIsDeleteModalOpen(false);
                    setRoleToDelete(null);
                }}
                title="تأكيد الحذف"
                type="delete"
                onConfirm={handleDeleteRole}
            >
                <p className="text-center py-4 text-gray-700">هل أنت متأكد أنك تريد حذف هذا الدور؟</p>
            </Modal>

            {/* بطاقات الأدوار */}
            <div className="mb-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {roles.data.map((role: string) => (
                        <div
                            key={role}
                            className={`bg-white rounded-lg shadow-sm overflow-hidden transition-all duration-300 transform hover:-translate-y-1 hover:shadow-md border-2  ${selectedRole === role ? 'border-primary' : 'border-primary/40'}`}
                        >
                            <div className="bg-gradient-to-r from-primary/90 to-primary p-5">
                                <div className="flex justify-between items-center">
                                    <h3
                                        className="text-xl font-bold text-white cursor-pointer hover:underline"
                                        onClick={() => setSelectedRole(role)}
                                    >
                                        {role}
                                    </h3>
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setRoleToDelete(role);
                                            setIsDeleteModalOpen(true);
                                        }}
                                        className="rounded-full hover:bg-white/10 transition-colors"
                                        aria-label="حذف الدور"
                                    >
                                        <Trash2 className="w-5 h-5 text-white hover:text-red-200" />
                                    </button>
                                </div>
                            </div>
                            <div
                                className="p-5 cursor-pointer"
                                onClick={() => setSelectedRole(role)}
                            >
                                <div className="flex justify-between items-center">
                                    <span className="text-gray-600">عدد المستخدمين:</span>
                                    <span className="font-semibold text-primary text-lg">
                                        {roleCounts?.[role] || 0}
                                    </span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Modal لعرض جدول المستخدمين وتعديل الصلاحيات */}
            <Modal
                isOpen={!!selectedRole}
                onClose={() => {
                    setSelectedRole(null);
                }}
                title={`المستخدمين لدور: ${selectedRole}`}
                type="form"
            >

                <div className="space-y-4">
                    <div className="flex justify-between items-center">
                        <h3 className="text-lg font-medium text-gray-900">
                            عدد المستخدمين: <span className="text-primary">{sortedUsers.length}</span>
                        </h3>
                    </div>

                    <div className="overflow-x-auto rounded-lg border border-gray-200 shadow">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th
                                        scope="col"
                                        className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition"
                                        onClick={() => handleSort('email')}
                                    >
                                        <div className="flex items-center justify-center gap-4">
                                            البريد الإلكتروني
                                            {sortConfig.key === 'email' && (
                                                <span className="ml-1">
                                                    {sortConfig.direction === 'asc' ? '↑' : '↓'}
                                                </span>
                                            )}
                                        </div>
                                    </th>
                                    <th
                                        scope="col"
                                        className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider"
                                    >
                                        الأدوار
                                    </th>
                                    <th
                                        scope="col"
                                        className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider"
                                    >
                                        الإجراءات
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {sortedUsers.length > 0 ? (
                                    sortedUsers.map((user) => (
                                        <tr key={user._id} className="hover:bg-gray-50 transition">
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-center">
                                                {user.email}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center">
                                                <div className="flex flex-wrap gap-4 justify-center">
                                                    {user.role?.map(r => (
                                                        <span key={r} className="px-2 py-1 bg-primary/10 text-primary rounded-full text-xs">
                                                            {r}
                                                        </span>
                                                    )) || 'لا يوجد'}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-center flex gap-4 justify-center">
                                                <Link
                                                    to={`/admin/users/${user._id}`}
                                                    className="text-primary hover:text-primary/90 p-1 rounded-full hover:bg-primary/10 transition"
                                                >
                                                    <Edit className="w-5 h-5 text-center" />
                                                </Link>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={3} className="px-6 py-4 text-center text-sm text-gray-500">
                                            لا يوجد مستخدمين لهذا الدور
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </Modal>
        </div>
    );
};

export default RoleCards;