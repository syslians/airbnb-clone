import { NextResponse } from  'next/server';

import getCurrentUser from '@/app/actions/getCurrentUser';
import prisma from '@/app/libs/prismadb';

interface IParams {
    listingId?: string;
}

export async function DELETE(
    request: Request,
    { params } : { params: IParams }
) {
  const currentUser = await getCurrentUser();
  
  if (!currentUser) {
    return NextResponse.error();
  }

  const { listingId } = params;

  if (!listingId || typeof listingId !== 'string') {
    throw new Error('ID가 일치하지 않습니다.');
  }

  const listing = await prisma.listing.deleteMany({
     where: {
       id: listingId,
       userId: currentUser.id 
     }
  });

  return NextResponse.json(listing);
}

/* 위 코드는 사용자가 소유한 숙박공간을 삭제하는 기능을 수행하는 Next.js API route 핸들러 함수입니다. 
   해당 함수는 HTTP DELETE 요청을 처리하고, Prisma를 사용하여 데이터베이스에서 숙박공간을 삭제합니다. 
   
   1. interface IParams { listingId?: string } : API route 핸들러 함수의 params에 전달되는 
      매개변수를 위한 타입 정의입니다.listingId가 선택적으로 문자열형태로 전달됩니다. 

   2. export async function DELETE(request: Request, { params }: { params: IParams }) {...}
      :HTTP DELETE 요청을 처리하는 API route 핸들러 함수를 정의합니다.request는 클라이언트에서 전달된
      요청객체이고, params는 URL의 매개변수를 담고 있습니다.

   3. const { listingId } = params; :params 객체에서 listingId를 추출합니다 

   4. if (!listingId || typeof listingId !== 'string') { throw new Error('Id가 일치하지 않습니다.')}
      :listingId가 없거나 문자열이 아니라면 에러를 발생시킵니다. 

   5. const listing = await prisma.listing.deleteMany({...})
      :Prisma를 사용하여 데이터베이스에서 로그인한 사용자가 소유한 listingId에 해당하는 숙박공간을 삭제합니다. 

   6. return NextResponse.json(listing) : 삭제된 숙박공간 정보를 JSON 형태로 반환합니다. 

   이 코드는 사용자가 소유한 숙박공간을 삭제하는 기능을 수행합니다.
   API route 핸들러 함수로써, 클라이언트가 DELETE 요청을 보내면 해당 요청을 처리하고 
   Prisma를 통해 데이터베이스에서 숙박공간을 삭제합니다.
   */
