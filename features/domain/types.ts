export type PlayerId = string;
export type GameId = string;

export interface Player {
  id: PlayerId;
  name: string;
}

/** Game = identity only (who, when). No scores. */
export interface Game {
  id: GameId;
  startedAt: string;
  players: Player[];
}

/** Scores for a game: per-player arrays of points (round = index). */
export type Scores = Record<PlayerId, number[]>;

/** Snapshot for history: game + final scores. */
export interface HistoryEntry {
  game: Game;
  scores: Scores;
  finishedAt: string;
}
