import { IsNumber, IsOptional, IsEnum, IsString } from 'class-validator';
import { Role } from '@prisma/client';

export class CreateChatRoomDto {
  @IsOptional()
  @IsString()
  name: string;

  @IsOptional()
  @IsNumber()
  created_by: number;
}

export class CreateChatRoomMemberDto {
  @IsNumber()
  chat_room_id: number;

  @IsNumber()
  user_id: number;

  @IsOptional()
  @IsEnum(Role)
  role?: Role;
}

export type CreateChatRoomWithMembersDto = CreateChatRoomDto & {
  members: CreateChatRoomMemberDto[];
};
