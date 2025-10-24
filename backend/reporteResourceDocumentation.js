// This file documents the expected structure for the reportes collection

const reporteSchema = {
  // Main identifiers
  folio: "String", // Unique identifier for the report
  fecha: "Date", // Date of the service

  // Tab 1: Datos del Servicio
  datos_servicio: {
    hora_llamada: "String", // Time only
    hora_salida: "String", // Time only
    hora_llegada: "String", // Time only
    hora_traslado: "String", // Time only
    hora_hospital: "String", // Time only
    salida_hospital: "String", // Time only
    hora_base: "String", // Time only
    motivo_atencion: "String", // enum: ['ENFERMEDAD', 'TRAUMATISMO', 'GINECO OBSTÉTRICO']
    calle: "String",
    entre_calles: "String",
    colonia_comunidad: "String",
    alcaldia_municipio: "String",
    lugar_ocurrencia: "String", // enum: ['HOGAR', 'RECREACIÓN Y DEPORTE', 'ESCUELA', 'TRABAJO', 'TRANSPORTE PÚBLICO', 'VÍA PÚBLICA', 'OTRA']
  },

  // Tab 2: Control
  control: {
    numero_ambulancia: "String",
    operador: "String",
    tum: "String",
    socorrista: "String",
    helicoptero_matricula: "String",
  },

  // Tab 3: Datos del Paciente
  datos_paciente: {
    nombre: "String",
    sexo: "String", // enum: ['MASC', 'FEM']
    edad: {
      anios: "Number",
      meses: "Number",
    },
    domicilio: {
      calle: "String",
      colonia_comunidad: "String",
      alcaldia_municipio: "String",
    },
    telefono: "String",
    ocupacion: "String",
    derechohabiente_a: "String",
  },

  // Tab 4: Parto
  parto: {
    es_parto: "Boolean", // To conditionally show this tab's content
    datos_madre: {
      semanas_gesta: "Number",
      hora_inicio_contracciones: "String", // Time only
      frecuencia_contracciones: "String",
      duracion_contracciones: "String",
    },
    datos_post_parto: {
      hora_nacimiento: "String", // Time only
      lugar_nacimiento: "String",
      placenta_expulsada: "Boolean",
      producto: "String", // enum: ['VIVO', 'MUERTO']
      sexo_producto: "String", // enum: ['MASC', 'FEM']
      edad_gestacional: "String",
    },
    apgar_scores: {
      min_1: {
        color: "Number",
        fc: "Number",
        irritabilidad: "Number",
        tono: "Number",
        respiracion: "Number",
      },
      min_5: {
        color: "Number",
        fc: "Number",
        irritabilidad: "Number",
        tono: "Number",
        respiracion: "Number",
      },
      min_10: {
        color: "Number",
        fc: "Number",
        irritabilidad: "Number",
        tono: "Number",
        respiracion: "Number",
      },
      min_15: {
        color: "Number",
        fc: "Number",
        irritabilidad: "Number",
        tono: "Number",
        respiracion: "Number",
      },
      min_20: {
        color: "Number",
        fc: "Number",
        irritabilidad: "Number",
        tono: "Number",
        respiracion: "Number",
      },
    },
  },

  // Tab 5: Causa Traumática
  causa_traumatica: {
    es_traumatica: "Boolean", // To conditionally show this tab's content
    agente_causal: "String", // enum: ['ARMA', 'JUGUETE', 'EXPLOSIÓN', 'FUEGO', 'ANIMAL', 'BICICLETA', 'AUTOMOTOR', 'MAQUINARIA', 'HERRAMIENTA', 'ELECTRICIDAD', 'SUSTANCIA CALIENTE', 'SUSTANCIA TÓXICA', 'PRODUCTO BIOLÓGICO', 'SER HUMANO', 'OTRO']
    agente_causal_especifique: "String",
    accidente_automovilistico: {
      tipo: "String", // enum: ['COLISIÓN', 'VOLCADURA', 'AUTOMOTOR', 'BICICLETA', 'MOTOCICLETA', 'MAQUINARIA', 'CONTRA OBJETO FIJO']
      impacto: "String", // enum: ['POSTERIOR', 'VOLADURA', 'ROTACIONAL', 'FRONTAL', 'LATERAL', 'HUNDIMIENTO']
      cms: "String",
      parabrisas: "String", // enum: ['ÍNTEGRO', 'ESTRELLADO']
      volante: "String", // enum: ['ÍNTEGRO', 'DOBLADO']
      bolsa_aire: "String", // enum: ['SÍ', 'NO']
      cinturon_seguridad: "String", // enum: ['COLOCADO', 'NO COLOCADO']
      dentro_vehiculo: "String", // enum: ['SÍ', 'NO', 'EYECTADO']
    },
    atropellado: {
      tipo: "String", // enum: ['AUTOMOTOR', 'MOTOCICLETA', 'BICICLETA', 'MAQUINARIA']
    },
  },

  // Tab 6: Causa Clínica
  causa_clinica: {
    es_clinica: "Boolean", // To conditionally show this tab's content
    origen_probable: "String", // enum: ['NEUROLÓGICA', 'INFECCIOSA', 'MÚSCULO ESQUELÉTICO', 'UROGENITAL', 'DIGESTIVA', 'CARDIOVASCULAR', 'ONCOLÓGICO', 'METABÓLICO', 'GINECOOBSTÉTRICA', 'RESPIRATORIO', 'COGNITIVO EMOCIONAL', 'OTRO']
    origen_probable_especifique: "String",
    tipo_consulta: "String", // enum: ['PRIMERA VEZ', 'SEGUIMIENTO']
  },

  // Tabs 7 & 8: Evaluación Inicial
  evaluacion_inicial: {
    nivel_consciencia: "String", // enum: ['ALERTA', 'VERBAL', 'DOLOR', 'INCONCIENTE']
    deglucion: "String", // enum: ['PRESENTE', 'AUSENTE']
    via_aerea: "String", // enum: ['PERMEABLE', 'COMPROMETIDA']
    ventilacion: {
      automatismo: "String", // enum: ['REGULAR', 'IRREGULAR', 'RÁPIDO', 'SUPERFICIAL', 'APNEA']
    },
    auscultacion: {
      tipo_ruidos: "String", // enum: ['NORMALES', 'DISMINUIDOS', 'AUSENTES']
      hemitorax: "String", // enum: ['DERECHO', 'IZQUIERDO']
      sitio: "String", // enum: ['APICAL', 'BASE']
    },
    pulsos: {
      presencia: "Array", // ['CAROTIDEO', 'RADIAL', 'FEMORAL', etc.]
      calidad: "String", // enum: ['RÁPIDO', 'LENTO']
      ritmo: "String", // enum: ['RÍTMICO', 'ARRÍTMICO']
      paro_cardiorespiratorio: "Boolean",
    },
    piel: {
      color: "String", // enum: ['NORMAL', 'PÁLIDA', 'CIANÓTICA']
      caracteristicas: "Array", // ['CALIENTE', 'FRÍA', 'DIAFORESIS', 'NORMOTÉRMICA']
    },
    zonas_lesion: [
      {
        zona_cuerpo: "String", // enum: ['cabeza_anterior', 'cabeza_posterior', 'cuello', 'torax', 'abdomen', etc.]
        tipo_lesion: "String", // enum: ['DEFORMIDADES', 'CONTUSIONES', 'ABRASIONES', etc.]
        notas: "String",
      },
    ],
    pupilas: {
      derecha: "String",
      izquierda: "String",
    },
    glasgow: {
      apertura_ocular: "Number", // min: 1, max: 4
      respuesta_motora: "Number", // min: 1, max: 6
      respuesta_verbal: "Number", // min: 1, max: 5
      total: "Number",
    },
    signos_vitales: [
      {
        hora: "String",
        tas: "Number",
        tad: "Number",
        fc: "Number",
        fr: "Number",
        sao2: "Number",
        temp: "Number",
        gluc: "Number",
        neuro_test: "String",
      },
    ],
    sample: {
      alergias: "String",
      medicamentos: "String",
      padecimientos_cirugias: "String",
      ultima_comida: "String",
    },
    observaciones_adicionales: "String",
  },

  // Tab 9: Traslado
  traslado: {
    condicion_paciente: "String", // enum: ['CRÍTICO', 'NO CRÍTICO', 'ESTABLE', 'INESTABLE']
    prioridad: "String", // enum: ['ROJA', 'AMARILLA', 'VERDE', 'NEGRA']
    institucion_traslado: "String",
    hospital: "String",
    dr: "String",
    folio_cru: "String",
  },

  // Tab 10: Tratamiento
  tratamiento: {
    via_aerea_procedimientos: "Array", // ['ASPIRACIÓN', 'CÁNULA OROFARÍNGEA', 'CÁNULA NASOFARÍNGEA', 'INTUBACIÓN OROTRAQUEAL', 'COMBITUBO', 'INTUBACIÓN NASOTRAQUEAL', 'MASCARILLA LARÍNGEA', 'CRICOTIROIDOTOMÍA POR PUNCIÓN']
    control_cervical: "Array", // ['MANUAL', 'COLLARÍN RÍGIDO', 'COLLARÍN BLANDO']
    asistencia_ventilatoria: "Array", // ['BALÓN-VÁLVULA MASCARILLA', 'VÁLVULA DE DEMANDA', 'HIPERVENTILACIÓN', 'PUNTAS NASALES', 'MASCARILLA SIMPLE', 'VENTILADOR AUTOMÁTICO', 'HEMITORAX DERECHO', 'HEMITORAX IZQUIERDO', 'DESCOMPRESIÓN PLEURAL CON AGUA', 'MASCARILLA CON RESERVORIO', 'MASCARILLA VENTURI', 'LTS X MIN']
    medicamentos: [
      {
        hora: "String",
        medicamento: "String",
        dosis: "String",
        via_administracion: "String",
      },
    ],
    doctor_tratante: "String",
    control_hemorragias: "Array", // ['PRESIÓN DIRECTA', 'PRESIÓN INDIRECTA', 'GRAVEDAD', 'VENDAJE COMPRESIVO', 'CRIOTERAPIA', 'MAST']
    vias_venosas: {
      tipo_solucion: "Array", // ['HARTMANN', 'NACL 0.9%', 'MIXTA', 'GLUCOSA 5%', 'OTRA']
      linea_iv: "Number",
      cateter: "Number",
      cantidad_ml: "Number",
    },
    atencion_basica: "Array", // ['RCP BÁSICA', 'CURACIÓN', 'INMOVILIZACIÓN DE EXTREMIDADES', 'RCP AVANZADA', 'EMPAQUETAMIENTO', 'VENDAJE']
  },

  // Tab 11: Observaciones
  observaciones: {
    pertenencias: "String",
    texto: "String",
  },

  // Tab 12: Datos Legales
  datos_legales: {
    dependencia: "String",
    numero_unidad: "String",
    numero_oficiales: "String",
    vehiculos_involucrados: [
      {
        tipo_marca: "String",
        placas: "String",
      },
    ],
  },

  // System fields
  createdAt: "Date",
  updatedAt: "Date",
};

module.exports = reporteSchema;
