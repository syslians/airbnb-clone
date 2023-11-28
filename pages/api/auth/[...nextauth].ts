import bcrypt from "bcrypt"
import NextAuth, { AuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import GoogleProvider from "next-auth/providers/google"
import { PrismaAdapter } from "@next-auth/prisma-adapter"

import prisma from "@/app/libs/prismadb"

export const authOptions: AuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    /* 구글 서비스 Provider */
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string
    }),
    /* 기본 서비스 provider.credential 객체는 email과 password를 담고 있다. */
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'email', type: 'text' },
        password: { label: 'password', type: 'password' }
      },
      /* 사용자 유효성검사.credentials의 객체의 email과 password */
      /* 사용자가 로그인할때 호출되며 주어진 자격증명을 통해 인증을 수행한다. */
      async authorize(credentials) {
        /* email 이나 password가 제공되지 않았을시 Invalid credentials 에러를 던진다. */
        if (!credentials?.email || !credentials?.password) {
          throw new Error('Invalid credentials');
        }

        /* prisma의 findUnique 함수를 호출하여 email을 조건으로 사용자를 찾는다.즉 데이터베이스
        에서 검색하고 결과를 user 변수에 담는다.
        */
        const user = await prisma.user.findUnique({
          where: {
            email: credentials.email
          }
        });

        /* 사용자가 존재하지 않거나 비밀번호가 일치하지 않는 경우 에러 throw */
        if (!user || !user?.hashedPassword) {
          throw new Error('Invalid credentials');
        }

        /* bcrypt.compare를 사용하여 사용자가 제공한 비밀번호 (credentials.password)와 데이터베이스에 저장된 비밀번호 (user.hashedPassword)를 비교합니다.
         이 함수는 제공한 비밀번호와 저장된 비밀번호가 일치하는지 확인합니다. */
        const isCorrectPassword = await bcrypt.compare(
          credentials.password,
          user.hashedPassword
        );

        /* 비밀번호가 일치하지 않으면 error throw */
        if (!isCorrectPassword) {
          throw new Error('Invalid credentials');
        }

        return user;
      }
    })
  ],
  pages: {
    signIn: '/',
  },
  session: {
    strategy: "jwt",
    maxAge: 30 * 30,
    },
  debug: process.env.NODE_ENV === 'development',
  secret: process.env.NEXTAUTH_SECRET,
  
}

export default NextAuth(authOptions);