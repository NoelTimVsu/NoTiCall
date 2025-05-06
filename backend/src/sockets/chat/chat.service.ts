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
}
