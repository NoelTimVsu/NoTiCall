import { Module } from '@nestjs/common';
import { ChatService } from 'src/sockets/chat/chat.service';
import { ChatGateway } from 'src/sockets/chat/chat.gateway';

@Module({
  providers: [ChatGateway, ChatService],
  exports: [ChatService],
})
export class ChatModule {}
