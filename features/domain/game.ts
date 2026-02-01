import type { Game, Player, HistoryEntry, Scores } from './types';

function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

export function createPlayer(name: string): Player {
  return { id: generateId(), name };
}

export function createGame(players: Player[]): Game {
  return {
    id: generateId(),
    startedAt: new Date().toISOString(),
    players: [...players],
  };
}

export function addPlayer(game: Game, name: string): Game {
  const newPlayer = createPlayer(name);
  return {
    ...game,
    players: [...game.players, newPlayer],
  };
}

export function restartWithSamePlayers(game: Game): Game {
  return {
    ...game,
    id: generateId(),
    startedAt: new Date().toISOString(),
    players: game.players.map((p) => ({ ...p })),
  };
}

export function toHistoryEntry(game: Game, scores: Scores): HistoryEntry {
  return {
    game: { ...game, players: game.players.map((p) => ({ ...p })) },
    scores: { ...scores },
    finishedAt: new Date().toISOString(),
  };
}
