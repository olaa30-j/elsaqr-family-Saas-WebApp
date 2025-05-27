import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { AuthState } from '../../types/authTypes';
import type { User } from '../../types/user';
import { baseApi } from '../../store/api/baseApi';

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  loading: false,
  error: null,
  cookies: {
    accessToken: null
  }
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (state, action: PayloadAction<{
      user: User;
    }>) => {
      state.user = action.payload.user;
      state.isAuthenticated = true;
      state.error = null;
    },
    clearCredentials: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      state.cookies.accessToken = null;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addMatcher(
        baseApi.endpoints.getAuthUser.matchFulfilled,
        (state, { payload }) => {
          state.isAuthenticated = true;
          state.user = payload;
        }
      )
      .addMatcher(
        baseApi.endpoints.getAuthUser.matchRejected,
        (state) => {
          state.isAuthenticated = false;
          state.user = null;
        }
      );
  }
});

export const {
  setCredentials,
  clearCredentials,
  setLoading,
  setError,
} = authSlice.actions;

export default authSlice.reducer;