import { IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';

export class AuthDto {
    @IsNotEmpty()
    @IsString()
    @MinLength(4)
    @MaxLength(15)
    username?: string;

    @IsNotEmpty()
    email?: string;

    @IsNotEmpty()
    @IsString()
    @MinLength(8)
    @MaxLength(32)
    password: string;
}
