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


/* 숙소를 등록시 단계들을 enum 열거형으로 정의합니다. */
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


  /* useForm<FieldValues>를 호출할 때 defaultValues를 사용하여 초기값을 설정하고, 호출된 결과를 구조 분해 할당을 통해 여러 변수에 할당하는 것이 이 코드의 핵심입니다.  */
   const { register, handleSubmit, setValue, watch, formState: { errors, }, reset } = useForm<FieldValues>({
    /* 각 필드의 기본값(초기값) 설정 */
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

   /* watch 함수를 사용하여 각 필드의 값들을 실시간으로 가져옵니다. */
   const category = watch('category'); 
   const location = watch('location');
   const guestCount = watch('guestCount');
   const roomCount = watch('roomCount');
   const bathroomCount = watch('bathroomCount');
   const imageSrc = watch('imageSrc');

   /* 지도 컴포넌트를 동적으로 import 합니다. */
   const Map = useMemo(() => dynamic(() => import('../Map'), {
    ssr: false
   }), [location]);

   /* setValue를 사용하여 필드에 값을 설정하는 함수.선택된  항목을 저장한다 */
   const setCustomValue = (id: string, value: any) => {
    setValue(id, value, {
      shouldValidate: true,
      shouldDirty: true,
      shouldTouch: true
    })
   }

   /* 이전 스텝으로 이동 */
  const onBack = () => {
    setStep((value) => value - 1);
  }

  /* 다음 스텝으로 이동 */
  const onNext = () => {
    setStep((value) => value + 1);
  }

  /* 마지막 등록 스텝이 아니라면 다음 스텝으로 이동 */
  const onSubmit: SubmitHandler<FieldValues> = (data) => {
    if (step !== STEPS.PRICE) {
      return onNext();
    }

    setIsLoading(true);

    /* /api/listings 엔드포인트로 입력된 form data를 axsios를 이용하여 post 전송 */
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
   
  /* 현재 스텝에따라 액션 레이블 설정 */
  const actinLabel = useMemo(() =>  {
    if (step === STEPS.PRICE) {
      return '생성';
    }

    return '다음';
  }, [step]);

  const secondaryActionLabel = useMemo(() => {
    if (step === STEPS.CATEGORY) {
      return undefined
    }

    return '뒤로'
  }, [step]);

  let bodyContent = (
    <div className="flex flex-col gap-8">
      <Heading
       title='어떤 설명이 당신의 장소를 설명하기에 적합한가요?'
       subtitle='카테고리를 선택하세요'
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
    title="에어비앤비 당신의 숙소"
    body={bodyContent}
    />
  )
}

export default RentModal;

