import prisma from "@/app/libs/prismadb";

import getCurrentUser from "./getCurrentUser";

export default async function getFavoriteListings() {
  try {
    const currentUser = await getCurrentUser();

    if (!currentUser) {
      return [];
    }

    const favorites = await prisma.listing.findMany({
      where: {
        id: {
          in: [...(currentUser.favoriteIds || [])]
        }
      }
    });

    const safeFavorites = favorites.map((favorite) => ({
      ...favorite,
      createdAt: favorite.createdAt.toString(),
    }));

    return safeFavorites;
  } catch (error: any) {
    throw new Error(error);
  }
}

/*위 코드는 사용자의 즐겨찾기 목록을 가져오는 기능을 수행하는 함수인
 getFavoritesListings를 정의합니다.이 함수는 Prisma를 사용하여
 데이터베이스에 접근하고,현재 로그인한 사용자의 즐겨찾기 목록에 해당하는
 숙박공간 정보를 가져옵니다.
 
 1.import prisma from '@/app/libs/prismadb': Prisma 클라이언트
   를 사용하여 데이터베이스에 접근하고, 현재로그인한 사용자의 즐겨찾기 목록에 
   해당하는 숙박공간정보를 가져옵니다.

2. import getCurrentUser from './getCurrentUser' : 현재 로그인한 
   사용자의 정보를 가져오는 getCurrentUser 함수를 임포트합니다.
   이 함수는 사용자의 정보를 가져오는 역할을 합니다.

3. export default async function getFavoriteListings() {...} 
   : getFavoriteListings 함수를 정의합니다.이 함수는 현재 로그인한 사용자의 
   즐겨찾기 목록에 해당하는 숙박공간 정보를 가져옵니다. 

4. const currentUser = await getCurrentUser();
   getCurrentUser 함수를 호출하여 현재 로그인한 사용자의 정보를 가죠옵니다. 
   만약 로그인한 사용자가 없다면 currentUser 변수는 null이 됩니다.

5. if (!currentUser) {return []} : 로그인한 사용자가 없다면, 즉 currentUser가 null
   이라면 빈 배열을 반환하고 함수실행을 종료합니다. 

6. const favorites = await.prisma.listing.findMany({...}) :
   Prisma를 사용하여 데이터베이스에서 현재 로그인한 사용자의 즐겨찾기 목록에 해당하는
   숙박공간 정보를 가져옵니다.currentUser.favoriteIds 배열에있는 숙박공간ID들과 일치하는
   숙박공간 정보를 가져옵니다.

7. const safeFavorites = favorites.map((favorite) => ({...})); 
   가져온 즐겨찾기 목록(favorites)의 각 숙박공간 정보에 대한 변환작업을 수행합니다.
   createdAt 필드를 문자열로 변환하여 변환하는 작업을 수행합니다.

8. return safeFavorites : 즐겨찾기 목록에 해당하는 숙박공간 정보를 반환합니다.
   이 정보는 safeFavorites 배열에 저장되어 있습니다.

9. catch (error: any) { throw new Error(error) }: 코드 실행중에 발생한 에러를 처리합니다. 
   에러가 발생하면 해당에러를 던지고 함수실행을 종료합니다. 
  
   이 함수는 현재 로그인한 사용자의 즐겨찾기 목록에 해당하는 숙박공간정보를 가져오는데 사용됩니다. 
   Prisma를 통해 데이터베이스와 상호작용하여 필요한 정보를 가져온 후 이를 처리하 안전한 형식으로 반환합니다. 
 */