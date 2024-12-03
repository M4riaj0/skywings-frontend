import { useState } from "react";
import { Alert, AlertTitle, Box, Grid, IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

const SeatLegend = () => {
  const [showAlert, setShowAlert] = useState(true);

  if (!showAlert) return null;

  return (
    <Alert
      severity="info"
      action={
        <IconButton
          aria-label="close"
          color="inherit"
          size="small"
          onClick={() => setShowAlert(false)}
        >
          <CloseIcon fontSize="inherit" />
        </IconButton>
      }
      sx={{
        position: "fixed",
        right: 4,
        top: "200px",
        border: "1px solid #90caf9",
        borderRadius: "8px",
        boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)",
        backgroundColor: "#e3f2fd",
        color: "#0d47a1",
        padding: "16px",
        width: "100%",
        maxWidth: "400px",
        marginBottom: "24px",
      }}
    >
      <AlertTitle sx={{ fontSize: "1.25rem", fontWeight: "bold" }}>
        Información de Asientos
      </AlertTitle>
      <Box sx={{ flexGrow: 1 }}>
        <Grid container spacing={2}>
          <Grid item xs={6}>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                backgroundColor: "#bbdefb",
                padding: "8px",
                borderRadius: "4px",
                fontSize: "0.95rem",
              }}
            >
              Tu asiento
            </Box>
          </Grid>
          <Grid item xs={6}>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                backgroundColor: "#ffcdd2",
                padding: "8px",
                borderRadius: "4px",
                fontSize: "0.95rem",
              }}
            >
              Ocupado
            </Box>
          </Grid>
          <Grid item xs={6}>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                backgroundColor: "#fff9c4",
                padding: "8px",
                borderRadius: "4px",
                fontSize: "0.95rem",
              }}
            >
              Inhabilitado
            </Box>
          </Grid>
          <Grid item xs={6}>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                backgroundColor: "#c8e6c9",
                padding: "8px",
                borderRadius: "4px",
                fontSize: "0.95rem",
              }}
            >
              Disponible
            </Box>
          </Grid>
        </Grid>
      </Box>
    </Alert>
  );
};

export default SeatLegend;
