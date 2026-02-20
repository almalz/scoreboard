import { useState, useRef, useEffect } from "react";
import { Text, TextInput, Pressable, ScrollView, KeyboardAvoidingView, Platform, Keyboard } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { clampPlayerCount } from "@/components/home";
import { useGameActions } from "@/features/hooks/useGameActions";
import { createPlayer } from "@/features/domain/game";

export default function SetupScreen() {
  const params = useLocalSearchParams<{ players: string }>();
  const router = useRouter();
  const { createGame } = useGameActions();
  const count = clampPlayerCount(parseInt(params.players ?? "2", 10) || 2);
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

  const scrollViewRef = useRef<ScrollView>(null);

  useEffect(() => {
    const sub = Keyboard.addListener("keyboardDidShow", () => {
      scrollViewRef.current?.scrollToEnd({ animated: true });
    });
    return () => sub.remove();
  }, []);

  return (
    <KeyboardAvoidingView
      className="flex-1 bg-white dark:bg-black"
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView
        ref={scrollViewRef}
        className="flex-1 p-6"
        contentContainerStyle={{ paddingBottom: 24 }}
        keyboardShouldPersistTaps="handled"
      >
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
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
