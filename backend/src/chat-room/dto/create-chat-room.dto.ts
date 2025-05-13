import { IsString, IsOptional, IsNumber } from 'class-validator';
export class CreateChatRoomDto {
  @IsOptional()
  @IsString()
  name: string;

  @IsOptional()
  @IsNumber()
  created_by: number;
}
