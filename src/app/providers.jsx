"use client";

import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import React from "react";

// build the theme *inside* the client boundary
const theme = createTheme({
  palette: {
    primary: { main: "#0ea5e9" },
    background: { default: "#f0f8ff" },
  },
  components: {
    MuiDataGrid: {
      styleOverrides: {
        root: { borderRadius: 12 },
        columnHeaders: { backgroundColor: "#cfe8ff" },
      },
    },
  },
});

export function Providers({ children }) {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {children}
    </ThemeProvider>
  );
}
