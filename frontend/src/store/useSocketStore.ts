import { io, Socket } from "socket.io-client";
import { create } from 'zustand';
import { useAuthStore } from '@/store/useAuthStore.ts';
import { User } from '@/store/useChatStore.ts';
import { useNotificationStore } from '@/store/useNotificationStore.ts';

const BASE_URL = import.meta.env.MODE === "development" ? "http://localhost:3000" : "/";

interface SocketState {
  onlineUsers: string[];
  socket: Socket | null;

  connectToSocket: () => void;
  disconnectFromSocket: () => void;
}

export const useSocketStore = create<SocketState>((set, get) => {
  return {
    onlineUsers: [],
    socket: null,

    connectToSocket: () => {
      const { socket } = get();
      const { authUser } = useAuthStore.getState();
      if(!authUser || socket?.connected) return;

      const clientSocket = io(BASE_URL, {
        query: {
          userId: authUser.id,
        }
      });
      clientSocket.connect();

      set({socket: clientSocket});

      // listen for users getting online
      clientSocket.on("get-online-users", (userIds: string[]) => {
        set({onlineUsers: userIds});
      });

      // listen for notifications of friend requests
      clientSocket.on("notify-of-friend-request", () => {
        // fetch new notifications
        useNotificationStore.getState().getNotifications();
      });
    },
    disconnectFromSocket: () => {
      const { socket } = get();
      if(socket?.connected) {
        socket.disconnect();
      }
    },
  }
})