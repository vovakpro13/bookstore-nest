import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { SendCodeDto } from '../auth/dto/send-code.dto';

@Injectable()
export class MailService {
    constructor(private mailerService: MailerService) {}

    async sendCode({ email, lastName, firstName }: SendCodeDto, code: number) {
        await this.mailerService.sendMail({
            to: email,
            subject: 'Welcome to Bookstore! Confirm your Email',
            template: 'code',
            context: {
                name: `${firstName} ${lastName}`,
                code,
            },
        });
    }
}
