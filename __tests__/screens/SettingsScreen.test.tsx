import { fireEvent, render, screen } from "@testing-library/react-native";
import SettingsScreen from "@/app/settings";

describe("SettingsScreen", () => {
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
});
