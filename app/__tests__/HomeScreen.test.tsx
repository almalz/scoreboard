import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import React from "react";

vi.mock("react-native", () => ({
  View: ({ children, ...p }: { children?: React.ReactNode }) => <div {...p}>{children}</div>,
  Text: ({ children, ...p }: { children?: React.ReactNode }) => <span {...p}>{children}</span>,
  Pressable: ({ children, onPress, ...p }: { children?: React.ReactNode; onPress?: () => void }) => (
    <button type="button" onClick={onPress} {...p}>{children}</button>
  ),
}));
vi.mock("react-native-reanimated", () => ({
  default: {
    View: ({ children, ...p }: { children?: React.ReactNode }) => <div {...p}>{children}</div>,
  },
  FadeIn: { duration: () => ({ delay: () => ({ springify: () => {} }), springify: () => {} }) },
  FadeInDown: { duration: () => ({ delay: () => ({ springify: () => {} }), springify: () => {} }) },
}));

const mockPush = vi.fn();
vi.mock("expo-router", () => ({
  useRouter: () => ({ push: mockPush }),
  Link: ({ children, href }: { children: React.ReactNode; href: string }) => (
    <a href={href}>{children}</a>
  ),
}));

import HomeScreen from "../(tabs)/index";

describe("HomeScreen", () => {
  beforeEach(() => {
    mockPush.mockClear();
  });

  it("renders title and player count selector", () => {
    render(<HomeScreen />);
    expect(screen.getByText("ScoreBoard")).toBeTruthy();
    expect(screen.getByText("Choisis le nombre de joueurs")).toBeTruthy();
    expect(screen.getByText("Nouvelle partie")).toBeTruthy();
    expect(screen.getByText("Paramètres")).toBeTruthy();
  });

  it("renders number buttons 2 to 8", () => {
    render(<HomeScreen />);
    expect(screen.getAllByText("2").length).toBeGreaterThan(0);
    expect(screen.getAllByText("8").length).toBeGreaterThan(0);
  });
});
