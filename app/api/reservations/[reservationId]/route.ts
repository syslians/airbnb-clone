import { NextResponse } from "next/server";

import getCurrentUser from "@/app/actions/getCurrentUser";
import prisma from "@/app/libs/prismadb";

interface IParams {
  reservationId?: string;
}

export async function DELETE(
  request: Request, 
  { params }: { params: IParams }
) {
  const currentUser = await getCurrentUser();

  if (!currentUser) {
    return NextResponse.error();
  }

  const { reservationId } = params;

  if (!reservationId || typeof reservationId !== 'string') {
    throw new Error('Invalid ID');
  }

  const reservation = await prisma.reservation.deleteMany({
    where: {
      id: reservationId,
      OR: [
        { userId: currentUser.id },
        { listing: { userId: currentUser.id } }
      ]
    }
  });

  return NextResponse.json(reservation);
}

/*
이 코드는 Next.js의 API 루트 함수로서, HTTP DELETE 요청을 처리하는 함수입니다. 이 함수는 예약 정보를 삭제하는 기능을 제공합니다.

1. import { NextResponse } from "next/server";: Next.js에서 제공하는 NextResponse 객체를 임포트합니다. 이 객체는 API 응답을 생성하는 데 사용됩니다.

2. import getCurrentUser from "@/app/actions/getCurrentUser";: getCurrentUser 함수를 임포트합니다. 이 함수는 현재 로그인한 사용자의 정보를 가져오는 역할을 합니다.

3. import prisma from "@/app/libs/prismadb";: Prisma 클라이언트를 사용하여 데이터베이스에 접근하기 위해 prisma 객체를 임포트합니다. 데이터베이스 작업을 수행하기 위한 ORM(Object-Relational Mapping) 라이브러리인 Prisma를 사용하고 있습니다.

4. interface IParams { reservationId?: string; }: IParams 인터페이스를 정의합니다. 이 인터페이스는 DELETE 함수의 매개변수 타입을 정의합니다. reservationId라는 선택적인 매개변수를 받습니다.

5. export async function DELETE(request: Request, { params }: { params: IParams }) { ... }: DELETE 함수를 정의합니다. 이 함수는 HTTP DELETE 요청을 처리하기 위해 사용됩니다. request 매개변수로는 HTTP 요청 객체가 전달되며, params 매개변수로는 IParams 타입의 객체가 전달됩니다.

6. const currentUser = await getCurrentUser();: getCurrentUser 함수를 호출하여 현재 로그인한 사용자의 정보를 가져옵니다. 만약 로그인한 사용자가 없다면 currentUser 변수는 null이 됩니다.

7. if (!currentUser) { return NextResponse.error(); }: 만약 로그인한 사용자가 없다면(즉, currentUser가 null), API는 에러 응답을 반환하고 종료합니다.

8 .const { reservationId } = params;: HTTP 요청의 매개변수에서 reservationId를 추출합니다.

9 .if (!reservationId || typeof reservationId !== 'string') { throw new Error('Invalid ID'); }: reservationId가 누락되었거나 문자열이 아닌 경우, 즉 유효하지 않은 경우에는 에러를 던지고 처리합니다.

10. const reservation = await prisma.reservation.deleteMany({ ... }): Prisma를 사용하여 데이터베이스에서 해당 reservationId에 해당하는 예약 정보를 삭제합니다. 예약 정보를 삭제할 때는 reservationId와 현재 로그인한 사용자의 ID를 사용하여 쿼리를 구성합니다. 예약 정보는 현재 로그인한 사용자가 예약한 정보거나, 혹은 로그인한 사용자가 소유한 숙박 공간에 대한 예약 정보만 삭제됩니다.

11. return NextResponse.json(reservation);: 예약 정보가 성공적으로 삭제되면, 해당 정보를 JSON 형식으로 응답합니다. 응답은 reservation 변수에 저장된 정보를 JSON으로 변환하여 반환합니다.

이 코드는 데이터베이스에서 예약 정보를 삭제하는데 사용되며, 
이 작업은 Prisma를 통해 수행됩니다.
또한 로그인한 사용자 정보를 확인하여 로그인되지 않은 사용자의 경우 에러를 반환하여 예약 삭제를 막고 있습니다.
요청에서 필요한 정보가 누락된 경우에도 에러를 반환하여 예약 삭제에 필요한 모든 정보를 요청에 포함하도록 유도하고 있습니다.
*/