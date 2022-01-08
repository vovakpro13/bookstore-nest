import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Tokens } from '../auth/types/tokens.type';
import { TokensPair, TokensPairDocument } from './schemas/tokens-pair.schema';

@Injectable()
export class TokensService {
    constructor(@InjectModel(TokensPair.name) private tokensPairModel: Model<TokensPairDocument>) {}

    async updateTokensPair(userId: string, tokens: Tokens) {
        const res = await this.tokensPairModel.updateOne(
            { userId },
            { accessToken: tokens.access_token, refreshToken: tokens.refresh_token },
            {
                upsert: true,
                setDefaultsOnInsert: true,
            }
        );
        console.log(res);
        return res;
    }
}
