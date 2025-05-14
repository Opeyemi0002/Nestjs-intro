import { Module } from '@nestjs/common';
import { MailService } from './provider/mail.service';

@Module({
  providers: [MailService]
})
export class MailModule {}
