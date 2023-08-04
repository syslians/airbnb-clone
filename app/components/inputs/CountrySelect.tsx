'use client';

import Select from 'react-select'

import useCountries from '@/app/hooks/useCountries';

export type CountrySelectValue = {
  flag: string;
  label: string;
  latlng: number[],
  region: string;
  value: string
}

interface CountrySelectProps {
  value?: CountrySelectValue;
  onChange: (value: CountrySelectValue) => void;
}

const CountrySelect: React.FC<CountrySelectProps> = ({
  value,
  onChange
}) => {
  const { getAll } = useCountries();

  return ( 
    <div>
      <Select
        placeholder="Anywhere"
        isClearable
        options={getAll()}
        value={value}
        onChange={(value) => onChange(value as CountrySelectValue)}
        formatOptionLabel={(option: any) => (
          <div className="
          flex flex-row items-center gap-3">
            <div>{option.flag}</div>
            <div>
              {option.label},
              <span className="text-neutral-500 ml-1">
                {option.region}
              </span>
            </div>
          </div>
        )}
        
        classNames={{
          control: () => 'p-3 border-2',
          input: () => 'text-lg',
          option: () => 'text-lg'
        }}
        theme={(theme) => ({
          ...theme,
          borderRadius: 6,
          colors: {
            ...theme.colors,
            primary: 'black',
            primary25: '#ffe4e6'
          }
        })}
      />
    </div>
   );
}
 
export default CountrySelect;

/* 위 코드는 react-select 패키지를 사용하여 국가 선택을 위한 컴포넌트인
   CountrySelect를 정의합니다.
   이 코드는 react-select 패키지를 사용하여 국가 선택을 위한 CountrySelect 컴포넌트를 정의합니다. 
   컴포넌트는 드롭다운 메뉴를 생성하고, 선택된 국가 정보와 관련된 콜백 함수를 Props로 받습니다.
   
  1. Select 컴포넌트는 국가선택을 위한 드롭다운 메뉴를 
   생성하는데 사용합니다. 
   
  2.import useCountries from '@/app/hooks/useCountries';: 
   useCountries 커스텀 훅을 임포트합니다. 이 훅은 국가 목록과 관련된 데이터를 제공합니다.

  3. export type CountrySelectValue = { ... }:
    CountrySelect 컴포넌트에서 사용되는 CountrySelectValue 타입을 정의합니다. 이 타입은 국가 선택에 필요한 정보를 담고 있습니다.

  4. interface CountrySelectProps { ... }: CountrySelect 컴포넌트의 Props 타입을 정의합니다.
    value와 onChange가 Props로 전달되며, 각각 선택된 국가 정보와 국가 선택 시 호출되는 콜백 함수를 나타냅니다.

  5.const CountrySelect: React.FC<CountrySelectProps> = ({ ... }) => { ... }: CountrySelect 컴포넌트를 정의합니다.
   Props 타입은 CountrySelectProps로 지정되며, value와 onChange를 Props로 받습니다.

  6.const { getAll } = useCountries();: useCountries 커스텀 훅을 사용하여 getAll 함수를 가져옵니다. 이 함수를 통해 모든 국가 정보를 가져올 수 있습니다.

  7. <Select ... />: react-select의 Select 컴포넌트를 렌더링합니다. 이 컴포넌트를 사용하여 국가 선택 드롭다운 메뉴를 생성합니다.

  8. placeholder="Anywhere": 드롭다운 메뉴의 기본 안내 문구를 설정합니다.

  9. isClearable: 선택한 국가를 해제할 수 있도록 설정합니다.

  10. options={getAll()}: 드롭다운 메뉴의 옵션으로 모든 국가 정보를 전달합니다.

  11.value={value}: 현재 선택된 국가 정보를 설정합니다.

  12. onChange={(value) => onChange(value as CountrySelectValue)}: 국가 선택 시 호출되는 콜백 함수를 설정합니다. 선택된 국가 정보를 onChange 함수로 전달합니다.

  13.formatOptionLabel={(option: any) => ( ... )}: 드롭다운 메뉴의 각 옵션의 레이블을 커스텀 포맷으로 설정합니다. 국가의 국기, 국가명, 지역명을 함께 표시합니다.

  14. theme={(theme) => ({ ... })}: 드롭다운 메뉴의 테마를 커스텀으로 설정합니다. 테마의 borderRadius와 colors를 변경하여 디자인을 조정합니다.
   */