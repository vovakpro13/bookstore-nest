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
    @HttpCode(HttpStatus.NO_CONTENT)
    logout(@Req() req: Request, @Param('userId') userId: string) {
        const accessToken = req.get('authorization').replace('Bearer', '').trim();

        return this.authService.clearTokensPair(userId, accessToken, 'accessToken');
    }

    @Public()
    @UseGuards(RtGuard)
    @Post('refresh/:userId')
    @HttpCode(HttpStatus.OK)
    async refreshTokens(@Req() req: Request, @Param('userId') userId: string) {
        const refreshToken = req.get('authorization').replace('Bearer', '').trim();

        await this.authService.clearTokensPair(userId, refreshToken, 'refreshToken');

        return await this.authService.generateTokens(userId);
    }
}
