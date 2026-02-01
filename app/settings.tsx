import { View, Text, Pressable } from "react-native";
import { useSettingsStore, type ThemePreference } from "@/features/store/settingsStore";

const options: { value: ThemePreference; label: string }[] = [
  { value: "light", label: "Clair" },
  { value: "dark", label: "Sombre" },
  { value: "system", label: "Système" },
];

export default function SettingsScreen() {
  const theme = useSettingsStore((s) => s.theme);
  const setTheme = useSettingsStore((s) => s.setTheme);

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
    </View>
  );
}
