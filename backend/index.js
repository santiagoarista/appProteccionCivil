const express = require("express");
// const https = require("https");
// const fs = require("fs");
const { MongoClient, ObjectId } = require("mongodb");
const cors = require("cors");
const argon2 = require("argon2");
const jwt = require("jsonwebtoken");

const app = express();
app.use(cors());
const PORT = 4000;
let db;
app.use(express.json());

// Authentication middleware
async function authenticate(req, res, next) {
  try {
    // Get token from "Authentication" header (matching pasted project)
    const token = req.get("Authentication");

    console.log("🔐 Auth headers:", {
      authentication: req.get("Authentication"),
      authorization: req.get("Authorization"),
      path: req.path,
    });

    if (!token) {
      console.log("❌ No token provided");
      return res.status(401).json({ error: "No token provided" });
    }

    // Verify JWT token
    const verifiedToken = jwt.verify(token, process.env.JWTKEY);
    const username = verifiedToken.usuario;

    // Fetch user from database to get current role and turnoId
    const user = await db.collection("users").findOne({ username: username });

    if (!user || !user.isActive) {
      return res.status(401).json({ error: "Invalid or inactive user" });
    }

    // Attach user info to request
    req.user = {
      id: user._id.toString(),
      username: user.username,
      role: user.role,
      turnoId: user.turnoId,
    };

    next();
  } catch (error) {
    console.error("Authentication error:", error);
    return res.status(401).json({ error: "Invalid token" });
  }
}

// Helper function to build report filter based on user role
function buildReportFilter(user, additionalFilters = {}) {
  let authFilter = {};

  if (user.role === "administrador") {
    // Administrador can see all reports
    authFilter = {};
  } else if (user.role === "jefe_turno") {
    // Jefe de turno can only see reports from their turno
    authFilter = { turnoId: user.turnoId };
  } else if (user.role === "paramedico") {
    // Paramedico can only see their own reports
    authFilter = { colaboradorId: user.id };
  }

  // Combine auth filter with any additional filters
  return { ...authFilter, ...additionalFilters };
}

// Authorization middleware - only administradores
function requireAdmin(req, res, next) {
  if (req.user.role !== "administrador") {
    return res
      .status(403)
      .json({ error: "Access denied. Administrators only." });
  }
  next();
}

// Authorization middleware - administradores and jefe_turno
function requireAdminOrJefeTurno(req, res, next) {
  if (req.user.role !== "administrador" && req.user.role !== "jefe_turno") {
    return res
      .status(403)
      .json({ error: "Access denied. Administrators or Jefe de Turno only." });
  }
  next();
}

//This function converts the "_id" returned by the mongo db into the "id" field React Admin expects
function transformDocument(doc) {
  if (!doc) return null;
  const { _id, ...rest } = doc;
  return {
    id: _id.toString(), // Convert ObjectId to string id
    ...rest,
  };
}

// Helper to convert string id to ObjectId
function toObjectId(id) {
  try {
    return new ObjectId(id);
  } catch (error) {
    console.error(`Invalid ObjectId: ${id}`, error);
    throw new Error(`Invalid ID format: ${id}`);
  }
}

// Folio is now user-entered, no auto-generation needed

// Helper function to handle React Admin list queries
function buildListQuery(req) {
  const { _start, _end, _sort, _order, ...filters } = req.query;

  // Build MongoDB filter from React Admin filters
  const mongoFilter = {};
  Object.keys(filters).forEach((key) => {
    if (key.startsWith("q")) {
      // Text search across multiple fields
      mongoFilter.$or = [
        { folio: { $regex: filters[key], $options: "i" } },
        { nombre_paciente: { $regex: filters[key], $options: "i" } },
        { observaciones: { $regex: filters[key], $options: "i" } },
      ];
    } else if (key === "id") {
      // Handle multiple IDs (for getMany)
      const ids = Array.isArray(filters[key]) ? filters[key] : [filters[key]];
      if (ids.length === 1) {
        mongoFilter._id = toObjectId(ids[0]);
      } else {
        mongoFilter._id = { $in: ids.map((id) => toObjectId(id)) };
      }
    } else {
      mongoFilter[key] = filters[key];
    }
  });

  const sort = {};
  if (_sort) {
    // Convert "id" sort to "_id" sort
    const sortField = _sort === "id" ? "_id" : _sort;
    sort[sortField] = _order === "ASC" ? 1 : -1;
  } else {
    sort.fecha = -1; // Default sort by date descending
  }

  const skip = parseInt(_start) || 0;
  const limit = parseInt(_end) - skip || 10;

  return { mongoFilter, sort, skip, limit };
}

