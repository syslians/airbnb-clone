
import getCurrentUser from "@/app/actions/getCurrentUser";
import getListingById from "@/app/actions/getListingById";
import getReservations from "@/app/actions/getReservations";

import ClientOnly from "@/app/components/ClientOnly";
import EmptyState from "@/app/components/EmptyState";

import ListingClient from "./ListingClient";

interface IParams {
  listingId?: string;
}

const ListingPage = async ({ params }: { params: IParams }) => {

  const listing = await getListingById(params);
  const reservations = await getReservations(params);
  const currentUser = await getCurrentUser();

  if (!listing) {
    return (
      <ClientOnly>
        <EmptyState />
      </ClientOnly>
    );
  }

  return (
    <ClientOnly>
      <ListingClient
        listing={listing}
        reservations={reservations}
        currentUser={currentUser}
      />
    </ClientOnly>
  );
}
 
export default ListingPage;

/*
위의 코드는 Next.js 프로젝트에서 사용되는 React 컴포넌트인 ListingPage를 보여주고 있습니다. 이 컴포넌트는 특정 listingId에 해당하는 리스트 페이지를 렌더링하는 역할을 합니다.

컴포넌트에서 사용된 주요 기능은 다음과 같습니다:

getCurrentUser(): 현재 로그인된 사용자의 정보를 가져오는 함수입니다.
getListingById(): listingId를 이용하여 특정 리스트 정보를 가져오는 함수입니다.
getReservations(): listingId를 이용하여 해당 리스트에 대한 예약 정보를 가져오는 함수입니다.
컴포넌트는 params 객체를 입력으로 받고, params 객체에는 listingId라는 속성이 있습니다. 이 listingId를 사용하여 위에서 설명한 세 개의 함수를 호출하고, 그 결과를 listing, reservations, currentUser 변수에 저장합니다.

만약 listing이 존재하지 않는 경우, 즉 해당 listingId에 해당하는 리스트 정보가 없는 경우, EmptyState 컴포넌트를 렌더링하여 "데이터가 없음"을 표시합니다.

그렇지 않은 경우, 즉 listing 정보가 있는 경우, ListingClient 컴포넌트를 렌더링합니다. 이때 listing, reservations, currentUser 변수를 ListingClient 컴포넌트로 전달하여 해당 리스트 페이지를 구성합니다.

컴포넌트 내부에서 ClientOnly 컴포넌트가 사용되고 있습니다. ClientOnly 컴포넌트는 클라이언트 측에서만 실행되는 컴포넌트를 렌더링하는데 사용됩니다. 이를 통해 서버 사이드 렌더링과 클라이언트 사이드 렌더링 간의 차이로 발생할 수 있는 이슈들을 방지합니다.

이렇게 ListingPage 컴포넌트는 params를 통해 특정 listingId를 받아와서 해당 리스트 정보와 예약 정보를 가져오고, 이를 ListingClient 컴포넌트로 전달하여 리스트 페이지를 완성하는 역할을 합니다.
*/