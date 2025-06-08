import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import pool from "./db";
import {logger }from "./logger";
import metricsRoutes from "./metrics";
import { startConsumer } from "./consumer";

dotenv.config();
const app = express();
const port = process.env.PORT || 3003;

app.use(cors());
app.use(express.json());
app.use(metricsRoutes);

app.get("/payroll", async (_req, res) => {
  try {
    const result = await pool.query("SELECT * FROM payroll");
    res.json(result.rows);
  } catch (err) {
    logger.error(`Error fetching payroll: ${err instanceof Error ? err.message : String(err)}`);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.listen(port, () => {
  logger.info(`Payroll service running on port ${port}`);
  startConsumer();
});

export default app;