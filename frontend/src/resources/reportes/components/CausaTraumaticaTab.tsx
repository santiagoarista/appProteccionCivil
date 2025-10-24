import { useFormContext } from "react-hook-form";
import { BooleanInput, SelectInput, TextInput } from "react-admin";
import { ConditionalSection } from "./ConditionalSection";
import { agenteCausalChoices } from "../constants";

export const CausaTraumaticaTab = () => {
  const { watch } = useFormContext();
  const esTraumatica = watch("causa_traumatica.es_traumatica");

  return (
    <>
      <BooleanInput
        source="causa_traumatica.es_traumatica"
        label="¿La causa es traumática?"
      />

      <ConditionalSection condition={esTraumatica}>
        <SelectInput
          source="causa_traumatica.agente_causal"
          label="Agente Causal"
          choices={agenteCausalChoices}
        />
        <TextInput
          source="causa_traumatica.agente_causal_especifique"
          label="Especifique (Agente Causal)"
        />

        <h3>Accidente Automovilístico</h3>
        <SelectInput
          source="causa_traumatica.accidente_automovilistico.tipo"
          label="Tipo"
          choices={[
            { id: "COLISIÓN", name: "Colisión" },
            { id: "VOLCADURA", name: "Volcadura" },
            { id: "AUTOMOTOR", name: "Automotor" },
            { id: "BICICLETA", name: "Bicicleta" },
            { id: "MOTOCICLETA", name: "Motocicleta" },
            { id: "MAQUINARIA", name: "Maquinaria" },
            { id: "CONTRA OBJETO FIJO", name: "Contra Objeto Fijo" },
          ]}
        />
        <SelectInput
          source="causa_traumatica.accidente_automovilistico.impacto"
          label="Impacto"
          choices={[
            { id: "POSTERIOR", name: "Posterior" },
            { id: "VOLADURA", name: "Volcadura" },
            { id: "ROTACIONAL", name: "Rotacional" },
            { id: "FRONTAL", name: "Frontal" },
            { id: "LATERAL", name: "Lateral" },
            { id: "HUNDIMIENTO", name: "Hundimiento" },
          ]}
        />
        <TextInput
          source="causa_traumatica.accidente_automovilistico.cms"
          label="CMS"
        />
        <SelectInput
          source="causa_traumatica.accidente_automovilistico.parabrisas"
          label="Parabrisas"
          choices={[
            { id: "ÍNTEGRO", name: "Íntegro" },
            { id: "ESTRELLADO", name: "Estrellado" },
          ]}
        />
        <SelectInput
          source="causa_traumatica.accidente_automovilistico.volante"
          label="Volante"
          choices={[
            { id: "ÍNTEGRO", name: "Íntegro" },
            { id: "DOBLADO", name: "Doblado" },
          ]}
        />
        <SelectInput
          source="causa_traumatica.accidente_automovilistico.bolsa_aire"
          label="Bolsa de Aire"
          choices={[
            { id: "SÍ", name: "Sí" },
            { id: "NO", name: "No" },
          ]}
        />
        <SelectInput
          source="causa_traumatica.accidente_automovilistico.cinturon_seguridad"
          label="Cinturón de Seguridad"
          choices={[
            { id: "COLOCADO", name: "Colocado" },
            { id: "NO COLOCADO", name: "No Colocado" },
          ]}
        />
        <SelectInput
          source="causa_traumatica.accidente_automovilistico.dentro_vehiculo"
          label="Dentro del Vehículo"
          choices={[
            { id: "SÍ", name: "Sí" },
            { id: "NO", name: "No" },
            { id: "EYECTADO", name: "Eyectado" },
          ]}
        />

        <h3>Atropellado</h3>
        <SelectInput
          source="causa_traumatica.atropellado.tipo"
          label="Atropellado"
          choices={[
            { id: "AUTOMOTOR", name: "Automotor" },
            { id: "MOTOCICLETA", name: "Motocicleta" },
            { id: "BICICLETA", name: "Bicicleta" },
            { id: "MAQUINARIA", name: "Maquinaria" },
          ]}
        />
      </ConditionalSection>
    </>
  );
};