// ================================
// REPORTES ROUTES
// ================================
app.get("/reportes", authenticate, async (req, res) => {
  try {
    const { mongoFilter, sort, skip, limit } = buildListQuery(req);

    // Apply role-based filtering
    const secureFilter = buildReportFilter(req.user, mongoFilter);

    const data = await db
      .collection("reportes")
      .find(secureFilter)
      .sort(sort)
      .skip(skip)
      .limit(limit)
      .toArray();

    const total = await db.collection("reportes").countDocuments(secureFilter);

    res.set("Access-Control-Expose-Headers", "X-Total-Count");
    res.set("X-Total-Count", total);
    res.json(data.map(transformDocument));
  } catch (error) {
    console.error("Error fetching reportes:", error);
    res.status(500).json({ error: "Error fetching reportes" });
  }
});

// Get single reporte
app.get("/reportes/:id", authenticate, async (req, res) => {
  try {
    // Apply role-based filtering to ensure user can only access authorized reports
    const secureFilter = buildReportFilter(req.user, {
      _id: toObjectId(req.params.id),
    });

    const data = await db.collection("reportes").findOne(secureFilter);

    if (!data) {
      return res
        .status(404)
        .json({ error: "Reporte not found or access denied" });
    }
    res.json(transformDocument(data));
  } catch (error) {
    console.error("Error fetching reporte:", error);
    res.status(500).json({ error: "Error fetching reporte" });
  }
});

// Create new reporte
app.post("/reportes", authenticate, async (req, res) => {
  try {
    const values = req.body;
    delete values.id; // Remove id if sent from frontend

    // SECURITY: Ensure colaboradorId and turnoId match the authenticated user
    // This prevents users from creating reports on behalf of others
    values.colaboradorId = req.user.id;
    values.turnoId = req.user.turnoId;

    // Set timestamps
    values.createdAt = new Date();
    values.updatedAt = new Date();

    // Convert date strings to Date objects
    if (values.fecha && typeof values.fecha === "string") {
      values.fecha = new Date(values.fecha);
    }

    // Convert timing fields to proper format (keep as strings for time-only fields)
    // Convert date field in datos_servicio
    if (
      values.datos_servicio?.fecha &&
      typeof values.datos_servicio.fecha === "string"
    ) {
      values.datos_servicio.fecha = new Date(values.datos_servicio.fecha);
    }

    // Time fields in control section remain as strings (HH:MM format)
    // No conversion needed for control.hora_* fields

    // Convert vital signs timestamps (now nested under evaluacion_inicial)
    if (
      values.evaluacion_inicial?.signos_vitales &&
      Array.isArray(values.evaluacion_inicial.signos_vitales)
    ) {
      values.evaluacion_inicial.signos_vitales =
        values.evaluacion_inicial.signos_vitales.map((signo) => ({
          ...signo,
          // hora field remains as string (HH:MM format)
        }));
    }

    // Convert medication timestamps (now nested under tratamiento)
    if (
      values.tratamiento?.medicamentos &&
      Array.isArray(values.tratamiento.medicamentos)
    ) {
      values.tratamiento.medicamentos = values.tratamiento.medicamentos.map(
        (med) => ({
          ...med,
          // hora field remains as string (HH:MM format)
        })
      );
    }

    // Handle vias_venosas timestamps (now nested under tratamiento)
    if (
      values.tratamiento?.vias_venosas &&
      Array.isArray(values.tratamiento.vias_venosas)
    ) {
      values.tratamiento.vias_venosas = values.tratamiento.vias_venosas.map(
        (via) => ({
          ...via,
          // hora field remains as string (HH:MM format)
        })
      );
    }

    const result = await db.collection("reportes").insertOne(values);

    // Return the created document with id field
    const createdDoc = await db
      .collection("reportes")
      .findOne({ _id: result.insertedId });

    res.status(201).json(transformDocument(createdDoc));
  } catch (error) {
    console.error("Error creating reporte:", error);
    res.status(500).json({ error: "Error creating reporte" });
  }
});

// Delete reporte
app.delete("/reportes/:id", authenticate, async (req, res) => {
  try {
    // Only administradores can delete reports
    if (req.user.role !== "administrador") {
      return res
        .status(403)
        .json({ error: "Only administrators can delete reports" });
    }

    const result = await db
      .collection("reportes")
      .deleteOne({ _id: toObjectId(req.params.id) });

    if (result.deletedCount === 0) {
      return res.status(404).json({ error: "Reporte not found" });
    }

    res.json({ id: req.params.id });
  } catch (error) {
    console.error("Error deleting reporte:", error);
    res.status(500).json({ error: "Error deleting reporte" });
  }
});

