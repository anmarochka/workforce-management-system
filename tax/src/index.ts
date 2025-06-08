import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { pool } from "./db";
import { startConsumer } from "./consumer";
import { logger } from "./logger";
import { metricsMiddleware, metricsHandler } from "./metrics";

dotenv.config();

const app = express();
const port = process.env.PORT || 3004;

app.use(cors());
app.use(express.json());
app.use(metricsMiddleware);

app.get("/metrics", metricsHandler);
app.get("/ping", (_req, res) => res.send("pong"));
app.get("/health", (_req, res) => res.json({ status: "ok" }));

app.get("/tax", async (_req, res) => {
  try {
    const result = await pool.query("SELECT * FROM tax_records");
    res.json(result.rows);
  } catch (err) {
    logger.error("Failed to fetch tax records: " + (err instanceof Error ? err.message : String(err)));
    res.status(500).json({ error: "Internal server error" });
  }
});

app.listen(port, () => {
  logger.info(`Tax service running on port ${port}`);
  startConsumer();
});