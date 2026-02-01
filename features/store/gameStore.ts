import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { Game, HistoryEntry, Player, PlayerId, Scores } from '@/features/domain/types';
import {
  createGame as createGameFromGame,
  addPlayer as addPlayerFromGame,
  restartWithSamePlayers,
  toHistoryEntry,
} from '@/features/domain/game';
import {
  initScoresForPlayers,
  addScore as addScoreFromScores,
  mergeScoresWithNewPlayers,
} from '@/features/domain/scores';

const STORAGE_KEY = '@scoreboard/store';

interface GameState {
  currentGame: Game | null;
  currentScores: Scores;
  history: HistoryEntry[];
  _hasRehydrated: boolean;
}

interface GameActions {
  createGame: (players: Player[]) => void;
  addPlayer: (name: string) => void;
  addScore: (playerId: PlayerId, points: number) => void;
  restartWithSamePlayers: () => void;
  clearCurrentGame: () => void;
  loadFromHistory: (entry: HistoryEntry) => void;
  finishAndSaveCurrentGame: () => void;
  setHasRehydrated: (value: boolean) => void;
}

type GameStore = GameState & GameActions;

const initialState: GameState = {
  currentGame: null,
  currentScores: {},
  history: [],
  _hasRehydrated: false,
};

export const useGameStore = create<GameStore>()(
  persist(
    (set, get) => ({
      ...initialState,

      createGame: (players: Player[]) => {
        const { currentGame, currentScores, history } = get();
        const game = createGameFromGame(players);
        const scores = initScoresForPlayers(players.map((p) => p.id));
        if (currentGame) {
          const entry = toHistoryEntry(currentGame, currentScores);
          set({
            history: [...history, entry],
            currentGame: game,
            currentScores: scores,
          });
        } else {
          set({ currentGame: game, currentScores: scores });
        }
      },

      addPlayer: (name: string) => {
        const { currentGame, currentScores } = get();
        if (!currentGame) return;
        const game = addPlayerFromGame(currentGame, name);
        const newPlayerId = game.players[game.players.length - 1].id;
        const existingIds = currentGame.players.map((p) => p.id);
        const scores = mergeScoresWithNewPlayers(currentScores, existingIds, [newPlayerId]);
        set({ currentGame: game, currentScores: scores });
      },

      addScore: (playerId: PlayerId, points: number) => {
        const { currentScores } = get();
        const scores = addScoreFromScores(currentScores, playerId, points);
        set({ currentScores: scores });
      },

      restartWithSamePlayers: () => {
        const { currentGame, currentScores, history } = get();
        if (!currentGame) return;
        const entry = toHistoryEntry(currentGame, currentScores);
        const game = restartWithSamePlayers(currentGame);
        const scores = initScoresForPlayers(game.players.map((p) => p.id));
        set({
          currentGame: game,
          currentScores: scores,
          history: [...history, entry],
        });
      },

      clearCurrentGame: () => {
        set({ currentGame: null, currentScores: {} });
      },

      loadFromHistory: (entry: HistoryEntry) => {
        set({
          currentGame: { ...entry.game, players: entry.game.players.map((p) => ({ ...p })) },
          currentScores: Object.fromEntries(
            Object.entries(entry.scores).map(([id, arr]) => [id, [...arr]])
          ),
        });
      },

      finishAndSaveCurrentGame: () => {
        const { currentGame, currentScores, history } = get();
        if (!currentGame) return;
        const entry = toHistoryEntry(currentGame, currentScores);
        // Si la partie était reprise depuis l'historique, elle y est déjà : on met à jour l'entrée au lieu d'ajouter un doublon.
        const existingIndex = history.findIndex((e) => e.game.id === currentGame.id);
        const newHistory =
          existingIndex >= 0
            ? [...history.slice(0, existingIndex), entry, ...history.slice(existingIndex + 1)]
            : [...history, entry];
        set({ history: newHistory, currentGame: null, currentScores: {} });
      },

      setHasRehydrated: (value: boolean) => {
        set({ _hasRehydrated: value });
      },
    }),
    {
      name: STORAGE_KEY,
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        currentGame: state.currentGame,
        currentScores: state.currentScores,
        history: state.history,
      }),
      onRehydrateStorage: () => (state) => {
        state?.setHasRehydrated(true);
      },
    }
  )
);
