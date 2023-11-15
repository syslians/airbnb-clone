import { NextResponse } from "next/server";

import prisma from '@/app/libs/prismadb';
import getCurrentUser from "@/app/actions/getCurrentUser";

export async function POST(
    request: Request
) {
  const currentUser = await getCurrentUser();
  
  if (!currentUser) {
    return NextResponse.error();
  }

  const body = await request.json();

  const { 
    listingId,
    startDate,
    endDate,
    totalPrice
  } = body;

  if (!listingId || !startDate || !endDate || !totalPrice) {
    return NextResponse.error();
  }

  const listingAndReservation = await prisma.listing.update({
    where: {
        id: listingId
    },
    data: {
      reservations: {
        create: {
          userId: currentUser.id,
          startDate,
          endDate,
          totalPrice  
        }
      }  
    }
  });

  return NextResponse.json(listingAndReservation);
}

/*이 코드는 Next.js의 API 루트함수로써, HTTP POST 요청을 처리하는 함수입니다.
  해당 함수는 숙박예약을 생성하는데 사용됩니다*/
/*
1. import { NextResponse } from 'next/server': Next.js 에서 제공하는 
   NextResponse 객체를 임포트합니다.이 객체는 API 응답을 생성하는데 사용됩니다.

2. import prisma from '@/app/libs/prismadb': Prisma 클라이언트를 사용하여
   데이터베이스에 접근하기 위해 prisma 객체를 임포트합니다.데이터베이스 작업을 수행하기위한
   ORM 라이브러리인 Prisma를 사용하고 있습니다.

3.imporrt getCurrentUser from '@/app/actions/getCurrentUser' :
  import getCurrentUser 함수를 임포트합니다.이 함수는 현재 로그인한 사용자정보를 가져오는 역할을 합니다

4. export async function POST(request:Request) {...}:
   POST 함수를 정의합니다.이 함수는 HTTP POST 요청을 처리하기 위해 사용됩니다.

5. const currentUser = await getCurrentUser(); :
   getCurrentUser 함수를 호출하여 현재로그인한 사용자 정보를 가져옵니다
   만약 로그인한 사용자가 없다면 currentUser 변수는 null이 됩니다.

6. if (!currentUser) { return NextResponse.error(); } : 만약 로그인한 사용자가 없다면
   즉, null 이라면 API는 에러응답을 반환하고 종료합니다

7. const body = await request.json(): HTTP 요청에서 전달된 데이터를 JSON 형식으로 파싱하여
   body 변수에 할당합니다.요청에서 listingId, startDate, endDate, totalPrice 등의 정보를 추출하기 
   위해 사용됩니다.

8. if (!listingId, || !startDate, || !endDate, || !totalPrice) {
    return NextResponse.error(); } 요청에서 필요한 정보들이 누락되었는지 확인합니다
    만약 필요한 정보들 중 하나라도 누락되었다며느 API는 에러응답을 반환하고 종료합니다

9. const listingAndReservation = await prisma.listing.update({
    ...}): Prisma를 사용하여 데이터베이스에 새로운 예약정보를 추가합니다.
    listingId를 사용하여 해당숙박 공간의 레코드를 찾고,해당 레코드의 reservation 필드에 새로운
    예약정보를 생성합니다.

10. return NextResponse.json(listingAndReservation)  : 예약이 성공적으로 생성되었다면, 해당
    예약정보를 JSON형식으로 응답합니다.응답은 listingAndReservation 변수에 저장된 정보를 JSON으로 변환하여 반환합니다. */

/* 이 코드는 데이터베이스에 새로운 예약정보를 추가하는데 사용되며, 이 작업은 Prisma를 통해 수행됩니다.
   또한 로그인한 사용자정보를 확인하여 로그인되지 않은 사용자의 경우 에러를 반환하여 예약생성을 막고 있습니다.
   요청에 필요한 정보가 누락된 경우에도 에러를 반환하여 예약 생성에 필요한 모든정보를 요청에 포함하도록 유도하고 있습니다.*/