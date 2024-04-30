"use server"
import bcrypt from 'bcrypt'
import {db} from '@/lib/db'
// safeParse checks for the validation of the value and returns zodIssue object containing any validation errors
import * as z from 'zod'
import { RegisterSchema } from '@/schemas'
import { getUSerByEmail } from '@/data/users'
import { generateVerificationToken } from '@/lib/tokens'
import { sendVerificationEmail } from '@/lib/mail'

export const register = async (values:z.infer<typeof RegisterSchema>)=>{
    const validatedFields = RegisterSchema.safeParse(values);
    if(!validatedFields.success){
        return {error: "Invalid fields!"}
    }
    const {email,password,name} = validatedFields.data;
    const hashedPassword = await bcrypt.hash(password,10);

    const existingUser = await getUSerByEmail(email)

    if(existingUser){
        return {error:"Email already exists!"}
    }

    await db.user.create({
        data:{
            email,
            password:hashedPassword,
            name
        }
    })

    const verificationToken = await generateVerificationToken(email)
    await sendVerificationEmail(
        verificationToken.email,
        verificationToken.token
    )

    return {success:"Confirmation Email sent!"}
}