import { IsNumber } from 'class-validator';

export class DeleteChatRoomDto {
  @IsNumber()
  chat_room_id: number;

  @IsNumber()
  user_id: number;
}
