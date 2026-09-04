import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { User } from 'src/users/user.entity';

@Injectable()
export class MailService {
  constructor(private readonly mailerServoce: MailerService) {}

  async sendWelcomeEmail(user: User): Promise<void> {
    await this.mailerServoce.sendMail({
      from: `Support <support@nestjsintro.com>`,
      to: user.email,
      subject: `Welcome to the Application`,
      template: `welcome`,
      context: {
        name: user.firstName,
      },
    });
  }
}
