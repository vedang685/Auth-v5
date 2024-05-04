"use server"
import * as z from "zod"
import { db } from "@/lib/db"
import { SettingSchema } from "@/schemas"
import { getUSerById } from "@/data/users"
import { currentUser } from "@/lib/auth"

export const settings = async (values: z.infer<typeof SettingSchema>)=>{
    const user = await currentUser();
    if(!user){
        return {error: "Unauthorised"}
    }
    const dbUser = await getUSerById(user.id as string)
    if(!dbUser){
        return {error: "Unauthorised"}
    }

    await db.user.update({
        where:{id: dbUser.id},
        data:{
            ...values
        }
    })

    return {success: "Settings Updated!"}
}