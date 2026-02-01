import {
  addPlayer,
  createGame,
  createPlayer,
  restartWithSamePlayers,
  toHistoryEntry,
} from '../game';
import type { Game, Player, Scores } from '../types';

const UUID_V4_REGEX =
  /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

describe('game', () => {
  describe('createPlayer', () => {
    it('creates a player with id and name', () => {
      const p = createPlayer('Alice');
      expect(p.name).toBe('Alice');
      expect(p.id).toBeDefined();
    });

    it('generates a UUID v4 for player id', () => {
      const p = createPlayer('Alice');
      expect(p.id).toMatch(UUID_V4_REGEX);
    });
  });

  describe('createGame', () => {
    it('creates a game with given players and new id/startedAt', () => {
      const players: Player[] = [
        { id: 'a', name: 'Alice' },
        { id: 'b', name: 'Bob' },
      ];
      const game = createGame(players);
      expect(game.id).toBeDefined();
      expect(game.startedAt).toBeDefined();
      expect(game.players).toHaveLength(2);
      expect(game.players[0].name).toBe('Alice');
      expect(game.players[1].name).toBe('Bob');
    });

    it('generates a UUID v4 for game id', () => {
      const players: Player[] = [
        { id: 'a', name: 'Alice' },
        { id: 'b', name: 'Bob' },
      ];
      const game = createGame(players);
      expect(game.id).toMatch(UUID_V4_REGEX);
    });
  });

  describe('addPlayer', () => {
    it('adds a new player with generated id', () => {
      const game: Game = {
        id: 'g1',
        startedAt: '2025-01-01T00:00:00Z',
        players: [{ id: 'a', name: 'Alice' }],
      };
      const next = addPlayer(game, 'Bob');
      expect(next.players).toHaveLength(2);
      expect(next.players[0].name).toBe('Alice');
      expect(next.players[1].name).toBe('Bob');
      expect(next.players[1].id).toBeDefined();
      expect(next.players[1].id).not.toBe('a');
    });
  });

  describe('restartWithSamePlayers', () => {
    it('returns new game with same players but new id and startedAt', () => {
      const game: Game = {
        id: 'g1',
        startedAt: '2025-01-01T00:00:00Z',
        players: [{ id: 'a', name: 'Alice' }, { id: 'b', name: 'Bob' }],
      };
      const next = restartWithSamePlayers(game);
      expect(next.id).not.toBe(game.id);
      expect(next.id).toMatch(UUID_V4_REGEX);
      expect(next.startedAt).not.toBe(game.startedAt);
      expect(next.players).toHaveLength(2);
      expect(next.players[0].id).toBe('a');
      expect(next.players[1].id).toBe('b');
    });
  });

  describe('toHistoryEntry', () => {
    it('builds history entry with game, scores and finishedAt', () => {
      const game: Game = {
        id: 'g1',
        startedAt: '2025-01-01T00:00:00Z',
        players: [{ id: 'a', name: 'Alice' }, { id: 'b', name: 'Bob' }],
      };
      const scores: Scores = { a: [10, 5], b: [3, 8] };
      const entry = toHistoryEntry(game, scores);
      expect(entry.game.id).toBe('g1');
      expect(entry.scores).toEqual(scores);
      expect(entry.finishedAt).toBeDefined();
    });
  });
});
