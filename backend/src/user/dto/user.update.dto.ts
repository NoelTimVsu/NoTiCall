import { IsString, IsOptional, IsEmail } from 'class-validator';

export class UserUpdateDto {
  @IsOptional()
  @IsString()
  username: string;

  @IsOptional()
  @IsEmail()
  email: string;

  @IsOptional()
  @IsString()
  full_name?: string;

  @IsOptional()
  @IsString()
  profile_pic?: string;
}
