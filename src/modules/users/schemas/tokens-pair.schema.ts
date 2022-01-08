import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { User } from './user.schema';
import * as mongoose from 'mongoose';

export type TokensPairDocument = TokensPair & Document;

@Schema()
export class TokensPair {
    @Prop({ required: true })
    accessToken: string;

    @Prop({ required: true })
    refreshToken: string;

    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
    userId: User;
}

export const TokensPairSchema = SchemaFactory.createForClass(TokensPair);
