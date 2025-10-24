import { useFormContext } from "react-hook-form";
import {
  BooleanInput,
  NumberInput,
  TextInput,
  RadioButtonGroupInput,
} from "react-admin";
import ApgarScoreInput from "../../../components/ApgarScoreInput";
import TimeInput from "../../../components/TimeInput";
import { ConditionalSection } from "./ConditionalSection";
import { sexoChoices, productoChoices } from "../constants";

export const PartoTab = () => {
  const { watch } = useFormContext();
  const esParto = watch("parto.es_parto");

  return (
    <>
      <BooleanInput
        source="parto.es_parto"
        label="¿El reporte está relacionado con un parto?"
      />

      <ConditionalSection condition={esParto}>
        <h3>Datos de la Madre</h3>
        <NumberInput
          source="parto.datos_madre.semanas_gesta"
          label="Semanas de Gesta"
        />
        <TimeInput
          source="parto.datos_madre.hora_inicio_contracciones"
          label="Hora Inicio Contracciones"
        />
        <TextInput
          source="parto.datos_madre.frecuencia_contracciones"
          label="Frecuencia"
        />
        <TextInput
          source="parto.datos_madre.duracion_contracciones"
          label="Duración"
        />

        <h3>Datos Post-Parto y del Recién Nacido</h3>
        <TimeInput
          source="parto.datos_post_parto.hora_nacimiento"
          label="Hora de Nacimiento"
        />
        <TextInput
          source="parto.datos_post_parto.lugar_nacimiento"
          label="Lugar de Nacimiento"
        />
        <BooleanInput
          source="parto.datos_post_parto.placenta_expulsada"
          label="Placenta Expulsada"
        />
        <RadioButtonGroupInput
          source="parto.datos_post_parto.producto"
          label="Producto"
          choices={productoChoices}
        />
        <RadioButtonGroupInput
          source="parto.datos_post_parto.sexo_producto"
          label="Sexo"
          choices={sexoChoices}
        />
        <TextInput
          source="parto.datos_post_parto.edad_gestacional"
          label="Edad Gestacional"
        />

        <h3>Puntaje de APGAR</h3>
        <ApgarScoreInput />
      </ConditionalSection>
    </>
  );
};
