import {db}  from '@/lib/db'
export const getUSerByEmail = async (email:string)=>{
    try{
        const user = await db.user.findUnique({
            where:{
                email
            }
        })
        return user;
    }
    catch{
        return null;
    }
} 
export const getUSerById= async (id:string)=>{
    try{
        const user = await db.user.findUnique({
            where:{
                id
            }
        })
        return user;
    }
    catch{
        return null;
    }
} 