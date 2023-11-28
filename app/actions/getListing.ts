import prisma from "@/app/libs/prismadb";

/* export interface IListingParams {...} : getListings 함수에 사용되는 검색조건들을 
인터페이스로 정의합니다.이 인터페이스는 매물목록을 필터링하는데 사용됩니다. */
export interface IListingsParams {
  userId?: string;
  guestCount?: number;
  roomCount?: number;
  bathroomCount?: number;
  startDate?: string;
  endDate?: string; 
  locationValue?: string;
  category?: string;
}

/*  검색조건에 따라 매물목록을 가져오는 getListings 함수를 정의합니다.IListingsParams 인터페이스를 통해
  다양한 검색조건을 받을수 있습니다. */
export default async function getListings(
  params: IListingsParams
) {
  /* const { userId, roomCount, guestCount, bathroomCount, locationValue, startDate, endDate, category } = params; 
     입력된 검색조건들을 변수로 추출합니다. */
  try {
    const {
      userId,
      roomCount, 
      guestCount, 
      bathroomCount, 
      locationValue,
      startDate,
      endDate,
      category,
    } = params;

    /* let query: any = {}; 검색조건에 따라 Prisma 쿼리를 구성할 객체를 초기화합니다.  */
    let query: any = {};

    /* 각 검색조건에 따라서 적절한 Prisma 쿼리를 생성합니다.예를들어 userId가 입력된 경우
     query.userId = userId와 같이 쿼리를 구성합니다.  */
    if (userId) {
      query.userId = userId;
    }

    if (category) {
      query.category = category;
    }

    if (roomCount) {
      query.roomCount = {
        gte: +roomCount
      }
    }

    if (guestCount) {
      query.guestCount = {
        gte: +guestCount
      }
    }

    if (bathroomCount) {
      query.bathroomCount = {
        gte: +bathroomCount
      }
    }

    if (locationValue) {
      query.locationValue = locationValue;
    }

    /* query.NOT = { reservations: { some: {...} } };
     시작날짜와 종료 날짜에 따라 예약이 있는 매물을 필터링하기 위해 NOT을 사용한 복잡한 쿼리를 구성합니다. */
    if (startDate && endDate) {
      query.NOT = {
        reservations: {
          some: {
            OR: [
              {
                endDate: { gte: startDate },
                startDate: { lte: startDate }
              },
              {
                startDate: { lte: endDate },
                endDate: { gte: endDate }
              }
            ]
          }
        }
      }
    }

    /* const listings = await prisma.listing.findMany({...});
     구성된 쿼리를 이용하여 Prisma를 사용해 매물목록을 가져옵니다.  */
    const listings = await prisma.listing.findMany({
      where: query,
      orderBy: {
        createdAt: 'desc'
      }
    });

    /* const safeListings = listings.map((listings) => ({...})); : 
     가져온 매물목록을 안전하게 가공합니다.여기서는 날짜를 ISO형식으로 변환하여 리턴합니다.  */
    const safeListings = listings.map((listing) => ({
      ...listing,
      createdAt: listing.createdAt.toISOString(),
    }));

    return safeListings;
  } catch (error: any) {
    throw new Error(error);
  }
}

/*위 코드는 
  


  이 코드는 입력된 검색조건에 따라 Prisma를 사용하여 매물목록을 가져오는 함수로, 안전하게 가공된 목록을 반환합니다. 
  */

  /*
    if (startDate && endDate) {
      query.NOT = {
        reservations: {
          some: {
            OR: [
              {
                endDate: { gte: startDate },
                startDate: { lte: startDate }
              },
              {
                startDate: { lte: endDate },
                endDate: { gte: endDate }
              }
            ]
          }
        }
      }
    } */

  /* 위 코드는 매물목록을 검색할때, 지정된 시작날짜와 종료 날짜사이에 예약이 있는 매물을 필터링
  하는 기능을 구현한 부분입니다.이를 통해 이미 예약된 날짜에 대해서는 해당 매물이 검색결과로 나오지 않도록 합니다.
  1. if (startDate && endDate) {...} : startDate 와 endDate가 존재하는 경우에만 이 조건 블록을 실행
     합니다.이는 시작날짜와 종료 날짜가 적절히 제공되었을때만 예약이 있는 매물을 필터링하는 기능을 사용하겠다는 의미입니다. 

  2. query.NOT = { reservations: some: {...}}}; : Prisma의 NOT 연산자를 사용하여 예약이있는 매물을 제외하는 쿼리를 구성합니다.
     query.NOT은 매물목록을 필터링하는데 사용되는 객체입니다. 

  3. reservations: {some: {...}} : 매물모델에 정의된 reservations 필드를 검사합니다. 
     이 필디는 해당매물에 대한 예약들을 나타냅니다.some은 배열에서 하나이상의 요소를 만족하는지 검사하는 Prisma 필터입니다. 

  4. OR: [...] : OR필터는 배열안의 각 조건중 하나라도 만족하는 경우를 찾습니다.즉, 시작 날짜 또는 종료날짜가 입력된 시작과
     종료 날짜 사이에 걸치는 예약이있는지 확인합니다. 
    
  5. 예약이 시작날짜보다 이전이면서 종료날짜보다 이후인 경우 또는 예약이 시작날짜보다 이후이면서 종료날짜보다 이전인 경우:
     위의 두 조건은 시작과 종료날짜 사이에 걸치는 예약이 있는지 확인하기 위한 조건들입니다.이를 통해 이미 예약된 
     날짜에 해당하는 매물들은 결과에서 제외됩니다.

     이렇게 구성된 쿼리는 Prisma를 사용하여 해당 시작과 종료 날짜 사이에 예약이 있는 매물들을 제외하고,
     검색조건에 맞는 매물들만 반환합니다.
  */