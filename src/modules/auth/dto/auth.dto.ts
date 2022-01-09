import { IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';
import { UserUniqueDto } from './user-unique.dto';

export class AuthDto extends UserUniqueDto {
    @IsNotEmpty()
    @IsString()
    @MinLength(8)
    @MaxLength(32)
    password: string;
}
