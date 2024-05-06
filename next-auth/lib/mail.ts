import {Resend} from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY);
const domain = process.env.NEXT_PUBLIC_DOMAIN
export const sendTwoFactorTokenEmail = async(
    email: string,
    token: string
)=>{
    await resend.emails.send({
        from:'Vedang <mail@vedangcodes.com>',
        to: email,
        subject: "Two factor authentication code",
        html: `<p>Your 2FA code: ${token} </p>`
    })
}
export const sendPasswordResetEmail = async(
    email:string,
    token: string
)=>{
    const resetLink = `${domain}/auth/new-password?token=${token}`
    await resend.emails.send({
        from:'mail@vedangcodes.com',
        to: email,
        subject: "Reset your password",
        html: `<p>Click <a href ="${resetLink}">here</a> to confirm email.</p>`
    })
}

export const sendVerificationEmail = async(
    email:string,
    token: string
)=>{
    const confirmLink = `${domain}/auth/new-verification?token=${token}`
    await resend.emails.send({
        from:'mail@vedangcodes.com',
        to: email,
        subject: "Confirm your email",
        html: `<p>Click <a href ="${confirmLink}">here</a> to confirm email.</p>`
    })
}