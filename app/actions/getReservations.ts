import prisma from "@/app/libs/prismadb";

interface IParams {
  listingId?: string;
  userId?: string;
  authorId?: string;
}

export default async function getReservations(
  params: IParams
) {
  try {
    const { listingId, userId, authorId } = params;

    const query: any = {};
        
    if (listingId) {
      query.listingId = listingId;
    };

    if (userId) {
      query.userId = userId;
    }

    if (authorId) {
      query.listing = { userId: authorId };
    }

    const reservations = await prisma.reservation.findMany({
      where: query,
      include: {
        listing: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    const safeReservations = reservations.map(
      (reservation) => ({
      ...reservation,
      createdAt: reservation.createdAt.toISOString(),
      startDate: reservation.startDate.toISOString(),
      endDate: reservation.endDate.toISOString(),
      listing: {
        ...reservation.listing,
        createdAt: reservation.listing.createdAt.toISOString(),
      },
    }));

    return safeReservations;
  } catch (error: any) {
    throw new Error(error);
  }
}


/* 이 코드는 Prisma를 이용하여 데이터베이스에서 예약정보를 조회하는 getReservation함수를 정의합니다.
   이 함수는 다양한 매개변수를 받아 예약정보를 필터링하여 반환합니다. */

/*
1. import prisma from '@/app/libs/prismadb' : Prisma 클라이언트를 사용하여 데이터베이스에 접근하기 위해
   prisma 객체를 임포트합니다.

2. interface IParams { ... } : IParams 인터페이스를 정의합니다.이 인터페이스는 getReservations 함수의 매개변수 타입을 정의합니다.
   listingId, userId, authorId 라는 세가지 매개변수가 선택적으로 사용됩니다

3. export default async function ferReservations(params: IParams) { ... } : getReservations 함수를 정의합니다
   이 함수는 IParams 타입의 prisma 매개변수를 받습니다.

4. const { listingId, userId, authorId } = params;
   params 객체로부터 listingId, userId, authorId를 추출합니다

5. const query: any = {}; 데이터베이스 쿼리를 구성하는데 사용될 빈 객체 query를 선언합니다

6. if(listigId) { query.listingId = listingId; } 만약 listingId가 제공되면 query 객체에 listingId 필드를 추가합니다

7. if (userId) { query.listing = {userId: authorId }; }:
   만약 userId가 제공되면 query 객체에 userId 필드를 추가합니다.

8. if (authorId) { query.listing = { userId: authorId } }
   만약 authorId가 제공되면 query 객체에 listing 필드를 추가하고, 해당 필드에 
   userId를 사용하여 하위 필드로 추가합니다.

9. cont reservations = await prisma.reservations.findMany({
   Prisma를 상ㅅㅇ하여 데이터베이스에서 예약정보를 조회합니다.앞서 구성한 qurey 객체를 사용하여 예약정보를 필터링합니다.
   include를 사용하여 예약과 관련된 숙박 공간 정보도 함께 조회합니다.
   또한 createdAt 필드를 기준으로 내림차순으로 정렬하여 최신 예약이 먼저 반환되도록 합니다.

10. const SafeReservations = reservations.map((reservations) => { ... })
    조회된 예약정보를 반환하여 안전한 형식의 데이터로 매핑합니다.
    reservations 배열의 각 요소에 대해 createdAt, startDate, endDate 그리고 관련된
    숙박 공간정보를 ISO 8601 형식의 문자열로 반환합니다

11. return safeReservations : 안전한 형식으로 변환된 예약정보를 반환합니다.
*/

/*
이 함수는 prisma를 통해 데이터베이스에서 예약정보를 가져오고, 필요에 따라서 listingId, userId, authorId 등의 매개변ㅅ를 사용하여
예약 정보를 필터링합니다.조회한 예약정보를 안전한 형식으로 변환하여 반환하며, 데이터베이스 작업이나 에러처리를 
비동기적으로 수행합니다.
*/