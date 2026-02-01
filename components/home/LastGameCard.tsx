import React from "react";
import { View, Text, Pressable } from "react-native";
import type { Game } from "@/features/domain/types";

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString(undefined, {
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });
}

interface LastGameCardProps {
  game: Game;
  onResume: () => void;
  onRestartSame: () => void;
}

export function LastGameCard({ game, onResume, onRestartSame }: LastGameCardProps) {
  return (
    <View className="mb-8 p-4 rounded-xl bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
      <Text className="text-sm font-semibold text-gray-600 dark:text-gray-400 mb-1">
        Dernière partie
      </Text>
      <Text className="text-base text-black dark:text-white mb-1">
        {game.players.map((p) => p.name).join(", ")}
      </Text>
      <Text className="text-xs text-gray-500 dark:text-gray-500 mb-3">
        {formatDate(game.startedAt)}
      </Text>
      <View className="flex-row gap-2">
        <Pressable
          onPress={onResume}
          className="flex-1 py-2.5 rounded-lg bg-blue-600 items-center active:opacity-80"
        >
          <Text className="text-sm font-medium text-white">Reprendre</Text>
        </Pressable>
        <Pressable
          onPress={onRestartSame}
          className="flex-1 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 items-center active:opacity-70"
        >
          <Text className="text-sm font-medium text-black dark:text-white">
            Relancer
          </Text>
        </Pressable>
      </View>
    </View>
  );
}
