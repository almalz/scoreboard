import { View, Text, Pressable, ScrollView } from "react-native";
import { useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useGame } from "@/features/hooks/useGame";
import { useGameActions } from "@/features/hooks/useGameActions";
import { HistoryItem } from "@/components/history";
import type { HistoryEntry } from "@/features/domain/types";

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
          <Text className="text-blue-600 dark:text-blue-400 text-base">
            Retour
          </Text>
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
          history.map((entry) => (
            <HistoryItem
              key={entry.game.id}
              entry={entry}
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
