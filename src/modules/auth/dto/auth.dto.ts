import { IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';

export class AuthDto {
    username?: string;

    email?: string;

    @IsNotEmpty()
    @IsString()
    @MinLength(8)
    @MaxLength(32)
    password: string;
}
