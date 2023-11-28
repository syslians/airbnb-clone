'use client'; 

import axios from 'axios';
import { Range } from 'react-date-range';
import { useRouter } from 'next/navigation';
import { differenceInDays, eachDayOfInterval } from 'date-fns';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { SafeListing, SafeReservation, SafeUser } from '@/app/types';

import { categories } from '@/app/components/navbar/Categories';

import Container from '@/app/components/Container';
import ListingHead from '@/app/components/listings/ListingHead';
import ListingInfo from '@/app/components/listings/ListingInfo';
import useLoginModal from '@/app/hooks/useLoginModal';
import { toast } from 'react-hot-toast';
import ListingReservation from '@/app/components/listings/ListingReservation';

/* 초기 예약 구성을 위한 초기 날짜 범위 */
const initialDateRanges = {
  startDate: new Date(),
  endDate: new Date(),
  key: 'selection'
};

/* ListingClient 컴포넌트에 대한 Props */
interface ListingClientProps {
  reservations?: SafeReservation[];
  listing: SafeListing & { user: SafeUser };
  currentUser?: SafeUser | null;
}

/* ListingClient 컴포넌트 정의 */
const ListingClient: React.FC<ListingClientProps> = ({
    listing,
    reservations = [],
    currentUser
}) => {
  /* 로그인 모달 표시처리 커스텀 훅스와 라우터 훅스 */
  const loginModal = useLoginModal();
  const router = useRouter();


  /* 기존 예약을 기반으로 비활성화된 날짜를 계산합니다.Id에 해당하는 예약된 매물목록을 가져온 후*/
  /* forEach문을 예약된 매물들의 예약시작일자와, 종료일자를 조회하고, 해당하는 예약범위를 range에 할당합니다.  */
  /* range에 해당하는 날짜범위들은 예약이 불가능한 날짜로 disableDates입니다. */
  const disableDates = useMemo(() => {
    let dates: Date[] = [];

    reservations.forEach((reservations: any) => {
      /* 예약 시작일과 종료일 사이의 날짜 배열을 생성합니다 */
      const range = eachDayOfInterval({
        start: new Date(reservations.startDate),
        end: new Date(reservations.endDate)
      });

      dates = [...dates, ...range];
    });
    
    return dates;
  }, [reservations]);

  /* 라벨을 기반으로 카테고리를 찾습니다 */
  const category = useMemo(() => {
    return categories.find((item) => item.label === listing.category);
  }, [listing.category]);

  /* API 호출 중 로딩 상태, 예약 총 가격 상태, 예약 선택된 날짜 범위 관리 상태 */
  const [isLoading, setIsLoading] = useState(false);
  const [totalPrice, setTotalPrice] = useState(listing.price);
  const [dateRange, setDateRange] = useState<Range>(initialDateRanges);

  console.log("총가격 :",totalPrice);
  console.log("날짜범위 :",dateRange);

  /* 사용자가 없다면, 로그인 모달 오픈 */
  const onCreateReservation = useCallback(() => {
    if (!currentUser) {
      return loginModal.onOpen();
    }

    setIsLoading(true);

    /* 에약 생성을 위해 /api/reservations 엔드포인트로 POST(총가격, 시작일자, 종료일자, 리스트ID) 요청 */
    axios.post('/api/reservations', {
      totalPrice,
      startDate: dateRange.startDate,
      endDate: dateRange.endDate,
      listingId: listing?.id
    })
    .then(() => {
      /* API 요청 성공시, 예약성공 토스트 표시.날짜 범위 설정./trips 페이지로 이동 */
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

  /* 날짜 범위가 변경될 때 총가격을 다시 계산하는 useEffect.여기서 이틀을 하루로 계산하는 버그발생*/
  useEffect(() => {
    if (dateRange.startDate && dateRange.endDate) {
      const dayCount = differenceInDays(
        dateRange.endDate,
        dateRange.startDate
      ) + 1;

      /* 선택된 날짜 범위와 리스팅 가격을 기반으로 총 가격 계산.날 * 하룻밤 가격 */
      if (dayCount  && listing.price) {
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
        {/* 제목, 이미지 및 위치를 포함하는 ListingHead 컴포넌트를 표시합니다 */}
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
        {/* ListingInfo 컴포넌트를 표시합니다 */}
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
          {/* ListingReservation 컴포넌트를 표시합니다 */}
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