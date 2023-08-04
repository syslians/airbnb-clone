'use client';

import { AiFillHeart, AiOutlineHeart } from 'react-icons/ai';
import { SafeUser } from '../types';
import useFavorite from '../hooks/useFavorite';

interface HeartButtonProps {
    listingId: string;
    currentUser?: SafeUser | null;
}

const HeartButton: React.FC<HeartButtonProps> = ({
  listingId,
  currentUser
}) => {
  const { hasFavorited, toggleFavorite } = useFavorite({
    listingId,
    currentUser
  });

  return (
    <div
      onClick={toggleFavorite}
      className="
       relative
       hover:opacity-80
       transition
       cursor-pointer
      "
    >
      <AiOutlineHeart 
         size={28}
         className="
           fill-white
           absolute
           -top-[2px]
           -right-[2px]
         "
      />
     <AiFillHeart 
        size={24}
        className={
          hasFavorited ? 'fill-rose-500' : 'fill-neutral-500/70'
        }
     />
    </div>
  )
}

export default HeartButton;

/* 위 코드는 즐겨찾기(하트) 버튼을 나타내는 HeaertButton 컴포넌트를 정의하고
   있습니다.이 컴포넌트는 사용자가 특정 숙소를 즐겨찾기에 추가하거나 제거하는 기능을
   수행합니다.
1. 모듈 및 라이브러리 임포트:
- AiFillHeart, AiOutlineHeart: react-icons/ai에서 제공하는 하트 아이콘 컴포넌트들.
- SafeUser: 사용자 정보에 대한 타입으로, 타입스크립트에서 정의된 SafeUser 타입입니다.
- useFavorite: useFavorite라는 커스텀 훅을 가져옵니다.

2. HeartButtonProps 인터페이스 정의:
- listingId: string: 숙소의 ID를 나타내는 문자열 타입의 필수 매개변수입니다.
- currentUser?: SafeUser | null: 현재 로그인한 사용자의 정보를 나타내는 SafeUser 타입 또는 null일 수 있는 선택적 매개변수입니다.

3. HeartButton 컴포넌트 정의:
- useFavorite 훅을 사용하여 hasFavorited와 toggleFavorite를 가져옵니다.
- hasFavorited: 해당 숙소가 사용자의 즐겨찾기 목록에 있는지를 나타내는 불리언 값입니다.
- toggleFavorite: 사용자의 즐겨찾기 목록에 숙소를 추가하거나 제거하는 함수입니다.
  버튼을 클릭하면 toggleFavorite 함수가 실행됩니다.
- AiOutlineHeart: 빈 하트 아이콘을 나타냅니다. 크기는 28px로 지정되어 있습니다.
- AiFillHeart: 채워진 하트 아이콘을 나타냅니다. 크기는 24px로 지정되어 있습니다.
  hasFavorited 값에 따라 fill-rose-500 또는 fill-neutral-500/70 클래스가 할당되어 하트 아이콘의 색상이 변경됩니다. 만약 hasFavorited가 true라면 하트 아이콘의 색상이 분홍색으로 표시되고, false라면 흐린 회색으로 표시됩니다.
*/

/* 이렇게 구현된 HeartButton 컴포넌튼믄 사용자가숙소를 즐겨찾기에 추가하거나 제거하는 기능을 수행합니다.*/