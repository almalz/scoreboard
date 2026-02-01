import { fireEvent, render, screen } from "@testing-library/react-native";
import { PlayerCountStepper, clampPlayerCount } from "../PlayerCountStepper";

describe("clampPlayerCount", () => {
  it("clamps to MIN (2) when below", () => {
    expect(clampPlayerCount(1)).toBe(2);
    expect(clampPlayerCount(0)).toBe(2);
  });

  it("clamps to MAX (20) when above", () => {
    expect(clampPlayerCount(21)).toBe(20);
    expect(clampPlayerCount(100)).toBe(20);
  });

  it("returns value when in range", () => {
    expect(clampPlayerCount(2)).toBe(2);
    expect(clampPlayerCount(10)).toBe(10);
    expect(clampPlayerCount(20)).toBe(20);
  });
});

describe("PlayerCountStepper", () => {
  it("renders value and Moins/Plus buttons", () => {
    render(<PlayerCountStepper value={4} onChange={jest.fn()} />);
    expect(screen.getByDisplayValue("4")).toBeTruthy();
    expect(screen.getByLabelText("Moins")).toBeTruthy();
    expect(screen.getByLabelText("Plus")).toBeTruthy();
  });

  it("calls onChange with value-1 when Moins pressed", () => {
    const onChange = jest.fn();
    render(<PlayerCountStepper value={5} onChange={onChange} />);
    fireEvent.press(screen.getByLabelText("Moins"));
    expect(onChange).toHaveBeenCalledWith(4);
  });

  it("calls onChange with value+1 when Plus pressed", () => {
    const onChange = jest.fn();
    render(<PlayerCountStepper value={5} onChange={onChange} />);
    fireEvent.press(screen.getByLabelText("Plus"));
    expect(onChange).toHaveBeenCalledWith(6);
  });

  it("clamps Moins at 2", () => {
    const onChange = jest.fn();
    render(<PlayerCountStepper value={2} onChange={onChange} />);
    fireEvent.press(screen.getByLabelText("Moins"));
    expect(onChange).toHaveBeenCalledWith(2);
  });

  it("clamps Plus at 20", () => {
    const onChange = jest.fn();
    render(<PlayerCountStepper value={20} onChange={onChange} />);
    fireEvent.press(screen.getByLabelText("Plus"));
    expect(onChange).toHaveBeenCalledWith(20);
  });
});
