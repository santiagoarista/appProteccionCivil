import {
  Edit,
  TextInput,
  SelectInput,
  FormTab,
  TabbedForm,
  NumberInput,
  DateInput,
  ArrayInput,
  SimpleFormIterator,
  RadioButtonGroupInput,
  CheckboxGroupInput,
  required,
} from "react-admin";
import { Box } from "@mui/material";
import TimeInput from "../../components/TimeInput";
import { NextTabButton } from "./components/NextTabButton";
import { GlasgowTotalCalculator } from "./components/GlasgowTotalCalculator";
import { PartoTab } from "./components/PartoTab";
import { CausaTraumaticaTab } from "./components/CausaTraumaticaTab";
import { CausaClinicaTab } from "./components/CausaClinicaTab";
import {
  sexoChoices,
  lugarOcurrenciaChoices,
  nivelConscienciaChoices,
  condicionPacienteChoices,
  prioridadChoices,
} from "./constants";

export const ReporteEdit = () => {
  return (
    <Edit>
      <TabbedForm syncWithLocation={false}>
        <FormTab label="1. Servicio">
          <TextInput source="folio" label="Folio" validate={required()} />
          <DateInput source="fecha" label="Fecha" validate={required()} />
          <SelectInput
            source="tipo_reporte"
            label="Tipo de Reporte"
            choices={[
              { id: "MEDICO", name: "Médico" },
              { id: "URBANO", name: "Urbano" },
            ]}
          />

          <h3>Cronometría</h3>
          <TimeInput
            source="datos_servicio.hora_llamada"
            label="Hora Llamada"
          />
          <TimeInput source="datos_servicio.hora_salida" label="Hora Salida" />
          <TimeInput
            source="datos_servicio.hora_llegada"
            label="Hora Llegada"
          />
          <TimeInput
            source="datos_servicio.hora_traslado"
            label="Hora Traslado"
          />
          <TimeInput
            source="datos_servicio.hora_hospital"
            label="Hora Hospital"
          />
          <TimeInput
            source="datos_servicio.salida_hospital"
            label="Salida Hospital"
          />
          <TimeInput source="datos_servicio.hora_base" label="Hora Base" />
          <SelectInput
            source="datos_servicio.motivo_atencion"
            label="Motivo de la Atención"
            choices={[
              { id: "ENFERMEDAD", name: "Enfermedad" },
              { id: "TRAUMATISMO", name: "Traumatismo" },
              { id: "GINECO OBSTÉTRICO", name: "Gineco Obstétrico" },
            ]}
          />
          <h3>Ubicación del servicio</h3>
          <TextInput source="datos_servicio.calle" label="Calle" />
          <TextInput
            source="datos_servicio.entre_calles"
            label="Entre Calles"
          />
          <TextInput
            source="datos_servicio.colonia_comunidad"
            label="Colonia/Comunidad"
          />
          <TextInput
            source="datos_servicio.alcaldia_municipio"
            label="Alcaldía/Municipio"
          />
          <SelectInput
            source="datos_servicio.lugar_ocurrencia"
            label="Lugar de Ocurrencia"
            choices={lugarOcurrenciaChoices}
          />

          <h3>Control</h3>
          <TextInput
            source="control.numero_ambulancia"
            label="Número de Ambulancia"
          />
          <TextInput source="control.operador" label="Operador" />
          <TextInput source="control.tum" label="T.U.M" />
          <TextInput source="control.socorrista" label="Socorrista" />
          <TextInput
            source="control.helicoptero_matricula"
            label="Helicóptero Matrícula"
          />

          <NextTabButton currentTab={0} />
        </FormTab>

        <FormTab label="2. Paciente">
          <h3>Datos del Paciente</h3>
          <TextInput
            source="datos_paciente.nombre"
            label="Nombre del Paciente"
          />
          <RadioButtonGroupInput
            source="datos_paciente.sexo"
            label="Sexo"
            choices={sexoChoices}
          />
          <NumberInput source="datos_paciente.edad.anios" label="Años" />
          <NumberInput source="datos_paciente.edad.meses" label="Meses" />
          <TextInput source="datos_paciente.telefono" label="Teléfono" />
          <TextInput
            source="datos_paciente.domicilio.calle"
            label="Domicilio (Calle)"
          />
          <TextInput
            source="datos_paciente.domicilio.colonia_comunidad"
            label="Colonia/Comunidad"
          />
          <TextInput
            source="datos_paciente.domicilio.alcaldia_municipio"
            label="Alcaldía/Municipio"
          />
          <TextInput source="datos_paciente.ocupacion" label="Ocupación" />
          <TextInput
            source="datos_paciente.derechohabiente_a"
            label="Derechohabiente A"
          />

          <h3>Parto</h3>
          <PartoTab />

          <NextTabButton currentTab={1} />
        </FormTab>

        <FormTab label="3. Causa">
          <h3>Causa Traumática</h3>
          <CausaTraumaticaTab />

          <h3>Causa Clínica</h3>
          <CausaClinicaTab />

          <NextTabButton currentTab={2} />
        </FormTab>

        <FormTab label="4. Evaluación">
          <h3>Evaluación Inicial (1)</h3>
          <SelectInput
            source="evaluacion_inicial.nivel_consciencia"
            label="Nivel de Consciencia"
            choices={nivelConscienciaChoices}
          />
          <SelectInput
            source="evaluacion_inicial.deglucion"
            label="Deglución"
            choices={[
              { id: "PRESENTE", name: "Presente" },
              { id: "AUSENTE", name: "Ausente" },
            ]}
          />
          <SelectInput
            source="evaluacion_inicial.via_aerea"
            label="Vía Aérea"
            choices={[
              { id: "PERMEABLE", name: "Permeable" },
              { id: "COMPROMETIDA", name: "Comprometida" },
            ]}
          />
          <SelectInput
            source="evaluacion_inicial.ventilacion.automatismo"
            label="Ventilación - Automatismo"
            choices={[
              { id: "REGULAR", name: "Regular" },
              { id: "IRREGULAR", name: "Irregular" },
              { id: "RÁPIDO", name: "Rápido" },
              { id: "SUPERFICIAL", name: "Superficial" },
              { id: "APNEA", name: "Apnea" },
            ]}
          />
          <SelectInput
            source="evaluacion_inicial.auscultacion.tipo_ruidos"
            label="Auscultación"
            choices={[
              { id: "NORMALES", name: "Ruidos Respiratorios Normales" },
              { id: "DISMINUIDOS", name: "Ruidos Respiratorios Disminuidos" },
              { id: "AUSENTES", name: "Ruidos Respiratorios Ausentes" },
            ]}
          />
          <SelectInput
            source="evaluacion_inicial.auscultacion.hemitorax"
            label="Hemitórax"
            choices={[
              { id: "DERECHO", name: "Derecho" },
              { id: "IZQUIERDO", name: "Izquierdo" },
            ]}
          />
          <SelectInput
            source="evaluacion_inicial.auscultacion.sitio"
            label="Sitio"
            choices={[
              { id: "APICAL", name: "Apical" },
              { id: "BASE", name: "Base" },
            ]}
          />
          <CheckboxGroupInput
            source="evaluacion_inicial.pulsos.presencia"
            label="Presencia de Pulsos"
            choices={[
              { id: "CAROTIDEO", name: "Carotídeo" },
              { id: "RADIAL", name: "Radial" },
              {
                id: "PARO CARDIORESPIRATORIO",
                name: "Paro Cardiorespiratorio",
              },
            ]}
          />
          <SelectInput
            source="evaluacion_inicial.pulsos.calidad"
            label="Calidad"
            choices={[
              { id: "RÁPIDO", name: "Rápido" },
              { id: "LENTO", name: "Lento" },
              { id: "RÍTMICO", name: "Rítmico" },
              { id: "ARRÍTMICO", name: "Arrítmico" },
            ]}
          />
          <SelectInput
            source="evaluacion_inicial.piel.color"
            label="Piel"
            choices={[
              { id: "NORMAL", name: "Normal" },
              { id: "PÁLIDA", name: "Pálida" },
              { id: "CIANÓTICA", name: "Cianótica" },
            ]}
          />
          <CheckboxGroupInput
            source="evaluacion_inicial.piel.caracteristicas"
            label="Características"
            choices={[
              { id: "CALIENTE", name: "Caliente" },
              { id: "FRÍA", name: "Fría" },
              { id: "DIAFORESIS", name: "Diaforesis" },
              { id: "NORMOTÉRMICO", name: "Normotérmico" },
            ]}
          />
          <TextInput
            source="evaluacion_inicial.observaciones_adicionales"
            label="Observaciones Adicionales"
            multiline
            rows={3}
          />

          <h3>Evaluación Inicial (2)</h3>
          <h4>Zonas de Lesión</h4>
          <ArrayInput
            source="evaluacion_inicial.zonas_lesion"
            label="Añadir Lesiones"
          >
            <SimpleFormIterator inline>
              <SelectInput
                source="zona_cuerpo"
                label="Parte del Cuerpo"
                choices={[
                  { id: "cabeza_anterior", name: "Cabeza (Anterior)" },
                  { id: "cabeza_posterior", name: "Cabeza (Posterior)" },
                  { id: "cuello", name: "Cuello" },
                  { id: "torax", name: "Tórax" },
                  { id: "abdomen", name: "Abdomen" },
                  { id: "espalda_superior", name: "Espalda (Superior)" },
                  { id: "espalda_inferior", name: "Espalda (Inferior)" },
                  { id: "brazo_derecho", name: "Brazo Derecho" },
                  { id: "brazo_izquierdo", name: "Brazo Izquierdo" },
                  { id: "pierna_derecha", name: "Pierna Derecha" },
                  { id: "pierna_izquierda", name: "Pierna Izquierda" },
                ]}
                sx={{ minWidth: 200 }}
              />
              <SelectInput
                source="tipo_lesion"
                label="Tipo de Lesión"
                choices={[
                  { id: "DEFORMIDADES", name: "Deformidades (D)" },
                  { id: "CONTUSIONES", name: "Contusiones (CD)" },
                  { id: "ABRASIONES", name: "Abrasiones (A)" },
                  { id: "PENETRACIONES", name: "Penetraciones (P)" },
                  {
                    id: "MOVIMIENTO_PARADOJICO",
                    name: "Movimiento Paradójico (MP)",
                  },
                  { id: "CREMACION", name: "Cremación (C)" },
                  { id: "HERIDAS", name: "Heridas (H)" },
                  { id: "FRACTURAS", name: "Fracturas (F)" },
                  {
                    id: "ENFISEMA_SUBCUTANEO",
                    name: "Enfisema Subcutáneo (ES)",
                  },
                  { id: "QUEMADURAS", name: "Quemaduras (Q)" },
                  { id: "LACERACIONES", name: "Laceraciones (L)" },
                  { id: "EDEMA", name: "Edema (E)" },
                  {
                    id: "ALTERACION_SENSIBILIDAD",
                    name: "Alteración de Sensibilidad (AS)",
                  },
                  {
                    id: "ALTERACION_MOVILIDAD",
                    name: "Alteración de Movilidad (AM)",
                  },
                  { id: "DOLOR", name: "Dolor (DO)" },
                ]}
                sx={{ minWidth: 200 }}
              />
              <TextInput
                source="notas"
                label="Notas Adicionales"
                helperText={false}
              />
            </SimpleFormIterator>
          </ArrayInput>

          <h4>Signos Vitales y Monitoreo</h4>
          <ArrayInput
            source="evaluacion_inicial.signos_vitales"
            label="Añadir Signos Vitales"
          >
            <SimpleFormIterator inline>
              <TimeInput source="hora" label="Hora" />
              <NumberInput source="fr" label="FR" />
              <NumberInput source="fc" label="FC" />
              <NumberInput source="tas" label="TAS" />
              <NumberInput source="tad" label="TAD" />
              <NumberInput source="sao2" label="SaO2" />
              <NumberInput source="temp" label="Temp" />
              <NumberInput source="gluc" label="Gluc" />
              <SelectInput
                source="neuro_test"
                label="Neuro Test"
                choices={[
                  { id: "A", name: "A" },
                  { id: "V", name: "V" },
                  { id: "D", name: "D" },
                  { id: "I", name: "I" },
                ]}
              />
            </SimpleFormIterator>
          </ArrayInput>

          <h4>Pupilas</h4>
          <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
            <Box sx={{ flex: "1 1 45%" }}>
              <TextInput
                source="evaluacion_inicial.pupilas.derecha"
                label="Pupila Derecha"
                fullWidth
              />
            </Box>
            <Box sx={{ flex: "1 1 45%" }}>
              <TextInput
                source="evaluacion_inicial.pupilas.izquierda"
                label="Pupila Izquierda"
                fullWidth
              />
            </Box>
          </Box>

          <h4>Escala de Coma de Glasgow</h4>
          <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
            <Box sx={{ flex: "1 1 30%" }}>
              <SelectInput
                source="evaluacion_inicial.glasgow.apertura_ocular"
                label="Apertura Ocular"
                fullWidth
                choices={[
                  { id: 4, name: "ESPONTÁNEA" },
                  { id: 3, name: "A LA VOZ" },
                  { id: 2, name: "AL DOLOR" },
                  { id: 1, name: "NINGUNA" },
                ]}
              />
            </Box>
            <Box sx={{ flex: "1 1 30%" }}>
              <SelectInput
                source="evaluacion_inicial.glasgow.respuesta_motora"
                label="Respuesta Motora"
                fullWidth
                choices={[
                  { id: 6, name: "ESPONTÁNEA, NORMAL" },
                  { id: 5, name: "LOCALIZA AL TACTO" },
                  { id: 4, name: "LOCALIZA AL DOLOR" },
                  { id: 3, name: "DECORTICACIÓN" },
                  { id: 2, name: "DESCEREBRACIÓN" },
                  { id: 1, name: "NINGUNA" },
                ]}
              />
            </Box>
            <Box sx={{ flex: "1 1 30%" }}>
              <SelectInput
                source="evaluacion_inicial.glasgow.respuesta_verbal"
                label="Respuesta Verbal"
                fullWidth
                choices={[
                  { id: 5, name: "ORIENTADA" },
                  { id: 4, name: "CONFUSA" },
                  { id: 3, name: "PALABRAS INAPROPIADAS" },
                  { id: 2, name: "SONIDOS INCOMPRENSIBLES" },
                  { id: 1, name: "NINGUNA" },
                ]}
              />
            </Box>
            <Box sx={{ flex: "1 1 30%" }}>
              <GlasgowTotalCalculator />
            </Box>
          </Box>

          <h4>SAMPLE</h4>
          <TextInput
            source="evaluacion_inicial.sample.alergias"
            label="Alergias"
          />
          <TextInput
            source="evaluacion_inicial.sample.medicamentos"
            label="Medicamentos"
          />
          <TextInput
            source="evaluacion_inicial.sample.padecimientos_cirugias"
            label="Padecimientos/Cirugías"
          />
          <TextInput
            source="evaluacion_inicial.sample.ultima_comida"
            label="Última Comida"
          />

          <NextTabButton currentTab={3} />
        </FormTab>

        <FormTab label="5. Intervención">
          <h3>Tratamiento</h3>
          <CheckboxGroupInput
            source="tratamiento.via_aerea_procedimientos"
            label="Vía Aérea"
            choices={[
              { id: "ASPIRACIÓN", name: "Aspiración" },
              { id: "CÁNULA OROFARÍNGEA", name: "Cánula Orofaríngea" },
              { id: "CÁNULA NASOFARÍNGEA", name: "Cánula Nasofaríngea" },
              { id: "INTUBACIÓN OROTRAQUEAL", name: "Intubación Orotraqueal" },
              { id: "COMBITUBO", name: "Combitubo" },
              {
                id: "INTUBACIÓN NASOTRAQUEAL",
                name: "Intubación Nasotraqueal",
              },
              { id: "MASCARILLA LARÍNGEA", name: "Mascarilla Laríngea" },
              {
                id: "CRICOTIROIDOTOMÍA POR PUNCIÓN",
                name: "Cricotiroidotomía por Punción",
              },
            ]}
          />

          <CheckboxGroupInput
            source="tratamiento.control_cervical"
            label="Control Cervical"
            choices={[
              { id: "MANUAL", name: "Manual" },
              { id: "COLLARÍN RÍGIDO", name: "Collarín Rígido" },
              { id: "COLLARÍN BLANDO", name: "Collarín Blando" },
            ]}
          />

          <CheckboxGroupInput
            source="tratamiento.asistencia_ventilatoria"
            label="Asistencia Ventilatoria"
            choices={[
              {
                id: "BALÓN-VÁLVULA MASCARILLA",
                name: "Balón-Válvula Mascarilla",
              },
              { id: "VÁLVULA DE DEMANDA", name: "Válvula de Demanda" },
              { id: "HIPERVENTILACIÓN", name: "Hiperventilación" },
              { id: "PUNTAS NASALES", name: "Puntas Nasales" },
              { id: "MASCARILLA SIMPLE", name: "Mascarilla Simple" },
              { id: "VENTILADOR AUTOMÁTICO", name: "Ventilador Automático" },
              { id: "HEMITORAX DERECHO", name: "Hemitórax Derecho" },
              { id: "HEMITORAX IZQUIERDO", name: "Hemitórax Izquierdo" },
              {
                id: "DESCOMPRESIÓN PLEURAL CON AGUA",
                name: "Descompresión Pleural con Agua",
              },
              {
                id: "MASCARILLA CON RESERVORIO",
                name: "Mascarilla con Reservorio",
              },
              { id: "MASCARILLA VENTURI", name: "Mascarilla Venturi" },
              { id: "LTS X MIN", name: "Lts x Min" },
            ]}
          />

          <h4>Medicamentos</h4>
          <ArrayInput source="tratamiento.medicamentos">
            <SimpleFormIterator>
              <TimeInput source="hora" label="Hora" />
              <TextInput source="medicamento" label="Medicamento" />
              <TextInput source="dosis" label="Dosis" />
              <TextInput
                source="via_administracion"
                label="Vía de Administración"
              />
            </SimpleFormIterator>
          </ArrayInput>

          <TextInput
            source="tratamiento.doctor_tratante"
            label="Doctor Tratante"
          />

          <CheckboxGroupInput
            source="tratamiento.control_hemorragias"
            label="Control de Hemorragias"
            choices={[
              { id: "PRESIÓN DIRECTA", name: "Presión Directa" },
              { id: "PRESIÓN INDIRECTA", name: "Presión Indirecta" },
              { id: "GRAVEDAD", name: "Gravedad" },
              { id: "VENDAJE COMPRESIVO", name: "Vendaje Compresivo" },
              { id: "CRIOTERAPIA", name: "Crioterapia" },
              { id: "MAST", name: "MAST" },
            ]}
          />

          <h4>Vías Venosas y Tipo de Solución</h4>
          <CheckboxGroupInput
            source="tratamiento.vias_venosas.tipo_solucion"
            label="Tipo de Solución"
            choices={[
              { id: "HARTMANN", name: "Hartmann" },
              { id: "NACL 0.9%", name: "NaCl 0.9%" },
              { id: "MIXTA", name: "Mixta" },
              { id: "GLUCOSA 5%", name: "Glucosa 5%" },
              { id: "OTRA", name: "Otra" },
            ]}
          />
          <NumberInput
            source="tratamiento.vias_venosas.linea_iv"
            label="Línea IV"
          />
          <NumberInput
            source="tratamiento.vias_venosas.cateter"
            label="Catéter"
          />
          <NumberInput
            source="tratamiento.vias_venosas.cantidad_ml"
            label="Cantidad (ml)"
          />

          <CheckboxGroupInput
            source="tratamiento.atencion_basica"
            label="Atención Básica"
            choices={[
              { id: "RCP BÁSICA", name: "RCP Básica" },
              { id: "CURACIÓN", name: "Curación" },
              {
                id: "INMOVILIZACIÓN DE EXTREMIDADES",
                name: "Inmovilización de Extremidades",
              },
              { id: "RCP AVANZADA", name: "RCP Avanzada" },
              { id: "EMPAQUETAMIENTO", name: "Empaquetamiento" },
              { id: "VENDAJE", name: "Vendaje" },
            ]}
          />

          <h3>Traslado</h3>
          <SelectInput
            source="traslado.condicion_paciente"
            label="Condición del Paciente"
            choices={condicionPacienteChoices}
          />
          <SelectInput
            source="traslado.prioridad"
            label="Prioridad"
            choices={prioridadChoices}
          />
          <h4>Institución a la que se traslada el paciente</h4>
          <TextInput source="traslado.hospital" label="Hospital" />
          <TextInput source="traslado.dr" label="Dr" />
          <TextInput source="traslado.folio_cru" label="Folio CRU" />

          <NextTabButton currentTab={4} />
        </FormTab>

        <FormTab label="6. Cierre">
          <h3>Observaciones</h3>
          <TextInput
            source="observaciones.pertenencias"
            label="Pertenencias"
            multiline
            rows={3}
          />
          <TextInput
            source="observaciones.texto"
            label="Observaciones Adicionales"
            multiline
            rows={4}
          />

          <h3>Datos Legales</h3>
          <TextInput source="datos_legales.dependencia" label="Dependencia" />
          <TextInput
            source="datos_legales.numero_unidad"
            label="Número de Unidad"
          />
          <TextInput
            source="datos_legales.numero_oficiales"
            label="Número de Oficiales"
          />

          <ArrayInput source="datos_legales.vehiculos_involucrados">
            <SimpleFormIterator>
              <TextInput source="tipo_marca" label="Tipo/Marca" />
              <TextInput source="placas" label="Placas" />
            </SimpleFormIterator>
          </ArrayInput>

          <NextTabButton currentTab={5} />
        </FormTab>
      </TabbedForm>
    </Edit>
  );
};
