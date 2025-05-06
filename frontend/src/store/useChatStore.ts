import { create } from "zustand";
import toast from "react-hot-toast";
import { axiosInstance } from "../lib/axios.js";
import { useSocketStore } from '@/store/useSocketStore.ts';
import { useAuthStore } from '@/store/useAuthStore.ts';

export interface User {
  id: number;
  username: string;
  email: string;
  full_name: string;
  profile_pic: string;
  created_at: string;
}

export interface Message {
  id: number;
  content: string;
  sender_id: number;
  image: string;
  created_at: string;
}

export interface ChatState {
  messages: Message[];
  friends: User[];
  selectedUser: User | undefined;
  isUsersLoading: boolean;
  isMessagesLoading: boolean;

  getFriends: () => Promise<void>;
  getMessages: (userId: number | undefined) => Promise<void>;
  setSelectedUser: (user: User | undefined) => void;
  sendMessage: (messageData: { content: string }) => Promise<void>;
  subscribeToMessages: () => void;
  unsubscribeFromMessages: () => void;
}

export const useChatStore = create<ChatState>((set, get) => {
  return {
    messages: [],
    friends: [],
    selectedUser: undefined,
    isUsersLoading: false,
    isMessagesLoading: false,

    getFriends: async () => {
      set({isUsersLoading: true});
      try {
        const response = await axiosInstance.get("/users/friends");
        set({friends: response.data});
      } catch (error) {
        toast.error(error.response.data.message);
        useAuthStore.getState().logOut();
      } finally {
        set({isUsersLoading: false});
      }
    },
    getMessages: async (receiverId: number | undefined) => {
      set({isMessagesLoading: true});
      try {
        const response = await axiosInstance.get(`/messages/${receiverId}`);
        set({messages: response.data});
      } catch (error) {
        toast.error(error.response.data.message);
        useAuthStore.getState().logOut();
      } finally {
        set({isMessagesLoading: false});
      }
    },
    setSelectedUser: (selectedUser: User | undefined) => set({selectedUser}),
    sendMessage: async (messageData: { content: string }) => {
      const { selectedUser, messages } = get();
      try {
        const response = await axiosInstance.post(`/messages/send/${selectedUser?.id}`, messageData);
        set({messages: [...messages, response.data]});
      } catch (error) {
        toast.error(error.response.data.message);
      }
      console.log(messageData);
    },
    subscribeToMessages: () => {
      const { selectedUser } = get();
      if (!selectedUser) return;

      const socket = useSocketStore.getState().socket;
      if(!socket?.connected) return;

      socket.on('new-message', (newMessage: Message) => {
        const isMessageSentFromSelectedUser = newMessage.sender_id === selectedUser.id;
        if(!isMessageSentFromSelectedUser) return;
        set({messages: [...get().messages, newMessage]});
      });
    },
    unsubscribeFromMessages: () => {
      const socket = useSocketStore.getState().socket;
      if(!socket?.connected) return;

      socket.off('new-message');
    }
  }
});