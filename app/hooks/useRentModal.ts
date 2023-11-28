import { create } from 'zustand';

/* RentModalStore의 필드들으 초기값들을 세팅 */
interface RentModalStore {
    isOpen: boolean;
    onOpen: () => void;
    onClose: () => void;
}

/* useRentModal 함수 정의.isOpen의 초기값은 false로 닫혀있는 상태가 기본. */
/* onOpen()이 호출되면 isOpen이 true로 세팅되어 Modal이 열리는 것이고, onClose가 호출되면 false가 되며 모달이 닫히는 것. */
const useRentModal = create<RentModalStore>((set) => ({
    isOpen: false,
    onOpen: () => set({ isOpen: true }),
    onClose: () => set({ isOpen: false }),
}));

export default useRentModal;