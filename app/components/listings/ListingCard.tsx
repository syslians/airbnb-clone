'use client';

import { useRouter } from 'next/navigation';
 
import useCountries from '@/app/hooks/useCountries';
import { SafeListing, 
         SafeReservation,
         SafeUser } from '@/app/types';
import { User } from '@prisma/client';

import { format } from 'date-fns';
import { useCallback, useMemo } from 'react';
import Image from 'next/image';
import HeartButton from '../HeartButton';
import Button from '../Button';

interface ListingCardProps {
    data: SafeListing;
    reservation?: SafeReservation;
    onAction?: (id: string) => void;
    disabled?: boolean;
    actionLabel?: string;
    actionId?: string;
    currentUser?: SafeUser | null; 
}

const ListingCard: React.FC<ListingCardProps> = ({
  data,
  reservation,
  onAction,
  disabled,
  actionLabel,
  actionId = '',
  currentUser
}) => {
  const router = useRouter();
  const { getByValue } = useCountries();

  const location = getByValue(data.locationValue);

  const handleCancel = useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      e.stopPropagation(); 

      if (disabled) {
        return;
      }

      onAction?.(actionId);
    }, [onAction, actionId, disabled]);

    const price = useMemo(() => {
      if (reservation) {
        return reservation.totalPrice;
      }

      return data.price;
    }, [reservation, data.price]);

    const reservationDate = useMemo(() => {
      if (!reservation) {
        return null;
      }

      const start = new Date(reservation.startDate);
      const end = new Date(reservation.endDate);

      return `${format(start, 'PP')} - ${format(end, 'PP')}`
    }, [reservation]);

  return (
    <div
    onClick={() => router.push(`/listings/${data.id}`)}
     className='col-span-1 cursor-pointer group'
    >
    <div className='flex flex-col gap-2 w-full'>
     <div
      className='
       aspect-square
       w-full
       relative
       overflow-hidden
       rounded-xl
      '
     >
        
      <Image 
        fill
        alt="Listing"
        src={data.imageSrc}
        className='
         object-cover
         h-full
         w-full
         group-hover:scale-110
         transition
        '
      />  
      <div className="absolute top-3 right-3">
        <HeartButton 
          listingId={data.id}
          currentUser={currentUser}
        />
      </div>
     </div>
     <div className="font-semibold text-lg">
        {location?.region}, {location?.label}
     </div>
     <div className="font-light text-neutral-500">
        {reservationDate || data.category}
     </div>
     <div className="flex flex-row items-center gap-1">
       <div className="font-semibold">
         $ {price}   
       </div>
       {!reservation && (
        <div className="font-light">하룻밤</div>
       )}
     </div>
     {onAction && actionLabel && (
        <Button 
          disabled={disabled}
          small
          label={actionLabel}
          onClick={handleCancel}
        />
     )}
    </div>
    </div>
  )
}

export default ListingCard;

/* 이 코드는 숙박 공간정보를 나타내는 카드형태의 컴포넌트인 ListingCard를 정의합니다.
   이 컴포넌트는 여러 속성들을 받아서 해당 숙박 공간에 대한 정보를 보여주고, 예약취소 기능을 포함할 수 있습니다.

1. import { useRourer } : Next.js에서 라우팅을 처리하는 useRourer 훅을 임포트합니다. 

2. import useCountries : useCountries 커스텀 훅을 임포트합니다.이 훅은 국가정보를 제공합니다. 

3. 다양한 타입들을 임포트합니다.예약, 숙박 공간, 사용자 등에 대한 안전한 타입정보가 있어야 합니다. 

4. import { format } : 날짜 포맷팅을 이해 data-fns 라이브러리에서 format 함수를 임포트합니다. 

5. import {useCallback, useMemo} : 리액트 훅을 임포트합니다. 

6. import Image : Next.js에서 제공하는 Image 컴포넌트를 임포트합니다.이미지 리소스를 렌더링하는데 사용됩니다. 

7. import HeartButton ,Button : 하트버튼과 일반버튼을 임포트합니다. 

8. interface ListingCardProps { ... } :ListingCard 컴포넌트의 Props를 정의하는 인터페이스 입니다. 
   이 컴포넌트는 숙박공간 정보, 예약정보, 예약취소기능, 버튼 활성화 여부 등을 포함하는 다양한 속성들을 받습니다. 

9. const ListingCard: React.FC<ListingCardProps> = ({ ... }) => { ... }
   ListingCard 컴포넌트를 정의합니다.이 컴포넌트는 ListingCardProps 타입의 Props를 받습니다. 

10. const router = useRouter(); : useRouter 훅을 사용하여 라우터 객체를 가져옵니다. 
    이 객체를 사용하여 클릭이벤트가 발생했을때 해당 숙박공간의 상세페이지로 이동하도록 라우팅작업을 수행할수 있습니다. 

11. const { getByValue } = useCountries(); : useCountries 훅으로부터 getByValue 함수를 가져와서 국가 정보를 조회하는데 사용합니다. 

12. const handleCancel = useCallback((e: React.MouseEvent<HTMLButtonElement>) => { ... }, [onAction, actionId, disabled])
    예약취소 기능을 처리하는 콜백함수인 handleCancel을 정의합니다.useCallback을 사용하여 콜백함수를 메모이제이션 하고, onAction, actionId, disabled를 의존성으로 설정하여
    콜백함수가 생성될 때마다 동일한 값들을 사용하도록 합니다. 

13. const price = useMemo(() => { ... }, [reservation, data.price])
    예약정보가 있으면 해당예약의 총 가격을 가져오고, 예약정보가 없는경우 숙박공간의 가격을 가져오는데 사용되는 price 상태변수를 선언합니다. 

14. const reservationDate = useMemo(() => { ... }, [reservation]);
    예약정보가 있으면 예약의 시작날짜와 끝 날짜를 형식화하여 문자열로 만드는 reservationDate 상태변수를 선언합니다. 

15. return (...) : ListingCard 컴포넌트의 렌더링 경과를 반환합니다. 

16. 클릭이벤트가 발생하면, router.push()를 호출하여 해당 숙박공간의 상세페이지로 이동하도록 설정합니다. 

17. 이미지를 보여주는데 사용되는 Image 컴포넌트를 렌더링합니다.또한 하트버튼을 보여주는 HeartButton 컴포넌트도 추가합니다. 

18. 숙박공간의 가격과 예약여부에 따라 가격과 night 텍스트를 보여줍니다. 

19. 숙박공간의 지역과 국가정보를 텍스트로 보여줍니다. 

20. onAction과 actionLabel이 있을경우에만 버튼을 렌더링합니다.버튼이 클릭되면 handleCancel 함수가 실행됩니다.disabled 상태에따라 버튼의
    활성화/비활성화 상태가 결정됩니다. 

   */