import { IsEmail, IsString, IsOptional, IsDate } from "class-validator";

export class UpdateUserDto {
    @IsOptional()
    @IsString()
    userName?: string;

    @IsOptional()
    @IsString()
    email?: string;

    @IsOptional()
    @IsString()
    password_hash?: string;

    @IsOptional()
    @IsString()
    full_name?: string;

    @IsOptional()
    @IsString()
    profile_pic?: string;

    @IsOptional()
    @IsDate()
    created_at?: string;

    @IsOptional()
    @IsDate()
    updated_at?: string;

}