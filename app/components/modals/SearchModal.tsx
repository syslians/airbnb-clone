'use client';

import { formatISO } from 'date-fns';
import qs from 'query-string';
import useSearchModal from "@/app/hooks/useSearchModal";
import { useCallback, useMemo, useState } from "react";
import { Range } from 'react-date-range';

import Modal from "./Modal"
import CountrySelect, { CountrySelectValue } from "../inputs/CountrySelect";

import { useRouter, useSearchParams } from "next/navigation";
import dynamic from "next/dynamic";
import Heading from '../Heading';
import Calendar from '../inputs/Calendar';
import Counter from '../inputs/Counter';

enum STEPS {
  LOCATION = 0,
  DATE = 1,
  INFO = 2  
}


const SearchModal = () => {
  const router = useRouter();
  const params = useSearchParams();
  const searchModal = useSearchModal();

  const [location, setLocation] = useState<CountrySelectValue>()
  const [step, setStep] = useState(STEPS.LOCATION);
  const [guestCount, setGuestCount] = useState(1);
  const [roomCount, setRoomCount] = useState(1);
  const [bathroomCount, setBathroomCount] = useState(1);
  const [dateRange, setDateRange] = useState<Range>({
    startDate: new Date(),
    endDate: new Date(),
    key: 'selection' 
  });

  const Map = useMemo(() => dynamic(() => import('../Map'), {
    ssr: false,
  }), [location]);

  const onBack = useCallback(() => {
    setStep((value) => value -1);
  }, []);

  const onNext = useCallback(() => {
    setStep((value) => value + 1);
  }, []);

  const onSubmit = useCallback(async () => {
    if (step !== STEPS.INFO) {
        return onNext();
    }

    let currentQuery = {};

    if (params) {
        currentQuery = qs.parse(params.toString());
    }

    const updatedQuery: any = {
      ...currentQuery,
      locationValue: location?.value,
      guestCount,
      roomCount,
      bathroomCount  
    };

    if (dateRange.startDate) {
       updatedQuery.startDate = formatISO(dateRange.startDate);
    }

    if (dateRange.endDate) {
        updatedQuery.enDate = formatISO(dateRange.endDate);
    }

    const url = qs.stringifyUrl({
       url: '/',
       query: updatedQuery 
    }, { skipNull: true });

     setStep(STEPS.LOCATION);
     searchModal.onClose();

     router.push(url);
  }, 
  [
    step,
    searchModal,
    location,
    router,
    guestCount,
    roomCount,
    bathroomCount,
    dateRange,
    onNext,
    params
  ]);  

  const actionLabel = useMemo(() => {
    if (step === STEPS.INFO) {
       return 'Search'; 
    }

    return 'Next';
  }, [step]);  

  const secondaryActionLabel = useMemo(() => {
    if (step === STEPS.LOCATION) {
      return undefined; 
    }

    return 'Back';
  }, [step]);

  let bodyContent = (
    <div className="flex flex-col gap-8">
      <Heading
        title="어디를 가고 싶으신가요?"
        subtitle="최고의 장소를 찾아보세요!"
      />
      <CountrySelect 
        value={location}
        onChange={(value) => 
            setLocation(value as CountrySelectValue)
        }
      />
      <hr />
      <Map center={location?.latlng}  />
    </div>
  )

  if (step === STEPS.DATE) {
    bodyContent = (
       <div className="flex flex-col gap-8">
        <Heading 
           title="언제 가실 예정이신가요?"
           subtitle="일행과 일정이 맞을때가 적절합니다!"
        />
        <Calendar
           value={dateRange}
           onChange={(value) => setDateRange(value.selection)}
        />
       </div> 
    )
  }

  if (step === STEPS.INFO) {
    bodyContent = (
        <div className="flex flex-col gap-8">
          <Heading 
            title="More information"
            subtitle="최고의 장소를 찾아보세요!"
          />
          <Counter
            title="손님"
            subtitle="일행이 몇분이신가요?"
            value={guestCount}
            onChange={(value: any) => setGuestCount(value)}
          />
          <Counter
            title="방"
            subtitle="몇개의 방이 필요하신가요?"
            value={roomCount}
            onChange={(value: any) => setRoomCount(value)}
          />
          <Counter
            title="화장실"
            subtitle="몇개의 화장실이 필요하신가요?"
            value={bathroomCount}
            onChange={(value: any) => setBathroomCount(value)}
          />
        </div>
    )
  }
  
  return (
    <Modal
      isOpen={searchModal.isOpen}
      onClose={searchModal.onClose}
      onSubmit={onSubmit}
      title="Filters"
      actionLabel={actionLabel}
      secondaryActionLabel={secondaryActionLabel}
      secondaryAction={step === STEPS.LOCATION ? undefined : onBack}
      body={bodyContent}
    />
  );
}

