import { View, Text, Pressable } from "react-native";
import { useRouter } from "expo-router";
import { useSettingsStore, type ThemePreference } from "@/features/store/settingsStore";

const options: { value: ThemePreference; label: string }[] = [
  { value: "light", label: "Clair" },
  { value: "dark", label: "Sombre" },
  { value: "system", label: "Système" },
];

export default function SettingsScreen() {
  const router = useRouter();
  const theme = useSettingsStore((s) => s.theme);
  const setTheme = useSettingsStore((s) => s.setTheme);

  return (
    <View className="flex-1 bg-white dark:bg-black p-6 pt-12">
      <Text className="text-2xl font-bold text-black dark:text-white mb-6">
        Paramètres
      </Text>
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
      <Pressable
        onPress={() => router.back()}
        className="mt-8 py-3 items-center active:opacity-70"
      >
        <Text className="text-base text-gray-600 dark:text-gray-400">Fermer</Text>
      </Pressable>
    </View>
  );
}
