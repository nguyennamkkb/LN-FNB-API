import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Common } from 'helper/common/common';
import * as nodemailer from 'nodemailer';
import { emit } from 'process';
import { Repository } from 'typeorm';
import emailConfig from './email.config';
import { EmailEntity } from './entity/email.entity';

@Injectable()
export class EmailService {
    private transporter: nodemailer.Transporter;

    constructor(@InjectRepository(EmailEntity) private repository: Repository<EmailEntity>) {
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
    async createOtp(user_id: number): Promise<string> {

        try {
            const email = new EmailEntity()
            const otp = await Common.generateRandomNumberString(6)
            email.user_id = user_id
            email.otp = otp
            email.status = 1
            const emailOtp = await this.repository.create(email)
            if (emailOtp) {
                return otp
            } else {
                return ""
            }

        } catch (error) {

        }
    }

    async sendEmail(to: string, subject: string, text: string): Promise<boolean> {
        const mailOptions = {
            from: 'lnquanlynhahang@gmail.com',
            to,
            subject,
            text,
        };

        try {
            await this.transporter.sendMail(mailOptions);
            return true
        } catch (error) {
            return error
        }
        return false
    }
    async checkOtp(user_id: number, otpString: string): Promise<boolean> {
        const res = await this.repository.findOne({ where: { "user_id": user_id, "otp": otpString } });
        return res ? true : false;
    }
}