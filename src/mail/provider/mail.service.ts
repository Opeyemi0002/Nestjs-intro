import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { User } from 'src/users/user.entity';

@Injectable()
export class MailService {
  constructor(private readonly mailerService: MailerService) {}
  async sendUserWelcome(user: User): Promise<void> {
    await this.mailerService.sendMail({
      to: user.email,
      from: `Onboarding Team <support@nestjs-blog.com>`,
      subject: 'Welcome to NestJs Blog',
      text: 'This is a test email from NestJS using Mailtrap.',
      // template: './welcome',
      // context: {
      //   name: user.firstName,
      //   email: user.email,
      //   loginUrl: 'http://localhost:3000',
      // },
    });
    console.log({ 'user sent succesfully': user.email });
  }
}
