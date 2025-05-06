import {
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Messages } from '@prisma/client';
import { Injectable } from '@nestjs/common';

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

  constructor() {
    this.connectedUsers = new Map<string, string>();
  }

  handleConnection(client: Socket) {
    const connectedUser = client.handshake.query.userId as unknown as string;
    if (connectedUser && connectedUser !== '') {
      this.connectedUsers.set(connectedUser, client.id);

      this.server.emit(
        'get-online-users',
        Array.from(this.connectedUsers.keys()),
      );
    }
  }

  handleDisconnect(client: Socket) {
    const connectedUser = client.handshake.query.userId as unknown as string;

    this.connectedUsers.delete(connectedUser);
    this.server.emit(
      'get-online-users',
      Array.from(this.connectedUsers.keys()),
    );
  }

  // We will keep this here because
  // this is how we will create our own server for video calls
  @SubscribeMessage('send-message')
  handleMessage(client: Socket, payload: { sender: string; message: string }) {
    console.log('Received message:', payload);

    // Broadcast to all clients
    this.server.emit('receive_message', payload);
  }

  sendNewMessage(receiverId: string, message: Messages) {
    this.server.to(receiverId).emit('new-message', message);
  }

  getReceiverSocketId(receiverId: string) {
    return this.connectedUsers.get(receiverId);
  }
}
