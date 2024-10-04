"use client"


import { createTheme } from "@mui/material/styles";

// Definimos el tema personalizado con los colores que mencionaste
const customTheme = createTheme({
  palette: {
    primary: {
      main: '#011B3D', 
    },
    secondary: {
      main: '#A6B0EB', // Color para otros botones
    },
    background: {
      default: '#F0F3FF', // Color de fondo
      paper: '#ffffff', // Color casi blanco para contenedores o el fondo general
    },
  },
  typography: {
    fontFamily: "Geist Sans, sans-serif", // Fuente personalizada
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none', // Para evitar que el texto de los botones esté en mayúsculas
        },
      },
    },
  },
});

export default customTheme;
