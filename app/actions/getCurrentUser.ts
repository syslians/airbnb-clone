 import { getServerSession } from "next-auth/next";

 import { authOptions } from "@/pages/api/auth/[...nextauth]";
 import prisma from '@/app/libs/prismadb';

 export async function getSession() {
    return await getServerSession(authOptions);
 }

 export default async function getCurrentUser() {
    try { 
      const session = await getSession();

      if (!session?.user?.email) {
        return null;
      }

      const currentUser = await prisma.user.findUnique({
        where: {
          email: session.user.email as string,
        }
      });

      if (!currentUser) {
        return null;
      }

      return {
        ...currentUser,
        createdAt: currentUser.createdAt.toISOString(),
        updatedAt: currentUser.updatedAt.toISOString(),
        emailVerified: currentUser.emailVerified?.toISOString() || null,
      };
    } catch (error: any) {
      return null;
    }
 }

 /*위 코드는 Next.js 어플리케이션에서 현재 로그인한 사용자의 정보를 가져오는 함수들입니다.
 NextAuth를 사용하여 세션관리를 하고 있으며, Prisma를 이용하여 데이터베이스에서
 사용자 정보를 조회합니다.

 1.모듈 및 라이브러리 임포트
 .getServerSession: NextAuth에서 제공하는 서버 측 세션정보를 가져오는 함수
 .authOptions: NextAuth 설정이 들어있는 authOptions 파일에서 가져온 옵션들
 .prisma: 데이터베이스 ORM인 Prisma를 사용하여 데이터베이스 작업을 수행하는 모듈

 2.getSession 함수
 .getSession: getServerSession 함수를 이용하여 서버측 세션 정보를 가져오는 함수입니다.
 인증 정보가 없거나 만료되었을 경우 null을 반환합니다.

 3.getCurrentUser 함ㅅ
 .현재 로그인한 사용자의 정보를 조회하는 함수입니다.
 .getSession() 함수를 통해 서버측 세션정보를 가져옵니다.
 .만약 세션정보가 없거나 사용자의 이메일 정보가 없다면 null을 반환합니다.
 .사용자의 이메일 정보가 있으면 해당 이메일을 사용하여 Prisma를 이용하여
 데이터베이스에서 사용자 정보를 조회합니다.
 .조회한 사용자 정보가 없다면 null을 반환합니다.
 .조회한 사용자 정보가 있다면 해당 정보를 반환합니다.

 이렇게 구현된 함수들을 통해 Next.js 어플리케이션에서 현재 로그인한 사용자의 정보를
 쉽게 가져올수 있습니다.세션 정보를 통해 사용자가 로그인한 상태인지를 판별하고,
 Prima를 사용하여 데이터베이스에서 사용자 정보를 조회하는 방식으로 사용자 정보를 관리하고 
 활용할 수 있습니다.

 */