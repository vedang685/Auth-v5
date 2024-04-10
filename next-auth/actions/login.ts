"use server"
// safeParse checks for the validation of the value and returns zodIssue object containing any validation errors
import * as z from 'zod'
import { LoginSchema } from '@/schemas'
export const login = async (values:z.infer<typeof LoginSchema>)=>{
    const validatedFields = LoginSchema.safeParse(values);
    if(!validatedFields.success){
        return {error: "Invalid fields!"}
    }
    return {success:"Email sent!"}
}