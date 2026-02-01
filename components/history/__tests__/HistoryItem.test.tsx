import { fireEvent, render, screen } from "@testing-library/react-native";
import { HistoryItem } from "../HistoryItem";
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
  scores: { p1: [10, 5], p2: [3, 8] },
  finishedAt: "2025-01-15T15:00:00.000Z",
};

describe("HistoryItem", () => {
  it("renders player names and buttons", () => {
    const onView = jest.fn();
    const onResume = jest.fn();
    const onRestartSame = jest.fn();
    render(
      <HistoryItem
        entry={mockEntry}
        onView={onView}
        onResume={onResume}
        onRestartSame={onRestartSame}
      />
    );
    expect(screen.getByText("Alice, Bob")).toBeTruthy();
    expect(screen.getByText("Voir")).toBeTruthy();
    expect(screen.getByText("Reprendre")).toBeTruthy();
    expect(screen.getByText("Recommencer")).toBeTruthy();
  });

  it("calls onView when Voir pressed", () => {
    const onView = jest.fn();
    render(
      <HistoryItem
        entry={mockEntry}
        onView={onView}
        onResume={jest.fn()}
        onRestartSame={jest.fn()}
      />
    );
    fireEvent.press(screen.getByText("Voir"));
    expect(onView).toHaveBeenCalledTimes(1);
  });

  it("calls onResume when Reprendre pressed", () => {
    const onResume = jest.fn();
    render(
      <HistoryItem
        entry={mockEntry}
        onView={jest.fn()}
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
      <HistoryItem
        entry={mockEntry}
        onView={jest.fn()}
        onResume={jest.fn()}
        onRestartSame={onRestartSame}
      />
    );
    fireEvent.press(screen.getByText("Recommencer"));
    expect(onRestartSame).toHaveBeenCalledTimes(1);
  });
});
