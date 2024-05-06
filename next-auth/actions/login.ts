"use server"
// safeParse checks for the validation of the value and returns zodIssue object containing any validation errors
import * as z from 'zod'
import { LoginSchema } from '@/schemas'
import { signIn } from '@/auth'
import { DEFAULT_LOGIN_REDIRECT } from '@/routes'
import { AuthError } from 'next-auth'
import { generateVerificationToken } from '@/lib/tokens'
import { getUSerByEmail } from '@/data/users'
import { sendVerificationEmail, sendTwoFactorTokenEmail } from '@/lib/mail'
import { generateTwoFactorToken} from '@/lib/tokens'
import { getTwoFactorTokenByEmail } from '@/data/two-factor-token'
import { db } from '@/lib/db'
import { getTwoFactorConfirmationByUserId } from '@/data/two-factor-confirmation'
import { getAccountByUserId } from '@/data/getAccountByUserId'

export const login = async (
    values:z.infer<typeof LoginSchema>,
    callBackUrl?: string | null,
)=>{
    const validatedFields = LoginSchema.safeParse(values);
    if(!validatedFields.success){
        return {error: "Invalid fields!"}
    }
    const {email, password, code} = validatedFields.data
    const existingUser = await getUSerByEmail(email)
    if(existingUser){
        const isOAuth = await getAccountByUserId(existingUser.id)
        if(isOAuth){
            return {error:"Email Already in use!"}
        }
    }
    if(!existingUser || !existingUser.email || !existingUser.password){
        return {error: "Email does not exist!"}
    }


    if(!existingUser.emailVerified){
        const verificationToken  = await generateVerificationToken(existingUser.email)
        
        await sendVerificationEmail(
            verificationToken.email,
            verificationToken.token
        )
        return {success: "Confirmation email sent"}
    }

    if(existingUser.isTwoFactorEnabled && existingUser.email){
        if(code){
            const twoFactorToken = await getTwoFactorTokenByEmail(existingUser.email)
            if(!twoFactorToken){
                return {error: "Invalid 2FA code!"}
            }
            if(twoFactorToken.token !== code){
                return {error: "Invalid 2FA code!"}
            }
            const hasExpired = new Date(twoFactorToken.expires) < new Date();
            if(hasExpired){
                return {error: "2FA code has expired!"}
            }

            await db.twoFactorToken.delete({
                where:{id: twoFactorToken.id}
            })
            const existingConfirmation = await getTwoFactorConfirmationByUserId(existingUser.id)
            if(existingConfirmation){
                await db.twoFactorConfirmation.delete({
                    where:{id: existingConfirmation.id,
                        userId: existingConfirmation.userId
                    }
                })
            }

            await db.twoFactorConfirmation.create({
                data:{
                    userId: existingUser.id
                }
            })
            
        }else{
            const twoFactorToken = await generateTwoFactorToken(existingUser.email)
    
            await sendTwoFactorTokenEmail(
                twoFactorToken.email,
                twoFactorToken.token
            )
            return {twoFactor: true}
        }
    }
    try{
        await signIn("credentials",{
            email,
            password,
            redirectTo: callBackUrl || DEFAULT_LOGIN_REDIRECT
        })
    } catch(error){
        if(error instanceof AuthError){
            switch(error.type){
                case "CredentialsSignin":
                    return {error: "Invalid credentials!"}
                default:
                    return {error: "An error occurred!"}
            }
        }
        throw error;
    }
}