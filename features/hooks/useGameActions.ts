import { useGameStore } from "@/features/store/gameStore";
import type { HistoryEntry, Player } from "@/features/domain/types";

export function useGameActions() {
  const createGame = useGameStore((s) => s.createGame);
  const addPlayer = useGameStore((s) => s.addPlayer);
  const addScore = useGameStore((s) => s.addScore);
  const updateScore = useGameStore((s) => s.updateScore);
  const deleteRound = useGameStore((s) => s.deleteRound);
  const completeRound = useGameStore((s) => s.completeRound);
  const restartWithSamePlayers = useGameStore((s) => s.restartWithSamePlayers);
  const clearCurrentGame = useGameStore((s) => s.clearCurrentGame);
  const loadFromHistory = useGameStore((s) => s.loadFromHistory);
  const finishAndSaveCurrentGame = useGameStore((s) => s.finishAndSaveCurrentGame);
  const toggleReverseScoring = useGameStore((s) => s.toggleReverseScoring);

  return {
    createGame: (players: Player[]) => createGame(players),
    addPlayer: (name: string) => addPlayer(name),
    addScore: (playerId: string, points: number) => addScore(playerId, points),
    updateScore: (playerId: string, roundIndex: number, points: number) => updateScore(playerId, roundIndex, points),
    deleteRound: (roundIndex: number) => deleteRound(roundIndex),
    completeRound: (roundIndex: number) => completeRound(roundIndex),
    restartWithSamePlayers: () => restartWithSamePlayers(),
    clearCurrentGame: () => clearCurrentGame(),
    loadFromHistory: (entry: HistoryEntry) => loadFromHistory(entry),
    finishAndSaveCurrentGame: () => finishAndSaveCurrentGame(),
    toggleReverseScoring: () => toggleReverseScoring(),
  };
}
