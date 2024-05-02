import NextAuth, { DefaultSession } from "next-auth"
import authConfig from "./auth.config"
import { PrismaAdapter } from "@auth/prisma-adapter"
import { getUSerById } from "./data/users"
import { db } from "./lib/db"
import { UserRole } from "@prisma/client"
import { getTwoFactorConfirmationByUserId } from "./data/two-factor-confirmation"

declare module "next-auth" {
    interface Session {
        user: {
            role: UserRole
        } & DefaultSession["user"]
    }
}

export const { auth, handlers, signIn, signOut} = NextAuth({
    pages:{
        signIn: "/auth/login",
        error: "/auth/error"
    },
    events:{
        linkAccount: async({user})=>{
            await db.user.update({
                where: {id: user.id},
                data: {emailVerified: new Date()}
            })
        }
    },
    callbacks:{
        async signIn({user, account}){
            if(account?.provider !== "credentials") return true

            const existingUser = await getUSerById(user.id as string);
            
            if(!existingUser?.emailVerified) return false

            if(existingUser.isTwoFactorEnabled){
                const twoFactorConfirmation = await getTwoFactorConfirmationByUserId(existingUser.id)

                if(!twoFactorConfirmation) return false
                
                await db.twoFactorConfirmation.delete({
                    where:{id: twoFactorConfirmation.id,
                        userId: twoFactorConfirmation.userId
                    }
                })
            }

            
            return true
        },
        async session ({token, session}){
            if(token.sub && session.user){
                session.user.id = token.sub
            }
            if(token.role && session.user){
                session.user.role = token.role as UserRole
            }
            return session;
        },
        async jwt({token}){
            if(!token.sub) return token

            const existingUser = await getUSerById(token.sub)

            if(!existingUser) return token
            token.role = existingUser.role
            return token
        }
    },
    adapter: PrismaAdapter(db),
    session: {strategy: 'jwt'},
  ...authConfig
})