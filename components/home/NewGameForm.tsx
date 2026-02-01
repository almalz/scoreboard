import React from "react";
import { Pressable, Text, View } from "react-native";
import { PlayerCountStepper } from "./PlayerCountStepper";

interface NewGameFormProps {
  playerCount: number;
  onPlayerCountChange: (value: number) => void;
  onSubmit: () => void;
}

export function NewGameForm({
  playerCount,
  onPlayerCountChange,
  onSubmit,
}: NewGameFormProps) {
  return (
    <View className="gap-8">
        <Text className="text-gray-600 dark:text-gray-400">
          Choisis le nombre de joueurs
        </Text>
      <View className="gap-4">
      <PlayerCountStepper value={playerCount} onChange={onPlayerCountChange} />
      <Pressable
        onPress={onSubmit}
        className="bg-blue-600 dark:bg-blue-500 rounded-xl py-4 items-center active:opacity-80"
      >
        <Text className="text-lg font-semibold text-white">
          Nouvelle partie
        </Text>
      </Pressable>
      </View>
    </View>
  );
}

