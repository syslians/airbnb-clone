import prisma from "@/app/libs/prismadb";

interface IParams {
  listingId?: string;
  userId?: string;
  authorId?: string;
}

/* listingId, userID, authorId 라는 세가지 매개변수가 선택적으로 사용합니다.  */
export default async function getReservations(
  params: IParams
) {
  try {

    /* url params로부터 아래 세가지 변수들을 추출합니다. */
    const { listingId, userId, authorId } = params;

    console.log("getReservations listingID:",listingId);
    console.log("getReservations userId: ", userId);
    console.log("getReservations authorId: ", authorId);

    /* 빈 쿼리 객체생성 */
    const query: any = {};
        
    /* listingId가 제공되면 query객체에 listingId 필드 추가 */
    if (listingId) {
      query.listingId = listingId;
    };

    /* userID가 제공되면 query객체에 userId 필드 추가 */
    if (userId) {
      query.userId = userId;
    }

    /* authorId가 제공되면 query 객체에 listing 필드를 추가하고, 해당 필드에 userId를 사용하여 하위 필드로 추가 */
    if (authorId) {
      query.listing = { userId: authorId };
    }

    /* Prisma를 사용하여 데이터베이스에서 예약정보를 조회합니다.앞서 구성한 쿼리 객체를 사용하여 예약정보를 필터링합니다. */
    /* 또한 include를 사용하여 예약과 관련된 숙박 공간정보도 함께 조회합니다.createAt 필드 기준으로 내림차순으로 정렬하여 최신예약이 먼저 반환되도록 합니다. */
    const reservations = await prisma.reservation.findMany({
      where: query,
      include: {
        listing: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    /* 조회된 예약정보를 반환하여 안전한 형식의 데이터로 매핑합니다. */
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

