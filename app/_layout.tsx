import FontAwesome from "@expo/vector-icons/FontAwesome";
import { DarkTheme, DefaultTheme, ThemeProvider } from "@react-navigation/native";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useColorScheme } from "nativewind";
import { useEffect } from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";
import "../global.css";

import { useResolvedTheme } from "@/features/hooks/useResolvedTheme";

export { ErrorBoundary } from "expo-router";

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded, error] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
    ...FontAwesome.font,
  });

  useEffect(() => {
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return <RootLayoutNav />;
}

function RootLayoutNav() {
  const resolvedTheme = useResolvedTheme();
  const { setColorScheme } = useColorScheme();

  useEffect(() => {
    setColorScheme(resolvedTheme);
  }, [resolvedTheme, setColorScheme]);

  const theme = resolvedTheme === "dark" ? DarkTheme : DefaultTheme;
  return (
    <SafeAreaProvider>
      <ThemeProvider value={theme}>
        <Stack
          screenOptions={{
            headerShown: true,
            headerBackTitle: "Retour",
            headerStyle: {
              backgroundColor: theme.dark ? "#000" : "#fff",
            },
            headerTintColor: theme.dark ? "#60a5fa" : "#2563eb",
            headerTitleStyle: {
              fontWeight: "bold",
              fontSize: 18,
            },
            headerShadowVisible: false,
          }}
        >
          <Stack.Screen name="index" options={{ headerShown: false }} />
          <Stack.Screen
            name="setup/index"
            options={{ title: "Noms des joueurs" }}
          />
          <Stack.Screen
            name="game/index"
            options={{ title: "Partie" }}
          />
          <Stack.Screen
            name="history/[id]"
            options={{ title: "Détail" }}
          />
          <Stack.Screen
            name="settings"
            options={{ title: "Paramètres" }}
          />
        </Stack>
      </ThemeProvider>
    </SafeAreaProvider>
  );
}
