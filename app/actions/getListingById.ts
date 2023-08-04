import prisma from '@/app/libs/prismadb';

interface IParams {
    listingId?: string;
}

export default async function getListingById(
    params: IParams
) {
    try {
      const { listingId } = params;

      const listing = await prisma.listing.findUnique({
        where: {
            id: listingId
        },
        include: {
          user: true
        }
      });

      if (!listing) {
        return null;
      }

      return {
        ...listing,
        createdAt: listing.createdAt.toISOString(),
        user: {
          ...listing.user,
          createdAt: listing.user.createdAt.toISOString(),
          updatedAt: listing.user.updatedAt.toISOString(),
          emailVerified:
            listing.user.emailVerified?.toISOString() || null,
        }
      };
    } catch (error: any) {
       throw new Error(error); 
    }
}

/*
getListingById 함수는 주어진 listingId를 사용하여 Prisma를 통해 데이터베이스에서 해당 ID의 리스트를 찾아오는 함수입니다. 이 함수는 아래와 같은 기능을 수행합니다:

getListingById 함수는 listingId를 매개변수로 받아옵니다.
Prisma를 사용하여 listingId를 이용하여 데이터베이스에서 해당 ID의 리스트를 찾아옵니다.
listing이 존재하지 않으면 null을 반환합니다.
listing이 존재하면, 반환할 데이터의 형식을 가공하여 적절한 타입을 반환합니다.
listing.createdAt과 listing.user.createdAt, listing.user.updatedAt, 그리고 listing.user.emailVerified의 속성들을 ISO 8601 형식으로 변환하여 반환합니다.
즉, 이 함수는 주어진 listingId를 사용하여 데이터베이스에서 해당 리스트와 해당 리스트에 속한 사용자를 가져오고, 각 속성들을 ISO 8601 형식으로 변환하여 반환합니다.

getListingById 함수의 핵심 포인트는 Prisma를 사용하여 데이터베이스에 쿼리를 보내고, 데이터를 가공하여 반환하는 부분입니다. 이 함수를 호출하여 해당 listingId에 해당하는 리스트와 사용자 정보를 얻을 수 있습니다.*/