import { useShallow } from 'zustand/react/shallow';
import { useGameStore } from '@/features/store/gameStore';
import { getRoundCount, getTotalScore } from '@/features/domain/scores';
import type { PlayerId } from '@/features/domain/types';

export function useGame() {
  const store = useGameStore(
    useShallow((s) => ({
      currentGame: s.currentGame,
      currentScores: s.currentScores,
      history: s.history,
      _hasRehydrated: s._hasRehydrated,
    }))
  );

  const roundCount = store.currentGame
    ? getRoundCount(store.currentScores)
    : 0;

  const totals: Record<PlayerId, number> = store.currentGame
    ? Object.fromEntries(
        store.currentGame.players.map((p) => [
          p.id,
          getTotalScore(store.currentScores, p.id),
        ])
      )
    : {};

  return {
    game: store.currentGame,
    scores: store.currentScores,
    history: store.history,
    roundCount,
    totals,
    isReady: store._hasRehydrated,
  };
}
