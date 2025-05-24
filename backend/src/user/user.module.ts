import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { ChatService } from 'src/sockets/chat/chat.service';
import { ChatGateway } from 'src/sockets/chat/chat.gateway';
@Module({
  providers: [UserService, PrismaService, ChatService, ChatGateway],
  controllers: [UserController],
})
export class UserModule {}
