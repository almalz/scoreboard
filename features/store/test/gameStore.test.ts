jest.mock('@react-native-async-storage/async-storage');

import AsyncStorage from '@react-native-async-storage/async-storage';
import { useGameStore } from '../gameStore';
import { createPlayer } from '@/features/domain/game';

describe('gameStore', () => {
  beforeEach(() => {
    (AsyncStorage as { __clear?: () => void }).__clear?.();
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

    it('clearHistory empties history', () => {
    const players = [createPlayer('Alice'), createPlayer('Bob')];
    useGameStore.getState().createGame(players);
    useGameStore.getState().finishAndSaveCurrentGame();
    expect(useGameStore.getState().history).toHaveLength(1);
    useGameStore.getState().clearHistory();
    expect(useGameStore.getState().history).toHaveLength(0);
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

  it('deleteRound removes the round at given index for all players', () => {
    const players = [createPlayer('Alice'), createPlayer('Bob')];
    useGameStore.getState().createGame(players);
    const game = useGameStore.getState().currentGame!;
    const alice = game.players[0].id;
    const bob = game.players[1].id;
    useGameStore.getState().addScore(alice, 10);
    useGameStore.getState().addScore(bob, 5);
    useGameStore.getState().addScore(alice, 20);
    useGameStore.getState().addScore(bob, 15);
    useGameStore.getState().deleteRound(0);
    const state = useGameStore.getState();
    expect(state.currentScores[alice]).toEqual([20]);
    expect(state.currentScores[bob]).toEqual([15]);
  });

  it('completeRound sets missing scores to 0 for the given round', () => {
    const players = [createPlayer('Alice'), createPlayer('Bob')];
    useGameStore.getState().createGame(players);
    const game = useGameStore.getState().currentGame!;
    const alice = game.players[0].id;
    const bob = game.players[1].id;
    useGameStore.getState().addScore(alice, 10);
    useGameStore.getState().addScore(alice, 20);
    // Bob has no scores yet
    useGameStore.getState().completeRound(1);
    const state = useGameStore.getState();
    expect(state.currentScores[alice]).toEqual([10, 20]);
    expect(state.currentScores[bob]).toEqual([0, 0]);
  });

  it('completeRound does nothing without a current game', () => {
    useGameStore.getState().completeRound(0);
    expect(useGameStore.getState().currentScores).toEqual({});
  });

  describe('history grouping', () => {
    it('createGame with current game in progress adds it to history then starts new game', () => {
      const playersA = [createPlayer('Alice'), createPlayer('Bob')];
      useGameStore.getState().createGame(playersA);
      const gameA = useGameStore.getState().currentGame!;
      useGameStore.getState().addScore(gameA.players[0].id, 5);
      const historyBefore = useGameStore.getState().history.length;

      const playersB = [createPlayer('Charlie'), createPlayer('Diana')];
      useGameStore.getState().createGame(playersB);

      const state = useGameStore.getState();
      expect(state.history).toHaveLength(historyBefore + 1);
      expect(state.history[state.history.length - 1].game.id).toBe(gameA.id);
      expect(state.history[state.history.length - 1].scores[gameA.players[0].id]).toEqual([5]);
      expect(state.currentGame).not.toBeNull();
      expect(state.currentGame!.id).not.toBe(gameA.id);
      expect(state.currentGame!.players[0].name).toBe('Charlie');
    });

    it('loadFromHistory does not modify history (resume = no new entry)', () => {
      const players = [createPlayer('Alice'), createPlayer('Bob')];
      useGameStore.getState().createGame(players);
      const game = useGameStore.getState().currentGame!;
      useGameStore.getState().addScore(game.players[0].id, 3);
      const entry = {
        game: useGameStore.getState().currentGame!,
        scores: { ...useGameStore.getState().currentScores },
        finishedAt: new Date().toISOString(),
      };
      useGameStore.getState().finishAndSaveCurrentGame();
      expect(useGameStore.getState().history).toHaveLength(1);

      useGameStore.getState().loadFromHistory(entry);
      expect(useGameStore.getState().history).toHaveLength(1);
      expect(useGameStore.getState().currentGame!.id).toBe(entry.game.id);
    });

    it('restartWithSamePlayers adds current game to history', () => {
      const players = [createPlayer('Alice'), createPlayer('Bob')];
      useGameStore.getState().createGame(players);
      const game = useGameStore.getState().currentGame!;
      useGameStore.getState().addScore(game.players[0].id, 7);
      useGameStore.getState().restartWithSamePlayers();
      const state = useGameStore.getState();
      expect(state.history).toHaveLength(1);
      expect(state.history[0].game.id).toBe(game.id);
      expect(state.history[0].scores[game.players[0].id]).toEqual([7]);
      expect(state.currentGame!.id).not.toBe(game.id);
    });

    it('finishAndSaveCurrentGame after loadFromHistory updates existing entry (no duplicate)', () => {
      const players = [createPlayer('Alice'), createPlayer('Bob')];
      useGameStore.getState().createGame(players);
      const game = useGameStore.getState().currentGame!;
      useGameStore.getState().addScore(game.players[0].id, 5);
      useGameStore.getState().finishAndSaveCurrentGame();
      expect(useGameStore.getState().history).toHaveLength(1);

      const entry = useGameStore.getState().history[0];
      useGameStore.getState().loadFromHistory(entry);
      useGameStore.getState().addScore(game.players[0].id, 3);
      useGameStore.getState().finishAndSaveCurrentGame();

      const state = useGameStore.getState();
      expect(state.history).toHaveLength(1);
      expect(state.history[0].game.id).toBe(game.id);
      expect(state.history[0].scores[game.players[0].id]).toEqual([5, 3]);
    });
  });
});
