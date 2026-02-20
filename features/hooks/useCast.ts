import { useCallback, useEffect } from 'react';
import { Platform } from 'react-native';
import { useGame } from './useGame';

const CAST_NAMESPACE = 'urn:x-cast:com.scoreboard.game';

export function useCast() {
  const { game, scores, totals, rankings } = useGame();

  const sendGameState = useCallback(async () => {
    if (Platform.OS === 'web' || !game) return;
    try {
      const GoogleCast = require('react-native-google-cast').default;
      const session = await GoogleCast.getSessionManager().getCurrentCastSession();
      if (!session) return;
      await session.sendMessage(
        CAST_NAMESPACE,
        JSON.stringify({ players: game.players, scores, totals, rankings })
      );
    } catch {
      // Pas de session Cast active
    }
  }, [game, scores, totals, rankings]);

  // Re-synchronise le Chromecast à chaque changement de scores
  useEffect(() => {
    sendGameState();
  }, [sendGameState]);

  const openCastMenu = useCallback(() => {
    if (Platform.OS === 'web') return;
    const GoogleCast = require('react-native-google-cast').default;
    GoogleCast.showCastDialog();
  }, []);

  return { openCastMenu };
}
