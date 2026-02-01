import { describe, it, expect, vi, beforeEach } from 'vitest';

const storage: Record<string, string> = {};
const mockAsyncStorage = {
  getItem: vi.fn((key: string) => Promise.resolve(storage[key] ?? null)),
  setItem: vi.fn((key: string, value: string) => {
    storage[key] = value;
    return Promise.resolve();
  }),
  removeItem: vi.fn((key: string) => {
    delete storage[key];
    return Promise.resolve();
  }),
};

vi.mock('@react-native-async-storage/async-storage', () => ({
  default: mockAsyncStorage,
}));

const { useGameStore } = await import('../gameStore');
const { createPlayer } = await import('@/features/domain/game');

describe('gameStore', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    Object.keys(storage).forEach((k) => delete storage[k]);
    useGameStore.setState({
      currentGame: null,
      currentScores: {},
      history: [],
      _hasRehydrated: true,
    });
  });

  it('createGame sets currentGame and initializes empty scores', () => {
    const players = [createPlayer('Alice'), createPlayer('Bob')];
    useGameStore.getState().createGame(players);
    const state = useGameStore.getState();
    expect(state.currentGame).not.toBeNull();
    expect(state.currentGame!.players).toHaveLength(2);
    expect(state.currentScores[state.currentGame!.players[0].id]).toEqual([]);
    expect(state.currentScores[state.currentGame!.players[1].id]).toEqual([]);
  });

  it('addScore appends points for player', () => {
    const players = [createPlayer('Alice'), createPlayer('Bob')];
    useGameStore.getState().createGame(players);
    const game = useGameStore.getState().currentGame!;
    const id = game.players[0].id;
    useGameStore.getState().addScore(id, 5);
    useGameStore.getState().addScore(id, 3);
    expect(useGameStore.getState().currentScores[id]).toEqual([5, 3]);
  });

  it('restartWithSamePlayers saves to history and resets scores', () => {
    const players = [createPlayer('Alice'), createPlayer('Bob')];
    useGameStore.getState().createGame(players);
    const game = useGameStore.getState().currentGame!;
    useGameStore.getState().addScore(game.players[0].id, 10);
    useGameStore.getState().restartWithSamePlayers();
    const state = useGameStore.getState();
    expect(state.history).toHaveLength(1);
    expect(state.history[0].scores[game.players[0].id]).toEqual([10]);
    expect(state.currentGame).not.toBeNull();
    expect(state.currentGame!.id).not.toBe(game.id);
    expect(state.currentScores[state.currentGame!.players[0].id]).toEqual([]);
  });

  it('addPlayer adds a player and initializes empty scores for them', () => {
    const players = [createPlayer('Alice')];
    useGameStore.getState().createGame(players);
    useGameStore.getState().addPlayer('Bob');
    const state = useGameStore.getState();
    expect(state.currentGame!.players).toHaveLength(2);
    expect(state.currentGame!.players[1].name).toBe('Bob');
    expect(state.currentScores[state.currentGame!.players[1].id]).toEqual([]);
  });

  it('loadFromHistory restores currentGame and currentScores from entry', () => {
    const players = [createPlayer('Alice'), createPlayer('Bob')];
    useGameStore.getState().createGame(players);
    const game = useGameStore.getState().currentGame!;
    useGameStore.getState().addScore(game.players[0].id, 5);
    const entry = {
      game: useGameStore.getState().currentGame!,
      scores: { ...useGameStore.getState().currentScores },
      finishedAt: new Date().toISOString(),
    };
    useGameStore.getState().clearCurrentGame();
    expect(useGameStore.getState().currentGame).toBeNull();
    useGameStore.getState().loadFromHistory(entry);
    const state = useGameStore.getState();
    expect(state.currentGame!.id).toBe(entry.game.id);
    expect(state.currentScores[game.players[0].id]).toEqual([5]);
  });

  it('finishAndSaveCurrentGame pushes to history and clears current', () => {
    const players = [createPlayer('Alice'), createPlayer('Bob')];
    useGameStore.getState().createGame(players);
    const game = useGameStore.getState().currentGame!;
    useGameStore.getState().addScore(game.players[0].id, 10);
    useGameStore.getState().finishAndSaveCurrentGame();
    const state = useGameStore.getState();
    expect(state.currentGame).toBeNull();
    expect(state.currentScores).toEqual({});
    expect(state.history).toHaveLength(1);
    expect(state.history[0].game.id).toBe(game.id);
    expect(state.history[0].scores[game.players[0].id]).toEqual([10]);
  });
});
