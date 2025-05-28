import { create } from 'zustand';
import toast from 'react-hot-toast';
import { axiosInstance } from '../lib/axios';
import { UpdateProfileData } from '@/validations/formValidation';
import { useAuthStore } from '@/store/useAuthStore';
import { useChatStore, User } from '@/store/useChatStore';
import { useNotificationStore } from '@/store/useNotificationStore.ts';

interface UserState {
  isUpdatingProfile: boolean;
  partialUsers: User[];
  allUsers: User[];
  updateProfile: (updateProfile: UpdateProfileData & { id: number | undefined }) => Promise<void>;
  fetchAllUsers: () => Promise<void>;
  sendFriendRequest: (friendId: number) => Promise<void>;
  fetchUsersByCriteria: (criteria: string) => Promise<void>;
  responseFriendRequest: (friendId: number, decision: string) => Promise<void>;
}

export const useUserStore = create<UserState>((set) => {
  return {
    isUpdatingProfile: false,
    partialUsers: [],
    allUsers: [],

    updateProfile: async (updateProfile: UpdateProfileData & { id: number | undefined }) => {
      set({ isUpdatingProfile: true });
      try {
        const { id, ...payload } = updateProfile;
        await axiosInstance.put(`/users/${updateProfile.id}`, payload);
        useAuthStore.getState().verifyAuth();
        toast.success('Profile updated successfully');
      } catch (error) {
        toast.error(error.response.data.message);
      } finally {
        set({ isUpdatingProfile: false });
      }
    },

    fetchAllUsers: async () => {
      try {
        const response = await axiosInstance.get<User[]>('/users/AllUsers');
        set({ allUsers: response.data });
      } catch (error: any) {
        const message = error?.response?.data?.message || 'Failed to fetch users';
        toast.error(message);
      }
    },

    sendFriendRequest: async (friendId: number) => {
      set({ partialUsers: [] });
      toast.success('Friend request sent');

      try {
        await axiosInstance.post(`/users/send-friend-request/${friendId}`);
      } catch (error) {
        toast.error(error.response?.data?.message || 'Failed to fetch users');
      }
    },

    responseFriendRequest: async (friendId: number, decision: string) => {
      try {
        await axiosInstance.post(`/users/response-friend-request/${friendId}`, {
          decision,
        });
        await useNotificationStore.getState().getNotifications();
        await useChatStore.getState().getFriends();
      } catch (error) {
        console.log(error);
      }
    },

    fetchUsersByCriteria: async (criteria: string) => {
      try {
        if(criteria === '') return;

        const response = await axiosInstance.get(`/users/partial-users/${criteria}`);
        set({ partialUsers: response.data });
      } catch (error) {
        toast.error(error.response?.data?.message || 'Failed to fetch users');
      }
    }
  };
});