// Update reporte
app.put("/reportes/:id", authenticate, async (req, res) => {
  try {
    // Only administradores and jefe_turno can edit reports
    if (req.user.role === "paramedico") {
      return res.status(403).json({ error: "Paramedicos cannot edit reports" });
    }

    // First, check if the report exists and user has access to it
    const secureFilter = buildReportFilter(req.user, {
      _id: toObjectId(req.params.id),
    });
    const existingReport = await db
      .collection("reportes")
      .findOne(secureFilter);

    if (!existingReport) {
      return res
        .status(404)
        .json({ error: "Reporte not found or access denied" });
    }

    const values = req.body;
    delete values.id; // Remove id field if sent from frontend

    // SECURITY: Prevent modification of colaboradorId and turnoId
    delete values.colaboradorId;
    delete values.turnoId;

    values.updatedAt = new Date();

    // Convert date strings to Date objects (same as create)
    if (
      values.datos_servicio?.fecha &&
      typeof values.datos_servicio.fecha === "string"
    ) {
      values.datos_servicio.fecha = new Date(values.datos_servicio.fecha);
    }

    // Time fields in control section remain as strings (HH:MM format)
    // Handle nested vital signs
    if (
      values.evaluacion_inicial?.signos_vitales &&
      Array.isArray(values.evaluacion_inicial.signos_vitales)
    ) {
      values.evaluacion_inicial.signos_vitales =
        values.evaluacion_inicial.signos_vitales.map((signo) => ({
          ...signo,
          // hora field remains as string (HH:MM format)
        }));
    }

    // Handle nested medications
    if (
      values.tratamiento?.medicamentos &&
      Array.isArray(values.tratamiento.medicamentos)
    ) {
      values.tratamiento.medicamentos = values.tratamiento.medicamentos.map(
        (med) => ({
          ...med,
          // hora field remains as string (HH:MM format)
        })
      );
    }

    // Handle vias_venosas
    if (
      values.tratamiento?.vias_venosas &&
      Array.isArray(values.tratamiento.vias_venosas)
    ) {
      values.tratamiento.vias_venosas = values.tratamiento.vias_venosas.map(
        (via) => ({
          ...via,
          // hora field remains as string (HH:MM format)
        })
      );
    }

    const result = await db
      .collection("reportes")
      .updateOne({ _id: toObjectId(req.params.id) }, { $set: values });

    if (result.matchedCount === 0) {
      return res.status(404).json({ error: "Reporte not found" });
    }

    const updatedDoc = await db
      .collection("reportes")
      .findOne({ _id: toObjectId(req.params.id) });

    res.json(transformDocument(updatedDoc));
  } catch (error) {
    console.error("Error updating reporte:", error);
    res.status(500).json({ error: "Error updating reporte" });
  }
});

// ================================
// USERS ROUTES
// ================================
// GET routes allow jefe_turno (for viewing colaboradores in turnos)
// POST/PUT/DELETE routes are admin-only
app.get("/users", authenticate, requireAdminOrJefeTurno, async (req, res) => {
  try {
    const { mongoFilter, sort, skip, limit } = buildListQuery(req);

    const data = await db
      .collection("users")
      .find(mongoFilter)
      .sort(sort)
      .skip(skip)
      .limit(limit)
      .project({ password: 0 }) // Don't return passwords
      .toArray();

    const total = await db.collection("users").countDocuments(mongoFilter);

    res.set("Access-Control-Expose-Headers", "X-Total-Count");
    res.set("X-Total-Count", total);
    res.json(data.map(transformDocument));
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ error: "Error fetching users" });
  }
});

