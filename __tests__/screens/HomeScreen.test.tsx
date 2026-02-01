/**
 * HomeScreen tests using renderRouter.
 * Note: renderRouter requires @react-navigation to be transformed - if you get
 * "Unexpected token 'export'" errors, ensure transformIgnorePatterns includes
 * @react-navigation in the transform allowlist.
 */
import { render, screen } from "@testing-library/react-native";
import { NewGameForm, clampPlayerCount } from "@/components/home";

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
});
