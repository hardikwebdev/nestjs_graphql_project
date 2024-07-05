import * as nodemailer from 'nodemailer';
import * as smtpTransport from 'nodemailer-smtp-transport';
import { Injectable } from '@nestjs/common';
import * as handlebars from 'handlebars';
import * as fs from 'fs';

@Injectable()
export class EmailService {
  private readonly transporter;

  constructor() {
    const options: any =
      process.env.NODE_ENV === 'prod' // || process.env.NODE_ENV === 'dev')
        ? {
            host: process.env.NODEMAILER_HOST,
            port: process.env.NODEMAILER_PORT,
            auth: {
              user: process.env.NODEMAILER_USER_EMAIL,
              pass: process.env.NODEMAILER_USER_PASSWORD,
            },
          }
        : {
            service: 'gmail', // or your SMTP service
            auth: {
              user: process.env.NODEMAILER_USER_EMAIL,
              pass: process.env.NODEMAILER_USER_PASSWORD,
            },
            tls: { rejectUnauthorized: false },
          };
    this.transporter = nodemailer.createTransport(smtpTransport(options));
  }

  async sendMail(to: string, subject: string, text: string, html: string) {
    const mailOptions = {
      from: process.env.NODEMAILER_USER_EMAIL,
      to,
      subject,
      text: text || 'Hello',
      html,
    };

    try {
      const info = await this.transporter.sendMail(mailOptions);
      return info.messageId;
    } catch (error) {
      console.error('Error sending email:', error);
    }
  }

  async renderTemplate(templatePath: string, data: any): Promise<string> {
    const template = handlebars.compile(fs.readFileSync(templatePath, 'utf8'));
    return template(data);
  }
}
