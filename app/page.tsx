import Container from "@/app/components/Container";
import ClientOnly from "./components/ClientOnly";
import EmptyState from "./components/EmptyState";

import getListings, { IListingsParams } from "./actions/getListing";
import ListingCard from "@/app/components/listings/ListingCard";
import getCurrentUser from "@/app/actions/getCurrentUser";

export const dynamic = 'force-dynamic';

interface HomeProps {
  searchParams: IListingsParams;
};

const Home = async ({ searchParams }: HomeProps) => {
  const listings = await getListings(searchParams);
  const currentUser = await getCurrentUser();
  console.log("메인화면 리스트 : ",listings);
  console.log("getCurrentUSer 결과 : ", currentUser);

  if (listings.length === 0) {
    return (
      <ClientOnly>
        <EmptyState showReset />
      </ClientOnly>
    );
  }


  return (
    <ClientOnly>
      <Container>
      <div className="
            pt-36
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
              currentUser={currentUser}
              key={listing.id}
              data={listing}
            />
          ))}
        </div>
      </Container>
    </ClientOnly>
      )
}

export default Home;