const express = require("express");
const cors = require("cors");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

require("dotenv").config();
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient({
  datasourceUrl: process.env.DATABASE_URL,
});

const app = express();
app.use(express.json());
app.use(cors());

const PORT = process.env.PORT || 8080;
const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "1d";



// Utility: generate JWT
function generateToken(user) {
  return jwt.sign(
    {
      id: user.id,
      role: user.role,
      email: user.email,
      phone: user.phone,
    },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRES_IN }
  );
}

// Middleware: auth
function auth(requiredRoles = []) {
  return (req, res, next) => {
    const authHeader = req.headers.authorization || "";
    const token = authHeader.replace("Bearer ", "");

    if (!token) {
      return res.status(401).json({ error: "Missing token" });
    }

    try {
      const decoded = jwt.verify(token, JWT_SECRET);
      req.user = decoded;

      if (requiredRoles.length && !requiredRoles.includes(decoded.role)) {
        return res.status(403).json({ error: "Forbidden" });
      }

      next();
    } catch (err) {
      return res.status(401).json({ error: "Invalid token" });
    }
  };
}

// Health + root
app.get("/", (req, res) => {
  res.json({ status: "ok", message: "AREX backend is running" });
});

app.get("/health", async (req, res) => {
  try {
    await prisma.$queryRaw`SELECT 1`;
    res.json({ status: "ok", service: "arex-backend", db: "connected" });
  } catch (err) {
    res.status(500).json({ status: "error", error: "DB connection failed" });
  }
});

// POST /auth/register (email/password)
app.post("/auth/register", async (req, res) => {
  const { email, phone, password, role } = req.body;

  if (!email && !phone) {
    return res.status(400).json({ error: "Email or phone is required" });
  }

  if (!password) {
    return res.status(400).json({ error: "Password is required" });
  }

  const allowedRoles = [
    "admin",
    "agent",
    "corporate_partner",
    "cooperative",
    "individual_client",
    "arex_customer",
  ];
  if (!role || !allowedRoles.includes(role)) {
    return res.status(400).json({ error: "Invalid or missing role" });
  }

  try {
    const hash = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        email: email || null,
        phone: phone || null,
        password_hash: hash,
        role: role,
        is_active: true,
      },
      select: {
        id: true,
        email: true,
        phone: true,
        role: true,
      },
    });
    const token = generateToken(user);

    res.status(201).json({ user, token });
  } catch (err) {
    if (err.code === "23505") {
      return res.status(409).json({ error: "Email or phone already exists" });
    }
    console.error(err);
    res.status(500).json({ error: "Registration failed" });
  }
});

// POST /auth/login (email/password)
app.post("/auth/login", async (req, res) => {
  const { email, phone, password } = req.body;

  if (!password) {
    return res.status(400).json({ error: "Password is required" });
  }

  if (!email && !phone) {
    return res.status(400).json({ error: "Email or phone is required" });
  }

  try {
    const user = await prisma.user.findFirst({
      where: {
        OR: [
          { email: email || undefined },
          { phone: phone || undefined },
        ],
        is_active: true,
      },
      select: {
        id: true,
        email: true,
        phone: true,
        password_hash: true,
        role: true,
      },
    });
    if (!user) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const match = await bcrypt.compare(password, user.password_hash);
    if (!match) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const token = generateToken(user);
    delete user.password_hash;

    res.json({ user, token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Login failed" });
  }
});

// Protected example route
app.get("/me", auth(), async (req, res) => {
  res.json({ user: req.user });
});

// Admin-only example route
app.get("/admin/users", auth(["admin"]), async (req, res) => {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        phone: true,
        role: true,
        is_active: true,
        created_at: true,
      },
      orderBy: {
        created_at: 'desc',
      },
    });
    res.json({ users });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to list users" });
  }
});

app.listen(PORT, () => {
  console.log(`AREX backend running on port ${PORT}`);
});
