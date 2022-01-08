import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './schemas/user.schema';
import { TokensPair, TokensPairSchema } from './schemas/tokens-pair.schema';
import { TokensService } from './token-pairs.service';

@Module({
    imports: [
        MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
        MongooseModule.forFeature([{ name: TokensPair.name, schema: TokensPairSchema }]),
    ],
    providers: [UsersService, TokensService],
    exports: [UsersService, TokensService],
})
export class UsersModule {}
