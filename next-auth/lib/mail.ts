"use server"
import nodemailer, { SentMessageInfo } from 'nodemailer';
const transporter = nodemailer.createTransport({
    service: 'gmail',
    host: "smtp.gmail.email",
    port: 587,
    secure: true, 
    auth: {
      user: process.env.NEXT_PUBLIC_USER,
      pass: process.env.NEXT_PUBLIC_APP_PASS
    },
    tls: {
      rejectUnauthorized: false,
      ciphers: 'DEFAULT@SECLEVEL=0'
    }
  });
const domain = process.env.NEXT_PUBLIC_DOMAIN
export const sendTwoFactorTokenEmail = (
    email: string,
    token: string
)=>{
    const mailOptions = {
        from:{
         name: 'Vedang Codes',
         address:'vedang.codes@gmail.com'
        },
        to: email,
        subject: 'Two factor authentication code',
        text: 'Two factor authentication code!',
        html: `<p>Your 2FA code: <b>${token}</b></p>`
      };

      transporter.sendMail(mailOptions, (error: Error | null, info: SentMessageInfo) => {
        if (error) {
          console.error('Error sending email:', error);
        } else {
          console.log('Email sent:', info.response);
        }
      });
    
}
export const sendPasswordResetEmail = async(
    email:string,
    token: string
)=>{
    const resetLink = `${domain}/auth/new-password?token=${token}`
    const mailOptions = {
        from:{
         name: 'Vedang Codes',
         address:'vedang.codes@gmail.com'
        },
        to: email,
        subject: 'Reset Link',
        text: 'Reset Link',
        html: `<p>Click <a href=${resetLink}> here</a> to reset link </p>`
      };

      transporter.sendMail(mailOptions, (error: Error | null, info: SentMessageInfo) => {
        if (error) {
          console.error('Error sending email:', error);
        } else {
          console.log('Email sent:', info.response);
        }
      });
}

export const sendVerificationEmail = async(
    email:string,
    token: string
)=>{
    const confirmLink = `${domain}/auth/new-verification?token=${token}`
    
    const mailOptions = {
        from:{
         name: 'Vedang Codes',
         address:'vedang.codes@gmail.com'
        },
        to: email,
        subject: 'Email confirmation Link',
        text: 'Reset Link',
        html: `<p> Click <a href=${confirmLink}> here</a> to confirm email.</p>`
      };

      transporter.sendMail(mailOptions, (error: Error | null, info: SentMessageInfo) => {
        if (error) {
          console.error('Error sending email:', error);
        } else {
          console.log('Email sent:', info.response);
        }
      });
}