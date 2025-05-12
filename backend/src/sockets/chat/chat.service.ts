import { Injectable } from '@nestjs/common';
import { ChatGateway } from './chat.gateway';
import { Messages } from '@prisma/client';

@Injectable()
export class ChatService {
  constructor(private readonly chatGateway: ChatGateway) {}

  getReceiverSocketId(receiverId: string) {
    return this.chatGateway.getReceiverSocketId(receiverId);
  }

  sendNewMessage(receiverId: string, message: Messages) {
    this.chatGateway.sendNewMessage(receiverId, message);
  }

  emitToUser(userId: number, event: string, payload: any) {
    const socket = this.chatGateway.getSocketByUserId(userId);
    console.log('sockerket: ', socket);
    if (socket) {
      socket.emit(event, payload);
    } else {
      console.warn(`Socket not found for userId ${userId}`);
    }
  }
}
