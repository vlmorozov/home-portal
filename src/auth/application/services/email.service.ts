import * as nodemailer from 'nodemailer';
import { ConfigService } from '@nestjs/config';
import { Injectable } from '@nestjs/common';

@Injectable()
export class EmailService {
  private transporter: nodemailer.Transporter;
  constructor(private readonly cfg: ConfigService) {
    this.transporter = nodemailer.createTransport({
      host: cfg.get<string>('email.smtp.host'),
      port: cfg.get<number>('email.smtp.port'),
      auth: cfg.get('email.smtp.user') ? { user: cfg.get('email.smtp.user'), pass: cfg.get('email.smtp.pass') } : undefined,
    });
  }
  async sendVerification(email: string, token: string) {
    const url = this.cfg.get<string>('email.verifyUrl') + token;
    await this.transporter.sendMail({
      from: this.cfg.get<string>('email.from'),
      to: email,
      subject: 'Verify your email',
      html: `<p>Click to verify your email: <a href="${url}">${url}</a></p>`,
    });
  }
}
