import {
  LastGameCard,
  NewGameForm,
  clampPlayerCount,
} from "@/components/home";
import { useGame } from "@/features/hooks/useGame";
import { useGameActions } from "@/features/hooks/useGameActions";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { Link, useRouter } from "expo-router";
import React, { useState } from "react";
import { Keyboard, Pressable, Text, View } from "react-native";
import { useColorScheme } from "nativewind";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function HomeScreen() {
  const { colorScheme } = useColorScheme();
  const insets = useSafeAreaInsets();
  const iconColor = colorScheme === "dark" ? "#9ca3af" : "#6b7280";
  const router = useRouter();
  const [playerCount, setPlayerCount] = useState(2);
  const { game } = useGame();
  const { restartWithSamePlayers } = useGameActions();

  const setCount = (value: number) => setPlayerCount(clampPlayerCount(value));

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
    <View
      className="flex-1 bg-white dark:bg-black gap-8"
      style={{ paddingTop: insets.top, paddingHorizontal: 24, paddingBottom: insets.bottom + 24 }}
    >
      <View className="flex-row items-center justify-between gap-4">
        <Text className="text-3xl font-bold text-black dark:text-white">
          ScoreBoard
        </Text>
        <Link href="/settings" asChild>
          <Pressable
            className="w-12 h-12 rounded-full bg-gray-100 dark:bg-gray-800 items-center justify-center active:opacity-70"
            accessibilityLabel="Paramètres"
          >
            <FontAwesome name="cog" size={22} color={iconColor} />
          </Pressable>
        </Link>
      </View>

      <View className="flex-1 gap-20 min-h-0">
        <NewGameForm
          playerCount={playerCount}
          onPlayerCountChange={setCount}
          onSubmit={startNewGame}
        />

        {game && (
          <LastGameCard
            game={game}
            onResume={handleResume}
            onRestartSame={handleRestartSame}
          />
        )}

        <View className="gap-2">
          <Link href="/history" asChild>
            <Pressable className="py-4 items-center active:opacity-70">
              <Text className="text-base text-gray-600 dark:text-gray-400">
                Historique
              </Text>
            </Pressable>
          </Link>
        </View>
      </View>
    </View>
  );
}
