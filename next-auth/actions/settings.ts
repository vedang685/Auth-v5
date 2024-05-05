"use server"
import * as z from "zod"
import { db } from "@/lib/db"
import bcrypt from 'bcryptjs'
import { SettingSchema } from "@/schemas"
import { getUSerByEmail, getUSerById } from "@/data/users"
import { currentUser } from "@/lib/auth"
import { generateVerificationToken } from "@/lib/tokens"
import { sendVerificationEmail } from "@/lib/mail"

export const settings = async (values: z.infer<typeof SettingSchema>)=>{
    const user = await currentUser();
    if(!user){
        return {error: "Unauthorised"}
    }
    const dbUser = await getUSerById(user.id as string)
    if(!dbUser){
        return {error: "Unauthorised"}
    }

    if(user.isOAuth){
        values.email = undefined;
        values.password = undefined;
        values.newPassword = undefined;
        values.isTwoFactorEnabled = undefined;
    }

    if(values.email && values.email !== user.email){
        const existingUser = await getUSerByEmail(values.email)
        if(existingUser && existingUser.id !== user.id){
            return {error: "Email already in use!"}
        }
        const verificationToken = await generateVerificationToken(values.email as string)
        
        await sendVerificationEmail(verificationToken.email, verificationToken.token)
        
        return {success: "Verification email sent!"}
    }

    if(values.password && values.newPassword && dbUser.password){
        const passwordMatch = await bcrypt.compare(
            values.password,
            dbUser.password
        )

        if(!passwordMatch){
            return {error:"Incorrect Password!"}
        }

        const hashedPassword = await bcrypt.hash(values.newPassword,10)
        values.password = hashedPassword
        values.newPassword = undefined
    }   

    await db.user.update({
        where:{id: dbUser.id},
        data:{
            ...values
        }
    })

    return {success: "Settings Updated!"}
}