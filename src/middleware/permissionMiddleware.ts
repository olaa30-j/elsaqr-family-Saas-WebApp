import type { Middleware } from '@reduxjs/toolkit';
import type { RootState } from '../store/store';
import { permissionApi } from '../store/api/permissionApi';

export const permissionMiddleware: Middleware<{}, RootState> = (store: any) => (next) => async (action: any) => {
    if (action.type.endsWith('/execute') && action.meta?.arg?.endpointName === 'verifyAction') {
        const { entity, action: permissionAction } = action.meta.arg.originalArgs;

        try {
            const { data: hasPermission } = await store.dispatch(
                permissionApi.endpoints.checkPermission.initiate({ entity, action: permissionAction })
            ).unwrap();

            if (!hasPermission) {
                throw new Error('You do not have permission to perform this action');
            }

            return next(action);
        } catch (error) {
            console.log(error)
        }
    }

    return next(action);
};