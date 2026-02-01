import { getRoundCount, getTotalScore } from "@/features/domain/scores";
import type { Game, Scores } from "@/features/domain/types";
import { Text, View } from "react-native";

interface ReadOnlyScoreTableProps {
  game: Game;
  scores: Scores;
}

export function ReadOnlyScoreTable({ game, scores }: ReadOnlyScoreTableProps) {
  const roundCount = getRoundCount(scores);

  return (
    <View className="flex-1">
      <View className="flex-row border-b border-gray-200 dark:border-gray-700 pb-2 mb-2">
        <Text className="flex-1 text-sm font-semibold text-gray-600 dark:text-gray-400">
          Joueur
        </Text>
        {Array.from({ length: roundCount }, (_, i) => (
          <Text
            key={i}
            className="w-10 text-center text-sm font-semibold text-gray-600 dark:text-gray-400"
          >
            {`R${i + 1}`}
          </Text>
        ))}
        <Text className="w-12 text-right text-sm font-semibold text-gray-600 dark:text-gray-400">
          Total
        </Text>
      </View>
      {game.players.map((player) => {
        const playerScores = scores[player.id] ?? [];
        const total = getTotalScore(scores, player.id);
        return (
          <View
            key={player.id}
            className="flex-row border-b border-gray-100 dark:border-gray-800 py-2"
          >
            <Text className="flex-1 text-black dark:text-white" numberOfLines={1}>
              {player.name}
            </Text>
            {Array.from({ length: roundCount }, (_, i) => (
              <Text
                key={i}
                className="w-10 text-center text-black dark:text-white"
              >
                {playerScores[i] ?? "—"}
              </Text>
            ))}
            <Text className="w-12 text-right font-semibold text-black dark:text-white">
              {total}
            </Text>
          </View>
        );
      })}
    </View>
  );
}
