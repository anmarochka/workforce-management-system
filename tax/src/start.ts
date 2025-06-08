import express from "express";
import dotenv from "dotenv";
import { pool } from "./db";
import { metricsHandler, metricsMiddleware } from "./metrics";

dotenv.config();

const app = express();
const port = process.env.PORT || 3004;

app.use(express.json());
app.use(metricsMiddleware);

app.get("/ping", (_req, res) => res.send("pong"));
app.get("/health", (_req, res) => res.json({ status: "ok" }));
app.get("/metrics", metricsHandler);

app.get("/tax", async (_req, res) => {
  try {
    const result = await pool.query("SELECT * FROM tax");
    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

if (require.main === module) {
  app.listen(port, () => {
    console.log(`Tax service running on port ${port}`);
  });
}

export default app;
