import { useShallow } from 'zustand/react/shallow';
import { useGameStore } from '@/features/store/gameStore';
import { getRoundCount, getTotalScore } from '@/features/domain/scores';
import type { HistoryEntry, PlayerId } from '@/features/domain/types';

/** Dernière partie affichée sur le home (en cours ou dernière enregistrée). */
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

  const lastHistoryEntry: HistoryEntry | null =
    store.history.length > 0
      ? store.history[store.history.length - 1]
      : null;

  const lastGame = store.currentGame ?? lastHistoryEntry?.game ?? null;

  /** Liste pour l'écran Historique : partie en cours en premier (si elle existe), puis tout l'historique, sans doublon. */
  const historyForList: HistoryEntry[] = store.currentGame
    ? [
        {
          game: store.currentGame,
          scores: store.currentScores,
          finishedAt: '',
        },
        ...store.history.filter((e) => e.game.id !== store.currentGame!.id),
      ]
    : store.history;

  return {
    game: store.currentGame,
    /** Dernière partie (home) pour l’affichage home. */
    lastGame,
    /** Entrée historique quand lastGame vient de l’historique (null sinon). */
    lastGameHistoryEntry: store.currentGame ? null : lastHistoryEntry,
    scores: store.currentScores,
    history: store.history,
    /** Historique pour l'écran liste : inclut la partie en cours en premier, puis toutes les parties passées. */
    historyForList,
    roundCount,
    totals,
    isReady: store._hasRehydrated,
  };
}
