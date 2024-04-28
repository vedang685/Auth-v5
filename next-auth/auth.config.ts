import type { NextAuthConfig } from "next-auth"
import bcrypt from "bcryptjs"
import Credentials from "next-auth/providers/credentials"
import Github from "next-auth/providers/github"
import Google from "next-auth/providers/google"
import { LoginSchema } from "./schemas"
import { getUSerByEmail } from "./data/users";
 
export default { 
    providers: [
        Google,
        Github({
            clientId: process.env.GITHUB_CLIENT_ID,
            clientSecret: process.env.GITHUB_CLIENT_SECRET
        }),
        Credentials({
            async authorize(credentials:any):Promise<any>{
                const validatedFields = LoginSchema.safeParse(credentials);
                if(validatedFields.success){
                   const {email, password} = validatedFields.data;
                   const user = await getUSerByEmail(email);
                   if(!user || !user.password) return;

                   const passwordMatch = await bcrypt.compare(password, user.password);

                   if(passwordMatch){
                       return user;
                   }
                }

                return;
            }
        })
    ],
} satisfies NextAuthConfig