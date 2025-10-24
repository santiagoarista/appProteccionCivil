import { Box, Button } from "@mui/material";
import { useWatch } from "react-hook-form";

// ConditionalNextTabButton - navigates based on tipo_reporte
export const ConditionalNextTabButton = () => {
  const tipoReporte = useWatch({ name: "tipo_reporte" });

  const handleNext = () => {
    const tabButtons = document.querySelectorAll('[role="tab"]');

    // If URBANO, go to tab 1 (Reportes urbanos)
    // If MEDICO, go to tab 2 (Paciente Médico)
    const nextTabIndex = tipoReporte === "URBANO" ? 1 : 2;

    if (tabButtons[nextTabIndex]) {
      (tabButtons[nextTabIndex] as HTMLElement).click();
    }
  };

  return (
    <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 3 }}>
      <Button variant="contained" color="primary" onClick={handleNext}>
        Siguiente
      </Button>
    </Box>
  );
};
