import { Link, Stack } from "expo-router";
import { Pressable, Text, View } from "react-native";

export default function NotFoundScreen() {
  return (
    <>
      <Stack.Screen options={{ title: "Oops!" }} />
      <View className="flex-1 items-center justify-center bg-white dark:bg-black p-6">
        <Text className="text-xl font-bold text-black dark:text-white mb-4">
          Cette page n'existe pas.
        </Text>
        <Link href="/" asChild>
          <Pressable className="py-3 active:opacity-70">
            <Text className="text-base text-blue-600 dark:text-blue-400">
              Retour à l'accueil
            </Text>
          </Pressable>
        </Link>
      </View>
    </>
  );
}
