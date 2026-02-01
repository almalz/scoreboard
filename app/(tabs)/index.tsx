import React, { useState } from "react";
import { View, Text, Pressable, TextInput, Keyboard } from "react-native";
import Animated, { FadeIn, FadeInDown } from "react-native-reanimated";
import { Link, useRouter } from "expo-router";

const MIN_PLAYERS = 2;
const MAX_PLAYERS = 20;

function clamp(value: number) {
  return Math.min(MAX_PLAYERS, Math.max(MIN_PLAYERS, value));
}

export default function HomeScreen() {
  const router = useRouter();
  const [playerCount, setPlayerCount] = useState(2);

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
