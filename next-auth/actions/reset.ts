"use server"
import { ResetSchema } from "@/schemas"
import { getUSerByEmail } from "@/data/users"
import * as z from "zod"
import { sendPasswordResetEmail } from "@/lib/mail"
import { generatePasswordResetToken } from "@/lib/tokens"

export const reset = async(values: z.infer<typeof ResetSchema>)=>{
    const validatedFields = ResetSchema.safeParse(values)
    if(!validatedFields.success){
        return{error: "Invalid mail!"}
    }

    const {email} = validatedFields.data
    const existingUser = await getUSerByEmail(email)
    if(!existingUser){
        return{error: "Email not found!"}
    }
    
    const passwordResetToken = await generatePasswordResetToken(email)
    await sendPasswordResetEmail(
        passwordResetToken.email,
        passwordResetToken.token
    )

    return{success: "Reset email link sent!"}
}
