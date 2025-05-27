import { configureStore, type Middleware } from '@reduxjs/toolkit';
import { FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER } from 'redux-persist';
import { type TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import { baseApi } from './api/baseApi';
import authReducer from '../features/auth/authSlice';
import { permissionMiddleware } from '../middleware/permissionMiddleware';

export interface RootState {
  [baseApi.reducerPath]: ReturnType<typeof baseApi.reducer>;
  auth: ReturnType<typeof authReducer>;
}

type AppMiddleware = Middleware<{}, RootState>;

export const store = configureStore({
  reducer: {
    [baseApi.reducerPath]: baseApi.reducer,
    auth: authReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    })
    .concat(baseApi.middleware as AppMiddleware)
    .concat(permissionMiddleware as AppMiddleware),
});

export type AppDispatch = typeof store.dispatch;
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;