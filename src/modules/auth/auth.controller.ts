import {
    Body,
    Controller,
    HttpCode,
    HttpStatus,
    Param,
    Post,
    Req,
    UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserDto } from '../users/dto/user.dto';
import { AuthDto } from './dto/auth.dto';
import { AuthResponse } from './types/auth-response.type';
import { Request } from 'express';
import { RtGuard } from 'src/common/guards';
import { Public } from 'src/common/decorators/public.decorator';
import { OnlyOwner } from 'src/common/decorators/only-owner.decorator';
import { TokensEnum } from './types/tokens.type';
import { UserUniqueDto } from 'src/modules/auth/dto/user-unique.dto';
import { UserUniqueResponse } from './types/user-unique-response.type';
import { SendCodeResponseType } from './types/send-code-response.type';
import { SendCodeDto } from './dto/send-code.dto';
import { CheckCodeDto } from './dto/check-code.dto';

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) {}

    @Public()
    @Post('local/sign-up')
    @HttpCode(HttpStatus.CREATED)
    signUpLocal(@Body() userData: UserDto): Promise<AuthResponse> {
        return this.authService.signUpLocal(userData);
    }

    @Public()
    @Post('local/sign-in')
    @HttpCode(HttpStatus.OK)
    signInLocal(@Body() credentials: AuthDto): Promise<AuthResponse> {
        return this.authService.signInLocal(credentials);
    }

    @Post('logout/:userId')
    @OnlyOwner()
    @HttpCode(HttpStatus.NO_CONTENT)
    logout(@Req() req: Request, @Param('userId') userId: string) {
        const accessToken = req.get('authorization').replace('Bearer', '').trim();

        return this.authService.clearTokensPair(userId, accessToken, TokensEnum.accessToken);
    }

    @Public()
    @Post('check-user-unique')
    @HttpCode(HttpStatus.OK)
    async checkUserUnique(@Body() userData: UserUniqueDto): Promise<UserUniqueResponse> {
        return this.authService.checkUserUnique(userData);
    }

    @Public()
    @Post('send-code')
    @HttpCode(HttpStatus.OK)
    async sendCode(@Body() sendCodeDto: SendCodeDto): Promise<SendCodeResponseType> {
        return this.authService.sendCode(sendCodeDto);
    }

    @Public()
    @Post('check-code')
    @HttpCode(HttpStatus.OK)
    async checkCode(@Body() checkCodeDto: CheckCodeDto): Promise<{ isCodeExist: boolean }> {
        const isCodeExist = await this.authService.checkCode(checkCodeDto);

        return { isCodeExist };
    }

    @Public()
    @UseGuards(RtGuard)
    @Post('refresh/:userId')
    @HttpCode(HttpStatus.OK)
    async refreshTokens(@Req() req: Request, @Param('userId') userId: string) {
        const refreshToken = req.get('authorization').replace('Bearer', '').trim();

        await this.authService.clearTokensPair(userId, refreshToken, TokensEnum.refreshToken);

        const tokens = await this.authService.generateTokens(userId);
        return { ...tokens, userId };
    }
}
