import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersModule } from '../users/users.module';
import { AtStrategy } from './strategies/at.strategy';
import { RtStrategy } from './strategies/rt.strategy';
import { JwtModule } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { TokensPair, TokensPairSchema } from './schemas/tokens-pair.schema';
import { TokensService } from 'src/modules/auth/token-pairs.service';
import { MailModule } from 'src/modules/mail/mail.module';
import { Code, CodeSchema } from './schemas/code.schema';

@Module({
    imports: [
        UsersModule,
        MailModule,
        JwtModule.register({}),
        MongooseModule.forFeature([{ name: TokensPair.name, schema: TokensPairSchema }]),
        MongooseModule.forFeature([{ name: Code.name, schema: CodeSchema }]),
    ],
    providers: [AuthService, AtStrategy, RtStrategy, TokensService],
    controllers: [AuthController],
    exports: [TokensService],
})
export class AuthModule {}
