import { createTheme } from "@mui/material/styles";
import type { PaletteMode } from "@mui/material";

export const createNexoraTheme = (mode: PaletteMode) =>
  createTheme({
    palette: {
      mode,
      primary: {
        main: "#3478F6",
        light: "#78A7FF",
        dark: "#2463CE",
        contrastText: "#FFFFFF",
      },
      secondary: {
        main: "#2463CE",
        light: "#5A91F8",
        dark: "#184A9A",
        contrastText: "#FFFFFF",
      },
      background:
        mode === "light"
          ? { default: "#F3F5F8", paper: "#FFFFFF" }
          : { default: "#17191F", paper: "#22252D" },
      text:
        mode === "light"
          ? { primary: "#17191F", secondary: "#5B6472" }
          : { primary: "#FFFFFF", secondary: "#C2C8D2" },
      divider: mode === "light" ? "#DDE2E9" : "#3A3E47",
      action:
        mode === "light"
          ? { hover: "#E7EFFF", selected: "#D8E6FF" }
          : { hover: "#252A34", selected: "#2D374A" },
      error:
        mode === "light"
          ? { main: "#B83A50", contrastText: "#FFFFFF" }
          : { main: "#FF93A3", contrastText: "#17191F" },
    },
    components: {
      MuiAppBar: {
        defaultProps: {
          color: "transparent",
        },
        styleOverrides: {
          root: {
            backgroundColor: "#17191F",
            color: "#FFFFFF",
          },
        },
      },
      MuiButtonBase: {
        styleOverrides: {
          root: {
            "&.Mui-focusVisible": {
              outline: "3px solid rgba(52, 120, 246, 0.5)",
              outlineOffset: 2,
            },
          },
        },
      },
      MuiButton: {
        styleOverrides: {
          root: {
            transition: "background-color 160ms ease, border-color 160ms ease, color 160ms ease",
          },
        },
      },
      MuiCard: {
        styleOverrides: {
          root: ({ theme }) => ({
            border: `1px solid ${theme.palette.divider}`,
            transition: "background-color 160ms ease, border-color 160ms ease",
          }),
        },
      },
    },
  });
