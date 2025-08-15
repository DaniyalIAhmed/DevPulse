import NextAuth from "next-auth"
import { PrismaAdapter } from "@auth/prisma-adapter"

import { authOptions } from "./auth.config"
import { prisma } from "./lib/db";
import { getAccountByUserId, getUserById } from "@/features/auth/actions";




export const { auth, handlers, signIn, signOut } = NextAuth({
    callbacks: {
        /**
         * Handle user creation and account linking after a successful sign-in
         */
        async signIn({ user, account, profile }) {
            if (!user || !account) return false;

            // Check if the user already exists
            const existingUser = await prisma.user.findUnique({
                where: { email: user.email! },
            });

            // If user does not exist, create a new one
            if (!existingUser) {
                const newUser = await prisma.user.create({
                    data: {
                        email: user.email!,
                        name: user.name,
                        image: user.image,

                        accounts: {
                            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                            // @ts-expect-error
                            create: {
                                type: account.type,
                                provider: account.provider,
                                providerAccountId: account.providerAccountId,
                                refreshToken: account.refresh_token,
                                accessToken: account.access_token,
                                expiresAt: account.expires_at,
                                tokenType: account.token_type,
                                scope: account.scope,
                                idToken: account.id_token,
                                sessionState: account.session_state,
                            },
                        },
                    },
                });

                if (!newUser) return false; // Return false if user creation fails
            } else {
                // Link the account if user exists
                const existingAccount = await prisma.account.findUnique({
                    where: {
                        provider_providerAccountId: {
                            provider: account.provider,
                            providerAccountId: account.providerAccountId,
                        },
                    },
                });

                // If the account does not exist, create it
                if (!existingAccount) {
                    await prisma.account.create({
                        data: {
                            userId: existingUser.id,
                            type: account.type,
                            provider: account.provider,
                            providerAccountId: account.providerAccountId,
                            refreshToken: account.refresh_token,
                            accessToken: account.access_token,
                            expiresAt: account.expires_at,
                            tokenType: account.token_type,
                            scope: account.scope,
                            idToken: account.id_token,
                            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                            // @ts-expect-error
                            sessionState: account.session_state,
                        },
                    });
                }
            }

            return true;
        },

        async jwt({ token, user, account }) {
            if (!token.sub) return token;
            const existingUser = await getUserById(token.sub)

            if (!existingUser) return token;

            const existingAccount = await getAccountByUserId(existingUser.id);

            token.name = existingUser.name;
            token.email = existingUser.email;
            token.role = existingUser.role;

            return token;
        },

        async session({ session, token }) {
            if (token.sub && session.user) {
                session.user.id = token.sub
            }

            if (token.sub && session.user) {
                session.user.role = token.role
            }

            return session;
        },
    },

    secret: process.env.AUTH_SECRET,
    adapter: PrismaAdapter(prisma),
    session: { strategy: "jwt" },
    ...authOptions,
})