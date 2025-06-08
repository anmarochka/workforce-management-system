import express, { Request, Response } from "express";
import dotenv from "dotenv";
import cors from "cors";
import pool from "./db";
import { sendToQueue } from "./queue";
import { logger } from "./logger";
import { metricsMiddleware } from "./metrics"; 

import client from "prom-client"; 

dotenv.config();
const app = express();
const port = process.env.PORT || 3002;

app.use(cors());
app.use(express.json());
app.use(metricsMiddleware);

app.get("/metrics", async (_req: Request, res: Response): Promise<void> => {
  res.set("Content-Type", client.register.contentType);
  res.end(await client.register.metrics());
});

app.get("/ping", (_req: Request, res: Response): void => {
  res.send("pong");
});

app.get("/health", (_req: Request, res: Response): void => {
  res.json({ status: "ok" });
});

// Получить все записи посещаемости
app.get("/attendance", async (_req, res) => {
  try {
    const result = await pool.query("SELECT * FROM attendance");
    res.json(result.rows);
  } catch (err) {
    logger.error(
      "Error fetching attendance: " +
        (err instanceof Error ? err.message : String(err))
    );
    res.status(500).json({ error: "Internal server error" });
  }
});

// Создать новую запись посещаемости
app.post("/attendance", async (req, res) => {
  const { employeeId, date, hours } = req.body;

  try {
    const result = await pool.query(
      "INSERT INTO attendance (employee_id, date, hours) VALUES ($1, $2, $3) RETURNING *",
      [employeeId, date, hours]
    );

    logger.info(
      `Attendance recorded: employeeId=${employeeId}, date=${date}, hours=${hours}`
    );
    res.status(201).json(result.rows[0]);

    await sendToQueue({
      employee_id: employeeId,
      date,
      hours,
    });
  } catch (err) {
    logger.error(
      "Error creating attendance record: " +
        (err instanceof Error ? err.message : String(err))
    );
    res.status(500).json({ error: "Internal server error" });
  }
});

app.listen(port, () => {
  logger.info(`Attendance service running on port ${port}`);
});

export default app;
