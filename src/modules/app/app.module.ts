import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';

@Module({
    imports: [
        ConfigModule.forRoot({ isGlobal: true }),
        MongooseModule.forRoot(process.env.MONGO_DB_CONNECTION_URL, {
            autoCreate: true,
            useNewUrlParser: true,
        }),
        AuthModule,
    ],
})
export class AppModule {}
