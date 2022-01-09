import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, UpdateWriteOpResult } from 'mongoose';
import { Tokens, TokensEnum } from './types/tokens.type';
import { TokensPair, TokensPairDocument } from './schemas/tokens-pair.schema';
import * as bcrypt from 'bcrypt';

@Injectable()
export class TokensService {
    constructor(@InjectModel(TokensPair.name) private tokensPairModel: Model<TokensPairDocument>) {}

    async updateTokensPair(userId: string, tokens: Tokens): Promise<UpdateWriteOpResult> {
        return this.tokensPairModel.updateOne(
            { userId },
            {
                accessToken: await bcrypt.hash(tokens.access_token, 10),
                refreshToken: await bcrypt.hash(tokens.refresh_token, 10),
            },
            {
                upsert: true,
                setDefaultsOnInsert: true,
            }
        );
    }

    async getTokens(userId: string): Promise<TokensPairDocument> {
        return await this.tokensPairModel.findOne({ userId }).exec();
    }

    async compareTokens(userId: string, userToken, tokenKey: TokensEnum): Promise<boolean> {
        const tokens = await this.getTokens(userId);

        if (!tokens || !tokens.accessToken || !tokens.refreshToken) {
            throw new UnauthorizedException('Access Denied');
        }

        return bcrypt.compare(userToken, tokens[tokenKey]);
    }

    async removeTokens(userId: string): Promise<void> {
        const removedResult = await this.tokensPairModel.findOneAndRemove({ userId }).exec();

        if (!removedResult || !removedResult.accessToken || !removedResult.refreshToken) {
            throw new UnauthorizedException('Access Denied');
        }
    }
}
