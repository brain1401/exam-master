import { checkUser, createUser } from "@/service/user";
import drizzleSession from "@/db/drizzle";
import { user as userTable } from "@/db/schema";
import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { eq } from "drizzle-orm";

const handler = NextAuth({
  secret: process.env.NEXTAUTH_SECRET,
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    }),
  ],
  callbacks: {
    async signIn({ user }) {
      // 유저가 로그인을 시도했을 때 실행되는 콜백함수
      try {
        if (
          !process.env.NEXTAUTH_SECRET ||
          !process.env.GOOGLE_CLIENT_ID ||
          !process.env.GOOGLE_CLIENT_SECRET
        ) {
          throw new Error("Environment variables not set");
        }

        if (!user.email || !user.name) {
          throw new Error("Invalid user data");
        }

        console.log("user:", user);

        if (await checkUser(user.email)) {
          await drizzleSession
            .update(userTable)
            .set({
              updatedAt: new Date(),
            })
            .where(eq(userTable.email, user.email));
        } else {
          await createUser(user.email, user.name, user.image || "");
        }

        return true;
      } catch (error) {
        console.error("signIn callback 중 에러:", error);
        return false; // 로그인 실패
      }
    },
  },
});

export { handler as GET, handler as POST };
