import { Body, Controller, Get, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserDto } from '../users/dto/user.dto';
import { AuthDto } from './dto/auth.dto';
import { AuthResponse } from './types/auth-response.type';

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) {}

    @Get('/local/ping')
    ping() {
        return { ping: 'pong' };
    }

    @Post('/local/sign-up')
    signUpLocal(@Body() userData: UserDto): Promise<AuthResponse> {
        return this.authService.signUpLocal(userData);
    }

    @Post('/local/sign-in')
    signInLocal(@Body() credentials: AuthDto): Promise<AuthResponse> {
        return this.authService.signInLocal(credentials);
    }

    @Post('/logout')
    logout() {
        return this.authService.logout();
    }

    @Post('/refresh')
    refreshTokens() {
        return this.authService.refreshTokens();
    }
}
