import { HistoryItem } from "@/components/history";
import { NewGameForm, clampPlayerCount } from "@/components/home";
import { useGame } from "@/features/hooks/useGame";
import { useGameActions } from "@/features/hooks/useGameActions";
import type { HistoryEntry } from "@/features/domain/types";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { Link, useRouter } from "expo-router";
import React, { useState } from "react";
import { Keyboard, Pressable, ScrollView, Text, View } from "react-native";
import { useColorScheme } from "nativewind";
import { SafeAreaView } from "react-native-safe-area-context";

export default function HomeScreen() {
  const { colorScheme } = useColorScheme();
  const iconColor = colorScheme === "dark" ? "#9ca3af" : "#6b7280";
  const router = useRouter();
  const [playerCount, setPlayerCount] = useState(2);
  const { historyForList } = useGame();
  const { loadFromHistory, createGame } = useGameActions();

  const setCount = (value: number) => setPlayerCount(clampPlayerCount(value));

  const startNewGame = () => {
    Keyboard.dismiss();
    router.push(`/setup?players=${playerCount}`);
  };

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
    <SafeAreaView
      className="flex-1 bg-white dark:bg-black gap-8 px-6 pb-6"
      edges={["top", "left", "right", "bottom"]}
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

      <ScrollView
        className="flex-1"
        contentContainerStyle={{ flexGrow: 1, gap: 24, paddingBottom: 24 }}
        showsVerticalScrollIndicator={false}
      >
        <NewGameForm
          playerCount={playerCount}
          onPlayerCountChange={setCount}
          onSubmit={startNewGame}
        />

        {historyForList.length > 0 && (
          <View className="gap-2">
            <Text className="text-sm font-semibold text-gray-600 dark:text-gray-400">
              Dernières parties
            </Text>
            {historyForList.map((entry) => (
              <HistoryItem
                key={entry.game.id}
                entry={entry}
                onView={() => handleView(entry)}
                onResume={() => handleResume(entry)}
                onRestartSame={() => handleRestartSame(entry)}
              />
            ))}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
