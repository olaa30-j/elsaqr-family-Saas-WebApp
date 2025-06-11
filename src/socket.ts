// import { toast } from 'react-toastify';
// import type { NotificationSettings, Notification } from './types/user';
// import { store, type AppDispatch } from './store/store';
// import { addNotification, setOnline, setOffline } from './features/notifications/notificationSlice';

// interface SocketConfig {
//   query: {
//     userId: string;
//   };
//   transports: string[];
//   reconnection: boolean;
//   reconnectionAttempts: number;
//   reconnectionDelay: number;
// }

// let socket: Socket | null = null;

// export const initializeSocket = (dispatch: AppDispatch, userId: string): Socket => {
//   if (socket) return socket;

//   const config: SocketConfig = {
//     query: { userId },
//     transports: ['websocket'],
//     reconnection: true,
//     reconnectionAttempts: 5,
//     reconnectionDelay: 3000
//   };

//   socket = io('https://your-socket-server.com', config);

//   socket.on('connect', () => {
//     dispatch(setOnline());
//     console.log('Socket connected');
//   });

//   socket.on('disconnect', () => {
//     dispatch(setOffline());
//     console.log('Socket disconnected');
//   });

//   socket.on('connect_error', (err: any) => {
//     console.error('Socket connection error:', err);
//   });

//   socket.on('notification', (notification: Notification) => {
//     const enrichedNotification = {
//       ...notification,
//       read: notification.readAt !== null
//     };
//     dispatch(addNotification(enrichedNotification));
    
//     const { settings } = store.getState().notification;
//     if (settings.enabled) {
//       showNotificationAlert(enrichedNotification, settings);
//     }
//   });

//   return socket;
// };

// const showNotificationAlert = (
//   notification: Notification,
//   settings: NotificationSettings
// ) => {
//   toast.info(notification.message, {
//     position: 'top-right',
//     rtl: true,
//     autoClose: 5000,
//     hideProgressBar: false,
//     closeOnClick: true,
//     pauseOnHover: true
//   });

//   if (settings.sound) {
//     const audio = new Audio('/notification-sound.mp3');
//     audio.play().catch(e => console.error('Failed to play sound:', e));
//   }

//   if (settings.desktopAlerts && Notification.permission === 'granted') {
//     new Notification(notification.message);
//   }
// };

// export const disconnectSocket = () => {
//   if (socket) {
//     socket.disconnect();
//     socket = null;
//   }
// };