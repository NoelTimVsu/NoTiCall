import { create } from 'zustand';
import toast from 'react-hot-toast';
import { axiosInstance } from '@/lib/axios';
import { User } from './useChatStore';
import { useAuthStore } from './useAuthStore';
import { useSocketStore } from './useSocketStore';
import { Group } from 'lucide-react';

export interface Group {
  id: number;
  name: string;
  update_by: number;
  created_by: number;
  members: {
    user: User;
    chat_room_id: number;
    role: 'USER' | 'ADMIN';
  }[];
}

interface GroupChatState {
  groups: Group[];
  isLoading: boolean;

  getGroups: () => Promise<void>;
  createGroupChat: (payload: {
    name: string;
    created_by: number;
    members: { user_id: number; role: string }[];
  }) => Promise<void>;
  updateGroupChat: (group: Group) => Promise<void>;
  deleteGroupChat: (payload: { chat_room_id: number; user_id: number }) => Promise<void>;
  subcribeToGroupChange: () => void;
  unsubcribeToGroupChange: () => void;
}

export const useChatRoomStore = create<GroupChatState>(set => ({
  groups: [],
  isLoading: false,

  getGroups: async () => {
    const authUser = useAuthStore.getState().authUser;
    if (!authUser) {
      toast.error('User not authenticated');
      return;
    }
    set({ isLoading: true });
    try {
      const response = await axiosInstance.get(`/chat-room/my-rooms/${authUser.id}`);
      set({ groups: response.data });
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to load groups');
    } finally {
      set({ isLoading: false });
    }
  },

  createGroupChat: async payload => {
    try {
      const response = await axiosInstance.post('/chat-room', payload);
      const newGroup = response.data;
      set(state => ({
        groups: [...state.groups, newGroup],
      }));
      toast.success('Group chat created!');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Group creation failed');
      if (error.response?.status === 401) {
        useAuthStore.getState().logOut();
      }
    }
  },

  updateGroupChat: async group => {
    try {
      const response = await axiosInstance.patch('/chat-room/update-chat-room', group);

      const updatedGroup = {
        ...response.data,
        created_at: new Date(),
        created_by: useAuthStore.getState().authUser?.id,
      };
      set(state => {
        const updatedGroups = state.groups.map(group =>
          group.id === updatedGroup.id ? updatedGroup : group,
        );
        return { groups: updatedGroups };
      });
      toast.success('Group chat updated!');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Group update failed');
      if (error.response?.status === 401) {
        useAuthStore.getState().logOut();
      }
    }
  },

  deleteGroupChat: async payload => {
    try {
      const { chat_room_id, user_id } = payload;
      await axiosInstance.delete(
        `/chat-room/delete-chat-room?chat_room_id=${chat_room_id}&user_id=${user_id}`,
      );
      set(state => ({
        groups: state.groups.filter(group => group.id !== chat_room_id),
      }));
      toast.success('Group chat deleted!');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Group deletion failed');
      if (error.response?.status === 401) {
        useAuthStore.getState().logOut();
      }
    }
  },

  subcribeToGroupChange: () => {
    const socket = useSocketStore.getState().socket;
    if (!socket?.connected) return;

    // Listen for 'group:created' event
    socket.on('group:created', (newGroup: Group) => {
      console.log('newGroup: ', newGroup);
      set(state => {
        const exists = state.groups.some(group => group.id === newGroup.id);
        if (exists) {
          return state;
        }
        return { groups: [...state.groups, newGroup] };
      });
      toast.success(`New group "${newGroup.name}" created!`);
    });

    // Listen for 'group:updated' event
    socket.on('group:updated', (updatedGroup: Group) => {
      set(state => {
        const updatedGroups = state.groups.map(group =>
          group.id === updatedGroup.id ? { ...group, ...updatedGroup } : group,
        );
        return { groups: updatedGroups };
      });
      toast.success(`Group "${updatedGroup.name}" updated!`);
    });

    //Listen for 'group:delete' event
    socket.on('group:delete', (groupId: number) => {
      console.log('Group delete:', groupId);
      set(state => {
        const updatedGroups = state.groups.filter(group => Number(group.id) !== Number(groupId));
        toast.success(`Group "${groupId}" deleted!`);
        return { groups: updatedGroups };
      });
    });
  },

  unsubcribeToGroupChange: () => {
    const socket = useSocketStore.getState().socket;
    if (!socket?.connected) return;
    socket.off('group:created');
    socket.off('group:updated');
    socket.off('group:delete');
  },
}));
