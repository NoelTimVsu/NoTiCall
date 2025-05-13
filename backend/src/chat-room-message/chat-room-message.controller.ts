import {
  Controller,
  Post,
  Body,
  Param,
  Get,
  ParseIntPipe,
} from '@nestjs/common';
import { ChatRoomMessageService } from './chat-room-message.service';
import { MessageDto } from 'src/message/dto';

@Controller('chat-room-messages')
export class ChatRoomMessageController {
  constructor(
    private readonly chatRoomMessageService: ChatRoomMessageService,
  ) {}

  // Get all messages from a specific chat room
  @Get(':chatRoomId')
  async getMessagesByRoomId(
    @Param('chatRoomId', ParseIntPipe) chatRoomId: number,
  ) {
    return this.chatRoomMessageService.getMessagesByRoomId(chatRoomId);
  }

  // Send a message to a specific chat room
  @Post(':chatRoomId/send/:senderId')
  async sendMessageToRoom(
    @Param('chatRoomId', ParseIntPipe) chatRoomId: number,
    @Param('senderId', ParseIntPipe) senderId: number,
    @Body() message: MessageDto,
  ) {
    return this.chatRoomMessageService.sendMessageToRoom(
      senderId,
      chatRoomId,
      message,
    );
  }
}
