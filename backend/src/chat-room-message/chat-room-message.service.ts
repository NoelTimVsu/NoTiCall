import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { ChatService } from 'src/sockets/chat/chat.service';
import { MessageDto } from 'src/message/dto';

@Injectable()
export class ChatRoomMessageService {
  constructor(
    private prisma: PrismaService,
    private chatService: ChatService,
  ) {}

  // Get all messages in a chat room
  async getMessagesByRoomId(chatRoomId: number) {
    try {
      return await this.prisma.chatRoomMessages.findMany({
        where: {
          chat_room_id: chatRoomId,
        },
        orderBy: {
          created_at: 'asc',
        },
        include: {
          sender: {
            select: {
              id: true,
              username: true,
              full_name: true,
              profile_pic: true,
            },
          },
        },
      });
    } catch (error) {
      console.error('Error getting chat room messages', error);
      throw new HttpException(
        {
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          error: 'There was an error getting chat room messages',
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  // Send a message to each member in the chat room
  async sendMessageToRoom(
    senderId: number,
    chatRoomId: number,
    message: MessageDto,
  ) {
    try {
      // Save the message to the database
      const newMessage = await this.prisma.chatRoomMessages.create({
        data: {
          sender_id: senderId,
          chat_room_id: chatRoomId,
          content: message.content,
          image: message.image,
        },
        include: {
          sender: {
            select: {
              id: true,
              username: true,
              full_name: true,
              profile_pic: true,
            },
          },
        },
      });

      // Get all members of the chat room
      const roomMembers = await this.prisma.chatRoomMember.findMany({
        where: {
          chat_room_id: chatRoomId,
        },
        select: {
          user_id: true,
        },
      });

      // Send message to each member except the sender
      for (const member of roomMembers) {
        if (member.user_id !== senderId) {
          this.chatService.emitToUser(
            member.user_id,
            'chat-room:new-message',
            newMessage,
          );
        }
      }

      return newMessage;
    } catch (error) {
      console.error('Error sending chat room message', error);
      throw new HttpException(
        {
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          error: 'There was an error sending the message',
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
