import React from "react";
import { Pressable, Text, TextInput, View } from "react-native";

const MIN = 2;
const MAX = 20;

export function clampPlayerCount(value: number) {
  return Math.min(MAX, Math.max(MIN, value));
}

interface PlayerCountStepperProps {
  value: number;
  onChange: (value: number) => void;
}

export function PlayerCountStepper({ value, onChange }: PlayerCountStepperProps) {
  const setCount = (v: number) => onChange(clampPlayerCount(v));

  const handleInputChange = (text: string) => {
    const n = parseInt(text, 10);
    if (!Number.isNaN(n)) onChange(clampPlayerCount(n));
    else if (text === "") onChange(MIN);
  };

  return (
    <View className="flex-row items-center gap-3">
      <Pressable
        onPress={() => setCount(value - 1)}
        className="w-14 h-14 rounded-2xl bg-gray-200 dark:bg-gray-700 items-center justify-center active:opacity-80"
        accessibilityLabel="Moins"
      >
        <Text className="text-2xl font-bold text-black dark:text-white">−</Text>
      </Pressable>
      <TextInput
        value={String(value)}
        onChangeText={handleInputChange}
        keyboardType="number-pad"
        className="flex-1 h-14 rounded-2xl bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-black dark:text-white text-center text-xl font-bold"
        selectTextOnFocus
        maxLength={2}
      />
      <Pressable
        onPress={() => setCount(value + 1)}
        className="w-14 h-14 rounded-2xl bg-gray-200 dark:bg-gray-700 items-center justify-center active:opacity-80"
        accessibilityLabel="Plus"
      >
        <Text className="text-2xl font-bold text-black dark:text-white">+</Text>
      </Pressable>
    </View>
  );
}
