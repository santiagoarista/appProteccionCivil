import { SelectInput } from "react-admin";
import {
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Typography,
} from "@mui/material";

const ApgarScoreInput = () => {
  const scoreChoices = [
    { id: 0, name: "0" },
    { id: 1, name: "1" },
    { id: 2, name: "2" },
  ];

  const apgarData = [
    {
      signo: "COLOR",
      descriptions: ["AZUL O PÁLIDO", "ACROCIANOSIS", "ROSADO COMPLETAMENTE"],
      field: "color",
    },
    {
      signo: "FC",
      descriptions: ["AUSENTE", "< 100 / min", "> 100 / min"],
      field: "fc",
    },
    {
      signo: "IRRITABILIDAD REFLEJA",
      descriptions: ["NO RESPUESTA", "MUECAS", "LLORA O RETIRA"],
      field: "irritabilidad",
    },
    {
      signo: "TONO MUSCULAR",
      descriptions: ["FLÁCCIDO", "ALGUNA FLEXIÓN", "MOVIMIENTOS ACTIVOS"],
      field: "tono",
    },
    {
      signo: "RESPIRACIÓN",
      descriptions: ["AUSENTE", "LENTA, IRREGULAR", "BUENA, LLORA"],
      field: "respiracion",
    },
  ];

  const timeIntervals = ["min_1", "min_5", "min_10", "min_15", "min_20"];
  const timeLabels = ["1 min", "5 min", "10 min", "15 min", "20 min"];

  return (
    <Table size="small" sx={{ mt: 2, border: "1px solid #e0e0e0" }}>
      <TableHead>
        <TableRow sx={{ backgroundColor: "#f5f5f5" }}>
          <TableCell sx={{ fontWeight: "bold", minWidth: 150 }}>
            SIGNO
          </TableCell>
          <TableCell sx={{ fontWeight: "bold", minWidth: 120 }}>0</TableCell>
          <TableCell sx={{ fontWeight: "bold", minWidth: 120 }}>1</TableCell>
          <TableCell sx={{ fontWeight: "bold", minWidth: 120 }}>2</TableCell>
          {timeLabels.map((label) => (
            <TableCell key={label} sx={{ fontWeight: "bold", minWidth: 80 }}>
              {label}
            </TableCell>
          ))}
        </TableRow>
      </TableHead>
      <TableBody>
        {apgarData.map((row) => (
          <TableRow key={row.field}>
            <TableCell sx={{ fontWeight: "medium" }}>
              <Typography variant="body2">{row.signo}</Typography>
            </TableCell>
            {row.descriptions.map((desc, index) => (
              <TableCell key={index}>
                <Typography variant="body2" sx={{ fontSize: "0.75rem" }}>
                  {desc}
                </Typography>
              </TableCell>
            ))}
            {timeIntervals.map((interval) => (
              <TableCell key={interval}>
                <SelectInput
                  source={`parto.apgar_scores.${interval}.${row.field}`}
                  choices={scoreChoices}
                  label=""
                  fullWidth={false}
                  sx={{ minWidth: 60 }}
                />
              </TableCell>
            ))}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default ApgarScoreInput;
