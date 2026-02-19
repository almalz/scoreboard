import React, { useEffect, useState } from "react";
import { fireEvent, render, screen } from "@testing-library/react-native";
import GameScreen from "@/app/game";
import type { Game, Scores } from "@/features/domain/types";

const mockGame: Game = {
  id: "g1",
  startedAt: "2025-01-15T14:30:00.000Z",
  players: [
    { id: "p1", name: "Alice" },
    { id: "p2", name: "Bob" },
  ],
};

const mockScores: Scores = { p1: [10, 5], p2: [3, 8] };
const mockTotals = { p1: 15, p2: 11 };

const mockAddScore = jest.fn();
const mockUpdateScore = jest.fn();
const mockAddPlayer = jest.fn();
const mockRestartWithSamePlayers = jest.fn();
const mockFinishAndSaveCurrentGame = jest.fn();
const mockReplace = jest.fn();

jest.mock("@/features/hooks/useGame", () => ({
  useGame: () => ({
    game: mockGame,
    scores: mockScores,
    roundCount: 2,
    totals: mockTotals,
  }),
}));

jest.mock("@/features/hooks/useGameActions", () => ({
  useGameActions: () => ({
    addScore: mockAddScore,
    updateScore: mockUpdateScore,
    addPlayer: mockAddPlayer,
    restartWithSamePlayers: mockRestartWithSamePlayers,
    finishAndSaveCurrentGame: mockFinishAndSaveCurrentGame,
  }),
}));

// Capture navigation options so headerRight can be rendered in tests
const navigationOptions: Record<string, any> = {};

jest.mock("expo-router", () => ({
  useRouter: () => ({ replace: mockReplace, push: jest.fn() }),
  useNavigation: () => ({
    setOptions: (opts: any) => {
      Object.assign(navigationOptions, opts);
    },
  }),
}));

jest.mock("react-native-safe-area-context", () => ({
  useSafeAreaInsets: () => ({ top: 0, left: 0, right: 0, bottom: 0 }),
}));

jest.spyOn(require("react-native").Alert, "alert").mockImplementation(
  (_title: string, _message: string, buttons?: { text: string; onPress?: () => void }[]) => {
    const terminer = buttons?.find((b) => b.text === "Terminer");
    if (terminer?.onPress) terminer.onPress();
  }
);

/**
 * Wrapper that renders GameScreen along with the headerRight
 * component normally placed in the navigation header via setOptions.
 */
function GameScreenWithHeader() {
  const [ready, setReady] = useState(false);
  useEffect(() => {
    if (navigationOptions.headerRight && !ready) {
      setReady(true);
    }
  }, [ready]);
  return (
    <>
      {navigationOptions.headerRight?.()}
      <GameScreen />
    </>
  );
}

describe("GameScreen", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    for (const key of Object.keys(navigationOptions)) {
      delete navigationOptions[key];
    }
  });

  it("renders game header with player names", () => {
    render(<GameScreen />);
    expect(screen.getByText("Alice")).toBeTruthy();
    expect(screen.getByText("Bob")).toBeTruthy();
  });

  it("renders table headers Tours and Total", () => {
    render(<GameScreen />);
    expect(screen.getByText("Tours")).toBeTruthy();
    expect(screen.getByText("Total")).toBeTruthy();
  });

  it("renders round numbers and totals", () => {
    render(<GameScreen />);
    expect(screen.getByText("1")).toBeTruthy();
    expect(screen.getByText("2")).toBeTruthy();
    // "3" appears both as a round number and as Bob's score
    expect(screen.getAllByText("3").length).toBeGreaterThan(0);
    expect(screen.getByText("15")).toBeTruthy();
    expect(screen.getByText("11")).toBeTruthy();
  });

  it("renders menu trigger (⋯)", () => {
    render(<GameScreenWithHeader />);
    expect(screen.getByText("⋯")).toBeTruthy();
  });

  it("opens menu and shows Ajouter un joueur, Recommencer, Terminer la partie", () => {
    render(<GameScreenWithHeader />);
    fireEvent.press(screen.getByText("⋯"));
    expect(screen.getByText("Ajouter un joueur")).toBeTruthy();
    expect(screen.getByText("Recommencer")).toBeTruthy();
    expect(screen.getByText("Terminer la partie")).toBeTruthy();
  });

  it("calls restartWithSamePlayers when Recommencer is pressed in menu", () => {
    render(<GameScreenWithHeader />);
    fireEvent.press(screen.getByText("⋯"));
    fireEvent.press(screen.getByText("Recommencer"));
    expect(mockRestartWithSamePlayers).toHaveBeenCalledTimes(1);
  });

  it("shows add player bar when Ajouter un joueur is pressed", () => {
    render(<GameScreenWithHeader />);
    fireEvent.press(screen.getByText("⋯"));
    fireEvent.press(screen.getByText("Ajouter un joueur"));
    expect(screen.getByPlaceholderText("Nom du joueur")).toBeTruthy();
    expect(screen.getByText("Ajouter")).toBeTruthy();
    expect(screen.getByText("Annuler")).toBeTruthy();
  });

  it("calls finishAndSaveCurrentGame and replace(/) when Terminer la partie is confirmed", () => {
    render(<GameScreenWithHeader />);
    fireEvent.press(screen.getByText("⋯"));
    fireEvent.press(screen.getByText("Terminer la partie"));
    expect(mockFinishAndSaveCurrentGame).toHaveBeenCalledTimes(1);
    expect(mockReplace).toHaveBeenCalledWith("/");
  });

  it("opens add score modal when + is pressed for a player", () => {
    render(<GameScreen />);
    const addButtons = screen.getAllByText("+");
    fireEvent.press(addButtons[0]);
    expect(screen.getByText(/Score pour Alice/)).toBeTruthy();
    expect(screen.getByPlaceholderText("0")).toBeTruthy();
    expect(screen.getByText("Valider")).toBeTruthy();
    expect(screen.getByText("Annuler")).toBeTruthy();
  });

  it("calls addScore when score modal is submitted with a number", () => {
    render(<GameScreen />);
    const addButtons = screen.getAllByText("+");
    fireEvent.press(addButtons[0]);
    fireEvent.changeText(screen.getByPlaceholderText("0"), "7");
    fireEvent.press(screen.getByText("Valider"));
    expect(mockAddScore).toHaveBeenCalledWith("p1", 7);
  });

  it("opens edit score modal when an existing score is pressed", () => {
    render(<GameScreen />);
    fireEvent.press(screen.getByText("10"));
    expect(screen.getByText(/Modifier le score pour Alice/)).toBeTruthy();
    expect(screen.getByDisplayValue("10")).toBeTruthy();
  });

  it("calls updateScore when edit score modal is submitted", () => {
    render(<GameScreen />);
    fireEvent.press(screen.getByText("10"));
    fireEvent.changeText(screen.getByDisplayValue("10"), "20");
    fireEvent.press(screen.getByText("Valider"));
    expect(mockUpdateScore).toHaveBeenCalledWith("p1", 0, 20);
  });
});
