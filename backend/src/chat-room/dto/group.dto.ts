import {
  IsNumber,
  IsString,
  IsArray,
  IsEnum,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { Role } from '@prisma/client';

export class SimpleUserDto {
  @IsNumber()
  id: number;

  @IsString()
  username: string;

  @IsString()
  email: string;

  @IsString()
  full_name: string;

  @IsString()
  profile_pic: string | null;

  @IsString()
  created_at: string;
}

export class GroupMemberDto {
  @IsNumber()
  chat_room_id: number;

  @IsEnum(Role)
  role: Role;

  @ValidateNested()
  @Type(() => SimpleUserDto)
  user: SimpleUserDto;
}

export class GroupDto {
  @IsNumber()
  id: number;

  @IsString()
  name: string;

  @IsNumber()
  update_by: number;

  @IsNumber()
  created_by: number;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => GroupMemberDto)
  members: GroupMemberDto[];
}
