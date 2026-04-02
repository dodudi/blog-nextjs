import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { config } from "@/lib/config";

export const { handlers, signIn, signOut, auth } = NextAuth({
    providers: [
        Credentials({
            credentials: {
                username: { label: "Username", type: "text" },
                password: { label: "Password", type: "password" },
            },
            async authorize(credentials) {
                const username = credentials?.username as string;
                const password = credentials?.password as string;

                if (username !== config.admin.username || !password) return null;

                const isValid = await bcrypt.compare(password, config.admin.passwordHash);
                if (!isValid) return null;

                return { id: "admin", name: username, role: "admin" };
            },
        }),
    ],
    session: { strategy: "jwt", maxAge: 7 * 24 * 60 * 60 },
    pages: {
        signIn: "/login",
    },
    callbacks: {
        jwt({ token, user }) {
            if (user) token.role = (user as { role: string }).role;
            return token;
        },
        session({ session, token }) {
            session.user.role = token.role as string;
            return session;
        },
    },
});
