'use client';

import { useMemo, useState } from 'react';
import { FieldValues, SubmitHandler, useForm } from 'react-hook-form';

import useRentModal from '@/app/hooks/useRentModal';

import dynamic from 'next/dynamic';
import Heading from '../Heading';
import CategoryInput from '../inputs/CategoryInput';
import Counter from '../inputs/Counter';
import CountrySelect from '../inputs/CountrySelect';
import { categories } from '../navbar/Categories';
import ImageUpload from '../inputs/ImageUpload';
import Modal from './Modal';
import Input from '../inputs/Input';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { useRouter } from 'next/navigation';

enum STEPS {
  CATEGORY = 0,
  LOCATION = 1,
  INFO = 2,
  IMAGES = 3,
  DESCRIPTION = 4,
  PRICE = 5,
}

const RentModal = () => {
  const rentModal = useRentModal();
  const router = useRouter();

  const [step, setStep] = useState(STEPS.CATEGORY);
  const [isLoading, setIsLoading] = useState(false);

   const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: {
      errors,
    },
    reset
   } = useForm<FieldValues>({
    defaultValues: {
       category: '',
       location: null,
       guestCount: 1,
       roomCount: 1,
       bathroomCount: 1,
       imageSrc:  '',
       price:  1,
       title: '',
       description: ''
     }
   });

   const category = watch('category'); 
   const location = watch('location');
   const guestCount = watch('guestCount');
   const roomCount = watch('roomCount');
   const bathroomCount = watch('bathroomCount');
   const imageSrc = watch('imageSrc');

   const Map = useMemo(() => dynamic(() => import('../Map'), {
    ssr: false
   }), [location]);

   const setCustomValue = (id: string, value: any) => {
    setValue(id, value, {
      shouldValidate: true,
      shouldDirty: true,
      shouldTouch: true
    })
   }

  const onBack = () => {
    setStep((value) => value - 1);
  }

  const onNext = () => {
    setStep((value) => value + 1);
  }

  const onSubmit: SubmitHandler<FieldValues> = (data) => {
    if (step !== STEPS.PRICE) {
      return onNext();
    }

    setIsLoading(true);

    axios.post('/api/listings', data)
      .then(() => {
        toast.success('Listing Created!');
        router.refresh();
        reset();
        setStep(STEPS.CATEGORY);
        rentModal.onClose();
      })
      .catch(() => {
        toast.error('오류발생!');
      }).finally(() => {
        setIsLoading(false);
      })
  }
   
  const actinLabel = useMemo(() =>  {
    if (step === STEPS.PRICE) {
      return 'Create';
    }

    return 'Next';
  }, [step]);

  const secondaryActionLabel = useMemo(() => {
    if (step === STEPS.CATEGORY) {
      return undefined
    }

    return 'Back'
  }, [step]);

  let bodyContent = (
    <div className="flex flex-col gap-8">
      <Heading
       title='which of these best describes your place?'
       subtitle='Pick a category'
      />
      <div  
        className="
          grid
          grid-cols-1
          md:grid-cols-2
          gap-3
          max-h-[50vh]
          overflow-y-auto
        "
      >
       {categories.map((item) => (
        <div key={item.label} className='col-span-1'>
          <CategoryInput
           onClick={(category) => setCustomValue('category', category)}
           selected={category === item.label}
           label={item.label}
           icon={item.icon}
          />
        </div>
       ))}
      </div>
    </div>
  )

  if (step === STEPS.LOCATION) {
    bodyContent = (
      <div className="flex flex-col gap-8">
        <Heading 
         title='당신의 숙소는 어디에 위치합니까?'
         subtitle='손님들이 당신을 찾을수있게 도와주세요!'
        />
        <CountrySelect 
          value={location}
          onChange={(value) => setCustomValue('location', value)} 
        />
        <Map 
          center={location?.latlng}
        />
      </div>
    )
  }

  if (step === STEPS.INFO) {
    bodyContent = (
      <div className="flex flex-col gap-8">
        <Heading 
         title="당신의 숙소에 대한 몇가지 기본사항들을 공유합니다"
         subtitle="당신은 어떤 편의시설을 가지고 계십니까?"
        />
        <Counter 
          title="손님 수" 
          subtitle="손님을 얼마나 수용할수 있을까요?"
          value={guestCount}
          onChange={(value) => setCustomValue('guestCount' , value)}
        />
        <hr />
        <Counter 
          title="방" 
          subtitle="숙소에 방이 얼마나 있을까요?"
          value={roomCount}
          onChange={(value) => setCustomValue('roomCount' , value)}
        />
        <hr />
        <Counter 
          title="화장실" 
          subtitle="숙소에 화장실이 얼마나 있을까요?"
          value={bathroomCount}
          onChange={(value) => setCustomValue('bathroomCount' , value)}
        />
      </div>
    )
  }

  if (step === STEPS.IMAGES) {
    bodyContent = (
      <div className="flex flex-col gap-8">
        <Heading 
         title="숙소의 사진을 추가해주세요"
         subtitle="손님들에게 숙소를 보여주세요!"
        />
        <ImageUpload 
          value={imageSrc}
          onChange={(value) => setCustomValue('imageSrc', value)}
        />
      </div>
    )
  }

  if (step === STEPS.DESCRIPTION) {
    bodyContent = (
      <div className="flex flex-col gap-8">
        <Heading 
         title="당신의 멋진 숙소를 설명해주세요!"
         subtitle="장점은 살리되 짧고 간결하게 적어주세요 "
        />
        <Input
          id='title'
          label='Title'
          disabled={isLoading}
          register={register}
          errors={errors}
          required
        />
        <hr />
        <Input
          id='description'
          label='Description'
          disabled={isLoading}
          register={register}
          errors={errors}
          required
        />
      </div>
    )
  }

  if (step === STEPS.PRICE) {
    bodyContent = (
     <div className="flex flex-col gap-8">
      <Heading 
       title="이제, 가격을 설정해주세요" 
       subtitle="하룻밤에 얼마인가요?"
      />
      <Input 
       id="price"
       label="가격"
       formatPrice
       type="number"
       disabled={isLoading}
       register={register}
       errors={errors}
       required
      />
     </div>
    )
  }

  return (
    <Modal 
    isOpen={rentModal.isOpen}
    onClose={rentModal.onClose}
    onSubmit={handleSubmit(onSubmit)}
    actionLabel={actinLabel}
    secondaryActionLabel={secondaryActionLabel}
    secondaryAction={step === STEPS.CATEGORY ? undefined : onBack}
    title="airbnb your home"
    body={bodyContent}
    />
  )
}

