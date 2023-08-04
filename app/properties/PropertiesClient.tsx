'use client';

import { toast } from "react-hot-toast";
import axios from "axios";
import { useCallback, useState } from "react";
import { useRouter } from "next/navigation";

import { SafeListing, SafeUser } from "@/app/types";

import Heading from "@/app/components/Heading";
import Container from "@/app/components/Container";
import ListingCard from "@/app/components/listings/ListingCard";

interface PropertiesClientProps {
  listings: SafeListing[],
  currentUser?: SafeUser | null,
}

const PropertiesClient: React.FC<PropertiesClientProps> = ({
  listings,
  currentUser
}) => {
  const router = useRouter();
  const [deletingId, setDeletingId] = useState('');

  const onCancel = useCallback((id: string) => {
    setDeletingId(id);

    axios.delete(`/api/listings/${id}`)
    .then(() => {
      toast.success('리스트가 삭제되었습니다!');
      router.refresh();
    })
    .catch((error) => {
      toast.error(error?.response?.data?.error)
    })
    .finally(() => {
      setDeletingId('');
    })
  }, [router]);

  return (
    <Container>
      <Heading
        title="내 숙박"
        subtitle="당신의 등록된 숙박공간을 표시합니다."
      />
      <div 
        className="
          mt-10
          grid 
          grid-cols-1 
          sm:grid-cols-2 
          md:grid-cols-3 
          lg:grid-cols-4
          xl:grid-cols-5
          2xl:grid-cols-6
          gap-8
        "
      >
        {listings.map((listing: any) => (
          <ListingCard
            key={listing.id}
            data={listing}
            actionId={listing.id}
            onAction={onCancel}
            disabled={deletingId === listing.id}
            actionLabel="내 숙소 삭제"
            currentUser={currentUser}
          />
        ))}
      </div>
    </Container>
   );
}
 
export default PropertiesClient;

/* 위코드는 사용자의 소유한 숙박공간 목록을 표시하고, 숙박 공간을 삭제하는 기능을 
   제공하는 컴포넌트인 'PropertiesClient'를 정의합니다.

   1. interface PropertiesClientProps {...} :
   PropertiesClient 컴포넌트의 Props 타입을 정의합니다.
   listings와 currentUser가 Props로 전달되며, 각각 사용자의 숙박공간 목록과 현재
   로그인한 사용자의 정보를 담고있습니다.

   2. const PropertiesClient: React.FC<PropertiesClietProps> = ({...} => {...}) :
  PropertiesClient 컴포넌트를 정의합니다.Props 타입은 PropertiesClientProps로 지정되며,
  listing 와 currentUser를 Props로 받습니다

  3. const router = useRouter(); : Next.js의 라우터 객체를 router 변수로 가져옵니다. 

  4. const [deleteingId, setDeletingId] = useState('') : 삭제중인 숙박공간의 ID를 관리하기
     위한 deletingId 상태변수를 선언하고 초기값은 빈 문자열('')로 설정합니다. 

  5.const onCancel = useCallback((id: string) => {...}) : 삭제버튼클릭시 
    호출되는 onCancel 함수를 정의합니다.해당 숙박공간의 ID를 받아 삭제 요청을 보냅니다. 
    삭제중인 상태를 관리하고, 삭제 성공/실패에 따라 토스트 메시지를 표시합니다. 

  6. <Container>...</Container> : Container 컴포넌트로 전체 레이아웃을 감싸고 있습니다.

  7. </Heading> : Heading컴포넌트를 사용하여 제목과 부제목을 표시합니다. 

  8. <div className="grid...">...</div>  : CSS 그리드 레이아웃을 사용하여 
     숙박공간 카드들을 표시합니다.listings 배열을 순회하며 ListingCard 컴포넌트를 각각 렌더링합니다. 

  9. {listings.map((listing: any) => (...))} : listings 배열을 순회하여 각 숙박공간에 대한 정보를 ListingCard 
     컴포넌트에 전달하고 렌더링합니다. 

  10. <ListingCard ... /> : ListingCard 컴포넌트를 사용하여 숙박공간 정보를 카드로 표시합니다. 
     삭제기능을 사용자에게 제공하기 위해 onCancel 콜백과 관련상태를 전달합니다. 

  11. <ListingCard ... /> : ListingCard 컴포넌트를 사용하여 숙박공간 정보를 카드로 표시합니다. 
      삭제 기능을 사용자에게 제공하기 위해 onCancel 콜백과 관련상태를 전달합니다. 
*/
/* 이 코드는 사용자의 소유한 숙박 공간 목록을 표시하고, 삭제버튼을 통해 해당 숙박공간을 삭제하는 기능을 제공하는 PropertiesClient 컴포넌트를 정의합니다.*/