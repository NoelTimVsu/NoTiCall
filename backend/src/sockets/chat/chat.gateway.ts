import {
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { FriendShip, Messages } from '@prisma/client';
import { Injectable, Logger } from '@nestjs/common';
import { GroupDto } from 'src/chat-room/dto/group.dto';
import type { CreateChatRoomWithMembersDto } from 'src/chat-room/dto/create-chat-room-members.dto';

@Injectable()
@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;
  connectedUsers: Map<string, string>;
  private userSockets: Map<number, Socket>;

  private readonly logger = new Logger(ChatGateway.name);

  constructor() {
    this.connectedUsers = new Map<string, string>();
    this.userSockets = new Map<number, Socket>();
  }

  getSocketByUserId(userId: number): Socket | undefined {
    return this.userSockets.get(userId);
  }

  handleConnection(client: Socket) {
    const connectedUser = client.handshake.query.userId as unknown as string;
    if (connectedUser && connectedUser !== '') {
      this.connectedUsers.set(connectedUser, client.id);
      this.userSockets.set(Number(connectedUser), client);

      this.server.emit(
        'get-online-users',
        Array.from(this.connectedUsers.keys()),
      );
    }
  }

  handleDisconnect(client: Socket) {
    const connectedUser = client.handshake.query.userId as unknown as string;

    this.connectedUsers.delete(connectedUser);
    this.userSockets.delete(Number(connectedUser));

    this.server.emit(
      'get-online-users',
      Array.from(this.connectedUsers.keys()),
    );
  }

  // We will keep this here because
  // this is how we will create our own server for video calls
  @SubscribeMessage('send-message')
  handleMessage(client: Socket, payload: { sender: string; message: string }) {
    this.logger.log('Received message:', payload);

    // Broadcast to all clients
    this.server.emit('receive_message', payload);
  }

  @SubscribeMessage('join-room')
  handleJoinRoom(client: Socket, roomId: string) {
    void client.join(`chat-room-${roomId}`);
    this.logger.log(`joining-room: ${client.id} joined chat-room-${roomId}`);
  }

  sendNewMessage(receiverId: string, message: Messages) {
    this.server.to(receiverId).emit('new-message', message);
  }

  getReceiverSocketId(receiverId: string) {
    return this.connectedUsers.get(receiverId);
  }

  sendNewMessageToChatRoom(chatRoomId: string, message: Messages) {
    this.server
      .to(`chat-room-${chatRoomId}`)
      .emit('chat-room:new-message', message);
  }

  notifyOfFriendRequest(receiverId: string, friendRequest: FriendShip) {
    this.server.to(receiverId).emit('notify-of-friend-request', friendRequest);
  }

  emitNewGroup(group: CreateChatRoomWithMembersDto) {
    group.members.forEach((member) => {
      const userId = member.user_id;
      if (Number(userId) !== Number(group.created_by)) {
        const socketId = this.getReceiverSocketId(userId.toString());
        if (socketId) {
          this.server.to(socketId).emit('group:created', group);
        }
      }
    });
  }

  updateGroup(group: GroupDto) {
    group.members.forEach((member) => {
      const userId = member.user.id;
      if (Number(userId) !== Number(group.update_by)) {
        const socketId = this.getReceiverSocketId(userId.toString());
        if (socketId) {
          this.server.to(socketId).emit('group:updated', group);
        }
      }
    });
  }

  deleteGroup(groupId: number, userRemoveIds: number[]) {
    if (userRemoveIds.length === 1) {
      const socketId = this.getReceiverSocketId(userRemoveIds[0].toString());
      if (socketId) {
        this.server.to(socketId).emit('group:delete', groupId.toString());
      }
    } else {
      userRemoveIds.forEach((userId) => {
        const socketId = this.getReceiverSocketId(userId.toString());
        if (socketId) {
          this.server.to(socketId).emit('group:delete', groupId.toString());
        }
      });
    }
  }

  notifyOfFriendRequestResponse(receiverId: string) {
    this.server.to(receiverId).emit('notify-of-friend-request-response');
  }
}
