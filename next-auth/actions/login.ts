"use server"
// safeParse checks for the validation of the value and returns zodIssue object containing any validation errors
import * as z from 'zod'
import { LoginSchema } from '@/schemas'
import { signIn } from '@/auth'
import { DEFAULT_LOGIN_REDIRECT } from '@/routes'
import { AuthError } from 'next-auth'
import { generateVerificationToken } from '@/lib/tokens'
import { getUSerByEmail } from '@/data/users'
import { error } from 'console'

export const login = async (values:z.infer<typeof LoginSchema>)=>{
    const validatedFields = LoginSchema.safeParse(values);
    if(!validatedFields.success){
        return {error: "Invalid fields!"}
    }
    const {email, password} = validatedFields.data
    const existingUser = await getUSerByEmail(email)
    if(!existingUser || !existingUser.email || !existingUser.password){
        return {error: "Email does not exist!"}
    }
    if(!existingUser.emailVerified){
        const verificationToken  = await generateVerificationToken(existingUser.email)
        return {success: "Confirmation email sent"}
    }
    try{
        await signIn("credentials",{
            email,
            password,
            redirectTo: DEFAULT_LOGIN_REDIRECT
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