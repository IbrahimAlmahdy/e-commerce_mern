import {
  useEffect,
  useMemo,
  useState,
  type FC,
  type PropsWithChildren,
} from "react";

import { ThemeModeContext, type ThemeMode } from "./ThemeModeContext";

const THEME_MODE_KEY = "nexora-theme-mode";

const getInitialMode = (): ThemeMode => {
  const savedMode = localStorage.getItem(THEME_MODE_KEY);

  if (savedMode === "light" || savedMode === "dark") {
    return savedMode;
  }

  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
};

export const ThemeModeProvider: FC<PropsWithChildren> = ({ children }) => {
  const [mode, setMode] = useState<ThemeMode>(getInitialMode);

  useEffect(() => {
    localStorage.setItem(THEME_MODE_KEY, mode);

    document.documentElement.classList.toggle("dark", mode === "dark");

    document.documentElement.style.colorScheme = mode;
  }, [mode]);

  const value = useMemo(
    () => ({
      mode,
      toggleColorMode: () => {
        setMode((currentMode) => (currentMode === "light" ? "dark" : "light"));
      },
    }),
    [mode],
  );

  return (
    <ThemeModeContext.Provider value={value}>
      {children}
    </ThemeModeContext.Provider>
  );
};
