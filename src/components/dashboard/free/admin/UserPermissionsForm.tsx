import { useForm, Controller } from 'react-hook-form';
import { useUpdatePermissionsMutation } from '../../../../store/api/usersApi';
import { toast } from 'react-toastify';
import type { User } from '../../../../types/user';
import { useEffect, useState } from 'react';

export type PermissionEntity = 'مناسبه' | 'عضو' | 'مستخدم' | 'معرض الصور' | 'ماليه' | 'اعلان';
export type PermissionAction = 'view' | 'create' | 'update' | 'delete';

export interface EntityPermission {
    entity: PermissionEntity;
    view: boolean;
    create: boolean;
    update: boolean;
    delete: boolean;
}

export type UserPermissions = EntityPermission[];

const permissionEntities: PermissionEntity[] = ['مناسبه', 'عضو', 'مستخدم', 'معرض الصور', 'ماليه', 'اعلان'];
const permissionActions: PermissionAction[] = ['view', 'create', 'update', 'delete'];

const PermissionsSection = ({ user }: { user: User }) => {
    const [updatePermissions] = useUpdatePermissionsMutation();
    const [initialPermissions, setInitialPermissions] = useState<UserPermissions>([]);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [hasChanges, setHasChanges] = useState(false);

    const { control, reset, watch } = useForm<{ permissions: UserPermissions }>({
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

    const currentPermissions = watch('permissions');

    useEffect(() => {
        if (initialPermissions.length > 0) {
            const changesExist = currentPermissions.some(currentPerm => {
                const initialPerm = initialPermissions.find(p => p.entity === currentPerm.entity);
                if (!initialPerm) return true;
                
                return permissionActions.some(action => 
                    currentPerm[action] !== initialPerm[action]
                );
            });
            setHasChanges(changesExist);
        }
    }, [currentPermissions, initialPermissions]);

    useEffect(() => {
        if (user?.permissions) {
            const defaultPermissions = permissionEntities.map(entity => ({
                entity,
                view: false,
                create: false,
                update: false,
                delete: false
            }));

            const mergedPermissions = defaultPermissions.map(defaultPerm => {
                const userPerm = user.permissions.find(p => p.entity === defaultPerm.entity);
                return userPerm ? { ...defaultPerm, ...userPerm } : defaultPerm;
            });

            setInitialPermissions(mergedPermissions);
            reset({ permissions: mergedPermissions });
        }
    }, [user, reset]);

    const handlePermissionChange = (entity: PermissionEntity, action: PermissionAction, value: boolean) => {
        const updated = currentPermissions.map(perm =>
            perm.entity === entity ? { ...perm, [action]: value } : perm
        );
        reset({ permissions: updated });
    };

    const handleSaveChanges = async () => {
        if (!user?._id || !hasChanges) return;

        try {
            setIsSubmitting(true);
            
            // Find all changes
            const changes = currentPermissions.flatMap(newPerm => {
                const oldPerm = initialPermissions.find(p => p.entity === newPerm.entity);
                if (!oldPerm) return [];
                
                return permissionActions
                    .filter(action => newPerm[action] !== oldPerm[action])
                    .map(action => ({
                        entity: newPerm.entity,
                        action,
                        value: newPerm[action]
                    }));
            });

            // Send all changes at once
            await Promise.all(changes.map(change =>
                updatePermissions({
                    id: user._id,
                    ...change
                }).unwrap()
            ));

            toast.success("تم تحديث الصلاحيات بنجاح");
            setInitialPermissions(currentPermissions);
            setHasChanges(false);
        } catch (error: any) {
            console.error('Update error:', error);
            toast.error(error.data?.message || "فشل في تحديث الصلاحيات. يرجى المحاولة مرة أخرى");
            reset({ permissions: initialPermissions });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="bg-white rounded-lg shadow-md p-6 mt-6">
            <h3 className="text-lg font-semibold mb-4 text-primary text-center mb-6">إدارة الصلاحيات</h3>

            <form>
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
                                            <Controller
                                                name="permissions"
                                                control={control}
                                                render={({ field }) => {
                                                    const entityPermission = field.value.find(p => p.entity === entity);
                                                    const checked = entityPermission ? entityPermission[action] : false;

                                                    return (
                                                        <input
                                                            type="checkbox"
                                                            checked={checked}
                                                            onChange={(e) => handlePermissionChange(
                                                                entity,
                                                                action,
                                                                e.target.checked
                                                            )}
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

                {hasChanges && (
                    <div className="flex justify-end mt-4">
                        <button
                            type="button"
                            onClick={handleSaveChanges}
                            disabled={isSubmitting}
                            className="bg-primary text-white px-4 py-2 rounded hover:bg-primary-dark disabled:opacity-50"
                        >
                            {isSubmitting ? 'جاري الحفظ...' : 'حفظ التعديلات'}
                        </button>
                    </div>
                )}
            </form>
        </div>
    );
};

export default PermissionsSection;