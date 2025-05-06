import { IsOptional, IsString } from 'class-validator';

export class MessageDto {
  @IsString()
  @IsOptional()
  content: string;

  @IsString()
  @IsOptional()
  image: string;
}
