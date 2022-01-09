import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CheckCodeDto {
    @IsNotEmpty()
    @IsString()
    codeId: string;

    @IsNotEmpty()
    @IsNumber()
    code: number;
}
