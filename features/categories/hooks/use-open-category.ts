import { create } from "zustand"

type UseOpenCategory = {
    id?: string
    isOpen: boolean,
    onOpen: (id: string) => void,
    onClose: () => void,
}

export const useOpenCategory = create<UseOpenCategory>((set) => ({
    id: undefined,
    isOpen: false,
    onOpen: (id: string) => set({ isOpen: true, id }),
    onClose: () => set({ isOpen: false, id: undefined })
}))