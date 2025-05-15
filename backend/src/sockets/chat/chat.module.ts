import { Module, forwardRef } from '@nestjs/common';
import { ChatService } from './chat.service';
import { ChatGateway } from './chat.gateway';
import { ChatRoomModule } from 'src/chat-room/chat-room.module';

@Module({
  imports: [forwardRef(() => ChatRoomModule)],
  providers: [ChatGateway, ChatService],
  exports: [ChatService],
})
export class ChatModule {}
