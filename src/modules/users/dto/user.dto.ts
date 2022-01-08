import { IsNotEmpty, IsString, Matches, MaxLength, MinLength } from 'class-validator';
import { EMAIL, LETTERS, PASSWORD, USERNAME } from '../../../constants/validation';

export class UserDto {
    @IsNotEmpty()
    @IsString()
    @MinLength(2)
    @MaxLength(50)
    @Matches(LETTERS)
    firstName: string;

    @IsNotEmpty()
    @IsString()
    @MinLength(2)
    @MaxLength(50)
    @Matches(LETTERS)
    lastName: string;

    @IsNotEmpty()
    @IsString()
    @MinLength(4)
    @MaxLength(15)
    @Matches(USERNAME)
    username: string;

    @IsNotEmpty()
    @Matches(EMAIL)
    email: string;

    @IsNotEmpty()
    @IsString()
    @MinLength(8)
    @MaxLength(32)
    @Matches(PASSWORD)
    password: string;
}
