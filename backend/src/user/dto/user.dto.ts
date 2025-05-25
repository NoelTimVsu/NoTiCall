import { IsString, IsOptional, IsEmail, IsNumber } from 'class-validator';

export class UserDto {
  @IsOptional()
  @IsNumber()
  id: number;

  @IsOptional()
  @IsString()
  username: string;

  @IsOptional()
  @IsEmail()
  email: string;

  @IsString()
  password_hash: string;

  @IsOptional()
  @IsString()
  full_name?: string;

  @IsOptional()
  @IsString()
  profile_pic?: string;

  @IsOptional()
  created_at?: Date;

  @IsOptional()
  updated_at?: Date;
}
