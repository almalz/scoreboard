import { fireEvent, render, screen } from "@testing-library/react-native";
import { Alert } from "react-native";
import SettingsScreen from "@/app/settings";
import { useGameStore } from "@/features/store/gameStore";
import { createPlayer } from "@/features/domain/game";

describe("SettingsScreen", () => {
  const alertSpy = jest.spyOn(Alert, "alert").mockImplementation(() => {});

  beforeEach(() => {
    alertSpy.mockClear();
    useGameStore.setState({
      currentGame: null,
      currentScores: {},
      history: [],
      _hasRehydrated: true,
    });
  });

  it("renders Thème and theme options", () => {
    render(<SettingsScreen />);
    expect(screen.getByText("Thème")).toBeTruthy();
    expect(screen.getByText("Clair")).toBeTruthy();
    expect(screen.getByText("Sombre")).toBeTruthy();
    expect(screen.getByText("Système")).toBeTruthy();
  });

  it("calls setTheme when option pressed", () => {
    render(<SettingsScreen />);
    fireEvent.press(screen.getByText("Sombre"));
    expect(screen.getByText("✓")).toBeTruthy();
  });

  it("renders Effacer l'historique button", () => {
    render(<SettingsScreen />);
    expect(screen.getByText("Effacer l'historique")).toBeTruthy();
  });

  it("shows confirmation alert when pressing Effacer l'historique", () => {
    render(<SettingsScreen />);
    fireEvent.press(screen.getByText("Effacer l'historique"));
    expect(alertSpy).toHaveBeenCalledWith(
      "Effacer l'historique",
      "Êtes-vous sûr de vouloir effacer tout l'historique des parties ?",
      expect.any(Array)
    );
    const buttons = alertSpy.mock.calls[0][2];
    expect(buttons).toHaveLength(2);
    expect(buttons![0].text).toBe("Annuler");
    expect(buttons![1].text).toBe("Effacer");
  });

  it("clears history when user confirms in alert", () => {
    const players = [createPlayer("Alice"), createPlayer("Bob")];
    useGameStore.getState().createGame(players);
    useGameStore.getState().finishAndSaveCurrentGame();
    expect(useGameStore.getState().history).toHaveLength(1);

    render(<SettingsScreen />);
    fireEvent.press(screen.getByText("Effacer l'historique"));
    const buttons = alertSpy.mock.calls[0][2];
    buttons![1].onPress!();

    expect(useGameStore.getState().history).toHaveLength(0);
  });
});
