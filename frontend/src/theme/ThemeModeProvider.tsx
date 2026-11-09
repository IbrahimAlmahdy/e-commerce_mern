import {
  useCallback,
  useMemo,
  useState,
  type FC,
  type PropsWithChildren,
} from "react";
import { ThemeModeContext, type ThemeMode } from "./ThemeModeContext";

const THEME_MODE_KEY = "nexora-theme-mode";

// Apply theme to the document
const applyTheme = (mode: ThemeMode) => {
  const root = document.documentElement;

  root.classList.toggle("dark", mode === "dark");
  root.style.colorScheme = mode;

  localStorage.setItem(THEME_MODE_KEY, mode);
};

// Get initial theme
const getInitialMode = (): ThemeMode => {
  const savedMode = localStorage.getItem(THEME_MODE_KEY);

  const initialMode: ThemeMode =
    savedMode === "light" || savedMode === "dark"
      ? savedMode
      : window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light";

  return initialMode;
};

// Initialize theme before React renders
const initialMode = getInitialMode();

applyTheme(initialMode);

export const ThemeModeProvider: FC<PropsWithChildren> = ({ children }) => {
  const [mode, setMode] = useState<ThemeMode>(initialMode);

  const toggleColorMode = useCallback(() => {
    const nextMode: ThemeMode = mode === "light" ? "dark" : "light";

    applyTheme(nextMode);
    setMode(nextMode);
  }, [mode]);

  const value = useMemo(
    () => ({
      mode,
      toggleColorMode,
    }),
    [mode, toggleColorMode],
  );
  return (
    <ThemeModeContext.Provider value={value}>
      {children}
    </ThemeModeContext.Provider>
  );
};
