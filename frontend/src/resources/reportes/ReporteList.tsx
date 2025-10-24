import {
  List,
  Datagrid,
  TextField,
  SimpleList,
  EditButton,
  usePermissions,
} from "react-admin";
import { useMediaQuery, Theme } from "@mui/material";

export const ReporteList = () => {
  const isSmall = useMediaQuery((theme: Theme) => theme.breakpoints.down("sm"));
  const { permissions } = usePermissions();

  // Filter logic based on user role:
  // - Administrador: sees all reports
  // - Jefe de Turno: sees only reports from their turno
  // - Paramédico: sees only reports they created
  let filter = {};
  if (permissions?.role === "administrador") {
    filter = {}; // No filter - see all
  } else if (permissions?.role === "jefe_turno") {
    filter = { turnoId: permissions?.turnoId }; // Only their turno
  } else if (permissions?.role === "paramedico") {
    filter = { colaboradorId: permissions?.userId }; // Only their reports
  }

  return (
    <List
      filter={filter}
      sort={{ field: "datos_servicio.fecha", order: "DESC" }}
    >
      {isSmall ? (
        <SimpleList
          primaryText={(record) =>
            record.datos_paciente?.nombre || "Sin nombre"
          }
          secondaryText={(record) =>
            record.datos_servicio?.fecha
              ? new Date(record.datos_servicio.fecha).toLocaleDateString()
              : "Sin fecha"
          }
          tertiaryText={(record) => record.observaciones?.texto || ""}
        />
      ) : (
        <Datagrid>
          <TextField source="tipo_reporte" label="Tipo" />
          <TextField source="folio" label="Folio" />
          <TextField source="fecha" label="Fecha" />
          <TextField
            source="datos_paciente.nombre"
            label="Nombre del Paciente"
          />
          <TextField source="datos_paciente.sexo" label="Sexo" />
          <TextField source="traslado.hospital" label="Hospital" />
          <EditButton />
        </Datagrid>
      )}
    </List>
  );
};
