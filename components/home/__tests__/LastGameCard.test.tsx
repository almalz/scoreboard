import { fireEvent, render, screen } from "@testing-library/react-native";
import { LastGameCard } from "../LastGameCard";
import type { Game } from "@/features/domain/types";

const mockGame: Game = {
  id: "g1",
  startedAt: "2025-01-15T14:30:00.000Z",
  players: [
    { id: "p1", name: "Alice" },
    { id: "p2", name: "Bob" },
  ],
};

describe("LastGameCard", () => {
  it("renders Dernière partie and player names", () => {
    render(
      <LastGameCard
        game={mockGame}
        onResume={jest.fn()}
        onRestartSame={jest.fn()}
      />
    );
    expect(screen.getByText("Dernière partie")).toBeTruthy();
    expect(screen.getByText("Alice, Bob")).toBeTruthy();
    expect(screen.getByText("Reprendre")).toBeTruthy();
    expect(screen.getByText("Recommencer")).toBeTruthy();
  });

  it("calls onResume when Reprendre pressed", () => {
    const onResume = jest.fn();
    render(
      <LastGameCard
        game={mockGame}
        onResume={onResume}
        onRestartSame={jest.fn()}
      />
    );
    fireEvent.press(screen.getByText("Reprendre"));
    expect(onResume).toHaveBeenCalledTimes(1);
  });

  it("calls onRestartSame when Recommencer pressed", () => {
    const onRestartSame = jest.fn();
    render(
      <LastGameCard
        game={mockGame}
        onResume={jest.fn()}
        onRestartSame={onRestartSame}
      />
    );
    fireEvent.press(screen.getByText("Recommencer"));
    expect(onRestartSame).toHaveBeenCalledTimes(1);
  });

  it("renders Voir button when onView provided", () => {
    render(
      <LastGameCard
        game={mockGame}
        onResume={jest.fn()}
        onRestartSame={jest.fn()}
        onView={jest.fn()}
      />
    );
    expect(screen.getByText("Voir")).toBeTruthy();
  });

  it("calls onView when Voir pressed", () => {
    const onView = jest.fn();
    render(
      <LastGameCard
        game={mockGame}
        onResume={jest.fn()}
        onRestartSame={jest.fn()}
        onView={onView}
      />
    );
    fireEvent.press(screen.getByText("Voir"));
    expect(onView).toHaveBeenCalledTimes(1);
  });
});
