import { useLayoutEffect } from "react";
import { useLocalSearchParams, useRouter, useNavigation } from "expo-router";
import { View, Text, Pressable } from "react-native";
import { useGame } from "@/features/hooks/useGame";
import { ReadOnlyScoreTable } from "@/components/scores";
import { formatDate } from "@/utils/date";

export default function HistoryDetailScreen() {
  const router = useRouter();
  const navigation = useNavigation();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { history } = useGame();
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
    </View>
  );
}
