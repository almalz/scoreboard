import { useLayoutEffect } from "react";
import { useLocalSearchParams, useRouter, useNavigation } from "expo-router";
import { View, Text, Pressable } from "react-native";
import { useGame } from "@/features/hooks/useGame";
import { useGameActions } from "@/features/hooks/useGameActions";
import { ReadOnlyScoreTable } from "@/components/scores";
import { formatDate } from "@/utils/date";

export default function HistoryDetailScreen() {
  const router = useRouter();
  const navigation = useNavigation();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { history } = useGame();
  const { loadFromHistory, createGame } = useGameActions();
  const entry = history.find((e) => e.game.id === id);

  useLayoutEffect(() => {
    navigation.setOptions({
      title: entry
        ? entry.game.players.map((p) => p.name).join(", ")
        : "Détail",
    });
  }, [entry, navigation]);

  if (!entry) {
    return (
      <View className="flex-1 items-center justify-center bg-white dark:bg-black p-6">
        <Text className="text-gray-600 dark:text-gray-400">
          Partie introuvable
        </Text>
        <Pressable
          onPress={() => router.back()}
          className="mt-4 p-3 active:opacity-70"
        >
          <Text className="text-blue-600 dark:text-blue-400">Retour</Text>
        </Pressable>
      </View>
    );
  }

  const { game, scores } = entry;

  const handleResume = () => {
    loadFromHistory(entry);
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
