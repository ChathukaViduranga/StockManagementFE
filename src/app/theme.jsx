import { createTheme } from "@mui/material/styles";

export const theme = createTheme({
  palette: {
    primary: { main: "#0ea5e9" }, // Tailwind sky‑500
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
