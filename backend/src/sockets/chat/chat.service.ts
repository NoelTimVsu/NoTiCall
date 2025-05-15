import { Injectable } from '@nestjs/common';
import { ChatGateway } from './chat.gateway';
import { Messages } from '@prisma/client';
import type { CreateChatRoomDto } from 'src/chat-room/dto/create-chat-room.dto';
import type { CreateChatRoomMemberDto } from 'src/chat-room/dto/create-chat-room-member.dto';
import type { GroupDto } from 'src/chat-room/dto/group.dto';

type SubcribeGroupPayLoad = CreateChatRoomDto & {
  members: CreateChatRoomMemberDto[];
};
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

  addNewGroup(newGroup: SubcribeGroupPayLoad) {
    this.chatGateway.emitNewGroup(newGroup);
  }

  updateGroup(group: GroupDto) {
    this.chatGateway.updateGroup(group);
  }

  deleteGroup(groupId: number, userIds: number[]) {
    this.chatGateway.deleteGroup(groupId, userIds);
  }
}
