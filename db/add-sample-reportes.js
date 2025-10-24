const { MongoClient, ObjectId } = require("mongodb");

async function addSampleReportes() {
  const client = new MongoClient(
    "mongodb://127.0.0.1:27017/proteccion_civil_cuajimalpa"
  );

  try {
    await client.connect();
    const db = client.db();

    console.log("Deleting existing reportes...\n");
    const deleteResult = await db.collection("reportes").deleteMany({});
    console.log(`Deleted ${deleteResult.deletedCount} old reportes\n`);

    console.log("Adding 4 sample reportes (3 médicos + 1 urbano)\n");

    // Get users for assigning reportes to different colaboradores
    const users = await db.collection("users").find().toArray();
    // Find specific users by role
    const admin = users.find((u) => u.role === "administrador");
    const jefeTurno = users.find((u) => u.role === "jefe_turno");
    const paramedico = users.find((u) => u.role === "paramedico");

    console.log(`      Admin: ${admin?.username || "N/A"}`);
    console.log(`      Jefe Turno: ${jefeTurno?.username || "N/A"}`);
    console.log(`      Paramedico: ${paramedico?.username || "N/A"}\n`);

    const sampleReportes = [
      // Reporte 1: Traumatismo - Accidente automovilístico
      {
        folio: "FOLIO-2024-001",
        tipo_reporte: "MEDICO",
        fecha: new Date("2024-10-19"),
        datos_servicio: {
          hora_llamada: "08:30",
          hora_salida: "08:35",
          hora_llegada: "08:45",
          hora_traslado: "09:15",
          hora_hospital: "09:30",
          salida_hospital: "09:45",
          hora_base: "10:00",
          motivo_atencion: "TRAUMATISMO",
          calle: "Av. Reforma Norte",
          entre_calles: "Calle Matamoros y Calle Hidalgo",
          colonia_comunidad: "Zentlapatl",
          alcaldia_municipio: "Cuajimalpa de Morelos",
          lugar_ocurrencia: "VÍA PÚBLICA",
        },
        control: {
          numero_ambulancia: "AMB-001",
          operador: "Juan Pérez",
          tum: "María González",
          socorrista: "Carlos López",
          helicoptero_matricula: "",
        },
        datos_paciente: {
          nombre: "Roberto Martínez García",
          sexo: "MASC",
          edad: {
            anios: 35,
            meses: 0,
          },
          domicilio: {
            calle: "Calle 5 de Mayo #45",
            colonia_comunidad: "Lomas de Vista Hermosa",
            alcaldia_municipio: "Cuajimalpa",
          },
          telefono: "5512345678",
          ocupacion: "Ingeniero",
          derechohabiente_a: "IMSS",
        },
        parto: {
          es_parto: false,
        },
        causa_traumatica: {
          es_traumatica: true,
          agente_causal: "AUTOMOTOR",
          accidente_automovilistico: {
            tipo: "COLISIÓN",
            impacto: "FRONTAL",
            cms: "SI",
            parabrisas: "ROTO",
            volante: "DEFORMADO",
            bolsa_aire: "SI FUNCIONO",
            cinturon_seguridad: "SI",
            dentro_vehiculo: "SI",
            atropellado: "NO",
          },
        },
        causa_clinica: {
          es_clinica: false,
        },
        evaluacion_inicial: {
          nivel_consciencia: "ALERTA",
          deglucion: "PRESENTE",
          via_aerea: "PERMEABLE",
          ventilacion: {
            automatismo: "REGULAR",
          },
          auscultacion: {
            tipo_ruidos: "NORMALES",
            hemitorax: "DERECHO",
            sitio: "APICAL",
          },
          pulsos: {
            presencia: ["CAROTIDEO", "RADIAL"],
            calidad: "RÍTMICO",
          },
          piel: {
            color: "NORMAL",
            caracteristicas: ["NORMOTÉRMICO"],
          },
          observaciones_adicionales:
            "Paciente consciente, dolor en extremidades inferiores",
          zonas_lesion: [
            {
              zona_cuerpo: "pierna_derecha",
              tipo_lesion: "FRACTURAS",
              notas: "Posible fractura de tibia",
            },
            {
              zona_cuerpo: "brazo_izquierdo",
              tipo_lesion: "CONTUSIONES",
              notas: "Contusión leve",
            },
          ],
          signos_vitales: [
            {
              hora: "08:50",
              fr: 18,
              fc: 95,
              tas: 130,
              tad: 85,
              sao2: 97,
              temp: 36.8,
              gluc: 105,
              neuro_test: "A",
            },
            {
              hora: "09:10",
              fr: 16,
              fc: 88,
              tas: 125,
              tad: 82,
              sao2: 98,
              temp: 36.7,
              gluc: 102,
              neuro_test: "A",
            },
          ],
          pupilas: {
            derecha: "3mm reactiva",
            izquierda: "3mm reactiva",
          },
          glasgow: {
            apertura_ocular: 4,
            respuesta_motora: 6,
            respuesta_verbal: 5,
            total: 15,
          },
          sample: {
            alergias: "Ninguna conocida",
            medicamentos: "Ninguno",
            padecimientos_cirugias: "Ninguno",
            ultima_comida: "07:00 hrs - Desayuno",
          },
        },
        tratamiento: {
          via_aerea_procedimientos: ["ASPIRACIÓN"],
          control_cervical: ["COLLARÍN RÍGIDO"],
          asistencia_ventilatoria: ["PUNTAS NASALES"],
          medicamentos: [
            {
              hora: "09:00",
              medicamento: "Ketorolaco",
              dosis: "30mg",
              via_administracion: "IV",
            },
          ],
          doctor_tratante: "Dr. Ramírez",
          control_hemorragias: ["PRESIÓN DIRECTA"],
          vias_venosas: {
            tipo_solucion: ["NACL 0.9%"],
            linea_iv: 18,
            cateter: 14,
            cantidad_ml: 500,
          },
          atencion_basica: ["INMOVILIZACIÓN DE EXTREMIDADES"],
        },
        traslado: {
          condicion_paciente: "ESTABLE",
          prioridad: "AMARILLA",
          hospital: "Hospital General Cuajimalpa",
          dr: "Dr. Fernando Sánchez",
          folio_cru: "CRU-2024-001",
        },
        observaciones: {
          pertenencias: "Celular, cartera con identificación",
          texto:
            "Paciente colaborador, traslado sin complicaciones. Familiar acompañante.",
        },
        datos_legales: {
          dependencia: "Policía Municipal",
          numero_unidad: "PM-543",
          numero_oficiales: "2",
          vehiculos_involucrados: [
            {
              tipo_marca: "Nissan Versa",
              placas: "ABC-123-D",
            },
          ],
        },
        colaboradorId: jefeTurno?._id || new ObjectId(),
        turnoId: jefeTurno?.turnoId || null,
        createdAt: new Date(),
        updatedAt: new Date(),
      },

      // Reporte 2: Causa Clínica - Infarto
      {
        folio: "FOLIO-2024-002",
        tipo_reporte: "MEDICO",
        fecha: new Date("2024-10-19"),
        datos_servicio: {
          hora_llamada: "14:20",
          hora_salida: "14:23",
          hora_llegada: "14:35",
          hora_traslado: "14:50",
          hora_hospital: "15:05",
          salida_hospital: "15:20",
          hora_base: "15:35",
          motivo_atencion: "ENFERMEDAD",
          calle: "Av. Juárez",
          entre_calles: "Calle Morelos y Calle Guerrero",
          colonia_comunidad: "Cuajimalpa Centro",
          alcaldia_municipio: "Cuajimalpa de Morelos",
          lugar_ocurrencia: "HOGAR",
        },
        control: {
          numero_ambulancia: "AMB-002",
          operador: "Pedro Ramírez",
          tum: "Ana Martínez",
          socorrista: "Luis Hernández",
          helicoptero_matricula: "",
        },
        datos_paciente: {
          nombre: "María Elena Torres Pérez",
          sexo: "FEM",
          edad: {
            anios: 62,
            meses: 0,
          },
          domicilio: {
            calle: "Av. Juárez #123",
            colonia_comunidad: "Cuajimalpa Centro",
            alcaldia_municipio: "Cuajimalpa",
          },
          telefono: "5523456789",
          ocupacion: "Maestra jubilada",
          derechohabiente_a: "ISSSTE",
        },
        parto: {
          es_parto: false,
        },
        causa_traumatica: {
          es_traumatica: false,
        },
        causa_clinica: {
          es_clinica: true,
          origen_probable: "CARDIOVASCULAR",
          tipo_consulta: "PRIMERA VEZ",
          descripcion: "Dolor torácico intenso, disnea",
        },
        evaluacion_inicial: {
          nivel_consciencia: "VERBAL",
          deglucion: "PRESENTE",
          via_aerea: "PERMEABLE",
          ventilacion: {
            automatismo: "IRREGULAR",
          },
          auscultacion: {
            tipo_ruidos: "NORMALES",
            hemitorax: "IZQUIERDO",
            sitio: "APICAL",
          },
          pulsos: {
            presencia: ["CAROTIDEO", "RADIAL"],
            calidad: "RÁPIDO",
          },
          piel: {
            color: "PÁLIDA",
            caracteristicas: ["DIAFORESIS", "FRÍA"],
          },
          observaciones_adicionales:
            "Paciente con dificultad respiratoria, ansiosa",
          zonas_lesion: [],
          signos_vitales: [
            {
              hora: "14:40",
              fr: 24,
              fc: 115,
              tas: 160,
              tad: 100,
              sao2: 92,
              temp: 36.2,
              gluc: 140,
              neuro_test: "V",
            },
            {
              hora: "14:55",
              fr: 22,
              fc: 105,
              tas: 150,
              tad: 95,
              sao2: 94,
              temp: 36.3,
              gluc: 135,
              neuro_test: "V",
            },
          ],
          pupilas: {
            derecha: "4mm reactiva",
            izquierda: "4mm reactiva",
          },
          glasgow: {
            apertura_ocular: 4,
            respuesta_motora: 6,
            respuesta_verbal: 4,
            total: 14,
          },
          sample: {
            alergias: "Penicilina",
            medicamentos: "Losartán 50mg c/24h",
            padecimientos_cirugias: "Hipertensión arterial",
            ultima_comida: "13:00 hrs - Comida",
          },
        },
        tratamiento: {
          via_aerea_procedimientos: [],
          control_cervical: [],
          asistencia_ventilatoria: ["MASCARILLA CON RESERVORIO"],
          medicamentos: [
            {
              hora: "14:45",
              medicamento: "Aspirina",
              dosis: "300mg",
              via_administracion: "Sublingual",
            },
            {
              hora: "14:48",
              medicamento: "Nitroglicerina",
              dosis: "0.4mg",
              via_administracion: "Sublingual",
            },
          ],
          doctor_tratante: "Dr. González",
          control_hemorragias: [],
          vias_venosas: {
            tipo_solucion: ["HARTMANN"],
            linea_iv: 18,
            cateter: 16,
            cantidad_ml: 250,
          },
          atencion_basica: ["RCP BÁSICA"],
        },
        traslado: {
          condicion_paciente: "CRÍTICO",
          prioridad: "ROJA",
          hospital: "Hospital ABC Santa Fe",
          dr: "Dra. Patricia Morales",
          folio_cru: "CRU-2024-002",
        },
        observaciones: {
          pertenencias: "Bolso, cartera, medicamentos personales",
          texto:
            "Traslado urgente. Familiar notificado. Electrocardiograma con cambios sugestivos de IAM.",
        },
        datos_legales: {
          dependencia: "N/A",
          numero_unidad: "",
          numero_oficiales: "",
          vehiculos_involucrados: [],
        },
        colaboradorId: paramedico?._id || new ObjectId(),
        turnoId: paramedico?.turnoId || null,
        createdAt: new Date(),
        updatedAt: new Date(),
      },

      // Reporte 3: Parto
      {
        folio: "FOLIO-2024-003",
        tipo_reporte: "MEDICO",
        fecha: new Date("2024-10-20"),
        datos_servicio: {
          hora_llamada: "03:15",
          hora_salida: "03:18",
          hora_llegada: "03:28",
          hora_traslado: "04:10",
          hora_hospital: "04:25",
          salida_hospital: "04:40",
          hora_base: "04:55",
          motivo_atencion: "GINECO OBSTÉTRICO",
          calle: "Calle Independencia",
          entre_calles: "Av. Constituyentes y Calle Allende",
          colonia_comunidad: "Las Maromas",
          alcaldia_municipio: "Cuajimalpa de Morelos",
          lugar_ocurrencia: "HOGAR",
        },
        control: {
          numero_ambulancia: "AMB-003",
          operador: "Miguel Ángel Ruiz",
          tum: "Laura Sánchez",
          socorrista: "Roberto Silva",
          helicoptero_matricula: "",
        },
        datos_paciente: {
          nombre: "Claudia Hernández Jiménez",
          sexo: "FEM",
          edad: {
            anios: 28,
            meses: 0,
          },
          domicilio: {
            calle: "Calle Independencia #67",
            colonia_comunidad: "Las Maromas",
            alcaldia_municipio: "Cuajimalpa",
          },
          telefono: "5534567890",
          ocupacion: "Empleada",
          derechohabiente_a: "IMSS",
        },
        parto: {
          es_parto: true,
          datos_madre: {
            semanas_gesta: 39,
            hora_inicio_contracciones: "02:30",
            frecuencia_contracciones: "3 minutos",
            duracion_contracciones: "45 segundos",
          },
          datos_post_parto: {
            hora_nacimiento: "03:55",
            lugar_nacimiento: "Domicilio",
            placenta_expulsada: true,
            producto: "VIVO",
            sexo_producto: "FEM",
            edad_gestacional: "39 semanas",
          },
          apgar_scores: {
            min_1: {
              color: 2,
              fc: 2,
              irritabilidad: 2,
              tono: 2,
              respiracion: 2,
            },
            min_5: {
              color: 2,
              fc: 2,
              irritabilidad: 2,
              tono: 2,
              respiracion: 2,
            },
            min_10: {
              color: 2,
              fc: 2,
              irritabilidad: 2,
              tono: 2,
              respiracion: 2,
            },
          },
        },
        causa_traumatica: {
          es_traumatica: false,
        },
        causa_clinica: {
          es_clinica: false,
        },
        evaluacion_inicial: {
          nivel_consciencia: "ALERTA",
          deglucion: "PRESENTE",
          via_aerea: "PERMEABLE",
          ventilacion: {
            automatismo: "REGULAR",
          },
          auscultacion: {
            tipo_ruidos: "NORMALES",
            hemitorax: "DERECHO",
            sitio: "BASE",
          },
          pulsos: {
            presencia: ["CAROTIDEO", "RADIAL"],
            calidad: "RÍTMICO",
          },
          piel: {
            color: "NORMAL",
            caracteristicas: ["DIAFORESIS", "CALIENTE"],
          },
          observaciones_adicionales:
            "Parto domiciliario exitoso. Madre y bebé estables.",
          zonas_lesion: [],
          signos_vitales: [
            {
              hora: "03:35",
              fr: 22,
              fc: 95,
              tas: 120,
              tad: 75,
              sao2: 98,
              temp: 37.0,
              gluc: 90,
              neuro_test: "A",
            },
            {
              hora: "04:00",
              fr: 18,
              fc: 85,
              tas: 115,
              tad: 72,
              sao2: 99,
              temp: 36.8,
              gluc: 88,
              neuro_test: "A",
            },
          ],
          pupilas: {
            derecha: "3mm reactiva",
            izquierda: "3mm reactiva",
          },
          glasgow: {
            apertura_ocular: 4,
            respuesta_motora: 6,
            respuesta_verbal: 5,
            total: 15,
          },
          sample: {
            alergias: "Ninguna",
            medicamentos: "Vitaminas prenatales",
            padecimientos_cirugias: "Ninguno",
            ultima_comida: "22:00 hrs - Cena ligera",
          },
        },
        tratamiento: {
          via_aerea_procedimientos: [],
          control_cervical: [],
          asistencia_ventilatoria: ["PUNTAS NASALES"],
          medicamentos: [
            {
              hora: "04:05",
              medicamento: "Oxitocina",
              dosis: "10 UI",
              via_administracion: "IM",
            },
          ],
          doctor_tratante: "Dra. Méndez",
          control_hemorragias: ["PRESIÓN DIRECTA"],
          vias_venosas: {
            tipo_solucion: ["HARTMANN"],
            linea_iv: 18,
            cateter: 18,
            cantidad_ml: 500,
          },
          atencion_basica: ["CURACIÓN"],
        },
        traslado: {
          condicion_paciente: "ESTABLE",
          prioridad: "AMARILLA",
          hospital: "Hospital Materno Infantil Cuajimalpa",
          dr: "Dr. Alberto Jiménez",
          folio_cru: "CRU-2024-003",
        },
        observaciones: {
          pertenencias: "Bolso con documentos, ropa del bebé",
          texto:
            "Parto domiciliario atendido. Recién nacida femenina sana. Madre estable. Padre acompañante.",
        },
        datos_legales: {
          dependencia: "N/A",
          numero_unidad: "",
          numero_oficiales: "",
          vehiculos_involucrados: [],
        },
        colaboradorId: paramedico?._id || new ObjectId(),
        turnoId: paramedico?.turnoId || null,
        createdAt: new Date(),
        updatedAt: new Date(),
      },

      // Reporte 4: Urbano - Incendio en edificio
      {
        folio: "FOLIO-2024-004",
        tipo_reporte: "URBANO",
        fecha: new Date("2024-10-20"),
        datos_servicio: {
          hora_llamada: "16:45",
          hora_salida: "16:48",
          hora_llegada: "17:05",
          calle: "Avenida Universidad",
          entre_calles: "Calle Hidalgo y Calle Morelos",
          colonia_comunidad: "Contadero",
          alcaldia_municipio: "Cuajimalpa de Morelos",
          lugar_ocurrencia: "TRABAJO",
        },
        control: {
          numero_ambulancia: "URB-01",
          operador: "Carlos Ramírez",
          tum: "N/A",
          socorrista: "N/A",
          helicoptero_matricula: "",
        },
        km_recorridos: 12.5,
        modo_activacion: "LLAMADA_EMERGENCIA",
        tipo_servicio: "Incendio en edificio de oficinas - Piso 3",
        gravedad_emergencia: "ALTA",
        trabajos_realizados:
          "Se evacuó el edificio completo (aprox. 150 personas). Se estableció perímetro de seguridad. Se utilizaron extintores tipo ABC para controlar pequeños focos de incendio en oficinas del tercer piso. Se verificó que no hubiera personas atrapadas mediante recorrido sistemático. Se coordinó con bomberos para control total del incendio. Se realizó revisión de instalaciones eléctricas afectadas.",
        conclusion_dictamen:
          "Incendio causado por cortocircuito en instalaciones eléctricas antiguas del tercer piso. Se logró evacuar a todas las personas sin lesionados. Daños materiales significativos en 3 oficinas. Se requiere inspección completa de instalaciones eléctricas del edificio antes de reapertura.",
        responsables_emergencia:
          "Administrador del edificio: Ing. Pedro Ramírez (Tel: 5598765432). Propietario: Grupo Inmobiliario del Sur S.A. de C.V.",
        observaciones: {
          texto:
            "Se proporcionó atención psicológica básica a 5 personas en estado de shock. Se detectaron varias violaciones al reglamento de protección civil: salidas de emergencia bloqueadas, extintores vencidos, falta de señalización adecuada. Se notificó a autoridades correspondientes para seguimiento.",
        },
        datos_legales: {
          dependencia: "Bomberos de Cuajimalpa, Policía Municipal",
          numero_unidad: "B-03, PM-12",
          numero_oficiales: "8 bomberos, 4 policías",
          vehiculos_involucrados: [],
        },
        colaboradorId: admin?._id || new ObjectId(),
        turnoId: admin?.turnoId || null,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];

    const result = await db.collection("reportes").insertMany(sampleReportes);
    console.log(`✅ Successfully added ${result.insertedCount} reportes:\n`);

    Object.values(result.insertedIds).forEach((id, index) => {
      const tipo =
        index === 0
          ? `MEDICO - Traumatismo (Accidente) - Assigned to: ${
              jefeTurno?.username || "N/A"
            }`
          : index === 1
          ? `MEDICO - Clínica (Infarto) - Assigned to: ${
              paramedico?.username || "N/A"
            }`
          : index === 2
          ? `MEDICO - Parto - Assigned to: ${paramedico?.username || "N/A"}`
          : `URBANO - Incendio en edificio - Assigned to: ${
              admin?.username || "N/A"
            }`;
      console.log(`   • ${tipo}`);
      console.log(`     ID: ${id}`);
    });

    console.log("\n📊 Sample reportes added successfully!");
    console.log("   ℹ️  Expected visibility:");
    console.log(`      ${admin?.username || "admin"}: Can see all 4 reportes`);
    console.log(
      `      ${
        jefeTurno?.username || "jefe_turno"
      }: Can see 1 reporte (from their turno)`
    );
    console.log(
      `      ${
        paramedico?.username || "paramedico"
      }: Can see 2 reportes (their own)`
    );
  } catch (error) {
    console.error("❌ Error adding sample reportes:", error);
  } finally {
    await client.close();
    console.log("\n👋 Database connection closed");
  }
}

addSampleReportes();
