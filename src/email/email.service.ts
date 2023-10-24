import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import emailConfig from './email.config';

@Injectable()
export class EmailService {
  private transporter: nodemailer.Transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: emailConfig.host,
      port: emailConfig.port,
      secure: false, // Set to true if using port 465
      auth: {
        user: emailConfig.user,
        pass: emailConfig.pass,
      },
    });
  } 

  async sendEmail(to: string, subject: string, text: string) {
    const mailOptions = {
      from: 'lnquanlynhahang@gmail.com',
      to,
      subject,
      text,
    };

    try {
      await this.transporter.sendMail(mailOptions);
      console.log('Email sent successfully');
    } catch (error) {
      console.error('Error sending email:', error);
    }
  }
}