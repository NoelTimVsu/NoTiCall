import { Module } from '@nestjs/common';
import { MessageService } from './message.service';
import { MessageController } from './message.controller';
import { ChatModule } from 'src/sockets/chat/chat.module';

@Module({
  imports: [ChatModule],
  providers: [MessageService],
  controllers: [MessageController],
})
export class MessageModule {}
