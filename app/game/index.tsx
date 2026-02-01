import { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  ScrollView,
  Alert,
} from "react-native";
import { useRouter } from "expo-router";
import { useGame } from "@/features/hooks/useGame";
import { useGameActions } from "@/features/hooks/useGameActions";
import { getRoundCount, getTotalScore } from "@/features/domain/scores";
import type { PlayerId } from "@/features/domain/types";

export default function GameScreen() {
  const router = useRouter();
  const { game, scores, roundCount, totals } = useGame();
  const {
    addScore,
    addPlayer,
    restartWithSamePlayers,
    finishAndSaveCurrentGame,
  } = useGameActions();

  const [roundInputs, setRoundInputs] = useState<Record<PlayerId, string>>({});
  const [menuOpen, setMenuOpen] = useState(false);
  const [addPlayerName, setAddPlayerName] = useState("");
  const [showAddPlayer, setShowAddPlayer] = useState(false);

  useEffect(() => {
    if (!game) {
      router.replace("/(tabs)");
    }
  }, [game, router]);

  if (!game) {
    return null;
  }

  const clearRoundInputs = () =>
    setRoundInputs(
      Object.fromEntries(game.players.map((p) => [p.id, ""]))
    );

  const handleAddRound = () => {
    const entries = game.players.map((p) => {
      const raw = roundInputs[p.id] ?? "";
      const num = parseInt(raw, 10);
      return [p.id, Number.isNaN(num) ? null : num] as const;
    });
    if (entries.some(([, n]) => n === null)) return;
    entries.forEach(([playerId, points]) => addScore(playerId, points!));
    clearRoundInputs();
  };

  const canAddRound = game.players.every((p) => {
    const raw = roundInputs[p.id] ?? "";
    const num = parseInt(raw, 10);
    return raw.trim() !== "" && !Number.isNaN(num);
  });

  const handleAddPlayer = () => {
    const name = addPlayerName.trim();
    if (!name) return;
    addPlayer(name);
    setAddPlayerName("");
    setShowAddPlayer(false);
    setMenuOpen(false);
  };

  const handleRestartSame = () => {
    setMenuOpen(false);
    restartWithSamePlayers();
    clearRoundInputs();
  };

  const handleFinish = () => {
    setMenuOpen(false);
    Alert.alert(
      "Terminer la partie",
      "Enregistrer cette partie dans l'historique et revenir à l'accueil ?",
      [
        { text: "Annuler", style: "cancel" },
        {
          text: "Terminer",
          onPress: () => {
            finishAndSaveCurrentGame();
            router.replace("/(tabs)");
          },
        },
      ]
    );
  };

  return (
    <View className="flex-1 bg-white dark:bg-black">
      <View className="flex-row items-center justify-between px-4 py-3 border-b border-gray-200 dark:border-gray-700">
        <Pressable onPress={() => router.back()} className="p-2 active:opacity-70">
          <Text className="text-blue-600 dark:text-blue-400 text-base">Retour</Text>
        </Pressable>
        <Text className="text-lg font-semibold text-black dark:text-white">
          Partie en cours
        </Text>
        <Pressable
          onPress={() => setMenuOpen((o) => !o)}
          className="p-2 active:opacity-70"
        >
          <Text className="text-xl text-black dark:text-white">⋯</Text>
        </Pressable>
      </View>

      {menuOpen && (
        <View className="px-4 py-3 bg-gray-100 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
          <Pressable
            onPress={() => setShowAddPlayer(true)}
            className="py-3 active:opacity-70"
          >
            <Text className="text-base text-black dark:text-white">
              Ajouter un joueur
            </Text>
          </Pressable>
          <Pressable onPress={handleRestartSame} className="py-3 active:opacity-70">
            <Text className="text-base text-black dark:text-white">
              Recommencer avec les mêmes joueurs
            </Text>
          </Pressable>
          <Pressable onPress={handleFinish} className="py-3 active:opacity-70">
            <Text className="text-base text-red-600 dark:text-red-400">
              Terminer la partie
            </Text>
          </Pressable>
        </View>
      )}

      {showAddPlayer && (
        <View className="px-4 py-3 bg-gray-50 dark:bg-gray-900 flex-row items-center gap-2 border-b border-gray-200 dark:border-gray-700">
          <TextInput
            className="flex-1 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-black text-black dark:text-white px-3 py-2"
            placeholder="Nom du joueur"
            placeholderTextColor="#9ca3af"
            value={addPlayerName}
            onChangeText={setAddPlayerName}
            autoCapitalize="words"
          />
          <Pressable
            onPress={handleAddPlayer}
            disabled={!addPlayerName.trim()}
            className="bg-blue-600 px-4 py-2 rounded-lg active:opacity-80 disabled:opacity-50"
          >
            <Text className="text-white font-medium">Ajouter</Text>
          </Pressable>
          <Pressable
            onPress={() => {
              setShowAddPlayer(false);
              setAddPlayerName("");
            }}
            className="p-2 active:opacity-70"
          >
            <Text className="text-gray-600 dark:text-gray-400">Annuler</Text>
          </Pressable>
        </View>
      )}

      <ScrollView className="flex-1 p-4" horizontal>
        <View>
          <View className="flex-row border-b-2 border-gray-300 dark:border-gray-600 pb-2 mb-2">
            <Text className="w-24 text-sm font-semibold text-gray-600 dark:text-gray-400">
              Joueur
            </Text>
            {Array.from({ length: roundCount }, (_, i) => (
              <Text
                key={i}
                className="w-12 text-center text-sm font-semibold text-gray-600 dark:text-gray-400"
              >
                R{i + 1}
              </Text>
            ))}
            <Text className="w-14 text-right text-sm font-semibold text-gray-600 dark:text-gray-400">
              Total
            </Text>
          </View>
          {game.players.map((player) => {
            const playerScores = scores[player.id] ?? [];
            const total = totals[player.id] ?? 0;
            return (
              <View
                key={player.id}
                className="flex-row border-b border-gray-100 dark:border-gray-800 py-2 items-center"
              >
                <Text
                  className="w-24 text-black dark:text-white font-medium"
                  numberOfLines={1}
                >
                  {player.name}
                </Text>
                {Array.from({ length: roundCount }, (_, i) => (
                  <Text
                    key={i}
                    className="w-12 text-center text-black dark:text-white"
                  >
                    {playerScores[i] ?? "—"}
                  </Text>
                ))}
                <Text className="w-14 text-right font-semibold text-black dark:text-white">
                  {total}
                </Text>
              </View>
            );
          })}

          <View className="flex-row py-4 mt-2 border-t border-gray-200 dark:border-gray-700 items-center">
            <Text className="w-24 text-sm text-gray-500 dark:text-gray-500">
              Nouveau round
            </Text>
            {game.players.map((p) => (
              <TextInput
                key={p.id}
                className="w-12 text-center border border-gray-300 dark:border-gray-600 rounded bg-gray-50 dark:bg-gray-900 text-black dark:text-white mx-0.5 py-1"
                placeholder="0"
                placeholderTextColor="#9ca3af"
                keyboardType="number-pad"
                value={roundInputs[p.id] ?? ""}
                onChangeText={(v) =>
                  setRoundInputs((prev) => ({ ...prev, [p.id]: v }))
                }
              />
            ))}
            <Pressable
              onPress={handleAddRound}
              disabled={!canAddRound}
              className="ml-2 bg-blue-600 px-3 py-2 rounded-lg active:opacity-80 disabled:opacity-50"
            >
              <Text className="text-white text-sm font-medium">+</Text>
            </Pressable>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
