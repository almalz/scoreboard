import { useGame } from "@/features/hooks/useGame";
import { useGameActions } from "@/features/hooks/useGameActions";
import { Link, useRouter } from "expo-router";
import React, { useState } from "react";
import { Keyboard, Pressable, Text, TextInput, View } from "react-native";
import Animated, { FadeIn, FadeInDown } from "react-native-reanimated";

const MIN_PLAYERS = 2;
const MAX_PLAYERS = 20;

function clamp(value: number) {
  return Math.min(MAX_PLAYERS, Math.max(MIN_PLAYERS, value));
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString(undefined, {
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function HomeScreen() {
  const router = useRouter();
  const [playerCount, setPlayerCount] = useState(2);
  const { game } = useGame();
  const { restartWithSamePlayers } = useGameActions();

  const setCount = (value: number) => setPlayerCount(clamp(value));

  const handleInputChange = (text: string) => {
    const n = parseInt(text, 10);
    if (!Number.isNaN(n)) setPlayerCount(clamp(n));
    else if (text === "") setPlayerCount(MIN_PLAYERS);
  };

  const startNewGame = () => {
    Keyboard.dismiss();
    router.push(`/setup?players=${playerCount}`);
  };

  const handleResume = () => {
    router.push("/game");
  };

  const handleRestartSame = () => {
    restartWithSamePlayers();
    router.replace("/game");
  };

  return (
    <View className="flex-1 bg-white dark:bg-black p-6 pt-12">
      <Animated.View entering={FadeIn.duration(300)}>
        <Text className="text-3xl font-bold text-black dark:text-white mb-2">
          ScoreBoard
        </Text>
        <Text className="text-gray-600 dark:text-gray-400 mb-8">
          Choisis le nombre de joueurs
        </Text>
      </Animated.View>

      {game && (
        <Animated.View
          entering={FadeInDown.duration(300).springify()}
          className="mb-8 p-4 rounded-xl bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700"
        >
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
              onPress={handleResume}
              className="flex-1 py-2.5 rounded-lg bg-blue-600 items-center active:opacity-80"
            >
              <Text className="text-sm font-medium text-white">Reprendre</Text>
            </Pressable>
            <Pressable
              onPress={handleRestartSame}
              className="flex-1 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 items-center active:opacity-70"
            >
              <Text className="text-sm font-medium text-black dark:text-white">
                Relancer
              </Text>
            </Pressable>
          </View>
        </Animated.View>
      )}

      <Animated.View
        entering={FadeInDown.duration(350).delay(80).springify()}
        className="flex-row items-center gap-3 mb-8"
      >
        <Pressable
          onPress={() => setCount(playerCount - 1)}
          className="w-14 h-14 rounded-2xl bg-gray-200 dark:bg-gray-700 items-center justify-center active:opacity-80"
          accessibilityLabel="Moins"
        >
          <Text className="text-2xl font-bold text-black dark:text-white">−</Text>
        </Pressable>
        <TextInput
          value={String(playerCount)}
          onChangeText={handleInputChange}
          keyboardType="number-pad"
          className="flex-1 h-14 rounded-2xl bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-black dark:text-white text-center text-xl font-bold"
          selectTextOnFocus
          maxLength={2}
        />
        <Pressable
          onPress={() => setCount(playerCount + 1)}
          className="w-14 h-14 rounded-2xl bg-gray-200 dark:bg-gray-700 items-center justify-center active:opacity-80"
          accessibilityLabel="Plus"
        >
          <Text className="text-2xl font-bold text-black dark:text-white">+</Text>
        </Pressable>
      </Animated.View>

      <Animated.View entering={FadeIn.duration(400).delay(150)}>
        <Pressable
          onPress={startNewGame}
          className="bg-blue-600 dark:bg-blue-500 rounded-xl py-4 items-center active:opacity-80 mb-4"
        >
          <Text className="text-lg font-semibold text-white">
            Nouvelle partie
          </Text>
        </Pressable>

        <Link href="/history" asChild>
          <Pressable className="py-3 items-center active:opacity-70">
            <Text className="text-base text-gray-600 dark:text-gray-400">
              Historique
            </Text>
          </Pressable>
        </Link>
        <Link href="/settings" asChild>
          <Pressable className="py-3 items-center active:opacity-70">
            <Text className="text-base text-gray-600 dark:text-gray-400">
              Paramètres
            </Text>
          </Pressable>
        </Link>
      </Animated.View>
    </View>
  );
}
