'use client';

import { signIn } from 'next-auth/react';
import axios from 'axios';
import { FcGoogle } from 'react-icons/fc';
import { useState, useCallback } from 'react';
import {
  FieldValues,
  SubmitHandler,
  useForm
} from 'react-hook-form';

import useRegisterModal from '@/app/hooks/useRegister';
import useLoginModal from '@/app/hooks/useLoginModal';

import { toast } from 'react-hot-toast';
import Button from '../Button';
import Heading from '../Heading';
import Input from '../inputs/Input';
import Modal from './Modal';
import { useRouter } from 'next/navigation';

const LoginModal = () => {
  const router = useRouter();

  const loginModal = useLoginModal();
  const registerModal = useRegisterModal();

  const [isLoading, setIsLoading] = useState(false);

  const { 
    register, 
    handleSubmit,
    formState: {
      errors,
    },
  } = useForm<FieldValues>({
    defaultValues: {
      email: '',
      password: ''
    },
  });


    /* 아래는 타입스크립트 형식으로 작성된 함수형 컴포넌트에서 사용되는 onSubmit함수*/
    /*'onSubmit함수는 SubmitHandler 함수로 정의되어있다.'*/
    /*SubmitHandler 는 FieldValues 라는 제너릭 타입을 받는 함수 타입으로,*/
    /*입력 폼을 제출할때 사용되는 핸들러 함수이다.*/
    /*FieldValues는 폼의 입력 필드값들을 포함하는 객체 타입.*/

    /*함수 내부에서 setIsLoading(true);코드를 통해 setIsLoading이라는 샹태를 true로 설정*/
    /*이를 통해 폼이 제출되는 동안 로딩중임을 나타낼수 있다.*/

    /*axios.post('/api/register', data)를 통해 POST 요청을 서버의 '/api/register' 엔드포인트로 보냄*/
    /*data는 입력 필드 값들을 담고있는 객체.즉, 사용자가 폼에 입력한 정보를 서버로 보내는 역할*/

    /*서버로의 POST 요청이 성공하면 .then() 블록이 실행됩니다. 여기서는 RegisterModal.onClose(); 코드를 통해 등록 모달(RegisterModal)을 닫는다*/
    /*서버로의 POST 요청이 실패하면 .catch() 블록이 실행됩니다. 여기서는 에러를 콘솔에 출력하는 console.log(error); 코드를 작성합니다.*/
    /*서버로의 POST 요청이 성공하던 실패하던, .finally() 블록이 실행됩니다. 이 블록에서는 setIsLoading(false); 코드를 통해 setIsLoading 상태를 다시 false로 설정합니다. 이를 통해 로딩 상태를 false로 바꾸어 폼 제출이 완료되었음을 나타냅니다.*/

    const onSubmit: SubmitHandler<FieldValues> = 
    (data) => {
      setIsLoading(true);
  
      signIn('credentials', { 
        ...data, 
        redirect: false,
      })
      .then((callback) => {
        setIsLoading(false);
  
        if (callback?.ok) {
          toast.success('로그인!');
          router.refresh();
          loginModal.onClose();
        }
        
        if (callback?.error) {
          toast.error(callback.error);
        }
      });
    }

    const bodyContent = (
      <div className="flex flex-col gap-4">
        <Heading
          title="방문해주셔서 감사합니다"
          subtitle="보유하신 계정으로 로그인해주세요"
        />
        <Input 
          id="email"
          label="Email"
          disabled={isLoading}
          register={register}
          errors={errors}
          required
        />
        <Input 
          id="password"
          type="password"
          label="Password"
          disabled={isLoading}
          register={register}
          errors={errors}
          required
        />
      </div>
    );

    const onToggle = useCallback(() => {
      loginModal.onClose();
      registerModal.onOpen();
    }, [loginModal, registerModal])

    const footerContent = (
      <div className="flex flex-col gap-4 mt-3">
        <hr />
        <Button 
          outline
          label="구글로 계속"
          icon={FcGoogle}
          onClick={() => signIn('google')}
        />
        <div
          className="
            text-neutral-500
            text-center
            mt-4
            font-light
          "
        >
          <div className="justify-center flex flex-row items-center gap-2">
            <div>에어비엔비 이용이 처음이신가요?</div>            
          </div>
          <div 
          onClick={onToggle}
          className="
            text-neutral-800
            cursor-pointer
            hover:underline
          ">
            <div>회원가입</div>            
          </div>
        </div>
      </div>
    )
 
    return(
        <Modal 
          disabled={isLoading}
          isOpen={loginModal.isOpen}
          title='로그인'
          actionLabel="다음"
          onClose={loginModal.onClose}
          onSubmit={handleSubmit(onSubmit)} 
          body={bodyContent}
          footer={footerContent}
        />
    );
}

export default LoginModal;