import { create } from "zustand";

const BACKEND_URL = import.meta.env.VITE_APP_BACKEND_URL;

export type TScores<T extends string = string> = Record<T, number>;

export type TGameData = {
  player1: string;
  player2: string;
  wins: TScores | {};
  losses: TScores | {};
  draws: number;
  createdAt: Date;
};

export type TGameStore = {
  data: TGameData[] | null;
  isLoading: boolean;
  getHistories: () => void;
  saveGameHistory: (payload: TGameData[]) => void;
};

const gameStore = create<TGameStore>((set) => ({
  data: [],
  isLoading: false,
  getHistories: async () => {
    try {
      set({ isLoading: true });
      const response: Response = await fetch(
        `${BACKEND_URL}/api/v1/histories`,
        {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        }
      );
      const { data } = await response.json();
      set({ data, isLoading: false });
    } catch (error) {
      console.log(error);
      set({ isLoading: false });
    }
  },
  saveGameHistory: async (payload: TGameData[]) => {
    try {
      set({ isLoading: true });
      const response: Response = await fetch(
        `${BACKEND_URL}/api/v1/histories`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload[0]),
        }
      );

      console.log(response);
    } catch (error) {
      console.log(error);
      set({ isLoading: false });
    }
  },
}));

export default gameStore;
