import React, { useState } from "react";
import { View, Text, Pressable } from "react-native";
import Animated, { FadeIn, FadeInDown } from "react-native-reanimated";
import { Link, useRouter } from "expo-router";

const MIN_PLAYERS = 2;
const MAX_PLAYERS = 8;

export default function HomeScreen() {
  const router = useRouter();
  const [playerCount, setPlayerCount] = useState(2);

  const startNewGame = () => {
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
        className="flex-row flex-wrap gap-3 mb-8"
      >
        {Array.from({ length: MAX_PLAYERS - MIN_PLAYERS + 1 }, (_, i) => {
          const n = MIN_PLAYERS + i;
          const isSelected = playerCount === n;
          return (
            <Pressable
              key={n}
              onPress={() => setPlayerCount(n)}
              className={`w-14 h-14 rounded-2xl items-center justify-center ${
                isSelected
                  ? "bg-blue-600 dark:bg-blue-500"
                  : "bg-gray-200 dark:bg-gray-700"
              } active:opacity-80`}
            >
              <Text
                className={`text-lg font-bold ${
                  isSelected ? "text-white" : "text-black dark:text-white"
                }`}
              >
                {n}
              </Text>
            </Pressable>
          );
        })}
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
