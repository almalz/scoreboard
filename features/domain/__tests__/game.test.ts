import { describe, it, expect } from 'vitest';
import {
  createPlayer,
  createGame,
  addPlayer,
  restartWithSamePlayers,
  toHistoryEntry,
} from '../game';
import type { Game, Player, Scores } from '../types';

describe('game', () => {
  describe('createPlayer', () => {
    it('creates a player with id and name', () => {
      const p = createPlayer('Alice');
      expect(p.name).toBe('Alice');
      expect(p.id).toBeDefined();
      expect(typeof p.id).toBe('string');
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
