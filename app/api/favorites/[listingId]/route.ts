import { NextResponse } from 'next/server';

import getCurrentUser from '@/app/actions/getCurrentUser';
import prisma from '@/app/libs/prismadb';

interface IParams {
 listingId?: string;
}

export async function POST(
  request : Request,
  { params } : { params: IParams}
) {
  const currentUser = await getCurrentUser();

  if (!currentUser) {
    return NextResponse.error();
  }  

  const { listingId } = params;

  if (!listingId || typeof listingId !== 'string') {
    throw new Error('Invalid')
  }

  let favoriteIds = [...(currentUser.favoriteIds || [])];

  favoriteIds.push(listingId);

  const user = await prisma.user.update({
    where: {
      id: currentUser.id 
    },
    data: {
      favoriteIds
    }
  });

  return NextResponse.json(user);
}

export async function DELETE(
 request: Request,
 { params } : { params: IParams}
) {
  const currentUser = await getCurrentUser();

  if (!currentUser) {
    return NextResponse.error();
  }

  const { listingId } = params;
  
  if (!listingId || typeof listingId !== 'string') {
    throw new Error('Invalid ID');
  }

  let favoriteIds = [...(currentUser.favoriteIds || [])];

  favoriteIds = favoriteIds.filter((id) => id !== listingId);

  const user = await prisma.user.update({
    where: {
        id: currentUser.id
    }, 
    data: {
        favoriteIds
    }
  });

  return NextResponse.json(user);
}

/*위 코드는 Next.js에서 API라우를 처리하는 함수를 정의하고 있습니다.
이 API 라우트는 사용자의 즐겨찾기 목록을 관리하는데 사용됩니다.

1. 모듈 및 라이브러리 임포트:
  - NextResponse: Next.js의 API 라우트에서 응답을 다루는데 사용되는 클래스
  - getCurrentUser: 현재 로그인한 사용자를 가져오는 함수입니다.
  - prisma: Prisma 클라이언트로 데이터베이스를 조작하는데 사용됩니다.

2. IParams 인터페이스 정의: 
 - listingId?: string : listingId 라는 문자열 타입의 매개변수가 있을수도 있고 없을수도 있습니다.

3. POST 함수정의
 - HTTPS POST 요청에 대한 핸들러 함수로, 사용자가 특정 숙소를 즐겨찾기에 추가하는 역할을 합니다.
 - request: Request: HTTP 요청 객체입니다.
 - { params }: { params:IParams } : IParams 타입의 params를 비구조화하여 사용합니다.
 - getCurrentUser() : 현재 로그인한 사용자를 가져오는 함수를 호출하여 currentUser 변수에 저장합니다.
 - 만약사용자 로그인하지 않았을 경우, currentUser 가 null이 되며, NextResponse.error() 를 반환하여 에러를 처리합니다.
 - 숙소의 ID를 가져와서 listingId 변수에 저장합니다.
 - listingId 가 유효하지 않을 경우('null' 또는 문자열이 아닐경우),에러를 던집니다.
 - favoriteIds 배열에 숙소의 ID를 추가하고,prisma.user.update()를 사용하여 정보를 업데이트 합니다.
 -최종적으로 사용자정보를 JSON 형태로 변환합니다.

4. DELETE 함수 정의:
 - HTTP DELETE 요청에 대한 핸들러 함수로, 사용자의 즐겨찾기에서 숙소를 제거하는 역할을 합니다.
 - request: Request: HTTP 요청 객체입니다.
 - getCurrentUser(): 현재 로그인한 사용자를 가져오는 함수를 호출하여 currentUser 변수에 저장합니다.
   만약 사용자가 로그인하지 않았을 경우, currentUser가 null이 되며, NextResponse.error()를 반환하여 에러를 처리합니다.
 - 숙소의 ID를 가져와서 listingId 변수에 저장합니다.
   listingId가 유효하지 않을 경우(null 또는 문자열이 아닐 경우), 에러를 던집니다.
 - favoriteIds 배열에서 해당 숙소의 ID를 필터링하여 제거하고,
   prisma.user.update() 를 사용하여 정보를 업데이트 합니다.
 - 최종적으로 사용자 정보를 JSON 형태로 반환합니다.
*/

/* 이렇게 구현된 API 라우트 함수들은 사용자가 로그인한 상태에서 특정 숙소를 즐겨찾기에 추가하거나
   제거할수 있도록 기능을 제공합니다.또한 Prisma를 사용하여 사용자 정보를 데이터베이스에 업데이트합니다.*/