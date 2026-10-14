import { createContext, useContext } from "react";

export type ThemeMode = "light" | "dark";

interface ThemeModeContextValue {
  mode: ThemeMode;
  toggleColorMode: () => void;
}

export const ThemeModeContext = createContext<
  ThemeModeContextValue | undefined
>(undefined);

export const useThemeMode = () => {
  const context = useContext(ThemeModeContext);

  if (!context) {
    throw new Error("useThemeMode must be used within ThemeModeProvider");
  }

  return context;
};
