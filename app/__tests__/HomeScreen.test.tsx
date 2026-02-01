import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import React from "react";

vi.mock("react-native", () => ({
  View: ({ children, ...p }: { children?: React.ReactNode }) => <div {...p}>{children}</div>,
  Text: ({ children, ...p }: { children?: React.ReactNode }) => <span {...p}>{children}</span>,
  TextInput: (p: Record<string, unknown>) => <input {...p} />,
  Keyboard: { dismiss: vi.fn() },
  Pressable: ({ children, onPress, ...p }: { children?: React.ReactNode; onPress?: () => void }) => (
    <button type="button" onClick={onPress} {...p}>{children}</button>
  ),
}));

vi.mock("react-native-safe-area-context", () => ({
  SafeAreaView: ({ children, ...p }: { children?: React.ReactNode }) => <div {...p}>{children}</div>,
}));

vi.mock("nativewind", () => ({
  useColorScheme: () => ({ colorScheme: "light" as const }),
}));

vi.mock("@expo/vector-icons/FontAwesome", () => ({
  default: () => null,
}));

const mockPush = vi.fn();
vi.mock("expo-router", () => ({
  useRouter: () => ({ push: mockPush }),
  Link: ({ children, href }: { children: React.ReactNode; href: string }) => (
    <a href={href}>{children}</a>
  ),
}));

import HomeScreen from "../index";

describe("HomeScreen", () => {
  beforeEach(() => {
    mockPush.mockClear();
  });

  it("renders title and player count selector", () => {
    render(<HomeScreen />);
    expect(screen.getByText("ScoreBoard")).toBeTruthy();
    expect(screen.getByText("Choisis le nombre de joueurs")).toBeTruthy();
    expect(screen.getByText("Nouvelle partie")).toBeTruthy();
    expect(screen.getByText("Historique")).toBeTruthy();
    expect(screen.getByText("Paramètres")).toBeTruthy();
  });

  it("renders number input with +/- controls", () => {
    render(<HomeScreen />);
    const inputs = screen.getAllByDisplayValue("2");
    expect(inputs.length).toBeGreaterThan(0);
    expect(screen.getAllByText("−").length).toBeGreaterThan(0);
    expect(screen.getAllByText("+").length).toBeGreaterThan(0);
  });
});
