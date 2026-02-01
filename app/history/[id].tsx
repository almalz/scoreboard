import { useLocalSearchParams, useRouter } from "expo-router";
import { View, Text, Pressable } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useGame } from "@/features/hooks/useGame";
import { getRoundCount, getTotalScore } from "@/features/domain/scores";

export default function HistoryDetailScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { history } = useGame();
  const entry = history.find((e) => e.game.id === id);

  if (!entry) {
    return (
      <View className="flex-1 items-center justify-center bg-white dark:bg-black p-6">
        <Text className="text-gray-600 dark:text-gray-400">Partie introuvable</Text>
        <Pressable onPress={() => router.back()} className="mt-4 p-3 active:opacity-70">
          <Text className="text-blue-600 dark:text-blue-400">Retour</Text>
        </Pressable>
      </View>
    );
  }

  const { game, scores } = entry;
  const roundCount = getRoundCount(scores);

  return (
    <View className="flex-1 bg-white dark:bg-black">
      <View
        className="flex-row items-center px-4 py-3 border-b border-gray-200 dark:border-gray-700"
        style={{ paddingTop: insets.top + 12 }}
      >
        <Pressable onPress={() => router.back()} className="p-2 active:opacity-70">
          <Text className="text-blue-600 dark:text-blue-400 text-base">Retour</Text>
        </Pressable>
      </View>
      <View className="flex-1 p-6 pt-4">
      <Text className="text-xl font-bold text-black dark:text-white mb-1">
        {game.players.map((p) => p.name).join(", ")}
      </Text>
      <Text className="text-sm text-gray-500 dark:text-gray-500 mb-6">
        {new Date(game.startedAt).toLocaleDateString()} — lecture seule
      </Text>
      <View className="flex-row border-b border-gray-200 dark:border-gray-700 pb-2 mb-2">
        <Text className="flex-1 text-sm font-semibold text-gray-600 dark:text-gray-400">
          Joueur
        </Text>
        {Array.from({ length: roundCount }, (_, i) => (
          <Text
            key={i}
            className="w-10 text-center text-sm font-semibold text-gray-600 dark:text-gray-400"
          >
            R{i + 1}
          </Text>
        ))}
        <Text className="w-12 text-right text-sm font-semibold text-gray-600 dark:text-gray-400">
          Total
        </Text>
      </View>
      {game.players.map((player) => {
        const playerScores = scores[player.id] ?? [];
        const total = getTotalScore(scores, player.id);
        return (
          <View
            key={player.id}
            className="flex-row border-b border-gray-100 dark:border-gray-800 py-2"
          >
            <Text className="flex-1 text-black dark:text-white" numberOfLines={1}>
              {player.name}
            </Text>
            {Array.from({ length: roundCount }, (_, i) => (
              <Text
                key={i}
                className="w-10 text-center text-black dark:text-white"
              >
                {playerScores[i] ?? "—"}
              </Text>
            ))}
            <Text className="w-12 text-right font-semibold text-black dark:text-white">
              {total}
            </Text>
          </View>
        );
      })}
      </View>
    </View>
  );
}
