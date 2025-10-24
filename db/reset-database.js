const { MongoClient, ObjectId } = require("mongodb");
const argon2 = require("argon2");

async function resetDatabase() {
  const client = new MongoClient(
    "mongodb://127.0.0.1:27017/proteccion_civil_cuajimalpa"
  );

  try {
    await client.connect();
    const db = client.db();

    console.log("🗑️  Dropping existing database...\n");

    // Drop all collections
    const collections = await db.listCollections().toArray();
    for (const collection of collections) {
      await db.collection(collection.name).drop();
      console.log(`   ✓ Dropped ${collection.name}`);
    }

    console.log("\n✨ Creating fresh collections with sample data...\n");

    // ================================
    // 1. CREATE TURNOS
    // ================================
    console.log("📦 Creating turnos...");
    const turnosData = [
      {
        nombre: "Turno Matutino",
        horario: "06:00 - 14:00",
        colaboradores: [],
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        nombre: "Turno Vespertino",
        horario: "14:00 - 22:00",
        colaboradores: [],
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        nombre: "Turno Nocturno",
        horario: "22:00 - 06:00",
        colaboradores: [],
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];

    const turnosResult = await db.collection("turnos").insertMany(turnosData);
    const turnoIds = Object.values(turnosResult.insertedIds);
    console.log(`   ✓ Created ${turnoIds.length} turnos`);

    // ================================
    // 2. CREATE USERS
    // ================================
    console.log("\n📦 Creating users...");

    // Hash passwords
    const adminPassword = await argon2.hash("admin123", {
      type: argon2.argon2id,
      memoryCost: 19 * 1024,
      timeCost: 2,
      parallelism: 1,
      saltLength: 16,
    });

    const jefePassword = await argon2.hash("jefe123", {
      type: argon2.argon2id,
      memoryCost: 19 * 1024,
      timeCost: 2,
      parallelism: 1,
      saltLength: 16,
    });

    const colabPassword = await argon2.hash("colab123", {
      type: argon2.argon2id,
      memoryCost: 19 * 1024,
      timeCost: 2,
      parallelism: 1,
      saltLength: 16,
    });

    const usersData = [
      {
        username: "admin",
        fullName: "Administrador del Sistema",
        password: adminPassword,
        role: "administrador",
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        username: "juan.manuel",
        fullName: "Juan Manuel Pérez",
        password: jefePassword,
        role: "jefe_turno",
        turnoId: turnoIds[0].toString(),
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        username: "maria.lopez",
        fullName: "María López García",
        password: colabPassword,
        role: "paramedico",
        turnoId: turnoIds[1].toString(),
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];

    const usersResult = await db.collection("users").insertMany(usersData);
    const userIds = Object.values(usersResult.insertedIds);
    console.log(`   ✓ Created ${userIds.length} users`);
    console.log(`   ℹ️  Login credentials:`);
    console.log(`      admin / admin123`);
    console.log(`      juan.manuel / jefe123`);
    console.log(`      maria.lopez / colab123`);

    // Update turnos with paramedicos
    await db
      .collection("turnos")
      .updateOne(
        { _id: turnoIds[0] },
        { $set: { colaboradores: [userIds[1].toString()] } }
      );
    await db
      .collection("turnos")
      .updateOne(
        { _id: turnoIds[1] },
        { $set: { colaboradores: [userIds[2].toString()] } }
      );

    // ================================
    // 3. CREATE SAMPLE REPORTE
    // ================================
    console.log("\n📦 Creating sample reporte...");

    const reporteData = {
      folio: "R-2024-001",
      fecha: new Date("2024-10-19T10:30:00"),
      colaboradorId: userIds[1].toString(),
      turnoId: turnoIds[0].toString(),

      // Unit Information
      numero_ambulancia: "AMB-01",
      operador: "Carlos Ramírez",
      tum: "Juan Manuel Pérez",
      socorrista: "Pedro González",

      // Timing
      hora_llamada: new Date("2024-10-19T10:30:00"),
      hora_salida_base: new Date("2024-10-19T10:32:00"),
      hora_llegada_servicio: new Date("2024-10-19T10:45:00"),
      hora_salida_servicio: new Date("2024-10-19T11:00:00"),
      hora_llegada_hospital: new Date("2024-10-19T11:15:00"),
      hora_salida_hospital: new Date("2024-10-19T11:30:00"),
      hora_llegada_base: new Date("2024-10-19T11:45:00"),

      // Location
      calle: "Av. Juárez #123",
      entre_calles: "Morelos y Hidalgo",
      colonia_comunidad: "Centro",
      alcaldia_municipio: "Cuajimalpa",
      lugar_ocurrencia: "via_publica",

      // Patient
      nombre_paciente: "José García Martínez",
      sexo: "masculino",
      edad_anios: 45,
      domicilio: "Calle Reforma #456, Col. Centro",
      ocupacion: "Comerciante",
      derechohabiente: "imss",

      // Emergency
      origen_probable: "cardiovascular",
      agente_causal: "otro",

      // Medical Evaluation
      nivel_consciencia: "alerta",
      via_aerea: "permeable",
      ventilacion: "automatismo_regular",
      pulsos: "radial",
      condicion_piel: "normal",

      // Glasgow
      glasgow_ocular: 4,
      glasgow_verbal: 5,
      glasgow_motora: 6,
      glasgow_total: 15,

      // Vital Signs
      signos_vitales: [
        {
          hora_lectura: new Date("2024-10-19T10:45:00"),
          tas: "120",
          tad: "80",
          frecuencia_cardiaca: 75,
          frecuencia_respiratoria: 16,
          saturacion_oxigeno: 98,
          temperatura: 36.5,
          glucosa: 95,
        },
        {
          hora_lectura: new Date("2024-10-19T11:00:00"),
          tas: "118",
          tad: "78",
          frecuencia_cardiaca: 72,
          frecuencia_respiratoria: 15,
          saturacion_oxigeno: 99,
          temperatura: 36.6,
          glucosa: 92,
        },
      ],

      // Procedures
      manejo_via_aerea: [],
      asistencia_ventilatoria: ["puntas_nasales"],
      control_hemorragias: [],

      // Medications
      medicamentos: [
        {
          hora: new Date("2024-10-19T10:50:00"),
          medicamento: "Aspirina",
          dosis: "100mg",
          via_administracion: "Oral",
        },
      ],

      // Transfer
      condicion_traslado: "estable",
      hospital_destino: "Hospital General Cuajimalpa",
      medico_recibe: "Dr. Roberto Sánchez",
      negativa_traslado: false,

      // Additional
      observaciones:
        "Paciente con dolor torácico leve, estable durante traslado.",
      estado: "cerrado",

      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const reporteResult = await db
      .collection("reportes")
      .insertOne(reporteData);
    console.log(`   ✓ Created sample reporte: ${reporteResult.insertedId}`);

    // ================================
    // 4. CREATE INDEXES
    // ================================
    console.log("\n📊 Creating indexes...");

    await db.collection("users").createIndex({ username: 1 }, { unique: true });
    await db.collection("users").createIndex({ role: 1 });
    await db.collection("users").createIndex({ turnoId: 1 });
    console.log(`   ✓ Users indexes created`);

    await db.collection("turnos").createIndex({ nombre: 1 });
    console.log(`   ✓ Turnos indexes created`);

    await db.collection("reportes").createIndex({ folio: 1 }, { unique: true });
    await db.collection("reportes").createIndex({ fecha: -1 });
    await db.collection("reportes").createIndex({ colaboradorId: 1 });
    await db.collection("reportes").createIndex({ estado: 1 });
    await db.collection("reportes").createIndex({ turnoId: 1 });
    console.log(`   ✓ Reportes indexes created`);

    await db.collection("logs").createIndex({ fecha: -1 });
    await db.collection("logs").createIndex({ usuarioId: 1 });
    await db.collection("logs").createIndex({ accion: 1 });
    console.log(`   ✓ Logs indexes created`);

    console.log("\n✅ Database reset complete!");
    console.log("\n📊 Summary:");
    console.log(`   • ${turnoIds.length} turnos`);
    console.log(`   • ${userIds.length} users`);
    console.log(`   • 1 sample reporte`);
    console.log(`   • All documents use ObjectIds`);
    console.log("\n🔐 You can login with:");
    console.log(`   Username: admin | Password: admin123`);
  } catch (error) {
    console.error("❌ Error resetting database:", error);
  } finally {
    await client.close();
    console.log("\n👋 Database connection closed");
  }
}

resetDatabase();