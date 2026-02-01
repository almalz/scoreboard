import { View, Text, Pressable, Alert } from "react-native";
import { useSettingsStore, type ThemePreference } from "@/features/store/settingsStore";
import { useGameStore } from "@/features/store/gameStore";

const options: { value: ThemePreference; label: string }[] = [
  { value: "light", label: "Clair" },
  { value: "dark", label: "Sombre" },
  { value: "system", label: "Système" },
];

export default function SettingsScreen() {
  const theme = useSettingsStore((s) => s.theme);
  const setTheme = useSettingsStore((s) => s.setTheme);
  const clearHistory = useGameStore((s) => s.clearHistory);

  const handleClearHistoryPress = () => {
    Alert.alert(
      "Effacer l'historique",
      "Êtes-vous sûr de vouloir effacer tout l'historique des parties ?",
      [
        { text: "Annuler", style: "cancel" },
        { text: "Effacer", style: "destructive", onPress: clearHistory },
      ]
    );
  };

  return (
    <View className="flex-1 bg-white dark:bg-black p-6">
      <Text className="text-base text-gray-600 dark:text-gray-400 mb-4">
        Thème
      </Text>
      {options.map((opt) => (
        <Pressable
          key={opt.value}
          onPress={() => setTheme(opt.value)}
          className="py-4 border-b border-gray-200 dark:border-gray-700 flex-row items-center justify-between active:opacity-70"
        >
          <Text className="text-lg text-black dark:text-white">{opt.label}</Text>
          {theme === opt.value && (
            <Text className="text-blue-600 dark:text-blue-400 text-lg">✓</Text>
          )}
        </Pressable>
      ))}
      <Text className="text-base text-gray-600 dark:text-gray-400 mt-8 mb-4">
        Données
      </Text>
      <Pressable
        onPress={handleClearHistoryPress}
        className="py-4 border-b border-gray-200 dark:border-gray-700 active:opacity-70"
      >
        <Text className="text-lg text-red-600 dark:text-red-400">
          Effacer l'historique
        </Text>
      </Pressable>
    </View>
  );
}
