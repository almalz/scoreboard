import {
    addScore,
    emptyScores,
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

  describe('mergeScoresWithNewPlayers', () => {
    it('adds empty arrays for new player ids', () => {
      const s = mergeScoresWithNewPlayers({ a: [1] }, ['a'], ['a', 'b']);
      expect(s.a).toEqual([1]);
      expect(s.b).toEqual([]);
    });
  });
});
