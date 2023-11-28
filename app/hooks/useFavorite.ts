import axios from 'axios';
import { useRouter } from 'next/navigation';
import { useCallback, useMemo } from 'react';
import { toast } from 'react-hot-toast';

import { SafeUser } from '../types';

import useLoginModal from './useLoginModal';

interface IUseFavorite {
    listingId: string;
    currentUser?: SafeUser | null;
}

const useFavorite = ({ listingId, currentUser }: IUseFavorite) => {
  const router = useRouter();
  const loginModal = useLoginModal();

  const hasFavorited = useMemo(() => {
    /* 매개변수로받은 currentUser의 좋아요 누른 매물의 favoriteIds필드 검사.존재하면 list에 해당값을 할당하고, 없으면 빈 배열을 할당 */
    const list = currentUser?.favoriteIds || [];

    /* list.includes(listingId): 배열 list에 listingId가 포함되어 있는지를 확인합니다. 이 부분이 true이면 hasFavorited는 true가 되고, 그렇지 않으면 false가 됩니다. */
    return list.includes(listingId);
  }, [currentUser, listingId]);

  const toggleFavorite = useCallback(async (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation(); 

    if (!currentUser) {
      return loginModal.onOpen(); 
    }

    try {
      let request;

      /* hasFavorited가 true면 해당 매물이 이미 좋아요목록에 있다는 뜻으로 /api/favorites/${listingId} 엔드포인트로 삭제요청을 보냅니다. */
      if (hasFavorited) {
        request = () => axios.delete(`/api/favorites/${listingId}`);
      } else {
      /* hasFavorited가 false면 해당 매물이 이미 좋아요목록에 없다는 뜻으로 /api/favorites/${listingId} 엔드포인트로 생성요청을 보냅니다. */
        request = () => axios.post(`/api/favorites/${listingId}`);
      }

      await request();
      router.refresh();
      toast.success('성공!');
    } catch (error) {
      toast.error('Something went wrong'); 
    }
  },
   [currentUser, hasFavorited, listingId, loginModal, router]);

   return {
    hasFavorited, toggleFavorite
   }
}

export default useFavorite;