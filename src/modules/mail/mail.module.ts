import { Global, Module } from '@nestjs/common';
import { MailService } from './mail.service';
import { MailerModule } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { join } from 'path';
import { ConfigModule } from '@nestjs/config';

@Global()
@Module({
    imports: [
        ConfigModule.forRoot({ isGlobal: true }),
        MailerModule.forRoot({
            transport: {
                host: 'smtp.gmail.com',
                secure: false,
                auth: {
                    user: process.env.EMAIL_USER,
                    pass: process.env.EMAIL_PASSWORD,
                },
            },
            defaults: {
                from: '"No Reply" <noreply@example.com>',
            },
            template: {
                dir: join(__dirname, 'templates'),
                adapter: new HandlebarsAdapter(),
                options: {
                    strict: false,
                },
            },
        }),
    ],
    providers: [MailService],
    exports: [MailService],
})
export class MailModule {}
