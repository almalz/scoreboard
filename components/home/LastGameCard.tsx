import React from "react";
import { View, Text, Pressable } from "react-native";
import type { Game } from "@/features/domain/types";
import { formatDateTime } from "@/utils/date";

interface LastGameCardProps {
  game: Game;
  /** True si la partie est terminée (affichée depuis l’historique). */
  isFinished?: boolean;
  onResume: () => void;
  onRestartSame: () => void;
}

export function LastGameCard({ game, isFinished, onResume, onRestartSame }: LastGameCardProps) {
  return (
    <View className="rounded-xl bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 gap-3 p-5">
      <View className="gap-1">
        <Text className="text-sm font-semibold text-gray-600 dark:text-gray-400">
          Dernière partie
        </Text>
        <Text className="text-base text-black dark:text-white">
          {game.players.map((p) => p.name).join(", ")}
        </Text>
        <Text className="text-xs text-gray-500 dark:text-gray-500">
          {formatDateTime(game.startedAt)}
        </Text>
      </View>
      <View className="flex-row gap-3">
        <Pressable
          onPress={onResume}
          className="flex-1 py-3 rounded-lg bg-blue-600 items-center justify-center active:opacity-80"
        >
          <Text className="text-sm font-medium text-white">
            {isFinished ? "Voir" : "Reprendre"}
          </Text>
        </Pressable>
        <Pressable
          onPress={onRestartSame}
          className="flex-1 py-3 rounded-lg border border-gray-300 dark:border-gray-600 items-center justify-center active:opacity-70"
        >
          <Text className="text-sm font-medium text-black dark:text-white">
            Relancer
          </Text>
        </Pressable>
      </View>
    </View>
  );
}
