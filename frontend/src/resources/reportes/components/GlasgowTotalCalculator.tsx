import { useEffect } from "react";
import { NumberInput } from "react-admin";
import { useFormContext } from "react-hook-form";

// Glasgow Total Calculator Component
export const GlasgowTotalCalculator = () => {
  const { watch, setValue } = useFormContext();
  const ocular = watch("evaluacion_inicial.glasgow.apertura_ocular");
  const motora = watch("evaluacion_inicial.glasgow.respuesta_motora");
  const verbal = watch("evaluacion_inicial.glasgow.respuesta_verbal");

  useEffect(() => {
    const total =
      (Number(ocular) || 0) + (Number(motora) || 0) + (Number(verbal) || 0);
    setValue("evaluacion_inicial.glasgow.total", total > 0 ? total : null, {
      shouldValidate: true,
    });
  }, [ocular, motora, verbal, setValue]);

  return (
    <NumberInput
      source="evaluacion_inicial.glasgow.total"
      label="Glasgow Total"
      disabled
    />
  );
};
