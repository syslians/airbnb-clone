import EmptyState from "../components/EmptyState";
import FavoritesClient from "./FavoritesClient";
import ClientOnly from "../components/ClientOnly";

import getCurrentUser from "../actions/getCurrentUser";
import getFavoriteListings from "../actions/getFavoriteListings";

const ListingPage = async () => {
    const listings = await getFavoriteListings();
    const currentUser = await getCurrentUser();

    if (listings.length === 0) {
    return (
        <ClientOnly>
            <EmptyState
                title="좋아요하신 숙소가 없습니다."
                subtitle="맘에 드시는 숙소를 발견하시면 좋아요를 눌러주세요!"
            />
        </ClientOnly>
    )
  }

  return (
    <ClientOnly>
      <FavoritesClient 
        listings={listings}
        currentUser={currentUser}
      />  
    </ClientOnly>
  )
}

export default ListingPage;