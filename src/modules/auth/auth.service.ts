import {
    ForbiddenException,
    HttpStatus,
    Injectable,
    NotFoundException,
    UnauthorizedException,
} from '@nestjs/common';
import { UserDto } from '../users/dto/user.dto';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcrypt';
import { Tokens, TokensEnum } from './types/tokens.type';
import { JwtService } from '@nestjs/jwt';
import { TokensService } from './token-pairs.service';
import { AuthDto } from './dto/auth.dto';
import { AuthResponse } from './types/auth-response.type';
import { UserUniqueDto } from './dto/user-unique.dto';
import { UserUniqueResponse } from './types/user-unique-response.type';
import { SendCodeResponseType } from './types/send-code-response.type';
import { MailService } from '../mail/mail.service';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { SendCodeDto } from './dto/send-code.dto';
import { Code, CodeDocument } from './schemas/code.schema';
import { CheckCodeDto } from './dto/check-code.dto';

@Injectable()
export class AuthService {
    constructor(
        private userService: UsersService,
        private tokensService: TokensService,
        private mailService: MailService,
        private jwtService: JwtService,
        @InjectModel(Code.name) private codeModel: Model<CodeDocument>
    ) {}

    async checkUserUnique(userData: UserUniqueDto): Promise<UserUniqueResponse> {
        const { email, username } = userData;

        if (!email && !username) throw new NotFoundException();

        const res: UserUniqueResponse = {};

        if (email) {
            res.emailExist = !!(await this.userService.checkUserUnicity({ email }));
        }

        if (username) {
            res.usernameExist = !!(await this.userService.checkUserUnicity({ username }));
        }

        return res;
    }

    async sendCode(sendCodeDto: SendCodeDto): Promise<SendCodeResponseType> {
        const code = Math.floor(100000 + Math.random() * 900000);

        const preparedCode = new this.codeModel({ code });
        const createdCode = await preparedCode.save();

        await this.mailService.sendCode(sendCodeDto, code);

        return { codeId: createdCode.id };
    }

    async checkCode({ codeId, code }: CheckCodeDto): Promise<boolean> {
        const foundCode = await this.codeModel.findById(codeId);

        if (!foundCode) throw new NotFoundException('Code doesn`t exist.');

        if (foundCode.code !== code) throw new ForbiddenException('Codes not matches.');

        await this.codeModel.findByIdAndRemove(codeId);

        return true;
    }

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

    async clearTokensPair(userId: string, userToken: string, tokenKey: TokensEnum) {
        const atMatches = await this.tokensService.compareTokens(userId, userToken, tokenKey);

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
