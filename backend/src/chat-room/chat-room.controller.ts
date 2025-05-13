import {
  Controller,
  Post,
  Body,
  Param,
  Delete,
  Patch,
  Get,
  Query,
} from '@nestjs/common';
import { ChatRoomService } from './chat-room.service';
import { CreateChatRoomDto } from './dto/create-chat-room.dto';
import { CreateChatRoomMemberDto } from 'src/chat-room/dto/create-chat-room-memeber.dto';
import { UpdateChatRoomDto } from './dto/update-chat-room.dto';

@Controller('chat-room')
export class ChatRoomController {
  constructor(private readonly chatRoomService: ChatRoomService) {}

  // Create a new chat room with initial members
  @Post()
  async createRoomWithMembers(
    @Body()
    createChatRoomDto: CreateChatRoomDto & {
      members: CreateChatRoomMemberDto[];
    },
  ) {
    // Create chat room
    const chatRoom =
      await this.chatRoomService.createWithMembers(createChatRoomDto);
    return chatRoom;
  }

  // Update a chat room's details
  @Patch('update-chat-room')
  async updateChatRoom(@Body() body: UpdateChatRoomDto) {
    const { id, name, members } = body;
    return this.chatRoomService.updateChatRoom(id, name ?? '', members);
  }

  // Get a specific chat room with members and messages
  @Get(':id')
  async getRoomById(@Param('id') id: number) {
    return this.chatRoomService.findById(id);
  }

  @Get('my-rooms/:userId')
  async getMyRoomByUserId(@Param('userId') userId: number) {
    return this.chatRoomService.getMyRoomsByUserId(Number(userId));
  }

  @Delete('/delete-chat-room')
  async deleteChatRoom(
    @Query('chat_room_id') chat_room_id: number,
    @Query('user_id') user_id: number,
  ) {
    if (!chat_room_id || !user_id) {
      throw new Error('Both chat_room_id and user_id must be provided');
    }
    await this.chatRoomService.deleteChatRoom({ chat_room_id, user_id });
  }
}