app.get("/users/:id", authenticate, requireAdmin, async (req, res) => {
  try {
    const data = await db
      .collection("users")
      .findOne(
        { _id: toObjectId(req.params.id) },
        { projection: { password: 0 } }
      );

    if (!data) {
      return res.status(404).json({ error: "User not found" });
    }
    res.json(transformDocument(data));
  } catch (error) {
    console.error("Error fetching user:", error);
    res.status(500).json({ error: "Error fetching user" });
  }
});
app.post("/users", authenticate, requireAdmin, async (req, res) => {
  try {
    const values = req.body;
    delete values.id; // Remove id if sent from frontend

    // Check if username already exists
    const existingUser = await db
      .collection("users")
      .findOne({ username: values.username });
    if (existingUser) {
      return res.status(409).json({ error: "Username already exists" });
    }

    // Hash password
    if (values.password) {
      const hash = await argon2.hash(values.password, {
        type: argon2.argon2id,
        memoryCost: 19 * 1024,
        timeCost: 2,
        parallelism: 1,
        saltLength: 16,
      });
      values.password = hash;
    }

    values.isActive = true;
    values.createdAt = new Date();
    values.updatedAt = new Date();

    const result = await db.collection("users").insertOne(values);
    const userId = result.insertedId.toString();

    // If user has a turnoId, add them to the turno's colaboradores array
    if (
      values.turnoId &&
      (values.role === "paramedico" || values.role === "jefe_turno")
    ) {
      await db
        .collection("turnos")
        .updateOne(
          { _id: toObjectId(values.turnoId) },
          { $addToSet: { colaboradores: userId } }
        );
    }

    // Return without password
    const createdDoc = await db
      .collection("users")
      .findOne({ _id: result.insertedId }, { projection: { password: 0 } });

    res.status(201).json(transformDocument(createdDoc));
  } catch (error) {
    console.error("Error creating user:", error);
    res.status(500).json({ error: "Error creating user" });
  }
});

app.put("/users/:id", authenticate, requireAdmin, async (req, res) => {
  try {
    const values = req.body;
    delete values.id; // Remove id if sent from frontend

    // Get the old user to check if turnoId changed
    const oldUser = await db
      .collection("users")
      .findOne({ _id: toObjectId(req.params.id) });

    // Hash password if it's being updated
    if (values.password) {
      const hash = await argon2.hash(values.password, {
        type: argon2.argon2id,
        memoryCost: 19 * 1024,
        timeCost: 2,
        parallelism: 1,
        saltLength: 16,
      });
      values.password = hash;
    }

    values.updatedAt = new Date();

    const result = await db
      .collection("users")
      .findOneAndUpdate(
        { _id: toObjectId(req.params.id) },
        { $set: values },
        { returnDocument: "after", projection: { password: 0 } }
      );

    if (!result) {
      return res.status(404).json({ error: "User not found" });
    }

    const userId = req.params.id;

    // Handle turno changes
    if (
      values.turnoId &&
      (values.role === "paramedico" || values.role === "jefe_turno")
    ) {
      // If turnoId changed, remove from old turno and add to new turno
      if (oldUser.turnoId && oldUser.turnoId !== values.turnoId) {
        // Remove from old turno
        await db
          .collection("turnos")
          .updateOne(
            { _id: toObjectId(oldUser.turnoId) },
            { $pull: { colaboradores: userId } }
          );
      }

      // Add to new turno
      await db
        .collection("turnos")
        .updateOne(
          { _id: toObjectId(values.turnoId) },
          { $addToSet: { colaboradores: userId } }
        );
    }

    res.json(transformDocument(result));
  } catch (error) {
    console.error("Error updating user:", error);
    res.status(500).json({ error: "Error updating user" });
  }
});

