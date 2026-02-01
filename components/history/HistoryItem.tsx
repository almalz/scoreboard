import React from "react";
import { View, Text, Pressable } from "react-native";
import type { HistoryEntry } from "@/features/domain/types";
import { formatDate } from "@/utils/date";

interface HistoryItemProps {
  entry: HistoryEntry;
  onView: () => void;
  onResume: () => void;
  onRestartSame: () => void;
}

export function HistoryItem({
  entry,
  onView,
  onResume,
  onRestartSame,
}: HistoryItemProps) {
  const names = entry.game.players.map((p) => p.name).join(", ");
  const date = formatDate(entry.game.startedAt);

  return (
    <View
      className="mb-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 p-4"
    >
      <Text
        className="text-lg font-semibold text-black dark:text-white mb-1"
        numberOfLines={2}
      >
        {names}
      </Text>
      <Text className="text-sm text-gray-500 dark:text-gray-500 mb-4">
        {date}
      </Text>
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
            Recommencer
          </Text>
        </Pressable>
      </View>
    </View>
  );
}
