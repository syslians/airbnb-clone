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

// 단계를 정의하는 열거형 (enum)입니다.차례대로 위치, 날짜, 상세정보 순으로 나열됩니다.
enum STEPS {
  LOCATION = 0,
  DATE = 1,
  INFO = 2  
}

// SearchModal 컴포넌트를 정의합니다.
const SearchModal = () => {
  // Next.js의 useRouter 및 useSearchParams 훅을 사용하여 라우터와 쿼리 파라미터를 가져옵니다.
  const router = useRouter();
  const params = useSearchParams();
  const searchModal = useSearchModal();

  // 컴포넌트의 상태를 정의합니다.
  const [location, setLocation] = useState<CountrySelectValue>();
  const [step, setStep] = useState(STEPS.LOCATION);
  const [guestCount, setGuestCount] = useState(1);
  const [roomCount, setRoomCount] = useState(1);
  const [bathroomCount, setBathroomCount] = useState(1);
  const [dateRange, setDateRange] = useState<Range>({ startDate: new Date(), endDate: new Date(), key: 'selection' });

  // 지도 컴포넌트를 동적으로 로드하기 위해 dynamic 함수를 사용합니다.
  const Map = useMemo(() => dynamic(() => import('../Map'), { ssr: false }), [location]);

  // 이전 단계로 이동하는 함수입니다.
  const onBack = useCallback(() => {
    setStep((value) => value - 1);
  }, []);

  // 다음 단계로 이동하는 함수입니다.
  const onNext = useCallback(() => {
    setStep((value) => value + 1);
  }, []);

  // 폼 제출 시 실행되는 함수입니다.
  const onSubmit = useCallback(async () => {
    // INFO 단계가 아닌 경우 다음 단계로 이동합니다.
    if (step !== STEPS.INFO) {
        return onNext();
    }

    // 현재 쿼리 파라미터를 가져와서 업데이트합니다.
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

    // 시작일과 종료일이 존재하는 경우 ISO 형식으로 변환하여 업데이트합니다.
    if (dateRange.startDate) {
       updatedQuery.startDate = formatISO(dateRange.startDate);
    }

    if (dateRange.endDate) {
        updatedQuery.endDate = formatISO(dateRange.endDate);
    }

    // 쿼리 파라미터를 포함한 URL을 생성합니다.
    const url = qs.stringifyUrl({
       url: '/',
       query: updatedQuery 
    }, { skipNull: true });

    // 상태와 모달을 초기화하고 URL을 업데이트합니다.
    setStep(STEPS.LOCATION);
    searchModal.onClose();
    router.push(url);
  }, [step, searchModal, location, router, guestCount, roomCount, bathroomCount, dateRange, onNext, params]);  

  // 액션 및 보조 액션 레이블을 정의합니다.
  const actionLabel = useMemo(() => {
    return step === STEPS.INFO ? '검색' : '다음';
  }, [step]);

  const secondaryActionLabel = useMemo(() => {
    return step === STEPS.LOCATION ? undefined : '뒤로';
  }, [step]);

  // 현재 단계에 따라서 본문 컨텐츠를 설정합니다.
  let bodyContent = (
    <div className="flex flex-col gap-8">
      {/* 위치 설정 단계의 제목 및 부제목 */}
      <Heading
        title="어디를 가고 싶으신가요?"
        subtitle="최고의 장소를 찾아보세요!"
      />
      {/* 국가 선택 컴포넌트 */}
      <CountrySelect 
        value={location}
        onChange={(value) => setLocation(value as CountrySelectValue)}
      />
      <hr />
      {/* 지도 컴포넌트 */}
      <Map center={location?.latlng} />
    </div>
  );

  // 날짜 선택 단계인 경우
  if (step === STEPS.DATE) {
    bodyContent = (
       <div className="flex flex-col gap-8">
        {/* 날짜 선택 단계의 제목 및 부제목 */}
        <Heading 
           title="언제 가실 예정이신가요?"
           subtitle="일행과 일정이 맞을때가 적절합니다!"
        />
        {/* 캘린더 컴포넌트 */}
        <Calendar
           value={dateRange}
           onChange={(value) => setDateRange(value.selection)}
        />
       </div> 
    );
  }

  // 정보 입력 단계인 경우
  if (step === STEPS.INFO) {
    bodyContent = (
        <div className="flex flex-col gap-8">
          {/* 정보 입력 단계의 제목 및 부제목 */}
          <Heading 
            title="More information"
            subtitle="최고의 장소를 찾아보세요!"
          />
          {/* 인원, 방, 화장실 수를 선택하는 컴포넌트 */}
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
    );
  }
  
  // 모달 컴포넌트를 반환합니다.
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

export default SearchModal;
