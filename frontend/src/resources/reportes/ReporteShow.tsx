import { Show, TabbedShowLayout, Tab, TextField } from "react-admin";

export const ReporteShow = () => (
  <Show>
    <TabbedShowLayout>
      <Tab label="Identificación">
        <TextField source="tipo_reporte" label="Tipo de Reporte" />
        <TextField source="folio" label="Folio" />
        <TextField source="fecha" label="Fecha" />
      </Tab>
      <Tab label="Servicio">
        <TextField source="datos_servicio.hora_llamada" label="Hora Llamada" />
        <TextField source="datos_servicio.hora_salida" label="Hora Salida" />
        <TextField source="datos_servicio.hora_llegada" label="Hora Llegada" />
        <TextField
          source="datos_servicio.motivo_atencion"
          label="Motivo de Atención"
        />
        <TextField source="datos_servicio.calle" label="Calle" />
        <TextField
          source="datos_servicio.colonia_comunidad"
          label="Colonia/Comunidad"
        />
        <TextField
          source="control.numero_ambulancia"
          label="Número de Ambulancia"
        />
        <TextField source="control.operador" label="Operador" />
      </Tab>
      <Tab label="Paciente">
        <TextField source="datos_paciente.nombre" label="Nombre del Paciente" />
        <TextField source="datos_paciente.sexo" label="Sexo" />
        <TextField source="datos_paciente.edad.anios" label="Edad (años)" />
        <TextField source="datos_paciente.telefono" label="Teléfono" />
      </Tab>
      <Tab label="Evaluación">
        <TextField
          source="evaluacion_inicial.nivel_consciencia"
          label="Nivel de Consciencia"
        />
        <TextField
          source="evaluacion_inicial.glasgow.total"
          label="Glasgow Total"
        />
      </Tab>
      <Tab label="Tratamiento">
        <TextField
          source="tratamiento.doctor_tratante"
          label="Doctor Tratante"
        />
      </Tab>
      <Tab label="Traslado">
        <TextField
          source="traslado.condicion_paciente"
          label="Condición del Paciente"
        />
        <TextField source="traslado.prioridad" label="Prioridad" />
        <TextField source="traslado.hospital" label="Hospital" />
        <TextField source="traslado.dr" label="Dr" />
        <TextField source="traslado.folio_cru" label="Folio CRU" />
      </Tab>
      <Tab label="Observaciones">
        <TextField source="observaciones.pertenencias" label="Pertenencias" />
        <TextField source="observaciones.texto" label="Observaciones" />
      </Tab>
    </TabbedShowLayout>
  </Show>
);
