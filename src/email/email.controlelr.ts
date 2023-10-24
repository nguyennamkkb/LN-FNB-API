import { Controller, Post, Body } from '@nestjs/common';
import { Public } from 'src/auth/public.decorator';
import { EmailService } from './email.service';

@Controller('email')
export class EmailController {
  constructor(private readonly emailService: EmailService) {}

  @Public()
  @Post('send')
  async sendEmail(@Body() data: { to: string, subject: string, text: string }) {
    this.emailService.sendEmail(data.to, data.subject, data.text);
    return { success: true, message: 'Email sent successfully.' };
  }
}
