import { useColorScheme } from "react-native";
import { useSettingsStore } from "@/features/store/settingsStore";

export type ResolvedTheme = "light" | "dark";

export function useResolvedTheme(): ResolvedTheme {
  const systemTheme = useColorScheme();
  const preference = useSettingsStore((s) => s.theme);

  if (preference === "system") {
    return systemTheme ?? "light";
  }
  return preference;
}
