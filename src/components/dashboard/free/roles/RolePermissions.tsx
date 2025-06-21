import React, { useState, useMemo, useEffect } from 'react';
import { useUpdatePermissionForRoleMutation, useGetAllPermissionsQuery } from '../../../../store/api/permissionApi';
import { useGetAllRolesQuery } from '../../../../store/api/roleApi';
import { type PermissionEntity, type PermissionAction } from '../../../../types/permissionsStructure';
import { usePermission } from '../../../../hooks/usePermission';
import { toast } from 'react-toastify';
import { Controller, useForm } from 'react-hook-form';
import { Shield, Search, UserCog, Save, Loader2, AlertCircle, ShieldCheck, Box, History, ChevronDown, ShieldQuestion } from 'lucide-react';
import PermissionsGuide from './PermissionsGuide';

export type Role = string;

interface Permission {
    entity: PermissionEntity;
    view: boolean;
    create: boolean;
    update: boolean;
    delete: boolean;
}

const RolePermissions: React.FC = () => {
    const [selectedRole, setSelectedRole] = useState<Role>('');
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [initialPermissions, setInitialPermissions] = useState<Permission[]>([]);
    const [hasChanges, setHasChanges] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isGuideOpen, setIsGuideOpen] = useState(false);

    const permissionEntities: PermissionEntity[] = ['مناسبه', 'عضو', 'مستخدم', 'معرض الصور', 'ماليه', 'اعلان'];
    const actions: PermissionAction[] = ['view', 'create', 'update', 'delete'];

    const { control, reset, watch } = useForm<{ permissions: Permission[] }>({
        defaultValues: {
            permissions: permissionEntities.map(entity => ({
                entity,
                view: false,
                create: false,
                update: false,
                delete: false
            }))
        }
    });

    const {
        data: rolesResponse,
        isLoading: isLoadingRoles,
        error: rolesError
    } = useGetAllRolesQuery();

    const {
        data: permissionsResponse,
        isLoading: isLoadingPermissions,
        error: permissionsError,
        refetch: refetchPermissions
    } = useGetAllPermissionsQuery({ page: 1, limit: 10 });

    const [updatePermission] = useUpdatePermissionForRoleMutation();

    // Filtered data
    const availableRoles: Role[] = useMemo(() => {
        return rolesResponse?.data || [];
    }, [rolesResponse]);

    const filteredRoles: Role[] = useMemo(() => {
        return availableRoles.filter((role: Role) =>
            role.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [availableRoles, searchTerm]);

    const filteredEntities = useMemo(() => {
        return permissionEntities;
    }, [permissionEntities]);

    const currentPermissions = watch('permissions');

    useEffect(() => {
        if (initialPermissions.length > 0 && currentPermissions && hasChanges) {
            const changesDetected =
                JSON.stringify(currentPermissions) !== JSON.stringify(initialPermissions);
            setHasChanges(changesDetected);
        }
    }, [currentPermissions, initialPermissions]);

    useEffect(() => {
        if (selectedRole && permissionsResponse?.data) {
            const selectedRoleData = permissionsResponse.data.find(
                (roleData) => roleData.role === selectedRole
            );

            const defaultPermissions = permissionEntities.map(entity => {
                const entityPermission = selectedRoleData?.permissions.find(
                    (p) => p.entity === entity
                );

                return {
                    entity,
                    view: entityPermission?.view || false,
                    create: entityPermission?.create || false,
                    update: entityPermission?.update || false,
                    delete: entityPermission?.delete || false
                };
            });

            setInitialPermissions(defaultPermissions);
            reset({ permissions: defaultPermissions });
            setHasChanges(false);
        } else {
            const emptyPermissions = permissionEntities.map(entity => ({
                entity,
                view: false,
                create: false,
                update: false,
                delete: false
            }));
            setInitialPermissions(emptyPermissions);
            reset({ permissions: emptyPermissions });
            setHasChanges(false);
        }
    }, [selectedRole, permissionsResponse, reset]);


    const handleSaveChanges = async () => {
        if (!selectedRole) return;

        try {
            setIsSubmitting(true);
            const currentPermissions = watch('permissions');

            // Collect all changes
            const changes = currentPermissions.flatMap(perm => {
                const initialPerm = initialPermissions.find(p => p.entity === perm.entity);
                if (!initialPerm) return [];

                return actions
                    .filter(action => perm[action] !== initialPerm[action])
                    .map(action => ({
                        entity: perm.entity,
                        action,
                        value: perm[action]
                    }));
            });

            await Promise.all(changes.map(change =>
                updatePermission({
                    role: selectedRole,
                    ...change
                }).unwrap()
            ));

            toast.success("تم تحديث جميع الصلاحيات بنجاح");
            await refetchPermissions();
            setInitialPermissions(currentPermissions);
            setHasChanges(false);
        } catch (error: any) {
            console.error('Update error:', error);
            toast.error(error.message || "فشل في تحديث الصلاحيات. يرجى المحاولة مرة أخرى");
            reset({ permissions: initialPermissions });
        } finally {
            setIsSubmitting(false);
        }
    };

    const { hasPermission: canEditRoles } = usePermission('USER_EDIT');

    if (!canEditRoles) {
        return (
            <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded flex items-start">
                <AlertCircle className="h-5 w-5 mx-2 mt-0.5" />
                <div>
                    <p className="font-bold">خطأ في الصلاحية</p>
                    <p>ليس لديك صلاحية لتعديل الأدوار</p>
                </div>
            </div>
        );
    }

    if (rolesError) {
        return (
            <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded flex items-start">
                <AlertCircle className="h-5 w-5 mx-2 mt-0.5" />
                <div>
                    <p className="font-bold">خطأ في تحميل البيانات</p>
                    <p>فشل تحميل قائمة الأدوار</p>
                </div>
            </div>
        );
    }

    return (
        <div className="container py-6">
            <div className="flex justify-between items-center mb-6 text-primary">
                <div>
                    <h2 className="text-2xl font-bold text-gray-800 flex items-center">
                        <Shield className="w-6 h-6 mx-2 text-primary-600" />
                        إدارة صلاحيات الأدوار
                    </h2>
                    {(isLoadingPermissions || isSubmitting) && (
                        <Loader2 className="w-6 h-6 text-primary-600 animate-spin" />
                    )}
                </div>

                <button onClick={() => setIsGuideOpen(!isGuideOpen)}>
                    <ShieldQuestion className="w-5 h-5" />
                </button>
            </div>

            {/* Role Selection Card */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6 overflow-hidden">
                <div className="bg-gray-50 border-b border-gray-200 px-6 py-4">
                    <h3 className="text-lg font-medium text-gray-900 flex items-center">
                        <UserCog className="w-5 h-5 mx-2 text-primary-500" />
                        اختيار الدور
                    </h3>
                </div>
                <div className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label htmlFor="roleSearch" className="block text-sm font-medium text-gray-700 mb-1">
                                بحث عن دور
                            </label>
                            <div className="relative rounded-md shadow-sm">
                                <div className="absolute inset-y-0 right-0 pl-3 flex items-center pointer-events-none">
                                    <Search className="h-5 w-5 text-gray-400" />
                                </div>
                                <input
                                    type="text"
                                    className="focus:ring-primary-500 focus:border-primary-500 block w-full pr-10 pl-3 py-2 sm:text-sm border-gray-300 rounded-md"
                                    placeholder="ابحث عن دور..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    disabled={isLoadingRoles}
                                    id="roleSearch"
                                />
                            </div>
                            <p className="mt-1 text-sm text-gray-500">ابحث عن دور لتعديل صلاحياته</p>
                        </div>
                        <div>
                            <label htmlFor="roleSelect" className="block text-sm font-medium text-gray-700 mb-1">
                                اختر دور
                            </label>
                            <div className="relative">
                                <select
                                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm pr-8"
                                    value={selectedRole}
                                    onChange={(e) => {
                                        setSelectedRole(e.target.value);
                                        setHasChanges(false);
                                    }}
                                    disabled={isLoadingRoles}
                                    id="roleSelect"
                                >
                                    <option value="">اختر دور</option>
                                    {filteredRoles.map((role, index) => (
                                        <option key={index} value={role}>
                                            {role}
                                        </option>
                                    ))}
                                </select>
                                <div className="absolute inset-y-0 left-0 flex items-center pointer-events-none pl-2">
                                    <ChevronDown className="h-4 w-4 text-gray-400" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Permissions Section */}
            {selectedRole && (
                <>
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-4">
                        <div className="px-6 py-4 flex justify-between items-center">
                            <div className="flex items-center space-x-2">
                                {isSubmitting && (
                                    <div className="flex items-center text-sm text-gray-500">
                                        <Loader2 className="mx-1 h-4 w-4 text-primary-500 animate-spin" />
                                        جاري معالجة التغييرات...
                                    </div>
                                )}
                            </div>
                            <button
                                onClick={handleSaveChanges}
                                className={`inline-flex items-center px-4 py-2 rounded-md shadow-sm text-sm font-medium text-white ${!isSubmitting ? 'bg-primary  hover:bg-primary/90 ' : 'bg-gray-400'} focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500`}
                            >

                                <>
                                    <Save className="mx-2 h-4 w-4" />
                                    حفظ جميع التغييرات
                                </>
                            </button>
                        </div>
                    </div>

                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                        <div className="bg-gray-50 px-6 py-4 flex flex-col md:flex-row justify-between md:items-center border-b border-gray-200">
                            <h3 className="text-lg font-medium text-gray-900 flex items-center">
                                <ShieldCheck className="w-5 h-5 mx-2 text-primary-500 hidden md:block" />
                                صلاحيات دور: {selectedRole}
                            </h3>
                            <span className="inline-flex items-center justify-end px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-100 text-primary-800">
                                {filteredEntities.length} اقسام
                            </span>
                        </div>
                        <div className="p-0">
                            {permissionsError ? (
                                <div className="bg-red-50 border-l-4 border-red-400 p-4 m-4">
                                    <div className="flex">
                                        <div className="flex-shrink-0">
                                            <AlertCircle className="h-5 w-5 text-red-400" />
                                        </div>
                                        <div className="ml-3">
                                            <p className="text-sm text-red-700">
                                                فشل تحميل الصلاحيات. يرجى المحاولة مرة أخرى.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div className="overflow-x-auto">
                                    <table className="min-w-full divide-y divide-gray-200">
                                        <thead className="bg-primary-600">
                                            <tr>
                                                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-white uppercase tracking-wider">
                                                    الأقسام
                                                </th>
                                                {actions.map((action) => (
                                                    <th key={action} scope="col" className="px-6 py-3 text-center text-xs font-medium text-white uppercase tracking-wider">
                                                        {action === 'view' ? 'عرض' :
                                                            action === 'create' ? 'إنشاء' :
                                                                action === 'update' ? 'تعديل' : 'حذف'}
                                                    </th>
                                                ))}
                                            </tr>
                                        </thead>
                                        <tbody className="bg-white divide-y divide-gray-200">
                                            {filteredEntities.map(entity => (
                                                <tr key={entity} className={`${isLoadingPermissions ? 'opacity-75' : ''} hover:bg-gray-50 transition-colors duration-150`}>
                                                    <td className="px-6 py-4 whitespace-nowrap font-medium text-primary-600">
                                                        <div className="flex items-center">
                                                            <Box className="flex-shrink-0 h-5 w-5 text-gray-400" />
                                                            <span className="mx-2">{entity}</span>
                                                        </div>
                                                    </td>
                                                    {actions.map((action) => (
                                                        <td key={`${entity}-${action}`} className="px-6 py-4 whitespace-nowrap text-center">
                                                            <Controller
                                                                name={`permissions.${permissionEntities.indexOf(entity)}.${action}`}
                                                                control={control}
                                                                render={({ field }) => (
                                                                    <label className="inline-flex items-center">
                                                                        <input
                                                                            type="checkbox"
                                                                            checked={!!field.value}
                                                                            onChange={(e) => {
                                                                                field.onChange(e.target.checked);
                                                                            }}
                                                                            className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                                                                            disabled={isSubmitting || isLoadingPermissions}
                                                                        />
                                                                    </label>
                                                                )}
                                                            />                                                        </td>
                                                    ))}
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </div>
                        <div className="bg-gray-50 px-6 py-3 border-t border-gray-200">
                            <div className="flex justify-between items-center text-sm text-gray-500">
                                <div className="flex items-center">
                                    <History className="w-4 h-4 mx-1" />
                                    آخر تحديث: {new Date().toLocaleString('ar-EG')}
                                </div>
                            </div>
                        </div>
                    </div>
                </>
            )}


            {isGuideOpen && (
                <PermissionsGuide isOpen={isGuideOpen} handleClose={() => setIsGuideOpen(false)} />
            )}

        </div>
    );
};

export default RolePermissions;