import { Injectable } from '@nestjs/common';
import { ChatGateway } from './chat.gateway';
import { Messages, FriendShip } from '@prisma/client';
import type { GroupDto } from 'src/chat-room/dto/group.dto';
import type { CreateChatRoomWithMembersDto } from 'src/chat-room/dto/create-chat-room-members.dto';

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

  addNewGroup(newGroup: CreateChatRoomWithMembersDto) {
    this.chatGateway.emitNewGroup(newGroup);
  }

  updateGroup(group: GroupDto) {
    this.chatGateway.updateGroup(group);
  }

  deleteGroup(groupId: number, userIds: number[]) {
    this.chatGateway.deleteGroup(groupId, userIds);
  }

  notifyOfFriendRequestResponse(receiverId: string) {
    this.chatGateway.notifyOfFriendRequestResponse(receiverId);
  }
}
