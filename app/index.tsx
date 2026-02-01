import {
  LastGameCard,
  NewGameForm,
  clampPlayerCount,
} from "@/components/home";
import { useGame } from "@/features/hooks/useGame";
import { useGameActions } from "@/features/hooks/useGameActions";
import { Link, useRouter } from "expo-router";
import React, { useState } from "react";
import { Keyboard, Pressable, Text, View } from "react-native";

const MIN_PLAYERS = 2;

export default function HomeScreen() {
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
    <View className="flex-1 bg-white dark:bg-black p-6 pt-12 gap-16">
      <View>
        <Text className="text-3xl font-bold text-black dark:text-white mb-2">
          ScoreBoard
        </Text>
      </View>

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


      <View>
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
      </View>
    </View>
  );
}
