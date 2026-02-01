import { View, Text, Pressable, ScrollView } from "react-native";
import Animated, { FadeIn } from "react-native-reanimated";
import { useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useGame } from "@/features/hooks/useGame";
import { useGameActions } from "@/features/hooks/useGameActions";
import type { HistoryEntry } from "@/features/domain/types";

function HistoryItem({
  entry,
  onView,
  onResume,
  onRestartSame,
  index,
}: {
  entry: HistoryEntry;
  onView: () => void;
  onResume: () => void;
  onRestartSame: () => void;
  index: number;
}) {
  const names = entry.game.players.map((p) => p.name).join(", ");
  const date = new Date(entry.game.startedAt).toLocaleDateString(undefined, {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  return (
    <Animated.View
      entering={FadeIn.duration(280).delay(index * 50).springify()}
      className="mb-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 p-4"
    >
      <Text className="text-lg font-semibold text-black dark:text-white mb-1" numberOfLines={2}>
        {names}
      </Text>
      <Text className="text-sm text-gray-500 dark:text-gray-500 mb-4">{date}</Text>
      <View className="flex-row gap-2 flex-wrap">
        <Pressable
          onPress={onView}
          className="bg-gray-200 dark:bg-gray-700 px-4 py-2 rounded-lg active:opacity-80"
        >
          <Text className="text-black dark:text-white font-medium">Voir</Text>
        </Pressable>
        <Pressable
          onPress={onResume}
          className="bg-blue-600 dark:bg-blue-500 px-4 py-2 rounded-lg active:opacity-80"
        >
          <Text className="text-white font-medium">Reprendre</Text>
        </Pressable>
        <Pressable
          onPress={onRestartSame}
          className="border border-gray-400 dark:border-gray-500 px-4 py-2 rounded-lg active:opacity-80"
        >
          <Text className="text-gray-700 dark:text-gray-300 font-medium">
            Recommencer (mêmes joueurs)
          </Text>
        </Pressable>
      </View>
    </Animated.View>
  );
}

export default function HistoryScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { history } = useGame();
  const { loadFromHistory, createGame } = useGameActions();

  const handleView = (entry: HistoryEntry) => {
    router.push(`/history/${entry.game.id}`);
  };

  const handleResume = (entry: HistoryEntry) => {
    loadFromHistory(entry);
    router.replace("/game");
  };

  const handleRestartSame = (entry: HistoryEntry) => {
    createGame(entry.game.players);
    router.replace("/game");
  };

  return (
    <View className="flex-1 bg-white dark:bg-black">
      <View
        className="px-4 py-4 border-b border-gray-200 dark:border-gray-700"
        style={{ paddingTop: insets.top + 12 }}
      >
        <Pressable
          onPress={() => router.back()}
          className="self-start p-2 -ml-2 mb-2 active:opacity-70"
        >
          <Text className="text-blue-600 dark:text-blue-400 text-base">Retour</Text>
        </Pressable>
        <Text className="text-2xl font-bold text-black dark:text-white">
          Historique
        </Text>
      </View>
      <ScrollView className="flex-1 p-4">
        {history.length === 0 ? (
          <Text className="text-gray-500 dark:text-gray-500 text-center py-12">
            Aucune partie enregistrée
          </Text>
        ) : (
          history.map((entry, index) => (
            <HistoryItem
              key={entry.game.id}
              entry={entry}
              index={index}
              onView={() => handleView(entry)}
              onResume={() => handleResume(entry)}
              onRestartSame={() => handleRestartSame(entry)}
            />
          ))
        )}
      </ScrollView>
    </View>
  );
}
