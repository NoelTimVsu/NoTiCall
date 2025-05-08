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
  ],
  controllers: [AppController, UserController, MessageController],
  providers: [
    AppService,
    UserService,
    MessageService,
    ChatService,
    ChatGateway,
  ],
})
export class AppModule {}
