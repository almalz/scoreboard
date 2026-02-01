import { useCallback } from "react";
import { useRouter } from "expo-router";
import { useGame } from "./useGame";
import { useGameActions } from "./useGameActions";

/** Handlers pour LastGameCard : encapsule la logique sans notion de partie terminée. */
export function useLastGameHandlers() {
  const router = useRouter();
  const { lastGame, lastGameHistoryEntry } = useGame();
  const { restartWithSamePlayers, loadFromHistory, createGame } = useGameActions();

  const handleResume = useCallback(() => {
    if (lastGameHistoryEntry) {
      loadFromHistory(lastGameHistoryEntry);
    }
    router.push("/game");
  }, [lastGameHistoryEntry, loadFromHistory, router]);

  const handleRestartSame = useCallback(() => {
    if (lastGameHistoryEntry) {
      createGame(lastGameHistoryEntry.game.players);
    } else {
      restartWithSamePlayers();
    }
    router.push("/game");
  }, [lastGameHistoryEntry, createGame, restartWithSamePlayers, router]);

  /** Voir la partie en lecture seule : historique ou vue courante. */
  const handleView = useCallback(() => {
    if (lastGameHistoryEntry) {
      router.push(`/history/${lastGameHistoryEntry.game.id}`);
    } else {
      router.push("/game/view");
    }
  }, [lastGameHistoryEntry, router]);

  return {
    lastGame,
    handleResume,
    handleRestartSame,
    handleView,
  };
}
