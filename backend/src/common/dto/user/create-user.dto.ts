import { IsInt, IsEmail, IsString, IsDate } from 'class-validator';

export class CreateUserDto {
    
    @IsString()
    userName: string;

    @IsString()
    email: string;

    @IsString()
    password_hash: string;

    @IsString()
    full_name: string;

    @IsString()
    profile_pic: string;

    @IsDate()
    created_at: string;

    @IsDate()
    updated_at: string;

}