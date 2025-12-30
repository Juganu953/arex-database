## NextAuth.js Setup with Prisma

1. Install dependencies:
   npm install next-auth @next-auth/prisma-adapter bcryptjs

2. Create API route: pages/api/auth/[...nextauth].js

3. Configure NextAuth:
   import NextAuth from "next-auth"
   import { PrismaAdapter } from "@next-auth/prisma-adapter"
   import { PrismaClient } from "@prisma/client"
   
   const prisma = new PrismaClient()
   
   export default NextAuth({
     adapter: PrismaAdapter(prisma),
     providers: [
       // Add providers (Email, Google, etc.)
     ],
     callbacks: {
       async session({ session, user }) {
         session.user.id = user.id
         session.user.role = user.role
         return session
       }
     }
   })
