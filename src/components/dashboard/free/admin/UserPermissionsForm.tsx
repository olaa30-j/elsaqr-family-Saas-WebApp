import { useForm, Controller } from 'react-hook-form';
import { useUpdatePermissionsMutation } from '../../../../store/api/usersApi';
import { toast } from 'react-toastify';
import type { User } from '../../../../types/user';
import { useEffect, useState } from 'react';

export type PermissionEntity = 'event' | 'member' | 'user' | 'album' | 'financial';
export type PermissionAction = 'view' | 'create' | 'update' | 'delete';

export interface EntityPermission {
    entity: PermissionEntity;
    view: boolean;
    create: boolean;
    update: boolean;
    delete: boolean;
}

export type UserPermissions = EntityPermission[];

const permissionEntities: PermissionEntity[] = ['event', 'member', 'user', 'album', 'financial'];
const permissionActions: PermissionAction[] = ['view', 'create', 'update', 'delete'];

const PermissionsSection = ({ user }: { user: User }) => {
    const [updatePermissions] = useUpdatePermissionsMutation();
    const [initialPermissions, setInitialPermissions] = useState<UserPermissions>([]);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const { control, handleSubmit, reset } = useForm({
        defaultValues: {
            permissions: user.permissions || []
        }
    });

    useEffect(() => {
        if (user?.permissions) {
            setInitialPermissions([...user.permissions]);
            reset({
                permissions: [...user.permissions]
            });
        }
    }, [user, reset]);

    const onSubmitOptimized = async (data: { permissions: UserPermissions }) => {
        if (isSubmitting) return;

        setIsSubmitting(true);
        try {
            // Find changed permissions
            const changes: Array<{
                entity: PermissionEntity;
                action: PermissionAction;
                value: boolean;
            }> = [];

            data.permissions.forEach(newPerm => {
                const oldPerm = initialPermissions.find(p => p.entity === newPerm.entity) || {
                    entity: newPerm.entity,
                    view: false,
                    create: false,
                    update: false,
                    delete: false
                };

                permissionActions.forEach(action => {
                    if (newPerm[action] !== oldPerm[action]) {
                        changes.push({
                            entity: newPerm.entity,
                            action,
                            value: newPerm[action]
                        });
                    }
                });
            });

            // Update only changed permissions
            const updatePromises = changes.map(change => 
                updatePermissions({
                    id: user._id,
                    ...change
                }).unwrap()
            );

            await Promise.all(updatePromises);
            
            toast.success("تم تحديث الصلاحيات بنجاح");
            setInitialPermissions(data.permissions);
        } catch (error: any) {
            console.error('Update error:', error);
            toast.error(error.data?.message || "فشل في تحديث الصلاحيات. يرجى التحقق من البيانات والمحاولة مرة أخرى");
            reset({
                permissions: initialPermissions
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="bg-white rounded-lg shadow-md p-6 mt-6">
            <h3 className="text-lg font-semibold mb-4 text-primary text-center mb-6">إدارة الصلاحيات</h3>

            <form onSubmit={handleSubmit(onSubmitOptimized)}>
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
                                <tr key={entity} className="border-t text-amber-600/80">
                                    <td className="p-3 font-medium">
                                        {entity === 'event' ? 'الفعاليات' :
                                            entity === 'member' ? 'الأعضاء' :
                                                entity === 'user' ? 'المستخدمين' :
                                                    entity === 'album' ? 'الألبومات' : 'المالية'}
                                    </td>

                                    {permissionActions.map(action => (
                                        <td key={`${entity}-${action}`} className="text-center p-3">
                                            <Controller
                                                name="permissions"
                                                control={control}
                                                render={({ field }) => {
                                                    const currentPermissions = field.value || [];
                                                    const entityPermission = currentPermissions.find((p: any) => p.entity === entity);
                                                    const checked = entityPermission ? entityPermission[action] : false;

                                                    return (
                                                        <input
                                                            type="checkbox"
                                                            checked={checked}
                                                            onChange={(e) => {
                                                                const updated = currentPermissions.map((p: any) =>
                                                                    p.entity === entity
                                                                        ? { ...p, [action]: e.target.checked }
                                                                        : p
                                                                );

                                                                if (!updated.some((p: any) => p.entity === entity)) {
                                                                    updated.push({
                                                                        entity,
                                                                        view: false,
                                                                        create: false,
                                                                        update: false,
                                                                        delete: false,
                                                                        [action]: e.target.checked
                                                                    });
                                                                }

                                                                field.onChange(updated);
                                                            }}
                                                            className="h-5 w-5 rounded border-gray-300 text-primary focus:ring-primary"
                                                            disabled={isSubmitting}
                                                        />
                                                    );
                                                }}
                                            />
                                        </td>
                                    ))}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <div className="flex justify-end mt-4">
                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="bg-primary text-white px-4 py-2 rounded hover:bg-primary-dark disabled:opacity-50"
                    >
                        {isSubmitting ? 'جاري الحفظ...' : 'حفظ الصلاحيات'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default PermissionsSection;