import type { Scores, PlayerId } from './types';

export function emptyScores(): Scores {
  return {};
}

export function initScoresForPlayers(playerIds: PlayerId[]): Scores {
  const scores: Scores = {};
  for (const id of playerIds) {
    scores[id] = [];
  }
  return scores;
}

export function addScore(scores: Scores, playerId: PlayerId, points: number): Scores {
  const next = { ...scores };
  const list = [...(next[playerId] ?? [])];
  list.push(points);
  next[playerId] = list;
  return next;
}

export function updateScore(scores: Scores, playerId: PlayerId, roundIndex: number, points: number): Scores {
  const next = { ...scores };
  const list = [...(next[playerId] ?? [])];
  if (roundIndex < 0 || roundIndex >= list.length) return scores;
  list[roundIndex] = points;
  next[playerId] = list;
  return next;
}

export function getRoundCount(scores: Scores): number {
  const lengths = Object.values(scores).map((arr) => arr.length);
  return lengths.length === 0 ? 0 : Math.max(...lengths);
}

export function getTotalScore(scores: Scores, playerId: PlayerId): number {
  const list = scores[playerId] ?? [];
  return list.reduce((sum, n) => sum + n, 0);
}

export function mergeScoresWithNewPlayers(
  scores: Scores,
  existingPlayerIds: PlayerId[],
  newPlayerIds: PlayerId[]
): Scores {
  const next = { ...scores };
  for (const id of newPlayerIds) {
    if (!existingPlayerIds.includes(id)) {
      next[id] = [];
    }
  }
  return next;
}