app.delete("/users/:id", authenticate, requireAdmin, async (req, res) => {
  try {
    const userId = req.params.id;

    // Get user to find their turnoId before deleting
    const user = await db
      .collection("users")
      .findOne({ _id: toObjectId(userId) });

    const result = await db
      .collection("users")
      .deleteOne({ _id: toObjectId(userId) });

    if (result.deletedCount === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    // Remove user from their turno's colaboradores array
    if (user?.turnoId) {
      await db
        .collection("turnos")
        .updateOne(
          { _id: toObjectId(user.turnoId) },
          { $pull: { colaboradores: userId } }
        );
    }

    res.json({ id: userId });
  } catch (error) {
    console.error("Error deleting user:", error);
    res.status(500).json({ error: "Error deleting user" });
  }
});

// ================================
// TURNOS ROUTES (Admin only)
// ================================
app.get("/turnos", authenticate, requireAdmin, async (req, res) => {
  try {
    const { mongoFilter, sort, skip, limit } = buildListQuery(req);

    const data = await db
      .collection("turnos")
      .find(mongoFilter)
      .sort(sort)
      .skip(skip)
      .limit(limit)

      .toArray();

    const total = await db.collection("turnos").countDocuments(mongoFilter);

    res.set("Access-Control-Expose-Headers", "X-Total-Count");
    res.set("X-Total-Count", total);
    res.json(data.map(transformDocument));
  } catch (error) {
    console.error("Error fetching turnos:", error);
    res.status(500).json({ error: "Error fetching turnos" });
  }
});

// Get single turno
app.get("/turnos/:id", authenticate, requireAdmin, async (req, res) => {
  try {
    const data = await db.collection("turnos").findOne({
      _id: toObjectId(req.params.id),
    });

    if (!data) {
      return res.status(404).json({ error: "Turno not found" });
    }
    res.json(transformDocument(data));
  } catch (error) {
    console.error("Error fetching turno:", error);
    res.status(500).json({ error: "Error fetching turno" });
  }
});

app.post("/turnos", authenticate, requireAdmin, async (req, res) => {
  try {
    const values = req.body;
    delete values.id; // Remove id if sent from frontend

    values.isActive = true;
    values.createdAt = new Date();
    values.updatedAt = new Date();

    const result = await db.collection("turnos").insertOne(values);

    const createdDoc = await db.collection("turnos").findOne({
      _id: result.insertedId,
    });

    res.status(201).json(transformDocument(createdDoc));
  } catch (error) {
    console.error("Error creating turno:", error);
    res.status(500).json({ error: "Error creating turno" });
  }
});

// ================================
// LOGS ROUTES (Admin only)
// ================================
app.get("/logs", authenticate, requireAdmin, async (req, res) => {
  try {
    const { mongoFilter, sort, skip, limit } = buildListQuery(req);

    const data = await db
      .collection("logs")
      .find(mongoFilter)
      .sort(sort)
      .skip(skip)
      .limit(limit)

      .toArray();

    const total = await db.collection("logs").countDocuments(mongoFilter);

    res.set("Access-Control-Expose-Headers", "X-Total-Count");
    res.set("X-Total-Count", total);
    res.json(data.map(transformDocument));
  } catch (error) {
    console.error("Error fetching logs:", error);
    res.status(500).json({ error: "Error fetching logs" });
  }
});

// Get single log
app.get("/logs/:id", authenticate, requireAdmin, async (req, res) => {
  try {
    const data = await db.collection("logs").findOne({
      _id: new ObjectId(req.params.id),
    });

    if (!data) {
      return res.status(404).json({ error: "Log not found" });
    }
    res.json(transformDocument(data));
  } catch (error) {
    console.error("Error fetching log:", error);
    res.status(500).json({ error: "Error fetching log" });
  }
});

// ================================
// AUTHENTICATION
// ================================
app.post("/auth/login", async (req, res) => {
  try {
    const { username, password } = req.body;

    const user = await db.collection("users").findOne({ username });

    if (!user || !user.isActive) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    // Verify password using argon2
    const validPassword = await argon2.verify(user.password, password);

    if (!validPassword) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    // Log the login
    await db.collection("logs").insertOne({
      accion: "login",
      usuario: user.fullName,
      usuarioId: user._id.toString(),
      fecha: new Date(),
      detalle: `Usuario ${user.username} inició sesión`,
      ip_address: req.ip,
    });

    // Create JWT token with 15 minute expiration (900 seconds)
    const token = jwt.sign({ usuario: user.username }, process.env.JWTKEY, {
      expiresIn: 900,
    });

    // Return user data without password
    const { password: _, ...userData } = user;
    res.json({
      token: token,
      id: user.username,
      nombre: user.fullName,
      user: transformDocument(userData),
    });
  } catch (error) {
    console.error("Error during login:", error);
    res.status(500).json({ error: "Error during login" });
  }
});

// Database connection
async function connectToDB() {
  try {
    const client = new MongoClient(
      "mongodb://127.0.0.1:27017/proteccion_civil_cuajimalpa"
    );
    await client.connect();
    db = client.db();
    console.log("✅ Connected to MongoDB - Protección Civil Cuajimalpa");
  } catch (error) {
    console.error("❌ Error connecting to MongoDB:", error);
    process.exit(1);
  }
}

// Start server with HTTP (HTTPS will be enabled in production)
// const httpsOptions = {
//   key: fs.readFileSync("backend.key"),
//   cert: fs.readFileSync("backend.crt"),
// };

// https.createServer(httpsOptions, app).listen(PORT, async () => {
app.listen(PORT, async () => {
  await process.loadEnvFile(".env");
  await connectToDB();
  console.log(`🌐 HTTP Server running on port ${PORT}`);
  console.log(`� Protección Civil API: http://localhost:${PORT}`);
});
