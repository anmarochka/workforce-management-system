import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import pool from "./db";
import { logger } from "./logger";
import { metricsMiddleware, metricsHandler } from "./metrics";

dotenv.config();

const app = express();
const port = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());
app.use(metricsMiddleware);

app.get("/metrics", metricsHandler);
app.get("/ping", (_req, res) => res.send("pong"));
app.get("/health", (_req, res) => res.json({ status: "ok" }));


app.get("/employees", async (_req, res) => {
  try {
    const result = await pool.query("SELECT * FROM employees");
    res.json(result.rows);
  } catch (err) {
    logger.error("GET /employees error", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.post("/employees", async (req, res) => {
  const { name, email, position } = req.body;
  try {
    const result = await pool.query(
      "INSERT INTO employees (name, email, position) VALUES ($1, $2, $3) RETURNING *",
      [name, email, position]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    logger.error("POST /employees error", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default app;
