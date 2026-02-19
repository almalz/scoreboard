import type { Game, Player, HistoryEntry, Scores } from './types';

function generateId(): string {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID();
  }
  // Fallback for environments without crypto.randomUUID (e.g. older Android WebViews)
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
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
