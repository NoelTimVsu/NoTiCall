import { create } from 'zustand';
import toast from 'react-hot-toast';
import { axiosInstance } from '../lib/axios';
import { UpdateProfileData } from '@/validations/formValidation';
import { useAuthStore } from '@/store/useAuthStore';
import { User } from '@/store/useChatStore';
interface UserState {
  isUpdatingProfile: boolean;
  allUsers: User[];
  updateProfile: (updateProfile: UpdateProfileData & { id: string }) => Promise<void>;
  fetchAllUsers: () => Promise<void>;
}

export const useUserStore = create<UserState>((set, get) => {
  return {
    isUpdatingProfile: false,
    users: [],

    updateProfile: async (updateProfile: UpdateProfileData & { id: string }) => {
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
  };
});
