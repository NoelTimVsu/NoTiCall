import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from 'src/prisma/prisma.module';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { UserController } from 'src/user/user.controller';
import { UserService } from 'src/user/user.service';
import { MessageModule } from './message/message.module';
import { ChatModule } from 'src/sockets/chat/chat.module';
import { MessageController } from 'src/message/message.controller';
import { MessageService } from 'src/message/message.service';
import { ChatService } from 'src/sockets/chat/chat.service';
import { ChatGateway } from 'src/sockets/chat/chat.gateway';
import { ChatRoomModule } from 'src/chat-room/chat-room.module';
import { ChatRoomService } from 'src/chat-room/chat-room.service';
import { ChatRoomController } from 'src/chat-room/chat-room.controller';
import { ChatRoomMessageModule } from './chat-room-message/chat-room-message.module';
import { ChatRoomMessageService } from './chat-room-message/chat-room-message.service';
import { ChatRoomMessageController } from './chat-room-message/chat-room-message.controller';
import { NotificationModule } from './notification/notification.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    PrismaModule,
    UserModule,
    AuthModule,
    MessageModule,
    ChatModule,
    ChatModule,
    ChatRoomModule,
    ChatRoomMessageModule,
    NotificationModule,
  ],
  controllers: [
    AppController,
    UserController,
    MessageController,
    ChatRoomController,
    ChatRoomMessageController,
  ],
  providers: [
    AppService,
    UserService,
    MessageService,
    ChatService,
    ChatGateway,
    ChatRoomService,
    ChatRoomMessageService,
  ],
})
export class AppModule {}
