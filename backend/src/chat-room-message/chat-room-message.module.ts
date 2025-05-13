import { Module } from '@nestjs/common';
import { ChatRoomController } from '../chat-room/chat-room.controller';
import { ChatRoomService } from '../chat-room/chat-room.service';
import { ChatRoomMessageController } from './chat-room-message.controller';
import { ChatRoomMessageService } from './chat-room-message.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { ChatService } from 'src/sockets/chat/chat.service';
import { ChatGateway } from 'src/sockets/chat/chat.gateway';

@Module({
  controllers: [ChatRoomController, ChatRoomMessageController],
  providers: [
    ChatRoomService,
    ChatRoomMessageService,
    PrismaService,
    ChatService,
    ChatGateway,
  ],
})
export class ChatRoomMessageModule {}
