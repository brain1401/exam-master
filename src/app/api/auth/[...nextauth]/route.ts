import { createIfUserNotExitst } from "@/service/user";
import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";

const handler = NextAuth({
  secret: process.env.NEXTAUTH_SECRET,
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    }),
  ],
  callbacks: {
    async signIn({user})
    // 유저가 로그인을 시도했을 때 실행되는 콜백함수
    {
      const result = await createIfUserNotExitst(user.email || "", user.name || "", user.image || "")
      
      return result;
    }
  }

});

export { handler as GET, handler as POST };
