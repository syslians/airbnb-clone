'use client';

import useCountries from '@/app/hooks/useCountries';
import useSearchModal from '@/app/hooks/useSearchModal';
import { differenceInDays } from 'date-fns';
import { useSearchParams } from 'next/navigation';
import { useMemo } from 'react';
import { BiSearch } from 'react-icons/bi';

const Search = () => {
  const searchModal = useSearchModal();
  const params = useSearchParams();
  const { getByValue } = useCountries();

  const locationValue = params?.get('locationValue');
  const startDate = params?.get('startDate');
  const endDate = params?.get('endDate');
  const guestCount = params?.get('guestCount');

  const locationLabel = useMemo(() => {
     if (locationValue) {
      return getByValue(locationValue as string)?.label;
     }

     return '장소';
  }, [getByValue, locationValue]);

  const durationLabel = useMemo(() => {
    if (startDate && endDate) {
      const start= new Date(startDate as string);
      const end = new Date(endDate as string);
      let diff = differenceInDays(end, start);

      if (diff === 0) {
        diff = 1
      }

      return `${diff} Days`
    }

    return '날짜'
  }, [startDate, endDate]); 

  const guestLabel = useMemo(() => {
    if (guestCount) {
      return `${guestCount} 의 손님`;
    }
     
    return '손님 추가'; 
  }, [guestCount]);


  return (
    <div
      onClick={searchModal.onOpen}
      className="
        border-[1px]
        w-full
        md:w-auto
        py-2
        rounded-full
        shadow-sm
        hover:shadow-md
        transition
        cousor-pointer
      "
    >
     <div
      className="
      flex
      flex-row
      items-center
      justify-between
      "
     >
        <div
         className="
          text-sm
          font-semibold
          px-6
         "
        >
         {locationLabel}
        </div>
        <div
         className="
          hidden
          sm:block
          text-sm
          font-semibold
          px-6
          border-x-[1px]
          flex-1
          text-center
         "
        >
         {durationLabel}
        </div>
        <div
          className="
          text-sm
          pl-6
          pr-2
          text-gray-600
          flex
          flex-row
          items-center
          gap-3
          "
        >
        <div
          className="hidden sm:block">{guestLabel}</div>
        <div
         className="
          p-2
          bg-rose-500
          rounded-full
          text-white
         "
        >
         <BiSearch size={18} />
        </div>
        </div>
     </div>
    </div>
  )
}

export default Search

/*위 코드는 검색바를 정의하는 리액트 컴포넌트입니다.이 검색바는 사용자가 검색조건을 빠르게 확인하고 검색모달을
  열수 있도록 합니다.이 코드는 검색 바를 통해 사용자가 현재 설정된 검색 조건을 확인하고, 검색 모달을 열어 추가적인 검색 조건을 설정할 수 있도록 합니다.
  
  1. const searchModal = useSearchModal(); useSearchModal 훅을 사용하여 검색모달
     상태와 열기/닫기 메서드를 가져옵니다. 

  2. const { getByValue } = useCountries();: useCountries 훅을 사용하여 국가 목록과 getByValue 메서드를 가져옵니다.

  3. URL 매개변수로부터 locationValue, startDate, endDate, guestCount를 추출합니다.

  4. const locationLabel = useMemo(() => { ... }, [getByValue, locationValue]);: URL 매개변수에 따라 위치 라벨을 설정합니다. 
     getByValue를 사용하여 국가 코드를 라벨로 변환합니다.

  5. const durationLabel = useMemo(() => { ... }, [startDate, endDate]);: URL 매개변수에 따라 기간 라벨을 설정합니다. 
    시작 날짜와 종료 날짜를 이용하여 기간을 계산합니다.

  6. const guestLabel = useMemo(() => { ... }, [guestCount]);: URL 매개변수에 따라 손님 수 라벨을 설정합니다.

  7.검색 바를 렌더링합니다. 검색 바는 클릭하면 검색 모달이 열리도록 합니다.

  8. 검색 바의 디자인을 설정합니다. 위치 라벨, 기간 라벨, 손님 수 라벨을 표시합니다.

  9. 검색 아이콘을 클릭하면 검색 모달이 열리도록 합니다.
  */