import { IUserMessage } from "@/types";
import { create } from "zustand";
import { persist } from "zustand/middleware";


interface UserStore {
  currentUser: IUserMessage | null;
  setCurrentUser: (user: IUserMessage) => void;
  logout: () => void;
}

const useUserStore = create(
  persist<UserStore>(
    (set, get) => ({
      currentUser: null,
      setCurrentUser: (user) =>
        set({ currentUser: user }),
      logout: () => set({ currentUser: null }),
    }),
    { name: process.env.USER_DATA_STORE as string }
  )
);

export default useUserStore;
