/**
 * @vitest-environment happy-dom
 */
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useGame } from '../useGame';
import { useGameStore } from '@/features/store/gameStore';
import { createPlayer } from '@/features/domain/game';

const storage: Record<string, string> = {};
vi.mock('@react-native-async-storage/async-storage', () => ({
  default: {
    getItem: vi.fn((key: string) => Promise.resolve(storage[key] ?? null)),
    setItem: vi.fn((key: string, value: string) => {
      storage[key] = value;
      return Promise.resolve();
    }),
    removeItem: vi.fn((key: string) => {
      delete storage[key];
      return Promise.resolve();
    }),
  },
}));

describe('useGame', () => {
  beforeEach(() => {
    Object.keys(storage).forEach((k) => delete storage[k]);
    useGameStore.setState({
      currentGame: null,
      currentScores: {},
      history: [],
      _hasRehydrated: true,
    });
  });

  it('returns game, scores, roundCount, totals and isReady', () => {
    const players = [createPlayer('Alice'), createPlayer('Bob')];
    useGameStore.getState().createGame(players);
    const { result } = renderHook(() => useGame());
    expect(result.current.game).not.toBeNull();
    expect(result.current.game!.players).toHaveLength(2);
    expect(result.current.roundCount).toBe(0);
    expect(result.current.totals).toEqual(
      expect.objectContaining({
        [result.current.game!.players[0].id]: 0,
        [result.current.game!.players[1].id]: 0,
      })
    );
    expect(result.current.isReady).toBe(true);
  });

  it('roundCount and totals update after addScore', () => {
    const players = [createPlayer('Alice'), createPlayer('Bob')];
    useGameStore.getState().createGame(players);
    const game = useGameStore.getState().currentGame!;
    const id = game.players[0].id;
    useGameStore.getState().addScore(id, 5);
    useGameStore.getState().addScore(id, 3);
    const { result } = renderHook(() => useGame());
    expect(result.current.roundCount).toBe(2);
    expect(result.current.totals[id]).toBe(8);
  });
});
