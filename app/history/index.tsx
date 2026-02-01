import { View, Text, FlatList } from "react-native";
import { useRouter } from "expo-router";
import { useGame } from "@/features/hooks/useGame";
import { useGameActions } from "@/features/hooks/useGameActions";
import { HistoryItem } from "@/components/history";
import type { HistoryEntry } from "@/features/domain/types";

export default function HistoryScreen() {
  const router = useRouter();
  const { historyForList } = useGame();
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
      <FlatList
        data={historyForList}
        keyExtractor={(entry) => entry.game.id}
        contentContainerStyle={{ padding: 16, flexGrow: 1 }}
        ListEmptyComponent={
          <Text className="text-gray-500 dark:text-gray-500 text-center py-12">
            Aucune partie enregistrée
          </Text>
        }
        renderItem={({ item: entry }) => (
          <HistoryItem
            entry={entry}
            onView={() => handleView(entry)}
            onResume={() => handleResume(entry)}
            onRestartSame={() => handleRestartSame(entry)}
          />
        )}
      />
    </View>
  );
}
