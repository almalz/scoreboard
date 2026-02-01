import { fireEvent, render, screen } from "@testing-library/react-native";
import { NewGameForm } from "../NewGameForm";

describe("NewGameForm", () => {
  it("renders label and Nouvelle partie button", () => {
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

  it("calls onSubmit when Nouvelle partie is pressed", () => {
    const onSubmit = jest.fn();
    render(
      <NewGameForm
        playerCount={2}
        onPlayerCountChange={jest.fn()}
        onSubmit={onSubmit}
      />
    );
    fireEvent.press(screen.getByText("Nouvelle partie"));
    expect(onSubmit).toHaveBeenCalledTimes(1);
  });

  it("displays player count in stepper", () => {
    render(
      <NewGameForm
        playerCount={4}
        onPlayerCountChange={jest.fn()}
        onSubmit={jest.fn()}
      />
    );
    expect(screen.getByDisplayValue("4")).toBeTruthy();
  });
});
