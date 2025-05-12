import { create } from 'zustand';
import toast from 'react-hot-toast';
import { axiosInstance } from '../lib/axios.js';
import { useSocketStore } from '@/store/useSocketStore.ts';
import { useAuthStore } from '@/store/useAuthStore.ts';
import { Group } from '@/store/useChatRoomStore.js';

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
  sender?: User;
}

export type ChatParticipant = User | Group;

const isUser = (participant: ChatParticipant): participant is User => {
  return (participant as User).email !== undefined;
};

export interface ChatState {
  messages: Message[];
  friends: User[];
  selectedUser: ChatParticipant | undefined;
  isUsersLoading: boolean;
  isMessagesLoading: boolean;

  getFriends: () => Promise<void>;
  getMessages: (participant: ChatParticipant | undefined) => Promise<void>;
  setSelectedUser: (participant: ChatParticipant | undefined) => void;
  sendMessage: (messageData: { content: string; image?: string }) => Promise<void>;
  subscribeToMessages: () => void;
  unsubscribeFromMessages: () => void;
}

export const useChatStore = create<ChatState>((set, get) => ({
  messages: [],
  friends: [],
  selectedUser: undefined,
  isUsersLoading: false,
  isMessagesLoading: false,

  getFriends: async () => {
    set({ isUsersLoading: true });
    try {
      const response = await axiosInstance.get('/users/friends');
      set({ friends: response.data });
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to fetch friends');
      useAuthStore.getState().logOut();
    } finally {
      set({ isUsersLoading: false });
    }
  },

  getMessages: async (participant: ChatParticipant | undefined) => {
    if (!participant) return;
    set({ isMessagesLoading: true });
    try {
      const endpoint = isUser(participant)
        ? `/messages/${participant.id}`
        : `/chat-room-messages/${participant.id}`;
      const response = await axiosInstance.get(endpoint);
      set({ messages: response.data });
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to fetch messages');
      useAuthStore.getState().logOut();
    } finally {
      set({ isMessagesLoading: false });
    }
  },

  setSelectedUser: selectedUser => {
    console.log('selectedUser: ', selectedUser);
    set({ selectedUser });
  },

  sendMessage: async messageData => {
    const { selectedUser, messages } = get();
    const currentUser = useAuthStore.getState().authUser;
    if (!selectedUser || !currentUser) return;
    try {
      const endpoint = isUser(selectedUser)
        ? `/messages/send/${selectedUser.id}`
        : `/chat-room-messages/${selectedUser.id}/send/${currentUser.id}`;
      const response = await axiosInstance.post(endpoint, messageData);
      set({ messages: [...messages, response.data] });
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to send message');
    }
  },

  subscribeToMessages: () => {
    const { selectedUser } = get();
    if (!selectedUser) return;
    const socket = useSocketStore.getState().socket;
    if (!socket?.connected) return;
    const event = isUser(selectedUser) ? 'new-message' : 'chat-room:new-message';
    socket.on(event, (newMessage: Message) => {
      set({ messages: [...get().messages, newMessage] });
    });
  },

  unsubscribeFromMessages: () => {
    const socket = useSocketStore.getState().socket;
    if (!socket?.connected) return;
    socket.off('new-message');
    socket.off('chat-room:new-message');
  },
}));
