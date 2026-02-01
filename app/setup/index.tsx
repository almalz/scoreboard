import { useState } from "react";
import { View, Text, TextInput, Pressable } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useGameActions } from "@/features/hooks/useGameActions";
import { createPlayer } from "@/features/domain/game";

export default function SetupScreen() {
  const params = useLocalSearchParams<{ players: string }>();
  const router = useRouter();
  const { createGame } = useGameActions();
  const count = Math.min(8, Math.max(2, parseInt(params.players ?? "2", 10) || 2));
  const [names, setNames] = useState<string[]>(() => Array(count).fill(""));

  const updateName = (index: number, value: string) => {
    const next = [...names];
    next[index] = value;
    setNames(next);
  };

  const handleStart = () => {
    const trimmed = names.map((n) => n.trim()).filter(Boolean);
    if (trimmed.length !== count) return;
    const players = trimmed.map((name) => createPlayer(name));
    createGame(players);
    router.replace("/game");
  };

  const canStart = names.every((n) => n.trim().length > 0);

  return (
    <View className="flex-1 bg-white dark:bg-black p-6 pt-12">
      <Text className="text-2xl font-bold text-black dark:text-white mb-6">
        Noms des joueurs
      </Text>
      {names.map((name, i) => (
        <TextInput
          key={i}
          className="mb-4 rounded-xl border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-900 text-black dark:text-white px-4 py-3 text-lg"
          placeholder={`Joueur ${i + 1}`}
          placeholderTextColor="#9ca3af"
          value={name}
          onChangeText={(v) => updateName(i, v)}
          autoCapitalize="words"
        />
      ))}
      <Pressable
        onPress={handleStart}
        disabled={!canStart}
        className={`mt-6 rounded-xl py-4 items-center ${
          canStart
            ? "bg-blue-600 active:opacity-80"
            : "bg-gray-400 dark:bg-gray-600"
        }`}
      >
        <Text className="text-lg font-semibold text-white">Lancer la partie</Text>
      </Pressable>
      <Pressable
        onPress={() => router.back()}
        className="mt-4 py-3 items-center active:opacity-70"
      >
        <Text className="text-base text-gray-600 dark:text-gray-400">Retour</Text>
      </Pressable>
    </View>
  );
}
