import nodemailer from 'nodemailer';
import { Transporter } from 'nodemailer'
import SMTPTransport from 'nodemailer/lib/smtp-transport'
import { emailTemplate } from './emailTemplate';

export default class Mailer {
    private transport: Transporter<SMTPTransport.SentMessageInfo> = null;
    private mail: string;

    constructor({host, port, username, password}:{host: string, port: string, username: string, password: string}) {
        this.transport = nodemailer.createTransport({
            // @ts-ignore
            host,
            port,
            secure: true,
            auth: {
              user: username,
              pass: password
            },
          });
        this.mail = username;
    }

    public async sendMail (receiverEmail: string, subject: string, content: string) {
        return await
          this.transport.sendMail({
            from: `"Hirelancer" <${this.mail}>`, // sender address
            to: receiverEmail, // list of receivers
            subject, // Subject line
            text: content, // plain text body
            html: emailTemplate(content), // html body
          }).then(console.log).catch(console.warn);
    }
}