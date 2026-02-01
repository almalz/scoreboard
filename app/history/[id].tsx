import { useLocalSearchParams, useRouter } from "expo-router";
import { View, Text, Pressable } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useGame } from "@/features/hooks/useGame";
import { ReadOnlyScoreTable } from "@/components/scores";

export default function HistoryDetailScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { history } = useGame();
  const entry = history.find((e) => e.game.id === id);

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
      <View
        className="flex-row items-center px-4 py-3 border-b border-gray-200 dark:border-gray-700"
        style={{ paddingTop: insets.top + 12 }}
      >
        <Pressable onPress={() => router.back()} className="p-2 active:opacity-70">
          <Text className="text-blue-600 dark:text-blue-400 text-base">
            Retour
          </Text>
        </Pressable>
      </View>
      <View className="flex-1 p-6 pt-4">
        <Text className="text-xl font-bold text-black dark:text-white mb-1">
          {game.players.map((p) => p.name).join(", ")}
        </Text>
        <Text className="text-sm text-gray-500 dark:text-gray-500 mb-6">
          {new Date(game.startedAt).toLocaleDateString()} — lecture seule
        </Text>
        <ReadOnlyScoreTable game={game} scores={scores} />
      </View>
    </View>
  );
}
