import { create } from 'zustand';
import { axiosInstance } from "../lib/axios.js";

export interface Notification {
  id: number;
  type: string;
  message: string;
  actor: {
    id: number;
    username: string;
    full_name: string;
    profile_pic: string;
  }
}
interface NotificationState {
  friendRequestNotifications: Notification[];
  newMessageNotifications: Notification[];
  getNotifications: () => Promise<void>;
}

export const useNotificationStore = create<NotificationState>((set) => {
  return {
    friendRequestNotifications: [],
    newMessageNotifications: [],

    getNotifications: async () => {
      try {
        const response = await axiosInstance.get('notifications');
        set({
          friendRequestNotifications: response.data.filter((notification: Notification) => notification.type === 'FRIEND_REQUEST'),
          newMessageNotifications: response.data.filter((notification: Notification) => notification.type === 'MESSAGE')
        });
      } catch (error) {
        console.log(error);
      }
    },
  }
});