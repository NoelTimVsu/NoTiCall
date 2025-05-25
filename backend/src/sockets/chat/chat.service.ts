import { Injectable } from '@nestjs/common';
import { ChatGateway } from './chat.gateway';
import { Messages, FriendShip } from '@prisma/client';

@Injectable()
export class ChatService {
  constructor(private readonly chatGateway: ChatGateway) {}

  getReceiverSocketId(receiverId: string) {
    return this.chatGateway.getReceiverSocketId(receiverId);
  }

  sendNewMessage(receiverId: string, message: Messages) {
    this.chatGateway.sendNewMessage(receiverId, message);
  }

  emitToChatRoom(chatRoomId: string, payload: any) {
    this.chatGateway.sendNewMessageToChatRoom(chatRoomId, payload);
  }

  notifyOfFriendRequest(receiverId: string, friendRequest: FriendShip) {
    this.chatGateway.notifyOfFriendRequest(receiverId, friendRequest);
  }

  notifyOfFriendRequestResponse(receiverId: string) {
    this.chatGateway.notifyOfFriendRequestResponse(receiverId);
  }
}
