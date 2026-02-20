import { useEffect, useLayoutEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  ScrollView,
  Alert,
  Modal,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
} from "react-native";
import { useRouter, useNavigation } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useGame } from "@/features/hooks/useGame";
import { useGameActions } from "@/features/hooks/useGameActions";
import { getPlayersWithMissingScores } from "@/features/domain/scores";
import type { PlayerId } from "@/features/domain/types";

const NATIVE_HEADER_HEIGHT = Platform.OS === "ios" ? 44 : 56;

const COL_WIDTH = 72;
const INDEX_WIDTH = 36;

export default function GameScreen() {
  const router = useRouter();
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const { game, scores, roundCount, totals, rankings } = useGame();
  const {
    addScore,
    updateScore,
    deleteRound,
    completeRound,
    addPlayer,
    restartWithSamePlayers,
    finishAndSaveCurrentGame,
    toggleReverseScoring,
  } = useGameActions();

  const [addScoreTarget, setAddScoreTarget] = useState<PlayerId | null>(null);
  const [addScoreInput, setAddScoreInput] = useState("");
  const [editRoundIndex, setEditRoundIndex] = useState<number | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [addPlayerName, setAddPlayerName] = useState("");
  const [showAddPlayer, setShowAddPlayer] = useState(false);
  const [roundMenuIndex, setRoundMenuIndex] = useState<number | null>(null);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <Pressable
          onPress={() => setMenuOpen((o) => !o)}
          className="p-2 active:opacity-70"
        >
          <Text className="text-xl text-black dark:text-white">⋯</Text>
        </Pressable>
      ),
    });
  }, [navigation]);

  useEffect(() => {
    if (!game) {
      router.replace("/");
    }
  }, [game, router]);

  if (!game) {
    return null;
  }

  const openAddScoreDialog = (playerId: PlayerId) => {
    setAddScoreTarget(playerId);
    setAddScoreInput("");
    setEditRoundIndex(null);
  };

  const openEditScoreDialog = (playerId: PlayerId, roundIndex: number, currentValue: number) => {
    setAddScoreTarget(playerId);
    setAddScoreInput(String(currentValue));
    setEditRoundIndex(roundIndex);
  };

  const closeAddScoreDialog = () => {
    setAddScoreTarget(null);
    setAddScoreInput("");
    setEditRoundIndex(null);
  };

  const submitAddScore = () => {
    if (!addScoreTarget) return;
    const num = parseInt(addScoreInput.trim(), 10);
    if (addScoreInput.trim() === "" || Number.isNaN(num)) return;
    if (editRoundIndex !== null) {
      updateScore(addScoreTarget, editRoundIndex, num);
    } else {
      addScore(addScoreTarget, num);
    }
    closeAddScoreDialog();
  };

  const canSubmitAddScore =
    addScoreInput.trim() !== "" && !Number.isNaN(parseInt(addScoreInput.trim(), 10));

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
            router.replace("/");
          },
        },
      ]
    );
  };

  const handleDeleteRound = (roundIndex: number) => {
    setRoundMenuIndex(null);
    Alert.alert(
      `Supprimer le tour ${roundIndex + 1}`,
      "Tous les scores de ce tour seront supprimés. Cette action est irréversible.",
      [
        { text: "Annuler", style: "cancel" },
        {
          text: "Supprimer",
          style: "destructive",
          onPress: () => deleteRound(roundIndex),
        },
      ]
    );
  };

  const handleCompleteRound = (roundIndex: number) => {
    const missing = getPlayersWithMissingScores(scores, game.players.map((p) => p.id), roundIndex);
    const missingNames = missing
      .map((id) => game.players.find((p) => p.id === id)?.name)
      .filter(Boolean);
    setRoundMenuIndex(null);
    Alert.alert(
      `Terminer le tour ${roundIndex + 1}`,
      `Les scores manquants seront mis à 0 pour : ${missingNames.join(", ")}.`,
      [
        { text: "Annuler", style: "cancel" },
        {
          text: "Confirmer",
          onPress: () => completeRound(roundIndex),
        },
      ]
    );
  };

  const TableRow = ({
    children,
    isHeader = false,
  }: {
    children: React.ReactNode;
    isHeader?: boolean;
  }) => (
    <View
      className={`flex-row items-center ${
        isHeader
          ? "border-b-2 border-gray-300 dark:border-gray-600 pb-2 mb-1"
          : "border-b border-gray-100 dark:border-gray-800 py-2"
      }`}
    >
      {children}
    </View>
  );

  const TableCell = ({
    children,
    width,
    align = "center",
  }: {
    children: React.ReactNode;
    width: number;
    align?: "left" | "center" | "right";
  }) => (
    <View
      style={{ width }}
      className={`${
        align === "right"
          ? "items-end"
          : align === "left"
            ? "items-start"
            : "items-center"
      } justify-center`}
    >
      {children}
    </View>
  );

  const playerCount = game.players.length;
  const maxRank = playerCount > 0 ? Math.max(...game.players.map((p) => rankings[p.id] ?? 1)) : 1;

  const getMedalForPlayer = (playerId: string): string => {
    const rank = rankings[playerId] ?? 1;
    const isLast = rank === maxRank && playerCount > 1;
    if (playerCount === 1) return '🥇';
    if (playerCount === 2) {
      if (rank === 1) return '🥇';
      if (isLast) return '💩';
      return '';
    }
    if (playerCount === 3) {
      if (rank === 1) return '🥇';
      if (rank === 2) return '🥈';
      if (isLast) return '💩';
      return '';
    }
    // 4+ joueurs
    if (rank === 1) return '🥇';
    if (rank === 2) return '🥈';
    if (rank === 3) return '🥉';
    if (isLast) return '💩';
    return '';
  };

  const headerHeight = insets.top + NATIVE_HEADER_HEIGHT;

  return (
    <View className="flex-1 bg-white dark:bg-black">
      {menuOpen && (
        <>
          <Pressable
            style={[StyleSheet.absoluteFill, styles.menuBackdrop]}
            onPress={() => setMenuOpen(false)}
          />
          <View
            style={[
              styles.menuPopover,
              {
                top: headerHeight,
              },
            ]}
            className="min-w-[160px] rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 py-1"
          >
            <Pressable
              onPress={() => {
                setShowAddPlayer(true);
                setMenuOpen(false);
              }}
              className="px-3 py-2.5 active:opacity-70"
            >
              <Text className="text-sm text-black dark:text-white">
                Ajouter un joueur
              </Text>
            </Pressable>
            <Pressable
              onPress={() => {
                toggleReverseScoring();
                setMenuOpen(false);
              }}
              className="px-3 py-2.5 active:opacity-70"
            >
              <Text className="text-sm text-black dark:text-white">
                {game.reverseScoring ? '✓ ' : ''}Inverser classement
              </Text>
            </Pressable>
            <Pressable
              onPress={handleRestartSame}
              className="px-3 py-2.5 active:opacity-70"
            >
              <Text className="text-sm text-black dark:text-white">
                Recommencer
              </Text>
            </Pressable>
            <Pressable
              onPress={handleFinish}
              className="px-3 py-2.5 active:opacity-70"
            >
              <Text className="text-sm text-red-600 dark:text-red-400">
                Terminer la partie
              </Text>
            </Pressable>
          </View>
        </>
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

      <ScrollView
        className="flex-1"
        contentContainerStyle={{ padding: 16 }}
        showsVerticalScrollIndicator={true}
      >
        <ScrollView horizontal showsHorizontalScrollIndicator={true}>
            <View>
              {/* Header: # | Player1 | Player2 | ... */}
              <TableRow isHeader>
                <TableCell width={INDEX_WIDTH} align="center">
                  <Text className="text-sm font-semibold text-gray-600 dark:text-gray-400">
                    Tours
                  </Text>
                </TableCell>
                {game.players.map((player) => (
                  <TableCell key={player.id} width={COL_WIDTH}>
                    <Text
                      className="text-sm font-semibold text-gray-600 dark:text-gray-400"
                      numberOfLines={1}
                      style={{ maxWidth: COL_WIDTH - 8 }}
                    >
                      {player.name}
                    </Text>
                  </TableCell>
                ))}
              </TableRow>

              {/* Score rows + add button on last line per player */}
              {Array.from(
                { length: Math.max(1, roundCount + 1) },
                (_, i) => (
                  <TableRow key={i}>
                    <TableCell width={INDEX_WIDTH} align="center">
                      {i < roundCount ? (
                        <Pressable
                          onLongPress={() => setRoundMenuIndex(i)}
                          hitSlop={8}
                          className="px-2 py-1 -mx-2 -my-1 active:opacity-70"
                          testID={`round-long-press-${i}`}
                        >
                          <Text className="text-sm text-gray-500 dark:text-gray-400">
                            {i + 1}
                          </Text>
                        </Pressable>
                      ) : (
                        <Text className="text-sm text-gray-500 dark:text-gray-400">
                          {i + 1}
                        </Text>
                      )}
                    </TableCell>
                    {game.players.map((player) => {
                      const playerScores = scores[player.id] ?? [];
                      const scoreCount = playerScores.length;
                      if (scoreCount === i) {
                        return (
                          <TableCell key={player.id} width={COL_WIDTH}>
                            <Pressable
                              onPress={() => openAddScoreDialog(player.id)}
                              className="w-8 h-8 rounded-full bg-blue-600 items-center justify-center active:opacity-80"
                            >
                              <Text className="text-white font-bold text-lg">+</Text>
                            </Pressable>
                          </TableCell>
                        );
                      }
                      if (scoreCount > i) {
                        return (
                          <TableCell key={player.id} width={COL_WIDTH}>
                            <Pressable
                              onPress={() => openEditScoreDialog(player.id, i, playerScores[i])}
                              className="px-2 py-1 rounded active:bg-gray-200 dark:active:bg-gray-700"
                            >
                              <Text className="text-base text-black dark:text-white">
                                {playerScores[i]}
                              </Text>
                            </Pressable>
                          </TableCell>
                        );
                      }
                      return (
                        <TableCell key={player.id} width={COL_WIDTH}>
                          <Text className="text-base text-gray-400 dark:text-gray-500">
                            —
                          </Text>
                        </TableCell>
                      );
                    })}
                  </TableRow>
                )
              )}

              {/* Total row */}
              <TableRow>
                <TableCell width={INDEX_WIDTH} align="center">
                  <Text className="text-sm font-semibold text-gray-600 dark:text-gray-400">
                    Total
                  </Text>
                </TableCell>
                {game.players.map((player) => (
                  <TableCell key={player.id} width={COL_WIDTH}>
                    <Text className="text-base font-semibold text-black dark:text-white">
                      {totals[player.id] ?? 0}
                    </Text>
                  </TableCell>
                ))}
              </TableRow>

              {/* Medal row */}
              {roundCount > 0 && (
                <TableRow>
                  <TableCell width={INDEX_WIDTH} align="center">
                    <Text className="text-lg"> </Text>
                  </TableCell>
                  {game.players.map((player) => (
                    <TableCell key={player.id} width={COL_WIDTH}>
                      <Text className="text-2xl">{getMedalForPlayer(player.id)}</Text>
                    </TableCell>
                  ))}
                </TableRow>
              )}
            </View>
        </ScrollView>
      </ScrollView>

      <Modal
        visible={roundMenuIndex !== null}
        transparent
        animationType="fade"
        onRequestClose={() => setRoundMenuIndex(null)}
      >
        <Pressable
          className="flex-1 bg-black/50 justify-center items-center px-6"
          onPress={() => setRoundMenuIndex(null)}
        >
          <Pressable
            className="bg-white dark:bg-gray-900 rounded-xl p-4 w-full max-w-xs"
            onPress={(e) => e.stopPropagation()}
          >
            <Text className="text-lg font-semibold text-black dark:text-white mb-3">
              Tour {roundMenuIndex !== null ? roundMenuIndex + 1 : ""}
            </Text>
            <Pressable
              onPress={() => roundMenuIndex !== null && handleDeleteRound(roundMenuIndex)}
              className="py-3 px-2 rounded-lg active:bg-gray-100 dark:active:bg-gray-800"
              testID="round-menu-delete"
            >
              <Text className="text-base text-red-600 dark:text-red-400">
                Supprimer le tour
              </Text>
            </Pressable>
            <Pressable
              onPress={() => roundMenuIndex !== null && handleCompleteRound(roundMenuIndex)}
              className="py-3 px-2 rounded-lg active:bg-gray-100 dark:active:bg-gray-800"
              testID="round-menu-complete"
            >
              <Text className="text-base text-black dark:text-white">
                Terminer le tour
              </Text>
            </Pressable>
          </Pressable>
        </Pressable>
      </Modal>

      <Modal
        visible={addScoreTarget !== null}
        transparent
        animationType="fade"
        onRequestClose={closeAddScoreDialog}
      >
        <Pressable
          className="flex-1 bg-black/50 justify-center items-center px-6"
          onPress={closeAddScoreDialog}
        >
          <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            className="w-full max-w-xs"
          >
            <Pressable
              className="bg-white dark:bg-gray-900 rounded-xl p-5"
              onPress={(e) => e.stopPropagation()}
            >
              <Text className="text-lg font-semibold text-black dark:text-white mb-3">
                {editRoundIndex !== null ? "Modifier le score" : "Score"} pour {game.players.find((p) => p.id === addScoreTarget)?.name ?? ""}
              </Text>
              <TextInput
                className="rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-800 text-black dark:text-white text-xl px-4 py-3 mb-4"
                placeholder="0"
                placeholderTextColor="#9ca3af"
                keyboardType="number-pad"
                value={addScoreInput}
                onChangeText={setAddScoreInput}
                autoFocus
              />
              <View className="flex-row gap-2">
                <Pressable
                  onPress={closeAddScoreDialog}
                  className="flex-1 py-3 rounded-lg border border-gray-300 dark:border-gray-600 active:opacity-70"
                >
                  <Text className="text-center text-gray-700 dark:text-gray-300">
                    Annuler
                  </Text>
                </Pressable>
                <Pressable
                  onPress={submitAddScore}
                  disabled={!canSubmitAddScore}
                  className="flex-1 py-3 rounded-lg bg-blue-600 active:opacity-80 disabled:opacity-50"
                >
                  <Text className="text-center text-white font-medium">Valider</Text>
                </Pressable>
              </View>
            </Pressable>
          </KeyboardAvoidingView>
        </Pressable>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  menuBackdrop: {
    zIndex: 10,
  },
  menuPopover: {
    position: "absolute",
    right: 16,
    zIndex: 11,
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.15,
        shadowRadius: 8,
      },
      android: {
        elevation: 6,
      },
    }),
  },
});
