import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { AuthState } from '../../types/authTypes';
import type { User } from '../../types/user';
import { baseApi } from '../../store/api/baseApi';

/**
 * Initial state for the authentication slice.
 * Contains:
 * - user: Currently logged-in user or null
 * - isAuthenticated: Boolean indicating authentication status
 * - loading: Loading state for auth operations
 * - error: Current error message or null
 * - cookies: Object containing access token
 */
const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  loading: false,
  error: null,
  cookies: {
    accessToken: null
  }
};

/**
 * Authentication slice containing reducers and actions for managing:
 * - User authentication state
 * - Credentials management
 * - Loading states
 * - Error handling
 * Also includes extra reducers for handling API responses from baseApi endpoints.
 */
const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    /**
     * Sets user credentials upon successful authentication
     * @param state - Current auth state
     * @param action - Payload containing user object
     */
    setCredentials: (state, action: PayloadAction<{
      user: User;
    }>) => {
      state.user = action.payload.user;
      state.isAuthenticated = true;
      state.error = null;
    },
    
    /**
     * Clears all authentication credentials and resets state
     * @param state - Current auth state
     */
    clearCredentials: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      state.cookies.accessToken = null;
    },
    
    /**
     * Sets the loading state for authentication operations
     * @param state - Current auth state
     * @param action - Payload containing boolean loading state
     */
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    
    /**
     * Sets an authentication error message
     * @param state - Current auth state
     * @param action - Payload containing error message string or null
     */
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
  },
  
  /**
   * Extra reducers for handling API responses from baseApi endpoints.
   * These automatically update auth state based on API responses.
   */
  extraReducers: (builder) => {
    builder
      // Handles successful user authentication via API
      .addMatcher(
        baseApi.endpoints.getAuthUser.matchFulfilled,
        (state, { payload }) => {
          state.isAuthenticated = true;
          state.user = payload;
        }
      )
      // Handles failed user authentication via API
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