'use client';

import Avatar from "../Avatar";
import { IconType } from "react-icons";

import useCountries from "@/app/hooks/useCountries";
import { SafeUser } from "@/app/types";
import ListingCategory from "./ListingCategory";
import dynamic from "next/dynamic";

const Map = dynamic(() => import('../Map'), {
  ssr: false
});

interface ListingInfoProps {
    user: SafeUser;
    description: string;
    guestCount: number;
    roomCount: number;
    bathroomCount: number;
    category: {
      icon: IconType;
      label: string;
      description: string;
    } | undefined
    locationValue: string;
}

const ListingInfo: React.FC<ListingInfoProps> = ({
    user,
    description,
    guestCount,
    roomCount,
    bathroomCount,
    category,
    locationValue
}) => {
  const { getByValue } = useCountries();  

  const cordinates = getByValue(locationValue)?.latlng;

  return (
    <div className="col-span-4 flex flex-col gap-8">
      <div className="flex flex-col gap-2">
        <div className="
            text-xl
            font-semibold
            flex
            flex-row
            items-center
            gap-2
         "
        >
         <div>{user?.name}님의 게시</div>
         <Avatar src={user?.image} />
        </div>
        <div 
            className="
              flex
              flex-row
              items-center
              gap-4
              font-light
              text-neutral-500
            "
        >
         <div>
          수용가능한 손님 수{guestCount} 
         </div>
         <div>
            방 {roomCount}개
         </div>
         <div>
            화장실 {bathroomCount}개
         </div>
        </div>
      </div>
      <hr />
      {category && (
        <ListingCategory 
          icon={category.icon}
          label={category.label}
          description={category.description}
        />
      )}
      <hr />
      <div className="text-lg font-light text-neutral-500">
        {description}
      </div>
      <hr />
      <Map center={cordinates} />
    </div>
  )
}

export default ListingInfo