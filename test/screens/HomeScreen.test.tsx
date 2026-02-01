import { render, screen } from "@testing-library/react-native";
import { HistoryItem } from "@/components/history";
import { NewGameForm, clampPlayerCount } from "@/components/home";
import type { HistoryEntry } from "@/features/domain/types";

const mockEntry: HistoryEntry = {
  game: {
    id: "g1",
    startedAt: "2025-01-15T14:30:00.000Z",
    players: [
      { id: "p1", name: "Alice" },
      { id: "p2", name: "Bob" },
    ],
  },
  scores: { p1: [10], p2: [5] },
  finishedAt: "2025-01-15T15:00:00.000Z",
};

describe("HomeScreen components", () => {
  it("NewGameForm renders main actions", () => {
    render(
      <NewGameForm
        playerCount={2}
        onPlayerCountChange={jest.fn()}
        onSubmit={jest.fn()}
      />
    );
    expect(screen.getByText("Choisis le nombre de joueurs")).toBeTruthy();
    expect(screen.getByText("Nouvelle partie")).toBeTruthy();
  });

  it("clampPlayerCount limits to 2-20", () => {
    expect(clampPlayerCount(1)).toBe(2);
    expect(clampPlayerCount(21)).toBe(20);
    expect(clampPlayerCount(10)).toBe(10);
  });

  it("HistoryItem renders Dernières parties list entries", () => {
    render(
      <HistoryItem
        entry={mockEntry}
        onResume={jest.fn()}
        onRestartSame={jest.fn()}
      />
    );
    expect(screen.getByText("Alice, Bob")).toBeTruthy();
    expect(screen.getByText("Reprendre")).toBeTruthy();
    expect(screen.getByText("Recommencer")).toBeTruthy();
  });
});
