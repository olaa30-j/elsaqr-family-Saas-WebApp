import { PERMISSION_POINTS } from '../utils/permissions';
import { useCheckPermissionMutation } from '../store/api/permissionApi';
import { useAppSelector } from '../store/store';
import { useEffect, useState } from 'react';

export const usePermission = (point: keyof typeof PERMISSION_POINTS) => {
    const user = useAppSelector((state) => state.auth.user);
    const [checkPermission] = useCheckPermissionMutation();
    const [hasPermission, setHasPermission] = useState(false);

    const { entity, action } = PERMISSION_POINTS[point];
    
    useEffect(() => {
        const check = async () => {
            if (!user) {
                setHasPermission(false);
                return;
            }

            try {
                const res = await checkPermission({ entity, action }).unwrap();
                setHasPermission(res.success);
            } catch {
                setHasPermission(false);
            }
        };

        check();
    }, [user, entity, action, checkPermission]);

    return { hasPermission };
}