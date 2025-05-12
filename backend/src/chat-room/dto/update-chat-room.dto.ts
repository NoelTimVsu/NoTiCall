import { Type } from 'class-transformer';
import {
  IsString,
  IsOptional,
  IsNumber,
  IsArray,
  ValidateNested,
} from 'class-validator';
import { UpdateChatRoomMemberDto } from 'src/chat-room/dto/update-chat-room-member.dto';

export class UpdateChatRoomDto {
  @IsNumber()
  id: number;

  @IsOptional()
  @IsString()
  name?: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => UpdateChatRoomMemberDto)
  members: UpdateChatRoomMemberDto[];
}
