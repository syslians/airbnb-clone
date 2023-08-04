'use client'; 

import axios from 'axios';
import { Range } from 'react-date-range';
import { useRouter } from 'next/navigation';
import { differenceInCalendarDays, eachDayOfInterval } from 'date-fns';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { SafeListing, SafeReservation, SafeUser } from '@/app/types';

import { categories } from '@/app/components/navbar/Categories';

import Container from '@/app/components/Container';
import ListingHead from '@/app/components/listings/ListingHead';
import ListingInfo from '@/app/components/listings/ListingInfo';
import useLoginModal from '@/app/hooks/useLoginModal';
import { toast } from 'react-hot-toast';
import ListingReservation from '@/app/components/listings/ListingReservation';

const initialDateRanges = {
  startDate: new Date(),
  endDate: new Date(),
  key: 'selection'
};

interface ListingClientProps {
  reservations?: SafeReservation[];
  listing: SafeListing & { user: SafeUser };
  currentUser?: SafeUser | null;
}

const ListingClient: React.FC<ListingClientProps> = ({
    listing,
    reservations = [],
    currentUser
}) => {
  const loginModal = useLoginModal();
  const router = useRouter();

  const disableDates = useMemo(() => {
    let dates: Date[] = [];

    reservations.forEach((reservations: any) => {
      const range = eachDayOfInterval({
        start: new Date(reservations.startDate),
        end: new Date(reservations.endDate)
      });

      dates = [...dates, ...range];
    });
    
    return dates;
  }, [reservations]);

  const category = useMemo(() => {
    return categories.find((item) => item.label === listing.category);
  }, [listing.category]);

  const [isLoading, setIsLoading] = useState(false);
  const [totalPrice, setTotalPrice] = useState(listing.price);
  const [dateRange, setDateRange] = useState<Range>(initialDateRanges);

  const onCreateReservation = useCallback(() => {
    if (!currentUser) {
      return loginModal.onOpen();
    }

    setIsLoading(true);

    axios.post('/api/reservations', {
      totalPrice,
      startDate: dateRange.startDate,
      endDate: dateRange.endDate,
      listingId: listing?.id
    })
    .then(() => {
      toast.success('리스트가 예약되었습니다!');
      setDateRange(initialDateRanges);
      router.push('/trips');
    })
    .catch(() => {
      toast.error('Something went wrong!');
    })
    .finally(() => {
      setIsLoading(false);
    })
  }, [totalPrice, dateRange, listing?.id, router, currentUser, loginModal]);

  useEffect(() => {
    if (dateRange.startDate && dateRange.endDate) {
      const dayCount = differenceInCalendarDays(
        dateRange.endDate,
        dateRange.startDate
      );

      if (dayCount && listing.price) {
        setTotalPrice(dayCount * listing.price);
      } else {
        setTotalPrice(listing.price);
      }
    }
  }, [dateRange, listing.price]);  

  return (
    <Container>
     <div className='max-w-screen-lg mx-auto'>
      <div className='flex flex-col gap-6'>
       <ListingHead 
         title={listing.title}
         imageSrc={listing.imageSrc}
         locationValue={listing.locationValue}
         id={listing.id}
         currentUser={currentUser}
       />
       <div className='
         grid
         grid-cols-1
         md:grid-cols-7
         md:gap-10
         mt-6
       '>
        <ListingInfo 
          user={listing.user}
          category={category}
          description={listing.description}
          roomCount={listing.roomCount}
          guestCount={listing.guestCount}
          bathroomCount={listing.bathroomCount}
          locationValue={listing.locationValue}
        />
        <div
          className='
           order-first
           mb-10
           md:order-last
           md:col-span-3 
          '
        >
          <ListingReservation 
            price={listing.price}
            totalPrice={totalPrice}
            onChangeDate={(value) => setDateRange(value)}
            dateRange={dateRange}
            onSubmit={onCreateReservation}
            disabled={isLoading}
            disabledDates={disableDates}
          />
        </div>
       </div>
      </div>
     </div>   
    </Container>
  );
}

export default ListingClient;

/* 위 코드는 숙박예약 기능을 제공하는 컴포넌트인 ListClient를 정의합니다.*/

/*
1. Props :
    - listing: SafeListing & {user:SafeUser} - 숙박공간의 정보와 사용자 정보를 포함하는 객체입니다
    - reservation: Rerservation[](선택적) - 숙박예약 정보를 담고 있는 배열입니다
    - currentUser: SafeUser | null(선택적) - 현재 로그인한 사용자 정보를 포함하는 객체 또는 null 입니다

2. 기능 :
    - disableDates: 예약된 날짜들을 제어하는 배열입니다.reservations 배열을 사용하여 예약된 날짜들을 뽑아옵니다
    - isLoading: 예약생성 요청이 진행중인지를 나타내는 상태변수입니다
    - totalPrice: 선택한 날짜범위에 따른 총 가격을 나타내는 변수입니다
    - dateRange: 사용자가 선택한 날짜범위를 나타내는 상태변수입니다
    - onCreateReservation: 예약을 생성하는 함수입니다.현재로그인한 상태를 확인하고, 입력한 정보를 서버로 전송하여 예약을 만듭니다
    - useEffect: 날짜범위가 변경될때마다 총 가격을 업데이트 하는데 사용됩니다.
    - useMemo: 숙박 공간 카테고리를 확인하고 선택된 숙박공간의 카테고리 정보를 반환합니다
    - 렌더링: Listing-Head,ListingInfo 및 ListingReservation 컴포넌트를 렌더링합니다
      ListingReservation 컴포넌트에서 사용자가 예약정보를 입력하고 예약을 생성할 수 있습니다
*/

/*컴포넌트의 렌더링 결과는 숙박 공간의 정보, 이미지 위치, 예약 기능 날짜 범위등을 보여주고, 사용자가 예약정보를 선택하고
  예약을 생성할 수 있는 인터페이스를 제공합니다.이 컴포넌트를 사용하려면 SafeListing, SafeUser, 그리고 Reservation
  과 같은 타입들을 임포트 해야 합니다.또한 해당 컴포넌트의 상위 컴포넌트에 사용자 정보를 전달하여 현재 로그인 상태를 확인할 수 있도록 해야 합니다.*/