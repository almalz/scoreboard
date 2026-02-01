import { useEffect } from "react";
import { useRouter } from "expo-router";
import { View, Text, Pressable } from "react-native";
import { useGame } from "@/features/hooks/useGame";
import { useGameActions } from "@/features/hooks/useGameActions";
import { ReadOnlyScoreTable } from "@/components/scores";
import { formatDate } from "@/utils/date";

/** Vue lecture seule de la partie en cours. */
export default function GameViewScreen() {
  const router = useRouter();
  const { game, scores } = useGame();
  const { createGame } = useGameActions();

  useEffect(() => {
    if (!game) {
      router.replace("/");
    }
  }, [game, router]);

  if (!game) {
    return null;
  }

  const handleResume = () => {
    router.replace("/game");
  };

  const handleRestart = () => {
    createGame(game.players);
    router.replace("/game");
  };

  return (
    <View className="flex-1 bg-white dark:bg-black">
      <View className="flex-1 p-6 pt-4">
        <Text className="text-xl font-bold text-black dark:text-white mb-1">
          {game.players.map((p) => p.name).join(", ")}
        </Text>
        <Text className="text-sm text-gray-500 dark:text-gray-500 mb-6">
          {formatDate(game.startedAt)} — lecture seule
        </Text>
        <ReadOnlyScoreTable game={game} scores={scores} />
      </View>
      <View className="flex-row gap-3 p-6 pt-0">
        <Pressable
          onPress={handleResume}
          className="flex-1 py-3 rounded-lg bg-blue-600 dark:bg-blue-500 items-center justify-center active:opacity-80"
        >
          <Text className="text-sm font-medium text-white">Reprendre</Text>
        </Pressable>
        <Pressable
          onPress={handleRestart}
          className="flex-1 py-3 rounded-lg border border-gray-400 dark:border-gray-500 items-center justify-center active:opacity-80"
        >
          <Text className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Recommencer
          </Text>
        </Pressable>
      </View>
    </View>
  );
}
