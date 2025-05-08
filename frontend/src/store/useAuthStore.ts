import { create } from "zustand";
import toast from "react-hot-toast";
import {axiosInstance} from "../lib/axios.js";
import { SingInData, SingUpData } from '@/validations/formValidation.ts';
import { useSocketStore } from '@/store/useSocketStore.ts';

interface AuthState {
  authUser: { id: number; email: string; full_name: string; username: string; profile_pic: string; } | null;
  isLoggedIn: boolean;
  isLoggingIn: boolean;
  isSigningUp: boolean;
  isCheckingAuth: boolean;

  verifyAuth: () => void;
  signUp: (data: SingUpData) => void;
  signIn: (data: SingInData) => void;
  logOut: () => void;
}

export const useAuthStore = create<AuthState>((set, get) => {
  return {
    authUser: null,
    isLoggedIn: false,
    isSigningUp: false,
    isLoggingIn: false,
    isCheckingAuth: false,

    verifyAuth: async () => {
      set({isCheckingAuth: true});
      try {
        const response = await axiosInstance.get("/auth/verify");
        set({authUser: response.data, isLoggedIn: true});
        useSocketStore.getState().connectToSocket();
      } catch(error) {
        console.log("Error checking auth", error);
        set({authUser: null});
        get().logOut();
      } finally {
        set({isCheckingAuth: false});
      }
    },
    signUp: async (data: SingUpData) => {
      set({isSigningUp: true});
      try{
        await axiosInstance.post("/auth/signup", data);
        toast.success("Account created successfully");
        get().verifyAuth();
      } catch(error) {
        toast.error(error.response.data.message);
      } finally {
        set({isSigningUp: false});
      }
    },
    signIn: async (data: SingInData) => {
      set({isLoggingIn: true});
      try {
        await axiosInstance.post("/auth/singin", data);
        toast.success("Logged in successfully");
        get().verifyAuth();
      } catch (error) {
        toast.error(error.response.data.message);
      } finally {
        set({isLoggingIn: false});
      }
    },
    logOut: async () => {
      try {
        await axiosInstance.post("/auth/logout");
        set({authUser: null, isLoggedIn: false});
        toast.success("Logged out successfully");
        useSocketStore.getState().disconnectFromSocket();
      } catch (error) {
        toast.error(error.response.data.message);
      }
    },
  }
});