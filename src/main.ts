import { NestFactory } from '@nestjs/core';
import { AppModule } from './modules/app/app.module';
import { ValidationPipe } from '@nestjs/common';

const PORT = 4545;
const CLIENT_URL = 'http://localhost:3000';

async function bootstrap() {
    const app = await NestFactory.create(AppModule, { logger: ['error', 'warn', 'log'] });

    app.useGlobalPipes(new ValidationPipe());

    app.setGlobalPrefix('api');

    app.enableCors({
        credentials: true,
        origin: CLIENT_URL,
    });

    await app.listen(PORT);
}

bootstrap();
