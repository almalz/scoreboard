import { render, screen } from "@testing-library/react-native";
import { ReadOnlyScoreTable } from "../ReadOnlyScoreTable";
import type { Game, Scores } from "@/features/domain/types";

const mockGame: Game = {
  id: "g1",
  startedAt: "2025-01-15T14:30:00.000Z",
  players: [
    { id: "p1", name: "Alice" },
    { id: "p2", name: "Bob" },
  ],
};

describe("ReadOnlyScoreTable", () => {
  it("renders headers Joueur, R1, R2, Total", () => {
    const scores: Scores = { p1: [10, 5], p2: [3, 8] };
    render(<ReadOnlyScoreTable game={mockGame} scores={scores} />);
    expect(screen.getByText("Joueur")).toBeTruthy();
    expect(screen.getByText("R1")).toBeTruthy();
    expect(screen.getByText("R2")).toBeTruthy();
    expect(screen.getByText("Total")).toBeTruthy();
  });

  it("renders player names and scores", () => {
    const scores: Scores = { p1: [10, 5], p2: [3, 8] };
    render(<ReadOnlyScoreTable game={mockGame} scores={scores} />);
    expect(screen.getByText("Alice")).toBeTruthy();
    expect(screen.getByText("Bob")).toBeTruthy();
    expect(screen.getAllByText("10")).toBeTruthy();
    expect(screen.getAllByText("5")).toBeTruthy();
    expect(screen.getAllByText("3")).toBeTruthy();
    expect(screen.getAllByText("8")).toBeTruthy();
  });

  it("renders totals correctly", () => {
    const scores: Scores = { p1: [10, 5], p2: [3, 8] };
    render(<ReadOnlyScoreTable game={mockGame} scores={scores} />);
    expect(screen.getByText("15")).toBeTruthy(); // Alice 10+5
    expect(screen.getByText("11")).toBeTruthy(); // Bob 3+8
  });

  it("renders dash for missing scores when player has fewer rounds", () => {
    const scores: Scores = { p1: [10], p2: [3, 5] }; // Alice has 1, Bob has 2 rounds
    render(<ReadOnlyScoreTable game={mockGame} scores={scores} />);
    expect(screen.getAllByText("—").length).toBeGreaterThanOrEqual(1);
  });
});
