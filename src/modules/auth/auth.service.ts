import { ForbiddenException, HttpStatus, Injectable, UnauthorizedException } from '@nestjs/common';
import { UserDto } from '../users/dto/user.dto';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcrypt';
import { Tokens } from './types/tokens.type';
import { JwtService } from '@nestjs/jwt';
import { TokensService } from '../users/token-pairs.service';
import { AuthDto } from './dto/auth.dto';
import { AuthResponse } from './types/auth-response.type';

@Injectable()
export class AuthService {
    constructor(
        private userService: UsersService,
        private tokensService: TokensService,
        private jwtService: JwtService
    ) {}

    async signUpLocal(userData: UserDto): Promise<AuthResponse> {
        const { email, username } = userData;

        const isUsernameExist = await this.userService.checkUserUnicity({ username });

        if (isUsernameExist) {
            throw new ForbiddenException(`User with username \'${username}\' already exist`);
        }

        const isEmailExist = await this.userService.checkUserUnicity({ email });

        if (isEmailExist) {
            throw new ForbiddenException(`User with email \'${email}\' already exist`);
        }

        userData.password = await this.hashData(userData.password);

        const { id: userId } = await this.userService.create(userData);

        const tokens = await this.generateTokens(userId);

        return { ...tokens, userId };
    }

    async signInLocal({ username, email, password }: AuthDto): Promise<AuthResponse> {
        let foundUser;

        if (username) {
            foundUser = await this.userService.checkUserUnicity({ username });
        }

        if (email) {
            foundUser = await this.userService.checkUserUnicity({ email });
        }

        if (!foundUser) throw new ForbiddenException('Incorrect password or login value');

        const passwordMatches = await bcrypt.compare(password, foundUser.password);

        if (!passwordMatches) throw new ForbiddenException('Incorrect password or login value');

        const { id: userId } = foundUser;

        const tokens = await this.generateTokens(userId);

        return { ...tokens, userId };
    }

    async clearTokensPair(
        userId: string,
        userToken: string,
        tokenKey: 'accessToken' | 'refreshToken'
    ) {
        const tokens = await this.tokensService.getTokens(userId);

        if (!tokens || !tokens.accessToken || !tokens.refreshToken) {
            throw new UnauthorizedException('Access Denied');
        }

        const atMatches = await bcrypt.compare(userToken, tokens[tokenKey]);

        if (!atMatches) {
            throw new UnauthorizedException('Tokens don`t matches.');
        }

        await this.tokensService.removeTokens(userId);
        return HttpStatus.NO_CONTENT;
    }

    async generateTokens(userId): Promise<Tokens> {
        const access_token = await this.jwtService.signAsync(
            {},
            {
                expiresIn: 60 * 15,
                secret: process.env.ACCESS_TOKEN_SECRET,
            }
        );

        const refresh_token = await this.jwtService.signAsync(
            {},
            {
                expiresIn: 60 * 60 * 24 * 7,
                secret: process.env.REFRESH_TOKEN_SECRET,
            }
        );

        const tokens = { access_token, refresh_token };

        await this.tokensService.updateTokensPair(userId, tokens);

        return tokens;
    }

    async hashData(data: string) {
        return await bcrypt.hash(data, 10);
    }
}
