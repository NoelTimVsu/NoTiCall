import { create } from "zustand";
import toast from "react-hot-toast";
import {axiosInstance} from "../lib/axios.js";
import { UpdateProfileData } from '@/validations/formValidation.ts';
import { useAuthStore } from '@/store/useAuthStore.ts';

interface UserState {
  isUpdatingProfile: boolean;

  updateProfile: (updateProfile: UpdateProfileData & { id: string; }) => void;
}

export const useUserStore = create<UserState>((set, get) => {
  return {
    isUpdatingProfile: false,

    updateProfile: async (updateProfile: UpdateProfileData & { id: string; }) => {
      set({isUpdatingProfile: true});
      try {
        const { id, ...payload } = updateProfile;
        await axiosInstance.put(`/users/${updateProfile.id}`, payload);
        useAuthStore.getState().checkAuth();
        toast.success("Profile updated successfully");
      } catch(error) {
        toast.error(error.response.data.message);
      } finally {
        set({isUpdatingProfile: false});
      }
    }
  }
});