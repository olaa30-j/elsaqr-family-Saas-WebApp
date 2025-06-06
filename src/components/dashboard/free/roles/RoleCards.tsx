import { useMemo, useState } from "react";
import {
    useGetAllRolesQuery,
    useRemoveUserRoleMutation,
    useUpdateRolesWithPermissionsMutation
} from "../../../../store/api/roleApi";
import { useGetUsersQuery } from "../../../../store/api/usersApi";
import type { User } from "../../../../types/user";
import type { SortConfig } from "../../../../types/SortConfig";
import Modal from "../../../ui/Modal";
import { Edit, Trash2 } from "lucide-react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";

// أنواع الصلاحيات
export type PermissionEntity = 'مناسبه' | 'عضو' | 'مستخدم' | 'معرض الصور' | 'ماليه' | 'اعلان';
export type PermissionAction = 'view' | 'create' | 'update' | 'delete';

const permissionEntities: PermissionEntity[] = ['مناسبه', 'عضو', 'مستخدم', 'معرض الصور', 'ماليه', 'اعلان'];
const permissionActions: PermissionAction[] = ['view', 'create', 'update', 'delete'];

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
    const [removeUserRole] = useRemoveUserRoleMutation();
    const { data: users, isLoading: isLoadingUsers } = useGetUsersQuery({ page: 1, limit: 10 });
    const [selectedRole, setSelectedRole] = useState<string | null>(null);
    const [sortConfig, setSortConfig] = useState<SortConfig<User>>({ key: 'email', direction: 'asc' });
    const [isEditingPermissions, setIsEditingPermissions] = useState(false);
    const [tempPermissions, setTempPermissions] = useState<Record<string, boolean>>({});
    const [updateRolePermissions] = useUpdateRolesWithPermissionsMutation();
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [roleToDelete, setRoleToDelete] = useState<string | null>(null);

    const roleCounts = useMemo(() => countUsersPerRole(users?.data || []), [users]);

    const handleDeleteRole = async () => {
        if (!roleToDelete) return;
        try {
            await removeUserRole({ id: roleToDelete, role: roleToDelete }).unwrap();
            toast.success("تم حذف الدور بنجاح");
            setIsDeleteModalOpen(false);
            setRoleToDelete(null);
        } catch (error) {
            toast.error("حدث خطأ أثناء حذف الدور");
            console.error(error);
        }
    };

    if (isLoadingRoles || isLoadingUsers) {
        return <div>جار التحميل...</div>;
    }

    if (!roles?.data || !users?.data) {
        return <div>لا توجد بيانات متاحة</div>;
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

    const handlePermissionChange = (entity: PermissionEntity, action: PermissionAction, value: boolean) => {
        setTempPermissions(prev => ({
            ...prev,
            [`${entity}-${action}`]: value
        }));
    };

    const handleSavePermissions = async () => {
        if (!selectedRole) return;
        try {
            for (const [key, value] of Object.entries(tempPermissions)) {
                const [entity, action] = key.split('-');
                await updateRolePermissions({
                    id: selectedRole,
                    entity,
                    action: action as PermissionAction,
                    value
                }).unwrap();
            }

            toast.success("تم تحديث صلاحيات الدور بنجاح");
            setIsEditingPermissions(false);
            setTempPermissions({});
        } catch (error) {
            toast.error("حدث خطأ أثناء تحديث الصلاحيات");
            console.error(error);
        }
    };

    return (
        <div className="p-4">
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
                <p className="text-center py-4">هل أنت متأكد أنك تريد حذف هذا الدور؟</p>
            </Modal>

            {/* Cards للأدوار */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                {roles.data.map((role: string) => (
                    <div
                        key={role}
                        className={`bg-white rounded-lg shadow-md cursor-pointer hover:shadow-lg transition-shadow border-2 ${selectedRole === role ? 'border-primary' : 'border-gray-200'
                            }`}
                    >
                        <div className="flex justify-between bg-primary p-4">
                            <h3 
                                className="text-lg font-bold text-white cursor-pointer"
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
                            >
                                <Trash2 className="w-6 h-6 text-white hover:text-red-400" />
                            </button>
                        </div>
                        <p 
                            onClick={() => setSelectedRole(role)}
                            className="text-gray-600 mt-2 p-6 cursor-pointer"
                        >
                            عدد المستخدمين: <span className="font-semibold">{roleCounts?.[role] || 0}</span>
                        </p>
                    </div>
                ))}
            </div>

            {/* Modal لعرض جدول المستخدمين وتعديل الصلاحيات */}
            <Modal
                isOpen={!!selectedRole}
                onClose={() => {
                    setSelectedRole(null);
                    setIsEditingPermissions(false);
                    setTempPermissions({});
                }}
                title={isEditingPermissions
                    ? `تعديل صلاحيات دور: ${selectedRole}`
                    : `المستخدمين لدور: ${selectedRole}`}
                type="form"
            >
                {isEditingPermissions ? (
                    <div className="bg-white rounded-lg shadow-md p-6">
                        <h3 className="text-lg font-semibold mb-4 text-primary text-center">
                            تعديل صلاحيات دور: {selectedRole}
                        </h3>

                        <div className="overflow-x-auto">
                            <table className="min-w-full">
                                <thead>
                                    <tr className='bg-primary text-white'>
                                        <th className="text-right p-3">الاقسام</th>
                                        {permissionActions.map(action => (
                                            <th key={action} className="text-center p-3">
                                                {action === 'view' ? 'عرض' :
                                                    action === 'create' ? 'إنشاء' :
                                                        action === 'update' ? 'تعديل' : 'حذف'}
                                            </th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    {permissionEntities.map(entity => (
                                        <tr key={entity} className="border-t text-primary/80">
                                            <td className="p-3 font-medium">
                                                {entity === 'اعلان' ? 'اعلان' :
                                                    entity === 'ماليه' ? 'ماليه' :
                                                        entity === 'معرض الصور' ? 'معرض الصور' :
                                                            entity === 'مستخدم' ? 'مستخدم' :
                                                                entity === 'عضو' ? 'عضو' : 'مناسبه'}
                                            </td>

                                            {permissionActions.map(action => (
                                                <td key={`${entity}-${action}`} className="text-center p-3">
                                                    <input
                                                        type="checkbox"
                                                        checked={tempPermissions[`${entity}-${action}`] || false}
                                                        onChange={(e) =>
                                                            handlePermissionChange(entity, action, e.target.checked)
                                                        }
                                                        className="h-5 w-5 rounded border-gray-300 text-primary focus:ring-primary"
                                                    />
                                                </td>
                                            ))}
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        <div className="flex justify-end gap-4 mt-4 space-x-2">
                            <button
                                type="button"
                                onClick={() => setIsEditingPermissions(false)}
                                className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
                            >
                                إلغاء
                            </button>
                            <button
                                type="button"
                                onClick={handleSavePermissions}
                                className="bg-primary text-white px-4 py-2 rounded hover:bg-primary-dark"
                            >
                                حفظ التغييرات
                            </button>
                        </div>
                    </div>
                ) : (
                    <>
                        <div className="flex justify-end mb-4">
                            <button
                                onClick={() => setIsEditingPermissions(true)}
                                className="bg-primary text-white px-4 py-2 rounded hover:bg-primary-dark"
                            >
                                تعديل صلاحيات الدور
                            </button>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th
                                            className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase cursor-pointer"
                                            onClick={() => handleSort('email')}
                                        >
                                            <div className="flex items-center justify-center gap-3">
                                                البريد الإلكتروني
                                                {sortConfig.key === 'email' && (
                                                    <span className="ml-1">
                                                        {sortConfig.direction === 'asc' ? '↑' : '↓'}
                                                    </span>
                                                )}
                                            </div>
                                        </th>

                                        <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">
                                            الادوار
                                        </th>

                                        <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">
                                            تعديل المستخدم
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200 text-center">
                                    {sortedUsers.map(user => (
                                        <tr key={user._id} className="hover:bg-gray-50">
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                {user.email}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                {user.role?.join(', ') || 'لا يوجد'}
                                            </td>

                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 flex items-center justify-center">
                                                <Link to={`/admin/users/${user._id}`}>
                                                    <Edit className="w-4 h-4 text-primary" />
                                                </Link>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </>
                )}
            </Modal>
        </div>
    );
};

export default RoleCards;