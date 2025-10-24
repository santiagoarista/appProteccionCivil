import { Box, Button } from "@mui/material";

// NextTabButton Component
export const NextTabButton = ({ currentTab }: { currentTab: number }) => {
  const TOTAL_TABS = 7;

  if (currentTab >= TOTAL_TABS - 1) {
    return null;
  }

  const handleNext = () => {
    // Find and click the next tab
    const tabButtons = document.querySelectorAll('[role="tab"]');
    if (tabButtons[currentTab + 1]) {
      (tabButtons[currentTab + 1] as HTMLElement).click();
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
