import User, { IUser } from "@/models/User";
import bcrypt from "bcryptjs";
import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { connectToDatabase } from "./db";

// this is basically to check for the details for dummyy details
export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(
        credentials
        // req
      ) {
        // Add logic here to look up the user from the credentials supplied

        if (!credentials?.email || !credentials.password) {
          throw new Error("Mission email or password");
        }

        try {
          await connectToDatabase();
          const existingUser: IUser | null = await User.findOne({
            email: credentials.email,
          });

          if (!existingUser) {
            throw new Error("New User Found.");
          }

          if (
            !(await bcrypt.compare(credentials.password, existingUser.password))
          ) {
            throw new Error("Invalid Password.");
          }

          return {
            // whatever we return from here we can easily access that from the session
            id: existingUser._id?.toString(),
            email: existingUser.email,
          };
        } catch (error) {
          console.log("Error during authenticating user", error);
          throw error;
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        // now this user is available everywhere
        session.user.id = token.id as string;
      }
      return session;
    },
  },
  pages: {
    signIn: "/login",
    error: "/login",
  },
  session: {
    // session can be stored in db or jwt
    // we use jwt
    // hence now since we use jwt
    // token will be available everywhere
    // and then we can extract info from that token
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60,
  },
  secret: process.env.NEXTAUTH_SECRET, 
};

