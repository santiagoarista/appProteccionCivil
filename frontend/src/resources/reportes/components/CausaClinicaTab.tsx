import { useFormContext } from "react-hook-form";
import {
  BooleanInput,
  SelectInput,
  TextInput,
  RadioButtonGroupInput,
} from "react-admin";
import { ConditionalSection } from "./ConditionalSection";
import { origenProbableChoices, tipoConsultaChoices } from "../constants";

export const CausaClinicaTab = () => {
  const { watch } = useFormContext();
  const esClinica = watch("causa_clinica.es_clinica");

  return (
    <>
      <BooleanInput
        source="causa_clinica.es_clinica"
        label="¿La causa es clínica?"
      />

      <ConditionalSection condition={esClinica}>
        <SelectInput
          source="causa_clinica.origen_probable"
          label="Origen Probable"
          choices={origenProbableChoices}
        />
        <TextInput
          source="causa_clinica.origen_probable_especifique"
          label="Especifique (Origen Probable)"
        />
        <RadioButtonGroupInput
          source="causa_clinica.tipo_consulta"
          label="Tipo de Consulta"
          choices={tipoConsultaChoices}
        />
      </ConditionalSection>
    </>
  );
};
