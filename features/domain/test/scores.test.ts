import {
    addScore,
    completeRound,
    deleteRound,
    emptyScores,
    getPlayersWithMissingScores,
    getRoundCount,
    getTotalScore,
    initScoresForPlayers,
    mergeScoresWithNewPlayers,
} from '../scores';

describe('scores', () => {
  describe('emptyScores', () => {
    it('returns empty object', () => {
      expect(emptyScores()).toEqual({});
    });
  });

  describe('initScoresForPlayers', () => {
    it('returns scores with empty arrays per player', () => {
      const s = initScoresForPlayers(['a', 'b']);
      expect(s).toEqual({ a: [], b: [] });
    });
  });

  describe('addScore', () => {
    it('appends points to player list', () => {
      const s = addScore({ a: [], b: [] }, 'a', 5);
      expect(s.a).toEqual([5]);
      expect(s.b).toEqual([]);
    });

    it('appends again for same player', () => {
      const s = addScore(addScore({ a: [] }, 'a', 5), 'a', 3);
      expect(s.a).toEqual([5, 3]);
    });

    it('initializes player if missing', () => {
      const s = addScore({}, 'x', 10);
      expect(s.x).toEqual([10]);
    });
  });

  describe('getRoundCount', () => {
    it('returns 0 for empty scores', () => {
      expect(getRoundCount({})).toBe(0);
    });

    it('returns max length across players', () => {
      expect(getRoundCount({ a: [1, 2, 3], b: [1, 2] })).toBe(3);
    });
  });

  describe('getTotalScore', () => {
    it('returns sum for player', () => {
      expect(getTotalScore({ a: [1, 2, 3] }, 'a')).toBe(6);
    });

    it('returns 0 for unknown player', () => {
      expect(getTotalScore({ a: [1] }, 'b')).toBe(0);
    });
  });

  describe('deleteRound', () => {
    it('removes round at given index for all players', () => {
      const s = deleteRound({ a: [10, 20, 30], b: [1, 2, 3] }, 1);
      expect(s.a).toEqual([10, 30]);
      expect(s.b).toEqual([1, 3]);
    });

    it('does nothing if roundIndex is out of bounds', () => {
      const s = deleteRound({ a: [10, 20] }, 5);
      expect(s.a).toEqual([10, 20]);
    });

    it('handles players with fewer rounds than the index', () => {
      const s = deleteRound({ a: [10, 20, 30], b: [1] }, 2);
      expect(s.a).toEqual([10, 20]);
      expect(s.b).toEqual([1]);
    });

    it('removes the only round', () => {
      const s = deleteRound({ a: [10], b: [5] }, 0);
      expect(s.a).toEqual([]);
      expect(s.b).toEqual([]);
    });

    it('does not mutate the original scores', () => {
      const original = { a: [10, 20], b: [1, 2] };
      deleteRound(original, 0);
      expect(original.a).toEqual([10, 20]);
      expect(original.b).toEqual([1, 2]);
    });
  });

  describe('completeRound', () => {
    it('fills missing scores with 0 up to roundIndex', () => {
      const s = completeRound({ a: [10, 20], b: [5] }, ['a', 'b'], 1);
      expect(s.a).toEqual([10, 20]);
      expect(s.b).toEqual([5, 0]);
    });

    it('does nothing if all players already have the round', () => {
      const s = completeRound({ a: [10, 20], b: [5, 3] }, ['a', 'b'], 1);
      expect(s.a).toEqual([10, 20]);
      expect(s.b).toEqual([5, 3]);
    });

    it('fills multiple missing rounds with 0', () => {
      const s = completeRound({ a: [10, 20, 30], b: [] }, ['a', 'b'], 2);
      expect(s.b).toEqual([0, 0, 0]);
    });

    it('does not mutate the original scores', () => {
      const original = { a: [10], b: [] };
      completeRound(original, ['a', 'b'], 0);
      expect(original.b).toEqual([]);
    });
  });

  describe('getPlayersWithMissingScores', () => {
    it('returns players who have not completed the round', () => {
      const result = getPlayersWithMissingScores({ a: [10, 20], b: [5] }, ['a', 'b'], 1);
      expect(result).toEqual(['b']);
    });

    it('returns empty array if all players have the round', () => {
      const result = getPlayersWithMissingScores({ a: [10], b: [5] }, ['a', 'b'], 0);
      expect(result).toEqual([]);
    });

    it('returns all players if none have the round', () => {
      const result = getPlayersWithMissingScores({ a: [], b: [] }, ['a', 'b'], 0);
      expect(result).toEqual(['a', 'b']);
    });
  });

  describe('mergeScoresWithNewPlayers', () => {
    it('adds empty arrays for new player ids', () => {
      const s = mergeScoresWithNewPlayers({ a: [1] }, ['a'], ['a', 'b']);
      expect(s.a).toEqual([1]);
      expect(s.b).toEqual([]);
    });
  });
});