export default RentModal;

/*
위 코드는 에어비엔비 스타일의 모달을 구현하는 RentModal 컴포넌트입니다
이 모달은 사용자가 자신의 숙소를 등록하기 위한 여러 단계롤 구성되어 있으며,
각 단계별로 필요한 정보를 입력받습니다

1. 모듈 및 라이브러리 임포트
- useMemo , useState : React의 훅으로 상태를 관리하고 메모이제이션을 할 때 사용합니다
- useForm , FieldValues : react-hook-form 라이브러리의 훅으로 폼관리를 위해 사용합니다
- useRentModal : 커스텀 훅으로 모달의 상태를 관리하는 훅 입니다

2. RentModal 컴포넌트 정의
- enum STEPS : 다양한 스텝들을 나타내는 열거형입니다
- useState(STEPS.CATEGORY) : 상태 훅을 사용하여 현재 진행중인 스탭을 관리합니다
  초기값은 STEPS.CATEGORY 로 설정됩니다

3. 폼 관리 훅 사용
- useForm : react-hook-form 훅을 사용하여 폼 관리를 시작합니다
- defaultValues 에는 각 필드의 기본값이 설정되어 있습니다

4. actionLabel 및 secondaryActionLabel 계산
- useMemo : 메모이제이션을 통해 계산된 값들을 캐싱하여 성능을 최적화합니다
- actionLabel1 : 현재 스텝에따라 다른 레이블을 반환합니다.스텝이 STEPS.CATEGORY인 경우
  undefined를, 그 외에는 Back을 반환합니다

5. bodyContent 구성
- bodyContent : 현재 스텝에 따라 모달의 본문 내용을 설정합니다
  초기 값은 카테고리 선택('STEPS.CATEGOEY')스텝에 해당하는 내용입니다
- CountrySelect 과 카테고리 선택을 이한 CategoryInput 컴포넌트들이 렌더링 됩니다

6. 모달 렌더링
- Modal : 본문 내용('bodyContent')을 포함하여 모달을 렌더링 합니다
- 모달은 에어비엔비 스타일의 모달로싸, 상태값과 액션 함수들을 모달 컴포넌트에 전달하여 렌더링 합니다

이렇게 구현된 RentModal 컴포넌트는 에어비엔비 스타일의 숙소 등록 모달을 다단계로 나누어 구성하고,
각 단계별로 필요한 정보들을 입력받는 기능을 갖추고 있습니다

*/