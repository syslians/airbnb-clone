import Container from '../Container';

import { IoDiamond } from 'react-icons/io5';
import { BsSnow } from 'react-icons/bs';
import { usePathname, useSearchParams } from 'next/navigation';
import { FaSkiing } from 'react-icons/fa';
import { GiBarn, GiBoatFishing, GiCactus, GiCastle, GiCaveEntrance, GiForestCamp, GiIsland, GiWindmill } from 'react-icons/gi';
import { MdOutlineVilla } from 'react-icons/md';
import { TbBeach, TbMountain, TbPool } from 'react-icons/tb';
import CategoryBox from '../CategoryBox';


export const categories = [
    {
     label: 'Beach',
     icon: TbBeach,
     description:  'This property is close to the beach!'
    },
    {
     label: 'Windmills',
     icon: GiWindmill,
     description:  'This property has windmills'
    },
    {
     label: 'Modern',
     icon: MdOutlineVilla,
     description:  'This property is modern'
    },
    {
     label: 'Countryside',
     icon: TbMountain,
     description:  'This property is in the countryside'
    },
    {
     label: 'Pools',
     icon: TbPool,
     description:  'This property is a pool'
    }, 
    {
     label: 'Island',
     icon: GiIsland,
     description:  'This property is on an island'
    },
    {
     label: 'Lake',
     icon: GiBoatFishing,
     description:  'This property is close to lake'
    }, 
    {
     label: 'Sking',
     icon: FaSkiing,
     description:  'This property has skiing activities'
    }, 
    {
     label: 'Castle',
     icon: GiCastle,
     description:  'This property is in a castle'
    },
    {
     label: 'Camping',
     icon: GiForestCamp,
     description:  'This property has camping activities'
    }, 
    {
     label: 'Arctic',
     icon: BsSnow,
     description:  'This property is camping activities'
    },
    {
     label: 'Cave',
     icon: GiCaveEntrance,
     description:  'This property is in a cave'
    },
    {
     label: 'Desert',
     icon: GiCactus,
     description:  'This property is in the desert'
    },
    {
     label: 'Barns',
     icon: GiBarn,
     description:  'This property is in the barn'
    },
    {
     label: 'Lux',
     icon: IoDiamond,
     description:  'This property is luxurios'
    },
]

const Categories = () => {
  const params = useSearchParams(); 
  const category = params?.get('category');
  const pathname = usePathname();

  const isMainPage = pathname === '/';
  
  if (!isMainPage) {
    return null;
  }

  return (
    <Container>
      <div
       className="
        pt-6
        flex
        felx-row
        items-center
        justify-between
        overflow-x-auto
       "
      >
      {categories.map((item) => (
        <CategoryBox 
          key={item.label}
          label={item.label} 
          selected={category === item.label}
          icon={item.icon}
        />
      ))}
      </div>
    </Container>
  )
}

export default Categories

/*
위 코드는 카터고리를 보여주는 컴포넌트인 Categories를 정의하고 있습니다.
코드에서 categories 객체는 카테고리 정보들을 담고 있는 배열로, 카테고리 라벨,
아이콘, 그리고 설명을 포함합니다.

1.컴포넌트 정의
- Categories : 카테고리를 보여주는 컴포넌트입니다.이 컴포넌트는 다음과 같은 동작을 수행합니다.
  - 현재 URL의 쿼리 파라미터를 가져와 category 변수에 저장합니다. 
  - 현재 페이지 경로를 가져와 pathname 변수에 저장합니다.
  -만약 pathname 이 메인페이지('/')가 아니라면, null을 반환하여 해당 컴포넌트를 렌더링하지 않습니다 

2. URL 파라미터 및 경로 처리
- useSearchParams() : next/navigation 에서 제공하는 훅으로, 
  현재 URL의 쿼리파라미터를 가져옵니다. 
- params?.get('category'):URL의 category 쿼리 파라미터 값을 가져옵니다.만약 해당 파라미터가 존재하지 않으면
  null을 반환합니다. 
- usePathname() : next/navigation 에서 제공하는 훅으로, 현재 페이지의 경로를 가져옵니다. 
- pathname === '/' ; pathname이 메인페이지 '/' 인지 비교하여 isMainPage 변수에 결과를 저장합니다. 

3. 조건부 렌더링
- Container 컴포넌트 내부에서 카테고리 박스들을 렌더링합니다
- categories.map((item) => ...) 을 통해 categories 배열의 각 요소를 순회하면서 카테고리 박스들을 렌더링합니다
- CategoryBox 컴포넌트에 각각의 카테고리정보 (item.label, item.icon) 와 선택여부 (selected) 를 전달합니다. 

이렇게 구현된 Categories 컴포넌트는 메인 페이지에서만 동작하며,카테고리 박스들을 렌더링하는 역할을 합니다
메인 페이지가 아닌 경우 해당 컴포넌트는 렌더링되지 않습니다
*/