export default SearchModal

/* 위 코드는 검색모달('SearchModal')을 정의하는 리액트 컴포넌트입니다.
   이 모달은 검색필터를 설정하기위해 사용됩니다.모달은 여러단계로 구성되어 있으며,
   각 단계에서 사용자는 검색조건을 설정할수 있습니다.
   
    1.enum STEPS {...} : 검색모달의 단계를 나타내는 열거형 STEP를 정의합니다. 
     각 단계는 LOCATION, DATE, INFO로 구성되어있습니다. 
    
    2. const SearchModal = () => { ... } : SearchModal 컴포넌트를 정의합니다. 

    3. const router = useRouter(); 
       Next/navigation 모듈에서 useRouter()를 사용하여 라우터 객체를 가져옵니다 

    4. const params = useSearchParams(); 
       next/navigation 모듈에서 useSearchParams()를 사용하여 URL 매개변수를 가져옵니다. 

    5. 상태관리에 필요한 여러변수들을 useState를 사용하여 선언합니다.
       이 변수들은 국가('location'), 단계('step'), 인원수('guestCount', 'roomCount', 'bathroomCount'),
       날짜범위('dateRange')를 나타냅니다.

    6. const Map = useMemo(() => import('../Map'), {...}), [location]);
       국가가 선택될때만 동적으로 Map 컴포넌트를 로드하기 위해 dynamic 함수를 사용하여
       동적으로 컴포넌트를 임포트합니다. 
    
    7. const onBack = useCallbackk(() -> {...}, []);
       이전 단계로 이동하기위한 콜백함수를 정의합니다. 

    8. const onNext = useCallback(() => {...}, []);
       다음단계로 이동하기위한 콜백함수를 정의합니다. 

    9. const onSubmit = useCallback(() => {...}, [...]);
       검색조건을 설정한 후 검색을 실행하는 콜백함수를 정의합니다.검색이 실행되면
       URL을 업데이트하고 모달을 닫습니다.

    10. const actionLabel = useMemo(() => {...}, [step]);
        현재 단계에 따라 액션레이블을 설정합니다.

    11. const secondaryActionLabel = useMemo(() => {...}, [step])
        현재단계에 따라 액션레이블을 설정합니다. 
    
    12. let bodyContent = (...) : 현재단계에 따라 모달 내용을 설정하는 변수를 선언합니다. 

    13. 각 단계에 따라 모달내용을 설정합니다.CountrySelect, Calendar, Counter 컴포넌트를 사용하여
        국가, 날짜범위, 인원수를 선택할 수 있도록합니다. 

    14. returnn (...) 최종적으로 Modal 컴포넌트를 렌더링합니다.모달은 isOpen 상태에 따라 열립니다. 
        사용자가 검색조건을 설정한 후 Search, Next버튼을 클릭하면 onSubmit 함수가 실행됩니다.
        또는 Back 버튼을 클릭하면 이전단계로 돌아갑니다. 

        이 컴포넌트는 검색조건을 설정하기 위한 모달을 정의하고 사용자가 각 단계에서 원하는검색조건을
        설정할 수 있도록합니다. 
   */