import bcrypt from 'bcrypt';

import prisma from '@/app/libs/prismadb';
import { NextResponse } from 'next/server';

export async function POST(
    request: Request
) {
  const body = await request.json();
  const {
    email,
    name,
    password
  } = body;

  const hashedPassword = await bcrypt.hash(password, 12);

  const user = await prisma.user.create({
    data: {
      email,
      name,
      hashedPassword
    }
  });

  return NextResponse.json(user);
}

/*위 코드는 NEXT.js API ROUTE에서 사용자 회원가입을 처리하는 방식입니다.*/
/*API route는 클라이언트에서 요청을 보내면 서버에서 이를 처리하고 응답하는 역할을 합니다.*/

/*
1.라이브러리 및 모듈 임포트
.bcrypt : 비밀번호 해싱을 위한 라이브러리
.prisma : 데이터베이스 ORM인 Prisma를 사용하여 데이터베이스 작업을 수행하는 모듈
.NextResponse : Next.js에서 제공하는 응답 관련 유틸리티

2.함수 정의
.POST : HTTP POST 메서드를 처리하는 함수로, 클라이언트의 요청이 들어올때 실행됩니다.
.request : 클라이언트로부터 받은 HTTP 요청 객체입니다.

3.request body 데이터 처리
.await request.json() : 클라이언트로부터 전송된 요청의 바디 데이터를 JSON 형태로 파싱한다.
.body : JSON 으로 파싱된 request body 데이터
.email , name, password : request body 데이터에서 각각 이메일, 이름, 패스워드 값을 추출합니다.

4.비밀번호 해싱
.await bcrypt.hash(password, 12) : 사용자가 입력한 패스워드를 bcrypt를 이용하여 해싱합니다.
해싱 알고리즘은 bcrypt이며, 두 번째 인자인 12는 솔트의 수를 의미합니다.
숫자가 클수록 보안이 강화되지만 해싱에 걸리ㅣ는 시간이 더 오래걸립니다.

5.데이터베이스에 사용자 정보 추가
.prisma.user.create : Prisma를 사용하여 데이터베이스에 새로운 사용자 정보를 추가합니다.
.email, name, hashedPassword : 사용자가 입력한 이메일과 이름, 그리고 암호화된 패스워드를
데이터베이스에 저장합니다.

6.response
.return NextResponse.json(user) : 사용자 정보를 JSON 형태로 응답합니다.
이를 통해 클라이언트는 회원가입이 성공적으로 이루어졌음을 알 수 있습니다.
*/