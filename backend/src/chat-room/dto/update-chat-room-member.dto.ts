// create-chat-room-member.dto.ts
import { IsNumber, IsOptional, IsEnum } from 'class-validator';
import { Role } from '@prisma/client';

export class UpdateChatRoomMemberDto {
  @IsOptional()
  @IsNumber()
  chat_room_id: number;

  @IsOptional()
  @IsNumber()
  user_id: number;

  @IsOptional()
  @IsEnum(Role)
  role?: Role;
}
