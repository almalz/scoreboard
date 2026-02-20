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

/**
 * Retourne un Record<PlayerId, number> avec le rang de chaque joueur (1 = meilleur).
 * Si reverseScoring = true, le joueur avec le moins de points est classé premier.
 * Les ex-aequo partagent le même rang.
 */
export function getRankings(
  scores: Scores,
  playerIds: PlayerId[],
  reverseScoring = false
): Record<PlayerId, number> {
  const totals = Object.fromEntries(
    playerIds.map((id) => [id, getTotalScore(scores, id)])
  );

  const sorted = [...playerIds].sort((a, b) =>
    reverseScoring ? totals[a] - totals[b] : totals[b] - totals[a]
  );

  const rankings: Record<PlayerId, number> = {};
  let currentRank = 1;
  for (let i = 0; i < sorted.length; i++) {
    if (i > 0 && totals[sorted[i]] !== totals[sorted[i - 1]]) {
      currentRank = i + 1;
    }
    rankings[sorted[i]] = currentRank;
  }
  return rankings;
}

export function deleteRound(scores: Scores, roundIndex: number): Scores {
  const next: Scores = {};
  for (const [id, list] of Object.entries(scores)) {
    const copy = [...list];
    if (roundIndex >= 0 && roundIndex < copy.length) {
      copy.splice(roundIndex, 1);
    }
    next[id] = copy;
  }
  return next;
}

export function completeRound(scores: Scores, playerIds: PlayerId[], roundIndex: number): Scores {
  const next: Scores = {};
  for (const [id, list] of Object.entries(scores)) {
    next[id] = [...list];
  }
  for (const id of playerIds) {
    const list = next[id] ?? [];
    if (list.length <= roundIndex) {
      while (list.length <= roundIndex) {
        list.push(0);
      }
      next[id] = list;
    }
  }
  return next;
}

export function getPlayersWithMissingScores(
  scores: Scores,
  playerIds: PlayerId[],
  roundIndex: number
): PlayerId[] {
  return playerIds.filter((id) => {
    const list = scores[id] ?? [];
    return list.length <= roundIndex;
  });
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
