import { IsNotEmpty, IsString, Matches, MaxLength, MinLength } from 'class-validator';
import { EMAIL, LETTERS } from 'src/constants/validation';

export class SendCodeDto {
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
    @Matches(EMAIL)
    email: string;
}
