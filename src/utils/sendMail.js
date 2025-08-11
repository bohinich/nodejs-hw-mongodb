import nodemailer from 'nodemailer';
import { getEnvVariable } from './getEnvVar.js';

const transporter = nodemailer.createTransport({
  host: getEnvVariable('SMTP_HOST'),
  port: Number(getEnvVariable('SMTP_PORT')),
  secure: false,
  auth: {
    user: getEnvVariable('SMTP_LOGIN'),
    pass: getEnvVariable('SMTP_PASSWORD'),
  },
});

export function sendMail(mail) {
  mail.from = getEnvVariable('SMTP_FROM');
  return transporter.sendMail(mail);
}