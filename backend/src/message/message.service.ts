import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { MessageDto } from 'src/message/dto';
import { ChatService } from 'src/sockets/chat/chat.service';
import { MediaUploadService } from 'src/media-upload/media-upload.service';

@Injectable()
export class MessageService {
  private readonly logger = new Logger(MessageService.name);

  constructor(
    private prisma: PrismaService,
    private chatService: ChatService,
    private mediaUploadService: MediaUploadService,
  ) {}

  async getMessagesWithFriend(senderId: number, receiverId: number) {
    try {
      return await this.prisma.messages.findMany({
        where: {
          OR: [
            {
              sender_id: senderId,
              receiver_id: receiverId,
            },
            {
              sender_id: receiverId,
              receiver_id: senderId,
            },
          ],
        },
        orderBy: {
          created_at: 'asc', // or 'desc' for latest first
        },
      });
    } catch (error) {
      this.logger.error('Error getting messages', error);
      throw new HttpException(
        {
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          error: 'There was an error getting messages',
          message: 'There was an error getting messages',
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
        {
          cause: error,
        },
      );
    }
  }

  async sendMessageToFriend(
    senderId: number,
    receiverId: number,
    message: MessageDto,
  ) {
    try {
      let imageUrl: string | undefined = undefined;
      if (message.image) {
        const folderPath = `chat-images/userId-${senderId}`;
        imageUrl = await this.mediaUploadService.uploadImage(
          message.image,
          folderPath,
        );
      }

      const newMessage = await this.prisma.messages.create({
        data: {
          sender_id: senderId,
          receiver_id: receiverId,
          content: message.content,
          image: imageUrl,
        },
      });

      // send this message via socket
      const receiverSocketId = this.chatService.getReceiverSocketId(
        String(receiverId),
      );

      if (receiverSocketId !== undefined) {
        this.chatService.sendNewMessage(receiverSocketId, newMessage);
      }

      // return the message via http response
      return newMessage;
    } catch (error) {
      this.logger.error('Error getting messages', error);
      throw new HttpException(
        {
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          error: 'There was an error sending message',
          message: 'There was an error sending message',
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
        {
          cause: error,
        },
      );
    }
  }
}
