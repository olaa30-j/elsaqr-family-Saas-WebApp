// import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
// import type { Notification } from '../../types/user';

// interface NotificationState {
//   list: Notification[];
//   unreadCount: number;
//   settings: {
//     enabled: boolean;
//     sound: boolean;
//     desktopAlerts: boolean;
//   };
//   isOnline: boolean;
// }

// const initialState: NotificationState = {
//   list: [],
//   unreadCount: 0,
//   settings: {
//     enabled: true,
//     sound: true,
//     desktopAlerts: false
//   },
//   isOnline: navigator.onLine
// };

// const notificationSlice = createSlice({
//   name: 'notification',
//   initialState,
//   reducers: {
//     addNotification: (state, action: PayloadAction<Notification>) => {
//       state.list.unshift(action.payload);
//       if (!action.payload.read) {
//         state.unreadCount += 1;
//       }
//     },
//     markAsRead: (state, action: PayloadAction<string>) => {
//       const notification = state.list.find(n => n.id === action.payload);
//       if (notification && !notification.read) {
//         notification.read = true;
//         state.unreadCount -= 1;
//       }
//     },
//     setNotifications: (state, action: PayloadAction<Notification[]>) => {
//       state.list = action.payload;
//       state.unreadCount = action.payload.filter(n => !n.read).length;
//     },
//     updateSettings: (state, action: PayloadAction<Partial<NotificationState['settings']>>) => {
//       state.settings = { ...state.settings, ...action.payload };
//     },
//     setOnline: (state) => {
//       state.isOnline = true;
//     },
//     setOffline: (state) => {
//       state.isOnline = false;
//     }
//   }
// });

// export const { 
//   addNotification, 
//   markAsRead, 
//   setNotifications, 
//   updateSettings,
//   setOnline,
//   setOffline
// } = notificationSlice.actions;

// export default notificationSlice.reducer;